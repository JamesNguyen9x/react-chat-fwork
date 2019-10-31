'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSvg = require('react-svg');

var _reactSvg2 = _interopRequireDefault(_reactSvg);

var _close = require('./../assets/close.svg');

var _close2 = _interopRequireDefault(_close);

var _pencil = require('./../assets/pencil.png');

var _pencil2 = _interopRequireDefault(_pencil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Header = function (_Component) {
  _inherits(Header, _Component);

  function Header() {
    _classCallCheck(this, Header);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  Header.prototype.render = function render() {
    var _this2 = this;

    return _react2.default.createElement(
      'div',
      { className: 'sc-header' },
      _react2.default.createElement('img', { className: 'sc-header--img', src: this.props.avatar, alt: '' }),
      _react2.default.createElement(
        'div',
        { onClick: this.props.onHideWindow, className: 'sc-header--team-name' },
        this.props.teamName
      ),
      this.props.isHideWindow && this.props.unreadMessage ? _react2.default.createElement(
        'span',
        { className: 'sc-header--unread-message' },
        this.props.unreadMessage
      ) : '',
      _react2.default.createElement(
        'div',
        { style: { display: 'flex', alignItems: 'center' } },
        _react2.default.createElement('img', {
          className: 'icon-edit-gr',
          src: _pencil2.default,
          onClick: this.props.openEditGroup,
          alt: 'edit group'
        }),
        _react2.default.createElement(
          'div',
          { className: 'sc-header--close-button', onClick: function onClick(e) {
              e.stopPropagation();
              _this2.props.onClose();
            } },
          _react2.default.createElement(_reactSvg2.default, { wrapper: 'span', src: _close2.default })
        )
      )
    );
  };

  return Header;
}(_react.Component);

exports.default = Header;
module.exports = exports['default'];