import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  setToken,
  setEmail,
  setOtp,
  setUsername,
  login as loginAction,
  logout as logoutAction,
} from "@/store/authSlice";
import { clearWallet } from "@/store/walletSlice";
import { removeItemFromLocalStorage } from "@/lib/utils";

export const useAuth = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const email = useSelector((state) => state.auth.email);
  const otp = useSelector((state) => state.auth.otp);
  const username = useSelector((state) => state.auth.username);

  const isAuthenticated = !!token && !!user;

  const login = ({ token, email, user, otp, username }) => {
    dispatch(loginAction({ token, email, user, otp, username }));
  };

  const logout = () => {
    dispatch(logoutAction());
    dispatch(clearWallet());
    removeItemFromLocalStorage("accessToken");
    removeItemFromLocalStorage("user");
    removeItemFromLocalStorage("network");
    removeItemFromLocalStorage("publicKey");
  };

  return {
    user,
    setUser: (value) => dispatch(setUser(value)),
    token,
    setToken: (value) => dispatch(setToken(value)),
    isAuthenticated,
    login,
    logout,
    email,
    otp,
    username,
  };
};
