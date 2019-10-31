import React from 'react';
import Linkify from 'react-linkify';
// import TimeAgo from 'react-timeago';
import Moment from 'react-moment';
import sentIcon from './../../assets/sent.png';
import sendIcon from './../../assets/sending.png';
import thumbsUpHandSymbolIcon from './../../assets/thumbs-up-hand-symbol.png';


const TextMessage = (props) => {
  return <div className={props.senderId === props.currentUserId ? 'sc-message--text' : 'sc-message--text content-message-background-left'}>{
    <Linkify properties={{ target: '_blank' }}>
      {props.parentMessage ?
        <div className="contain-reply-message">
          <img className="avatar-user-parent-message" src={props.avatarUserParentMessage} />
          <i className="content-parent-message" style={{ color: 'black' }}>{props.parentMessage ? props.parentMessage.content : ''}</i>
        </div>
        : ''}
      <div className="content-mess">
        {props.content}
      </div>
      {props.liked && props.liked.length > 0 ?
        <span className="container-count-like">
          <span className="count-like-number">{props.liked.length}</span>
          <img className="count-like-img" src={thumbsUpHandSymbolIcon} />
        </span>
        : '' }
    </Linkify>
  }
  {/* <TimeAgo className="sc-message--time" date={props.createdDate} /> */}
  <Moment className="sc-message--time" format="hh:mm A">{props.createdDate}</Moment>
  <br/>
  {props.senderId === props.currentUserId ? <img className="sc-message--icon-status" src={props.status === 1 ? sentIcon : sendIcon} alt="" /> : ''}
  </div>;
};

export default TextMessage;
