import React from 'react';

const VerifyMail = (props) => {console.log(props)
  const { errorDescription } = props.location.state;
  return (
    <div style={{textAlign:"center",marginTop:"100px"}}>
      <p >{errorDescription}</p>
      <button className="verify-logoutbtn" onClick={() => props.auth.logout()}>
        back
      </button>
    </div>
  );
}

export default VerifyMail;