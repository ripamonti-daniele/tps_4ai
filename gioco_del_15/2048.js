let _listeners = [];
let btnReset = null;
let displayMosse = null;
let mosse = 0;
let cells = [];

function updateMoves() {
    if (displayMosse) displayMosse.textContent = 'Mosse: ' + mosse;
}

function buildGrid() {
    // Create background grid cells in the DOM and initialize internal array
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

function renderTiles() {
    for (let i = 0; i < 16; i++) {
        const bg = document.querySelector(`#game-board .bg-cell[data-index='${i}']`);
        if (!bg) continue;
        const tile = bg.querySelector('.tile');
        const val = cells[i] || 0;
        // reset classes
        tile.className = 'tile';
        if (val > 0) {
            tile.textContent = String(val);
            // add class for styling (e.g., tile-2, tile-4, ...)
            const cls = 'tile-' + val;
            tile.classList.add(cls);
        } else {
            tile.textContent = '';
        }
    }
}

function spawnRandomTiles() {
    // choose between 3 and 6 tiles
    const count = Math.floor(Math.random() * 4) + 3; // 3..6
    const indices = [];
    while (indices.length < count) {
        const idx = Math.floor(Math.random() * 16);
        if (!indices.includes(idx)) indices.push(idx);
    }
    // assign 2 or 4 randomly
    indices.forEach(i => {
        cells[i] = Math.random() < 0.5 ? 2 : 4;
    });
    renderTiles();
}

function spawnOneTile() {
    const empty = [];
    for (let i = 0; i < 16; i++) if (!cells[i] || cells[i] === 0) empty.push(i);
    if (empty.length === 0) return false;
    const idx = empty[Math.floor(Math.random() * empty.length)];
    // 90% chance 2, 10% chance 4 (common 2048 rule)
    cells[idx] = Math.random() < 0.9 ? 2 : 4;
    return true;
}

function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
}

function getCellRect(index) {
    const board = document.getElementById('game-board');
    const bg = document.querySelector(`#game-board .bg-cell[data-index='${index}']`);
    if (!board || !bg) return null;
    const boardRect = board.getBoundingClientRect();
    const rect = bg.getBoundingClientRect();
    return {
        left: rect.left - boardRect.left,
        top: rect.top - boardRect.top,
        width: rect.width,
        height: rect.height
    };
}

function createClone(value) {
    const clone = document.createElement('div');
    clone.className = 'tile tile-clone';
    if (value) clone.classList.add('tile-' + value);
    clone.textContent = value ? String(value) : '';
    return clone;
}

function animateOps(ops) {
    return new Promise(resolve => {
        const board = document.getElementById('game-board');
        if (!board) return resolve();
        if (!ops || !ops.length) return resolve();
        board.style.position = board.style.position || 'relative';
        const clones = [];
        // create clones for each op
        ops.forEach(op => {
            const fromRect = getCellRect(op.from);
            const toRect = getCellRect(op.to);
            if (!fromRect || !toRect) return;
            const clone = createClone(op.valueBefore);
            // ensure absolute positioning and a smooth transition
            clone.style.position = 'absolute';
            clone.style.transition = clone.style.transition || 'transform 200ms ease, opacity 200ms ease';
            clone.style.willChange = 'transform';
            clone.style.zIndex = '1000';
            clone.style.width = fromRect.width + 'px';
            clone.style.height = fromRect.height + 'px';
            clone.style.left = fromRect.left + 'px';
            clone.style.top = fromRect.top + 'px';
            clone.style.transform = 'translate(0,0)';
            board.appendChild(clone);
            clones.push({ el: clone, fromRect, toRect, op });
        });

        // force reflow
        void board.offsetWidth;

        // animate
        clones.forEach(c => {
            const dx = c.toRect.left - c.fromRect.left;
            const dy = c.toRect.top - c.fromRect.top;
            c.el.style.transform = `translate(${dx}px, ${dy}px)`;
            c.el.style.opacity = '1';
        });

        // after animation, remove clones and resolve
        setTimeout(() => {
            clones.forEach(c => c.el.remove());
            resolve();
        }, 200);
    });
}

