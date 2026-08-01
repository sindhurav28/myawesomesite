/* =============================================================================
   K&S VALLEY — real 3D (Three.js) explorable tech city, Silicon-Valley themed.
   Original low-poly buildings (not copies of the show); your logo files load
   onto the sign boards. Click buildings / gates / eggs; drill into a country's
   3D map; every story opens in an in-world panel.
   ========================================================================== */
import * as THREE from 'three';
import { OrbitControls } from '../vendor/three/OrbitControls.js';

const valley = document.getElementById('valley');
const PLACES = window.PLACES, CATS = window.CATEGORIES;
const byCountry = {}; PLACES.forEach(p => { (byCountry[p.country] = byCountry[p.country] || []).push(p); });

const COUNTRY = {
  India:  { flag: '🇮🇳', color: 0xff9933, ride: '🕌' },
  USA:    { flag: '🇺🇸', color: 0x3b6fd4, ride: '🎢' },
  Canada: { flag: '🇨🇦', color: 0xe34b4b, ride: '🎡' },
  Mexico: { flag: '🇲🇽', color: 0x2fa35a, ride: '🎠' }
};
const ORDER = ['India', 'USA', 'Canada', 'Mexico'].filter(c => byCountry[c]);
const OUTLINES = {
  USA: [[-124.5,48.4],[-124,40],[-120.5,34.6],[-117.1,32.5],[-114.6,32.7],[-111,31.3],[-108,31.3],[-106.5,31.8],[-103,29],[-99.5,27.5],[-97.4,25.9],[-94,29.6],[-90,29.1],[-88,30.3],[-84,30],[-81.5,25.9],[-80.1,26.8],[-81,31],[-76.5,34.6],[-75,38],[-74,40.5],[-70.8,41.6],[-70,43.7],[-67,44.8],[-69.2,47.4],[-71.5,45],[-76.9,43.2],[-82.5,41.7],[-83.4,45.8],[-87.6,45.1],[-90,46.7],[-95,49],[-104,49],[-123,49]],
  India: [[77,35.5],[80,34],[81,30.4],[88.2,27.9],[89,26],[92,25],[95.2,27],[94,24],[92.8,22],[89,21.8],[87,21],[85,19.7],[82.5,17],[80.3,13.1],[79.8,10.3],[77.5,8.1],[76,9.5],[74.8,13],[73,16],[72.8,19.1],[70,21],[68.8,23.7],[70,24.5],[74,30],[76,32],[78,34.5]],
  Canada: [[-123,49],[-95,49],[-82,42],[-79,43],[-74,45],[-69.5,47],[-64,46],[-60,47],[-64,50.5],[-79,53],[-95,53],[-123,53]],
  Mexico: [[-117,32.5],[-108,31.3],[-103,29],[-97.4,25.9],[-97.2,20.5],[-94,18.2],[-90.5,21],[-86.8,21.4],[-88,18.5],[-92,14.5],[-96,15.6],[-104,19.5],[-110,23.5],[-114,28.5]]
};
const EGGDATA = {
  piper:   { emoji:'🥧', title:'Pied Piper', quote:'Our scrappy little startup — the best compression algorithm just squeezes 4 years and 36 destinations into one map.' },
  robot:   { emoji:'🤖', title:'Fiona', quote:'The "companion" robot. Deeply unsettling — yet still less complicated than dating was before I met you.' },
  painting:{ emoji:'🖼️', title:'The Painting', quote:'That infamous mural — briefly worth more than the whole company. Our memories, though? Priceless.', asset:'assets/painting.jpg' },
  jacket:  { emoji:'🧥', title:"Jared's Jacket", quote:'Folded with love and left behind. We just fold ours into a carry-on and go somewhere new.', asset:'assets/jacket.jpg' },
  commas:  { emoji:'🍾', title:'Tres Commas', quote:'Three commas = a billion dollars — and roughly the number of reasons I love you.', asset:'assets/tres-commas.jpg' },
  anton:   { emoji:'🖥️', title:'Anton', quote:'Anton is back online. Uptime since 2022. Zero downtime, zero regrets.' },
  middleout:{ emoji:'📦', title:'Middle-Out', quote:'Peak efficiency, discovered... creatively. Weissman score: 5.2. (iykyk)' },
  hotdog:  { emoji:'🌭', title:'Not Hotdog', quote:'SeeFood™ says: 🌭 → HOTDOG ✅ (it only knows two things, much like me before I met you).' }
};

