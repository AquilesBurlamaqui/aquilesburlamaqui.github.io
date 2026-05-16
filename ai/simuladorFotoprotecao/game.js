// ======== PHASE DATA & GAME LOGIC ========

const PHASES = [
    {
        id: 1, title: 'Protetor Solar', uvIndex: 6, time: 35,
        desc: 'Aplique protetor solar em todos os banhistas antes que se queimem!',
        items: [{ type: 'sunscreen', name: 'Protetor', emoji: '🧴', qty: 5 }],
        tip: 'A radiação UV pode causar queimaduras e câncer de pele. O protetor solar com FPS 30+ bloqueia até 97% dos raios UVB!',
        resultTip: 'O protetor solar deve ser reaplicado a cada 2 horas e após entrar na água.',
        chars: [
            { x: 200, y: 440, pose: 'standing' },
            { x: 400, y: 470, pose: 'sitting' },
            { x: 580, y: 445, pose: 'standing' }
        ],
        requiredItems: ['sunscreen']
    },
    {
        id: 2, title: 'Chapéu na Cabeça', uvIndex: 8, time: 40,
        desc: 'O sol está forte! Use protetor solar E chapéus para proteger todos!',
        items: [
            { type: 'sunscreen', name: 'Protetor', emoji: '🧴', qty: 5 },
            { type: 'hat', name: 'Chapéu', emoji: '👒', qty: 5 }
        ],
        tip: 'Chapéus de aba larga protegem rosto, orelhas e pescoço. A pele da cabeça também queima!',
        resultTip: 'Chapéus com aba de pelo menos 7cm oferecem melhor proteção para o rosto e pescoço.',
        chars: [
            { x: 150, y: 445, pose: 'standing' },
            { x: 320, y: 475, pose: 'sitting' },
            { x: 480, y: 440, pose: 'standing' },
            { x: 630, y: 465, pose: 'sitting' }
        ],
        requiredItems: ['sunscreen', 'hat']
    },
    {
        id: 3, title: 'Proteção Completa', uvIndex: 9, time: 45,
        desc: 'UV muito alto! Equipe todos com protetor, chapéu E óculos de sol!',
        items: [
            { type: 'sunscreen', name: 'Protetor', emoji: '🧴', qty: 6 },
            { type: 'hat', name: 'Chapéu', emoji: '👒', qty: 6 },
            { type: 'glasses', name: 'Óculos', emoji: '🕶️', qty: 6 }
        ],
        tip: 'A radiação UV pode causar catarata e danos à retina. Óculos com proteção UV bloqueiam 99% dos raios nocivos!',
        resultTip: 'Óculos escuros sem proteção UV são piores que nenhum: a pupila dilata e recebe mais radiação!',
        chars: [
            { x: 130, y: 440, pose: 'standing' },
            { x: 270, y: 475, pose: 'sitting' },
            { x: 420, y: 445, pose: 'standing' },
            { x: 550, y: 470, pose: 'sitting' },
            { x: 680, y: 440, pose: 'standing' }
        ],
        requiredItems: ['sunscreen', 'hat', 'glasses']
    },
    {
        id: 4, title: 'Sombra e Água Fresca', uvIndex: 10, time: 50,
        desc: 'UV extremo! Além de proteger cada pessoa, posicione barracas para dar sombra!',
        items: [
            { type: 'sunscreen', name: 'Protetor', emoji: '🧴', qty: 8 },
            { type: 'hat', name: 'Chapéu', emoji: '👒', qty: 8 },
            { type: 'glasses', name: 'Óculos', emoji: '🕶️', qty: 8 },
            { type: 'umbrella', name: 'Barraca', emoji: '⛱️', qty: 3 }
        ],
        tip: 'Buscar sombra entre 10h e 16h reduz a exposição UV em até 75%. Barracas e tendas são essenciais!',
        resultTip: 'Mesmo na sombra, a areia reflete até 25% da radiação UV. Use protetor mesmo sob a barraca!',
        chars: [
            { x: 120, y: 445, pose: 'standing' },
            { x: 240, y: 475, pose: 'sitting' },
            { x: 370, y: 440, pose: 'standing' },
            { x: 490, y: 470, pose: 'sitting' },
            { x: 610, y: 445, pose: 'standing' },
            { x: 710, y: 468, pose: 'sitting' }
        ],
        requiredItems: ['sunscreen', 'hat', 'glasses', 'umbrella']
    },
    {
        id: 5, title: 'Especialista UV', uvIndex: 11, time: 60,
        desc: 'Desafio final! Recursos limitados – proteja o máximo de pessoas possível!',
        items: [
            { type: 'sunscreen', name: 'Protetor', emoji: '🧴', qty: 6 },
            { type: 'hat', name: 'Chapéu', emoji: '👒', qty: 5 },
            { type: 'glasses', name: 'Óculos', emoji: '🕶️', qty: 4 },
            { type: 'umbrella', name: 'Barraca', emoji: '⛱️', qty: 2 }
        ],
        tip: 'No dia a dia, combine múltiplas formas de proteção: protetor solar, roupas com UV, chapéu, óculos e sombra!',
        resultTip: 'Parabéns! Agora você sabe como se proteger. Compartilhe esse conhecimento com amigos e família!',
        chars: [
            { x: 100, y: 445, pose: 'standing' },
            { x: 200, y: 478, pose: 'sitting' },
            { x: 310, y: 440, pose: 'standing' },
            { x: 420, y: 472, pose: 'sitting' },
            { x: 520, y: 442, pose: 'standing' },
            { x: 620, y: 475, pose: 'sitting' },
            { x: 720, y: 448, pose: 'standing' },
            { x: 160, y: 505, pose: 'sitting' }
        ],
        requiredItems: ['sunscreen', 'hat', 'glasses', 'umbrella']
    }
];

