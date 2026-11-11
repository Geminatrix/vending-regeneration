/** VEND // REGENERATE — standalone offline arcade */

const ADJECTIVES = ["Spectral","Sticky","Neon","Soft","Cursed","Bubbly","Ominous","Glitching","Velvet","Rainy","Humming","Pickled","Lucid","Wobbly","Chrono","Mossy","Electric","Bashful","Uncanny","Moonlit"];
const NOUNS = ["Soda","Capsule","Muffin","Battery","Amulet","Gummy","Puddle","Can","Charm","Noodle","Echo","Lantern","Marble","Whisper","Snack","Key","Bubble","Coin","Seed","Mirror"];
const FUNNY = ["Almost Illegal","Slightly Haunted","Emotionally Available","Expired Yesterday","Too Honest","Government Adjacent","Wet On Purpose","Softly Screaming","Unofficial Sequel","Battery Flavored","Rainproof Soul","Midnight Clearance"];
const PLAYER_FORMS = ["tiny umbrella","glowing boots","extra eyes","jelly legs","neon raincoat","cat ears","static hair","puddle feet","antenna","moon backpack","candy crown","shadow twin"];
const ENV_FORMS = ["pink rain","upside neon","fog choir","pixel puddles","slow lightning","violet sky","glitch signs","quiet snow","acid puddles","star drizzle","orange haze","mirror street"];
const MACHINE_FORMS = ["smug grin","worried blink","third eye","disco hum","angel halo","devil antenna","sleepy lids","spark beard","rainbow slots","whisper speaker","giant pupil","tea kettle"];
const THEMES = {
  rain:{adj:["Rainy","Soggy","Drizzly"],noun:["Umbrella","Puddle","Cloud"],env:"pink rain",hue:200},
  fire:{adj:["Scorched","Sizzling","Ember"],noun:["Coal","Pepper","Spark"],env:"orange haze",hue:20},
  love:{adj:["Blushing","Darling","Heartfelt"],noun:["Kiss","Candy","Letter"],player:"candy crown",hue:330},
  moon:{adj:["Lunar","Silver","Tideless"],noun:["Cheese","Orb","Tide"],env:"star drizzle",hue:250},
  ghost:{adj:["Haunted","Pale","Whispering"],noun:["Sheet","Echo","Rattle"],player:"shadow twin",hue:180},
  cat:{adj:["Purring","Feline","Whiskered"],noun:["Yarn","Milk","Paw"],player:"cat ears",hue:40},
  glitch:{adj:["Broken","Corrupted","Jittery"],noun:["Packet","Pixel","Bug"],env:"glitch signs",hue:300},
  sleep:{adj:["Drowsy","Dreamy","Yawning"],noun:["Pillow","Cocoa","Lullaby"],machine:"sleepy lids",hue:270},
  music:{adj:["Tuneful","Bass","Echoing"],noun:["Beat","Synth","Chorus"],machine:"disco hum",hue:160},
  fear:{adj:["Ominous","Dread","Wrong"],noun:["Stare","Closet","Static"],machine:"giant pupil",hue:0},
  food:{adj:["Crunchy","Pickled","Spicy"],noun:["Noodle","Pickle","Bun"],player:"jelly legs",hue:35},
  tech:{adj:["Wired","Charged","Binary"],noun:["Battery","Chip","Cable"],machine:"spark beard",hue:190},
};
const EMOJI_THEME = {"🌧️":"rain","☔":"rain","💧":"rain","🔥":"fire","🌶️":"fire","❤️":"love","💕":"love","😘":"love","🌙":"moon","🌕":"moon","👻":"ghost","💀":"ghost","🐱":"cat","🐈":"cat","✨":"glitch","👾":"glitch","💤":"sleep","😴":"sleep","🎵":"music","🎶":"music","😱":"fear","😨":"fear","🍜":"food","🍕":"food","🔋":"tech","💻":"tech"};

function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rngFrom(seed){let a=seed>>>0;return function(){a=(a+0x6d2b79f5)>>>0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};}
function pick(rng,arr){return arr[Math.floor(rng()*arr.length)%arr.length];}
function clampText(text){return typeof text==="string"?text.trim().slice(0,64):"";}

