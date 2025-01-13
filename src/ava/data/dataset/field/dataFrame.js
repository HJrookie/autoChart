import { __assign, __extends, __read, __spreadArray } from "tslib";
import { analyzeField } from '../../analysis';
import { isArray, isObject, isString, isInteger, isNumber, isBasicType, range, assert } from '../../utils';
import BaseFrame from './baseFrame';
import Series from './series';
import { generateArrayIndex, isAxis, fillMissingValue, generateSplit, stringify, getStringifyLength, convertDataType, } from './utils';
/* 2D data structure */
var DataFrame = /** @class */ (function (_super) {
    __extends(DataFrame, _super);
    function DataFrame(data, extra) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        _this = _super.call(this, data, extra) || this;
        _this.colData = [];
        _this.extra = extra || {};
        assert(isBasicType(data) || isArray(data) || isObject(data), 'Data type is illegal');
        if (isBasicType(data)) {
            if (extra === null || extra === void 0 ? void 0 : extra.columnTypes) {
                for (var i = 0; i < ((_a = extra === null || extra === void 0 ? void 0 : extra.indexes) === null || _a === void 0 ? void 0 : _a.length); i += 1) {
                    _this.data[i] = convertDataType(_this.data[i], (_b = extra === null || extra === void 0 ? void 0 : extra.columnTypes) === null || _b === void 0 ? void 0 : _b[i]);
                }
            }
            if ((extra === null || extra === void 0 ? void 0 : extra.indexes) && (extra === null || extra === void 0 ? void 0 : extra.columns)) {
                _this.setAxis(1, extra === null || extra === void 0 ? void 0 : extra.columns);
                _this.data = Array(extra === null || extra === void 0 ? void 0 : extra.columns.length).fill(_this.data);
            }
            else if (!(extra === null || extra === void 0 ? void 0 : extra.columns)) {
                _this.setAxis(1, [0]);
                _this.data = [_this.data];
            }
            else if (!(extra === null || extra === void 0 ? void 0 : extra.indexes)) {
                assert(isArray(extra === null || extra === void 0 ? void 0 : extra.columns), 'Index or columns must be Axis array.');
                assert((extra === null || extra === void 0 ? void 0 : extra.columns.length) === 1, 'When the length of extra.columns is larger than 1, extra.indexes is required.');
            }
            _this.colData = _this.data;
        }
        if (isArray(data)) {
            var _j = __read(data, 1), data0 = _j[0];
            /* 1D: basic type | array */
            if (_this.data.length > 0) {
                _this.generateColumns([0], extra === null || extra === void 0 ? void 0 : extra.columns);
                _this.colData = [_this.data];
                _this.data = _this.data.map(function (datum) { return [datum]; });
            }
            /*
             * 2D: array
             * Base frame has made the first round of judgment. Now, if data0 is array, all the datum is array.
             */
            if (isArray(data0)) {
                var columns = range(data0.length);
                _this.generateDataAndColDataFromArray(false, data, columns, extra === null || extra === void 0 ? void 0 : extra.fillValue, extra === null || extra === void 0 ? void 0 : extra.columnTypes);
                _this.generateColumns(columns, extra === null || extra === void 0 ? void 0 : extra.columns);
            }
            /* 2D: object array */
            if (isObject(data0)) {
                var keys = [];
                for (var i = 0; i < data.length; i += 1) {
                    var datum = data[i];
                    keys.push.apply(keys, __spreadArray([], __read(Object.keys(datum)), false));
                }
                var columns = __spreadArray([], __read(new Set(keys)), false);
                for (var i = 0; i < data.length; i += 1) {
                    var datum = data[i];
                    assert(isObject(datum), 'The data is not standard object array.');
                    // slice
                    if (extra === null || extra === void 0 ? void 0 : extra.columns) {
                        _this.data[i] = [];
                        for (var j = 0; j < (extra === null || extra === void 0 ? void 0 : extra.columns.length); j += 1) {
                            var column = extra === null || extra === void 0 ? void 0 : extra.columns[j];
                            assert(columns.includes(column), "There is no column ".concat(column, " in data."));
                            var newDatum = convertDataType(fillMissingValue(datum[column], extra.fillValue), (_c = extra === null || extra === void 0 ? void 0 : extra.columnTypes) === null || _c === void 0 ? void 0 : _c[j]);
                            _this.data[i].push(newDatum);
                            if (_this.colData[j]) {
                                _this.colData[j].push(newDatum);
                            }
                            else {
                                _this.colData[j] = [newDatum];
                            }
                        }
                        _this.setAxis(1, extra === null || extra === void 0 ? void 0 : extra.columns);
                    }
                }
                if (!(extra === null || extra === void 0 ? void 0 : extra.columns)) {
                    _this.generateDataAndColDataFromArray(true, data, columns, extra === null || extra === void 0 ? void 0 : extra.fillValue, extra === null || extra === void 0 ? void 0 : extra.columnTypes);
                    _this.setAxis(1, columns);
                }
            }
        }
        if (isObject(data)) {
            var dataValues = Object.values(data);
            var _k = __read(dataValues, 1), data0 = _k[0];
            /* 1D: object */
            if (isBasicType(data0)) {
                var columns = Object.keys(data);
                if (extra === null || extra === void 0 ? void 0 : extra.indexes) {
                    assert(isArray(extra.indexes), 'extra.indexes must be an array.');
                    assert(extra.indexes.length === 1, 'The length of extra.indexes must be 1.');
                    _this.setAxis(0, extra.indexes);
                }
                else {
                    _this.setAxis(0, [0]);
                }
                if (extra === null || extra === void 0 ? void 0 : extra.columns) {
                    for (var i = 0; i < (extra === null || extra === void 0 ? void 0 : extra.columns.length); i += 1) {
                        var column = extra === null || extra === void 0 ? void 0 : extra.columns[i];
                        assert(columns.includes(column), "There is no column ".concat(column, " in data."));
                        _this.data.push(convertDataType(fillMissingValue(data[column], extra === null || extra === void 0 ? void 0 : extra.fillValue), (_d = extra === null || extra === void 0 ? void 0 : extra.columnTypes) === null || _d === void 0 ? void 0 : _d[i]));
                    }
                    _this.colData = _this.data.map(function (datum) { return [datum]; });
                    _this.data = [_this.data];
                    _this.setAxis(1, extra === null || extra === void 0 ? void 0 : extra.columns);
                }
                else {
                    for (var i = 0; i < columns.length; i += 1) {
                        var datum = data[columns[i]];
                        assert(isBasicType(datum), 'Data type is illegal');
                        _this.data.push(convertDataType(fillMissingValue(datum, extra === null || extra === void 0 ? void 0 : extra.fillValue), (_e = extra === null || extra === void 0 ? void 0 : extra.columnTypes) === null || _e === void 0 ? void 0 : _e[i]));
                    }
                    _this.data = [_this.data];
                    _this.colData = dataValues.map(function (datum) {
                        var _a;
                        return [
                            convertDataType(fillMissingValue(datum, extra === null || extra === void 0 ? void 0 : extra.fillValue), (_a = extra === null || extra === void 0 ? void 0 : extra.columnTypes) === null || _a === void 0 ? void 0 : _a[0]),
                        ];
                    });
                    _this.generateColumns(columns);
                }
            }
            /* 2D: array object */
            if (isArray(data0)) {
                _this.setAxis(0, generateArrayIndex(data0, extra === null || extra === void 0 ? void 0 : extra.indexes));
                var columns = Object.keys(data);
                _this.generateColumns(columns, extra === null || extra === void 0 ? void 0 : extra.columns);
                var _loop_1 = function (i) {
                    var datum = data[this_1.columns[i]];
                    assert(isArray(datum), 'Data type is illegal');
                    // Fill the missing values
                    if (datum.length < this_1.indexes.length) {
                        var newDatum = datum.concat(Array(this_1.indexes.length - datum.length).fill(convertDataType(fillMissingValue(undefined, extra === null || extra === void 0 ? void 0 : extra.fillValue), (_f = extra === null || extra === void 0 ? void 0 : extra.columnTypes) === null || _f === void 0 ? void 0 : _f[i])));
                        this_1.colData.push(newDatum);
                    }
                    else {
                        this_1.colData.push(datum.map(function (d) { var _a; return convertDataType(fillMissingValue(d, extra === null || extra === void 0 ? void 0 : extra.fillValue), (_a = extra === null || extra === void 0 ? void 0 : extra.columnTypes) === null || _a === void 0 ? void 0 : _a[i]); }));
                    }
                    for (var j = 0; j < this_1.indexes.length; j += 1) {
                        if (this_1.data[j]) {
                            this_1.data[j].push(convertDataType(fillMissingValue(datum[j], extra === null || extra === void 0 ? void 0 : extra.fillValue), (_g = extra === null || extra === void 0 ? void 0 : extra.columnTypes) === null || _g === void 0 ? void 0 : _g[i]));
                        }
                        else {
                            this_1.data[j] = [convertDataType(fillMissingValue(datum[j], extra === null || extra === void 0 ? void 0 : extra.fillValue), (_h = extra === null || extra === void 0 ? void 0 : extra.columnTypes) === null || _h === void 0 ? void 0 : _h[i])];
                        }
                    }
                };
                var this_1 = this;
                for (var i = 0; i < _this.columns.length; i += 1) {
                    _loop_1(i);
                }
            }
        }
        return _this;
    }
    /**
     * Generate columns.
     * @param columns
     * @param extra
     */
    DataFrame.prototype.generateColumns = function (columns, extraColumns) {
        if (extraColumns) {
            assert((extraColumns === null || extraColumns === void 0 ? void 0 : extraColumns.length) === columns.length, "Columns length is ".concat(extraColumns === null || extraColumns === void 0 ? void 0 : extraColumns.length, ", but data column is ").concat(columns.length));
            this.setAxis(1, extraColumns);
        }
        else {
            this.setAxis(1, columns);
        }
    };
    /**
     * Generate this.data and this.colData.
     * @param isObj
     * @param data
     * @param columns
     */
    DataFrame.prototype.generateDataAndColDataFromArray = function (isObj, data, columns, fillValue, columnTypes) {
        for (var i = 0; i < data.length; i += 1) {
            var datum = data[i];
            assert(isObj ? isObject(datum) : isArray(datum), 'Data type is illegal');
            /**
             * If data is object and no extra.columns,
             * Else, data is array.
             */
            if (isObj && JSON.stringify(Object.keys(datum)) === JSON.stringify(columns)) {
                this.data.push(Object.values(datum).map(function (d, j) { return convertDataType(fillMissingValue(d, fillValue), columnTypes === null || columnTypes === void 0 ? void 0 : columnTypes[j]); }));
            }
            else if (!isObj) {
                this.data.push(datum.map(function (d, j) { return convertDataType(fillMissingValue(d, fillValue), columnTypes === null || columnTypes === void 0 ? void 0 : columnTypes[j]); }));
            }
            for (var j = 0; j < columns.length; j += 1) {
                var column = columns[j];
                var newDatum = convertDataType(fillMissingValue(datum[column], fillValue), columnTypes === null || columnTypes === void 0 ? void 0 : columnTypes[j]);
                /**
                 * Data is object and extra.columns is set.
                 */
                if (isObj && JSON.stringify(Object.keys(datum)) !== JSON.stringify(columns)) {
                    if (this.data[i]) {
                        this.data[i].push(newDatum);
                    }
                    else {
                        this.data[i] = [newDatum];
                    }
                }
                if (this.colData[j]) {
                    this.colData[j].push(newDatum);
                }
                else {
                    this.colData[j] = [newDatum];
                }
            }
        }
    };
    Object.defineProperty(DataFrame.prototype, "shape", {
        get: function () {
            return [this.axes[0].length, this.axes[1].length];
        },
        enumerable: false,
        configurable: true
    });
    DataFrame.prototype.get = function (rowLoc, colLoc) {
        assert(isAxis(rowLoc) || isArray(rowLoc), 'The rowLoc is illegal');
        /* colLoc does not exist */
        if (colLoc === undefined) {
            // input is like 1
            if (isNumber(rowLoc)) {
                assert(this.indexes.includes(rowLoc), 'The rowLoc is not found in the indexes.');
                if (this.indexes.includes(rowLoc)) {
                    var newData_1 = this.data[rowLoc];
                    var newIndex_1 = this.columns;
                    return new Series(newData_1, { indexes: newIndex_1 });
                }
            }
            else if (isArray(rowLoc)) {
                // input is like [0, 1, 2]
                var newData_2 = [];
                var newIndex_2 = [];
                for (var i = 0; i < rowLoc.length; i += 1) {
                    var loc = rowLoc[i];
                    assert(this.indexes.includes(loc), 'The rowLoc is not found in the indexes.');
                    var idxInIndex = this.indexes.indexOf(loc);
                    newData_2.push(this.data[idxInIndex]);
                    newIndex_2.push(this.indexes[idxInIndex]);
                }
                return new DataFrame(newData_2, { indexes: newIndex_2, columns: this.columns });
            }
            else if (isString(rowLoc) && rowLoc.includes(':')) {
                // input is like '0:2'
                var rowLocArr = rowLoc.split(':');
                if (rowLocArr.length === 2) {
                    var startRowIdx_1 = Number(rowLocArr[0]);
                    var endRowIdx_1 = Number(rowLocArr[1]);
                    assert(isNumber(startRowIdx_1) && isNumber(endRowIdx_1), 'The rowLoc is not found in the indexes.');
                    var newData_3 = this.data.slice(startRowIdx_1, endRowIdx_1);
                    var newIndex_3 = this.indexes.slice(startRowIdx_1, endRowIdx_1);
                    return new DataFrame(newData_3, { indexes: newIndex_3, columns: this.columns });
                }
            }
        }
        /* colLoc exists */
        var startRowIdx = -1;
        var endRowIdx = -1;
        var rowIdxes = [];
        var startColIdx = -1;
        var endColIdx = -1;
        var colIdxes = [];
        // rowLoc is Axis
        if (isAxis(rowLoc) && this.indexes.includes(rowLoc)) {
            startRowIdx = this.indexes.indexOf(rowLoc);
            endRowIdx = startRowIdx + 1;
        }
        // rowLoc is Axis[]
        if (isArray(rowLoc)) {
            for (var i = 0; i < rowLoc.length; i += 1) {
                var rowIdx = rowLoc[i];
                assert(this.indexes.includes(rowIdx), 'The rowLoc is not found in the indexes.');
                rowIdxes.push(this.indexes.indexOf(rowIdx));
            }
        }
        // rowLoc is slice
        if (isString(rowLoc) && rowLoc.includes(':')) {
            var rowLocArr = rowLoc.split(':');
            if (rowLocArr.length === 2) {
                var start = Number(rowLocArr[0]);
                var end = Number(rowLocArr[1]);
                assert(isNumber(start) && isNumber(end), 'The rowLoc is not found in the indexes.');
                startRowIdx = start;
                endRowIdx = end;
            }
        }
        // colLoc is Axis
        if (isAxis(colLoc) && this.columns.includes(colLoc)) {
            startColIdx = this.columns.indexOf(colLoc);
            endColIdx = startColIdx + 1;
        }
        // colLoc is Axis[]
        if (isArray(colLoc)) {
            for (var i = 0; i < colLoc.length; i += 1) {
                var colIdx = colLoc[i];
                assert(this.columns.includes(colIdx), 'The colLoc is not found in the columns.');
                colIdxes.push(this.columns.indexOf(colIdx));
            }
        }
        // colLoc is slice
        if (isString(colLoc) && colLoc.includes(':')) {
            var colLocArr = colLoc.split(':');
            if (colLocArr.length === 2) {
                var start = this.columns.indexOf(colLocArr[0]);
                var end = this.columns.indexOf(colLocArr[1]);
                assert(isNumber(start) && isNumber(end), 'The colLoc is not found in the columns.');
                startColIdx = start;
                endColIdx = end;
            }
        }
        // build new data and indexes
        var newData = [];
        var newIndex = [];
        assert((startRowIdx >= 0 && endRowIdx >= 0) || rowIdxes.length > 0, 'The rowLoc is not found in the indexes.');
        if (startRowIdx >= 0 && endRowIdx >= 0) {
            newData = this.data.slice(startRowIdx, endRowIdx);
            newIndex = this.indexes.slice(startRowIdx, endRowIdx);
        }
        if (rowIdxes.length > 0) {
            for (var i = 0; i < rowIdxes.length; i += 1) {
                var rowIdx = rowIdxes[i];
                newData.push(this.data[rowIdx]);
                newIndex.push(this.indexes[rowIdx]);
            }
        }
        // build new columns
        if (startColIdx >= 0 && endColIdx >= 0) {
            for (var i = 0; i < newData.length; i += 1) {
                newData[i] = newData[i].slice(startColIdx, endColIdx);
            }
            var newColumns = this.columns.slice(startColIdx, endColIdx);
            return new DataFrame(newData, { indexes: newIndex, columns: newColumns });
        }
        if (colIdxes.length > 0) {
            var newColumns = [];
            var tempData = newData.slice();
            for (var i = 0; i < newData.length; i += 1) {
                newData[i] = [];
                newColumns = [];
                for (var j = 0; j < colIdxes.length; j += 1) {
                    var colIdx = colIdxes[j];
                    newData[i].push(tempData[i][colIdx]);
                    newColumns.push(this.columns[colIdx]);
                }
            }
            return new DataFrame(newData, { indexes: newIndex, columns: newColumns });
        }
        throw new Error('The colLoc is illegal.');
    };
    DataFrame.prototype.getByIndex = function (rowLoc, colLoc) {
        assert(isInteger(rowLoc) || isArray(rowLoc) || isString(rowLoc), 'The rowLoc is illegal');
        /* colLoc does not exist */
        if (colLoc === undefined) {
            // input is like 1
            if (isInteger(rowLoc)) {
                assert(range(this.indexes.length).includes(rowLoc), 'The rowLoc is not found in the indexes.');
                var newData_4 = this.data[rowLoc];
                var newIndex_4 = this.columns;
                return new Series(newData_4, { indexes: newIndex_4 });
            }
            if (isArray(rowLoc)) {
                // input is like [0, 1, 2]
                var newData_5 = [];
                var newIndex_5 = [];
                for (var i = 0; i < rowLoc.length; i += 1) {
                    var idx = rowLoc[i];
                    assert(range(this.indexes.length).includes(idx), 'The rowLoc is not found in the indexes.');
                    newData_5.push(this.data[idx]);
                    newIndex_5.push(this.indexes[idx]);
                }
                return new DataFrame(newData_5, { indexes: newIndex_5, columns: this.columns });
            }
            if (isString(rowLoc) && rowLoc.includes(':')) {
                // input is like '0:2'
                var rowLocArr = rowLoc.split(':');
                if (rowLocArr.length === 2) {
                    var startRowIdx_2 = Number(rowLocArr[0]);
                    var endRowIdx_2 = Number(rowLocArr[1]);
                    assert(isInteger(startRowIdx_2) && isInteger(endRowIdx_2), 'The rowLoc is not found in the indexes.');
                    var newData_6 = this.data.slice(startRowIdx_2, endRowIdx_2);
                    var newIndex_6 = this.indexes.slice(startRowIdx_2, endRowIdx_2);
                    return new DataFrame(newData_6, { indexes: newIndex_6, columns: this.columns });
                }
            }
        }
        /* colLoc exists */
        var startRowIdx = -1;
        var endRowIdx = -1;
        var rowIdxes = [];
        var startColIdx = -1;
        var endColIdx = -1;
        var colIdxes = [];
        // rowLoc is int
        if (isInteger(rowLoc)) {
            assert(range(this.indexes.length).includes(rowLoc), 'The rowLoc is not found in the indexes.');
            startRowIdx = rowLoc;
            endRowIdx = rowLoc + 1;
        }
        // rowLoc is int[]
        if (isArray(rowLoc)) {
            for (var i = 0; i < rowLoc.length; i += 1) {
                var rowIdx = rowLoc[i];
                assert(range(this.indexes.length).includes(rowIdx), 'The rowLoc is not found in the indexes.');
                rowIdxes.push(rowIdx);
            }
        }
        // rowLoc is slice
        if (isString(rowLoc) && rowLoc.includes(':')) {
            var rowLocArr = rowLoc.split(':');
            if (rowLocArr.length === 2) {
                var start = Number(rowLocArr[0]);
                var end = Number(rowLocArr[1]);
                assert(isInteger(start) && isInteger(end), 'The rowLoc is not found in the indexes.');
                startRowIdx = start;
                endRowIdx = end;
            }
        }
        assert((startRowIdx >= 0 && endRowIdx >= 0) || rowIdxes.length > 0, 'The colLoc is illegal');
        // colLoc is int
        if (isInteger(colLoc) && range(this.columns.length).includes(colLoc)) {
            startColIdx = colLoc;
            endColIdx = colLoc + 1;
        }
        // colLoc is int[]
        if (isArray(colLoc)) {
            for (var i = 0; i < colLoc.length; i += 1) {
                var colIdx = colLoc[i];
                assert(range(this.columns.length).includes(colIdx), 'The colLoc is not found in the columns index.');
                colIdxes.push(colIdx);
            }
        }
        // colLoc is slice
        if (isString(colLoc) && colLoc.includes(':')) {
            var colLocArr = colLoc.split(':');
            if (colLocArr.length === 2) {
                var start = Number(colLocArr[0]);
                var end = Number(colLocArr[1]);
                assert(isInteger(start) && isInteger(end), 'The colLoc is not found in the columns index.');
                startColIdx = start;
                endColIdx = end;
            }
        }
        assert((startRowIdx >= 0 && endRowIdx >= 0) || rowIdxes.length > 0, 'The rowLoc is not found in the indexes.');
        // build new data and indexes
        var newData = [];
        var newIndex = [];
        if (startRowIdx >= 0 && endRowIdx >= 0) {
            newData = this.data.slice(startRowIdx, endRowIdx);
            newIndex = this.indexes.slice(startRowIdx, endRowIdx);
        }
        else if (rowIdxes.length > 0) {
            for (var i = 0; i < rowIdxes.length; i += 1) {
                var rowIdx = rowIdxes[i];
                newData.push(this.data[rowIdx]);
                newIndex.push(this.indexes[rowIdx]);
            }
        }
        assert((startColIdx >= 0 && endColIdx >= 0) || colIdxes.length > 0, 'The colLoc is not found in the columns index.');
        // build new columns
        if (startColIdx >= 0 && endColIdx >= 0) {
            for (var i = 0; i < newData.length; i += 1) {
                newData[i] = newData[i].slice(startColIdx, endColIdx);
            }
            var newColumns = this.columns.slice(startColIdx, endColIdx);
            return new DataFrame(newData, { indexes: newIndex, columns: newColumns });
        }
        if (colIdxes.length > 0) {
            var newColumns = [];
            var tempData = newData.slice();
            for (var i = 0; i < newData.length; i += 1) {
                newData[i] = [];
                newColumns = [];
                for (var j = 0; j < colIdxes.length; j += 1) {
                    var colIdx = colIdxes[j];
                    newData[i].push(tempData[i][colIdx]);
                    newColumns.push(this.columns[colIdx]);
                }
            }
            return new DataFrame(newData, { indexes: newIndex, columns: newColumns });
        }
        throw new Error('The colLoc is illegal.');
    };
    /**
     * Get data by column.
     * @param col
     */
    DataFrame.prototype.getByColumn = function (col) {
        assert(this.columns.includes(col), 'The col is illegal');
        var colIdx = this.columns.indexOf(col);
        return new Series(this.colData[colIdx], {
            indexes: this.indexes,
        });
    };
    /**
     * Get statistics.
     */
    DataFrame.prototype.info = function () {
        var _a;
        var fields = [];
        for (var i = 0; i < ((_a = this.columns) === null || _a === void 0 ? void 0 : _a.length); i += 1) {
            var column = this.columns[i];
            fields.push(__assign(__assign({}, analyzeField(this.colData[i], this.extra.strictDatePattern)), { name: String(column) }));
        }
        return fields;
    };
    /**
     * Get tabular data string.
     */
    DataFrame.prototype.toString = function () {
        var _this = this;
        // Calculate the longest field length for each column, add two spaces to get the split
        var maxLengths = Array(this.columns.length + 1).fill(0);
        for (var i = 0; i < this.indexes.length; i += 1) {
            var len = getStringifyLength(this.indexes[i]);
            if (len > maxLengths[0])
                maxLengths[0] = len;
        }
        for (var i = 0; i < this.columns.length; i += 1) {
            // Contain escape characters' length
            var len = getStringifyLength(this.columns[i]);
            if (len > maxLengths[i + 1])
                maxLengths[i + 1] = len;
        }
        for (var i = 0; i < this.colData.length; i += 1) {
            for (var j = 0; j < this.colData[i].length; j += 1) {
                var len = getStringifyLength(this.colData[i][j]);
                if (len > maxLengths[i + 1])
                    maxLengths[i + 1] = len;
            }
        }
        return "".concat(generateSplit(maxLengths[0])).concat(this.columns
            .map(function (col, i) {
            // JSON.stringify will add "" to string, it's two extra characters.
            return "".concat(col).concat(i !== _this.columns.length ? generateSplit(maxLengths[i + 1] - getStringifyLength(col) + 2) : '');
        })
            .join(''), "\n").concat(this.indexes
            .map(function (idx, idxIndex) {
            var _a;
            return "".concat(idx).concat(generateSplit(maxLengths[0] - getStringifyLength(idx))).concat((_a = _this.data[idxIndex]) === null || _a === void 0 ? void 0 : _a.map(function (datum, i) {
                return "".concat(stringify(datum)).concat(i !== _this.columns.length ? generateSplit(maxLengths[i + 1] - getStringifyLength(datum)) : '');
            }).join('')).concat(idxIndex !== _this.indexes.length ? '\n' : '');
        })
            .join(''));
    };
    return DataFrame;
}(BaseFrame));
export default DataFrame;