// ======== GAME STATE ========
const GS = {
    state: 'TITLE', // TITLE, PHASE_INTRO, PLAYING, PHASE_COMPLETE, GAME_COMPLETE
    phase: 0, score: 0, totalScore: 0,
    chars: [], umbrellas: [], items: {},
    selectedItem: null, timer: 0, timerStart: 0,
    lastTime: 0, animTime: 0, particles: []
};

// ======== UI REFERENCES ========
const UI = {
    title: document.getElementById('title-screen'),
    intro: document.getElementById('phase-intro'),
    hud: document.getElementById('hud'),
    toolbar: document.getElementById('toolbar'),
    complete: document.getElementById('phase-complete'),
    gameover: document.getElementById('game-complete'),
    toast: document.getElementById('toast')
};

// ======== TOAST ========
let toastTimer = null;
function showToast(msg) {
    UI.toast.textContent = msg;
    UI.toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => UI.toast.classList.add('hidden'), 1800);
}

// ======== SCREEN MANAGEMENT ========
function showScreen(name) {
    ['title','intro','hud','toolbar','complete','gameover'].forEach(k => {
        UI[k].classList.toggle('hidden', k !== name);
    });
    if (name === 'PLAYING') { UI.hud.classList.remove('hidden'); UI.toolbar.classList.remove('hidden'); }
}

// ======== PHASE SETUP ========
function setupPhase(idx) {
    GS.phase = idx;
    const p = PHASES[idx];
    GS.chars = p.chars.map(c => createChar(c.x, c.y, c.pose));
    GS.umbrellas = [];
    GS.items = {};
    p.items.forEach(it => GS.items[it.type] = it.qty);
    GS.selectedItem = null;
    GS.score = 0;
    GS.timer = p.time;
    GS.particles = [];

    // Update intro UI
    document.getElementById('phase-badge').textContent = `FASE ${p.id}`;
    document.getElementById('phase-title').textContent = p.title;
    document.getElementById('phase-desc').textContent = p.desc;
    document.getElementById('uv-value').textContent = p.uvIndex;
    document.getElementById('uv-fill').style.width = `${(p.uvIndex / 14) * 100}%`;
    document.getElementById('tip-text').textContent = p.tip;

    // Phase items preview
    const itemsDiv = document.getElementById('phase-items');
    itemsDiv.innerHTML = p.items.map(it =>
        `<div class="phase-item-preview"><span class="item-emoji">${it.emoji}</span>${it.name}</div>`
    ).join('');

    showScreen('intro');
}

