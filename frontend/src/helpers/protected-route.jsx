import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../components/loader";
import { FAILURE_MESSAGES } from "../messages.js";
import commonStyles from "../styles/common.module.css";
import { getData } from "../utils";

export const HomeContext = React.createContext({
  locations: [],
});

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authFailed, setAuthFailed] = useState(false);
  const [failedMessage, setFailedMessage] = useState("");
  const [locations, setLocations] = useState([]);

  const [errorOccurred, setErrorOccurred] = useState(false);

  const navigation = useNavigate();

  const onError = (error) => {
    console.log(error);
    setErrorOccurred(true);
    setFailedMessage(
      `${FAILURE_MESSAGES.SOMETHING_WENT_WRONG} ${
        error.message ? `<br>Reason: ${error.message}` : ""
      }`
    );
    setIsAuthenticated(false);
  };

  const canShowFailureMessage = useMemo(() => errorOccurred || authFailed, [
    errorOccurred,
    authFailed,
  ]);

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
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <HomeContext.Provider value={{ locations, onError }}>
          {children}
        </HomeContext.Provider>
      ) : canShowFailureMessage ? (
        <div>
          <div
            style={{ fontSize: "1.25rem", width: "750px" }}
            className={commonStyles.error_message}
            dangerouslySetInnerHTML={{ __html: failedMessage }}
          ></div>
          <div style={{ marginTop: "2rem" }}>
            <Link to="/login" style={{ fontSize: "1.2rem" }}>
              Return to the Login Page
            </Link>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export { ProtectedRoute };
