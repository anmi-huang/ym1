const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// 取得路由資源
const indexRouter = require('./routes/index');
const productRouter = require('./routes/product');
const apiRouter = require('./routes/api');

// 設定應用程式
const app = express();

// 定義視圖引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 設定前端資源路由 / => 可指向public資料夾內的資源
app.use(express.static(path.join(__dirname, 'public')));
// 設定前端資源路由 /assets/ => 可指向assets資料夾內的資源
app.use('/assets', express.static(path.join(__dirname, 'assets')));
// 設定前端資源路由 /node_modules/ => node_modules
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
// 設定Cookie名稱
app.locals.cookieName = 'example-cookie';
//如果瀏覽器對 / 下了請求 指派分配indexRouter處理相關邏輯
app.use('/', indexRouter);
//如果瀏覽器對 /product 下了請求 指派分配indexRouter處理相關邏輯
app.use('/product', productRouter);
//如果瀏覽器對 /api 下了請求 指派分配indexRouter處理相關邏輯
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

});

module.exports = app;
