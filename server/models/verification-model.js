const mongoose = require("mongoose");

const verificationSchema = mongoose.Schema({
  userEmail: {
    type: String,
  },
  verificationCode: {
    type: String,
  },
  expiresIn: {
    type: Number,
  },
});

let verificationModel;
if (mongoose.models.verifications) {
  verificationModel = mongoose.model("verifications");
}

verificationModel = mongoose.model("verifications", verificationSchema);
module.exports = verificationModel;
