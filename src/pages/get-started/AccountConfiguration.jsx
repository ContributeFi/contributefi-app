import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FaPlus, FaUserLarge, FaCheck } from "react-icons/fa6";
import { Link, useNavigate, useSearchParams } from "react-router";
import { PiGithubLogoFill } from "react-icons/pi";
import { FaDiscord } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaTelegram } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getItemFromSessionStorage,
  removeItemFromSessionStorage,
  setItemInSessionStorage,
} from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import {
  initiateTelegramLinking,
  verifyTelegram,
  linkedAccount,
  updateBio,
  uploadProfilePicture,
} from "@/services";
import { ImSpinner5 } from "react-icons/im";
import { useForm } from "react-hook-form";
import { TelegramUsernameSchema, TelegramOtpSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput from "@/components/CustomInput";

const ACCOUNTS_TO_LINK = [
  {
    title: "Github",
    key: "github",
    icon: <PiGithubLogoFill className="text-[27px]" />,
  },
  {
    title: "Discord",
    key: "discord",
    icon: <FaDiscord className="text-[27px] text-[#5865F2]" />,
  },
  {
    title: "X Account",
    key: "twitter",
    icon: <FaSquareXTwitter className="text-[27px]" />,
  },
  {
    title: "Telegram",
    key: "telegram",
    icon: <FaTelegram className="text-[27px] text-[#23B7EC]" />,
  },
];
function AccountConfiguration() {
  const { login, token, username } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    () => getItemFromSessionStorage("imageUrl") || null,
  );
  const [saving, setSaving] = useState(false);
  const [user] = useState(() => getItemFromSessionStorage("user"));
  const [linkingAccount, setLinkingAccount] = useState(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(TelegramUsernameSchema),
    mode: "onChange",
  });

  const {
    register: otpRegister,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    reset: resetOtp,
  } = useForm({
    resolver: zodResolver(TelegramOtpSchema),
    mode: "onChange",
  });

  const { data: linkedAccountsData, isLoading: loadingAccounts } = useQuery({
    queryKey: ["linkedAccounts", token],
    queryFn: () => linkedAccount(),
    enabled: !!token,
  });

  const linkedAccounts = React.useMemo(() => {
    if (!linkedAccountsData?.data?.content) return [];
    const content = linkedAccountsData.data.content;
    if (Array.isArray(content)) {
      if (content.length > 0 && typeof content[0] === "string") {
        return content.map((acc) => ({
          provider: acc.toLowerCase(),
          username: null,
        }));
      }
      return content
        .map((acc) => ({
          provider: acc.provider?.toLowerCase(),
          username: acc.username || null,
        }))
        .filter((acc) => acc.provider);
    }
    if (content.linkedAccounts && Array.isArray(content.linkedAccounts)) {
      return content.linkedAccounts.map((acc) => ({
        provider: acc.toLowerCase(),
        username: null,
      }));
    }
    return [];
  }, [linkedAccountsData]);

  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  useEffect(() => {
    if (!username) {
      navigate("/get-started/username");
    }
  }, [navigate, username]);

  useEffect(() => {
    if (error) {
      const errorMessage = message
        ? decodeURIComponent(message)
        : "An error occurred while linking your account";

      toast.error(errorMessage);

      navigate(".", { replace: true });
    }
  }, [error, message, navigate]);

  const handleLinkAccount = async (accountType) => {
    if (accountType === "github") {
      setLinkingAccount("github");
      window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/github?token=${token}`;
    } else if (accountType === "discord") {
      setLinkingAccount("discord");
      window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/discord?token=${token}`;
    } else if (accountType === "twitter") {
      setLinkingAccount("twitter");
      window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/twitter?token=${token}`;
    } else if (accountType === "telegram") {
      setShowUsernameModal(true);
    }
  };

  const { mutate: initiateTelegramLinkMutation, isPending: telegramLoading } =
    useMutation({
      mutationFn: (data) => initiateTelegramLinking(data),
      onSuccess: (data, variables) => {
        setTelegramUsername(variables.username);
        setShowUsernameModal(false);
        setShowInstructionModal(true);
        reset();
      },

      onError: (error) => {
        toast.error(
          error.response.data.message || "Failed to initiate linking",
        );
      },
    });

  const { mutate: verifyTelegramOtpMutation, isPending: otpVerifying } =
    useMutation({
      mutationFn: (data) => verifyTelegram(data),
      onSuccess: (data) => {
        console.log({ data });
        toast.success(data?.data?.message);
        setShowOtpModal(false);
        // window.location.reload();
        // if (data?.data?.message === "") {
        //   toast.success("Telegram account linked successfully!");
        //   setShowOtpModal(false);
        //   window.location.reload();
        // } else {
        //   toast.error(data?.message || "Invalid or expired OTP");
        // }
      },
      onError: (error) => {
        toast.error(error.response.data.message || "Failed to verify OTP");
      },
    });

  const onSubmitTelegramUsername = (data) => {
    setLinkingAccount("telegram");
    initiateTelegramLinkMutation(data, {
      onSettled: () => setLinkingAccount(null),
    });
  };

  const onVerifyOtp = (data) => {
    verifyTelegramOtpMutation(
      { otp: data.otp, username: telegramUsername },
      {
        onSettled: () => setLinkingAccount(null),
      },
    );
  };

  const handleTelegramCancel = () => {
    setLinkingAccount(null);
    setTelegramUsername("");
    setShowUsernameModal(false);
    setShowInstructionModal(false);
    setShowOtpModal(false);
    resetOtp();
  };

  const [bio, setBio] = useState(() => getItemFromSessionStorage("bio") || "");

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (uploading) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    try {
      setUploading(true);
      const response = await uploadProfilePicture(file);
      if (response?.data?.content?.profileImageUrl) {
        setImageUrl(response.data.content.profileImageUrl);
        setItemInSessionStorage(
          "imageUrl",
          response.data.content.profileImageUrl,
        );
        toast.success("Profile picture updated");
      } else {
        toast.error("Failed to upload profile picture");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to upload profile picture",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    if (!bio) {
      navigate("/");
      login({
        token,
        email: null,
        user: {
          ...user,
          ...(imageUrl && { profileImageUrl: imageUrl }),
        },
        otp: null,
        username: null,
      });
      removeItemFromSessionStorage("user");
      removeItemFromSessionStorage("imageUrl");
      removeItemFromSessionStorage("bio");
    } else {
      setSaving(true);
      try {
        const res = await updateBio(bio);
        if (res?.data?.content?.bio) {
          toast.success("Bio updated successfully");
          navigate("/");
          login({
            token,
            email: null,
            user: res?.data?.content,
            otp: null,
            username: null,
          });
          removeItemFromSessionStorage("user");
          removeItemFromSessionStorage("imageUrl");
          removeItemFromSessionStorage("bio");
        } else {
          toast.error("Failed to save bio");
          setSaving(false);
          return;
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to save bio");
        return;
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div>
      <div className="mb-8 space-y-[8px]">
        <h2 className="text-[24px] font-bold text-[#09032A] md:text-[28px]">
          Account Configuration
        </h2>
        <p className="text-base font-light text-[#525866] md:text-[18px]">
          Connect your other profiles for maximum access to tasks and engagement
        </p>
        <Link
          to="/"
          onClick={() => {
            login({
              token,
              email: null,
              user: {
                ...user,
                ...(imageUrl && { profileImageUrl: imageUrl }),
              },
              otp: null,
              username: null,
            });
            removeItemFromSessionStorage("user");
            removeItemFromSessionStorage("imageUrl");
            removeItemFromSessionStorage("bio");
          }}
          className={`absolute top-5 right-10 text-base font-medium text-[#2F0FD1] sm:top-10 ${(imageUrl || bio.trim().length > 0 || linkedAccounts.length > 0) && "hidden"} `}
        >
          Skip till Later &gt;&gt;
        </Link>
      </div>
      <div className="space-y-[40px]">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Label
            htmlFor="image"
            className="relative flex h-[80px] w-[80px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F7F9FD]"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Selected avatar"
                className="h-[50px] w-[50px] rounded-full"
              />
            ) : (
              <FaUserLarge className="text-[40px] text-[#B2B9C7]" />
            )}
            <Input
              onChange={handleImageSelect}
              type="file"
              id="image"
              className="hidden"
              disabled={uploading}
            />
            <div className="absolute right-0 bottom-0 rounded-full bg-[#F7F9FD] p-2">
              {uploading ? (
                <ImSpinner5 className="animate-spin" />
              ) : (
                <FaPlus className="text-[#2F0FD1]" />
              )}
            </div>
          </Label>
          <Textarea
            className="h-[80px] rounded-[12px] border-none bg-[#F7F9FD] px-4 placeholder:text-sm placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0"
            placeholder="Briefly tell us about you"
            onChange={(e) => {
              setBio(e.target.value);
              setItemInSessionStorage("bio", e.target.value);
            }}
            value={bio}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ACCOUNTS_TO_LINK.map((account) => {
            const linkedAccount = linkedAccounts.find(
              (acc) => acc.provider === account.key,
            );
            const isLinked = !!linkedAccount;
            const isLinking = linkingAccount === account.key;
            return (
              <div
                key={account.title}
                className="rounded-[12px] bg-[#F7F9FD] px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {account.icon}
                    <span className="text-base font-normal text-[#09032A]">
                      {isLinked && linkedAccount?.username
                        ? `@${linkedAccount.username}`
                        : account.title}
                    </span>
                  </div>
                  {loadingAccounts || isLinking ? (
                    <ImSpinner5 className="animate-spin text-[#5865F2]" />
                  ) : isLinked ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleLinkAccount(account.key)}
                      className="text-[#5865F2]"
                    >
                      <FaPlus />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <div />
          <Button
            className="ml-auto w-full"
            disabled={
              uploading ||
              (!imageUrl &&
                bio.trim().length === 0 &&
                linkedAccounts.length === 0) ||
              saving
            }
            variant="secondary"
            size="lg"
            type="button"
            onClick={handleSaveDetails}
          >
            {saving ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>

      <Dialog
        open={showUsernameModal || showInstructionModal || showOtpModal}
        onOpenChange={(open) => {
          if (!open) {
            if (showUsernameModal) {
              setShowUsernameModal(false);
              reset();
            }
            if (showInstructionModal) {
              setShowInstructionModal(false);
            }
            if (showOtpModal) {
              setShowOtpModal(false);
              resetOtp();
            }
            setTelegramUsername("");
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          {showUsernameModal && (
            <>
              <DialogHeader>
                <DialogTitle>Link Telegram Account</DialogTitle>
                <DialogDescription className="sr-only">
                  Enter your Telegram username to link your account
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleSubmit(onSubmitTelegramUsername)}
                className="space-y-4"
              >
                <CustomInput
                  className="h-[48px]"
                  label="Username"
                  placeholder="Enter Username"
                  type="text"
                  error={errors?.username?.message}
                  {...register("username")}
                />

                <div className="flex gap-2">
                  <Button
                    className="w-1/2"
                    type="button"
                    size="lg"
                    onClick={() => {
                      setShowUsernameModal(false);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    className="w-1/2"
                    type="submit"
                    variant="secondary"
                    size="lg"
                    disabled={telegramLoading}
                  >
                    {telegramLoading ? (
                      <ImSpinner5 className="animate-spin" />
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}

          {showInstructionModal && (
            <>
              <DialogHeader>
                <DialogTitle>Link Telegram Account</DialogTitle>
                <DialogDescription className="sr-only">
                  Follow the steps below to link your Telegram account
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Follow these steps to link your Telegram account:</p>
                  <ol className="list-inside list-decimal space-y-1">
                    <li>
                      Go to Telegram and open the{" "}
                      <a
                        href="https://t.me/contributefi_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#2F0FD1] hover:underline"
                      >
                        ContributeFi bot
                      </a>
                    </li>
                    <li>Press /start</li>
                    <li>You will receive an OTP code</li>
                  </ol>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="w-1/2"
                    size="lg"
                    onClick={handleTelegramCancel}
                  >
                    Cancel
                  </Button>

                  <Button
                    className="w-1/2"
                    variant="secondary"
                    size="lg"
                    onClick={() => {
                      setShowOtpModal(true);
                      setShowInstructionModal(false);
                    }}
                  >
                    Enter OTP
                  </Button>
                </div>
              </div>
            </>
          )}

          {showOtpModal && (
            <>
              <DialogHeader>
                <DialogTitle>Link Telegram Account</DialogTitle>
                <DialogDescription className="sr-only">
                  Enter Otp
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleOtpSubmit(onVerifyOtp)}
                className="space-y-4"
              >
                <CustomInput
                  className="h-[48px]"
                  label="OTP Code"
                  placeholder="Enter 6-digit OTP"
                  type="text"
                  error={otpErrors?.otp?.message}
                  maxLength={6}
                  {...otpRegister("otp")}
                />

                <div className="flex gap-2">
                  <Button
                    className="w-1/2"
                    type="button"
                    size="lg"
                    onClick={() => {
                      setShowOtpModal(false);
                      resetOtp();
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    className="w-1/2"
                    type="submit"
                    variant="secondary"
                    size="lg"
                    disabled={otpVerifying}
                  >
                    {otpVerifying ? (
                      <ImSpinner5 className="animate-spin" />
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default AccountConfiguration;
