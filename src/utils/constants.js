export const REWARD_MODES = ["Overall Reward", "Individual Task Reward"];

export const REWARD_TYPES = [
  { label: "Points", value: "Points" },
  { label: "Token", value: "Token" },
];

export const TASK_TYPES = [
  { label: "Follow on Twitter", value: "Follow on Twitter" },
  { label: "Comment on Tweet", value: "Comment on Tweet" },
  { label: "Like Tweet", value: "Like Tweet" },
  { label: "Post on Discord", value: "Post on Discord" },
  { label: "Join Telegram Channel", value: "Join Telegram Channel" },
  { label: "Post on Telegram Group", value: "Post on Telegram Group" },
];

export const WINNER_SELECTION_METHOD = [
  { label: "Random", value: "Random" },
  { label: "FCFS", value: "FCFS" },
];

export const TASK_PREVIEW_CONFIG = {
  "Follow on Twitter": {
    label: "Twitter Profile",
    field: "twitterUrl",
  },
  "Comment on Tweet": {
    label: "Tweet URL",
    field: "tweetUrl",
  },
  "Like Tweet": {
    label: "Tweet URL",
    field: "tweetUrl",
  },
  "Post on Discord": {
    label: "Discord Link",
    field: "discordLink",
  },
  "Join Telegram Channel": {
    label: "Telegram Link",
    field: "telegramLink",
  },
  "Post on Telegram Group": {
    label: "Telegram Group Link",
    field: "telegramGroupLink",
  },
};
