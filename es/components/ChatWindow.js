function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import MessageList from './MessageList';
import UserInput from './UserInput';
import Header from './Header';
import Group from './Group';
import TimeAgo from 'react-timeago';
import closeIconBlack from './../assets/close-black-icon.png';
import replyIcon from './../assets/reply-blue.png';

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
    return React.createElement(
      'div',
      { style: this.props.isHideWindow ? { height: '80px' } : {}, className: classList.join(' ') },
      this.props.room.type === 2 && this.state.openEditGroup && React.createElement(Group, {
        groupInfo: this.props.room,
        _editGroup: this.props._editGroup,
        currentUserId: this.props.currentUserId,
        handleCancel: this.handleCancelEditGroup,
        handleUpdateRoom: this._handleUpdateRoom
      }),
      React.createElement(Header, {
        openEditGroup: this.handleOpenEditGroup,
        onHideWindow: this.onHideWindow.bind(this),
        isHideWindow: this.props.room.isHideWindow,
        unreadMessage: this.props.room.unreadMessage,
        teamName: this.props.room.name,
        avatar: this.props.room.avatarUrl,
        onClose: this.onClose.bind(this)
      }),
      React.createElement(MessageList, {
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
      React.createElement(
        'div',
        { className: 'message-suggest' },
        React.createElement(
          'i',
          null,
          this.props.room.messageSuggest
        )
      ),
      this.props.room.messageReply ? React.createElement(
        'div',
        null,
        React.createElement('img', { src: replyIcon, className: 'icon-blue-reply' }),
        React.createElement(
          'div',
          null,
          this.props.room.messageReply.content ? React.createElement(
            'div',
            { className: 'message-reply-content' },
            React.createElement('div', { className: 'sc-message--avatar avatar-reply', style: {
                backgroundImage: 'url(' + this.getAvatarMember() + ')'
              } }),
            React.createElement(
              'div',
              { className: 'text-message-parent' },
              this.props.room.messageReply.content,
              React.createElement(TimeAgo, { className: 'reply-message-time-send', date: this.props.room.messageReply.createdDate })
            )
          ) : '',
          React.createElement(
            'div',
            { className: 'message-reply-close-icon', onClick: this.onCloseReplyMessage },
            React.createElement('img', { src: closeIconBlack, alt: '' })
          )
        )
      ) : '',
      React.createElement(
        'div',
        { className: 'message-suggest' },
        React.createElement(
          'i',
          null,
          this.props.room.messageSuggest
        )
      ),
      React.createElement(UserInput, {
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
}(Component);

ChatWindow.propTypes = process.env.NODE_ENV !== "production" ? {
  room: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFilesSelected: PropTypes.func,
  onScroll: PropTypes.func,
  onUserTyping: PropTypes.func,
  onUserInputSubmit: PropTypes.func.isRequired,
  currentUserId: PropTypes.string
} : {};

export default ChatWindow;