// ======== ENGINE & RENDERING ========
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const VW = 800, VH = 600;
let scale = 1, offsetX = 0, offsetY = 0;

function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    const r = Math.min(canvas.width / VW, canvas.height / VH);
    scale = r; offsetX = (canvas.width - VW * r) / 2; offsetY = (canvas.height - VH * r) / 2;
}
window.addEventListener('resize', resize); resize();

function toWorld(px, py) {
    const rect = canvas.getBoundingClientRect();
    const cx = (px - rect.left) * devicePixelRatio, cy = (py - rect.top) * devicePixelRatio;
    return { x: (cx - offsetX) / scale, y: (cy - offsetY) / scale };
}

// ---- Colors & Utils ----
function hexToRgb(h) {
    const r = parseInt(h.slice(1,3),16), g = parseInt(h.slice(3,5),16), b = parseInt(h.slice(5,7),16);
    return [r,g,b];
}
function rgbToHex(r,g,b) {
    return '#' + [r,g,b].map(c => Math.max(0,Math.min(255,Math.round(c))).toString(16).padStart(2,'0')).join('');
}
function lerpColor(a, b, t) {
    const ca = hexToRgb(a), cb = hexToRgb(b);
    return rgbToHex(ca[0]+(cb[0]-ca[0])*t, ca[1]+(cb[1]-ca[1])*t, ca[2]+(cb[2]-ca[2])*t);
}
function randInt(a,b) { return Math.floor(Math.random()*(b-a+1))+a; }
function randPick(arr) { return arr[randInt(0, arr.length-1)]; }

// ---- Sound ----
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(freq, dur, type='sine', vol=0.15) {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + dur);
}
function sndApply() { playTone(880, 0.15); setTimeout(()=>playTone(1100,0.12), 80); }
function sndWarn() { playTone(300, 0.3, 'square', 0.08); }
function sndWin() { [0,100,200,300].forEach((d,i) => setTimeout(()=>playTone(523+i*100,0.2),d)); }
function sndClick() { playTone(660, 0.08, 'sine', 0.1); }

// ---- Background Rendering ----
function drawBackground(time, uvIndex) {
    // Sky
    const skyG = ctx.createLinearGradient(0, 0, 0, VH * 0.45);
    skyG.addColorStop(0, '#4A90D9'); skyG.addColorStop(1, '#87CEEB');
    ctx.fillStyle = skyG; ctx.fillRect(0, 0, VW, VH * 0.45);

    // Clouds
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    [[100,60,40],[300,40,35],[550,70,30],[700,50,25]].forEach(([cx,cy,r]) => {
        const dx = (time * 0.01 + cx) % (VW + 100) - 50;
        ctx.beginPath();
        ctx.arc(dx, cy, r, 0, Math.PI*2);
        ctx.arc(dx+r*0.7, cy-r*0.3, r*0.7, 0, Math.PI*2);
        ctx.arc(dx-r*0.5, cy-r*0.1, r*0.6, 0, Math.PI*2);
        ctx.fill();
    });

    // Sun
    const sunX = 680, sunY = 70, sunR = 45;
    const sunG = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 3);
    sunG.addColorStop(0, 'rgba(255,255,100,0.6)'); sunG.addColorStop(1, 'rgba(255,255,100,0)');
    ctx.fillStyle = sunG; ctx.fillRect(sunX - sunR*3, sunY - sunR*3, sunR*6, sunR*6);
    ctx.fillStyle = '#FFE44D';
    ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#FFF8B0';
    ctx.beginPath(); ctx.arc(sunX, sunY, sunR*0.6, 0, Math.PI*2); ctx.fill();

    // Sun rays
    ctx.save(); ctx.translate(sunX, sunY); ctx.rotate(time * 0.001);
    ctx.strokeStyle = 'rgba(255,230,100,0.4)'; ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI/6);
        ctx.beginPath(); ctx.moveTo(sunR+5, 0); ctx.lineTo(sunR+20+Math.sin(time*0.003+i)*5, 0); ctx.stroke();
    }
    ctx.restore();

    // Ocean
    const oceanY = VH * 0.42;
    const oG = ctx.createLinearGradient(0, oceanY, 0, VH * 0.55);
    oG.addColorStop(0, '#1A8FBF'); oG.addColorStop(1, '#0E6F9E');
    ctx.fillStyle = oG; ctx.fillRect(0, oceanY, VW, VH * 0.13);
    // Waves
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2;
    for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        for (let x = 0; x <= VW; x += 5) {
            const wy = oceanY + 10 + w * 15 + Math.sin(x * 0.02 + time * 0.002 + w) * 4;
            x === 0 ? ctx.moveTo(x, wy) : ctx.lineTo(x, wy);
        }
        ctx.stroke();
    }

    // Beach
    const beachY = VH * 0.52;
    const bG = ctx.createLinearGradient(0, beachY, 0, VH);
    bG.addColorStop(0, '#F5DEB3'); bG.addColorStop(0.5, '#E8D5A0'); bG.addColorStop(1, '#D4C090');
    ctx.fillStyle = bG; ctx.fillRect(0, beachY, VW, VH - beachY);

    // Sand dots
    ctx.fillStyle = 'rgba(180,160,120,0.3)';
    for (let i = 0; i < 50; i++) {
        const sx = (i * 137.5 + 23) % VW, sy = beachY + 10 + (i * 73.7) % (VH - beachY - 20);
        ctx.fillRect(sx, sy, 2, 2);
    }

    // Palm tree
    drawPalm(60, beachY + 10, time);
    drawPalm(740, beachY + 5, time);

    // UV Rays
    drawUVRays(time, uvIndex);
}

