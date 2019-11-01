import React from 'react';
import Linkify from 'react-linkify';
import Moment from 'react-moment';
import sentIcon from './../../assets/sent.png';
import sendIcon from './../../assets/sending.png';
import thumbsUpHandSymbolIcon from './../../assets/thumbs-up-hand-symbol.png';
import ReactTooltip from 'react-tooltip';

const TextMessage = (props) => {
  const renderUserLiked = (data) =>
    data.map((user, index) => {
      return (
        <li key={index}>{user.profile.fullName}</li>
      );
    });
  
  return (
  <div className={props.senderId === props.currentUserId ? 'sc-message--text' : 'sc-message--text content-message-background-left'}>{
    <Linkify properties={{ target: '_blank' }}>
      {props.parentMessage ?
        <div className="contain-reply-message">
          <img className="avatar-user-parent-message" src={props.avatarUserParentMessage} />
          <span className="content-parent-message" style={{ color: 'black' }}>{props.parentMessage ? props.parentMessage.content : ''}</span>
        </div>
        : ''}
      <div className="content-mess">
        {props.content}
      </div>
      {props.liked && props.liked.length > 0 ?
        <span data-tip data-for={"showUsersLiked_" + props._id} className="container-count-like">
          <span className="count-like-number">{props.liked.length}</span>
          <img className="count-like-img" src={thumbsUpHandSymbolIcon} />
        </span>
        : '' }
        <ReactTooltip id={"showUsersLiked_" + props._id} type='error'>
          <ul className="container-users-liked">
            {renderUserLiked(props.usersLiked)}
          </ul>
        </ReactTooltip>
    </Linkify>
  }
  <Moment className="sc-message--time" format="hh:mm A">{props.createdDate}</Moment>
  <br/>
  {props.senderId === props.currentUserId ? <img className="sc-message--icon-status" src={props.status === 1 ? sentIcon : sendIcon} alt="" /> : ''}
  </div>
  );
};

export default TextMessage;
