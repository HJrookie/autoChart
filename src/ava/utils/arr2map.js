export function arr2map(arr, keyId) {
    return arr.reduce(function (prev, curr) {
        // eslint-disable-next-line no-param-reassign
        prev[curr[keyId]] = curr;
        return prev;
    }, {});
}
