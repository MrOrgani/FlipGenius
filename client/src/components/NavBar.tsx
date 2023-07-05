import { Link } from "react-router-dom";
import Logo from "./../assets/logo.svg";
import { ConnectButton } from "./ConnectButton";
import { useSelector } from "react-redux";

export const connected = false;

export default function NavBar() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <header
      className={
        "supports-backdrop-blur:bg-background/60 bg-background/95 sticky top-0 z-40 w-full backdrop-blur"
      }
    >
      <div className="container my-4 flex h-14 items-center">
        <Link className="flex items-center" to={"/home"}>
          <img src={Logo} />
          <h1 className="text-2xl font-bold">FlipGenius</h1>
        </Link>
        <div className="ml-auto grid grid-cols-3  items-center gap-4">
          <Link
            className="font-subtitle text-xl"
            to={
              userInfo ? `/collections/${userInfo?.id}` : `/collection/example`
            }
          >
            Learn
          </Link>
          <Link className="font-subtitle text-xl" to={"/about"}>
            About
          </Link>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
