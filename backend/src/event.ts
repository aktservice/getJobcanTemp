/**
 * @description オープンイベント（メニュー用）
 * @author yoshitaka <sato-yoshitaka@aktio.co.jp>
 * @date 30/07/2024
 */
function onOpen(): void {
  const ui = SpreadsheetApp.getUi();
  const mn = ui.createMenu("menu");

  mn.addItem("ジョブカン接続", "");
  mn.addToUi();
}
