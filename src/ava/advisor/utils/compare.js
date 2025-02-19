import isNil from './isNil';
var compare = function (f1, f2) {
    if (isNil(f1.distinct) || isNil(f2.distinct)) {
        if (f1.distinct < f2.distinct) {
            return 1;
        }
        if (f1.distinct > f2.distinct) {
            return -1;
        }
        return 0;
    }
    return 0;
};
export default compare;
