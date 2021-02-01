const admin = require('../firebase');
const db = require('../db');

// 登入驗證關口
function loginChecker(router) {
    // Verify session cookie and check permissions
    // https://firebase.google.com/docs/auth/admin/manage-cookies#verify_session_cookie_and_check_permissions
    router.use(function (req, res, next) {
        console.log('[進入登入檢查站]');
        // TODO: 設計登入驗證關卡...
        // 取得使用者的sessionCookie,若沒有則設定為空字串
        const cookieName = req.app.locals.cookieName;
        //取得sessionCookie 若沒有記錄設定空字串
        const sessionCookie = req.cookies[cookieName] || '';
        console.log('[驗證sessionCookie]', sessionCookie);
        // 預設驗證狀態
        const auth = {
            isLogin: false,
            isAdmin: false,
            user: {}
        }
        admin.auth().verifySessionCookie(sessionCookie, true)
            .then(async user => {
                //sessionCookie有效
                console.log('[user]', user);
                auth.isLogin = true;
                auth.user = user;
                const email = user.email;
                const adminDoc = await db.doc(`adminList/${email}`).get();
                //如果文件存在
                if (adminDoc.exists) {
                    auth.isAdmin = true;
                }
                //驗證狀態傳到模板
                res.locals.auth = auth;
                //放行
                next();


            })
            .catch(err => {
                //sessionCookie無效
                console.log('[err]', err);
                res.locals.auth = auth;
                next();

            });

    });
}

module.exports = loginChecker;