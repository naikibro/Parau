import useHeaderStore from "../../store/HeaderStore";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const LogOutButton = () => {
  const handleLogout = () => {
    const isChatting = useHeaderStore((state) => state.isChatting);
    const resetChat = useHeaderStore((state) => state.resetChat);

    signOut(auth);
    resetChat();
    console.log("Logging out, value of isChatting: ", isChatting);
  };

  return handleLogout();
};

export default LogOutButton;
