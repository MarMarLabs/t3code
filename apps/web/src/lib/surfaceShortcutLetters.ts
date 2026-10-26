type SurfaceLetterEvent = Pick<KeyboardEvent, "key"> &
  Partial<Pick<KeyboardEvent, "code" | "getModifierState">>;

/** The lowercase letters a key event can open a right panel launcher surface with. */
export function surfaceShortcutLetters(event: SurfaceLetterEvent): readonly string[] {
  // Linux and Windows report AltGr as AltGraph without Ctrl or Alt, which callers' modifier
  // checks miss, while macOS Option always sets altKey. As in keybindings.ts, AltGr text
  // other than a plain letter or digit, like the micro sign on German AltGr+M, is not a
  // launcher letter.
  if (event.getModifierState?.("AltGraph") && !/^[a-z0-9]$/i.test(event.key)) return [];
  const typed = event.key.toLowerCase();
  // Non-Latin letters and combining marks match by physical key, like the modified
  // shortcuts in keybindings.ts; one key can type several, such as the Arabic lam alef
  // ligature. Anything else typed on a letter key, like an accented Latin letter,
  // punctuation or a dead key, matches only itself.
  const physical =
    /^[\p{L}\p{M}]+$/u.test(typed) && !/\p{Script=Latin}/u.test(typed)
      ? event.code?.match(/^Key([A-Z])$/)?.[1]?.toLowerCase()
      : undefined;
  return physical === undefined ? [typed] : [typed, physical];
}
