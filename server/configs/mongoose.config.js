const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.ATLAS_URI;
mongoose
  .connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((res) => console.log("Established Connection To MongoDB"))
  .catch((err) => console.log("Failed To Connect To DB", err));
