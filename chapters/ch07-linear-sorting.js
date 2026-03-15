// Chapter 7: Sorting Lower Bounds & Linear-Time Sorting -- Sorting Lower Bounds & Linear-Time Sorting
window.CHAPTERS.push({
 id: 'ch07',
 number: 7,
 title: 'Sorting Lower Bounds & Linear-Time Sorting',
 subtitle: 'Sorting Lower Bounds & Linear-Time Sorting',
 sections: [
 // ── Section 1: Decision Tree Model ──
 {
 id: 'ch07-sec01',
 title: 'Decision Tree Model',
 content: `<h2>Decision Tree Model</h2>
<div class="env-block bridge"><div class="env-title">Chapter Overview</div><div class="env-body"><p>Merge Sort and Quicksort both achieve \(O(n \log n)\), but is this optimal? This chapter answers that question definitively: any comparison-based sorting algorithm requires \(\Omega(n \log n)\) comparisons in the worst case. We then show how to break this barrier with non-comparison-based algorithms (Counting Sort, Radix Sort, Bucket Sort) that exploit additional structure in the input to sort in linear time.</p></div></div>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>To prove a lower bound on sorting, we need a model that captures all possible comparison-based algorithms. The decision tree model does exactly this: every comparison-based sort corresponds to a binary tree whose leaves are the possible output permutations.</p></div></div>

<p>I already sorting algorithm: insert sorting \\(O(n^2)\\), Merge Sort \\(O(n \\log n)\\), Quicksort expected \\(O(n \\log n)\\). problem is: <strong>sorting can otherwise do more?</strong></p>

<p>need this problem, I need compute define"more ". </p>

<div class="env-block definition"><div class="env-title">Definition (Comparison-Based Sorting)</div><div class="env-body">
<p><strong>compare sorting algorithm</strong>only through element compare(\\(<, \\leq, =, \\geq,>\\))element. algorithm not can check element value(). </p>
<p>Merge Sort, Quicksort, heap sorting, insert sorting is compare sorting. </p>
</div></div>

<div class="env-block definition"><div class="env-title">Definition (Decision Tree)</div><div class="env-body">
<p>for compare sorting algorithm input size \\(n\\), algorithm execute procedure can denote <strong>decision tree</strong>: </p>
<p>- each <strong>internal node</strong>denote times compare \\(a_i: a_j\\)</p>
<p>- each <strong>leaf node</strong>denote permutation(sorting result)</p>
<p>- from to path times sorting procedure</p>
<p>- tree <strong>height</strong>is worst-case number of comparisons</p>
</div></div>

<div class="viz-placeholder" data-viz="ch07-viz-decision-tree"></div>

<div class="env-block intuition"><div class="env-title">Intuition</div><div class="env-body">
<p>decision tree "": each times (compare)may permutation group. need all \\(n!\\) permutation, need problem. </p>
</div></div>`,
 visualizations: [
 {
 id: 'ch07-viz-decision-tree',
 title: 'Sorting Decision Tree',
 description: ' n=3 n=4 sorting decision tree',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var nVal = 3;

 function draw() {
 viz.clear();
 viz.screenText('Decision Tree for Sorting n=' + nVal + ' Elements', 350, 18, viz.colors.white, 15, 'center');

 if (nVal === 3) {
 // n=3 decision tree (insertion sort style)
 var nodeR = 18;

 // Level 0: a1:a2
 viz.drawNode(350, 60, nodeR, 'a1:a2', viz.colors.orange, viz.colors.white);

 // Level 1
 viz.drawTreeEdge(350, 78, 200, 120, viz.colors.blue);
 viz.drawTreeEdge(350, 78, 500, 120, viz.colors.red);
 viz.screenText('\u2264', 265, 95, viz.colors.blue, 11, 'center');
 viz.screenText('>', 435, 95, viz.colors.red, 11, 'center');

 // a1<=a2 branch: a2:a3
 viz.drawNode(200, 135, nodeR, 'a2:a3', viz.colors.orange, viz.colors.white);
 // a1>a2 branch: a1:a3
 viz.drawNode(500, 135, nodeR, 'a1:a3', viz.colors.orange, viz.colors.white);

 // Level 2 from left (a2:a3)
 viz.drawTreeEdge(200, 153, 120, 195, viz.colors.blue);
 viz.drawTreeEdge(200, 153, 280, 195, viz.colors.red);
 viz.screenText('\u2264', 155, 170, viz.colors.blue, 10, 'center');
 viz.screenText('>', 245, 170, viz.colors.red, 10, 'center');

 // Leaf: a1,a2,a3 (a1<=a2<=a3)
 viz.drawNode(120, 210, 16, '', viz.colors.green, viz.colors.white);
 viz.screenText('1,2,3', 120, 235, viz.colors.green, 10, 'center');

 // Internal: a1:a3
 viz.drawNode(280, 210, nodeR, 'a1:a3', viz.colors.orange, viz.colors.white);

 // From a1:a3 (left subtree)
 viz.drawTreeEdge(280, 228, 230, 265, viz.colors.blue);
 viz.drawTreeEdge(280, 228, 330, 265, viz.colors.red);

 viz.drawNode(230, 280, 16, '', viz.colors.green, viz.colors.white);
 viz.screenText('1,3,2', 230, 305, viz.colors.green, 10, 'center');
 viz.drawNode(330, 280, 16, '', viz.colors.green, viz.colors.white);
 viz.screenText('3,1,2', 330, 305, viz.colors.green, 10, 'center');

 // Level 2 from right (a1:a3)
 viz.drawTreeEdge(500, 153, 420, 195, viz.colors.blue);
 viz.drawTreeEdge(500, 153, 580, 195, viz.colors.red);
 viz.screenText('\u2264', 455, 170, viz.colors.blue, 10, 'center');
 viz.screenText('>', 545, 170, viz.colors.red, 10, 'center');

 // Internal: a2:a3
 viz.drawNode(420, 210, nodeR, 'a2:a3', viz.colors.orange, viz.colors.white);
 // Leaf: a2,a1,a3
 viz.drawNode(580, 210, 16, '', viz.colors.green, viz.colors.white);
 viz.screenText('2,1,3', 580, 235, viz.colors.green, 10, 'center');

 viz.drawTreeEdge(420, 228, 380, 265, viz.colors.blue);
 viz.drawTreeEdge(420, 228, 460, 265, viz.colors.red);

 viz.drawNode(380, 280, 16, '', viz.colors.green, viz.colors.white);
 viz.screenText('2,3,1', 380, 305, viz.colors.green, 10, 'center');
 viz.drawNode(460, 280, 16, '', viz.colors.green, viz.colors.white);
 viz.screenText('3,2,1', 460, 305, viz.colors.green, 10, 'center');

 // Stats
 viz.screenText('Leaves (permutations): 3! = 6', 350, 340, viz.colors.yellow, 12, 'center');
 viz.screenText('Height = 3 comparisons (worst case)', 350, 360, viz.colors.teal, 12, 'center');
 viz.screenText('Lower bound: \u2308log\u2082(3!)\u2309 = \u2308log\u2082(6)\u2309 = 3', 350, 380, viz.colors.green, 12, 'center');
} else {
 // n=4 summary
 viz.screenText('For n=4: 4! = 24 permutations', 350, 70, viz.colors.yellow, 14, 'center');
 viz.screenText('Lower bound: \u2308log\u2082(24)\u2309 = 5 comparisons', 350, 95, viz.colors.teal, 14, 'center');

 // Draw a compressed tree
 var levels = 5;
 for (var lev = 0; lev <= levels; lev++) {
 var nodesAtLevel = Math.min(Math.pow(2, lev), 32);
 var spacing = 660 / (nodesAtLevel + 1);
 for (var nd = 0; nd <nodesAtLevel; nd++) {
 var px = 20 + spacing * (nd + 1);
 var py = 130 + lev * 48;
 if (lev <levels) {
 viz.ctx.fillStyle = viz.colors.orange;
 viz.ctx.beginPath();
 viz.ctx.arc(px, py, 5, 0, Math.PI * 2);
 viz.ctx.fill();
} else {
 viz.ctx.fillStyle = viz.colors.green;
 viz.ctx.beginPath();
 viz.ctx.arc(px, py, 4, 0, Math.PI * 2);
 viz.ctx.fill();
}
}
 if (lev <3) {
 viz.screenText('Level ' + lev, 680, 130 + lev * 48, viz.colors.text, 10, 'right');
}
}
 viz.screenText('..', 350, 130 + 3 * 48, viz.colors.text, 14, 'center');
 viz.screenText('Level ' + levels + ': \u226524 leaves', 680, 130 + levels * 48, viz.colors.text, 10, 'right');

 viz.screenText('Orange = comparisons, Green = permutation outputs', 350, 390, viz.colors.text, 11, 'center');
 viz.screenText('Merge sort achieves 5 comparisons for n=4 (optimal!)', 350, 410, viz.colors.green, 11, 'center');
}
}

 draw();

 VizEngine.createSelect(controls, 'n', [
 {value: '3', label: 'n = 3 (detailed)'},
 {value: '4', label: 'n = 4 (overview)'}
], function(v) {
 nVal = parseInt(v);
 draw();
});

 return viz;
}
}
],
 exercises: [
 {
 question: ' \\(n = 3\\) element use insert sorting decision tree. it and Merge Sort decision tree have what different?',
 hint: 'insert sorting compare a[1]:a[0], then a[2] insert. ',
 solution: 'insert sorting decision tree: root node compare a[1]:a[0]. subtree(a[1]<a[0], swap have [a1,a0])next compare a[2]:a[1]. subtree(a[1]>=a[0], have [a0,a1])next compare a[2]:a[1]. worst-case also is 3 times compare, and Merge Sort same. tree different: insert sorting path only 2 times compare(sorting input), Merge Sort 3 times compare. '
},
 {
 question: ' \\(n\\) element sorting decision tree at least have how many?have how many?',
 hint: 'at least need all \\(n!\\) permutation. permutation may times. ',
 solution: 'at least \\(n!\\) (each permutation at least, otherwise then algorithm input). \\(2^h\\) (\\(h\\) is tree), \\(h\\) tree have \\(2^h\\). have may is not (compare column), also may permutation multiple (compare). '
},
 {
 question: 'if compare(each times compare \\(<, =,>\\) result), sorting lower bound how many?',
 hint: 'decision tree tree. ',
 solution: 'tree height \\(h\\) have \\(3^h\\). need \\(3^h \\geq n!\\), \\(h \\geq \\log_3(n!) = \\log_3 n! = \\frac{\\ln n!}{\\ln 3} \\approx \\frac{n \\ln n}{\\ln 3}\\). still is \\(\\Omega(n \\log n)\\), only is from \\(1/\\ln 2 \\approx 1.443\\) \\(1/\\ln 3 \\approx 0.910\\). compare not lower bound. '
}
]
},

 // ── Section 2: Omega(n log n) Lower Bound ──
 {
 id: 'ch07-sec02',
 title: 'Omega(n log n) lower bound',
 content: `<h2>\\(\\Omega(n \\log n)\\) sorting lower bound</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>With the decision tree model in hand, we derive the \(\Omega(n \log n)\) lower bound by a counting argument: \(n!\) leaves require a tree of height at least \(\log_2(n!)\), which is \(\Theta(n \log n)\). This is one of the most elegant impossibility results in computer science.</p></div></div>


<div class="env-block theorem"><div class="env-title">Theorem (Comparison Sort Lower Bound)</div><div class="env-body">
<p>compare sorting algorithm in worst-case need \\(\\Omega(n \\log n)\\) times compare. </p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p>algorithm in size \\(n\\) input decision tree height \\(h\\). </p>
<p>1. decision tree is tree, height \\(h\\) tree have \\(2^h\\). </p>
<p>2. need correct sorting all may input permutation, decision tree at least need \\(n!\\). </p>
<p>3. therefore \\(2^h \\geq n!\\), \\(h \\geq \\log_2(n!)\\). </p>
<p>4. Stirling \\(n! \\geq (n/e)^n\\): </p>
$$h \\geq \\log_2(n!) \\geq \\log_2\\left(\\frac{n}{e}\\right)^n = n \\log_2 n - n \\log_2 e = \\Omega(n \\log n)$$
<p class="qed">∎</p>
</div></div>

<div class="viz-placeholder" data-viz="ch07-viz-lower-bound"></div>

<p>more, lower bound: </p>
$$\\lceil \\log_2(n!) \\rceil = n \\log_2 n - n \\log_2 e + \\frac{1}{2} \\log_2 n + O(1) \\approx n \\log_2 n - 1.4427n$$

<div class="env-block example"><div class="env-title">Example</div><div class="env-body">
<p>for \\(n = 10\\): \\(\\log_2(10!) = \\log_2(3628800) \\approx 21.8\\), at least need 22 times compare. </p>
<p>Merge Sort in \\(n = 10\\) use \\(n \\lceil \\log_2 n \\rceil - 2^{\\lceil \\log_2 n\\rceil} + 1 = 10 \\cdot 4 - 16 + 1 = 25\\) times compare. </p>
<p>Merge Sort in worst-case optimal(). </p>
</div></div>

<div class="env-block warning"><div class="env-title">Warning</div><div class="env-body">
<p>this lower bound only use <strong>compare</strong>sorting algorithm. if I can use element (it is have), can use non-comparison sorting this lower bound. this is. </p>
</div></div>`,
 visualizations: [
 {
 id: 'ch07-viz-lower-bound',
 title: 'Sorting Lower Bound vs Algorithms Comparison',
 description: ' n! log and algorithm number of comparisons',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 400});

 function logFactorial(n) {
 var s = 0;
 for (var i = 2; i <= n; i++) s += Math.log2(i);
 return s;
}

 function draw() {
 viz.clear();
 viz.screenText('Comparison Count: Lower Bound vs Algorithms', 350, 18, viz.colors.white, 14, 'center');

 var plotL = 80, plotR = 650, plotT = 50, plotB = 340;
 var maxN = 100;

 // Axes
 viz.ctx.strokeStyle = viz.colors.axis;
 viz.ctx.lineWidth = 1;
 viz.ctx.beginPath();
 viz.ctx.moveTo(plotL, plotT);
 viz.ctx.lineTo(plotL, plotB);
 viz.ctx.lineTo(plotR, plotB);
 viz.ctx.stroke();
 viz.screenText('n', plotR + 10, plotB, viz.colors.text, 12);
 viz.screenText('comparisons', plotL - 10, plotT - 10, viz.colors.text, 11, 'center');

 for (var ti = 0; ti <= maxN; ti += 20) {
 var tx = plotL + (ti / maxN) * (plotR - plotL);
 viz.screenText(String(ti), tx, plotB + 15, viz.colors.text, 10, 'center');
}

 var maxY = maxN * Math.log2(maxN) * 1.2;

 // Curves
 var curves = [
 {name: 'log\u2082(n!)', fn: function(n) {return logFactorial(n);}, color: viz.colors.red, dash: false},
 {name: 'n log\u2082 n', fn: function(n) {return n * Math.log2(n);}, color: viz.colors.orange, dash: true},
 {name: 'Merge sort', fn: function(n) {var lg = Math.ceil(Math.log2(n)); return n * lg - Math.pow(2, lg) + 1;}, color: viz.colors.blue, dash: false},
 {name: 'n(n-1)/2 (bubble)', fn: function(n) {return n * (n - 1) / 2;}, color: viz.colors.purple, dash: true}
];

 for (var ci = 0; ci <curves.length; ci++) {
 var curve = curves[ci];
 viz.ctx.strokeStyle = curve.color;
 viz.ctx.lineWidth = 2;
 if (curve.dash) viz.ctx.setLineDash([6, 4]);
 viz.ctx.beginPath();
 var started = false;
 for (var xn = 2; xn <= maxN; xn++) {
 var yv = curve.fn(xn);
 if (yv> maxY) break;
 var sx = plotL + (xn / maxN) * (plotR - plotL);
 var sy = plotB - (yv / maxY) * (plotB - plotT);
 if (!started) {viz.ctx.moveTo(sx, sy); started = true;}
 else viz.ctx.lineTo(sx, sy);
}
 viz.ctx.stroke();
 viz.ctx.setLineDash([]);
}

 // Legend
 var legX = 420, legY = 355;
 for (var li = 0; li <curves.length; li++) {
 var lx = legX + (li % 2) * 150;
 var ly = legY + Math.floor(li / 2) * 18;
 viz.ctx.fillStyle = curves[li].color;
 viz.ctx.fillRect(lx, ly - 5, 12, 12);
 viz.screenText(curves[li].name, lx + 16, ly + 1, curves[li].color, 10, 'left');
}

 viz.screenText('Red line = information-theoretic lower bound', 350, 395, viz.colors.red, 11, 'center');
}

 draw();

 return viz;
}
}
],
 exercises: [
 {
 question: 'compute \\(\\lceil \\log_2(n!) \\rceil\\) \\(n = 5, 8, 12\\). compare it and \\(n \\lceil \\log_2 n \\rceil\\)(Merge Sort upper bound). ',
 hint: '\\(5! = 120,\\; 8! = 40320,\\; 12! = 479001600\\). ',
 solution: '\\(n=5\\): \\(\\lceil \\log_2 120 \\rceil = 7\\). Merge Sort \\(\\leq 5 \\cdot 3 - 8 + 1 = 8\\). Gap = 1. \\(n=8\\): \\(\\lceil \\log_2 40320 \\rceil = 16\\). Merge Sort \\(\\leq 8 \\cdot 3 - 8 + 1 = 17\\). Gap = 1. \\(n=12\\): \\(\\lceil \\log_2 479001600 \\rceil = 29\\). Merge Sort \\(\\leq 12 \\cdot 4 - 16 + 1 = 33\\). Gap = 4. \\(n\\), gap, Merge Sort not is optimal (not). '
},
 {
 question: 'lower bound sorting at least need \\(\\log_2(n!)\\). this and sorting lower bound have what?',
 hint: 'each times compare 1. ',
 solution: 'input have \\(n!\\) may permutation. determine is which, need \\(\\log_2(n!)\\). each times compare(compare) 1 (result). therefore at least need \\(\\lceil \\log_2(n!) \\rceil\\) times compare. this is decision tree height lower bound. solution sorting lower bound. '
},
 {
 question: 'sorting lower bound \\(\\Omega(n \\log n)\\) is otherwise not there exists \\(O(n)\\) sorting algorithm?',
 hint: 'note that lower bound. ',
 solution: 'not is!lower bound only use compare. if can use element value(only compare), can this lower bound. Counting Sort(\\(O(n + k)\\)), Radix Sort(\\(O(d(n + k))\\))Bucket Sort(expected \\(O(n)\\))not compare, can in sorting. '
}
]
},

 // ── Section 3: Counting Sort ──
 {
 id: 'ch07-sec03',
 title: 'Counting Sort',
 content: `<h2>Counting Sort</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>If we know the input consists of integers in a bounded range, we can bypass comparisons entirely. Counting Sort places each element directly into its correct position by counting occurrences, achieving \(O(n + k)\) time for keys in \(\{0, \ldots, k-1\}\).</p></div></div>

<p><strong>Counting Sort</strong>(Counting Sort)is non-comparison sorting algorithm. it use element value have, in \\(O(n + k)\\) complete sorting(\\(k\\) is value size). </p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Counting Sort)</div><div class="env-body">
<p><strong>CountingSort(A, n, k):</strong></p>
<p>1. array \\(C[0.k]\\), 0</p>
<p>2. For \\(i = 1\\) to \\(n\\): \\(C[A[i]]{+}{+}\\)(each value times)</p>
<p>3. For \\(i = 1\\) to \\(k\\): \\(C[i] = C[i] + C[i-1]\\)(compute prefix =)</p>
<p>4. For \\(i = n\\) downto \\(1\\): </p>
<p>&emsp; \\(B[C[A[i]]] = A[i]\\); \\(C[A[i]]{-}{-}\\)</p>
<p>5. \\(B\\) \\(A\\)</p>
</div></div>

<div class="viz-placeholder" data-viz="ch07-viz-counting-sort"></div>

<div class="env-block theorem"><div class="env-title">Theorem</div><div class="env-body">
<p>Counting Sort time complexity \\(\\Theta(n + k)\\), space complexity \\(\\Theta(n + k)\\). when \\(k = O(n)\\), time complexity \\(\\Theta(n)\\). </p>
</div></div>

<div class="env-block definition"><div class="env-title">Key Properties</div><div class="env-body">
<p><strong>: </strong> Counting Sort is -- equal element in sorting not. step 4 from is guarantee key. </p>
<p><strong>in-place: </strong> need \\(O(n + k)\\). </p>
<p><strong>compare: </strong> not through compare determine, is use element value array. </p>
</div></div>

<div class="env-block warning"><div class="env-title">Warning</div><div class="env-body">
<p>when \\(k \\gg n\\) (\\(n = 100\\) value \\([0, 10^9]\\) sorting), Counting Sort its -- need \\(10^9\\) size array. at this point use its he sorting method. </p>
</div></div>`,
 visualizations: [
 {
 id: 'ch07-viz-counting-sort',
 title: 'Counting Sort Demonstration',
 description: 'Counting Sort, place procedure',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var arr = [4, 2, 2, 8, 3, 3, 1, 4, 2];
 var maxVal = 9;
 var phase = 0; // 0=count, 1=prefix, 2=place, 3=done
 var placeIdx = arr.length - 1;

 var counts = [];
 var prefix = [];
 var output = [];

 function reset() {
 counts = [];
 prefix = [];
 output = [];
 for (var i = 0; i <= maxVal; i++) {counts.push(0); prefix.push(0);}
 for (var j = 0; j <arr.length; j++) output.push(null);
 phase = 0;
 placeIdx = arr.length - 1;
}

 reset();

 function draw() {
 viz.clear();
 viz.screenText('Counting Sort', 350, 18, viz.colors.white, 15, 'center');

 var n = arr.length;
 var cellW = 45, cellH = 32;

 // Input array
 viz.screenText('Input A:', 20, 55, viz.colors.text, 11, 'left');
 var aStartX = 90;
 for (var i = 0; i <n; i++) {
 var hl = (phase === 2 && i === placeIdx)? viz.colors.yellow: null;
 viz.drawArrayCell(aStartX + i * cellW, 40, cellW, cellH, arr[i], viz.colors.bg, viz.colors.white, hl);
}

 // Count array
 var cStartX = 90;
 var cCellW = 42;
 viz.screenText('Count C:', 20, 100, viz.colors.text, 11, 'left');

 var displayCounts = phase === 0? counts: prefix;
 var usedMax = Math.max.apply(null, arr) + 1;
 for (var ci = 0; ci <usedMax; ci++) {
 var cCol = displayCounts[ci]> 0? viz.colors.blue + '44': viz.colors.bg;
 viz.drawArrayCell(cStartX + ci * cCellW, 85, cCellW, cellH, displayCounts[ci], cCol, viz.colors.white);
 // Index label
 viz.screenText(String(ci), cStartX + ci * cCellW + cCellW / 2, 85 + cellH + 10, viz.colors.text, 9, 'center');
}

 // Output array
 viz.screenText('Output B:', 20, 165, viz.colors.text, 11, 'left');
 for (var oi = 0; oi <n; oi++) {
 var val = output[oi]!== null? output[oi]: '';
 var oCol = output[oi]!== null? viz.colors.green + '44': viz.colors.bg;
 viz.drawArrayCell(aStartX + oi * cellW, 150, cellW, cellH, val, oCol, viz.colors.white);
}

 // Phase description
 var phaseNames = ['Phase 1: Counting', 'Phase 2: Prefix Sums', 'Phase 3: Placement', 'Done!'];
 viz.screenText(phaseNames[phase], 350, 210, viz.colors.yellow, 14, 'center');

 // Bar chart of counts
 var barW = 35;
 var barMaxH = 100;
 var barStartX = (700 - usedMax * (barW + 6)) / 2;
 var barStartY = 380;
 var maxC = Math.max.apply(null, displayCounts.slice(0, usedMax));
 if (maxC === 0) maxC = 1;

 for (var bi = 0; bi <usedMax; bi++) {
 var h = (displayCounts[bi] / maxC) * barMaxH;
 var px = barStartX + bi * (barW + 6);
 var py = barStartY - h;
 var barCol = phase <= 1? viz.colors.blue: viz.colors.green;
 viz.ctx.fillStyle = barCol;
 viz.ctx.fillRect(px, py, barW, h);
 viz.screenText(String(displayCounts[bi]), px + barW / 2, py - 8, viz.colors.white, 10, 'center');
 viz.screenText(String(bi), px + barW / 2, barStartY + 10, viz.colors.text, 10, 'center');
}

 if (phase <= 1) {
 viz.screenText('Count/Prefix array values as bars', 350, barStartY + 28, viz.colors.text, 10, 'center');
}
}

 draw();

 VizEngine.createButton(controls, 'Step', function() {
 if (phase === 0) {
 // Count phase
 for (var i = 0; i <arr.length; i++) counts[arr[i]]++;
 phase = 1;
} else if (phase === 1) {
 // Prefix sum
 for (var ci = 0; ci <= maxVal; ci++) prefix[ci] = counts[ci];
 for (var pi = 1; pi <= maxVal; pi++) prefix[pi] += prefix[pi - 1];
 phase = 2;
 placeIdx = arr.length - 1;
} else if (phase === 2) {
 // Place one element
 if (placeIdx>= 0) {
 var val = arr[placeIdx];
 prefix[val]--;
 output[prefix[val]] = val;
 placeIdx--;
 if (placeIdx <0) phase = 3;
}
}
 draw();
});
 VizEngine.createButton(controls, 'Reset', function() {
 reset();
 draw();
});
 VizEngine.createButton(controls, 'New Array', function() {
 arr = [];
 for (var i = 0; i <10; i++) arr.push(Math.floor(Math.random() * 8) + 1);
 reset();
 draw();
});

 return viz;
}
}
],
 exercises: [
 {
 question: 'array \\([3, 6, 4, 1, 3, 4, 1, 4]\\) execute Counting Sort(value 0-6), each C array. ',
 hint: ', again prefix, again place. ',
 solution: ' C = [0, 2, 0, 2, 3, 0, 1](C[i] = i times). prefix C = [0, 2, 2, 4, 7, 7, 8](C[i] = \\(\\leq i\\) element). place procedure(from): A[7]=4, C[4]=7->6, B[6]=4; A[6]=1, C[1]=2->1, B[1]=1;.. B = [1, 1, 3, 3, 4, 4, 4, 6]. '
},
 {
 question: 'what step 4 need from (downto)?if from will?',
 hint: '. ',
 solution: 'from guarantee. prefix C[v] is value v element in finally position. from, equal element to position(C[v]--), equal element to position. this equal element. if from, equal element will, sorting not again. Radix Sort need. '
},
 {
 question: 'Counting Sort can?',
 hint: 'value. ',
 solution: 'find minimum value \\(\\text{min}\\) maximum value \\(\\text{max}\\). each element \\(-\\text{min}\\), all value \\(\\geq 0\\). in value \\([0, \\text{max} - \\text{min}]\\) execute Counting Sort. output. time complexity \\(O(n + k)\\), its \\(k = \\text{max} - \\text{min}\\). '
}
]
},

 // ── Section 4: Radix Sort ──
 {
 id: 'ch07-sec04',
 title: 'Radix Sort',
 content: `<h2>Radix Sort</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>What if the range \(k\) is large? Radix Sort handles this by sorting digit-by-digit from least significant to most significant, using Counting Sort as a stable subroutine. It achieves \(O(d(n + k))\) time for \(d\)-digit numbers.</p></div></div>

<p><strong>Radix Sort</strong>(Radix Sort)through (or)sorting key sorting problem. it from efficient (LSD)to efficient in order each use stable sort(usually is Counting Sort). </p>

<div class="env-block algorithm"><div class="env-title">Algorithm (LSD Radix Sort)</div><div class="env-body">
<p><strong>RadixSort(A, d):</strong></p>
<p>1. For \\(i = 1\\) to \\(d\\)(from to): </p>
<p>2. &emsp; A by \\(i\\) use stable sort(Counting Sort)</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem</div><div class="env-body">
<p>given \\(n\\) \\(d\\), each value \\([0, k-1]\\), Radix Sort time complexity \\(O(d(n + k))\\). </p>
<p>if each use \\(b\\) denote, select \\(r\\) group(\\(k = 2^r\\), \\(d = \\lceil b/r \\rceil\\)), then \\(O(\\frac{b}{r}(n + 2^r))\\). when \\(r = \\log_2 n\\), \\(O(bn/\\log n)\\). </p>
</div></div>

<div class="viz-placeholder" data-viz="ch07-viz-radix-sort"></div>

<div class="env-block intuition"><div class="env-title">Intuition</div><div class="env-body">
<p>what from start not is?from start(LSD), use stable sort: when \\(i\\), \\(1\\) to \\(i-1\\) already. same \\(i\\) element (), from guarantee all have. </p>
</div></div>

<div class="env-block example"><div class="env-title">Example</div><div class="env-body">
<p>for 32 (\\(b = 32\\)), \\(r = 8\\)(by): \\(d = 4\\), \\(k = 256\\). \\(O(4(n + 256)) = O(n)\\)(when \\(n \\gg 256\\)). </p>
<p>for 64, \\(r = 16\\): \\(d = 4\\), \\(k = 65536\\). \\(O(4(n + 65536))\\), when \\(n \\geq 10^5\\). </p>
</div></div>`,
 visualizations: [
 {
 id: 'ch07-viz-radix-sort',
 title: 'Radix Sort Step-by-Step',
 description: ' LSD Radix Sort each ',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var arr = [329, 457, 657, 839, 436, 720, 355];
 var maxDigits = 3;
 var currentDigit = 0;
 var sortedArr = arr.slice();

 function getDigit(num, d) {
 return Math.floor(num / Math.pow(10, d)) % 10;
}

 function stableSortByDigit(a, d) {
 var buckets = [];
 for (var i = 0; i <10; i++) buckets.push([]);
 for (var j = 0; j <a.length; j++) {
 buckets[getDigit(a[j], d)].push(a[j]);
}
 var result = [];
 for (var b = 0; b <10; b++) {
 for (var k = 0; k <buckets[b].length; k++) {
 result.push(buckets[b][k]);
}
}
 return result;
}

 function draw() {
 viz.clear();
 viz.screenText('Radix Sort (LSD, base 10)', 350, 18, viz.colors.white, 15, 'center');

 var n = sortedArr.length;
 var cellW = 60, cellH = 35;
 var startX = (700 - n * cellW) / 2;

 // Current array
 viz.screenText('Current array (after sorting digit ' + currentDigit + '):', 20, 55, viz.colors.text, 11, 'left');
 var colors = [];
 for (var i = 0; i <n; i++) {
 colors.push(viz.colors.bg);
}
 viz.drawArray(sortedArr, startX, 65, cellW, cellH);

 // Highlight current digit in each number
 viz.screenText('Digit position ' + currentDigit + ' (ones=' + (currentDigit === 0? 'current': '') + ', tens=' + (currentDigit === 1? 'current': '') + ', hundreds=' + (currentDigit === 2? 'current': '') + '):', 20, 120, viz.colors.orange, 11, 'left');

 // Show buckets
 var buckets = [];
 for (var b = 0; b <10; b++) buckets.push([]);
 for (var j = 0; j <n; j++) {
 buckets[getDigit(sortedArr[j], currentDigit)].push(sortedArr[j]);
}

 var bucketY = 150;
 var bucketCellW = 55, bucketCellH = 28;
 viz.screenText('Buckets (by digit ' + currentDigit + '):', 20, bucketY - 5, viz.colors.teal, 11, 'left');

 for (var bi = 0; bi <10; bi++) {
 var bx = 50;
 var by = bucketY + bi * (bucketCellH + 2);
 if (by + bucketCellH> 400) break;
 viz.screenText(String(bi) + ':', bx - 20, by + bucketCellH / 2, viz.colors.yellow, 11, 'right');
 for (var bj = 0; bj <buckets[bi].length; bj++) {
 var bColor = viz.colors.bg;
 viz.drawArrayCell(bx + bj * bucketCellW, by, bucketCellW, bucketCellH, buckets[bi][bj], bColor, viz.colors.white);
 // Highlight the current digit
 var numStr = String(buckets[bi][bj]).padStart(3, '0');
 var digitPos = 2 - currentDigit; // position in string
 var digitChar = numStr[digitPos];
 viz.screenText(digitChar, bx + bj * bucketCellW + bucketCellW / 2, by + bucketCellH + 8, viz.colors.orange, 9, 'center');
}
 if (buckets[bi].length === 0) {
 viz.screenText('(empty)', bx + 10, by + bucketCellH / 2, viz.colors.axis, 9, 'left');
}
}
}

 draw();

 VizEngine.createButton(controls, 'Sort This Digit', function() {
 sortedArr = stableSortByDigit(sortedArr, currentDigit);
 draw();
});
 VizEngine.createButton(controls, 'Next Digit', function() {
 if (currentDigit <maxDigits - 1) {
 sortedArr = stableSortByDigit(sortedArr, currentDigit);
 currentDigit++;
 draw();
}
});
 VizEngine.createButton(controls, 'Full Sort', function() {
 sortedArr = arr.slice();
 for (var d = 0; d <maxDigits; d++) {
 sortedArr = stableSortByDigit(sortedArr, d);
}
 currentDigit = maxDigits - 1;
 draw();
});
 VizEngine.createButton(controls, 'Reset', function() {
 sortedArr = arr.slice();
 currentDigit = 0;
 draw();
});
 VizEngine.createButton(controls, 'New Array', function() {
 arr = [];
 for (var i = 0; i <7; i++) arr.push(Math.floor(Math.random() * 900) + 100);
 sortedArr = arr.slice();
 currentDigit = 0;
 draw();
});

 return viz;
}
}
],
 exercises: [
 {
 question: ' \\([170, 45, 75, 90, 802, 24, 2, 66]\\) execute Radix Sort. each sorting array. ',
 hint: ', from start. ',
 solution: ': [170, 45, 75, 90, 802, 24, 2, 66]. by sorting: [170, 90, 802, 2, 24, 45, 75, 66]. by sorting: [802, 2, 24, 45, 66, 170, 75, 90]. by sorting: [2, 24, 45, 66, 75, 90, 170, 802]. '
},
 {
 question: 'Radix Sort what need?if sorting not will what?',
 hint: 'is otherwise. ',
 solution: 'guarantee when same, sorting result. e.g. [329, 355] by sorting in "5". because by sorting 355 <329(5<9), stable sort 355 in 329. if not, sorting will, result not correct. '
},
 {
 question: 'use Radix Sort sorting?is what?',
 hint: 'can see ""column. ',
 solution: 'see "". for (length \\(d\\)), from finally to in order use Counting Sort(\\(k = |\\Sigma|\\), size). \\(O(d(n + |\\Sigma|))\\). for not, use MSD Radix Sort(from start), in use minimum value. or by length group again sorting. '
},
 {
 question: 'Radix Sort what Quicksort?what more?',
 hint: 'compare \\(O(dn)\\) \\(O(n \\log n)\\). ',
 solution: 'Radix Sort \\(O(d(n+k))\\). when \\(d\\) is and \\(k = O(n)\\), \\(O(n)\\), Quicksort. e.g. sorting 100 32: Radix Sort \\(O(4n) = 4 \\times 10^6\\), Quicksort \\(O(n \\log n) \\approx 2 \\times 10^7\\). when \\(d\\) ()or \\(k\\), Radix Sort may more., Quicksort more, more. '
}
]
},

 // ── Section 5: Bucket Sort ──
 {
 id: 'ch07-sec05',
 title: 'Bucket Sort',
 content: `<h2>Bucket Sort</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>When inputs are drawn uniformly from an interval, Bucket Sort distributes elements into buckets, sorts each bucket, and concatenates. Under the uniformity assumption, expected time is \(O(n)\). This section also provides a comparative summary of all sorting algorithms studied so far.</p></div></div>

<p><strong>Bucket Sort</strong>(Bucket Sort)assume input uniform distribution in (\\([0, 1)\\)), to "", again each sorting. </p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Bucket Sort)</div><div class="env-body">
<p><strong>BucketSort(A, n):</strong></p>
<p>1. \\(n\\) \\(B[0], B[1], \\ldots, B[n-1]\\)</p>
<p>2. For \\(i = 1\\) to \\(n\\): \\(A[i]\\) \\(B[\\lfloor n \\cdot A[i] \\rfloor]\\)</p>
<p>3. each use insert sorting(or its he sorting)</p>
<p>4. in order all </p>
</div></div>

<div class="viz-placeholder" data-viz="ch07-viz-bucket-sort"></div>

<div class="env-block theorem"><div class="env-title">Theorem</div><div class="env-body">
<p>when input in \\([0, 1)\\) uniform distribution, Bucket Sort <strong>expected</strong>time complexity \\(\\Theta(n)\\). </p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p> \\(n_i\\) \\(i\\) element. \\(i\\) use insert sorting \\(O(n_i^2)\\).: </p>
$$T(n) = \\Theta(n) + \\sum_{i=0}^{n-1} O(n_i^2)$$
<p>expected: \\(E[T(n)] = \\Theta(n) + \\sum_{i=0}^{n-1} E[n_i^2]\\). </p>
<p>since uniform distribution, each element \\(i\\) probability \\(1/n\\). \\(n_i \\sim \\text{Binomial}(n, 1/n)\\). </p>
$$E[n_i^2] = \\text{Var}[n_i] + (E[n_i])^2 = \\frac{n-1}{n^2} + \\frac{1}{n^2} \\cdot n^2 \\cdot \\frac{1}{n^2} \\ldots$$
<p>more: \\(E[n_i^2] = n \\cdot \\frac{1}{n} \\cdot (1 - \\frac{1}{n}) + (n \\cdot \\frac{1}{n})^2 = 2 - 1/n\\). </p>
$$\\sum_{i=0}^{n-1} E[n_i^2] = n(2 - 1/n) = 2n - 1 = \\Theta(n)$$
<p class="qed">∎</p>
</div></div>

<div class="viz-placeholder" data-viz="ch07-viz-sort-comparison"></div>

<div class="env-block example"><div class="env-title">Example (Summary: When to Use What)</div><div class="env-body">
<p><strong>Counting Sort: </strong> value (0-150, 0-100). </p>
<p><strong>Radix Sort: </strong> length or (, IP, ID). </p>
<p><strong>Bucket Sort: </strong> uniform distribution, hash value. </p>
<p><strong>comparison-based sorting: </strong> use, use. </p>
</div></div>
<div class="env-block bridge"><div class="env-title">Looking Ahead</div><div class="env-body"><p>Sorting is fundamental, but algorithms need efficient data structures to support them. Starting with Chapter 8, we enter the data structures arc of the course. Heaps and priority queues will power algorithms like Heapsort and Dijkstra's shortest paths, forming the bridge between sorting and graph algorithms.</p></div></div>`,
 visualizations: [
 {
 id: 'ch07-viz-bucket-sort',
 title: 'Bucket Sort Demonstration',
 description: 'Bucket Sort sorting procedure',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var n = 12;
 var arr = [];
 var numBuckets = 5;
 var sorted = false;

 function generateData() {
 arr = [];
 for (var i = 0; i <n; i++) arr.push(parseFloat((Math.random()).toFixed(2)));
 sorted = false;
}
 generateData();

 function draw() {
 viz.clear();
 viz.screenText('Bucket Sort (uniform distribution on [0, 1))', 350, 18, viz.colors.white, 14, 'center');

 // Input array as bar chart
 var barW = 30;
 var maxH = 80;
 var barStartX = (700 - n * (barW + 4)) / 2;
 var barStartY = 100;

 viz.screenText('Input:', 20, 60, viz.colors.text, 11, 'left');

 for (var i = 0; i <n; i++) {
 var h = arr[i] * maxH;
 var px = barStartX + i * (barW + 4);
 var py = barStartY - h;
 var bucketIdx = Math.min(Math.floor(arr[i] * numBuckets), numBuckets - 1);
 var bucketColors = [viz.colors.blue, viz.colors.teal, viz.colors.green, viz.colors.orange, viz.colors.purple, viz.colors.red, viz.colors.yellow, viz.colors.pink];
 var col = bucketColors[bucketIdx % bucketColors.length];
 viz.ctx.fillStyle = col;
 viz.ctx.fillRect(px, py, barW, h);
 viz.screenText(arr[i].toFixed(2), px + barW / 2, barStartY + 8, viz.colors.text, 8, 'center');
}

 // Buckets
 var buckets = [];
 for (var b = 0; b <numBuckets; b++) buckets.push([]);
 for (var j = 0; j <n; j++) {
 var bi = Math.min(Math.floor(arr[j] * numBuckets), numBuckets - 1);
 buckets[bi].push(arr[j]);
}
 if (sorted) {
 for (var b2 = 0; b2 <numBuckets; b2++) {
 buckets[b2].sort(function(a, b) {return a - b;});
}
}

 var bucketY = 135;
 viz.screenText('Buckets' + (sorted? ' (sorted)': '') + ':', 20, bucketY, viz.colors.teal, 11, 'left');
 var bucketColors2 = [viz.colors.blue, viz.colors.teal, viz.colors.green, viz.colors.orange, viz.colors.purple, viz.colors.red, viz.colors.yellow, viz.colors.pink];

 for (var bi2 = 0; bi2 <numBuckets; bi2++) {
 var by = bucketY + 18 + bi2 * 36;
 var range0 = (bi2 / numBuckets).toFixed(2);
 var range1 = ((bi2 + 1) / numBuckets).toFixed(2);
 viz.screenText('[' + range0 + ',' + range1 + ')', 70, by + 12, bucketColors2[bi2 % bucketColors2.length], 10, 'right');

 for (var bj = 0; bj <buckets[bi2].length; bj++) {
 viz.drawArrayCell(90 + bj * 55, by, 55, 28, buckets[bi2][bj].toFixed(2), bucketColors2[bi2 % bucketColors2.length] + '33', viz.colors.white);
}
 if (buckets[bi2].length === 0) {
 viz.screenText('(empty)', 100, by + 14, viz.colors.axis, 9, 'left');
}
}

 // Output if sorted
 if (sorted) {
 var output = [];
 for (var oi = 0; oi <numBuckets; oi++) {
 for (var oj = 0; oj <buckets[oi].length; oj++) {
 output.push(buckets[oi][oj]);
}
}
 var outY = bucketY + 18 + numBuckets * 36 + 10;
 viz.screenText('Output:', 20, outY, viz.colors.green, 11, 'left');
 var outBarX = (700 - output.length * (barW + 4)) / 2;
 for (var ok = 0; ok <output.length; ok++) {
 var oh = output[ok] * maxH;
 var opx = outBarX + ok * (barW + 4);
 var opy = outY + 70 - oh;
 viz.ctx.fillStyle = viz.colors.green;
 viz.ctx.fillRect(opx, opy, barW, oh);
 viz.screenText(output[ok].toFixed(2), opx + barW / 2, outY + 78, viz.colors.text, 8, 'center');
}
}
}

 draw();

 VizEngine.createButton(controls, 'Sort Buckets', function() {
 sorted = true;
 draw();
});
 VizEngine.createButton(controls, 'New Data', function() {
 generateData();
 draw();
});
 VizEngine.createButton(controls, 'Reset', function() {
 sorted = false;
 draw();
});
 VizEngine.createSlider(controls, 'Buckets', 3, 10, numBuckets, 1, function(v) {
 numBuckets = Math.round(v);
 sorted = false;
 draw();
});

 return viz;
}
},
 {
 id: 'ch07-viz-sort-comparison',
 title: 'Sorting Algorithm Comparison',
 description: 'all sorting algorithm use ',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 400});

 function draw() {
 viz.clear();
 viz.screenText('Sorting Algorithm Comparison', 350, 18, viz.colors.white, 15, 'center');

 var algorithms = [
 {name: 'Insertion Sort', best: 'n', avg: 'n^2', worst: 'n^2', space: '1', stable: 'Yes', type: 'Comp'},
 {name: 'Merge Sort', best: 'n log n', avg: 'n log n', worst: 'n log n', space: 'n', stable: 'Yes', type: 'Comp'},
 {name: 'Quicksort', best: 'n log n', avg: 'n log n', worst: 'n^2', space: 'log n', stable: 'No', type: 'Comp'},
 {name: 'Heapsort', best: 'n log n', avg: 'n log n', worst: 'n log n', space: '1', stable: 'No', type: 'Comp'},
 {name: 'Counting Sort', best: 'n+k', avg: 'n+k', worst: 'n+k', space: 'n+k', stable: 'Yes', type: 'Non-comp'},
 {name: 'Radix Sort', best: 'dn', avg: 'dn', worst: 'dn', space: 'n+k', stable: 'Yes', type: 'Non-comp'},
 {name: 'Bucket Sort', best: 'n', avg: 'n', worst: 'n^2', space: 'n+k', stable: 'Yes', type: 'Non-comp'}
];

 var headers = ['Algorithm', 'Best', 'Average', 'Worst', 'Space', 'Stable', 'Type'];
 var colWidths = [130, 75, 75, 75, 70, 55, 85];
 var startX = 20;
 var startY = 50;
 var rowH = 30;

 // Header
 var hx = startX;
 for (var h = 0; h <headers.length; h++) {
 viz.ctx.fillStyle = viz.colors.blue + '33';
 viz.ctx.fillRect(hx, startY, colWidths[h], rowH);
 viz.ctx.strokeStyle = viz.colors.axis;
 viz.ctx.lineWidth = 0.5;
 viz.ctx.strokeRect(hx, startY, colWidths[h], rowH);
 viz.screenText(headers[h], hx + colWidths[h] / 2, startY + rowH / 2, viz.colors.blue, 11, 'center');
 hx += colWidths[h];
}

 // Rows
 for (var r = 0; r <algorithms.length; r++) {
 var alg = algorithms[r];
 var ry = startY + (r + 1) * rowH;
 var vals = [alg.name, alg.best, alg.avg, alg.worst, alg.space, alg.stable, alg.type];
 var rx = startX;
 var rowColor = alg.type === 'Comp'? viz.colors.bg: '#1a2a1a';

 for (var c = 0; c <vals.length; c++) {
 viz.ctx.fillStyle = rowColor;
 viz.ctx.fillRect(rx, ry, colWidths[c], rowH);
 viz.ctx.strokeStyle = viz.colors.axis;
 viz.ctx.lineWidth = 0.5;
 viz.ctx.strokeRect(rx, ry, colWidths[c], rowH);
 var textCol = viz.colors.white;
 if (c === 3 && vals[c] === 'n^2') textCol = viz.colors.red;
 if (c === 3 && (vals[c] === 'n log n' || vals[c] === 'n+k' || vals[c] === 'dn')) textCol = viz.colors.green;
 viz.screenText(vals[c], rx + colWidths[c] / 2, ry + rowH / 2, textCol, 10, 'center');
 rx += colWidths[c];
}
}

 // Lower bound line
 var lbY = startY + (algorithms.length + 1) * rowH + 15;
 viz.screenText('Lower bound for comparison sorts: \u03A9(n log n)', 350, lbY, viz.colors.red, 13, 'center');
 viz.screenText('Non-comparison sorts bypass this by exploiting element structure', 350, lbY + 22, viz.colors.green, 12, 'center');

 // Color legend
 viz.ctx.fillStyle = viz.colors.bg;
 viz.ctx.fillRect(250, lbY + 40, 15, 15);
 viz.ctx.strokeStyle = viz.colors.axis;
 viz.ctx.strokeRect(250, lbY + 40, 15, 15);
 viz.screenText('Comparison-based', 270, lbY + 48, viz.colors.text, 10, 'left');

 viz.ctx.fillStyle = '#1a2a1a';
 viz.ctx.fillRect(420, lbY + 40, 15, 15);
 viz.ctx.strokeStyle = viz.colors.axis;
 viz.ctx.strokeRect(420, lbY + 40, 15, 15);
 viz.screenText('Non-comparison', 440, lbY + 48, viz.colors.text, 10, 'left');
}

 draw();

 return viz;
}
}
],
 exercises: [
 {
 question: 'Bucket Sort worst-case what?time complexity is what?',
 hint: 'all element. ',
 solution: 'worst-case in all element (all element value). at this point this need sorting \\(n\\) element, use insert sorting \\(O(n^2)\\). if use \\(O(n \\log n)\\) sorting algorithm, worst-case \\(O(n \\log n)\\). Bucket Sort expected input uniform distribution assume. '
},
 {
 question: 'if Bucket Sort input not is uniform distribution(distribution), expected?',
 hint: 'to each expected element equal. ',
 solution: 'use (quantiles)determine edge, each expected element \\(O(1)\\). for distribution \\(N(\\mu, \\sigma^2)\\), edge use CDF determine: \\(i\\) \\([\\Phi^{-1}(i/n), \\Phi^{-1}((i+1)/n))\\). if distribution, can, or use partition. '
},
 {
 question: 'comparison-based sorting, Counting Sort, Radix Sort Bucket Sort in the following select: (1) sorting 100 32 (2) sorting 1000 (3) sorting 100 length 20 ',
 hint: 'algorithm use. ',
 solution: '(1) 100 32: Radix Sort optimal, \\(O(4n)\\) use 4 Counting Sort. comparison-based sorting \\(O(n \\log n) \\approx 2 \\times 10^7\\), Radix Sort \\(4 \\times 10^6\\). (2) 1000: comparison-based sorting(Quicksort), because \\(n\\), more need, and not. (3) 100 length 20: Radix Sort(MSD)or comparison-based sorting. if (ASCII), Radix Sort \\(O(20 \\cdot 10^6)\\). comparison-based sorting \\(O(n \\log n \\cdot 20) \\approx 4 \\times 10^8\\)(each times compare 20). Radix Sort may more. '
},
 {
 question: 'there exists \\(O(n \\log n)\\) more use sorting algorithm?in what?',
 hint: 'different compute. ',
 solution: 'in compare, \\(\\Omega(n \\log n)\\) is lower bound. in its he can more: (1) Word RAM: if element is \\(w\\), can use Andersson algorithm in \\(O(n \\sqrt{\\log \\log n})\\) expected time sorting. (2) compute: sorting lower bound is \\(\\Omega(n \\log n)\\). (3) row: use \\(n\\) can \\(O(\\log n)\\) sorting(AKS sorting). (4) random input: if known input distribution, Bucket Sort can \\(O(n)\\). so"use"compute input assume. '
},
 {
 question: 'sorting algorithm, value \\([0, n^2 - 1]\\) \\(n\\) in \\(\\Theta(n)\\) sorting. ',
 hint: 'each see \\(n\\). ',
 solution: 'each \\(x\\) denote \\(x = a \\cdot n + b\\), its \\(a = \\lfloor x/n \\rfloor,\\; b = x \\bmod n\\), in \\([0, n-1]\\). use Radix Sort: by \\(b\\) sorting(Counting Sort, \\(k = n\\), \\(O(n)\\)), by \\(a\\) sorting(Counting Sort, \\(k = n\\), \\(O(n)\\)). \\(O(2 \\cdot (n + n)) = \\Theta(n)\\). '
}
]
}
]
});
