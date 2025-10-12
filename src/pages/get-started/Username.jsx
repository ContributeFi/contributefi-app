import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

function Username() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-8 space-y-[8px]">
        <h2 className="text-[24px] font-bold text-[#09032A] md:text-[28px]">
          Provide a Username
        </h2>
        <p className="text-base font-light text-[#525866] md:text-[18px]">
          This username will be your identity on Contribute.
        </p>
      </div>

      <form className="space-y-[32px]">
        <CustomInput
          className="h-[48px]"
          label="Username"
          placeholder="Enter Username"
          type="text"
        />

        {/* <CustomInput
          className="h-[48px]"
          label="Password"
          placeholder="Enter Password"
          type={revealPassword ? "text" : "password"}
          icon={revealPassword ? <IoMdEyeOff /> : <IoEye />}
          handleRevealPassword={handleRevealPassword}
        /> */}

        <div className="flex flex-col gap-2">
          <Button
            className="w-full"
            variant="secondary"
            size="lg"
            type="button"
            onClick={() => navigate("/get-started/account-configuration")}
          >
            Proceed
          </Button>

          {/* <Button
            className="w-full border-none bg-white shadow-none"
            variant="outline"
            size="lg"
            type="button"
          >
            Login
          </Button> */}
        </div>
      </form>
    </div>
  );
}

export default Username;
