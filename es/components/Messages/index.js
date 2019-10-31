var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import TextMessage from './TextMessage';
import EmojiMessage from './EmojiMessage';
import FileMessage from './FileMessage';
import replyIcon from './../../assets/reply.png';
import thumbsUpIcon from './../../assets/thumbs-up.png';

var Message = function (_Component) {
  _inherits(Message, _Component);

  function Message() {
    _classCallCheck(this, Message);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Message.prototype._renderMessageOfType = function _renderMessageOfType(type) {
    switch (parseInt(type)) {
      case 1:
        return React.createElement(TextMessage, _extends({ avatarUserParentMessage: this.props.avatarUserParentMessage }, this.props.message, { currentUserId: this.props.currentUserId }));
      case 2:
        return React.createElement(EmojiMessage, this.props.message);
      case 3:
        return React.createElement(FileMessage, this.props.message);
      default:
        console.error('Attempting to load message with unsupported file type \'' + type + '\'');
    }
  };

  Message.prototype.render = function render() {
    var _this2 = this;

    var contentClassList = ['sc-message--content', this.props.message.senderId === this.props.currentUserId ? 'sent' : 'received'];
    return React.createElement(
      'div',
      { className: 'sc-message' },
      React.createElement(
        'div',
        { className: contentClassList.join(' ') },
        React.createElement('div', { className: 'sc-message--avatar', style: {
            backgroundImage: 'url(' + this.props.avatar + ')'
          } }),
        this._renderMessageOfType(this.props.message.type),
        this.props.message.senderId !== this.props.currentUserId ? React.createElement(
          'span',
          { className: 'message-icon-event' },
          React.createElement('img', { className: 'like-icon', src: replyIcon, onClick: function onClick() {
              return _this2.props.onReplyMessage(_this2.props.message);
            } }),
          React.createElement('img', { className: 'reply-icon', src: thumbsUpIcon, onClick: function onClick() {
              return _this2.props.onLikeMessage(_this2.props.message);
            } })
        ) : ''
      )
    );
  };

  return Message;
}(Component);

export default Message;