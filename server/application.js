const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
dotenv.config();
const express_port_no = process.env.express_server_port_no;
const databaseConnection = require("./dbConfiguration");
const base_api_endpoint = process.env.base_api_endpoint;
const {
  signinRouter,
  signupRouter,
} = require("./controllers/auth-controllers");
const {
  emailSendingRouter,
  forgotPasswordRouter,
} = require("./controllers/otp-verification-controller");
const {
  generalRouter,
  categoryRouter,
  paginationRouter,
  searchRouter,
} = require("./controllers/products-display-Controller");

const { stripeRouter } = require("./controllers/stripe-controllers");
const { razorPayRouter } = require("./controllers/razorpay-controllers");
const { zeroAuthRouter } = require("./controllers/zero-auth-controllers");

const react_native_server = process.env.native_server_link;
const corsOptions = {
  origin: react_native_server,
};

databaseConnection();
app.use(express.json());
app.use(cors(corsOptions));
app.use(base_api_endpoint, signupRouter);
app.use(base_api_endpoint, signinRouter);
app.use(base_api_endpoint, emailSendingRouter);
app.use(base_api_endpoint, forgotPasswordRouter);
app.use(base_api_endpoint, generalRouter);
app.use(base_api_endpoint, categoryRouter);
app.use(base_api_endpoint, paginationRouter);
app.use(base_api_endpoint, searchRouter);
app.use(base_api_endpoint, stripeRouter);
app.use(base_api_endpoint, razorPayRouter);
app.use(base_api_endpoint, zeroAuthRouter);
app.get("/", (req, res) => {
  res.json({ message: `Application launched successfully` });
});

server.listen(express_port_no, () => {
  console.log(`Application running successfully on port no ${express_port_no}`);
});
