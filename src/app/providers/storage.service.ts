import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async setObject(key: string, value: any) {
    await Preferences.set({
      key: key,
      value: JSON.stringify(value)
    });
  }

  async getObject(key: string): Promise<{ value: any }> {
    const { value } = await Preferences.get({ key: key });
    return JSON.parse(value);
  }

  async removeItem(key: string) {
    await Preferences.remove({ key: key });
  }

  async clear() {
    await Preferences.clear();
  }

}