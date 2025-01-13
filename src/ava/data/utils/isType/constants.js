export var SPECIAL_BOOLEANS = [
    [true, false],
    [0, 1],
    ['true', 'false'],
    ['Yes', 'No'],
    ['True', 'False'],
    ['0', '1'],
    ['是', '否'],
];
// For isDateString.ts
export var DELIMITER = '([-_./\\s])';
export var YEAR = '(?<year>(18|19|20)\\d{2})';
export var MONTH = '(?<month>0?[1-9]|1[012])';
export var DAY = '(?<day>0?[1-9]|[12]\\d|3[01])';
export var WEEK = '(?<week>[0-4]\\d|5[0-2])';
export var WEEKDAY = '(?<weekday>[1-7])';
export var BASE_HOUR = '(0?\\d|1\\d|2[0-4])';
export var BASE_MINUTE = '(0?\\d|[012345]\\d)';
export var HOUR = "(?<hour>".concat(BASE_MINUTE, ")");
export var MINUTE = "(?<minute>".concat(BASE_MINUTE, ")");
export var SECOND = "(?<second>".concat(BASE_MINUTE, ")");
export var MILLISECOND = '(?<millisecond>\\d{1,4})';
export var YEARDAY = '(?<yearDay>(([0-2]\\d|3[0-5])\\d)|36[0-6])';
export var OFFSET = "(?<offset>Z|[+-]".concat(BASE_HOUR, "(:").concat(BASE_MINUTE, ")?)");