/* ---------------- renderer / scene / camera ---------------- */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.domElement.id = 'world3d';
valley.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const DAY = { sky: 0x9fd3f0, fog: 0xbfe4f5, ground: 0x8fb96a, amb: 0.85 };
const NIGHT = { sky: 0x0a1c30, fog: 0x0a1c30, ground: 0x24405c, amb: 0.5 };
let themeCol = DAY;
scene.background = new THREE.Color(themeCol.sky);
scene.fog = new THREE.Fog(themeCol.fog, 560, 1600);

let camera, controls;
function makeCamera() {
  const w = valley.clientWidth, h = valley.clientHeight, aspect = w / h, view = 210;
  camera = new THREE.OrthographicCamera(-view*aspect/2, view*aspect/2, view/2, -view/2, -600, 1400);
  camera.position.set(180, 190, 180);
  camera.lookAt(0, 0, 0);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.minPolarAngle = 0.05; controls.maxPolarAngle = Math.PI - 0.06; // allow going under the island
  controls.minZoom = 0.5; controls.maxZoom = 4; controls.zoomSpeed = 0.9;
  controls.target.set(0, 8, 0);
}
makeCamera();

/* ---------------- lights ---------------- */
const hemi = new THREE.HemisphereLight(0xffffff, 0x9fb08f, themeCol.amb);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2df, 1.15);
sun.position.set(120, 200, 90);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
const sc = sun.shadow.camera;
sc.left = -260; sc.right = 260; sc.top = 260; sc.bottom = -260; sc.near = 1; sc.far = 700;
sun.shadow.bias = -0.0005;
scene.add(sun);
scene.add(new THREE.AmbientLight(0xffffff, 0.15));

/* ---------------- helpers ---------------- */
function windowTexture(base, glass) {
  const c = document.createElement('canvas'); c.width = 64; c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, 64, 64);
  g.fillStyle = glass;
  for (let y = 6; y < 64; y += 12) for (let x = 6; x < 64; x += 12) g.fillRect(x, y, 8, 8);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
function solarTexture() {
  const c = document.createElement('canvas'); c.width = 64; c.height = 64;
  const g = c.getContext('2d'); g.fillStyle = '#1a2740'; g.fillRect(0,0,64,64);
  g.strokeStyle = '#3a5580'; g.lineWidth = 2;
  for (let i = 0; i <= 64; i += 10) { g.beginPath(); g.moveTo(i,0); g.lineTo(i,64); g.moveTo(0,i); g.lineTo(64,i); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
const SOLAR = solarTexture();
const winCache = {};
function winMat(base, glass) {
  const k = base + glass; if (winCache[k]) return winCache[k];
  const tex = windowTexture(base, glass);
  const m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, metalness: 0.15 });
  winCache[k] = m; return m;
}
function hexStr(n) { return '#' + n.toString(16).padStart(6, '0'); }

function boxMesh(w, h, d, mat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.castShadow = true; m.receiveShadow = true; return m;
}
function roofProps(group, w, d, topY, color) {
  const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.8 });
  for (let i = 0; i < 2; i++) {
    const s = 3 + Math.random() * 2, ac = boxMesh(s, 2.5, s, mat);
    ac.position.set((Math.random()-0.5)*w*0.5, topY + 1.25, (Math.random()-0.5)*d*0.5);
    group.add(ac);
  }
}

