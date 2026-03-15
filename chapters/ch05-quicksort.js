// Chapter 5: Quicksort & Randomization -- Quicksort & Randomization
window.CHAPTERS.push({
 id: 'ch05',
 number: 5,
 title: 'Quicksort & Randomization',
 subtitle: 'Quicksort & Randomization',
 sections: [
 // ── Section 1: Quicksort Algorithm ──
 {
 id: 'ch05-sec01',
 title: 'The Quicksort Algorithm',
 content: `<h2>The Quicksort Algorithm</h2>
<div class="env-block bridge"><div class="env-title">Chapter Overview</div><div class="env-body"><p>Merge Sort (Chapter 4) guarantees \(O(n \log n)\) worst-case time but requires \(O(n)\) extra space. Quicksort takes a different approach: partition the array in-place around a pivot, then recurse on each side. This makes Quicksort the fastest sorting algorithm in practice, despite a \(\Theta(n^2)\) worst case. The key to taming that worst case is <em>randomization</em>, our first encounter with a powerful algorithmic technique.</p></div></div>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>We begin with the core Quicksort algorithm: choose a pivot, partition the array so that all smaller elements precede the pivot and all larger elements follow it, then recurse. The partition step does all the work; the combine step is trivial (unlike Merge Sort).</p></div></div>

<p>Quicksort(Quicksort) Tony Hoare 1960, is use use sorting algorithm. and Merge Sort different, Quicksort is<strong>in-place sort</strong>(in-place), not need auxiliary array. </p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Quicksort)</div><div class="env-body">
<p><strong>Quicksort(A, lo, hi):</strong></p>
<p>1. if \\(lo <hi\\): </p>
<p>2. &emsp; \\(p = \\text{Partition}(A, lo, hi)\\)</p>
<p>3. &emsp; Quicksort(A, lo, p - 1)</p>
<p>4. &emsp; Quicksort(A, p + 1, hi)</p>
</div></div>

<p>Quicksort is <strong>Partition</strong>: select <strong>pivot</strong>(pivot), all less than pivot element to edge, greater than pivot element to edge, pivot in its correct position. </p>

<div class="env-block intuition"><div class="env-title">Intuition</div><div class="env-body">
<p>Merge Sort in"merge"step(partition --). Quicksort exactly: in"partition"step(Partition), merge then -- because all element already. </p>
</div></div>

<div class="viz-placeholder" data-viz="ch05-viz-quicksort-step"></div>

<p>Quicksort divide and conquer: </p>
<ul>
<li><strong>Divide: </strong> Partition array two subarray</li>
<li><strong>Conquer: </strong> recursive sorting two subarray</li>
<li><strong>Combine: </strong> (in-place complete)</li>
</ul>`,
 visualizations: [
 {
 id: 'ch05-viz-quicksort-step',
 title: 'Step-by-Step Quicksort',
 description: 'Quicksort and recursive procedure',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var origArr = [6, 3, 8, 1, 5, 9, 2, 7];
 var steps = [];
 var stepIdx = 0;

 function recordQS(a, lo, hi) {
 if (lo>= hi) return;
 var pivot = a[hi];
 steps.push({type: 'pivot', arr: a.slice(), lo: lo, hi: hi, pivot: pivot, pivotIdx: hi});
 var i = lo - 1;
 for (var j = lo; j <hi; j++) {
 if (a[j] <= pivot) {
 i++;
 var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
 steps.push({type: 'swap', arr: a.slice(), lo: lo, hi: hi, i: i, j: j, pivot: pivot, pivotIdx: hi});
}
}
 var tmp2 = a[i + 1]; a[i + 1] = a[hi]; a[hi] = tmp2;
 steps.push({type: 'placed', arr: a.slice(), lo: lo, hi: hi, pivotIdx: i + 1, pivot: pivot});
 var p = i + 1;
 recordQS(a, lo, p - 1);
 recordQS(a, p + 1, hi);
}

 var temp = origArr.slice();
 recordQS(temp, 0, temp.length - 1);

 function draw() {
 viz.clear();
 var n = origArr.length;
 viz.screenText('Quicksort (Lomuto Partition)', 350, 18, viz.colors.white, 15, 'center');

 var step = stepIdx <steps.length? steps[stepIdx]: null;
 var currentArr = step? step.arr: temp;
 var cellW = 60, cellH = 40;
 var startX = (700 - n * cellW) / 2;
 var startY = 50;

 var colors = [];
 var highlights = [];
 for (var k = 0; k <n; k++) {
 colors.push(viz.colors.bg);
 highlights.push(null);
}

 if (step) {
 // Highlight active range
 for (var k2 = step.lo; k2 <= step.hi; k2++) {
 colors[k2] = '#1a2a3a';
}
 if (step.type === 'pivot') {
 highlights[step.pivotIdx] = viz.colors.orange;
} else if (step.type === 'swap') {
 highlights[step.i] = viz.colors.green;
 highlights[step.j] = viz.colors.blue;
 highlights[step.pivotIdx] = viz.colors.orange;
} else if (step.type === 'placed') {
 highlights[step.pivotIdx] = viz.colors.red;
}
}

 viz.drawArray(currentArr, startX, startY, cellW, cellH, colors, highlights);

 // Bar chart
 var barW = 40;
 var maxH = 180;
 var barStartX = (700 - n * (barW + 8)) / 2;
 var barStartY = 340;
 var maxVal = Math.max.apply(null, currentArr);
 for (var bi = 0; bi <n; bi++) {
 var h = (currentArr[bi] / maxVal) * maxH;
 var px = barStartX + bi * (barW + 8);
 var py = barStartY - h;
 var barCol = viz.colors.blue;
 if (step && bi>= step.lo && bi <= step.hi) barCol = viz.colors.teal;
 if (step && step.type === 'placed' && bi === step.pivotIdx) barCol = viz.colors.red;
 if (step && step.type === 'pivot' && bi === step.pivotIdx) barCol = viz.colors.orange;
 viz.ctx.fillStyle = barCol;
 viz.ctx.fillRect(px, py, barW, h);
 viz.ctx.strokeStyle = viz.colors.axis;
 viz.ctx.lineWidth = 0.5;
 viz.ctx.strokeRect(px, py, barW, h);
 viz.screenText(String(currentArr[bi]), px + barW / 2, py - 8, viz.colors.white, 11, 'center');
}

 // Status
 var msg = '';
 if (step) {
 if (step.type === 'pivot') msg = 'Choose pivot = ' + step.pivot + ' at index ' + step.pivotIdx + ', range [' + step.lo + '.' + step.hi + ']';
 else if (step.type === 'swap') msg = 'Swap A[' + step.i + '] and A[' + step.j + '] (element <= pivot ' + step.pivot + ')';
 else if (step.type === 'placed') msg = 'Pivot ' + step.pivot + ' placed at final position ' + step.pivotIdx;
} else {
 msg = 'Sorting complete!';
}
 viz.screenText(msg, 350, 370, viz.colors.yellow, 12, 'center');
 viz.screenText('Step ' + (stepIdx + 1) + ' / ' + steps.length, 350, 395, viz.colors.text, 11, 'center');
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
 origArr = [];
 for (var i = 0; i <8; i++) origArr.push(Math.floor(Math.random() * 90) + 5);
 steps = [];
 temp = origArr.slice();
 recordQS(temp, 0, temp.length - 1);
 stepIdx = 0;
 draw();
});

 return viz;
}
}
],
 exercises: [
 {
 question: 'array \\([5, 3, 8, 4, 2, 7, 1, 6]\\) use Lomuto (finally element pivot), times Partition array state. ',
 hint: 'Pivot = 6. array, \\(\\leq 6\\) element swap to. ',
 solution: 'Pivot = 6., \\(\\leq 6\\) element 5,3,4,2,1. swap procedure array \\([5,3,4,2,1,6,8,7]\\)(pivot 6 in index 5).: i from -1 start, j=0: 5<=6, swap(0,0); j=1: 3<=6, swap(1,1); j=2: 8>6, skip; j=3: 4<=6, swap(2,3)=[5,3,4,8,2,7,1,6]; j=4: 2<=6, swap(3,4)=[5,3,4,2,8,7,1,6]; j=5: 7>6, skip; j=6: 1<=6, swap(4,6)=[5,3,4,2,1,7,8,6]; finally swap(5,7)=[5,3,4,2,1,6,8,7]. '
},
 {
 question: 'Quicksort is stable sort?what?',
 hint: 'equal element in procedure position. ',
 solution: 'Quicksort not is stable sort. in procedure, swap may equal element. e.g. \\([3_a, 2, 3_b, 1]\\) 1 pivot, \\(3_a\\) \\(3_b\\) may. '
},
 {
 question: 'Quicksort space complexity is how many?recursive stack depth. ',
 hint: 'best-case worst-case stack depth different. ',
 solution: 'space complexity need recursive stack. best-case(): stack \\(O(\\log n)\\). worst-case(sorting array): stack \\(O(n)\\). use recursive (recursive subarray, use), can guarantee stack \\(O(\\log n)\\). '
}
]
},

 // ── Section 2: Lomuto vs Hoare Partitioning ──
 {
 id: 'ch05-sec02',
 title: 'Lomuto & Hoare Partitioning',
 content: `<h2>Lomuto and Hoare </h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>The partition procedure is the engine of Quicksort. We study two variants: Lomuto's simpler scheme and Hoare's more efficient original. Understanding their differences reveals important lessons about constant factors and practical performance.</p></div></div>

<p>algorithm have two: <strong>Lomuto </strong> <strong>Hoare </strong>. it can same(array pivot), different. </p>

<h3>Lomuto </h3>
<div class="env-block algorithm"><div class="env-title">Algorithm (Lomuto Partition)</div><div class="env-body">
<p><strong>LomutoPartition(A, lo, hi):</strong></p>
<p>1. \\(pivot = A[hi]\\)</p>
<p>2. \\(i = lo - 1\\)</p>
<p>3. For \\(j = lo\\) to \\(hi - 1\\): </p>
<p>&emsp; if \\(A[j] \\leq pivot\\): \\(i{+}{+}\\); swap(\\(A[i], A[j]\\))</p>
<p>4. swap(\\(A[i+1], A[hi]\\))</p>
<p>5. return \\(i + 1\\)</p>
</div></div>

<h3>Hoare </h3>
<div class="env-block algorithm"><div class="env-title">Algorithm (Hoare Partition)</div><div class="env-body">
<p><strong>HoarePartition(A, lo, hi):</strong></p>
<p>1. \\(pivot = A[lo]\\)</p>
<p>2. \\(i = lo - 1,\\; j = hi + 1\\)</p>
<p>3. Loop: </p>
<p>&emsp; do \\(i{+}{+}\\) while \\(A[i] <pivot\\)</p>
<p>&emsp; do \\(j{-}{-}\\) while \\(A[j]> pivot\\)</p>
<p>&emsp; if \\(i \\geq j\\): return \\(j\\)</p>
<p>&emsp; swap(\\(A[i], A[j]\\))</p>
</div></div>

<div class="viz-placeholder" data-viz="ch05-viz-partition-compare"></div>

<div class="env-block theorem"><div class="env-title">Comparison</div><div class="env-body">
<p><strong>number of swaps: </strong> Hoare number of swaps Lomuto. in random input, Lomuto do \\(n/2\\) times swap, Hoare do \\(n/6\\) times. </p>
<p><strong>: </strong> Lomuto more,. Hoare boundary conditions more. </p>
<p><strong>row: </strong> sorting array, Lomuto(finally element pivot) \\(O(n^2)\\). Hoare(element)similarly. </p>
</div></div>

<div class="env-block warning"><div class="env-title">Warning</div><div class="env-body">
<p>Hoare \\(j\\) not is pivot position!pivot may in \\(A[lo.j]\\) any position. recursive use Quicksort(A, lo, j) Quicksort(A, j+1, hi), not is pivot position. </p>
</div></div>`,
 visualizations: [
 {
 id: 'ch05-viz-partition-compare',
 title: 'Lomuto vs Hoare Comparison',
 description: 'algorithm execute procedure',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var arr = [4, 7, 2, 6, 1, 3, 8, 5];

 function lomutoSteps(a) {
 var b = a.slice();
 var sts = [];
 var pivot = b[b.length - 1];
 var i = -1;
 sts.push({arr: b.slice(), i: -1, j: 0, pivot: pivot, msg: 'Pivot = ' + pivot, swaps: 0});
 var swapCount = 0;
 for (var j = 0; j <b.length - 1; j++) {
 if (b[j] <= pivot) {
 i++;
 var tmp = b[i]; b[i] = b[j]; b[j] = tmp;
 swapCount++;
 sts.push({arr: b.slice(), i: i, j: j, pivot: pivot, msg: 'A[' + j + ']=' + b[i] + ' <= ' + pivot + ', swap', swaps: swapCount});
} else {
 sts.push({arr: b.slice(), i: i, j: j, pivot: pivot, msg: 'A[' + j + ']=' + a[j] + '> ' + pivot + ', skip', swaps: swapCount});
}
}
 var tmp2 = b[i + 1]; b[i + 1] = b[b.length - 1]; b[b.length - 1] = tmp2;
 swapCount++;
 sts.push({arr: b.slice(), i: i + 1, j: -1, pivot: pivot, msg: 'Place pivot at ' + (i + 1), swaps: swapCount});
 return sts;
}

 function hoareSteps(a) {
 var b = a.slice();
 var sts = [];
 var pivot = b[0];
 var i = -1, j = b.length;
 var swapCount = 0;
 sts.push({arr: b.slice(), i: 0, j: b.length - 1, pivot: pivot, msg: 'Pivot = ' + pivot, swaps: 0});
 while (true) {
 do {i++;} while (b[i] <pivot);
 do {j--;} while (b[j]> pivot);
 if (i>= j) {
 sts.push({arr: b.slice(), i: i, j: j, pivot: pivot, msg: 'i>= j, partition done at j=' + j, swaps: swapCount});
 break;
}
 var tmp = b[i]; b[i] = b[j]; b[j] = tmp;
 swapCount++;
 sts.push({arr: b.slice(), i: i, j: j, pivot: pivot, msg: 'Swap A[' + i + ']=' + b[j] + ' and A[' + j + ']=' + b[i], swaps: swapCount});
}
 return sts;
}

 var lSteps = lomutoSteps(arr);
 var hSteps = hoareSteps(arr);
 var stepIdx = 0;

 function draw() {
 viz.clear();
 var n = arr.length;
 var cellW = 38, cellH = 32;

 viz.screenText('Lomuto Partition', 175, 18, viz.colors.orange, 14, 'center');
 viz.screenText('Hoare Partition', 525, 18, viz.colors.teal, 14, 'center');

 // Lomuto side
 var ls = stepIdx <lSteps.length? lSteps[stepIdx]: lSteps[lSteps.length - 1];
 var lStartX = 175 - (n * cellW) / 2;
 var lColors = [];
 var lHL = [];
 for (var k = 0; k <n; k++) {
 lColors.push(viz.colors.bg);
 lHL.push(null);
}
 if (ls.i>= 0 && ls.i <n) lHL[ls.i] = viz.colors.green;
 if (ls.j>= 0 && ls.j <n) lHL[ls.j] = viz.colors.blue;
 viz.drawArray(ls.arr, lStartX, 40, cellW, cellH, lColors, lHL);
 viz.screenText(ls.msg, 175, 95, viz.colors.text, 11, 'center');
 viz.screenText('Swaps: ' + ls.swaps, 175, 112, viz.colors.orange, 11, 'center');

 // Bar chart for Lomuto
 var barW = 25;
 var maxH = 100;
 var maxVal = Math.max.apply(null, ls.arr);
 for (var bi = 0; bi <n; bi++) {
 var h = (ls.arr[bi] / maxVal) * maxH;
 var px = lStartX + bi * (barW + 5) + 5;
 var py = 240 - h;
 var c = viz.colors.blue;
 if (bi === ls.i) c = viz.colors.green;
 if (ls.arr[bi] === ls.pivot && (stepIdx === lSteps.length - 1 || ls.j === -1)) c = viz.colors.red;
 viz.ctx.fillStyle = c;
 viz.ctx.fillRect(px, py, barW, h);
}

 // Hoare side
 var hs = stepIdx <hSteps.length? hSteps[stepIdx]: hSteps[hSteps.length - 1];
 var hStartX = 525 - (n * cellW) / 2;
 var hColors = [];
 var hHL = [];
 for (var k2 = 0; k2 <n; k2++) {
 hColors.push(viz.colors.bg);
 hHL.push(null);
}
 if (hs.i>= 0 && hs.i <n) hHL[hs.i] = viz.colors.green;
 if (hs.j>= 0 && hs.j <n) hHL[hs.j] = viz.colors.purple;
 viz.drawArray(hs.arr, hStartX, 40, cellW, cellH, hColors, hHL);
 viz.screenText(hs.msg, 525, 95, viz.colors.text, 11, 'center');
 viz.screenText('Swaps: ' + hs.swaps, 525, 112, viz.colors.teal, 11, 'center');

 // Bar chart for Hoare
 for (var bi2 = 0; bi2 <n; bi2++) {
 var h2 = (hs.arr[bi2] / maxVal) * maxH;
 var px2 = hStartX + bi2 * (barW + 5) + 5;
 var py2 = 240 - h2;
 var c2 = viz.colors.teal;
 if (bi2 === hs.i) c2 = viz.colors.green;
 if (bi2 === hs.j) c2 = viz.colors.purple;
 viz.ctx.fillStyle = c2;
 viz.ctx.fillRect(px2, py2, barW, h2);
}

 // Divider line
 viz.ctx.strokeStyle = viz.colors.axis;
 viz.ctx.lineWidth = 1;
 viz.ctx.setLineDash([4, 4]);
 viz.ctx.beginPath();
 viz.ctx.moveTo(350, 10);
 viz.ctx.lineTo(350, 410);
 viz.ctx.stroke();
 viz.ctx.setLineDash([]);

 // Legend
 viz.screenText('Green = i pointer', 120, 280, viz.colors.green, 11, 'left');
 viz.screenText('Blue = j pointer (Lomuto)', 120, 298, viz.colors.blue, 11, 'left');
 viz.screenText('Purple = j pointer (Hoare)', 400, 298, viz.colors.purple, 11, 'left');

 var maxSteps = Math.max(lSteps.length, hSteps.length);
 viz.screenText('Step ' + (stepIdx + 1) + ' / ' + maxSteps, 350, 400, viz.colors.text, 11, 'center');
}

 draw();

 VizEngine.createButton(controls, 'Prev', function() {
 if (stepIdx> 0) {stepIdx--; draw();}
});
 VizEngine.createButton(controls, 'Next', function() {
 var maxSteps = Math.max(lSteps.length, hSteps.length);
 if (stepIdx <maxSteps - 1) {stepIdx++; draw();}
});
 VizEngine.createButton(controls, 'Reset', function() {
 stepIdx = 0; draw();
});
 VizEngine.createButton(controls, 'New Array', function() {
 arr = [];
 for (var i = 0; i <8; i++) arr.push(Math.floor(Math.random() * 20) + 1);
 lSteps = lomutoSteps(arr);
 hSteps = hoareSteps(arr);
 stepIdx = 0;
 draw();
});

 return viz;
}
}
],
 exercises: [
 {
 question: 'array \\([3, 7, 1, 6, 4, 5, 2]\\) respectively execute Lomuto Hoare, compare number of swaps. ',
 hint: 'Lomuto: pivot = A[6] = 2. Hoare: pivot = A[0] = 3. ',
 solution: 'Lomuto (pivot=2): only have A[2]=1 <= 2, do 1 times element swap + 1 times pivot swap = 2 times. result [1,2,7,6,4,5,3]. Hoare (pivot=3): i from>= 3, j from <= 3. i=0(3>=3), j=6(2<=3), swap => [2,7,1,6,4,5,3]; i=1(7>=3), j=5 -> j=4 -> j=3 -> j=2(1<=3), i>=j not => again see i=1,j=2, swap => [2,1,7,6,4,5,3]; i=2(7>=3), j=1(1<3), i>j, done. Hoare do 2 times swap. '
},
 {
 question: 'proof Lomuto number of swaps \\((n-1)/2\\)(assume input is random permutation, pivot is finally element). ',
 hint: 'each j, A[j] <= pivot probability is how many?',
 solution: 'Pivot is finally element. \\(n-1\\) element, each element \\(A[j] \\leq A[n]\\) probability \\((n-1)/n \\cdot 1/2.. \\) more: pivot (rank) \\(k\\) probability \\(1/n\\). when pivot \\(k\\), have \\(k-1\\) element \\(\\leq\\) pivot, Lomuto do \\(k-1\\) times swap 1 times pivot swap. expected = \\(\\sum_{k=1}^{n} \\frac{1}{n}(k-1+1) = \\frac{1}{n}\\sum_{k=1}^{n} k = \\frac{n+1}{2}\\). more swap \\((n-1)/2\\). '
},
 {
 question: 'Hoare, what use not \\(A[i] <pivot\\) \\(A[j]> pivot\\)(not is \\(\\leq\\) \\(\\geq\\))?if use not will?',
 hint: 'all element equal. ',
 solution: 'if use \\(\\leq\\) \\(\\geq\\), when all element equal, pointer will to not, not (\\(O(n^2)\\) row). use not, two pointer in to equals pivot element will swap,. '
}
]
},

 // ── Section 3: Worst/Expected Case Analysis ──
 {
 id: 'ch05-sec03',
 title: 'Worst-Case & Expected Analysis',
 content: `<h2>worst-case and expected </h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Quicksort's performance depends entirely on pivot quality. When the pivot is always the smallest or largest element, we get \(\Theta(n^2)\). This section derives both the worst-case and expected-case bounds, showing that good pivots yield \(O(n \log n)\).</p></div></div>


<h3>worst-case</h3>
<div class="env-block theorem"><div class="env-title">Theorem (Quicksort Worst Case)</div><div class="env-body">
<p>Quicksort worst-case time complexity \\(\\Theta(n^2)\\). </p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p>when each times not (input sorting and finally element pivot), edge have \\(n-1\\) element, edge: </p>
$$T(n) = T(n-1) + T(0) + \\Theta(n) = T(n-1) + \\Theta(n)$$
<p> \\(T(n) = \\Theta(n) + \\Theta(n-1) + \\cdots + \\Theta(1) = \\Theta(n^2)\\). </p>
<p class="qed">∎</p>
</div></div>

<h3>expected time </h3>
<p>assume input is random permutation. \\(T(n)\\) is sorting \\(n\\) element expected number of comparisons. </p>

<div class="env-block theorem"><div class="env-title">Theorem (Expected Comparisons)</div><div class="env-body">
<p>Quicksort expected number of comparisons \\(2n \\ln n + O(n) \\approx 1.386 n \\log_2 n\\). </p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p> \\(z_1 <z_2 <\\cdots <z_n\\) is sorting element. define random variable: </p>
$$X_{ij} = \\begin{cases} 1 & \\text{if} z_i \\text{and} z_j \\text{are compared} \\\\ 0 & \\text{otherwise} \\end{cases}$$
<p>number of comparisons \\(X = \\sum_{i=1}^{n-1} \\sum_{j=i+1}^{n} X_{ij}\\). </p>
<p>\\(z_i\\) \\(z_j\\) compare when and only when \\(\\{z_i, z_{i+1}, \\ldots, z_j\\}\\) \\(z_i\\) or \\(z_j\\) pivot. probability \\(\\frac{2}{j - i + 1}\\). </p>
$$E[X] = \\sum_{i=1}^{n-1} \\sum_{j=i+1}^{n} \\frac{2}{j-i+1} = \\sum_{i=1}^{n-1} \\sum_{k=2}^{n-i+1} \\frac{2}{k} \\leq 2n \\sum_{k=2}^{n} \\frac{1}{k} = 2n(H_n - 1) = 2n \\ln n + O(n)$$
<p class="qed">∎</p>
</div></div>

<div class="viz-placeholder" data-viz="ch05-viz-comparison-count"></div>`,
 visualizations: [
 {
 id: 'ch05-viz-comparison-count',
 title: 'Quicksort Comparison Count',
 description: 'count different size array number of comparisons',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 400});
 var trials = 200;
 var maxN = 100;

 function qsortCount(arr) {
 var count = 0;
 function qs(a, lo, hi) {
 if (lo>= hi) return;
 var pivot = a[hi];
 var i = lo - 1;
 for (var j = lo; j <hi; j++) {
 count++;
 if (a[j] <= pivot) {
 i++;
 var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
}
}
 var tmp2 = a[i + 1]; a[i + 1] = a[hi]; a[hi] = tmp2;
 qs(a, lo, i);
 qs(a, i + 2, hi);
}
 qs(arr, 0, arr.length - 1);
 return count;
}

 function draw() {
 viz.clear();
 viz.screenText('Quicksort: Comparison Count vs n', 350, 18, viz.colors.white, 15, 'center');

 var dataPoints = [];
 var step = 5;
 for (var n = 5; n <= maxN; n += step) {
 var totalComps = 0;
 for (var t = 0; t <trials; t++) {
 var a = [];
 for (var i = 0; i <n; i++) a.push(Math.random());
 totalComps += qsortCount(a);
}
 dataPoints.push({n: n, avg: totalComps / trials});
}

 // Plot
 var plotL = 80, plotR = 650, plotT = 50, plotB = 340;
 var maxComp = dataPoints[dataPoints.length - 1].avg * 1.2;

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

 // Tick marks
 for (var ti = 0; ti <= maxN; ti += 20) {
 var tx = plotL + (ti / maxN) * (plotR - plotL);
 viz.screenText(String(ti), tx, plotB + 15, viz.colors.text, 10, 'center');
}

 // Data points (empirical)
 viz.ctx.fillStyle = viz.colors.blue;
 for (var d = 0; d <dataPoints.length; d++) {
 var dp = dataPoints[d];
 var dx = plotL + (dp.n / maxN) * (plotR - plotL);
 var dy = plotB - (dp.avg / maxComp) * (plotB - plotT);
 viz.ctx.beginPath();
 viz.ctx.arc(dx, dy, 3, 0, Math.PI * 2);
 viz.ctx.fill();
}

 // Theoretical 2n ln n curve
 viz.ctx.strokeStyle = viz.colors.orange;
 viz.ctx.lineWidth = 2;
 viz.ctx.beginPath();
 var first = true;
 for (var tn = 5; tn <= maxN; tn++) {
 var theory = 2 * tn * Math.log(tn);
 var ttx = plotL + (tn / maxN) * (plotR - plotL);
 var tty = plotB - (theory / maxComp) * (plotB - plotT);
 if (first) {viz.ctx.moveTo(ttx, tty); first = false;}
 else viz.ctx.lineTo(ttx, tty);
}
 viz.ctx.stroke();

 // n^2 curve (worst case)
 viz.ctx.strokeStyle = viz.colors.red;
 viz.ctx.lineWidth = 1;
 viz.ctx.setLineDash([4, 4]);
 viz.ctx.beginPath();
 first = true;
 for (var wn = 5; wn <= maxN; wn++) {
 var worst = wn * wn / 2;
 var wx = plotL + (wn / maxN) * (plotR - plotL);
 var wy = plotB - (worst / maxComp) * (plotB - plotT);
 if (wy <plotT) break;
 if (first) {viz.ctx.moveTo(wx, wy); first = false;}
 else viz.ctx.lineTo(wx, wy);
}
 viz.ctx.stroke();
 viz.ctx.setLineDash([]);

 // Legend
 viz.ctx.fillStyle = viz.colors.blue;
 viz.ctx.fillRect(400, 360, 12, 12);
 viz.screenText('Empirical avg', 418, 366, viz.colors.blue, 11, 'left');
 viz.ctx.fillStyle = viz.colors.orange;
 viz.ctx.fillRect(400, 378, 12, 12);
 viz.screenText('2n ln n (theory)', 418, 384, viz.colors.orange, 11, 'left');
 viz.ctx.fillStyle = viz.colors.red;
 viz.ctx.fillRect(530, 360, 12, 12);
 viz.screenText('n^2/2 (worst)', 548, 366, viz.colors.red, 11, 'left');
}

 draw();

 VizEngine.createButton(controls, 'Re-run Experiment', function() {draw();});

 return viz;
}
}
],
 exercises: [
 {
 question: 'in expected, what \\(\\Pr[z_i \\text{and} z_j \\text{are compared}] = \\frac{2}{j-i+1}\\)?',
 hint: ' \\(\\{z_i, z_{i+1}, \\ldots, z_j\\}\\) which element pivot. ',
 solution: '\\(z_i\\) \\(z_j\\) compare when and only when in \\(\\{z_i, z_{i+1}, \\ldots, z_j\\}\\), \\(z_i\\) or \\(z_j\\) is pivot. if \\(z_k\\)(\\(i <k <j\\)), then \\(z_i\\) \\(z_j\\) will to different subarray, not will compare., this each element probability, probability \\(\\frac{1}{j-i+1}\\). so \\(z_i\\) or \\(z_j\\) probability \\(\\frac{2}{j-i+1}\\). '
},
 {
 question: 'Quicksort expected number of comparisons \\(2n \\ln n\\) and Merge Sort worst-case \\(n \\log_2 n\\)?',
 hint: 'note that \\(\\ln n\\) \\(\\log_2 n\\). ',
 solution: '\\(2n \\ln n = 2n \\cdot \\frac{\\log_2 n}{\\log_2 e} = \\frac{2}{\\log_2 e} \\cdot n \\log_2 n \\approx 1.386 n \\log_2 n\\). Merge Sort worst-case \\(n \\log_2 n\\). so Quicksort Merge Sort do 39% compare. Quicksort since more more, more. '
},
 {
 question: 'if Quicksort select pivot always in (not \\(1:9\\)), time complexity is what?',
 hint: ' \\(T(n) = T(n/10) + T(9n/10) + O(n)\\). ',
 solution: 'recurrence tree each level \\(O(n)\\). tree depth \\(\\log_{10/9} n = O(\\log n)\\)(path \\(9n/10\\)). so \\(T(n) = O(n \\log n)\\)., only need is \\(c: (1-c)\\)(\\(0 <c <1\\)), is \\(O(n \\log n)\\). '
}
]
},

 // ── Section 4: Randomized Quicksort ──
 {
 id: 'ch05-sec04',
 title: 'Randomized Quicksort',
 content: `<h2>Randomized Quicksort</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>How do we ensure good pivots? Randomized Quicksort selects the pivot uniformly at random, making the \(O(n \log n)\) expected time independent of the input. This is our first example of a randomized algorithm, a paradigm we will revisit in later chapters.</p></div></div>

<p>determine Quicksort worst-case is \\(O(n^2)\\), and there exists input can this. <strong>randomization Quicksort</strong>through random select pivot this problem. </p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Randomized Quicksort)</div><div class="env-body">
<p><strong>RandomizedPartition(A, lo, hi):</strong></p>
<p>1. random select \\(r \\in [lo, hi]\\)</p>
<p>2. swap(\\(A[r], A[hi]\\))</p>
<p>3. return Partition(A, lo, hi)</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem</div><div class="env-body">
<p>randomization Quicksort any input <strong>expected</strong>running time \\(O(n \\log n)\\). this expected is algorithm random select, not input distribution. </p>
</div></div>

<div class="env-block intuition"><div class="env-title">Intuition</div><div class="env-body">
<p>randomization "worst-case input""worst-case ". for input, probability algorithm running in \\(O(n \\log n)\\). only have its random select column will \\(O(n^2)\\), its probability \\(1/n!\\). </p>
</div></div>

<div class="viz-placeholder" data-viz="ch05-viz-random-pivot"></div>

<p>randomization Quicksort need is<strong>not </strong>(concentration): running time not only expected, and probability expected value. </p>

<div class="env-block theorem"><div class="env-title">Theorem (Tail Bound)</div><div class="env-body">
<p>for randomization Quicksort, \\(\\Pr[T(n) \\geq cn \\log n] \\leq n^{-\\alpha}\\) \\(c, \\alpha> 0\\). running time term probability expected. </p>
</div></div>`,
 visualizations: [
 {
 id: 'ch05-viz-random-pivot',
 title: 'Randomized Pivot Distribution Experiment',
 description: 'array times running randomization Quicksort, number of comparisons distribution',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 400});
 var n = 50;
 var numTrials = 500;
 var histogram = {};

 function randomQSCount(size) {
 var a = [];
 for (var i = 0; i <size; i++) a.push(i); // Worst-case for deterministic
 var count = 0;
 function qs(arr, lo, hi) {
 if (lo>= hi) return;
 // Random pivot
 var r = lo + Math.floor(Math.random() * (hi - lo + 1));
 var tmp = arr[r]; arr[r] = arr[hi]; arr[hi] = tmp;
 var pivot = arr[hi];
 var i = lo - 1;
 for (var j = lo; j <hi; j++) {
 count++;
 if (arr[j] <= pivot) {
 i++;
 var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
}
}
 var t2 = arr[i + 1]; arr[i + 1] = arr[hi]; arr[hi] = t2;
 qs(arr, lo, i);
 qs(arr, i + 2, hi);
}
 qs(a, 0, a.length - 1);
 return count;
}

 function runExperiment() {
 histogram = {};
 for (var t = 0; t <numTrials; t++) {
 var c = randomQSCount(n);
 var bucket = Math.floor(c / 20) * 20;
 histogram[bucket] = (histogram[bucket] || 0) + 1;
}
}

 function draw() {
 viz.clear();
 viz.screenText('Randomized QS on sorted array (n=' + n + ', ' + numTrials + ' trials)', 350, 18, viz.colors.white, 14, 'center');

 var buckets = Object.keys(histogram).map(Number).sort(function(a, b) {return a - b;});
 if (buckets.length === 0) return;

 var maxCount = 0;
 for (var k = 0; k <buckets.length; k++) {
 if (histogram[buckets[k]]> maxCount) maxCount = histogram[buckets[k]];
}

 var plotL = 60, plotR = 660, plotB = 340, plotT = 50;
 var barW = Math.max(5, (plotR - plotL) / buckets.length - 2);

 for (var i = 0; i <buckets.length; i++) {
 var cnt = histogram[buckets[i]];
 var h = (cnt / maxCount) * (plotB - plotT);
 var px = plotL + i * (barW + 2);
 var py = plotB - h;
 viz.ctx.fillStyle = viz.colors.blue;
 viz.ctx.fillRect(px, py, barW, h);
}

 // Axis labels
 viz.screenText('Comparison count', 350, plotB + 25, viz.colors.text, 11, 'center');
 viz.screenText('Frequency', 30, (plotT + plotB) / 2, viz.colors.text, 11, 'center');

 // Mark 2n ln n
 var expected = 2 * n * Math.log(n);
 var minBucket = buckets[0], maxBucket = buckets[buckets.length - 1];
 var range = maxBucket - minBucket + 20;
 var expX = plotL + ((expected - minBucket) / range) * (plotR - plotL);
 viz.ctx.strokeStyle = viz.colors.orange;
 viz.ctx.lineWidth = 2;
 viz.ctx.setLineDash([5, 3]);
 viz.ctx.beginPath();
 viz.ctx.moveTo(expX, plotT);
 viz.ctx.lineTo(expX, plotB);
 viz.ctx.stroke();
 viz.ctx.setLineDash([]);
 viz.screenText('E[X] = 2n ln n = ' + Math.round(expected), expX, plotT - 8, viz.colors.orange, 11, 'center');

 // Mark n^2 worst case
 var worst = n * (n - 1) / 2;
 viz.screenText('Worst case: n(n-1)/2 = ' + worst, 350, plotB + 45, viz.colors.red, 11, 'center');
 viz.screenText('Note: sorted input is worst for deterministic QS, but fine for randomized!', 350, plotB + 60, viz.colors.green, 10, 'center');
}

 runExperiment();
 draw();

 VizEngine.createButton(controls, 'Re-run', function() {
 runExperiment();
 draw();
});
 VizEngine.createSlider(controls, 'n', 10, 200, n, 10, function(v) {
 n = Math.round(v);
 runExperiment();
 draw();
});

 return viz;
}
}
],
 exercises: [
 {
 question: 'what randomization Quicksort no"worst-case input", only have"worst-case "?',
 hint: 'compare determine algorithm randomization algorithm (adversary argument). ',
 solution: 'for determine Quicksort, can by algorithm pivot select its \\(O(n^2)\\) input. for randomization, must in see to random select determine input, therefore random pivot select row. input, only have when random select column exactly always to element will, this probability. '
},
 {
 question: 'if use median-of-3(, three element pivot)random select, can otherwise guarantee \\(O(n \\log n)\\) worst-case?',
 hint: ' median-of-3 always to element input. ',
 solution: 'not can. can "median-of-3 killer"column median-of-3 each times to maximum or minimum element. e.g. Musser(1997) this way. therefore median-of-3 have \\(O(n^2)\\) worst-case. in random input. '
},
 {
 question: 'proof: randomization Quicksort, each element pivot expected times \\(O(1)\\). ',
 hint: 'element pivot, it to position, not again and recursive. ',
 solution: 'each element pivot times. pivot, it in to correct position, not will in subproblem. therefore each element pivot times exactly 0 or 1, expected times \\(\\leq 1\\). '
},
 {
 question: 'randomization Quicksort again determine sorting have what?in what will select randomization?',
 hint: 'in algorithm only input. ',
 solution: 'method expected same. randomization have: (1) not need array, \\(O(n)\\); (2) if input is only or through to,; (3) randomization can in each do random select, not state. determine sorting in more. '
}
]
},

 // ── Section 5: Practical Optimizations ──
 {
 id: 'ch05-sec05',
 title: 'Practical Optimizations',
 content: `<h2>Practical Optimizations</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Real-world sorting libraries use Quicksort with practical optimizations: three-way partitioning for duplicate keys, median-of-three pivot selection, and switching to Insertion Sort for small subarrays. This section bridges theory and practice.</p></div></div>

<p>Quicksort already, in also have its use sorting algorithm. </p>

<h3>1. array to insert sorting</h3>
<p>when subarray size \\(\\leq k\\)(usually \\(k \\approx 10{-}20\\)), recursive greater than insert sorting. therefore in recursive to insert sorting. </p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Cutoff to Insertion Sort)</div><div class="env-body">
<p><strong>HybridQuicksort(A, lo, hi):</strong></p>
<p>1. if \\(hi - lo + 1 \\leq k\\): InsertionSort(A, lo, hi)</p>
<p>2. otherwise then: Quicksort</p>
</div></div>

<h3>2. (Dutch National Flag)</h3>
<p>when array have element,. array: \\(<pivot\\), \\(= pivot\\), \\(> pivot\\). </p>

<div class="env-block algorithm"><div class="env-title">Algorithm (3-Way Partition / Dutch National Flag)</div><div class="env-body">
<p><strong>ThreeWayPartition(A, lo, hi):</strong></p>
<p>1. \\(pivot = A[lo]\\)</p>
<p>2. \\(lt = lo,\\; gt = hi,\\; i = lo\\)</p>
<p>3. While \\(i \\leq gt\\): </p>
<p>&emsp; if \\(A[i] <pivot\\): swap(\\(A[lt], A[i]\\)); \\(lt{+}{+}\\); \\(i{+}{+}\\)</p>
<p>&emsp; if \\(A[i]> pivot\\): swap(\\(A[gt], A[i]\\)); \\(gt{-}{-}\\)</p>
<p>&emsp; otherwise then: \\(i{+}{+}\\)</p>
<p>4. \\((lt, gt)\\)</p>
<p>recursive: Quicksort(A, lo, lt-1) Quicksort(A, gt+1, hi)</p>
</div></div>

<div class="viz-placeholder" data-viz="ch05-viz-three-way"></div>

<h3>3. recursive </h3>
<p>guarantee stack depth \\(O(\\log n)\\), recursive subarray, then subarray use: </p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Tail-Call Optimized QS)</div><div class="env-body">
<p><strong>QuicksortTailOpt(A, lo, hi):</strong></p>
<p>1. While \\(lo <hi\\): </p>
<p>&emsp; \\(p = \\text{Partition}(A, lo, hi)\\)</p>
<p>&emsp; if \\(p - lo <hi - p\\): </p>
<p>&emsp;&emsp; Quicksort(A, lo, p-1); \\(lo = p + 1\\)</p>
<p>&emsp; otherwise then: </p>
<p>&emsp;&emsp; Quicksort(A, p+1, hi); \\(hi = p - 1\\)</p>
</div></div>

<div class="viz-placeholder" data-viz="ch05-viz-optimizations"></div>

<h3>4. Introsort</h3>
<p>(C++ STL <code>std:sort</code>)usually use <strong>Introsort</strong>: when recursive depth \\(2 \\log_2 n\\) to heap sorting, guarantee \\(O(n \\log n)\\) worst-case. </p>
<div class="env-block bridge"><div class="env-title">Looking Ahead</div><div class="env-body"><p>Quicksort partitions an array to sort it; the closely related selection problem asks for just the \(k\)-th smallest element. Chapter 6 shows how randomized partitioning solves selection in expected \(O(n)\) time, and then applies divide-and-conquer to matrix multiplication (Strassen) and polynomial multiplication (FFT).</p></div></div>`,
 visualizations: [
 {
 id: 'ch05-viz-three-way',
 title: 'Three-Way Partitioning',
 description: 'Dutch National Flag three-way partitioning of elements',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 380});
 var arr = [3, 1, 4, 1, 5, 3, 2, 3, 1, 4];
 var steps = [];
 var stepIdx = 0;

 function recordThreeWay(a) {
 steps = [];
 var b = a.slice();
 var pivot = b[0];
 var lt = 0, gt = b.length - 1, i = 0;
 steps.push({arr: b.slice(), lt: lt, gt: gt, i: i, pivot: pivot, msg: 'Init: pivot = ' + pivot});
 while (i <= gt) {
 if (b[i] <pivot) {
 var tmp = b[lt]; b[lt] = b[i]; b[i] = tmp;
 steps.push({arr: b.slice(), lt: lt, gt: gt, i: i, pivot: pivot, msg: 'A[' + i + ']=' + b[lt] + ' <' + pivot + ', swap to lt'});
 lt++;
 i++;
} else if (b[i]> pivot) {
 var tmp2 = b[gt]; b[gt] = b[i]; b[i] = tmp2;
 steps.push({arr: b.slice(), lt: lt, gt: gt, i: i, pivot: pivot, msg: 'A[' + i + ']=' + b[gt] + '> ' + pivot + ', swap to gt'});
 gt--;
} else {
 steps.push({arr: b.slice(), lt: lt, gt: gt, i: i, pivot: pivot, msg: 'A[' + i + ']=' + b[i] + ' == ' + pivot + ', advance i'});
 i++;
}
}
 steps.push({arr: b.slice(), lt: lt, gt: gt, i: i, pivot: pivot, msg: 'Done: [0.' + (lt - 1) + '] <' + pivot + ', [' + lt + '.' + gt + '] = ' + pivot + ', [' + (gt + 1) + '.' + (b.length - 1) + ']> ' + pivot});
}

 recordThreeWay(arr);

 function draw() {
 viz.clear();
 var n = arr.length;
 viz.screenText('3-Way Partition (Dutch National Flag)', 350, 18, viz.colors.white, 15, 'center');

 var step = stepIdx <steps.length? steps[stepIdx]: steps[steps.length - 1];
 var cellW = 50, cellH = 40;
 var startX = (700 - n * cellW) / 2;

 var colors = [];
 var highlights = [];
 for (var k = 0; k <n; k++) {
 if (k <step.lt) colors.push(viz.colors.blue + '44');
 else if (k> step.gt) colors.push(viz.colors.red + '44');
 else colors.push(viz.colors.green + '22');
 highlights.push(null);
}
 if (step.i <n) highlights[step.i] = viz.colors.yellow;

 viz.drawArray(step.arr, startX, 50, cellW, cellH, colors, highlights);

 // Pointers
 if (step.lt <n) {
 viz.drawPointer(startX + step.lt * cellW + cellW / 2, 50 + cellH + 20, 'lt', viz.colors.blue);
}
 if (step.gt <n) {
 viz.drawPointer(startX + step.gt * cellW + cellW / 2, 50 + cellH + 20, 'gt', viz.colors.red);
}
 if (step.i <n) {
 viz.drawPointer(startX + step.i * cellW + cellW / 2, 45, 'i', viz.colors.yellow);
}

 viz.screenText(step.msg, 350, 160, viz.colors.yellow, 12, 'center');

 // Bar chart
 var barW = 35;
 var maxH = 120;
 var barStartX = (700 - n * (barW + 6)) / 2;
 var barStartY = 320;
 var maxVal = Math.max.apply(null, step.arr);
 for (var bi = 0; bi <n; bi++) {
 var h = (step.arr[bi] / maxVal) * maxH;
 var px = barStartX + bi * (barW + 6);
 var py = barStartY - h;
 var barCol = viz.colors.teal;
 if (step.arr[bi] <step.pivot) barCol = viz.colors.blue;
 else if (step.arr[bi]> step.pivot) barCol = viz.colors.red;
 else barCol = viz.colors.green;
 viz.ctx.fillStyle = barCol;
 viz.ctx.fillRect(px, py, barW, h);
 viz.screenText(String(step.arr[bi]), px + barW / 2, py - 8, viz.colors.white, 11, 'center');
}

 // Legend
 viz.screenText('<pivot', 150, 350, viz.colors.blue, 11, 'center');
 viz.screenText('= pivot', 350, 350, viz.colors.green, 11, 'center');
 viz.screenText('> pivot', 550, 350, viz.colors.red, 11, 'center');

 viz.screenText('Step ' + (stepIdx + 1) + '/' + steps.length, 350, 375, viz.colors.text, 10, 'center');
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
 VizEngine.createButton(controls, 'New (with duplicates)', function() {
 arr = [];
 var vals = [1, 2, 3, 4, 5];
 for (var i = 0; i <10; i++) arr.push(vals[Math.floor(Math.random() * vals.length)]);
 recordThreeWay(arr);
 stepIdx = 0;
 draw();
});

 return viz;
}
},
 {
 id: 'ch05-viz-optimizations',
 title: 'Optimization Effects Comparison',
 description: 'Compare performance of different Quicksort optimizations',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 380});
 var n = 1000;

 function basicQS(a) {
 var ops = 0;
 function qs(arr, lo, hi) {
 if (lo>= hi) return;
 var pivot = arr[hi], i = lo - 1;
 for (var j = lo; j <hi; j++) {ops++; if (arr[j] <= pivot) {i++; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; ops++;}}
 var t2 = arr[i + 1]; arr[i + 1] = arr[hi]; arr[hi] = t2; ops++;
 qs(arr, lo, i); qs(arr, i + 2, hi);
}
 qs(a, 0, a.length - 1);
 return ops;
}

 function randomQS(a) {
 var ops = 0;
 function qs(arr, lo, hi) {
 if (lo>= hi) return;
 var r = lo + Math.floor(Math.random() * (hi - lo + 1));
 var t0 = arr[r]; arr[r] = arr[hi]; arr[hi] = t0;
 var pivot = arr[hi], i = lo - 1;
 for (var j = lo; j <hi; j++) {ops++; if (arr[j] <= pivot) {i++; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; ops++;}}
 var t2 = arr[i + 1]; arr[i + 1] = arr[hi]; arr[hi] = t2; ops++;
 qs(arr, lo, i); qs(arr, i + 2, hi);
}
 qs(a, 0, a.length - 1);
 return ops;
}

 function hybridQS(a) {
 var ops = 0;
 function insertionSort(arr, lo, hi) {
 for (var i = lo + 1; i <= hi; i++) {
 var key = arr[i], j = i - 1;
 while (j>= lo && arr[j]> key) {arr[j + 1] = arr[j]; j--; ops++;}
 arr[j + 1] = key; ops++;
}
}
 function qs(arr, lo, hi) {
 if (hi - lo + 1 <= 16) {insertionSort(arr, lo, hi); return;}
 var r = lo + Math.floor(Math.random() * (hi - lo + 1));
 var t0 = arr[r]; arr[r] = arr[hi]; arr[hi] = t0;
 var pivot = arr[hi], i = lo - 1;
 for (var j = lo; j <hi; j++) {ops++; if (arr[j] <= pivot) {i++; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; ops++;}}
 var t2 = arr[i + 1]; arr[i + 1] = arr[hi]; arr[hi] = t2; ops++;
 qs(arr, lo, i); qs(arr, i + 2, hi);
}
 qs(a, 0, a.length - 1);
 return ops;
}

 function draw() {
 viz.clear();
 viz.screenText('Quicksort Optimization Comparison (n=' + n + ')', 350, 18, viz.colors.white, 14, 'center');

 // Generate test array
 var base = [];
 for (var i = 0; i <n; i++) base.push(Math.random() * n);

 var results = [
 {name: 'Basic QS\n(last element pivot)', ops: basicQS(base.slice()), color: viz.colors.red},
 {name: 'Randomized QS', ops: randomQS(base.slice()), color: viz.colors.blue},
 {name: 'Hybrid QS\n(cutoff=16)', ops: hybridQS(base.slice()), color: viz.colors.green}
];

 var maxOps = 0;
 for (var r = 0; r <results.length; r++) {
 if (results[r].ops> maxOps) maxOps = results[r].ops;
}

 var barW = 120, barH = 200;
 var startX = 120;
 var startY = 300;
 var gap = 80;

 for (var ri = 0; ri <results.length; ri++) {
 var h = (results[ri].ops / maxOps) * barH;
 var px = startX + ri * (barW + gap);
 var py = startY - h;
 viz.ctx.fillStyle = results[ri].color;
 viz.ctx.fillRect(px, py, barW, h);
 viz.ctx.strokeStyle = viz.colors.axis;
 viz.ctx.lineWidth = 1;
 viz.ctx.strokeRect(px, py, barW, h);
 viz.screenText(String(results[ri].ops), px + barW / 2, py - 12, results[ri].color, 12, 'center');
 var lines = results[ri].name.split('\n');
 for (var li = 0; li <lines.length; li++) {
 viz.screenText(lines[li], px + barW / 2, startY + 15 + li * 16, viz.colors.text, 11, 'center');
}
}

 viz.screenText('Operations (comparisons + swaps)', 30, 180, viz.colors.text, 11, 'left');
}

 draw();

 VizEngine.createButton(controls, 'Re-run', function() {draw();});
 VizEngine.createSlider(controls, 'n', 100, 5000, n, 100, function(v) {
 n = Math.round(v);
 draw();
});

 return viz;
}
}
],
 exercises: [
 {
 question: 'only have 3 different value array(\\([1,2,3,1,2,3,1,2,3]\\)), compare Quicksort Quicksort time complexity. ',
 hint: 'Quicksort in have will. can times all equals pivot element to correct position. ',
 solution: 'Quicksort: each times equals pivot element to position. if have \\(n/3\\) same element, this element will and, number of comparisons \\(O(n^2/3)\\). Quicksort: each times all equals pivot element times, recursive only <>. 3 value, only times recursive, \\(O(n)\\). '
},
 {
 question: 'what in recursive to insert sorting recursive to element more?value \\(k\\) is how many?',
 hint: 'recursive use insert sorting in array. ',
 solution: 'recursive use have (use, stack). for array, this sorting. insert sorting array (, and have). \\(k\\), usually in 10-20. Java Arrays.sort use 47, C++ STL usually use 16. '
},
 {
 question: 'Introsort Quicksort, heap sorting insert sorting?what recursive depth value \\(2\\log_2 n\\)?',
 hint: 'Quicksort recursive depth this is how many?',
 solution: 'Introsort: (1) start use randomization Quicksort; (2) if recursive depth \\(2\\log_2 n\\), pivot select may not, to heap sorting(\\(O(n\\log n)\\) worst-case guarantee); (3) subarray use insert sorting. \\(2\\log_2 n\\) is because Quicksort tree depth \\(\\log_2 n\\), 2 not. this depth can determine to. '
},
 {
 question: 'Quicksort in what input?what input?determine Quicksort(pivot=A[lo])input?',
 hint: 'sorting, random input. ',
 solution: 'best-case: each times pivot exactly is,. random input this. worst-case(pivot=A[lo]): sorting or array, each times pivot is value, not. method: pivot=A[lo], input \\([1,2,3,..,n]\\) will each times pivot=when minimum value, edge 0 element, edge \\(n-1\\), recursive depth \\(n\\), compare \\(n(n-1)/2\\). '
}
]
}
]
});
