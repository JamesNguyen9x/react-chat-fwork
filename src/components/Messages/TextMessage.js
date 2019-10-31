import React from 'react';
import Linkify from 'react-linkify';
import TimeAgo from 'react-timeago';
import sentIcon from './../../assets/sent.png';
import sendIcon from './../../assets/sending.png';
import replyIcon from './../../assets/reply.png';
import thumbsUpIcon from './../../assets/thumbs-up.png';
import thumbsUpHandSymbolIcon from './../../assets/thumbs-up-hand-symbol.png';


const TextMessage = (props) => {
  return <div className="sc-message--text">{
    <Linkify properties={{ target: '_blank' }}>
      {props.parentMessage ?
        <div className="contain-reply-message">
          <img className="avatar-user-parent-message" src={props.avatarUserParentMessage} />
          <i className="content-parent-message" style={{ color: 'black' }}>{props.parentMessage ? props.parentMessage.content : ''}</i>
        </div>
      : ''}
      <div className="content-mess">
        {props.content}
        {props.senderId !== props.currentUserId ? <img className="like-icon" src={thumbsUpIcon} onClick={() => props.onLikeMessage(props)} href="#" /> : '' }
      </div>
      {props.senderId !== props.currentUserId ? 
        <img className="reply-icon" src={replyIcon} onClick={() => props.onReplyMessage(props)} />
        : '' }
      {props.liked && props.liked.length > 0 ?
        <span className="container-count-like">
          <span>{props.liked.length}</span>
          <img className="count-like-img" src={thumbsUpHandSymbolIcon} />
        </span>
      : '' }
    </Linkify>
  }
    <TimeAgo className="sc-message--time" date={props.createdDate} />
    <br/>
    {props.senderId === props.currentUserId ? <img className="sc-message--icon-status" src={props.status === 1 ? sentIcon : sendIcon} alt="" /> : ''}
  </div>;
};

export default TextMessage;