function detectThemes(text){
  const lower=text.toLowerCase(); const found=[];
  for(const [emoji,theme] of Object.entries(EMOJI_THEME)) if(text.includes(emoji)&&!found.includes(theme)) found.push(theme);
  for(const key of Object.keys(THEMES)) if(lower.includes(key)&&!found.includes(key)) found.push(key);
  for(const [word,theme] of [["wet","rain"],["storm","rain"],["burn","fire"],["hot","fire"],["kiss","love"],["heart","love"],["night","moon"],["luna","moon"],["spook","ghost"],["haunt","ghost"],["meow","cat"],["bug","glitch"],["error","glitch"],["dream","sleep"],["song","music"],["scare","fear"],["hungry","food"],["eat","food"],["robot","tech"],["cyber","tech"]]){
    if(lower.includes(word)&&!found.includes(theme)) found.push(theme);
  }
  return found;
}

function inventItem(text,seed){
  const rng=rngFrom(seed^hashStr(text||"empty"));
  const themes=detectThemes(text); const theme=themes.length?THEMES[pick(rng,themes)]:null;
  const adj=pick(rng,theme?.adj?[...theme.adj,...ADJECTIVES]:ADJECTIVES);
  const noun=pick(rng,theme?.noun?[...theme.noun,...NOUNS]:NOUNS);
  const funny=pick(rng,FUNNY);
  const name=rng()>0.45?`${adj} ${noun}`:`${adj} ${noun} (${funny})`;
  let target=pick(rng,["player","environment","machine","combo"]);
  if(theme?.player&&rng()>0.35) target=rng()>0.5?"player":"combo";
  if(theme?.env&&rng()>0.35) target=rng()>0.5?"environment":"combo";
  if(theme?.machine&&rng()>0.35) target=rng()>0.5?"machine":"combo";
  const playerForm=theme?.player||pick(rng,PLAYER_FORMS);
  const envForm=theme?.env||pick(rng,ENV_FORMS);
  const machineForm=theme?.machine||pick(rng,MACHINE_FORMS);
  const hue=theme?.hue??Math.floor(rng()*360);
  const omen=rng()>0.82;
  const flavor=omen?pick(rng,["It tastes like a warning.","The alley holds its breath.","Something watches through the rain.","The machine smiles too wide."]):pick(rng,["Weirdly refreshing.","Leaves glitter on your tongue.","The puddles giggle.","Your reflection winks first.","Battery-adjacent aftertaste.","Cute, then concerning."]);
  return {id:`item_${seed.toString(16)}_${hashStr(name).toString(16)}`,name,input:text,target,playerForm,envForm,machineForm,hue,omen,flavor,themes,glyph:String.fromCodePoint(0x2600+Math.floor(rng()*80))};
}

function applyTransform(state,item){
  const player={...state.player}; const environment={...state.environment}; const machine={...state.machine};
  if(item.target==="player"||item.target==="combo"){player.form=item.playerForm;player.hue=item.hue;player.mood=item.omen?"uneasy":"delighted";player.bounce=Math.min(2.4,(player.bounce||1)+0.15);}
  if(item.target==="environment"||item.target==="combo"){environment.form=item.envForm;environment.hue=item.hue;environment.rain=item.themes.includes("rain")?"pink":environment.form.includes("snow")?"snow":"neon";environment.omen=item.omen;}
  if(item.target==="machine"||item.target==="combo"){machine.form=item.machineForm;machine.hue=item.hue;machine.mood=item.omen?"ominous":"smug";machine.hum=Math.min(3,(machine.hum||1)+0.2);}
  return {player,environment,machine};
}

function upsert(list,entry,limit=48){return [{...entry,at:list.length+1},...list.filter(d=>d.id!==entry.id)].slice(0,limit);}

function load(key,fallback){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback;}catch{return fallback;}}
function save(key,value){localStorage.setItem(key,JSON.stringify(value));}

