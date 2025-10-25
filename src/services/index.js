import { getItemFromLocalStorage } from "@/lib/utils";
import axios from "axios";

export function createAccount(data) {
  const requestPayload = {
    email: data.email,
    password: data.password,
  };

  return axios.post(
    `${import.meta.env.VITE_BASE_URL}/auth/signup`,
    requestPayload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export function resendOTP(data) {
  const requestPayload = {
    otpPurpose: "EMAIL_VERIFICATION",
    email: data.email,
  };

  const accessToken = getItemFromLocalStorage("accessToken");

  return axios.post(
    `${import.meta.env.VITE_BASE_URL}/auth/send-otp`,
    requestPayload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
}

export function verifyEmail(data) {
  const requestPayload = {
    otpPurpose: "EMAIL_VERIFICATION",
    otpCode: data.otp,
    email: data.email,
  };

  const accessToken = getItemFromLocalStorage("accessToken");

  return axios.post(
    `${import.meta.env.VITE_BASE_URL}/auth/verify-otp`,
    requestPayload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
}

export function createUsername(data) {
  const requestPayload = {
    username: data.username,
  };

  const accessToken = getItemFromLocalStorage("accessToken");

  return axios.post(
    `${import.meta.env.VITE_BASE_URL}/users/username`,
    requestPayload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
}

export function checkUsernameAvailability(username) {
  const accessToken = getItemFromLocalStorage("accessToken");

  return axios.get(
    `${import.meta.env.VITE_BASE_URL}/users/check-username?username=${username}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
}

export function loginUser(data) {
  const requestPayload = {
    email: data.email,
    password: data.password,
  };

  return axios.post(
    `${import.meta.env.VITE_BASE_URL}/auth/login`,
    requestPayload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export function createCommunity(data) {
  const requestPayload = {
    communityName: data.communityName,
    communityAlias: data.communityUsername,
    communityDescription: data.communityDescription,
    communityVisibility: "public",
    communityLinks: [
      { title: "Website", url: data.websitePage },
      { title: "GitHub", url: data.githubPage },
      { title: "Twitter", url: data.twitterPage },
      { title: "Instagram", url: data.instagramPage },
    ],
  };

  const accessToken = getItemFromLocalStorage("accessToken");

  return axios.post(
    `${import.meta.env.VITE_BASE_URL}/communities`,
    requestPayload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
}

export const getCommunities = async ({ limit = 10, offset = 1 } = {}) => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/communities?sortDirection=DESC&limit=${limit}&offset=${offset}`,
  );

  return data.content;
};
