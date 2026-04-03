import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { setItemInSessionStorage } from "@/lib/utils";
import { UsernameSchema } from "@/schemas";
import { checkUsernameAvailability, createUsername } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

function Username() {
  const { login, token, otp, username, email } = useAuth();
  const navigate = useNavigate();
  const [debouncedUsername, setDebouncedUsername] = useState("");

  useEffect(() => {
    if (!otp && username) {
      navigate("/get-started/bind-email");
    } else if (!otp) {
      navigate("/get-started/verify-email");
    }
  }, [navigate, otp, username]);

  useEffect(() => {
    if (username && !email) {
      navigate("/get-started/bind-email");
    } else if (username && email) {
      navigate("/get-started/create-wallet");
    }
  }, [navigate, username, email, otp]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(UsernameSchema),
    mode: "onChange",
  });

  const usernameValue = watch("username");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUsername(usernameValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [usernameValue]);

  const { mutate: createUserNameMutation, isPending: createUsernamePending } =
    useMutation({
      mutationFn: (data) => createUsername(data),
      onSuccess: async (data, variable) => {
        if (data.status === 200) {
          const content = data.data.content;

          setItemInSessionStorage("user", content);

          if (content.authMethod === "WALLET") {
            login({
              token,
              email: null,
              user: null,
              otp: null,
              username: variable.username,
            });
            navigate("/get-started/bind-email", { replace: true });
          } else {
            login({
              token,
              email,
              user: null,
              otp,
              username: variable.username,
            });
            navigate("/get-started/create-wallet", { replace: true });
          }
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

  const onSubmit = (data) => {
    createUserNameMutation(data);
  };

  const isUsernameValid = !errors.username;

  const { data: usernameCheckData, isFetching: checkingUsername } = useQuery({
    queryKey: ["checkUsername", debouncedUsername],
    queryFn: () => checkUsernameAvailability(debouncedUsername),
    enabled:
      debouncedUsername.length >= 6 && isUsernameValid && !errors.username,
  });

  let usernameMessage = "";
  let usernameMessageType = ""; // optional: "error" | "success" | "info"

  if (errors.username?.message) {
    usernameMessage = errors.username.message;
    usernameMessageType = "error";
  } else if (debouncedUsername.length >= 6 && checkingUsername) {
    usernameMessage = "Checking availability...";
    usernameMessageType = "info";
  } else if (usernameCheckData?.data.content.isAvailable === true) {
    usernameMessage = "Username available";
    usernameMessageType = "success";
  } else if (usernameCheckData?.data.content.isAvailable === false) {
    usernameMessage = "Username already taken";
    usernameMessageType = "error";
  }

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-[32px]">
        <div className="space-y-2">
          <CustomInput
            className="h-[48px]"
            label="Username"
            placeholder="Enter Username"
            type="text"
            error={usernameMessage}
            messageType={usernameMessageType}
            {...register("username")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            className="w-full"
            variant="secondary"
            size="lg"
            type="submit"
            disabled={
              createUsernamePending ||
              usernameCheckData?.data.content.isAvailable === false
            }
          >
            {createUsernamePending ? "Processing" : "Proceed"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Username;
