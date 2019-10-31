import React, {Component} from 'react';
import TextMessage from './TextMessage';
import EmojiMessage from './EmojiMessage';
import FileMessage from './FileMessage';

class Message extends Component {
  _renderMessageOfType(type) {
    switch (parseInt(type)) {
      case 1:
        return <TextMessage onLikeMessage={this.props.onLikeMessage} avatarUserParentMessage={this.props.avatarUserParentMessage} onReplyMessage={this.props.onReplyMessage} {...this.props.message} currentUserId={this.props.currentUserId}/>;
      case 2:
        return <EmojiMessage {...this.props.message} />;
      case 3:
        return <FileMessage {...this.props.message} />;
      default:
        console.error(`Attempting to load message with unsupported file type '${type}'`);
    }
  }

  render() {
    let contentClassList = [
      'sc-message--content',
      (this.props.message.senderId === this.props.currentUserId ? 'sent' : 'received')
    ];
    return (
      <div className="sc-message">
        <div className={contentClassList.join(' ')}>
          <div className="sc-message--avatar" style={{
            backgroundImage: `url(${this.props.avatar})`
          }}></div>
          {this._renderMessageOfType(this.props.message.type)}
        </div>
      </div>);
  }
}

export default Message;
