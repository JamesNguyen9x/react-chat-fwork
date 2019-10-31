function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import Message from './Messages';

var MessageList = function (_Component) {
  _inherits(MessageList, _Component);

  function MessageList() {
    var _temp, _this, _ret;

    _classCallCheck(this, MessageList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.prevScrollHeight = 0, _this.handleScroll = function () {
      _this.props.onScroll(_this.scrollList.scrollTop);
    }, _this.getAvatarMember = function (message) {
      if (_this.props.room.type === 1) {
        var currentUser = _this.props.currentUser;
        if (currentUser && currentUser.profile) {
          if (currentUser._id === message.senderId) {
            return currentUser.profile.avatar;
          }
        }
        return _this.props.room.avatarUrl;
      }
      var members = _this.props.room.members;

      var member = members.filter(function (member) {
        return message.senderId === member.userInfo._id;
      })[0];
      if (member) {
        return member.userInfo.profile.avatar;
      }
      return '';
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  MessageList.prototype.componentDidUpdate = function componentDidUpdate(_prevProps, _prevState) {
    var propLastMessages = this.props.messages[this.props.messages.length - 1];
    var _prevPropLastMessage = _prevProps.messages[_prevProps.messages.length - 1];
    if (!_prevPropLastMessage && !propLastMessages || !propLastMessages) {
      return;
    }
    if (!_prevPropLastMessage && propLastMessages || propLastMessages.clientId !== _prevPropLastMessage.clientId || propLastMessages._id !== _prevPropLastMessage._id) {
      this.scrollList.scrollTop = this.scrollList.scrollHeight;
    } else if (this.props.messages.length > _prevProps.messages.length && _prevProps.messages.length > 0) {
      this.scrollList.scrollTop = this.scrollList.scrollHeight - this.prevScrollHeight;
    }
    this.prevScrollHeight = this.scrollList.scrollHeight;
  };

  MessageList.prototype.render = function render() {
    var _this2 = this;

    return React.createElement(
      'div',
      { style: this.props.isHideWindow ? { display: 'none' } : {}, className: 'sc-message-list', ref: function ref(el) {
          return _this2.scrollList = el;
        }, onScroll: this.handleScroll },
      this.props.messages.map(function (message, i) {
        return React.createElement(Message, { onLikeMessage: _this2.props.onLikeMessage, message: message, avatarUserParentMessage: message.parentMessage ? _this2.getAvatarMember(message.parentMessage) : '', onReplyMessage: _this2.props.onReplyMessage, avatar: _this2.getAvatarMember(message), currentUserId: _this2.props.currentUserId, key: i });
      })
    );
  };

  return MessageList;
}(Component);

export default MessageList;