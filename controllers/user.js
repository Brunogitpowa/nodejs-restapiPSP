const fs = require("fs");
const path = require("path");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const jwt = require("../services/jwt");


async function register(req, res) {
    const user = new User(req.body);
    const { email, password } = req.body;

    try{

        if(!email) throw { msg: "El email es obligatorio" };
        if(!password) throw { msg: "El password es obligatorio" };

        //Revisamos si el email esta repetido
        const foundEmail = await User.findOne({email: email})
        if(foundEmail) throw { msg: "El email esta en uso" };

        const salt = bcryptjs.genSaltSync(10);
        user.password = await bcryptjs.hash(password, salt);
        user.save()

        res.status(200).send(user);

    } catch (error) {
        res.status(500).send(error);
    }
}


async function login( req, res) {
    const { email, password } = req.body;
    

    try {
       
        //Comprobamos el Email
        const user = await User.findOne({ email });
        if(!user) throw { msg: "ERROR en el Email " }
        
        //comprobamos la contraseña
        const passwordSucces = await bcryptjs.compare(password, user.password);
        if(!passwordSucces) throw { msg: "ERROR en Contraseña" };

        
        res.status(200).send({ token: jwt.createToken(user, "12h")});
        
    } catch (error) {
        res.status(500).send(error);
    }
}


function protected(req, res) {
    res.status(200).send({ msg: "Contenido del ENDPOINT protegido"});
}


function uploadAvatar(req, res) {
    const params = req.params;

    User.findById({ _id: params.id }, (err, userData) => {
        if(err) {
            res.status(500).send({ msg: "Error del servidor" });
        } else {
            if(!userData) {
                res.status(404).send({ msg: "No se ha encontrado el usuario" });
            } else {
                let user = user.userData;

                if (req.files) {
                    const filesPath = req.files.avatar.path;
                    const fileSplit = filePath.split("/");
                    const fileName = fileSplit[1];
                    
                    const extSplit = fileName.split(".");
                    const fileExt = extSplit[1];

                    if (fileExt !== "png" && fileExt !== "jpg") {
                        res.status(400).send({ msg: "La extension de la imagen no es valida" });
                    } else {
                        user.avatar = fileName;

                        User.findByIdAndUpdate({ _id: params.id }, user, (err, userResult) => {
                            if (err) {
                                res.status(500).send({ msg: "Error en el servidor" });
                            } else {
                                if (!userResult) {
                                    res.status(404).send({ msg: "El usuario no se ha encontrado"});
                                } else {
                                    res.status(200).send({ msg: "Avatar actualizado"});
                                }
                            }
                        })
                    }
                }
            }
        }
    })
}

function getAvatar(req, res) {
    const { avatarName } = req.params;
    const filePath = "./uploads/" + avatarName;
    
    fs.stat(filePath, (err, stat) => {
        if (err) {
            res.status(404).send({ msg: "El avatar no existe"});
        } else {
            res.sendFile(path.resolve(filePath));
        }
    }); 
}

module.exports = {
    register,
    login,
    protected,
    uploadAvatar,
    getAvatar,
};