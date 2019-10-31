'use strict';

exports.__esModule = true;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMoment = require('react-moment');

var _reactMoment2 = _interopRequireDefault(_reactMoment);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RoomInfo = function (_Component) {
  _inherits(RoomInfo, _Component);

  function RoomInfo() {
    var _temp, _this, _ret;

    _classCallCheck(this, RoomInfo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this._openChatWindow = function () {
      _this.props._openChatWindow(_this.props.room);
    }, _this.renderLastTimeSendMessage = function () {
      var format = 'DD/MM/YY';
      var lastTime = (0, _moment2.default)(_this.props.room.lastTimeSendMessage);
      var startOfWeek = (0, _moment2.default)().startOf('week').add(1, 'day');
      if (!lastTime.isBefore((0, _moment2.default)(), 'day')) {
        format = 'hh:mm A';
      } else if (!lastTime.isBefore(startOfWeek, 'day')) {
        format = 'ddd';
      }
      return _react2.default.createElement(
        _reactMoment2.default,
        { format: format },
        _this.props.room.lastTimeSendMessage
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  RoomInfo.prototype.render = function render() {
    return _react2.default.createElement(
      'li',
      { className: 'active' },
      _react2.default.createElement(
        'div',
        { className: 'room-info' },
        _react2.default.createElement(
          'div',
          { className: 'img_cont cursor-pointer' },
          _react2.default.createElement('img', { src: this.props.room.avatarUrl, alt: 'status-icon', onClick: this._openChatWindow,
            className: 'rounded-circle user_img' }),
          _react2.default.createElement('span', { className: 'online_icon' + (this.props.room.status === 1 ? ' offline' : '') })
        ),
        _react2.default.createElement(
          'div',
          { className: 'user_info cursor-pointer', onClick: this._openChatWindow },
          _react2.default.createElement(
            'p',
            { className: 'room-name' },
            this.props.room.name
          ),
          _react2.default.createElement(
            'p',
            { className: 'last-message' },
            this.props.room.lastMessage
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'more-info' },
          this.renderLastTimeSendMessage(),
          this.props.room.unreadMessage ? _react2.default.createElement(
            'span',
            { className: 'room-info--unread-message' },
            this.props.room.unreadMessage
          ) : null
        )
      )
    );
  };

  return RoomInfo;
}(_react.Component);

RoomInfo.propTypes = process.env.NODE_ENV !== "production" ? {
  room: _propTypes2.default.object
} : {};

exports.default = RoomInfo;
module.exports = exports['default'];