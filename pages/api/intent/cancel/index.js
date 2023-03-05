import db from "../../../../mongo/interact";
import { decrypt } from "../../../../helpers/decrypt";
import { getCookies } from "cookies-next";
import gateway from "stripe";
import bcrypt from "bcrypt";

const stripe = gateway(process.env.STRIPE_KEY);

const Module = async (req, res) => {
    try {
        const password = req.body;
        const { key, uuid, token } = getCookies({ req, res });
    
        let user = await db.findOne({ uuid }, "GPTRewrite", "users");
        if (!user) return res.status(500).json({ error: `User not found` });
    
        if (decrypt(user?.token, process.env.ENCRYPTION_KEY) !== decrypt(token, key))
            return res.status(500).json({ error: `Session expired` });
    
        if (user?.status == "disabled")
            return res.status(500).json({ error: `You're account has been disabled` });

        if (!['basic', 'pro', 'expert'].includes(user?.subscription))
            return res.status(500).json({ error: `You do not have any active subscriptions` });

        const comparePwd = bcrypt.compareSync(password, user.password);
        if (!comparePwd)
            return res.status(500).json({ error: `The password you have entered is incorrect` });


        try {
            await stripe.subscriptions.del(user?.subscriptionId);
        } catch (err) {
            return res.status(500).json({ error: `You do not have any active subscription.` });
        }

        await db.updateOne({ uuid }, { $set: {
            usageLimit: {
                rewrite: {
                    given: 20,
                    used: 0
                }
            },
            subscription: null,
            subscriptionId: null
        }}, "GPTRewrite", "users");

        return res.status(200).json({ canceled: true });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export default Module;