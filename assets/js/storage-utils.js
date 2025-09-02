// Storage utility with fallback support
const StorageUtils = (function () {
    let inMemoryStorage = {};

    function isStorageAvailable(type) {
        try {
            const storage = window[type];
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return false;
        }
    }

    const hasLocalStorage = isStorageAvailable('localStorage');
    const hasSessionStorage = isStorageAvailable('sessionStorage');

    return {
        setItem: function (key, value) {
            if (hasLocalStorage) {
                try {
                    localStorage.setItem(key, value);
                } catch (e) {
                    // Fallback to session
                    if (hasSessionStorage) {
                        sessionStorage.setItem(key, value);
                    } else {
                        inMemoryStorage[key] = value;
                    }
                }
            } else if (hasSessionStorage) {
                sessionStorage.setItem(key, value);
            } else {
                inMemoryStorage[key] = value;
            }
        },

        getItem: function (key) {
            if (hasLocalStorage) {
                try {
                    return localStorage.getItem(key);
                } catch (e) {
                    if (hasSessionStorage) {
                        return sessionStorage.getItem(key);
                    }
                    return inMemoryStorage[key] || null;
                }
            } else if (hasSessionStorage) {
                return sessionStorage.getItem(key);
            } else {
                return inMemoryStorage[key] || null;
            }
        },

        removeItem: function (key) {
            if (hasLocalStorage) {
                try {
                    localStorage.removeItem(key);
                } catch (e) { }
            }
            if (hasSessionStorage) {
                try {
                    sessionStorage.removeItem(key);
                } catch (e) { }
            }
            delete inMemoryStorage[key];
        }
    };
})();
