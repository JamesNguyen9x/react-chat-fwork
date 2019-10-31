'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TextMessage = require('./TextMessage');

var _TextMessage2 = _interopRequireDefault(_TextMessage);

var _EmojiMessage = require('./EmojiMessage');

var _EmojiMessage2 = _interopRequireDefault(_EmojiMessage);

var _FileMessage = require('./FileMessage');

var _FileMessage2 = _interopRequireDefault(_FileMessage);

var _reply = require('./../../assets/reply.png');

var _reply2 = _interopRequireDefault(_reply);

var _thumbsUp = require('./../../assets/thumbs-up.png');

var _thumbsUp2 = _interopRequireDefault(_thumbsUp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Message = function (_Component) {
  _inherits(Message, _Component);

  function Message() {
    _classCallCheck(this, Message);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Message.prototype._renderMessageOfType = function _renderMessageOfType(type) {
    switch (parseInt(type)) {
      case 1:
        return _react2.default.createElement(_TextMessage2.default, _extends({ avatarUserParentMessage: this.props.avatarUserParentMessage }, this.props.message, { currentUserId: this.props.currentUserId }));
      case 2:
        return _react2.default.createElement(_EmojiMessage2.default, this.props.message);
      case 3:
        return _react2.default.createElement(_FileMessage2.default, this.props.message);
      default:
        console.error('Attempting to load message with unsupported file type \'' + type + '\'');
    }
  };

  Message.prototype.render = function render() {
    var _this2 = this;

    var contentClassList = ['sc-message--content', this.props.message.senderId === this.props.currentUserId ? 'sent' : 'received'];
    return _react2.default.createElement(
      'div',
      { className: 'sc-message' },
      _react2.default.createElement(
        'div',
        { className: contentClassList.join(' ') },
        _react2.default.createElement('div', { className: 'sc-message--avatar', style: {
            backgroundImage: 'url(' + this.props.avatar + ')'
          } }),
        this._renderMessageOfType(this.props.message.type),
        this.props.message.senderId !== this.props.currentUserId ? _react2.default.createElement(
          'span',
          { className: 'message-icon-event' },
          _react2.default.createElement('img', { className: 'like-icon', src: _reply2.default, onClick: function onClick() {
              return _this2.props.onReplyMessage(_this2.props.message);
            } }),
          _react2.default.createElement('img', { className: 'reply-icon', src: _thumbsUp2.default, onClick: function onClick() {
              return _this2.props.onLikeMessage(_this2.props.message);
            } })
        ) : ''
      )
    );
  };

  return Message;
}(_react.Component);

exports.default = Message;
module.exports = exports['default'];