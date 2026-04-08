import {Routes, Route, Outlet, Navigate} from "react-router-dom";
import RegisterProvider from "./context/RegisterProvider"
import LoginProvider from "./context/LoginProvider"

import Register from "./pages/Register";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import SidebarLeft from "./components/SidebarLeft";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import Favorites from "./pages/Favorites";

import { useState, useEffect } from "react";
import CreateInfoProvider from "./context/CreateInfoProvider";


export function AppRoutes(){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    function checkAuth() {
      (async () => {
        try {

          await fetch("http://localhost:8000/users/get_csrf/", {
            credentials: "include",
          });

          const res = await fetch("http://localhost:8000/users/me/", {
            credentials: "include",
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data);
          }

        } catch (err) {
          console.error("Auth check failed:", err);
        }finally {
          setLoading(false); // finished fetching
        }
      })();
    }

    checkAuth();
  }, []);
    
  if (loading) return <div>Loading...</div>;

  return(
    <>
        <Routes>
          <Route path="/" element={!user ? <LandingPage/> : <Navigate to="/home"/>} />
          <Route path="/register" element={!user ? <Register/> : <Navigate to="/home"/>} />
          <Route path="/login" element={!user ? <Login/> : <Navigate to="/home"/>} />

          <Route
            element={
              <div className="flex h-screen w-screen overflow-hidden">
                <SidebarLeft/>
                <main className="flex-1 overflow-y-auto">
                  <Outlet/>
                </main>
              </div>
            }
          >
            <Route path="/home" element={user ? <Home/> : <Navigate to="/login"/>} />
            <Route path="/create" element={user ? <Create/> : <Navigate to="/login"/>} />
            <Route path="/profile" element={user ? <Profile/> : <Navigate to="/login"/>} />
            <Route path="/profile/update" element={<UpdateProfile />} />
            <Route path="/favorites" element={user ? <Favorites/> : <Navigate to="/login"/>} />
          </Route>
        </Routes>
    </>
  );
}


function App(){
  return(
    <RegisterProvider>
      <LoginProvider>
        {/* <FormProvider> */}
          <CreateInfoProvider>
            <AppRoutes/>
          </CreateInfoProvider>
        {/* </FormProvider> */}
      </LoginProvider>
    </RegisterProvider>
  );
}
export default App;
