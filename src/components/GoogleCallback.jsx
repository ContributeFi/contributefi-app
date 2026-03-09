import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/services";
import { PiWarningCircle } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/authSlice";

function GoogleCallback() {
  const { login } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [token, setTokenState] = useState(null);
  const processedRef = useRef(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      dispatch(setToken(tokenFromUrl));
      setTokenState(tokenFromUrl);
    } else {
      // toast.error("Authentication token not found");
      navigate("/login", { replace: true });
    }
  }, [navigate, dispatch]);

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["getUser"],
    queryFn: () => getUser(),
    enabled: !!token,
  });

  useEffect(() => {
    if (isSuccess && data && !processedRef.current) {
      processedRef.current = true;
      const user = data.data.content;

      if (!user.username) {
        login({
          token: token,
          email: user.email,
          user: null,
          otp: "123456",
          username: user.username,
        });
        navigate("/get-started/username", { replace: true });
      } else if (!user.bio && !user.lastLogin) {
        login({
          token: token,
          email: user.email,
          user: null,
          otp: "123456",
          username: user.username,
        });
        navigate("/get-started/account-configuration", { replace: true });
      } else {
        login({
          token: token,
          email: null,
          user: user,
          otp: null,
          username: null,
        });
        toast.success("Login successful");
        navigate("/", { replace: true });
      }
    }
  }, [isSuccess, data, login, navigate, token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-[#1082E4]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex w-full flex-col items-center justify-center text-center">
        <PiWarningCircle className="mb-3 text-[40px] text-red-500" />
        <p className="text-sm font-medium text-[#6D7A86]">
          Authentication failed
        </p>
        <p className="mt-1 text-xs text-[#1082E4]">
          {"An unexpected error occurred."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-[#1082E4]" />
    </div>
  );
}

export default GoogleCallback;
