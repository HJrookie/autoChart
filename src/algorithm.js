export const algoriData = {
  outlier: { method: "IQR", iqrK: 1.5, confidenceInterval: 0.95 },
  trend: { threshold: 0.05 },  //line 图, 超过 2 以后 就不显示了
  changePoint: { threshold: 0.05 },
  correlation: { alpha: 0.05, alternative: "two-sided", rho: 0 },
  lowVariance: { cvThreshold: 0.15 }, 
  majority: { limit: 0.6 },  // 饼图 占比超过多少 现在意思是有一个数占据了超过 60%才显示饼图 
};

/*
[
          {"year":1955,"country":"Afghanistan","value":"10"},
{"year":1956,"country":"Afghanistan","value":"20"},
{"year":1957,"country":"Afghanistan","value":"30"},
{"year":1958,"country":"Afghanistan","value":"40"},
{"year":1959,"country":"Afghanistan","value":"50"},
{"year":1960,"country":"Afghanistan","value":"60"},
{"year":1961,"country":"Afghanistan","value":"70"},
{"year":1962,"country":"Afghanistan","value":"100"},
{"year":1963,"country":"Afghanistan","value":"90"},
{"year":1970,"country":"Afghanistan","value":"1170"},
{"year":1964,"country":"Afghanistan","value":"100"},
{"year":1965,"country":"Afghanistan","value":"110"},
{"year":1966,"country":"Afghanistan","value":"120"},
{"year":1967,"country":"Afghanistan","value":"130"},
{"year":1968,"country":"Afghanistan","value":"140"},
{"year":1969,"country":"Afghanistan","value":"150"},
        ]


        [{
            "STU_ID": "A8B74EC19727434F84CE0BD5F488D51D",
            "NAME": "王印月",
            "sign_in_count": 1
          },
          {
            "STU_ID": "0BB0A8F843CE41CFB8C37DCAA8DC3442",
            "NAME": "李鹏",
            "sign_in_count": 2
          },
          {
            "STU_ID": "30B632A1BED342C0977F12E58FB05383",
            "NAME": "段伟",
            "sign_in_count": 3
          },
          {
            "STU_ID": "B632EFB23EF24B7587F9CBD15CAF1288",
            "NAME": "刘小庆",
            "sign_in_count": 4
          },
          {
            "STU_ID": "BC3B5EAC7D8A4E6BA5CFCFEC1442F539",
            "NAME": "高万虎",
            "sign_in_count": 15
  
            }]












            // [
          //   { year: '1991', value: 0.3 },
          //   { year: '1992', value: -0.5 },
          //   { year: '1993', value: 0.05 },
          //   { year: '1994', value: -0.2 },
          //   { year: '1995', value: 0.4 },
          //   { year: '1996', value: 6 },
          //   { year: '1997', value: 3 },
          //   { year: '1998', value: 9 },
          //   { year: '1999', value: 5 },
          // ]


*/