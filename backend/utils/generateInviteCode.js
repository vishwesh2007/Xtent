import crypto from "crypto";

const generateInviteCode = () => {
  return crypto.randomBytes(6).toString("base64url").slice(0, 8).toUpperCase();
};

export default generateInviteCode;
