import { secondKeys, upperKeyToKey } from './const';

export interface HotkeysEvent {
  key: string;
  keys: number[];
  method: KeyHandler;
  mods: number[];
  scope: string;
  shortcut: string;
}

export interface KeyHandler {
  (keyboardEvent: KeyboardEvent, hotkeysEvent: HotkeysEvent): void | boolean;
}

export class Hotkey {
  public active: '' | 'keydown' | 'keyup' = '';
  private _keys: string[] = [];
  private _lowerKeys: string[] = [];
  private _secondKeys: string[] = [];
  constructor(
    keys: string[],
    public keydown?: KeyHandler,
    public keyup?: KeyHandler) {
    this.keys = keys;
    this._secondKeys = keys.flatMap(key => (secondKeys.includes(key) ? [key] : []));
    this.shift = shift || (!!upperKeyToKey[key]);
  }

  get keys() {
    this.initLowerKey();
    return this._lowerKey;
  }

  set keys(value: string[]) {
    this._key = value;
  }

  private initLowerKey() {
    if (!this._lowerKey) {
      if (upperKeyToKey[this._key]) {
        this._lowerKey = upperKeyToKey[this._key];
      }
      if (!this._lowerKey) {
        this._lowerKey = this._key; // _key本来就是小写的
      }
    }
  }
}
