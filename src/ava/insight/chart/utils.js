import { flattenDeep, map } from 'lodash';
export var augmentedMarks2Marks = function (augmentedMarks) {
    return flattenDeep(map(augmentedMarks, function (augmentedMark) { return Object.values(augmentedMark); }));
};
