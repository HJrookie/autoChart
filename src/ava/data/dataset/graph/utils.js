import { __assign } from "tslib";
export function flatObject(obj, concatenator) {
    if (concatenator === void 0) { concatenator = '.'; }
    return Object.keys(obj).reduce(function (acc, key) {
        var _a;
        if (typeof obj[key] !== 'object' || obj[key] === null) {
            return __assign(__assign({}, acc), (_a = {}, _a[key] = obj[key], _a));
        }
        var flattenedChild = flatObject(obj[key], concatenator);
        return __assign(__assign({}, acc), Object.keys(flattenedChild).reduce(function (childAcc, childKey) {
            var _a;
            return (__assign(__assign({}, childAcc), (_a = {}, _a["".concat(key).concat(concatenator).concat(childKey)] = flattenedChild[childKey], _a)));
        }, {}));
    }, {});
}
