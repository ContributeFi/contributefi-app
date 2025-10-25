import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { maskEmail } from "@/lib/utils";
import { VerifyEmailSchema } from "@/schemas";
import { resendOTP, verifyEmail } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

function VerifyEmail() {
  const { login, token, email } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate("/get-started");
    }
  }, [navigate, email]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(VerifyEmailSchema),
  });

  const { mutate: verifyEmailMutation, isPending: verifyEmailPending } =
    useMutation({
      mutationFn: (data) => verifyEmail(data),
      onSuccess: async (data, variable) => {
        console.log({ data });
        if (data.status === 200) {
          login({
            token: token,
            email: email,
            user: null,
            otp: variable.otp,
            username: null,
          });
          navigate("/get-started/username");
          toast.success("Email verified successfully");
          reset();
        } else {
          toast.error("Something went wrong");
        }
      },
      onError: (error) => {
        console.error("Error:", error.response.data.message);
        toast.error(error.response.data.message);
      },
    });

  const { mutate: resendOTPMutation, isPending: resendOTPPending } =
    useMutation({
      mutationFn: (data) => resendOTP(data),
      onSuccess: async (data) => {
        console.log({ data });
        if (data.status === 200) {
          toast.success("OTP sent successfully");
        } else {
          toast.error("Something went wrong");
        }
      },
      onError: (error) => {
        console.error("Error:", error.response.data.message);
        toast.error(error.response.data.message);
      },
    });

  const handleResendOTP = () => {
    const data = { email };
    resendOTPMutation(data);
  };

  const onSubmit = (data) => {
    verifyEmailMutation({ ...data, email });
  };

  if (!email) {
    return null;
  }

  return (
    <div>
      <div className="mb-8 space-y-[8px]">
        <h2 className="text-[24px] font-bold text-[#09032A] md:text-[28px]">
          Check Your Email
        </h2>
        <p className="text-base font-light text-[#525866] md:text-[18px]">
          A six-digit code has been sent to {maskEmail(email)}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-[32px]">
        <CustomInput
          className="h-[48px]"
          label="Provide OTP"
          placeholder="Enter OTP"
          type="text"
          inputMode="numeric"
          pattern="\d*"
          error={errors.otp?.message}
          {...register("otp")}
          maxLength={6}
          onKeyDown={(e) => {
            if (
              !/[0-9]/.test(e.key) &&
              e.key !== "Backspace" &&
              e.key !== "Tab" &&
              e.key !== "ArrowLeft" &&
              e.key !== "ArrowRight"
            ) {
              e.preventDefault();
            }
          }}
        />

        <div className="flex flex-col gap-2">
          <Button
            className="w-full"
            variant="secondary"
            size="lg"
            type="submit"
            disabled={verifyEmailPending}
          >
            {verifyEmailPending ? "Processing" : "Submit OTP"}
          </Button>

          <div className="text-base text-[#09032A]">
            <span>You missed it? </span>
            <button
              onClick={handleResendOTP}
              disabled={resendOTPPending}
              type="button"
              className="cursor-pointer text-[#2F0FD1] disabled:cursor-not-allowed disabled:text-[#2F0FD150]"
            >
              {resendOTPPending ? "Resending OTP..." : "Resend OTP"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default VerifyEmail;
