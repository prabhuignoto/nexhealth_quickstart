import classNames from "classnames";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import commonStyles from "../../styles/common.module.css";
import styles from "./login.module.css";

const FAILURE_MESSAGES = {
  SERVER_DOWN:
    "The API server appears to be down. Please ensure that the server is up and running.",
};

const API = process.env.REACT_APP_API;

const LoginPage = () => {
  const navigate = useNavigate();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const [failureMessage, setFailureMessage] = useState(null);

  const onLoginFailed = (message) => {
    setLoginFailed(true);
    setFailureMessage(message);
  };

  const onLoginStart = () => {
    setIsLoggingIn(true);
    setFailureMessage("");
    setLoginFailed(false);
  };

  const handleLogin = async () => {
    try {
      onLoginStart();

      const result = await fetch(`${API}/auth`, {
        method: "get",
        credentials: "include",
      });

      if (result.status === 200) {
        const data = await result.json();

        if (data.authenticated) {
          navigate("/home");
        }

        setIsLoggingIn(false);
      } else {
        onLoginFailed(FAILURE_MESSAGES.SERVER_DOWN);
        setIsLoggingIn(false);
      }
    } catch (error) {
      onLoginFailed(FAILURE_MESSAGES.SERVER_DOWN);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1>Welcome to NexHealth Appointment Booking</h1>

      <p>Please login to your account to book an appointment.</p>

      <button
        onClick={handleLogin}
        disabled={isLoggingIn}
        className={classNames(
          commonStyles.button,
          isLoggingIn ? commonStyles.disabled : null
        )}
      >
        Login
      </button>

      {loginFailed && (
        <div role="alert" className={commonStyles.error_message}>
          {failureMessage}
        </div>
      )}
    </div>
  );
};

export { LoginPage };
