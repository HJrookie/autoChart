import { __extends, __read } from "tslib";
import { isObject, isNumber, isString, isInteger, isBasicType, isArray, range, assert } from '../../utils';
import { fillMissingValue, convertDataType } from './utils';
import BaseFrame from './baseFrame';
/** 1D data structure */
var Series = /** @class */ (function (_super) {
    __extends(Series, _super);
    function Series(data, extra) {
        var _this = this;
        var _a, _b, _c, _d;
        _this = _super.call(this, data, extra) || this;
        assert(isObject(data) || isBasicType(data) || isArray(data), 'Data type is illegal');
        /* 1D: object */
        if (isObject(data)) {
            // generate indexes
            var indexes = Object.keys(data);
            if (extra === null || extra === void 0 ? void 0 : extra.indexes) {
                assert(((_a = extra === null || extra === void 0 ? void 0 : extra.indexes) === null || _a === void 0 ? void 0 : _a.length) <= indexes.length, "Index length ".concat((_b = extra === null || extra === void 0 ? void 0 : extra.indexes) === null || _b === void 0 ? void 0 : _b.length, " is greater than data size ").concat(indexes.length));
                for (var i = 0; i < (extra === null || extra === void 0 ? void 0 : extra.indexes.length); i += 1) {
                    var idx = extra === null || extra === void 0 ? void 0 : extra.indexes[i];
                    if (indexes.includes(idx)) {
                        _this.data.push(convertDataType(fillMissingValue(data[idx], extra === null || extra === void 0 ? void 0 : extra.fillValue), (_c = extra === null || extra === void 0 ? void 0 : extra.columnTypes) === null || _c === void 0 ? void 0 : _c[0]));
                    }
                }
                _this.setAxis(0, extra === null || extra === void 0 ? void 0 : extra.indexes);
            }
            else {
                _this.data = Object.values(data).map(function (datum) { var _a; return convertDataType(fillMissingValue(datum, extra === null || extra === void 0 ? void 0 : extra.fillValue), (_a = extra === null || extra === void 0 ? void 0 : extra.columnTypes) === null || _a === void 0 ? void 0 : _a[0]); });
                _this.setAxis(0, indexes);
            }
        }
        else if (isArray(data)) {
            /* 1D: array */
            var _e = __read(data, 1), data0 = _e[0];
            if (!isBasicType(data0)) {
                if (extra === null || extra === void 0 ? void 0 : extra.indexes) {
                    assert(((_d = extra === null || extra === void 0 ? void 0 : extra.indexes) === null || _d === void 0 ? void 0 : _d.length) === data.length, "Index length is ".concat(extra === null || extra === void 0 ? void 0 : extra.indexes.length, ", but data size ").concat(data.length));
                    _this.setAxis(0, extra === null || extra === void 0 ? void 0 : extra.indexes);
                }
                _this.data = data;
            }
        }
        return _this;
    }
    Object.defineProperty(Series.prototype, "shape", {
        get: function () {
            return [this.axes[0].length];
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get data by row location and column location.
     * @param rowLoc
     */
    Series.prototype.get = function (rowLoc) {
        assert(isNumber(rowLoc) ||
            (isString(rowLoc) && !rowLoc.includes(':')) ||
            isArray(rowLoc) ||
            (isString(rowLoc) && rowLoc.includes(':')), 'The rowLoc is illegal');
        // input is like 0 || 'a'
        if (isNumber(rowLoc) || (isString(rowLoc) && !rowLoc.includes(':'))) {
            assert(this.indexes.includes(rowLoc), 'The rowLoc is not found in the indexes.');
            if (isNumber(rowLoc)) {
                return this.data[rowLoc];
            }
            if (isString(rowLoc)) {
                var rowIdx = this.indexes.indexOf(rowLoc);
                return this.data[rowIdx];
            }
        }
        if (isArray(rowLoc)) {
            // input is like [0, 1, 2] || ['a', 'b', 'c']
            var newData = [];
            var newIndex = [];
            for (var i = 0; i < rowLoc.length; i += 1) {
                var loc = rowLoc[i];
                assert(this.indexes.includes(loc), 'The rowLoc is not found in the indexes.');
                var idxInIndex = this.indexes.indexOf(loc);
                newData.push(this.data[idxInIndex]);
                newIndex.push(this.indexes[idxInIndex]);
            }
            return new Series(newData, { indexes: newIndex });
        }
        if (isString(rowLoc) && rowLoc.includes(':')) {
            // input is like '0:2' || 'a:c'
            var rowLocArr = rowLoc.split(':');
            assert(rowLocArr.length === 2, 'The rowLoc is not found in the indexes.');
            var startLoc = rowLocArr[0];
            var endLoc = rowLocArr[1];
            if (isInteger(Number(startLoc)) && isInteger(Number(endLoc))) {
                var startIdx = Number(startLoc);
                var endIdx = Number(endLoc);
                var newData = this.data.slice(startIdx, endIdx);
                var newIndex = this.indexes.slice(startIdx, endIdx);
                return new Series(newData, { indexes: newIndex });
            }
            if (isString(startLoc) && isString(endLoc)) {
                var startIdx = this.indexes.indexOf(startLoc);
                var endIdx = this.indexes.indexOf(endLoc);
                var newData = this.data.slice(startIdx, endIdx);
                var newIndex = this.indexes.slice(startIdx, endIdx);
                return new Series(newData, { indexes: newIndex });
            }
        }
        throw new Error('The rowLoc is illegal');
    };
    /**
     * Get data by row location and column location using integer index.
     * @param rowLoc
     */
    Series.prototype.getByIndex = function (rowLoc) {
        assert(isInteger(rowLoc) || isArray(rowLoc) || (isString(rowLoc) && rowLoc.includes(':')), 'The rowLoc is illegal');
        // input is like 1
        if (isInteger(rowLoc)) {
            assert(range(this.indexes.length).includes(rowLoc), 'The rowLoc is not found in the indexes.');
            if (range(this.indexes.length).includes(rowLoc)) {
                return this.data[rowLoc];
            }
        }
        if (isArray(rowLoc)) {
            // input is like [0, 1, 2]
            var newData = [];
            var newIndex = [];
            for (var i = 0; i < rowLoc.length; i += 1) {
                var idx = rowLoc[i];
                assert(range(this.indexes.length).includes(idx), 'The rowLoc is not found in the indexes.');
                newData.push(this.data[idx]);
                newIndex.push(this.indexes[idx]);
            }
            return new Series(newData, { indexes: newIndex });
        }
        if (isString(rowLoc) && rowLoc.includes(':')) {
            // input is like '0:2'
            var rowLocArr = rowLoc.split(':');
            if (rowLocArr.length === 2) {
                var startIdx = Number(rowLocArr[0]);
                var endIdx = Number(rowLocArr[1]);
                assert(isInteger(startIdx) && isInteger(endIdx), 'The rowLoc is not found in the indexes.');
                var newData = this.data.slice(startIdx, endIdx);
                var newIndex = this.indexes.slice(startIdx, endIdx);
                return new Series(newData, { indexes: newIndex });
            }
        }
        throw new Error('The rowLoc is illegal');
    };
    return Series;
}(BaseFrame));
export default Series;
