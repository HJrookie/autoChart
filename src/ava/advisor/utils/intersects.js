export function intersects(array1, array2) {
    return array2.some(function (e) { return array1.includes(e); });
}
