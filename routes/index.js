const express = require('express');
const router = express.Router();
const db = require("../db");
const loginChecker = require("../middleware/login-checker");

//進入登入檢查站
loginChecker(router);

// 首頁路由
router.get('/', async function (req, res, next) {
  // TODO: 取得產品列表
  const collection = await db
    .collection("productList")
    .orderBy("createdAt", "desc")
    .get();
  //預設產品資料
  const productList = [];
  //把集合內物件取出
  collection.forEach(doc => {
    const product = doc.data();
    //把文件id存到物件內
    product.id = doc.id;
    productList.push(product);
  });
  console.log("[產品列表]", productList);
  // 將產品列表傳遞到模板
  res.locals.productList = productList;
  res.render('index');
});

module.exports = router;
