/* 侧边栏滚动位置记忆：跨页跳转后保持导航区位置，当前高亮项始终可见 */
(function(){
  var sb=document.querySelector('.sidebar');
  if(!sb) return;
  var KEY='sbScroll';
  var t;
  sb.addEventListener('scroll',function(){
    clearTimeout(t);
    t=setTimeout(function(){ try{sessionStorage.setItem(KEY,String(sb.scrollTop));}catch(e){} },120);
  });
  var saved=0;
  try{ saved=parseInt(sessionStorage.getItem(KEY),10)||0; }catch(e){}
  sb.scrollTop=saved;
  var act=sb.querySelector('.nav-item.active');
  if(act){
    var top=act.offsetTop, bottom=top+act.offsetHeight;
    if(top<sb.scrollTop || bottom>sb.scrollTop+sb.clientHeight){
      sb.scrollTop=Math.max(0,top-sb.clientHeight/2+act.offsetHeight/2);
      try{sessionStorage.setItem(KEY,String(sb.scrollTop));}catch(e){}
    }
  }
})();
