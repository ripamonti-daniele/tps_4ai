let _listeners = [];
let btnReset = null;
let displayPunteggio = null;
let cells = [];

// Aggiorna il punteggio (somma di tutte le celle)
function updateScore() {
    if (!displayPunteggio) return;
    const score = cells.reduce((sum, val) => sum + val, 0);
    displayPunteggio.textContent = 'Punteggio: ' + score;
}

// Costruisce la griglia 4x4
function buildGrid() {
    const griglia = document.getElementById('game-board');
    if (!griglia) return;
    griglia.innerHTML = '';
    cells = new Array(16).fill(0);
    for (let i = 0; i < 16; i++) {
        const bg = document.createElement('div');
        bg.className = 'bg-cell';
        bg.dataset.index = i;
        const tile = document.createElement('div');
        tile.className = 'tile';
        bg.appendChild(tile);
        griglia.appendChild(bg);
    }
}

// Mostra le tessere sulla griglia
function renderTiles() {
    for (let i = 0; i < 16; i++) {
        const bg = document.querySelector(`#game-board .bg-cell[data-index='${i}']`);
        if (!bg) continue;
        const tile = bg.querySelector('.tile');
        const val = cells[i] || 0;
        tile.className = 'tile';
        tile.style.opacity = '1';
        if (val > 0) {
            tile.textContent = String(val);
            tile.classList.add('tile-' + val);
        } else {
            tile.textContent = '';
        }
    }
    updateScore();
    checkGameOver();
}

// Genera alcune tessere casuali all’inizio
function spawnRandomTiles() {
    const count = Math.floor(Math.random() * 4) + 3;
    const indices = [];
    while (indices.length < count) {
        const idx = Math.floor(Math.random() * 16);
        if (!indices.includes(idx)) indices.push(idx);
    }
    indices.forEach(i => {
        cells[i] = Math.random() < 0.5 ? 2 : 4;
    });
    renderTiles();
}

// Genera una tessera casuale dopo ogni mossa
function spawnOneTile() {
    const empty = [];
    for (let i = 0; i < 16; i++) if (!cells[i] || cells[i] === 0) empty.push(i);
    if (empty.length === 0) return false;
    const idx = empty[Math.floor(Math.random() * empty.length)];
    cells[idx] = Math.random() < 0.9 ? 2 : 4;
    return true;
}

// Controlla se due array sono uguali
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
}

// Crea un clone per animazioni
function createClone(value) {
    const clone = document.createElement('div');
    clone.className = 'tile tile-clone';
    if (value) clone.classList.add('tile-' + value);
    clone.textContent = value ? String(value) : '';
    return clone;
}

// Animazione dei movimenti
function animateOps(ops) {
    return new Promise(resolve => {
        const board = document.getElementById('game-board');
        if (!board || !ops || !ops.length) return resolve();

        const clones = [];
        const originalTiles = [];

        ops.forEach(op => {
            const fromCell = board.querySelector(`.bg-cell[data-index='${op.from}']`);
            const toCell   = board.querySelector(`.bg-cell[data-index='${op.to}']`);
            if (!fromCell || !toCell) return;

            const tileOrig = fromCell.querySelector('.tile');
            originalTiles.push(tileOrig);
            tileOrig.style.opacity = '0';

            const clone = createClone(op.valueBefore);
            const fromLeft = fromCell.offsetLeft;
            const fromTop  = fromCell.offsetTop;
            const toLeft   = toCell.offsetLeft;
            const toTop    = toCell.offsetTop;

            clone.style.position = 'absolute';
            clone.style.left = fromLeft + 'px';
            clone.style.top  = fromTop + 'px';
            clone.style.width  = fromCell.offsetWidth + 'px';
            clone.style.height = fromCell.offsetHeight + 'px';
            clone.style.transition = 'transform 180ms ease, opacity 160ms ease';
            clone.style.zIndex = '1000';
            clone.style.willChange = 'transform';

            board.appendChild(clone);
            clones.push({ el: clone, dx: toLeft - fromLeft, dy: toTop - fromTop });
        });

        void board.offsetWidth;

        clones.forEach(c => {
            c.el.style.transform = `translate(${c.dx}px, ${c.dy}px)`;
        });

        setTimeout(() => {
            clones.forEach(c => c.el.remove());
            originalTiles.forEach(t => t.style.opacity = '1');
            resolve();
        }, 180);
    });
}

// Merge line, blocca merge 2048 + 2048
function processLine(line) {
    const packed = line.filter(x => x.val && x.val !== 0);
    const out = [];
    const fromLists = [];
    let i = 0;
    while (i < packed.length) {
        if (i + 1 < packed.length && packed[i].val === packed[i + 1].val && packed[i].val !== 2048) {
            out.push(packed[i].val * 2);
            fromLists.push([packed[i].pos, packed[i + 1].pos]);
            i += 2;
        } else {
            out.push(packed[i].val);
            fromLists.push([packed[i].pos]);
            i += 1;
        }
    }
    while (out.length < 4) {
        out.push(0);
        fromLists.push([]);
    }
    return { out, fromLists };
}