function startPlaying() {
    GS.state = 'PLAYING';
    GS.timerStart = performance.now();
    showScreen('PLAYING');
    buildToolbar();
    updateHUD();
}

// ======== TOOLBAR ========
function buildToolbar() {
    const div = document.getElementById('toolbar-items');
    const p = PHASES[GS.phase];
    div.innerHTML = p.items.map(it =>
        `<div class="tool-btn" data-type="${it.type}" id="tool-${it.type}">
            <span class="tool-emoji">${it.emoji}</span>
            <span class="tool-name">${it.name}</span>
            <span class="tool-qty" id="qty-${it.type}">${GS.items[it.type]}</span>
        </div>`
    ).join('');

    div.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => selectItem(btn.dataset.type));
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); selectItem(btn.dataset.type); });
    });
}

function selectItem(type) {
    if (GS.items[type] <= 0) { showToast('Item esgotado!'); return; }
    GS.selectedItem = type;
    sndClick();
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('selected'));
    const btn = document.getElementById(`tool-${type}`);
    if (btn) btn.classList.add('selected');
    const hints = { sunscreen: 'Clique num personagem para aplicar protetor', hat: 'Clique num personagem para colocar chapéu',
        glasses: 'Clique num personagem para colocar óculos', umbrella: 'Clique na areia para posicionar a barraca' };
    document.getElementById('toolbar-hint').textContent = hints[type] || '';
}

// ======== HUD UPDATE ========
function updateHUD() {
    const p = PHASES[GS.phase];
    document.getElementById('hud-phase').textContent = `${p.id}/5`;
    document.getElementById('hud-timer').textContent = `${Math.ceil(GS.timer)}s`;
    document.getElementById('hud-uv').textContent = p.uvIndex;
    document.getElementById('hud-score').textContent = GS.totalScore + GS.score;

    // Protection bar
    const totalNeeded = GS.chars.length * PHASES[GS.phase].requiredItems.filter(i=>i!=='umbrella').length;
    let totalHave = 0;
    GS.chars.forEach(c => {
        if (c.hasSunscreen) totalHave++;
        if (c.hasHat && PHASES[GS.phase].requiredItems.includes('hat')) totalHave++;
        if (c.hasGlasses && PHASES[GS.phase].requiredItems.includes('glasses')) totalHave++;
    });
    const pct = totalNeeded > 0 ? Math.round((totalHave / totalNeeded) * 100) : 0;
    document.getElementById('protection-fill').style.width = `${pct}%`;
    document.getElementById('protection-pct').textContent = `${pct}%`;

    // Timer color
    const te = document.getElementById('hud-timer');
    te.style.color = GS.timer < 10 ? '#FF4444' : GS.timer < 20 ? '#FFD700' : '#fff';
}

