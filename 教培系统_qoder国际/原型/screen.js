/* ============================================================
 * 可视化大屏 · screen.js（无第三方依赖，纯 SVG/CSS 渲染）
 * 配色遵循 PRD 3.1.1；三屏：总览 / 学情 / 资源
 * ============================================================ */
function $(id){return document.getElementById(id)}
const C={blue:'#4facfe',cyan:'#22d3ee',green:'#43c463',orange:'#F5A623',red:'#ff6b6b',purple:'#a78bfa',teal:'#2dd4bf'};
const SERIES=[C.blue,C.cyan,C.green,C.orange,C.purple,C.teal,C.red];

/* ---------- 数字滚动动画 ---------- */
function countUp(el){
  const target=parseFloat(el.dataset.cnt)||0, suffix=el.dataset.suffix||'';
  const dur=900, t0=performance.now();
  function step(t){
    const p=Math.min((t-t0)/dur,1), e=1-Math.pow(1-p,3);
    const v=target*e;
    el.textContent=(target%1===0?Math.round(v).toLocaleString():v.toFixed(1))+suffix;
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ---------- SVG 折线/面积图（可多条） ---------- */
function lineArea(box,labels,series,opt={}){
  const W=620,H=260,pl=40,pr=14,pt=16,pb=28;
  const iw=W-pl-pr, ih=H-pt-pb;
  const max=opt.max||Math.max(...series.flatMap(s=>s.data))*1.15;
  const n=labels.length;
  const x=i=>pl+(n===1?iw/2:iw*i/(n-1));
  const y=v=>pt+ih-(v/max)*ih;
  let g='';
  for(let k=0;k<=4;k++){const yy=pt+ih*k/4;const val=Math.round(max*(1-k/4));
    g+=`<line x1="${pl}" y1="${yy}" x2="${W-pr}" y2="${yy}" stroke="rgba(255,255,255,.08)"/>`;
    g+=`<text x="${pl-8}" y="${yy+4}" fill="#5f7ea6" font-size="11" text-anchor="end">${val}</text>`;}
  let xl='';
  labels.forEach((lb,i)=>{xl+=`<text x="${x(i)}" y="${H-8}" fill="#5f7ea6" font-size="10.5" text-anchor="middle">${lb}</text>`;});
  let defs='',paths='';
  series.forEach((s,si)=>{
    const id='lg'+box.id+si;
    defs+=`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${s.color}" stop-opacity=".38"/><stop offset="100%" stop-color="${s.color}" stop-opacity="0"/></linearGradient>`;
    const pts=s.data.map((v,i)=>`${x(i)},${y(v)}`).join(' ');
    if(s.area!==false)
      paths+=`<polygon points="${pl},${pt+ih} ${pts} ${x(n-1)},${pt+ih}" fill="url(#${id})"/>`;
    paths+=`<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`;
    s.data.forEach((v,i)=>{paths+=`<circle cx="${x(i)}" cy="${y(v)}" r="3" fill="#04122b" stroke="${s.color}" stroke-width="2"><title>${labels[i]} · ${s.name}：${v}</title></circle>`;});
  });
  box.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs>${defs}</defs>${g}${paths}${xl}</svg>`;
}

/* ---------- SVG 柱状图 ---------- */
function columns(box,labels,data,color,opt={}){
  const W=620,H=260,pl=38,pr=12,pt=16,pb=30;
  const iw=W-pl-pr, ih=H-pt-pb, max=opt.max||Math.max(...data)*1.18, n=data.length;
  const bw=Math.min(38,iw/n*0.56);
  let g='';
  for(let k=0;k<=4;k++){const yy=pt+ih*k/4;const val=Math.round(max*(1-k/4));
    g+=`<line x1="${pl}" y1="${yy}" x2="${W-pr}" y2="${yy}" stroke="rgba(255,255,255,.08)"/>`;
    g+=`<text x="${pl-8}" y="${yy+4}" fill="#5f7ea6" font-size="11" text-anchor="end">${val}</text>`;}
  const gid='cg'+box.id;
  let bars='';
  data.forEach((v,i)=>{
    const cx=pl+iw*(i+0.5)/n, h=(v/max)*ih, yy=pt+ih-h;
    const col=Array.isArray(color)?color[i]:color;
    bars+=`<rect x="${cx-bw/2}" y="${yy}" width="${bw}" height="${h}" rx="3" fill="url(#${gid})" opacity=".95"><title>${labels[i]}：${v}</title></rect>`;
    bars+=`<text x="${cx}" y="${yy-6}" fill="#d6e6ff" font-size="11.5" text-anchor="middle" font-weight="700">${v}</text>`;
    bars+=`<text x="${cx}" y="${H-9}" fill="#5f7ea6" font-size="10.5" text-anchor="middle">${labels[i]}</text>`;
  });
  box.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${Array.isArray(color)?color[0]:color}"/><stop offset="100%" stop-color="${Array.isArray(color)?color[0]:color}" stop-opacity=".25"/>
    </linearGradient></defs>${g}${bars}</svg>`;
}

/* ---------- SVG 环形图（含图例） ---------- */
function donut(box,data,opt={}){
  const W=620,H=250,cx=140,cy=125,r=88,ir=54;
  const total=data.reduce((s,d)=>s+d.value,0);
  let a0=-Math.PI/2, arcs='';
  data.forEach((d,i)=>{
    const ang=d.value/total*Math.PI*2, a1=a0+ang;
    const large=ang>Math.PI?1:0;
    const p=(rr,aa)=>[cx+rr*Math.cos(aa),cy+rr*Math.sin(aa)];
    const [x0,y0]=p(r,a0),[x1,y1]=p(r,a1),[x2,y2]=p(ir,a1),[x3,y3]=p(ir,a0);
    arcs+=`<path d="M${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${ir},${ir} 0 ${large} 0 ${x3},${y3} Z" fill="${d.color}" opacity=".9"><title>${d.name}：${d.value}（${(d.value/total*100).toFixed(1)}%）</title></path>`;
    a0=a1;
  });
  let lg='',ly=52;
  data.forEach((d,i)=>{
    lg+=`<rect x="290" y="${ly-9}" width="11" height="11" rx="2" fill="${d.color}"/>`;
    lg+=`<text x="308" y="${ly}" fill="#d6e6ff" font-size="13">${d.name}</text>`;
    lg+=`<text x="600" y="${ly}" fill="#8fb0d9" font-size="13" text-anchor="end">${d.value} · ${(d.value/total*100).toFixed(1)}%</text>`;
    ly+=32;
  });
  box.innerHTML=`<svg viewBox="0 0 ${W} ${H}">
    ${arcs}
    <text x="${cx}" y="${cy-4}" fill="#fff" font-size="30" font-weight="700" text-anchor="middle" font-family="Consolas,monospace">${opt.center||total}</text>
    <text x="${cx}" y="${cy+20}" fill="#8fb0d9" font-size="12" text-anchor="middle">${opt.centerLabel||'合计'}</text>
    ${lg}</svg>`;
}

/* ---------- 排名条（HTML） ---------- */
function rank(box,data,unit=''){
  const max=Math.max(...data.map(d=>d.value));
  box.innerHTML=data.map((d,i)=>`
    <div class="rank-item" onclick="drill('${d.key||'rank'}','${d.name}')">
      <span class="rank-no num">${i+1}</span>
      <span class="rank-name" title="${d.name}">${d.name}</span>
      <span class="rank-bar"><i style="width:${(d.value/max*100).toFixed(1)}%;${d.color?'background:linear-gradient(90deg,'+d.color+',var(--c-cyan))':''}"></i></span>
      <span class="rank-val num">${d.value}${unit}</span>
    </div>`).join('');
}

/* ---------- 热力图（教室×时段） ---------- */
function heat(box,rows,cols,mat){
  const W=620,H=250,pl=70,pt=22,pr=10,pb=26;
  const iw=W-pl-pr, ih=H-pt-pb, cw=iw/cols.length, ch=ih/rows.length;
  const color=v=>{ // 0-100 占用率
    if(v>=90)return'rgba(255,107,107,.9)';
    if(v>=75)return'rgba(245,166,35,.85)';
    if(v>=45)return'rgba(79,172,254,.8)';
    if(v>0)return'rgba(45,212,191,.55)';
    return'rgba(255,255,255,.06)';};
  let cells='',cl='',rl='';
  mat.forEach((row,ri)=>{
    rl+=`<text x="${pl-8}" y="${pt+ch*ri+ch/2+4}" fill="#8fb0d9" font-size="11.5" text-anchor="end">${rows[ri]}</text>`;
  });
  mat.forEach((row,ri)=>row.forEach((v,ci)=>{
    cells+=`<rect x="${pl+cw*ci+1.5}" y="${pt+ch*ri+1.5}" width="${cw-3}" height="${ch-3}" rx="3" fill="${color(v)}"><title>${rows[ri]} ${cols[ci]}：占用${v}%</title></rect>`;
    if(v>=75)cells+=`<text x="${pl+cw*ci+cw/2}" y="${pt+ch*ri+ch/2+4}" fill="#04122b" font-size="10.5" font-weight="700" text-anchor="middle">${v}</text>`;
  }));
  cols.forEach((c,ci)=>{cl+=`<text x="${pl+cw*ci+cw/2}" y="${pt-7}" fill="#5f7ea6" font-size="10.5" text-anchor="middle">${c}</text>`;});
  box.innerHTML=`<svg viewBox="0 0 ${W} ${H}">${cells}${rl}${cl}
    <text x="${pl}" y="${H-6}" fill="#5f7ea6" font-size="10.5">■ 空闲  ■ 低  ■ 中  ■ 高  ■ 满载（占用率）</text></svg>`;
}

/* ============================================================
 * 数据
 * ============================================================ */
const MONTHS=['10月','11月','12月','1月','2月','3月','4月','5月','6月','7月','8月','9月'];
const DATA={
  trendOpen:[3,4,2,5,4,6,5,7,6,8,7,9],
  trendPpl:[180,240,150,320,260,380,300,420,360,470,410,520],
  type:[{name:'党校班',value:18,color:C.blue},{name:'政能班',value:14,color:C.cyan},
        {name:'专题研讨班',value:11,color:C.green},{name:'青年干部班',value:9,color:C.orange},
        {name:'外事业务班',value:6,color:C.purple}],
  region:[{name:'部机关',value:620},{name:'驻外使领馆',value:480},{name:'部属单位',value:410},
          {name:'党政军企外事',value:360},{name:'省市外办',value:300},{name:'高校院所',value:240},
          {name:'国企外事',value:180},{name:'其他',value:120}],
  org:[{name:'培训学院',value:26},{name:'干部教育局',value:18},{name:'外事管理司',value:12},
       {name:'地区业务司',value:9},{name:'人事司',value:6}],
  system:[{name:'新时代中特思想体系',value:32},{name:'外交思想课程体系',value:28},
          {name:'党性教育课程体系',value:22},{name:'政策形势课程体系',value:18},
          {name:'业务技能课程体系',value:15}],
  attend:[{name:'已到',value:2480,color:C.green},{name:'请假',value:96,color:C.orange},
          {name:'缺勤',value:38,color:C.red},{name:'补签',value:22,color:C.blue}],
  eval:[{name:'新时代思想概论',value:96},{name:'宏观经济形势',value:94},{name:'外交政策解读',value:92},
        {name:'基层治理案例',value:89},{name:'党性教育专题',value:87},{name:'应急处置实务',value:83}],
  score:{labels:['<60','60-69','70-79','80-89','90-100'],data:[8,42,120,240,180]},
  ability:{labels:['理论素养','政策水平','业务能力','党性修为','国际视野','综合研判'],
           before:[72,68,70,75,66,64],after:[90,86,88,92,84,86]},
  teaTag:[{name:'部委级',value:58,color:C.blue},{name:'系统级',value:96,color:C.cyan},
          {name:'院级',value:120,color:C.green},{name:'高校聘请',value:52,color:C.purple}],
  teaLoad:[{name:'王教授',value:42},{name:'李教授',value:38},{name:'张研究员',value:35},
           {name:'刘主任',value:30},{name:'陈教授',value:27},{name:'赵专家',value:24}],
  roomRank:[{name:'报告厅',value:92,color:C.red},{name:'教室301',value:86,color:C.orange},
           {name:'研讨室201',value:78,color:C.orange},{name:'教室305',value:64,color:C.blue},
           {name:'教室208',value:52,color:C.teal},{name:'多媒体教室',value:41,color:C.teal}],
  roomHeat:{rows:['报告厅','教室301','教室305','研讨201','研讨203','多媒体'],
            cols:['08:30','10:15','14:00','15:45','19:00'],
            mat:[[95,80,90,60,30],[88,92,70,45,20],[60,75,85,55,10],[70,0,80,90,40],[50,65,0,72,25],[30,45,55,0,15]]}
};
const WARNINGS=[
  {lv:'red',t:'预算超支：2503班师资费超标准12%，已冻结提交',m:'预算管理 · 09:12',k:'budget'},
  {lv:'red',t:'应训尽训缺口：本季度3名厅局级干部未纳入计划',m:'教务组织 · 08:50',k:'gap'},
  {lv:'orange',t:'资源瓶颈：报告厅下周占用率达92%，建议分流',m:'教室管理 · 08:47',k:'room'},
  {lv:'orange',t:'培训质量：2501班课程满意度低于80%阈值',m:'教学评估 · 昨天',k:'quality'},
  {lv:'orange',t:'评估催收：2502班教学评估数据逾期未提交',m:'教学评估 · 昨天',k:'eval'},
  {lv:'red',t:'师资缺口：外事业务班高级别师资排期冲突',m:'师资库 · 昨天',k:'tea'}
];

/* ============================================================
 * 渲染各屏
 * ============================================================ */
function renderOverview(){
  lineArea($('chTrend'),MONTHS,[
    {name:'开班数',color:C.blue,data:DATA.trendOpen},
    {name:'参训人次',color:C.cyan,data:DATA.trendPpl,max:600}
  ],{max:600});
  donut($('chType'),DATA.type,{center:DATA.type.reduce((s,d)=>s+d.value,0),centerLabel:'班次总数'});
  rank($('rkRegion'),DATA.region);
  columns($('chOrg'),DATA.org.map(d=>d.name),DATA.org.map(d=>d.value),[C.blue,C.cyan,C.green,C.orange,C.purple]);
  rank($('rkSystem'),DATA.system);
}
function renderStudy(){
  donut($('chAttend'),DATA.attend,{center:'96%',centerLabel:'出勤率'});
  rank($('rkEval'),DATA.eval);
  const sc=DATA.score;
  columns($('chScore'),sc.labels,sc.data,[C.red,C.orange,C.blue,C.cyan,C.green]);
  lineArea($('chAbility'),DATA.ability.labels,[
    {name:'训前',color:C.cyan,data:DATA.ability.before,area:false},
    {name:'训后',color:C.green,data:DATA.ability.after}
  ],{max:100});
}
function renderResource(){
  donut($('chTeaTag'),DATA.teaTag,{center:DATA.teaTag.reduce((s,d)=>s+d.value,0),centerLabel:'师资总数'});
  const h=DATA.roomHeat; heat($('chRoom'),h.rows,h.cols,h.mat);
  rank($('rkTea'),DATA.teaLoad);
  rank($('rkRoom'),DATA.roomRank,'%');
  $('warnList').innerHTML=WARNINGS.map(w=>`
    <div class="warn-row lv-${w.lv}" onclick="drill('${w.k}','预警明细')">
      <span class="w-badge ${w.lv}">${w.lv==='red'?'紧急':'关注'}</span>
      <span class="w-t" title="${w.t}">${w.t}</span><span class="w-m">${w.m}</span>
    </div>`).join('');
}
function renderTicker(){
  const items=WARNINGS.map(w=>`<span class="tk-item" onclick="drill('${w.k}','预警明细')">
    <span class="tk-dot" style="background:${w.lv==='red'?C.red:C.orange}"></span>${w.t}<span style="color:var(--text-3)">${w.m}</span></span>`).join('');
  $('tkTrack').innerHTML=items+items;
}

/* ============================================================
 * 下钻明细（原型：弹层展示示意数据）
 * ============================================================ */
const DRILL={
  trend:{title:'培训规模趋势明细',cols:['月份','开班数','参训人次','学时'],rows:MONTHS.map((m,i)=>[m,DATA.trendOpen[i],DATA.trendPpl[i],DATA.trendPpl[i]*6.5|0])},
  type:{title:'班次类型分布明细',cols:['类型','班次数','占比'],rows:DATA.type.map(d=>[d.name,d.value,(d.value/58*100).toFixed(1)+'%'])},
  region:{title:'参训人次地域来源明细',cols:['来源','人次'],rows:DATA.region.map(d=>[d.name,d.value])},
  org:{title:'主办单位办班排行明细',cols:['主办单位','办班数'],rows:DATA.org.map(d=>[d.name,d.value])},
  system:{title:'课程体系覆盖明细',cols:['课程体系','关联课程数'],rows:DATA.system.map(d=>[d.name,d.value])},
  attend:{title:'考勤情况明细',cols:['状态','人次','占比'],rows:DATA.attend.map(d=>[d.name,d.value,(d.value/2636*100).toFixed(1)+'%'])},
  eval:{title:'课程满意度 / 教师评分明细',cols:['课程','评分'],rows:DATA.eval.map(d=>[d.name,d.value])},
  score:{title:'学员成绩分布明细',cols:['分数段','人数'],rows:DATA.score.labels.map((l,i)=>[l,DATA.score.data[i]])},
  ability:{title:'学员能力提升明细',cols:['能力维度','训前','训后','提升'],rows:DATA.ability.labels.map((l,i)=>[l,DATA.ability.before[i],DATA.ability.after[i],'+'+(DATA.ability.after[i]-DATA.ability.before[i])])},
  teaTag:{title:'师资分级分类结构明细',cols:['层级','人数'],rows:DATA.teaTag.map(d=>[d.name,d.value])},
  teaLoad:{title:'师资授课量明细',cols:['师资','授课课时'],rows:DATA.teaLoad.map(d=>[d.name,d.value])},
  roomRank:{title:'教室占用率明细',cols:['教室','占用率'],rows:DATA.roomRank.map(d=>[d.name,d.value+'%'])},
  roomHeat:{title:'教室资源使用热力明细',cols:['教室','时段','占用率'],rows:(()=>{const h=DATA.roomHeat,o=[];h.rows.forEach((r,ri)=>h.cols.forEach((c,ci)=>{if(h.mat[ri][ci]>=75)o.push([r,c,h.mat[ri][ci]+'%'])}));return o;})()},
  warn:{title:'预警信息汇总',cols:['级别','预警内容','时间'],rows:WARNINGS.map(w=>[w.lv==='red'?'紧急':'关注',w.t,w.m])},
  budget:{title:'预算超支预警明细',cols:['班次','科目','标准值','当前值','状态'],rows:[['2503班','师资费','≤500元/人天','560元/人天','超标12%']]},
  gap:{title:'应训尽训缺口明细',cols:['姓名','部门','职级','应训状态'],rows:[['张**','地区业务司','厅局级','未纳入'],['李**','外事管理司','处级','未纳入'],['王**','干部教育局','厅局级','未纳入']]},
  room:{title:'资源瓶颈预警明细',cols:['教室','下周占用率','建议'],rows:[['报告厅','92%','分流至教室301'],['研讨201','85%','错峰排课']]},
  quality:{title:'培训质量预警明细',cols:['班次','满意度','阈值','状态'],rows:[['2501班','78%','≥80%','低于阈值']]},
  eval:{title:'评估催收明细',cols:['班次','评估状态','截止'],rows:[['2502班','未提交','已逾期']]},
  tea:{title:'师资缺口预警明细',cols:['班次','需求','冲突'],rows:[['外事业务班','部委级×2','排期冲突']]}
};
function drill(key,name){
  const d=DRILL[key]||DRILL.rank||{title:(name||'明细')+' 下钻',cols:['项目','数值'],rows:[]};
  const title=(name&&name!==key)?d.title.replace('明细',('· '+name+' 明细')):d.title;
  $('dlgTitle').textContent=title;
  $('dlgBody').innerHTML=`<table><thead><tr>${d.cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead>
    <tbody>${d.rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')||'<tr><td colspan="9" style="color:var(--text-3)">暂无数据（原型示意）</td></tr>'}</tbody></table>
    <p class="tip">说明：本弹窗为原型下钻示意，正式系统中将联动对应业务模块（PRD 4.12 数据下钻）。</p>`;
  $('mask').classList.remove('hidden');
}
function closeDrill(){$('mask').classList.add('hidden')}
$('mask').addEventListener('click',e=>{if(e.target.id==='mask')closeDrill()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrill()});

/* ============================================================
 * 屏切换 / 轮播 / 全屏 / 时钟
 * ============================================================ */
const SCREENS=['overview','study','resource'];
let cur=0,carousel=true,timer=null;
function showScreen(idx){
  cur=(idx+SCREENS.length)%SCREENS.length;
  const key=SCREENS[cur];
  SCREENS.forEach(s=>{
    $('scr-'+s).classList.toggle('active',s===key);
  });
  document.querySelectorAll('.scr-tab').forEach(t=>t.classList.toggle('active',t.dataset.scr===key));
  document.querySelectorAll('.dot').forEach(d=>d.classList.toggle('on',d.dataset.scr===key));
  document.querySelectorAll('.screen.active .kpi .k-val').forEach(countUp);
}
function nextScreen(){showScreen(cur+1)}
function startCarousel(){stopCarousel();if(carousel)timer=setInterval(nextScreen,12000)}
function stopCarousel(){timer&&clearInterval(timer);timer=null}
function toggleCarousel(){
  carousel=!carousel;
  $('btnCarousel').classList.toggle('on',carousel);
  $('btnCarousel').textContent=carousel?'◉ 自动轮播':'○ 已停轮播';
  carousel?startCarousel():stopCarousel();
}
function toggleFull(){
  if(!document.fullscreenElement){(document.documentElement.requestFullscreen||function(){}).call(document.documentElement);}
  else{document.exitFullscreen&&document.exitFullscreen();}
}
$('scrTabs').addEventListener('click',e=>{
  const t=e.target.closest('.scr-tab');if(!t)return;
  showScreen(SCREENS.indexOf(t.dataset.scr));startCarousel();
});
$('dots').addEventListener('click',e=>{
  const d=e.target.closest('.dot');if(!d)return;
  showScreen(SCREENS.indexOf(d.dataset.scr));startCarousel();
});
/* 筛选（原型：重新触发渲染 + 提示） */
['segRange','selType','selOrg'].forEach(id=>{
  const el=$(id);
  el.addEventListener('click',e=>{
    if(id==='segRange'){const s=e.target.closest('span');if(!s)return;
      el.querySelectorAll('span').forEach(x=>x.classList.remove('on'));s.classList.add('on');}
  });
  el.addEventListener('change',()=>{});
});
document.querySelector('.scr-filter').addEventListener('click',e=>{
  if(e.target.closest('.sel')||e.target.closest('#segRange span')){
    setTimeout(()=>{renderAll();document.querySelectorAll('.screen.active .kpi .k-val').forEach(countUp);},60);
  }
});
function renderAll(){renderOverview();renderStudy();renderResource();}

/* 时钟 */
function tickClock(){
  const n=new Date(),p=x=>String(x).padStart(2,'0');
  const wk=['星期日','星期一','星期二','星期三','星期四','星期五','星期六'][n.getDay()];
  $('ckTime').textContent=`${p(n.getHours())}:${p(n.getMinutes())}:${p(n.getSeconds())}`;
  $('ckDate').textContent=`${n.getFullYear()}-${p(n.getMonth()+1)}-${p(n.getDate())} ${wk}`;
}

/* 键盘左右切屏 */
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'){showScreen(cur+1);startCarousel();}
  if(e.key==='ArrowLeft'){showScreen(cur-1);startCarousel();}
});

/* ============================================================
 * 初始化
 * ============================================================ */
renderAll();renderTicker();tickClock();setInterval(tickClock,1000);
/* 支持导航深链：screen.html?scr=scr-overview / scr-study / scr-resource */
(function(){
  const q=new URLSearchParams(location.search).get('scr')||'';
  const key=q.replace(/^scr-/,'');
  showScreen(SCREENS.indexOf(key)>=0?SCREENS.indexOf(key):0);
})();
startCarousel();
window.addEventListener('resize',()=>{renderAll();});
