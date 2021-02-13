const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// routes
app.use(require("./routes/api.js"));


const dbUrl = process.env.DATABASE;
const host = process.env.HOST;
const options = {
  useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
  useFindAndModify: false
};

mongoose.connect(
  process.env.MONGODB_URI || `mongodb://${host}/${dbUrl}`,
  options
)
.then(() => {
	app.listen(PORT, function () {
		console.log('Node server is running...');
		console.log('Listening on port:', PORT);
	});
})
.catch((err) => {
	console.log(err);
});