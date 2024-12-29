const handleCreateCookie = require("../helpers/cookie-creation");
const productModel = require("../models/products-model");

const handleDisplayWithoutFilter = async (req, res) => {
  try {
    const response = await productModel.find();
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.json({
      message: `Unable to get the response due to error ${error}`,
      status: 500,
    });
  }
};

const handleDisplayWithChoosenCriteria = async (req, res) => {
  try {
    const { productRate, productType, productName } = req.query;
    let filteredProducts;
    const generalData = await productModel.find();
    if (productRate) {
      filteredProducts = generalData.filter(
        ((product) => product.productRate < productRate) ||
          ((product) => product.productRate === productRate)
      );
    }
    if (productType) {
      filteredProducts = generalData.filter(
        (product) => product.productType === productType
      );
    }
    if (productName) {
      filteredProducts = generalData.filter(
        (product) => product.productName === productName
      );
    }
    if (!filteredProducts) {
      return res.json({ message: "No products found", status: 404 });
    } else {
      return res.send(filteredProducts);
    }
  } catch (error) {
    return res.json({
      message: `Unable to get the response due to error ${error}`,
      status: 500,
    });
  }
};

const handleSearching = async (req, res) => {
  const { productName, productRate, productType, page } = req.query;
  try {
    const productAllTypes = ["Veg", "Non-Veg"];
    const productRateFilter = productRate || 400;
    const productTypeFilter = productType || "veg";
    const productNameFilter = productName || "";
    const page = req.query.page - 1 || 0;
    const limit = 12;

    const searchResponse = await productModel
      .find({
        $and: [
          ({ productName: { $regex: productNameFilter, $options: "i" } },
          { productType: { $in: productTypeFilter } },
          { productRate: { $lt: productRateFilter } }),
        ],
      })
      .skip(page * limit)
      .limit(limit);
    return res.json(searchResponse);
  } catch (error) {
    console.log(`Unable to process your request due to error ${error}`);
  }
};

const handlePagination = async (req, res) => {
  try {
    const page = req.query.page - 1 || 0;
    const limit = 7;

    const paginatedResponse = await productModel
      .find()
      .skip(page * limit)
      .limit(limit);
    return res.json(paginatedResponse);
  } catch (error) {
    return res.json({
      message: `Unable to process your request due to error ${error}`,
      status: 500,
    });
  }
};

const express = require("express");
const generalRouter = express.Router();
const categoryRouter = express.Router();
const paginationRouter = express.Router();
const searchRouter = express.Router();
generalRouter.get("/product/display-all", handleDisplayWithoutFilter);
categoryRouter.get(
  "/product/display-category",
  handleDisplayWithChoosenCriteria
);
paginationRouter.get("/product/show-product", handlePagination);
searchRouter.get("/product/search-product", handleSearching);

module.exports = {
  generalRouter: generalRouter,
  categoryRouter: categoryRouter,
  paginationRouter: paginationRouter,
  searchRouter: searchRouter,
};
