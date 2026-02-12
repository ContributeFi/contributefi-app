import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import { FaPlus, FaUserLarge } from "react-icons/fa6";
import { Link, useNavigate } from "react-router";
import { PiGithubLogoFill } from "react-icons/pi";
import { FaDiscord } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaTelegram } from "react-icons/fa";
import { PiPlugsConnectedFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import {
  getItemFromLocalStorage,
  removeItemFromLocalStorage,
  setItemInLocalStorage,
} from "@/lib/utils";
import { FaEnvelope } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { updateBio, uploadProfilePicture } from "@/services";
import { ImSpinner5 } from "react-icons/im";

const ACCOUNTS_TO_LINK = [
  {
    title: "Github",
    icon: <PiGithubLogoFill className="text-[27px]" />,
  },
  {
    title: "Discord",
    icon: <FaDiscord className="text-[27px] text-[#5865F2]" />,
  },
  {
    title: "X Account",
    icon: <FaSquareXTwitter className="text-[27px]" />,
  },
  {
    title: "Telegram",
    icon: <FaTelegram className="text-[27px] text-[#23B7EC]" />,
  },
  {
    title: "Wallet",
    icon: <PiPlugsConnectedFill className="text-[27px] text-[#2F0FD1]" />,
  },
];

function AccountConfiguration() {
  const { login, token, email, otp, username, setUser, user } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!username) {
      navigate("/get-started/username");
    }
  }, [navigate, username]);

  const [bio, setBio] = useState("");

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
        setUser((prevUser) => {
          const updatedUser = {
            ...prevUser,
            profileImageUrl: response.data.content.profileImageUrl,
          };
          setItemInLocalStorage("user", updatedUser);
          return updatedUser;
        });
      } else {
        toast.error("Failed to upload profile picture");
        return;
      }

      toast.success("Profile picture updated");
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
    } else {
      setSaving(true);
      try {
        const res = await updateBio(bio);

        if (res?.data?.content?.bio) {
          setUser((prevUser) => {
            const updatedUser = {
              ...prevUser,
              bio: res.data.content.bio,
            };
            setItemInLocalStorage("user", updatedUser);

            return updatedUser;
          });
          toast.success("Bio updated successfully");
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

      navigate("/");
    }

    // Save user details logic here
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
              token: token,
              email: email,
              user: getItemFromLocalStorage("user"),
              otp: otp,
              username: username,
            });

            removeItemFromLocalStorage("users");
          }}
          className="absolute top-5 right-10 text-base font-medium text-[#2F0FD1] sm:top-10"
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
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
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
            onChange={(e) => setBio(e.target.value)}
            value={bio}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ACCOUNTS_TO_LINK.map((account) => (
            <div
              key={account.title}
              className="flex items-center justify-between rounded-[12px] bg-[#F7F9FD] px-4 py-3"
            >
              <div className="flex items-center gap-2">
                {account.title === "Wallet" ? (
                  getItemFromLocalStorage("email") ? (
                    account.icon
                  ) : (
                    <FaEnvelope className="text-[27px] text-[#2F0FD1]" />
                  )
                ) : (
                  account.icon
                )}
                <span className="text-base font-normal text-[#09032A]">
                  {account.title === "Wallet"
                    ? getItemFromLocalStorage("email")
                      ? "Wallet"
                      : "Email"
                    : account.title}
                </span>
              </div>

              <FaPlus className="text-[#5865F2]" />
            </div>
          ))}

          <Button
            className="ml-auto w-full sm:w-fit"
            disabled={
              uploading ||
              (!user?.profileImageUrl && bio.trim().length === 0) ||
              saving
            }
            variant="secondary"
            size="lg"
            type="button"
            onClick={handleSaveDetails}
          >
            {saving ? "Saving..." : "Save Details"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AccountConfiguration;
