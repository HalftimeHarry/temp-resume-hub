import { p as public_env } from "./shared-server.js";
const POCKETBASE_URL = public_env.PUBLIC_POCKETBASE_URL || "http://localhost:8080";
public_env.PUBLIC_APP_URL || "https://digitalresumehub.com";
export {
  POCKETBASE_URL as P
};
