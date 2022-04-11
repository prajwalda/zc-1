import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
import '../Styles/Home.css'
import Modal from 'react-modal';
import GoogleLogin from 'react-google-login';

const customStyles = {
  content: {
      position: 'absolute',
      inset: '50% auto auto 50%',
      border: '1px solid brown',
      background: 'white',
      overflow: 'auto',
      borderRadius: '4px',
      outline: 'none',
      padding: '20px',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: "244px",
      height: '200px'
  },
};

class Header extends Component {
  constructor() {
    super();
    this.state = {
        loginModalIsOpen: false,
        isLoggedIn: false,
        userName: undefined
    }
}

handleNavigate = () => {
  this.props.history.push('/');
}

handleModal = (state, value) => {
  this.setState({ [state]: value });
}

responseGoogle = (response) => {
  this.setState({ isLoggedIn: true, userName: response.profileObj.name, loginModalIsOpen: false });
}

handleLogout = () => {
  this.setState({ isLoggedIn: false, userName: undefined });
}
  render() {
    const { loginModalIsOpen, isLoggedIn , userName } = this.state;
    return (
      <div className={this.props.class}>
        <div className="row text-end py-4 login-signup-row">
          <div className="col-2 col-sm-2 col-md-7" />
          {isLoggedIn ? <div className="header-user"> 
            <a className="login" href="#">{userName}</a>
            <a className="createacc" href="#" onClick={this.handleLogout}>Logout</a>
          </div> :
            <div className="header-user">
              <a className="login" href="#" onClick={() => this.handleModal('loginModalIsOpen', true)}>Login</a>
              <a className="createacc" href="#">Create an account</a>
            </div> }
        </div>
        <Modal
            isOpen={loginModalIsOpen}
            style={customStyles}
        >
            <div>
                  <button className='btn btn-primary'>Login with Credentails</button>
                  <div>
                      <GoogleLogin
                          clientId="943281626600-5qs9dqt4f9a8b7qd3svn2qjhdir3fuil.apps.googleusercontent.com"
                          buttonText="Continue with Gmail"
                          onSuccess={this.responseGoogle}
                          onFailure={this.responseGoogle}
                          cookiePolicy={'single_host_origin'}
                      />
                  </div>
            </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Header);
