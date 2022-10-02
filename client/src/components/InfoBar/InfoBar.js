import React from 'react';



import './InfoBar.css';

const InfoBar = ({ room }) => (
  
  <>
    <div className="infoBar">
      <div className="leftInnerContainer">
        <div className="img"></div>
        <h3>{room}</h3>
      </div>
      <div className="rightInnerContainer">
     
        <button type="submit" onClick={() => {window.location.href='/'}} className="info-btn">
          Leave Chat
        </button>
     
      </div>
    </div>
  </>
);

export default InfoBar;