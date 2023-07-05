import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useLogoutMutation } from "../store/slices/usersApiSlice";
import { useDisclosure } from "@chakra-ui/react";
import { ConnectionModalForm } from "./ConnectionModalForm";

export const ConnectButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (userInfo) {
  //     navigate(`/collections/${userInfo.id}`);
  //   }
  // }, [navigate, userInfo]);

  return (
    <>
      {userInfo ? <LogOut /> : <LogIn onOpen={onOpen} />}
      <ConnectionModalForm {...{ isOpen, onClose }} />
    </>
  );
};

const LogIn = ({ onOpen }) => {
  return (
    <div
      className="font-subtitle rounded-full bg-gradient-to-bl from-[#423ED8] to-[#9C37E6] p-[4px] text-xl"
      onClick={onOpen}
    >
      <div className="flex h-full flex-col justify-between rounded-full bg-white p-1 px-4">
        Sign in
      </div>
    </div>
  );
};

const LogOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall({}).unwrap();
      dispatch(logout({}));
      navigate("/home");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="font-subtitle rounded-full bg-gradient-to-bl from-[#423ED8] to-[#9C37E6] p-[4px] text-xl"
      onClick={logoutHandler}
    >
      <div className="flex h-full flex-col justify-between rounded-full bg-white p-1 px-4">
        Sign out
      </div>
    </div>
  );
};