/* building archetypes → THREE.Group with base at y=0, centered on x/z */
function bTower(w, h, d, base, glass) {
  const g = new THREE.Group();
  const wm = winMat(hexStr(base), glass);
  const b = boxMesh(w, h, d, wm); b.position.y = h/2;
  b.material.map.repeat.set(Math.max(2,w/6), Math.max(3,h/6));
  g.add(b);
  const cap = boxMesh(w*1.02, 2, d*1.02, new THREE.MeshStandardMaterial({ color: base, roughness: 0.7 })); cap.position.y = h; g.add(cap);
  roofProps(g, w, d, h, 0x8a97a5);
  return g;
}
function bLowSolar(w, h, d, base) {
  const g = new THREE.Group();
  const wm = winMat(hexStr(base), 'rgba(220,235,255,0.9)');
  const b = boxMesh(w, h, d, wm); b.position.y = h/2; b.material.map.repeat.set(w/6, Math.max(2,h/5)); g.add(b);
  const roof = boxMesh(w*0.86, 0.6, d*0.86, new THREE.MeshStandardMaterial({ map: SOLAR, roughness: 0.4, metalness: 0.3 }));
  roof.material.map.repeat.set(w/5, d/5); roof.position.y = h + 0.4; g.add(roof);
  roofProps(g, w, d, h, 0x8a97a5);
  return g;
}
function bSetback(w, h, d, base, glass) {
  const g = new THREE.Group();
  const lv = 3;
  for (let i = 0; i < lv; i++) {
    const f = 1 - i * 0.24, hh = h/lv;
    const b = boxMesh(w*f, hh, d*f, winMat(hexStr(base), glass));
    b.material.map.repeat.set(Math.max(2,w*f/6), Math.max(2,hh/6));
    b.position.y = hh*i + hh/2; g.add(b);
  }
  roofProps(g, w*0.5, d*0.5, h, 0x8a97a5);
  return g;
}
function bPodium(w, h, d, base, glass) {
  const g = new THREE.Group();
  const ph = h*0.26;
  const pod = boxMesh(w, ph, d, winMat(hexStr(base), glass)); pod.material.map.repeat.set(w/6,2); pod.position.y = ph/2; g.add(pod);
  const tw = w*0.5, th = h*0.74;
  const tow = boxMesh(tw, th, tw, winMat(hexStr(base), glass)); tow.material.map.repeat.set(2, th/6); tow.position.y = ph + th/2; g.add(tow);
  roofProps(g, tw, tw, ph+th, 0x8a97a5);
  return g;
}
function bRing(w, h, d, base) {
  const g = new THREE.Group();
  const r = Math.min(w,d)/2;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(r, h*0.5, 12, 40), new THREE.MeshStandardMaterial({ color: base, roughness: 0.35, metalness: 0.4 }));
  ring.rotation.x = Math.PI/2; ring.position.y = h*0.6; ring.castShadow = true; ring.receiveShadow = true; g.add(ring);
  const court = new THREE.Mesh(new THREE.CircleGeometry(r*0.7, 32), new THREE.MeshStandardMaterial({ color: 0x6fae5a })); court.rotation.x = -Math.PI/2; court.position.y = 0.2; g.add(court);
  return g;
}
function bDome(w, h, d, base, glass) {
  const g = new THREE.Group();
  const body = boxMesh(w, h*0.7, d, winMat(hexStr(base), glass)); body.material.map.repeat.set(w/6, h*0.7/6); body.position.y = h*0.35; g.add(body);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(Math.min(w,d)*0.42, 24, 12, 0, Math.PI*2, 0, Math.PI/2), new THREE.MeshStandardMaterial({ color: base, roughness: 0.4, metalness: 0.3 }));
  dome.position.y = h*0.7; dome.castShadow = true; g.add(dome);
  return g;
}
const ARCH = { tower: bTower, low: bLowSolar, setback: bSetback, podium: bPodium, ring: bRing, dome: bDome };

/* text/logo sign */
function nameTexture(name) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64;
  const g = c.getContext('2d'); g.fillStyle = '#ffffff'; g.fillRect(0,0,256,64);
  g.fillStyle = '#14243a'; g.font = 'bold 34px Poppins, Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(name, 128, 34, 240);
  return new THREE.CanvasTexture(c);
}
function makeSign(name, slug, w) {
  const g = new THREE.Group();
  const sw = Math.max(16, Math.min(w * 1.1, 30)), sh = sw * 0.28;
  const panelMat = new THREE.MeshStandardMaterial({ map: nameTexture(name), roughness: 0.7 });
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh), panelMat);
  panel.position.y = sh/2; g.add(panel);
  const post = boxMesh(1.2, 6, 1.2, new THREE.MeshStandardMaterial({ color: 0x9aa4b0 }));
  post.position.y = -3; g.add(post);
  g.position.y = 6;
  if (slug) {
    new THREE.TextureLoader().load('assets/logos/' + slug + '.png',
      (tex) => { tex.colorSpace = THREE.SRGBColorSpace; panelMat.map = tex; panelMat.needsUpdate = true; },
      undefined, () => {});
  }
  return g;
}

function emojiSprite(emoji, size) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'); g.font = '96px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(emoji, 64, 72);
  const tex = new THREE.CanvasTexture(c);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
  sp.scale.set(size, size, 1); return sp;
}

