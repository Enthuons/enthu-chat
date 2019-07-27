import React, { Component } from 'react';

class Logout extends Component {
  render(){
    return(
      <div style={{textAlign:"center",marginTop:"100px"}}>
          <p >You are logged out</p>
          <button className="verify-logoutbtn" onClick={this.props.auth.login}>
            Login
          </button>
      </div>
    );
  }
}

export default Logout;