function freshState(){
  const saved=load("vend:state",null);
  if(saved?.player) return saved;
  return {
    seed:0x51f3e2a1, vendCount:0, phase:"idle", lastItem:null,
    player:{form:"alley kid",hue:18,mood:"curious",bounce:1},
    environment:{form:"rainy midnight alley",hue:220,rain:"neon",omen:false},
    machine:{form:"soft smile",hue:300,mood:"humming",hum:1},
    discoveries:load("vend:discoveries",[]),
    transforms:load("vend:transforms",[]),
    history:[],
  };
}

let state=freshState();

function vend(text){
  text=clampText(text); if(!text) return {ok:false,error:"type a word, phrase, or emoji"};
  const nextSeed=(state.seed+hashStr(text)+state.vendCount+1)>>>0;
  const item=inventItem(text,nextSeed);
  const transformed=applyTransform(state,item);
  const discovery={id:item.id,name:item.name,input:item.input,target:item.target,glyph:item.glyph,hue:item.hue,omen:item.omen,flavor:item.flavor};
  const transformId=`tr_${item.target}_${hashStr(item.playerForm+item.envForm+item.machineForm).toString(16)}`;
  const transform={id:transformId,label:item.target==="combo"?`${item.playerForm} + ${item.envForm} + ${item.machineForm}`:item.target==="player"?item.playerForm:item.target==="environment"?item.envForm:item.machineForm,target:item.target,hue:item.hue,fromItem:item.name};
  state={...state,seed:nextSeed,vendCount:state.vendCount+1,phase:"ready",lastItem:item,player:transformed.player,environment:transformed.environment,machine:transformed.machine,discoveries:upsert(state.discoveries,discovery),transforms:upsert(state.transforms,transform),history:[`${text} → ${item.name}`,...state.history].slice(0,24)};
  save("vend:state",state); save("vend:discoveries",state.discoveries); save("vend:transforms",state.transforms);
  return {ok:true,item};
}

// ── UI ─────────────────────────────────────────────────────────────────────
const canvas=document.querySelector("#stage"); const ctx=canvas.getContext("2d");
const metaEl=document.querySelector("#meta"); const statusEl=document.querySelector("#status");
const promptEl=document.querySelector("#prompt"); const vendBtn=document.querySelector("#vend");
const formEl=document.querySelector("#vend-form"); const chipsEl=document.querySelector("#chips");
const codexList=document.querySelector("#codex-list"); const toastEl=document.querySelector("#toast");
const toastName=document.querySelector("#toast-name"); const toastFlavor=document.querySelector("#toast-flavor");
const W=320,H=180,SCALE=3; canvas.width=W*SCALE; canvas.height=H*SCALE; ctx.imageSmoothingEnabled=false;

const SUGGESTIONS=["rain","🔥","moon kiss","glitch snack","sleepy cat","👻","battery noodles","too honest"];
chipsEl.innerHTML=SUGGESTIONS.map(s=>`<button class="chip" type="button" data-v="${s.replace(/"/g,"&quot;")}">${s}</button>`).join("");
chipsEl.addEventListener("click",(e)=>{const btn=e.target.closest(".chip"); if(!btn) return; promptEl.value=btn.dataset.v; promptEl.focus();});

let codexTab="items";
document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{codexTab=tab.dataset.tab; document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t===tab)); renderCodex();}));

let animating=false, dispenseT=0, flash=0, shake=0;
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
const rain=Array.from({length:70},(_,i)=>({x:(i*47)%W,y:(i*29)%H,z:0.5+(i%5)*0.15,len:4+(i%4)}));
const puddles=[{x:40,y:150,w:36,h:8},{x:120,y:158,w:50,h:7},{x:210,y:152,w:42,h:9}];
const t0=performance.now();

