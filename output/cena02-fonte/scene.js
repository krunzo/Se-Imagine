/* Se Imagine — Cena 02. Renderer Canvas 2.5D, sem bibliotecas ou rede.
 * Coordenadas em metros, Y para cima. A câmera e a chuva usam projeção 3D.
 * O ator é um manequim articulado provisório: NÃO é um desenho do protagonista.
 * A função renderFrame(frame) não depende do relógio nem de quadros anteriores.
 */
(() => {
'use strict';
const C=window.FILM, W=C.width, H=C.height, canvas=document.getElementById('film');
const ctx=canvas.getContext('2d',{alpha:false});
const layer=document.createElement('canvas');layer.width=W;layer.height=H;
const g=layer.getContext('2d',{alpha:false});
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
const vadd=(a,b)=>a.map((x,i)=>x+b[i]);
const vsub=(a,b)=>a.map((x,i)=>x-b[i]);
const vmul=(a,s)=>a.map(x=>x*s);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>vmul(a,1/(Math.hypot(...a)||1));
const vlerp=(a,b,t)=>a.map((x,i)=>mix(x,b[i],t));
const mod=(a,b)=>((a%b)+b)%b;
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const random=rng(C.seed);
const rain=Array.from({length:C.rain.count},()=>({x:(random()-.5)*15,y:random()*9,z:mix(-18,5,random()),s:mix(.6,1.3,random()),o:mix(.18,.65,random()),r:random()}));
// Gotas de primeiro plano: mesmo relógio físico, raio e brilhos mais legíveis.
for(let i=0;i<64;i++){const s=mix(.7,1.15,random()),stopY=mix(.35,3.4,random());rain.push({x:(random()-.5)*4.2-.13*(stopY-3),y:mod(stopY+.35+6.5*C.rain.speed*s,9),z:mix(.6,3.65,random()),s,o:mix(.65,.95,random()),r:random(),hero:true})}
const motes=Array.from({length:130},()=>({x:(random()-.5)*5,y:random()*3.7,z:mix(-3,2.5,random()),a:random()*6.28,r:random()}));
const puddles=Array.from({length:120},()=>({x:(random()-.5)*10,z:mix(-17,4,random()),w:mix(.05,.45,random()),s:random()}));
const impacts=Array.from({length:180},()=>({x:(random()-.5)*10,z:mix(-12,4,random()),phase:random(),life:mix(.35,.75,random())}));
const grit=document.createElement('canvas');grit.width=256;grit.height=256;
const gritctx=grit.getContext('2d'), pixels=gritctx.createImageData(256,256);
for(let i=0;i<pixels.data.length;i+=4){const v=110+Math.floor(random()*35);pixels.data[i]=v;pixels.data[i+1]=v;pixels.data[i+2]=v;pixels.data[i+3]=255}gritctx.putImageData(pixels,0,0);
const assetGrain=new Image();assetGrain.src='assets/grain.png';
const assetGlow=new Image();assetGlow.src='assets/glow.png';
const grainPattern=g.createPattern(grit,'repeat');
let camera;
function makeCamera(p,target,focal,roll=0){const forward=norm(vsub(target,p));const right=norm(cross(forward,[0,1,0]));const up=cross(right,forward);return{p,forward,right,up,focal,roll}}
function project(v){const d=vsub(v,camera.p),z=dot(d,camera.forward);if(z<.075)return null;let x=dot(d,camera.right)*camera.focal/z,y=-dot(d,camera.up)*camera.focal/z;const c=Math.cos(camera.roll),s=Math.sin(camera.roll);return{x:W/2+x*c-y*s,y:H/2+x*s+y*c,z,k:camera.focal/z}}
function path(points,close=true){g.beginPath();points.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));if(close)g.closePath()}
function quad(world,fill){const p=world.map(project);if(p.some(x=>!x))return;path(p);g.fillStyle=fill;g.fill()}
function lineWorld(a,b,color,width=1){const p=project(a),q=project(b);if(!p||!q)return;g.strokeStyle=color;g.lineWidth=width;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(q.x,q.y);g.stroke()}
function glow(x,y,r,color,alpha=1){if(r<=0)return;g.save();g.globalCompositeOperation='screen';g.globalAlpha=alpha;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,color);gr.addColorStop(.18,color.replace(/,[\d.]+\)$/,',0.16)'));gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);g.restore()}
function groundEllipse(x,z,rx,rz,color){const p=[];for(let i=0;i<48;i++){let a=i*Math.PI/24;p.push(project([x+Math.cos(a)*rx,.005,z+Math.sin(a)*rz]))}if(p.some(x=>!x))return;path(p);g.fillStyle=color;g.fill()}
function sky(t){const bg=g.createLinearGradient(0,C.matte,0,H-C.matte);bg.addColorStop(0,'#07131f');bg.addColorStop(.46,'#13232c');bg.addColorStop(1,'#050d13');g.fillStyle=bg;g.fillRect(0,0,W,H);
  const light=project([2.3,4.8,-6]);if(light)glow(light.x,light.y,900,'rgba(70,132,162,0.15)');
  const far=project([-1,1.7,-17]);if(far)glow(far.x,far.y,430,'rgba(114,151,160,0.08)');
}
function box(x,y,z,sx,sy,sz,col){const vs=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(p=>[x+p[0]*sx/2,y+p[1]*sy/2,z+p[2]*sz/2]);const faces=[[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[1,5,6,2],[0,3,7,4]];const cols=col||['#07111a','#111d26','#071018','#1c2d36','#14252e','#0a151f'];faces.map((ids,i)=>({p:ids.map(j=>vs[j]),i,z:ids.reduce((s,j)=>s+dot(vsub(vs[j],camera.p),camera.forward),0)/4})).sort((a,b)=>b.z-a.z).forEach(f=>quad(f.p,cols[f.i]));}
function architecture(t){
  // Camadas de arquitetura em profundidades distintas; nenhuma fotografia de fundo.
  for(let i=7;i>=0;i--){const z=-3.3-i*3.2;box(-3.45,2.8,z,.44,6,.55);box(3.5,2.8,z,.48,6,.55);box(0,5.5,z,7.6,.42,.5);lineWorld([-3.2,4.4,z],[3.3,4.4,z],'rgba(77,123,144,.16)',1.5)}
  quad([[-3.7,-.1,-26],[-3.7,5.8,-26],[-3.7,5.8,5],[-3.7,-.1,5]],'#070e15');
  quad([[3.9,-.1,-26],[3.9,5.8,-26],[3.9,5.8,5],[3.9,-.1,5]],'#070e14');
  for(let i=0;i<15;i++){const z=-2-i*1.5;lineWorld([-3.68,.45,z],[-3.68,4.4,z],'rgba(107,145,161,.10)',2);lineWorld([3.88,.45,z],[3.88,4.4,z],'rgba(107,145,161,.07)',2)}
  // Luz prática distante, sem símbolo ou identidade de marca.
  quad([[-2.8,2.3,-13],[-2.64,2.3,-13],[-2.64,3.0,-13],[-2.8,3.0,-13]],'#c2a873');
  let p=project([-2.7,2.6,-13]);if(p)glow(p.x,p.y,130,'rgba(199,153,82,.26)');
}
function ground(t,heal){
  quad([[-22,-.02,-30],[22,-.02,-30],[22,-.02,5],[-22,-.02,5]],'#08121a');
  // Lajes, juntas e reflexos, todos reprojetados a cada quadro.
  for(let z=-25;z<5;z+=1.1){lineWorld([-12,0,z],[12,0,z],'rgba(100,139,157,.042)',1);for(let x=-8;x<8;x+=1.35){let off=(Math.round(z/1.1)%2)*.675;lineWorld([x+off,0,z],[x+off,0,z+1.1],'rgba(100,139,157,.026)',.7)}}
  groundEllipse(1.6,-3.5,1.7,6,'rgba(72,120,141,.045)');
  groundEllipse(1.6,-1.2,.9,3,'rgba(100,157,174,.045)');
  for(const p of puddles){const a=.035+p.s*.065;groundEllipse(p.x,p.z,p.w,p.w*.3,`rgba(115,158,173,${a})`)}
  // Reflexo imperfeito do manequim e sombra de contato.
  groundEllipse(-.12,.3,.33,.9,'rgba(0,4,9,.45)');
  groundEllipse(-.16,0,.62,.32,'rgba(0,2,5,.55)');
  groundEllipse(.22,.35,.5,1.1,`rgba(197,160,94,${heal*.07})`);
  const activity=1-smooth(5,8,t);
  for(const d of impacts){const phase=mod(t*.9+d.phase,1),r=phase*.19;const a=(1-phase)*activity*.19;if(a<.005)continue;const points=[];for(let j=0;j<=24;j++){let q=j*Math.PI/12;points.push(project([d.x+Math.cos(q)*r,.008,d.z+Math.sin(q)*r]))}if(points.some(p=>!p))continue;path(points);g.strokeStyle=`rgba(139,195,210,${a})`;g.lineWidth=1;g.stroke();}
}
function haze(t,heal,front=false){g.save();g.globalCompositeOperation='screen';
  const beam=project([2.5,5.1,-4.5]),end=project([-.8,0,1.2]);
  if(beam&&end){g.save();g.filter='blur(28px)';const gr=g.createLinearGradient(beam.x,beam.y,end.x,end.y);gr.addColorStop(0,`rgba(102,160,185,${front?.028:.095})`);gr.addColorStop(1,'rgba(30,76,99,0)');g.fillStyle=gr;g.beginPath();g.moveTo(beam.x-32,beam.y);g.lineTo(beam.x+42,beam.y);g.lineTo(end.x+500,end.y);g.lineTo(end.x-240,end.y);g.closePath();g.fill();g.restore()}
  for(let i=0;i<4;i++){const p=project([Math.sin(t*.08+i)*.5, .17+i*.11, -2-i*2]);if(!p)continue;const r=500/(1+i*.15);const gr=g.createRadialGradient(p.x,p.y,0,p.x,p.y,r);gr.addColorStop(0,`rgba(87,130,148,${front?.018:.035})`);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.save();g.translate(0,p.y);g.scale(1,.24);g.fillRect(p.x-r,-r,2*r,2*r);g.restore()}
  g.restore();
}
// Tempo físico integrado. v(t)=v0*(1-smoothstep) de 5 a 8 s, zero depois.
function rainTime(t){const a=C.rain.stopStart,b=C.rain.stopEnd;if(t<=a)return t;if(t>=b)return a+(b-a)/2;const u=(t-a)/(b-a);return a+(b-a)*(u-u*u*u+.5*u*u*u*u)}
function rainVelocity(t){return 1-smooth(C.rain.stopStart,C.rain.stopEnd,t)}
function rainPass(t,front){const rt=rainTime(t),v=rainVelocity(t),list=[];const actorDepth=dot(vsub([0,1,0],camera.p),camera.forward);
  for(let i=0;i<rain.length;i++){const d=rain[i],y=mod(d.y-rt*C.rain.speed*d.s,9)-.35,x=d.x+.13*(y-3);const p=project([x,y,d.z]);if(!p||p.x<-100||p.x>W+100||p.y<100||p.y>H-100)continue;const isfront=p.z<actorDepth-.26;if(isfront!==front)continue;list.push({d,p,x,y})}
  list.sort((a,b)=>b.p.z-a.p.z);
  g.save();g.globalCompositeOperation='screen';
  const freeze=smooth(5.3,8.2,t);
  for(const {d,p,x,y} of list){
    const length=(.018+v*.24)*d.s, q=project([x+.13*length,y+length,d.z]);if(!q)continue;
    const blur=clamp((p.z<2.7?(2.7-p.z)*1.6:0),0,7),alpha=d.o*(.52+Math.min(1,4/p.z)*.42);
    if(freeze>.8 && blur>1.5){const r=Math.max(1.7,p.k*.0026+blur);const gr=g.createRadialGradient(p.x,p.y,0,p.x,p.y,r);gr.addColorStop(0,`rgba(157,211,224,${alpha*.22})`);gr.addColorStop(.65,`rgba(110,173,198,${alpha*.12})`);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(p.x-r,p.y-r,2*r,2*r)}
    g.strokeStyle=`rgba(${mix(110,169,freeze)|0},${mix(166,215,freeze)|0},${mix(190,228,freeze)|0},${alpha})`;g.lineWidth=clamp(p.k*.0012, .5,3.2)+(blur*.25);g.lineCap='round';g.beginPath();g.moveTo(p.x,p.y);g.lineTo(q.x,q.y);g.stroke();
    if(freeze>.3&&p.z<13){const radius=clamp(p.k*(d.hero?.008:.0033),d.hero?1.8:.7,d.hero?12:5);g.beginPath();g.ellipse(p.x,p.y,radius*.72,radius*1.3,-.1,0,Math.PI*2);g.fillStyle=`rgba(112,177,201,${alpha*freeze*.28})`;g.fill();g.strokeStyle=`rgba(160,215,229,${alpha*freeze*(d.hero?.48:.16)})`;g.lineWidth=d.hero?1.1:.5;g.stroke();if(d.r>.52||d.hero){g.fillStyle=`rgba(231,248,249,${alpha*freeze*.85})`;g.beginPath();g.ellipse(p.x-radius*.23,p.y-radius*.59,Math.max(.7,radius*.19),Math.max(.8,radius*.33),-.4,0,Math.PI*2);g.fill();g.fillStyle=`rgba(145,211,230,${alpha*freeze*.48})`;g.beginPath();g.ellipse(p.x+radius*.24,p.y+radius*.65,radius*.26,radius*.16,0,0,Math.PI*2);g.fill()}}
  }g.restore();
}
function rotation(v,rx=0,ry=0,rz=0){let[x,y,z]=v;let c=Math.cos(rx),s=Math.sin(rx);[y,z]=[y*c-z*s,y*s+z*c];c=Math.cos(ry);s=Math.sin(ry);[x,z]=[x*c+z*s,-x*s+z*c];c=Math.cos(rz);s=Math.sin(rz);return[x*c-y*s,x*s+y*c,z]}
let triangles=[];
function meshGrid(rows,cols,fn,base,tag='body'){const vertices=[];for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++)vertices.push(fn(j/rows,i/cols));for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const a=j*(cols+1)+i,b=a+cols+1;addFace([vertices[a],vertices[b],vertices[b+1],vertices[a+1]],base,tag)}}
function addFace(v,base,tag){const n=norm(cross(vsub(v[1],v[0]),vsub(v[2],v[0]))),center=vmul(v.reduce((a,b)=>vadd(a,b),[0,0,0]),1/v.length);if(dot(n,vsub(camera.p,center))<-.01)return;const p=v.map(project);if(p.some(q=>!q))return;triangles.push({v,p,n,center,base,tag,z:p.reduce((s,q)=>s+q.z,0)/p.length})}
function ellipsoid(center,scale,rot=[0,0,0],base=[27,39,46],tag='body'){meshGrid(14,28,(u,v)=>{const ph=u*Math.PI,th=v*2*Math.PI;return vadd(center,rotation([Math.sin(ph)*Math.cos(th)*scale[0],-Math.cos(ph)*scale[1],Math.sin(ph)*Math.sin(th)*scale[2]],...rot))},base,tag)}
function bone(a,b,ra,rb,base=[24,36,44]){const axis=norm(vsub(b,a)),u=norm(cross(axis,Math.abs(axis[2])>.9?[0,1,0]:[0,0,1])),v=cross(u,axis);meshGrid(4,24,(s,t)=>{const r=mix(ra,rb,s)*(1+.08*Math.sin(s*Math.PI));const an=t*Math.PI*2;return vadd(vlerp(a,b,s),vadd(vmul(u,Math.cos(an)*r),vmul(v,Math.sin(an)*r)))},base)}
function hand(wrist,rot,openness,t,scale=1){
  // Pares osso/junta e dedos em três falanges; pose articulada, não troca de imagem.
  const tr=p=>vadd(wrist,rotation(vmul(p,scale),...rot));
  ellipsoid(tr([0,.055,0]),[.056*scale,.075*scale,.024*scale],rot,[29,41,47],'hand');
  for(let j=0;j<4;j++){const x=(j-1.5)*.026, len=[.071,.085,.079,.062][j], spread=(j-1.5)*.12*openness;const curl=mix(.9,.12,openness)+Math.sin(t*.6+j)*.025;
    const a=tr([x,.105,0]),b=tr([x+spread*.13,.105+len*.54,-curl*.025]),c=tr([x+spread*.20,.105+len*.88,-curl*.06]),d=tr([x+spread*.23,.105+len,-curl*.09]);bone(a,b,.012,.011,[32,43,49]);ellipsoid(b,[.011,.011,.011],rot,[32,43,49]);bone(b,c,.011,.0095,[32,43,49]);bone(c,d,.0095,.007,[33,43,48]);ellipsoid(d,[.007,.008,.007],rot,[34,44,50]);
  }
  const a=tr([-.048,.028,0]),b=tr([-.082,.065,.012]),c=tr([-.10,.09,.008]);bone(a,b,.018,.013,[30,40,47]);bone(b,c,.013,.009,[32,42,49]);
  return tr;
}
function pose(t){const inhale=Math.sin(t*Math.PI*.82)*.006,attention=smooth(6.7,10.2,t),discovery=smooth(10.15,12.9,t),sway=Math.sin(t*.7)*.008;
  const LShoulder=[-.224,1.451+inhale,0],RShoulder=[.224,1.451+inhale,0];
  const LE=vlerp([-.285,1.115,.015],[-.343,1.08,.13],attention),LW=vlerp([-.29,.84,.03],[-.073,1.195,.445],attention);
  const RE=vlerp([.306,1.12,.025],[.38,1.15,.21],attention),RW=vlerp([.33,.856,.055],[.112,1.31,.46],attention);
  RW[1]+=discovery*.018;RW[2]+=discovery*.018;
  return{inhale,attention,discovery,sway,LShoulder,RShoulder,LE,LW,RE,RW,healPoint:vlerp(LE,LW,.73)};
}
function actor(t,heal){const p=pose(t);triangles=[];
  // Sem rosto, cabelo, roupa, etnia ou adereços: um substituto técnico explícito.
  ellipsoid([-.11,.48,.006],[.095,.39,.095],[.02,0,-.012],[17,29,36]);ellipsoid([.105,.48,-.045],[.095,.39,.095],[.035,0,.025],[18,30,37]);
  ellipsoid([-.112,.074,.09],[.087,.074,.17],[0,0,0],[19,30,37]);ellipsoid([.112,.074,.04],[.087,.074,.17],[0,0,0],[19,30,37]);
  ellipsoid([0,.92,0],[.19,.21,.125],[0,0,0],[22,34,42]);
  // Torso em malha perfilada: o tórax se expande sem escalar o corpo inteiro.
  meshGrid(22,32,(u,v)=>{const y=.94+u*.57;const w=(.125+Math.sin(u*Math.PI*.85)*.106)*(1+p.inhale*.7);const d=.105+Math.sin(u*Math.PI)*.046;const a=v*Math.PI*2;return[Math.cos(a)*w+p.sway,y,Math.sin(a)*d]},[24,37,44]);
  ellipsoid([-.217,1.426+p.inhale,0],[.09,.105,.105],[0,0,-.16]);ellipsoid([.217,1.426+p.inhale,0],[.09,.105,.105],[0,0,.16]);
  bone([0,1.48,0],[0,1.656,0],.067,.065,[23,36,44]);
  const headPos=[p.sway*.7,1.77+p.inhale*.3,.012+p.attention*.04];
  ellipsoid(headPos,[.111,.154,.108],[mix(.03,.35,p.attention)+p.discovery*.055,mix(-.07,-.32,p.attention),mix(.018,-.08,p.discovery)],[28,41,48],'head');
  bone(p.LShoulder,p.LE,.074,.049);ellipsoid(p.LE,[.049,.049,.049]);bone(p.LE,p.LW,.049,.032);ellipsoid(p.LW,[.032,.033,.033]);
  bone(p.RShoulder,p.RE,.074,.049);ellipsoid(p.RE,[.049,.049,.049]);bone(p.RE,p.RW,.049,.032);ellipsoid(p.RW,[.032,.033,.033]);
  hand(p.LW,[mix(Math.PI,.2,p.attention),mix(0,.2,p.attention),mix(0,-1.05,p.attention)],mix(.25,.67,p.attention),t);
  hand(p.RW,[mix(Math.PI,1.17,p.attention),mix(0,-.2,p.attention),mix(0,.56,p.attention)],mix(.15,.93,p.attention),t);
  triangles.sort((a,b)=>b.z-a.z);
  const key=norm([-.1,.5,1]),rim=norm([1,.9,-1.1]),warm=p.healPoint;
  for(const f of triangles){const N=f.n,view=norm(vsub(camera.p,f.center)),nDotV=Math.max(0,dot(N,view)),fresnel=Math.pow(1-nDotV,3.4),kd=Math.max(0,dot(N,key)),kr=Math.pow(Math.max(0,dot(N,rim)),2),dist=Math.hypot(...vsub(f.center,warm)),L=norm(vsub(warm,f.center)),kh=Math.max(0,dot(N,L))*(heal*.8)/(1+dist*dist*25);let rgb=f.base.map((b,i)=>{const k=[.78,.95,1.08][i],edge=[53,100,125][i],hl=[240,192,114][i];return clamp(b*(.44+kd*.48)+edge*kr*.65+edge*fresnel*.3+hl*kh,0,255)});path(f.p);g.fillStyle=`rgb(${rgb.map(x=>Math.round(x)).join(',')})`;g.fill();g.strokeStyle=g.fillStyle;g.lineWidth=.55;g.stroke();}
  // Marcação abstrata de ferida no antebraço provisório; reduz-se durante a cura.
  const a=vlerp(p.LE,p.LW,.63),b=vlerp(p.LE,p.LW,.84);a[2]+=.043;b[2]+=.035;
  const close=smooth(11.35,13.1,t);if(t>9.9&&close<.999){const mid=vlerp(a,b,.5),aa=vlerp(mid,a,1-close),bb=vlerp(mid,b,1-close);lineWorld(aa,bb,`rgba(176,103,87,${(1-close)*.85})`,2.6);lineWorld(vadd(aa,[0,.006,.003]),vadd(bb,[0,.006,.003]),`rgba(223,190,144,${heal*.65})`,1)}
  return p;
}
function supernatural(t,heal,p,front){const wake=smooth(7.8,10,t);g.save();g.globalCompositeOperation='screen';
  for(let i=0;i<motes.length;i++){const d=motes[i],v=[d.x+Math.sin(t*.14+d.a)*.05,d.y+Math.sin(t*.24+d.a)*.035,d.z];const q=project(v);if(!q||q.x<0||q.x>W||q.y<C.matte||q.y>H-C.matte)continue;const depth=dot(vsub([0,1,0],camera.p),camera.forward);if((q.z<depth)!==front)continue;const alpha=wake*(.13+d.r*.3);g.fillStyle=`rgba(220,198,151,${alpha})`;g.beginPath();g.arc(q.x,q.y,clamp(q.k*.0012,.6,2.2),0,Math.PI*2);g.fill();}
  const hp=project(vadd(p.healPoint,[.035,.06,.045]));if(front&&hp&&heal>0){const pulse=1+.035*Math.sin(t*3);glow(hp.x,hp.y,185*mix(.85,1.4,smooth(10,12,t)),`rgba(221,169,87,${heal*.28*pulse})`);glow(hp.x,hp.y,58,`rgba(244,215,154,${heal*.48})`);
    // Petits filaments localisés sur la blessure, sans explosion de particules.
    for(let i=0;i<23;i++){const phase=mod(t*.29+i*.618,1),a=i*2.4;const v=vadd(p.healPoint,[Math.cos(a)*.07*(1-phase),phase*.11+.025,Math.sin(a)*.045+.04]);const q=project(v);if(!q)continue;g.fillStyle=`rgba(248,220,160,${heal*Math.sin(phase*Math.PI)*.7})`;g.beginPath();g.arc(q.x,q.y,clamp(q.k*.0008,1,2.8),0,Math.PI*2);g.fill()}
    if(assetGlow.complete&&assetGlow.naturalWidth){g.globalAlpha=heal*.35;g.drawImage(assetGlow,hp.x-100,hp.y-100,200,200);g.globalAlpha=1}
  }
  g.restore();
}
function setShot(t,close){const u=smooth(0,10,t);if(!close){camera=makeCamera([mix(.70,1.30,u),mix(1.46,1.52,u),mix(5.25,4.55,u)],[.32,1.10,.03],1470,mix(-.008,0,u))}else{const q=smooth(10,14.35,t);camera=makeCamera([mix(.92,.77,q),mix(1.60,1.57,q),mix(2.13,1.84,q)],[-.015,1.41,.20],1450,mix(0,.005,q))}}
function scene(t,close){setShot(t,close);const heal=smooth(10.15,11.8,t)*(1-.20*smooth(13.2,14.35,t));sky(t);architecture(t);ground(t,heal);haze(t,heal);rainPass(t,false);const p=pose(t);supernatural(t,heal,p,false);actor(t,heal);haze(t,heal,true);rainPass(t,true);supernatural(t,heal,p,true);
  // Vignette optique, grain puis caches 2.39:1 dans un master 16:9.
  const vi=g.createRadialGradient(W*.49,H*.47,250,W*.49,H*.47,1060);vi.addColorStop(0,'rgba(0,0,0,0)');vi.addColorStop(.7,'rgba(0,4,8,.12)');vi.addColorStop(1,'rgba(0,2,5,.72)');g.fillStyle=vi;g.fillRect(0,0,W,H);
  const flash=Math.exp(-Math.pow((t-1.42)/.075,2))*.035+Math.exp(-Math.pow((t-5.17)/.11,2))*.025;g.fillStyle=`rgba(170,211,232,${flash})`;g.fillRect(0,C.matte,W,H-2*C.matte);
}
function textSpaced(text,x,y,space=4,font='12px sans-serif',color='#86949a'){ctx.font=font;ctx.fillStyle=color;for(const c of text){ctx.fillText(c,x,y);x+=ctx.measureText(c).width+space}}
window.renderFrame=function(frame){const t=clamp(frame/C.fps,0,C.duration-1/C.fps),cut=smooth(C.edit.closeStart,C.edit.closeEnd,t);ctx.globalAlpha=1;ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);if(cut<1){scene(t,false);ctx.drawImage(layer,0,0)}if(cut>0){scene(t,true);ctx.globalAlpha=cut;ctx.drawImage(layer,0,0);ctx.globalAlpha=1}
  // Grain déterministe : offsets par cadre, jamais de scintillement aléatoire du décor.
  ctx.save();ctx.globalCompositeOperation='soft-light';ctx.globalAlpha=.12;const grain=assetGrain.complete&&assetGrain.naturalWidth?assetGrain:grit;const pattern=ctx.createPattern(grain,'repeat');ctx.translate((frame*73)%256,(frame*37)%256);ctx.fillStyle=pattern;ctx.fillRect(-256,-256,W+512,H+512);ctx.restore();
  const fadeIn=smooth(0,.55,t),fadeOut=1-smooth(C.edit.fadeStart,C.duration-.033333,t);ctx.fillStyle=`rgba(0,2,5,${1-fadeIn*fadeOut})`;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#03070b';ctx.fillRect(0,0,W,C.matte);ctx.fillRect(0,H-C.matte,W,C.matte);
  // L'identification du substitut reste visible pendant toute la démonstration.
  textSpaced('SE IMAGINE',74,79,5,'15px sans-serif','#bfc6c9');
  textSpaced('ÉTUDE / 02'.replace('ÉTUDE','ESTUDO'),1578,79,3,'12px sans-serif','#697e8c');
  textSpaced('PRÉ-VISUALIZAÇÃO  /  ARTE PROVISÓRIA',74,1016,2.6,'12px sans-serif','#78909e');
  ctx.font='12px monospace';ctx.fillStyle='#617783';const sec=Math.floor(t),fr=frame%30;ctx.fillText(`CENA 02     00:${String(sec).padStart(2,'0')}:${String(fr).padStart(2,'0')}   /   15s`,1550,1016);
  const title=(smooth(.35,1,t))*(1-smooth(3.4,4.4,t));if(title>0){ctx.save();ctx.globalAlpha=title;ctx.fillStyle='rgba(2,8,13,.45)';ctx.fillRect(68,766,475,102);textSpaced('02',88,795,4,'11px sans-serif','#8fa2ad');textSpaced('O IMPOSSÍVEL',88,842,5,'29px sans-serif','#d7e0e3');ctx.restore()}
  window.currentFrame=frame;
};
window.getSceneState=function(frame){const t=frame/C.fps,p=pose(t);return{frame,t,rainTime:rainTime(t),rainVelocity:rainVelocity(t),pose:p,cut:smooth(C.edit.closeStart,C.edit.closeEnd,t)}};
window.ready=Promise.all([assetGrain.decode().catch(()=>{}),assetGlow.decode().catch(()=>{})]).then(()=>{window.renderFrame(0);return true});
if(new URLSearchParams(location.search).has('render'))document.body.classList.add('render');
let playing=false,start=0,offset=0,last=-1;const seek=document.getElementById('seek'),btn=document.getElementById('play');
function sync(frame){seek.value=frame/30;document.getElementById('time').textContent=`00:${String(Math.floor(frame/30)).padStart(2,'0')} / 00:15`}
function tick(now){if(!playing)return;const time=offset+(now-start)/1000,frame=Math.min(449,Math.floor(time*30));if(frame!==last){renderFrame(frame);sync(frame);last=frame}if(time>=15){playing=false;btn.textContent='Repetir';return}requestAnimationFrame(tick)}
btn.onclick=()=>{playing=!playing;btn.textContent=playing?'Pausar':'Reproduzir';if(playing){offset=window.currentFrame>=449?0:window.currentFrame/30;start=performance.now();last=-1;requestAnimationFrame(tick)}};
seek.oninput=()=>{playing=false;btn.textContent='Reproduzir';const f=Math.round(Number(seek.value)*30);renderFrame(f);sync(f)};
})();
