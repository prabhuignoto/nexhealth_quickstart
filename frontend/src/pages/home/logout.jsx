import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const request = await fetch(
          `${process.env.REACT_APP_API}/auth/logout`,
          {
            credentials: "include",
            method: "GET",
          }
        );

        const result = await request.json();

        if (!result.authenticated) {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
      }
    };

    logout();
  });

  return (
    <div>
      <h2>Logging out ...</h2>
    </div>
  );
};

export { Logout };
