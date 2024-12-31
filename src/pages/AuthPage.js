import React from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

function AuthPage({
  loginData,
  setLoginData,
  handleLogin,
  newUser,
  setNewUser,
  handleRegister,
}) {
  return (
    <div>
      <LoginForm
        loginData={loginData}
        setLoginData={setLoginData}
        handleLogin={handleLogin}
      />
      <RegisterForm
        newUser={newUser}
        setNewUser={setNewUser}
        handleRegister={handleRegister}
      />
    </div>
  );
}

export default AuthPage;
