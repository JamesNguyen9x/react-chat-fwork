'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RoomInfo = require('./RoomInfo');

var _RoomInfo2 = _interopRequireDefault(_RoomInfo);

var _fetchAPI = require('../fetchAPI');

var _fetchAPI2 = _interopRequireDefault(_fetchAPI);

var _reactAddonsUpdate = require('react-addons-update');

var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);

var _Group = require('./Group');

var _Group2 = _interopRequireDefault(_Group);

var _createGroupIcon = require('../assets/create-group-icon.png');

var _createGroupIcon2 = _interopRequireDefault(_createGroupIcon);

var _reactDebounceInput = require('react-debounce-input');

var _UserInfo = require('./UserInfo');

var _UserInfo2 = _interopRequireDefault(_UserInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RoomList = function (_Component) {
  _inherits(RoomList, _Component);

  function RoomList() {
    var _this2 = this;

    _classCallCheck(this, RoomList);

    var _this = _possibleConstructorReturn(this, _Component.call(this));

    _this.updateLastMessage = function (data) {
      var isUpdateUnread = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var index = _this.state.rooms.findIndex(function (room) {
        return room._id === data.roomId;
      });
      if (index < 0) {
        if (data.room) {
          _this.setState({
            rooms: [data.room].concat(_this.state.rooms)
          });
        }
        return;
      }
      var rooms = _this.state.rooms;
      rooms[index].lastMessage = data.content;
      rooms[index].lastTimeSendMessage = data.createdDate;
      if (isUpdateUnread) {
        rooms[index].unreadMessage = rooms[index].unreadMessage ? rooms[index].unreadMessage + 1 : 1;
      }
      rooms = rooms.sort(_this.compareRoom);
      _this.setState({
        rooms: rooms
      });
    };

    _this.compareRoom = function (a, b) {
      if (a.lastTimeSendMessage < b.lastTimeSendMessage) {
        return 1;
      }
      if (a.lastTimeSendMessage > b.lastTimeSendMessage) {
        return -1;
      }
      return 0;
    };

    _this.addRoom = function (room) {
      _this.setState({
        rooms: [room].concat(_this.state.rooms)
      });
    };

    _this.updateRoom = function (newRoom) {
      var _update;

      var index = _this.state.rooms.findIndex(function (room) {
        return room._id === newRoom._id;
      });
      _this.setState({
        rooms: (0, _reactAddonsUpdate2.default)(_this.state.rooms, (_update = {}, _update[index] = { $set: newRoom }, _update))
      });
    };

    _this.listenUserChangeStatus = function () {
      if (!window.socket) {
        setTimeout(function () {
          _this.listenUserChangeStatus();
        }, 3000);
        return;
      }
      window.socket.on('user_change_status', function (data) {
        var index = _this.state.usersOnline.findIndex(function (user) {
          return user._id === data.userId;
        });
        if (index >= 0) {
          var _update2;

          _this.setState({
            usersOnline: (0, _reactAddonsUpdate2.default)(_this.state.usersOnline, (_update2 = {}, _update2[index] = { status: { $set: data.status } }, _update2))
          });
          return;
        }
        index = _this.state.otherUsers.findIndex(function (user) {
          return user._id === data.userId;
        });
        if (index >= 0) {
          var _update3;

          _this.setState({
            otherUsers: (0, _reactAddonsUpdate2.default)(_this.state.otherUsers, (_update3 = {}, _update3[index] = { status: { $set: data.status } }, _update3))
          });
        }
      });
    };

    _this.getRooms = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var baseURL, url, response;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              baseURL = process.env.API_SERVER_SOCKET + '/api/v1';
              url = '/rooms';
              _context.next = 4;
              return (0, _fetchAPI2.default)(baseURL, url, 'GET');

            case 4:
              response = _context.sent;

              _this.setState({
                rooms: response.data
              });

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this2);
    }));

    _this.openChatWindow = function (room) {
      var _update4;

      var index = _this.state.rooms.findIndex(function (rm) {
        return rm._id === room._id;
      });
      if (index < 0) {
        _this.props._openChatWindow(room);
        _this.setState({
          key: '',
          searchResult: {
            groups: [],
            users: []
          }
        });
        return;
      }
      _this.setState({
        key: '',
        searchResult: {
          groups: [],
          users: []
        },
        rooms: (0, _reactAddonsUpdate2.default)(_this.state.rooms, (_update4 = {}, _update4[index] = {
          unreadMessage: { $set: 0 }
        }, _update4))
      });
      _this.props._openChatWindow(room);
    };

    _this.getRoomForUser = function (user) {
      _this.props.getRoomForUser(user);
    };

    _this._openCreateGroupWindow = function () {
      _this.setState({
        openCreateGroupWindow: true
      });
    };

    _this.handelCancerCreateGroup = function () {
      _this.setState({
        openCreateGroupWindow: false
      });
    };

    _this.handleSearch = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(e) {
        var key, baseURL, url, params, response;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                key = e.target.value;

                if (key.length) {
                  _context2.next = 4;
                  break;
                }

                _this.setState({
                  key: '',
                  searchResult: {
                    groups: [],
                    users: []
                  }
                });
                return _context2.abrupt('return');

              case 4:
                baseURL = process.env.API_SERVER_SOCKET + '/api/v1';
                url = '/rooms/search';
                params = {
                  key: key
                };
                _context2.next = 9;
                return (0, _fetchAPI2.default)(baseURL, url, 'GET', params);

              case 9:
                response = _context2.sent;

                if (!(response.status !== 200)) {
                  _context2.next = 13;
                  break;
                }

                _this.setState({
                  rooms: []
                });
                return _context2.abrupt('return');

              case 13:
                _this.setState({
                  key: key,
                  searchResult: response.data
                });

              case 14:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }();

    _this.state = {
      openCreateGroupWindow: false,
      groupEdit: null,
      rooms: [],
      key: '',
      searchResult: {
        groups: [],
        users: []
      }
    };
    return _this;
  }

  RoomList.prototype.componentDidMount = function componentDidMount() {
    this.getRooms();
  };

  RoomList.prototype.render = function render() {
    var _this3 = this;

    return _react2.default.createElement(
      'div',
      { className: 'user-list chat' },
      _react2.default.createElement(
        'div',
        { className: 'card mb-sm-3 mb-md-0 contacts_card' },
        _react2.default.createElement(
          'div',
          { className: 'card-header' },
          _react2.default.createElement(
            'div',
            { className: 'input-group' },
            _react2.default.createElement('img', { onClick: this._openCreateGroupWindow, src: _createGroupIcon2.default, alt: 'Create group!' }),
            _react2.default.createElement(_reactDebounceInput.DebounceInput, {
              onChange: this.handleSearch,
              minLength: 2,
              debounceTimeout: 300,
              placeholder: 'Search...',
              value: this.state.key
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'card-body contacts_body' },
          this.state.key ? _react2.default.createElement(
            'ul',
            { className: 'contacts' },
            this.state.searchResult.rooms.map(function (room, i) {
              return _react2.default.createElement(_RoomInfo2.default, { room: room, key: i, _openChatWindow: _this3.openChatWindow });
            }),
            this.state.searchResult.users.map(function (user, i) {
              return _react2.default.createElement(_UserInfo2.default, { user: user, key: i, _openChatWindow: _this3.openChatWindow });
            })
          ) : _react2.default.createElement(
            'ul',
            { className: 'contacts' },
            this.state.rooms.map(function (room, i) {
              return _react2.default.createElement(_RoomInfo2.default, { room: room, key: i, _openChatWindow: _this3.openChatWindow });
            })
          )
        ),
        ');',
        this.state.openCreateGroupWindow && _react2.default.createElement(_Group2.default, {
          groupInfo: this.state.groupEdit,
          _editGroup: this.props._editGroup,
          _createGroup: this.props._createGroup,
          handleCancel: this.handelCancerCreateGroup,
          handleUpdateRoom: this.addRoom
        }),
        _react2.default.createElement('div', { className: 'card-footer' })
      )
    );
  };

  return RoomList;
}(_react.Component);

RoomList.propTypes = process.env.NODE_ENV !== "production" ? {
  onMessageWasReceived: _propTypes2.default.func,
  onMessageWasSent: _propTypes2.default.func,
  newMessagesCount: _propTypes2.default.number,
  isOpen: _propTypes2.default.bool,
  handleClick: _propTypes2.default.func,
  messageList: _propTypes2.default.arrayOf(_propTypes2.default.object),
  mute: _propTypes2.default.bool,
  showEmoji: _propTypes2.default.bool,
  getRoomId: _propTypes2.default.func
} : {};

RoomList.defaultProps = {
  newMessagesCount: 0,
  showEmoji: true
};

exports.default = RoomList;
module.exports = exports['default'];