import classNames from "classnames";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/loader";
import commonStyles from "../../styles/common.module.css";
import { FAILURE_MESSAGES } from "./failure_messages";
import styles from "./login.module.css";

const API = process.env.REACT_APP_API;

const LoginPage = () => {
  const navigate = useNavigate();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const [failureMessage, setFailureMessage] = useState(null);

  const onLoginFailed = (message) => {
    setLoginFailed(true);
    setFailureMessage(message);
    setIsLoggingIn(false);
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
        } else {
          onLoginFailed(FAILURE_MESSAGES.AUTHENTICATION_FAILED);
        }

        setIsLoggingIn(false);
      } else {
        onLoginFailed(FAILURE_MESSAGES.SERVER_DOWN);
      }
    } catch (error) {
      onLoginFailed(FAILURE_MESSAGES.SERVER_DOWN);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1>Welcome to NexHealth Appointment Booking</h1>

      <p>Please login to your account to book an appointment</p>

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

      <div className={styles.loader_wrapper}>
        {isLoggingIn ? <Loader /> : null}
      </div>

      {loginFailed && (
        <div className={styles.error_wrapper}>
          <div role="alert" className={commonStyles.error_message}>
            {failureMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export { LoginPage };
