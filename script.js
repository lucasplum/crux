/* ========== GLOBALS ========== */
var combatants=[],currentTurn=0,round=1;
var players=[];
var conditionPopupTarget=null;
var dmgPopupTarget=null;
var lastInitCount=0;
var focusFire=[];
var timers=[];
var timerInterval=null;
var selectedTargetForState=null;
var turnLog=[];
var selectedAvatar='🧙';
var selectedAvatarUrl='';

const $=id=>document.getElementById(id);
const AudioContext=window.AudioContext||window.webkitAudioContext;
let audioCtx=null;

const canvasState={size:{zoom:1,panX:0,panY:0},spell:{zoom:1,panX:0,panY:0}};

function isMobile(){return window.innerWidth<=768||'ontouchstart' in window;}
function isTouchDevice(){return 'ontouchstart' in window||navigator.maxTouchPoints>0;}
function optimizeCanvasForMobile(c){return isMobile()?Math.min(window.devicePixelRatio||1,1.5):Math.min(window.devicePixelRatio||1,2);}

/* ========== NAWIGACJA ========== */
function initNavigation(){
  const navButtons=document.querySelectorAll('.nav-btn,.bottom-nav-btn');
  const tabSections=document.querySelectorAll('.tab-section');
  navButtons.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const targetTab=btn.dataset.tab;
      document.querySelectorAll('.nav-btn,.bottom-nav-btn').forEach(b=>{
        if(b.dataset.tab===targetTab) b.classList.add('active'); else b.classList.remove('active');
      });
      tabSections.forEach(section=>{
        if(section.dataset.tab===targetTab) section.classList.add('active'); else section.classList.remove('active');
      });
      window.scrollTo({top:0,behavior:'smooth'});
      if(targetTab==='spells'){setTimeout(()=>{renderSizeCanvas();renderSpellCanvas();},100);}
    });
  });
}
function initInfoTabs(){
  const infoTabButtons=document.querySelectorAll('.info-tab-btn');
  const infoContents=document.querySelectorAll('.info-content');
  infoTabButtons.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const targetInfo=btn.dataset.info;
      infoTabButtons.forEach(b=>{if(b.dataset.info===targetInfo) b.classList.add('active'); else b.classList.remove('active');});
      infoContents.forEach(c=>{if(c.dataset.info===targetInfo) c.classList.add('active'); else c.classList.remove('active');});
    });
  });
}

/* ========== CANVAS ZOOM & PAN ========== */
function zoomCanvas(type,direction){
  const state=canvasState[type];
  state.zoom=direction>0?Math.min(3,state.zoom+0.25):Math.max(0.5,state.zoom-0.25);
  const zd=document.getElementById(`${type}ZoomLevel`);
  if(zd) zd.textContent=Math.round(state.zoom*100)+'%';
  if(type==='size') renderSizeCanvas(); else if(type==='spell') renderSpellCanvas();
}
function resetCanvas(type){
  const state=canvasState[type];
  state.zoom=1;state.panX=0;state.panY=0;
  const zd=document.getElementById(`${type}ZoomLevel`);
  if(zd) zd.textContent='100%';
  if(type==='size') renderSizeCanvas(); else if(type==='spell') renderSpellCanvas();
}
function initCanvasPanZoom(){
  ['size','spell'].forEach(type=>{
    const container=document.getElementById(`${type}CanvasContainer`);
    if(!container) return;
    const state=canvasState[type];
    let isDragging=false,lastX=0,lastY=0;
    container.addEventListener('mousedown',e=>{isDragging=true;lastX=e.clientX;lastY=e.clientY;container.style.cursor='grabbing';e.preventDefault();});
    document.addEventListener('mousemove',e=>{
      if(!isDragging) return;
      state.panX+=e.clientX-lastX;state.panY+=e.clientY-lastY;
      lastX=e.clientX;lastY=e.clientY;
      if(type==='size') renderSizeCanvas(); else if(type==='spell') renderSpellCanvas();
    });
    document.addEventListener('mouseup',()=>{if(isDragging){isDragging=false;container.style.cursor='grab';}});
    container.addEventListener('touchstart',e=>{if(e.touches.length===1){isDragging=true;lastX=e.touches[0].clientX;lastY=e.touches[0].clientY;}},{passive:true});
    container.addEventListener('touchmove',e=>{
      if(!isDragging||e.touches.length!==1) return;
      state.panX+=e.touches[0].clientX-lastX;state.panY+=e.touches[0].clientY-lastY;
      lastX=e.touches[0].clientX;lastY=e.touches[0].clientY;
      if(type==='size') renderSizeCanvas(); else if(type==='spell') renderSpellCanvas();
      e.preventDefault();
    },{passive:false});
    container.addEventListener('touchend',()=>{isDragging=false;});
    container.addEventListener('wheel',e=>{e.preventDefault();zoomCanvas(type,e.deltaY<0?1:-1);});
    container.addEventListener('dblclick',()=>resetCanvas(type));
  });
}

/* ========== AUDIO ========== */
function initAudio(){if(!audioCtx){try{audioCtx=new AudioContext();}catch(e){}}}
function playSound(type){
  try{
    initAudio();if(!audioCtx) return;
    const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
    osc.connect(gain);gain.connect(audioCtx.destination);
    const now=audioCtx.currentTime;
    switch(type){
      case 'hit':osc.frequency.setValueAtTime(600,now);osc.frequency.exponentialRampToValueAtTime(400,now+0.1);gain.gain.setValueAtTime(0.2,now);gain.gain.exponentialRampToValueAtTime(0.01,now+0.1);osc.start(now);osc.stop(now+0.1);break;
      case 'crit':osc.frequency.setValueAtTime(800,now);osc.frequency.exponentialRampToValueAtTime(1200,now+0.12);gain.gain.setValueAtTime(0.3,now);gain.gain.exponentialRampToValueAtTime(0.01,now+0.15);osc.start(now);osc.stop(now+0.15);break;
      case 'death':osc.type='sawtooth';osc.frequency.setValueAtTime(300,now);osc.frequency.exponentialRampToValueAtTime(50,now+0.5);gain.gain.setValueAtTime(0.35,now);gain.gain.exponentialRampToValueAtTime(0.01,now+0.5);osc.start(now);osc.stop(now+0.5);break;
      case 'turn':osc.frequency.setValueAtTime(500,now);osc.frequency.setValueAtTime(700,now+0.04);osc.frequency.setValueAtTime(900,now+0.08);gain.gain.setValueAtTime(0.15,now);gain.gain.exponentialRampToValueAtTime(0.01,now+0.12);osc.start(now);osc.stop(now+0.12);break;
      case 'add':osc.frequency.setValueAtTime(400,now);osc.frequency.exponentialRampToValueAtTime(600,now+0.06);gain.gain.setValueAtTime(0.15,now);gain.gain.exponentialRampToValueAtTime(0.01,now+0.08);osc.start(now);osc.stop(now+0.08);break;
      case 'dice':osc.frequency.setValueAtTime(300,now);osc.frequency.setValueAtTime(400,now+0.03);osc.frequency.setValueAtTime(500,now+0.06);osc.frequency.setValueAtTime(600,now+0.09);gain.gain.setValueAtTime(0.12,now);gain.gain.exponentialRampToValueAtTime(0.01,now+0.1);osc.start(now);osc.stop(now+0.1);break;
      case 'state':osc.frequency.setValueAtTime(500,now);osc.frequency.setValueAtTime(700,now+0.05);osc.frequency.setValueAtTime(600,now+0.1);gain.gain.setValueAtTime(0.1,now);gain.gain.exponentialRampToValueAtTime(0.01,now+0.12);osc.start(now);osc.stop(now+0.12);break;
    }
  }catch(e){}
}