function drawPalm(px, py, t) {
    ctx.fillStyle = '#8B6914'; ctx.strokeStyle = '#7A5C10'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(px-6, py); ctx.lineTo(px+6, py);
    ctx.lineTo(px+3, py-90); ctx.lineTo(px-3, py-90); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#228B22';
    for (let i = 0; i < 5; i++) {
        ctx.save(); ctx.translate(px, py - 90);
        ctx.rotate(-0.8 + i * 0.4 + Math.sin(t*0.002+i)*0.05);
        ctx.beginPath(); ctx.ellipse(30, 0, 35, 8, 0.2, 0, Math.PI*2); ctx.fill();
        ctx.restore();
    }
}

function drawUVRays(time, uvIndex) {
    const intensity = Math.min(uvIndex / 11, 1);
    const count = Math.floor(8 + intensity * 15);
    ctx.save();
    for (let i = 0; i < count; i++) {
        const x = (i * 97.3 + time * 0.05) % VW;
        const alpha = 0.06 + intensity * 0.1 + Math.sin(time*0.005+i)*0.03;
        ctx.strokeStyle = `rgba(180,100,255,${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 8]);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 20, VH * 0.55 + (i % 5) * 20);
        ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();
}

// ---- Character Drawing ----
const SKINS = ['#FFDBB4','#EDB98A','#C68642','#8D5524','#5C3317'];
const HAIRS = ['#2C1B0E','#5A3214','#8B6914','#D4A030','#C0392B','#E67E22','#1a1a1a'];
const SWIMS = ['#E74C3C','#3498DB','#2ECC71','#9B59B6','#F39C12','#1ABC9C','#E91E63','#FF6B35'];

function createChar(x, y, pose) {
    return {
        x, y, pose: pose || 'standing',
        skin: randPick(SKINS), hair: randPick(HAIRS), swim: randPick(SWIMS),
        gender: Math.random() > 0.5 ? 'M' : 'F',
        child: Math.random() > 0.75,
        sunburn: 0,
        hasSunscreen: false, hasHat: false, hasGlasses: false, underShade: false,
        protectionLevel: 0,
        animOffset: Math.random() * 1000
    };
}

function burnColor(skin, burn) { return lerpColor(skin, '#FF3333', Math.min(burn/100, 1) * 0.65); }

function drawChar(c, time) {
    ctx.save(); ctx.translate(c.x, c.y);
    const s = c.child ? 0.7 : 1;
    ctx.scale(s, s);
    const skin = burnColor(c.skin, c.sunburn);
    const bob = Math.sin(time * 0.003 + c.animOffset) * 1.5;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath(); ctx.ellipse(0, 2, 18, 5, 0, 0, Math.PI*2); ctx.fill();

    if (c.pose === 'sitting') {
        // Legs forward
        ctx.fillStyle = skin; ctx.strokeStyle = skin; ctx.lineWidth = 7; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-8, -8); ctx.lineTo(-15, 5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(8, -8); ctx.lineTo(15, 5); ctx.stroke();
        // Body
        ctx.fillStyle = c.swim;
        roundedRect(-14, -32 + bob, 28, 26, 6);
        // Arms
        ctx.strokeStyle = skin; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(-14, -22+bob); ctx.lineTo(-22, -10+bob); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(14, -22+bob); ctx.lineTo(22, -10+bob); ctx.stroke();
    } else {
        // Standing - legs
        ctx.strokeStyle = skin; ctx.lineWidth = 7; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-7, -5); ctx.lineTo(-9, -35+bob); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(7, -5); ctx.lineTo(9, -35+bob); ctx.stroke();
        // Body
        ctx.fillStyle = c.swim;
        roundedRect(-14, -60 + bob, 28, 28, 6);
        // Arms
        ctx.strokeStyle = skin; ctx.lineWidth = 6;
        const armW = Math.sin(time*0.002+c.animOffset)*3;
        ctx.beginPath(); ctx.moveTo(-14,-52+bob); ctx.lineTo(-24+armW,-38+bob); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(14,-52+bob); ctx.lineTo(24-armW,-38+bob); ctx.stroke();
    }

    // Head
    const headY = c.pose === 'sitting' ? -45 + bob : -72 + bob;
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.arc(0, headY, 14, 0, Math.PI*2); ctx.fill();

    // Hair
    ctx.fillStyle = c.hair;
    if (c.gender === 'F') {
        ctx.beginPath(); ctx.arc(0, headY-2, 15, Math.PI*0.9, Math.PI*0.1); ctx.fill();
        ctx.fillRect(-15, headY-4, 4, 16); ctx.fillRect(11, headY-4, 4, 16);
    } else {
        ctx.beginPath(); ctx.arc(0, headY-2, 15, Math.PI*0.85, Math.PI*0.15); ctx.fill();
    }

    // Face
    const ey = headY - 2;
    if (c.sunburn > 60) {
        // Pained face
        ctx.fillStyle = '#333';
        ctx.fillRect(-6, ey-1, 4, 3); ctx.fillRect(3, ey-1, 4, 3); // squinted eyes
        ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(0, ey+7, 4, 0, Math.PI, true); ctx.stroke(); // frown
    } else {
        // Normal/happy face
        ctx.fillStyle = '#333';
        ctx.beginPath(); ctx.arc(-5, ey, 2, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(5, ey, 2, 0, Math.PI*2); ctx.fill();
        // white highlights
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(-4.5, ey-0.8, 0.8, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(5.5, ey-0.8, 0.8, 0, Math.PI*2); ctx.fill();
        // Mouth
        ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(0, ey+5, 3, 0.1, Math.PI-0.1); ctx.stroke();
    }

    // Sunburn blush
    if (c.sunburn > 20) {
        const ba = Math.min((c.sunburn-20)/80, 0.5);
        ctx.fillStyle = `rgba(255,80,80,${ba})`;
        ctx.beginPath(); ctx.ellipse(-8, ey+3, 4, 2.5, 0, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(8, ey+3, 4, 2.5, 0, 0, Math.PI*2); ctx.fill();
    }

    // Protection items
    if (c.hasGlasses) {
        ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(50,50,50,0.6)';
        ctx.beginPath(); ctx.rect(-9, ey-4, 8, 5); ctx.rect(2, ey-4, 8, 5); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-1, ey-2); ctx.lineTo(2, ey-2); ctx.stroke();
    }
    if (c.hasHat) {
        ctx.fillStyle = '#E67E22';
        ctx.beginPath(); ctx.ellipse(0, headY-13, 20, 4, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#D35400';
        ctx.beginPath(); ctx.arc(0, headY-16, 12, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#C0392B';
        ctx.fillRect(-8, headY-17, 16, 3);
    }
    if (c.hasSunscreen) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,200,0.5)'; ctx.lineWidth = 2;
        const shimmer = Math.sin(time*0.005+c.animOffset)*0.3 + 0.4;
        ctx.globalAlpha = shimmer;
        ctx.beginPath();
        const bx = c.pose==='sitting' ? 0 : 0, by = c.pose==='sitting' ? -20+bob : -48+bob;
        ctx.ellipse(bx, by, 18, 16, 0, 0, Math.PI*2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    // Sunburn bar
    if (c.sunburn > 0) {
        const barY = headY - 24;
        ctx.fillStyle = 'rgba(0,0,0,0.3)'; roundedRect(-15, barY, 30, 4, 2);
        const col = c.sunburn < 40 ? '#FFC107' : c.sunburn < 70 ? '#FF9800' : '#F44336';
        ctx.fillStyle = col; roundedRect(-15, barY, 30*(c.sunburn/100), 4, 2);
    }

    ctx.restore();
}

function roundedRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y);
    ctx.arcTo(x+w,y,x+w,y+r,r); ctx.lineTo(x+w,y+h-r);
    ctx.arcTo(x+w,y+h,x+w-r,y+h,r); ctx.lineTo(x+r,y+h);
    ctx.arcTo(x,y+h,x,y+h-r,r); ctx.lineTo(x,y+r);
    ctx.arcTo(x,y,x+r,y,r); ctx.fill();
}

// ---- Umbrella Drawing ----
function drawUmbrella(umb, time) {
    ctx.save(); ctx.translate(umb.x, umb.y);
    // Pole
    ctx.fillStyle = '#8B7355'; ctx.fillRect(-3, -90, 6, 92);
    // Canopy
    const colors = ['#E74C3C','#FFF','#3498DB','#FFF','#2ECC71','#FFF','#F39C12','#FFF'];
    for (let i = 0; i < 8; i++) {
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(0, -90);
        ctx.arc(0, -90, 55, Math.PI + i*Math.PI/8, Math.PI + (i+1)*Math.PI/8);
        ctx.fill();
    }
    // Shadow on ground
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath(); ctx.ellipse(0, 4, 50, 12, 0, 0, Math.PI*2); ctx.fill();
    ctx.restore();
}
