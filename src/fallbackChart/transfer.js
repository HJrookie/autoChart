export const defaultInsightData = [
    {
        "subspace": [],
        "dimensions": [
            {
                "fieldName": "REGIST_DATE"
            }
        ],
        "measures": [
            {
                "fieldName": "TOTAL_PRICE",
                "method": "SUM"
            }
        ],
        "patterns": [
            {
                "type": "time_series_outlier",
                "dimension": "REGIST_DATE",
                "measure": "TOTAL_PRICE",
                "significance": 0.8181818181818182,
                "index": 8,
                "x": "2017-04-19",
                "y": 1953200,
                "baselines": [
                    323360.7157389292,
                    338969.5046785473,
                    353422.1754519468,
                    367764.35311216745,
                    373654.8239456977,
                    324314.5675361202,
                    357249.1224422972,
                    416399.011350587,
                    429542.6883978138,
                    448324.1313530756,
                    475061.53595069697
                ],
                "thresholds": [
                    -1027737.6428471289,
                    943771.9755433564
                ],
                "significantInsight": true
            }
        ],
        "data": [
            {
                "REGIST_DATE": "2017-04-05",
                "TOTAL_PRICE": 330180
            },
            {
                "REGIST_DATE": "2017-04-06",
                "TOTAL_PRICE": 262500
            },
            {
                "REGIST_DATE": "2017-04-09",
                "TOTAL_PRICE": 493460
            },
            {
                "REGIST_DATE": "2017-04-10",
                "TOTAL_PRICE": 332970
            },
            {
                "REGIST_DATE": "2017-04-14",
                "TOTAL_PRICE": 239150
            },
            {
                "REGIST_DATE": "2017-04-16",
                "TOTAL_PRICE": 740750
            },
            {
                "REGIST_DATE": "2017-04-17",
                "TOTAL_PRICE": 30160
            },
            {
                "REGIST_DATE": "2017-04-18",
                "TOTAL_PRICE": 116160
            },
            {
                "REGIST_DATE": "2017-04-19",
                "TOTAL_PRICE": 1953200
            },
            {
                "REGIST_DATE": "2017-04-23",
                "TOTAL_PRICE": 652780
            },
            {
                "REGIST_DATE": "2017-04-24",
                "TOTAL_PRICE": 186640
            }
        ],
        "score": 0.8545454545454547
    }
]

export const defaultTableData = [
    {
        "REGIST_DATE": "2017-04-05",
        "TOTAL_PRICE": 330180
    },
    {
        "REGIST_DATE": "2017-04-06",
        "TOTAL_PRICE": 262500
    },
    {
        "REGIST_DATE": "2017-04-09",
        "TOTAL_PRICE": 493460
    },
    {
        "REGIST_DATE": "2017-04-10",
        "TOTAL_PRICE": 332970
    },
    {
        "REGIST_DATE": "2017-04-14",
        "TOTAL_PRICE": 239150
    },
    {
        "REGIST_DATE": "2017-04-16",
        "TOTAL_PRICE": 740750
    },
    {
        "REGIST_DATE": "2017-04-17",
        "TOTAL_PRICE": 30160
    },
    {
        "REGIST_DATE": "2017-04-18",
        "TOTAL_PRICE": 116160
    },
    {
        "REGIST_DATE": "2017-04-19",
        "TOTAL_PRICE": 1953200
    },
    {
        "REGIST_DATE": "2017-04-23",
        "TOTAL_PRICE": 652780
    },
    {
        "REGIST_DATE": "2017-04-24",
        "TOTAL_PRICE": 186640
    }
]