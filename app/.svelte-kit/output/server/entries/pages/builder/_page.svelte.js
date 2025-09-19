import { N as sanitize_props, O as spread_props, F as slot, P as fallback, M as attr, Q as bind_props, R as store_get, S as unsubscribe_stores, D as pop, A as push, T as spread_attributes, U as clsx, I as escape_html, V as ensure_array_like, W as attr_class, X as stringify, J as copy_payload, K as assign_payload, E as head, Y as attr_style } from "../../../chunks/index2.js";
import { g as goto } from "../../../chunks/client.js";
import { c as currentUser, i as isAuthenticated, a as isLoading } from "../../../chunks/auth.js";
import { d as derived, w as writable } from "../../../chunks/index.js";
import "clsx";
import { B as Button, a as Badge } from "../../../chunks/badge.js";
import { I as Input } from "../../../chunks/input.js";
import { v as validateEmail, a as validatePhone, c as cn } from "../../../chunks/utils2.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { F as File_text } from "../../../chunks/file-text.js";
const characterLimits = {
  summary: 300,
  experienceDescription: 150,
  skillName: 30
};
const builderSteps = [
  { id: "personal", title: "Personal Info", description: "Basic contact information", isComplete: false, isRequired: true },
  { id: "summary", title: "Summary", description: "Professional summary", isComplete: false, isRequired: true },
  { id: "experience", title: "Experience", description: "Work history", isComplete: false, isRequired: true },
  { id: "education", title: "Education", description: "Academic background", isComplete: false, isRequired: true },
  { id: "skills", title: "Skills", description: "Technical & soft skills", isComplete: false, isRequired: true },
  { id: "settings", title: "Settings", description: "Layout & formatting", isComplete: false, isRequired: false },
  { id: "preview", title: "Preview", description: "Review & publish", isComplete: false, isRequired: false }
];
const defaultPersonalInfo = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  linkedin: "",
  github: "",
  summary: "",
  profileImage: ""
};
const defaultSettings = {
  layout: "1-page",
  mode: "simple",
  template: "modern",
  colorScheme: "blue",
  fontSize: "medium",
  spacing: "normal",
  showProfileImage: false,
  sectionOrder: ["personal", "summary", "experience", "education", "skills"]
};
const defaultBuilderData = {
  personalInfo: defaultPersonalInfo,
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  settings: defaultSettings,
  currentStep: "personal",
  completedSteps: []
};
const builderData = writable(defaultBuilderData);
const currentStep = writable("personal");
const hasUnsavedChanges = writable(false);
derived(
  currentStep,
  ($currentStep) => builderSteps.find((step) => step.id === $currentStep) || builderSteps[0]
);
const completionProgress = derived(
  builderData,
  ($data) => {
    const requiredSteps = builderSteps.filter((step) => step.isRequired);
    const completedRequired = requiredSteps.filter(
      (step) => $data.completedSteps.includes(step.id)
    ).length;
    return Math.round(completedRequired / requiredSteps.length * 100);
  }
);
derived(
  builderData,
  ($data) => (stepId) => $data.completedSteps.includes(stepId)
);
function goToStep(stepId) {
  if (builderSteps.find((step) => step.id === stepId)) {
    currentStep.set(stepId);
    builderData.update((data) => ({ ...data, currentStep: stepId }));
  }
}
function markStepComplete(stepId) {
  builderData.update((data) => ({
    ...data,
    completedSteps: data.completedSteps.includes(stepId) ? data.completedSteps : [...data.completedSteps, stepId]
  }));
}
function markStepIncomplete(stepId) {
  builderData.update((data) => ({
    ...data,
    completedSteps: data.completedSteps.filter((id) => id !== stepId)
  }));
}
function Arrow_left($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.544.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [
    ["path", { "d": "m12 19-7-7 7-7" }],
    ["path", { "d": "M19 12H5" }]
  ];
  Icon($$payload, spread_props([
    { name: "arrow-left" },
    $$sanitized_props,
    {
      /**
       * @component @name ArrowLeft
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTIgMTktNy03IDctNyIgLz4KICA8cGF0aCBkPSJNMTkgMTJINSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/arrow-left
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Award($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.544.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [
    [
      "path",
      {
        "d": "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"
      }
    ],
    ["circle", { "cx": "12", "cy": "8", "r": "6" }]
  ];
  Icon($$payload, spread_props([
    { name: "award" },
    $$sanitized_props,
    {
      /**
       * @component @name Award
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTUuNDc3IDEyLjg5IDEuNTE1IDguNTI2YS41LjUgMCAwIDEtLjgxLjQ3bC0zLjU4LTIuNjg3YTEgMSAwIDAgMC0xLjE5NyAwbC0zLjU4NiAyLjY4NmEuNS41IDAgMCAxLS44MS0uNDY5bDEuNTE0LTguNTI2IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iOCIgcj0iNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/award
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Briefcase($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.544.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [
    [
      "path",
      { "d": "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" }
    ],
    [
      "rect",
      { "width": "20", "height": "14", "x": "2", "y": "6", "rx": "2" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "briefcase" },
    $$sanitized_props,
    {
      /**
       * @component @name Briefcase
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgMjBWNGEyIDIgMCAwIDAtMi0yaC00YTIgMiAwIDAgMC0yIDJ2MTYiIC8+CiAgPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE0IiB4PSIyIiB5PSI2IiByeD0iMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/briefcase
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Code($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.544.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [
    ["path", { "d": "m16 18 6-6-6-6" }],
    ["path", { "d": "m8 6-6 6 6 6" }]
  ];
  Icon($$payload, spread_props([
    { name: "code" },
    $$sanitized_props,
    {
      /**
       * @component @name Code
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTYgMTggNi02LTYtNiIgLz4KICA8cGF0aCBkPSJtOCA2LTYgNiA2IDYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/code
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Eye($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.544.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [
    [
      "path",
      {
        "d": "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
      }
    ],
    ["circle", { "cx": "12", "cy": "12", "r": "3" }]
  ];
  Icon($$payload, spread_props([
    { name: "eye" },
    $$sanitized_props,
    {
      /**
       * @component @name Eye
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMi4wNjIgMTIuMzQ4YTEgMSAwIDAgMSAwLS42OTYgMTAuNzUgMTAuNzUgMCAwIDEgMTkuODc2IDAgMSAxIDAgMCAxIDAgLjY5NiAxMC43NSAxMC43NSAwIDAgMS0xOS44NzYgMCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/eye
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function File_check($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.544.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [
    [
      "path",
      {
        "d": "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
      }
    ],
    ["path", { "d": "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { "d": "m9 15 2 2 4-4" }]
  ];
  Icon($$payload, spread_props([
    { name: "file-check" },
    $$sanitized_props,
    {
      /**
       * @component @name FileCheck
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjdaIiAvPgogIDxwYXRoIGQ9Ik0xNCAydjRhMiAyIDAgMCAwIDIgMmg0IiAvPgogIDxwYXRoIGQ9Im05IDE1IDIgMiA0LTQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/file-check
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Log_out($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.544.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [
    ["path", { "d": "m16 17 5-5-5-5" }],
    ["path", { "d": "M21 12H9" }],
    ["path", { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }]
  ];
  Icon($$payload, spread_props([
    { name: "log-out" },
    $$sanitized_props,
    {
      /**
       * @component @name LogOut
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTYgMTcgNS01LTUtNSIgLz4KICA8cGF0aCBkPSJNMjEgMTJIOSIgLz4KICA8cGF0aCBkPSJNOSAyMUg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/log-out
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Plus($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.544.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [["path", { "d": "M5 12h14" }], ["path", { "d": "M12 5v14" }]];
  Icon($$payload, spread_props([
    { name: "plus" },
    $$sanitized_props,
    {
      /**
       * @component @name Plus
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KICA8cGF0aCBkPSJNMTIgNXYxNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/plus
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Settings($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.544.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [
    [
      "path",
      {
        "d": "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
      }
    ],
    ["circle", { "cx": "12", "cy": "12", "r": "3" }]
  ];
  Icon($$payload, spread_props([
    { name: "settings" },
    $$sanitized_props,
    {
      /**
       * @component @name Settings
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOS42NzEgNC4xMzZhMi4zNCAyLjM0IDAgMCAxIDQuNjU5IDAgMi4zNCAyLjM0IDAgMCAwIDMuMzE5IDEuOTE1IDIuMzQgMi4zNCAwIDAgMSAyLjMzIDQuMDMzIDIuMzQgMi4zNCAwIDAgMCAwIDMuODMxIDIuMzQgMi4zNCAwIDAgMS0yLjMzIDQuMDMzIDIuMzQgMi4zNCAwIDAgMC0zLjMxOSAxLjkxNSAyLjM0IDIuMzQgMCAwIDEtNC42NTkgMCAyLjM0IDIuMzQgMCAwIDAtMy4zMi0xLjkxNSAyLjM0IDIuMzQgMCAwIDEtMi4zMy00LjAzMyAyLjM0IDIuMzQgMCAwIDAgMC0zLjgzMUEyLjM0IDIuMzQgMCAwIDEgNi4zNSA2LjA1MWEyLjM0IDIuMzQgMCAwIDAgMy4zMTktMS45MTUiIC8+CiAgPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/settings
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Trash_2($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.544.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [
    ["path", { "d": "M10 11v6" }],
    ["path", { "d": "M14 11v6" }],
    ["path", { "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }],
    ["path", { "d": "M3 6h18" }],
    ["path", { "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]
  ];
  Icon($$payload, spread_props([
    { name: "trash-2" },
    $$sanitized_props,
    {
      /**
       * @component @name Trash2
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTF2NiIgLz4KICA8cGF0aCBkPSJNMTQgMTF2NiIgLz4KICA8cGF0aCBkPSJNMTkgNnYxNGEyIDIgMCAwIDEtMiAySDdhMiAyIDAgMCAxLTItMlY2IiAvPgogIDxwYXRoIGQ9Ik0zIDZoMTgiIC8+CiAgPHBhdGggZD0iTTggNlY0YTIgMiAwIDAgMSAyLTJoNGEyIDIgMCAwIDEgMiAydjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/trash-2
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function User($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.544.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [
    ["path", { "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }],
    ["circle", { "cx": "12", "cy": "7", "r": "4" }]
  ];
  Icon($$payload, spread_props([
    { name: "user" },
    $$sanitized_props,
    {
      /**
       * @component @name User
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgMjF2LTJhNCA0IDAgMCAwLTQtNEg5YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/user
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function X($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.544.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [
    ["path", { "d": "M18 6 6 18" }],
    ["path", { "d": "m6 6 12 12" }]
  ];
  Icon($$payload, spread_props([
    { name: "x" },
    $$sanitized_props,
    {
      /**
       * @component @name X
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggNiA2IDE4IiAvPgogIDxwYXRoIGQ9Im02IDYgMTIgMTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/x
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Logo($$payload, $$props) {
  let currentSize;
  let size = fallback($$props["size"], "md");
  let showText = fallback($$props["showText"], true);
  const sizes = {
    xs: { width: 32, height: 32, fontSize: 10 },
    sm: { width: 144, height: 43, fontSize: 14 },
    md: { width: 192, height: 58, fontSize: 17 },
    lg: { width: 240, height: 72, fontSize: 19 }
  };
  currentSize = sizes[size];
  $$payload.out.push(`<svg${attr("width", currentSize.width)}${attr("height", currentSize.height)} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo svelte-a4742o"><circle cx="30" cy="30" r="25" fill="currentColor" opacity="0.1"></circle><rect x="18" y="15" width="16" height="20" rx="2" fill="currentColor" stroke="currentColor" stroke-width="1"></rect><rect x="20" y="18" width="12" height="1.5" fill="white"></rect><rect x="20" y="21" width="8" height="1.5" fill="white"></rect><rect x="20" y="24" width="10" height="1.5" fill="white"></rect><rect x="20" y="27" width="6" height="1.5" fill="white"></rect><line x1="34" y1="25" x2="42" y2="20" stroke="currentColor" stroke-width="2" opacity="0.6"></line><line x1="34" y1="30" x2="42" y2="30" stroke="currentColor" stroke-width="2" opacity="0.6"></line><line x1="34" y1="35" x2="42" y2="40" stroke="currentColor" stroke-width="2" opacity="0.6"></line><circle cx="42" cy="20" r="2" fill="currentColor"></circle><circle cx="42" cy="30" r="2" fill="currentColor"></circle><circle cx="42" cy="40" r="2" fill="currentColor"></circle>`);
  if (showText) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<text x="55" y="25" font-family="Inter, system-ui, sans-serif"${attr("font-size", currentSize.fontSize)} font-weight="700" fill="currentColor" opacity="0.8">Digital Resume</text><text x="55" y="42" font-family="Inter, system-ui, sans-serif"${attr("font-size", currentSize.fontSize)} font-weight="700" fill="currentColor">Hub</text>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></svg>`);
  bind_props($$props, { size, showText });
}
function PersonalInfoTab($$payload, $$props) {
  push();
  var $$store_subs;
  let personalInfo, isValid;
  let onNext = $$props["onNext"];
  personalInfo = store_get($$store_subs ??= {}, "$builderData", builderData).personalInfo;
  isValid = personalInfo.fullName.trim() !== "" && personalInfo.email.trim() !== "" && personalInfo.phone?.trim() !== "" && personalInfo.location?.trim() !== "" && validateEmail(personalInfo.email) && (personalInfo.phone ? validatePhone(personalInfo.phone) : true);
  {
    if (isValid) {
      markStepComplete("personal");
    } else {
      markStepIncomplete("personal");
    }
  }
  $$payload.out.push(`<div class="space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="space-y-2"><label for="fullName" class="text-sm font-medium">Full Name *</label> `);
  Input($$payload, {
    id: "fullName",
    placeholder: "John Doe",
    value: personalInfo.fullName,
    required: true
  });
  $$payload.out.push(`<!----></div> <div class="space-y-2"><label for="email" class="text-sm font-medium">Email Address *</label> `);
  Input($$payload, {
    id: "email",
    type: "email",
    placeholder: "john.doe@email.com",
    value: personalInfo.email,
    required: true
  });
  $$payload.out.push(`<!----> `);
  if (personalInfo.email && !validateEmail(personalInfo.email)) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-sm text-destructive">Please enter a valid email address</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="space-y-2"><label for="phone" class="text-sm font-medium">Phone Number *</label> `);
  Input($$payload, {
    id: "phone",
    type: "tel",
    placeholder: "(555) 123-4567",
    value: personalInfo.phone || "",
    required: true
  });
  $$payload.out.push(`<!----> `);
  if (personalInfo.phone && !validatePhone(personalInfo.phone)) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-sm text-destructive">Please enter a valid phone number</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div class="space-y-2"><label for="location" class="text-sm font-medium">Location *</label> `);
  Input($$payload, {
    id: "location",
    placeholder: "City, State",
    value: personalInfo.location || "",
    required: true
  });
  $$payload.out.push(`<!----></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="space-y-2"><label for="linkedin" class="text-sm font-medium">LinkedIn Profile</label> `);
  Input($$payload, {
    id: "linkedin",
    placeholder: "linkedin.com/in/johndoe",
    value: personalInfo.linkedin || ""
  });
  $$payload.out.push(`<!----></div> <div class="space-y-2"><label for="website" class="text-sm font-medium">Portfolio/Website</label> `);
  Input($$payload, {
    id: "website",
    placeholder: "johndoe.com",
    value: personalInfo.website || ""
  });
  $$payload.out.push(`<!----></div></div> <div class="bg-muted p-4 rounded-lg"><h4 class="font-medium mb-2">💡 Tips for First-Time Job Seekers</h4> <ul class="text-sm text-muted-foreground space-y-1"><li>• Use a professional email address (avoid nicknames)</li> <li>• Include your city and state (no need for full address)</li> <li>• Make sure your phone number has a professional voicemail</li> <li>• LinkedIn is highly recommended for professional networking</li></ul></div> <div class="flex justify-end">`);
  Button($$payload, {
    disabled: !isValid,
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Next: Summary`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { onNext });
  pop();
}
function Textarea($$payload, $$props) {
  push();
  let {
    ref = null,
    value = void 0,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out.push(`<textarea${spread_attributes(
    {
      "data-slot": "textarea",
      class: clsx(cn("border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 field-sizing-content shadow-xs flex min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className)),
      ...restProps
    }
  )}>`);
  const $$body = escape_html(value);
  if ($$body) {
    $$payload.out.push(`${$$body}`);
  }
  $$payload.out.push(`</textarea>`);
  bind_props($$props, { ref, value });
  pop();
}
function SummaryTab($$payload, $$props) {
  push();
  var $$store_subs;
  let summary, maxLength, remainingChars, isValid;
  const examples = [
    "Recent Computer Science graduate with strong foundation in programming languages including Java and Python. Eager to apply problem-solving skills and learn new technologies in a collaborative team environment. Seeking an entry-level software developer position.",
    "Motivated business student with internship experience in marketing and customer service. Excellent communication skills and proficiency in Microsoft Office Suite. Looking to start a career in business development where I can contribute to company growth.",
    "Detail-oriented Marketing graduate with hands-on experience in social media management and content creation. Strong analytical skills with experience in Google Analytics. Seeking to leverage creativity and data-driven approach in a digital marketing role."
  ];
  let onNext = $$props["onNext"];
  let onPrevious = $$props["onPrevious"];
  summary = store_get($$store_subs ??= {}, "$builderData", builderData).summary;
  maxLength = characterLimits.summary;
  remainingChars = maxLength - summary.length;
  isValid = summary.trim().length >= 50 && summary.length <= maxLength;
  {
    if (isValid) {
      markStepComplete("summary");
    } else {
      markStepIncomplete("summary");
    }
  }
  const each_array = ensure_array_like(examples);
  $$payload.out.push(`<div class="space-y-6"><div class="space-y-2"><label for="summary" class="text-sm font-medium">Professional Summary * <span class="text-muted-foreground">(${escape_html(maxLength)} characters max)</span></label> <div class="relative">`);
  Textarea($$payload, {
    id: "summary",
    placeholder: "Write a compelling summary that showcases your strengths, relevant skills, and career objectives...",
    value: summary,
    maxlength: maxLength,
    rows: 4,
    required: true,
    class: "pr-20"
  });
  $$payload.out.push(`<!----> <div${attr_class(`absolute bottom-2 right-2 text-xs ${stringify(remainingChars < 0 ? "text-destructive" : "text-muted-foreground")}`)}>${escape_html(remainingChars)} left</div></div> `);
  if (summary.trim().length < 50) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-sm text-muted-foreground">Write at least 50 characters for a meaningful summary</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div class="bg-muted p-4 rounded-lg"><h4 class="font-medium mb-3">💡 Writing Tips</h4> <ul class="text-sm text-muted-foreground space-y-1 mb-4"><li>• Start with your degree or current status (e.g., "Recent graduate...")</li> <li>• Mention 2-3 key skills or strengths</li> <li>• Include your career goal or type of position you're seeking</li> <li>• Keep it concise but impactful</li> <li>• Avoid using "I" - write in third person</li></ul> <h5 class="font-medium mb-2">Example Summaries:</h5> <div class="space-y-3"><!--[-->`);
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let example = each_array[i];
    $$payload.out.push(`<div class="bg-background p-3 rounded border"><p class="text-sm">${escape_html(example)}</p> <button class="text-xs text-primary hover:underline mt-2">Use this example</button></div>`);
  }
  $$payload.out.push(`<!--]--></div></div> <div class="flex justify-between">`);
  Button($$payload, {
    variant: "outline",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Previous`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    disabled: !isValid,
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Next: Experience`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { onNext, onPrevious });
  pop();
}
function ExperienceTab($$payload, $$props) {
  push();
  var $$store_subs;
  let experiences, isValid;
  let onNext = $$props["onNext"];
  let onPrevious = $$props["onPrevious"];
  experiences = store_get($$store_subs ??= {}, "$builderData", builderData).experience;
  isValid = experiences.length > 0 && experiences.every((exp) => exp.company.trim() !== "" && exp.position.trim() !== "" && exp.startDate.trim() !== "" && exp.description.trim() !== "");
  {
    if (isValid) {
      markStepComplete("experience");
    } else {
      markStepIncomplete("experience");
    }
  }
  $$payload.out.push(`<div class="space-y-6"><div class="flex justify-between items-center"><div><h3 class="text-lg font-semibold">Work Experience</h3> <p class="text-sm text-muted-foreground">Include internships, part-time jobs, and volunteer work</p></div> `);
  Button($$payload, {
    variant: "outline",
    size: "sm",
    children: ($$payload2) => {
      Plus($$payload2, { class: "w-4 h-4 mr-2" });
      $$payload2.out.push(`<!----> Add Experience`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div> `);
  if (experiences.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="border-2 border-dashed border-muted rounded-lg p-8 text-center"><p class="text-muted-foreground mb-4">No work experience added yet</p> `);
    Button($$payload, {
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->Add Your First Experience`);
      },
      $$slots: { default: true }
    });
    $$payload.out.push(`<!----></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    const each_array = ensure_array_like(experiences);
    $$payload.out.push(`<div class="space-y-6"><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let experience = each_array[$$index];
      $$payload.out.push(`<div class="border rounded-lg p-4 space-y-4"><div class="flex justify-between items-start"><h4 class="font-medium">Experience ${escape_html(experiences.indexOf(experience) + 1)}</h4> `);
      Button($$payload, {
        variant: "ghost",
        size: "sm",
        class: "text-destructive hover:text-destructive",
        children: ($$payload2) => {
          Trash_2($$payload2, { class: "w-4 h-4" });
        },
        $$slots: { default: true }
      });
      $$payload.out.push(`<!----></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="space-y-2"><label${attr("for", `position-${stringify(experience.id)}`)} class="text-sm font-medium">Job Title *</label> `);
      Input($$payload, {
        id: `position-${stringify(experience.id)}`,
        placeholder: "Software Developer Intern",
        value: experience.position,
        required: true
      });
      $$payload.out.push(`<!----></div> <div class="space-y-2"><label${attr("for", `company-${stringify(experience.id)}`)} class="text-sm font-medium">Company *</label> `);
      Input($$payload, {
        id: `company-${stringify(experience.id)}`,
        placeholder: "Tech Company Inc.",
        value: experience.company,
        required: true
      });
      $$payload.out.push(`<!----></div></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div class="space-y-2"><label${attr("for", `start-date-${stringify(experience.id)}`)} class="text-sm font-medium">Start Date *</label> `);
      Input($$payload, {
        id: `start-date-${stringify(experience.id)}`,
        type: "month",
        value: experience.startDate,
        required: true
      });
      $$payload.out.push(`<!----></div> <div class="space-y-2"><label${attr("for", `end-date-${stringify(experience.id)}`)} class="text-sm font-medium">End Date</label> `);
      Input($$payload, {
        id: `end-date-${stringify(experience.id)}`,
        type: "month",
        value: experience.endDate || "",
        disabled: experience.current
      });
      $$payload.out.push(`<!----></div> <div class="flex items-end"><label class="flex items-center gap-2"><input type="checkbox" class="rounded"${attr("checked", experience.current, true)}/> <span class="text-sm">Currently working here</span></label></div></div> <div class="space-y-2"><label${attr("for", `description-${stringify(experience.id)}`)} class="text-sm font-medium">Description * <span class="text-muted-foreground">(${escape_html(characterLimits.experienceDescription)} characters max)</span></label> `);
      Textarea($$payload, {
        id: `description-${stringify(experience.id)}`,
        placeholder: "Describe your key responsibilities and achievements...",
        value: experience.description,
        maxlength: characterLimits.experienceDescription,
        rows: 3,
        required: true
      });
      $$payload.out.push(`<!----></div></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--> <div class="bg-muted p-4 rounded-lg"><h4 class="font-medium mb-2">💡 Experience Tips</h4> <ul class="text-sm text-muted-foreground space-y-1"><li>• Include internships, part-time jobs, and relevant volunteer work</li> <li>• Focus on achievements and impact, not just duties</li> <li>• Use action verbs (developed, managed, created, improved)</li> <li>• Quantify results when possible (increased sales by 20%)</li> <li>• Keep descriptions concise but informative</li></ul></div> <div class="flex justify-between">`);
  Button($$payload, {
    variant: "outline",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Previous`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    disabled: !isValid,
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Next: Education`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { onNext, onPrevious });
  pop();
}
function EducationTab($$payload, $$props) {
  push();
  var $$store_subs;
  let education, isValid;
  let onNext = $$props["onNext"];
  let onPrevious = $$props["onPrevious"];
  education = store_get($$store_subs ??= {}, "$builderData", builderData).education;
  isValid = education.length > 0 && education.every((edu) => edu.institution.trim() !== "" && edu.degree.trim() !== "" && edu.field?.trim() !== "" && edu.startDate.trim() !== "");
  {
    if (isValid) {
      markStepComplete("education");
    } else {
      markStepIncomplete("education");
    }
  }
  $$payload.out.push(`<div class="space-y-6"><div class="flex justify-between items-center"><div><h3 class="text-lg font-semibold">Education</h3> <p class="text-sm text-muted-foreground">Add your educational background and qualifications</p></div> `);
  Button($$payload, {
    variant: "outline",
    size: "sm",
    children: ($$payload2) => {
      Plus($$payload2, { class: "w-4 h-4 mr-2" });
      $$payload2.out.push(`<!----> Add Education`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div> `);
  if (education.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="border-2 border-dashed border-muted rounded-lg p-8 text-center"><p class="text-muted-foreground mb-4">No education added yet</p> `);
    Button($$payload, {
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->Add Your Education`);
      },
      $$slots: { default: true }
    });
    $$payload.out.push(`<!----></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    const each_array = ensure_array_like(education);
    $$payload.out.push(`<div class="space-y-6"><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let edu = each_array[$$index];
      $$payload.out.push(`<div class="border rounded-lg p-4 space-y-4"><div class="flex justify-between items-start"><h4 class="font-medium">Education ${escape_html(education.indexOf(edu) + 1)}</h4> `);
      Button($$payload, {
        variant: "ghost",
        size: "sm",
        class: "text-destructive hover:text-destructive",
        children: ($$payload2) => {
          Trash_2($$payload2, { class: "w-4 h-4" });
        },
        $$slots: { default: true }
      });
      $$payload.out.push(`<!----></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="space-y-2"><label${attr("for", `institution-${stringify(edu.id)}`)} class="text-sm font-medium">School/University *</label> `);
      Input($$payload, {
        id: `institution-${stringify(edu.id)}`,
        placeholder: "University of Technology",
        value: edu.institution,
        required: true
      });
      $$payload.out.push(`<!----></div> <div class="space-y-2"><label${attr("for", `degree-${stringify(edu.id)}`)} class="text-sm font-medium">Degree *</label> `);
      Input($$payload, {
        id: `degree-${stringify(edu.id)}`,
        placeholder: "Bachelor of Science",
        value: edu.degree,
        required: true
      });
      $$payload.out.push(`<!----></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="space-y-2"><label${attr("for", `field-${stringify(edu.id)}`)} class="text-sm font-medium">Field of Study *</label> `);
      Input($$payload, {
        id: `field-${stringify(edu.id)}`,
        placeholder: "Computer Science",
        value: edu.field || "",
        required: true
      });
      $$payload.out.push(`<!----></div> <div class="space-y-2"><label${attr("for", `location-${stringify(edu.id)}`)} class="text-sm font-medium">Location</label> `);
      Input($$payload, {
        id: `location-${stringify(edu.id)}`,
        placeholder: "City, State",
        value: edu.location || ""
      });
      $$payload.out.push(`<!----></div></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div class="space-y-2"><label${attr("for", `start-date-${stringify(edu.id)}`)} class="text-sm font-medium">Start Date *</label> `);
      Input($$payload, {
        id: `start-date-${stringify(edu.id)}`,
        type: "month",
        value: edu.startDate,
        required: true
      });
      $$payload.out.push(`<!----></div> <div class="space-y-2"><label${attr("for", `end-date-${stringify(edu.id)}`)} class="text-sm font-medium">End Date</label> `);
      Input($$payload, {
        id: `end-date-${stringify(edu.id)}`,
        type: "month",
        value: edu.endDate || "",
        disabled: edu.current
      });
      $$payload.out.push(`<!----></div> <div class="flex items-end"><label class="flex items-center gap-2"><input type="checkbox" class="rounded"${attr("checked", edu.current, true)}/> <span class="text-sm">Currently enrolled</span></label></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="space-y-2"><label${attr("for", `gpa-${stringify(edu.id)}`)} class="text-sm font-medium">GPA (Optional)</label> `);
      Input($$payload, {
        id: `gpa-${stringify(edu.id)}`,
        placeholder: "3.8/4.0",
        value: edu.gpa || ""
      });
      $$payload.out.push(`<!----></div> <div class="space-y-2"><label${attr("for", `honors-${stringify(edu.id)}`)} class="text-sm font-medium">Honors (Optional)</label> `);
      Input($$payload, {
        id: `honors-${stringify(edu.id)}`,
        placeholder: "Magna Cum Laude, Dean's List",
        value: edu.honors?.join(", ") || ""
      });
      $$payload.out.push(`<!----></div></div></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--> <div class="bg-muted p-4 rounded-lg"><h4 class="font-medium mb-2">💡 Education Tips</h4> <ul class="text-sm text-muted-foreground space-y-1"><li>• List your most recent education first</li> <li>• Include relevant coursework if you're a recent graduate</li> <li>• Only include GPA if it's 3.5 or higher</li> <li>• Mention honors, awards, or relevant activities</li> <li>• For high school, only include if you don't have college education</li></ul></div> <div class="flex justify-between">`);
  Button($$payload, {
    variant: "outline",
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Previous`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----> `);
  Button($$payload, {
    disabled: !isValid,
    children: ($$payload2) => {
      $$payload2.out.push(`<!---->Next: Skills`);
    },
    $$slots: { default: true }
  });
  $$payload.out.push(`<!----></div></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { onNext, onPrevious });
  pop();
}
function SkillsTab($$payload, $$props) {
  push();
  var $$store_subs;
  let skills, technicalSkills, softSkills, languageSkills, isValid;
  let newTechnicalSkill = "";
  let newSoftSkill = "";
  let newLanguageSkill = "";
  const technicalSuggestions = [
    "JavaScript",
    "Python",
    "Java",
    "React",
    "Node.js",
    "HTML/CSS",
    "SQL",
    "Git",
    "Microsoft Office",
    "Excel",
    "PowerPoint",
    "Photoshop",
    "WordPress",
    "Google Analytics"
  ];
  const softSuggestions = [
    "Communication",
    "Teamwork",
    "Problem Solving",
    "Leadership",
    "Time Management",
    "Critical Thinking",
    "Adaptability",
    "Customer Service",
    "Project Management",
    "Creativity"
  ];
  const languageSuggestions = [
    "Spanish",
    "French",
    "German",
    "Mandarin",
    "Japanese",
    "Portuguese",
    "Italian",
    "Arabic"
  ];
  let onNext = $$props["onNext"];
  let onPrevious = $$props["onPrevious"];
  skills = store_get($$store_subs ??= {}, "$builderData", builderData).skills;
  technicalSkills = skills.filter((skill) => skill.category === "technical");
  softSkills = skills.filter((skill) => skill.category === "soft");
  languageSkills = skills.filter((skill) => skill.category === "language");
  isValid = skills.length >= 3;
  {
    if (isValid) {
      markStepComplete("skills");
    } else {
      markStepIncomplete("skills");
    }
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    const each_array_1 = ensure_array_like(technicalSuggestions.slice(0, 6));
    const each_array_3 = ensure_array_like(softSuggestions.slice(0, 6));
    const each_array_5 = ensure_array_like(languageSuggestions.slice(0, 4));
    $$payload2.out.push(`<div class="space-y-6"><div><h3 class="text-lg font-semibold">Skills</h3> <p class="text-sm text-muted-foreground">Add your technical skills, soft skills, and languages (minimum 3 skills required)</p></div> <div class="space-y-4"><h4 class="font-medium">Technical Skills</h4> <div class="space-y-2"><div class="flex gap-2">`);
    Input($$payload2, {
      placeholder: "e.g., JavaScript, Python, React",
      maxlength: characterLimits.skillName,
      class: "flex-1",
      get value() {
        return newTechnicalSkill;
      },
      set value($$value) {
        newTechnicalSkill = $$value;
        $$settled = false;
      }
    });
    $$payload2.out.push(`<!----> `);
    Button($$payload2, {
      variant: "outline",
      disabled: !newTechnicalSkill.trim(),
      children: ($$payload3) => {
        $$payload3.out.push(`<!---->Add`);
      },
      $$slots: { default: true }
    });
    $$payload2.out.push(`<!----></div> `);
    if (technicalSkills.length > 0) {
      $$payload2.out.push("<!--[-->");
      const each_array = ensure_array_like(technicalSkills);
      $$payload2.out.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let skill = each_array[$$index];
        Badge($$payload2, {
          variant: "secondary",
          class: "flex items-center gap-1",
          children: ($$payload3) => {
            $$payload3.out.push(`<!---->${escape_html(skill.name)} <button class="ml-1 hover:text-destructive">`);
            X($$payload3, { class: "w-3 h-3" });
            $$payload3.out.push(`<!----></button>`);
          },
          $$slots: { default: true }
        });
      }
      $$payload2.out.push(`<!--]--></div>`);
    } else {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]--> <div class="text-xs text-muted-foreground"><span class="font-medium">Suggestions:</span> <!--[-->`);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let suggestion = each_array_1[$$index_1];
      $$payload2.out.push(`<button class="ml-2 text-primary hover:underline">${escape_html(suggestion)}</button>`);
    }
    $$payload2.out.push(`<!--]--></div></div></div> <div class="space-y-4"><h4 class="font-medium">Soft Skills</h4> <div class="space-y-2"><div class="flex gap-2">`);
    Input($$payload2, {
      placeholder: "e.g., Communication, Teamwork",
      maxlength: characterLimits.skillName,
      class: "flex-1",
      get value() {
        return newSoftSkill;
      },
      set value($$value) {
        newSoftSkill = $$value;
        $$settled = false;
      }
    });
    $$payload2.out.push(`<!----> `);
    Button($$payload2, {
      variant: "outline",
      disabled: !newSoftSkill.trim(),
      children: ($$payload3) => {
        $$payload3.out.push(`<!---->Add`);
      },
      $$slots: { default: true }
    });
    $$payload2.out.push(`<!----></div> `);
    if (softSkills.length > 0) {
      $$payload2.out.push("<!--[-->");
      const each_array_2 = ensure_array_like(softSkills);
      $$payload2.out.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let skill = each_array_2[$$index_2];
        Badge($$payload2, {
          variant: "outline",
          class: "flex items-center gap-1",
          children: ($$payload3) => {
            $$payload3.out.push(`<!---->${escape_html(skill.name)} <button class="ml-1 hover:text-destructive">`);
            X($$payload3, { class: "w-3 h-3" });
            $$payload3.out.push(`<!----></button>`);
          },
          $$slots: { default: true }
        });
      }
      $$payload2.out.push(`<!--]--></div>`);
    } else {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]--> <div class="text-xs text-muted-foreground"><span class="font-medium">Suggestions:</span> <!--[-->`);
    for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
      let suggestion = each_array_3[$$index_3];
      $$payload2.out.push(`<button class="ml-2 text-primary hover:underline">${escape_html(suggestion)}</button>`);
    }
    $$payload2.out.push(`<!--]--></div></div></div> <div class="space-y-4"><h4 class="font-medium">Languages</h4> <div class="space-y-2"><div class="flex gap-2">`);
    Input($$payload2, {
      placeholder: "e.g., Spanish, French",
      maxlength: characterLimits.skillName,
      class: "flex-1",
      get value() {
        return newLanguageSkill;
      },
      set value($$value) {
        newLanguageSkill = $$value;
        $$settled = false;
      }
    });
    $$payload2.out.push(`<!----> `);
    Button($$payload2, {
      variant: "outline",
      disabled: !newLanguageSkill.trim(),
      children: ($$payload3) => {
        $$payload3.out.push(`<!---->Add`);
      },
      $$slots: { default: true }
    });
    $$payload2.out.push(`<!----></div> `);
    if (languageSkills.length > 0) {
      $$payload2.out.push("<!--[-->");
      const each_array_4 = ensure_array_like(languageSkills);
      $$payload2.out.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
      for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
        let skill = each_array_4[$$index_4];
        Badge($$payload2, {
          variant: "default",
          class: "flex items-center gap-1",
          children: ($$payload3) => {
            $$payload3.out.push(`<!---->${escape_html(skill.name)} <button class="ml-1 hover:text-destructive">`);
            X($$payload3, { class: "w-3 h-3" });
            $$payload3.out.push(`<!----></button>`);
          },
          $$slots: { default: true }
        });
      }
      $$payload2.out.push(`<!--]--></div>`);
    } else {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]--> <div class="text-xs text-muted-foreground"><span class="font-medium">Suggestions:</span> <!--[-->`);
    for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
      let suggestion = each_array_5[$$index_5];
      $$payload2.out.push(`<button class="ml-2 text-primary hover:underline">${escape_html(suggestion)}</button>`);
    }
    $$payload2.out.push(`<!--]--></div></div></div> <div class="bg-muted p-4 rounded-lg"><h4 class="font-medium mb-2">💡 Skill Tips</h4> <ul class="text-sm text-muted-foreground space-y-1"><li>• Focus on skills relevant to your target job</li> <li>• Include both technical and soft skills</li> <li>• Be honest about your skill level</li> <li>• Use industry-standard terminology</li> <li>• Add at least 3-5 skills for a complete profile</li></ul></div> `);
    if (skills.length < 3) {
      $$payload2.out.push("<!--[-->");
      $$payload2.out.push(`<div class="bg-yellow-50 border border-yellow-200 p-3 rounded-lg"><p class="text-sm text-yellow-800">Add at least ${escape_html(3 - skills.length)} more skill${escape_html(3 - skills.length === 1 ? "" : "s")} to continue.</p></div>`);
    } else {
      $$payload2.out.push("<!--[!-->");
    }
    $$payload2.out.push(`<!--]--> <div class="flex justify-between">`);
    Button($$payload2, {
      variant: "outline",
      children: ($$payload3) => {
        $$payload3.out.push(`<!---->Previous`);
      },
      $$slots: { default: true }
    });
    $$payload2.out.push(`<!----> `);
    Button($$payload2, {
      disabled: !isValid,
      children: ($$payload3) => {
        $$payload3.out.push(`<!---->Next: Settings`);
      },
      $$slots: { default: true }
    });
    $$payload2.out.push(`<!----></div></div>`);
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { onNext, onPrevious });
  pop();
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let activeTab, progress, unsavedChanges, authenticated, loading;
  const tabs = [
    {
      id: "personal",
      label: "Personal Info",
      icon: User,
      description: "Basic contact details"
    },
    {
      id: "summary",
      label: "Summary",
      icon: File_check,
      description: "Professional summary"
    },
    {
      id: "experience",
      label: "Experience",
      icon: Briefcase,
      description: "Work history"
    },
    {
      id: "education",
      label: "Education",
      icon: Award,
      description: "Academic background"
    },
    {
      id: "skills",
      label: "Skills",
      icon: Code,
      description: "Technical & soft skills"
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Layout & formatting"
    },
    {
      id: "preview",
      label: "Preview",
      icon: Eye,
      description: "Review & publish"
    }
  ];
  function handleTabChange(tabId) {
    goToStep(tabId);
  }
  activeTab = store_get($$store_subs ??= {}, "$currentStep", currentStep);
  progress = store_get($$store_subs ??= {}, "$completionProgress", completionProgress);
  unsavedChanges = store_get($$store_subs ??= {}, "$hasUnsavedChanges", hasUnsavedChanges);
  store_get($$store_subs ??= {}, "$currentUser", currentUser);
  authenticated = store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated);
  loading = store_get($$store_subs ??= {}, "$isLoading", isLoading);
  {
    console.log("🔐 Builder Auth Debug - Loading:", store_get($$store_subs ??= {}, "$isLoading", isLoading), "User:", store_get($$store_subs ??= {}, "$currentUser", currentUser), "Authenticated:", store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated));
    if (!store_get($$store_subs ??= {}, "$isLoading", isLoading) && !store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated)) {
      console.log("🔐 Builder: Redirecting to login - not authenticated");
      goto();
    }
  }
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Resume Builder - Create Your Professional Resume</title>`;
  });
  if (loading) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="min-h-screen flex items-center justify-center"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div> <p class="text-muted-foreground">Loading...</p></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    if (authenticated) {
      $$payload.out.push("<!--[-->");
      const each_array = ensure_array_like(tabs);
      $$payload.out.push(`<div class="min-h-screen bg-gray-50"><header class="bg-white border-b"><div class="container mx-auto px-4 py-4"><div class="flex items-center justify-between"><div class="flex items-center gap-3"><button class="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">`);
      Arrow_left($$payload, { class: "w-4 h-4" });
      $$payload.out.push(`<!----> Dashboard</button> `);
      Logo($$payload, { size: "sm", showText: false });
      $$payload.out.push(`<!----> <div><h1 class="text-xl font-semibold">Resume Builder</h1> <p class="text-sm text-muted-foreground">Create your professional resume step by step</p></div></div> <div class="flex items-center gap-2">`);
      Button($$payload, {
        variant: "outline",
        size: "sm",
        disabled: !unsavedChanges,
        children: ($$payload2) => {
          $$payload2.out.push(`<!---->${escape_html(unsavedChanges ? "Save Draft" : "Saved")}`);
        },
        $$slots: { default: true }
      });
      $$payload.out.push(`<!----> `);
      Button($$payload, {
        size: "sm",
        children: ($$payload2) => {
          $$payload2.out.push(`<!---->Publish Resume`);
        },
        $$slots: { default: true }
      });
      $$payload.out.push(`<!----> `);
      if (store_get($$store_subs ??= {}, "$currentUser", currentUser)) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="flex items-center gap-2 text-sm text-muted-foreground ml-4">`);
        User($$payload, { class: "w-4 h-4" });
        $$payload.out.push(`<!----> <span>${escape_html(store_get($$store_subs ??= {}, "$currentUser", currentUser).email)}</span></div> <button class="flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-md">`);
        Log_out($$payload, { class: "w-4 h-4" });
        $$payload.out.push(`<!----></button>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></div></div></div></header> <div class="container mx-auto px-4 py-6"><div class="grid grid-cols-1 lg:grid-cols-4 gap-6"><div class="lg:col-span-1"><div class="bg-white rounded-lg border p-4 sticky top-6"><h3 class="font-semibold mb-4">Resume Sections</h3> <nav class="space-y-2"><!--[-->`);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tab = each_array[$$index];
        $$payload.out.push(`<button${attr_class(`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${stringify(activeTab === tab.id ? "bg-primary text-primary-foreground" : "hover:bg-muted")}`)}><!---->`);
        tab.icon?.($$payload, { class: "w-4 h-4" });
        $$payload.out.push(`<!----> <div class="flex-1"><div class="font-medium text-sm">${escape_html(tab.label)}</div> <div class="text-xs opacity-75">${escape_html(tab.description)}</div></div></button>`);
      }
      $$payload.out.push(`<!--]--></nav> <div class="mt-6 pt-4 border-t"><div class="flex justify-between text-sm text-muted-foreground mb-2"><span>Progress</span> <span>${escape_html(progress)}% Complete</span></div> <div class="w-full bg-secondary rounded-full h-2"><div class="bg-primary h-2 rounded-full transition-all duration-300"${attr_style(`width: ${stringify(progress)}%`)}></div></div></div></div></div> <div class="lg:col-span-3"><div class="bg-white rounded-lg border p-6">`);
      if (activeTab === "personal") {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="mb-6"><h2 class="text-2xl font-bold mb-2">Personal Information</h2> <p class="text-muted-foreground">Add your basic contact details and professional links</p></div> `);
        PersonalInfoTab($$payload, { onNext: () => handleTabChange("summary") });
        $$payload.out.push(`<!---->`);
      } else {
        $$payload.out.push("<!--[!-->");
        if (activeTab === "summary") {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<div class="mb-6"><h2 class="text-2xl font-bold mb-2">Professional Summary</h2> <p class="text-muted-foreground">Write a compelling summary that highlights your strengths and career goals</p></div> `);
          SummaryTab($$payload, {
            onNext: () => handleTabChange("experience"),
            onPrevious: () => handleTabChange("personal")
          });
          $$payload.out.push(`<!---->`);
        } else {
          $$payload.out.push("<!--[!-->");
          if (activeTab === "experience") {
            $$payload.out.push("<!--[-->");
            $$payload.out.push(`<div class="mb-6"><h2 class="text-2xl font-bold mb-2">Work Experience</h2> <p class="text-muted-foreground">Add your work history, internships, and relevant experience</p></div> `);
            ExperienceTab($$payload, {
              onNext: () => handleTabChange("education"),
              onPrevious: () => handleTabChange("summary")
            });
            $$payload.out.push(`<!---->`);
          } else {
            $$payload.out.push("<!--[!-->");
            if (activeTab === "education") {
              $$payload.out.push("<!--[-->");
              $$payload.out.push(`<div class="mb-6"><h2 class="text-2xl font-bold mb-2">Education</h2> <p class="text-muted-foreground">Add your educational background and qualifications</p></div> `);
              EducationTab($$payload, {
                onNext: () => handleTabChange("skills"),
                onPrevious: () => handleTabChange("experience")
              });
              $$payload.out.push(`<!---->`);
            } else {
              $$payload.out.push("<!--[!-->");
              if (activeTab === "skills") {
                $$payload.out.push("<!--[-->");
                $$payload.out.push(`<div class="mb-6"><h2 class="text-2xl font-bold mb-2">Skills</h2> <p class="text-muted-foreground">Add your technical skills, soft skills, and languages</p></div> `);
                SkillsTab($$payload, {
                  onNext: () => handleTabChange("settings"),
                  onPrevious: () => handleTabChange("education")
                });
                $$payload.out.push(`<!---->`);
              } else {
                $$payload.out.push("<!--[!-->");
                if (activeTab === "settings") {
                  $$payload.out.push("<!--[-->");
                  $$payload.out.push(`<div class="mb-6"><h2 class="text-2xl font-bold mb-2">Resume Settings</h2> <p class="text-muted-foreground">Customize your resume layout and formatting</p></div> <div class="space-y-8"><div class="space-y-4"><h3 class="text-lg font-semibold">Resume Length</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><button class="p-4 border-2 border-primary bg-primary/5 rounded-lg text-left"><div class="font-medium mb-2">1 Page</div> <p class="text-sm text-muted-foreground">Perfect for entry-level positions. Concise and focused.</p></button> <button class="p-4 border rounded-lg text-left hover:border-primary"><div class="font-medium mb-2">2 Pages Max</div> <p class="text-sm text-muted-foreground">More space for experience and projects.</p></button></div></div> <div class="space-y-4"><h3 class="text-lg font-semibold">Template Style</h3> <div class="grid grid-cols-3 gap-4"><button class="p-4 border-2 border-primary bg-primary/5 rounded-lg text-center"><div class="font-medium">Modern</div></button> <button class="p-4 border rounded-lg text-center hover:border-primary"><div class="font-medium">Classic</div></button> <button class="p-4 border rounded-lg text-center hover:border-primary"><div class="font-medium">Minimal</div></button></div></div> <div class="space-y-4"><h3 class="text-lg font-semibold">Color Scheme</h3> <div class="grid grid-cols-4 gap-4"><button class="p-3 border-2 border-primary bg-primary/5 rounded-lg text-center"><div class="w-6 h-6 bg-blue-500 rounded mx-auto mb-1"></div> <div class="text-sm">Blue</div></button> <button class="p-3 border rounded-lg text-center hover:border-primary"><div class="w-6 h-6 bg-green-500 rounded mx-auto mb-1"></div> <div class="text-sm">Green</div></button> <button class="p-3 border rounded-lg text-center hover:border-primary"><div class="w-6 h-6 bg-purple-500 rounded mx-auto mb-1"></div> <div class="text-sm">Purple</div></button> <button class="p-3 border rounded-lg text-center hover:border-primary"><div class="w-6 h-6 bg-gray-800 rounded mx-auto mb-1"></div> <div class="text-sm">Black</div></button></div></div></div> <div class="mt-8 flex justify-between">`);
                  Button($$payload, {
                    variant: "outline",
                    children: ($$payload2) => {
                      $$payload2.out.push(`<!---->Previous`);
                    },
                    $$slots: { default: true }
                  });
                  $$payload.out.push(`<!----> `);
                  Button($$payload, {
                    children: ($$payload2) => {
                      $$payload2.out.push(`<!---->Next: Preview`);
                    },
                    $$slots: { default: true }
                  });
                  $$payload.out.push(`<!----></div>`);
                } else {
                  $$payload.out.push("<!--[!-->");
                  if (activeTab === "preview") {
                    $$payload.out.push("<!--[-->");
                    $$payload.out.push(`<div class="mb-6"><h2 class="text-2xl font-bold mb-2">Preview &amp; Publish</h2> <p class="text-muted-foreground">Review your resume and publish it to share with employers</p></div> <div class="space-y-6"><div class="bg-muted p-4 rounded-lg"><h3 class="font-semibold mb-3">Resume Completion Status</h3> <div class="space-y-2"><div class="flex justify-between"><span>Personal Information</span> <span class="text-green-600">✅ Complete</span></div> <div class="flex justify-between"><span>Professional Summary</span> <span class="text-green-600">✅ Complete</span></div> <div class="flex justify-between"><span>Work Experience</span> <span class="text-yellow-600">⏳ In Progress</span></div> <div class="flex justify-between"><span>Education</span> <span class="text-green-600">✅ Complete</span></div> <div class="flex justify-between"><span>Skills</span> <span class="text-green-600">✅ Complete</span></div></div></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-4">`);
                    Button($$payload, {
                      variant: "outline",
                      class: "h-auto p-4 flex flex-col items-center gap-2",
                      children: ($$payload2) => {
                        Eye($$payload2, { class: "w-6 h-6" });
                        $$payload2.out.push(`<!----> <span>Preview Resume</span>`);
                      },
                      $$slots: { default: true }
                    });
                    $$payload.out.push(`<!----> `);
                    Button($$payload, {
                      variant: "outline",
                      class: "h-auto p-4 flex flex-col items-center gap-2",
                      children: ($$payload2) => {
                        File_text($$payload2, { class: "w-6 h-6" });
                        $$payload2.out.push(`<!----> <span>Download PDF</span>`);
                      },
                      $$slots: { default: true }
                    });
                    $$payload.out.push(`<!----> `);
                    Button($$payload, {
                      class: "h-auto p-4 flex flex-col items-center gap-2",
                      children: ($$payload2) => {
                        File_check($$payload2, { class: "w-6 h-6" });
                        $$payload2.out.push(`<!----> <span>Publish Resume</span>`);
                      },
                      $$slots: { default: true }
                    });
                    $$payload.out.push(`<!----></div> <div class="bg-green-50 border border-green-200 p-4 rounded-lg"><h4 class="font-medium text-green-800 mb-2">🎉 Almost Ready!</h4> <p class="text-sm text-green-700">Complete the remaining sections and your resume will be ready to publish and share with employers.</p></div></div> <div class="mt-8 flex justify-between">`);
                    Button($$payload, {
                      variant: "outline",
                      children: ($$payload2) => {
                        $$payload2.out.push(`<!---->Previous`);
                      },
                      $$slots: { default: true }
                    });
                    $$payload.out.push(`<!----> `);
                    Button($$payload, {
                      children: ($$payload2) => {
                        $$payload2.out.push(`<!---->Publish Resume`);
                      },
                      $$slots: { default: true }
                    });
                    $$payload.out.push(`<!----></div>`);
                  } else {
                    $$payload.out.push("<!--[!-->");
                  }
                  $$payload.out.push(`<!--]-->`);
                }
                $$payload.out.push(`<!--]-->`);
              }
              $$payload.out.push(`<!--]-->`);
            }
            $$payload.out.push(`<!--]-->`);
          }
          $$payload.out.push(`<!--]-->`);
        }
        $$payload.out.push(`<!--]-->`);
      }
      $$payload.out.push(`<!--]--></div></div></div></div></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      $$payload.out.push(`<div class="min-h-screen flex items-center justify-center"><div class="text-center"><h1 class="text-2xl font-bold mb-4">Authentication Required</h1> <p class="text-muted-foreground mb-6">Please log in to access the resume builder.</p> <a href="/auth/login" class="text-primary hover:underline">Go to Login</a></div></div>`);
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]-->`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
