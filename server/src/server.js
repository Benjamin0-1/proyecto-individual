const express = require("express");
const router = require("./routes"); // para las rutas
const morgan = require("morgan");
const cors = require("cors");

const server = express();

server.use(morgan("dev"));
server.use(express.json());
server.use(cors());

server.use(router);

server.use('/', router);

module.exports = server;


