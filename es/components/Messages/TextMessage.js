import React from 'react';
import Linkify from 'react-linkify';
// import TimeAgo from 'react-timeago';
import Moment from 'react-moment';
import sentIcon from './../../assets/sent.png';
import sendIcon from './../../assets/sending.png';
import thumbsUpHandSymbolIcon from './../../assets/thumbs-up-hand-symbol.png';

var TextMessage = function TextMessage(props) {
  return React.createElement(
    'div',
    { className: props.senderId === props.currentUserId ? 'sc-message--text' : 'sc-message--text content-message-background-left' },
    React.createElement(
      Linkify,
      { properties: { target: '_blank' } },
      props.parentMessage ? React.createElement(
        'div',
        { className: 'contain-reply-message' },
        React.createElement('img', { className: 'avatar-user-parent-message', src: props.avatarUserParentMessage }),
        React.createElement(
          'i',
          { className: 'content-parent-message', style: { color: 'black' } },
          props.parentMessage ? props.parentMessage.content : ''
        )
      ) : '',
      React.createElement(
        'div',
        { className: 'content-mess' },
        props.content
      ),
      props.liked && props.liked.length > 0 ? React.createElement(
        'span',
        { className: 'container-count-like' },
        React.createElement(
          'span',
          { className: 'count-like-number' },
          props.liked.length
        ),
        React.createElement('img', { className: 'count-like-img', src: thumbsUpHandSymbolIcon })
      ) : ''
    ),
    React.createElement(
      Moment,
      { className: 'sc-message--time', format: 'hh:mm A' },
      props.createdDate
    ),
    React.createElement('br', null),
    props.senderId === props.currentUserId ? React.createElement('img', { className: 'sc-message--icon-status', src: props.status === 1 ? sentIcon : sendIcon, alt: '' }) : ''
  );
};

export default TextMessage;