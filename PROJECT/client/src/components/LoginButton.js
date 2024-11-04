import React from "react";

const LoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_AUTH_URL}/google`;
  };

  return (
    <button onClick={handleGoogleLogin} className="login-button">
      Login with Google
    </button>
  );
};

export default LoginButton;
