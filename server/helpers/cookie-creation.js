const cookieModel = require("../models/cookie-model");

const handleCreateCookie = async (userName, userEmail) => {
  const cookieObject = await cookieModel.create({
    userName: userName,
    userEmail: userEmail,
  });
  return cookieObject;
};

module.exports = handleCreateCookie;
