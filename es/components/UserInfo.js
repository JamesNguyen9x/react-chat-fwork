import _regeneratorRuntime from 'babel-runtime/regenerator';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import fetchAPI from '../fetchAPI';

var UserInfo = function (_Component) {
  _inherits(UserInfo, _Component);

  function UserInfo() {
    var _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, UserInfo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this._openChatWindow = function () {
      _this.props._openChatWindow(_this.props.user);
    }, _this.createRoom = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var baseURL, url, params, response;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              baseURL = process.env.API_SERVER_SOCKET + '/api/v1';
              url = '/rooms/for-user';
              params = {
                userId: _this.props.user._id
              };
              _context.next = 5;
              return fetchAPI(baseURL, url, 'GET', params);

            case 5:
              response = _context.sent;

              if (!(response.status !== 200)) {
                _context.next = 8;
                break;
              }

              return _context.abrupt('return');

            case 8:
              _this.props._openChatWindow(response.data.room);

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this2);
    })), _temp), _possibleConstructorReturn(_this, _ret);
  }

  UserInfo.prototype.render = function render() {
    return React.createElement(
      'li',
      { className: 'active' },
      React.createElement(
        'div',
        { className: 'room-info' },
        React.createElement(
          'div',
          { className: 'img_cont cursor-pointer' },
          React.createElement('img', { src: this.props.user.profile.avatar, alt: 'status-icon', onClick: this.createRoom,
            className: 'rounded-circle user_img' }),
          React.createElement('span', { className: 'online_icon' + (this.props.user.status === 1 ? ' offline' : '') })
        ),
        React.createElement(
          'div',
          { className: 'user_info cursor-pointer', onClick: this.createRoom },
          React.createElement(
            'p',
            { className: 'room-name' },
            this.props.user.profile.fullName
          )
        )
      )
    );
  };

  return UserInfo;
}(Component);

UserInfo.propTypes = process.env.NODE_ENV !== "production" ? {
  user: PropTypes.object
} : {};

export default UserInfo;