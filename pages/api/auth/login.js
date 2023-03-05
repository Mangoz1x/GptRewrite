import { Parse } from "../../../helpers/parse";
import db from "../../../mongo/interact";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { encrypt } from "../../../helpers/decrypt";
import { setCookie } from "cookies-next";

const Handler = async (req, res) => {
    const { body, headers } = req;

    const { password, email } = Parse(body);
    if (!(password || email))
        return res.status(400).json({ error: "Please fill in all fields" });

    const userAgent = headers["user-agent"];
    const date = new Date().getTime();
  
    // Generating Secure Token
    const decryptedTokenId = crypto.randomBytes(64).toString('hex');
    const { key, encrypted } = encrypt(decryptedTokenId);    
    
    const encryptedToken = encrypt(decryptedTokenId, process.env.ENCRYPTION_KEY);

    const checkEmail = await db.findOne({ email }, "GPTRewrite", "users");
    if (!checkEmail)
        return res.status(400).json({ error: "Incorrect email or password" });

    const comparePwd = bcrypt.compareSync(password, checkEmail.password);
    if (!comparePwd)
        return res.status(400).json({ error: "Incorrect email or password" });

    const response = await db.updateOne({ uuid: checkEmail.uuid }, { $set: {
        logins: [...(checkEmail?.logins || []), {
            lastToken: checkEmail.token,
            attemptDate: date,
            attemptAgent: userAgent 
        }],
        token: encryptedToken.encrypted,
    }}, "GPTRewrite", "users");

    if (response.acknowledged == true) {
        setCookie("token", encrypted, { secure: true, httpOnly: true, req, res });
        setCookie("uuid", checkEmail.uuid, { secure: true, httpOnly: true, req, res });
        setCookie("key", key, { secure: true, httpOnly: true, req, res });
        return res.status(400).json({ status: "ok" });
    }

    if (response.error) 
        return res.status(400).json({ error: response.error });

    return res.status(400).json({ status: "unkown error" });
};

export default Handler;