function setStatus(text,isError=false){statusEl.textContent=text; statusEl.classList.toggle("error",!!isError);}
function escapeHtml(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}
function renderCodex(){
  const rows=codexTab==="items"?state.discoveries:state.transforms;
  metaEl.textContent=`solo alley · ${state.discoveries.length} items · ${state.transforms.length} transforms`;
  if(!rows.length){codexList.innerHTML=`<li><span class="glyph">?</span><div><div class="name">Nothing yet</div><div class="sub">Vend something strange</div></div><span class="count">0</span></li>`;return;}
  codexList.innerHTML=rows.map(row=>{const hue=row.hue??180; const title=row.name||row.label; const sub=codexTab==="items"?(row.input||""):(row.target||""); return `<li><span class="glyph" style="background:hsla(${hue},70%,55%,0.25)">${row.glyph||"✦"}</span><div><div class="name">${escapeHtml(title)}</div><div class="sub">${escapeHtml(sub)}</div></div><span class="count">#${row.at||""}</span></li>`;}).join("");
}

function startDispense(item){
  animating=true; dispenseT=0; flash=1; shake=item.omen?10:6; vendBtn.disabled=true;
  toastName.textContent=`${item.glyph||"✦"} ${item.name}`; toastFlavor.textContent=item.flavor||"";
  toastEl.classList.toggle("omen",!!item.omen); toastEl.classList.add("show");
  setStatus(item.omen?"something feels off…":"dispensing…");
  setTimeout(()=>toastEl.classList.remove("show"),2600);
}

formEl.addEventListener("submit",(e)=>{
  e.preventDefault(); if(animating) return;
  const text=promptEl.value.trim(); const res=vend(text);
  if(!res.ok){setStatus(res.error,true); return;}
  promptEl.value=""; renderCodex(); startDispense(res.item);
});

function hsl(h,s,l,a=1){return `hsla(${h}, ${s}%, ${l}%, ${a})`;}
function drawPixelRect(x,y,w,h,color){ctx.fillStyle=color; ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}

function drawAlley(env,time){
  const hue=env?.hue??220; const omen=!!env?.omen;
  const top=ctx.createLinearGradient(0,0,0,H);
  top.addColorStop(0,hsl(hue,omen?40:55,omen?8:10)); top.addColorStop(0.55,hsl(hue+20,45,14)); top.addColorStop(1,hsl(hue-10,35,9));
  ctx.fillStyle=top; ctx.fillRect(0,0,W,H);
  for(let i=0;i<8;i++){const x=i*42-10; const h=40+((i*17)%50); drawPixelRect(x,H-70-h,40,h,hsl(hue,25,12+(i%3)));
    for(let wy=0;wy<4;wy++) for(let wx=0;wx<2;wx++){if((i+wy+wx)%3===0) continue; const on=Math.sin(time*0.002+i+wy)>(omen?0.7:0.2); drawPixelRect(x+8+wx*14,H-70-h+8+wy*12,6,6,on?hsl(40+i*20,90,60,0.85):hsl(hue,20,18));}}
  const neonPulse=0.65+Math.sin(time*0.006)*0.35;
  drawPixelRect(18,48,34,10,hsl(320,90,55,neonPulse)); drawPixelRect(250,36,40,12,hsl(180,90,55,neonPulse));
  drawPixelRect(0,140,W,40,hsl(hue,20,11)); for(let x=0;x<W;x+=8) drawPixelRect(x,140,7,2,hsl(hue,15,16));
  puddles.forEach((p,i)=>{const shimmer=0.25+Math.sin(time*0.005+i)*0.15; drawPixelRect(p.x,p.y,p.w,p.h,hsl(env?.form?.includes("pink")?330:hue+40,70,40,shimmer)); drawPixelRect(p.x+4,p.y+1,p.w-10,2,hsl(50,90,70,shimmer*0.5));});
  if(env?.form){ctx.fillStyle=hsl(hue,40,70,0.35); ctx.font="5px monospace"; ctx.fillText(String(env.form).slice(0,28),8,12);}
}

function drawRain(env){
  const mode=env?.rain||"neon"; const color=mode==="pink"?"rgba(255,140,200,0.55)":mode==="snow"?"rgba(230,240,255,0.7)":"rgba(140,200,255,0.45)";
  ctx.strokeStyle=color; ctx.lineWidth=1;
  rain.forEach(d=>{d.y+=d.z*(reduced?0.4:1.6); if(d.y>H){d.y=-10;d.x=(d.x+37)%W;} if(mode==="snow"){ctx.fillStyle=color;ctx.fillRect(d.x,d.y,2,2);} else {ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x-1,d.y+d.len);ctx.stroke();}});
}

