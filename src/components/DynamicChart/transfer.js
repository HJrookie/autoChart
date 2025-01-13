import ExcelJS from "exceljs";

// todo
// 1. import excel js
// 2. try download
export const downloadDataAsExcel = async (data = [], query) => {
  let columns = [],
    rows = [];
  // columns => [{ name: "letter" }, { name: "frequency" }, { name: "value" },]
  // rows =>  [Array(3), Array(3), Array(3), Array(3), Array(3)   ['A', 0.08167, 1]
  Object.keys(data?.[0] ?? {}).forEach((item) => {
    columns.push({ name: item });
  });
  data.forEach((item) => {
    const tempArr = [];
    columns.forEach((col) => {
      tempArr.push(item[col.name]);
    });
    rows.push(tempArr);
  });
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("数据表");
  //
  const cell = sheet.getCell('A1');
  cell.value =  `数据导出日期--${getDateTime()}`;
  sheet.addTable({
    ref: "A2",
    columns: columns,
    rows: rows,
  });
  sheet.mergeCells("A1:B1"); // 合并单元格

  columns.forEach((item, i) => {
    // 设置样式，更多样式去看文档
    sheet.getColumn(i + 1).width = 30;
    // sheet.getColumn(i + 1).height = 30;
    sheet.getColumn(i + 1).alignment = { vertical: "middle", horizontal: "center" };
  });
  const buffer = await workbook.xlsx.writeBuffer();
  pureDownload(buffer, `结果--${getDateTime()}.xlsx`);
};

const pureDownload = (_blob, filename) => {
  const blob = new Blob([_blob]);
  const downloadElement = document.createElement("a");
  downloadElement.style.display = "none";
  const href = window.URL.createObjectURL(blob); // 创建下载的链接
  downloadElement.href = href;
  downloadElement.download = filename; // 下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click(); // 点击下载
  document.body.removeChild(downloadElement); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
};


const getDateTime = () => {
  const currentTime = new Date();
  const year = currentTime.getFullYear();
  const month = currentTime.getMonth() + 1; // 月份从0开始，因此需要加1
  const day = currentTime.getDate();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  return`${year}年${month}月${day}日-${hours}时${minutes}分${seconds}秒`
}