// ======== APPLY ITEM ========
function tryApplyItem(worldX, worldY) {
    if (!GS.selectedItem || GS.state !== 'PLAYING') return;
    const type = GS.selectedItem;

    if (type === 'umbrella') {
        if (worldY > 400 && worldY < 550 && GS.items.umbrella > 0) {
            GS.umbrellas.push({ x: worldX, y: worldY > 510 ? 510 : worldY });
            GS.items.umbrella--;
            updateQty('umbrella');
            sndApply();
            showToast('Barraca posicionada! ⛱️');
            addParticles(worldX, worldY, '#E67E22');
            checkShade();
            if (GS.items.umbrella <= 0) GS.selectedItem = null;
        }
        return;
    }

    // Find closest character
    let best = null, bestD = 50;
    GS.chars.forEach(c => {
        const d = Math.hypot(c.x - worldX, c.y - worldY - 30);
        if (d < bestD) { bestD = d; best = c; }
    });

    if (!best) { showToast('Clique mais perto de um personagem!'); return; }

    if (type === 'sunscreen') {
        if (best.hasSunscreen) { showToast('Já tem protetor! ✓'); return; }
        best.hasSunscreen = true;
        showToast('Protetor aplicado! 🧴');
    } else if (type === 'hat') {
        if (best.hasHat) { showToast('Já tem chapéu! ✓'); return; }
        best.hasHat = true;
        showToast('Chapéu colocado! 👒');
    } else if (type === 'glasses') {
        if (best.hasGlasses) { showToast('Já tem óculos! ✓'); return; }
        best.hasGlasses = true;
        showToast('Óculos colocados! 🕶️');
    }

    GS.items[type]--;
    updateQty(type);
    sndApply();
    addParticles(best.x, best.y - 40, '#FFD700');
    updateProtection(best);
    GS.score += 50;
    if (GS.items[type] <= 0) GS.selectedItem = null;
    updateHUD();
    checkWin();
}

function updateQty(type) {
    const el = document.getElementById(`qty-${type}`);
    if (el) el.textContent = GS.items[type];
    if (GS.items[type] <= 0) {
        const btn = document.getElementById(`tool-${type}`);
        if (btn) { btn.style.opacity = '0.4'; btn.classList.remove('selected'); }
    }
}

function updateProtection(c) {
    let level = 0;
    if (c.hasSunscreen) level += 35;
    if (c.hasHat) level += 25;
    if (c.hasGlasses) level += 20;
    if (c.underShade) level += 20;
    c.protectionLevel = Math.min(level, 100);
}

function checkShade() {
    GS.chars.forEach(c => {
        c.underShade = GS.umbrellas.some(u => Math.abs(c.x - u.x) < 48 && Math.abs(c.y - u.y) < 20);
        updateProtection(c);
    });
}

// ======== PARTICLES ========
function addParticles(x, y, color) {
    for (let i = 0; i < 12; i++) {
        GS.particles.push({
            x, y, vx: (Math.random()-0.5)*4, vy: -Math.random()*3-1,
            life: 1, color, size: 2 + Math.random()*3
        });
    }
}

function updateParticles(dt) {
    GS.particles = GS.particles.filter(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life -= dt * 0.002;
        return p.life > 0;
    });
}

function drawParticles() {
    GS.particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;
}

// ======== WIN/LOSE CHECK ========
function checkWin() {
    const p = PHASES[GS.phase];
    const req = p.requiredItems.filter(i => i !== 'umbrella');
    const allProtected = GS.chars.every(c => {
        let ok = true;
        if (req.includes('sunscreen') && !c.hasSunscreen) ok = false;
        if (req.includes('hat') && !c.hasHat) ok = false;
        if (req.includes('glasses') && !c.hasGlasses) ok = false;
        return ok;
    });
    const umbOk = !p.requiredItems.includes('umbrella') || GS.umbrellas.length > 0;

    if (allProtected && umbOk) {
        setTimeout(() => completePhase(true), 400);
    }
}

function completePhase(won) {
    GS.state = 'PHASE_COMPLETE';
    const p = PHASES[GS.phase];

    // Calculate results
    const protectedCount = GS.chars.filter(c => c.protectionLevel > 50).length;
    const timeBonus = Math.max(0, Math.floor(GS.timer * 10));
    const burnPenalty = GS.chars.reduce((s, c) => s + Math.floor(c.sunburn * 2), 0);
    const phaseScore = GS.score + timeBonus - burnPenalty;
    GS.totalScore += Math.max(0, phaseScore);

    const pct = protectedCount / GS.chars.length;
    const starCount = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1;

    document.getElementById('stars').textContent = '⭐'.repeat(starCount) + '☆'.repeat(3 - starCount);
    document.getElementById('stat-protected').textContent = `${protectedCount}/${GS.chars.length}`;
    document.getElementById('stat-score').textContent = Math.max(0, phaseScore);
    document.getElementById('stat-time').textContent = `${Math.ceil(p.time - GS.timer)}s`;
    document.getElementById('result-tip-text').textContent = p.resultTip;

    const nextBtn = document.getElementById('btn-next');
    if (GS.phase >= PHASES.length - 1) {
        nextBtn.textContent = 'Ver Resultado Final 🏆';
    } else {
        nextBtn.textContent = 'Próxima Fase →';
    }

    sndWin();
    showScreen('complete');
}

