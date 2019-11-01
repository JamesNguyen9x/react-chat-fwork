import React, {Component} from 'react';
import TextMessage from './TextMessage';
import EmojiMessage from './EmojiMessage';
import FileMessage from './FileMessage';
import ImageMessage from './ImageMessage'
import replyIcon from './../../assets/reply.png';
import thumbsUpIcon from './../../assets/thumbs-up.png';

class Message extends Component {

  _renderMessageOfType(type) {
    switch (parseInt(type)) {
    case 1:
      return <TextMessage
      usersLiked={this.props.usersLiked}
      avatarUserParentMessage={this.props.avatarUserParentMessage}
      {...this.props.message}
      currentUserId={this.props.currentUserId}/>;
    case 2:
      return <EmojiMessage {...this.props.message} />;
    case 3:
      return <FileMessage {...this.props.message} />;
    case 4:
      return <ImageMessage {...this.props.message} />;
    default:
      console.error(`Attempting to load message with unsupported file type '${type}'`);
    }
  };

  render() {
    let contentClassList = [
      'sc-message--content',
      (this.props.message.senderId === this.props.currentUserId ? 'sent' : 'received')
    ];
    return (
      <div>
        {this.props.message.senderId !== this.props.currentUserId ?
          <p className="message-text-user-name">{this.props.getUserName}</p>
        : ''}
        <div className="sc-message">
          <div className={contentClassList.join(' ')}>
            <div className="sc-message--avatar" style={{
              backgroundImage: `url(${this.props.avatar})`
            }}></div>
            {this._renderMessageOfType(this.props.message.type)}
            {this.props.message.senderId !== this.props.currentUserId ?
              <span className="message-icon-event">
                <img className="like-icon" src={replyIcon} onClick={() => this.props.onReplyMessage(this.props.message)} />
                <img className="reply-icon" src={thumbsUpIcon} onClick={() => this.props.onLikeMessage(this.props.message)} />
              </span>
              : '' }
          </div>
        </div>
      </div>
    );
  }
}

export default Message;
