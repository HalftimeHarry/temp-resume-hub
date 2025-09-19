import { w as writable } from "./index.js";
import "./pocketbase.js";
const currentUser = writable(null);
const isAuthenticated = writable(false);
const isLoading = writable(true);
({
  subscribe: currentUser.subscribe
});
export {
  isLoading as a,
  currentUser as c,
  isAuthenticated as i
};
