import { Jobcan } from "./@types/job2.d";
//ref job2.d.ts
export class RestJobcan {
  private BASEURL = `https://ssl.wf.jobcan.jp/wf_api/`;
  private token = "";
  constructor(token: string | undefined = undefined) {
    if (token) {
      this.token = token;
    } else {
      this.token = PropertiesService.getScriptProperties().getProperty("token");
    }
  }
  /**
   * getRequest
   */
  public getRequests(appliedAfter: string, status: string = "in_progress") {
    const baseurl = this.BASEURL;
    const reqString: string = `?applied_after=${appliedAfter}&status=${status}`;

    const requestUrl = `${baseurl}v2/requests/${reqString}`;

    let result: Jobcan.V2result = this.getFetch(requestUrl);
    return result;
  }
  /**
   * @description ジョブカンへ接続して情報を取得する
   * @author yoshitaka <sato-yoshitaka@aktio.co.jp>
   * @date 21/10/2024
   * @param {string} request_id
   * @param {boolean} [onlyPart=true]
   * @returns {*}
   */
  public getCustomezedItemsByRequestId(
    request_id: string,
    onlyPart: boolean = true
  ) {
    const baseurl = this.BASEURL;
    const requestUrl = `${baseurl}v1/requests/${request_id}/`;

    let result: Jobcan.JobcanResult = this.getFetch(requestUrl);
    if (onlyPart) {
      const INPROGRESS = "in_progress";
      if (result.status !== INPROGRESS) {
        return;
      }
    }
    let ret = [result.id, result.form_name];
    result.detail.customized_items.forEach((element: CustomizedItem, index) => {
      Logger.log(element.title);
      ret.push(element.content);
    });
    return ret;
  }
  /**
   * @description fetch
   * @author yoshitaka <sato-yoshitaka@aktio.co.jp>
   * @date 31/10/2024
   * @private
   * @param {string} url
   * @param {GoogleAppsScript.URL_Fetch.HttpMethod} [method="get"]
   * @param {string} [payload=""]
   * @returns {*}  {JobcanResult}
   * @memberof RestJobcan
   */
  private getFetch(
    url: string,
    method: GoogleAppsScript.URL_Fetch.HttpMethod = "get",
    payload: string = ""
  ): Jobcan.V2result {
    const pram: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: method,
      contentType: "application/json",
      muteHttpExceptions: false,
      payload: payload,
      headers: {
        Authorization: "token " + this.token,
      },
    };
    //レスポンスを受ける変数
    let res: GoogleAppsScript.URL_Fetch.HTTPResponse;
    let result: Jobcan.JobcanResult;
    let resCode: number;
    try {
      res = UrlFetchApp.fetch(url, pram);
      resCode = res.getResponseCode();
      if (resCode == 200) {
        const parseObject = JSON.parse(res.getContentText());
        parseObject.resCode = 200;
        //return object
        result = parseObject;
      } else {
        // rescode is not 200 then error
        throw new Error("not 200");
      }
    } catch (error) {
      return error;
    }

    return result;
  }
}
