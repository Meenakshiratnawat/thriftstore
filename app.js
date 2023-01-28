require('dotenv').config()

const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
//routes
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js");

//db conncetion
mongoose
.connect(process.env.Database,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//my routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);

//port
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`app is running at ${port}`);

});
