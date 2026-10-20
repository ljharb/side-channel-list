declare namespace getStorage {
	type Storage<K, V> = {
		has: (key: K) => boolean;
		get: (key: K) => V | undefined;
		set: (key: K, value: V) => void;
		delete: (key: K) => boolean;
	};
}

declare function getStorage<K, V>(): getStorage.Storage<K, V>;

export = getStorage;