/* ========== DICE ========== */
function rollDice(sides){return Math.floor(Math.random()*sides)+1;}
function openDice(){
  const existing=document.getElementById('dicePopup');if(existing) existing.remove();
  const popup=document.createElement('div');popup.className='popup-overlay';popup.id='dicePopup';
  popup.innerHTML=`<div class="popup-content dice-popup-content">
    <div class="popup-title">🎲 Rzut kośćmi</div>
    <div class="dice-result" id="diceResult">🎲</div>
    <div class="dice-desc" id="diceDesc">Wybierz kość lub wpisz własną</div>
    <div class="dice-btns">
      <button onclick="rollAndShow(4)">k4</button><button onclick="rollAndShow(6)">k6</button>
      <button onclick="rollAndShow(8)">k8</button><button onclick="rollAndShow(10)">k10</button>
      <button onclick="rollAndShow(12)">k12</button><button class="d20" onclick="rollAndShow(20)">k20</button>
      <button onclick="rollAndShow(100)">k100</button><button onclick="rollAdvantage()">⚡ Przew</button>
    </div>
    <div class="dice-custom"><input type="text" id="customDice" placeholder="np. 2d6"/><button onclick="rollCustom()">Rzuć</button></div>
    <button class="popup-close" onclick="closeDicePopup()">✕ Zamknij</button>
  </div>`;
  document.body.appendChild(popup);
}
function rollAndShow(sides){const r=rollDice(sides);$('diceResult').textContent=r;$('diceDesc').textContent=`🎲 k${sides} → ${r}`;playSound('dice');}
function rollAdvantage(){const r1=rollDice(20),r2=rollDice(20),b=Math.max(r1,r2);$('diceResult').textContent=b;$('diceDesc').textContent=`🎲 Przewaga: ${r1} + ${r2} → ${b}`;playSound('dice');}
function rollCustom(){
  const input=$('customDice').value.trim(),match=input.match(/^(\d+)d(\d+)$/i);
  if(match){const c=parseInt(match[1]),s=parseInt(match[2]);let t=0,r=[];for(let i=0;i<c;i++){const x=rollDice(s);r.push(x);t+=x;}$('diceResult').textContent=t;$('diceDesc').textContent=`🎲 ${input} → ${r.join(' + ')} = ${t}`;playSound('dice');}
  else $('diceDesc').textContent='❌ Użyj formatu: 2d6, 1d20 itp.';
}
function closeDicePopup(){const p=document.getElementById('dicePopup');if(p) p.remove();}

/* ========== TIMERS ========== */
function openTimers(){
  const existing=document.getElementById('timerPopup');if(existing) existing.remove();
  const popup=document.createElement('div');popup.className='popup-overlay';popup.id='timerPopup';
  popup.innerHTML=`<div class="popup-content timer-popup-content">
    <div class="popup-title">⏱️ Efekty czasowe</div>
    <div class="timer-list" id="timerList"></div>
    <div class="timer-add">
      <input id="timerName" placeholder="Nazwa efektu..."/>
      <select id="timerDuration">
        <option value="1">1 tura</option><option value="2">2 tury</option><option value="3">3 tury</option>
        <option value="5">5 tur</option><option value="10">10 tur</option><option value="999">∞</option>
      </select>
      <button onclick="addTimer()">+</button>
    </div>
    <button class="popup-close" onclick="closeTimerPopup()">✕ Zamknij</button>
  </div>`;
  document.body.appendChild(popup);updateTimerList();
}
function addTimer(){
  const name=$('timerName').value.trim(),duration=parseInt($('timerDuration').value);
  if(!name) return;
  timers.push({name,duration,remaining:duration,active:true});
  $('timerName').value='';updateTimerList();
  if(!timerInterval) timerInterval=setInterval(tickTimers,1000);
  playSound('add');
}
function tickTimers(){
  let changed=false;
  timers=timers.filter(t=>{if(t.active&&t.remaining>0&&t.remaining<999){t.remaining--;if(t.remaining<=0){changed=true;return false;}changed=true;}return t.active;});
  if(changed){updateTimerList();renderInit();}
}
function updateTimerList(){
  const container=document.getElementById('timerList');if(!container) return;
  container.innerHTML='';
  if(timers.length===0){container.innerHTML='<div style="color:var(--muted);font-size:.7rem;text-align:center;padding:6px;">Brak aktywnych efektów</div>';return;}
  timers.forEach((t,i)=>{
    const div=document.createElement('div');div.className='timer-item';
    const timeStr=t.remaining>=999?'∞':t.remaining+' tur';
    div.innerHTML=`<span class="timer-name">${t.name}</span><span class="timer-time">${timeStr}</span><span class="timer-remove" onclick="removeTimer(${i})">✕</span>`;
    container.appendChild(div);
  });
}
function removeTimer(i){timers.splice(i,1);updateTimerList();renderInit();}
function closeTimerPopup(){const p=document.getElementById('timerPopup');if(p) p.remove();}
function advanceTimers(){timers=timers.filter(t=>{if(t.active&&t.remaining>0&&t.remaining<999){t.remaining--;return t.remaining>0;}return t.active;});updateTimerList();}

/* ========== SCROLL REVEAL ========== */
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('visible');});},{threshold:.08});
document.querySelectorAll('.card').forEach(c=>observer.observe(c));

/* ========== CONVERTER ========== */
const feet=$('feet'),meters=$('meters'),hexes=$('hexes');
let lock=false;
[feet,meters,hexes].forEach(i=>i.addEventListener('focus',()=>{i.select();}));
feet.oninput=()=>{if(lock) return;lock=true;const ft=Number(feet.value||0);meters.value=(ft*0.3).toFixed(1);hexes.value=Math.round(ft/5);lock=false;};
meters.oninput=()=>{if(lock) return;lock=true;const m=Number(meters.value||0);feet.value=Math.round(m/0.3);hexes.value=Math.round(m/1.5);lock=false;};
hexes.oninput=()=>{if(lock) return;lock=true;const h=Number(hexes.value||0);feet.value=h*5;meters.value=(h*1.5).toFixed(1);lock=false;};

/* ========== DISTANCE ========== */
const base=[5,10,15,20,25,30,40,60,90,120,150,300];
let currentUnit='ft';
function renderDistances(){
  const grid=$('distanceGrid');grid.innerHTML='';
  base.forEach(ft=>{
    let text=ft+' ft';
    if(currentUnit==='m') text=(ft*0.3).toFixed(1)+' m';
    if(currentUnit==='hex') text=Math.round(ft/5)+' ⬡';
    const b=document.createElement('button');b.className='dist-btn';b.textContent=text;
    b.onclick=()=>{
      document.querySelectorAll('.dist-btn').forEach(x=>x.classList.remove('selected'));
      b.classList.add('selected');
      $('distanceResult').innerHTML=`<div class="unit"><div class="val">${ft}</div><div class="lbl">stóp</div></div><div class="sep"></div><div class="unit"><div class="val">${(ft*0.3).toFixed(1)}</div><div class="lbl">metrów</div></div><div class="sep"></div><div class="unit"><div class="val">${Math.round(ft/5)}</div><div class="lbl">hexów</div></div>`;
    };
    grid.appendChild(b);
  });
}
document.querySelectorAll('.tabs button').forEach(b=>{
  b.onclick=()=>{document.querySelector('.tabs .active').classList.remove('active');b.classList.add('active');currentUnit=b.dataset.unit;renderDistances();};
});
renderDistances();

