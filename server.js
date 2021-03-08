const cors = require("cors");
const express = require("express");
const app = express();

global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

const initRoutes = require("./src/routes");

app.use(express.urlencoded({
  extended: true
}));
initRoutes(app);

// let port = 8080;
app.listen(process.env.PORT || 80);