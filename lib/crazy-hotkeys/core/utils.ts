import { type KeyHandler } from 'hotkeys-js';
import { secondKeys, codeToKey } from './const';
import { Hotkey } from './type';

export function createNewHotkey(shortcut: string, options: { keydown?: boolean, keyup?: boolean, splitKey?: string }, method: KeyHandler) {
  const splitKey = options.splitKey || '·';
  const keyArr = shortcut.split(splitKey);
  let key = '';
  for (let i = 0; i < keyArr.length; i++) {
    if (!secondKeys.includes(keyArr[i])) {
      key = keyArr[i];
    }
  }

  return new Hotkey(
    '',
    key,
    shortcut,
    method,
    keyArr.includes('shift'),
    keyArr.includes('ctrl'),
    keyArr.includes('alt'),
    keyArr.includes('meta'),
    !!options.keydown,
    !!options.keyup,
  );
}

/**
 * 判断event是否命中了该快捷键，如果有modifiedKey优先用modifiedKey做比较
*/
export function isHotkeyMatch(hotkey: Hotkey, event: KeyboardEvent, modifiedKey?: string): boolean {
  let eventKey = modifiedKey ?? (codeToKey[event.code] ?? event.key);
  return (hotkey.key === eventKey) &&
    hotkey.alt === !!(event.altKey) &&
    hotkey.ctrl === !!(event.ctrlKey) &&
    hotkey.shift === !!(event.shiftKey) &&
    hotkey.meta === !!(event.metaKey);
}
