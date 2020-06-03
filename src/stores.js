import { writable } from "svelte/store";

export const fileUploaded = writable(false);

export const terminalText = writable(null);

export const loadedStore = writable(false);

export const transcoded = writable(false);

export const clearTerminal = writable(false);
