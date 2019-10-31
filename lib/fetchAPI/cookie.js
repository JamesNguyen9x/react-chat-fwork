'use strict';

exports.__esModule = true;
exports.JWT_TOKEN = undefined;
exports.getSessionToken = getSessionToken;
exports.resetSessionToken = resetSessionToken;
exports.setSessionToken = setSessionToken;
exports.getLocalToken = getLocalToken;
exports.removeLocalToken = removeLocalToken;
exports.setLocalToken = setLocalToken;
exports.getToken = getToken;
exports.removeToken = removeToken;

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JWT_TOKEN = exports.JWT_TOKEN = process.env.JWT_TOKEN || 'fwork-token';

var expires = 1;
function getSessionToken() {
  return _jsCookie2.default.get(JWT_TOKEN);
}

function resetSessionToken() {
  _jsCookie2.default.remove(JWT_TOKEN);
}

function setSessionToken(token) {
  _jsCookie2.default.set(JWT_TOKEN, token, {
    expires: expires
    // secure: process.env.NODE_ENV === 'production',
  });
}
function getLocalToken() {
  return localStorage.getItem(JWT_TOKEN);
}
function removeLocalToken() {
  return localStorage.removeItem(JWT_TOKEN);
}
function setLocalToken(token) {
  localStorage.setItem(JWT_TOKEN, token);
}

function getToken() {
  return getSessionToken();
}

function removeToken() {
  return resetSessionToken() || removeLocalToken();
}