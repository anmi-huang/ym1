// 設置管理者路由守衛
function adminGuard(router) {
    router.use(function (req, res, next) {
        // TODO: 管理員驗證路由守衛
        const auth = res.locals.auth;
        if (auth.isAdmin) {
            next();
        } else {
            //強制回首頁
            res.redirect('/');
        }
    });
}

module.exports = adminGuard;