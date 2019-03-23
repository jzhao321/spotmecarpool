"use strict";

var _http = _interopRequireDefault(require("http"));

var _express = _interopRequireDefault(require("express"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _pg = _interopRequireDefault(require("pg"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  password: _sequelize.default.STRING,
  driver: _sequelize.default.BOOLEAN,
  carMake: _sequelize.default.STRING,
  carModel: _sequelize.default.STRING,
  carYear: _sequelize.default.INTEGER
});
app.get("/createTable", function (req, res) {
  emailModel.sync({
    force: true
  }).then(function () {
    res.send("Table created successfully");
  }).catch(function (error) {
    res.send(error);
  });
}); //get returns email and phone number given first & last name 

app.get('/getData', function (req, res) {
  emailModel.findOne({
    where: {
      //change to email
      firstName: req.params.firstName,
      lastName: req.params.lastName
    },
    attributes: {
      include: ["email", "password"],
      exclude: ["firstName", "lastName", "id", "createdAt", "updatedAt"]
    }
  }).then(function (user) {
    res.send(user);
  });
}); //post a user to database

app.post('/createAccount', function (req, res) {
  var email = req.body.email;
  var fName = req.body.firstName;
  var lName = req.body.lastName;
  var pass = req.body.password; //check if any attributes are null

  if (email && fName && lName && pass) {
    //check if valid email
    if (email.substring(email.length - 9, email.length) != "@sjsu.edu") {
      res.send("Invalid email");
    } //check password is at least 8 long and has one lowercase, uppercase,number and special char


    var passVer = true;
    var strong = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    if (!strong.test(pass)) passVer = false;

    if (!passVer) {
      res.send("Invalid password");
    } //if  password and email is valid create new emailModel
    else {
        email = email.substring(0, email.length - 9).replace(".", "") + email.substring(email.length - 9, email.length);

        for (var i = 0; i < email.length - 9; i++) {
          if (email.charAt(i) == '+') {
            email = email.substring(0, i) + email.substring(email.length - 9, email.length);
            break;
          }
        }

        emailModel.findOrCreate({
          where: {
            email: email
          },
          defaults: {
            firstName: fName,
            lastName: lName,
            email: email,
            password: pass,
            driver: false,
            carMake: null,
            carModel: null,
            carYear: null
          }
        }).then(function (result) {
          res.send(result);
        });
      }
  } else res.send("Error");
});
app.post("/driverVerification", function (req, res) {});
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