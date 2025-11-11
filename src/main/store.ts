import ElectronStore from "electron-store";

const _store: any = new ElectronStore<{
  equipmentId: string;
}>({
  name: "moki-rss-config",
  clearInvalidConfig: true,
});

abstract class Store {
  static hasKey(key: string): boolean {
    return _store.has(key);
  }

  static setValue(key: string, value: string) {
    return _store.set(key, value);
  }

  static getValue(key: string) {
    return _store.get(key);
  }

  static deleteValue(key: string) {
    return _store.delete(key);
  }
}

export default Store;