function tree(x, z) {
  const g = new THREE.Group();
  const trunk = boxMesh(1.4, 5, 1.4, new THREE.MeshStandardMaterial({ color: 0x7a5230 })); trunk.position.y = 2.5; g.add(trunk);
  const f = new THREE.Mesh(new THREE.ConeGeometry(4.5, 9, 8), new THREE.MeshStandardMaterial({ color: 0x3f8f43, flatShading: true }));
  f.position.y = 9; f.castShadow = true; g.add(f);
  g.position.set(x, 0, z); return g;
}
function carAt(x, z, col, rot) {
  const g = new THREE.Group();
  const body = boxMesh(6, 2.4, 3, new THREE.MeshStandardMaterial({ color: col, roughness: 0.4, metalness: 0.3 })); body.position.y = 1.4; g.add(body);
  const cab = boxMesh(3, 1.6, 2.6, new THREE.MeshStandardMaterial({ color: 0xdfe8f0, roughness: 0.2 })); cab.position.set(-0.4, 3, 0); g.add(cab);
  g.position.set(x, 0, z); g.rotation.y = rot || 0; return g;
}

/* ---------------- groups ---------------- */
const cityGroup = new THREE.Group(); scene.add(cityGroup);
const countryGroup = new THREE.Group(); countryGroup.visible = false; scene.add(countryGroup);
const pickables = [];
function addPick(obj) { pickables.push(obj); }

/* ground */
function buildGround() {
  // floating island: grass-topped slab + a chunky earth underside
  const grassMat = new THREE.MeshStandardMaterial({ color: 0x7bbf5c, roughness: 1 });
  const dirtMat = new THREE.MeshStandardMaterial({ color: 0x7a5a3a, roughness: 1 });
  const slab = new THREE.Mesh(new THREE.BoxGeometry(540, 30, 540), [dirtMat,dirtMat,grassMat,dirtMat,dirtMat,dirtMat]);
  slab.position.y = -15; slab.receiveShadow = true; slab.castShadow = true; cityGroup.add(slab);
  const chunk = new THREE.Mesh(new THREE.ConeGeometry(360, 240, 8), new THREE.MeshStandardMaterial({ color: 0x6b4d30, roughness: 1, flatShading: true }));
  chunk.rotation.x = Math.PI; chunk.position.y = -150; chunk.receiveShadow = true; cityGroup.add(chunk);
  // block plazas (concrete) + roads (asphalt grid)
  const road = new THREE.MeshStandardMaterial({ color: 0x3e444d, roughness: 1 });
  const plaza = new THREE.MeshStandardMaterial({ color: 0xc9ced6, roughness: 1 });
  const GAP = 66; // block spacing
  for (let i = -2; i <= 2; i++) {
    const rH = new THREE.Mesh(new THREE.PlaneGeometry(600, 16), road); rH.rotation.x = -Math.PI/2; rH.position.set(0, 0.05, i*GAP); rH.receiveShadow = true; cityGroup.add(rH);
    const rV = new THREE.Mesh(new THREE.PlaneGeometry(16, 600), road); rV.rotation.x = -Math.PI/2; rV.position.set(i*GAP, 0.05, 0); rV.receiveShadow = true; cityGroup.add(rV);
  }
  // plaza pads under each block
  for (let bx = -1.5; bx <= 1.5; bx++) for (let bz = -1.5; bz <= 1.5; bz++) {
    const pad = new THREE.Mesh(new THREE.PlaneGeometry(46, 46), plaza); pad.rotation.x = -Math.PI/2; pad.position.set(bx*GAP, 0.1, bz*GAP); pad.receiveShadow = true; cityGroup.add(pad);
  }
}

/* place a building group + sign, register interactivity */
function placeBuilding(b) {
  const g = new THREE.Group();
  const model = (ARCH[b.arch] || bTower)(b.w, b.h, b.d, b.color, b.glass || 'rgba(210,230,255,0.85)');
  g.add(model);
  const sign = makeSign(b.name, b.slug, b.w); sign.position.set(0, b.h + 3, b.d/2 + 3); g.add(sign);
  g.position.set(b.x, 0, b.z);
  g.userData = { act: b.act, tip: b.tip || b.name };
  cityGroup.add(g); addPick(g);
  return g;
}

