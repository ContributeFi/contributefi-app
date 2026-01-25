export function capitalizeFirst(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function timeAgo(date) {
  const now = new Date();
  const diff = (now - new Date(date)) / 1000;

  if (diff < 10) return "just now";
  if (diff < 60) return `${Math.floor(diff)} seconds ago`;

  const minutes = diff / 60;
  if (minutes < 60) return `${Math.floor(minutes)} minutes ago`;

  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)} hours ago`;

  const days = hours / 24;
  if (days < 7) return `${Math.floor(days)} days ago`;

  const weeks = days / 7;
  if (weeks < 4) return `${Math.floor(weeks)} weeks ago`;

  return new Date(date).toLocaleDateString();
}

export function shortenString(str, maxLength = 20) {
  if (!str || str.length <= maxLength) return str;

  const half = Math.floor((maxLength - 3) / 2);
  const start = str.slice(0, half);
  const end = str.slice(-half);
  return `${start}...${end}`;
}

export function wrapString(str, lineLength = 60) {
  if (!str) return "";
  return str.match(new RegExp(`.{1,${lineLength}}`, "g")).join("\n");
}

export function formatDate(date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  const formattedDate = `${day} ${month} ’${year} | ${hours}:${minutes}${period}`;
  return formattedDate;
}

export const formatDateToYYYYMMDD = (date) => date.toISOString().split("T")[0];

export const validateUrl = (value) => {
  const urlStr = value.startsWith("http") ? value : `https://${value}`;

  try {
    const url = new URL(urlStr);
    const dotCount = (url.hostname.match(/\./g) || []).length;

    if (url.hostname.startsWith("www")) {
      return dotCount >= 2;
    } else {
      return dotCount >= 1;
    }
  } catch {
    return false;
  }
};

export const hydrateGrowthQuestData = (data) => {
  if (!data) return data;

  return {
    ...data,
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
  };
};

export const mapFormToCreateGrowthQuestPayload = (data) => {
  console.log({ data });
  const payload = {
    questTitle: data.questTitle,
    questDescription: data.questDescription,
    rewardType: data.rewardType === "Token" ? "Token" : "Points",
    runContinuously: data.runContinuously,
    startDate: new Date(data.startDate).toISOString(),
    rewardMode: data.rewardMode === "Overall Reward" ? "Overall" : "Individual",

    tasks: [],
  };

  if (data.tokenContract) {
    payload.tokenContract = data.tokenContract;
  }

  if (data.numberOfWinners) {
    payload.numberOfWinners = data.numberOfWinners;
  }

  if (data.winnerSelectionMethod) {
    payload.winnerSelectionMethod = data.winnerSelectionMethod;
  }

  if (data.endDate) {
    payload.endDate = new Date(data.endDate).toISOString();
  }

  if (data.pointsPerWinner) {
    payload.pointsPerWinner = data.pointsPerWinner;
  }

  if (data.tokensPerWinner) {
    payload.tokensPerWinner = data.tokensPerWinner;
  }

  // ----------------------------
  // TOKEN reward specific fields
  // ----------------------------
  // if (data.rewardType === "Token") {
  //   payload.tokenContract = data.tokenContract;
  //   payload.numberOfWinners = data.numberOfWinners;
  //   payload.winnerSelectionMethod = data.winnerSelectionMethod?.toUpperCase();

  //   if (payload.rewardMode === "OVERALL") {
  //     payload.tokensPerWinner = data.tokensPerWinner;
  //   }
  // }

  // ----------------------------
  // POINTS reward specific fields
  // ----------------------------
  // if (data.rewardType === "Points") {
  //   if (payload.rewardMode === "OVERALL") {
  //     payload.pointsPerWinner = data.pointsPerWinner;
  //   }
  // }

  // ----------------------------
  // Tasks mapping
  // ----------------------------
  payload.tasks = data.tasks.map((task) => {
    const taskPayload = {
      type: task.type,
    };

    if (data.rewardMode === "INDIVIDUAL" && data.rewardType === "Token") {
      taskPayload.tokensPerTask = task.tokensPerTask;
    }

    if (data.rewardMode === "INDIVIDUAL" && data.rewardType === "Points") {
      taskPayload.pointsPerTask = task.pointsPerTask;
    }

    if (task.twitterUrl) taskPayload.twitterUrl = task.twitterUrl;
    if (task.tweetUrl) taskPayload.tweetUrl = task.tweetUrl;
    if (task.discordLink) taskPayload.discordLink = task.discordLink;
    if (task.telegramLink) taskPayload.telegramLink = task.telegramLink;
    if (task.telegramGroupLink)
      taskPayload.telegramGroupLink = task.telegramGroupLink;
    if (task.channelId) taskPayload.channelId = task.channelId;
    if (task.keywordValidation)
      taskPayload.keywordValidation = task.keywordValidation;

    return taskPayload;
  });

  // ----------------------------
  // Optional flags
  // ----------------------------
  if (data.makeConcurrent) payload.makeConcurrent = true;

  if (data.rewardAllWithPoints) {
    payload.rewardAllWithPoints = true;
    payload.extraPoints = data.extraPoints;
  }

  return payload;
};

export const mapFormToCreateOnChainQuestPayload = (data) => {
  console.log({ data });
  const payload = {
    questTitle: data.questTitle,
    questDescription: data.questDescription,
    rewardType: data.rewardType === "Token" ? "Token" : "Points",
    runContinuously: data.runContinuously,
    startDate: new Date(data.startDate).toISOString(),
    rewardMode: data.rewardMode === "Overall Reward" ? "Overall" : "Individual",

    tasks: [],
  };

  if (data.tokenContract) {
    payload.tokenContract = data.tokenContract;
  }

  if (data.numberOfWinners) {
    payload.numberOfWinners = data.numberOfWinners;
  }

  if (data.winnerSelectionMethod) {
    payload.winnerSelectionMethod = data.winnerSelectionMethod;
  }

  if (data.endDate) {
    payload.endDate = new Date(data.endDate).toISOString();
  }

  if (data.pointsPerWinner) {
    payload.pointsPerWinner = data.pointsPerWinner;
  }

  if (data.tokensPerWinner) {
    payload.tokensPerWinner = data.tokensPerWinner;
  }

  if (data.verificationMode) {
    payload.verificationMode = data.verificationMode;
  }

  if (data.contractAddress) {
    payload.contractAddress = data.contractAddress;
  }

  // ----------------------------
  // Tasks mapping
  // ----------------------------
  payload.tasks = data.tasks.map((task) => {
    const taskPayload = {
      type: task.type,
    };

    if (data.rewardMode === "INDIVIDUAL" && data.rewardType === "Token") {
      taskPayload.tokensPerTask = task.tokensPerTask;
    }

    if (data.rewardMode === "INDIVIDUAL" && data.rewardType === "Points") {
      taskPayload.pointsPerTask = task.pointsPerTask;
    }

    if (task.function) taskPayload.function = task.function;
    if (task.description) taskPayload.description = task.description;

    return taskPayload;
  });

  // ----------------------------
  // Optional flags
  // ----------------------------
  if (data.makeConcurrent) payload.makeConcurrent = true;

  if (data.rewardAllWithPoints) {
    payload.rewardAllWithPoints = true;
    payload.extraPoints = data.extraPoints;
  }

  return payload;
};
