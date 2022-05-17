import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API;

const LoginPage = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = React.useState(null);
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const showLoginFailMessage = useMemo(
    () => isLoggedIn !== null && !isLoggedIn,
    [isLoggedIn]
  );

  const handleLogin = useCallback(async () => {
    setIsLoggingIn(true);

    const result = await fetch(`${API}/auth`, {
      method: "get",
      credentials: "include",
    });
    const data = await result.json();

    if (data.authenticated) {
      setIsLoggedIn(true);
      navigate("/home");
    } else {
      setIsLoggedIn(false);
    }

    setIsLoggingIn(false);
  }, []);

  return (
    <div>
      <h1>Welcome to NexHealth Appointment Booking</h1>

      <p>Please login to your account to book an appointment.</p>

      <button onClick={handleLogin} disabled={isLoggingIn}>
        Login
      </button>

      {showLoginFailMessage && <div role="alert">Failed to Login.</div>}
    </div>
  );
};

export { LoginPage };

