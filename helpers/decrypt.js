import crypto from "crypto";

const algorithm = "aes-256-cbc"; 
const IV_LENGTH = 16;

const decrypt = (text, key) => {
    const ENCRYPTION_KEY = key;

    let textParts = text.split(':');
    let decipher = crypto.createDecipheriv(algorithm, ENCRYPTION_KEY, textParts[0]);
    let decrypted = decipher.update(textParts[1], 'hex', 'utf8') + decipher.final('utf8');

    return decrypted;
};

const encrypt = (text, key) => {
    const ENCRYPTION_KEY = key || crypto.randomBytes(16).toString("hex");

    let iv = crypto.randomBytes(IV_LENGTH / 2).toString('hex');
    let cipher = crypto.createCipheriv(algorithm, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    
    return { 
        encrypted: iv + ':' + encrypted,
        key: ENCRYPTION_KEY
    };
}

export { decrypt, encrypt };