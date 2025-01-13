/*
 * Check whether the string is a date.
 */
import { __read, __spreadArray } from "tslib";
import { DAY, DELIMITER, HOUR, MILLISECOND, MINUTE, MONTH, OFFSET, SECOND, WEEK, WEEKDAY, YEAR, YEARDAY, } from './constants';
import { isString } from './isType';
/**
 * Get ISO 8601 date regular expression string array
 * Reference: https://www.cl.cam.ac.uk/~mgk25/iso-time.html
 * @param strict Require delimiter or not
 */
export function getIsoDatePatterns(strict) {
    if (strict === void 0) { strict = true; }
    return [
        // 1991
        "".concat(YEAR),
        // 1999-W12-7
        "".concat(YEAR).concat(DELIMITER).concat(strict ? '' : '?', "W").concat(WEEK, "(").concat(DELIMITER).concat(strict ? '' : '?').concat(WEEKDAY, ")?"),
        // 12-22-1999
        "".concat(MONTH).concat(DELIMITER).concat(strict ? '' : '?').concat(DAY).concat(DELIMITER).concat(strict ? '' : '?').concat(YEAR),
        // 1999-12-22 19991222
        "".concat(YEAR).concat(DELIMITER).concat(strict ? '' : '?').concat(MONTH).concat(DELIMITER).concat(strict ? '' : '?').concat(DAY),
        // 1999-12
        "".concat(YEAR).concat(DELIMITER).concat(strict ? '' : '?').concat(MONTH),
        // 1999-200
        "".concat(YEAR).concat(DELIMITER).concat(strict ? '' : '?').concat(YEARDAY),
    ];
}
/**
 * Get ISO 8601 time regular expression string array
 * Reference: https://www.cl.cam.ac.uk/~mgk25/iso-time.html
 * @param strict Require DELIMITER or not
 */
export function getIsoTimePatterns(strict) {
    if (strict === void 0) { strict = true; }
    return [
        // 23:20:20Z 23:20:20+08:00 23:20:20-08:00
        "".concat(HOUR, ":").concat(strict ? '' : '?').concat(MINUTE, ":").concat(strict ? '' : '?').concat(SECOND, "([.,]").concat(MILLISECOND, ")?").concat(OFFSET, "?"),
        // 23:20+08
        "".concat(HOUR, ":").concat(strict ? '' : '?').concat(MINUTE, "?").concat(OFFSET),
    ];
}
var getIsoDateAndTimeRegs = function (strictDatePattern) {
    var isoDatePatterns = getIsoDatePatterns(strictDatePattern);
    var isoTimePatterns = getIsoTimePatterns(strictDatePattern);
    var isoDateAndTimePatterns = __spreadArray(__spreadArray([], __read(isoDatePatterns), false), __read(isoTimePatterns), false);
    isoDatePatterns.forEach(function (d) {
        isoTimePatterns.forEach(function (t) {
            isoDateAndTimePatterns.push("".concat(d, "[T\\s]").concat(t));
        });
    });
    return isoDateAndTimePatterns.map(function (pattern) {
        return new RegExp("^".concat(pattern, "$"));
    });
};
export function isDateString(value, strictDatePattern) {
    if (isString(value)) {
        var isoDateAndTimeRegs = getIsoDateAndTimeRegs(strictDatePattern);
        for (var i = 0; i < isoDateAndTimeRegs.length; i += 1) {
            var reg = isoDateAndTimeRegs[i];
            if (reg.test(value.trim())) {
                return true;
            }
        }
    }
    return false;
}
/** parse ISO 8601 date string to standard Date type, if month and date is missing, will use new Date(01-01)
 * Reference: https://www.cl.cam.ac.uk/~mgk25/iso-time.html
 * 将日期字符串转为标准 Date 类型，如果没有月日，只有时间信息，会默认为 01-01
 */
export function parseIsoDateString(value, strictDatePattern) {
    if (strictDatePattern === void 0) { strictDatePattern = false; }
    var isoDateAndTimeRegs = getIsoDateAndTimeRegs(strictDatePattern);
    for (var i = 0; i < isoDateAndTimeRegs.length; i += 1) {
        var reg = isoDateAndTimeRegs[i];
        if (reg.test(value.trim())) {
            var matches = value.trim().match(reg);
            if (matches.groups) {
                var _a = matches.groups || {}, year = _a.year, month = _a.month, day = _a.day, week = _a.week, weekday = _a.weekday, hour = _a.hour, minute = _a.minute, second = _a.second, millisecond = _a.millisecond, yearDay = _a.yearDay, offset = _a.offset;
                var yearNum = parseInt(year, 10);
                if (yearDay) {
                    return new Date(yearNum, 0, parseInt(yearDay, 10));
                }
                if (week) {
                    var weekNum = parseInt(week, 10);
                    var weekDayNum = weekday ? parseInt(weekday, 10) : 1;
                    var firstDayOfYear = new Date(yearNum, 0, 1);
                    // 给定年份的第一天是周几
                    var firstDayOfYearDayOfWeek = firstDayOfYear.getDay() === 0 ? 7 : firstDayOfYear.getDay();
                    // 计算第一周的第一天相对 firstDayOfYear 的偏移量
                    var firstWeekStartDayOffset = firstDayOfYearDayOfWeek === 1 ? 1 : 1 - firstDayOfYearDayOfWeek;
                    // 目标日期偏移量
                    var targetDateOffset = (weekNum - 1) * 7 + (weekDayNum + firstWeekStartDayOffset);
                    return new Date(yearNum, 0, targetDateOffset);
                }
                var formattedDateString = [year, month !== null && month !== void 0 ? month : '01', day !== null && day !== void 0 ? day : '01'].join('-');
                var formattedTimeString = "".concat([hour !== null && hour !== void 0 ? hour : '00', minute !== null && minute !== void 0 ? minute : '00', second !== null && second !== void 0 ? second : '00'].join(':'), ".").concat(millisecond !== null && millisecond !== void 0 ? millisecond : '000').concat(offset !== null && offset !== void 0 ? offset : '');
                return new Date("".concat(formattedDateString, " ").concat(formattedTimeString));
            }
        }
    }
    return null;
}
