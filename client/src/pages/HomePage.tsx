import { Link } from "react-router-dom";
import { ReactComponent as MainSVG } from "../assets/main.svg";
import wave from "../assets/wave.svg";

function Home() {
  return (
    <div className="flex grow flex-col ">
      <div className="my-auto flex h-full justify-center">
        <div className=" my-auto flex flex-col self-center">
          <h1 className="bg-gradient-to-b from-[#423ED8] to-[#9C37E6] bg-clip-text text-6xl font-bold text-transparent">
            FlipGenius
          </h1>
          <span className="text-3xl text-[#B8B6B6]">
            Flip, Learn, Remember.
          </span>
          <Link to={`/collection/example`}>
            <button className="font-subtitle mt-10 w-auto max-w-fit rounded-full bg-gradient-to-b  from-[#6C63FF] to-[#9C37E6] px-8 py-4 text-xl font-bold text-white">
              Let's try !
            </button>
          </Link>
        </div>
        <MainSVG className={"w-1/2"} />
        <div className="absolute bottom-0 left-0 -z-10 w-screen">
          <img src={wave} alt="" width={"100%"} />
        </div>
      </div>
    </div>
  );
}

export default Home;
