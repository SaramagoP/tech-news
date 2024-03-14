import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark, faEye } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'antd';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../reducers/user';
import { removeAllBookmarks } from '../reducers/bookmarks';
import { unhideArticles } from '../reducers/hiddenArticles';

function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [date, setDate] = useState('2050-11-22T23:59:59');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState('');

  // signup states
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // signin states
  const [signinUsername, setSigninUsername] = useState('');
  const [signinPassword, setSigninPassword] = useState('');

  useEffect(() => {
    setDate(new Date());
  }, []);

  const showModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleRegister = () => {
    // Check if the password is strong enough before sending the request
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/;

    if (regex.test(signupPassword)) {
      // If the password is strong enough, send the request
      fetch('https://tech-news-be.vercel.app/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: signupUsername,
          password: signupPassword,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            dispatch(login({ username: signupUsername, token: data.token }));
            setIsModalVisible(false);
          }
          setSignupUsername('');
          setSignupPassword('');
        });
    } else {
      // If the password is not strong enough, set an error message
      setError('Password must be stronger');
    }
  };

  const handleConnect = () => {
    fetch('https://tech-news-be.vercel.app/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: signinUsername,
        password: signinPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          dispatch(login({ username: signinUsername, token: data.token }));
          setIsModalVisible(false);
        }
        setSigninUsername('');
        setSigninPassword('');
      });
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(removeAllBookmarks());
    setIsModalVisible(false);
  };

  let modalContent;
  if (!user.token) {
    modalContent = (
      <div className={styles.registerContainer}>
        <div className={styles.registerSection}>
          <p>Sign-up</p>
          <input
            type="text"
            placeholder="Username"
            id="signUpUsername"
            onChange={(e) => setSignupUsername(e.target.value)}
            value={signupUsername}
          />
          <input
            type="password"
            placeholder="Password"
            id="signUpPassword"
            onChange={(e) => setSignupPassword(e.target.value)}
            value={signupPassword}
          />
          <p>{error}</p>
          <button onClick={() => handleRegister()} id="register">
            Register
          </button>
        </div>
        <div className={styles.registerSection}>
          <p>Sign-in</p>
          <input
            type="text"
            placeholder="Username"
            id="signInUsername"
            onChange={(e) => setSigninUsername(e.target.value)}
            value={signinUsername}
          />
          <input
            type="password"
            placeholder="Password"
            id="signInPassword"
            onChange={(e) => setSigninPassword(e.target.value)}
            value={signinPassword}
          />
          <button onClick={() => handleConnect()} id="connection">
            Connect
          </button>
        </div>
      </div>
    );
  }

  let userSection;

  if (user.token) {
    userSection = (
      <div className={styles.logoutSection}>
        <p>
          Welcome, {user.username[0].toUpperCase() + user.username.slice(1)} 👋🏼/
        </p>
        <button onClick={() => handleLogout()}>Logout</button>
        <FontAwesomeIcon
          icon={faEye}
          onClick={() => dispatch(unhideArticles())}
          className={styles.unhideIcon}
        />
      </div>
    );
  } else {
    if (isModalVisible) {
      userSection = (
        <div className={styles.headerIcons}>
          <FontAwesomeIcon
            onClick={showModal}
            className={styles.userSection}
            icon={faXmark}
          />
          <FontAwesomeIcon
            icon={faEye}
            onClick={() => dispatch(unhideArticles())}
            className={styles.unhideIcon}
          />
        </div>
      );
    } else {
      userSection = (
        <div className={styles.headerIcons}>
          <FontAwesomeIcon
            onClick={showModal}
            className={styles.userSection}
            icon={faUser}
          />
          <FontAwesomeIcon
            icon={faEye}
            onClick={() => dispatch(unhideArticles())}
            className={styles.unhideIcon}
          />
        </div>
      );
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Moment className={styles.date} date={date} format="MMM Do YYYY" />
        <h1 className={styles.title}>Tech News</h1>
        {userSection}
      </div>

      <div className={styles.linkContainer}>
        <Link href="/" className={styles.link}>
          Articles
        </Link>
        <Link href="/bookmarks" className={styles.link}>
          Bookmarks
        </Link>
      </div>

      {isModalVisible && (
        <div id="react-modals">
          <Modal
            getContainer="#react-modals"
            className={styles.modal}
            visible={isModalVisible}
            closable={false}
            footer={null}
          >
            {modalContent}
          </Modal>
        </div>
      )}
    </header>
  );
}

export default Header;
