import { useContext } from "react";
import { AuthContext, AuthProvider } from "../../contexts/Authentication";
import LoginScreen from "./LoginScreen";
import SignupScreen from "./SignupScreen";

export default function AuthScreen() {
  let { page } = useContext(AuthContext);

  return page == "login" ? <LoginScreen /> : <SignupScreen />;
}
