import {Routes, Route} from "react-router-dom";
import RegisterProvider from "./context/RegisterProvider"
import LoginProvider from "./context/LoginProvider"

import Register from "./pages/Register";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import SidebarLeft from "./components/SidebarLeft";
import Form from "./pages/Form";

import { useState, useEffect } from "react";
import FormProvider from "./context/FormProvider";


export function AppRoutes(){
  const [user, setUser] = useState();
  useEffect(() => {
    async function checkAuth() {
      fetch("http://localhost:8000/users/get_csrf/", {
          credentials: "include",
      });

      const res = await fetch("http://localhost:8000/users/me/", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    }
    checkAuth();
  }, []);
    
  return(
    <>
        <Routes>
          <Route path="/" element={!user ?<LandingPage />:<Form/>} />
          <Route path="/register" element={!user ?<Register />:<Form/>} />
          <Route path="/login" element={!user ?<Login />:<Form/>} />
          <div className="flex h-screen w-screen overflow-hidden">
              <SidebarLeft/>
              <main className="flex-1 overflow-y-auto">
                <Route path="/home" element={<Home />} />
                <Route path="/create" element={<Create />} />
              </main>
          </div>
        </Routes>
    </>
  );
}


function App(){
  return(
    <RegisterProvider>
      <LoginProvider>
        <FormProvider>
          <AppRoutes/>
        </FormProvider>
      </LoginProvider>
    </RegisterProvider>
  );
}
export default App;
