import { useState } from "react";
import RegisterContext from "./RegisterContext";

export default function RegisterProvider({ children }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  return (
    <RegisterContext.Provider value={{form,setForm}}>
      {children}
    </RegisterContext.Provider>
  );
}
