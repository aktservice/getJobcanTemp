import { RestJobcan } from "./restJobcan";

const CONFIG_DATA = {
  CONFIGSHEETNAME: "config",
  MAILADDRESSTAGET: "A2",
  SEARCHWORD: "B2",
};

function getJobcanReq(next: string, index: number = 0) {
  const rest = new RestJobcan();
  const bf = new Date();
  const asia = "Asia/Tokyo";
  const fmt = "yyyy/MM/dd";
  const tm = bf.getHours();
  if (tm > 21 || tm < 9) {
    return;
  }
  const before = Utilities.formatDate(bf, asia, fmt);
  let result: Jobcan.V2result;
  if (next) {
    result = rest.getRequests(before, next);
  } else {
    result = rest.getRequests(before);
  }
  const contents = result.results;
  const sp = SpreadsheetApp.getActiveSpreadsheet();
  const sh = sp.getSheetByName("today");
  if (index == 0) {
    sh.getRange("A2:Z").clearContent();
  }
  contents.forEach((content) => {
    const val = Object.values(content);
    const reqNo = val[0];
    const hyperLinkFunc = `=HYPERLINK("https://ssl.wf.jobcan.jp/#/requests/${reqNo}","${reqNo}")`;
    val[0] = hyperLinkFunc;
    sh.appendRow(val);
  });
  if (result.next) {
    index++;
    getJobcanReq(result.next, index);
  }
}

/**
 * @description リクエストIDを取得したシートで実行すると内容が取得できる関数
 * @author yoshitaka <sato-yoshitaka@aktio.co.jp>
 * @date 05/11/2024
 */
function test2() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const sheet2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("main");
  const idcolumn = 0;

  const rest = new RestJobcan();
  const data = sheet.getDataRange().getDisplayValues();
  data.forEach((element, index) => {
    if (index == 0) {
      return;
    }
    const id = element[idcolumn];
    const contents = rest.getCustomezedItemsByRequestId(id);
    try {
      sheet2.appendRow(contents);
    } catch (error) {
      sheet2.appendRow([id, error.message]);
    }
  });
}