function buildCity() {
  buildGround();
  const G = 66;
  const B = [
    { bx:-1.5, bz:-1.5, w:22, h:70, d:22, color:0x2f6fd0, arch:'tower', name:'Hooli', slug:'hooli', glass:'rgba(190,220,255,0.9)', tip:'Hooli', quip:'Making the world a better place. (We beat them to it.)' },
    { bx:-0.5, bz:-1.5, w:38, h:20, d:26, color:0x3b5998, arch:'low', name:'Facebook', slug:'facebook', quip:'Move fast. Collect memories.' },
    { bx:0.5,  bz:-1.5, w:24, h:66, d:24, color:0xc74634, arch:'setback', name:'Oracle', slug:'oracle', quip:'Enterprise-grade romance since 2022.' },
    { bx:1.5,  bz:-1.5, w:22, h:60, d:22, color:0xff3b30, arch:'podium', name:'YouTube', slug:'youtube', quip:'Now streaming: our home movies.' },
    { bx:-1.5, bz:-0.5, w:22, h:44, d:22, color:0x1da1f2, arch:'tower', name:'Twitter', slug:'twitter', quip:"280 characters can't hold this story." },
    { bx:-0.5, bz:-0.5, w:34, h:96, d:34, color:0x22c07a, arch:'tower', name:'PIED PIPER HQ', glass:'rgba(200,255,225,0.92)', hq:true, tip:'open the birthday launch 🎂' },
    { bx:0.5,  bz:-0.5, w:40, h:18, d:28, color:0x4285F4, arch:'low', name:'Google', slug:'google', quip:"We indexed every place we've been." },
    { bx:1.5,  bz:-0.5, w:16, h:52, d:16, color:0xa06bff, arch:'tower', name:'TRACTION', stats:true, tip:'the numbers →' },
    { bx:-1.5, bz:0.5,  w:34, h:16, d:34, color:0xb9bec8, arch:'ring', name:'Apple', slug:'apple', quip:'Designed in K&S Valley.' },
    { bx:-0.5, bz:0.5,  w:22, h:40, d:22, color:0xb81d24, arch:'tower', name:'Netflix', slug:'netflix', quip:'Are you still watching... our adventures?' },
    { bx:0.5,  bz:0.5,  w:26, h:34, d:26, color:0x37474f, arch:'dome', name:'Theranos', quip:'One drop of blood, a thousand memories. (Results may vary.)' },
    { bx:1.5,  bz:0.5,  w:20, h:46, d:20, color:0x232f3e, arch:'setback', name:'Amazon', slug:'amazon', quip:'One-day shipping to your heart.' },
    { bx:-1.5, bz:1.5,  w:20, h:36, d:20, color:0xff2fa0, arch:'tower', name:'Lyft', slug:'lyft', quip:'Pink mustache, big adventures.' },
    { bx:-0.5, bz:1.5,  w:20, h:50, d:20, color:0x0b0b0b, arch:'tower', name:'Uber', slug:'uber', quip:'Your ride to everywhere, together.' },
    { bx:0.5,  bz:1.5,  w:24, h:20, d:24, color:0x25d366, arch:'low', name:'WhatsApp', slug:'whatsapp', quip:'Read receipts on since day one. 💚' },
    { bx:1.5,  bz:1.5,  w:22, h:30, d:22, color:0xff8a3d, arch:'dome', name:'Dropbox', slug:'dropbox', quip:'Everything backed up. Especially the memories.' }
  ];
  B.forEach(b => {
    b.x = b.bx * G; b.z = b.bz * G;
    b.act = b.hq ? openMessage : b.stats ? openStats : (() => KNS.toast('🏢 ' + b.name, b.quip || 'Making the world a better place. 🚀'));
    placeBuilding(b);
  });

  // trees + cars along the roads/plaza edges
  for (let i = 0; i < 46; i++) {
    const gx = (Math.random()*5-2.5)|0, gz = (Math.random()*5-2.5)|0;
    const x = gx*G + (Math.random()<0.5?-27:27), z = gz*G + (Math.random()-0.5)*40;
    if (Math.abs(x) < 300 && Math.abs(z) < 300) cityGroup.add(tree(x, z));
  }
  const carCols = [0xd64545,0x4571d6,0xe0a030,0xffffff,0x333333,0x35a35a];
  for (let i = -2; i <= 2; i++) for (let k = 0; k < 2; k++) {
    cityGroup.add(carAt(i*G + (k?18:-18), (Math.random()*4-2)*G, carCols[(i+k+5)%carCols.length], 0));
  }

  // country gateways around the campus
  const gpos = { India:[0,-2.6*G], USA:[2.6*G,0], Canada:[-2.6*G,0], Mexico:[0,2.6*G] };
  ORDER.forEach(c => { const p = gpos[c] || [0,-2.6*G]; buildGate(c, p[0], p[1]); });

  // easter eggs as floating sprites
  const epos = { piper:[-0.5*G,-0.5*G,110], robot:[0.5*G,0.5*G,10], painting:[-1.5*G,0.5*G,20], jacket:[-1.5*G,-0.5*G,12],
    commas:[1.5*G,-0.5*G,10], anton:[-0.5*G,-1.5*G,14], middleout:[0.5*G,-0.5*G,10], hotdog:[-1.5*G,1.5*G,10] };
  Object.keys(EGGDATA).forEach(id => {
    const p = epos[id] || [0,0,12]; const sp = emojiSprite(EGGDATA[id].emoji, 12);
    sp.position.set(p[0], p[2], p[1]); sp.userData = { act: () => revealEgg(id), tip: 'a curious thing…' };
    cityGroup.add(sp); addPick(sp);
  });
}

