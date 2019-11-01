import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SendIcon from './icons/SendIcon';
import FileIcon from './icons/FileIcon';
import EmojiIcon from './icons/EmojiIcon';
import PopupWindow from './popups/PopupWindow';
import EmojiPicker from './emoji-picker/EmojiPicker';

import fileIcon from '../assets/file.png';

class UserInput extends Component {
  constructor() {
    super();
    this.state = {
      inputActive: false,
      inputHasText: false,
      emojiPickerIsOpen: false,
      emojiFilter: '',
      files: [] 
    };
  }

  componentDidMount() {
    this.emojiPickerButton = document.querySelector('#sc-emoji-picker-button');
  }

  handleKeyDown(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      return this._submitText(event);
    } else {
      this.props.onTyping();
    }
  }

  handleKeyUp(event) {
    const inputHasText = event.target.innerHTML.length !== 0 &&
      event.target.innerText !== '\n'
      console.log('inputHasText', event.target.innerHTML)
    this.setState({ inputHasText });
  }

  _showFilePicker() {
    this._fileUploadButton.click();
  }

  toggleEmojiPicker = (e) => {
    e.preventDefault();
    if (!this.state.emojiPickerIsOpen) {
      this.setState({ emojiPickerIsOpen: true });
    }
  };

  closeEmojiPicker = (e) => {
    if (this.emojiPickerButton.contains(e.target)) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.setState({ emojiPickerIsOpen: false });
  };

  _submitText(event) {
    const { messageReply } = this.props;
    event.preventDefault();
    const text = this.userInput.textContent;

    if (this.state.files.length > 0) {
      this.props.onFilesSelected(this.state.files, () => {
        if (text && text.length > 0) {
          console.log('hastext')
          this.props.onSubmit({
            type: 1,
            content: text
          });
        }
      })
    this.setState({
      files: []
    })
    this.userInput.innerHTML = '';
    this._fileUploadButton.value = ''
    return
    }

    if (text && text.length > 0) {
      let data = {
        type: 1,
        content: text
      };
      if (messageReply && messageReply._id) {
        data.parentMessage = messageReply;
      }
      this.props.onSubmit(data);
      this.props.onCloseReplyMessage();
      this.userInput.innerHTML = '';
    }
  }

  _onFilesSelected({target: {files}}) {
    let listFileName = this.state.files.map(file => file.name)
    let fileList = Array.from(files).filter(file => !listFileName.includes(file.name))
    if (files && files.length > 0) {
      this.userInput.focus()

      let listFileImage = fileList.filter(file => this._isImage(file.type))
      let listFile = fileList.filter(file => !this._isImage(file.type))

      Promise.all(listFileImage.map(file => {
        return this._getBase64(file)
      })).then(data => {
        let newFiles = this.state.files.concat([...data, ...listFile])
        this.setState({
          files: newFiles
        })
      })
    }
    this._fileUploadButton.value = ''
  }

  _onDeleteFileChecked = (index) => {
    let newFiles = this.state.files
    newFiles.splice(index,1)
    this.setState({
      files: newFiles
    })
  }

  _handleEmojiPicked = (emoji) => {
    this.setState({ emojiPickerIsOpen: false });
    if(this.state.inputHasText) {
      this.userInput.innerHTML += emoji;
    } else {
      this.props.onSubmit({
        type: 2,
        content: emoji
      });
    }
  };

  handleEmojiFilterChange = (event) => {
    const emojiFilter = event.target.value;
    this.setState({ emojiFilter });
  };

  _renderEmojiPopup = () => (
    <PopupWindow
      isOpen={this.state.emojiPickerIsOpen}
      onClickedOutside={this.closeEmojiPicker}
      onInputChange={this.handleEmojiFilterChange}
    >
      <EmojiPicker
        onEmojiPicked={this._handleEmojiPicked}
        filter={this.state.emojiFilter}
      />
    </PopupWindow>
  );

  _isImage = (type) => {
    return (/^image\/(gif|jpg|jpeg|tiff|png)$/g).test(type)
  }

  _getBase64 = (img) => {
    const reader = new FileReader();
    return new Promise(function(resolve, reject) { 
      reader.addEventListener('load', () => {
        img.url = reader.result
        resolve(img)
      });
      reader.readAsDataURL(img);
    } );
  }

  _renderSendOrFileIcon() {
    return (
      <div>
        <div className={`sc-user-input--button ${!this.state.inputHasText && 'd-none'}`}>
        <SendIcon onClick={this._submitText.bind(this)} />
        </div>
        <div className={`sc-user-input--button ${this.state.inputHasText && 'd-none'}`}>
          <FileIcon onClick={this._showFilePicker.bind(this)} />
          <input
            id="fileUpload"
            type="file"
            name="files[]"
            multiple
            ref={(e) => { this._fileUploadButton = e; }}
            onChange={this._onFilesSelected.bind(this)}
          />
        </div>
      </div>
    );
  }

  render() {
    const { emojiPickerIsOpen, inputActive } = this.state;
    return (
      <div className={`sc-user-input ${(inputActive ? 'active' : '')}`}>
         <div className="list-file-selectd">
           {this.state.files.map((file, index) => this._isImage(file.type) ?
              (<div className="file-img" key={index}>
                <img src={file.url} alt={file.name}/>
                <p 
                onClick={this._onDeleteFileChecked.bind(null, index)} 
                className="delete-file"
              >x</p>
              </div>) :
              (<div key={index} className="file-item">
              <img src={fileIcon} alt="file icon"/>
              <div className="file-infor">
                <p className="file-name">{file.name.length > 12 ? ('...' + file.name.slice(file.name.length - 12)) : file.name}</p>
              </div>
              <p 
                onClick={this._onDeleteFileChecked.bind(null, index)} 
                className="delete-file"
              >x</p>
            </div>)
              )}
          </div>
        <form 
          style={ this.props.isHideWindow ? {display: 'none'} : {} } 
        >
          <div
            role="button"
            tabIndex="0"
            onFocus={() => { this.setState({ inputActive: true }); }}
            onBlur={() => { this.setState({ inputActive: false }); }}
            ref={(e) => { this.userInput = e; }}
            onKeyDown={this.handleKeyDown.bind(this)}
            onKeyUp={this.handleKeyUp.bind(this)}
            contentEditable="true"
            placeholder="Write a reply..."
            className="sc-user-input--text"
          >
          </div>
          <div className="sc-user-input--buttons">
            <div className="sc-user-input--button">
              {this.props.showEmoji && <EmojiIcon
                onClick={this.toggleEmojiPicker}
                isActive={emojiPickerIsOpen}
                tooltip={this._renderEmojiPopup()}
              />}
            </div>
            {this._renderSendOrFileIcon()}
          </div>
        </form>
      </div>
    );
  }
}

UserInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onFilesSelected: PropTypes.func.isRequired,
  showEmoji: PropTypes.bool
};

export default UserInput;
