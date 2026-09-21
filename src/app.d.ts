// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}

declare module 'remult' {
	interface UserInfo {
		/** Set while an admin is impersonating: who they really are. */
		impersonatorName?: string
	}
}
