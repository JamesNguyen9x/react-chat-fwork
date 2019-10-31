import React, { Component } from 'react';
import ReactSVG from 'react-svg'
import closeIcon from './../assets/close.svg';
import editIcon from './../assets/pencil.png';

class Header extends Component {

  render() {
    return (
      <div onClick={this.props.onHideWindow} className="sc-header">
        <img className="sc-header--img" src={this.props.avatar} alt="" />
        <div className="sc-header--team-name"> {this.props.teamName}
        <img src={editIcon} onClick={this.props.openEditGroup} alt="edit group" /></div>
        { this.props.isHideWindow && this.props.unreadMessage ?
          <span className="sc-header--unread-message">{ this.props.unreadMessage }</span>
          : '' }
        <div className="sc-header--close-button" onClick={(e) => {
          e.stopPropagation();
          this.props.onClose();
        }}>
          <ReactSVG wrapper="span" src={closeIcon} />
        </div>
      </div>
    );
  }
}

export default Header;
