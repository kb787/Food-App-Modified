const mongoose = require("mongoose");

const cookieSchema = mongoose.Schema({
  userName: {
    type: String,
  },
  userEmail: {
    type: String,
  },
});

let cookieModel;
if (mongoose.models.cookies) {
  cookieModel = mongoose.model("cookies");
}

cookieModel = mongoose.model("cookies", cookieSchema);
module.exports = cookieModel;
