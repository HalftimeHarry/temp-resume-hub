
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/dashboard" | "/r" | "/r/[token]" | "/test";
		RouteParams(): {
			"/r/[token]": { token: string }
		};
		LayoutParams(): {
			"/": { token?: string };
			"/dashboard": Record<string, never>;
			"/r": { token?: string };
			"/r/[token]": { token: string };
			"/test": Record<string, never>
		};
		Pathname(): "/" | "/dashboard" | "/dashboard/" | "/r" | "/r/" | `/r/${string}` & {} | `/r/${string}/` & {} | "/test" | "/test/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.png" | string & {};
	}
}