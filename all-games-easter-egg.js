(()=>{
const root=document.querySelector("[data-mini-games]");if(!root)return;
const expected=new Set(["memory","catch","count","lantern","follow","forage"]);
const completedKey="moth-all-games-completed",shownKey="moth-all-games-secret-shown";
let completed=new Set(),shown=false;
try{
  const saved=JSON.parse(sessionStorage.getItem(completedKey)||"[]");
  if(Array.isArray(saved))saved.forEach(game=>{if(expected.has(game))completed.add(game)});
  shown=sessionStorage.getItem(shownKey)==="1";
}catch{}
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const spanish=document.documentElement.lang.toLowerCase().startsWith("es");
const style=document.createElement("style");
style.textContent='.all-games-secret{position:absolute;left:50%;top:50%;z-index:18;width:min(360px,82vw);pointer-events:none;text-align:center;opacity:0;transform:translate(-50%,-38%) scale(.92);filter:drop-shadow(0 16px 28px rgba(65,49,37,.16));animation:allGamesArrive 4.2s cubic-bezier(.2,.72,.24,1) forwards}.all-games-secret img{display:block;width:min(190px,48vw);height:auto;margin:0 auto -10px;user-select:none;-webkit-user-drag:none}.all-games-secret p{display:inline-block;margin:0;padding:10px 15px;border:1px solid rgba(111,88,62,.2);border-radius:16px;background:rgba(255,253,248,.96);color:#4d4035;font:600 15px/1.35 Georgia,"Times New Roman",serif;box-shadow:0 9px 24px rgba(65,49,37,.1)}html[data-theme="dark"] .all-games-secret p{background:rgba(43,37,32,.96);color:#f5e6c8;border-color:rgba(245,230,200,.18)}.all-games-secret-glow{position:absolute;inset:16% 8% 4%;z-index:-1;background:radial-gradient(circle,rgba(218,174,99,.24),transparent 68%);filter:blur(4px)}.all-games-secret-spark{position:absolute;width:5px;height:5px;border-radius:50%;background:#d5a75e;box-shadow:0 0 8px #e6bd78,0 0 18px rgba(213,167,94,.72);opacity:0;animation:allGamesSpark 1.7s ease-out forwards}.all-games-secret-spark:nth-of-type(2){left:17%;top:47%;animation-delay:.18s}.all-games-secret-spark:nth-of-type(3){right:16%;top:36%;animation-delay:.38s}.all-games-secret-spark:nth-of-type(4){left:29%;top:20%;animation-delay:.58s}@keyframes allGamesArrive{0%{opacity:0;transform:translate(-68%,-34%) scale(.82) rotate(-4deg)}18%{opacity:1}36%,76%{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(0)}100%{opacity:0;transform:translate(-35%,-57%) scale(.94) rotate(3deg)}}@keyframes allGamesSpark{0%{opacity:0;transform:translateY(12px) scale(.5)}35%{opacity:1}100%{opacity:0;transform:translateY(-38px) scale(1.15)}}@media(prefers-reduced-motion:reduce){.all-games-secret{animation:allGamesReduced 3.2s ease forwards}.all-games-secret-spark{display:none}@keyframes allGamesReduced{0%,100%{opacity:0;transform:translate(-50%,-50%) scale(1)}15%,78%{opacity:1;transform:translate(-50%,-50%) scale(1)}}}';
document.head.appendChild(style);
const reveal=()=>{
  if(shown)return;
  shown=true;
  try{sessionStorage.setItem(shownKey,"1")}catch{}
  const host=root.closest(".play")||root;
  if(getComputedStyle(host).position==="static")host.style.position="relative";
  const secret=document.createElement("div");
  secret.className="all-games-secret";
  secret.setAttribute("role","status");
  secret.setAttribute("aria-live","polite");
  secret.innerHTML='<span class="all-games-secret-glow" aria-hidden="true"></span><span class="all-games-secret-spark" aria-hidden="true"></span><span class="all-games-secret-spark" aria-hidden="true"></span><span class="all-games-secret-spark" aria-hidden="true"></span><img draggable="false" src="/assets/welcome-silk-moth-footer.webp?v=2" alt=""><p>'+(spanish?"okay, de verdad jugaste a todos.":"okay you really played all of them.")+"</p>";
  host.appendChild(secret);
  if(navigator.vibrate)try{navigator.vibrate([10,28,10])}catch{}
  const remove=()=>secret.remove();
  secret.addEventListener("animationend",event=>{if(event.target===secret)remove()},{once:true});
  setTimeout(remove,reduce?3500:4700);
};
root.addEventListener("moth:game-series-complete",event=>{
  const game=event.detail&&event.detail.game;
  if(shown||!expected.has(game))return;
  completed.add(game);
  try{sessionStorage.setItem(completedKey,JSON.stringify([...completed]))}catch{}
  if(completed.size===expected.size)reveal();
});
})();