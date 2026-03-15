// Chapter 4: Merge Sort & Divide-and-Conquer -- Merge Sort & the Divide-and-Conquer Paradigm
window.CHAPTERS.push({
 id: 'ch04',
 number: 4,
 title: 'Merge Sort & Divide-and-Conquer',
 subtitle: 'Merge Sort & the Divide-and-Conquer Paradigm',
 sections: [
 // ── Section 1: Merge Sort Algorithm ──
 {
 id: 'ch04-sec01',
 title: 'The Merge Sort Algorithm',
 content: `<h2>The Merge Sort Algorithm</h2>
<div class="env-block bridge"><div class="env-title">Chapter Overview</div><div class="env-body"><p>Chapters 0 through 3 built the analysis toolkit; now we put it to work. Divide-and-conquer is the first major algorithm design paradigm we study in depth. Its poster child is Merge Sort, which achieves the optimal \(O(n \log n)\) time by splitting, conquering recursively, and merging. This chapter develops the paradigm through Merge Sort, then applies it to counting inversions and the closest pair problem.</p></div></div>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>We begin with the Merge Sort algorithm itself: how it splits the array, recurses on each half, and merges the sorted halves back together. Understanding the merge procedure in detail is essential, as the same merging idea reappears in many divide-and-conquer algorithms.</p></div></div>

<p>Merge Sort is a classic example of the divide-and-conquer paradigm applied to sorting. It recursively splits an array in half, sorts each half, then merges them, guaranteeing \\(O(n \\log n)\\) worst-case time complexity. </p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Merge Sort)</div><div class="env-body">
<p><strong>MergeSort(A, l, r):</strong></p>
<p>1. if \\(l \\geq r\\), </p>
<p>2. let \\(m = \\lfloor (l + r) / 2 \\rfloor\\)</p>
<p>3. MergeSort(A, l, m)</p>
<p>4. MergeSort(A, m+1, r)</p>
<p>5. Merge(A, l, m, r)</p>
</div></div>

<p>The <strong>Merge</strong> procedure is the heart of the algorithm: it merges two sorted subarrays \\(A[l.m]\\) \\(A[m+1.r]\\) into a single sorted array.</p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Merge)</div><div class="env-body">
<p><strong>Merge(A, l, m, r):</strong></p>
<p>1. auxiliary array \\(L = A[l.m]\\), \\(R = A[m+1.r]\\)</p>
<p>2. let \\(i = 0,\\; j = 0,\\; k = l\\)</p>
<p>3. when \\(i <|L|\\) and \\(j <|R|\\): </p>
<p>&emsp; if \\(L[i] \\leq R[j]\\), then \\(A[k] = L[i],\\; i{+}{+}\\)</p>
<p>&emsp; otherwise then \\(A[k] = R[j],\\; j{+}{+}\\)</p>
<p>&emsp; \\(k{+}{+}\\)</p>
<p>4. \\(L\\) or \\(R\\) element to \\(A\\)</p>
</div></div>

<div class="viz-placeholder" data-viz="ch04-viz-merge-sort-step"></div>

<div class="env-block intuition"><div class="env-title">Intuition</div><div class="env-body">
<p>Imagine holding two sorted stacks of playing cards. Each time, compare the top cards and place the smaller one into the result pile. This is the merge process -- simple, elegant, and linear time.</p>
</div></div>

<p>An important property of Merge Sort is that it is a <strong>stable sort</strong>: equal elements maintain their relative order after sorting. This is very useful for multi-key sorting.</p>`,
 visualizations: [
 {
 id: 'ch04-viz-merge-sort-step',
 title: 'Step-by-Step Merge Sort',
 description: 'Interactive demonstration of the split and merge process in Merge Sort',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var origArr = [38, 27, 43, 3, 9, 82, 10, 15];
 var arr = origArr.slice();
 var steps = [];
 var stepIdx = 0;

 function recordMergeSort(a, l, r, depth) {
 if (l>= r) return;
 var m = Math.floor((l + r) / 2);
 steps.push({type: 'split', l: l, m: m, r: r, arr: a.slice(), depth: depth});
 recordMergeSort(a, l, m, depth + 1);
 recordMergeSort(a, m + 1, r, depth + 1);
 var L = a.slice(l, m + 1);
 var R = a.slice(m + 1, r + 1);
 var i = 0, j = 0, k = l;
 while (i <L.length && j <R.length) {
 if (L[i] <= R[j]) {a[k++] = L[i++];}
 else {a[k++] = R[j++];}
}
 while (i <L.length) a[k++] = L[i++];
 while (j <R.length) a[k++] = R[j++];
 steps.push({type: 'merge', l: l, m: m, r: r, arr: a.slice(), depth: depth});
}

 var temp = origArr.slice();
 recordMergeSort(temp, 0, temp.length - 1, 0);

 function draw() {
 viz.clear();
 var n = arr.length;
 var cellW = 60, cellH = 40;
 var startX = (700 - n * cellW) / 2;
 var startY = 40;

 viz.screenText('Merge Sort Step-by-Step', 350, 20, viz.colors.white, 16, 'center');

 var step = stepIdx <steps.length? steps[stepIdx]: null;
 var currentArr = step? step.arr: temp;
 var colors = [];
 var highlights = [];
 for (var i = 0; i <n; i++) {
 colors.push(viz.colors.bg);
 highlights.push(null);
}
 if (step) {
 for (var j = step.l; j <= step.r; j++) {
 if (step.type === 'split') {
 colors[j] = '#1a2a4a';
 if (j <= step.m) highlights[j] = viz.colors.blue;
 else highlights[j] = viz.colors.teal;
} else {
 colors[j] = '#1a3a2a';
 highlights[j] = viz.colors.green;
}
}
}

 viz.drawArray(currentArr, startX, startY, cellW, cellH, colors, highlights);

 // Draw bar chart
 var barW = 40;
 var maxH = 180;
 var barStartX = (700 - n * (barW + 8)) / 2;
 var barStartY = 350;
 var maxVal = Math.max.apply(null, currentArr);
 for (var i = 0; i <n; i++) {
 var h = (currentArr[i] / maxVal) * maxH;
 var px = barStartX + i * (barW + 8);
 var py = barStartY - h;
 var barColor = viz.colors.blue;
 if (step && i>= step.l && i <= step.r) {
 barColor = step.type === 'split'? viz.colors.orange: viz.colors.green;
}
 viz.ctx.fillStyle = barColor;
 viz.ctx.fillRect(px, py, barW, h);
 viz.ctx.strokeStyle = viz.colors.axis;
 viz.ctx.lineWidth = 0.5;
 viz.ctx.strokeRect(px, py, barW, h);
 viz.screenText(String(currentArr[i]), px + barW / 2, py - 8, viz.colors.white, 11, 'center');
}

 // Status text
 var statusText = '';
 if (step) {
 if (step.type === 'split') {
 statusText = 'Split: A[' + step.l + '.' + step.r + '] at mid=' + step.m + ' (depth ' + step.depth + ')';
} else {
 statusText = 'Merge: A[' + step.l + '.' + step.r + '] merged (depth ' + step.depth + ')';
}
} else {
 statusText = 'Sorting complete!';
}
 viz.screenText(statusText, 350, 390, viz.colors.yellow, 13, 'center');
 viz.screenText('Step ' + (stepIdx + 1) + ' / ' + steps.length, 350, 410, viz.colors.text, 11, 'center');
}

 draw();

 VizEngine.createButton(controls, 'Previous', function() {
 if (stepIdx> 0) {stepIdx--; draw();}
});
 VizEngine.createButton(controls, 'Next', function() {
 if (stepIdx <steps.length - 1) {stepIdx++; draw();}
});
 VizEngine.createButton(controls, 'Reset', function() {
 stepIdx = 0; draw();
});
 VizEngine.createButton(controls, 'New Array', function() {
 origArr = [];
 for (var i = 0; i <8; i++) origArr.push(Math.floor(Math.random() * 90) + 5);
 arr = origArr.slice();
 steps = [];
 temp = origArr.slice();
 recordMergeSort(temp, 0, temp.length - 1, 0);
 stepIdx = 0;
 draw();
});

 return viz;
}
}
],
 exercises: [
 {
 question: 'array \\([5, 2, 4, 7, 1, 3, 2, 6]\\) execute Merge Sort, times merge(level)subarray state. ',
 hint: 'recursive to minimum subproblem: element. then start merge. ',
 solution: 'times to \\([5],[2]\\), merge obtain \\([2,5]\\). then \\([4],[7]\\) merge \\([4,7]\\). this. '
},
 {
 question: 'Merge Sort space complexity is how many?what not can do to in-place(in-place)merge?',
 hint: ' Merge step need auxiliary space. ',
 solution: 'space complexity \\(O(n)\\). Merge need element to auxiliary array, because in merge need. there exists in-place merge algorithm, it, not use. '
},
 {
 question: 'proof merge Merge(A, l, m, r) number of comparisons \\(n - 1\\)(its \\(n = r - l + 1\\)). ',
 hint: 'each times compare, at least have element output array. ',
 solution: ' \\(|L| = n_1,\\; |R| = n_2,\\; n = n_1 + n_2\\). each times compare exactly have element to result. when stop compare. therefore execute \\(n_1 + n_2 - 1 = n - 1\\) times compare. '
}
]
},

 // ── Section 2: Correctness & Analysis ──
 {
 id: 'ch04-sec02',
 title: 'Correctness & Complexity Analysis',
 content: `<h2>correctness and </h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>With the algorithm defined, we now prove it correct using induction and analyze its time complexity using the recurrence \(T(n) = 2T(n/2) + \Theta(n)\), which we can solve with the Master Theorem from Chapter 2.</p></div></div>


<h3>correctness proof</h3>
<p>Merge Sort correctness can use<strong>not </strong>proof. </p>

<div class="env-block theorem"><div class="env-title">Theorem (Merge Correctness)</div><div class="env-body">
<p>if \\(A[l.m]\\) \\(A[m+1.r]\\) in use Merge sorting, then Merge \\(A[l.r]\\) sorting. </p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p><strong>not: </strong> in merge each times start, \\(A[l.k-1]\\) contain \\(L[0.i-1]\\) \\(R[0.j-1]\\) all element, and sorting. \\(L[i]\\) \\(R[j]\\) is subarray minimum element. </p>
<p><strong>: </strong> \\(k = l,\\; i = j = 0\\), \\(A[l.l-1]\\), not. </p>
<p><strong>: </strong> if \\(L[i] \\leq R[j]\\), then \\(L[i]\\) is all element minimum (because \\(L[i] \\leq L[i+1.] \\) and \\(L[i] \\leq R[j] \\leq R[j+1.]\\)), its \\(A[k]\\) not continue. </p>
<p><strong>: </strong> when end, all element \\(A[l.r]\\) and have. </p>
<p class="qed">∎</p>
</div></div>

<h3>time complexity</h3>
<p>Merge Sort recurrence: </p>
$$T(n) = 2T(n/2) + \\Theta(n)$$
<p>its \\(\\Theta(n)\\) is merge. </p>

<div class="viz-placeholder" data-viz="ch04-viz-recursion-tree"></div>

<div class="env-block theorem"><div class="env-title">Theorem (Merge Sort Complexity)</div><div class="env-body">
<p>Merge Sort time complexity \\(\\Theta(n \\log n)\\), space complexity \\(\\Theta(n)\\). </p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p>Master Theorem(Master Theorem), \\(T(n) = 2T(n/2) + \\Theta(n)\\) belongs to Case 2(\\(a = 2,\\; b = 2,\\; f(n) = \\Theta(n) = \\Theta(n^{\\log_b a})\\)), so \\(T(n) = \\Theta(n \\log n)\\). </p>
<p>also can use recursive tree: \\(\\log_2 n\\) level, each level merge \\(\\Theta(n)\\), therefore \\(\\Theta(n \\log n)\\). </p>
<p class="qed">∎</p>
</div></div>

<p>and insert sorting \\(O(n^2)\\), Merge Sort in input have. when \\(n = 10^6\\), \\(n^2 = 10^{12}\\) \\(n \\log_2 n \\approx 2 \\times 10^7\\). </p>`,
 visualizations: [
 {
 id: 'ch04-viz-recursion-tree',
 title: 'Merge Sort Recursion Tree',
 description: 'recursive tree level merge ',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 400});
 var nVal = 8;

 function draw() {
 viz.clear();
 viz.screenText('Merge Sort Recursion Tree (n=' + nVal + ')', 350, 18, viz.colors.white, 15, 'center');

 var levels = Math.ceil(Math.log2(nVal)) + 1;
 var nodeR = 18;
 var levelH = 60;
 var startY = 55;

 for (var lev = 0; lev <levels; lev++) {
 var nodesAtLevel = Math.pow(2, lev);
 var sizeAtLevel = Math.ceil(nVal / nodesAtLevel);
 if (sizeAtLevel <1) break;
 var spacing = 660 / (nodesAtLevel + 1);

 for (var nd = 0; nd <nodesAtLevel; nd++) {
 var px = 20 + spacing * (nd + 1);
 var py = startY + lev * levelH;
 var label = sizeAtLevel <= 1? '1': String(sizeAtLevel);
 var col = lev === 0? viz.colors.orange: viz.colors.blue;
 viz.drawNode(px, py, nodeR, label, col, viz.colors.white);

 // Draw edges to children
 if (lev <levels - 1 && sizeAtLevel> 1) {
 var childSpacing = 660 / (nodesAtLevel * 2 + 1);
 var lx = 20 + childSpacing * (nd * 2 + 1);
 var rx = 20 + childSpacing * (nd * 2 + 2);
 var cy = startY + (lev + 1) * levelH;
 viz.drawTreeEdge(px, py + nodeR, lx, cy - nodeR, viz.colors.axis);
 viz.drawTreeEdge(px, py + nodeR, rx, cy - nodeR, viz.colors.axis);
}
}

 // Work at this level
 var workAtLevel = nodesAtLevel * sizeAtLevel;
 viz.screenText('Work: O(' + Math.min(workAtLevel, nVal) + ')', 680, startY + lev * levelH, viz.colors.yellow, 11, 'right');
}

 viz.screenText('Total: O(n log n) = O(' + nVal + ' * ' + Math.ceil(Math.log2(nVal)) + ') = O(' + (nVal * Math.ceil(Math.log2(nVal))) + ')', 350, startY + levels * levelH - 10, viz.colors.green, 13, 'center');
}

 draw();

 VizEngine.createSlider(controls, 'n', 2, 32, nVal, 1, function(v) {
 nVal = Math.round(v);
 draw();
});

 return viz;
}
}
],
 exercises: [
 {
 question: 'use recursive tree method(not use Master Theorem)proof \\(T(n) = 2T(n/2) + n\\) solution \\(\\Theta(n \\log n)\\). ',
 hint: 'recursive tree, compute each level, again all level. ',
 solution: 'recursive tree \\(\\log_2 n\\) level. \\(k\\) level have \\(2^k\\) subproblem, each size \\(n/2^k\\), each subproblem merge \\(n/2^k\\). therefore \\(k\\) level = \\(2^k \\cdot n/2^k = n\\). = \\(n \\cdot \\log_2 n = \\Theta(n \\log n)\\). '
},
 {
 question: 'Merge Sort best-case worst-case number of comparisons respectively is how many?(to)',
 hint: 'best-case: each times merge. worst-case:. ',
 solution: 'worst-case number of comparisons: \\(n \\lceil \\log_2 n \\rceil - 2^{\\lceil \\log_2 n \\rceil} + 1\\). best-case number of comparisons: \\(\\frac{n}{2} \\log_2 n\\)(when each times merge, maximum element less than minimum element, only \\(n/2\\) times compare \\(n-1\\) times). '
},
 {
 question: 'if Merge Sort merge(3-way merge sort), its recurrence time complexity is what?',
 hint: 'recurrence \\(T(n) = 3T(n/3) +?\\). merge three have array is how many?',
 solution: 'recurrence \\(T(n) = 3T(n/3) + O(n)\\). merge each three pointer minimum value result, \\(O(n)\\) compare. Master Theorem \\(a=3,b=3\\), have \\(T(n) = \\Theta(n \\log n)\\)(3, \\(\\log_3 n = \\log_2 n / \\log_2 3\\), different). '
}
]
},

 // ── Section 3: Divide-and-Conquer Template ──
 {
 id: 'ch04-sec03',
 title: 'Divide-and-Conquer Framework Visualization',
 content: `<h2>divide and conquer </h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Merge Sort is just one instance of a general pattern. This section abstracts the divide-and-conquer framework and shows how different choices of splitting, conquering, and combining yield different algorithms with different recurrences.</p></div></div>

<p>Merge Sort <strong>divide and conquer(Divide and Conquer)</strong>: </p>

<div class="env-block definition"><div class="env-title">Definition (Divide and Conquer)</div><div class="env-body">
<p>divide and conquer is algorithm, contain three step: </p>
<p>1. <strong>Divide(partition): </strong> problem solution if more subproblem. </p>
<p>2. <strong>Conquer(solution): </strong> recursive solve subproblem. when subproblem, solution. </p>
<p>3. <strong>Combine(merge): </strong> subproblem solution combination problem solution. </p>
</div></div>

<div class="viz-placeholder" data-viz="ch04-viz-dc-template"></div>

<p>divide and conquer time complexity usually recurrence: </p>
$$T(n) = aT(n/b) + f(n)$$
<p>its \\(a\\) is subproblem, \\(n/b\\) is each subproblem, \\(f(n)\\) is partition and merge. this is Master Theorem use. </p>

<div class="env-block example"><div class="env-title">Example (Classic D&C Algorithms)</div><div class="env-body">
<p><strong>Merge Sort: </strong> \\(a = 2,\\; b = 2,\\; f(n) = \\Theta(n)\\) → \\(T(n) = \\Theta(n \\log n)\\)</p>
<p><strong>: </strong> \\(a = 1,\\; b = 2,\\; f(n) = \\Theta(1)\\) → \\(T(n) = \\Theta(\\log n)\\)</p>
<p><strong>Strassen Matrix Multiplication: </strong> \\(a = 7,\\; b = 2,\\; f(n) = \\Theta(n^2)\\) → \\(T(n) = \\Theta(n^{\\log_2 7}) \\approx \\Theta(n^{2.807})\\)</p>
<p><strong>Karatsuba: </strong> \\(a = 3,\\; b = 2,\\; f(n) = \\Theta(n)\\) → \\(T(n) = \\Theta(n^{\\log_2 3}) \\approx \\Theta(n^{1.585})\\)</p>
</div></div>

<div class="env-block warning"><div class="env-title">Warning</div><div class="env-body">
<p>all recursive algorithm is divide and conquer. divide and conquer key in subproblem is<strong>not </strong>. if subproblem, this use Dynamic Programming(DP)compute. e.g., Fibonacci column recursive two subproblem, since subproblem, its is. </p>
</div></div>`,
 visualizations: [
 {
 id: 'ch04-viz-dc-template',
 title: 'divide and conquer ',
 description: 'divide and conquer: partition, solution, merge',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 380});

 var alg = 'merge';

 function draw() {
 viz.clear();
 viz.screenText('Divide & Conquer Template', 350, 18, viz.colors.white, 15, 'center');

 // Draw the three phases
 var phases = ['DIVIDE', 'CONQUER', 'COMBINE'];
 var phaseColors = [viz.colors.orange, viz.colors.blue, viz.colors.green];
 var phaseX = [120, 350, 580];

 for (var i = 0; i <3; i++) {
 var px = phaseX[i];
 // Box
 viz.ctx.fillStyle = phaseColors[i] + '22';
 viz.ctx.fillRect(px - 80, 50, 160, 60);
 viz.ctx.strokeStyle = phaseColors[i];
 viz.ctx.lineWidth = 2;
 viz.ctx.strokeRect(px - 80, 50, 160, 60);
 viz.screenText(phases[i], px, 72, phaseColors[i], 16, 'center');

 if (i <2) {
 // Arrow
 viz.ctx.strokeStyle = viz.colors.axis;
 viz.ctx.lineWidth = 2;
 viz.ctx.beginPath();
 viz.ctx.moveTo(px + 80, 80);
 viz.ctx.lineTo(phaseX[i + 1] - 80, 80);
 viz.ctx.stroke();
 viz.ctx.fillStyle = viz.colors.axis;
 viz.ctx.beginPath();
 viz.ctx.moveTo(phaseX[i + 1] - 80, 80);
 viz.ctx.lineTo(phaseX[i + 1] - 90, 75);
 viz.ctx.lineTo(phaseX[i + 1] - 90, 85);
 viz.ctx.closePath();
 viz.ctx.fill();
}
}

 // Show example based on selected algorithm
 var descriptions = {};
 if (alg === 'merge') {
 descriptions = {
 title: 'Merge Sort',
 divide: 'Split array at midpoint',
 conquer: 'Sort each half recursively',
 combine: 'Merge two sorted halves',
 recurrence: 'T(n) = 2T(n/2) + O(n)'
};
} else if (alg === 'binary') {
 descriptions = {
 title: 'Binary Search',
 divide: 'Compare with middle element',
 conquer: 'Search in one half',
 combine: 'No combination needed',
 recurrence: 'T(n) = T(n/2) + O(1)'
};
} else {
 descriptions = {
 title: 'Strassen',
 divide: 'Partition into 4 submatrices',
 conquer: '7 recursive multiplications',
 combine: 'Add/subtract subresults',
 recurrence: 'T(n) = 7T(n/2) + O(n^2)'
};
}

 viz.screenText(descriptions.title, 350, 140, viz.colors.yellow, 14, 'center');

 for (var j = 0; j <3; j++) {
 var desc = [descriptions.divide, descriptions.conquer, descriptions.combine][j];
 viz.screenText(desc, phaseX[j], 170, viz.colors.text, 12, 'center');
}

 // Draw example tree
 var treeY = 210;
 // Root
 viz.drawNode(350, treeY, 22, 'n', viz.colors.orange, viz.colors.white);
 // Level 1
 viz.drawTreeEdge(350, treeY + 22, 200, treeY + 65, viz.colors.axis);
 viz.drawTreeEdge(350, treeY + 22, 500, treeY + 65, viz.colors.axis);
 viz.drawNode(200, treeY + 80, 18, 'n/2', viz.colors.blue, viz.colors.white);
 viz.drawNode(500, treeY + 80, 18, 'n/2', viz.colors.blue, viz.colors.white);
 // Level 2
 viz.drawTreeEdge(200, treeY + 98, 130, treeY + 130, viz.colors.axis);
 viz.drawTreeEdge(200, treeY + 98, 270, treeY + 130, viz.colors.axis);
 viz.drawTreeEdge(500, treeY + 98, 430, treeY + 130, viz.colors.axis);
 viz.drawTreeEdge(500, treeY + 98, 570, treeY + 130, viz.colors.axis);
 viz.drawNode(130, treeY + 145, 14, 'n/4', viz.colors.teal, viz.colors.white);
 viz.drawNode(270, treeY + 145, 14, 'n/4', viz.colors.teal, viz.colors.white);
 viz.drawNode(430, treeY + 145, 14, 'n/4', viz.colors.teal, viz.colors.white);
 viz.drawNode(570, treeY + 145, 14, 'n/4', viz.colors.teal, viz.colors.white);

 viz.screenText(descriptions.recurrence, 350, treeY + 165, viz.colors.green, 13, 'center');
}

 draw();

 VizEngine.createSelect(controls, 'Algorithm', [
 {value: 'merge', label: 'Merge Sort'},
 {value: 'binary', label: 'Binary Search'},
 {value: 'strassen', label: 'Strassen'}
], function(v) {alg = v; draw();});

 return viz;
}
}
],
 exercises: [
 {
 question: 'divide and conquer algorithm array maximum element. recurrence time complexity. ',
 hint: 'array, respectively maximum value, then. ',
 solution: 'recurrence \\(T(n) = 2T(n/2) + O(1)\\). Master Theorem Case 1, \\(T(n) = \\Theta(n)\\). number of comparisons exactly \\(n - 1\\). this and number of comparisons same, divide and conquer row. '
},
 {
 question: 'divide and conquer algorithm problem 4 subproblem, each size \\(n/2\\), merge \\(O(n^2)\\). its time complexity is what?',
 hint: 'use Master Theorem, \\(a = 4, b = 2, f(n) = n^2\\). ',
 solution: '\\(\\log_b a = \\log_2 4 = 2\\). \\(f(n) = n^2 = \\Theta(n^{\\log_b a})\\), belongs to Case 2. therefore \\(T(n) = \\Theta(n^2 \\log n)\\). '
},
 {
 question: 'what divide and conquer subproblem must"not "?its. ',
 hint: ' Fibonacci column recursive. ',
 solution: ' Fibonacci recursive \\(F(n) = F(n-1) + F(n-2)\\), \\(F(n-2)\\) \\(F(n-1)\\) \\(F(n)\\) use, \\(O(\\phi^n)\\) compute. use DP or memoization its \\(O(n)\\). '
}
]
},

 // ── Section 4: Counting Inversions ──
 {
 id: 'ch04-sec04',
 title: 'Counting Inversions',
 content: `<h2>Counting Inversions</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Our first non-sorting application of divide-and-conquer: counting inversions. By piggybacking on the merge step, we can count all inversions in \(O(n \log n)\) time, a technique with applications in ranking and recommendation systems.</p></div></div>

<p>is divide and conquer in sorting use. given array \\(A[1.n]\\), is satisfy \\(i <j\\) \\(A[i]> A[j]\\) \\((i, j)\\). </p>

<div class="env-block definition"><div class="env-title">Definition (Inversions)</div><div class="env-body">
<p>array \\(A\\) define: </p>
$$\\text{inv}(A) = |\\{(i, j): 1 \\leq i <j \\leq n \\text{and} A[i]> A[j]\\}|$$
<p>array have state. sorting array 0, permutation \\(\\binom{n}{2} = n(n-1)/2\\). </p>
</div></div>

<p>in: (Kendall tau distance), compute permutation. </p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Count Inversions via Merge Sort)</div><div class="env-body">
<p><strong>CountInversions(A, l, r):</strong></p>
<p>1. if \\(l \\geq r\\), 0</p>
<p>2. \\(m = \\lfloor (l + r) / 2 \\rfloor\\)</p>
<p>3. \\(\\text{left\\_inv} = \\text{CountInversions}(A, l, m)\\)</p>
<p>4. \\(\\text{right\\_inv} = \\text{CountInversions}(A, m+1, r)\\)</p>
<p>5. \\(\\text{split\\_inv} = \\text{MergeAndCount}(A, l, m, r)\\)</p>
<p>6. \\(\\text{left\\_inv} + \\text{right\\_inv} + \\text{split\\_inv}\\)</p>
</div></div>

<p>key: in merge procedure, when \\(R[j] <L[i]\\), \\(R[j]\\) and \\(L[i], L[i+1], \\ldots, L[n_1-1]\\). therefore can in merge procedure \\(O(n)\\) complete. </p>

<div class="viz-placeholder" data-viz="ch04-viz-inversions"></div>

<div class="env-block theorem"><div class="env-title">Theorem</div><div class="env-body">
<p>problem can in \\(O(n \\log n)\\) solve. </p>
</div></div>`,
 visualizations: [
 {
 id: 'ch04-viz-inversions',
 title: 'Inversion Count Visualization',
 description: 'Counting inversions during the merge procedure',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var arr = [2, 4, 1, 3, 5];
 var stepLog = [];
 var stepIdx = 0;

 function countInv(a) {
 stepLog = [];
 var temp = a.slice();
 function msort(arr2, l, r) {
 if (l>= r) return 0;
 var m = Math.floor((l + r) / 2);
 var inv = 0;
 inv += msort(arr2, l, m);
 inv += msort(arr2, m + 1, r);
 var L = arr2.slice(l, m + 1);
 var R = arr2.slice(m + 1, r + 1);
 var i = 0, j = 0, k = l, splitInv = 0;
 while (i <L.length && j <R.length) {
 if (L[i] <= R[j]) {
 arr2[k++] = L[i++];
} else {
 splitInv += L.length - i;
 stepLog.push({
 arr: arr2.slice(),
 l: l, m: m, r: r,
 li: l + i, rj: m + 1 + j,
 invCount: splitInv,
 msg: 'R[' + j + ']=' + R[j] + ' <L[' + i + ']=' + L[i] + ' => +' + (L.length - i) + ' inversions'
});
 arr2[k++] = R[j++];
}
}
 while (i <L.length) arr2[k++] = L[i++];
 while (j <R.length) arr2[k++] = R[j++];
 inv += splitInv;
 return inv;
}
 var total = msort(temp, 0, temp.length - 1);
 stepLog.push({arr: temp, l: 0, m: 0, r: temp.length - 1, li: -1, rj: -1, invCount: total, msg: 'Total inversions: ' + total});
 return total;
}

 countInv(arr);

 function draw() {
 viz.clear();
 var n = arr.length;
 var cellW = 55, cellH = 40;
 var startX = (700 - n * cellW) / 2;

 viz.screenText('Inversion Counting via Merge Sort', 350, 18, viz.colors.white, 15, 'center');

 // Original array
 viz.screenText('Original:', 60, 60, viz.colors.text, 12, 'left');
 viz.drawArray(arr, startX, 45, cellW, cellH);

 // Current step
 if (stepIdx <stepLog.length) {
 var st = stepLog[stepIdx];
 viz.screenText('Step ' + (stepIdx + 1) + '/' + stepLog.length, 350, 110, viz.colors.yellow, 12, 'center');

 var colors = [];
 var highlights = [];
 for (var i = 0; i <st.arr.length; i++) {
 colors.push(viz.colors.bg);
 highlights.push(null);
 if (i>= st.l && i <= st.r) {
 colors[i] = '#1a2a4a';
}
 if (i === st.li) highlights[i] = viz.colors.red;
 if (i === st.rj) highlights[i] = viz.colors.green;
}
 viz.drawArray(st.arr, startX, 130, cellW, cellH, colors, highlights);

 // Draw inversion arcs
 viz.screenText(st.msg, 350, 210, viz.colors.orange, 13, 'center');
 viz.screenText('Split inversions so far: ' + st.invCount, 350, 235, viz.colors.teal, 12, 'center');

 // Bar chart of current array state
 var barW = 35;
 var maxH = 120;
 var barStartX = (700 - n * (barW + 10)) / 2;
 var barStartY = 380;
 var maxVal = Math.max.apply(null, st.arr);
 for (var j = 0; j <n; j++) {
 var h = (st.arr[j] / maxVal) * maxH;
 var px = barStartX + j * (barW + 10);
 var py = barStartY - h;
 var barCol = viz.colors.blue;
 if (j === st.li) barCol = viz.colors.red;
 if (j === st.rj) barCol = viz.colors.green;
 viz.ctx.fillStyle = barCol;
 viz.ctx.fillRect(px, py, barW, h);
 viz.screenText(String(st.arr[j]), px + barW / 2, py - 8, viz.colors.white, 11, 'center');
}
}
}

 draw();

 VizEngine.createButton(controls, 'Prev', function() {
 if (stepIdx> 0) {stepIdx--; draw();}
});
 VizEngine.createButton(controls, 'Next', function() {
 if (stepIdx <stepLog.length - 1) {stepIdx++; draw();}
});
 VizEngine.createButton(controls, 'Reset', function() {
 stepIdx = 0; draw();
});
 VizEngine.createButton(controls, 'Random Array', function() {
 arr = [];
 for (var i = 0; i <6; i++) arr.push(Math.floor(Math.random() * 20) + 1);
 countInv(arr);
 stepIdx = 0;
 draw();
});

 return viz;
}
}
],
 exercises: [
 {
 question: 'compute array \\([3, 1, 2, 5, 4]\\). ',
 hint: 'check all \\((i,j)\\), its \\(i <j\\) \\(A[i]> A[j]\\). ',
 solution: ' \\((3,1), (3,2), (5,4)\\), 3. '
},
 {
 question: 'proof: have \\(k\\) array, insert sorting need exactly \\(k\\) times swap. ',
 hint: 'insert sorting each times swap exactly. ',
 solution: 'in insert sorting, \\(A[j]\\) insert to sorting, each times and element swap \\((A[j-1], A[j])\\), and not will. therefore number of swaps = = \\(k\\). '
},
 {
 question: 'length \\(n\\) permutation expected is how many?',
 hint: 'each \\((i,j)\\), \\(A[i]> A[j]\\) probability is how many?',
 solution: 'have \\(\\binom{n}{2}\\). for any position \\((i,j)\\) its \\(i <j\\), in random permutation \\(A[i]> A[j]\\) probability \\(1/2\\). expected, expected = \\(\\binom{n}{2} \\cdot \\frac{1}{2} = \\frac{n(n-1)}{4}\\). '
},
 {
 question: 'algorithm compute satisfy \\(i <j\\) and \\(A[i]> 2A[j]\\)?',
 hint: 'in merge increase step. ',
 solution: 'in merge \\(L\\) \\(R\\), use pointer satisfy \\(L[i]> 2R[j]\\): each \\(L[i]\\), find maximum \\(j\\) \\(L[i]> 2R[j]\\). since \\(L\\) \\(R\\) sorting, pointer only, \\(O(n)\\). then merge. \\(O(n \\log n)\\). '
}
]
},

 // ── Section 5: Closest Pair of Points ──
 {
 id: 'ch04-sec05',
 title: 'Closest Pair of Points',
 content: `<h2>Closest Pair of Points</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>The closest pair problem in two dimensions shows divide-and-conquer at its most subtle. The key insight is that the "strip" near the dividing line contains only a constant number of candidate pairs, keeping the combine step linear.</p></div></div>

<p>given \\(n\\), distance. algorithm need check all \\(\\binom{n}{2}\\), time complexity \\(O(n^2)\\). use divide and conquer can in \\(O(n \\log n)\\) solve. </p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Closest Pair)</div><div class="env-body">
<p><strong>ClosestPair(P):</strong></p>
<p>1. \\(P\\) by \\(x\\) sorting</p>
<p>2. use \\(P\\) \\(P_L\\) \\(P_R\\)</p>
<p>3. \\(\\delta_L = \\text{ClosestPair}(P_L)\\), \\(\\delta_R = \\text{ClosestPair}(P_R)\\)</p>
<p>4. \\(\\delta = \\min(\\delta_L, \\delta_R)\\)</p>
<p>5. \\(S\\): \\(\\delta\\) </p>
<p>6. \\(S\\) by \\(y\\) sorting</p>
<p>7. \\(S\\) each, check its 7 distance</p>
<p>8. minimum distance</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (Closest Pair in Strip)</div><div class="env-body">
<p>in \\(S\\), by \\(y\\) sorting, each need and its 7 compare. therefore \\(O(n)\\). </p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof Sketch</div><div class="env-body">
<p> \\(\\delta \\times 2\\delta\\) (\\(\\delta\\)). its partition 8 \\(\\delta/2 \\times \\delta/2\\). each at most have 1 (otherwise then distance \\(<\\delta\\), and define). therefore have 8, each check 7. </p>
<p class="qed">∎</p>
</div></div>

<div class="viz-placeholder" data-viz="ch04-viz-closest-pair"></div>

<div class="viz-placeholder" data-viz="ch04-viz-strip-analysis"></div>
<div class="env-block bridge"><div class="env-title">Looking Ahead</div><div class="env-body"><p>Merge Sort always splits evenly, giving predictable \(O(n \log n)\) performance. But what if we partition around a pivot element instead? Chapter 5 explores Quicksort, where the partition is data-dependent, leading to fascinating questions about worst-case versus expected performance and the power of randomization.</p></div></div>`,
 visualizations: [
 {
 id: 'ch04-viz-closest-pair',
 title: 'Closest Pair Divide-and-Conquer',
 description: 'Divide-and-conquer approach to the closest pair problem',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 400});
 var points = [];
 var n = 20;

 function generatePoints() {
 points = [];
 for (var i = 0; i <n; i++) {
 points.push({
 x: Math.random() * 600 + 50,
 y: Math.random() * 300 + 50
});
}
}
 generatePoints();

 var showStrip = false;
 var closestPairResult = null;

 function dist(a, b) {
 return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

 function findClosest() {
 var minD = Infinity;
 var p1 = null, p2 = null;
 for (var i = 0; i <points.length; i++) {
 for (var j = i + 1; j <points.length; j++) {
 var d = dist(points[i], points[j]);
 if (d <minD) {
 minD = d;
 p1 = i;
 p2 = j;
}
}
}
 return {dist: minD, i: p1, j: p2};
}

 function draw() {
 viz.clear();
 viz.screenText('Closest Pair of Points', 350, 18, viz.colors.white, 15, 'center');

 closestPairResult = findClosest();

 // Sort by x for midline
 var sorted = points.slice().sort(function(a, b) {return a.x - b.x;});
 var midX = sorted[Math.floor(n / 2)].x;

 // Draw midline
 viz.ctx.strokeStyle = viz.colors.yellow;
 viz.ctx.lineWidth = 1;
 viz.ctx.setLineDash([5, 5]);
 viz.ctx.beginPath();
 viz.ctx.moveTo(midX, 30);
 viz.ctx.lineTo(midX, 380);
 viz.ctx.stroke();
 viz.ctx.setLineDash([]);
 viz.screenText('mid', midX, 390, viz.colors.yellow, 10, 'center');

 // Draw strip
 if (showStrip && closestPairResult) {
 var delta = closestPairResult.dist;
 viz.ctx.fillStyle = viz.colors.purple + '15';
 viz.ctx.fillRect(midX - delta, 30, delta * 2, 350);
 viz.ctx.strokeStyle = viz.colors.purple;
 viz.ctx.lineWidth = 1;
 viz.ctx.setLineDash([3, 3]);
 viz.ctx.strokeRect(midX - delta, 30, delta * 2, 350);
 viz.ctx.setLineDash([]);
 viz.screenText('strip width = 2\u03B4', midX, 385, viz.colors.purple, 10, 'center');
}

 // Draw all points
 for (var i = 0; i <points.length; i++) {
 var col = points[i].x <midX? viz.colors.blue: viz.colors.teal;
 if (closestPairResult && (i === closestPairResult.i || i === closestPairResult.j)) {
 col = viz.colors.red;
}
 viz.ctx.fillStyle = col;
 viz.ctx.beginPath();
 viz.ctx.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2);
 viz.ctx.fill();
}

 // Draw closest pair line
 if (closestPairResult) {
 var pa = points[closestPairResult.i];
 var pb = points[closestPairResult.j];
 viz.ctx.strokeStyle = viz.colors.red;
 viz.ctx.lineWidth = 2;
 viz.ctx.beginPath();
 viz.ctx.moveTo(pa.x, pa.y);
 viz.ctx.lineTo(pb.x, pb.y);
 viz.ctx.stroke();

 viz.screenText('\u03B4 = ' + closestPairResult.dist.toFixed(2), 600, 380, viz.colors.red, 12, 'center');
}
}

 draw();

 VizEngine.createButton(controls, 'New Points', function() {
 generatePoints();
 draw();
});
 VizEngine.createButton(controls, 'Toggle Strip', function() {
 showStrip =!showStrip;
 draw();
});
 VizEngine.createSlider(controls, 'n', 6, 40, n, 1, function(v) {
 n = Math.round(v);
 generatePoints();
 draw();
});

 return viz;
}
},
 {
 id: 'ch04-viz-strip-analysis',
 title: 'Strip Analysis',
 description: 'Why each point only needs to check a constant number of neighbors',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 350});
 var delta = 100;

 function draw() {
 viz.clear();
 viz.screenText('Strip Analysis: Why Only 7 Neighbors?', 350, 18, viz.colors.white, 15, 'center');

 var midX = 350;
 var topY = 50;
 var rectW = delta * 2;
 var rectH = delta * 2;
 var rectX = midX - delta;
 var rectY = topY;

 // Draw the 2delta x delta rectangle
 viz.ctx.strokeStyle = viz.colors.orange;
 viz.ctx.lineWidth = 2;
 viz.ctx.strokeRect(rectX, rectY, rectW, rectH);

 // Draw midline
 viz.ctx.strokeStyle = viz.colors.yellow;
 viz.ctx.lineWidth = 1;
 viz.ctx.setLineDash([4, 4]);
 viz.ctx.beginPath();
 viz.ctx.moveTo(midX, rectY);
 viz.ctx.lineTo(midX, rectY + rectH);
 viz.ctx.stroke();
 viz.ctx.setLineDash([]);

 // Draw 8 grid cells (delta/2 x delta/2)
 var cellW = delta / 2;
 var cellH = delta / 2;
 viz.ctx.strokeStyle = viz.colors.axis;
 viz.ctx.lineWidth = 0.5;
 for (var r = 0; r <4; r++) {
 for (var c = 0; c <4; c++) {
 var cx = rectX + c * cellW;
 var cy = rectY + r * cellH;
 viz.ctx.strokeRect(cx, cy, cellW, cellH);

 // Label each cell
 var cellLabel = String(r * 4 + c + 1);
 viz.screenText(cellLabel, cx + cellW / 2, cy + cellH / 2, viz.colors.text, 10, 'center');
}
}

 // Labels
 viz.screenText('\u03B4', midX, rectY - 8, viz.colors.orange, 12, 'center');
 viz.screenText('\u03B4', rectX - 12, rectY + delta, viz.colors.orange, 12, 'center');
 viz.screenText('2\u03B4', midX, rectY + rectH + 15, viz.colors.orange, 12, 'center');
 viz.screenText('PL', midX - delta / 2, rectY - 8, viz.colors.blue, 12, 'center');
 viz.screenText('PR', midX + delta / 2, rectY - 8, viz.colors.teal, 12, 'center');

 // Explanation
 var textY = rectY + rectH + 40;
 viz.screenText('Each cell has size \u03B4/2 x \u03B4/2', 350, textY, viz.colors.text, 12, 'center');
 viz.screenText('Diagonal of cell = \u03B4/\u221A2 <\u03B4, so at most 1 point per cell', 350, textY + 20, viz.colors.text, 12, 'center');
 viz.screenText('16 cells total => at most 8 points in rectangle (excluding query point)', 350, textY + 40, viz.colors.text, 12, 'center');
 viz.screenText('=> each point checks at most 7 neighbors!', 350, textY + 60, viz.colors.green, 13, 'center');
}

 draw();

 VizEngine.createSlider(controls, '\u03B4 size', 50, 120, delta, 5, function(v) {
 delta = Math.round(v);
 draw();
});

 return viz;
}
}
],
 exercises: [
 {
 question: 'what algorithm need by \\(y\\) sorting?if not sorting, worst-case is what?',
 hint: 'if not sorting, each may need and all its he compare. ',
 solution: 'by \\(y\\) sorting guarantee I only check each (7). if not sorting, may need and all compare, have \\(O(n)\\), merge step \\(O(n^2)\\), \\(O(n^2)\\). '
},
 {
 question: 'algorithm time complexity recurrence \\(T(n) = 2T(n/2) + O(n \\log n)\\)(because sorting). to \\(T(n) = 2T(n/2) + O(n)\\)?',
 hint: 'can sorting, or in recursive sorting subarray. ',
 solution: 'by \\(y\\) sorting times. in recursive, merge Merge Sort \\(O(n)\\) merge two by \\(y\\) subset. this way each level only \\(O(n)\\), recurrence \\(T(n) = 2T(n/2) + O(n)\\), \\(O(n \\log n)\\). '
},
 {
 question: 'algorithm to. its time complexity. ',
 hint: 'partition use,. each need check how many?',
 solution: 'in, by (\\(x\\))partition. \\(2\\delta\\) (slab). in \\(\\delta \\times \\delta \\times 2\\delta\\) partition \\(\\delta/2\\) edge, \\(2 \\times 2 \\times 4 = 16\\), each at most. therefore each check. recurrence \\(T(n) = 2T(n/2) + O(n \\log n)\\)(or \\(O(n)\\) if sorting), \\(O(n \\log^2 n)\\) or \\(O(n \\log n)\\). '
},
 {
 question: 'if need distance, can otherwise use divide-and-conquer?',
 hint: 'in. ',
 solution: 'not can use divide-and-conquer(because may any). can use \\(O(n \\log n)\\) compute, then use (Rotating Calipers)method in \\(O(n)\\) find. \\(O(n \\log n)\\). '
},
 {
 question: 'proof: problem compare algorithm need \\(\\Omega(n \\log n)\\). ',
 hint: 'from element problem(Element Distinctness). ',
 solution: 'given array \\(A[1.n]\\), \\(\\{(A[i], 0): 1 \\leq i \\leq n\\}\\). this distance 0 when and only when array there exists element. element lower bound \\(\\Omega(n \\log n)\\), therefore problem lower bound also is \\(\\Omega(n \\log n)\\). '
}
]
}
]
});
