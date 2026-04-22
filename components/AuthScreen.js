import { useState, useContext } from "react";
import { AuthContext, AuthProvider } from "../contexts/Authentication";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";

export default function AuthScreen() {
  const { page } = useContext(AuthContext);

  return (
    <AuthProvider>
      {page == "login" ? <LoginScreen /> : <SignupScreen />}
    </AuthProvider>
  );
}