function buildGate(country, x, z) {
  const g = new THREE.Group(); const m = COUNTRY[country], col = m.color;
  const pmat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.6 });
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(26, 28, 3, 6), new THREE.MeshStandardMaterial({ color: col, roughness: 0.8 }));
  pad.position.y = 1.5; pad.receiveShadow = true; g.add(pad);
  [-16, 16].forEach(px => { const post = boxMesh(4, 30, 4, pmat); post.position.set(px, 15, 0); g.add(post); });
  const beam = boxMesh(40, 5, 5, pmat); beam.position.set(0, 32, 0); g.add(beam);
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(38, 10), new THREE.MeshStandardMaterial({ map: nameTexture(country + ' · ' + byCountry[country].length), roughness: 0.7 }));
  banner.position.set(0, 32, 3); g.add(banner);
  const ride = emojiSprite(m.ride, 20); ride.position.set(0, 16, 0); g.add(ride);
  const flag = emojiSprite(m.flag, 12); flag.position.set(16, 40, 0); g.add(flag);
  g.position.set(x, 0, z);
  g.userData = { act: () => showCountry(country), tip: 'enter ' + country + ' 🎢' };
  cityGroup.add(g); addPick(g);
}

/* ---------------- country 3D relief ---------------- */
let lmap = null, lmarkers = [];
function showCountry(name) {
  cityGroup.visible = false;
  const el = document.getElementById('countrymap'); el.style.display = 'block';
  const m = COUNTRY[name], places = byCountry[name];
  if (window.L) {
    if (!lmap) {
      lmap = window.L.map('countrymap', { zoomControl: true });
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { subdomains: 'abcd', maxZoom: 19, attribution: '© OpenStreetMap © CARTO' }).addTo(lmap);
    }
    lmarkers.forEach(mk => lmap.removeLayer(mk)); lmarkers = [];
    const bounds = [];
    places.forEach(p => {
      const icon = window.L.divIcon({ className: '', html: '<div class="lpin">' + p.emoji + '</div>', iconSize: [36,36], iconAnchor: [18,36] });
      const mk = window.L.marker(p.coords, { icon }).addTo(lmap);
      mk.on('click', () => openPlace(p));
      mk.bindTooltip(p.name + ' · ' + p.date);
      lmarkers.push(mk); bounds.push(p.coords);
    });
    setTimeout(() => { lmap.invalidateSize(); if (bounds.length) lmap.fitBounds(bounds, { padding: [70,70], maxZoom: 8 }); }, 60);
  }
  document.getElementById('scene-title').textContent = name + ' ' + m.flag;
  document.getElementById('breadcrumb').textContent = 'K&S Valley › ' + name + ' · tap a pin (real map)';
  document.getElementById('valley-back').hidden = false;
}
function showCity() {
  const cm = document.getElementById('countrymap'); if (cm) cm.style.display = 'none';
  cityGroup.visible = true;
  pickables.length = 0; cityGroup.traverse(o => { if (o.userData && o.userData.act) pickables.push(o); });
  document.getElementById('scene-title').innerHTML = 'K&amp;S Valley 🥧';
  document.getElementById('breadcrumb').textContent = 'drag to explore · enter a country · find the secrets';
  document.getElementById('valley-back').hidden = true;
  controls.target.set(0, 8, 0);
}
document.getElementById('valley-back').addEventListener('click', showCity);

