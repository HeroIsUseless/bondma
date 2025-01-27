import { manager } from './manager';
import { KeyHandler } from './type';

function filter(event: KeyboardEvent) {
  let res = true;
  const target = (event.target || event.srcElement) as (HTMLInputElement | null);
  const tagName = target?.tagName ?? '';
  const jsdHotkeys = target?.dataset?.jsdHotkeys ?? '';
  const isInput = tagName === 'INPUT' && !['checkbox', 'radio', 'range', 'button', 'file', 'reset', 'submit', 'color'].includes(target?.type ?? '');
  if (target?.isContentEditable || jsdHotkeys === 'disabled' || ((isInput || tagName === 'TEXTAREA' || tagName === 'SELECT') && !target?.readOnly)) {
    res = false;
  }
  return res;
}

manager.filter = filter;
const resetForHotkeyMananger = manager.resetAllHotkeys.bind(manager);
const bindForHotkeyMananger = manager.bindHotkeys.bind(manager);
const getSecondKeysIsPressing = manager.getSecondKeysIsPressing.bind(manager);

export {
  resetForHotkeyMananger,
  bindForHotkeyMananger,
  getSecondKeysIsPressing
};
export type { KeyHandler };

