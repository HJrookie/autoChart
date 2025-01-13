export function hasSubset(array1, array2) {
    return array2.every(function (e) { return array1.includes(e); });
}
