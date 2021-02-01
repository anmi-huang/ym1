const express = require('express');
const router = express.Router();
const db = require("../db");
const adminGuard = require("../middleware/admin-guard");


// 產品詳情路由
router.get('/show/:pid', function (req, res, next) {
    // 渲染 product/show.ejs
    res.render('product/show');
});

//只有管理者才能通過路由
adminGuard(router);

// 建立產品路由
router.get('/create', function (req, res, next) {
    //此函數將會在使用者造訪 /product/create 時觸發
    console.log('[有人造訪產品頁面]')
    // 渲染 views/product/create.ejs
    res.render('product/create');
});

// 編輯產品路由
//next進行下一步
router.get('/edit/:pid', async function (req, res, next) {
    const pid = req.params.pid;
    console.log("產品ID", pid);
    //從productList集合取得pid的文件
    const doc = await db.doc(`productList/${pid}`).get()
    const product = doc.data();
    product.id = doc.id;
    console.log("產品", product);
    //傳遞product給模板使用
    res.locals.product = product;
    // 渲染 product/edit.ejs
    res.render('product/edit');


});

module.exports = router;
