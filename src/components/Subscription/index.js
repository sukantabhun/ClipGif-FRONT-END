import React, { Component } from 'react';
import Cookies from 'js-cookie'
import './index.css';
import { Navigate } from 'react-router-dom';

class SubscriptionPlans extends Component {
  state = {
    selectedPlan: null,
    proceedToHome: false,
  };

  handleSelectPlan = (plan) => {
    this.setState({ selectedPlan: plan });
  };

  onClickPaymentButton = async () => {
    const {jwtToken} = Cookies.get('jwt_token')
    const {selectedPlan} = this.state
    const options = {
      method: 'POST',
      headers: {
        authorization : `Bearer ${jwtToken}`
      },
      body: {
        plan: selectedPlan
      }
    }

    const response = await fetch('http://localhost:8080/api/updateSubscription',options)
    console.log(response)
    if (response.ok) {
    this.setState({proceedToHome: true})
    }
    console.log('Payment Successfull')
    this.setState({ proceedToHome: true });
  }

  onClickProceedButton = () =>{
    this.setState({ proceedToHome: true });
  }

  render() {
    const { selectedPlan, proceedToHome  } = this.state;

    if(proceedToHome){
      return <Navigate to="/"/>
    }
    return (
      <div className="subscription-plans">
        <h1 className="sub-heading">Choose Your Subscription Plan</h1>
        <div className="plan-list">
          <div
            className={`plan ${selectedPlan === 'free' ? 'selected' : ''}`}
            onClick={() => this.handleSelectPlan('free')}
          >
            <h1>Basic Plan</h1>
            <p className='text'>Free</p>
            <ul>
              <li>Access to a limited library of GIFs</li>
              <li>View and share GIFs</li>
              <li>Basic search functionality</li>
              <li>Daily download limit: 5 GIFs</li>
            </ul>
          </div>
          <div
            className={`plan ${selectedPlan === 'premium' ? 'selected' : ''}`}
            onClick={() => this.handleSelectPlan('premium')}
          >
            <h2>Premium Plan</h2>
            <p className='text'>$9.99/month or $99.99/year</p>
            <ul>
              <li>Full library access, including premium GIFs</li>
              <li>Enhanced search with advanced filters</li>
              <li>Unlimited downloads with higher quality options</li>
              <li>Priority support and early access to new features</li>
            </ul>
          </div>
        </div>
        {selectedPlan && (
          <div className="plan-details">
            <h3>Selected Plan: {selectedPlan === 'free' ? 'Basic Plan' : 'Premium Plan'}</h3>
            {selectedPlan === 'free' ? (
              <button type='button' className="subsc-button" onClick={this.onClickProceedButton}>
                Proceed
              </button>
            ) : (
              <button type='button' className="subsc-button" onClick={this.onClickPaymentButton}>
                Continue to Payment
              </button>
            )}

          </div>
        )}
      </div>
    );
  }
}

export default SubscriptionPlans;
