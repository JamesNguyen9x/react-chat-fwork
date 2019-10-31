import React from 'react';

var EmojiMessage = function EmojiMessage(props) {
  return React.createElement(
    "div",
    { className: "sc-message--emoji" },
    props.content
  );
};

export default EmojiMessage;