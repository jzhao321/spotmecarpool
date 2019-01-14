//Imports Dependencies
var express = require('express');
var path = require('path');
var app = express();
var pg = require("pg");
pg.defaults.ssl = true;

//Enables Cross Origin Requests (CORS) support
app.use(require("cors")());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(require("morgan")("dev")); //Logger for Web
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

//Debug Endpoints NOT TO BE IN FINAL PRODUCT
var debug = require("./routes/debug.js");
app.use("/debug", debug);

//Product Endpoints
var garages = require("./routes/garages.js");
app.use("/garages", garages);

app.get("/", (req, res) => {
    res.send("Spotme API running");
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);
  res.send("404 File Not Found");
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
