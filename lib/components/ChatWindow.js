'use strict';

exports.__esModule = true;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _MessageList = require('./MessageList');

var _MessageList2 = _interopRequireDefault(_MessageList);

var _UserInput = require('./UserInput');

var _UserInput2 = _interopRequireDefault(_UserInput);

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

var _Group = require('./Group');

var _Group2 = _interopRequireDefault(_Group);

var _reactTimeago = require('react-timeago');

var _reactTimeago2 = _interopRequireDefault(_reactTimeago);

var _closeBlackIcon = require('./../assets/close-black-icon.png');

var _closeBlackIcon2 = _interopRequireDefault(_closeBlackIcon);

var _replyBlue = require('./../assets/reply-blue.png');

var _replyBlue2 = _interopRequireDefault(_replyBlue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChatWindow = function (_Component) {
  _inherits(ChatWindow, _Component);

  function ChatWindow(props) {
    _classCallCheck(this, ChatWindow);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.onCloseReplyMessage = function () {
      _this.props.onCloseReplyMessage(_this.props.room._id);
    };

    _this.getAvatarMember = function () {
      var _this$props$room = _this.props.room,
          members = _this$props$room.members,
          messageReply = _this$props$room.messageReply;

      if (_this.props.room.type === 2) {
        if (messageReply) {
          var user = members.filter(function (member) {
            return member.userInfo._id === messageReply.senderId;
          })[0];
          return user.userInfo.profile.avatar;
        }
      }
      return _this.props.room.avatarUrl;
    };

    _this.handleOpenEditGroup = function () {
      _this.setState({
        openEditGroup: true
      });
    };

    _this.handleCancelEditGroup = function () {
      _this.setState({
        openEditGroup: false
      });
    };

    _this.state = {
      openEditGroup: false,
      groupInfo: null
    };
    return _this;
  }

  ChatWindow.prototype.onUserInputSubmit = function onUserInputSubmit(message) {
    this.props.onUserInputSubmit(this.props.room._id, message);
  };

  ChatWindow.prototype.onUserTyping = function onUserTyping() {
    this.props.onUserTyping();
  };

  ChatWindow.prototype.onScroll = function onScroll(scrollTop) {
    this.props.onScroll(scrollTop, this.props.room._id);
  };

  ChatWindow.prototype.onFilesSelected = function onFilesSelected(filesList) {
    this.props.onFilesSelected(filesList);
  };

  ChatWindow.prototype.onClose = function onClose() {
    this.props.onClose(this.props.room._id);
  };

  ChatWindow.prototype.onHideWindow = function onHideWindow() {
    this.props.onHideWindow();
  };

  ChatWindow.prototype.render = function render() {
    var classList = ['sc-chat-window', this.props.room.isHideWindow ? 'hide-window' : ''];
    return _react2.default.createElement(
      'div',
      { style: this.props.isHideWindow ? { height: '80px' } : {}, className: classList.join(' ') },
      this.props.room.type === 2 && this.state.openEditGroup && _react2.default.createElement(_Group2.default, {
        groupInfo: this.props.room,
        _editGroup: this.props._editGroup,
        currentUserId: this.props.currentUserId,
        handleCancel: this.handleCancelEditGroup,
        handleUpdateRoom: this._handleUpdateRoom
      }),
      _react2.default.createElement(_Header2.default, {
        openEditGroup: this.handleOpenEditGroup,
        onHideWindow: this.onHideWindow.bind(this),
        isHideWindow: this.props.room.isHideWindow,
        unreadMessage: this.props.room.unreadMessage,
        teamName: this.props.room.name,
        avatar: this.props.room.avatarUrl,
        onClose: this.onClose.bind(this)
      }),
      _react2.default.createElement(_MessageList2.default, {
        isHideWindow: this.props.room.isHideWindow,
        onScroll: this.onScroll.bind(this),
        messages: this.props.room.messageList,
        room: this.props.room,
        avatar: this.props.room.avatarUrl,
        currentUserId: this.props.currentUserId,
        onReplyMessage: this.props.onReplyMessage,
        currentUser: this.props.currentUser,
        onLikeMessage: this.props.onLikeMessage
      }),
      _react2.default.createElement(
        'div',
        { className: 'message-suggest' },
        _react2.default.createElement(
          'i',
          null,
          this.props.room.messageSuggest
        )
      ),
      this.props.room.messageReply ? _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('img', { src: _replyBlue2.default, className: 'icon-blue-reply' }),
        _react2.default.createElement(
          'div',
          null,
          this.props.room.messageReply.content ? _react2.default.createElement(
            'div',
            { className: 'message-reply-content' },
            _react2.default.createElement('div', { className: 'sc-message--avatar avatar-reply', style: {
                backgroundImage: 'url(' + this.getAvatarMember() + ')'
              } }),
            _react2.default.createElement(
              'div',
              { className: 'text-message-parent' },
              this.props.room.messageReply.content,
              _react2.default.createElement(_reactTimeago2.default, { className: 'reply-message-time-send', date: this.props.room.messageReply.createdDate })
            )
          ) : '',
          _react2.default.createElement(
            'div',
            { className: 'message-reply-close-icon', onClick: this.onCloseReplyMessage },
            _react2.default.createElement('img', { src: _closeBlackIcon2.default, alt: '' })
          )
        )
      ) : '',
      _react2.default.createElement(
        'div',
        { className: 'message-suggest' },
        _react2.default.createElement(
          'i',
          null,
          this.props.room.messageSuggest
        )
      ),
      _react2.default.createElement(_UserInput2.default, {
        isHideWindow: this.props.room.isHideWindow,
        onSubmit: this.onUserInputSubmit.bind(this),
        onTyping: this.onUserTyping.bind(this),
        onFilesSelected: this.onFilesSelected.bind(this),
        showEmoji: true,
        messageReply: this.props.room.messageReply,
        onCloseReplyMessage: this.onCloseReplyMessage
      })
    );
  };

  return ChatWindow;
}(_react.Component);

ChatWindow.propTypes = process.env.NODE_ENV !== "production" ? {
  room: _propTypes2.default.object.isRequired,
  isOpen: _propTypes2.default.bool.isRequired,
  onClose: _propTypes2.default.func.isRequired,
  onFilesSelected: _propTypes2.default.func,
  onScroll: _propTypes2.default.func,
  onUserTyping: _propTypes2.default.func,
  onUserInputSubmit: _propTypes2.default.func.isRequired,
  currentUserId: _propTypes2.default.string
} : {};

exports.default = ChatWindow;
module.exports = exports['default'];