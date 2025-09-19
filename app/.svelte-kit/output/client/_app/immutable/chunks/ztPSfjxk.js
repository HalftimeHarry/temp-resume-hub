import"./DsnmJJEf.js";import"./CfsvlyoS.js";import{k as p,a as y,b as u,p as I,f as T,d as w,aB as d,al as l,g as f,e as h,u as m}from"./DNlOMr4R.js";import{s as $}from"./Dtsv3Ddm.js";import{l as x,s as v,p as k,r as P,b as S}from"./CVVF92Bk.js";import{I as b}from"./BJWMZ0JU.js";import{b as E}from"./CyC9u20f.js";import{c as H}from"./0oEJbfLG.js";function J(r,t){const s=x(t,["children","$$slots","$$events","$$legacy"]);/**
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
 */const e=[["path",{d:"M12 15V3"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["path",{d:"m7 10 5 5 5-5"}]];b(r,v({name:"download"},()=>s,{get iconNode(){return e},children:(o,n)=>{var i=p(),a=y(i);$(a,t,"default",{}),u(o,i)},$$slots:{default:!0}}))}function K(r,t){const s=x(t,["children","$$slots","$$events","$$legacy"]);/**
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
 */const e=[["circle",{cx:"18",cy:"5",r:"3"}],["circle",{cx:"6",cy:"12",r:"3"}],["circle",{cx:"18",cy:"19",r:"3"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49"}]];b(r,v({name:"share-2"},()=>s,{get iconNode(){return e},children:(o,n)=>{var i=p(),a=y(i);$(a,t,"default",{}),u(o,i)},$$slots:{default:!0}}))}var N=T("<div></div>");function L(r,t){I(t,!0);let s=k(t,"ref",15,null),e=P(t,["$$slots","$$events","$$legacy","ref","class"]);var o=N();E(o,n=>({"data-slot":"skeleton",class:n,...e}),[()=>H("bg-accent animate-pulse rounded-md",t.class)]),S(o,n=>s(n),()=>s()),u(r,o),w()}const j=typeof document<"u";let g=0;class D{#t=d(l([]));get toasts(){return f(this.#t)}set toasts(t){h(this.#t,t,!0)}#s=d(l([]));get heights(){return f(this.#s)}set heights(t){h(this.#s,t,!0)}#e=t=>{const s=this.toasts.findIndex(e=>e.id===t);return s===-1?null:s};addToast=t=>{j&&this.toasts.unshift(t)};updateToast=({id:t,data:s,type:e,message:o})=>{const n=this.toasts.findIndex(a=>a.id===t),i=this.toasts[n];this.toasts[n]={...i,...s,id:t,title:o,type:e,updated:!0}};create=t=>{const{message:s,...e}=t,o=typeof t?.id=="number"||t.id&&t.id?.length>0?t.id:g++,n=t.dismissable===void 0?!0:t.dismissable,i=t.type===void 0?"default":t.type;return m(()=>{this.toasts.find(_=>_.id===o)?this.updateToast({id:o,data:t,type:i,message:s,dismissable:n}):this.addToast({...e,id:o,title:s,dismissable:n,type:i})}),o};dismiss=t=>(m(()=>{if(t===void 0){this.toasts=this.toasts.map(e=>({...e,dismiss:!0}));return}const s=this.toasts.findIndex(e=>e.id===t);this.toasts[s]&&(this.toasts[s]={...this.toasts[s],dismiss:!0})}),t);remove=t=>{if(t===void 0){this.toasts=[];return}const s=this.#e(t);if(s!==null)return this.toasts.splice(s,1),t};message=(t,s)=>this.create({...s,type:"default",message:t});error=(t,s)=>this.create({...s,type:"error",message:t});success=(t,s)=>this.create({...s,type:"success",message:t});info=(t,s)=>this.create({...s,type:"info",message:t});warning=(t,s)=>this.create({...s,type:"warning",message:t});loading=(t,s)=>this.create({...s,type:"loading",message:t});promise=(t,s)=>{if(!s)return;let e;s.loading!==void 0&&(e=this.create({...s,promise:t,type:"loading",message:typeof s.loading=="string"?s.loading:s.loading()}));const o=t instanceof Promise?t:t();let n=e!==void 0;return o.then(i=>{if(typeof i=="object"&&i&&"ok"in i&&typeof i.ok=="boolean"&&!i.ok){n=!1;const a=M(i);this.create({id:e,type:"error",message:a})}else if(s.success!==void 0){n=!1;const a=typeof s.success=="function"?s.success(i):s.success;this.create({id:e,type:"success",message:a})}}).catch(i=>{if(s.error!==void 0){n=!1;const a=typeof s.error=="function"?s.error(i):s.error;this.create({id:e,type:"error",message:a})}}).finally(()=>{n&&(this.dismiss(e),e=void 0),s.finally?.()}),e};custom=(t,s)=>{const e=s?.id||g++;return this.create({component:t,id:e,...s}),e};removeHeight=t=>{this.heights=this.heights.filter(s=>s.toastId!==t)};setHeight=t=>{const s=this.#e(t.toastId);if(s===null){this.heights.push(t);return}this.heights[s]=t};reset=()=>{this.toasts=[],this.heights=[]}}function M(r){return r&&typeof r=="object"&&"status"in r?`HTTP error! Status: ${r.status}`:`Error! ${r}`}const c=new D;function z(r,t){return c.create({message:r,...t})}const B=z,Q=Object.assign(B,{success:c.success,info:c.info,warning:c.warning,error:c.error,custom:c.custom,message:c.message,promise:c.promise,dismiss:c.dismiss,loading:c.loading,getActiveToasts:()=>c.toasts.filter(r=>!r.dismiss)});export{J as D,K as S,L as a,Q as t};
