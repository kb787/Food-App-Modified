const mongoose = require("mongoose");
const facebookAuthSchema = mongoose.Schema({
  facebook_id: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    unique: true,
  },
  image: {
    type: String,
  },
});

let facebookAuthModel;
if (mongoose.models.fbauths) {
  facebookAuthModel = mongoose.model("fbauths");
}

facebookAuthModel = mongoose.model("fbauths", facebookAuthSchema);
module.exports = facebookAuthModel;
