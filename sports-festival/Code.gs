/** 곡선중 2026 스포츠 축제 · Google Sheets 저장 서버
 * 새 Google Sheet → 확장 프로그램 → Apps Script에 붙여 넣습니다.
 * 연결설정 탭 B3의 비밀번호를 읽어 setup() 실행 시 서버에 설정합니다.
 * 연결설정 탭이 없는 경우 ADMIN_TOKEN 스크립트 속성을 직접 지정할 수 있습니다.
 * setup()을 한 번 실행한 뒤 웹 앱(실행: 나 / 접근: 모든 사용자)으로 배포합니다.
 * 선생님 비밀번호는 이 파일이나 GitHub에 적지 않습니다.
 */
var FESTIVAL_APP='gokseon-festival-2026';
var FESTIVAL_EVENTS={rope:['단체 8자 줄넘기',200,170,140],typhoon:['태풍의 눈',250,210,170],cheer:['반별 단체응원전',250,210,170],runjump:['런앤점핑',200,170,140],tug:['줄다리기',250,200,150],threeleg:['2인3각 이어달리기',200,170,140],mission:['미션 달리기',200,170,140],wave:['긴줄파도타기',250,210,170],relay:['계주',250,210,170]};
function setup(){
 var ss=SpreadsheetApp.getActiveSpreadsheet();if(!ss)throw Error('새 Google Sheet에서 Apps Script를 열어 실행하세요.');
 var props=PropertiesService.getScriptProperties(),config=ss.getSheetByName('연결설정');
 if(config){var configuredToken=config.getRange('B3').getDisplayValue().trim();if(configuredToken)props.setProperty('ADMIN_TOKEN',configuredToken);}
 if(!props.getProperty('ADMIN_TOKEN'))throw Error('프로젝트 설정 → 스크립트 속성에 ADMIN_TOKEN을 먼저 지정하세요.');
 props.setProperty('FESTIVAL_SHEET_ID',ss.getId());
 var s=ss.getSheetByName('체육대회기록')||ss.insertSheet('체육대회기록');
 if(s.getLastRow()===0)s.appendRow(['문서키','학년','종목','상태','1반 순위','1반 기록','1반 점수','2반 순위','2반 기록','2반 점수','3반 순위','3반 기록','3반 점수','버전','원본 JSON','수정 시각']);
 s.setFrozenRows(1);s.getRange(1,1,1,16).setFontWeight('bold').setBackground('#f1f3f4');s.setColumnWidth(15,180);s.setColumnWidth(16,180);
 if(config)config.getRange('B5').setValue('초기 설정 완료 · 웹 앱 배포 필요');
}
function festivalSheet_(){var id=PropertiesService.getScriptProperties().getProperty('FESTIVAL_SHEET_ID');if(!id)throw Error('setup_required');var s=SpreadsheetApp.openById(id).getSheetByName('체육대회기록');if(!s)throw Error('setup_required');return s;}
function festivalJson_(o){o.app=FESTIVAL_APP;return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
function doGet(e){try{
 if(!e||!e.parameter||!e.parameter.action)return festivalWelcome_();
 if(e.parameter.action!=='all')return festivalJson_({ok:false,error:'invalid_action'});
 var s=festivalSheet_(),rows=s.getDataRange().getValues(),docs={};
 for(var i=1;i<rows.length;i++){if(/^g[123]_(rope|typhoon|cheer|runjump|tug|threeleg|mission|wave|relay)$/.test(String(rows[i][0])))docs[rows[i][0]]=JSON.parse(rows[i][14]);}
 return festivalJson_({ok:true,docs:docs,sheetUrl:'https://docs.google.com/spreadsheets/d/'+PropertiesService.getScriptProperties().getProperty('FESTIVAL_SHEET_ID')+'/edit',at:Date.now()});
 }catch(err){return festivalJson_({ok:false,error:err.message==='setup_required'?'setup_required':'read_failed'});}}
function festivalValidate_(key,v){
 if(!v||typeof v!=='object'||![1,2,3].includes(v.grade)||!Object.prototype.hasOwnProperty.call(FESTIVAL_EVENTS,v.event)||key!=='g'+v.grade+'_'+v.event)return false;
 if(!['draft','confirmed'].includes(v.status)||!Array.isArray(v.rows)||v.rows.length!==3)return false;
 var classes={},ranks={};for(var i=0;i<v.rows.length;i++){var r=v.rows[i];if(!r||![1,2,3].includes(r.classNo)||classes[r.classNo])return false;classes[r.classNo]=true;if(r.rank!==null&&![1,2,3].includes(r.rank))return false;if(typeof r.value!=='string'||r.value.length>120)return false;if(v.status==='confirmed'){if(!r.rank||ranks[r.rank])return false;ranks[r.rank]=true;}}
 return typeof v.note==='string'&&v.note.length<=1000;
}
function festivalSafeCell_(s){s=String(s);return /^[=+@\-\t\r]/.test(s)?"'"+s:s;}
function doPost(e){var lock=LockService.getScriptLock();try{
 if(!e||!e.postData||e.postData.contents.length>50000)return festivalJson_({ok:false,error:'invalid_request'});
 var b=JSON.parse(e.postData.contents),token=PropertiesService.getScriptProperties().getProperty('ADMIN_TOKEN');
 if(!token||typeof b.token!=='string'||b.token!==token)return festivalJson_({ok:false,error:'bad_token'});
 if(b.action==='login'){festivalSheet_();return festivalJson_({ok:true});}
 if(b.action!=='save')return festivalJson_({ok:false,error:'invalid_action'});
 if(!festivalValidate_(b.key,b.value)||!Number.isInteger(b.expectedRevision)||b.expectedRevision<0||typeof b.mutationId!=='string'||!/^[a-zA-Z0-9-]{16,80}$/.test(b.mutationId))return festivalJson_({ok:false,error:'invalid_result'});
 lock.waitLock(15000);var sheet=festivalSheet_(),rows=sheet.getDataRange().getValues(),row=rows.length+1,old=null;
 for(var i=1;i<rows.length;i++){if(rows[i][0]===b.key){row=i+1;old=JSON.parse(rows[i][14]);break;}}
 if(old&&old.mutationId===b.mutationId)return festivalJson_({ok:true,value:old});
 if((old?old.revision:0)!==b.expectedRevision)return festivalJson_({ok:false,error:'conflict'});
 var v={grade:b.value.grade,event:b.value.event,status:b.value.status,rows:b.value.rows.map(function(r){return {classNo:r.classNo,rank:r.rank,value:r.value};}),note:b.value.note,revision:b.expectedRevision+1,updatedAt:Date.now(),mutationId:b.mutationId};
 if(b.value.event==='tug'&&b.value.bracket){var bb=b.value.bracket;v.bracket={semiA:String(bb.semiA == null ? '' : bb.semiA).slice(0,1),semiB:String(bb.semiB == null ? '' : bb.semiB).slice(0,1),finalA:String(bb.finalA == null ? '' : bb.finalA).slice(0,1),finalB:String(bb.finalB == null ? '' : bb.finalB).slice(0,1)};}
 var cells=[b.key,v.grade,FESTIVAL_EVENTS[v.event][0],v.status==='confirmed'?'확정':'임시'];
 for(var c=1;c<=3;c++){var r=v.rows.filter(function(x){return x.classNo===c;})[0];cells.push(r.rank||'',festivalSafeCell_(r.value),v.status==='confirmed'?FESTIVAL_EVENTS[v.event][r.rank]:'');}
 cells.push(v.revision,JSON.stringify(v),new Date(v.updatedAt));sheet.getRange(row,1,1,16).setValues([cells]);SpreadsheetApp.flush();
 return festivalJson_({ok:true,value:v});
 }catch(err){return festivalJson_({ok:false,error:err.message==='setup_required'?'setup_required':'write_failed'});}finally{if(lock.hasLock())lock.releaseLock();}}

function festivalWelcome_(){
 festivalSheet_();
 var url=ScriptApp.getService().getUrl();
 var target='https://gokseon-sports-festival-2026.speedygrass9.chatgpt.site/?api='+encodeURIComponent(url)+'#overview';
 return HtmlService.createHtmlOutput('<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>체육대회 연결 준비 완료</title><body style="font:17px/1.8 sans-serif;max-width:650px;margin:50px auto;padding:25px"><h1>웹 앱 배포가 완료됐습니다.</h1><p>아래 버튼을 누르면 체육대회 사이트에 이 저장 서버를 연결합니다.</p><a style="display:inline-block;padding:12px 20px;background:#163d35;color:white;border-radius:10px" target="_top" href="'+target+'">체육대회 사이트 연결하기</a><p>다음 화면에서 선생님 로그인 후 기록을 입력하세요.</p></body></html>');
}
