import React, { Component } from 'react';
class Logout extends Component {
  render(){
    return(
      <div className="verify-view">
          <p className="verify-text">Please verify your email first to access the page</p>
          <button className="verify-logoutbtn" onClick={this.props.auth.login}>
            Login
          </button>
      </div>
    );
  }
}
export default Logout;