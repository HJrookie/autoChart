export var insightPriorityComparator = function (a, b) {
    return a.score - b.score;
};
export var homogeneousInsightPriorityComparator = function (a, b) { return a.score - b.score; };
export function addInsightsToHeap(insights, heap) {
    insights === null || insights === void 0 ? void 0 : insights.forEach(function (item) {
        if (heap.length >= heap.limit) {
            heap.pushpop(item);
        }
        else {
            heap.add(item);
        }
    });
}
