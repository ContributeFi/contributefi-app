import api from "@/lib/api";

export function createAccount(data) {
  const requestPayload = {
    email: data.email,
    password: data.password,
  };

  return api.post(
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

  return api.post(
    `${import.meta.env.VITE_BASE_URL}/auth/send-otp`,
    requestPayload,
  );
}

export function verifyEmail(data) {
  const requestPayload = {
    otpPurpose: "EMAIL_VERIFICATION",
    otpCode: data.otp,
    email: data.email,
  };

  return api.post(
    `${import.meta.env.VITE_BASE_URL}/auth/verify-otp`,
    requestPayload,
  );
}

export function createUsername(data) {
  const requestPayload = {
    username: data.username,
  };

  return api.post(
    `${import.meta.env.VITE_BASE_URL}/users/username`,
    requestPayload,
  );
}

export function checkUsernameAvailability(username) {
  return api.get(
    `${import.meta.env.VITE_BASE_URL}/users/check-username?username=${username}`,
  );
}

export function loginUser(data) {
  const requestPayload = {
    email: data.email,
    password: data.password,
  };

  return api.post(
    `${import.meta.env.VITE_BASE_URL}/auth/login`,
    requestPayload,
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

  return api.post(
    `${import.meta.env.VITE_BASE_URL}/communities`,
    requestPayload,
  );
}

export const getCommunities = async ({
  limit = 10,
  offset = 1,
  sort = "DESC",
  communityOwnerId = "",
} = {}) => {
  const { data } = await api.get(
    `${import.meta.env.VITE_BASE_URL}/communities?sortBy=createdAt:${sort}&limit=${limit}&offset=${offset}&${communityOwnerId !== "" && `communityOwnerId=${communityOwnerId}`}`,
  );

  console.log({ data });

  return data.content;
};

export const getMemberCommunities = async ({ limit = 10, offset = 1 } = {}) => {
  const { data } = await api.get(
    `${import.meta.env.VITE_BASE_URL}/members/my-communities?includeRemoved=false&limit=${limit}&offset=${offset}`,
  );

  return data.content;
};

export const getCommunity = async (communityId) => {
  const { data } = await api.get(
    `${import.meta.env.VITE_BASE_URL}/communities/${communityId}`,
  );

  return data.content;
};

export function joinCommunity(communityId) {
  const requestPayload = {
    communityId,
  };

  return api.post(
    `${import.meta.env.VITE_BASE_URL}/members/join`,
    requestPayload,
  );
}

export function leaveCommunity(communityId, memberId) {
  const requestPayload = {
    memberId,
  };

  return api.post(
    `${import.meta.env.VITE_BASE_URL}/members/leave/${communityId}`,
    requestPayload,
  );
}
