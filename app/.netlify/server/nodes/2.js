import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.i03p-l4-.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/9d-88_NU.js","_app/immutable/chunks/B82uQsSh.js","_app/immutable/chunks/BnRAE9aT.js","_app/immutable/chunks/DJmJoRxE.js","_app/immutable/chunks/BSAzuA27.js","_app/immutable/chunks/Jmd4EpEG.js","_app/immutable/chunks/DDbrnoLZ.js"];
export const stylesheets = [];
export const fonts = [];
