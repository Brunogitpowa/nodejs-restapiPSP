const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Cargar rutas
const hello_routes = require("./routes/hello");
const task_routes = require("./routes/task");
const user_routes = require("./routes/user");

//Rutas Base
app.use("/api", hello_routes);
app.use("/api", task_routes);
app.use("/api", user_routes);

module.exports = app;