/* ========== SIZE CANVAS ========== */
function ring(q0,r0,rad){const seen=new Set(),cells=[];for(let q=-rad;q<=rad;q++)for(let r=-rad;r<=rad;r++){if((Math.abs(q)+Math.abs(r)+Math.abs(q+r))/2<=rad){const k=q+','+r;if(!seen.has(k)){seen.add(k);cells.push([q,r]);}}}return cells;}
const SIZE_DATA={
  sm:{name:'Mały (Small)',hexes:[[0,0]],color:'#6bb8ff',hexCount:'1×1'},
  med:{name:'Średni (Medium)',hexes:[[0,0]],color:'#6bb8ff',hexCount:'1×1'},
  lg:{name:'Duży (Large)',hexes:ring(0,0,1),color:'#6bff9e',hexCount:'~7 hexów'},
  huge:{name:'Ogromny (Huge)',hexes:ring(0,0,2),color:'#d4a843',hexCount:'~19 hexów'},
  garg:{name:'Gargantuiczny (Gargantuan)',hexes:ring(0,0,3),color:'#ff6b6b',hexCount:'~37 hexów'},
  col:{name:'Kolosalny (Colossal)',hexes:ring(0,0,4),color:'#a87cff',hexCount:'~61 hexów'},
};
function hexCorners(cx,cy,r,flat=false){return Array.from({length:6},(_,i)=>{const a=(Math.PI/3)*i+(flat?0:Math.PI/6);return [cx+r*Math.cos(a),cy+r*Math.sin(a)];});}
function drawHexOnCtx(ctx,cx,cy,r,fill,stroke,flat=false){const pts=hexCorners(cx,cy,r,flat);ctx.beginPath();pts.forEach(([x,y],i)=>i===0?ctx.moveTo(x,y):ctx.lineTo(x,y));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.2;ctx.stroke();}}
const sizeCanvas=$('sizeCanvas'),sctx=sizeCanvas.getContext('2d');
let activeSize='sm';
function renderSizeCanvas(){
  const container=document.getElementById('sizeCanvasContainer');
  if(!container||container.offsetWidth===0) return;
  const dpr=optimizeCanvasForMobile(sizeCanvas),state=canvasState.size;
  const baseW=container.offsetWidth,baseH=Math.max(280,container.offsetHeight);
  sizeCanvas.width=Math.round(baseW*state.zoom*dpr);sizeCanvas.height=Math.round(baseH*state.zoom*dpr);
  sizeCanvas.style.width=baseW+'px';sizeCanvas.style.height=baseH+'px';
  sctx.setTransform(1,0,0,1,0,0);sctx.scale(dpr*state.zoom,dpr*state.zoom);
  const w=baseW,h=baseH;
  sctx.clearRect(-state.panX/state.zoom,-state.panY/state.zoom,w/state.zoom+100,h/state.zoom+100);
  const s=SIZE_DATA[activeSize],baseR=isMobile()?18:22,r=baseR,cells=s.hexes;
  const centerX=w/2+state.panX/state.zoom,centerY=h/2+state.panY/state.zoom;
  for(let q=-6;q<=6;q++)for(let rr=-5;rr<=5;rr++){const cx=centerX+r*1.732*(q+rr*0.5),cy=centerY+r*1.5*rr;if(cx<-r||cx>w+r||cy<-r||cy>h+r) continue;drawHexOnCtx(sctx,cx,cy,r-1,'#14093000','#2a1f4a33');}
  cells.forEach(([q,rr])=>{const cx=centerX+r*1.732*(q+rr*0.5),cy=centerY+r*1.5*rr;drawHexOnCtx(sctx,cx,cy,r-1,s.color+'44',s.color+'99');});
  sctx.beginPath();sctx.arc(centerX,centerY,5,0,Math.PI*2);sctx.fillStyle='#ff4444';sctx.fill();sctx.strokeStyle='#fff8';sctx.lineWidth=1.5;sctx.stroke();
}
document.querySelectorAll('.size-btn').forEach(b=>{
  b.onclick=()=>{document.querySelectorAll('.size-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeSize=b.dataset.size;const s=SIZE_DATA[activeSize];$('sizeInfo').textContent=`${s.hexCount} · ${s.name}`;renderSizeCanvas();};
});
$('sizeInfo').textContent='1×1 · Mały (Small)';

/* ========== SPELL LIBRARY ========== */
const SPELLS=[
  {name:'Kula Ognia',shape:'sphere',size:20,desc:'🔥 8k6, promień 20 ft',school:'Ewokacja',level:3},
  {name:'Kula Lodu',shape:'sphere',size:20,desc:'❄️ 8k6, promień 20 ft',school:'Ewokacja',level:3},
  {name:'Meteor',shape:'sphere',size:40,desc:'☄️ 20k6, promień 40 ft',school:'Ewokacja',level:9},
  {name:'Stożek Zimna',shape:'cone',size:60,desc:'❄️ 8k6, stożek 60 ft',school:'Ewokacja',level:5},
  {name:'Ognisty Oddech',shape:'cone',size:30,desc:'🔥 5k6, stożek 30 ft',school:'Ewokacja',level:2},
  {name:'Promień Światła',shape:'line',size:120,desc:'💫 10k6, linia 120 ft',school:'Ewokacja',level:6},
  {name:'Piorun',shape:'line',size:100,desc:'⚡ 8k6, linia 100 ft',school:'Ewokacja',level:3},
  {name:'Kula Śmierci',shape:'sphere',size:30,desc:'💀 12k6 nekrotycznych, promień 30 ft',school:'Nekromancja',level:6},
  {name:'Sześcian Ognia',shape:'cube',size:30,desc:'🔥 10k6, sześcian 30 ft',school:'Ewokacja',level:4},
  {name:'Błogosławieństwo',shape:'sphere',size:30,desc:'✨ Buff, promień 30 ft',school:'Oczarowanie',level:1},
  {name:'Mroczna Moc',shape:'sphere',size:20,desc:'🌑 Przywraca życie, promień 20 ft',school:'Nekromancja',level:3},
  {name:'Aura Życia',shape:'sphere',size:30,desc:'💚 Leczenie, promień 30 ft',school:'Oczarowanie',level:4},
  {name:'Bariera',shape:'sphere',size:10,desc:'🛡️ +2 KP, promień 10 ft',school:'Ochrona',level:1},
  {name:'Mroczna Chmura',shape:'sphere',size:30,desc:'☁️ Zasłona, promień 30 ft',school:'Czarowanie',level:2},
  {name:'Ściana Ognia',shape:'line',size:60,desc:'🔥 Ściana 60 ft',school:'Ewokacja',level:4},
  {name:'Krąg Ochrony',shape:'sphere',size:30,desc:'🔮 Antymagia, promień 30 ft',school:'Ochrona',level:6},
  {name:'Uścisk Ziemi',shape:'cube',size:20,desc:'🪨 Trzyma wrogów, sześcian 20 ft',school:'Przyzywanie',level:2},
  {name:'Mroczne Oczy',shape:'cone',size:30,desc:'👁️ Paraliż, stożek 30 ft',school:'Nekromancja',level:4},
  {name:'Tarcza Światła',shape:'sphere',size:15,desc:'✨ Oślepia, promień 15 ft',school:'Ewokacja',level:2},
];
let selectedSpell=null;
function renderSpellList(filter='',levelFilter='all',schoolFilter='all'){
  const container=$('spellList');container.innerHTML='';
  let filtered=SPELLS.filter(s=>s.name.toLowerCase().includes(filter.toLowerCase())||s.desc.toLowerCase().includes(filter.toLowerCase()));
  if(levelFilter!=='all') filtered=filtered.filter(s=>s.level===parseInt(levelFilter));
  if(schoolFilter!=='all') filtered=filtered.filter(s=>s.school===schoolFilter);
  if(filtered.length===0){container.innerHTML='<span style="font-size:.6rem;color:var(--muted);">Brak zaklęć</span>';return;}
  filtered.forEach(spell=>{
    const tag=document.createElement('span');tag.className='spell-tag'+(selectedSpell===spell?' selected':'');
    tag.textContent=`${spell.name} (Lvl ${spell.level})`;tag.title=`${spell.desc} | ${spell.school}`;
    tag.onclick=()=>{selectedSpell=spell;$('shape').value=spell.shape;$('spellSize').value=spell.size;renderSpellList($('spellSearch').value,$('spellLevel').value,$('spellSchool').value);renderSpellCanvas();playSound('add');};
    container.appendChild(tag);
  });
}
$('spellSearch').addEventListener('input',function(){renderSpellList(this.value,$('spellLevel').value,$('spellSchool').value);});
$('spellLevel').addEventListener('change',function(){renderSpellList($('spellSearch').value,this.value,$('spellSchool').value);});
$('spellSchool').addEventListener('change',function(){renderSpellList($('spellSearch').value,$('spellLevel').value,this.value);});
renderSpellList();

/* ========== SPELL CANVAS ========== */
const spellCanvas=$('spellCanvas'),pctx=spellCanvas.getContext('2d');
function renderSpellCanvas(){
  const container=document.getElementById('spellCanvasContainer');
  if(!container||container.offsetWidth===0) return;
  const dpr=optimizeCanvasForMobile(spellCanvas),state=canvasState.spell;
  const baseW=container.offsetWidth,baseH=Math.max(280,container.offsetHeight);
  spellCanvas.width=Math.round(baseW*state.zoom*dpr);spellCanvas.height=Math.round(baseH*state.zoom*dpr);
  spellCanvas.style.width=baseW+'px';spellCanvas.style.height=baseH+'px';
  pctx.setTransform(1,0,0,1,0,0);pctx.scale(dpr*state.zoom,dpr*state.zoom);
  const w=baseW,h=baseH;
  pctx.clearRect(-state.panX/state.zoom,-state.panY/state.zoom,w/state.zoom+100,h/state.zoom+100);
  const shape=$('shape').value,radiusHexes=Math.max(1,Math.round(Number($('spellSize').value)/5));
  const dirIndex=Number($('direction').value),cubeOrigin=$('cubeOrigin').value;
  const baseR=isMobile()?12:14,R=baseR,HexW=R*1.73205;
  const L=Math.min(radiusHexes*HexW,Math.min(w,h)/2-10);
  const O={x:w/2+state.panX/state.zoom,y:h/2+state.panY/state.zoom};
  const showDir=shape==='cone'||shape==='line'||shape==='cube';
  $('direction').parentElement.style.opacity=showDir?'1':'0.35';
  $('originRow').style.display=shape==='cube'?'block':'none';
  const angleDeg=dirIndex*30-90,rad=(angleDeg*Math.PI)/180;
  const F={x:Math.cos(rad),y:Math.sin(rad)},R_vec={x:Math.cos(rad+Math.PI/2),y:Math.sin(rad+Math.PI/2)};
  let path=new Path2D();
  if(shape==='sphere') path.arc(O.x,O.y,L,0,Math.PI*2);
  else if(shape==='cone'){const P1={x:O.x+L*Math.cos(rad-Math.PI/6),y:O.y+L*Math.sin(rad-Math.PI/6)},P2={x:O.x+L*Math.cos(rad+Math.PI/6),y:O.y+L*Math.sin(rad+Math.PI/6)};path.moveTo(O.x,O.y);path.lineTo(P1.x,P1.y);path.lineTo(P2.x,P2.y);path.closePath();}
  else if(shape==='line'){const halfW=Math.min(HexW/2,L/6),P1={x:O.x-R_vec.x*halfW,y:O.y-R_vec.y*halfW},P2={x:O.x+R_vec.x*halfW,y:O.y+R_vec.y*halfW},P3={x:P2.x+F.x*L,y:P2.y+F.y*L},P4={x:P1.x+F.x*L,y:P1.y+F.y*L};path.moveTo(P1.x,P1.y);path.lineTo(P2.x,P2.y);path.lineTo(P3.x,P3.y);path.lineTo(P4.x,P4.y);path.closePath();}
  else if(shape==='cube'){const cubeSize=Math.min(L,Math.min(w,h)/2-10);let startO={x:O.x,y:O.y};if(cubeOrigin==='center') startO={x:O.x-(F.x*cubeSize/2)-(R_vec.x*cubeSize/2),y:O.y-(F.y*cubeSize/2)-(R_vec.y*cubeSize/2)};else if(cubeOrigin==='edge') startO={x:O.x-(R_vec.x*cubeSize/2),y:O.y-(R_vec.y*cubeSize/2)};else if(cubeOrigin==='corner_l') startO={x:O.x,y:O.y};else if(cubeOrigin==='corner_r') startO={x:O.x-(R_vec.x*cubeSize),y:O.y-(R_vec.y*cubeSize)};const P2={x:startO.x+R_vec.x*cubeSize,y:startO.y+R_vec.y*cubeSize},P3={x:startO.x+R_vec.x*cubeSize+F.x*cubeSize,y:startO.y+R_vec.y*cubeSize+F.y*cubeSize},P4={x:startO.x+F.x*cubeSize,y:startO.y+F.y*cubeSize};path.moveTo(startO.x,startO.y);path.lineTo(P2.x,P2.y);path.lineTo(P3.x,P3.y);path.lineTo(P4.x,P4.y);path.closePath();}
  let count=0;const hexR=Math.min(R,L/4);
  for(let q=-12;q<=12;q++)for(let rr=-12;rr<=12;rr++){
    const cx=O.x+HexW*(q+rr*0.5),cy=O.y+1.5*R*rr;
    if(cx<-hexR||cx>w+hexR||cy<-hexR||cy>h+hexR) continue;
    let active=false;
    pctx.save();pctx.setTransform(dpr*state.zoom,0,0,dpr*state.zoom,0,0);
    if(q!==0||rr!==0) active=pctx.isPointInPath(path,cx,cy);
    else if(shape==='sphere'||(shape==='cube'&&cubeOrigin==='center')) active=pctx.isPointInPath(path,cx,cy);
    pctx.restore();
    if(active) count++;
    drawHexOnCtx(pctx,cx,cy,hexR-1,active?'#a87cff66':'#14093000',active?'#c4a8ff99':'#2a1f4a33');
  }
  pctx.lineWidth=1.5;pctx.strokeStyle='#6bff9ecc';pctx.setLineDash([5,3]);pctx.stroke(path);pctx.setLineDash([]);
  pctx.beginPath();pctx.arc(O.x,O.y,hexR*0.55,0,Math.PI*2);pctx.fillStyle='#444a55';pctx.fill();pctx.strokeStyle='#8090aa';pctx.lineWidth=1.5;pctx.stroke();
  pctx.beginPath();pctx.arc(O.x,O.y,3,0,Math.PI*2);pctx.fillStyle='#aab';pctx.fill();
  if($('showCount').checked){pctx.fillStyle='#c4a8ffcc';pctx.font='bold 10px Inter,sans-serif';pctx.textAlign='center';pctx.fillText(`${count} hexów`,O.x,h-8+state.panY/state.zoom);}
}
['shape','spellSize','direction','cubeOrigin'].forEach(id=>{$(id).addEventListener('change',renderSpellCanvas);});
$('showCount').addEventListener('change',renderSpellCanvas);

/* ========== STANY ========== */
function getStateEmoji(state){const m={'Blinded':'👁️','Charmed':'💗','Deafened':'🔇','Frightened':'😨','Grappled':'🤝','Incapacitated':'💫','Invisible':'👻','Paralyzed':'🧊','Petrified':'🪨','Poisoned':'☠️','Prone':'⬇️','Restrained':'⛓️','Stunned':'💥','Unconscious':'💀','Exhaustion':'🥱'};return m[state]||'⚡';}
const STATE_DESCRIPTIONS={
  'Blinded':'<strong>👁️ Oślepiony</strong><br/>Nie widzi. Ataki przeciwko niemu mają przewagę, jego ataki mają utrudnienie. Automatycznie oblewa testy wymagające wzroku.',
  'Charmed':'<strong>💗 Zauroczony</strong><br/>Nie może atakować źródła uroku. Źródło ma przewagę w testach towarzyskich.',
  'Deafened':'<strong>🔇 Ogłuszony</strong><br/>Nie słyszy. Automatycznie oblewa testy wymagające słuchu.',
  'Frightened':'<strong>😨 Przerażony</strong><br/>Utrudnienie na ataki i testy, gdy widzi źródło strachu. Nie może się do niego zbliżyć.',
  'Grappled':'<strong>🤝 Pochwycony</strong><br/>Prędkość spada do 0. Może użyć akcji aby się uwolnić.',
  'Incapacitated':'<strong>💫 Obezwładniony</strong><br/>Nie może podejmować akcji ani reakcji. Nie może koncentrować się na czarach.',
  'Invisible':'<strong>👻 Niewidzialny</strong><br/>Traktowany jako mocno zasłonięty. Ataki na niego z utrudnieniem, jego z przewagą.',
  'Paralyzed':'<strong>🧊 Sparaliżowany</strong><br/>Obezwładniony. Trafienie z 5 ft to krytyk. Automatycznie oblewa rzuty obronne na Siłę i Zręczność.',
  'Petrified':'<strong>🪨 Spetryfikowany</strong><br/>Odporny na obrażenia. Niewrażliwy na trucizny. Zamieniony w kamień.',
  'Poisoned':'<strong>☠️ Zatruty</strong><br/>Utrudnienie na testy ataków i rzuty obronne.',
  'Prone':'<strong>⬇️ Leżący</strong><br/>Ataki w zwarciu z przewagą, na dystans z utrudnieniem.',
  'Restrained':'<strong>⛓️ Skrępowany</strong><br/>Prędkość 0. Ataki na cel z przewagą. Utrudnienie na własne ataki.',
  'Stunned':'<strong>💥 Oszołomiony</strong><br/>Obezwładniony. Oblewa rzuty na Siłę i Zręczność. Nie może mówić.',
  'Unconscious':'<strong>💀 Nieprzytomny</strong><br/>Obezwładniony. Trafienie w zwarciu to krytyk. Upuszcza wszystko.',
  'Exhaustion':'<strong>🥱 Wyczerpanie</strong><br/>Skala 1-6: 1-utrudnienie testów; 2-prędkość połowa; 3-utrudnienie ataków; 4-HP max połowa; 5-prędkość 0; 6-śmierć.'
};

/* === NEW: Render listy stanów w Info === */
function renderStatesInfoList(){
  const container=document.getElementById('statesInfoList');
  if(!container) return;
  container.innerHTML='';
  const order=['Blinded','Charmed','Deafened','Frightened','Grappled','Incapacitated','Invisible','Paralyzed','Petrified','Poisoned','Prone','Restrained','Stunned','Unconscious','Exhaustion'];
  order.forEach(state=>{
    const item=document.createElement('div');item.className='info-item';
    item.innerHTML=`<div class="info-item-header"><span class="info-icon">${getStateEmoji(state)}</span><span class="info-title">${state}</span></div><div class="info-desc">${STATE_DESCRIPTIONS[state]||''}</div>`;
    container.appendChild(item);
  });
}

/* ========== TARGET SELECTION + APLIKACJA STANÓW ========== */
function selectTargetForState(type,index){
  selectedTargetForState={type,index};
  let name='';
  if(type==='player'&&players[index]) name=players[index].name;
  else if(type==='init'&&combatants[index]) name=combatants[index].name;
  const display=document.getElementById('selectedTargetDisplay');
  if(name){display.textContent='🎯 Wybrany cel: '+name;display.style.display='block';}
  else{display.textContent='';display.style.display='none';}
}
function toggleStateOnTarget(state){
  if(!selectedTargetForState){alert('Najpierw kliknij postać aby ją wybrać');return;}
  const {type,index}=selectedTargetForState;
  let target=null;
  if(type==='player'&&players[index]) target=players[index];
  else if(type==='init'&&combatants[index]) target=combatants[index];
  if(!target) return;
  if(!target.conditions.includes(state)){
    target.conditions.push(state);
    addTurnLog(target.name,'👤 '+getStateEmoji(state)+' '+state);
  } else {
    target.conditions=target.conditions.filter(c=>c!==state);
  }
  if(type==='player') renderPlayers(); else renderInit();
  playSound('state');
}
function clearStatesOnTarget(){
  if(!selectedTargetForState){alert('Najpierw kliknij postać aby ją wybrać');return;}
  const {type,index}=selectedTargetForState;
  if(type==='player'&&players[index]){players[index].conditions=[];renderPlayers();}
  else if(type==='init'&&combatants[index]){combatants[index].conditions=[];renderInit();}
  playSound('add');
}

/* ========== TURN LOG ========== */
function addTurnLog(name,action){turnLog.push({name,action,turn:round});if(turnLog.length>20) turnLog.shift();updateFocusFire();}
function getTurnLogDisplay(){return turnLog.slice(-5).map(e=>`<div class="ff-target"><span class="ff-name">${e.name}</span><span class="ff-status">${e.action}</span></div>`).join('');}

/* === NEW: MODAL DODAWANIA POSTACI === */
function openAddPlayerModal(){
  selectedAvatar='🧙';selectedAvatarUrl='';
  $('pName').value='';$('pHp').value='';$('pAc').value='';$('pRole').value='Gracz';$('avatarUrl').value='';
  updateAvatarPreview();
  document.querySelectorAll('.avatar-btn').forEach(b=>b.classList.toggle('active',b.dataset.avatar==='🧙'));
  $('addPlayerPopup').style.display='flex';
  setTimeout(()=>$('pName').focus(),100);
}
function closeAddPlayerModal(){$('addPlayerPopup').style.display='none';}
function updateAvatarPreview(){
  const preview=$('avatarPreview');
  if(selectedAvatarUrl){preview.innerHTML=`<img src="${selectedAvatarUrl}" onerror="this.parentNode.textContent='🧙'">`;}
  else{preview.textContent=selectedAvatar;}
}
function confirmAddPlayer(){
  const name=$('pName').value.trim(),hp=parseInt($('pHp').value)||0,ac=parseInt($('pAc').value)||0,role=$('pRole').value;
  if(!name){alert('Podaj imię postaci');return;}
  players.push({
    name,hp,maxHp:hp,ac,role,
    conditions:[],
    deathSaves:{passes:0,fails:0},
    avatar:selectedAvatarUrl||selectedAvatar
  });
  closeAddPlayerModal();renderPlayers();playSound('add');
}
// Inicjalizacja pickera avatara
function initAvatarPicker(){
  document.querySelectorAll('.avatar-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.avatar-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      selectedAvatar=btn.dataset.avatar;
      selectedAvatarUrl='';
      $('avatarUrl').value='';
      updateAvatarPreview();
    });
  });
  $('avatarUrl').addEventListener('input',function(){
    const url=this.value.trim();
    if(url){selectedAvatarUrl=url;selectedAvatar='';document.querySelectorAll('.avatar-btn').forEach(b=>b.classList.remove('active'));}
    else{selectedAvatarUrl='';selectedAvatar='🧙';}
    updateAvatarPreview();
  });
}

