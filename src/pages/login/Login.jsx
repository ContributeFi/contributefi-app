import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { PiPlugsConnectedFill } from "react-icons/pi";
import { useNavigate } from "react-router";

function Login() {
  const navigate = useNavigate();
  const [revealPassword, setRevealPassword] = useState(false);

  const handleRevealPassword = () => {
    setRevealPassword((revealPassword) => !revealPassword);
  };
  return (
    <div>
      <div className="mb-8 space-y-[8px]">
        <h2 className="text-[24px] font-bold text-[#09032A] md:text-[28px]">
          Welcome Back
        </h2>
        <p className="text-base font-light text-[#525866] md:text-[18px]">
          Sign in to access your account
        </p>
      </div>

      <div className="space-y-[32px]">
        <div className="space-y-[16px]">
          <Button
            className="w-full border-none bg-[#F7F9FD] text-[#09032A]"
            variant="outline"
            size="lg"
          >
            <FcGoogle />
            Sign n with Google
          </Button>

          {/* <Button
            className="group w-full border-none bg-[#F7F9FD] text-[#09032A]"
            variant="outline"
            size="lg"
          >
            <PiPlugsConnectedFill className="text-[#2F0FD1] group-hover:text-white" />
            Connect Wallet
          </Button> */}
        </div>

        <p className="relative flex items-center text-[14px] text-[#525866] before:mr-4 before:flex-1 before:border-t before:border-gray-300 after:ml-4 after:flex-1 after:border-t after:border-gray-300 sm:text-base">
          Or Continue with Email/Username
        </p>

        <form className="space-y-[32px]">
          <CustomInput
            className="h-[48px]"
            label="Email Address or Username"
            placeholder="Enter Email Address or Username"
            type="text"
          />

          <CustomInput
            className="h-[48px]"
            label="Password"
            placeholder="Enter Password"
            type={revealPassword ? "text" : "password"}
            icon={revealPassword ? <IoMdEyeOff /> : <IoEye />}
            handleRevealPassword={handleRevealPassword}
          />

          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              variant="secondary"
              size="lg"
              type="button"
              onClick={() => navigate("/dashboard/overview")}
            >
              Log In
            </Button>

            <Button
              className="w-full border-none bg-white shadow-none"
              variant="outline"
              size="lg"
              type="button"
              onClick={() => navigate("/get-started")}
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
