import { J as copy_payload, K as assign_payload, D as pop, A as push, E as head } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "clsx";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/pocketbase.js";
import "../../../../chunks/badge.js";
import { S as Skeleton } from "../../../../chunks/skeleton.js";
function _page($$payload, $$props) {
  push();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      {
        $$payload3.out.push("<!--[!-->");
        $$payload3.title = `<title>Resume - Digital Resume Hub</title>`;
      }
      $$payload3.out.push(`<!--]-->`);
    });
    $$payload2.out.push(`<div class="min-h-screen bg-gray-50">`);
    {
      $$payload2.out.push("<!--[-->");
      $$payload2.out.push(`<div class="max-w-4xl mx-auto px-4 py-8"><div class="space-y-6">`);
      Skeleton($$payload2, { class: "h-16 w-full" });
      $$payload2.out.push(`<!----> <div class="grid grid-cols-1 lg:grid-cols-4 gap-6"><div class="lg:col-span-3">`);
      Skeleton($$payload2, { class: "h-96 w-full" });
      $$payload2.out.push(`<!----></div> <div class="space-y-4">`);
      Skeleton($$payload2, { class: "h-32 w-full" });
      $$payload2.out.push(`<!----> `);
      Skeleton($$payload2, { class: "h-24 w-full" });
      $$payload2.out.push(`<!----></div></div></div></div>`);
    }
    $$payload2.out.push(`<!--]--></div>`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
export {
  _page as default
};