// Esegue il movimento
function muovi(direzione) {
    const before = cells.slice();
    const ops = [];

    if (direzione === 'left') {
        for (let r = 0; r < 4; r++) {
            const base = r * 4;
            const line = [0,1,2,3].map(k => ({ val: cells[base+k], pos: base+k }));
            const result = processLine(line);
            result.out.forEach((v,k)=>cells[base+k]=v);
            result.fromLists.forEach((fromList, idx)=>{
                const toIndex = base + idx;
                fromList.forEach(fromPos => ops.push({ from: fromPos, to: toIndex, valueBefore: before[fromPos], valueAfter: cells[toIndex] }));
            });
        }
    } else if (direzione === 'right') {
        for (let r = 0; r < 4; r++) {
            const base = r * 4;
            const line = [3,2,1,0].map(k => ({ val: cells[base+k], pos: base+k }));
            const result = processLine(line);
            result.out.forEach((v,k)=>cells[base+(3-k)]=v);
            result.fromLists.forEach((fromList, idx)=>{
                const toIndex = base + (3 - idx);
                fromList.forEach(fromPos => ops.push({ from: fromPos, to: toIndex, valueBefore: before[fromPos], valueAfter: cells[toIndex] }));
            });
        }
    } else if (direzione === 'up') {
        for (let c = 0; c < 4; c++) {
            const line = [0,1,2,3].map(k=>({ val: cells[c + 4*k], pos: c + 4*k }));
            const result = processLine(line);
            result.out.forEach((v,k)=>cells[c+4*k]=v);
            result.fromLists.forEach((fromList, idx)=>{
                const toIndex = c + 4*idx;
                fromList.forEach(fromPos => ops.push({ from: fromPos, to: toIndex, valueBefore: before[fromPos], valueAfter: cells[toIndex] }));
            });
        }
    } else if (direzione === 'down') {
        for (let c = 0; c < 4; c++) {
            const line = [3,2,1,0].map(k=>({ val: cells[c+4*k], pos: c+4*k }));
            const result = processLine(line);
            result.out.forEach((v,k)=>cells[c+4*(3-k)]=v);
            result.fromLists.forEach((fromList, idx)=>{
                const toIndex = c + 4*(3-idx);
                fromList.forEach(fromPos => ops.push({ from: fromPos, to: toIndex, valueBefore: before[fromPos], valueAfter: cells[toIndex] }));
            });
        }
    }

    const meaningful = ops.filter(o => o.valueBefore && o.from !== o.to);
    if (arraysEqual(before, cells) || meaningful.length === 0) return null;
    return meaningful;
}

// Controlla se non ci sono più mosse possibili
function checkGameOver() {
    const full = cells.every(v => v > 0);
    if (!full) { btnReset.disabled = true; return; }

    // controlla se esistono mosse possibili
    const canMove = ['left','right','up','down'].some(dir => {
        const clone = cells.slice();
        const ops = muovi(dir);
        cells = clone; // ripristina
        return ops && ops.length;
    });

    if (!canMove) {
        btnReset.disabled = false;
    }
}

// --- INIT ---
export function init() {
    const griglia = document.getElementById('game-board');
    if (!griglia) return;

    btnReset = document.getElementById('reset-btn');
    displayPunteggio = document.getElementById('moves');

    buildGrid();
    spawnRandomTiles();

    const onReset = () => {
        buildGrid();
        spawnRandomTiles();
        updateScore();
        btnReset.disabled = true;
    };
    if (btnReset) { btnReset.addEventListener('click', onReset); _listeners.push({ el: btnReset, type: 'click', fn: onReset }); }

    const onKey = async (e) => {
        const key = e.key.toLowerCase();
        let dir = null;
        if (key === 'arrowup' || key === 'w') dir = 'up';
        else if (key === 'arrowdown' || key === 's') dir = 'down';
        else if (key === 'arrowleft' || key === 'a') dir = 'left';
        else if (key === 'arrowright' || key === 'd') dir = 'right';

        if (dir) {
            e.preventDefault();
            const ops = muovi(dir);
            if (ops && ops.length) {
                await animateOps(ops);
                spawnOneTile();
                renderTiles();
            }
        }
    };
    document.addEventListener('keydown', onKey);
    _listeners.push({ el: document, type: 'keydown', fn: onKey });
}

// --- DESTROY ---
export function destroy() {
    _listeners.forEach(l => l.el.removeEventListener(l.type, l.fn));
    _listeners = [];
    const griglia = document.getElementById('game-board');
    if (griglia) griglia.innerHTML = '';
    cells = [];
}