import React from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { Loader } from "./components/loader";
import { Home } from "./pages/home/home";
import { Logout } from "./pages/home/logout";
import { FAILURE_MESSAGES } from "./pages/login/failure_messages";
import { LoginPage } from "./pages/login/login";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [authFailed, setAuthFailed] = React.useState(false);

  const navigation = useNavigate();

  React.useEffect(() => {
    const check = async () => {
      const result = await fetch(
        `${process.env.REACT_APP_API}/auth/is-authenticated`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const response = await result.json();

      if (response && response.authenticated) {
        const locations = await fetch(
          `${process.env.REACT_APP_API}/locations`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const locationsResponse = await locations.json();

        if (locationsResponse.code) {
          setIsAuthenticated(true);
        } else {
          setAuthFailed(true);
        }
      } else {
        navigation("/login");
      }
    };

    check();
  }, []);

  return (
    <div>
      {isAuthenticated ? (
        children
      ) : authFailed ? (
        <div>
          <span style={{ fontSize: "1.25rem" }}>
            {FAILURE_MESSAGES.ACCESS_FORBIDDEN}{" "}
          </span>
          <div style={{ marginTop: "2rem" }}>
            <Link to="/login" style={{ fontSize: "1.2rem" }}>
              Go back to Login Page
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
