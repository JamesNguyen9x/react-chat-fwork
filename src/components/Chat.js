import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RoomList from './RoomList';
import socketIOClient from 'socket.io-client';
import uuid from 'uuid';
import ChatWindow from './ChatWindow';
import update from 'react-addons-update';
import fetchAPI from '../fetchAPI';
import {getToken} from '../fetchAPI/cookie';

class Chat extends Component {
  typing = false;
  timeoutStopTyping;
  isLoadingMessage = false;

  constructor(props) {
    super(props);
    this.state = {
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
    this.roomList = React.createRef();
  }

  componentDidMount() {
    this.connectSocket();
    this.getRoomsActiveFromSession();
  }

  connectSocket = async () => {
    const endpoint = process.env.SERVER_SOCKET;
    window.socket = socketIOClient(endpoint);
    let tokenJWT = getToken();
    window.socket.on('connect', () => {
      window.socket.emit('authenticate', {token: tokenJWT});
      window.socket.on('authenticated_success', () => {
        if (this.state.rooms.length > 0) {
          this.state.rooms.forEach(room => {
            window.socket.emit('join_room', room._id);
          });
        }
      });
    });
    this.listenEvent();
  };

  listenEvent = () => {
    window.socket.on('disconnect', () => {
      console.error('disconnect');
    });

    window.socket.on('user_change_status', data => {
      let index = this.state.rooms.findIndex(user => user._id === data.userId);
      if (index >= 0) {
        this.setState({
          rooms: update(this.state.rooms, {[index]: {status: {$set: data.status}}}),
        });
      }
    });

    window.socket.on('typing_message', data => {
      clearTimeout(this.timeoutStopTyping);
      if (data.roomId !== this.state.roomIdActive || data.userId === this.props.users.currentUser._id) {
        return;
      }
      const message = this.state.userActive.username + data.message;
      this.setState({
        messageSuggest: message
      });
      this.timeoutStopTyping = setTimeout(() => {
        this.setState({
          messageSuggest: ''
        });
      }, 3000);
    });

    window.socket.on('new_message', data => {
      const index = this.state.rooms.findIndex(roomActive => roomActive._id === data.roomId);
      if (index < 0) {
        return;
      }
      clearTimeout(this.timeoutStopTyping);
      this.setState({
        rooms: update(this.state.rooms, {
          [index]: {
            messageList: {$set: [...this.state.rooms[index].messageList, data]},
            messageSuggest: {$set: ''}
          },
        }),
      });
    });

    window.socket.on('new_message_liked', data => {
      const index = this.state.rooms.findIndex(roomActive => roomActive._id === data.roomId);
      if (index < 0) {
        return;
      }
      clearTimeout(this.timeoutStopTyping);
      const indexMessage = this.state.rooms[index].messageList.findIndex(mess => mess._id === data._id);
      let newListMessage = this.state.rooms[index].messageList;
      newListMessage.splice(indexMessage, 1, data);
      this.setState({
        rooms: update(this.state.rooms, {
          [index]: {
            messageList: {$set: newListMessage},
            messageSuggest: {$set: ''}
          },
        }),
      });
    });

    window.socket.on('new_message_room_off', data => {
      this.roomList.current.updateLastMessage(data, true);
      const index = this.state.rooms.findIndex(room => room._id === data.roomId);
      if (index < 0) {
        return;
      }
      let unreadMessage = this.state.rooms[index].unreadMessage ? parseInt(this.state.rooms[index].unreadMessage) : 0;
      unreadMessage++;
      this.setState({
        rooms: update(this.state.rooms, {
          [index]:
            {unreadMessage: {$set: unreadMessage}}
        })
      });
    });

  };
  setRoomsActiveToSession = () => {
    if (typeof (Storage) !== 'undefined') {
      if (!this.state.rooms.length) {
        sessionStorage.removeItem('roomIdsActive');
        return;
      }
      let roomsInfo = this.state.rooms.map(room => {
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

  getRoomsActiveFromSession = async () => {
    if (typeof (Storage) !== 'undefined') {
      let roomsInfoString = sessionStorage.getItem('roomIdsActive');
      if (!roomsInfoString) {
        return;
      }
      let roomsSessionInfo = JSON.parse(roomsInfoString);
      let roomIds = roomsSessionInfo.filter(room => !!room.roomId)
        .map(room => room.roomId);
      if (!roomIds.length) {
        return;
      }
      const baseURL = `${process.env.CHAT_BACKEND_URL}/api/v1/chat`;
      const url = `/rooms/info`;
      const params = {
        roomIds
      };
      let response = await fetchAPI(baseURL, url, 'GET', params);
      if (response.status !== 200 || !response.data.roomsInfo.length) {
        return;
      }
      let newRooms = [];
      roomsSessionInfo.forEach(roomSession => {
        let roomInfo = response.data.roomsInfo.find(room => room._id === roomSession.roomId);
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
      this.setState({
        rooms: newRooms
      }, () => {
        this.reopenRoom();
      });
    } else {
      console.error('This browser does not support session storage');
    }
  };

  reopenRoom = () => {
    this.state.rooms.forEach((room, index) => {
      if (room.isHideWindow) {
        return;
      }
      this.rejoinRoom(room, index, false);
    });
  };

  _onMessageWasSent = async (roomId, message) => {
    const index = this.state.rooms.findIndex(roomActive => roomActive._id === roomId);
    if (index < 0) {
      return;
    }
    let data = {
      content: message.content,
      roomId,
      parentMessage: message.parentMessage ? message.parentMessage._id : ''
    };
    message.status = 0;
    message.senderId = this.props.users.currentUser._id;
    message.createdDate = new Date();
    message.clientId = uuid();
    const newMessageList = [...this.state.rooms[index].messageList, message];
    this.setState({
      rooms: update(this.state.rooms, {
        [index]:
          {messageList: {$set: newMessageList}}
      })
    }, () => {
      window.socket.emit('send_message', data, result => {
        if (!result.success) {
          return;
        }
        message.status = 1;
        message.createdDate = result.message.createdDate;
        let room = this.state.rooms[index];
        let isNotInRoomList = !room.lastMessage;
        this.setState({
          rooms: update(this.state.rooms, {
            [index]:
              {
                messageList: {$set: newMessageList},
                lastMessage: {$set: message.content},
                lastTimeSendMessage: {$set: new Date()},
              }
          })
        }, () => {
          if (isNotInRoomList) {
            this.roomList.current.addRoom(this.state.rooms[index]);
          }
        });
        result.message.isOwner = true;
        this.roomList.current.updateLastMessage(result.message);
      });
    });
  };

  getMemberList = async (roomId) => {
    const baseURL = `${process.env.CHAT_BACKEND_URL}/api/v1/chat`;
    const url = `/groups/${roomId}`;
    let response = await fetchAPI(baseURL, url, 'GET');
    return response.data;
  };

  _getRoomForUser = (user) => {
    const baseURL = `${process.env.CHAT_BACKEND_URL}/api/v1/chat`;
    const url = `/rooms/for-user`;
    const params = {
      userId: user._id
    };
    fetchAPI(baseURL, url, 'GET', params).then(response => {
      if (response.data && response.data.room) {
        let room = response.data.room;
        this._openChatWindow(room);
      }
    });
  };

  _openChatWindow = (room) => {
    const roomExits = this.state.rooms.filter(roomActive => roomActive._id === room._id);
    if (roomExits.length) {
      return;
    }
    window.socket.emit('join_room', room._id);
    this.addRoom(room);
  };

  addRoom = async (room) => {
    let newRoom = {
      ...room,
      firstMessageAt: '',
      typingMessage: '',
      messageSuggest: '',
      messageList: [],
      canLoadMore: true,
      isHideWindow: false,
      unreadMessage: 0
    };
    if (room.type === 2 && !newRoom.members) {
      const roomInfo = await this.getMemberList(room._id);
      newRoom.members = roomInfo.roomUsers;
    }

    this.setState({
      rooms: [
        ...this.state.rooms,
        newRoom,
      ]
    }, () => {
      this.setRoomsActiveToSession();
      this._getMessage(room._id);
    });
  };

  _onUserTyping = () => {
    if (!this.typing) {
      this.typing = true;
      let data = {
        roomId: this.state.roomIdActive,
      };
      window.socket.emit('typing_message', data);
      setTimeout(() => {
        this.typing = false;
      }, 1000);
    }
  };

  _onLikeMessage = (mess) => {
    const message = {...mess};
    if (message) {
      const params = {
        _id: message._id,
        roomId: message.roomId
      };
      window.socket.emit('like_message', params, result => {});
      const index = this.state.rooms.findIndex(roomActive => roomActive._id === message.roomId);
      if (index < 0) {
        return;
      }
      if (message.liked.includes(this.props.users.currentUser._id)) {
        message.liked = message.liked.filter(mess => mess !== this.props.users.currentUser._id);
      } else {
        message.liked.push(this.props.users.currentUser._id);
      }
      const indexMessage = this.state.rooms[index].messageList.findIndex(mess => mess._id === message._id);
      let newListMessage = this.state.rooms[index].messageList;
      newListMessage.splice(indexMessage, 1, message);

      this.setState({
        rooms: update(this.state.rooms, {
          [index]: {
            messageList: {$set: newListMessage},
            messageSuggest: {$set: ''}
          },
        }),
      });
    }
  }

  _getMessage = (roomId, getMultiple = false) => {
    const index = this.state.rooms.findIndex(roomActive => roomActive._id === roomId);
    if (index < 0) {
      return;
    }
    let room = this.state.rooms[index];
    if (!getMultiple && (!room.canLoadMore || this.isLoadingMessage)) {
      return;
    }
    this.isLoadingMessage = true;
    let params = {
      roomId: roomId,
      firstMessageAt: room.firstMessageAt
    };
    const baseURL = `${process.env.CHAT_BACKEND_URL}/api/v1/chat`;
    const url = `${process.env.CHAT_BACKEND_URL}/api/v1/messages`;
    fetchAPI(baseURL, url, 'GET', params).then(response => {
      this.isLoadingMessage = false;
      let messages = response.data.messages;
      if (!messages.length) {
        this.setState({
          rooms: update(this.state.rooms, {
            [index]: {
              canLoadMore: {$set: false},
            }
          }),
        });
      } else {
        this.setState({
          rooms: update(this.state.rooms, {
            [index]: {
              messageList: {$set: [...messages, ...this.state.rooms[index].messageList]},
              firstMessageAt: {$set: response.data.messages[0].createdDate},
              canLoadMore: {$set: !(messages.length < 20)},
            }
          }),
        });
      }
    }).catch(err => {
      console.error('err _getMessage: ', err);
    });
  };

  _createGroup = (data) => {
    data = {...data, userId: this.props.users.currentUser._id};
    const baseURL = `${process.env.CHAT_BACKEND_URL}/api/v1/chat`;
    const url = `/groups`;

    return fetchAPI(baseURL, url, 'POST', null, data);
  };

  _editGroup = (data) => {

    const baseURL = `${process.env.CHAT_BACKEND_URL}/api/v1/chat`;
    const url = `/groups/${data.roomId}/edit`;

    return fetchAPI(baseURL, url, 'PUT', null, data).then((res) => {
      if (res.status === 200) {

        this.roomList.current.updateRoom(res.data.newRoom);
        this.updateRoom(res.data.newRoom);
      }
    });
  };

  updateRoom = (newRoom) => {
    let index = this.state.rooms.findIndex(room => room._id === newRoom._id);
    this.setState({
      rooms: update(this.state.rooms, {
        [index]: {$set: {...this.state.rooms[index], ...newRoom}}
      })
    }, () => {
      window.socket.emit('update_room', newRoom);
    });
  };

  _onScroll = (scrollTop, roomId) => {
    if (scrollTop < 100) {
      this._getMessage(roomId);
    }
  };

  _onFilesSelected = (filesList) => {
    let data = new FormData();

    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      data.append(`file${i}`, file);
    }

    const baseURL = `${process.env.CHAT_BACKEND_URL}/api/v1/chat`;
    const url = `${process.env.CHAT_BACKEND_URL}/api/v1/upload-file`;

    return fetchAPI(baseURL, url, 'POST', null, data);

  };

  _onClose(roomId) {
    let index = this.state.rooms.findIndex(room => room._id === roomId);
    if (index < 0) {
      return;
    }
    window.socket.emit('leave_room', roomId);
    const rooms = this.state.rooms.filter(room => room._id !== roomId);
    this.setState({
      rooms
    }, () => {
      this.setRoomsActiveToSession();
    });
  }

  _onHideWindow = room => {
    const index = this.state.rooms.findIndex(roomActive => roomActive._id === room._id);
    if (index < 0) {
      return;
    }
    if (this.state.rooms[index].isHideWindow) {
      this.rejoinRoom(room, index, true);
    } else {
      this.setState({
        rooms: update(this.state.rooms, {
          [index]: {
            isHideWindow: {
              $set: !this.state.rooms[index].isHideWindow
            }
          }
        }
        )
      }, () => {
        this.setRoomsActiveToSession();
      });
      window.socket.emit('leave_room', room._id);
    }
  };

  rejoinRoom = async (room, index, isSetState) => {
    window.socket.emit('join_room', room._id);
    if (room.type === 2 && !room.members) {
      const roomInfo = await this.getMemberList(room._id);
      room.members = roomInfo.roomUsers;
    }
    if (isSetState) {
      this.setState({
        rooms: update(this.state.rooms, {
          [index]: {
            isHideWindow: {
              $set: !this.state.rooms[index].isHideWindow,
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
          }
        }
        )
      }, () => {
        this._getMessage(room._id);
        this.setRoomsActiveToSession();
      });
    } else {
      this._getMessage(room._id, true);
    }
  };

  _onReplyMessage = message => {
    const index = this.state.rooms.findIndex(roomActive => roomActive._id === message.roomId);
    if (index < 0) {
      return;
    }
    this.setState({
      rooms: update(this.state.rooms, {[index]: {messageReply: {$set: message}}})
    });
  };

  _onCloseReplyMessage = (roomId) => {
    const index = this.state.rooms.findIndex(roomActive => roomActive._id === roomId);
    if (index < 0) {
      return;
    }
    this.setState({
      rooms: update(this.state.rooms, {[index]: {messageReply: {$set: ''}}})
    });
  };

  render() {
    return (
      <div>
        {this.state.rooms.length > 0 &&
        <div className="users-chat">
          {this.state.rooms.map((room, i) => {
            return <div id="sc-launcher" key={i}>
              <ChatWindow
                index={i}
                onHideWindow={() => this._onHideWindow(room)}
                onUserInputSubmit={this._onMessageWasSent}
                onLikeMessage={this._onLikeMessage}
                onFilesSelected={this._onFilesSelected}
                _editGroup={this._editGroup}
                isOpen={true}
                onClose={this._onClose.bind(this)}
                showEmoji={true}
                onUserTyping={this._onUserTyping}
                onScroll={this._onScroll}
                room={room}
                currentUserId={this.props.users.currentUser._id}
                onReplyMessage={this._onReplyMessage}
                onCloseReplyMessage={this._onCloseReplyMessage}
                currentUser={this.props.users.currentUser}
              />
            </div>;
          })}
        </div>
        }
        <RoomList
          ref={this.roomList}
          getRoomForUser={this._getRoomForUser}
          _editGroup={this._editGroup}
          _createGroup={this._createGroup}
          _openChatWindow={this._openChatWindow}
        />
      </div>
    );
  }
}

Chat.propTypes = {
  user: PropTypes.object,
};

export default Chat;
