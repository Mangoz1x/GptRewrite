import db from "../../../mongo/interact";
import { decrypt, encrypt } from "../../../helpers/decrypt";
import { Parse } from "../../../helpers/parse";
import { getCookies } from "cookies-next";
import data from "../../../data.json";
const { Configuration, OpenAIApi, Completion } = require("openai");

const key = process.env.GPT_KEY;
const configuration = new Configuration({
    apiKey: key,
});

const openai = new OpenAIApi(configuration);

const Module = async (req, res) => {
    try {
        const body = Parse(req.body);
        const { key, uuid, token } = getCookies({ req, res });
    
        let user = await db.findOne({ uuid }, "GPTRewrite", "users");
        if (!user) return res.status(500).json({ error: `User not found` });
    
        if (decrypt(user?.token, process.env.ENCRYPTION_KEY) !== decrypt(token, key))
            return res.status(500).json({ error: `Session expired` });
    
        if (user?.status == "disabled")
            return res.status(500).json({ error: `You're account has been disabled` });
    
        if (!user?.access?.includes("rewrite")) 
            return res.status(500).json({ error: `You're account does not have access to this feature yet` });

        if (!(user?.usageLimit || user?.usageLimit?.rewrite || user?.usageLimit?.rewrite?.used || user?.usageLimit?.rewrite?.given)) {
            await db.updateOne({ uuid: user.uuid }, { $set: { usageLimit: { rewrite: { used: 0, given: 20 }} }}, "GPTRewrite", "users");
            user.usageLimit = { rewrite: { used: 0, given: 20 }};
        }

        if (user.usageLimit.rewrite.used >= user.usageLimit.rewrite.given)
            return res.status(500).json({ error: `You have used all ${user.usageLimit.rewrite.given} credits, upgrade your plan for more.` });
        
        const { text, level, personality, wording } = body;
    
        if (!(
            data["writing-levels"].includes(level) ||
            data["writing-personalities"].includes(personality) ||
            data["writing-wording"].includes(wording)
        )) return res.status(500).json({ error: `The options you have selected are invalid` });
            
        const prompt = `
            Rephrase the following text in a way that isn't typical to AI, use ${wording} wording, as if you are a ${level} ${personality}.
            text: ${text.trim()}
    
            REPHRASED TEXT:
        `;
    
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
    
        const generated = response.data.choices?.[0]?.text;
        if (!generated) return res.status(500).json({ error: `There was an error generating the text` });
        
        const responseData = {
            prompt: prompt,
            options: {
                level,
                personality,
                wording
            },
            uuid: user.uuid,
            original: text, 
            generated: generated,
            tokens: response?.data?.usage?.total_tokens || 0,
            cost: ((response?.data?.usage?.total_tokens || 0) / 1000) * 0.02
        };

        await db.updateOne({ uuid: user.uuid }, { $set: { usageLimit: { rewrite: { used: (parseFloat(user?.usageLimit?.rewrite?.used) || 0)+1, given: user.usageLimit.rewrite.given || 20 } } } }, "GPTRewrite", "users");
        await db.insertOne(responseData, "GPTRewrite", "generations");

        return res.status(200).json({
            generated: responseData.generated,
            tokens: responseData.tokens
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export default Module;