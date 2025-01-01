import { createNewHotkey, isHotkeyMatch } from './utils';
import { KeyHandler, type Hotkey } from './type';
import { codeToKey } from './const';

class HotkeyManager {
  private hotkeys: Hotkey[] = [];
  filter: (event: KeyboardEvent) => boolean = (event: KeyboardEvent) => true;
  private shiftKey: boolean = false;
  private ctrlKey: boolean = false;
  private altKey: boolean = false;
  private metaKey: boolean = false;

  constructor() {
    document.addEventListener('keydown', this.trigger.bind(this));
    document.addEventListener('keyup', this.trigger.bind(this));
  }

  // 大部分event.key没有作用/不太准
  private trigger(event: KeyboardEvent) {
    // 记录辅助键，不受任何阻碍
    this.setSecondKeys(event);

    // 返回false则不执行回调
    const isCanTrigger = this.filter?.(event);

    // 标记，标记active后将会根据active参数执行回调函数
    let eventKey = codeToKey[event.code] ?? event.key;
    // 只在keydown和keyup的时候触发，中间的连续消息不触发
    if (!event.repeat) {
    }
    for (const hotkey of this.hotkeys) {
      if (hotkey.key === eventKey && hotkey.keydown && event.type === 'keydown') {
        hotkey.active = 'keydown';
        // logHelper.log('活跃的快捷键', hotkey);
      }
      if (hotkey.key === eventKey && hotkey.keyup && event.type === 'keyup') {
        hotkey.active = 'keyup';
      }
    }

    // meta键特殊情况，meta+key没有keyup，导致meta+key键同时最多只能执行一个快捷键，也就是说清除其他快捷键标记，只保留当前快捷键标记
    if (eventKey !== 'meta' && event.metaKey && event.type === 'keydown') {
      for (const hotkey of this.hotkeys) {
        if (!isHotkeyMatch(hotkey, event)) {
          hotkey.active = '';
        }
      }
    }

    // meta键特殊情况，meta+key没有keyup，在meta键抬起时，所有具有meta辅助键的快捷键都会被清除标记，即该快捷键没有keyup
    if (eventKey === 'meta' && event.type === 'keyup') {
      for (const hotkey of this.hotkeys) {
        hotkey.active = '';
      }
    }

    // 执行
    for (const hotkey of this.hotkeys) {
      if ((event.type === 'keydown' && hotkey.active === 'keydown' && isHotkeyMatch(hotkey, event, hotkey.key))
        || (event.type === 'keyup' && hotkey.active === 'keyup' && isHotkeyMatch(hotkey, event, hotkey.key))) {
        if (isCanTrigger) {
          hotkey.method?.(event, {
            key: hotkey.key,
            keys: [],
            method: hotkey.method,
            mods: [],
            scope: '',
            shortcut: hotkey.shortcut
          });
        }
      }
      // 执行完毕后，keyup只执行一次，所以需要清除标记
      if (hotkey.active === 'keyup') {
        hotkey.active = '';
      }
    }
  }

  private setSecondKeys(event: KeyboardEvent) {
    let eventKey = codeToKey[event.code] ?? event.key;
    if (eventKey === 'shift') {
      this.shiftKey = (event.type === 'keydown');
    }
    if (eventKey === 'ctrl') {
      this.ctrlKey = (event.type === 'keydown');
    }
    if (eventKey === 'alt') {
      this.altKey = (event.type === 'keydown');
    }
    if (eventKey === 'meta') {
      this.metaKey = (event.type === 'keydown');
    }
  }

  getSecondKeysIsPressing() {
    return {
      shiftKey: this.shiftKey,
      ctrlKey: this.ctrlKey,
      altKey: this.altKey,
      metaKey: this.metaKey,
    };
  }

  bindHotkeys(shortcuts: string[], options: { keydown?: boolean, keyup?: boolean, splitKey?: string }, method: KeyHandler) {
    for (const shortcut of shortcuts) {
      this.hotkeys.push(createNewHotkey(shortcut, options, method));
    }
  }

  resetAllHotkeys() {
    this.hotkeys = [];
  }
}

export const manager = new HotkeyManager();
