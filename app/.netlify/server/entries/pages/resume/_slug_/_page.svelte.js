import { G as getContext, R as store_get, E as head, S as unsubscribe_stores, D as pop, A as push } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "clsx";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/pocketbase.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  store_get($$store_subs ??= {}, "$page", page).params.slug;
  head($$payload, ($$payload2) => {
    {
      $$payload2.out.push("<!--[!-->");
      $$payload2.title = `<title>Resume - Digital Resume Hub</title>`;
    }
    $$payload2.out.push(`<!--]-->`);
  });
  {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="min-h-screen flex items-center justify-center"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div> <p class="text-muted-foreground">Loading resume...</p></div></div>`);
  }
  $$payload.out.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
