import {Component} from "react";
import React from "react";
import Emojify from 'react-emojione';

var moment = require('moment');

class Messages extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      displayData: []
   };
  }

  renderMessage = (message, i) => {
    const {name, text, time ,email} = message;
    const timeinformat = moment(time).format('hh:mm a');
    const useremail = this.props.useremail;
    const messageFromMe = (email === useremail);
    const className = messageFromMe ? "Messages-message currentMember" : "Messages-message"
    // this.state.displayData.push(message);
    // console.log(text)
    return (
      
       <div key={i}>
        <li className={className}>
        <div className="Message-content">
        <div className="textbox"> { <div className="username">{name}</div>} <br/>
        <div className="text">{<Emojify>{text}</Emojify>}</div> {<div className="time">{timeinformat}</div>}</div>
        </div></li>
      </div>
    
    );
  }
  render() {
    const {messages} = this.props;
   
    return (
      <div className="Messages-list">
        {messages.map((m, i ) => this.renderMessage(m, i))}
      </div>
    );
  }
}

export default Messages;