const cookieModel = require("./cookie-model");

const handleValidateCookie = async (req, res, next) => {
  const { userName, userEmail } = req.body;
  try {
    const prevUser = await cookieModel.find({ userName });
    if (!prevUser) {
      return res.json({
        message: "No cookie exists do the authentication first",
        status: 409,
      });
    } else {
      next();
    }
  } catch (error) {
    return res.json({
      message: `Unable to fetch cookie due to error ${error}`,
      status: 500,
    });
  }
};

module.exports = handleValidateCookie;
