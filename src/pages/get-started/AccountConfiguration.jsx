import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { FaPlus, FaUserLarge } from "react-icons/fa6";
import { Link } from "react-router";
import { PiGithubLogoFill } from "react-icons/pi";
import { FaDiscord } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaTelegram } from "react-icons/fa";
import { PiPlugsConnectedFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";

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
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
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
          to="/login"
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
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected avatar"
                className="h-auto w-[40px]"
              />
            ) : (
              <FaUserLarge className="text-[40px] text-[#B2B9C7]" />
            )}
            <Input
              onChange={handleImageSelect}
              type="file"
              id="image"
              className="hidden"
            />
            <div className="absolute right-0 bottom-0 rounded-full bg-[#F7F9FD] p-2">
              <FaPlus className="text-[#2F0FD1]" />
            </div>
          </Label>
          <Textarea
            className="h-[80px] rounded-[12px] border-none bg-[#F7F9FD] px-4 placeholder:text-sm placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0"
            placeholder="Briefly tell us about you"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ACCOUNTS_TO_LINK.map((account) => (
            <div
              key={account.title}
              className="flex items-center justify-between rounded-[12px] bg-[#F7F9FD] px-4 py-3"
            >
              <div className="flex items-center gap-2">
                {account.icon}
                <span className="text-base font-normal text-[#09032A]">
                  {account.title}
                </span>
              </div>

              <FaPlus className="text-[#5865F2]" />
            </div>
          ))}

          <Button
            className="ml-auto w-full sm:w-fit"
            disabled
            variant="secondary"
            size="lg"
            type="button"
          >
            Save Details
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AccountConfiguration;
