/** Google Sheet → 확장 프로그램 → Apps Script에 붙여 넣으세요.
 * 프로젝트 설정 → 스크립트 속성: ADMIN_TOKEN(긴 관리자 비밀번호).
 * setup()을 한 번 실행한 후 웹 앱으로 배포: 실행 사용자=나, 접근=모든 사용자.
 * 공개 조회에는 학급별 경기 기록만 반환됩니다. 학생 개인정보를 넣지 마세요.
 */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('구글 시트에서 Apps Script를 열어 실행하세요.');
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
  var sheet = ss.getSheetByName('리그기록') || ss.insertSheet('리그기록');
  if (sheet.getLastRow() === 0) sheet.appendRow(['문서키', '기록(JSON)', '수정시각']);
  sheet.setFrozenRows(1);
}
function sheet_() {
  var id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('setup_required');
  var s = SpreadsheetApp.openById(id).getSheetByName('리그기록');
  if (!s) throw new Error('setup_required');
  return s;
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function doGet(e) {
  try {
    if (!e || e.parameter.action !== 'all') return json_({ok:false,error:'invalid_action'});
    var rows = sheet_().getDataRange().getValues(), docs = {};
    for (var i=1;i<rows.length;i++) {
      if (/^(league\/config|matches\/[a-zA-Z0-9_-]+|esports\/g[123])$/.test(String(rows[i][0]))) {
        docs[rows[i][0]] = JSON.parse(rows[i][1]);
      }
    }
    return json_({ok:true,docs:docs,at:Date.now()});
  } catch (err) { return json_({ok:false,error:'read_failed'}); }
}
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var b = JSON.parse(e.postData.contents);
    var token = PropertiesService.getScriptProperties().getProperty('ADMIN_TOKEN');
    if (!token || typeof b.token !== 'string' || b.token !== token) return json_({ok:false,error:'bad_token'});
    if (!/^(league\/config|matches\/[a-zA-Z0-9_-]+|esports\/g[123])$/.test(String(b.key))) return json_({ok:false,error:'invalid_key'});
    if (!b.value || Array.isArray(b.value) || typeof b.value !== 'object') return json_({ok:false,error:'invalid_value'});
    var value = JSON.stringify(b.value);
    if (value.length > 45000) return json_({ok:false,error:'too_large'});
    lock.waitLock(10000);
    var sheet = sheet_(), rows = sheet.getDataRange().getValues(), row = rows.length+1;
    for (var i=1;i<rows.length;i++) if (rows[i][0] === b.key) { row=i+1; break; }
    sheet.getRange(row,1,1,3).setValues([[b.key,value,new Date()]]);
    SpreadsheetApp.flush();
    return json_({ok:true,at:Date.now()});
  } catch (err) { return json_({ok:false,error:'write_failed'}); }
  finally { if (lock.hasLock()) lock.releaseLock(); }
}
