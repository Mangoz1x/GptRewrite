import db from "../../../mongo/interact";
import { decrypt } from "../../../helpers/decrypt";
import { Parse } from "../../../helpers/parse";
import { getCookies } from "cookies-next";

const Module = async (req, res) => {
    const body = Parse(req.body);
    const { key, uuid, token } = getCookies({ req, res });

    const user = await db.findOne({ uuid }, "PublicModelLibrary", "users");
    
    if (!user) 
        return res.status(500).json({ error: `Invalid user credentials [uuid]` });
    
    if (decrypt(user.token, process.env.ENCRYPTION_KEY) !== decrypt(token, key)) 
        return res.status(500).json({ error: `Session expired` });
    
    if (user.admin !== "true") 
        return res.status(500).json({ error: `This action requires admin roles` });

    const { action, params } = body;
    if (!(action || params))
        return res.status(500).json({ error: `Invalid AdminDB Parameters` });

    const query = await db[action](...params);
    return res.status(200).json(query);
}

export default Module;