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
  let confirmPassword = "";
  let name = "";
  let username = "";
  let isLoading = false;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>Register - Digital Resume Hub</title>`;
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
                $$payload5.out.push(`<!---->Create Account`);
              },
              $$slots: { default: true }
            });
            $$payload4.out.push(`<!----> `);
            Card_description($$payload4, {
              children: ($$payload5) => {
                $$payload5.out.push(`<!---->Join Digital Resume Hub and start building your professional resume`);
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
            $$payload4.out.push(`<!--]--> <div class="space-y-2"><label for="name" class="text-sm font-medium">Full Name</label> `);
            Input($$payload4, {
              id: "name",
              type: "text",
              placeholder: "John Doe",
              disabled: isLoading,
              required: true,
              get value() {
                return name;
              },
              set value($$value) {
                name = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----></div> <div class="space-y-2"><label for="username" class="text-sm font-medium">Username</label> `);
            Input($$payload4, {
              id: "username",
              type: "text",
              placeholder: "dustind",
              disabled: isLoading,
              required: true,
              get value() {
                return username;
              },
              set value($$value) {
                username = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----> <p class="text-xs text-gray-500">Choose a unique username</p></div> <div class="space-y-2"><label for="email" class="text-sm font-medium">Email</label> `);
            Input($$payload4, {
              id: "email",
              type: "email",
              placeholder: "dustin@example.com",
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
            $$payload4.out.push(`<!----> <p class="text-xs text-gray-500">Enter a valid email address</p></div> <div class="space-y-2"><label for="password" class="text-sm font-medium">Password</label> `);
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
            $$payload4.out.push(`<!----> <p class="text-xs text-gray-500">Minimum 8 characters</p></div> <div class="space-y-2"><label for="confirmPassword" class="text-sm font-medium">Confirm Password</label> `);
            Input($$payload4, {
              id: "confirmPassword",
              type: "password",
              placeholder: "••••••••",
              disabled: isLoading,
              required: true,
              get value() {
                return confirmPassword;
              },
              set value($$value) {
                confirmPassword = $$value;
                $$settled = false;
              }
            });
            $$payload4.out.push(`<!----></div> <button class="w-full bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"${attr("disabled", !email || !password || !confirmPassword || !name || !username, true)}>${escape_html("Create Account")}</button> <div class="text-center"><p class="text-sm text-gray-600">Already have an account? <button class="text-blue-600 hover:underline font-medium">Sign in</button></p></div>`);
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
