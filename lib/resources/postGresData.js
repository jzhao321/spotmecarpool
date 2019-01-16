"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = exports.markers = exports.garage = exports.seq = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var seq = new _sequelize.default(process.env.DATABASE_URL, {
  logging: false
});
exports.seq = seq;
var garage = seq.define("garage", {
  name: {
    type: _sequelize.default.STRING
  },
  current: {
    type: _sequelize.default.INTEGER
  },
  max: {
    type: _sequelize.default.INTEGER
  },
  upCount: {
    type: _sequelize.default.INTEGER
  },
  downCount: {
    type: _sequelize.default.INTEGER
  }
});
exports.garage = garage;
var markers = seq.define("markers", {
  name: _sequelize.default.STRING,
  lat: _sequelize.default["DOUBLE PRECISION"],
  lng: _sequelize.default["DOUBLE PRECISION"],
  key: _sequelize.default.STRING
});
exports.markers = markers;
var log = seq.define("timeLog", {
  garage: _sequelize.default.STRING,
  current: _sequelize.default.INTEGER,
  time: _sequelize.default.BIGINT
});
exports.log = log;