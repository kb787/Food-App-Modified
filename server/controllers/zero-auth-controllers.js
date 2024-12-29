const facebookAuthModel = require("../models/facebook-auth-model");

const handleFacebookLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;
    const response = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    const { id, name, email, picture } = response.data;
    let user = await facebookAuthModel.findOne({ email });
    if (!user) {
      user = await facebookAuthModel.create({
        facebook_id: id,
        email: email,
        name: name,
        image: picture.data.url,
      });
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res
        .status(201)
        .json({
          message: "Successfully created facebook user",
          data: token,
          success: true,
        });
    } else {
      res.status(200).json({ message: "User already exists", success: true });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: `Authentication failed due to error ${error}`,
        success: false,
      });
  }
};

const express = require("express");
const zeroAuthRouter = express.Router();
zeroAuthRouter.post("/facebook-auth", handleFacebookLogin);

module.exports = { zeroAuthRouter };
