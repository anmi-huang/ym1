const express = require('express');
const moment = require('moment');
const axios = require('axios');
const router = express.Router();
const db = require("../db");
const admin = require("../firebase");


// 登入
router.post('/login', function (req, res, next) {
    console.log('[準備登入]');
    //console.log('[前端送來的資料]', req.body);
    // Create session cookie
    // https://firebase.google.com/docs/auth/admin/manage-cookies#create_session_cookie
    // TODO: 取得前端傳來的使用者 idToken
    const idToken = req.body.idToken;
    // console.log('[前端傳來的idToken]', idToken);
    // 有效期間
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    // 建立 Session Cookie
    admin.auth().createSessionCookie(idToken, { expiresIn })
        .then(sessionCookie => {
            console.log('[sessionCookie]', sessionCookie);
            //設定Cookie選項
            const options = { maxAge: expiresIn, httpOnly: true };
            //設定Cookie名稱
            const cookieName = req.app.locals.cookieName;
            console.log('[cookieName]', cookieName);
            //將Cookie存到瀏覽器
            res.cookie(cookieName, sessionCookie, options)
            //回應前端
            res.status(200).json({ msg: '成功登入' })

        })
        .catch(err => {
            console.log('[err]', err);
            res.status(401).json({ msg: '授權失敗' })
        });
});

// 登出
router.post('/logout', function (req, res, next) {
    // Sign Out
    // https://firebase.google.com/docs/auth/admin/manage-cookies#sign_out
    const cookieName = req.app.locals.cookieName;
    const sessionCookie = req.cookies[cookieName] || '';
    //將瀏覽器上的cookieName移除
    res.clearCookie(cookieName);
    admin.auth().verifySessionCookie(sessionCookie)
        .then(user => {
            const uid = user.uid;
            //註銷登入
            admin.auth().revokeRefreshTokens(uid);
            res.status(200).json({ msg: '登出' });
        })
        .catch(err => {
            res.status(200).json({ msg: 'Logout' })
        });
});

// 新增商品
router.post('/product/create', function (req, res, next) {
    console.log('[準備新增商品]');
    console.log('[前端送來的資料]', req.body);
    // Add a document
    // https://firebase.google.com/docs/firestore/manage-data/add-data#add_a_document
    const product = req.body;
    db.collection("productList").add(product)
        .then(response => {
            //回應前端工作完成
            //200是成功
            res.status(200).json({
                msg: "新增商品成功",
                product: product,
                dbResponse: response
            });
        })
        .catch(err => {
            //有問題
            res.status(500).json({
                msg: "後端壞了",
                err: err

            });

        });

});

// 更新商品
router.put('/product/:pid', function (req, res, next) {
    console.log('[準備更新商品]');
    console.log('[前端送來的資料]', req.body);
    console.log('[pid]', req.params.pid);
    const pid = req.params.pid;
    const product = req.body;
    db
        .doc(`productList/${pid}`)
        .update(product)
        .then(() => {
            res.status(200).json({
                msg: '更新成功'
            });
        })
        .catch(err => {
            res.status(500).json({ err: err });
        });

});

// 刪除商品
router.delete('/product/:pid', function (req, res, next) {
    console.log('[準備刪除商品]');
    console.log('[pid]', req.params.pid);
    const pid = req.params.pid;
    db
        .doc(`productList/${pid}`)
        .delete()
        .then(() => {
            res.status(200).json({
                msg: '移除成功'
            });
        })
        .catch(err => {
            res.status(500).json({ err: err });
        });

});
module.exports = router;