/* ========== PLAYER TRACKER ========== */
function removePlayer(index){if(confirm(`Usunąć ${players[index].name}?`)){players.splice(index,1);renderPlayers();}}
function showPlayerDmg(index){dmgPopupTarget={type:'player',index};showDamagePopup(players[index].name);}
function addPlayerToInitiative(index){
  const p=players[index];if(!p) return;
  const initVal=prompt('Inicjatywa dla '+p.name+':')||'0';
  combatants.push({name:p.name,init:parseInt(initVal)||0,hp:p.hp,maxHp:p.maxHp,ac:p.ac,conditions:[...p.conditions],roundDamage:0});
  sortInit();playSound('add');
}
function getRoleBadge(role){const m={'Gracz':'gracz','Companion':'companion','Wróg':'wrog','NPC':'npc'};return 'p-role-badge '+(m[role]||'npc');}

/* === NEW: SZYBKIE STANY na karcie === */
const QUICK_STATES=[
  {id:'Stunned',icon:'💥',lbl:'Oszołom'},
  {id:'Prone',icon:'⬇️',lbl:'Powal'},
  {id:'Poisoned',icon:'☠️',lbl:'Zatruj'},
  {id:'Blinded',icon:'👁️',lbl:'Oślep'},
];

function renderPlayers(){
  const container=$('playerTracker');container.innerHTML='';
  if(players.length===0){container.innerHTML='<div style="color:var(--muted);font-size:.7rem;text-align:center;padding:12px;">👥 Brak postaci – kliknij „Dodaj postać"</div>';return;}
  players.forEach((p,i)=>{
    const div=document.createElement('div');div.className='player-card';div.dataset.role=p.role;
    div.onclick=()=>selectTargetForState('player',i);
    const hpPct=p.maxHp>0?Math.round((p.hp/p.maxHp)*100):0;
    const hpColor=hpPct<25?'var(--red)':hpPct<50?'var(--gold)':'var(--green)';
    const condTags=p.conditions.map(c=>`<span class="tag">${getStateEmoji(c)} ${c}</span>`).join('');
    const ds=p.deathSaves||{passes:0,fails:0};
    const avatarHtml=p.avatar&&p.avatar.startsWith('http')?`<img src="${p.avatar}" onerror="this.parentNode.textContent='🧙'">`:p.avatar||'🧙';

    // Szybkie stany
    const quickStatesHtml=QUICK_STATES.map(qs=>{
      const active=p.conditions.includes(qs.id)?'active':'';
      return `<button class="qs-btn ${active}" onclick="event.stopPropagation();selectedTargetForState={type:'player',index:${i}};toggleStateOnTarget('${qs.id}')" title="${qs.id}"><span class="qs-icon">${qs.icon}</span><span class="qs-lbl">${qs.lbl}</span></button>`;
    }).join('')+`<button class="qs-btn danger" onclick="event.stopPropagation();selectedTargetForState={type:'player',index:${i}};clearStatesOnTarget()" title="Wyczyść stany"><span class="qs-icon">✕</span><span class="qs-lbl">Wyczyść</span></button>`;

    div.innerHTML=`
      <div class="p-header">
        <div class="p-avatar">${avatarHtml}</div>
        <div class="p-main">
          <div class="p-name">${p.name}<span class="${getRoleBadge(p.role)}">${p.role}</span>${p.hp<=0?'💀':''}</div>
          ${p.ac>0?`<span style="font-size:.6rem;color:var(--blue);padding:2px 8px;border:1px solid rgba(107,184,255,0.2);border-radius:6px;">🛡${p.ac}</span>`:''}
        </div>
      </div>
      <div class="p-hp-wrap">
        <div class="p-hp-bar"><div class="p-hp-fill" style="width:${hpPct}%;background:${hpColor};"></div></div>
        <div class="p-hp-text" style="color:${hpColor}">${p.hp}/${p.maxHp}</div>
      </div>
      ${p.hp<=0?`<div style="font-size:.5rem;color:var(--muted);margin:2px 0;">🪦 Death Saves: ✅${ds.passes} ❌${ds.fails}</div>`:''}
      <div class="p-stats">
        <span>❤️${p.hp}</span>
        ${p.ac>0?`<span>🛡${p.ac}</span>`:''}
        ${p.conditions.length>0?`<span>⚡${p.conditions.length}</span>`:''}
      </div>
      <div class="p-cond">${condTags}</div>
      <div class="p-quick-states">${quickStatesHtml}</div>
      <div class="p-controls">
        <button onclick="event.stopPropagation();showPlayerDmg(${i})">⚔️ Obrażenia</button>
        <button onclick="event.stopPropagation();addPlayerToInitiative(${i})">⚡ Do potyczki</button>
        ${p.hp<=0?`<button class="success" onclick="event.stopPropagation();deathSave(${i})">💀 Death Save</button>`:''}
        <button class="danger" onclick="event.stopPropagation();removePlayer(${i})">✕</button>
      </div>
    `;
    container.appendChild(div);
  });
}
function deathSave(index){
  const p=players[index];if(!p) return;
  const roll=rollDice(20);
  if(roll===1){p.deathSaves.fails+=2;playSound('death');}
  else if(roll===20){p.hp=1;p.deathSaves.passes=0;p.deathSaves.fails=0;playSound('crit');renderPlayers();return;}
  else if(roll>=10) p.deathSaves.passes++;
  else p.deathSaves.fails++;
  if(p.deathSaves.fails>=3){playSound('death');if(confirm(`💀 ${p.name} umiera! Usunąć?`)){players.splice(index,1);renderPlayers();return;}}
  if(p.deathSaves.passes>=3){p.hp=1;p.deathSaves.passes=0;p.deathSaves.fails=0;playSound('add');}
  renderPlayers();
}

