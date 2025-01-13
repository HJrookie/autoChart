import { __assign } from "tslib";
import { base } from './base';
/**
 * A cheap way to get a copy of base.
 */
function newBase() {
    return JSON.parse(JSON.stringify(base));
}
/**
 * Process ckb config to given CKB object.
 *
 * 根据配置项处理 CKB 内容，得到最终使用的 CKB
 *
 * @param ckbCfg - CKB Configuration {@link CkbConfig}
 * @returns CKB for actual use
 */
function processCkbCfg(ckb, ckbCfg) {
    var ckbBase = ckb;
    var exclude = ckbCfg.exclude, include = ckbCfg.include, custom = ckbCfg.custom;
    // step 1: exclude charts from original CKB.
    // ---
    // 步骤一：如果有 exclude 项，先从给到的 CKB 中剔除部分选定的图表类型
    if (exclude) {
        exclude.forEach(function (chartType) {
            if (Object.keys(ckbBase).includes(chartType)) {
                delete ckbBase[chartType];
            }
        });
    }
    // step 2: only include charts from former CKB.
    // ---
    // 步骤二：如果有 include 项，则从当前（剔除后的）CKB中，只保留 include 中的图表类型。
    if (include) {
        Object.keys(ckbBase).forEach(function (chartType) {
            if (!include.includes(chartType)) {
                delete ckbBase[chartType];
            }
        });
    }
    // step 3: concat customized charts, may add or override chart types.
    // ---
    // 步骤三：在处理后的 CKB 最后，加入（可能存在的）自定义图表类型，实现图表类型的添加或覆写。
    var finalCkbBase = __assign(__assign({}, ckbBase), custom);
    return finalCkbBase;
}
/**
 * Get a CKB object.
 *
 * @param ckbCfg - CKB Configuration {@link CkbConfig}
 * @public
 */
export function ckb(ckbCfg) {
    var base = newBase();
    return ckbCfg ? processCkbCfg(base, ckbCfg) : base;
}
