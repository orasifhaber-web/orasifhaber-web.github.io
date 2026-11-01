import{g as r}from"./index.CzGW6FVa.js";const f={art:{core:[255,236,214],a:[150,62,168],b:[44,156,182],c:[226,160,82]},signal:{core:[246,255,226],a:[40,120,110],b:[96,200,170],c:[212,238,99]},cold:{core:[235,245,255],a:[70,60,200],b:[40,170,230],c:[170,120,255]}},A="attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }",C=`
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uOrb; uniform vec2 uVel; uniform float uR;
uniform float uEnergy; uniform float uNear; uniform vec3 uCore; uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform vec3 uBg;

// 3D simplex noise (Ashima Arts / Stefan Gustavson, MIT) — smooth, no grid artefacts
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g; vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857; vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z); vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy; vec4 y = y_ * ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0; vec4 s1 = floor(b1) * 2.0 + 1.0; vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x); vec3 p1 = vec3(a0.zw, h.y); vec3 p2 = vec3(a1.xy, h.z); vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0); m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
float fbm(vec3 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * (0.5 + 0.5 * snoise(p)); p = p * 2.02 + 7.3; a *= 0.5; } return v / 0.9375; }

void main(){
  vec2 p = (gl_FragCoord.xy - uOrb) / uR;          // orb space: the rim sits near r = 1
  float sp = length(uVel);                          // stretch a little along the motion
  if (sp > 0.001) { vec2 d = uVel / sp; float al = dot(p, d); vec2 pe = p - al * d; p = pe * (1.0 + 0.18 * sp) + d * al / (1.0 + 0.45 * sp); }
  float t = uTime;
  float r = length(p);
  float ang = atan(p.y, p.x);

  // a rim that ripples and breathes
  // two broad lobes, no fine detail, so the edge stays round and liquid rather than spiky
  float wob = 0.65 * snoise(vec3(cos(ang) * 0.9, sin(ang) * 0.9, t * 0.3)) + 0.35 * snoise(vec3(cos(ang) * 1.8, sin(ang) * 1.8, t * 0.45 + 4.0));
  float edge = 1.0 + wob * (0.1 + 0.12 * uEnergy) + 0.03 * sin(t * 1.3);
  float d = r / edge;

  // plasma folding inside (domain warping)
  vec2 q = p * 0.95;
  float n1 = fbm(vec3(q, t * 0.22));
  float n2 = fbm(vec3(q + 1.8 * n1 + vec2(1.7, 9.2), t * 0.3));
  float pl = fbm(vec3(q + 2.0 * n2, t * 0.18));

  // light: a soft volume first (core and plasma), a gentle rim second, then the halo
  float body = smoothstep(1.05, 0.2, d);
  float core = exp(-d * d * 5.0);
  float rim = exp(-pow((d - 0.95) * 5.0, 2.0));
  float halo = exp(-max(d - 0.9, 0.0) * 3.2) * smoothstep(0.6, 1.0, d);

  vec3 inner = mix(uA, uB, smoothstep(0.3, 0.75, pl));
  inner = mix(inner, uC, smoothstep(0.58, 0.9, n2) * 0.8);

  // contrast in the plasma keeps the colours deep instead of washing to white
  float pc = smoothstep(0.25, 0.85, pl);
  vec3 c = inner * (0.15 + 1.25 * pc) * body;
  c += uCore * core * (0.35 + 0.35 * uNear + 0.15 * uEnergy) * (0.5 + 0.7 * pc);
  c += mix(uB, uC, n1) * rim * (0.12 + 0.3 * uEnergy + 0.25 * uNear);
  c += mix(uA, uB, 0.5) * halo * (0.1 + 0.18 * uNear);

  // faint, smooth wisps drifting off it
  float fil = fbm(vec3(p * 1.8 + vec2(t * 0.12, -t * 0.08), t * 0.3));
  c += mix(uB, uC, fil) * smoothstep(0.55, 0.8, fil) * exp(-max(d - 0.9, 0.0) * 2.6) * smoothstep(0.85, 1.1, d) * (0.18 + 0.45 * uNear + 0.25 * uEnergy);

  c = 1.0 - exp(-c * 1.1);                          // soft tone map
  gl_FragColor = vec4(uBg + c * (1.0 - uBg), 1.0);
}`,E=matchMedia("(prefers-reduced-motion: reduce)"),c=r.utils.random,h=m=>m.map(e=>e/255);class R extends HTMLElement{params={size:.17,speed:1,energy:.6,pull:.35,palette:"art"};gl;u={};w=0;h=0;dpr=1;base={x:.35,y:.5};pos={x:.35,y:.5};vel={x:0,y:0};mouse={x:0,y:0,in:!1};near=0;t=0;running=!1;wander;ro;io;connectedCallback(){const t=this.querySelector("canvas").getContext("webgl",{antialias:!1,premultipliedAlpha:!1});if(!t){this.classList.add("is-fallback");return}this.gl=t;const s=(o,l)=>{const a=t.createShader(o);return t.shaderSource(a,l),t.compileShader(a),a},i=t.createProgram();if(t.attachShader(i,s(t.VERTEX_SHADER,A)),t.attachShader(i,s(t.FRAGMENT_SHADER,C)),t.linkProgram(i),!t.getProgramParameter(i,t.LINK_STATUS)){this.classList.add("is-fallback");return}t.useProgram(i),t.bindBuffer(t.ARRAY_BUFFER,t.createBuffer()),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW);const n=t.getAttribLocation(i,"p");t.enableVertexAttribArray(n),t.vertexAttribPointer(n,2,t.FLOAT,!1,0,0);for(const o of["uRes","uTime","uOrb","uVel","uR","uEnergy","uNear","uCore","uA","uB","uC","uBg"])this.u[o]=t.getUniformLocation(i,o);const u=getComputedStyle(this).backgroundColor.match(/\d+/g)?.slice(0,3).map(Number)??[14,14,12];if(t.uniform3fv(this.u.uBg,h(u)),this.setPalette(this.params.palette),this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(this),this.resize(),this.addEventListener("pointermove",this.onMove),this.addEventListener("pointerleave",this.onLeave),E.matches){this.t=8,this.pos={x:.5,y:.5},this.draw();return}this.next(),this.io=new IntersectionObserver(([o])=>o.isIntersecting?this.start():this.stop()),this.io.observe(this)}disconnectedCallback(){this.stop(),this.wander?.kill(),this.ro?.disconnect(),this.io?.disconnect(),this.removeEventListener("pointermove",this.onMove),this.removeEventListener("pointerleave",this.onLeave)}setPalette(e){const t=f[e]??f.art;this.params.palette=e,this.gl&&(this.gl.uniform3fv(this.u.uCore,h(t.core)),this.gl.uniform3fv(this.u.uA,h(t.a)),this.gl.uniform3fv(this.u.uB,h(t.b)),this.gl.uniform3fv(this.u.uC,h(t.c)),this.running||this.draw())}next=()=>{const t=this.base.x<.5?c(.6,.82):c(.18,.4),s=c(.36,.64);this.wander=r.to(this.base,{x:t,y:s,duration:c(3,5.2)/this.params.speed,ease:"sine.inOut",onComplete:this.next})};onMove=e=>{const t=this.getBoundingClientRect();this.mouse={x:(e.clientX-t.left)/t.width,y:(e.clientY-t.top)/t.height,in:!0}};onLeave=()=>{this.mouse.in=!1};resize(){const e=this.gl;if(!e)return;this.dpr=Math.min(devicePixelRatio||1,1.5),this.w=this.clientWidth,this.h=this.clientHeight;const t=e.canvas;t.width=Math.max(1,Math.round(this.w*this.dpr)),t.height=Math.max(1,Math.round(this.h*this.dpr)),e.viewport(0,0,t.width,t.height),this.running||this.draw()}start(){this.running||(this.running=!0,this.wander?.resume(),r.ticker.add(this.tick))}stop(){this.running&&(this.running=!1,this.wander?.pause(),r.ticker.remove(this.tick))}tick=(e,t)=>{const s=Math.min(t/1e3,.05),{speed:i,pull:n,size:u}=this.params,o=u*Math.min(this.w,this.h)/Math.max(this.w,1),l=this.mouse.x-this.base.x,a=(this.mouse.y-this.base.y)*(this.h/Math.max(this.w,1)),x=Math.hypot(l,a),p=this.mouse.in?r.utils.clamp(0,1,1-x/(o*5)):0;this.near+=(p-this.near)*(1-Math.exp(-s*3));const d=this.base.x+(this.mouse.x-this.base.x)*n*p,y=this.base.y+(this.mouse.y-this.base.y)*n*p,v=1-Math.exp(-s*3.2),g=this.pos.x,b=this.pos.y;this.pos.x+=(d-this.pos.x)*v,this.pos.y+=(y-this.pos.y)*v;const w=(this.pos.x-g)*this.w/Math.max(s,.001)/(o*this.w),z=-(this.pos.y-b)*this.h/Math.max(s,.001)/(o*this.w);this.vel.x+=(w-this.vel.x)*.15,this.vel.y+=(z-this.vel.y)*.15,this.t+=s*i*(1+this.near*1.4),this.draw()};draw(){const e=this.gl;if(!e||!this.w)return;const{size:t,energy:s}=this.params,i=t*Math.min(this.w,this.h)*this.dpr;e.uniform2f(this.u.uRes,this.w*this.dpr,this.h*this.dpr),e.uniform1f(this.u.uTime,this.t),e.uniform2f(this.u.uOrb,this.pos.x*this.w*this.dpr,(1-this.pos.y)*this.h*this.dpr),e.uniform2f(this.u.uVel,r.utils.clamp(-3,3,this.vel.x),r.utils.clamp(-3,3,this.vel.y)),e.uniform1f(this.u.uR,i),e.uniform1f(this.u.uEnergy,s),e.uniform1f(this.u.uNear,this.near),e.drawArrays(e.TRIANGLES,0,3)}}customElements.get("energy-orb")||customElements.define("energy-orb",R);
