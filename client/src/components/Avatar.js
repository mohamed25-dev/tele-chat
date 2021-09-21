import React from 'react';
import avatar from 'assets/avatar.png';

const Avatar = (props) => {
  const src = props.src ? `uploads/${props.src}` : avatar;
  return (
    <img src={props.file || src} className="img-fluid rounded-circle ml-3 avatar" alt="user avatar" />
  )
}

export default Avatar;