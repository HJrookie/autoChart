import { __assign, __read, __spreadArray } from "tslib";
import { analyzeField } from '../../analysis';
import { getNodeFields, getLinkFields, getAllFieldsInfo, getAllStructFeats, clusterNodes } from '../../analysis/graph';
import { isUnique } from '../../analysis/field';
import { assert, isArray, isObject, isBasicType } from '../../utils';
import DataFrame from '../field/dataFrame';
import { flatObject } from './utils';
/* eslint-disable no-param-reassign */
function parseTreeNode(data, extra) {
    var nodes = [];
    var links = [];
    var childrenKey = (extra === null || extra === void 0 ? void 0 : extra.childrenKey) || 'children';
    var parseTree = function (treeNode) {
        var children = treeNode[childrenKey] || [];
        delete treeNode[childrenKey];
        nodes === null || nodes === void 0 ? void 0 : nodes.push(treeNode);
        for (var i = 0; i < children.length; i += 1) {
            var item = children[i];
            links === null || links === void 0 ? void 0 : links.push({
                source: treeNode.id,
                target: item.id,
            });
            parseTree(item);
        }
    };
    parseTree(data);
    return { nodes: nodes, links: links };
}
/**
 * @param data link array
 */
function parseArray(data, extra) {
    var _a = __read(data, 1), data0 = _a[0];
    assert(isObject(data0), 'Data is unable transform to graph');
    var sourceKey = (extra === null || extra === void 0 ? void 0 : extra.sourceKey) || ('source' in data0 && 'source') || ('from' in data0 && 'from');
    var targetKey = (extra === null || extra === void 0 ? void 0 : extra.targetKey) || ('target' in data0 && 'target') || ('to' in data0 && 'to');
    var childrenKey = (extra === null || extra === void 0 ? void 0 : extra.childrenKey) || ('children' in data0 && 'children') || ('to' in data0 && 'to');
    assert(sourceKey || targetKey || childrenKey, 'Data is unable transform to graph');
    var nodes = [];
    var links = [];
    var _b = data0, _c = sourceKey, source = _b[_c], _d = targetKey, target = _b[_d], _e = childrenKey, children = _b[_e];
    if (isBasicType(source) && isBasicType(target)) {
        var _loop_1 = function (i) {
            var link = data[i];
            var _g = link, _h = sourceKey, source_1 = _g[_h], _j = targetKey, target_1 = _g[_j];
            if (nodes.findIndex(function (n) { return n.id === source_1; }) === -1) {
                nodes.push({ id: source_1 });
            }
            if (nodes.findIndex(function (n) { return n.id === target_1; }) === -1) {
                nodes.push({ id: target_1 });
            }
            var formatLink = __assign(__assign({}, link), { source: source_1, target: target_1 });
            links.push(formatLink);
        };
        for (var i = 0; i < data.length; i += 1) {
            _loop_1(i);
        }
    }
    else if (isArray(children)) {
        // try to parse the array as multiple trees
        for (var i = 0; i < data.length; i += 1) {
            var tree = data[i];
            var _f = parseTreeNode(tree, extra), subNodes = _f.nodes, subLinks = _f.links;
            var _loop_2 = function (i_1) {
                var node = subNodes[i_1];
                var repeatNode = nodes.find(function (n) { return n.id === node.id; });
                if (repeatNode) {
                    repeatNode = __assign(__assign({}, node), repeatNode);
                }
                else {
                    nodes.push(node);
                }
            };
            for (var i_1 = 0; i_1 < subNodes.length; i_1 += 1) {
                _loop_2(i_1);
            }
            links.push.apply(links, __spreadArray([], __read(subLinks), false));
        }
    }
    return { nodes: nodes, links: links };
}
function isNodeArray(arr) {
    if (!isArray(arr) || arr.length <= 1)
        return false;
    var nodeIdInfo = analyzeField(arr.map(function (node) { return node.id; }));
    return isUnique(nodeIdInfo);
}
function isValidNodeLinks(nodes, links) {
    if (!isArray(links) || !isNodeArray(nodes) || links.length <= 1)
        return false;
    var _loop_3 = function (i) {
        var link = links[i];
        var source = link.source, target = link.target;
        var hasSourceNode = nodes.findIndex(function (item) { return item.id === source; });
        var hasTargetNode = nodes.findIndex(function (item) { return item.id === target; });
        if (!(hasSourceNode > -1 && hasTargetNode > -1)) {
            return { value: false };
        }
    };
    for (var i = 0; i < links.length; i += 1) {
        var state_1 = _loop_3(i);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return true;
}
// TODO: The automatic parsing function has not been completed yet, for now, the GraphData constructor only accepts input data in several specified formats (see type GraphInput)
var GraphData = /** @class */ (function () {
    function GraphData(data, extra) {
        this.data = {
            nodes: [],
            links: [],
        };
        this.extra = extra;
        var _a = this.autoParse(data, extra), nodes = _a.nodes, links = _a.links;
        assert(isValidNodeLinks(nodes, links), 'Data is unable transform to graph');
        this.data = {
            nodes: nodes.map(function (node) { return flatObject(node); }),
            links: links.map(function (link) { return flatObject(link); }),
        };
    }
    GraphData.prototype.autoParse = function (data, extra) {
        var nodes;
        var links;
        assert(isArray(data) || isObject(data), 'Data is unable transform to graph');
        // try parse data as link array or multiple trees
        if (isArray(data)) {
            var parsedData = parseArray(data, extra);
            nodes = parsedData.nodes;
            links = parsedData.links;
        }
        // if passed data tyoe is object
        if (isObject(data)) {
            if ((extra === null || extra === void 0 ? void 0 : extra.nodeKey) && (extra === null || extra === void 0 ? void 0 : extra.linkKey)) {
                nodes = data[extra.nodeKey];
                links = data[extra.linkKey];
            }
            else if ((extra === null || extra === void 0 ? void 0 : extra.childrenKey) || 'children' in data) {
                var parsedTree = parseTreeNode(data, extra);
                nodes = parsedTree.nodes;
                links = parsedTree.links;
            }
            else {
                var nodeKey = 'nodes' in data && 'nodes';
                var linkKey = ('links' in data && 'links') || ('edges' in data && 'edges');
                nodes = data[nodeKey];
                links = data[linkKey];
            }
        }
        return { nodes: nodes, links: links };
    };
    GraphData.prototype.getNodeFrame = function () {
        var _a, _b;
        var extra = {
            indexes: (_a = this.extra) === null || _a === void 0 ? void 0 : _a.nodeIndexes,
            columns: (_b = this.extra) === null || _b === void 0 ? void 0 : _b.nodeColumns,
        };
        return new DataFrame(this.data.nodes, extra);
    };
    GraphData.prototype.getLinkFrame = function () {
        var _a, _b;
        var extra = {
            indexes: (_a = this.extra) === null || _a === void 0 ? void 0 : _a.linkIndexes,
            columns: (_b = this.extra) === null || _b === void 0 ? void 0 : _b.linkColumns,
        };
        return new DataFrame(this.data.links, extra);
    };
    /**
     * Get statistics.
     */
    GraphData.prototype.info = function () {
        var _a = this.data, nodes = _a.nodes, links = _a.links;
        // calc fields statistics and structural statistics
        var graphStructFeats = getAllStructFeats(nodes, links);
        var _b = getNodeFields(nodes), nodeFields = _b.nodeFields, nodeFieldNames = _b.nodeFieldNames;
        var _c = getLinkFields(links), linkFields = _c.linkFields, linkFieldNames = _c.linkFieldNames;
        var nodeFieldsInfo = getAllFieldsInfo(nodeFields, nodeFieldNames);
        var linkFieldsInfo = getAllFieldsInfo(linkFields, linkFieldNames);
        var getClusterField = clusterNodes(nodes, nodeFieldsInfo, links);
        nodeFieldsInfo.push(getClusterField);
        var graphProps = __assign({ nodeFieldsInfo: nodeFieldsInfo, linkFieldsInfo: linkFieldsInfo }, graphStructFeats);
        return graphProps;
    };
    return GraphData;
}());
export default GraphData;