/* ---------------- raycast interaction ---------------- */
const ray = new THREE.Raycaster(); const ptr = new THREE.Vector2();
let downX = 0, downY = 0, downT = 0;
function setPtr(e) { const r = renderer.domElement.getBoundingClientRect(); ptr.x = ((e.clientX-r.left)/r.width)*2-1; ptr.y = -((e.clientY-r.top)/r.height)*2+1; }
function pick() { ray.setFromCamera(ptr, camera); const hits = ray.intersectObjects(pickables, true); for (const h of hits) { let o = h.object; while (o) { if (o.userData && o.userData.act) return o; o = o.parent; } } return null; }
renderer.domElement.addEventListener('pointerdown', e => { downX = e.clientX; downY = e.clientY; downT = Date.now(); });
renderer.domElement.addEventListener('pointerup', e => {
  if (Math.abs(e.clientX-downX) + Math.abs(e.clientY-downY) > 6 || Date.now()-downT > 400) return;
  setPtr(e); const o = pick(); if (o && o.userData.act) o.userData.act();
});
let tipEl;
renderer.domElement.addEventListener('pointermove', e => {
  setPtr(e); const o = pick();
  renderer.domElement.style.cursor = o ? 'pointer' : 'grab';
  if (!tipEl) { tipEl = document.createElement('div'); tipEl.className = 'wtip'; document.body.appendChild(tipEl); }
  if (o && o.userData.tip) { tipEl.textContent = o.userData.tip; tipEl.classList.add('show'); tipEl.style.left = e.clientX+'px'; tipEl.style.top = e.clientY+'px'; }
  else tipEl.classList.remove('show');
});

