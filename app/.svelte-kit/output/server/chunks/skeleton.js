import { A as push, T as spread_attributes, U as clsx, Q as bind_props, D as pop } from "./index2.js";
import { c as cn } from "./utils2.js";
function Skeleton($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out.push(`<div${spread_attributes(
    {
      "data-slot": "skeleton",
      class: clsx(cn("bg-accent animate-pulse rounded-md", className)),
      ...restProps
    }
  )}></div>`);
  bind_props($$props, { ref });
  pop();
}
export {
  Skeleton as S
};
