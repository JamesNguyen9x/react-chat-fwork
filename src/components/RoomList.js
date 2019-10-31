import PropTypes from 'prop-types';
import React, {Component} from 'react';
import RoomInfo from './RoomInfo';
import fetchAPI from '../fetchAPI';
import update from 'react-addons-update';
import Group from './Group';
import iconCreateGroup from '../assets/create-group-icon.png';
import {DebounceInput} from 'react-debounce-input';
import UserInfo from './UserInfo';

class RoomList extends Component {
  constructor() {
    super();
    this.state = {
      openCreateGroupWindow: false,
      groupEdit: null,
      rooms: [],
      key: '',
      searchResult: {
        groups: [],
        users: []
      }
    };
  }

  componentDidMount() {
    this.getRooms();
  }

  updateLastMessage = (data, isUpdateUnread = false) => {
    let index = this.state.rooms.findIndex(room => room._id === data.roomId);
    if (index < 0) {
      if (data.room) {
        this.setState({
          rooms: [
            data.room,
            ...this.state.rooms
          ]
        });
      }
      return;
    }
    let rooms = this.state.rooms;
    rooms[index].lastMessage = data.content;
    rooms[index].lastTimeSendMessage = data.createdDate;
    if (isUpdateUnread) {
      rooms[index].unreadMessage = rooms[index].unreadMessage ? rooms[index].unreadMessage + 1 : 1;
    }
    rooms = rooms.sort(this.compareRoom);
    this.setState({
      rooms: rooms
    });
  };

  compareRoom = (a, b) =>{
    if (a.lastTimeSendMessage < b.lastTimeSendMessage){
      return 1;
    }
    if (a.lastTimeSendMessage > b.lastTimeSendMessage){
      return -1;
    }
    return 0;
  };

  addRoom = (room) => {
    this.setState({
      rooms: [
        room,
        ...this.state.rooms
      ]
    });
  };

  updateRoom = (newRoom) => {
    let index = this.state.rooms.findIndex(room => room._id === newRoom._id);
    this.setState({
      rooms: update(this.state.rooms, {
        [index]: {$set: newRoom}
      }),
    });
  };

  listenUserChangeStatus = () => {
    if (!window.socket) {
      setTimeout(() => {
        this.listenUserChangeStatus();
      }, 3000);
      return;
    }
    window.socket.on('user_change_status', data => {
      let index = this.state.usersOnline.findIndex(user => user._id === data.userId);
      if (index >= 0) {
        this.setState({
          usersOnline: update(this.state.usersOnline, {[index]: {status: {$set: data.status}}}),
        });
        return;
      }
      index = this.state.otherUsers.findIndex(user => user._id === data.userId);
      if (index >= 0) {
        this.setState({
          otherUsers: update(this.state.otherUsers, {[index]: {status: {$set: data.status}}}),
        });
      }
    });
  };

  getRooms = async () => {
    const baseURL = `${process.env.CHAT_BACKEND_URL}/api/v1/chat`;
    const url = `/rooms`;
    let response = await fetchAPI(baseURL, url, 'GET');
    this.setState({
      rooms: response.data
    });
  };

  openChatWindow = (room) => {
    let index = this.state.rooms.findIndex(rm => rm._id === room._id);
    if (index < 0) {
      this.props._openChatWindow(room);
      this.setState({
        key: '',
        searchResult: {
          groups: [],
          users: []
        }
      });
      return;
    }
    this.setState({
      key: '',
      searchResult: {
        groups: [],
        users: []
      },
      rooms: update(this.state.rooms, {
        [index]: {
          unreadMessage: {$set: 0}
        }
      }),
    });
    this.props._openChatWindow(room);
  };

  getRoomForUser = (user) => {
    this.props.getRoomForUser(user);
  };

  _openCreateGroupWindow = () => {
    this.setState({
      openCreateGroupWindow: true,
    });
  };

  handelCancerCreateGroup = () => {
    this.setState({
      openCreateGroupWindow: false,
    });
  };

  handleSearch = async (e) => {
    let key = e.target.value;
    if (!key.length) {
      this.setState({
        key: '',
        searchResult: {
          groups: [],
          users: []
        }
      });
      return;
    }
    const baseURL = `${process.env.CHAT_BACKEND_URL}/api/v1`;
    const url = `/rooms/search`;
    const params = {
      key
    };
    let response = await fetchAPI(baseURL, url, 'GET', params);
    if (response.status !== 200) {
      this.setState({
        rooms: []
      });
      return;
    }
    this.setState({
      key,
      searchResult: response.data
    });
  };

  render() {
    return (
      <div className="user-list chat">
        <div className="card mb-sm-3 mb-md-0 contacts_card">
          <div className="card-header">
            <div className="input-group">
              <img onClick={this._openCreateGroupWindow} src={iconCreateGroup} alt="Create group!"/>
              <DebounceInput
                onChange={this.handleSearch}
                minLength={2}
                debounceTimeout={300}
                placeholder="Search..."
                value={this.state.key}
              />
            </div>
          </div>
          <div className="card-body contacts_body">
            {
              this.state.key ? (
                <ul className="contacts">
                  {this.state.searchResult.rooms.map((room, i) => {
                    return <RoomInfo room={room} key={i} _openChatWindow={this.openChatWindow}/>;
                  })}
                  {this.state.searchResult.users.map((user, i) => {
                    return <UserInfo user={user} key={i} _openChatWindow={this.openChatWindow}/>;
                  })}
                </ul>
              ) : (
                <ul className="contacts">
                  {this.state.rooms.map((room, i) => {
                    return <RoomInfo room={room} key={i} _openChatWindow={this.openChatWindow}/>;
                  })}
                </ul>
              )
            }
          </div>
          );

          {this.state.openCreateGroupWindow &&
            <Group
              groupInfo={this.state.groupEdit}
              _editGroup={this.props._editGroup}
              _createGroup={this.props._createGroup}
              handleCancel={this.handelCancerCreateGroup}
              handleUpdateRoom={this.addRoom}
            />
          }
          <div className="card-footer"></div>
        </div>
      </div>
    );
  }
}

RoomList.propTypes = {
  onMessageWasReceived: PropTypes.func,
  onMessageWasSent: PropTypes.func,
  newMessagesCount: PropTypes.number,
  isOpen: PropTypes.bool,
  handleClick: PropTypes.func,
  messageList: PropTypes.arrayOf(PropTypes.object),
  mute: PropTypes.bool,
  showEmoji: PropTypes.bool,
  getRoomId: PropTypes.func
};

RoomList.defaultProps = {
  newMessagesCount: 0,
  showEmoji: true
};

export default RoomList;
