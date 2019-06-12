import React, { Component } from 'react';
import Messages from "./Messages";
import Input from "./Input";
import Callback from '../Callback/Callback';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Navbar from 'react-bootstrap/Navbar'
import socketIOClient from "socket.io-client";
import ScrollToBottom from 'react-scroll-to-bottom';
var filter = /^[a-zA-Z0-9]+.+enthuons+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

class Chat extends Component {
  constructor(props) {
    super(props);
   
    this.state = {
      userDetails: {},
      messages: [],
      endpoint: "http://192.168.0.133:8081",
      email:"",
      profile:{},
      
      loading:true
    };
  }

  componentDidMount = () => {
    const socket = socketIOClient(this.state.endpoint);
    this.props.auth.getProfile((err,profile) => {
          this.setState({profile});
         this.setState({loading:false});
    })
        console.log(socket,'connected')
  }

  onSendMessage = () => {
    const messages = this.state.messages
    const { userDetails } = this.state;
    messages.push({
      id: userDetails.id,
      text: userDetails.text,
      name: userDetails.name,
      time: userDetails.time,
      email: userDetails.email    
    });
    this.setState({ messages: messages })
  }

  render() {
    if(this.state.loading){
      return <Callback  />
    }
    
    return (
      <div>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
        
        {
          filter.test(this.state.profile.name) &&
          <div>
            <header className="App-header">
              <Container>
                <Row>
                  <Col className="textalign " >
                    <h2 className="h">Enthuons Chat App</h2>
                  </Col>
                </Row>
                <Row>
                  <Col  lg={6} md={6}  xl={6} xs={8}>
                    {this.state.profile.nickname}&nbsp;
                  </Col>
                  <Col lg={6} md={6}  xl={6} xs={4}>
                      <button id= "button" className="button" onClick={this.props.auth.logout}>Logout</button> 
                  </Col>
                </Row>
              </Container>
            </header>
            <ScrollToBottom  className="scroll" >
              <Messages
                // auth = {this.props.auth}
                useremail= {this.state.profile.name}
                messages= {this.state.messages}
              />
            </ScrollToBottom>      
            <Input
              // onSendMessage={this.onSendMessage}
              auth = {this.props.auth}
              fetchUserDetails = {(userDetails) => this.setState({ userDetails }, this.onSendMessage) }  
            /> 
        </div>
        }
        {!filter.test(this.state.profile.name) && <div><h1>user should be enthuons's employee</h1></div>}
      </div>
    

    );
  }
}

export default Chat;
