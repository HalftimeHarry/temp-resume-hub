
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
		RouteId(): "/" | "/auth" | "/auth/login" | "/auth/register" | "/builder" | "/dashboard" | "/resume" | "/resume/[slug]" | "/r" | "/r/[token]" | "/templates" | "/test";
		RouteParams(): {
			"/resume/[slug]": { slug: string };
			"/r/[token]": { token: string }
		};
		LayoutParams(): {
			"/": { slug?: string; token?: string };
			"/auth": Record<string, never>;
			"/auth/login": Record<string, never>;
			"/auth/register": Record<string, never>;
			"/builder": Record<string, never>;
			"/dashboard": Record<string, never>;
			"/resume": { slug?: string };
			"/resume/[slug]": { slug: string };
			"/r": { slug?: string; token?: string };
			"/r/[token]": { token: string };
			"/templates": Record<string, never>;
			"/test": Record<string, never>
		};
		Pathname(): "/" | "/auth" | "/auth/" | "/auth/login" | "/auth/login/" | "/auth/register" | "/auth/register/" | "/builder" | "/builder/" | "/dashboard" | "/dashboard/" | "/resume" | "/resume/" | `/resume/${string}` & {} | `/resume/${string}/` & {} | "/r" | "/r/" | `/r/${string}` & {} | `/r/${string}/` & {} | "/templates" | "/templates/" | "/test" | "/test/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/apple-touch-icon.png" | "/favicon.ico" | "/favicon.png" | "/icon.svg" | "/logo.svg" | "/manifest.json" | "/og-image.png" | string & {};
	}
}