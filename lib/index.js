"use strict";

var _http = _interopRequireDefault(require("http"));

var _express = _interopRequireDefault(require("express"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _pg = _interopRequireDefault(require("pg"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var app = (0, _express.default)();
app.use(_bodyParser.default.json());
app.use(_bodyParser.default.urlencoded({
  extended: true
}));
_pg.default.defaults.ssl = true;
var seq = new _sequelize.default("postgres://bmsnyakizhvtiv:9ca4b6e65fd79862767d73971fdbf0da9d1de25422281b63e8a7ca8214e72c9b@ec2-54-163-234-88.compute-1.amazonaws.com:5432/delahu46rivvsb", {
  ssl: true
});
var emailModel = seq.define("registrations", {
  firstName: _sequelize.default.STRING,
  lastName: _sequelize.default.STRING,
  email: _sequelize.default.STRING,
  phoneNumber: _sequelize.default.BIGINT,
  password: _sequelize.default.STRING
});
app.get("/createTable", function (req, res) {
  emailModel.sync().then(function () {
    res.send("Table created successfully");
  }).catch(function (error) {
    res.send(error);
  });
}); //get returns email and phone number given first & last name 

app.get('/getData', function (req, res) {
  emailModel.findOne({
    where: {
      firstName: req.params.firstName,
      lastName: req.params.lastName
    },
    attributes: {
      include: ["email", "phoneNumber", "password"],
      exclude: ["firstName", "lastName", "id", "createdAt", "updatedAt"]
    }
  }).then(function (user) {
    res.send(user);
  });
}); //post a user to database

app.post('/createAccount', function (req, res) {
  var email = req.body.email;
  var phone = req.body.phoneNumber;
  var fName = req.body.firstName;
  var lName = req.body.lastName;
  var pass = req.body.password; //check if any attributes are null

  if (email && fName && lName && phone && pass) {
    //check if valid phone number
    if (phone.length != 10 || !_typeof(phone) === 'bigint') {
      res.send("Invalid phone number");
    } //check if valid email
    else if (email.substring(email.length - 9, email.length) != "@sjsu.edu") {
        res.send("Invalid email");
      } //if both phone number and email are valid create new emailModel
      else {
          emailModel.findOrCreate({
            where: {
              email: email
            },
            defaults: {
              firstName: fName,
              lastName: lName,
              email: email,
              phoneNumber: phone,
              password: pass
            }
          }).then(function (result) {
            res.send(result);
          });
        }
  } else res.send("Error");
});
app.post("/loginValidation", function (req, res) {
  emailModel.findOne({
    where: {
      email: req.body.email
    }
  }).then(function (result) {
    if (result) {
      if (req.body.password === result.password) {
        res.send("Successfully logged in");
      } else {
        res.send("Error Logging In");
      }
    } else {
      res.send("Error Logging In");
    }
  });
});
app.listen(3000);