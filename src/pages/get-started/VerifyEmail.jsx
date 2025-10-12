import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

function VerifyEmail() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="mb-8 space-y-[8px]">
        <h2 className="text-[24px] font-bold text-[#09032A] md:text-[28px]">
          Check Your Email
        </h2>
        <p className="text-base font-light text-[#525866] md:text-[18px]">
          A six-digit code has been sent to john***@gmail.com.
        </p>
      </div>

      <form className="space-y-[32px]">
        <CustomInput
          className="h-[48px]"
          label="Provide OTP"
          placeholder="Enter OTP"
          type="text"
        />

        <div className="flex flex-col gap-2">
          <Button
            className="w-full"
            variant="secondary"
            size="lg"
            type="button"
            onClick={() => navigate("/get-started/username")}
          >
            Submit OTP
          </Button>

          {/* <Button
            className="w-full border-none bg-white shadow-none"
            variant="outline"
            size="lg"
            type="button"
          >
            Login
          </Button> */}
          <div className="text-base text-[#09032A]">
            <span>You missed it? </span>
            <button type="button" className="cursor-pointer text-[#2F0FD1]">
              Resend OTP
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default VerifyEmail;
