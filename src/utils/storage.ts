/**
 * Saves data to localStorage.
 *
 * @param key Storage key.
 * @param value Value to store.
 */
export function saveToStorage<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Retrieves data from localStorage.
 *
 * @param key Storage key.
 * @returns Parsed value or null.
 */
export function loadFromStorage<T>(key: string): T | null {
    const item = localStorage.getItem(key);

    if (!item) {
        return null;
    }

    return JSON.parse(item) as T;
}

/**
 * Removes data from localStorage.
 *
 * @param key Storage key.
 */
export function removeFromStorage(key: string): void {
    localStorage.removeItem(key);
}