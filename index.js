const mongoose = require("mongoose");
const app = require("./app");
const port = 3977;
const urlMongoDB = "mongodb+srv://erbrunete:adarab0unty@brunodb.rhcvbuy.mongodb.net/mydb";


mongoose.connect(
    urlMongoDB,
    {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    },)
    .then (() => console.log('Connected Successfully'))
    .catch((err) => {console.error(err);
    });
    
app.listen(port, () => {
        console.log(
            "Servidor del API REST esta funcionando en http://localhost:3977"
        );
    });

 
