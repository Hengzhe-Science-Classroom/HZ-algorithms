// ============================================================
// Ch 17 · Dynamic Programming (Dynamic Programming)
// ============================================================
window.CHAPTERS.push({
 id: 'ch17',
 number: 17,
 title: 'Dynamic Programming',
 subtitle: 'Dynamic Programming -- Optimal Substructure Meets Overlapping Subproblems',
 sections: [
 // ===== Section 1: Foundations =====
 {
 id: 'ch17-sec01',
 title: 'Core Ideas of DP',
 content: `<h2>1. Core Ideas of DP</h2>
<div class="env-block bridge"><div class="env-title">Chapter Overview</div><div class="env-body"><p>Greedy algorithms (Chapter 16) make irrevocable choices and sometimes miss the optimum. Dynamic programming (DP) takes the opposite approach: systematically explore all choices by breaking the problem into overlapping subproblems and storing their solutions. Where divide-and-conquer (Chapter 4) solves independent subproblems, DP exploits the fact that the same subproblems recur. This chapter develops DP through a progression of classic problems, from Fibonacci numbers to the Travelling Salesman.</p></div></div>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>We begin with the core ideas: optimal substructure, overlapping subproblems, and the choice between top-down memoization and bottom-up tabulation. The Fibonacci sequence illustrates how DP transforms an exponential recursive algorithm into a linear one.</p></div></div>

<p>Dynamic Programming (dynamic programming, DP) is through<strong>solution subproblem</strong>, <strong>result</strong>compute algorithm. it use have two key problem:</p>

<div class="env-block definition">
<div class="env-title">Definition 17.1 (Optimal Substructure)</div>
<div class="env-body"><p><strong>optimal substructure:</strong> problem optimal solution contain its subproblem optimal solution., can through combination subproblem optimal solution problem optimal solution. </p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 17.2 (Overlapping Subproblems)</div>
<div class="env-body"><p><strong>overlapping subproblems:</strong> recursive solution procedure, subproblem will times solution. DP through (memoization) or tabulation (tabulation) compute. </p></div>
</div>

<div class="env-block intuition">
<div class="env-title">Intuition: DP vs Greedy vs Divide & Conquer</div>
<div class="env-body"><p><strong>divide and conquer:</strong> subproblem not, solution merge (Merge Sort). <br>
<strong>greedy:</strong> do times select not, only solution subproblem (Activity Selection). <br>
<strong>DP:</strong> subproblem, need result; may need all subproblem combination do optimal select. </p></div>
</div>

<div class="env-block example">
<div class="env-title">Example 17.1 (Fibonacci: DP Motivation)</div>
<div class="env-body"><p>recursive: \\(F(n) = F(n-1) + F(n-2)\\), \\(O(2^n)\\) -- because subproblem compute. <br>
DP (bottom-up): use array \\(F[0], F[1], \\ldots, F[n]\\), \\(O(n)\\). this is DP. </p></div>
</div>

<div class="viz-placeholder" data-viz="ch17-viz-fib-tree"></div>

<div class="env-block definition">
<div class="env-title">Definition 17.3 (Top-Down vs Bottom-Up)</div>
<div class="env-body"><p><strong>top-down (Top-Down / Memoization):</strong> use recursive, times compute subproblem result,.: only compute need subproblem. <br>
<strong>bottom-up (Bottom-Up / Tabulation):</strong> by from minimum subproblem start table-filling, more subproblem solution.: no recursive,. </p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: DP Design Recipe</div>
<div class="env-body"><p>
1. <strong>define subproblem:</strong> determine DP state, \\(dp[i]\\) or \\(dp[i][j]\\) what<br>
2. <strong>recurrence:</strong> \\(dp[i]\\) more subproblem <br>
3. <strong>determine:</strong> minimum subproblem solution<br>
4. <strong>determine compute:</strong> compute \\(dp[i]\\), subproblem already solution<br>
5. <strong>:</strong> from DP problem solution<br>
6. () <strong>backtracking solution:</strong> if need, backtracking
</p></div>
</div>`,
 visualizations: [
 {
 id: 'ch17-viz-fib-tree',
 title: 'Fibonacci Recursion Tree vs Memoization',
 description: 'recursive compute and pruning ',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var n = 6;
 var mode = 'naive'; // 'naive' or 'memo'
 var computeCount = 0;

 function buildTree(k, depth, xCenter, xSpread) {
 if (k <= 1) return {val: k, x: xCenter, depth: depth, children: [], computed: false};
 var node = {val: k, x: xCenter, depth: depth, children: [], computed: false};
 node.children.push(buildTree(k - 1, depth + 1, xCenter - xSpread, xSpread * 0.5));
 node.children.push(buildTree(k - 2, depth + 1, xCenter + xSpread, xSpread * 0.5));
 return node;
}

 function flattenTree(node) {
 var list = [node];
 for (var i = 0; i <node.children.length; i++) {
 list = list.concat(flattenTree(node.children[i]));
}
 return list;
}

 function markMemo(node, memo) {
 if (memo[node.val]!== undefined) {
 node.cached = true;
 return;
}
 memo[node.val] = true;
 node.cached = false;
 for (var i = 0; i <node.children.length; i++) {
 markMemo(node.children[i], memo);
}
}

 var tree = buildTree(n, 0, 350, 150);

 function draw() {
 viz.clear();
 var title = mode === 'naive'? 'Fibonacci recursive tree (!)': 'Fibonacci (=)';
 viz.screenText(title, viz.width / 2, 18, viz.colors.white, 14, 'center');

 tree = buildTree(n, 0, 350, 150);
 if (mode === 'memo') markMemo(tree, {});

 var flat = flattenTree(tree);
 computeCount = 0;
 var cacheHits = 0;

 // Draw edges first
 for (var i = 0; i <flat.length; i++) {
 var nd = flat[i];
 var py = 55 + nd.depth * 55;
 for (var j = 0; j <nd.children.length; j++) {
 var ch = nd.children[j];
 var cy = 55 + ch.depth * 55;
 var eColor = (mode === 'memo' && ch.cached)? viz.colors.green + '44': viz.colors.axis;
 viz.drawTreeEdge(nd.x, py, ch.x, cy, eColor);
}
}

 // Draw nodes
 for (var i = 0; i <flat.length; i++) {
 var nd = flat[i];
 var py = 55 + nd.depth * 55;
 var col;
 if (mode === 'memo' && nd.cached) {
 col = viz.colors.green;
 cacheHits++;
} else {
 col = viz.colors.blue;
 computeCount++;
}
 viz.drawTreeNode(nd.x, py, 16, 'F(' + nd.val + ')', col, viz.colors.white);
}

 var info;
 if (mode === 'naive') {
 info = 'use: ' + flat.length + ' times (!)';
} else {
 info = 'compute: ' + computeCount + ',: ' + cacheHits + ' (!)';
}
 viz.screenText(info, viz.width / 2, viz.height - 20, viz.colors.yellow, 13, 'center');
}

 VizEngine.createButton(controls, 'recursive', function() {mode = 'naive'; draw();});
 VizEngine.createButton(controls, '', function() {mode = 'memo'; draw();});
 VizEngine.createSlider(controls, 'n', 3, 7, n, 1, function(v) {n = Math.round(v); draw();});

 draw();
 return viz;
}
}
],
 exercises: [
 {
 question: ' DP algorithm compute "" problem: have \\(n\\), each times can 1 or 2, have how many to? recurrence /space complexity. ',
 hint: 'to \\(n\\) = to \\(n-1\\) + to \\(n-2\\). ',
 solution: 'recurrence: \\(dp[i] = dp[i-1] + dp[i-2]\\), \\(dp[0] = 1, dp[1] = 1\\). this is Fibonacci column! \\(O(n)\\), \\(O(n)\\) (to \\(O(1)\\), only two value). '
},
 {
 question: 'top-down (recursive) and bottom-up (table-filling). ',
 hint: ': subproblem, recursive stack,. ',
 solution: '**top-down**: -- only compute need subproblem (subproblem graph have), more recurrence. -- recursive stack, may stack,. **bottom-up**: -- recursive, can array, more. -- must compute all subproblem (have not need), need determine correct table-filling. use, bottom-up usually more, top-down usually more. '
},
 {
 question: 'solution what greedy can solve problem DP also can solution (not), Activity Selection. ',
 hint: 'DP all subproblem combination, greedy only. ',
 solution: 'DP through all may select optimal, greedy only do times optimal select. therefore DP greedy more"use": greedy can solution problem, DP can solution (may). Activity Selection: DP solution \\(dp[i]\\) = \\(i\\) activity maximum size, is otherwise \\(i\\) activity. greedy by end, not need DP, more., 0-1 knapsack only can use DP, greedy solve. '
}
]
},
 // ===== Section 2: Classic DP Problems =====
 {
 id: 'ch17-sec02',
 title: 'Classic DP Problems: Rod Cutting & LCS',
 content: `<h2>2 DP problem: and LCS</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>The rod cutting problem and the Longest Common Subsequence (LCS) are two classic DP problems. Rod cutting shows how to optimize over all possible cuts; LCS shows how to align two sequences. Both build DP tables that reveal the structure of optimal solutions.</p></div></div>


<h3>2.1 (Rod Cutting)</h3>
<p>given \\(n\\) \\(p[1.n]\\), its \\(p[i]\\) is length \\(i\\). cut revenue maximum. </p>

<div class="env-block definition">
<div class="env-title">Definition 17.4 (Rod Cutting)</div>
<div class="env-body"><p>$$r_n = \\max_{1 \\le i \\le n}\\{p_i + r_{n-i}\\}$$: \\(r_0 = 0\\). this \\(r_n\\) is length \\(n\\) optimal revenue. </p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Bottom-Up Rod Cutting</div>
<div class="env-body"><p>
1. \\(r[0] = 0\\)<br>
2. for \\(j = 1, 2, \\ldots, n\\):<br>
&nbsp;&nbsp;&nbsp;&nbsp;\\(q = -\\infty\\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;for \\(i = 1, 2, \\ldots, j\\):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\(q = \\max(q, p[i] + r[j-i])\\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;\\(r[j] = q\\)<br>
3. \\(r[n]\\)<br>
 \\(O(n^2)\\), \\(O(n)\\).
</p></div>
</div>

<h3>2.2 Longest Common Subsequence (LCS)</h3>
<p>given column \\(X = (x_1, \\ldots, x_m)\\) \\(Y = (y_1, \\ldots, y_n)\\), it Longest Common Subsequence length. </p>

<div class="env-block definition">
<div class="env-title">Definition 17.5 (LCS Recurrence)</div>
<div class="env-body"><p>$$c[i][j] = \\begin{cases} 0 & \\text{if} i = 0 \\text{or} j = 0 \\\\ c[i-1][j-1] + 1 & \\text{if} x_i = y_j \\\\ \\max(c[i-1][j], c[i][j-1]) & \\text{if} x_i \\ne y_j \\end{cases}$$</p></div>
</div>

<p> \\(O(mn)\\), \\(O(mn)\\) (to \\(O(\\min(m,n))\\)). </p>

<div class="viz-placeholder" data-viz="ch17-viz-lcs"></div>

<div class="env-block example">
<div class="env-title">Example 17.2</div>
<div class="env-body"><p>\\(X = \\text{ABCBDAB}\\), \\(Y = \\text{BDCABA}\\). LCS length 4, LCS BCBA. </p></div>
</div>`,
 visualizations: [
 {
 id: 'ch17-viz-lcs',
 title: 'LCS DP Table Animation',
 description: ' LCS DP, when backtracking path',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 450});
 var X = 'ABCBDAB';
 var Y = 'BDCABA';
 var m = X.length;
 var nn = Y.length;
 var dp = [];
 var dir = []; // 'diag', 'up', 'left'
 for (var i = 0; i <= m; i++) {
 dp[i] = new Array(nn + 1).fill(0);
 dir[i] = new Array(nn + 1).fill('');
}

 var step = 0;
 var maxStep = m * nn;
 var showPath = false;

 function getIJ(s) {
 var i = Math.floor(s / nn) + 1;
 var j = (s % nn) + 1;
 return [i, j];
}

 function computeUpTo(s) {
 for (var r = 0; r <= m; r++) {
 dp[r] = new Array(nn + 1).fill(0);
 dir[r] = new Array(nn + 1).fill('');
}
 for (var k = 0; k <s; k++) {
 var ij = getIJ(k);
 var ii = ij[0], jj = ij[1];
 if (X[ii - 1] === Y[jj - 1]) {
 dp[ii][jj] = dp[ii - 1][jj - 1] + 1;
 dir[ii][jj] = 'diag';
} else if (dp[ii - 1][jj]>= dp[ii][jj - 1]) {
 dp[ii][jj] = dp[ii - 1][jj];
 dir[ii][jj] = 'up';
} else {
 dp[ii][jj] = dp[ii][jj - 1];
 dir[ii][jj] = 'left';
}
}
}

 function getBacktrackPath() {
 var path = [];
 var i = m, j = nn;
 while (i> 0 && j> 0) {
 if (dir[i][j] === 'diag') {
 path.push([i, j]);
 i--; j--;
} else if (dir[i][j] === 'up') {
 i--;
} else {
 j--;
}
}
 return path;
}

 function draw() {
 viz.clear();
 computeUpTo(step);
 var cellW = 42;
 var cellH = 34;
 var ox = 80;
 var oy = 70;

 viz.screenText('LCS DP ', viz.width / 2, 18, viz.colors.white, 15, 'center');
 viz.screenText('X = ' + X + ', Y = ' + Y, viz.width / 2, 42, viz.colors.yellow, 12, 'center');

 // Column headers (Y)
 viz.screenText('', ox, oy - 20, viz.colors.text, 11, 'center');
 for (var j = 0; j <= nn; j++) {
 var hdr = j === 0? '': Y[j - 1];
 viz.screenText(hdr, ox + (j + 1) * cellW + cellW / 2, oy - 8, viz.colors.teal, 13, 'center');
}

 // Row headers (X)
 for (var i = 0; i <= m; i++) {
 var hdr2 = i === 0? '': X[i - 1];
 viz.screenText(hdr2, ox - 5, oy + (i + 1) * cellH + cellH / 2, viz.colors.teal, 13, 'right');
}

 // Current cell
 var curI = -1, curJ = -1;
 if (step <maxStep) {
 var cur = getIJ(step);
 curI = cur[0]; curJ = cur[1];
}

 // Backtrack path
 var pathCells = {};
 if (showPath && step === maxStep) {
 var path = getBacktrackPath();
 for (var p = 0; p <path.length; p++) {
 pathCells[path[p][0] + ',' + path[p][1]] = true;
}
}

 // Draw cells
 for (var i = 0; i <= m; i++) {
 for (var j = 0; j <= nn; j++) {
 var px = ox + (j + 1) * cellW;
 var py = oy + (i + 1) * cellH;
 var bg = viz.colors.bg;
 var hl = null;

 if (i === curI && j === curJ) {
 hl = viz.colors.yellow;
} else if (pathCells[i + ',' + j]) {
 hl = viz.colors.green;
}

 var computed = (i === 0 || j === 0);
 if (i> 0 && j> 0) {
 var k = (i - 1) * nn + (j - 1);
 computed = k <step;
}

 if (computed || i === 0 || j === 0) {
 viz.drawArrayCell(px, py, cellW, cellH, dp[i][j], bg, viz.colors.white, hl);
} else {
 viz.drawArrayCell(px, py, cellW, cellH, '?', viz.colors.bg, viz.colors.text + '44', hl);
}
}
}

 // Info
 if (step === maxStep) {
 viz.screenText('LCS length = ' + dp[m][nn], viz.width / 2, oy + (m + 2) * cellH + 15, viz.colors.green, 14, 'center');
 if (showPath) {
 var path2 = getBacktrackPath();
 var lcs = '';
 for (var p = path2.length - 1; p>= 0; p--) {
 lcs += X[path2[p][0] - 1];
}
 viz.screenText('LCS = ' + lcs, viz.width / 2, oy + (m + 2) * cellH + 35, viz.colors.teal, 13, 'center');
}
} else {
 viz.screenText('Step ' + step + '/' + maxStep, viz.width / 2, oy + (m + 2) * cellH + 15, viz.colors.text, 12, 'center');
}
}

 VizEngine.createButton(controls, '', function() {
 if (step <maxStep) {step++; draw();}
});
 VizEngine.createButton(controls, '10', function() {
 step = Math.min(step + 10, maxStep); draw();
});
 VizEngine.createButton(controls, 'all ', function() {
 step = maxStep; draw();
});
 VizEngine.createButton(controls, 'backtracking path', function() {
 step = maxStep; showPath = true; draw();
});
 VizEngine.createButton(controls, '', function() {
 step = 0; showPath = false; draw();
});

 draw();
 return viz;
}
}
],
 exercises: [
 {
 question: 'problem, given \\(p = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30]\\) (\\(p[0]=0\\)), \\(r_7\\) (length 7 optimal revenue) cut. ',
 hint: 'bottom-up table-filling: \\(r[j] = \\max_{1 \\le i \\le j}(p[i] + r[j-i])\\). ',
 solution: '\\(r[1]=1, r[2]=5, r[3]=8, r[4]=10, r[5]=13, r[6]=17, r[7]=18\\). cut: 7 = 1 + 6, revenue = 1 + 17 = 18. (or its he)'
},
 {
 question: ' \\(X = \\text{STONE}\\) \\(Y = \\text{LONGEST}\\), LCS length DP. ',
 hint: ' 5x7 DP. ',
 solution: 'LCS length = 3, LCS "ONE". DP (row=S,T,O,N,E; column=L,O,N,G,E,S,T): finally row maximum value 3. '
},
 {
 question: 'LCS can from \\(O(mn)\\) to \\(O(\\min(m,n))\\). do to? if also need backtracking LCS?',
 hint: 'only row (when row row) can compute DP value. backtracking need Hirschberg algorithm. ',
 solution: ': since \\(c[i][j]\\) only \\(c[i-1][j-1], c[i-1][j], c[i][j-1]\\), can only row (or row), \\(O(\\min(m,n))\\). backtracking: need Hirschberg algorithm -- divide and conquer, in row partition, recursive LCS, \\(O(\\min(m,n))\\), \\(O(mn)\\). '
}
]
},
 // ===== Section 3: Edit Distance =====
 {
 id: 'ch17-sec03',
 title: 'Edit Distance & Matrix Chain',
 content: `<h2>3 Edit Distance and Matrix Chain</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Edit distance (the minimum number of insertions, deletions, and substitutions to transform one string into another) extends LCS to a richer operation set. Matrix chain multiplication shows how DP optimizes the order of associative operations, a technique used in database query planning.</p></div></div>


<h3>3.1 Edit Distance (Edit Distance)</h3>
<p>Edit Distance (Levenshtein distance) (insert, delete, replace). </p>

<div class="env-block definition">
<div class="env-title">Definition 17.6 (Edit Distance)</div>
<div class="env-body"><p> \\(X = x_1 \\ldots x_m\\), \\(Y = y_1 \\ldots y_n\\). Edit Distance \\(d[i][j]\\) \\(X[1.i]\\) \\(Y[1.j]\\): $$d[i][j] = \\begin{cases} j & \\text{if} i = 0 \\\\ i & \\text{if} j = 0 \\\\ d[i-1][j-1] & \\text{if} x_i = y_j \\\\ 1 + \\min(d[i-1][j], d[i][j-1], d[i-1][j-1]) & \\text{otherwise} \\end{cases}$$</p></div>
</div>

<p>three: \\(d[i-1][j] + 1\\) (from \\(X\\)), \\(d[i][j-1] + 1\\) (\\(X\\)), \\(d[i-1][j-1] + 1\\) (replace). </p>

<div class="viz-placeholder" data-viz="ch17-viz-edit-distance"></div>

<h3>3.2 Matrix Chain Multiplication (Matrix Chain Multiplication)</h3>
<p>given Matrix Chain \\(A_1 A_2 \\cdots A_n\\), its \\(A_i\\) is \\(p_{i-1} \\times p_i\\), optimal minimum times. </p>

<div class="env-block definition">
<div class="env-title">Definition 17.7 (Matrix Chain DP)</div>
<div class="env-body"><p>$$m[i][j] = \\begin{cases} 0 & \\text{if} i = j \\\\ \\min_{i \\le k <j} \\{m[i][k] + m[k+1][j] + p_{i-1} p_k p_j\\} & \\text{if} i <j \\end{cases}$$</p></div>
</div>

<p> \\(O(n^3)\\), \\(O(n^2)\\). </p>

<div class="viz-placeholder" data-viz="ch17-viz-matrix-chain"></div>

<div class="env-block example">
<div class="env-title">Example 17.3</div>
<div class="env-body"><p>: \\(p = [30, 35, 15, 5, 10, 20, 25]\\) (6). optimal: \\((A_1(A_2 A_3))((A_4 A_5)A_6)\\), times = 15125. </p></div>
</div>`,
 visualizations: [
 {
 id: 'ch17-viz-edit-distance',
 title: 'Edit Distance DP Table & Alignment Path',
 description: 'Edit Distance, optimal ',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 440});
 var X = 'KITTEN';
 var Y = 'SITTING';
 var m2 = X.length;
 var n2 = Y.length;
 var dpE = [];
 var dirE = [];
 var stepE = 0;
 var maxStepE = (m2 + 1) * (n2 + 1);
 var showPathE = false;

 function computeAll() {
 dpE = [];
 dirE = [];
 for (var i = 0; i <= m2; i++) {
 dpE[i] = new Array(n2 + 1).fill(-1);
 dirE[i] = new Array(n2 + 1).fill('');
}
 for (var i = 0; i <= m2; i++) {dpE[i][0] = i; dirE[i][0] = 'up';}
 for (var j = 0; j <= n2; j++) {dpE[0][j] = j; dirE[0][j] = 'left';}
 dirE[0][0] = '';
 for (var i = 1; i <= m2; i++) {
 for (var j = 1; j <= n2; j++) {
 if (X[i - 1] === Y[j - 1]) {
 dpE[i][j] = dpE[i - 1][j - 1];
 dirE[i][j] = 'diag';
} else {
 var del = dpE[i - 1][j] + 1;
 var ins = dpE[i][j - 1] + 1;
 var rep = dpE[i - 1][j - 1] + 1;
 var mn = Math.min(del, ins, rep);
 dpE[i][j] = mn;
 if (mn === rep) dirE[i][j] = 'diag';
 else if (mn === del) dirE[i][j] = 'up';
 else dirE[i][j] = 'left';
}
}
}
}

 function getBacktrackE() {
 var path = [];
 var i = m2, j = n2;
 while (i> 0 || j> 0) {
 path.push([i, j]);
 if (dirE[i][j] === 'diag') {i--; j--;}
 else if (dirE[i][j] === 'up') {i--;}
 else {j--;}
}
 path.push([0, 0]);
 return path;
}

 computeAll();

 function draw() {
 viz.clear();
 var cellW = 40;
 var cellH = 32;
 var ox = 70;
 var oy = 65;

 viz.screenText('Edit Distance: "' + X + '" -> "' + Y + '"', viz.width / 2, 18, viz.colors.white, 14, 'center');

 var filledCount = 0;
 if (stepE>= maxStepE) filledCount = maxStepE;
 else filledCount = stepE;

 // Headers
 for (var j = 0; j <= n2; j++) {
 var hdr = j === 0? '-': Y[j - 1];
 viz.screenText(hdr, ox + (j + 1) * cellW + cellW / 2, oy - 5, viz.colors.teal, 12, 'center');
}
 for (var i = 0; i <= m2; i++) {
 var hdr2 = i === 0? '-': X[i - 1];
 viz.screenText(hdr2, ox - 3, oy + (i + 1) * cellH + cellH / 2, viz.colors.teal, 12, 'right');
}

 var pathCells = {};
 if (showPathE) {
 var bpath = getBacktrackE();
 for (var p = 0; p <bpath.length; p++) {
 pathCells[bpath[p][0] + ',' + bpath[p][1]] = true;
}
}

 // Draw cells
 var cellIdx = 0;
 for (var i = 0; i <= m2; i++) {
 for (var j = 0; j <= n2; j++) {
 var px = ox + (j + 1) * cellW;
 var py = oy + (i + 1) * cellH;
 var hl = null;
 if (cellIdx === filledCount - 1 && filledCount <= maxStepE) {
 hl = viz.colors.yellow;
} else if (pathCells[i + ',' + j]) {
 hl = viz.colors.green;
}
 if (cellIdx <filledCount) {
 viz.drawArrayCell(px, py, cellW, cellH, dpE[i][j], viz.colors.bg, viz.colors.white, hl);
} else {
 viz.drawArrayCell(px, py, cellW, cellH, '', viz.colors.bg, viz.colors.text + '44', null);
}
 cellIdx++;
}
}

 if (filledCount>= maxStepE) {
 viz.screenText('Edit Distance = ' + dpE[m2][n2], viz.width / 2, oy + (m2 + 2) * cellH + 10, viz.colors.green, 14, 'center');
} else {
 viz.screenText('Step ' + filledCount + '/' + maxStepE, viz.width / 2, oy + (m2 + 2) * cellH + 10, viz.colors.text, 12, 'center');
}
}

 VizEngine.createButton(controls, '', function() {
 if (stepE <maxStepE) {stepE++; draw();}
});
 VizEngine.createButton(controls, '', function() {
 stepE = Math.min(stepE + 10, maxStepE); draw();
});
 VizEngine.createButton(controls, 'all', function() {
 stepE = maxStepE; draw();
});
 VizEngine.createButton(controls, 'backtracking path', function() {
 stepE = maxStepE; showPathE = true; draw();
});
 VizEngine.createButton(controls, '', function() {
 stepE = 0; showPathE = false; draw();
});

 draw();
 return viz;
}
},
 {
 id: 'ch17-viz-matrix-chain',
 title: 'Matrix Chain Multiplication DP',
 description: 'Matrix Chain DP optimal ',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 400});
 var dims = [30, 35, 15, 5, 10, 20, 25];
 var nMat = dims.length - 1;
 var mDP = [];
 var sDP = [];
 for (var i = 0; i <= nMat; i++) {
 mDP[i] = new Array(nMat + 1).fill(0);
 sDP[i] = new Array(nMat + 1).fill(0);
}

 function computeMatrix() {
 for (var i = 1; i <= nMat; i++) mDP[i][i] = 0;
 for (var l = 2; l <= nMat; l++) {
 for (var i = 1; i <= nMat - l + 1; i++) {
 var j = i + l - 1;
 mDP[i][j] = Infinity;
 for (var k = i; k <j; k++) {
 var cost = mDP[i][k] + mDP[k + 1][j] + dims[i - 1] * dims[k] * dims[j];
 if (cost <mDP[i][j]) {
 mDP[i][j] = cost;
 sDP[i][j] = k;
}
}
}
}
}

 function getParens(i, j) {
 if (i === j) return 'A' + i;
 return '(' + getParens(i, sDP[i][j]) + ' ' + getParens(sDP[i][j] + 1, j) + ')';
}

 computeMatrix();

 function draw() {
 viz.clear();
 viz.screenText('Matrix Chain Multiplication DP', viz.width / 2, 18, viz.colors.white, 15, 'center');
 viz.screenText(': ' + dims.join(' x '), viz.width / 2, 40, viz.colors.text, 11, 'center');

 // Draw DP table (upper triangular)
 var cellW = 65;
 var cellH = 32;
 var ox = 90;
 var oy = 65;

 // Headers
 for (var j = 1; j <= nMat; j++) {
 viz.screenText('A' + j, ox + (j - 1) * cellW + cellW / 2, oy - 8, viz.colors.teal, 11, 'center');
 viz.screenText('A' + j, ox - 18, oy + (j - 1) * cellH + cellH / 2, viz.colors.teal, 11, 'center');
}

 for (var i = 1; i <= nMat; i++) {
 for (var j = 1; j <= nMat; j++) {
 var px = ox + (j - 1) * cellW;
 var py = oy + (i - 1) * cellH;
 if (j <i) {
 viz.drawArrayCell(px, py, cellW, cellH, '', viz.colors.bg, viz.colors.text + '22');
} else if (i === j) {
 viz.drawArrayCell(px, py, cellW, cellH, 0, viz.colors.purple + '33', viz.colors.purple);
} else {
 var val = mDP[i][j];
 var isAns = (i === 1 && j === nMat);
 var col = isAns? viz.colors.green: viz.colors.blue + '33';
 var tc = isAns? viz.colors.green: viz.colors.white;
 viz.drawArrayCell(px, py, cellW, cellH, val, col, tc);
}
}
}

 // Optimal parenthesization
 var parens = getParens(1, nMat);
 viz.screenText('optimal:', viz.width / 2, oy + nMat * cellH + 25, viz.colors.white, 13, 'center');
 viz.screenText(parens, viz.width / 2, oy + nMat * cellH + 48, viz.colors.teal, 12, 'center');
 viz.screenText('times: ' + mDP[1][nMat], viz.width / 2, oy + nMat * cellH + 72, viz.colors.green, 14, 'center');
}

 draw();
 return viz;
}
}
],
 exercises: [
 {
 question: 'compute "SATURDAY" to "SUNDAY" Edit Distance, column. ',
 hint: ' 8x6 DP. ',
 solution: 'Edit Distance = 3. column: (1) S→S (match), (2) delete A, (3) delete T, (4) U→U (match), (5) R→N (replace), (6) D→D (match), (7) A→A (match), (8) Y→Y (match).: 2 times delete + 1 times replace = 3. '
},
 {
 question: 'Matrix Chain Multiplication: given column \\(p = [5, 10, 3, 12, 5, 50, 6]\\), \\(m[1][6]\\) optimal. ',
 hint: 'by length from 2 to 6 in order table-filling. ',
 solution: 'compute procedure: \\(m[1][2]=150, m[2][3]=360, m[3][4]=180, m[4][5]=3000, m[5][6]=15000\\). continue: \\(m[1][6] = 2010\\). optimal: \\(((A_1 A_2)(A_3 A_4))((A_5 A_6))\\) (compute). '
},
 {
 question: 'proof Edit Distance is (metric): satisfy, not. ',
 hint: ': (insert<->delete). not: combination times. ',
 solution: '(1): \\(\\ge 0\\), clearly. (2): \\(d(X,X) = 0\\) (); \\(d(X,Y) = 0 \\Rightarrow X = Y\\). (3): X Y can (insert delete, delete insert, replace replace), obtain Y X column, \\(d(X,Y) = d(Y,X)\\). (4) not: \\(d(X,Z) \\le d(X,Y) + d(Y,Z)\\), because can execute X→Y again execute Y→Z. '
}
]
},
 // ===== Section 4: DP on Sequences, Grids, Trees =====
 {
 id: 'ch17-sec04',
 title: 'Many Forms of DP',
 content: `<h2>4 DP </h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>DP takes many forms: 0-1 knapsack fills a weight/value table; shortest paths on grids use positional state; interval DP optimizes over subranges. This section surveys these variants, showing that the underlying principle (store and reuse subproblem solutions) is always the same.</p></div></div>

<p>DP not array or. different problem different DP: column DP, DP, DP, tree DP. </p>

<h3>4.1 0-1 knapsack (Knapsack)</h3>
<div class="env-block definition">
<div class="env-title">Definition 17.8 (0-1 Knapsack)</div>
<div class="env-body"><p>\\(n\\) item, item \\(i\\) have value \\(v_i\\) \\(w_i\\). knapsack capacity \\(W\\). $$dp[i][j] = \\max(dp[i-1][j], \\; dp[i-1][j-w_i] + v_i)$$ its \\(j \\ge w_i\\). \\(dp[n][W]\\). \\(O(nW)\\), term. </p></div>
</div>

<div class="viz-placeholder" data-viz="ch17-viz-knapsack"></div>

<h3>4.2 DP (Grid DP)</h3>
<div class="env-block example">
<div class="env-title">Example 17.4 (Minimum Path Sum)</div>
<div class="env-body"><p>in \\(m \\times n\\), each have, from to (only can or) minimum path: $$dp[i][j] = \\text{grid}[i][j] + \\min(dp[i-1][j], dp[i][j-1])$$</p></div>
</div>

<h3>4.3 DP (Interval DP)</h3>
<p>Matrix Chain Multiplication is DP. is<strong>Optimal Binary Search Tree</strong>: given key search frequency, expected search minimum BST. </p>

<div class="env-block definition">
<div class="env-title">Definition 17.9 (Optimal BST)</div>
<div class="env-body"><p>$$e[i][j] = \\begin{cases} q_{i-1} & \\text{if} j = i-1 \\\\ \\min_{i \\le r \\le j} \\{e[i][r-1] + e[r+1][j] + w(i,j)\\} & \\text{if} i \\le j \\end{cases}$$ its \\(w(i,j) = \\sum_{l=i}^{j} p_l + \\sum_{l=i-1}^{j} q_l\\). </p></div>
</div>

<h3>4.4 tree DP (Tree DP)</h3>
<p>in tree do DP, state usually define in node, node state transition.: tree maximum. </p>

<div class="env-block example">
<div class="env-title">Example 17.5 (Maximum Independent Set on Tree)</div>
<div class="env-body"><p>tree maximum: \\(dp[v][0]\\) = not \\(v\\) \\(v\\) subtree maximum, \\(dp[v][1]\\) = \\(v\\) maximum. $$dp[v][0] = \\sum_{u \\in \\text{children}(v)} \\max(dp[u][0], dp[u][1])$$ $$dp[v][1] = w_v + \\sum_{u \\in \\text{children}(v)} dp[u][0]$$</p></div>
</div>

<div class="viz-placeholder" data-viz="ch17-viz-grid-dp"></div>`,
 visualizations: [
 {
 id: 'ch17-viz-knapsack',
 title: '0-1 Knapsack DP Table',
 description: ' 0-1 knapsack DP, backtracking item',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var items = [{name:'A', v:60, w:10}, {name:'B', v:100, w:20}, {name:'C', v:120, w:30}];
 var W = 50;
 var nItems = items.length;
 var dp3 = [];
 for (var i = 0; i <= nItems; i++) dp3[i] = new Array(W + 1).fill(0);

 // Pre-compute
 for (var i = 1; i <= nItems; i++) {
 for (var j = 0; j <= W; j++) {
 dp3[i][j] = dp3[i - 1][j];
 if (j>= items[i - 1].w) {
 dp3[i][j] = Math.max(dp3[i][j], dp3[i - 1][j - items[i - 1].w] + items[i - 1].v);
}
}
}

 var showStep = W + 1; // show all by default

 function draw() {
 viz.clear();
 viz.screenText('0-1 knapsack DP', viz.width / 2, 18, viz.colors.white, 15, 'center');
 viz.screenText('item: ' + items.map(function(it){return it.name + '(v=' + it.v + ',w=' + it.w + ')';}).join(', ') + ' capacity W=' + W, viz.width / 2, 40, viz.colors.text, 11, 'center');

 // Show compressed table (sample capacities)
 var sampleW = [0, 10, 20, 30, 40, 50];
 var cellW2 = 55;
 var cellH2 = 34;
 var ox2 = 120;
 var oy2 = 65;

 // Headers
 viz.screenText('w=', ox2 - 20, oy2 - 10, viz.colors.text, 11, 'right');
 for (var c = 0; c <sampleW.length; c++) {
 viz.screenText(String(sampleW[c]), ox2 + c * cellW2 + cellW2 / 2, oy2 - 10, viz.colors.teal, 11, 'center');
}

 for (var i = 0; i <= nItems; i++) {
 var rowLabel = i === 0? 'none': items[i - 1].name;
 viz.screenText(rowLabel, ox2 - 10, oy2 + 10 + i * cellH2 + cellH2 / 2, viz.colors.teal, 11, 'right');
 for (var c = 0; c <sampleW.length; c++) {
 var j = sampleW[c];
 var px = ox2 + c * cellW2;
 var py = oy2 + 10 + i * cellH2;
 var bg2 = viz.colors.bg;
 if (i === nItems && j === W) bg2 = viz.colors.green + '44';
 viz.drawArrayCell(px, py, cellW2, cellH2, dp3[i][j], bg2, viz.colors.white);
}
}

 // Backtrack
 var chosen = [];
 var j2 = W;
 for (var i = nItems; i>= 1; i--) {
 if (dp3[i][j2]!== dp3[i - 1][j2]) {
 chosen.push(i - 1);
 j2 -= items[i - 1].w;
}
}

 viz.screenText('optimal value: ' + dp3[nItems][W], viz.width / 2, oy2 + 10 + (nItems + 1) * cellH2 + 15, viz.colors.green, 14, 'center');
 var chosenNames = chosen.map(function(idx) {return items[idx].name;}).reverse().join(', ');
 viz.screenText(': ' + chosenNames, viz.width / 2, oy2 + 10 + (nItems + 1) * cellH2 + 40, viz.colors.yellow, 13, 'center');

 // Show visual knapsack
 var kx = 500;
 var ky = 230;
 var kw2 = 120;
 var kh2 = 130;
 var ctx = viz.ctx;
 ctx.strokeStyle = viz.colors.axis;
 ctx.lineWidth = 2;
 ctx.strokeRect(kx, ky, kw2, kh2);
 var fillY = ky + kh2;
 var colArr = [viz.colors.blue, viz.colors.teal, viz.colors.orange];
 for (var c2 = chosen.length - 1; c2>= 0; c2--) {
 var idx = chosen[c2];
 var fh = (items[idx].w / W) * kh2;
 fillY -= fh;
 ctx.fillStyle = colArr[idx % colArr.length] + 'aa';
 ctx.fillRect(kx + 2, fillY, kw2 - 4, fh);
 viz.screenText(items[idx].name + ':' + items[idx].v, kx + kw2 / 2, fillY + fh / 2, viz.colors.white, 11, 'center');
}
}

 draw();
 return viz;
}
},
 {
 id: 'ch17-viz-grid-dp',
 title: 'Grid Shortest Path DP',
 description: 'in compute from to minimum path',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var grid = [
 [1, 3, 1, 2],
 [1, 5, 1, 3],
 [4, 2, 1, 1],
 [2, 1, 4, 2]
];
 var rows = grid.length;
 var cols = grid[0].length;
 var dpG = [];
 for (var i = 0; i <rows; i++) dpG[i] = new Array(cols).fill(0);
 dpG[0][0] = grid[0][0];
 for (var j = 1; j <cols; j++) dpG[0][j] = dpG[0][j - 1] + grid[0][j];
 for (var i = 1; i <rows; i++) dpG[i][0] = dpG[i - 1][0] + grid[i][0];
 for (var i = 1; i <rows; i++) {
 for (var j = 1; j <cols; j++) {
 dpG[i][j] = grid[i][j] + Math.min(dpG[i - 1][j], dpG[i][j - 1]);
}
}

 // Backtrack path
 var path = [];
 var pi = rows - 1, pj = cols - 1;
 path.push([pi, pj]);
 while (pi> 0 || pj> 0) {
 if (pi === 0) {pj--;}
 else if (pj === 0) {pi--;}
 else if (dpG[pi - 1][pj] <= dpG[pi][pj - 1]) {pi--;}
 else {pj--;}
 path.push([pi, pj]);
}

 var stepG = 0;
 var maxStepG = rows * cols;

 function draw() {
 viz.clear();
 viz.screenText('path DP', viz.width / 2, 18, viz.colors.white, 15, 'center');

 var cellW3 = 65;
 var cellH3 = 55;
 var ox3 = 100;
 var oy3 = 55;

 var pathSet = {};
 if (stepG>= maxStepG) {
 for (var p = 0; p <path.length; p++) {
 pathSet[path[p][0] + ',' + path[p][1]] = true;
}
}

 for (var i = 0; i <rows; i++) {
 for (var j = 0; j <cols; j++) {
 var px = ox3 + j * (cellW3 + 10);
 var py = oy3 + i * (cellH3 + 10);
 var idx2 = i * cols + j;
 var onPath = pathSet[i + ',' + j];

 // Grid value
 var ctx = viz.ctx;
 ctx.fillStyle = onPath? viz.colors.green + '33': viz.colors.bg;
 ctx.fillRect(px, py, cellW3, cellH3);
 ctx.strokeStyle = onPath? viz.colors.green: viz.colors.axis;
 ctx.lineWidth = onPath? 2: 1;
 ctx.strokeRect(px, py, cellW3, cellH3);

 viz.screenText(String(grid[i][j]), px + cellW3 / 2, py + 15, viz.colors.white, 14, 'center');

 if (idx2 <stepG) {
 viz.screenText(String(dpG[i][j]), px + cellW3 / 2, py + 38, viz.colors.yellow, 12, 'center');
}
}
}

 // Arrows
 for (var i = 0; i <rows; i++) {
 for (var j = 0; j <cols - 1; j++) {
 var ax = ox3 + j * (cellW3 + 10) + cellW3 + 2;
 var ay = oy3 + i * (cellH3 + 10) + cellH3 / 2;
 viz.screenText('>', ax + 3, ay, viz.colors.text + '44', 12, 'center');
}
}

 if (stepG>= maxStepG) {
 viz.screenText('minimum path = ' + dpG[rows - 1][cols - 1], viz.width / 2, oy3 + rows * (cellH3 + 10) + 15, viz.colors.green, 14, 'center');
}
}

 VizEngine.createButton(controls, '', function() {
 if (stepG <maxStepG) {stepG++; draw();}
});
 VizEngine.createButton(controls, 'all', function() {
 stepG = maxStepG; draw();
});
 VizEngine.createButton(controls, '', function() {
 stepG = 0; draw();
});

 draw();
 return viz;
}
}
],
 exercises: [
 {
 question: 'given 4 item: (value,) = (10, 5), (40, 4), (30, 6), (50, 3), knapsack capacity W=10. use DP maximum value, column item. ',
 hint: ' 4x10 DP (row=item, column=capacity). ',
 solution: 'DP finally row: dp[4][10] = 90. item 2(40,4) + item 4(50,3), 7, value 90. backtracking: dp[4][10]=90!= dp[3][10]=40, item 4, capacity 7; dp[3][7]=40 = dp[2][7]=40, not item 3; dp[2][7]=40!= dp[1][7]=10, item 2, capacity 3; dp[1][3]=0, not item 1. '
},
 {
 question: 'subsequence (LIS) DP solution: recurrence, \\(O(n^2)\\) \\(O(n\\log n)\\) algorithm. ',
 hint: '\\(O(n^2)\\): \\(dp[i]\\) = \\(a_i\\) LIS length. \\(O(n\\log n)\\): "tails" array. ',
 solution: '\\(O(n^2)\\): \\(dp[i] = 1 + \\max\\{dp[j]: j <i, a_j <a_i\\}\\). LIS length = \\(\\max_i dp[i]\\). \\(O(n\\log n)\\): tails[] array, tails[k] = length k+1 subsequence minimum element. each \\(a_i\\), tails[] \\(\\ge a_i\\) position, replace; if not there exists,. tails length LIS length. '
},
 {
 question: 'tree maximum DP can otherwise to graph? what?',
 hint: 'graph maximum is NP-hard. ',
 solution: 'not can. tree DP use tree subproblem -- each subtree select not its he subtree. graph there exists, node select may multiple"", subproblem not again. maximum in graph is NP-hard, not may have term DP (P=NP). graph (graph, graph), use DP in term solution. '
}
]
},
 // ===== Section 5: Space Optimization & Bitmask DP =====
 {
 id: 'ch17-sec05',
 title: 'Space Optimization & Bitmask DP',
 content: `<h2>5 and state DP</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Advanced DP techniques include space optimization (reducing from \(O(n^2)\) to \(O(n)\) by keeping only two rows) and bitmask DP, where the state is a subset of elements. The bitmask DP solution to the Travelling Salesman Problem runs in \(O(2^n n^2)\), much better than the \(O(n!)\) brute force.</p></div></div>

<p>in use, DP is. need: array () DP (state). </p>

<h3>5.1 array (Rolling Array)</h3>
<div class="env-block definition">
<div class="env-title">Definition 17.10 (Space Optimization)</div>
<div class="env-body"><p>if DP only "row"(or if row), can only row, from \\(O(mn)\\) to \\(O(n)\\) or \\(O(1)\\). </p></div>
</div>

<div class="env-block example">
<div class="env-title">Example 17.6 (0-1 Knapsack Space Optimization)</div>
<div class="env-body"><p>: \\(dp[i][j] = \\max(dp[i-1][j], dp[i-1][j-w_i]+v_i)\\), \\(O(nW)\\). <br>
: use array \\(dp[j]\\), <strong>from </strong>update: \\(dp[j] = \\max(dp[j], dp[j-w_i]+v_i)\\), \\(O(W)\\). <br>
key: from guarantee \\(dp[j-w_i]\\) use is row value (each item times). </p></div>
</div>

<h3>5.2 DP (Bitmask DP)</h3>
<p>when problem <strong>subset select</strong>and \\(n\\) (\\(\\le 20\\)), can use denote subset state. </p>

<div class="env-block definition">
<div class="env-title">Definition 17.11 (Bitmask DP)</div>
<div class="env-body"><p>use \\(S\\) \\(i\\) denote element \\(i\\) is otherwise in. state space \\(\\{0, 1, \\ldots, 2^n - 1\\}\\). <br>
: check \\(i\\) \\((S \\gg i) \\& 1\\), \\(i\\) \\(S \\mid (1 \\ll i)\\), subset. </p></div>
</div>

<div class="env-block example">
<div class="env-title">Example 17.7 (TSP via Bitmask DP)</div>
<div class="env-body"><p>Traveling Salesman Problem (TSP): given \\(n\\) city distance,. <br>
DP: \\(dp[S][i]\\) = from city 0, exactly \\(S\\) city, finally in city \\(i\\). <br>
$$dp[S][i] = \\min_{j \\in S \\setminus \\{i\\}} \\{dp[S \\setminus \\{i\\}][j] + \\text{dist}(j, i)\\}$$<br>
: \\(\\min_i \\{dp[\\text{ALL}][i] + \\text{dist}(i, 0)\\}\\). \\(O(2^n \\cdot n^2)\\), \\(O(2^n \\cdot n)\\). </p></div>
</div>

<div class="viz-placeholder" data-viz="ch17-viz-bitmask-tsp"></div>

<div class="env-block warning">
<div class="env-title">Warning</div>
<div class="env-body"><p> DP is, for \\(n \\le 20\\) problem, \\(2^{20} \\approx 10^6\\) row. this \\(n!\\) (\\(20! \\approx 2.4 \\times 10^{18}\\)). </p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body"><p>DP in <strong>subproblem define</strong>. find state denote is, not is. state space: prefix/ (column DP), (DP), subtree (tree DP), subset (DP), (DP). </p></div>
</div>
<div class="env-block bridge"><div class="env-title">Looking Ahead</div><div class="env-body"><p>DP explores all choices implicitly through its table structure. But what about problems where we need to explore a solution space explicitly? Chapter 18 introduces backtracking and branch-and-bound, which search through combinatorial spaces with intelligent pruning.</p></div></div>`,
 visualizations: [
 {
 id: 'ch17-viz-bitmask-tsp',
 title: 'TSP Bitmask DP',
 description: ' TSP DP procedure ',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var cities = [
 {x: 150, y: 100, label: '0'},
 {x: 400, y: 80, label: '1'},
 {x: 550, y: 200, label: '2'},
 {x: 300, y: 300, label: '3'}
];
 var nC = cities.length;
 var dist = [];
 for (var i = 0; i <nC; i++) {
 dist[i] = [];
 for (var j = 0; j <nC; j++) {
 var dx = cities[i].x - cities[j].x;
 var dy = cities[i].y - cities[j].y;
 dist[i][j] = Math.round(Math.sqrt(dx * dx + dy * dy));
}
}

 // Solve TSP
 var ALL = (1 <<nC) - 1;
 var INF = 1e9;
 var dpT = [];
 var parentT = [];
 for (var s = 0; s <= ALL; s++) {
 dpT[s] = new Array(nC).fill(INF);
 parentT[s] = new Array(nC).fill(-1);
}
 dpT[1][0] = 0; // start at city 0
 for (var s = 1; s <= ALL; s++) {
 for (var u = 0; u <nC; u++) {
 if (!(s & (1 <<u))) continue;
 if (dpT[s][u]>= INF) continue;
 for (var v = 0; v <nC; v++) {
 if (s & (1 <<v)) continue;
 var ns = s | (1 <<v);
 var nd = dpT[s][u] + dist[u][v];
 if (nd <dpT[ns][v]) {
 dpT[ns][v] = nd;
 parentT[ns][v] = u;
}
}
}
}

 // Find best tour
 var bestEnd = 0, bestDist = INF;
 for (var u = 1; u <nC; u++) {
 var td = dpT[ALL][u] + dist[u][0];
 if (td <bestDist) {bestDist = td; bestEnd = u;}
}

 // Backtrack tour
 var tour = [0];
 var cur = bestEnd;
 var curS = ALL;
 var tourReverse = [bestEnd];
 while (cur!== 0) {
 var prev = parentT[curS][cur];
 curS = curS ^ (1 <<cur);
 cur = prev;
 if (cur!== 0) tourReverse.push(cur);
}
 for (var i = tourReverse.length - 1; i>= 0; i--) tour.push(tourReverse[i]);
 tour.push(0);

 function draw() {
 viz.clear();
 viz.screenText('TSP DP (n=' + nC + ')', viz.width / 2, 18, viz.colors.white, 15, 'center');

 // Draw all edges lightly
 for (var i = 0; i <nC; i++) {
 for (var j = i + 1; j <nC; j++) {
 viz.drawEdge(cities[i].x, cities[i].y, cities[j].x, cities[j].y, viz.colors.axis + '33', false, dist[i][j]);
}
}

 // Draw tour
 for (var i = 0; i <tour.length - 1; i++) {
 var u = tour[i], v = tour[i + 1];
 viz.drawEdge(cities[u].x, cities[u].y, cities[v].x, cities[v].y, viz.colors.green, true, null, 3);
}

 // Draw cities
 for (var i = 0; i <nC; i++) {
 viz.drawNode(cities[i].x, cities[i].y, 22, cities[i].label, viz.colors.blue, viz.colors.white);
}

 viz.screenText(': ' + tour.join(' -> '), viz.width / 2, 360, viz.colors.teal, 13, 'center');
 viz.screenText('distance: ' + bestDist, viz.width / 2, 385, viz.colors.green, 14, 'center');

 // DP info
 viz.screenText('state: 2^' + nC + ' x ' + nC + ' = ' + ((1 <<nC) * nC), 100, 360, viz.colors.text, 11, 'left');
 viz.screenText('vs: ' + nC + '! = ' + [1,1,2,6,24,120,720][nC], 100, 380, viz.colors.text, 11, 'left');
}

 draw();
 return viz;
}
}
],
 exercises: [
 {
 question: ' 0-1 knapsack DP. solution what must from traversal capacity. ',
 hint: 'if from, \\(dp[j-w_i]\\) already update, equivalent to can times item (knapsack). ',
 solution: ' DP: for each item i, for j = W down to w_i: dp[j] = max(dp[j], dp[j-w_i]+v_i). must from: in item i, dp[j-w_i] this is"not contain item i"value (row value). from traversal guarantee dp[j-w_i] in update, therefore is row value. from traversal, dp[j-w_i] may already contain item i, item i times, this solve is knapsack problem. '
},
 {
 question: 'Held-Karp TSP algorithm space complexity is what? for \\(n = 20\\) city, state. ',
 hint: 'state = \\(2^n \\cdot n\\), = \\(n!\\). ',
 solution: ': \\(O(2^n \\cdot n^2)\\),: \\(O(2^n \\cdot n)\\). for \\(n = 20\\): state = \\(2^{20} \\cdot 20 \\approx 2 \\times 10^7\\), \\(\\approx 2^{20} \\cdot 400 \\approx 4 \\times 10^8\\) (row).: \\(20! \\approx 2.4 \\times 10^{18}\\).: \\(\\frac{20!}{2^{20} \\cdot 20^2} \\approx \\frac{2.4 \\times 10^{18}}{4 \\times 10^8} = 6 \\times 10^9\\), 60. '
},
 {
 question: ' DP solve "minimum match" problem: given \\(2n\\) distance, it distance minimum. ',
 hint: '\\(dp[S]\\) = \\(S\\) already minimum. each times \\(S\\) minimum, its. ',
 solution: 'state: \\(dp[S]\\) = \\(S\\) denote minimum.: \\(S\\) minimum \\(i\\), \\(j \\in S, j \\ne i\\) its: \\(dp[S] = \\min_{j \\in S, j>i} \\{dp[S \\setminus \\{i,j\\}] + dist(i,j)\\}\\).: \\(dp[\\emptyset] = 0\\).: \\(dp[\\text{ALL}]\\). \\(O(2^{2n} \\cdot n)\\), for \\(2n \\le 20\\) row. '
},
 {
 question: 'compare Dynamic Programming greedy time complexity. greedy usually DP how many?. ',
 hint: 'greedy: sorting + times. DP: table-filling. ',
 solution: 'greedy usually is \\(O(n \\log n)\\) (sorting) or \\(O(n)\\) (times). DP usually is \\(O(n^2)\\) or more ().: Activity Selection -- greedy \\(O(n\\log n)\\), DP \\(O(n^2)\\); Fractional Knapsack -- greedy \\(O(n\\log n)\\), 0-1 knapsack DP \\(O(nW)\\) (term). greedy: greedy only do times optimal select, DP need all may select. greedy only in have greedy-choice property correct, use more. '
}
]
}
]
});
