import { Component } from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import './index.css';
import { image } from '../../assets';

class LoginForm extends Component {
  state = {
    email: '',
    password: '',
    errorMsg: '',
    showErrorMsg: false,
    redirectToRegister: false,
  };

  onSubmitFailure = errorMsg => {
    this.setState({
      showErrorMsg: true,
      errorMsg,
    });
  };

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, { expires: 30 });
    this.setState({ redirectToHome: true });
  };

  submitForm = async event => {
    event.preventDefault();
    const { email, password } = this.state;

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      this.onSubmitFailure('Invalid email format');
      return;
    }

    const userDetails = { email, password };
    const url = 'https://localhost:8080/login';
    const options = {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token);
    } else {
      this.onSubmitFailure(data.error_msg);
    }
  };

  onChangeEmail = event => {
    this.setState({ email: event.target.value });
  };

  onChangePassword = event => {
    this.setState({ password: event.target.value });
  };

  handleRegisterRedirect = () => {
    this.setState({ redirectToRegister: true });
  };

  renderPasswordField = () => {
    const { password } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
        />
      </>
    );
  };

  renderEmailField = () => {
    const { email } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="email">
          EMAIL
        </label>
        <input
          type="email"
          id="email"
          className="email-input-field"
          value={email}
          onChange={this.onChangeEmail}
        />
      </>
    );
  };

  render() {
    const { errorMsg, showErrorMsg, redirectToRegister, redirectToHome } = this.state;

    if (redirectToHome) {
      return <Navigate to="/" />;
    }

    if (redirectToRegister) {
      return <Navigate to="/register" />;
    }

    return (
      <div className="login-form-container">
        <img
          src={image}
          className="login-website-logo-mobile-image"
          alt="website logo"
        />
        <img
          src={image}
          className="login-image"
          alt="website login"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <h1>Welcome Back!!</h1>
          <div className="input-container">{this.renderEmailField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showErrorMsg && <p className="error-message">{errorMsg}</p>}
          <p className='font-bold'>
            New User?{' '}
          </p>
          <button type="button" onClick={this.handleRegisterRedirect} className='button-reg-log'>
            Create a new account!
          </button>      
        </form>
        
      </div>
    );
  }
}

export default LoginForm;
