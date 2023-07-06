import NavBar from "../components/NavBar";
import WaveSVG from "../assets/dots.svg";

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
      <div className="pointer-events-none absolute opacity-80">
        <img className="h-screen object-cover opacity-80" src={WaveSVG} />
      </div>
    </div>
  );
}

export default App;
