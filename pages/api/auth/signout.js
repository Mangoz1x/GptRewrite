import { deleteCookie } from "cookies-next";

const Handler = (req, res) => {
    deleteCookie('uuid', { req, res });
    deleteCookie('token', { req, res });
    deleteCookie('key', { req, res });

    return res.redirect(307, '/');
};

export default Handler;