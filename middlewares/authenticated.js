const moment = require("moment");
const jwt = require("../services/jwt");

const SECRET_KEY = "sdfshdASDA4656ghdgd45";

function ensureAuth(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(403).send({ msg: "La peticion no tiene la cabecera de autentificacion" });

    }

    const token = req.headers.authorization.replace(/['"]+/g, "");
    
    const payload = jwt.decodeToken(token, SECRET_KEY);
    
    try {
        
        
        if (payload.exp <= moment().unix()) {
            return res.status(400).send({ msg: "El token ha expirado"});
        }

    } catch (error) {
        return res.status(400).send({ msg: "Token invalido" });
    }

    req.user = payload;
    next();

}

module.exports = {
    ensureAuth,
};