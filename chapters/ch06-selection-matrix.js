// Chapter 6: select and Matrix Multiplication -- Selection, Matrix Multiplication & FFT
window.CHAPTERS.push({
 id: 'ch06',
 number: 6,
 title: 'Selection & Matrix Multiplication',
 subtitle: 'Selection, Matrix Multiplication & FFT',
 sections: [
 // ── Section 1: Randomized Select ──
 {
 id: 'ch06-sec01',
 title: 'Randomized Selection Algorithm',
 content: `<h2>Randomized Selection algorithm</h2>
<div class="env-block bridge"><div class="env-title">Chapter Overview</div><div class="env-body"><p>Chapter 5's Quicksort partitions an array to sort it. But what if we only need to find the \(k\)-th smallest element? The selection problem needs less work than sorting, and divide-and-conquer provides linear-time solutions. This chapter also showcases two more triumphs of divide-and-conquer beyond sorting: Strassen's matrix multiplication and the Fast Fourier Transform.</p></div></div>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>We begin with QuickSelect, the randomized sibling of Quicksort. By recursing on only one side of the partition, QuickSelect finds the \(k\)-th smallest element in expected \(O(n)\) time. The analysis mirrors Quicksort's, but with a key twist.</p></div></div>

<p><strong>selection problem(Selection Problem)</strong>: given array \\(A[1.n]\\) \\(k\\)(\\(1 \\leq k \\leq n\\)), \\(k\\) element. </p>

<div class="env-block definition"><div class="env-title">Definition (Order Statistics)</div><div class="env-body">
<p> \\(k\\) element again \\(k\\) <strong>count </strong>(\\(k\\)-th order statistic). in particular: </p>
<p>- \\(k = 1\\): minimum value</p>
<p>- \\(k = n\\): maximum value</p>
<p>- \\(k = \\lfloor (n+1)/2 \\rfloor\\): </p>
</div></div>

<p>method: sorting again \\(k\\), \\(O(n \\log n)\\). I can do more. </p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Randomized Select / QuickSelect)</div><div class="env-body">
<p><strong>RandomizedSelect(A, lo, hi, k):</strong></p>
<p>1. if \\(lo = hi\\), \\(A[lo]\\)</p>
<p>2. \\(p = \\text{RandomizedPartition}(A, lo, hi)\\)</p>
<p>3. let \\(q = p - lo + 1\\)(pivot in subarray)</p>
<p>4. if \\(k = q\\): \\(A[p]\\)</p>
<p>5. if \\(k <q\\): RandomizedSelect(A, lo, p-1, k)</p>
<p>6. otherwise then: RandomizedSelect(A, p+1, hi, k-q)</p>
</div></div>

<div class="viz-placeholder" data-viz="ch06-viz-quickselect"></div>

<div class="env-block theorem"><div class="env-title">Theorem</div><div class="env-body">
<p>RandomizedSelect expected time \\(O(n)\\). worst-case \\(O(n^2)\\). </p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof Sketch</div><div class="env-body">
<p> \\(T(n)\\) expected running time. Partition \\(O(n)\\), only recursive. if pivot random distribution in \\([1, n]\\), then: </p>
$$E[T(n)] \\leq \\frac{1}{n} \\sum_{q=1}^{n} T(\\max(q-1, n-q)) + O(n) \\leq \\frac{2}{n} \\sum_{k=n/2}^{n-1} T(k) + O(n)$$
<p>use \\(E[T(n)] = O(n)\\).: each times 3/4, \\(n + 3n/4 + 9n/16 + \\cdots = O(n)\\)(). </p>
<p class="qed">∎</p>
</div></div>`,
 visualizations: [
 {
 id: 'ch06-viz-quickselect',
 title: 'QuickSelect Demonstration',
 description: 'Randomized Selection procedure',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 400});
 var arr = [7, 3, 9, 1, 5, 8, 2, 6, 4];
 var k = 5;
 var steps = [];
 var stepIdx = 0;

 function recordSelect(a, lo, hi, target) {
 steps = [];
 var b = a.slice();
 function sel(arr2, lo2, hi2, k2) {
 if (lo2 === hi2) {
 steps.push({arr: arr2.slice(), lo: lo2, hi: hi2, pivot: -1, pivotIdx: lo2, k: k2, msg: 'Found: A[' + lo2 + '] = ' + arr2[lo2]});
 return;
}
 var r = lo2 + Math.floor(Math.random() * (hi2 - lo2 + 1));
 var tmp = arr2[r]; arr2[r] = arr2[hi2]; arr2[hi2] = tmp;
 var pivot = arr2[hi2];
 var i = lo2 - 1;
 for (var j = lo2; j <hi2; j++) {
 if (arr2[j] <= pivot) {
 i++;
 var t = arr2[i]; arr2[i] = arr2[j]; arr2[j] = t;
}
}
 var t2 = arr2[i + 1]; arr2[i + 1] = arr2[hi2]; arr2[hi2] = t2;
 var p = i + 1;
 var q = p - lo2 + 1;
 steps.push({arr: arr2.slice(), lo: lo2, hi: hi2, pivot: pivot, pivotIdx: p, k: k2, msg: 'Pivot=' + pivot + ' at pos ' + p + ', rank=' + q + ' in range, looking for k=' + k2});
 if (k2 === q) {
 steps.push({arr: arr2.slice(), lo: lo2, hi: hi2, pivot: pivot, pivotIdx: p, k: k2, msg: 'Found! k=' + k2 + ', element = ' + pivot});
} else if (k2 <q) {
 sel(arr2, lo2, p - 1, k2);
} else {
 sel(arr2, p + 1, hi2, k2 - q);
}
}
 sel(b, lo, hi, target);
}

 recordSelect(arr, 0, arr.length - 1, k);

 function draw() {
 viz.clear();
 var n = arr.length;
 viz.screenText('QuickSelect: Find k-th smallest (k=' + k + ')', 350, 18, viz.colors.white, 15, 'center');

 var step = stepIdx <steps.length? steps[stepIdx]: steps[steps.length - 1];
 var cellW = 55, cellH = 40;
 var startX = (700 - n * cellW) / 2;

 var colors = [];
 var highlights = [];
 for (var i = 0; i <n; i++) {
 colors.push(viz.colors.bg);
 highlights.push(null);
 if (i>= step.lo && i <= step.hi) {
 colors[i] = '#1a2a3a';
} else {
 colors[i] = '#0a0a1a';
}
}
 if (step.pivotIdx>= 0 && step.pivotIdx <n) highlights[step.pivotIdx] = viz.colors.orange;

 viz.drawArray(step.arr, startX, 55, cellW, cellH, colors, highlights);

 // Draw pointers for lo and hi
 if (step.lo <= step.hi) {
 viz.drawPointer(startX + step.lo * cellW + cellW / 2, 50, 'lo', viz.colors.green);
 viz.drawPointer(startX + step.hi * cellW + cellW / 2, 50, 'hi', viz.colors.red);
}

 viz.screenText(step.msg, 350, 130, viz.colors.yellow, 12, 'center');

 // Bar chart
 var barW = 40;
 var maxH = 150;
 var barStartX = (700 - n * (barW + 6)) / 2;
 var barStartY = 340;
 var maxVal = Math.max.apply(null, step.arr);
 for (var bi = 0; bi <n; bi++) {
 var h = (step.arr[bi] / maxVal) * maxH;
 var px = barStartX + bi * (barW + 6);
 var py = barStartY - h;
 var barCol = viz.colors.blue;
 if (bi <step.lo || bi> step.hi) barCol = viz.colors.axis;
 if (bi === step.pivotIdx) barCol = viz.colors.orange;
 viz.ctx.fillStyle = barCol;
 viz.ctx.fillRect(px, py, barW, h);
 viz.screenText(String(step.arr[bi]), px + barW / 2, py - 8, viz.colors.white, 10, 'center');
}

 viz.screenText('Step ' + (stepIdx + 1) + '/' + steps.length, 350, 370, viz.colors.text, 11, 'center');
 viz.screenText('Orange = pivot | Active range highlighted', 350, 390, viz.colors.text, 10, 'center');
}

 draw();

 VizEngine.createButton(controls, 'Prev', function() {
 if (stepIdx> 0) {stepIdx--; draw();}
});
 VizEngine.createButton(controls, 'Next', function() {
 if (stepIdx <steps.length - 1) {stepIdx++; draw();}
});
 VizEngine.createButton(controls, 'Reset', function() {
 stepIdx = 0; draw();
});
 VizEngine.createButton(controls, 'New Array', function() {
 arr = [];
 for (var i = 0; i <9; i++) arr.push(Math.floor(Math.random() * 30) + 1);
 recordSelect(arr, 0, arr.length - 1, k);
 stepIdx = 0;
 draw();
});
 VizEngine.createSlider(controls, 'k', 1, arr.length, k, 1, function(v) {
 k = Math.round(v);
 recordSelect(arr, 0, arr.length - 1, k);
 stepIdx = 0;
 draw();
});

 return viz;
}
}
],
 exercises: [
 {
 question: 'array \\([12, 3, 5, 7, 19, 4, 26, 8]\\), use QuickSelect 4 element(assume times pivot 8). Partition array recursive use. ',
 hint: 'Partition pivot 8 in index 5. k=4 <6, so in edge continue. ',
 solution: 'Partition with pivot=8: less than equals 8 have 3,5,7,4,8, greater than have 12,19,26. array [3,5,7,4,8,12,19,26], pivot in index 4. q=5. k=4 <5, so in A[0.3]=[3,5,7,4] 4. continue in this subarray execute QuickSelect. 7. '
},
 {
 question: 'QuickSelect and QuickSort is what?what QuickSelect is \\(O(n)\\) QuickSort is \\(O(n \\log n)\\)?',
 hint: 'QuickSelect each times only recursive. ',
 solution: 'QuickSort recursive subarray, each level \\(O(n)\\), \\(O(\\log n)\\) level. QuickSelect only recursive, \\(n + n/2 + n/4 + \\cdots = O(n)\\)(to \\(2n\\)). key in QuickSelect not contain that. '
},
 {
 question: 'use QuickSelect in \\(O(n)\\) find array, then use it array?',
 hint: 'QuickSelect, array already. ',
 solution: 'use QuickSelect(A, 0, n-1, n/2) find m. execute, A n/2 element <= m, n/2 element>= m(sorting). this already array. O(n). '
}
]
},

 // ── Section 2: Median of Medians ──
 {
 id: 'ch06-sec02',
 title: 'Median of Medians Algorithm',
 content: `<h2>Median of Medians algorithm</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Can we guarantee \(O(n)\) worst-case selection without randomization? The Median of Medians algorithm achieves this through a clever pivot selection strategy that guarantees a good enough partition at every step.</p></div></div>

<p>Randomized Selection algorithm expected time \\(O(n)\\), worst-case is \\(O(n^2)\\). <strong>Median of Medians</strong>(Median of Medians, MoM)algorithm guarantee \\(O(n)\\) worst-case. </p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Median of Medians / BFPRT)</div><div class="env-body">
<p><strong>DeterministicSelect(A, k):</strong></p>
<p>1. \\(A\\) \\(\\lceil n/5 \\rceil\\) group, each group 5 element(finally group may not)</p>
<p>2. each group sorting, obtain array \\(M\\)</p>
<p>3. recursive use DeterministicSelect(\\(M\\), \\(|M|/2\\)) find \\(M\\) \\(x\\)</p>
<p>4. \\(x\\) pivot \\(A\\) </p>
<p>5. by \\(k\\) and \\(x\\), recursive to corresponding subarray</p>
</div></div>

<div class="viz-placeholder" data-viz="ch06-viz-mom"></div>

<div class="env-block theorem"><div class="env-title">Theorem (BFPRT, 1973)</div><div class="env-body">
<p>Median of Medians algorithm guarantee at least have \\(3n/10 - 6\\) element pivot, at least have \\(3n/10 - 6\\) element pivot. therefore have \\(7n/10 + 6\\) element. </p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p>\\(n/5\\) group, at least have group \\(\\leq x\\)(because \\(x\\) is Median of Medians), at least \\(\\lceil n/10 \\rceil\\) group. this group each group at least have 3 element \\(\\leq x\\)(its two). </p>
<p>therefore at least have \\(3 \\lceil n/10 \\rceil \\geq 3n/10 - 6\\) element \\(\\leq x\\)., at least \\(3n/10 - 6\\) element \\(\\geq x\\). </p>
<p>recurrence: \\(T(n) \\leq T(n/5) + T(7n/10) + O(n)\\). since \\(1/5 + 7/10 = 9/10 <1\\), use \\(T(n) = O(n)\\). </p>
<p class="qed">∎</p>
</div></div>

<div class="env-block warning"><div class="env-title">Warning</div><div class="env-body">
<p>what 5 group not is 3 group?if 3 group: \\(T(n) \\leq T(n/3) + T(2n/3) + O(n)\\), at this point \\(1/3 + 2/3 = 1\\), recurrence solution \\(O(n \\log n)\\), not is! 7, 9 group also can, 5 is algorithm minimum group size. </p>
</div></div>`,
 visualizations: [
 {
 id: 'ch06-viz-mom',
 title: 'Median of Medians Visualization',
 description: 'group, Median of Medians procedure',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var arr = [12, 3, 18, 7, 22, 5, 15, 9, 1, 25, 11, 4, 20, 8, 16, 6, 23, 14, 2, 19];
 var groupSize = 5;

 function draw() {
 viz.clear();
 var n = arr.length;
 viz.screenText('Median of Medians (groups of ' + groupSize + ')', 350, 18, viz.colors.white, 15, 'center');

 var numGroups = Math.ceil(n / groupSize);
 var cellW = 30, cellH = 28;
 var groupGap = 15;
 var totalW = numGroups * (groupSize * cellW + groupGap) - groupGap;
 var startX = Math.max(10, (700 - totalW) / 2);

 // Step 1: Show groups
 viz.screenText('Step 1: Divide into groups of ' + groupSize, 350, 42, viz.colors.orange, 12, 'center');

 var medians = [];
 for (var g = 0; g <numGroups; g++) {
 var groupStart = g * groupSize;
 var groupEnd = Math.min(groupStart + groupSize, n);
 var group = arr.slice(groupStart, groupEnd);
 var sorted = group.slice().sort(function(a, b) {return a - b;});
 var medIdx = Math.floor((sorted.length - 1) / 2);
 var med = sorted[medIdx];
 medians.push(med);

 var gx = startX + g * (groupSize * cellW + groupGap);
 // Draw group box
 viz.ctx.strokeStyle = viz.colors.axis;
 viz.ctx.lineWidth = 1;
 viz.ctx.strokeRect(gx - 2, 55, group.length * cellW + 4, cellH + 4);
 viz.screenText('G' + (g + 1), gx + group.length * cellW / 2, 53, viz.colors.text, 9, 'center', 'bottom');

 for (var i = 0; i <group.length; i++) {
 var col = group[i] === med? viz.colors.orange: viz.colors.bg;
 viz.drawArrayCell(gx + i * cellW, 57, cellW, cellH, group[i], col, viz.colors.white);
}

 // Show sorted group below
 for (var j = 0; j <sorted.length; j++) {
 var col2 = j === medIdx? viz.colors.orange: '#1a1a40';
 viz.drawArrayCell(gx + j * cellW, 105, cellW, cellH, sorted[j], col2, viz.colors.white);
}
}

 viz.screenText('Step 2: Sort each group, find medians (orange)', 350, 98, viz.colors.teal, 12, 'center');

 // Step 3: Show medians array
 viz.screenText('Step 3: Medians array:', 100, 160, viz.colors.yellow, 12, 'left');
 var medStartX = (700 - medians.length * 40) / 2;
 var sortedMedians = medians.slice().sort(function(a, b) {return a - b;});
 var momIdx = Math.floor((sortedMedians.length - 1) / 2);
 var mom = sortedMedians[momIdx];

 for (var mi = 0; mi <medians.length; mi++) {
 var mCol = medians[mi] === mom? viz.colors.red: viz.colors.orange + '88';
 viz.drawArrayCell(medStartX + mi * 40, 175, 40, cellH, medians[mi], mCol, viz.colors.white);
}

 viz.screenText('Step 4: Median of medians (MoM) = ' + mom, 350, 225, viz.colors.red, 13, 'center');

 // Show partition result
 var less = [], equal = [], greater = [];
 for (var pi = 0; pi <n; pi++) {
 if (arr[pi] <mom) less.push(arr[pi]);
 else if (arr[pi] === mom) equal.push(arr[pi]);
 else greater.push(arr[pi]);
}

 var secY = 260;
 viz.screenText('Step 5: Partition around MoM = ' + mom, 350, secY, viz.colors.green, 12, 'center');
 secY += 20;

 // Less
 viz.screenText('<' + mom + ' (' + less.length + '):', 20, secY + 14, viz.colors.blue, 11, 'left');
 for (var li = 0; li <less.length; li++) {
 viz.drawArrayCell(120 + li * 32, secY, 32, 28, less[li], viz.colors.blue + '44', viz.colors.white);
}

 secY += 35;
 viz.screenText('= ' + mom + ' (' + equal.length + '):', 20, secY + 14, viz.colors.red, 11, 'left');
 for (var ei = 0; ei <equal.length; ei++) {
 viz.drawArrayCell(120 + ei * 32, secY, 32, 28, equal[ei], viz.colors.red + '44', viz.colors.white);
}

 secY += 35;
 viz.screenText('> ' + mom + ' (' + greater.length + '):', 20, secY + 14, viz.colors.purple, 11, 'left');
 for (var gi = 0; gi <greater.length; gi++) {
 viz.drawArrayCell(120 + gi * 32, secY, 32, 28, greater[gi], viz.colors.purple + '44', viz.colors.white);
}

 secY += 40;
 viz.screenText('Guarantee: each side has at most 7n/10 + 6 = ' + Math.ceil(7 * n / 10 + 6) + ' elements', 350, secY, viz.colors.green, 11, 'center');
}

 draw();

 VizEngine.createButton(controls, 'New Array', function() {
 arr = [];
 for (var i = 0; i <20; i++) arr.push(Math.floor(Math.random() * 50) + 1);
 draw();
});

 return viz;
}
}
],
 exercises: [
 {
 question: 'array \\([10, 3, 7, 15, 1, 8, 12, 4, 9, 6]\\), use Median of Medians pivot. group size 5. ',
 hint: 'group [10,3,7,15,1], group [8,12,4,9,6]. ',
 solution: 'group sorting [1,3,7,10,15], = 7. group sorting [4,6,8,9,12], = 8. array [7,8], its = 7. so MoM pivot = 7. <7: [3,1,4,6], = 7: [7],> 7: [10,15,8,12,9]. '
},
 {
 question: 'what Median of Medians group size 3 not row group size 5 can?recurrence. ',
 hint: ' 3 group, guarantee is how many?',
 solution: ' 3 group: at least have \\(\\lceil n/6 \\rceil\\) group \\(\\leq x\\), each group 2 element \\(\\leq x\\). \\(2n/6 = n/3\\), \\(2n/3\\). recurrence \\(T(n) = T(n/3) + T(2n/3) + O(n)\\). solution \\(O(n \\log n)\\), not is. 5 group: \\(3n/10\\), \\(7n/10\\). recurrence \\(T(n) = T(n/5) + T(7n/10) + O(n)\\). \\(1/5 + 7/10 = 9/10 <1\\), solution \\(O(n)\\). '
},
 {
 question: ' Median of Medians is \\(O(n)\\), what use Randomized Selection MoM?',
 hint: 'compare. ',
 solution: 'MoM \\(O(n)\\), (\\(5n\\) number of comparisons). Randomized Selection expected number of comparisons \\(3.39n\\), and. MoM need group, sorting group, recursive Median of Medians,. Randomized Selection always more, and \\(O(n^2)\\) worst-case probability. MoM need in need -- it proof select is may. '
}
]
},

 // ── Section 3: Strassen's Algorithm ──
 {
 id: 'ch06-sec03',
 title: 'Strassen Matrix Multiplication',
 content: `<h2>Strassen Matrix Multiplication</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Divide-and-conquer is not limited to one-dimensional problems. Strassen's algorithm multiplies \(n \times n\) matrices in \(O(n^{2.807})\) time, beating the naive \(O(n^3)\) by reducing 8 recursive multiplications to 7. The saving comes from clever algebraic identities.</p></div></div>

<p>two \\(n \\times n\\) need \\(O(n^3)\\). <strong>Strassen algorithm</strong>(1969)through decrease recursive times, \\(O(n^{\\log_2 7}) \\approx O(n^{2.807})\\). </p>

<h3>Matrix Multiplication</h3>
<p> \\(n \\times n\\) \\(n/2 \\times n/2\\): </p>
$$\\begin{pmatrix} A_{11} & A_{12} \\\\ A_{21} & A_{22} \\end{pmatrix} \\cdot \\begin{pmatrix} B_{11} & B_{12} \\\\ B_{21} & B_{22} \\end{pmatrix} = \\begin{pmatrix} C_{11} & C_{12} \\\\ C_{21} & C_{22} \\end{pmatrix}$$
<p>method need <strong>8 times</strong>Matrix Multiplication: \\(T(n) = 8T(n/2) + O(n^2) = O(n^3)\\). </p>

<h3>Strassen key </h3>
<p>Strassen only <strong>7 times</strong>(is more): </p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Strassen)</div><div class="env-body">
<p>define 7: </p>
<p>\\(M_1 = (A_{11} + A_{22})(B_{11} + B_{22})\\)</p>
<p>\\(M_2 = (A_{21} + A_{22})B_{11}\\)</p>
<p>\\(M_3 = A_{11}(B_{12} - B_{22})\\)</p>
<p>\\(M_4 = A_{22}(B_{21} - B_{11})\\)</p>
<p>\\(M_5 = (A_{11} + A_{12})B_{22}\\)</p>
<p>\\(M_6 = (A_{21} - A_{11})(B_{11} + B_{12})\\)</p>
<p>\\(M_7 = (A_{12} - A_{22})(B_{21} + B_{22})\\)</p>
<p>then: </p>
<p>\\(C_{11} = M_1 + M_4 - M_5 + M_7\\)</p>
<p>\\(C_{12} = M_3 + M_5\\)</p>
<p>\\(C_{21} = M_2 + M_4\\)</p>
<p>\\(C_{22} = M_1 - M_2 + M_3 + M_6\\)</p>
</div></div>

<div class="viz-placeholder" data-viz="ch06-viz-strassen"></div>

<div class="env-block theorem"><div class="env-title">Theorem</div><div class="env-body">
<p>Strassen algorithm time complexity \\(T(n) = 7T(n/2) + O(n^2) = O(n^{\\log_2 7}) \\approx O(n^{2.807})\\). </p>
</div></div>

<div class="env-block intuition"><div class="env-title">Intuition</div><div class="env-body">
<p>use. is \\(O(n^2)\\), in recurrence is term. 8 times 7 times, only 1 times, in recursive: \\(8^{\\log_2 n} = n^3\\) \\(7^{\\log_2 n} = n^{\\log_2 7} \\approx n^{2.807}\\). </p>
</div></div>`,
 visualizations: [
 {
 id: 'ch06-viz-strassen',
 title: 'Strassen Block Visualization',
 description: 'block 7 times ',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var showFormula = 0;

 function draw() {
 viz.clear();
 viz.screenText('Strassen Matrix Multiplication', 350, 18, viz.colors.white, 15, 'center');

 var matS = 80;
 var cellS = matS / 2;

 // Matrix A
 var ax = 50, ay = 60;
 viz.screenText('A', ax + matS / 2, ay - 10, viz.colors.blue, 14, 'center');
 var aColors = [
 [viz.colors.blue + '33', viz.colors.teal + '33'],
 [viz.colors.orange + '33', viz.colors.purple + '33']
];
 var aLabels = [['A11', 'A12'], ['A21', 'A22']];
 for (var r = 0; r <2; r++) {
 for (var c = 0; c <2; c++) {
 viz.drawArrayCell(ax + c * cellS, ay + r * cellS, cellS, cellS, aLabels[r][c], aColors[r][c], viz.colors.white);
}
}

 // Times sign
 viz.screenText('\u00D7', ax + matS + 20, ay + matS / 2, viz.colors.white, 20, 'center');

 // Matrix B
 var bx = ax + matS + 45, by = ay;
 viz.screenText('B', bx + matS / 2, by - 10, viz.colors.green, 14, 'center');
 var bColors = [
 [viz.colors.green + '33', viz.colors.yellow + '33'],
 [viz.colors.red + '33', viz.colors.pink + '33']
];
 var bLabels = [['B11', 'B12'], ['B21', 'B22']];
 for (var r2 = 0; r2 <2; r2++) {
 for (var c2 = 0; c2 <2; c2++) {
 viz.drawArrayCell(bx + c2 * cellS, by + r2 * cellS, cellS, cellS, bLabels[r2][c2], bColors[r2][c2], viz.colors.white);
}
}

 // Equals sign
 viz.screenText('=', bx + matS + 20, ay + matS / 2, viz.colors.white, 20, 'center');

 // Matrix C
 var cx = bx + matS + 40, cy = ay;
 viz.screenText('C', cx + matS / 2, cy - 10, viz.colors.orange, 14, 'center');
 var cLabels = [['C11', 'C12'], ['C21', 'C22']];
 for (var r3 = 0; r3 <2; r3++) {
 for (var c3 = 0; c3 <2; c3++) {
 viz.drawArrayCell(cx + c3 * cellS, cy + r3 * cellS, cellS, cellS, cLabels[r3][c3], viz.colors.orange + '33', viz.colors.white);
}
}

 // Show 7 multiplications
 var formulas = [
 {label: 'M1', formula: '(A11+A22)(B11+B22)', color: viz.colors.blue},
 {label: 'M2', formula: '(A21+A22)(B11)', color: viz.colors.teal},
 {label: 'M3', formula: '(A11)(B12-B22)', color: viz.colors.green},
 {label: 'M4', formula: '(A22)(B21-B11)', color: viz.colors.orange},
 {label: 'M5', formula: '(A11+A12)(B22)', color: viz.colors.purple},
 {label: 'M6', formula: '(A21-A11)(B11+B12)', color: viz.colors.red},
 {label: 'M7', formula: '(A12-A22)(B21+B22)', color: viz.colors.yellow}
];

 viz.screenText('7 Multiplications (instead of 8):', 350, 170, viz.colors.white, 13, 'center');

 var col1X = 60, col2X = 380;
 for (var fi = 0; fi <formulas.length; fi++) {
 var fx = fi <4? col1X: col2X;
 var fy = 195 + (fi % 4) * 22;
 viz.screenText(formulas[fi].label + ' = ' + formulas[fi].formula, fx, fy, formulas[fi].color, 12, 'left');
}

 // Result formulas
 var resY = 295;
 viz.screenText('Result:', 60, resY, viz.colors.white, 13, 'left');
 var results = [
 'C11 = M1 + M4 - M5 + M7',
 'C12 = M3 + M5',
 'C21 = M2 + M4',
 'C22 = M1 - M2 + M3 + M6'
];
 for (var ri = 0; ri <results.length; ri++) {
 viz.screenText(results[ri], 60 + (ri % 2) * 330, resY + 22 + Math.floor(ri / 2) * 22, viz.colors.yellow, 12, 'left');
}

 // Complexity comparison
 viz.screenText('Standard: 8 multiplications => T(n) = 8T(n/2) + O(n^2) = O(n^3)', 350, 370, viz.colors.red, 12, 'center');
 viz.screenText('Strassen: 7 multiplications => T(n) = 7T(n/2) + O(n^2) = O(n^2.807)', 350, 392, viz.colors.green, 12, 'center');
}

 draw();

 return viz;
}
}
],
 exercises: [
 {
 question: ' Strassen \\(C_{11} = M_1 + M_4 - M_5 + M_7\\) equals \\(A_{11}B_{11} + A_{12}B_{21}\\). ',
 hint: ' \\(M_1, M_4, M_5, M_7\\) define. ',
 solution: '\\(M_1 = A_{11}B_{11} + A_{11}B_{22} + A_{22}B_{11} + A_{22}B_{22}\\). \\(M_4 = A_{22}B_{21} - A_{22}B_{11}\\). \\(M_5 = A_{11}B_{22} + A_{12}B_{22}\\). \\(M_7 = A_{12}B_{21} + A_{12}B_{22} - A_{22}B_{21} - A_{22}B_{22}\\).: \\(M_1 + M_4 - M_5 + M_7 = A_{11}B_{11} + A_{11}B_{22} + A_{22}B_{11} + A_{22}B_{22} + A_{22}B_{21} - A_{22}B_{11} - A_{11}B_{22} - A_{12}B_{22} + A_{12}B_{21} + A_{12}B_{22} - A_{22}B_{21} - A_{22}B_{22} = A_{11}B_{11} + A_{12}B_{21}\\). correct!'
},
 {
 question: 'if have only 6 times Matrix Multiplication can complete \\(2 \\times 2\\) Matrix Multiplication, its recursive algorithm is what?',
 hint: '\\(T(n) = 6T(n/2) + O(n^2)\\). ',
 solution: '\\(T(n) = 6T(n/2) + O(n^2)\\). \\(\\log_2 6 \\approx 2.585\\). Master Theorem Case 1(\\(n^{\\log_2 6} \\gg n^2\\)), \\(T(n) = O(n^{\\log_2 6}) \\approx O(n^{2.585})\\). '
},
 {
 question: 'when known Matrix Multiplication is what?Strassen in?',
 hint: ' \\(\\omega\\)(Matrix Multiplication)result. ',
 solution: 'when result \\(O(n^{2.371552})\\)(Williams 2024). Strassen in it times proof Matrix Multiplication can \\(O(n^3)\\) "", Matrix Multiplication., since, \\(\\omega <2.373\\) algorithm only in \\(n\\) Strassen. Strassen in \\(n> 100\\) start algorithm. '
},
 {
 question: 'Strassen algorithm in have what?what not always use it?',
 hint: 'value,. ',
 solution: '(1) value:. (2) not:. (3), not algorithm. (4) only use (need). (5) 18 times vs 4 times. usually in \\(n> 100{\\sim}1000\\) use Strassen, more use or BLAS algorithm. '
}
]
},

 // ── Section 4: FFT Introduction ──
 {
 id: 'ch06-sec04',
 title: 'Fast Fourier Transform',
 content: `<h2>Fast Fourier Transform (FFT)</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>The Fast Fourier Transform (FFT) is arguably the most important algorithm of the 20th century. It evaluates a polynomial at \(n\) special points in \(O(n \log n)\) time by exploiting the symmetry of complex roots of unity, a divide-and-conquer masterpiece.</p></div></div>

<p><strong>Fast Fourier Transform</strong>(Fast Fourier Transform, FFT)is divide and conquer use. it (DFT)compute from \\(O(n^2)\\) to \\(O(n \\log n)\\). </p>

<div class="env-block definition"><div class="env-title">Definition (DFT)</div><div class="env-body">
<p>given column \\(a = (a_0, a_1, \\ldots, a_{n-1})\\)(\\(n\\) 2), its DFT \\(\\hat{a} = (\\hat{a}_0, \\hat{a}_1, \\ldots, \\hat{a}_{n-1})\\): </p>
$$\\hat{a}_k = \\sum_{j=0}^{n-1} a_j \\omega_n^{jk}, \\quad k = 0, 1, \\ldots, n-1$$
<p>its \\(\\omega_n = e^{2\\pi i/n}\\) is \\(n\\) times. </p>
</div></div>

<p>FFT is<strong>divide and conquer</strong>: DFT by two \\(n/2\\) size subproblem. </p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Cooley-Tukey FFT)</div><div class="env-body">
<p><strong>FFT(a, n):</strong></p>
<p>1. if \\(n = 1\\), \\(a\\)</p>
<p>2. \\(a_{\\text{even}} = (a_0, a_2, \\ldots, a_{n-2})\\)</p>
<p>3. \\(a_{\\text{odd}} = (a_1, a_3, \\ldots, a_{n-1})\\)</p>
<p>4. \\(\\hat{y}_{\\text{even}} = \\text{FFT}(a_{\\text{even}}, n/2)\\)</p>
<p>5. \\(\\hat{y}_{\\text{odd}} = \\text{FFT}(a_{\\text{odd}}, n/2)\\)</p>
<p>6. For \\(k = 0\\) to \\(n/2 - 1\\): </p>
<p>&emsp; \\(\\hat{a}_k = \\hat{y}_{\\text{even},k} + \\omega_n^k \\hat{y}_{\\text{odd},k}\\)</p>
<p>&emsp; \\(\\hat{a}_{k+n/2} = \\hat{y}_{\\text{even},k} - \\omega_n^k \\hat{y}_{\\text{odd},k}\\)</p>
</div></div>

<div class="viz-placeholder" data-viz="ch06-viz-butterfly"></div>

<div class="env-block theorem"><div class="env-title">Theorem</div><div class="env-body">
<p>FFT compute DFT time complexity \\(O(n \\log n)\\). </p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p>recurrence \\(T(n) = 2T(n/2) + O(n)\\), Master Theorem \\(T(n) = O(n \\log n)\\). </p>
<p>step 6 correctness (butterfly operation): use \\(\\omega_n^{k+n/2} = -\\omega_n^k\\), times times two output. </p>
<p class="qed">∎</p>
</div></div>`,
 visualizations: [
 {
 id: 'ch06-viz-butterfly',
 title: 'FFT Butterfly Diagram',
 description: ' FFT ',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var nBits = 3; // n = 8

 function bitReverse(x, bits) {
 var result = 0;
 for (var i = 0; i <bits; i++) {
 result = (result <<1) | (x & 1);
 x>>= 1;
}
 return result;
}

 function draw() {
 viz.clear();
 var n = Math.pow(2, nBits);
 var stages = nBits;

 viz.screenText('FFT Butterfly Diagram (n=' + n + ')', 350, 18, viz.colors.white, 15, 'center');

 var gapX = 600 / (stages + 1);
 var gapY = 340 / n;
 var startX = 70;
 var startY = 55;

 // Bit-reversal permutation
 var order = [];
 for (var i = 0; i <n; i++) order.push(bitReverse(i, nBits));

 // Input labels (bit-reversed order)
 for (var i2 = 0; i2 <n; i2++) {
 var y = startY + i2 * gapY;
 viz.screenText('a[' + order[i2] + ']', startX - 35, y, viz.colors.text, 11, 'right');
 viz.ctx.fillStyle = viz.colors.blue;
 viz.ctx.beginPath();
 viz.ctx.arc(startX, y, 4, 0, Math.PI * 2);
 viz.ctx.fill();
}

 // Draw stages
 for (var s = 0; s <stages; s++) {
 var x1 = startX + s * gapX;
 var x2 = startX + (s + 1) * gapX;
 var blockSize = Math.pow(2, s + 1);
 var halfBlock = blockSize / 2;

 viz.screenText('Stage ' + (s + 1), (x1 + x2) / 2, startY - 15, viz.colors.orange, 11, 'center');

 for (var b = 0; b <n; b += blockSize) {
 for (var k = 0; k <halfBlock; k++) {
 var topIdx = b + k;
 var botIdx = b + k + halfBlock;
 var y1 = startY + topIdx * gapY;
 var y2 = startY + botIdx * gapY;

 // Lines from input to output
 // Top: gets both inputs
 viz.ctx.strokeStyle = viz.colors.blue;
 viz.ctx.lineWidth = 1;
 viz.ctx.beginPath();
 viz.ctx.moveTo(x1, y1);
 viz.ctx.lineTo(x2, y1);
 viz.ctx.stroke();

 viz.ctx.strokeStyle = viz.colors.teal;
 viz.ctx.beginPath();
 viz.ctx.moveTo(x1, y2);
 viz.ctx.lineTo(x2, y1);
 viz.ctx.stroke();

 // Bottom: gets both inputs with -
 viz.ctx.strokeStyle = viz.colors.blue;
 viz.ctx.beginPath();
 viz.ctx.moveTo(x1, y1);
 viz.ctx.lineTo(x2, y2);
 viz.ctx.stroke();

 viz.ctx.strokeStyle = viz.colors.red;
 viz.ctx.beginPath();
 viz.ctx.moveTo(x1, y2);
 viz.ctx.lineTo(x2, y2);
 viz.ctx.stroke();

 // Nodes at output
 viz.ctx.fillStyle = viz.colors.blue;
 viz.ctx.beginPath();
 viz.ctx.arc(x2, y1, 4, 0, Math.PI * 2);
 viz.ctx.fill();
 viz.ctx.fillStyle = viz.colors.blue;
 viz.ctx.beginPath();
 viz.ctx.arc(x2, y2, 4, 0, Math.PI * 2);
 viz.ctx.fill();

 // Twiddle factor label
 if (k> 0 || halfBlock> 1) {
 var tw = k + '/' + blockSize;
 viz.screenText('\u03C9^' + tw, (x1 + x2) / 2, (y1 + y2) / 2, viz.colors.yellow, 8, 'center');
}
}
}
}

 // Output labels
 var outX = startX + stages * gapX;
 for (var o = 0; o <n; o++) {
 var oy = startY + o * gapY;
 viz.screenText('A[' + o + ']', outX + 25, oy, viz.colors.green, 11, 'left');
}

 viz.screenText('Blue = +, Red/Teal = \u00B1 with twiddle factor \u03C9^k', 350, startY + n * gapY + 15, viz.colors.text, 11, 'center');
 viz.screenText('Each stage: n/2 butterfly operations => O(n) per stage, O(n log n) total', 350, startY + n * gapY + 35, viz.colors.yellow, 11, 'center');
}

 draw();

 VizEngine.createSelect(controls, 'Size', [
 {value: '2', label: 'n = 4'},
 {value: '3', label: 'n = 8'},
 {value: '4', label: 'n = 16'}
], function(v) {
 nBits = parseInt(v);
 draw();
});

 return viz;
}
}
],
 exercises: [
 {
 question: ' \\(n = 4\\), DFT \\(F_4\\)(\\(\\hat{a} = F_4 \\cdot a\\) \\(F_4\\)). ',
 hint: '\\(F_4[j][k] = \\omega_4^{jk}\\), its \\(\\omega_4 = e^{2\\pi i / 4} = i\\). ',
 solution: '\\(\\omega_4 = i\\). \\(F_4 = \\begin{pmatrix} 1 & 1 & 1 & 1 \\\\ 1 & i & -1 & -i \\\\ 1 & -1 & 1 & -1 \\\\ 1 & -i & -1 & i \\end{pmatrix}\\). Matrix Multiplication need 16 times, FFT only 4 times(). '
},
 {
 question: 'what FFT need \\(n\\) is 2?if \\(n\\) not is 2 how?',
 hint: '(zero-padding). ',
 solution: 'because FFT divide and conquer column, need \\(n\\) is 2. if \\(n\\) not is 2, can to 2 (not result), or use Bluestein algorithm(chirp-z)any \\(n\\). FFT can \\(n = 2^a \\cdot 3^b \\cdot 5^c \\cdots\\). '
},
 {
 question: 'FFT (IFFT)and FFT have what?',
 hint: ' DFT \\(F_n\\). ',
 solution: 'IFFT \\(a_j = \\frac{1}{n} \\sum_{k=0}^{n-1} \\hat{a}_k \\omega_n^{-jk}\\). this and FFT same, only is \\(\\omega_n\\) replace \\(\\omega_n^{-1}\\)(), finally \\(n\\). therefore IFFT can use FFT, only in finally \\(1/n\\). '
}
]
},

 // ── Section 5: Polynomial Multiplication ──
 {
 id: 'ch06-sec05',
 title: 'Polynomial Multiplication',
 content: `<h2>term </h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>We close by showing how FFT enables \(O(n \log n)\) polynomial multiplication. The strategy, evaluate, pointwise multiply, interpolate, is a template that appears throughout scientific computing and signal processing.</p></div></div>

<p>FFT need use is<strong>term </strong>, two \\(n\\) times term from \\(O(n^2)\\) to \\(O(n \\log n)\\). </p>

<div class="env-block definition"><div class="env-title">Definition (Polynomial Multiplication)</div><div class="env-body">
<p>given term \\(A(x) = \\sum_{i=0}^{n-1} a_i x^i\\) \\(B(x) = \\sum_{j=0}^{n-1} b_j x^j\\), it: </p>
$$C(x) = A(x) \\cdot B(x) = \\sum_{k=0}^{2n-2} c_k x^k, \\quad c_k = \\sum_{i+j=k} a_i b_j$$
<p> \\(c_k\\) is \\(a\\) \\(b\\) (convolution). </p>
</div></div>

<p>compute need \\(O(n^2)\\) times. FFT method key: </p>

<div class="env-block theorem"><div class="env-title">Theorem (Convolution Theorem)</div><div class="env-body">
<p>in: \\(\\widehat{a * b} = \\hat{a} \\cdot \\hat{b}\\). </p>
</div></div>

<div class="env-block algorithm"><div class="env-title">Algorithm (FFT-based Polynomial Multiplication)</div><div class="env-body">
<p>1. \\(a\\) \\(b\\) to length \\(2n\\)(to 2)</p>
<p>2. \\(\\hat{a} = \\text{FFT}(a)\\), \\(\\hat{b} = \\text{FFT}(b)\\)</p>
<p>3. \\(\\hat{c}_k = \\hat{a}_k \\cdot \\hat{b}_k\\)()</p>
<p>4. \\(c = \\text{IFFT}(\\hat{c})\\)</p>
</div></div>

<div class="viz-placeholder" data-viz="ch06-viz-poly-mult"></div>

<div class="env-block example"><div class="env-title">Example (Big Integer Multiplication)</div><div class="env-body">
<p>can see term (10 or \\(2^{32}\\)). two \\(n\\) term. use FFT, can in \\(O(n \\log n)\\) complete(). this is Schonhage-Strassen algorithm. </p>
</div></div>

<div class="env-block intuition"><div class="env-title">Intuition</div><div class="env-body">
<p>term have denote: <strong>denote</strong><strong>value denote</strong>. in denote, need \\(O(n^2)\\). in value denote, only \\(O(n)\\)(). FFT in denote: </p>
<p> \\(\\xrightarrow{\\text{FFT} O(n\\log n)}\\) value \\(\\xrightarrow{\\text{} O(n)}\\) value \\(\\xrightarrow{\\text{IFFT} O(n\\log n)}\\) </p>
</div></div>
<div class="env-block bridge"><div class="env-title">Looking Ahead</div><div class="env-body"><p>Chapters 4 through 6 developed divide-and-conquer algorithms that sort, select, and multiply. But is \(O(n \log n)\) the best we can do for sorting? Chapter 7 proves that comparison-based sorting cannot beat \(\Omega(n \log n)\), then shows how to break that barrier by exploiting structure in the input.</p></div></div>`,
 visualizations: [
 {
 id: 'ch06-viz-poly-mult',
 title: 'Polynomial Multiplication Pipeline',
 description: 'FFT-based polynomial multiplication pipeline',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});

 // Example: A(x) = 1 + 2x + 3x^2, B(x) = 4 + 5x
 var polyA = [1, 2, 3, 0];
 var polyB = [4, 5, 0, 0];

 function naiveMultiply(a, b) {
 var n = a.length + b.length - 1;
 var c = [];
 for (var i = 0; i <n; i++) c.push(0);
 for (var i2 = 0; i2 <a.length; i2++) {
 for (var j = 0; j <b.length; j++) {
 c[i2 + j] += a[i2] * b[j];
}
}
 return c;
}

 function draw() {
 viz.clear();
 viz.screenText('FFT Polynomial Multiplication Pipeline', 350, 18, viz.colors.white, 15, 'center');

 // Show polynomials
 var polyAStr = polyA[0] + ' + ' + polyA[1] + 'x + ' + polyA[2] + 'x^2';
 var polyBStr = polyB[0] + ' + ' + polyB[1] + 'x';
 viz.screenText('A(x) = ' + polyAStr, 200, 50, viz.colors.blue, 13, 'center');
 viz.screenText('B(x) = ' + polyBStr, 500, 50, viz.colors.green, 13, 'center');

 // Pipeline boxes
 var boxW = 140, boxH = 50;
 var pipelineSteps = [
 {label: 'Coefficient\nRepresentation', x: 90, color: viz.colors.orange},
 {label: 'FFT\nO(n log n)', x: 250, color: viz.colors.blue},
 {label: 'Point-value\nMultiply O(n)', x: 410, color: viz.colors.green},
 {label: 'IFFT\nO(n log n)', x: 570, color: viz.colors.purple}
];
 var pipeY = 85;

 for (var i = 0; i <pipelineSteps.length; i++) {
 var ps = pipelineSteps[i];
 viz.ctx.fillStyle = ps.color + '22';
 viz.ctx.fillRect(ps.x - boxW / 2, pipeY, boxW, boxH);
 viz.ctx.strokeStyle = ps.color;
 viz.ctx.lineWidth = 2;
 viz.ctx.strokeRect(ps.x - boxW / 2, pipeY, boxW, boxH);
 var lines = ps.label.split('\n');
 for (var li = 0; li <lines.length; li++) {
 viz.screenText(lines[li], ps.x, pipeY + 16 + li * 18, ps.color, 11, 'center');
}
 if (i <pipelineSteps.length - 1) {
 viz.ctx.strokeStyle = viz.colors.axis;
 viz.ctx.lineWidth = 2;
 viz.ctx.beginPath();
 viz.ctx.moveTo(ps.x + boxW / 2, pipeY + boxH / 2);
 viz.ctx.lineTo(pipelineSteps[i + 1].x - boxW / 2, pipeY + boxH / 2);
 viz.ctx.stroke();
 // Arrow head
 var ax = pipelineSteps[i + 1].x - boxW / 2;
 var ay = pipeY + boxH / 2;
 viz.ctx.fillStyle = viz.colors.axis;
 viz.ctx.beginPath();
 viz.ctx.moveTo(ax, ay);
 viz.ctx.lineTo(ax - 8, ay - 4);
 viz.ctx.lineTo(ax - 8, ay + 4);
 viz.ctx.closePath();
 viz.ctx.fill();
}
}

 // Show coefficient arrays
 var coeffY = 160;
 viz.screenText('Coefficients of A:', 50, coeffY, viz.colors.blue, 11, 'left');
 viz.drawArray(polyA, 200, coeffY - 15, 45, 30, null, null);

 coeffY += 40;
 viz.screenText('Coefficients of B:', 50, coeffY, viz.colors.green, 11, 'left');
 viz.drawArray(polyB, 200, coeffY - 15, 45, 30, null, null);

 // Naive result
 var result = naiveMultiply(polyA.filter(function(v, idx) {return idx <3;}), polyB.filter(function(v, idx) {return idx <2;}));
 coeffY += 45;
 viz.screenText('C = A * B:', 50, coeffY, viz.colors.yellow, 11, 'left');
 viz.drawArray(result, 200, coeffY - 15, 45, 30, null, null);

 var cStr = result.map(function(v, i) {
 if (v === 0) return '';
 if (i === 0) return String(v);
 return v + 'x^' + i;
}).filter(function(s) {return s!== '';}).join(' + ');
 viz.screenText('C(x) = ' + cStr, 350, coeffY + 30, viz.colors.yellow, 13, 'center');

 // Complexity comparison
 var cmpY = 330;
 viz.screenText('Complexity Comparison:', 350, cmpY, viz.colors.white, 13, 'center');
 viz.screenText('Naive: O(n^2) multiplications', 250, cmpY + 22, viz.colors.red, 12, 'center');
 viz.screenText('FFT: O(n log n) operations', 500, cmpY + 22, viz.colors.green, 12, 'center');

 // For n = 10^6
 viz.screenText('For n = 1,000,000:', 350, cmpY + 50, viz.colors.text, 11, 'center');
 viz.screenText('Naive: ~10^12 ops', 250, cmpY + 70, viz.colors.red, 11, 'center');
 viz.screenText('FFT: ~2 * 10^7 ops', 500, cmpY + 70, viz.colors.green, 11, 'center');
 viz.screenText('50,000x speedup!', 350, cmpY + 90, viz.colors.orange, 12, 'center');
}

 draw();

 VizEngine.createButton(controls, 'Random Polynomials', function() {
 polyA = [];
 polyB = [];
 for (var i = 0; i <4; i++) polyA.push(Math.floor(Math.random() * 10));
 for (var j = 0; j <4; j++) polyB.push(Math.floor(Math.random() * 10));
 draw();
});

 return viz;
}
}
],
 exercises: [
 {
 question: 'use FFT method compute \\(A(x) = 1 + 2x\\) \\(B(x) = 3 + 4x\\). each. ',
 hint: 'to length 4, do FFT, IFFT. ',
 solution: 'A = [1,2,0,0], B = [3,4,0,0]. FFT(A) at \\(\\omega_4^k\\) (k=0,1,2,3): A(1)=3, A(i)=1+2i, A(-1)=-1, A(-i)=1-2i. FFT(B): B(1)=7, B(i)=3+4i, B(-1)=-1, B(-i)=3-4i.: C(1)=21, C(i)=(1+2i)(3+4i)=-5+10i, C(-1)=1, C(-i)=(1-2i)(3-4i)=-5-10i. IFFT: c_k = (1/4)\\(\\sum\\) C_j \\(\\omega^{-jk}\\). c = [3, 10, 8, 0]. so C(x) = 3 + 10x + 8x^2.: (1+2x)(3+4x) = 3 + 4x + 6x + 8x^2 = 3 + 10x + 8x^2. correct!'
},
 {
 question: 'FFT term, also have which use?',
 hint: ', graph,. ',
 solution: '(1):,; (2) graph: graph (JPEG use DCT, FFT),; (3): Schonhage-Strassen algorithm; (4) match: match term; (5) compute: method; (6): (NTT)use. '
},
 {
 question: 'what term lower bound is \\(\\Omega(n \\log n)\\)?',
 hint: ': output have \\(2n-1\\). ',
 solution: 'this is problem!, \\(\\Omega(n \\log n)\\) lower bound proof(in compute). in (only), can proof \\(\\Omega(n \\log n)\\) lower bound. in compute, I only \\(\\Omega(n)\\) lower bound(because output have \\(2n-1\\) need). FFT \\(O(n \\log n)\\) is optimal, proof is problem. '
},
 {
 question: 'use FFT in \\(O(n \\log n)\\) compute term in \\(n\\) value(value)?',
 hint: 'DFT is in value. ',
 solution: 'FFT compute is term in \\(n\\) \\(\\omega_n^0, \\omega_n^1, \\ldots, \\omega_n^{n-1}\\) value, this is value. if need in any \\(n\\) value, can use Bluestein or divide and conquer tree(subproduct tree)method, \\(O(n \\log^2 n)\\). for, chirp-z can in \\(O(n \\log n)\\) complete. '
}
]
}
]
});
