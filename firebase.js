// 初始化firebase
// FIREBASE NODE.JS初始化文件
// https://firebase.google.com/docs/admin/setup
const admin = require("firebase-admin");

// TODO: 初始化FIREBASE
//引用金鑰

const serviceAccount = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
//輸出admin讓其他可以用
module.exports = admin;