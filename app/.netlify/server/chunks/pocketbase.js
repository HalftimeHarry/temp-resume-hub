import PocketBase from "pocketbase";
import { w as writable } from "./index.js";
import { P as POCKETBASE_URL } from "./config.js";
const pb = new PocketBase(POCKETBASE_URL);
const currentUser = writable(pb.authStore.model);
pb.authStore.onChange((auth2) => {
  currentUser.set(pb.authStore.model);
});
