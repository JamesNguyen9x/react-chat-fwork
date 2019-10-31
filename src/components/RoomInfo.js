import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Moment from 'react-moment';
import momentjs from 'moment';

class RoomInfo extends Component {
  _openChatWindow = () => {
    this.props._openChatWindow(this.props.room);
  };

  renderLastTimeSendMessage = () => {
    let format = 'DD/MM/YY';
    let lastTime = momentjs(this.props.room.lastTimeSendMessage);
    let startOfWeek = momentjs().startOf('week').add(1, 'day');
    if (!lastTime.isBefore(momentjs(), 'day')) {
      format = 'hh:mm A';
    } else if (!lastTime.isBefore(startOfWeek, 'day')) {
      format = 'ddd';
    }
    return (
      <Moment format={format}>{this.props.room.lastTimeSendMessage}</Moment>
    );
  };

  render() {
    return (
      <li className="active">
        <div className="room-info">
          <div className="img_cont cursor-pointer">
            <img src={this.props.room.avatarUrl} alt="status-icon" onClick={this._openChatWindow}
              className="rounded-circle user_img"/>
            <span className={'online_icon' + (this.props.room.status === 1 ? ' offline' : '')}></span>
          </div>
          <div className="user_info cursor-pointer" onClick={this._openChatWindow}>
            <p className="room-name">{ this.props.room.name }</p>
            <p className="last-message">{ this.props.room.lastMessage}</p>
          </div>
          <div className="more-info">
            { this.renderLastTimeSendMessage() }
            { this.props.room.unreadMessage ? (
              <span className="room-info--unread-message">{this.props.room.unreadMessage}</span>
            ) : null
            }
          </div>
        </div>
      </li>
    );
  }
}
RoomInfo.propTypes = {
  room: PropTypes.object,
};

export default RoomInfo;
