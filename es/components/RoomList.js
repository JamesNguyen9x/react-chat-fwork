import _regeneratorRuntime from 'babel-runtime/regenerator';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RoomInfo from './RoomInfo';
import fetchAPI from '../fetchAPI';
import update from 'react-addons-update';
import Group from './Group';
import iconCreateGroup from '../assets/create-group-icon.png';
import { DebounceInput } from 'react-debounce-input';
import UserInfo from './UserInfo';

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
        rooms: update(_this.state.rooms, (_update = {}, _update[index] = { $set: newRoom }, _update))
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
            usersOnline: update(_this.state.usersOnline, (_update2 = {}, _update2[index] = { status: { $set: data.status } }, _update2))
          });
          return;
        }
        index = _this.state.otherUsers.findIndex(function (user) {
          return user._id === data.userId;
        });
        if (index >= 0) {
          var _update3;

          _this.setState({
            otherUsers: update(_this.state.otherUsers, (_update3 = {}, _update3[index] = { status: { $set: data.status } }, _update3))
          });
        }
      });
    };

    _this.getRooms = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var baseURL, url, response;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              baseURL = process.env.API_SERVER_SOCKET + '/api/v1';
              url = '/rooms';
              _context.next = 4;
              return fetchAPI(baseURL, url, 'GET');

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
        rooms: update(_this.state.rooms, (_update4 = {}, _update4[index] = {
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
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(e) {
        var key, baseURL, url, params, response;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
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
                return fetchAPI(baseURL, url, 'GET', params);

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

    return React.createElement(
      'div',
      { className: 'user-list chat' },
      React.createElement(
        'div',
        { className: 'card mb-sm-3 mb-md-0 contacts_card' },
        React.createElement(
          'div',
          { className: 'card-header' },
          React.createElement(
            'div',
            { className: 'input-group' },
            React.createElement('img', { onClick: this._openCreateGroupWindow, src: iconCreateGroup, alt: 'Create group!' }),
            React.createElement(DebounceInput, {
              onChange: this.handleSearch,
              minLength: 2,
              debounceTimeout: 300,
              placeholder: 'Search...',
              value: this.state.key
            })
          )
        ),
        React.createElement(
          'div',
          { className: 'card-body contacts_body' },
          this.state.key ? React.createElement(
            'ul',
            { className: 'contacts' },
            this.state.searchResult.rooms.map(function (room, i) {
              return React.createElement(RoomInfo, { room: room, key: i, _openChatWindow: _this3.openChatWindow });
            }),
            this.state.searchResult.users.map(function (user, i) {
              return React.createElement(UserInfo, { user: user, key: i, _openChatWindow: _this3.openChatWindow });
            })
          ) : React.createElement(
            'ul',
            { className: 'contacts' },
            this.state.rooms.map(function (room, i) {
              return React.createElement(RoomInfo, { room: room, key: i, _openChatWindow: _this3.openChatWindow });
            })
          )
        ),
        ');',
        this.state.openCreateGroupWindow && React.createElement(Group, {
          groupInfo: this.state.groupEdit,
          _editGroup: this.props._editGroup,
          _createGroup: this.props._createGroup,
          handleCancel: this.handelCancerCreateGroup,
          handleUpdateRoom: this.addRoom
        }),
        React.createElement('div', { className: 'card-footer' })
      )
    );
  };

  return RoomList;
}(Component);

RoomList.propTypes = process.env.NODE_ENV !== "production" ? {
  onMessageWasReceived: PropTypes.func,
  onMessageWasSent: PropTypes.func,
  newMessagesCount: PropTypes.number,
  isOpen: PropTypes.bool,
  handleClick: PropTypes.func,
  messageList: PropTypes.arrayOf(PropTypes.object),
  mute: PropTypes.bool,
  showEmoji: PropTypes.bool,
  getRoomId: PropTypes.func
} : {};

RoomList.defaultProps = {
  newMessagesCount: 0,
  showEmoji: true
};

export default RoomList;