// ============================================================
// Ch 18 · Backtracking & Branch and Bound
// ============================================================
window.CHAPTERS.push({
 id: 'ch18',
 number: 18,
 title: 'Backtracking & Branch and Bound',
 subtitle: 'Backtracking & Branch and Bound -- Systematic Search with Pruning',
 sections: [
 // ===== Section 1: Backtracking Framework =====
 {
 id: 'ch18-sec01',
 title: 'Backtracking Algorithm Framework',
 content: `<h2>1. Backtracking Algorithm Framework</h2>
<p>backtracking (backtracking) is search problem solution space algorithm. it through solution, in when path not may solution <strong>pruning (prune)</strong>, from all solution space. </p>

<div class="env-block definition">
<div class="env-title">Definition 18.1 (State-Space Tree)</div>
<div class="env-body"><p><strong>state-space tree (state-space tree):</strong> problem search procedure denote tree. root node denote solution, each internal node denote solution, leaf node denote solution or. from to path solution procedure. </p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Generic Backtracking</div>
<div class="env-body"><p>
<strong>Backtrack(node, state):</strong><br>
1. if state is solution, /<br>
2. for state each \\(c\\):<br>
&nbsp;&nbsp;&nbsp;&nbsp;a. if \\(c\\) row (through constraint check):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i. do select: state \\(\\leftarrow\\) state + \\(c\\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ii. Backtrack(child, state)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;iii. select: state \\(\\leftarrow\\) state - \\(c\\) (backtracking)<br>
&nbsp;&nbsp;&nbsp;&nbsp;b. otherwise then pruning (this)
</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 18.2 (Pruning)</div>
<div class="env-body"><p><strong>pruning</strong>is backtracking algorithm: in state-space tree, if when solution already constraint or not may optimal solution, then not again its subtree. pruning:</p>
<p>1. <strong>row pruning:</strong> solution constraint,. </p>
<p>2. <strong>pruning:</strong> compute when path upper bound/lower bound, if not known optimal solution, then pruning. </p>
<p>3. <strong>pruning:</strong> use problem search state. </p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-backtrack-framework"></div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body"><p>backtracking in: to,. pruning then is determine"this not "not use to. pruning can search row. </p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body"><p>backtracking time complexity usually is (e.g. \\(O(n!)\\) or \\(O(2^n)\\)), through efficient pruning, running time less than worst-case. backtracking usually need pruning. </p></div>
</div>`,
 visualizations: [
 {
 id: 'ch18-viz-backtrack-framework',
 title: 'Backtracking Search Tree: Subset Enumeration',
 description: 'backtracking in subset state-space tree pruning',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var elements = [1, 2, 3, 4];
 var target = 5; // subset sum target
 var treeNodes = [];
 var treeEdges = [];
 var step = 0;
 var pruned = {};

 function buildSubsetTree(idx, currentSum, path, x, y, spread) {
 var id = treeNodes.length;
 var label = path.length === 0? 'root': path.join(',');
 var isPruned = currentSum> target;
 var isSolution = currentSum === target;
 treeNodes.push({id: id, x: x, y: y, label: label, sum: currentSum, pruned: isPruned, solution: isSolution, depth: idx});

 if (isPruned || idx>= elements.length) return id;

 // Branch: include elements[idx]
 var leftId = buildSubsetTree(idx + 1, currentSum + elements[idx], path.concat([elements[idx]]), x - spread, y + 60, spread * 0.45);
 treeEdges.push({from: id, to: leftId, label: '+' + elements[idx]});

 // Branch: exclude elements[idx]
 var rightId = buildSubsetTree(idx + 1, currentSum, path.slice(), x + spread, y + 60, spread * 0.45);
 treeEdges.push({from: id, to: rightId, label: 'skip'});

 return id;
}

 buildSubsetTree(0, 0, [], 350, 50, 160);
 var maxNodes = treeNodes.length;

 function draw() {
 viz.clear();
 viz.screenText('Subset Sum backtracking (target = ' + target + ', = {' + elements.join(',') + '})', viz.width / 2, 18, viz.colors.white, 14, 'center');

 var shown = Math.min(step, maxNodes);

 // Draw edges
 for (var i = 0; i <treeEdges.length; i++) {
 var e = treeEdges[i];
 if (e.from>= shown || e.to>= shown) continue;
 var from = treeNodes[e.from];
 var to = treeNodes[e.to];
 var eCol = to.pruned? viz.colors.red + '44': viz.colors.axis;
 viz.drawTreeEdge(from.x, from.y, to.x, to.y, eCol);
 viz.screenText(e.label, (from.x + to.x) / 2 - 15, (from.y + to.y) / 2 - 5, viz.colors.text, 9, 'center');
}

 // Draw nodes
 for (var i = 0; i <shown; i++) {
 var nd = treeNodes[i];
 var col, r;
 if (nd.solution) {
 col = viz.colors.green;
 r = 16;
} else if (nd.pruned) {
 col = viz.colors.red + '66';
 r = 12;
} else {
 col = viz.colors.blue;
 r = 14;
}
 viz.drawTreeNode(nd.x, nd.y, r, nd.sum, col, viz.colors.white);
}

 // Legend
 var ly = viz.height - 35;
 viz.drawNode(50, ly, 8, '', viz.colors.green, viz.colors.white);
 viz.screenText('solution (sum = target)', 65, ly, viz.colors.green, 10, 'left');
 viz.drawNode(200, ly, 8, '', viz.colors.red + '66', viz.colors.white);
 viz.screenText('pruning (sum> target)', 215, ly, viz.colors.red, 10, 'left');
 viz.drawNode(380, ly, 8, '', viz.colors.blue, viz.colors.white);
 viz.screenText('node', 395, ly, viz.colors.blue, 10, 'left');

 viz.screenText(': ' + shown + '/' + maxNodes + ' node', viz.width - 100, ly, viz.colors.text, 11, 'center');
}

 VizEngine.createButton(controls, '', function() {
 if (step <maxNodes) {step++; draw();}
});
 VizEngine.createButton(controls, '5', function() {
 step = Math.min(step + 5, maxNodes); draw();
});
 VizEngine.createButton(controls, 'all ', function() {
 step = maxNodes; draw();
});
 VizEngine.createButton(controls, '', function() {
 step = 0; draw();
});

 draw();
 return viz;
}
}
],
 exercises: [
 {
 question: ' \\(\\{1, 2, \\ldots, n\\}\\) all permutation backtracking algorithm. not pruning time complexity. ',
 hint: 'in each level select use element. ',
 solution: 'Permutations(perm, used, n): if |perm| = n: output perm; return. For i = 1 to n: if not used[i]: used[i] = true; perm.append(i); Permutations(perm, used, n); perm.pop(); used[i] = false. time complexity: leaf node = n!, each node O(n), O(n * n!). '
},
 {
 question: 'for Subset Sum Problem (determine \\(S\\) is otherwise there exists Subset Sum \\(T\\)), pruning its. ',
 hint: ': (1) when; (2) when all element not. ',
 solution: '(1) **upper bound pruning**: if when> T, then not may find solution, pruning.: all element. (2) **lower bound pruning**: if when + all element <T, then also not, pruning. (3) **sorting **: element permutation, upper bound pruning more.: in, this pruning can search from O(2^n) decrease to term. '
},
 {
 question: 'backtracking DFS have what?',
 hint: 'backtracking is in graph do DFS. ',
 solution: 'backtracking is state-space tree <strong>depth search (DFS)</strong>. DFS by depth traversal tree node, backtracking in this increase <strong>pruning</strong>: in DFS procedure, when node not satisfy constraint or not may solution, not again continue this subtree, to node. therefore, backtracking = DFS + pruning. if not pruning, backtracking DFS,. '
}
]
},
 // ===== Section 2: N-Queens =====
 {
 id: 'ch18-sec02',
 title: 'N-Queens Problem',
 content: `<h2>2 N queen problem</h2>
<p>N queen problem is backtracking algorithm: in \\(N \\times N\\) place \\(N\\) queen, any two queen different row, different column, different diagonal. </p>

<div class="env-block definition">
<div class="env-title">Definition 18.3 (N-Queens Problem)</div>
<div class="env-body"><p>in \\(N \\times N\\) place \\(N\\) queen, need: (1) each row exactly queen; (2) each column at most queen; (3) each diagonal () at most queen. </p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: N-Queens Backtracking</div>
<div class="env-body"><p>
<strong>SolveQueens(row, cols, diag1, diag2):</strong><br>
1. if row = N, find solution, <br>
2. for col = 0, 1,.., N-1:<br>
&nbsp;&nbsp;&nbsp;&nbsp;if col not in cols, and row-col not in diag1, and row+col not in diag2:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;place queen in (row, col)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SolveQueens(row+1, cols+{col}, diag1+{row-col}, diag2+{row+col})<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;queen (backtracking)
</p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 18.1</div>
<div class="env-body"><p>for \\(N \\ge 4\\), N queen problem have solution. solution \\(N\\): \\(N=4\\) have 2 solution, \\(N=8\\) have 92 solution, \\(N=12\\) have 14200 solution. </p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-nqueens"></div>

<div class="env-block example">
<div class="env-title">Example 18.1</div>
<div class="env-body"><p>4 queen solution: 0 row in 1 column, 1 row in 3 column, 2 row in 0 column, 3 row in 2 column. column position [1, 3, 0, 2]. </p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body"><p>N queen backtracking algorithm in worst-case \\(O(N!)\\), since column diagonal constraint pruning, search node less than \\(N^N\\) (pruning). pruning (only search, use /) search. </p></div>
</div>`,
 visualizations: [
 {
 id: 'ch18-viz-nqueens',
 title: 'N-Queens Backtracking Visualization',
 description: 'place queen, conflict backtracking procedure',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 450});
 var N = 6;
 var queens = []; // queens[row] = col
 var history = []; // sequence of {action, row, col}
 var histIdx = 0;
 var solutions = [];

 function isValid(row, col) {
 for (var i = 0; i <row; i++) {
 if (queens[i] === col) return false;
 if (Math.abs(queens[i] - col) === Math.abs(i - row)) return false;
}
 return true;
}

 function solve() {
 history = [];
 solutions = [];
 queens = [];
 function bt(row) {
 if (row === N) {
 solutions.push(queens.slice());
 history.push({action: 'solution', queens: queens.slice()});
 return;
}
 for (var col = 0; col <N; col++) {
 history.push({action: 'try', row: row, col: col});
 if (isValid(row, col)) {
 queens[row] = col;
 history.push({action: 'place', row: row, col: col});
 bt(row + 1);
 history.push({action: 'remove', row: row, col: col});
 queens.length = row;
} else {
 history.push({action: 'conflict', row: row, col: col});
}
}
}
 bt(0);
}

 solve();

 var currentQueens = [];
 var currentTry = null;
 var currentConflict = false;
 var solutionFound = null;

 function applyUpTo(idx) {
 currentQueens = [];
 currentTry = null;
 currentConflict = false;
 solutionFound = null;
 for (var i = 0; i <= idx && i <history.length; i++) {
 var h = history[i];
 if (h.action === 'place') {
 currentQueens[h.row] = h.col;
} else if (h.action === 'remove') {
 currentQueens.length = h.row;
} else if (h.action === 'try') {
 currentTry = {row: h.row, col: h.col};
 currentConflict = false;
} else if (h.action === 'conflict') {
 currentConflict = true;
 currentTry = {row: h.row, col: h.col};
} else if (h.action === 'solution') {
 solutionFound = h.queens.slice();
}
}
}

 function draw() {
 viz.clear();
 applyUpTo(histIdx);

 viz.screenText(N + '-Queens backtracking', viz.width / 2, 18, viz.colors.white, 15, 'center');

 var cellSize = Math.min(40, (viz.height - 100) / N);
 var boardX = (viz.width - N * cellSize) / 2;
 var boardY = 50;
 var ctx = viz.ctx;

 // Draw board
 for (var r = 0; r <N; r++) {
 for (var c = 0; c <N; c++) {
 var px = boardX + c * cellSize;
 var py = boardY + r * cellSize;
 var light = (r + c) % 2 === 0;
 ctx.fillStyle = light? '#2a2a4a': '#1a1a3a';
 ctx.fillRect(px, py, cellSize, cellSize);
 ctx.strokeStyle = viz.colors.axis + '44';
 ctx.lineWidth = 0.5;
 ctx.strokeRect(px, py, cellSize, cellSize);
}
}

 // Highlight try position
 if (currentTry) {
 var tx = boardX + currentTry.col * cellSize;
 var ty = boardY + currentTry.row * cellSize;
 ctx.fillStyle = currentConflict? viz.colors.red + '44': viz.colors.yellow + '44';
 ctx.fillRect(tx, ty, cellSize, cellSize);
}

 // Draw queens
 for (var r = 0; r <currentQueens.length; r++) {
 if (currentQueens[r]!== undefined) {
 var qx = boardX + currentQueens[r] * cellSize + cellSize / 2;
 var qy = boardY + r * cellSize + cellSize / 2;
 viz.screenText('Q', qx, qy, viz.colors.green, cellSize * 0.6, 'center', 'middle');
}
}

 // Conflict marker
 if (currentConflict && currentTry) {
 var cx2 = boardX + currentTry.col * cellSize + cellSize / 2;
 var cy2 = boardY + currentTry.row * cellSize + cellSize / 2;
 viz.screenText('X', cx2, cy2, viz.colors.red, cellSize * 0.5, 'center', 'middle');
}

 // Info
 var infoY = boardY + N * cellSize + 20;
 viz.screenText('Step ' + histIdx + '/' + (history.length - 1), viz.width / 2, infoY, viz.colors.text, 12, 'center');
 viz.screenText('find ' + solutions.length + ' solution', viz.width / 2, infoY + 22, viz.colors.teal, 12, 'center');

 if (solutionFound) {
 viz.screenText('Solution: [' + solutionFound.join(', ') + ']', viz.width / 2, infoY + 44, viz.colors.green, 13, 'center');
}
}

 VizEngine.createButton(controls, '', function() {
 if (histIdx <history.length - 1) {histIdx++; draw();}
});
 VizEngine.createButton(controls, '10', function() {
 histIdx = Math.min(histIdx + 10, history.length - 1); draw();
});
 VizEngine.createButton(controls, 'to solution', function() {
 for (var i = histIdx + 1; i <history.length; i++) {
 if (history[i].action === 'solution') {histIdx = i; draw(); return;}
}
});
 VizEngine.createButton(controls, '', function() {
 histIdx = 0; draw();
});
 VizEngine.createSlider(controls, 'N', 4, 8, N, 1, function(v) {
 N = Math.round(v); solve(); histIdx = 0; draw();
});

 draw();
 return viz;
}
}
],
 exercises: [
 {
 question: 'for 8 queen problem, not pruning search need check how many place? column constraint? diagonal constraint can decrease how many?',
 hint: ': \\(N^N\\) place. column constraint: \\(N!\\) permutation. ',
 solution: 'not pruning: \\(8^8 = 16,777,216\\) (each row 8 select, 8 row). column constraint (each column at most): \\(8! = 40,320\\) permutation. diagonal constraint, only check 15,720 node (through backtracking count), \\(8!\\) again decrease 61%. only have 92 solution. '
},
 {
 question: 'use N queen search?, for 8 queen, row queen in \\(c\\) column, only search \\(c \\le 3\\) is otherwise?',
 hint: 'use. ',
 solution: '8x8. if row queen in (\\(c \\le 3\\)), then solution can through obtain. note that: when \\(c = 3\\) or \\(c = 4\\) (position), may and same (solution), need.: only \\(c = 0, 1, 2, 3\\), each find solution determine its is otherwise and same; solution 2, solution not. this way search. '
},
 {
 question: ' N queen N queen complete problem (N-Queens Completion): given place queen, determine can otherwise N queen solution. this problem compute is what?',
 hint: 'this is NP problem. ',
 solution: 'N queen complete problem is NP (Gent et al., 2017). N queen problem for have solution, when queen already, determine is otherwise can complete is NP. this (P=NP) not there exists term algorithm, backtracking is solution need method. '
}
]
},
 // ===== Section 3: Subset Sum & Graph Coloring =====
 {
 id: 'ch18-sec03',
 title: 'Subset Sum & Graph Coloring',
 content: `<h2>3 Subset Sum and Graph Coloring</h2>

<h3>3.1 Subset Sum (Subset Sum)</h3>
<p>given \\(S = \\{s_1, \\ldots, s_n\\}\\) value \\(T\\), determine is otherwise there exists \\(S\\) subset, its element exactly \\(T\\). </p>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Subset Sum Backtracking</div>
<div class="env-body"><p>
<strong>SubsetSum(idx, currentSum, remaining):</strong><br>
1. if currentSum = T, find solution, true<br>
2. if idx = n or currentSum> T, false (pruning 1:)<br>
3. if currentSum + remaining <T, false (pruning 2: not)<br>
4. select \\(s_{\\text{idx}}\\): return SubsetSum(idx+1, currentSum + \\(s_{\\text{idx}}\\), remaining - \\(s_{\\text{idx}}\\))<br>
5. not \\(s_{\\text{idx}}\\): return SubsetSum(idx+1, currentSum, remaining - \\(s_{\\text{idx}}\\))
</p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-subset-sum"></div>

<h3>3.2 Graph Coloring (Graph Coloring)</h3>
<p>given graph \\(G = (V, E)\\) \\(k\\) color, each coloring color different. determine is otherwise there exists \\(k\\)-coloring. </p>

<div class="env-block definition">
<div class="env-title">Definition 18.4 (Graph k-Coloring)</div>
<div class="env-body"><p>\\(k\\)-coloring: \\(c: V \\to \\{1, 2, \\ldots, k\\}\\), \\(\\forall (u,v) \\in E, c(u) \\ne c(v)\\). graph <strong> (chromatic number)</strong> \\(\\chi(G)\\) is minimum \\(k\\). </p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Graph Coloring Backtracking</div>
<div class="env-body"><p>
<strong>ColorGraph(v):</strong><br>
1. if v = |V|, all coloring, true<br>
2. for color c = 1, 2,.., k:<br>
&nbsp;&nbsp;&nbsp;&nbsp;if color c and v all coloring not conflict:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;color[v] = c<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if ColorGraph(v+1), true<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;color[v] = 0 (backtracking)
</p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-graph-coloring"></div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body"><p>graph \\(k\\)-coloring problem \\(k \\ge 3\\) is NP. backtracking in sorting (: coloring) color select. </p></div>
</div>`,
 visualizations: [
 {
 id: 'ch18-viz-subset-sum',
 title: 'Subset Sum Backtracking Tree',
 description: 'Subset Sum search state-space tree, denote pruning ',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var S = [3, 5, 6, 7];
 var T = 15;
 var treeData = [];
 var edgeData = [];

 function buildTree() {
 treeData = [];
 edgeData = [];
 var remaining = S.reduce(function(a, b) {return a + b;}, 0);

 function bt(idx, sum, rem, x, y, spread) {
 var id = treeData.length;
 var pruned = sum> T;
 var hopeless = sum + rem <T;
 var solution = sum === T;
 treeData.push({id: id, x: x, y: y, sum: sum, idx: idx, pruned: pruned || hopeless, solution: solution, hopeless: hopeless});

 if (solution || pruned || hopeless || idx>= S.length) return id;

 // Include S[idx]
 var leftId = bt(idx + 1, sum + S[idx], rem - S[idx], x - spread, y + 65, spread * 0.45);
 edgeData.push({from: id, to: leftId, label: '+' + S[idx]});

 // Exclude S[idx]
 var rightId = bt(idx + 1, sum, rem - S[idx], x + spread, y + 65, spread * 0.45);
 edgeData.push({from: id, to: rightId, label: 'skip'});

 return id;
}

 bt(0, 0, remaining, 350, 45, 160);
}

 buildTree();
 var showAll = true;

 function draw() {
 viz.clear();
 viz.screenText('Subset Sum backtracking (S={' + S.join(',') + '}, T=' + T + ')', viz.width / 2, 18, viz.colors.white, 14, 'center');

 // Draw edges
 for (var i = 0; i <edgeData.length; i++) {
 var e = edgeData[i];
 var from = treeData[e.from];
 var to = treeData[e.to];
 var col = to.pruned? viz.colors.text + '33': viz.colors.axis;
 viz.drawTreeEdge(from.x, from.y, to.x, to.y, col);
 var labelCol = to.pruned? viz.colors.text + '33': viz.colors.text;
 viz.screenText(e.label, (from.x + to.x) / 2 + (to.x> from.x? 10: -10), (from.y + to.y) / 2, labelCol, 9, 'center');
}

 // Draw nodes
 for (var i = 0; i <treeData.length; i++) {
 var nd = treeData[i];
 var col, r;
 if (nd.solution) {
 col = viz.colors.green; r = 16;
} else if (nd.pruned && nd.hopeless) {
 col = viz.colors.orange + '44'; r = 12;
} else if (nd.pruned) {
 col = viz.colors.red + '44'; r = 12;
} else {
 col = viz.colors.blue; r = 14;
}
 viz.drawTreeNode(nd.x, nd.y, r, nd.sum, col, viz.colors.white);
}

 // Legend
 var ly = viz.height - 30;
 viz.drawNode(30, ly, 7, '', viz.colors.green);
 viz.screenText('solution', 44, ly, viz.colors.green, 10, 'left');
 viz.drawNode(80, ly, 7, '', viz.colors.red + '44');
 viz.screenText('sum>T', 94, ly, viz.colors.red, 10, 'left');
 viz.drawNode(160, ly, 7, '', viz.colors.orange + '44');
 viz.screenText('sum+rem<T', 174, ly, viz.colors.orange, 10, 'left');
 viz.drawNode(270, ly, 7, '', viz.colors.blue);
 viz.screenText('', 284, ly, viz.colors.blue, 10, 'left');

 var totalNodes = treeData.length;
 var prunedCount = treeData.filter(function(n) {return n.pruned;}).length;
 viz.screenText('node: ' + totalNodes + ', pruning: ' + prunedCount + ' (' + Math.round(prunedCount / totalNodes * 100) + '%)', viz.width - 150, ly, viz.colors.text, 11, 'center');
}

 VizEngine.createSlider(controls, 'Target', 5, 21, T, 1, function(v) {
 T = Math.round(v); buildTree(); draw();
});

 draw();
 return viz;
}
},
 {
 id: 'ch18-viz-graph-coloring',
 title: 'Graph Coloring Backtracking',
 description: 'graph coloring, conflict backtracking',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var nodes = [
 {id: 0, x: 200, y: 80, label: 'A'},
 {id: 1, x: 400, y: 80, label: 'B'},
 {id: 2, x: 500, y: 200, label: 'C'},
 {id: 3, x: 350, y: 310, label: 'D'},
 {id: 4, x: 150, y: 200, label: 'E'}
];
 var edges = [
 [0,1],[0,4],[1,2],[1,3],[2,3],[3,4],[0,3]
];
 var adj = [];
 for (var i = 0; i <nodes.length; i++) adj[i] = [];
 for (var i = 0; i <edges.length; i++) {
 adj[edges[i][0]].push(edges[i][1]);
 adj[edges[i][1]].push(edges[i][0]);
}
 var nColors = 3;
 var colorNames = ['', viz.colors.red, viz.colors.green, viz.colors.blue];
 var colorLabels = ['', 'R', 'G', 'B'];
 var coloring = new Array(nodes.length).fill(0);
 var history2 = [];
 var histIdx2 = 0;

 function solve2() {
 history2 = [];
 coloring = new Array(nodes.length).fill(0);
 function bt(v) {
 if (v === nodes.length) {
 history2.push({action: 'solution', coloring: coloring.slice()});
 return true;
}
 for (var c = 1; c <= nColors; c++) {
 history2.push({action: 'try', vertex: v, color: c});
 var ok = true;
 for (var ni = 0; ni <adj[v].length; ni++) {
 if (coloring[adj[v][ni]] === c) {ok = false; break;}
}
 if (ok) {
 coloring[v] = c;
 history2.push({action: 'assign', vertex: v, color: c, coloring: coloring.slice()});
 if (bt(v + 1)) return true;
 coloring[v] = 0;
 history2.push({action: 'undo', vertex: v});
} else {
 history2.push({action: 'conflict', vertex: v, color: c});
}
}
 return false;
}
 bt(0);
}

 solve2();
 var curColoring = new Array(nodes.length).fill(0);
 var curTry = null;
 var curConflict = false;
 var solutionColoring = null;

 function applyHist(idx) {
 curColoring = new Array(nodes.length).fill(0);
 curTry = null;
 curConflict = false;
 solutionColoring = null;
 for (var i = 0; i <= idx && i <history2.length; i++) {
 var h = history2[i];
 if (h.action === 'assign') {
 curColoring = h.coloring.slice();
 curTry = null;
} else if (h.action === 'undo') {
 curColoring[h.vertex] = 0;
 curTry = null;
} else if (h.action === 'try') {
 curTry = {vertex: h.vertex, color: h.color};
 curConflict = false;
} else if (h.action === 'conflict') {
 curTry = {vertex: h.vertex, color: h.color};
 curConflict = true;
} else if (h.action === 'solution') {
 solutionColoring = h.coloring.slice();
 curColoring = h.coloring.slice();
}
}
}

 function draw() {
 viz.clear();
 applyHist(histIdx2);
 viz.screenText('Graph Coloring backtracking (' + nColors + ')', viz.width / 2, 18, viz.colors.white, 14, 'center');

 // Draw edges
 for (var i = 0; i <edges.length; i++) {
 var u = edges[i][0], v = edges[i][1];
 viz.drawEdge(nodes[u].x, nodes[u].y, nodes[v].x, nodes[v].y, viz.colors.axis, false);
}

 // Draw nodes
 for (var i = 0; i <nodes.length; i++) {
 var nd = nodes[i];
 var c = curColoring[i];
 var col = c> 0? colorNames[c]: viz.colors.axis + '44';
 var label = nd.label + (c> 0? '(' + colorLabels[c] + ')': '');
 var r2 = 24;
 if (curTry && curTry.vertex === i) {
 if (curConflict) {
 viz.drawNode(nd.x, nd.y, r2 + 5, '', viz.colors.red + '44');
} else {
 viz.drawNode(nd.x, nd.y, r2 + 5, '', viz.colors.yellow + '44');
}
}
 viz.drawNode(nd.x, nd.y, r2, label, col, viz.colors.white);
}

 // Info
 viz.screenText('Step ' + histIdx2 + '/' + (history2.length - 1), viz.width / 2, 370, viz.colors.text, 12, 'center');
 if (solutionColoring) {
 viz.screenText('Solution found!', viz.width / 2, 395, viz.colors.green, 14, 'center');
}
}

 VizEngine.createButton(controls, '', function() {
 if (histIdx2 <history2.length - 1) {histIdx2++; draw();}
});
 VizEngine.createButton(controls, '5', function() {
 histIdx2 = Math.min(histIdx2 + 5, history2.length - 1); draw();
});
 VizEngine.createButton(controls, 'to solution', function() {
 for (var i = histIdx2 + 1; i <history2.length; i++) {
 if (history2[i].action === 'solution') {histIdx2 = i; draw(); return;}
}
 histIdx2 = history2.length - 1; draw();
});
 VizEngine.createButton(controls, '', function() {
 histIdx2 = 0; draw();
});

 draw();
 return viz;
}
}
],
 exercises: [
 {
 question: 'for \\(S = \\{2, 5, 8, 11, 14\\}\\) \\(T = 19\\), backtracking search tree (pruning), all solution. ',
 hint: 'each element or not. upper bound pruning: sum> 19; lower bound pruning: sum + remaining <19. ',
 solution: 'all solution: {5, 14} (=19), {8, 11} (=19), {2, 5, 8} (=15, not is),.. only have {5, 14} {8, 11} 19. pruning: 2+5+8=15, 11 26>19 pruning; 2+5=7, remaining=25, 7+25=32>=19 continue; 2+5+8+11=26>19 pruning. '
},
 {
 question: 'proof: for graph \\(K_n\\), \\(\\chi(K_n) = n\\). ',
 hint: '\\(K_n\\) each. ',
 solution: '\\(\\chi(K_n) \\ge n\\): in \\(K_n\\), any two, therefore no two can use color. n need n different color. \\(\\chi(K_n) \\le n\\): \\(i\\) \\(i\\) color, this is n-coloring. therefore \\(\\chi(K_n) = n\\). '
},
 {
 question: 'Graph Coloring backtracking algorithm, sorting can have. compare the following: (a) any; (b) by; (c) DSatur (). ',
 hint: 'DSatur: coloring"coloring use color ". ',
 solution: '(a) any:, may in search. (b): constraint, conflict, pruning. (c) DSatur: select""(use color), usually sorting more, because it when coloring state. DSatur in. decrease search node. '
}
]
},
 // ===== Section 4: Branch and Bound =====
 {
 id: 'ch18-sec04',
 title: 'Branch and Bound',
 content: `<h2>4 </h2>
<p> (Branch and Bound, B&B) is backtracking, use <strong>problem</strong>. it not only through constraint pruning, also through<strong> (bounding function)</strong> subtree may optimal value, if value not when known optimal solution, then subtree. </p>

<div class="env-block definition">
<div class="env-title">Definition 18.5 (Branch and Bound)</div>
<div class="env-body"><p>group:</p>
<p>1. <strong> (Branch):</strong> problem solution if subproblem (state-space tree node). </p>
<p>2. <strong> (Bound):</strong> each subproblem compute <strong>upper bound</strong> (maximum problem) or<strong>lower bound</strong> (minimum problem). </p>
<p>3. <strong>pruning (Prune):</strong> if subproblem not when optimal solution (called <strong>incumbent</strong>), then this subtree. </p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 18.2</div>
<div class="env-body"><p>algorithm always find optimal solution (if there exists). proof: optimal solution in not will, because its at least equals optimal value, not incumbent. </p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Generic B&B (Maximization)</div>
<div class="env-body"><p>
1.: best = \\(-\\infty\\), root node node (queue, by upper bound sorting)<br>
2. when node:<br>
&nbsp;&nbsp;&nbsp;&nbsp;upper bound maximum node \\(v\\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;if \\(v\\) is leaf node (solution):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if value(v)> best, update best<br>
&nbsp;&nbsp;&nbsp;&nbsp;otherwise then:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \\(v\\) each node \\(u\\):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;compute bound(u)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if bound(u)> best, \\(u\\) node <br>
3. best
</p></div>
</div>

<div class="env-block warning">
<div class="env-title">Warning</div>
<div class="env-body"><p>need: pruning, compute also need. this again. </p></div>
</div>

<div class="env-block example">
<div class="env-title">Example 18.2 (0-1 Knapsack B&B)</div>
<div class="env-body"><p> 0-1 knapsack, upper bound use: in when solution, use Fractional Knapsack greedy capacity can maximum value. this upper bound is (equals LP value), and compute only \\(O(n)\\). </p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-bnb-knapsack"></div>`,
 visualizations: [
 {
 id: 'ch18-viz-bnb-knapsack',
 title: '0-1 Knapsack Branch and Bound',
 description: ' B&B search tree, upper bound pruning',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 440});
 var items = [
 {name: 'A', v: 40, w: 2},
 {name: 'B', v: 30, w: 5},
 {name: 'C', v: 50, w: 10},
 {name: 'D', v: 10, w: 5}
];
 var W = 16;
 // Sort by value density
 items.sort(function(a, b) {return (b.v / b.w) - (a.v / a.w);});

 function fractionalBound(idx, curW, curV) {
 var bound = curV;
 var remW = W - curW;
 for (var i = idx; i <items.length && remW> 0; i++) {
 if (items[i].w <= remW) {
 bound += items[i].v;
 remW -= items[i].w;
} else {
 bound += items[i].v * (remW / items[i].w);
 remW = 0;
}
}
 return bound;
}

 var treeNodes3 = [];
 var treeEdges3 = [];
 var bestVal = 0;

 function buildBnBTree(idx, curW, curV, x, y, spread) {
 var id = treeNodes3.length;
 var bound = fractionalBound(idx, curW, curV);
 var pruned = bound <= bestVal && idx <items.length;
 var overweight = curW> W;
 var isLeaf = idx>= items.length;

 if (!overweight && curV> bestVal) bestVal = curV;

 treeNodes3.push({
 id: id, x: x, y: y, value: curV, weight: curW,
 bound: Math.round(bound * 10) / 10,
 pruned: pruned || overweight, isLeaf: isLeaf,
 overweight: overweight, isBest: false
});

 if (pruned || overweight || isLeaf) return id;

 // Include item[idx]
 var leftId = buildBnBTree(idx + 1, curW + items[idx].w, curV + items[idx].v, x - spread, y + 70, spread * 0.48);
 treeEdges3.push({from: id, to: leftId, label: '+' + items[idx].name});

 // Exclude item[idx]
 var rightId = buildBnBTree(idx + 1, curW, curV, x + spread, y + 70, spread * 0.48);
 treeEdges3.push({from: id, to: rightId, label: 'skip'});

 return id;
}

 buildBnBTree(0, 0, 0, 350, 50, 165);
 // Mark best
 for (var i = 0; i <treeNodes3.length; i++) {
 if (treeNodes3[i].value === bestVal &&!treeNodes3[i].overweight) {
 treeNodes3[i].isBest = true;
}
}

 var showN = 0;

 function draw() {
 viz.clear();
 viz.screenText('0-1 knapsack B&B (W=' + W + ')', viz.width / 2, 15, viz.colors.white, 14, 'center');
 viz.screenText('Items: ' + items.map(function(it){return it.name + '(v=' + it.v + ',w=' + it.w + ')';}).join(', '), viz.width / 2, 35, viz.colors.text, 10, 'center');

 var shown = showN === 0? treeNodes3.length: Math.min(showN, treeNodes3.length);

 // Edges
 for (var i = 0; i <treeEdges3.length; i++) {
 var e = treeEdges3[i];
 if (e.from>= shown || e.to>= shown) continue;
 var from = treeNodes3[e.from];
 var to = treeNodes3[e.to];
 var col = to.pruned? viz.colors.text + '33': viz.colors.axis;
 viz.drawTreeEdge(from.x, from.y, to.x, to.y, col);
 viz.screenText(e.label, (from.x + to.x) / 2 + (to.x> from.x? 12: -12), (from.y + to.y) / 2, viz.colors.text, 8, 'center');
}

 // Nodes
 for (var i = 0; i <shown; i++) {
 var nd = treeNodes3[i];
 var col, r;
 if (nd.isBest) {
 col = viz.colors.green; r = 18;
} else if (nd.overweight) {
 col = viz.colors.red + '55'; r = 14;
} else if (nd.pruned) {
 col = viz.colors.text + '44'; r = 14;
} else {
 col = viz.colors.blue; r = 15;
}
 viz.drawTreeNode(nd.x, nd.y, r, nd.value, col, viz.colors.white);
 // Show bound
 if (!nd.overweight &&!nd.isLeaf) {
 viz.screenText('ub:' + nd.bound, nd.x, nd.y + r + 10, viz.colors.yellow, 8, 'center');
}
 if (nd.overweight) {
 viz.screenText('w>' + W, nd.x, nd.y + r + 10, viz.colors.red, 8, 'center');
}
}

 // Legend
 var ly = viz.height - 25;
 viz.drawNode(30, ly, 7, '', viz.colors.green);
 viz.screenText('optimal', 44, ly, viz.colors.green, 10, 'left');
 viz.drawNode(90, ly, 7, '', viz.colors.red + '55');
 viz.screenText('', 104, ly, viz.colors.red, 10, 'left');
 viz.drawNode(160, ly, 7, '', viz.colors.text + '44');
 viz.screenText('pruning', 174, ly, viz.colors.text, 10, 'left');

 viz.screenText('optimal value: ' + bestVal, viz.width - 100, ly, viz.colors.green, 13, 'center');
}

 VizEngine.createButton(controls, '', function() {
 if (showN <treeNodes3.length) {showN++; draw();}
});
 VizEngine.createButton(controls, 'all ', function() {
 showN = 0; draw();
});
 VizEngine.createButton(controls, '', function() {
 showN = 1; draw();
});

 showN = 0;
 draw();
 return viz;
}
}
],
 exercises: [
 {
 question: 'solution ""use. for minimum problem, this compute what? what?',
 hint: 'minimum: lower bound. if subproblem lower bound already not less than when optimal, then continue. ',
 solution: 'for minimum problem, compute each subproblem <strong>lower bound</strong>.: lower bound is subproblem may to minimum value. if subproblem lower bound>= when known optimal solution (incumbent), then this subproblem not may have more solution, can safe pruning. lower bound (optimal), pruning.: maximum problem compute upper bound, if upper bound <= incumbent then pruning. '
},
 {
 question: ' 0-1 knapsack. solution what"upper bound"is efficient. ',
 hint: 'item, its optimal value>= 0-1 knapsack optimal value. ',
 solution: 'upper bound: in when item, item by sorting, use Fractional Knapsack greedy. this upper bound efficient is because: (1) Fractional Knapsack optimal value>= 0-1 knapsack optimal value (constraint obtain more row); (2) Fractional Knapsack can O(n) greedy solution, compute; (3) this upper bound equals LP value, usually compare. if upper bound <= when optimal value (incumbent), then this not may incumbent, can pruning. '
},
 {
 question: 'compare different search: (a) (Best-First); (b) depth (DFS); (c) (BFS). have what?',
 hint: ': find optimal solution, use, pruning. ',
 solution: '(a) ** (by sorting queue)**: have node.: usually find optimal solution, pruning.: (node may). (b) **DFS**: to leaf node feasible solution (incumbent).: (O(depth)), incumbent have pruning.: may. (c) **BFS**: by level.: find solution.: maximum, pruning (incumbent update). use best-first or DFS with best-first restarts. '
}
]
},
 // ===== Section 5: TSP via B&B =====
 {
 id: 'ch18-sec05',
 title: 'TSP Branch and Bound',
 content: `<h2>5 TSP </h2>
<p>Traveling Salesman Problem (TSP) is use. TSP is NP-hard, B&B through lower bound can in solution when. </p>

<div class="env-block definition">
<div class="env-title">Definition 18.6 (TSP)</div>
<div class="env-body"><p>given \\(n\\) city distance \\(d[i][j]\\), all city exactly times (). </p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: TSP Branch and Bound</div>
<div class="env-body"><p>
<strong>:</strong> in path \\((v_1, \\ldots, v_k)\\), to city. <br><br>
<strong>lower bound (Reduced Cost Matrix):</strong><br>
1. from distance, each row row minimum value, each column column minimum value<br>
2. all value = <strong> (reduction cost)</strong><br>
3. lower bound = when path + <br><br>
this lower bound is TSP optimal value efficient lower bound, because in each row each column exactly have "1", not will feasible solution.
</p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-tsp-bnb"></div>

<div class="env-block theorem">
<div class="env-title">Theorem 18.3</div>
<div class="env-body"><p>TSP in worst-case still is, through lower bound search, can in solution city (Held-Karp lower bound cutting planes). </p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark: more lower bound</div>
<div class="env-body"><p>more TSP lower bound including:<br>
1. <strong>1-tree bound (Held-Karp):</strong> minimum spanning tree, is LP, usually. <br>
2. <strong>LP relaxation:</strong> constraint constraint, use solution. <br>
 TSP solution (Concorde) B&B, cutting planes, can solution city. </p></div>
</div>

<div class="env-block example">
<div class="env-title">Example 18.3</div>
<div class="env-body"><p>for 5 city TSP, B&B usually only state-space tree (node), need \\((5-1)!/2 = 12\\). for more,. </p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-tsp-tour"></div>

<div class="env-block intuition">
<div class="env-title">Intuition: Backtracking vs B&B vs DP for TSP</div>
<div class="env-body"><p>method can solution TSP, use different:</p>
<p><strong>backtracking:</strong>, \\(n \\le 12\\). </p>
<p><strong>B&B:</strong> lower bound, \\(n \\le 30-50\\); more. </p>
<p><strong> DP (Held-Karp):</strong> \\(O(2^n n^2)\\), \\(O(2^n n)\\), \\(n \\le 20\\) (). </p></div>
</div>`,
 visualizations: [
 {
 id: 'ch18-viz-tsp-bnb',
 title: 'TSP Branch and Bound Search Tree',
 description: ' B&B through lower bound pruning search TSP solution space',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 440});

 var cities = ['A', 'B', 'C', 'D', 'E'];
 var nC = cities.length;
 var dist = [
 [0, 20, 30, 10, 11],
 [15, 0, 16, 4, 2],
 [3, 5, 0, 2, 4],
 [19, 6, 18, 0, 3],
 [16, 4, 7, 16, 0]
];

 // B&B with reduction bound
 var bnbNodes = [];
 var bnbEdges = [];
 var bestTour = null;
 var bestCost = Infinity;

 function reduceBound(matrix, n2) {
 var cost = 0;
 // Row reduction
 for (var i = 0; i <n2; i++) {
 var mn = Infinity;
 for (var j = 0; j <n2; j++) {
 if (matrix[i][j] <mn) mn = matrix[i][j];
}
 if (mn!== Infinity && mn> 0) {
 cost += mn;
 for (var j = 0; j <n2; j++) {
 if (matrix[i][j]!== Infinity) matrix[i][j] -= mn;
}
}
}
 // Col reduction
 for (var j = 0; j <n2; j++) {
 var mn2 = Infinity;
 for (var i = 0; i <n2; i++) {
 if (matrix[i][j] <mn2) mn2 = matrix[i][j];
}
 if (mn2!== Infinity && mn2> 0) {
 cost += mn2;
 for (var i = 0; i <n2; i++) {
 if (matrix[i][j]!== Infinity) matrix[i][j] -= mn2;
}
}
}
 return cost;
}

 function solveTSP() {
 bnbNodes = [];
 bnbEdges = [];
 bestCost = Infinity;
 bestTour = null;

 // Simple DFS B&B
 function bt(path, visited, cost, x, y, spread) {
 var id = bnbNodes.length;
 var last = path[path.length - 1];

 // Lower bound: cost + sum of min outgoing edges for unvisited
 var lb = cost;
 for (var i = 0; i <nC; i++) {
 if (visited[i] && i!== last) continue;
 var minOut = Infinity;
 for (var j = 0; j <nC; j++) {
 if (i === j) continue;
 if (visited[j] && j!== 0) continue;
 if (path.length === nC && j!== 0) continue;
 minOut = Math.min(minOut, dist[i][j]);
}
 if (minOut!== Infinity) lb += minOut;
}

 var pruned = lb>= bestCost && path.length <nC;
 var isComplete = path.length === nC;
 var totalCost = isComplete? cost + dist[last][0]: cost;

 if (isComplete && totalCost <bestCost) {
 bestCost = totalCost;
 bestTour = path.slice();
}

 bnbNodes.push({
 id: id, x: x, y: y,
 path: path.slice(),
 cost: cost,
 lb: Math.round(lb),
 pruned: pruned,
 isComplete: isComplete,
 totalCost: totalCost,
 isBest: false
});

 if (pruned || isComplete) return id;

 var childSpread = spread / Math.max(1, nC - path.length);
 var childX = x - spread / 2;
 var childCount = 0;
 for (var next = 0; next <nC; next++) {
 if (visited[next]) continue;
 visited[next] = true;
 path.push(next);
 var cx = childX + childCount * childSpread;
 var childId = bt(path, visited, cost + dist[last][next], cx, y + 65, childSpread * 0.7);
 bnbEdges.push({from: id, to: childId, label: cities[next]});
 path.pop();
 visited[next] = false;
 childCount++;
}

 return id;
}

 var visited0 = new Array(nC).fill(false);
 visited0[0] = true;
 bt([0], visited0, 0, 350, 40, 300);

 // Mark best
 for (var i = 0; i <bnbNodes.length; i++) {
 if (bnbNodes[i].isComplete && bnbNodes[i].totalCost === bestCost) {
 bnbNodes[i].isBest = true;
}
}
}

 solveTSP();

 function draw() {
 viz.clear();
 viz.screenText('TSP (5 city)', viz.width / 2, 15, viz.colors.white, 14, 'center');

 // Draw edges
 for (var i = 0; i <bnbEdges.length; i++) {
 var e = bnbEdges[i];
 var from = bnbNodes[e.from];
 var to = bnbNodes[e.to];
 var col = to.pruned? viz.colors.text + '33': viz.colors.axis;
 viz.drawTreeEdge(from.x, from.y, to.x, to.y, col);
 viz.screenText(e.label, (from.x + to.x) / 2 + (to.x> from.x? 8: -8), (from.y + to.y) / 2 - 3, viz.colors.text, 8, 'center');
}

 // Draw nodes
 for (var i = 0; i <bnbNodes.length; i++) {
 var nd = bnbNodes[i];
 var col, r;
 if (nd.isBest) {
 col = viz.colors.green; r = 14;
} else if (nd.pruned) {
 col = viz.colors.red + '44'; r = 10;
} else if (nd.isComplete) {
 col = viz.colors.orange; r = 12;
} else {
 col = viz.colors.blue; r = 11;
}
 var label = nd.isComplete? nd.totalCost: nd.cost;
 viz.drawTreeNode(nd.x, nd.y, r, label, col, viz.colors.white);
 if (!nd.isComplete &&!nd.pruned) {
 viz.screenText('lb:' + nd.lb, nd.x, nd.y + r + 8, viz.colors.yellow, 7, 'center');
}
 if (nd.pruned) {
 viz.screenText('X', nd.x + r + 3, nd.y - r, viz.colors.red, 9, 'center');
}
}

 // Stats
 var totalN = bnbNodes.length;
 var prunedN = bnbNodes.filter(function(n) {return n.pruned;}).length;
 viz.screenText('node: ' + totalN + ', pruning: ' + prunedN, 120, viz.height - 25, viz.colors.text, 11, 'center');
 if (bestTour) {
 var tourStr = bestTour.map(function(c) {return cities[c];}).join(' -> ') + ' -> ' + cities[0];
 viz.screenText('optimal: ' + tourStr + ' = ' + bestCost, viz.width / 2, viz.height - 25, viz.colors.green, 12, 'center');
}
}

 draw();
 return viz;
}
},
 {
 id: 'ch18-viz-tsp-tour',
 title: 'TSP Optimal Route Map',
 description: 'in graph B&B find optimal row ',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 380});
 var cities = [
 {x: 100, y: 100, label: 'A'},
 {x: 350, y: 60, label: 'B'},
 {x: 550, y: 130, label: 'C'},
 {x: 500, y: 280, label: 'D'},
 {x: 200, y: 250, label: 'E'},
 {x: 350, y: 180, label: 'F'}
];
 var nC2 = cities.length;
 var dist2 = [];
 for (var i = 0; i <nC2; i++) {
 dist2[i] = [];
 for (var j = 0; j <nC2; j++) {
 var dx = cities[i].x - cities[j].x;
 var dy = cities[i].y - cities[j].y;
 dist2[i][j] = Math.round(Math.sqrt(dx * dx + dy * dy));
}
}

 // Nearest neighbor heuristic
 function nearestNeighbor() {
 var visited = new Array(nC2).fill(false);
 var tour = [0];
 visited[0] = true;
 for (var step = 1; step <nC2; step++) {
 var last = tour[tour.length - 1];
 var best = -1, bestD = Infinity;
 for (var j = 0; j <nC2; j++) {
 if (!visited[j] && dist2[last][j] <bestD) {
 bestD = dist2[last][j];
 best = j;
}
}
 tour.push(best);
 visited[best] = true;
}
 return tour;
}

 // Brute force optimal
 function bruteForce() {
 var perm = [];
 for (var i = 1; i <nC2; i++) perm.push(i);
 var bestT = null, bestC = Infinity;
 function permute(arr, l) {
 if (l === arr.length) {
 var c = dist2[0][arr[0]];
 for (var i = 0; i <arr.length - 1; i++) c += dist2[arr[i]][arr[i + 1]];
 c += dist2[arr[arr.length - 1]][0];
 if (c <bestC) {bestC = c; bestT = [0].concat(arr.slice());}
 return;
}
 for (var i = l; i <arr.length; i++) {
 var t = arr[l]; arr[l] = arr[i]; arr[i] = t;
 permute(arr, l + 1);
 t = arr[l]; arr[l] = arr[i]; arr[i] = t;
}
}
 permute(perm, 0);
 return {tour: bestT, cost: bestC};
}

 var nnTour = nearestNeighbor();
 var optResult = bruteForce();
 var showMode = 'optimal'; // 'nn' or 'optimal'

 function tourCost(tour) {
 var c = 0;
 for (var i = 0; i <tour.length - 1; i++) c += dist2[tour[i]][tour[i + 1]];
 c += dist2[tour[tour.length - 1]][tour[0]];
 return c;
}

 function draw() {
 viz.clear();
 var tour = showMode === 'nn'? nnTour: optResult.tour;
 var cost = tourCost(tour);
 var title = showMode === 'nn'? '': 'optimal solution (B&B/)';
 var titleCol = showMode === 'nn'? viz.colors.orange: viz.colors.green;

 viz.screenText('TSP: ' + title, viz.width / 2, 18, titleCol, 15, 'center');

 // Draw all edges lightly
 for (var i = 0; i <nC2; i++) {
 for (var j = i + 1; j <nC2; j++) {
 viz.drawEdge(cities[i].x, cities[i].y, cities[j].x, cities[j].y, viz.colors.axis + '22', false);
}
}

 // Draw tour
 for (var i = 0; i <tour.length; i++) {
 var u = tour[i];
 var v = tour[(i + 1) % tour.length];
 viz.drawEdge(cities[u].x, cities[u].y, cities[v].x, cities[v].y, titleCol, true, null, 3);
}

 // Draw cities
 for (var i = 0; i <nC2; i++) {
 viz.drawNode(cities[i].x, cities[i].y, 22, cities[i].label, viz.colors.blue, viz.colors.white);
}

 viz.screenText('distance: ' + cost, viz.width / 2, 340, titleCol, 14, 'center');
 if (showMode === 'nn') {
 viz.screenText('optimal: ' + optResult.cost + ' (' + Math.round((cost - optResult.cost) / optResult.cost * 100) + '%)', viz.width / 2, 362, viz.colors.text, 12, 'center');
}
}

 VizEngine.createButton(controls, 'optimal solution', function() {
 showMode = 'optimal'; draw();
});
 VizEngine.createButton(controls, '', function() {
 showMode = 'nn'; draw();
});

 draw();
 return viz;
}
}
],
 exercises: [
 {
 question: 'for distance \\(\\begin{pmatrix} \\infty & 10 & 15 & 20 \\\\ 5 & \\infty & 9 & 10 \\\\ 6 & 13 & \\infty & 12 \\\\ 8 & 8 & 9 & \\infty \\end{pmatrix}\\), compute root node lower bound. ',
 hint: 'row: each row minimum value. column: each column minimum value. ',
 solution: 'row: row 010, row 15, row 26, row 38, row = 29.: [[inf,0,5,10],[0,inf,4,5],[0,7,inf,6],[0,0,1,inf]]. column: column 00, column 10, column 21, column 35, column = 6. = 29 + 6 = 35. this is TSP optimal solution lower bound. '
},
 {
 question: 'solution what TSP worst-case., what B&B node?',
 hint: ': lower bound, solution, problem. ',
 solution: ' B&B key: (1) **lower bound **: lower bound (Held-Karp lower bound usually in optimal value 1-2%), pruning. (2) **solution (incumbent) **: use (, 2-opt) find solution, more node lower bound incumbent. (3) **search **: best-first have node. (4) **problem **: "random"TSP usually more., B&B 50-100 city TSP only state space (\\(n!\\)). '
},
 {
 question: 'compare backtracking in the following problem use: (a) N queen (/); (b) 0-1 knapsack (); (c) SAT (). ',
 hint: 'problem use backtracking, problem use B&B. ',
 solution: '(a) **N queen (/)**: use backtracking. this is constraint satisfaction problem, no, not need. pruning column/diagonal constraint. (b) **0-1 knapsack ()**: use B&B. have (maximum value), can use upper bound row pruning. also can use DP (term). (c) **SAT ()**: use backtracking (DPLL/CDCL algorithm). is backtracking + (unit propagation) + conflict (CDCL). not is problem, CDCL conflict can see "can pruning". '
},
 {
 question: 'backtracking algorithm solution Sudoku (Sudoku). state denote, select pruning method. ',
 hint: 'state: when; select:; constraint: row/column/not. ',
 solution: '**state**: 9x9,. **select**:, 1-9. **constraint check**: check row, column, 3x3 is otherwise have. **pruning**: (1) row pruning: row/column/constraint then. (2) **MRV **: "" (Minimum Remaining Values), conflict. (3) **constraint **:, update row/column/its he, if then (naked singles). (4): use naked pairs/triples. this pruning Sudoku can in not to 100 times backtracking solution. '
},
 {
 question: 'algorithm (greedy, DP, backtracking/B&B) use, problem. ',
 hint: 'from problem (//), subproblem, compare. ',
 solution: '**greedy**: have greedy-choice property problem, usually \\(O(n\\log n)\\).: Activity Selection, Huffman encoding, Fractional Knapsack. **DP**: have optimal substructure + overlapping subproblems /problem, usually term (or term).: 0-1 knapsack, LCS, Edit Distance, Matrix Chain Multiplication. **backtracking/B&B**: constraint satisfaction problem (backtracking) NP-hard problem (B&B), pruning row.: N queen (backtracking), TSP (B&B), SAT (backtracking+). select: can greedy greedy (); not can greedy DP (term); DP also not row backtracking/B&B (have pruning). '
}
]
}
]
});
