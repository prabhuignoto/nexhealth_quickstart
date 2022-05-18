import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/home/home";
import { Logout } from "./pages/home/logout";
import { LoginPage } from "./pages/login/login";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

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

      console.log(response);

      if (response && response.authenticated) {
        setIsAuthenticated(response.authenticated);
      } else {
        navigation("/login");
      }
    };

    check();
  }, []);

  return <div>{isAuthenticated ? children : null}</div>;
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
