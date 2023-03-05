import { Parse } from "../../../helpers/parse";
import { v4 as uuidv4 } from "uuid";
import db from "../../../mongo/interact";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { encrypt } from "../../../helpers/decrypt";
import { setCookie } from "cookies-next";
import { generateFromString } from 'generate-avatar'
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';


const Handler = async (req, res) => {
  const nameGeneratorConfig = {
    dictionaries: [adjectives, colors, animals],
    separator: '',
    seed: uuidv4(),
    style: 'capital'
  };

  const { body, headers } = req;
  
  const { password, email } = Parse(body);
  if (!(password || email)) 
    return res.status(400).json({ error: "Please fill in all fields" });
  
  const userAgent = headers["user-agent"];
  const date = new Date().getTime();
  const uuid = uuidv4();

  // Generating Secure Token
  const decryptedTokenId = crypto.randomBytes(64).toString('hex');
  const { key, encrypted } = encrypt(decryptedTokenId);    

  const checkEmail = await db.findOne({ email }, "GPTRewrite", "users");
  if (checkEmail) 
    return res.status(400).json({ error: "This email is already in use" });

  const encryptedPwd = bcrypt.hashSync(password, 10);
  if (!encryptedPwd || encryptedPwd?.err || encryptedPwd?.error) 
    return res.status(400).json({ error: "Password could not be hashed" });

  // Generate an avatar
  const svgAvatar = generateFromString(uuidv4());
  const nickname = uniqueNamesGenerator(nameGeneratorConfig)

  const encryptedToken = encrypt(decryptedTokenId, process.env.ENCRYPTION_KEY);
  const response = await db.insertOne({
    signup: {
      agent: userAgent,
      date: date
    },
    token: encryptedToken.encrypted,
    password: encryptedPwd,
    uuid: uuid,
    email: email,
    status: "enabled",
    access: [],
    avatar: svgAvatar,
    stripeCustomer: null,
    subscription: null,
    subscriptionId: null,
    nickname: nickname,
    usageLimit: {
      rewrite: {
        used: 0,
        given: 20 
      }
    }
  }, "GPTRewrite", "users");

  if (response.acknowledged == true) {
    setCookie("token", encrypted, { secure: true, httpOnly: true, req, res });
    setCookie("uuid", uuid, { secure: true, httpOnly: true, req, res });
    setCookie("key", key, { secure: true, httpOnly: true, req, res });
    return res.status(400).json({ status: "ok" });
  }
  
  return res.status(400).json({ response: response });
};

export default Handler;