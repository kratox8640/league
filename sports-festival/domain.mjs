export const EVENTS=[
{id:'rope',name:'단체 8자 줄넘기',icon:'〰',points:[200,170,140],time:'09:30',unit:'회',higher:true,people:'남 8명·여 8명 (줄돌이 2명 포함)',rule:'2분 동안 성공한 횟수를 합산합니다. 줄에 걸린 횟수는 제외합니다. 2학년은 남 10명·여 6명으로 진행합니다.'},
{id:'typhoon',name:'태풍의 눈',icon:'◎',points:[250,210,170],time:'09:50',unit:'초',people:'남 9명·여 9명',rule:'3명이 한 팀으로 배턴을 완전히 전달한 뒤 출발합니다. 도착 순서로 순위를 정합니다. 2학년은 남 12명·여 6명입니다.'},
{id:'cheer',name:'반별 단체응원전',icon:'⚑',points:[250,210,170],time:'10:10',unit:'점',higher:true,people:'학급 전체',rule:'학급 소개 후 2분 30초 이내의 음악에 맞춰 진행합니다. 응원전 점수는 종합점수에 포함합니다. 심사 배점 세부 기준은 계획서에 없으므로 심사 합계를 입력하고 최종 순위를 확정합니다.'},
{id:'runjump',name:'런앤점핑',icon:'↗',points:[200,170,140],time:'10:30',unit:'초',people:'주자 남 2명·대기 9명·줄돌이 2명',rule:'낙하산 달리기 후 대기 인원과 단체줄넘기 10회를 진행합니다. 주자 2명이 모두 완주한 순서로 순위를 정합니다.'},
{id:'tug',name:'줄다리기',icon:'↔',points:[250,200,150],time:'10:50',unit:'승',people:'학급 전체·남녀 인원 맞춤',rule:'한 경기 30초, 3전 2선승제입니다. 3세트 진영은 대표 가위바위보로 정합니다. 종합 동점 시 이 종목의 결과로 순위를 가릅니다.'},
{id:'threeleg',name:'2인3각 이어달리기',icon:'⋈',points:[200,170,140],time:'11:30',unit:'초',people:'인원은 운영본부 확인 필요',rule:'두 명씩 발을 고정하고 고깔을 돌아 다음 팀과 교대합니다. 발 고정 물품을 인계한 뒤 출발하며 도착 순서로 순위를 정합니다. 문서의 참가 인원 표기가 서로 달라 확인이 필요합니다.'},
{id:'mission',name:'미션 달리기',icon:'✳',points:[200,170,140],time:'11:50',unit:'초',people:'남 3명·여 2명',rule:'물병세우기, 헤드 바스켓, 훌라후프 줄넘기, 코끼리코, 캥거루달리기를 완수합니다. 첫 주자는 남학생이며 계주 선수와 중복할 수 없습니다.'},
{id:'wave',name:'긴줄파도타기',icon:'≈',points:[250,210,170],time:'14:00',unit:'초',people:'줄잡이 남 4팀·여 4팀 (각 2명)',rule:'발밑으로 줄을 통과시킨 뒤 머리 위로 들고 복귀합니다. 8쌍이 릴레이하며 마지막 주자의 도착 순서로 순위를 정합니다. 2학년은 남 5팀·여 3팀입니다.'},
{id:'relay',name:'계주',icon:'⚡',points:[250,210,170],time:'14:30',unit:'초',people:'남 4명·여 4명',rule:'주자마다 운동장 반 바퀴를 달립니다. 배턴존 안에서 인계하고 여→남 순서로 진행합니다. 미션 달리기 선수와 중복할 수 없습니다.'}
];
export const SCHEDULE=[['09:00','09:10','응원석 이동','전 학급'],['09:10','09:30','개회식 및 준비운동','전 학급'],['09:30','09:50','단체 8자 줄넘기','3→2→1학년','rope'],['09:50','10:10','태풍의 눈','3→2→1학년','typhoon'],['10:10','10:30','1학년 단체응원전','1→2→3반','cheer',1],['10:30','10:50','런앤점핑','3→2→1학년','runjump'],['10:50','11:10','줄다리기 예선','2개 학년 동시 진행','tug'],['11:10','11:30','2학년 단체응원전','1→2→3반','cheer',2],['11:30','11:50','2인3각 이어달리기','3→2→1학년','threeleg'],['11:50','12:20','미션 달리기','3→2→1학년','mission'],['12:20','12:40','학부모 줄다리기','이벤트·점수 미반영'],['12:40','13:30','점심 식사','휴식'],['13:20','13:30','댄스부 엘르 축하공연','점심시간 중 공연'],['13:30','14:00','3학년 단체응원전','1→2→3반','cheer',3],['14:00','14:20','긴줄파도타기','3→2→1학년','wave'],['14:20','14:30','줄다리기 결승','1→2→3학년','tug'],['14:30','14:50','계주 결승','1→2→3학년','relay'],['14:50','15:10','시상식 및 폐회식','종합우승·준우승'],['15:10','16:10','환경정화 및 종례','3학년 봉사·1,2학년 학생자치']];
export const keyFor=(grade,event)=>'g'+grade+'_'+event;
export const emptyResult=(grade,event)=>({grade:Number(grade),event,rows:[1,2,3].map(classNo=>({classNo,rank:null,value:''})),status:'draft',revision:0,note:''});
export function validateResult(r){
 if(!r || ![1,2,3].includes(r.grade)||!EVENTS.some(e=>e.id===r.event))throw Error('올바른 학년과 종목을 선택하세요.');
 if(!Array.isArray(r.rows)||r.rows.length!==3||new Set(r.rows.map(x=>x.classNo)).size!==3||r.rows.some(x=>![1,2,3].includes(x.classNo)))throw Error('1~3반 기록이 모두 필요합니다.');
 if(!['draft','confirmed'].includes(r.status))throw Error('기록 상태를 확인하세요.');
 if(r.rows.some(x=>x.rank!==null&&![1,2,3].includes(x.rank)))throw Error('순위는 1~3위로 입력하세요.');
 if(r.status==='confirmed'&&(r.rows.some(x=>!x.rank)||new Set(r.rows.map(x=>x.rank)).size!==3))throw Error('결과 확정에는 중복 없는 1·2·3위가 필요합니다. 동률은 심판 확인 후 순위를 정해 주세요.');
 if(r.rows.some(x=>String(x.value??'').length>120)||String(r.note||'').length>1000)throw Error('기록 또는 메모가 너무 깁니다.');
 return true;
}
export function pointsFor(event,rank){return EVENTS.find(e=>e.id===event)?.points[rank-1]??0;}
export function standings(docs,grade=0){
 const rows=[];for(let g=1;g<=3;g++){if(grade&&g!==Number(grade))continue;for(let c=1;c<=3;c++){
  const scores={},ranks={};let total=0,completed=0;
  for(const e of EVENTS){const doc=docs[keyFor(g,e.id)],r=doc?.rows?.find(x=>x.classNo===c);if(doc?.status==='confirmed'&&r?.rank){scores[e.id]=pointsFor(e.id,r.rank);ranks[e.id]=r.rank;total+=scores[e.id];completed++;}else scores[e.id]=null;}
  rows.push({grade:g,classNo:c,scores,ranks,total,completed,tug:ranks.tug||null});
 }}
 const ready=new Map();for(const r of rows)ready.set(r.total,(ready.get(r.total)??true)&&!!r.tug);
 const compare=(a,b)=>b.total-a.total||(ready.get(a.total)&&a.tug&&b.tug?a.tug-b.tug:0);
 rows.sort((a,b)=>compare(a,b)||a.grade-b.grade||a.classNo-b.classNo);
 rows.forEach((r,i)=>{r.rank=r.completed?(i&&compare(rows[i-1],r)===0?rows[i-1].rank:i+1):null;});
 return rows;
}
export function inferRanks(event,rows){
 const e=EVENTS.find(e=>e.id===event);if(!e)throw Error('종목을 확인하세요.');
 const parsed=rows.map(r=>{const t=String(r.value??'').trim();if(!t)throw Error('세 반의 기록을 모두 입력하세요.');let n;if(/^\d+:\d{1,2}(\.\d+)?$/.test(t)&&!e.higher){const [m,sec]=t.split(':').map(Number);if(sec>=60)throw Error('초는 60 미만으로 입력하세요.');n=m*60+sec;}else if(/^\d+(\.\d+)?$/.test(t)){n=Number(t);}else throw Error('숫자 또는 분:초 형태로 기록을 입력하세요.');return {...r,n};});
 if(new Set(parsed.map(r=>r.n)).size!==3)throw Error('기록이 같습니다. 심판 확인 후 순위를 직접 입력해 주세요.');
 parsed.sort((a,b)=>e.higher?b.n-a.n:a.n-b.n);return rows.map(r=>({...r,rank:parsed.findIndex(x=>x.classNo===r.classNo)+1}));
}
export function tugRanks(grade,bracket){
 const pair=Number(grade)===1?[1,3]:[2,3],bye=Number(grade)===1?2:1;
 const winner=(a,b,label)=>{if(a===''||b===''||a==null||b==null)throw Error(label+' 승수를 모두 입력하세요.');a=Number(a);b=Number(b);if(!((a===2&&[0,1].includes(b))||(b===2&&[0,1].includes(a))))throw Error(label+'는 2:0 또는 2:1 결과가 필요합니다.');return a>b?0:1;};
 const wi=winner(bracket.semiA,bracket.semiB,'예선'),semiWinner=pair[wi],third=pair[1-wi];
 const fi=winner(bracket.finalA,bracket.finalB,'결승');return {first:fi===0?semiWinner:bye,second:fi===0?bye:semiWinner,third,semiWinner,bye,pair};
}
