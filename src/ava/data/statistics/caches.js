/**
 * Cache some statistics results to improve performance.
 */
var CACHES = new WeakMap();
/**
 * Cache the value for target and key.
 * @param target - target
 * @param key - key
 * @param value - value
 */
export function set(target, key, value) {
    if (!CACHES.get(target)) {
        CACHES.set(target, new Map());
    }
    CACHES.get(target).set(key, value);
    return value;
}
/**
 * Get the cached value for target and key.
 * @param target - target
 * @param key - key
 */
export function get(target, key) {
    var cache = CACHES.get(target);
    if (!cache)
        return undefined;
    return cache.get(key);
}
