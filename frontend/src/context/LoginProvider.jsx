import { useState } from "react";
import LoginContext from "./LoginContext";

export default function LoginProvider({ children }) {
  // Track form inputs
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  return (
    <LoginContext.Provider value={{ form, setForm }}>
      {children}
    </LoginContext.Provider>
  );
}