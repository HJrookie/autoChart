import { __assign, __read, __spreadArray } from "tslib";
// TODO @chenluli: move @antv/algorithm from devDep to dep after this file is complete
// eslint-disable-next-line import/no-extraneous-dependencies
import * as AlgorithmSync from '@antv/algorithm';
import { analyzeField } from '../field';
var GraphAlgorithms = __assign({}, AlgorithmSync);
function generateColDataFromArray(arr, columnNames) {
    var fields = [];
    for (var i = 0; i < arr.length; i += 1) {
        var datum = arr[i];
        for (var j = 0; j < columnNames.length; j += 1) {
            var column = columnNames[j];
            if (fields[j]) {
                fields[j].push(datum[column]);
            }
            else {
                fields[j] = [datum[column]];
            }
        }
    }
    return fields;
}
export function getNodeFields(nodes) {
    var _a = __read(nodes, 1), node0 = _a[0];
    var nodeFieldNames = node0 ? Object.keys(node0) : [];
    var nodeFields = generateColDataFromArray(nodes, nodeFieldNames);
    return { nodeFields: nodeFields, nodeFieldNames: nodeFieldNames };
}
export function getLinkFields(links) {
    var _a = __read(links, 1), link0 = _a[0];
    var linkFieldNames = link0 ? Object.keys(link0) : [];
    var linkFields = generateColDataFromArray(links, linkFieldNames);
    return { linkFields: linkFields, linkFieldNames: linkFieldNames };
}
// Analyze fields
function getFieldInfo(dataField, fieldName) {
    var fieldInfo = analyzeField(dataField);
    return __assign(__assign({}, fieldInfo), { name: fieldName });
}
export function getAllFieldsInfo(dataFields, fieldNames) {
    var fields = [];
    for (var i = 0; i < dataFields.length; i += 1) {
        var dataField = dataFields[i];
        fields.push(getFieldInfo(dataField, fieldNames[i]));
    }
    return fields;
}
/* eslint-disable no-param-reassign */
/**
 * find node clusters and assign the cluster field to each node
 * @param nodes
 * @param links
 */
export function clusterNodes(nodes, nodeFieldsInfo, links) {
    var MAX_CLUSTER_NUM = 10;
    var fieldForCluster;
    for (var i = 0; i < nodeFieldsInfo.length; i += 1) {
        var field = nodeFieldsInfo[i];
        if (field.levelOfMeasurements.indexOf('Nominal') > -1 ||
            (field.levelOfMeasurements.indexOf('Ordinal') > -1 &&
                field.missing === 0 &&
                field.distinct > 1 &&
                field.distinct <= MAX_CLUSTER_NUM)) {
            fieldForCluster = field;
            break;
        }
    }
    if (fieldForCluster) {
        for (var nodeIdx = 0; nodeIdx < nodes.length; nodeIdx += 1) {
            nodes[nodeIdx].cluster = nodes[nodeIdx][fieldForCluster.name];
        }
    }
    else {
        var clusters = GraphAlgorithms.louvain({ nodes: nodes, edges: links }).clusters;
        var values = [];
        for (var i = 0; i < clusters.length; i += 1) {
            var cluster = clusters[i];
            var nodes_1 = cluster.nodes, id = cluster.id;
            for (var nodeIdx = 0; nodeIdx < nodes_1.length; nodeIdx += 1) {
                nodes_1[nodeIdx].cluster = id;
            }
            values.push(id);
        }
        fieldForCluster = __assign(__assign({}, analyzeField(values)), { name: 'cluster' });
    }
    return fieldForCluster;
}
/* eslint-disable no-param-reassign */
/**
 * Calculate statistical and structural features for graph
 * @param nodes
 * @param links
 */
export function getAllStructFeats(nodes, links) {
    var nodeStructFeats = [];
    var linkStructFeats = [];
    // TODO: whether the graph is directed need to be passed in
    var isDirected = false;
    var degrees = GraphAlgorithms.getDegree({ nodes: nodes, edges: links });
    var pageRanks = GraphAlgorithms.pageRank({ nodes: nodes, edges: links });
    var cycles = GraphAlgorithms.detectAllCycles({ nodes: nodes, edges: links }, false);
    var directedCycles = GraphAlgorithms.detectAllDirectedCycle({ nodes: nodes, edges: links });
    var components = GraphAlgorithms.connectedComponent({ nodes: nodes, edges: links }, false);
    var strongConnectedComponents = GraphAlgorithms.connectedComponent({ nodes: nodes, edges: links }, true);
    var cycleCountMap = {};
    for (var i = 0; i < cycles.length; i += 1) {
        var nodeIds = Object.keys(cycles[i]);
        for (var j = 0; j < nodeIds.length; j += 1) {
            var nodeId = nodeIds[j];
            if (cycleCountMap[nodeId]) {
                cycleCountMap[nodeId] += 1;
            }
            else {
                cycleCountMap[nodeId] = 1;
            }
        }
    }
    var numberOfNodeInCycle = Object.values(cycleCountMap).filter(function (count) { return count; }).length;
    var cycleParticipate = numberOfNodeInCycle / nodes.length;
    for (var index = 0; index < nodes.length; index += 1) {
        var node = nodes[index];
        var nodeFeat = {
            degree: degrees[node.id].degree,
            inDegree: degrees[node.id].inDegree,
            outDegree: degrees[node.id].outDegree,
            pageRank: pageRanks[node.id],
            cycleCount: cycleCountMap[node.id] || 0,
        };
        nodeStructFeats.push(nodeFeat);
        nodes[index] = __assign(__assign({}, node), nodeFeat);
    }
    for (var index = 0; index < links.length; index += 1) {
        var link = links[index];
        var linkFeat = {};
        linkStructFeats.push(linkFeat);
        links[index] = __assign(__assign({}, link), linkFeat);
    }
    var nodeFeatNames = Object.keys(nodeStructFeats[0]);
    var linkFeatNames = Object.keys(linkStructFeats[0]);
    var nodeFeats = getAllFieldsInfo(generateColDataFromArray(nodeStructFeats, nodeFeatNames), nodeFeatNames);
    var linkFeats = getAllFieldsInfo(generateColDataFromArray(linkStructFeats, linkFeatNames), linkFeatNames);
    // Calculate the structural features and statistics of all nodes and links
    var nodeDegrees = nodes.map(function (node) { return Number(node.degree); });
    var avgDegree = nodeDegrees.reduce(function (x, y) { return x + y; }) / nodeDegrees.length;
    var degreeDev = nodeDegrees.map(function (x) { return x - avgDegree; });
    var degreeStd = Math.sqrt(degreeDev.map(function (x) { return Math.pow(x, 2); }).reduce(function (x, y) { return x + y; }) / (nodeDegrees.length - 1));
    var graphInfo = {
        isDirected: isDirected,
        nodeCount: nodes.length,
        linkCount: links.length,
        isConnected: components && components.length === 1,
        isDAG: isDirected && directedCycles.length === 0,
        maxDegree: Math.max.apply(Math, __spreadArray([], __read(nodeDegrees), false)),
        avgDegree: avgDegree,
        degreeStd: degreeStd,
        cycleParticipate: cycleParticipate,
        cycleCount: cycles.length,
        directedCycleCount: directedCycles.length,
        // triangleCount: triangleMatches.length,
        componentCount: components.length,
        components: components,
        strongConnectedComponents: strongConnectedComponents,
        strongConnectedComponentCount: strongConnectedComponents.length,
    };
    return {
        nodeFeats: nodeFeats,
        linkFeats: linkFeats,
        graphInfo: graphInfo,
    };
}
