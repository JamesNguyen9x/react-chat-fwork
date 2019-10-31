import _regeneratorRuntime from 'babel-runtime/regenerator';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import { getToken } from './cookie';
import axios from 'axios';

export default function (baseURL, url) {
  var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'POST';

  var _this = this;

  var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var data = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

  var token = getToken();
  var headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  };

  var options = {
    url: url,
    method: method,
    baseURL: baseURL,
    headers: headers,
    params: params,
    data: data,
    timeout: 18000
  };

  return new Promise(function (resolve, reject) {
    axios(options).then(function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(response) {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                resolve(response);

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));

      return function (_x4) {
        return _ref.apply(this, arguments);
      };
    }()).catch(function (error) {
      if (error.response) {
        reject(error.response);
      }
    });
  });
}