import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import './App.css';
import RegistrationForm from './components/RegistrationForm';
import SubscriptionPlans from './components/Subscription';
import Community from './components/Community';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/subscriptions" element={<SubscriptionPlans />} /> 
      <Route path="/community" element={<Community />} />
    </Routes>
  </BrowserRouter>
);

export default App;
