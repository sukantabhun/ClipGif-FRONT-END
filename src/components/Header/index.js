import { Link, useNavigate } from 'react-router-dom';
import {image} from '../../assets'
import Cookies from 'js-cookie';
import './index.css'

const Header = () => {
  const navigate = useNavigate();

  const onClickLogout = () => {
    Cookies.remove('jwt_token');
    navigate('/login', { replace: true });
  };

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <img
          className="website-logo"
          src={image}
          alt="website logo"
        />
        <ul className="nav-menu">
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/community" className="nav-link">
              Community
            </Link>
          </li>
          <li>
            <Link to="/subscriptions" className="nav-link">
              Subscription
            </Link>
          </li>
        </ul>
        <button
          type="button"
          className="logout-desktop-btn"
          onClick={onClickLogout}
        >
          Logout
        </button>
        <button
          type="button"
          className="logout-mobile-btn"
          onClick={onClickLogout}
        >
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-log-out-img.png"
            alt="logout icon"
            className="logout-icon"
          />
        </button>
      </div>
    </nav>
  );
};

export default Header;