/* ========== DMG POPUP ========== */
function showDamagePopup(targetName){
  const existing=document.getElementById('dmgPopup');if(existing) existing.remove();
  const popup=document.createElement('div');popup.className='popup-overlay';popup.id='dmgPopup';
  popup.innerHTML=`<div class="popup-content dmg-popup-content">
    <div class="popup-title">⚔️ ${targetName}</div>
    <div class="dmg-sub">Wprowadź obrażenia lub rzuć kością</div>
    <div class="dmg-input-row"><input type="number" id="dmgAmount" placeholder="0" value="" step="1"/></div>
    <div class="dmg-btns">
      <button onclick="rollDmg(4)">🎲 k4</button><button onclick="rollDmg(6)">🎲 k6</button>
      <button onclick="rollDmg(8)">🎲 k8</button><button onclick="rollDmg(10)">🎲 k10</button>
      <button onclick="rollDmg(12)">🎲 k12</button><button class="crit" onclick="rollDmg(20)">💀 k20</button>
    </div>
    <div class="dmg-check"><input type="checkbox" id="dmgCrit"/><label for="dmgCrit">💀 Krytyk (x2)</label></div>
    <div class="dmg-actions">
      <button class="btn-dmg" onclick="applyDamage()">⚔️ Zadaj</button>
      <button class="btn-cancel" onclick="closeDmgPopup()">Anuluj</button>
    </div>
  </div>`;
  document.body.appendChild(popup);
  if(isMobile()){popup.querySelectorAll('input').forEach(i=>{i.setAttribute('inputmode','numeric');i.setAttribute('pattern','[0-9]*');});}
  const input=document.getElementById('dmgAmount');input.focus();setTimeout(()=>input.select(),100);
}
function rollDmg(sides){$('dmgAmount').value=rollDice(sides);playSound('dice');}
function applyDamage(){
  const amount=parseInt($('dmgAmount').value)||0,crit=$('dmgCrit').checked,finalDmg=crit?amount*2:amount;
  if(dmgPopupTarget){
    const {type,index}=dmgPopupTarget;
    if(type==='player'&&players[index]){
      players[index].hp=Math.max(0,players[index].hp-finalDmg);
      const name=players[index].name;
      const existing=focusFire.find(f=>f.name===name);
      if(existing) existing.dmg+=finalDmg; else focusFire.push({name,dmg:finalDmg,status:'⚔️ '+finalDmg+' dmg'});
      addTurnLog(name,'⚔️ '+finalDmg+' obrażeń');
      if(players[index].hp<=0){playSound('death');addTurnLog(name,'💀 ŚMIERĆ!');setTimeout(()=>{renderPlayers();updateFocusFire();},200);}
      else{playSound(finalDmg>10?'crit':'hit');renderPlayers();updateFocusFire();}
    } else if(type==='init'&&combatants[index]){
      combatants[index].hp=Math.max(0,combatants[index].hp-finalDmg);
      combatants[index].roundDamage=(combatants[index].roundDamage||0)+finalDmg;
      const name=combatants[index].name;
      const existing=focusFire.find(f=>f.name===name);
      if(existing) existing.dmg+=finalDmg; else focusFire.push({name,dmg:finalDmg,status:'⚔️ '+finalDmg+' dmg'});
      addTurnLog(name,'⚔️ '+finalDmg+' obrażeń');
      if(combatants[index].hp<=0){playSound('death');addTurnLog(name,'💀 ŚMIERĆ!');setTimeout(()=>{if(confirm(`💀 ${combatants[index].name} zabity! Usunąć?`)) triggerDeath(index); else{renderInit();updateFocusFire();}},200);}
      else{playSound(finalDmg>10?'crit':'hit');renderInit();updateFocusFire();}
    }
  }
  closeDmgPopup();
}
function closeDmgPopup(){const p=document.getElementById('dmgPopup');if(p) p.remove();dmgPopupTarget=null;}

