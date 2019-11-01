import React from 'react';
import FileIcon from './../icons/FileIcon';
import loading from '../../assets/loading-icon.svg'


const FileMessage = ({uploading, file: {name, url}}) => {
  return (!uploading || typeof uploading === 'undefined') ? (
  <a className="sc-message--file" href={url} download={name}>
    <FileIcon />
    <p>{name.length > 15 ? ('...' + name.slice(name.length - 15)) : name}</p>
  </a>
  ) : (
  <div className="sc-message--file">
    <img width={30} src={loading} alt="loading"/>
    <p>{name.length > 15 ? ('...' + name.slice(name.length - 15)) : name}</p>
  </div>
  )
};

export default FileMessage;
