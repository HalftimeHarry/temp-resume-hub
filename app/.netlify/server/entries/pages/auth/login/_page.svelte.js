import { J as copy_payload, K as assign_payload, D as pop, A as push, E as head, M as attr, I as escape_html } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/auth.js";
import { I as Input } from "../../../../chunks/input.js";
import { C as Card, a as Card_content } from "../../../../chunks/card-content.js";
import { C as Card_header, a as Card_title, b as Card_description } from "../../../../chunks/card-title.js";
import "clsx";
function _page($$payload, $$props) {
  push();
  let email = "";
  let password = "";
  let isLoading = false;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>Login - Digital Resume Hub</title>`;
    });
    $$payload2.out.push(`<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">`);
    Card($$payload2, {
      class: "w-full max-w-md",
      children: ($$payload3) => {
        Card_header($$payload3, {
          class: "text-center",
          children: ($$payload4) => {
            Card_title($$payload4, {
              class: "text-2xl font-bold",
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->Welcome Back`);
              },
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----> `);
            Card_description($$payload4, {
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->Sign in to your Digital Resume Hub account`);
              },
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!---->`);
          },
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!----> `);
        Card_content($$payload3, {
          class: "space-y-4",
          children: ($$payload4) => {
            {
              $$payload4.out.push("<!--[!-->");
            }
            $$payload4.out.push(`<!--]--> <div class="space-y-2"><label for="email" class="text-sm font-medium">Email</label> `);
            Input($$payload4, {
              id: "email",
              type: "email",
              placeholder: "john@example.com",
              disabled: isLoading,
              required: true,
              get value() {
                return email;
              },
              set value($$value) {
                email = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----></div> <div class="space-y-2"><label for="password" class="text-sm font-medium">Password</label> `);
            Input($$payload4, {
              id: "password",
              type: "password",
              placeholder: "••••••••",
              disabled: isLoading,
              required: true,
              get value() {
                return password;
              },
              set value($$value) {
                password = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----></div> <button class="w-full bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"${attr("disabled", !email || !password, true)}>${escape_html("Sign In")}</button> <div class="text-center space-y-2"><p class="text-sm text-gray-600">Don't have an account? <button class="text-blue-600 hover:underline font-medium">Create one</button></p> <button class="text-sm text-gray-500 hover:underline">← Back to home</button></div>`);
          },
          $$slots: { default: true }
        });
        $$payload3.out.push(`<!---->`);
      },
      $$slots: { default: true }
    });
    $$payload2.out.push(`<!----></div>`);
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
