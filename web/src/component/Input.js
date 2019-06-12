import {Component} from "react";
import React from "react";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart';
import Emojify from 'react-emojione';
import Files from 'react-files';
import attachment from '../images/attachment.png';
// import { API_URL } from '../uploadFile';
const JSON = require('circular-json');
const io = require('socket.io-client');
const socket = io('http://192.168.0.133:8081');
var user;

const styles = {
  getEmojiButton: {
    border: 'none',
    margin: 0,
    cursor: 'pointer',
    fontSize: '27px',
  },
  emojiPicker: {
   position: 'absolute',
   bottom: 10,
  marginLeft:'10px',
   cssFloat: 'left',
   marginBottom: '30px',
 }
}

class Input extends Component {
  constructor(props){
    super(props);
    this.state = {
      text: '',
      showEmojis: false,
      profile:{},
      loading:"",
      emoji:{},
      file:'',
      haserror:false,
      uploading: false,
      images: []
    }
    socket.on('chat message', (msg) => {
      user = {
        name: msg.name,
        text: msg.message,
        id: msg.id,
        time: msg.date,
        email: msg.email
      }
      this.setState({loading:false})
      this.props.fetchUserDetails(user);
    })
    this.onFilesError = this.onFilesError.bind(this);
    this.onFilesChange = this.onFilesChange.bind(this);
  }

  componentDidMount() {
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile }, () => console.log(this.state.profile));
      });
    } else {
      this.setState({ profile: userProfile });
    }
  }

  onChange(e) { 
    this.setState({[e.target.name]: (e.target.value)});
  }
  onSubmit(e) {
    e.preventDefault();
    const { nickname, name, sub } = this.state.profile;
    const msgData = {
      name : nickname,
      email : name,
      id : sub,
      date : new Date().getTime(),
      message : this.state.text
    }
    socket.emit('chat message', msgData);
    fetch('http://localhost/ChatAppbackend/msg_to_database.php', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name:name,message:this.state.text,date:new Date(),file:this.state.file})
    })
    .then(res =>console.log("response",res))
    .catch(e =>console.log("error",e) )
    this.setState({loading:true})
    this.setState({text: ""});
  } 
  
  addEmoji = (e) => {
    console.log(e)
    if (e.unified.length <= 5){
      let emojiPic = String.fromCodePoint(`0x${e.unified}`);
      // console.log(emojify(emojiPic))
     return(
      this.setState({
        text: this.state.text +  emojiPic
      })
     )
    }else {
      let sym = e.unified.split('-')
      let codesArray = []
      sym.forEach(el => codesArray.push('0x' + el))
      let emojiPic = String.fromCodePoint(...codesArray)
      this.setState({
        text: this.state.text + emojiPic
      })
    }
  }
  showEmojis = (e) => {
    this.setState({showEmojis: true}, () => document.addEventListener('click', this.closeMenu))
  }
  closeMenu = (e) => {
    if (this.emojiPicker !== null && !this.emojiPicker.contains(e.target)) {
    this.setState({showEmojis: false}, () => document.removeEventListener('click', this.closeMenu))
    }
  }
  onFilesChange (files) {
    // const formData = new formData();
    if(!this.state.haserror)
    {
    // fetch(`http://localhost/ChatAppbackend/uploadfile.php`, {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'fileType',
    //   },
    //   body: JSON.stringify({files:files,name:files[0].name})
    // })
    // .then(res =>console.log("response",res))
    // .then(e =>console.log(e));
    let reader = new FileReader();
    let file = files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file);
  
      this.setState({
          text:this.state.text + files[0].name
      });
      this.setState({
        file:files[0].preview.url
      });
    }
    console.log(files);
  }
  onFilesError (error, file) {
    console.log('error code ' + error.code + ': ' + error.message);
    this.setState({haserror: true});
  }
  render() {
    return (  
      <div >
       {this.state.haserror && <div><span className="error"  >file is too large...</span></div>}
        <Container >
          <Row>
            <Col lg={1} xs={2} md={2}>
            {
            this.state.showEmojis ?
              <span style={styles.emojiPicker} ref={el => (this.emojiPicker = el)}>
                <Picker  onSelect={this.addEmoji} style={{ width:'300px',position:'relative', zIndex:'2'}} />
              </span>
            :
              <p style={styles.getEmojiButton} onClick={this.showEmojis} >
              <Emojify>{String.fromCodePoint(0x1f60a)}</Emojify>
              </p>
          }
          </Col><Col lg={9} md={8} xs={10}>
          <Form onSubmit={e => this.onSubmit(e)} >
          <Row>
                      <Col >
          <Form.Control 
            onChange={e => this.onChange(e)}
            value={this.state.text}
            type="text"
            name="text"
            placeholder="Type Here"
          />
          </Col >
          <Col>
          <Files
          
          className='files-dropzone'
          onChange={this.onFilesChange}
          onError={this.onFilesError}
          accepts={['image/png', '.pdf', 'audio/*']}
          multiple={false}
          maxFiles={2}
          maxFileSize={1024*150}
          minFileSize={0}
          clickable
        >
          <img src={ attachment} height="30px" width="30px" border="color:red" alt="attach"></img>
        </Files></Col>
          <Col>
          {!this.state.loading ? <button type="submit"  disabled={!this.state.text}>Send</button> : <div><p>&nbsp;sending...</p></div>}
          </Col> </Row>

           </Form></Col>
           </Row>
        </Container>
       
      </div>
    );
  }
}
export default Input;