function drawCan(x,y,hue){drawPixelRect(x,y,10,14,hsl(hue,70,45)); drawPixelRect(x+1,y+1,8,4,hsl(hue,80,70)); drawPixelRect(x+2,y+6,6,5,hsl(90,90,55)); drawPixelRect(x+3,y,4,1,hsl(0,0,80));}

function drawMachine(machine,time,dropY){
  const hue=machine?.hue??300; const hum=machine?.hum??1; const bob=reduced?0:Math.sin(time*0.005*hum)*1.5;
  const x=198,y=58+bob; const omin=machine?.mood==="ominous";
  drawPixelRect(x,y,56,86,hsl(hue,70,omin?28:38)); drawPixelRect(x+2,y+2,52,82,hsl(hue,65,omin?18:24));
  drawPixelRect(x+8,y+10,40,28,hsl(hue+40,80,55,0.9)); drawPixelRect(x+10,y+12,36,24,hsl(200,30,12));
  const blink=Math.sin(time*0.003)>0.92; const eyeH=blink?1:6;
  drawPixelRect(x+16,y+18,6,eyeH,hsl(180,90,70)); drawPixelRect(x+34,y+18,6,eyeH,hsl(180,90,70));
  if(omin) drawPixelRect(x+20,y+28,16,4,hsl(0,80,55)); else {drawPixelRect(x+22,y+28,12,2,hsl(160,80,60)); drawPixelRect(x+20,y+26,2,2,hsl(160,80,60)); drawPixelRect(x+34,y+26,2,2,hsl(160,80,60));}
  for(let i=0;i<3;i++){drawPixelRect(x+10+i*14,y+46,10,14,hsl(90,90,55,0.35+Math.sin(time*0.01+i)*0.2)); drawPixelRect(x+11+i*14,y+47,8,12,hsl(hue,40,15));}
  drawPixelRect(x+14,y+68,28,14,hsl(220,20,8)); if(dropY!=null) drawCan(x+24,y+70+dropY,hue);
  const form=machine?.form||"";
  if(form.includes("halo")||form.includes("angel")){ctx.strokeStyle=hsl(50,90,70);ctx.beginPath();ctx.ellipse(x+28,y-4,12,4,0,0,Math.PI*2);ctx.stroke();}
  if(form.includes("antenna")||form.includes("devil")){drawPixelRect(x+26,y-10,2,10,hsl(0,70,50)); drawPixelRect(x+24,y-12,6,3,hsl(0,70,50));}
  if(form.includes("third eye")||form.includes("pupil")){drawPixelRect(x+24,y+8,8,8,hsl(90,90,60)); drawPixelRect(x+27,y+11,2,2,"#111");}
  if(form.includes("spark")||form.includes("beard")) for(let i=0;i<5;i++) drawPixelRect(x+18+i*5,y+84,2,4+(i%2),hsl(50,90,60));
  ctx.fillStyle=hsl(hue,90,60,0.08+Math.sin(time*0.008*hum)*0.05); ctx.fillRect(x-8,y-8,72,102);
}

