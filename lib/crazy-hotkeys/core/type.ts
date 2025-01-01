import { upperKeyToKey } from './const';

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
  private _key: string = '';
  private _lowerKey: string = '';
  public shift: boolean;
  constructor(
    public active: '' | 'keydown' | 'keyup',
    key: string,
    public shortcut: string,
    public method: KeyHandler,
    shift?: boolean,
    public ctrl?: boolean,
    public alt?: boolean,
    public meta?: boolean,
    public keydown?: boolean,
    public keyup?: boolean) {
    this.key = key;
    this.shift = shift || (!!upperKeyToKey[key]);
  }

  get key() {
    this.initLowerKey();
    return this._lowerKey;
  }

  set key(value: string) {
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
