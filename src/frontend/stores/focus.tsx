import { atom } from "jotai";

// The currently focused element on the page.
export const atomActiveRef = atom<HTMLElement | null>(null);
