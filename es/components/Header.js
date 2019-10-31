function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import closeIcon from './../assets/close.svg';
import editIcon from './../assets/pencil.png';

var Header = function (_Component) {
  _inherits(Header, _Component);

  function Header() {
    _classCallCheck(this, Header);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Header.prototype.render = function render() {
    var _this2 = this;

    return React.createElement(
      'div',
      { className: 'sc-header' },
      React.createElement('img', { className: 'sc-header--img', src: this.props.avatar, alt: '' }),
      React.createElement(
        'div',
        { onClick: this.props.onHideWindow, className: 'sc-header--team-name' },
        this.props.teamName
      ),
      this.props.isHideWindow && this.props.unreadMessage ? React.createElement(
        'span',
        { className: 'sc-header--unread-message' },
        this.props.unreadMessage
      ) : '',
      React.createElement(
        'div',
        { style: { display: 'flex', alignItems: 'center' } },
        React.createElement('img', {
          className: 'icon-edit-gr',
          src: editIcon,
          onClick: this.props.openEditGroup,
          alt: 'edit group'
        }),
        React.createElement(
          'div',
          { className: 'sc-header--close-button', onClick: function onClick(e) {
              e.stopPropagation();
              _this2.props.onClose();
            } },
          React.createElement(ReactSVG, { wrapper: 'span', src: closeIcon })
        )
      )
    );
  };

  return Header;
}(Component);

export default Header;