/* ---------------- panels (HTML overlays) ---------------- */
const panel = document.getElementById('panel'), panelBody = document.getElementById('panel-body');
document.getElementById('panel-close').addEventListener('click', closePanel);
panel.addEventListener('click', e => { if (e.target === panel) closePanel(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
function openPanel(html) { panelBody.innerHTML = html; panel.hidden = false; panel.classList.add('open'); panelBody.parentElement.scrollTop = 0; }
function closePanel() { panel.classList.remove('open'); panel.hidden = true; }
function openMessage() { const tpl = document.getElementById('tpl-message'); panelBody.innerHTML = ''; panelBody.appendChild(tpl.content.cloneNode(true)); panel.hidden = false; panel.classList.add('open'); }
function revealEgg(id) {
  const e = EGGDATA[id];
  const img = e.asset ? '<img class="egg-img" src="' + e.asset + '" alt="' + e.title + '" onerror="this.remove();var f=document.getElementById(\'egg-fb\');if(f)f.style.display=\'flex\'">' : '';
  const fb = '<div id="egg-fb" class="egg-fb"' + (e.asset ? ' style="display:none"' : '') + '><div class="egg-fb-emoji">' + e.emoji + '</div>' + (e.asset ? '<div class="egg-fb-note">drop the real still at <b>' + e.asset + '</b></div>' : '') + '</div>';
  openPanel('<div class="egg-reveal"><h2 class="panel-h">🥚 ' + e.title + '</h2>' + img + fb + '<p class="egg-quote">' + e.quote + '</p></div>');
  if (window.KNS && window.KNS.collect) window.KNS.collect(id);
}
function escapeHtml(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function openPlace(p) {
  const idx = PLACES.indexOf(p), list = byCountry[p.country], li = list.indexOf(p);
  const coords = p.coords[0].toFixed(3) + '°, ' + p.coords[1].toFixed(3) + '°';
  const utc = Math.round(p.coords[1]/15), utcS = 'UTC' + (utc>=0?'+'+utc:utc);
  const prev = PLACES[idx-1], leg = prev ? Math.round(window.haversineMiles(prev.coords, p.coords)) : 0;
  const cat = (CATS[p.category]||{}).label || p.category;
  let photos; if (p.photos && p.photos.length) photos = p.photos.map(f => '<img loading="lazy" src="photos/'+p.id+'/'+f+'" alt="'+p.name+'">').join('');
  else { const ph = '<div class="photo-placeholder"><div class="big">📷</div>drop photos in<br><b>photos/'+p.id+'/</b></div>'; photos = ph+ph; }
  const nav = (li>0?'<button class="pd-navb" data-go="'+list[li-1].id+'">← '+list[li-1].name+'</button>':'<span></span>') +
              (li<list.length-1?'<button class="pd-navb next" data-go="'+list[li+1].id+'">'+list[li+1].name+' →</button>':'<span></span>');
  openPanel('<div class="pd"><div class="pd-emoji">'+p.emoji+'</div><h2>'+p.name+'</h2><div class="pd-meta">'+p.date+' · '+coords+'</div>' +
    '<div class="badges"><span class="badge">stop <b>#'+(idx+1)+'</b>/'+PLACES.length+'</span><span class="badge">'+p.region+'</span><span class="badge">'+cat+'</span><span class="badge">tz <b>'+utcS+'</b></span>' +
    (prev?'<span class="badge"><b>'+leg.toLocaleString()+'</b> mi from prev</span>':'<span class="badge">the beginning ✦</span>')+'</div>' +
    '<div class="memory-card">'+escapeHtml(p.memory)+'</div><div class="gallery">'+photos+'</div><div class="pd-nav">'+nav+'</div></div>');
  panelBody.querySelectorAll('.pd-navb').forEach(b => b.addEventListener('click', () => { const np = PLACES.find(x=>x.id===b.getAttribute('data-go')); if (np) openPlace(np); }));
  panelBody.querySelectorAll('.gallery img').forEach(img => img.addEventListener('click', () => window.open(img.src,'_blank')));
}
function openStats() {
  const countries = new Set(PLACES.map(p=>p.country)), regions = new Set(PLACES.map(p=>p.region));
  const parks = (window.NATIONAL_PARKS||[]).length;
  const years = new Date().getFullYear() - parseInt(PLACES[0].sort.slice(0,4),10);
  const miles = Math.floor(window.totalJourneyMiles/100)*100;
  const counts = {}; PLACES.forEach(p=>{ const y=p.sort.slice(0,4); counts[y]=(counts[y]||0)+1; });
  const yrs = Object.keys(counts).sort(), max = Math.max.apply(null, yrs.map(y=>counts[y]));
  const cards = [[PLACES.length,'Markets Entered'],[countries.size,'Global Reach'],[parks+'+','Parks Shipped'],[regions.size+'+','Regions Scaled'],[years+'+','Runway (yrs)'],[miles.toLocaleString()+'+','Distance (mi)']]
    .map(c=>'<div class="stat"><div class="num">'+c[0]+'</div><div class="label">'+c[1]+'</div></div>').join('');
  const bars = yrs.map(y=>'<div class="chart-col"><div class="chart-bar" style="height:'+(counts[y]/max*100)+'%"><span class="cval">'+counts[y]+'</span></div><div class="chart-year">'+y+'</div></div>').join('');
  openPanel('<h2 class="panel-h">Traction 📈</h2><div class="stats compact">'+cards+'</div><h3 class="panel-h3">Hockey-Stick Growth</h3><div class="chart">'+bars+'</div>');
}

/* birthday CTA */
const cta = document.createElement('button'); cta.className = 'valley-cta'; cta.type = 'button'; cta.innerHTML = '🎂 Happy Birthday to you, Kiran! — <b>click here</b>';
cta.addEventListener('click', openMessage); valley.appendChild(cta);

/* zoom buttons */
document.getElementById('vz-in').addEventListener('click', () => { camera.zoom = Math.min(4, camera.zoom*1.2); camera.updateProjectionMatrix(); });
document.getElementById('vz-out').addEventListener('click', () => { camera.zoom = Math.max(0.5, camera.zoom*0.83); camera.updateProjectionMatrix(); });
document.getElementById('vz-reset').addEventListener('click', () => { camera.zoom = 1; camera.position.set(180,190,180); controls.target.set(0,8,0); camera.updateProjectionMatrix(); });

/* theme (day/night) */
window.onThemeChange = (t) => {
  themeCol = t === 'dark' ? NIGHT : DAY;
  scene.background.set(themeCol.sky); scene.fog.color.set(themeCol.fog);
  hemi.intensity = themeCol.amb; hemi.groundColor.set(themeCol.ground);
  sun.intensity = t === 'dark' ? 0.4 : 1.15;
};
if (document.documentElement.getAttribute('data-theme') === 'dark') window.onThemeChange('dark');

/* resize */
function onResize() {
  const w = valley.clientWidth, h = valley.clientHeight, aspect = w/h, view = 210;
  camera.left = -view*aspect/2; camera.right = view*aspect/2; camera.top = view/2; camera.bottom = -view/2;
  camera.updateProjectionMatrix(); renderer.setSize(w, h);
}
window.addEventListener('resize', onResize);

/* build + run */
buildCity(); showCity(); onResize();
window.__world = { scene, camera, showCountry, showCity, pickables };
renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });
