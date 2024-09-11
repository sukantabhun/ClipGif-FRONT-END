import { Component } from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import './index.css';
import { image } from '../../assets';

class RegistrationForm extends Component {
  state = {
    email: '',
    password: '',
    confirmPassword: '',
    errorMsg: '',
    showErrorMsg: false,
    navigateToLogin: false,
    navigateToSub: false,
  };

  onSubmitFailure = errorMsg => {
    this.setState({
      showErrorMsg: true,
      errorMsg,
    });
  };
  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, { expires: 30 });
    this.setState({navigateToSub: true})
  };

  submitForm = async event => {
    event.preventDefault();
    const { email, password, confirmPassword } = this.state;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      this.onSubmitFailure('Invalid email format');
      return;
    }

    if (password !== confirmPassword) {
      this.onSubmitFailure('Passwords do not match');
      return;
    }

    const userDetails = { email, password };
    const url = 'http://localhost:8080/register'; 
    const options = {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token);
      console.log(data.jwt_token)
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

  onChangeConfirmPassword = event => {
    this.setState({ confirmPassword: event.target.value });
  };

  handleLoginRedirect = () => {
    this.setState({ navigateToLogin: true });
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

  renderConfirmPasswordField = () => {
    const { confirmPassword } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="confirmPassword">
          CONFIRM PASSWORD
        </label>
        <input
          type="password"
          id="confirmPassword"
          className="password-input-field"
          value={confirmPassword}
          onChange={this.onChangeConfirmPassword}
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
    const { errorMsg, showErrorMsg, navigateToLogin, navigateToSub} = this.state;

    if(navigateToLogin){
        return <Navigate to="/login"/>
    }

    if(navigateToSub){
      return <Navigate to='/subscriptions'/>
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
          alt="website registration"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <h1>Please Register</h1>
          <div className="input-container">{this.renderEmailField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <div className="input-container">{this.renderConfirmPasswordField()}</div>
          <button type="submit" className="login-button">
            Register
          </button>
          {showErrorMsg && <p className="error-message">{errorMsg}</p>}
          <p className='font-bold'>
                Already have an account?
           </p> 
            <button type="button" onClick={this.handleLoginRedirect} className='button-reg-log'>
                Login
            </button>
        </form>
      </div>
    );
  }
}

export default RegistrationForm;