function nextPhase() {
    if (GS.phase >= PHASES.length - 1) {
        // Game complete
        GS.state = 'GAME_COMPLETE';
        document.getElementById('final-score-val').textContent = GS.totalScore;
        const avg = GS.totalScore / (PHASES.length * 300);
        const fStars = avg >= 0.8 ? 3 : avg >= 0.5 ? 2 : 1;
        document.getElementById('final-stars').textContent = '⭐'.repeat(fStars) + '☆'.repeat(3 - fStars);
        showScreen('gameover');
    } else {
        setupPhase(GS.phase + 1);
    }
}

// ======== GAME UPDATE ========
function updateGame(dt) {
    if (GS.state !== 'PLAYING') return;

    // Timer
    GS.timer -= dt / 1000;
    if (GS.timer <= 0) {
        GS.timer = 0;
        completePhase(false);
        return;
    }

    // Sunburn
    const p = PHASES[GS.phase];
    const burnRate = (p.uvIndex / 11) * 0.08;
    GS.chars.forEach(c => {
        const protection = c.protectionLevel / 100;
        const effectiveBurn = burnRate * (1 - protection) * dt;
        c.sunburn = Math.min(100, c.sunburn + effectiveBurn);
        if (c.sunburn > 80 && c.sunburn - effectiveBurn <= 80) sndWarn();
    });

    updateParticles(dt);
    updateHUD();
}

// ======== MAIN RENDER ========
function render(time) {
    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    const uvIdx = GS.state === 'PLAYING' || GS.state === 'PHASE_COMPLETE' ? PHASES[GS.phase].uvIndex : 6;
    drawBackground(time, uvIdx);

    // Draw umbrellas (behind chars)
    GS.umbrellas.forEach(u => drawUmbrella(u, time));

    // Draw characters
    GS.chars.forEach(c => drawChar(c, time));

    // Particles
    drawParticles();

    ctx.restore();
}

// ======== MAIN LOOP ========
function gameLoop(timestamp) {
    const dt = GS.lastTime ? Math.min(timestamp - GS.lastTime, 50) : 16;
    GS.lastTime = timestamp;
    GS.animTime = timestamp;

    updateGame(dt);
    render(timestamp);

    requestAnimationFrame(gameLoop);
}

// ======== INPUT ========
function handleClick(e) {
    const pos = toWorld(e.clientX, e.clientY);
    if (GS.state === 'PLAYING') tryApplyItem(pos.x, pos.y);
}

canvas.addEventListener('click', handleClick);
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const t = e.touches[0];
    handleClick({ clientX: t.clientX, clientY: t.clientY });
}, { passive: false });

// ======== BUTTON EVENTS ========
document.getElementById('btn-play').addEventListener('click', () => {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    sndClick();
    setupPhase(0);
});

document.getElementById('btn-start-phase').addEventListener('click', () => {
    sndClick();
    startPlaying();
});

document.getElementById('btn-next').addEventListener('click', () => {
    sndClick();
    nextPhase();
});

document.getElementById('btn-restart').addEventListener('click', () => {
    sndClick();
    GS.totalScore = 0;
    GS.chars = [];
    GS.umbrellas = [];
    setupPhase(0);
});

// ======== INIT ========
function init() {
    GS.state = 'TITLE';
    showScreen('title');
    requestAnimationFrame(gameLoop);
}

init();
