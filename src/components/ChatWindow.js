import PropTypes from 'prop-types';
import React, { Component } from 'react';
import MessageList from './MessageList';
import UserInput from './UserInput';
import Header from './Header';
import Group from './Group';
import TimeAgo from 'react-timeago';
import closeIconBlack from './../assets/close-black-icon.png';
import replyIcon from './../assets/reply-blue.png';

class ChatWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openEditGroup: false,
      groupInfo: null
    };
  }

  onUserInputSubmit(message) {
    this.props.onUserInputSubmit(this.props.room._id, message);
  }

  onUserTyping() {
    this.props.onUserTyping();
  }

  onScroll(scrollTop) {
    this.props.onScroll(scrollTop, this.props.room._id);
  }

  onFilesSelected(filesList, callback) {
    this.props.onFilesSelected(this.props.index, this.props.room._id, filesList, callback);
  }

  onClose() {
    this.props.onClose(this.props.room._id);
  }

  onHideWindow() {
    this.props.onHideWindow();
  }

  onCloseReplyMessage = () => {
    this.props.onCloseReplyMessage(this.props.room._id);
  }

  getAvatarMember = () => {
    const { members, messageReply } = this.props.room;
    if (this.props.room.type === 2) {
      if (messageReply) {
        const user = members.filter(member => member.userInfo._id === messageReply.senderId)[0];
        return user.userInfo.profile.avatar;
      }
    }
    return this.props.room.avatarUrl;
  }

  handleOpenEditGroup = () => {
    this.setState({
      openEditGroup: true
    });
  };

  handleCancelEditGroup = () => {
    this.setState({
      openEditGroup: false
    });
  };

  render() {
    let classList = [
      'sc-chat-window',
      (this.props.room.isHideWindow ? 'hide-window' : '')
    ];
    return (
      <div style={ this.props.isHideWindow ? {height: '80px'} : {} } className={classList.join(' ')}>
        {(this.props.room.type === 2 && this.state.openEditGroup) && <Group
          groupInfo={this.props.room}
          _editGroup={this.props._editGroup}
          currentUserId={this.props.currentUserId}
          handleCancel={this.handleCancelEditGroup}
          handleUpdateRoom={this._handleUpdateRoom}
        />}

        <Header
          openEditGroup={this.handleOpenEditGroup}
          onHideWindow={this.onHideWindow.bind(this)}
          isHideWindow={this.props.room.isHideWindow}
          unreadMessage={this.props.room.unreadMessage}
          teamName={this.props.room.name}
          avatar={this.props.room.avatarUrl}
          onClose={this.onClose.bind(this)}
        />
        <MessageList
          isHideWindow={this.props.room.isHideWindow}
          onScroll={this.onScroll.bind(this)}
          messages={this.props.room.messageList}
          room={this.props.room}
          avatar={this.props.room.avatarUrl}
          currentUserId={this.props.currentUserId}
          onReplyMessage={this.props.onReplyMessage}
          currentUser={this.props.currentUser}
          onLikeMessage={this.props.onLikeMessage}
          members={this.props.room.members}
        />
        <div className="message-suggest"><i>{this.props.room.messageSuggest}</i></div>
        {this.props.room.messageReply ?
          <div>
            <img src={replyIcon} className="icon-blue-reply"/>
            <div>{this.props.room.messageReply.content ?
              <div className="message-reply-content">
                <div className="sc-message--avatar avatar-reply" style={{
                  backgroundImage: `url(${this.getAvatarMember()})`
                }}></div>
                <div className="text-message-parent">
                  {this.props.room.messageReply.content}
                  <TimeAgo className="reply-message-time-send" date={this.props.room.messageReply.createdDate} />
                </div>
              </div> : ''}
            <div className="message-reply-close-icon" onClick={this.onCloseReplyMessage}>
              <img src={closeIconBlack} alt="" />
            </div>
            </div></div> : ''}
        <div className="message-suggest"><i>{this.props.room.messageSuggest}</i></div>
        <UserInput
          isHideWindow={this.props.room.isHideWindow}
          onSubmit={this.onUserInputSubmit.bind(this)}
          onTyping={this.onUserTyping.bind(this)}
          onFilesSelected={this.onFilesSelected.bind(this)}
          showEmoji={true}
          messageReply={this.props.room.messageReply}
          onCloseReplyMessage={this.onCloseReplyMessage}
        />
      </div>
    );
  }
}

ChatWindow.propTypes = {
  room: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFilesSelected: PropTypes.func,
  onScroll: PropTypes.func,
  onUserTyping: PropTypes.func,
  onUserInputSubmit: PropTypes.func.isRequired,
  currentUserId: PropTypes.string,
};

export default ChatWindow;
