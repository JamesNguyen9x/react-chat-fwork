'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactLinkify = require('react-linkify');

var _reactLinkify2 = _interopRequireDefault(_reactLinkify);

var _reactMoment = require('react-moment');

var _reactMoment2 = _interopRequireDefault(_reactMoment);

var _sent = require('./../../assets/sent.png');

var _sent2 = _interopRequireDefault(_sent);

var _sending = require('./../../assets/sending.png');

var _sending2 = _interopRequireDefault(_sending);

var _thumbsUpHandSymbol = require('./../../assets/thumbs-up-hand-symbol.png');

var _thumbsUpHandSymbol2 = _interopRequireDefault(_thumbsUpHandSymbol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import TimeAgo from 'react-timeago';
var TextMessage = function TextMessage(props) {
  return _react2.default.createElement(
    'div',
    { className: props.senderId === props.currentUserId ? 'sc-message--text' : 'sc-message--text content-message-background-left' },
    _react2.default.createElement(
      _reactLinkify2.default,
      { properties: { target: '_blank' } },
      props.parentMessage ? _react2.default.createElement(
        'div',
        { className: 'contain-reply-message' },
        _react2.default.createElement('img', { className: 'avatar-user-parent-message', src: props.avatarUserParentMessage }),
        _react2.default.createElement(
          'i',
          { className: 'content-parent-message', style: { color: 'black' } },
          props.parentMessage ? props.parentMessage.content : ''
        )
      ) : '',
      _react2.default.createElement(
        'div',
        { className: 'content-mess' },
        props.content
      ),
      props.liked && props.liked.length > 0 ? _react2.default.createElement(
        'span',
        { className: 'container-count-like' },
        _react2.default.createElement(
          'span',
          { className: 'count-like-number' },
          props.liked.length
        ),
        _react2.default.createElement('img', { className: 'count-like-img', src: _thumbsUpHandSymbol2.default })
      ) : ''
    ),
    _react2.default.createElement(
      _reactMoment2.default,
      { className: 'sc-message--time', format: 'hh:mm A' },
      props.createdDate
    ),
    _react2.default.createElement('br', null),
    props.senderId === props.currentUserId ? _react2.default.createElement('img', { className: 'sc-message--icon-status', src: props.status === 1 ? _sent2.default : _sending2.default, alt: '' }) : ''
  );
};

exports.default = TextMessage;
module.exports = exports['default'];