export function init() {
    const griglia = document.getElementById('game-board');
    const title = document.getElementById('page-title');
    if (title) title.textContent = '2048';
    if (!griglia) return;

    // cache controls
    btnReset = document.getElementById('reset-btn');
    displayMosse = document.getElementById('moves');

    mosse = 0;
    updateMoves();

    // build minimal grid
    // initialize internal board array (no DOM cells)
    if (griglia) griglia.innerHTML = '';
    buildGrid();
    // spawn initial random tiles
    spawnRandomTiles();

    // reset handler
    const onReset = () => {
        mosse = 0;
        buildGrid();
        // spawn initial tiles for a new game
        spawnRandomTiles();
        updateMoves();
    };
    if (btnReset) { btnReset.addEventListener('click', onReset); _listeners.push({ el: btnReset, type: 'click', fn: onReset }); }

    // keyboard handler: WASD and arrow keys -> moves
    const onKey = async (e) => {
        const key = e.key;
        let dir = null;
        if (key === 'ArrowUp' || key === 'w' || key === 'W') dir = 'up';
        else if (key === 'ArrowDown' || key === 's' || key === 'S') dir = 'down';
        else if (key === 'ArrowLeft' || key === 'a' || key === 'A') dir = 'left';
        else if (key === 'ArrowRight' || key === 'd' || key === 'D') dir = 'right';

        if (dir) {
            e.preventDefault();
            const ops = muovi(dir); // ops or null
            if (ops && ops.length) {
                // animate moves based on ops
                await animateOps(ops);
                // after animation, spawn a new tile and render final state
                spawnOneTile();
                renderTiles();
                mosse++;
                updateMoves();
            }
        }
    };
    document.addEventListener('keydown', onKey);
    _listeners.push({ el: document, type: 'keydown', fn: onKey });
}

export function destroy() {
    _listeners.forEach(l => l.el.removeEventListener(l.type, l.fn));
    _listeners = [];
    const griglia = document.getElementById('game-board');
    if (griglia) griglia.innerHTML = '';
    // clear internal board
    cells = [];
}

function muovi(direzione) {
    // Implement move by compressing & merging lines; return true if board changed
    const before = cells.slice();
    const ops = [];

    function processLine(line) {
        // line: array of {val, pos}
        const packed = line.filter(x => x.val && x.val !== 0);
        const out = [];
        const fromLists = [];
        let i = 0;
        while (i < packed.length) {
            if (i + 1 < packed.length && packed[i].val === packed[i + 1].val) {
                // merge
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

    if (direzione === 'left') {
        for (let r = 0; r < 4; r++) {
            const base = r * 4;
            // build line with positions
            const line = [ {val: cells[base], pos: base}, {val: cells[base+1], pos: base+1}, {val: cells[base+2], pos: base+2}, {val: cells[base+3], pos: base+3} ];
            const result = processLine(line);
            for (let k = 0; k < 4; k++) {
                cells[base + k] = result.out[k] || 0;
            }
            // record ops
            result.fromLists.forEach((fromList, idx) => {
                const toIndex = base + idx;
                fromList.forEach(fromPos => ops.push({ from: fromPos, to: toIndex, valueBefore: before[fromPos], valueAfter: cells[toIndex] }));
            });
        }
    } else if (direzione === 'right') {
        for (let r = 0; r < 4; r++) {
            const base = r * 4;
            const line = [ {val: cells[base+3], pos: base+3}, {val: cells[base+2], pos: base+2}, {val: cells[base+1], pos: base+1}, {val: cells[base], pos: base} ];
            const result = processLine(line);
            for (let k = 0; k < 4; k++) cells[base + (3 - k)] = result.out[k] || 0;
            result.fromLists.forEach((fromList, idx) => {
                const toIndex = base + (3 - idx);
                fromList.forEach(fromPos => ops.push({ from: fromPos, to: toIndex, valueBefore: before[fromPos], valueAfter: cells[toIndex] }));
            });
        }
    } else if (direzione === 'up') {
        for (let c = 0; c < 4; c++) {
            const line = [ {val: cells[c], pos: c}, {val: cells[c+4], pos: c+4}, {val: cells[c+8], pos: c+8}, {val: cells[c+12], pos: c+12} ];
            const result = processLine(line);
            for (let k = 0; k < 4; k++) cells[c + 4 * k] = result.out[k] || 0;
            result.fromLists.forEach((fromList, idx) => {
                const toIndex = c + 4 * idx;
                fromList.forEach(fromPos => ops.push({ from: fromPos, to: toIndex, valueBefore: before[fromPos], valueAfter: cells[toIndex] }));
            });
        }
    } else if (direzione === 'down') {
        for (let c = 0; c < 4; c++) {
            const line = [ {val: cells[c+12], pos: c+12}, {val: cells[c+8], pos: c+8}, {val: cells[c+4], pos: c+4}, {val: cells[c], pos: c} ];
            const result = processLine(line);
            for (let k = 0; k < 4; k++) cells[c + 4 * (3 - k)] = result.out[k] || 0;
            result.fromLists.forEach((fromList, idx) => {
                const toIndex = c + 4 * (3 - idx);
                fromList.forEach(fromPos => ops.push({ from: fromPos, to: toIndex, valueBefore: before[fromPos], valueAfter: cells[toIndex] }));
            });
        }
    }

    // filter ops to meaningful moves (from different index and non-zero)
    const meaningful = ops.filter(o => o.valueBefore && o.from !== o.to);
    if (arraysEqual(before, cells) || meaningful.length === 0) return null;
    return meaningful;
}



