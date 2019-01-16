"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _pg = _interopRequireDefault(require("pg"));

var _cors = _interopRequireDefault(require("cors"));

var _debug = _interopRequireDefault(require("./debug"));

var _garages = _interopRequireDefault(require("./garages"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Imports Dependencies
//Set PostGres defualt options
_pg.default.defaults.ssl = true; //Declare application variable for express

var app = (0, _express.default)(); //Enables Cross Origin Requests (CORS) support

app.use((0, _cors.default)()); // view engine setup

app.set('views', _path.default.join(__dirname, 'views'));
app.set('view engine', 'jade'); //app.use(require("morgan")("dev")); //Logger for Web

app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: false
}));
app.use(_express.default.static(_path.default.join(__dirname, 'public'))); //ONLY IN DEVELOPMENT NOT TO BE IN FINAL PRODUCT

app.use("/debug", _debug.default); //Production Endpoints

app.use("/garages", _garages.default);
app.get("/", function (req, res) {
  res.send("Spotme API running");
}); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  res.status(404);
  res.send("404 File Not Found");
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render('error');
});
var _default = app;
exports.default = _default;