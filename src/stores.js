import { writable } from "svelte/store";

export const fileUploaded = writable(false);

export const terminalText = writable(null);

export const loadedStore = writable(false);
