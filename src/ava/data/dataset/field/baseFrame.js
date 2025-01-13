import { assert, isArray, isObject, isBasicType } from '../../utils';
import { generateArrayIndex, fillMissingValue, convertDataType } from './utils';
/* Base data structure */
var BaseFrame = /** @class */ (function () {
    function BaseFrame(data, extra) {
        var _a, _b, _c, _d, _e;
        this.axes = [[]];
        this.data = [];
        assert(!extra || isObject(extra), 'If extra exists, it must be an object.');
        /* 1D: basic type */
        if (isBasicType(data)) {
            // generate indexes
            if (extra === null || extra === void 0 ? void 0 : extra.indexes) {
                this.setAxis(0, extra === null || extra === void 0 ? void 0 : extra.indexes);
                this.data = Array(extra === null || extra === void 0 ? void 0 : extra.indexes.length).fill(convertDataType(fillMissingValue(data, extra === null || extra === void 0 ? void 0 : extra.fillValue), (_a = extra === null || extra === void 0 ? void 0 : extra.columnTypes) === null || _a === void 0 ? void 0 : _a[0]));
            }
            else {
                this.data = [convertDataType(fillMissingValue(data, extra === null || extra === void 0 ? void 0 : extra.fillValue), (_b = extra === null || extra === void 0 ? void 0 : extra.columnTypes) === null || _b === void 0 ? void 0 : _b[0])];
                this.setAxis(0, [0]);
            }
        }
        else if (isArray(data)) {
            /* 1D: array */
            var legal = true;
            for (var i = 0; i < data.length; i += 1) {
                var datum = data[i];
                // For DataFrame, as long as any datum in data is basic type, it's a 1D array
                if (!isBasicType(datum)) {
                    legal = false;
                    break;
                }
            }
            this.setAxis(0, generateArrayIndex(data, extra === null || extra === void 0 ? void 0 : extra.indexes));
            if (legal) {
                if (extra === null || extra === void 0 ? void 0 : extra.indexes) {
                    assert(((_c = extra === null || extra === void 0 ? void 0 : extra.indexes) === null || _c === void 0 ? void 0 : _c.length) === data.length, "Index length is ".concat(extra === null || extra === void 0 ? void 0 : extra.indexes.length, ", but data size ").concat(data.length));
                    this.setAxis(0, extra === null || extra === void 0 ? void 0 : extra.indexes);
                }
                this.data = (extra === null || extra === void 0 ? void 0 : extra.fillValue) ? data.map(function (datum) { return fillMissingValue(datum, extra === null || extra === void 0 ? void 0 : extra.fillValue); }) : data;
                if ((_d = extra === null || extra === void 0 ? void 0 : extra.columnTypes) === null || _d === void 0 ? void 0 : _d.length) {
                    for (var i = 0; i < this.data.length; i += 1) {
                        this.data[i] = convertDataType(this.data[i], (_e = extra === null || extra === void 0 ? void 0 : extra.columnTypes) === null || _e === void 0 ? void 0 : _e[0]);
                    }
                }
            }
        }
    }
    Object.defineProperty(BaseFrame.prototype, "indexes", {
        get: function () {
            return this.getAxis(0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseFrame.prototype, "columns", {
        get: function () {
            return this.getAxis(1);
        },
        enumerable: false,
        configurable: true
    });
    BaseFrame.prototype.getAxis = function (axis) {
        return this.axes[axis];
    };
    /**
     * Set axis. Only the 0 and 1 are currently supported.
     * @param axis
     * @param labels
     */
    BaseFrame.prototype.setAxis = function (axis, values) {
        assert(isArray(values), 'Index or columns must be Axis array.');
        this.axes[axis] = values;
    };
    return BaseFrame;
}());
export default BaseFrame;
