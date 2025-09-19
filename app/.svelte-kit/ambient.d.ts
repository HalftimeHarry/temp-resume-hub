
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const POCKETBASE_URL: string;
	export const ORIGIN: string;
	export const AUTH_TRUST_HOST: string;
	export const NODE_ENV: string;
	export const GITPOD_WORKSPACE_CLASS_INFO: string;
	export const VSCODE_CWD: string;
	export const GITPOD_CONFIGCAT_ENABLED: string;
	export const GITPOD_WORKSPACE_CONTEXT_URL: string;
	export const VSCODE_ESM_ENTRYPOINT: string;
	export const USER: string;
	export const GITPOD_REPO_ROOTS: string;
	export const VSCODE_NLS_CONFIG: string;
	export const npm_config_user_agent: string;
	export const GITPOD_DISABLE_JETBRAINS_LOCAL_PORT_FORWARDING: string;
	export const GITPOD_PREVENT_METADATA_ACCESS: string;
	export const GIT_EDITOR: string;
	export const JAVA_TOOL_OPTIONS: string;
	export const NODE_VERSION: string;
	export const GITPOD_DEFAULT_WORKSPACE_IMAGE: string;
	export const GITPOD_CODE_HOST: string;
	export const VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
	export const HOSTNAME: string;
	export const YARN_VERSION: string;
	export const npm_node_execpath: string;
	export const THEIA_WEBVIEW_EXTERNAL_ENDPOINT: string;
	export const BROWSER: string;
	export const npm_config_noproxy: string;
	export const HOME: string;
	export const OLDPWD: string;
	export const VSCODE_IPC_HOOK_CLI: string;
	export const npm_package_json: string;
	export const VSX_REGISTRY_URL: string;
	export const npm_package_engines_node: string;
	export const GITPOD_TASKS: string;
	export const WORKSPACEKIT_WRAP_NETNS: string;
	export const npm_config_userconfig: string;
	export const npm_config_local_prefix: string;
	export const VISUAL: string;
	export const SUPERVISOR_ADDR: string;
	export const GITPOD_THEIA_PORT: string;
	export const COLOR: string;
	export const GITPOD_IDE_ALIAS: string;
	export const THEIA_MINI_BROWSER_HOST_PATTERN: string;
	export const GITPOD_ANALYTICS_WRITER: string;
	export const GITPOD_WORKSPACE_CONTEXT: string;
	export const GITPOD_MEMORY: string;
	export const GITPOD_GIT_USER_EMAIL: string;
	export const VSCODE_L10N_BUNDLE_LOCATION: string;
	export const GITPOD_HOST: string;
	export const GP_OPEN_EDITOR: string;
	export const GITPOD_OWNER_ID: string;
	export const VSCODE_HANDLES_SIGPIPE: string;
	export const npm_config_prefix: string;
	export const npm_config_npm_version: string;
	export const GITPOD_SSH_CA_PUBLIC_KEY: string;
	export const npm_config_cache: string;
	export const GITPOD_WORKSPACE_URL: string;
	export const GITPOD_IS_SET_JAVA_XMX: string;
	export const npm_config_node_gyp: string;
	export const PATH: string;
	export const GITPOD_GIT_USER_NAME: string;
	export const NODE: string;
	export const npm_package_name: string;
	export const THEIA_WORKSPACE_ROOT: string;
	export const GP_EXTERNAL_BROWSER: string;
	export const GITPOD_INSTANCE_ID: string;
	export const GITPOD_IS_SET_JAVA_PROCESSOR_COUNT: string;
	export const LANG: string;
	export const npm_lifecycle_script: string;
	export const GITPOD_CPU_COUNT: string;
	export const npm_package_version: string;
	export const npm_lifecycle_event: string;
	export const PROMPT_COMMAND: string;
	export const ELECTRON_RUN_AS_NODE: string;
	export const KILOCODE_POSTHOG_API_KEY: string;
	export const GITPOD_ANALYTICS_SEGMENT_ENDPOINT: string;
	export const npm_config_globalconfig: string;
	export const npm_config_init_module: string;
	export const PWD: string;
	export const LC_ALL: string;
	export const npm_execpath: string;
	export const GITPOD_WORKSPACE_CLASS: string;
	export const GITPOD_WORKSPACE_CLUSTER_HOST: string;
	export const npm_config_global_prefix: string;
	export const GITPOD_WORKSPACE_ID: string;
	export const npm_command: string;
	export const GP_PREVIEW_BROWSER: string;
	export const HISTFILE: string;
	export const GITPOD_REPO_ROOT: string;
	export const GITPOD_INTERVAL: string;
	export const THEIA_RATELIMIT_LOG: string;
	export const PNPM_HOME: string;
	export const EDITOR: string;
	export const GITPOD_COMMIT_ANNOTATION_ENABLED: string;
	export const INIT_CWD: string;
	export const VITE_USER_NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	export const PUBLIC_POCKETBASE_URL: string;
	export const PUBLIC_APP_URL: string;
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		POCKETBASE_URL: string;
		ORIGIN: string;
		AUTH_TRUST_HOST: string;
		NODE_ENV: string;
		GITPOD_WORKSPACE_CLASS_INFO: string;
		VSCODE_CWD: string;
		GITPOD_CONFIGCAT_ENABLED: string;
		GITPOD_WORKSPACE_CONTEXT_URL: string;
		VSCODE_ESM_ENTRYPOINT: string;
		USER: string;
		GITPOD_REPO_ROOTS: string;
		VSCODE_NLS_CONFIG: string;
		npm_config_user_agent: string;
		GITPOD_DISABLE_JETBRAINS_LOCAL_PORT_FORWARDING: string;
		GITPOD_PREVENT_METADATA_ACCESS: string;
		GIT_EDITOR: string;
		JAVA_TOOL_OPTIONS: string;
		NODE_VERSION: string;
		GITPOD_DEFAULT_WORKSPACE_IMAGE: string;
		GITPOD_CODE_HOST: string;
		VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
		HOSTNAME: string;
		YARN_VERSION: string;
		npm_node_execpath: string;
		THEIA_WEBVIEW_EXTERNAL_ENDPOINT: string;
		BROWSER: string;
		npm_config_noproxy: string;
		HOME: string;
		OLDPWD: string;
		VSCODE_IPC_HOOK_CLI: string;
		npm_package_json: string;
		VSX_REGISTRY_URL: string;
		npm_package_engines_node: string;
		GITPOD_TASKS: string;
		WORKSPACEKIT_WRAP_NETNS: string;
		npm_config_userconfig: string;
		npm_config_local_prefix: string;
		VISUAL: string;
		SUPERVISOR_ADDR: string;
		GITPOD_THEIA_PORT: string;
		COLOR: string;
		GITPOD_IDE_ALIAS: string;
		THEIA_MINI_BROWSER_HOST_PATTERN: string;
		GITPOD_ANALYTICS_WRITER: string;
		GITPOD_WORKSPACE_CONTEXT: string;
		GITPOD_MEMORY: string;
		GITPOD_GIT_USER_EMAIL: string;
		VSCODE_L10N_BUNDLE_LOCATION: string;
		GITPOD_HOST: string;
		GP_OPEN_EDITOR: string;
		GITPOD_OWNER_ID: string;
		VSCODE_HANDLES_SIGPIPE: string;
		npm_config_prefix: string;
		npm_config_npm_version: string;
		GITPOD_SSH_CA_PUBLIC_KEY: string;
		npm_config_cache: string;
		GITPOD_WORKSPACE_URL: string;
		GITPOD_IS_SET_JAVA_XMX: string;
		npm_config_node_gyp: string;
		PATH: string;
		GITPOD_GIT_USER_NAME: string;
		NODE: string;
		npm_package_name: string;
		THEIA_WORKSPACE_ROOT: string;
		GP_EXTERNAL_BROWSER: string;
		GITPOD_INSTANCE_ID: string;
		GITPOD_IS_SET_JAVA_PROCESSOR_COUNT: string;
		LANG: string;
		npm_lifecycle_script: string;
		GITPOD_CPU_COUNT: string;
		npm_package_version: string;
		npm_lifecycle_event: string;
		PROMPT_COMMAND: string;
		ELECTRON_RUN_AS_NODE: string;
		KILOCODE_POSTHOG_API_KEY: string;
		GITPOD_ANALYTICS_SEGMENT_ENDPOINT: string;
		npm_config_globalconfig: string;
		npm_config_init_module: string;
		PWD: string;
		LC_ALL: string;
		npm_execpath: string;
		GITPOD_WORKSPACE_CLASS: string;
		GITPOD_WORKSPACE_CLUSTER_HOST: string;
		npm_config_global_prefix: string;
		GITPOD_WORKSPACE_ID: string;
		npm_command: string;
		GP_PREVIEW_BROWSER: string;
		HISTFILE: string;
		GITPOD_REPO_ROOT: string;
		GITPOD_INTERVAL: string;
		THEIA_RATELIMIT_LOG: string;
		PNPM_HOME: string;
		EDITOR: string;
		GITPOD_COMMIT_ANNOTATION_ENABLED: string;
		INIT_CWD: string;
		VITE_USER_NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_POCKETBASE_URL: string;
		PUBLIC_APP_URL: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
