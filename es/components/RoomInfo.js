function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Moment from 'react-moment';
import momentjs from 'moment';

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
      var lastTime = momentjs(_this.props.room.lastTimeSendMessage);
      var startOfWeek = momentjs().startOf('week').add(1, 'day');
      if (!lastTime.isBefore(momentjs(), 'day')) {
        format = 'hh:mm A';
      } else if (!lastTime.isBefore(startOfWeek, 'day')) {
        format = 'ddd';
      }
      return React.createElement(
        Moment,
        { format: format },
        _this.props.room.lastTimeSendMessage
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  RoomInfo.prototype.render = function render() {
    return React.createElement(
      'li',
      { className: 'active' },
      React.createElement(
        'div',
        { className: 'room-info' },
        React.createElement(
          'div',
          { className: 'img_cont cursor-pointer' },
          React.createElement('img', { src: this.props.room.avatarUrl, alt: 'status-icon', onClick: this._openChatWindow,
            className: 'rounded-circle user_img' }),
          React.createElement('span', { className: 'online_icon' + (this.props.room.status === 1 ? ' offline' : '') })
        ),
        React.createElement(
          'div',
          { className: 'user_info cursor-pointer', onClick: this._openChatWindow },
          React.createElement(
            'p',
            { className: 'room-name' },
            this.props.room.name
          ),
          React.createElement(
            'p',
            { className: 'last-message' },
            this.props.room.lastMessage
          )
        ),
        React.createElement(
          'div',
          { className: 'more-info' },
          this.renderLastTimeSendMessage(),
          this.props.room.unreadMessage ? React.createElement(
            'span',
            { className: 'room-info--unread-message' },
            this.props.room.unreadMessage
          ) : null
        )
      )
    );
  };

  return RoomInfo;
}(Component);

RoomInfo.propTypes = process.env.NODE_ENV !== "production" ? {
  room: PropTypes.object
} : {};

export default RoomInfo;