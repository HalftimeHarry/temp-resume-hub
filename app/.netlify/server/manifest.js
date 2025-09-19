export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","icon.svg","logo.svg","manifest.json"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.Bma0zMxf.js",app:"_app/immutable/entry/app.C8LmfPe_.js",imports:["_app/immutable/entry/start.Bma0zMxf.js","_app/immutable/chunks/WnI3-oYu.js","_app/immutable/chunks/NpgcrMAD.js","_app/immutable/chunks/DNlOMr4R.js","_app/immutable/entry/app.C8LmfPe_.js","_app/immutable/chunks/PPVm8Dsz.js","_app/immutable/chunks/DNlOMr4R.js","_app/immutable/chunks/NpgcrMAD.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/Uffus4TO.js","_app/immutable/chunks/QPJWSYHW.js","_app/immutable/chunks/CVVF92Bk.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:true},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/auth/login",
				pattern: /^\/auth\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/auth/register",
				pattern: /^\/auth\/register\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/builder",
				pattern: /^\/builder\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/resume/[slug]",
				pattern: /^\/resume\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/r/[token]",
				pattern: /^\/r\/([^/]+?)\/?$/,
				params: [{"name":"token","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/templates",
				pattern: /^\/templates\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/test",
				pattern: /^\/test\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