/* ========== PRZEBIEG RUNDY ========== */
function updateFocusFire(){
  const container=document.getElementById('focusFireList');container.innerHTML='';
  const logHtml=getTurnLogDisplay();
  container.innerHTML=logHtml||'<div style="color:var(--muted);font-size:.6rem;text-align:center;padding:3px;">Brak akcji w tej rundzie</div>';
}
function resetFocusFire(){focusFire=[];turnLog=[];updateFocusFire();}

/* ========== DEATH ANIM ========== */
function triggerDeath(index){
  const entries=document.querySelectorAll('.init-entry');
  if(entries[index]){
    entries[index].classList.add('death');
    const flash=document.createElement('div');flash.style.cssText='position:fixed;inset:0;background:rgba(255,107,107,.2);z-index:999;pointer-events:none;animation:fadeOut .7s ease forwards;';
    document.body.appendChild(flash);setTimeout(()=>flash.remove(),700);
    setTimeout(()=>{combatants.splice(index,1);if(currentTurn>=combatants.length) currentTurn=0;lastInitCount=-1;renderInit();},700);
  } else {combatants.splice(index,1);if(currentTurn>=combatants.length) currentTurn=0;lastInitCount=-1;renderInit();}
}

/* ========== POTYCZKA ========== */
function addCombatant(){
  const name=$('initName').value.trim(),init=Number($('initVal').value),hp=Number($('initHp').value)||'—',ac=Number($('initAc').value)||'—';
  if(!name) return;
  combatants.push({name,init,hp,ac,maxHp:typeof hp==='number'?hp:null,conditions:[],roundDamage:0});
  sortInit();$('initName').value='';$('initVal').value='';$('initHp').value='';$('initAc').value='';playSound('add');
}
function addFromParty(){
  if(players.length===0){alert('Dodaj najpierw postacie do "Postaci"!');return;}
  const names=players.map((p,i)=>(i+1)+'. '+p.name+' ('+p.role+')').join('\n');
  const choice=prompt('Którą postać dodać?\n'+names+'\n\nWpisz numer lub nazwę:');if(!choice) return;
  let player=null;const num=parseInt(choice);
  if(!isNaN(num)&&num>0&&num<=players.length) player=players[num-1];
  else player=players.find(p=>p.name.toLowerCase()===choice.toLowerCase());
  if(!player){alert('Nie znaleziono');return;}
  const initVal=prompt('Inicjatywa dla '+player.name+':')||'0';
  combatants.push({name:player.name,init:parseInt(initVal)||0,hp:player.hp,maxHp:player.maxHp,ac:player.ac,conditions:[...player.conditions],roundDamage:0});
  sortInit();playSound('add');
}
function sortInit(){combatants.sort((a,b)=>b.init-a.init);currentTurn=0;round=1;renderInit();}
function nextTurn(){
  if(combatants.length===0) return;
  combatants.forEach(c=>c.roundDamage=0);
  currentTurn=(currentTurn+1)%combatants.length;
  if(currentTurn===0){round++;advanceTimers();focusFire=[];turnLog=[];}
  playSound('turn');renderInit();updateFocusFire();
}
function resetInit(){combatants=[];currentTurn=0;round=1;focusFire=[];turnLog=[];renderInit();updateFocusFire();}
function showInitCondPopup(index){
  conditionPopupTarget={type:'init',index};
  showCondPopup(combatants[index].name,combatants[index].conditions,(cond)=>{
    const idx=combatants[index].conditions.indexOf(cond);
    if(idx>-1) combatants[index].conditions.splice(idx,1);
    else{combatants[index].conditions.push(cond);addTurnLog(combatants[index].name,'👤 '+getStateEmoji(cond)+' '+cond);}
    renderInit();
    const popup=document.getElementById('condPopup');if(popup) updateCondPopup(popup,combatants[index].conditions);
  });
}
function showInitDmg(index){dmgPopupTarget={type:'init',index};showDamagePopup(combatants[index].name);}
function scrollToCurrentTurn(){
  if(isMobile()){const c=document.querySelector('.init-entry.current');if(c) setTimeout(()=>c.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'}),150);}
}
function renderInit(){
  const list=$('initList');
  if(lastInitCount===combatants.length&&list.children.length===combatants.length&&combatants.length>0){
    const entries=list.querySelectorAll('.init-entry');
    combatants.forEach((c,i)=>{
      if(entries[i]){
        entries[i].className='init-entry'+(i===currentTurn?' current':'');
        const nameDiv=entries[i].querySelector('.init-name');
        if(nameDiv){
          const textNode=nameDiv.childNodes[0];
          if(textNode) textNode.textContent=(i===currentTurn?'▶ ':'')+' '+c.name+' ';
          nameDiv.querySelectorAll('.cond-tag').forEach(el=>el.remove());
          const frag=document.createDocumentFragment();
          if(c.conditions&&c.conditions.length>0) c.conditions.forEach(cond=>{const tag=document.createElement('span');tag.className='cond-tag';tag.textContent=getStateEmoji(cond)+' '+cond;frag.appendChild(tag);});
          const existingBtns=nameDiv.querySelectorAll('.init-cond-btn');
          if(existingBtns.length===0){
            const newBtn=document.createElement('button');newBtn.className=`init-cond-btn ${c.conditions&&c.conditions.length>0?'has-cond':''}`;newBtn.innerHTML=c.conditions&&c.conditions.length>0?'🔄':'⚙️';newBtn.onclick=e=>{e.stopPropagation();showInitCondPopup(i);};newBtn.title='Zarządzaj stanami';frag.appendChild(newBtn);
            const dmgBtn=document.createElement('button');dmgBtn.className='init-cond-btn';dmgBtn.innerHTML='⚔️';dmgBtn.onclick=e=>{e.stopPropagation();showInitDmg(i);};dmgBtn.title='Zadaj obrażenia';dmgBtn.style.marginLeft='2px';frag.appendChild(dmgBtn);
          }
          nameDiv.appendChild(frag);
        }
        const hpDiv=entries[i].querySelector('.init-hp');
        if(hpDiv&&typeof c.hp==='number'){hpDiv.textContent=`${c.hp}/${c.maxHp} HP`;hpDiv.className=`init-hp ${c.hp/c.maxHp<.33?'low':''}`;}
        const dmgCounter=entries[i].querySelector('.init-dmg-counter');
        if(dmgCounter){if(c.roundDamage>0){dmgCounter.textContent=`⚔️${c.roundDamage}`;dmgCounter.style.display='';}else dmgCounter.style.display='none';}
      }
    });
    $('roundBadge').textContent=combatants.length>0?`— Runda ${round} —`:'';
    scrollToCurrentTurn();return;
  }
  lastInitCount=combatants.length;list.innerHTML='';
  if(combatants.length===0){$('roundBadge').textContent='';$('turnBtns').style.display='none';updateFocusFire();return;}
  $('roundBadge').textContent=`— Runda ${round} —`;$('turnBtns').style.display='flex';
  combatants.forEach((c,i)=>{
    const div=document.createElement('div');div.className='init-entry'+(i===currentTurn?' current':'');
    div.onclick=()=>selectTargetForState('init',i);
    if(i===combatants.length-1) div.classList.add('slide-in');
    const hpText=typeof c.hp==='number'?`${c.hp}/${c.maxHp} HP`:'? HP';
    const hpClass=typeof c.hp==='number'&&c.maxHp&&c.hp/c.maxHp<.33?' low':'';
    let condTags='';
    if(c.conditions&&c.conditions.length>0) condTags=c.conditions.map(cond=>`<span class="cond-tag">${getStateEmoji(cond)} ${cond}</span>`).join('');
    const dmgCounter=c.roundDamage>0?`<span class="init-dmg-counter">⚔️${c.roundDamage}</span>`:'';
    div.innerHTML=`
      <div class="init-badge">${c.init}</div>
      <div class="init-name">
        ${i===currentTurn?'▶ ':''} ${c.name}
        ${condTags}${dmgCounter}
        <button class="init-cond-btn ${c.conditions&&c.conditions.length>0?'has-cond':''}" onclick="event.stopPropagation();showInitCondPopup(${i})" title="Zarządzaj stanami">${c.conditions&&c.conditions.length>0?'🔄':'⚙️'}</button>
        <button class="init-cond-btn" onclick="event.stopPropagation();showInitDmg(${i})" title="Zadaj obrażenia">⚔️</button>
      </div>
      ${c.ac!=='—'?`<div class="init-ac" title="Klasa Pancerza">🛡 ${c.ac}</div>`:''}
      ${typeof c.hp==='number'?`<div class="init-hp ${hpClass}" onclick="event.stopPropagation();showInitDmg(${i})">${hpText}</div>`:''}
      <div class="init-remove" onclick="event.stopPropagation();removeCombatant(${i})">✕</div>
    `;
    list.appendChild(div);
  });
  updateFocusFire();scrollToCurrentTurn();
}
function removeCombatant(i){if(confirm(`Usunąć ${combatants[i].name}?`)){combatants.splice(i,1);if(currentTurn>=combatants.length) currentTurn=0;lastInitCount=-1;renderInit();}}

/* ========== CONDITION POPUP ========== */
function showCondPopup(name,currentConds,onToggle){
  const existing=document.getElementById('condPopup');if(existing) existing.remove();
  const allConds=['Blinded','Charmed','Deafened','Frightened','Grappled','Incapacitated','Invisible','Paralyzed','Petrified','Poisoned','Prone','Restrained','Stunned','Unconscious','Exhaustion'];
  const popup=document.createElement('div');popup.className='popup-overlay';popup.id='condPopup';
  let btns='';allConds.forEach(c=>{const active=currentConds.includes(c)?'active':'';btns+=`<button class="cond-popup-btn ${active}" data-cond="${c}">${getStateEmoji(c)} ${c}</button>`;});
  popup.innerHTML=`<div class="popup-content cond-popup-content">
    <div class="popup-title">🐦‍⬛ ${name} — Stany</div>
    <div class="cond-popup-grid">${btns}</div>
    <button class="popup-close" onclick="closeCondPopup()">✕ Zamknij</button>
  </div>`;
  popup.querySelectorAll('.cond-popup-btn').forEach(b=>{b.onclick=()=>{const cond=b.dataset.cond;onToggle(cond);b.classList.toggle('active');};});
  document.body.appendChild(popup);
}
function updateCondPopup(popup,currentConds){popup.querySelectorAll('.cond-popup-btn').forEach(b=>{if(currentConds.includes(b.dataset.cond)) b.classList.add('active'); else b.classList.remove('active');});}
function closeCondPopup(){const p=document.getElementById('condPopup');if(p) p.remove();conditionPopupTarget=null;}

// ESC zamyka popupy
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCondPopup();closeDmgPopup();closeDicePopup();closeTimerPopup();closeAddPlayerModal();}});
// Klik poza popupem
document.addEventListener('mousedown',e=>{
  ['condPopup','dmgPopup','dicePopup','timerPopup','addPlayerPopup'].forEach(id=>{
    const p=document.getElementById(id);
    if(p&&!p.contains(e.target)&&e.target.closest('.popup-content')===null&&id!=='addPlayerPopup') closeCondPopup();
  });
  const addP=document.getElementById('addPlayerPopup');
  if(addP&&addP.style.display==='flex'&&e.target===addP) closeAddPlayerModal();
});
// Swipe to close (mobile)
if(isTouchDevice()){
  let touchStartY=0;
  document.addEventListener('touchstart',e=>{touchStartY=e.touches[0].clientY;},{passive:true});
  document.addEventListener('touchend',e=>{
    const diff=touchStartY-e.changedTouches[0].clientY;
    if(diff<-100){['condPopup','dmgPopup','dicePopup','timerPopup'].forEach(id=>{const p=document.getElementById(id);if(p){const cb=p.querySelector('.popup-close');if(cb) cb.click();}});}
  },{passive:true});
}
// Resize
let resizeTimeout;
window.addEventListener('resize',()=>{clearTimeout(resizeTimeout);resizeTimeout=setTimeout(()=>{renderSizeCanvas();renderSpellCanvas();},250);});
// Death flash style
const style=document.createElement('style');style.textContent=`@keyframes fadeOut{0%{opacity:1;}100%{opacity:0;}}`;document.head.appendChild(style);

/* ========== INIT ========== */
initNavigation();
initInfoTabs();
initCanvasPanZoom();
initAvatarPicker();
renderStatesInfoList();
renderPlayers();
updateFocusFire();
setTimeout(()=>{renderSizeCanvas();renderSpellCanvas();},200);
