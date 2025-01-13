var cloneDeep = function (obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    var result;
    if (Array.isArray(obj)) {
        result = [];
        for (var i = 0, l = obj.length; i < l; i += 1) {
            if (typeof obj[i] === 'object' && obj[i] != null) {
                result[i] = cloneDeep(obj[i]);
            }
            else {
                result[i] = obj[i];
            }
        }
    }
    else {
        result = {};
        var objKeys = Object.keys(obj);
        for (var i = 0; i < objKeys.length; i += 1) {
            var key = objKeys[i];
            if (typeof obj[key] === 'object' && obj[key] != null) {
                result[key] = cloneDeep(obj[key]);
            }
            else {
                result[key] = obj[key];
            }
        }
    }
    return result;
};
export default cloneDeep;
