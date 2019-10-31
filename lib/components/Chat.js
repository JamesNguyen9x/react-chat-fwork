'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RoomList = require('./RoomList');

var _RoomList2 = _interopRequireDefault(_RoomList);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _ChatWindow = require('./ChatWindow');

var _ChatWindow2 = _interopRequireDefault(_ChatWindow);

var _reactAddonsUpdate = require('react-addons-update');

var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);

var _reactRedux = require('react-redux');

var _fetchAPI = require('../fetchAPI');

var _fetchAPI2 = _interopRequireDefault(_fetchAPI);

var _cookie = require('../fetchAPI/cookie');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chat = function (_Component) {
  _inherits(Chat, _Component);

  function Chat(props) {
    var _this2 = this;

    _classCallCheck(this, Chat);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.typing = false;
    _this.isLoadingMessage = false;
    _this.connectSocket = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var endpoint, tokenJWT;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              endpoint = process.env.API_SERVER_SOCKET;

              window.socket = (0, _socket2.default)(endpoint);
              tokenJWT = (0, _cookie.getToken)();

              window.socket.on('connect', function () {
                window.socket.emit('authenticate', { token: tokenJWT });
                window.socket.on('authenticated_success', function () {
                  if (_this.state.rooms.length > 0) {
                    _this.state.rooms.forEach(function (room) {
                      window.socket.emit('join_room', room._id);
                    });
                  }
                });
              });
              _this.listenEvent();

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this2);
    }));

    _this.listenEvent = function () {
      window.socket.on('disconnect', function () {
        console.error('disconnect');
      });

      window.socket.on('user_change_status', function (data) {
        var index = _this.state.rooms.findIndex(function (user) {
          return user._id === data.userId;
        });
        if (index >= 0) {
          var _update;

          _this.setState({
            rooms: (0, _reactAddonsUpdate2.default)(_this.state.rooms, (_update = {}, _update[index] = { status: { $set: data.status } }, _update))
          });
        }
      });

      window.socket.on('typing_message', function (data) {
        clearTimeout(_this.timeoutStopTyping);
        if (data.roomId !== _this.state.roomIdActive || data.userId === _this.props.users.currentUser._id) {
          return;
        }
        var message = _this.state.userActive.username + data.message;
        _this.setState({
          messageSuggest: message
        });
        _this.timeoutStopTyping = setTimeout(function () {
          _this.setState({
            messageSuggest: ''
          });
        }, 3000);
      });

      window.socket.on('new_message', function (data) {
        var _update2;

        var index = _this.state.rooms.findIndex(function (roomActive) {
          return roomActive._id === data.roomId;
        });
        if (index < 0) {
          return;
        }
        clearTimeout(_this.timeoutStopTyping);
        _this.setState({
          rooms: (0, _reactAddonsUpdate2.default)(_this.state.rooms, (_update2 = {}, _update2[index] = {
            messageList: { $set: [].concat(_this.state.rooms[index].messageList, [data]) },
            messageSuggest: { $set: '' }
          }, _update2))
        });
      });

      window.socket.on('new_message_liked', function (data) {
        var _update3;

        var index = _this.state.rooms.findIndex(function (roomActive) {
          return roomActive._id === data.roomId;
        });
        if (index < 0) {
          return;
        }
        clearTimeout(_this.timeoutStopTyping);
        var indexMessage = _this.state.rooms[index].messageList.findIndex(function (mess) {
          return mess._id === data._id;
        });
        var newListMessage = _this.state.rooms[index].messageList;
        newListMessage.splice(indexMessage, 1, data);
        _this.setState({
          rooms: (0, _reactAddonsUpdate2.default)(_this.state.rooms, (_update3 = {}, _update3[index] = {
            messageList: { $set: newListMessage },
            messageSuggest: { $set: '' }
          }, _update3))
        });
      });

      window.socket.on('new_message_room_off', function (data) {
        var _update4;

        _this.roomList.current.updateLastMessage(data, true);
        var index = _this.state.rooms.findIndex(function (room) {
          return room._id === data.roomId;
        });
        if (index < 0) {
          return;
        }
        var unreadMessage = _this.state.rooms[index].unreadMessage ? parseInt(_this.state.rooms[index].unreadMessage) : 0;
        unreadMessage++;
        _this.setState({
          rooms: (0, _reactAddonsUpdate2.default)(_this.state.rooms, (_update4 = {}, _update4[index] = { unreadMessage: { $set: unreadMessage } }, _update4))
        });
      });
    };

    _this.setRoomsActiveToSession = function () {
      if (typeof Storage !== 'undefined') {
        if (!_this.state.rooms.length) {
          sessionStorage.removeItem('roomIdsActive');
          return;
        }
        var roomsInfo = _this.state.rooms.map(function (room) {
          return {
            roomId: room._id,
            isHideWindow: room.isHideWindow
          };
        });
        sessionStorage.setItem('roomIdsActive', JSON.stringify(roomsInfo));
      } else {
        console.error('This browser does not support session storage');
      }
    };

    _this.getRoomsActiveFromSession = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var roomsInfoString, roomsSessionInfo, roomIds, baseURL, url, params, response, newRooms;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(typeof Storage !== 'undefined')) {
                _context2.next = 21;
                break;
              }

              roomsInfoString = sessionStorage.getItem('roomIdsActive');

              if (roomsInfoString) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt('return');

            case 4:
              roomsSessionInfo = JSON.parse(roomsInfoString);
              roomIds = roomsSessionInfo.filter(function (room) {
                return !!room.roomId;
              }).map(function (room) {
                return room.roomId;
              });

              if (roomIds.length) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt('return');

            case 8:
              baseURL = process.env.API_SERVER_SOCKET + '/api/v1';
              url = '/rooms/info';
              params = {
                roomIds: roomIds
              };
              _context2.next = 13;
              return (0, _fetchAPI2.default)(baseURL, url, 'GET', params);

            case 13:
              response = _context2.sent;

              if (!(response.status !== 200 || !response.data.roomsInfo.length)) {
                _context2.next = 16;
                break;
              }

              return _context2.abrupt('return');

            case 16:
              newRooms = [];

              roomsSessionInfo.forEach(function (roomSession) {
                var roomInfo = response.data.roomsInfo.find(function (room) {
                  return room._id === roomSession.roomId;
                });
                if (!roomInfo) {
                  return;
                }
                roomInfo.isHideWindow = roomSession.isHideWindow;
                roomInfo.firstMessageAt = '';
                roomInfo.typingMessage = '';
                roomInfo.messageSuggest = '';
                roomInfo.messageList = [];
                roomInfo.canLoadMore = true;
                roomInfo.isLoading = false;
                roomInfo.unreadMessage = roomSession.isHideWindow ? roomInfo.unreadMessage : 0;
                newRooms.push(roomInfo);
              });
              _this.setState({
                rooms: newRooms
              }, function () {
                _this.reopenRoom();
              });
              _context2.next = 22;
              break;

            case 21:
              console.error('This browser does not support session storage');

            case 22:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this2);
    }));

    _this.reopenRoom = function () {
      _this.state.rooms.forEach(function (room, index) {
        if (room.isHideWindow) {
          return;
        }
        _this.rejoinRoom(room, index, false);
      });
    };

    _this._onMessageWasSent = function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(roomId, message) {
        var _update5;

        var index, data, newMessageList;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                index = _this.state.rooms.findIndex(function (roomActive) {
                  return roomActive._id === roomId;
                });

                if (!(index < 0)) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt('return');

              case 3:
                data = {
                  content: message.content,
                  roomId: roomId,
                  parentMessage: message.parentMessage ? message.parentMessage._id : ''
                };

                message.status = 0;
                message.senderId = _this.props.users.currentUser._id;
                message.createdDate = new Date();
                message.clientId = (0, _uuid2.default)();
                newMessageList = [].concat(_this.state.rooms[index].messageList, [message]);

                _this.setState({
                  rooms: (0, _reactAddonsUpdate2.default)(_this.state.rooms, (_update5 = {}, _update5[index] = { messageList: { $set: newMessageList } }, _update5))
                }, function () {
                  window.socket.emit('send_message', data, function (result) {
                    var _update6;

                    if (!result.success) {
                      return;
                    }
                    message.status = 1;
                    message.createdDate = result.message.createdDate;
                    var room = _this.state.rooms[index];
                    var isNotInRoomList = !room.lastMessage;
                    _this.setState({
                      rooms: (0, _reactAddonsUpdate2.default)(_this.state.rooms, (_update6 = {}, _update6[index] = {
                        messageList: { $set: newMessageList },
                        lastMessage: { $set: message.content },
                        lastTimeSendMessage: { $set: new Date() }
                      }, _update6))
                    }, function () {
                      if (isNotInRoomList) {
                        _this.roomList.current.addRoom(_this.state.rooms[index]);
                      }
                    });
                    result.message.isOwner = true;
                    _this.roomList.current.updateLastMessage(result.message);
                  });
                });

              case 10:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this2);
      }));

      return function (_x, _x2) {
        return _ref3.apply(this, arguments);
      };
    }();

    _this.getMemberList = function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4(roomId) {
        var baseURL, url, response;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                baseURL = process.env.API_SERVER_SOCKET + '/api/v1';
                url = process.env.API_SERVER_SOCKET + '/api/v1/groups/' + roomId;
                _context4.next = 4;
                return (0, _fetchAPI2.default)(baseURL, url, 'GET');

              case 4:
                response = _context4.sent;
                return _context4.abrupt('return', response.data);

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, _this2);
      }));

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }();

    _this._getRoomForUser = function (user) {
      var baseURL = process.env.API_SERVER_SOCKET + '/api/v1';
      var url = '/rooms/for-user';
      var params = {
        userId: user._id
      };
      (0, _fetchAPI2.default)(baseURL, url, 'GET', params).then(function (response) {
        if (response.data && response.data.room) {
          var room = response.data.room;
          _this._openChatWindow(room);
        }
      });
    };

    _this._openChatWindow = function (room) {
      var roomExits = _this.state.rooms.filter(function (roomActive) {
        return roomActive._id === room._id;
      });
      if (roomExits.length) {
        return;
      }
      window.socket.emit('join_room', room._id);
      _this.addRoom(room);
    };

    _this.addRoom = function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee5(room) {
        var newRoom, roomInfo;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                newRoom = _extends({}, room, {
                  firstMessageAt: '',
                  typingMessage: '',
                  messageSuggest: '',
                  messageList: [],
                  canLoadMore: true,
                  isHideWindow: false,
                  unreadMessage: 0
                });

                if (!(room.type === 2 && !newRoom.members)) {
                  _context5.next = 6;
                  break;
                }

                _context5.next = 4;
                return _this.getMemberList(room._id);

              case 4:
                roomInfo = _context5.sent;

                newRoom.members = roomInfo.roomUsers;

              case 6:

                _this.setState({
                  rooms: [].concat(_this.state.rooms, [newRoom])
                }, function () {
                  _this.setRoomsActiveToSession();
                  _this._getMessage(room._id);
                });

              case 7:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, _this2);
      }));

      return function (_x4) {
        return _ref5.apply(this, arguments);
      };
    }();

    _this._onUserTyping = function () {
      if (!_this.typing) {
        _this.typing = true;
        var data = {
          roomId: _this.state.roomIdActive
        };
        window.socket.emit('typing_message', data);
        setTimeout(function () {
          _this.typing = false;
        }, 1000);
      }
    };

    _this._onLikeMessage = function (mess) {
      var message = _extends({}, mess);
      if (message) {
        var _update7;

        var params = {
          _id: message._id,
          roomId: message.roomId
        };
        window.socket.emit('like_message', params, function (result) {});
        var index = _this.state.rooms.findIndex(function (roomActive) {
          return roomActive._id === message.roomId;
        });
        if (index < 0) {
          return;
        }
        if (message.liked.includes(_this.props.users.currentUser._id)) {
          message.liked = message.liked.filter(function (mess) {
            return mess !== _this.props.users.currentUser._id;
          });
        } else {
          message.liked.push(_this.props.users.currentUser._id);
        }
        var indexMessage = _this.state.rooms[index].messageList.findIndex(function (mess) {
          return mess._id === message._id;
        });
        var newListMessage = _this.state.rooms[index].messageList;
        newListMessage.splice(indexMessage, 1, message);

        _this.setState({
          rooms: (0, _reactAddonsUpdate2.default)(_this.state.rooms, (_update7 = {}, _update7[index] = {
            messageList: { $set: newListMessage },
            messageSuggest: { $set: '' }
          }, _update7))
        });
      }
    };

    _this._getMessage = function (roomId) {
      var getMultiple = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var index = _this.state.rooms.findIndex(function (roomActive) {
        return roomActive._id === roomId;
      });
      if (index < 0) {
        return;
      }
      var room = _this.state.rooms[index];
      if (!getMultiple && (!room.canLoadMore || _this.isLoadingMessage)) {
        return;
      }
      _this.isLoadingMessage = true;
      var params = {
        roomId: roomId,
        firstMessageAt: room.firstMessageAt
      };
      var baseURL = process.env.API_SERVER_SOCKET + '/api/v1';
      var url = process.env.API_SERVER_SOCKET + '/api/v1/messages';
      (0, _fetchAPI2.default)(baseURL, url, 'GET', params).then(function (response) {
        _this.isLoadingMessage = false;
        var messages = response.data.messages;
        if (!messages.length) {
          var _update8;

          _this.setState({
            rooms: (0, _reactAddonsUpdate2.default)(_this.state.rooms, (_update8 = {}, _update8[index] = {
              canLoadMore: { $set: false }
            }, _update8))
          });
        } else {
          var _update9;

          _this.setState({
            rooms: (0, _reactAddonsUpdate2.default)(_this.state.rooms, (_update9 = {}, _update9[index] = {
              messageList: { $set: [].concat(messages, _this.state.rooms[index].messageList) },
              firstMessageAt: { $set: response.data.messages[0].createdDate },
              canLoadMore: { $set: !(messages.length < 20) }
            }, _update9))
          });
        }
      }).catch(function (err) {
        console.error('err _getMessage: ', err);
      });
    };

    _this._createGroup = function (data) {
      data = _extends({}, data, { userId: _this.props.users.currentUser._id });
      var baseURL = process.env.API_SERVER_SOCKET + '/api/v1';
      var url = process.env.API_SERVER_SOCKET + '/api/v1/groups';

      return (0, _fetchAPI2.default)(baseURL, url, 'POST', null, data);
    };

    _this._editGroup = function (data) {

      var baseURL = process.env.API_SERVER_SOCKET + '/api/v1';
      var url = process.env.API_SERVER_SOCKET + '/api/v1/groups/' + data.roomId + '/edit';

      return (0, _fetchAPI2.default)(baseURL, url, 'PUT', null, data).then(function (res) {
        if (res.status === 200) {

          _this.roomList.current.updateRoom(res.data.newRoom);
          _this.updateRoom(res.data.newRoom);
        }
      });
    };

    _this.updateRoom = function (newRoom) {
      var _update10;

      var index = _this.state.rooms.findIndex(function (room) {
        return room._id === newRoom._id;
      });
      _this.setState({
        rooms: (0, _reactAddonsUpdate2.default)(_this.state.rooms, (_update10 = {}, _update10[index] = { $set: _extends({}, _this.state.rooms[index], newRoom) }, _update10))
      }, function () {
        window.socket.emit('update_room', newRoom);
      });
    };

    _this._onScroll = function (scrollTop, roomId) {
      if (scrollTop < 100) {
        _this._getMessage(roomId);
      }
    };

    _this._onFilesSelected = function (filesList) {
      var data = new FormData();

      for (var i = 0; i < filesList.length; i++) {
        var file = filesList[i];
        data.append('file' + i, file);
      }

      var baseURL = process.env.API_SERVER_SOCKET + '/api/v1';
      var url = process.env.API_SERVER_SOCKET + '/api/v1/upload-file';

      return (0, _fetchAPI2.default)(baseURL, url, 'POST', null, data);
    };

    _this._onHideWindow = function (room) {
      var index = _this.state.rooms.findIndex(function (roomActive) {
        return roomActive._id === room._id;
      });
      if (index < 0) {
        return;
      }
      if (_this.state.rooms[index].isHideWindow) {
        _this.rejoinRoom(room, index, true);
      } else {
        var _update11;

        _this.setState({
          rooms: (0, _reactAddonsUpdate2.default)(_this.state.rooms, (_update11 = {}, _update11[index] = {
            isHideWindow: {
              $set: !_this.state.rooms[index].isHideWindow
            }
          }, _update11))
        }, function () {
          _this.setRoomsActiveToSession();
        });
        window.socket.emit('leave_room', room._id);
      }
    };

    _this.rejoinRoom = function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee6(room, index, isSetState) {
        var roomInfo, _update12;

        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                window.socket.emit('join_room', room._id);

                if (!(room.type === 2 && !room.members)) {
                  _context6.next = 6;
                  break;
                }

                _context6.next = 4;
                return _this.getMemberList(room._id);

              case 4:
                roomInfo = _context6.sent;

                room.members = roomInfo.roomUsers;

              case 6:
                if (isSetState) {
                  _this.setState({
                    rooms: (0, _reactAddonsUpdate2.default)(_this.state.rooms, (_update12 = {}, _update12[index] = {
                      isHideWindow: {
                        $set: !_this.state.rooms[index].isHideWindow
                      },
                      messageList: {
                        $set: []
                      },
                      firstMessageAt: {
                        $set: null
                      },
                      canLoadMore: {
                        $set: true
                      },
                      members: {
                        $set: room.members
                      },
                      unreadMessage: {
                        $set: 0
                      }
                    }, _update12))
                  }, function () {
                    _this._getMessage(room._id);
                    _this.setRoomsActiveToSession();
                  });
                } else {
                  _this._getMessage(room._id, true);
                }

              case 7:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, _this2);
      }));

      return function (_x6, _x7, _x8) {
        return _ref6.apply(this, arguments);
      };
    }();

    _this._onReplyMessage = function (message) {
      var _update13;

      var index = _this.state.rooms.findIndex(function (roomActive) {
        return roomActive._id === message.roomId;
      });
      if (index < 0) {
        return;
      }
      _this.setState({
        rooms: (0, _reactAddonsUpdate2.default)(_this.state.rooms, (_update13 = {}, _update13[index] = { messageReply: { $set: message } }, _update13))
      });
    };

    _this._onCloseReplyMessage = function (roomId) {
      var _update14;

      var index = _this.state.rooms.findIndex(function (roomActive) {
        return roomActive._id === roomId;
      });
      if (index < 0) {
        return;
      }
      _this.setState({
        rooms: (0, _reactAddonsUpdate2.default)(_this.state.rooms, (_update14 = {}, _update14[index] = { messageReply: { $set: '' } }, _update14))
      });
    };

    _this.state = {
      number: 0,
      rooms: [],
      currentUserId: '',
      roomIdActive: '',
      tokenJWT: '',
      isLoading: false,
      firstMessageAt: '',
      typingMessage: '',
      messageSuggest: '',
      isOpen: false
    };
    _this.roomList = _react2.default.createRef();
    return _this;
  }

  Chat.prototype.componentDidMount = function componentDidMount() {
    this.connectSocket();
    this.getRoomsActiveFromSession();
  };

  Chat.prototype._onClose = function _onClose(roomId) {
    var _this3 = this;

    var index = this.state.rooms.findIndex(function (room) {
      return room._id === roomId;
    });
    if (index < 0) {
      return;
    }
    window.socket.emit('leave_room', roomId);
    var rooms = this.state.rooms.filter(function (room) {
      return room._id !== roomId;
    });
    this.setState({
      rooms: rooms
    }, function () {
      _this3.setRoomsActiveToSession();
    });
  };

  Chat.prototype.render = function render() {
    var _this4 = this;

    return _react2.default.createElement(
      'div',
      null,
      this.state.rooms.length > 0 && _react2.default.createElement(
        'div',
        { className: 'users-chat' },
        this.state.rooms.map(function (room, i) {
          return _react2.default.createElement(
            'div',
            { id: 'sc-launcher', key: i },
            _react2.default.createElement(_ChatWindow2.default, {
              index: i,
              onHideWindow: function onHideWindow() {
                return _this4._onHideWindow(room);
              },
              onUserInputSubmit: _this4._onMessageWasSent,
              onLikeMessage: _this4._onLikeMessage,
              onFilesSelected: _this4._onFilesSelected,
              _editGroup: _this4._editGroup,
              isOpen: true,
              onClose: _this4._onClose.bind(_this4),
              showEmoji: true,
              onUserTyping: _this4._onUserTyping,
              onScroll: _this4._onScroll,
              room: room,
              currentUserId: _this4.props.users.currentUser._id,
              onReplyMessage: _this4._onReplyMessage,
              onCloseReplyMessage: _this4._onCloseReplyMessage,
              currentUser: _this4.props.users.currentUser
            })
          );
        })
      ),
      _react2.default.createElement(_RoomList2.default, {
        ref: this.roomList,
        getRoomForUser: this._getRoomForUser,
        _editGroup: this._editGroup,
        _createGroup: this._createGroup,
        _openChatWindow: this._openChatWindow
      })
    );
  };

  return Chat;
}(_react.Component);

function mapStateToProps(state) {
  var users = state.users;

  return {
    users: users
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, null)(Chat);
module.exports = exports['default'];