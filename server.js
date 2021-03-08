const cors = require("cors");
const express = require("express");
const app = express();
const mongoose = require('mongoose');

global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:8080"
};

var dbUrl = "mongodb+srv://camille:P@ssw0rd@vmo-ezloan.phft3.mongodb.net/vmo-ezloan?retryWrites=true&w=majority";
/**
 * Connect to MongoDB.
 */
const readLine = require('readline');

const connect = () => {
  setTimeout(() => mongoose.connect(dbUrl, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }), 1000);
}

mongoose.connection.on('connected', () => {
  console.log('connected');
});

mongoose.connection.on('error', err => {
  console.log('error: ' + err);
  return connect();
});

mongoose.connection.on('disconnected', () => {
  console.log('disconnected');
});

if (process.platform === 'win32') {
  const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on('SIGINT', () => {
    process.emit("SIGINT");
  });
}

const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
  });
};

process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});
process.on('SIGTERM', () => {
  gracefulShutdown('Heroku app shutdown', () => {
    process.exit(0);
  });
});

connect();

app.use(cors(corsOptions));

const initRoutes = require("./src/routes");

app.use(express.urlencoded({
  extended: true
}));
initRoutes(app);

// let port = 8080;
app.listen(process.env.PORT || 80);