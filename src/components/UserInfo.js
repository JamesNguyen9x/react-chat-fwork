import PropTypes from 'prop-types';
import React, {Component} from 'react';
import fetchAPI from '../fetchAPI'

class UserInfo extends Component {
  _openChatWindow = () => {
    this.props._openChatWindow(this.props.user)
  };

  createRoom = async () => {
    const baseURL = `${process.env.API_SERVER_SOCKET}/api/v1`;
    const url = `/rooms/for-user`;
    const params = {
      userId: this.props.user._id
    };
    let response = await fetchAPI(baseURL, url, 'GET', params);
    if (response.status !== 200) {
      return;
    }
    console.log('user info _openChatWindow');
    this.props._openChatWindow(response.data.room);
  };

  render() {
    return (
      <li className="active">
        <div className="room-info">
          <div className="img_cont cursor-pointer">
            <img src={this.props.user.profile.avatar} alt="status-icon" onClick={this.createRoom}
                 className="rounded-circle user_img"/>
            <span className={"online_icon" + (this.props.user.status === 1 ? " offline" : "")}></span>
          </div>
          <div className="user_info cursor-pointer" onClick={this.createRoom}>
            <p className="room-name">{ this.props.user.profile.fullName }</p>
          </div>
        </div>
      </li>
    );
  }
}
UserInfo.propTypes = {
  user: PropTypes.object,
};

export default UserInfo;