function drawHero(player,time,holdCan){
  const hue=player?.hue??18; const bounce=player?.bounce??1; const bob=reduced?0:Math.sin(time*0.008*bounce)*2;
  const x=88,y=108+bob; const uneasy=player?.mood==="uneasy"; const form=player?.form||"";
  drawPixelRect(x+2,150,20,4,"rgba(0,0,0,0.35)");
  drawPixelRect(x+6,y+14,12,16,hsl(hue,70,60)); drawPixelRect(x+4,y+16,16,10,hsl(hue,65,52));
  drawPixelRect(x+4,y,16,14,hsl(25,55,78)); drawPixelRect(x+5,y+1,14,12,hsl(20,60,82));
  const blink=Math.sin(time*0.0025)>0.95;
  drawPixelRect(x+7,y+5,3,blink?1:4,uneasy?hsl(0,70,40):"#1a1f2e"); drawPixelRect(x+14,y+5,3,blink?1:4,uneasy?hsl(0,70,40):"#1a1f2e");
  if(!blink){drawPixelRect(x+8,y+6,1,1,"#fff"); drawPixelRect(x+15,y+6,1,1,"#fff");}
  if(uneasy) drawPixelRect(x+10,y+11,4,1,hsl(0,40,40)); else drawPixelRect(x+9,y+10,6,2,hsl(0,50,45));
  const step=Math.sin(time*0.01*bounce); drawPixelRect(x+7,y+30,4,10+step,hsl(220,25,30)); drawPixelRect(x+13,y+30,4,10-step,hsl(220,25,30));
  if(form.includes("cat ears")){drawPixelRect(x+4,y-4,4,5,hsl(hue,60,45)); drawPixelRect(x+16,y-4,4,5,hsl(hue,60,45));}
  if(form.includes("antenna")){drawPixelRect(x+11,y-8,2,8,hsl(180,80,60)); drawPixelRect(x+10,y-10,4,3,hsl(90,90,55));}
  if(form.includes("crown")||form.includes("candy")){drawPixelRect(x+5,y-3,14,3,hsl(50,90,55)); drawPixelRect(x+7,y-6,3,3,hsl(0,80,60)); drawPixelRect(x+14,y-6,3,3,hsl(280,80,60));}
  if(form.includes("raincoat")||form.includes("umbrella")) drawPixelRect(x+2,y+12,20,4,hsl(200,80,55));
  if(form.includes("backpack")||form.includes("moon")) drawPixelRect(x+18,y+16,8,10,hsl(250,40,70));
  if(form.includes("shadow")) drawPixelRect(x-10,y+4,10,30,"rgba(20,10,40,0.45)");
  if(form.includes("extra eyes")){drawPixelRect(x+6,y+2,2,2,"#1a1f2e"); drawPixelRect(x+16,y+2,2,2,"#1a1f2e");}
  if(holdCan) drawCan(x+20,y+18,hue);
}

function drawParticles(time,item){if(!item||dispenseT>1.2) return; const cx=230,cy=120; for(let i=0;i<18;i++){const a=i/18*Math.PI*2+time*0.01; const r=10+dispenseT*40+(i%3)*4; drawPixelRect(cx+Math.cos(a)*r,cy+Math.sin(a)*r*0.6,2,2,hsl(item.hue+i*10,90,60,1-dispenseT));}}

function frame(now){
  const time=now-t0; const env=state.environment; const player=state.player; const machine=state.machine; const item=state.lastItem;
  let dropY=null, holdCan=false;
  if(animating){dispenseT+=reduced?0.025:0.018; if(dispenseT<0.35) dropY=-8+dispenseT*40; else if(dispenseT<0.7) dropY=6; else holdCan=true; if(dispenseT>=1.35){animating=false; vendBtn.disabled=false; setStatus("machine humming — your move");}}
  else if(item) holdCan=true;
  flash=Math.max(0,flash-0.04); shake=Math.max(0,shake-0.35);
  ctx.setTransform(SCALE,0,0,SCALE,0,0);
  const sx=shake?(Math.random()-0.5)*shake:0; const sy=shake?(Math.random()-0.5)*shake:0; ctx.translate(sx,sy);
  drawAlley(env,time); drawMachine(machine,time,dropY); drawHero(player,time,holdCan); drawRain(env); drawParticles(time,item);
  if(flash>0){ctx.fillStyle=`rgba(255,255,255,${flash*0.35})`; ctx.fillRect(0,0,W,H); if(item?.omen){ctx.fillStyle=`rgba(120,0,40,${flash*0.25})`; ctx.fillRect(0,0,W,H);}}
  ctx.fillStyle="rgba(0,0,0,0.08)"; for(let y=0;y<H;y+=2) ctx.fillRect(0,y,W,1);
  requestAnimationFrame(frame);
}

renderCodex(); requestAnimationFrame(frame); promptEl.focus();
