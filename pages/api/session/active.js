import db from "../../../mongo/interact";
import { decrypt } from "../../../helpers/decrypt";
import { getCookies } from "cookies-next";

const Handler = async (req, res) => {
    const { uuid, token, key } = getCookies({ req, res });

    if (!(uuid || token || key)) 
        return res.status(400).json({ session: "inactive" });

        
    const query = await db.findOne({ uuid }, "GPTRewrite", "users");
    if (!query) return res.status(400).json({ session: "inactive" });
    const decryptedToken = decrypt(token, key);

    if (decrypt(query.token, process.env.ENCRYPTION_KEY) === decryptedToken)
        return res.status(200).json({ session: "active", ytmp4: query?.access?.includes("ytmp4") ? true : false, avatar: query?.avatar || null, subscription: query?.subscription || null });

    return res.status(400).json({ session: "inactive" });
};

export default Handler;