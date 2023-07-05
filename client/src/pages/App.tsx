import { useEffect } from "react";
import { useSelector } from "react-redux";
import NavBar from "../components/NavBar";

import { Navigate, Outlet, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  if (location.pathname === "/") return <Navigate replace to="/home" />;

  // const { userInfo } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (userInfo) {
  //     navigate(`/home`);
  //   }
  // }, [navigate, userInfo]);

  return (
    <div className={"relative flex min-h-screen flex-col"}>
      <NavBar />
      <Outlet />
    </div>
  );
}

export default App;
