import { lastIndexOf } from 'lodash';
// sign
export function sign(value) {
    if (value > 0)
        return 1;
    return value < 0 ? -1 : 0;
}
// unique
export function unique(arr) {
    var sorted = arr.slice().sort();
    var uniqArr = [sorted[0]];
    var countArr = [1];
    for (var i = 1; i < sorted.length; i += 1) {
        if (sorted[i] !== uniqArr[uniqArr.length - 1]) {
            uniqArr.push(sorted[i]);
            countArr.push(1);
        }
        else {
            countArr[countArr.length - 1] += 1;
        }
    }
    return [uniqArr, countArr];
}
// rank
export function rank(arr) {
    var sorted = arr.slice().sort();
    var rank = [];
    for (var i = 0; i < arr.length; i += 1) {
        var value = arr[i];
        var firstRank = sorted.indexOf(value) + 1;
        var lastRank = lastIndexOf(sorted, value) + 1;
        rank.push(firstRank === lastRank ? firstRank : (firstRank + lastRank) / 2);
    }
    return rank;
}
