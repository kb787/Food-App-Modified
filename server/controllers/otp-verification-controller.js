const { Resend } = require("resend");
const dotenv = require("dotenv");
const verificationModel = require("../models/verification-model");
const authModel = require("../models/auth-model");
const nodemailer = require("nodemailer");
const bcryptjs = require("bcryptjs");

dotenv.config();

const sender_email = process.env.my_email;
const sender_app_password = process.env.app_password;
const resend_key = process.env.resend_api_key;
const nodemailer_host = process.env.nodemailer_host;
const resend_object = new Resend(resend_key);
const nodemailer_port = process.env.nodemailer_port;
const email_host = process.env.email_host;
const sender_account_password = process.env.my_account_password;

const handleForgotPassword = async (req, res) => {
  try {
    const { userEmail, verificationCode } = req.body;
    const oldUser = await verificationModel.findOne({
      userEmail,
      verificationCode,
    });
    if (!oldUser) {
      return res.json({
        message: "No such user exists",
        status: 404,
        success: false,
      });
    } else {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - oldUser.expiresIn;
      if (timeDifference < 0) {
        return res.json({
          message: "Token expired cannot change password",
          status: 409,
          success: false,
        });
      } else {
        const prevUser = await authModel.findOne({ userEmail });
        if (!prevUser) {
          return res.json({
            message: "No such user exists",
            status: 404,
            success: false,
          });
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(req.body.userPassword, salt);
        prevUser.userPassword = hashedPassword;
        await prevUser.save();
        return res.json({
          message: "Password changed successfully",
          status: 201,
          success: true,
        });
      }
    }
  } catch (error) {
    return res.json({
      message: `Unable to process your request due to error ${error}`,
      status: 500,
      success: false,
    });
  }
};

const handleEmailSending = async (req, res) => {
  const { userEmail } = req.body;
  try {
    const validUser = authModel.findOne({ userEmail });
    if (!validUser) {
      return res.json({
        message: "Your account does not exists do the authentication",
        status: 404,
        success: true,
      });
    }
    const passcodeGenerate = Math.floor(Math.random() * 10000 + 1);
    const otpExpiryTime = new Date().getTime() + 300 * 1000;
    await verificationModel.create({
      userEmail: userEmail,
      verificationCode: passcodeGenerate,
      expiresIn: otpExpiryTime,
    });
    const transporter = nodemailer.createTransport({
      // host: nodemailer_host,
      host: email_host,
      port: nodemailer_port,
      secure: false,
      auth: {
        user: sender_email,
        pass: sender_app_password,
      },
    });

    await transporter.sendMail({
      from: sender_email,
      to: userEmail,
      subject: `OTP for password change`,
      text: `Do not disclose this otp password with anyone`,
      html: `The passcode for changing OTP is ${passcodeGenerate}`,
    });
    return res.json({
      message: "Sent email successfully",
      status: 201,
      success: true,
    });
  } catch (error) {
    return res.json({
      message: `Unable to process your request due to error ${error}`,
      status: 500,
      success: false,
    });
  }
};

const express = require("express");
const emailSendingRouter = express.Router();
const forgotPasswordRouter = express.Router();

emailSendingRouter.post("/verification/send-email", handleEmailSending);
forgotPasswordRouter.post(
  "/verification/change-password",
  handleForgotPassword
);

module.exports = {
  emailSendingRouter: emailSendingRouter,
  forgotPasswordRouter: forgotPasswordRouter,
};
