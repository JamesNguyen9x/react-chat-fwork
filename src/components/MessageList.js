import React, { Component } from 'react';
import Message from './Messages';

class MessageList extends Component {
  prevScrollHeight = 0;
  componentDidUpdate(_prevProps, _prevState) {
    let propLastMessages = this.props.messages[this.props.messages.length -1];
    let _prevPropLastMessage = _prevProps.messages[_prevProps.messages.length -1];
    if ((!_prevPropLastMessage && !propLastMessages) || !propLastMessages) {
      return;
    }
    if ((!_prevPropLastMessage && propLastMessages) || propLastMessages.clientId !== _prevPropLastMessage.clientId ||
      propLastMessages._id !== _prevPropLastMessage._id) {
      this.scrollList.scrollTop = this.scrollList.scrollHeight;
    } else if (this.props.messages.length > _prevProps.messages.length && _prevProps.messages.length > 0) {
      this.scrollList.scrollTop = this.scrollList.scrollHeight - this.prevScrollHeight;
    }
    this.prevScrollHeight = this.scrollList.scrollHeight;
  };

  handleScroll = () => {
    this.props.onScroll(this.scrollList.scrollTop);
  };

  getAvatarMember = (message) => {
    if (this.props.room.type === 1) {
      const currentUser = this.props.currentUser;
      if (currentUser && currentUser.profile) {
        if (currentUser._id === message.senderId) {
          return currentUser.profile.avatar;
        }
      }
      return this.props.room.avatarUrl;
    }
    const { members } = this.props.room;
    const member = members.filter(member => message.senderId === member.userInfo._id)[0];
    if (member) {
      return member.userInfo.profile.avatar;
    }
    return '';
  };

  render() {
    return (
      <div style={ this.props.isHideWindow ? {display: 'none'} : {} } className="sc-message-list" ref={el => this.scrollList = el} onScroll={this.handleScroll}>
        {this.props.messages.map((message, i) => {
          return <Message onLikeMessage={this.props.onLikeMessage} message={message} avatarUserParentMessage={message.parentMessage ? this.getAvatarMember(message.parentMessage) : ''} onReplyMessage={this.props.onReplyMessage} avatar={this.getAvatarMember(message)} currentUserId={this.props.currentUserId} key={i} />
          })}
      </div>
    );
  }
}

export default MessageList;
