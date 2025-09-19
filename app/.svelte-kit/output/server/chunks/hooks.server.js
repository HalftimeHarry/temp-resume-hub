import PocketBase from "pocketbase";
import { P as POCKETBASE_URL } from "./config.js";
const handle = async ({ event, resolve }) => {
  const pb = new PocketBase(POCKETBASE_URL);
  const authCookie = event.cookies.get("pb_auth");
  if (authCookie) {
    try {
      pb.authStore.loadFromCookie(authCookie);
      if (pb.authStore.isValid) {
        await pb.collection("users").authRefresh();
        if (pb.authStore.model?.id && pb.authStore.model?.email) {
          event.locals.user = {
            id: pb.authStore.model.id,
            email: pb.authStore.model.email,
            name: pb.authStore.model.name,
            avatar: pb.authStore.model.avatar
          };
        }
      }
    } catch (error) {
      pb.authStore.clear();
      event.cookies.delete("pb_auth", { path: "/" });
    }
  }
  const response = await resolve(event);
  if (pb.authStore.isValid) {
    event.cookies.set("pb_auth", pb.authStore.exportToCookie(), {
      path: "/",
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7
      // 1 week
    });
  }
  return response;
};
export {
  handle
};
