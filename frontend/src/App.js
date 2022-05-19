import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import "./App.css";
import { Loader } from "./components/loader";
import { Home } from "./pages/home/home";
import { Logout } from "./pages/home/logout";
import { LoginPage } from "./pages/login/login";
import { FAILURE_MESSAGES } from "./messages.js";
import { locationsState } from "./state";
import commonStyles from "./styles/common.module.css";
import { getData } from "./utils";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authFailed, setAuthFailed] = useState(false);
  const [failedMessage, setFailedMessage] = useState("");

  const setLocations = useSetRecoilState(locationsState);

  const navigation = useNavigate();

  useEffect(() => {
    const check = async () => {
      try {
        const result = await getData(
          `${process.env.REACT_APP_API}/auth/is-authenticated`
        );

        const response = await result.json();

        if (response && response.authenticated) {
          const locations = await getData(
            `${process.env.REACT_APP_API}/locations`
          );

          const locationsResponse = await locations.json();

          if (locationsResponse.code) {
            setLocations(locationsResponse.data);
            setIsAuthenticated(true);
          } else {
            setAuthFailed(true);
            setFailedMessage(FAILURE_MESSAGES.ACCESS_FORBIDDEN);
          }
        } else {
          navigation("/login");
        }
      } catch (error) {
        setAuthFailed(true);
        setFailedMessage(FAILURE_MESSAGES.SERVER_DOWN);
      }
    };

    check();
  });

  return (
    <div>
      {isAuthenticated ? (
        children
      ) : authFailed ? (
        <div>
          <div
            style={{ fontSize: "1.25rem", width: "750px" }}
            className={commonStyles.error_message}
          >
            {failedMessage}
          </div>
          <div style={{ marginTop: "2rem" }}>
            <Link to="/login" style={{ fontSize: "1.2rem" }}>
              Return to the Login Page
            </Link>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}

export default App;
