// ============================================================
// Ch 16 · greedy algorithm (Greedy Algorithms)
// ============================================================
window.CHAPTERS.push({
 id: 'ch16',
 number: 16,
 title: 'Greedy Algorithms',
 subtitle: 'Greedy Algorithms -- Making Locally Optimal Choices',
 sections: [
 // ===== Section 1: Greedy Paradigm =====
 {
 id: 'ch16-sec01',
 title: 'Greedy Strategy Overview',
 content: `<h2>1. Greedy Strategy Overview</h2>
<div class="env-block bridge"><div class="env-title">Chapter Overview</div><div class="env-body"><p>The graph algorithms of Chapters 12 through 15 used greedy choices implicitly (Dijkstra, Kruskal, Prim). Now we formalize the greedy paradigm: make the locally optimal choice at each step and hope it leads to a globally optimal solution. This chapter explores when greedy works (activity selection, Huffman coding, matroids), when it does not (0-1 knapsack), and the theory that explains the difference.</p></div></div>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>We start with the big picture: what makes a problem amenable to the greedy approach? The two key ingredients are the greedy-choice property (a locally optimal choice is part of some globally optimal solution) and optimal substructure (the subproblem after the greedy choice is also an optimization problem).</p></div></div>

<p>greedy algorithm (greedy algorithm) is in each do <strong>optimal select</strong>algorithm, expected this to optimal solution. and Dynamic Programming different, greedy not need backtracking or, is, each times greedy select when have term. </p>

<div class="env-block definition">
<div class="env-title">Definition 16.1 (Greedy Algorithm)</div>
<div class="env-body"><p>problem solution column select \\(c_1, c_2, \\ldots, c_k\\). greedy algorithm in \\(i\\) select optimal \\(c_i\\), not step. if all, this way can obtain optimal solution, then this greedy strategy is<strong>correct</strong>. </p></div>
</div>

<p>greedy algorithm correctness usually two key:</p>

<div class="env-block definition">
<div class="env-title">Definition 16.2 (Greedy-Choice Property)</div>
<div class="env-body"><p><strong>greedy-choice property:</strong> can through do optimal (greedy) select optimal solution. also is, there exists optimal solution contain greedy choice element. </p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 16.3 (Optimal Substructure)</div>
<div class="env-body"><p><strong>optimal substructure:</strong> do greedy choice, subproblem optimal solution and problem greedy choice problem optimal solution. </p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 16.1 (Greedy Correctness Framework)</div>
<div class="env-body"><p>if problem have greedy-choice property optimal substructure, then greedy algorithm optimal solution. proof usually use<strong>exchange argument (exchange argument)</strong>: assume optimal solution \\(O\\) and greedy solution \\(G\\) different, \\(O\\) element replace \\(G\\) greedy choice, proof replace solution not. </p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Generic Greedy Framework</div>
<div class="env-body"><p>
1. \\(C\\) element by greedy then sorting<br>
2. solution \\(S = \\emptyset\\)<br>
3. for sorting each element \\(e \\in C\\):<br>
&nbsp;&nbsp;&nbsp;&nbsp;if \\(e\\) \\(S\\) still row, then \\(S = S \\cup \\{e\\}\\)<br>
4. \\(S\\)
</p></div>
</div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body"><p>greedy in, each times -- if no"only can "constraint, this optimal. if have capacity, greedy not. key in <strong>problem is otherwise optimal optimal</strong>. </p></div>
</div>

<div class="viz-placeholder" data-viz="ch16-viz-greedy-vs-optimal"></div>

<div class="env-block warning">
<div class="env-title">Warning</div>
<div class="env-body"><p>greedy algorithm not always correct! is 0-1 knapsack problem: by greedy may optimal combination. proof greedy correctness is use greedy algorithm , step. </p></div>
</div>`,
 visualizations: [
 {
 id: 'ch16-viz-greedy-vs-optimal',
 title: 'Greedy vs Optimal: Coin Change',
 description: 'compare greedy strategy and optimal solution in different denomination ',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 400});
 var denomSets = [
 {name: 'denomination (1,5,10,25)', denoms: [25,10,5,1], amount: 36},
 {name: 'denomination (1,3,4)', denoms: [4,3,1], amount: 6},
 {name: 'denomination (1,6,10)', denoms: [10,6,1], amount: 12}
];
 var currentSet = 0;

 function greedyChange(denoms, amount) {
 var result = [];
 var remain = amount;
 for (var i = 0; i <denoms.length; i++) {
 while (remain>= denoms[i]) {
 result.push(denoms[i]);
 remain -= denoms[i];
}
}
 return result;
}

 function optimalChange(denoms, amount) {
 var dp = new Array(amount + 1).fill(Infinity);
 var parent = new Array(amount + 1).fill(-1);
 dp[0] = 0;
 for (var i = 1; i <= amount; i++) {
 for (var j = 0; j <denoms.length; j++) {
 if (denoms[j] <= i && dp[i - denoms[j]] + 1 <dp[i]) {
 dp[i] = dp[i - denoms[j]] + 1;
 parent[i] = denoms[j];
}
}
}
 var result = [];
 var cur = amount;
 while (cur> 0) {result.push(parent[cur]); cur -= parent[cur];}
 return result;
}

 function draw() {
 viz.clear();
 var ds = denomSets[currentSet];
 var greedy = greedyChange(ds.denoms, ds.amount);
 var optimal = optimalChange(ds.denoms, ds.amount);

 viz.screenText(ds.name, 350, 25, viz.colors.white, 16, 'center');
 viz.screenText(': ' + ds.amount, 350, 48, viz.colors.yellow, 14, 'center');

 // Greedy
 viz.screenText('greedy solution (' + greedy.length + ' coin)', 350, 90, viz.colors.blue, 14, 'center');
 var gx = 350 - greedy.length * 22;
 for (var i = 0; i <greedy.length; i++) {
 var px = gx + i * 44;
 viz.drawNode(px, 130, 18, greedy[i], viz.colors.blue, viz.colors.white);
}

 // Optimal
 viz.screenText('optimal solution (' + optimal.length + ' coin)', 350, 195, viz.colors.green, 14, 'center');
 var ox = 350 - optimal.length * 22;
 for (var i = 0; i <optimal.length; i++) {
 var px2 = ox + i * 44;
 viz.drawNode(px2, 235, 18, optimal[i], viz.colors.green, viz.colors.white);
}

 // Verdict
 var same = greedy.length === optimal.length;
 var verdict = same? 'Greedy = Optimal!': 'Greedy is suboptimal!';
 var vc = same? viz.colors.green: viz.colors.red;
 viz.screenText(verdict, 350, 300, vc, 18, 'center');

 if (!same) {
 viz.screenText('greedy use ' + (greedy.length - optimal.length) + ' coin', 350, 325, viz.colors.orange, 13, 'center');
}

 viz.screenText('denomination: [' + ds.denoms.join(', ') + ']', 350, 370, viz.colors.text, 12, 'center');
}

 VizEngine.createButton(controls, 'group', function() {
 currentSet = (currentSet - 1 + denomSets.length) % denomSets.length;
 draw();
});
 VizEngine.createButton(controls, 'group', function() {
 currentSet = (currentSet + 1) % denomSets.length;
 draw();
});

 draw();
 return viz;
}
}
],
 exercises: [
 {
 question: 'proof: for denomination \\(1, 5, 10, 25\\) coin, greedy algorithm (each times maximum use denomination) always optimal. ',
 hint: 'use exchange argument. assume optimal solution use more coin, proof can use more denomination replace if denomination. ',
 solution: 'optimal solution \\(O\\) use coin or equals greedy solution. greedy choice coin \\(c\\) (maximum denomination), if \\(O\\) not contain \\(c\\), then \\(O\\) \\(c\\) if denomination \\(\\ge c\\). can: less than 25 denomination group \\(\\ge 25\\) combination at least need 2 coin, use 25 replace not will increase coin. 10, 5, 1. greedy solution optimal. '
},
 {
 question: ', for denomination \\(\\{1, 3, 4\\}\\) \\(6\\), greedy algorithm not is optimal. ',
 hint: 'greedy will 4, then 1, 1; but have more. ',
 solution: 'greedy: \\(6 = 4 + 1 + 1\\) (3 coin). optimal: \\(6 = 3 + 3\\) (2 coin). greedy use coin. '
},
 {
 question: 'solution greedy-choice property optimal substructure. what need can guarantee greedy correct?',
 hint: 'greedy-choice property guarantee not, optimal substructure guarantee recursive not. ',
 solution: 'greedy-choice property "do optimal select not will optimal solution" -- optimal solution contain greedy that element. optimal substructure "do greedy choice, subproblem can optimal solution"., may;, subproblem solution may and problem optimal not. not. '
}
]
},
 // ===== Section 2: Activity Selection =====
 {
 id: 'ch16-sec02',
 title: 'Activity Selection Problem',
 content: `<h2>2 Activity Selection Problem</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>The activity selection problem is the textbook greedy example: given activities with start and end times, select the maximum number of non-overlapping activities. The greedy choice (always pick the earliest-finishing activity) is provably optimal.</p></div></div>

<p>Activity Selection Problem (activity selection) is greedy algorithm: given \\(n\\) activity, each activity \\(a_i\\) have start \\(s_i\\) end \\(f_i\\), need <strong>not </strong>activity. </p>

<div class="env-block definition">
<div class="env-title">Definition 16.4 (Activity Selection Problem)</div>
<div class="env-body"><p>given activity \\(S = \\{a_1, \\ldots, a_n\\}\\), its \\(a_i = [s_i, f_i)\\). \\(S\\) maximum subset \\(A \\subseteq S\\), \\(A\\) any two activity not: \\(\\forall a_i, a_j \\in A, \\ i \\ne j \\Rightarrow f_i \\le s_j \\text{or} f_j \\le s_i\\).</p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Greedy Activity Selection</div>
<div class="env-body"><p>
1. activity by<strong>end \\(f_i\\) </strong>sorting<br>
2. select activity \\(a_1\\) (end)<br>
3. for each activity \\(a_i\\):<br>
&nbsp;&nbsp;&nbsp;&nbsp;if \\(s_i \\ge f_{\\text{last}}\\) (and finally activity), then select \\(a_i\\)<br>
4. activity
</p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 16.2 (Greedy Activity Selection is Optimal)</div>
<div class="env-body"><p>by end sorting greedy strategy always maximum activity subset. </p></div>
</div>

<div class="env-block proof">
<div class="env-title">Proof</div>
<div class="env-body"><p><strong>greedy-choice property:</strong> \\(a_k\\) is end activity. \\(O\\) is optimal solution. if \\(a_k \\notin O\\), \\(O\\) activity \\(a_j\\). because \\(f_k \\le f_j\\), use \\(a_k\\) replace \\(a_j\\) obtain \\(O'\\) still and \\(|O'| = |O|\\). therefore there exists contain \\(a_k\\) optimal solution. </p>
<p><strong>optimal substructure:</strong> \\(a_k\\), problem is from \\(\\{a_i: s_i \\ge f_k\\}\\) activity, this is problem. </p>
<p>, greedy solution size equals optimal solution size. \\(\\blacksquare\\)</p></div>
</div>

<p>time complexity: sorting \\(O(n\\log n)\\) + \\(O(n)\\) = \\(O(n\\log n)\\). </p>

<div class="viz-placeholder" data-viz="ch16-viz-activity-selection"></div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body"><p>note that: by<strong>start </strong>sorting greedy similarly correct (greedy). byor<strong>start </strong>sorting greedy is -- can. </p></div>
</div>`,
 visualizations: [
 {
 id: 'ch16-viz-activity-selection',
 title: 'Activity Selection: Greedy Process',
 description: 'by end sorting, select activity',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 420});
 var activities = [
 {id: 0, s: 1, f: 4},
 {id: 1, s: 3, f: 5},
 {id: 2, s: 0, f: 6},
 {id: 3, s: 5, f: 7},
 {id: 4, s: 3, f: 9},
 {id: 5, s: 5, f: 9},
 {id: 6, s: 6, f: 10},
 {id: 7, s: 8, f: 11},
 {id: 8, s: 8, f: 12},
 {id: 9, s: 2, f: 14},
 {id: 10, s: 12, f: 16}
];
 // Sort by finish time
 activities.sort(function(a, b) {return a.f - b.f;});
 var step = 0;
 var selected = [];
 var rejected = [];
 var maxTime = 17;

 function reset() {
 step = 0;
 selected = [];
 rejected = [];
 draw();
}

 function advance() {
 if (step>= activities.length) return;
 var act = activities[step];
 var lastF = selected.length> 0? activities[selected[selected.length - 1]].f: 0;
 if (act.s>= lastF) {
 selected.push(step);
} else {
 rejected.push(step);
}
 step++;
 draw();
}

 function selectAll() {
 while (step <activities.length) {
 var act = activities[step];
 var lastF = selected.length> 0? activities[selected[selected.length - 1]].f: 0;
 if (act.s>= lastF) {
 selected.push(step);
} else {
 rejected.push(step);
}
 step++;
}
 draw();
}

 function draw() {
 viz.clear();
 var barH = 24;
 var gap = 6;
 var leftMargin = 80;
 var topMargin = 55;
 var timeScale = (viz.width - leftMargin - 40) / maxTime;

 viz.screenText('Activity Selection -- by end greedy', viz.width / 2, 20, viz.colors.white, 15, 'center');

 // Time axis
 var axisY = topMargin + activities.length * (barH + gap) + 15;
 var ctx = viz.ctx;
 ctx.strokeStyle = viz.colors.axis;
 ctx.lineWidth = 1;
 ctx.beginPath();
 ctx.moveTo(leftMargin, axisY);
 ctx.lineTo(viz.width - 20, axisY);
 ctx.stroke();
 for (var t = 0; t <= maxTime; t += 2) {
 var tx = leftMargin + t * timeScale;
 ctx.beginPath(); ctx.moveTo(tx, axisY - 3); ctx.lineTo(tx, axisY + 3); ctx.stroke();
 viz.screenText(String(t), tx, axisY + 14, viz.colors.text, 10, 'center');
}

 // Draw activities
 for (var i = 0; i <activities.length; i++) {
 var act = activities[i];
 var y = topMargin + i * (barH + gap);
 var x1 = leftMargin + act.s * timeScale;
 var w = (act.f - act.s) * timeScale;

 var color, textC;
 if (selected.indexOf(i)>= 0) {
 color = viz.colors.green;
 textC = viz.colors.white;
} else if (rejected.indexOf(i)>= 0) {
 color = viz.colors.red + '44';
 textC = viz.colors.red;
} else if (i === step) {
 color = viz.colors.yellow + '66';
 textC = viz.colors.yellow;
} else {
 color = viz.colors.blue + '33';
 textC = viz.colors.blue;
}

 ctx.fillStyle = color;
 ctx.fillRect(x1, y, w, barH);
 ctx.strokeStyle = textC;
 ctx.lineWidth = 1;
 ctx.strokeRect(x1, y, w, barH);

 viz.screenText('a' + act.id, leftMargin - 25, y + barH / 2, textC, 12, 'center');
 viz.screenText('[' + act.s + ',' + act.f + ')', x1 + w / 2, y + barH / 2, viz.colors.white, 11, 'center');
}

 // Legend
 var ly = axisY + 35;
 ctx.fillStyle = viz.colors.green; ctx.fillRect(leftMargin, ly, 14, 14);
 viz.screenText('', leftMargin + 22, ly + 7, viz.colors.green, 11, 'left');
 ctx.fillStyle = viz.colors.red + '44'; ctx.fillRect(leftMargin + 70, ly, 14, 14);
 viz.screenText(' (conflict)', leftMargin + 92, ly + 7, viz.colors.red, 11, 'left');
 ctx.fillStyle = viz.colors.yellow + '66'; ctx.fillRect(leftMargin + 190, ly, 14, 14);
 viz.screenText('when ', leftMargin + 212, ly + 7, viz.colors.yellow, 11, 'left');

 viz.screenText('activity: ' + selected.length, viz.width - 80, 20, viz.colors.green, 14, 'center');
}

 VizEngine.createButton(controls, '', advance);
 VizEngine.createButton(controls, 'all ', selectAll);
 VizEngine.createButton(controls, '', reset);

 draw();
 return viz;
}
}
],
 exercises: [
 {
 question: ', "by activity "greedy strategy optimal. ',
 hint: 'three activity, its activity and two not activity conflict. ',
 solution: 'activity: \\(a_1 = [0, 4)\\), \\(a_2 = [3, 5)\\), \\(a_3 = [4, 8)\\). by: \\(a_2\\) (2), \\(a_2\\) \\(a_1, a_3\\) conflict, 1 activity. optimal solution \\(\\{a_1, a_3\\}\\) 2 activity. '
},
 {
 question: 'Activity Selection Problem greedy correctness use exchange argument., for \\(n\\) activity by end, proof greedy choice (end activity) not will solution. ',
 hint: 'optimal solution OPT activity \\(a_j\\), greedy is \\(a_1\\) (end). use \\(a_1\\) replace \\(a_j\\). ',
 solution: ' OPT \\(a_j\\) activity (\\(j \\ne 1\\)). because \\(f_1 \\le f_j\\) (sorting), use \\(a_1\\) replace \\(a_j\\), \\(a_1\\) end more, so OPT activity \\(a_k\\) satisfy \\(s_k \\ge f_j \\ge f_1\\), \\(a_k\\) and \\(a_1\\) also. therefore OPT\' = (OPT \\ {\\(a_j\\)}) + {\\(a_1\\)} is and size not, optimal solution. '
},
 {
 question: ' \\(n\\) activity (each activity have weight \\(w_i\\), maximum weight), greedy also can? what?',
 hint: 'Activity Selection need DP. ',
 solution: 'not can. Activity Selection Problem not have greedy-choice property.: \\(a_1 = [0, 10), w_1 = 100\\); \\(a_2 = [0, 5), w_2 = 1\\); \\(a_3 = [5, 10), w_3 = 1\\). by \\(w/\\text{len}\\) greedy or by end greedy may. need Dynamic Programming: by end sorting \\(dp[i] = \\max(dp[i-1], w_i + dp[p(i)])\\), its \\(p(i)\\) is and \\(a_i\\) not conflict activity. '
}
]
},
 // ===== Section 3: Huffman Coding =====
 {
 id: 'ch16-sec03',
 title: 'Huffman Coding',
 content: `<h2>3 Huffman encoding</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Huffman coding constructs an optimal prefix-free binary code by repeatedly merging the two lowest-frequency symbols. It is the foundation of lossless data compression (ZIP, gzip) and demonstrates greedy algorithms on tree structures.</p></div></div>

<p>Huffman encoding is <strong>optimal prefix encoding</strong>, use. given frequency, Huffman greedy tree, frequency encoding, frequency encoding, from minimum encoding length. </p>

<div class="env-block definition">
<div class="env-title">Definition 16.5 (Prefix-Free Code)</div>
<div class="env-body"><p>prefix (prefix-free code) is no is prefix encoding. this guarantee encoding can solution. each prefix tree, in leaf node, /respectively 0/1. </p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 16.6 (Cost of a Code)</div>
<div class="env-body"><p> \\(c\\) frequency \\(f(c)\\), encoding length \\(d_T(c)\\) (in tree \\(T\\) depth). encoding $$B(T) = \\sum_{c \\in C} f(c) \\cdot d_T(c)$$ Huffman algorithm minimum \\(B(T)\\). </p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Huffman Coding</div>
<div class="env-body"><p>
1. \\(n\\) leaf node, each, queue (by frequency sorting)<br>
2. when queue node \\(> 1\\):<br>
&nbsp;&nbsp;&nbsp;&nbsp;frequency minimum two node \\(x, y\\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;internal node \\(z\\), \\(f(z) = f(x) + f(y)\\), = \\(x\\), = \\(y\\)<br>
&nbsp;&nbsp;&nbsp;&nbsp; \\(z\\) insert queue<br>
3. queue node (Huffman tree)
</p></div>
</div>

<p>time complexity: \\(O(n \\log n)\\) (use minimum heap). </p>

<div class="env-block theorem">
<div class="env-title">Theorem 16.3 (Huffman Optimality)</div>
<div class="env-body"><p>Huffman algorithm prefix is optimal, \\(B(T_{\\text{Huffman}}) \\le B(T)\\) all prefix tree \\(T\\). </p></div>
</div>

<div class="env-block proof">
<div class="env-title">Proof Sketch</div>
<div class="env-body"><p><strong>greedy-choice property:</strong> frequency minimum two in optimal tree is and level. (: if not is, it and swap, not.)<br>
<strong>optimal substructure:</strong> \\(x, y\\) merge \\(z\\) (frequency), subproblem is \\((C \\setminus \\{x,y\\}) \\cup \\{z\\}\\) Huffman encoding, its optimal solution \\(x,y\\) problem optimal solution. </p></div>
</div>

<div class="viz-placeholder" data-viz="ch16-viz-huffman"></div>

<div class="env-block example">
<div class="env-title">Example 16.1</div>
<div class="env-body"><p>frequency: a:45, b:13, c:12, d:16, e:9, f:5. Huffman encoding: a=0, b=101, c=100, d=111, e=1101, f=1100. = \\(45 \\cdot 1 + 13 \\cdot 3 + 12 \\cdot 3 + 16 \\cdot 3 + 9 \\cdot 4 + 5 \\cdot 4 = 224\\) (for 100), encoding need 300. </p></div>
</div>`,
 visualizations: [
 {
 id: 'ch16-viz-huffman',
 title: 'Huffman Tree Construction',
 description: 'from frequency Huffman encoding tree',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 450});
 var chars = ['a','b','c','d','e','f'];
 var freqs = [45, 13, 12, 16, 9, 5];
 var buildSteps = [];
 var currentStep = 0;

 function buildHuffman() {
 var nodes = [];
 for (var i = 0; i <chars.length; i++) {
 nodes.push({label: chars[i], freq: freqs[i], left: null, right: null, id: i});
}
 buildSteps = [{queue: nodes.map(function(n){return {label:n.label,freq:n.freq,left:n.left,right:n.right,id:n.id};}), msg: 'Initial: ' + chars.length + ' leaf nodes'}];
 var nextId = chars.length;
 var pool = nodes.slice();
 while (pool.length> 1) {
 pool.sort(function(a,b){return a.freq - b.freq;});
 var x = pool.shift();
 var y = pool.shift();
 var z = {label: '', freq: x.freq + y.freq, left: x, right: y, id: nextId++};
 pool.push(z);
 buildSteps.push({
 queue: pool.map(function(n){return n;}),
 merged: [x, y, z],
 msg: 'Merge ' + (x.label||x.freq) + '(' + x.freq + ') + ' + (y.label||y.freq) + '(' + y.freq + ') = ' + z.freq
});
}
 return pool[0];
}

 var root = buildHuffman();

 function getTreeLayout(node, x, y, spread) {
 if (!node) return [];
 var items = [{node: node, x: x, y: y}];
 if (node.left) {
 items = items.concat(getTreeLayout(node.left, x - spread, y + 55, spread * 0.55));
}
 if (node.right) {
 items = items.concat(getTreeLayout(node.right, x + spread, y + 55, spread * 0.55));
}
 return items;
}

 function draw() {
 viz.clear();
 viz.screenText('Huffman encoding tree ', viz.width / 2, 18, viz.colors.white, 15, 'center');

 if (currentStep <buildSteps.length) {
 var st = buildSteps[currentStep];
 viz.screenText('Step ' + currentStep + ': ' + st.msg, viz.width / 2, 42, viz.colors.yellow, 12, 'center');

 // Show queue
 viz.screenText('queue:', 30, 75, viz.colors.text, 12, 'left');
 var qx = 80;
 for (var i = 0; i <st.queue.length; i++) {
 var n = st.queue[i];
 var lbl = (n.label || '*') + ':' + n.freq;
 var col = (st.merged && n === st.merged[2])? viz.colors.orange: viz.colors.blue;
 viz.drawNode(qx + i * 75, 75, 18, lbl, col, viz.colors.white);
}
}

 // Draw final tree
 var layout = getTreeLayout(root, 350, 120, 150);
 for (var i = 0; i <layout.length; i++) {
 var item = layout[i];
 if (item.node.left) {
 var lc = layout.find(function(l){return l.node === item.node.left;});
 if (lc) {
 viz.drawTreeEdge(item.x, item.y, lc.x, lc.y, viz.colors.axis);
 viz.screenText('0', (item.x + lc.x) / 2 - 8, (item.y + lc.y) / 2, viz.colors.teal, 11, 'center');
}
}
 if (item.node.right) {
 var rc = layout.find(function(l){return l.node === item.node.right;});
 if (rc) {
 viz.drawTreeEdge(item.x, item.y, rc.x, rc.y, viz.colors.axis);
 viz.screenText('1', (item.x + rc.x) / 2 + 8, (item.y + rc.y) / 2, viz.colors.orange, 11, 'center');
}
}
}
 for (var i = 0; i <layout.length; i++) {
 var item = layout[i];
 var isLeaf =!item.node.left &&!item.node.right;
 var col = isLeaf? viz.colors.green: viz.colors.purple;
 var lbl = isLeaf? item.node.label + ':' + item.node.freq: String(item.node.freq);
 viz.drawTreeNode(item.x, item.y, isLeaf? 18: 15, lbl, col, viz.colors.white);
}

 // Codes
 function getCodes(node, prefix) {
 if (!node) return [];
 if (!node.left &&!node.right) return [{ch: node.label, code: prefix || '0'}];
 var result = [];
 if (node.left) result = result.concat(getCodes(node.left, prefix + '0'));
 if (node.right) result = result.concat(getCodes(node.right, prefix + '1'));
 return result;
}
 if (currentStep === buildSteps.length - 1) {
 var codes = getCodes(root, '');
 var cy = 415;
 viz.screenText('encoding result:', 30, cy, viz.colors.white, 12, 'left');
 for (var i = 0; i <codes.length; i++) {
 viz.screenText(codes[i].ch + '=' + codes[i].code, 110 + i * 95, cy, viz.colors.teal, 12, 'left');
}
}
}

 VizEngine.createButton(controls, '', function() {
 if (currentStep <buildSteps.length - 1) {currentStep++; draw();}
});
 VizEngine.createButton(controls, '', function() {
 currentStep = 0; draw();
});
 VizEngine.createButton(controls, 'tree', function() {
 currentStep = buildSteps.length - 1; draw();
});

 draw();
 return viz;
}
}
],
 exercises: [
 {
 question: 'frequency A:15, B:7, C:6, D:6, E:5 Huffman tree, each encoding, compute. ',
 hint: 'merge frequency minimum two: E(5) C(6) or D(6). ',
 solution: 'merge step: (1) E(5)+D(6)=ED(11), (2) C(6)+B(7)=CB(13), (3) ED(11)+CB(13)=EDCB(24), (4) A(15)+EDCB(24)=root(39). encoding (may): A=0, E=100, D=101, C=110, B=111. = 15*1 + 5*3 + 6*3 + 6*3 + 7*3 = 15 + 15 + 18 + 18 + 21 = 87. '
},
 {
 question: 'proof Huffman encoding greedy-choice property: frequency two in optimal prefix tree is and level. ',
 hint: 'use exchange argument: if level not is frequency, swap not. ',
 solution: ' \\(x, y\\) frequency, \\(a, b\\) is optimal tree \\(T\\) level (depth \\(d_{\\max}\\)). if \\(\\{a,b\\} \\ne \\{x,y\\}\\), not \\(a \\ne x\\). swap \\(a\\) \\(x\\) position obtain \\(T\'\\).: \\(\\Delta = f(x)(d_{\\max} - d(x)) + f(a)(d(x) - d_{\\max})= (f(x) - f(a))(d_{\\max} - d(x))\\). because \\(f(x) \\le f(a)\\) and \\(d_{\\max} \\ge d(x)\\), so \\(\\Delta \\le 0\\), not. swap \\(b, y\\). therefore optimal tree \\(x, y\\) can in level do. '
},
 {
 question: 'Huffman encoding time complexity what is \\(O(n\\log n)\\)? if by frequency, can otherwise do to \\(O(n)\\)?',
 hint: 'sorting use two queue. ',
 solution: 'do use minimum heap: \\(n\\) times insert + \\((n-1)\\) times two minimum + insert, each times \\(O(\\log n)\\), \\(O(n\\log n)\\). if sorting, use two queue: Q1, Q2 merge node. each times two minimum only compare Q1, Q2 (O(1)). \\(n-1\\) times merge, \\(O(n)\\). '
}
]
},
 // ===== Section 4: Matroids and Greedy =====
 {
 id: 'ch16-sec04',
 title: 'Matroids & Greedy Theory',
 content: `<h2>4 and greedy </h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>When exactly do greedy algorithms work? Matroid theory provides the answer: a greedy algorithm on a weighted matroid always produces an optimal solution. This unifies Kruskal's MST (graphic matroid), scheduling, and other seemingly unrelated problems under a single theoretical framework.</p></div></div>

<p>what greedy algorithm correct? <strong> (matroid)</strong>: in maximum problem, greedy algorithm always optimal. </p>

<div class="env-block definition">
<div class="env-title">Definition 16.7 (Matroid)</div>
<div class="env-body"><p> \\(M = (S, \\mathcal{I})\\) have \\(S\\) \\(\\mathcal{I} \\subseteq 2^S\\) group, satisfy:</p>
<p>(I1) <strong>:</strong> if \\(B \\in \\mathcal{I}\\) and \\(A \\subseteq B\\), then \\(A \\in \\mathcal{I}\\). </p>
<p>(I2) <strong>swap:</strong> if \\(A, B \\in \\mathcal{I}\\) and \\(|A| <|B|\\), then there exists \\(x \\in B \\setminus A\\) \\(A \\cup \\{x\\} \\in \\mathcal{I}\\). </p></div>
</div>

<div class="env-block example">
<div class="env-title">Example 16.2 (Graphic Matroid)</div>
<div class="env-body"><p>given graph \\(G = (V, E)\\), let \\(S = E\\), \\(\\mathcal{I} = \\{A \\subseteq E: A \\text{is ()}\\}\\). this is, called<strong>graph </strong>. maximum = maximum = maximum. Kruskal algorithm is graph greedy. </p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 16.4 (Rado-Edmonds)</div>
<div class="env-body"><p>for \\(M = (S, \\mathcal{I})\\) \\(w: S \\to \\mathbb{R}^+\\), greedy algorithm (by weight sorting, in order select can element) maximum. </p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Greedy on Matroid</div>
<div class="env-body"><p>
1. \\(S\\) element by weight \\(w\\) sorting: \\(w(e_1) \\ge w(e_2) \\ge \\cdots\\)<br>
2. \\(A = \\emptyset\\)<br>
3. for \\(i = 1, 2, \\ldots, |S|\\):<br>
&nbsp;&nbsp;&nbsp;&nbsp;if \\(A \\cup \\{e_i\\} \\in \\mathcal{I}\\) then \\(A = A \\cup \\{e_i\\}\\)<br>
4. \\(A\\)
</p></div>
</div>

<div class="env-block proof">
<div class="env-title">Proof Sketch (Rado-Edmonds Theorem)</div>
<div class="env-body"><p>greedy solution \\(G = \\{g_1, g_2, \\ldots, g_k\\}\\) (by select), optimal solution \\(O = \\{o_1, \\ldots, o_m\\}\\) (by weight). first swap, \\(k = m\\) (is, size same). <br>
for each \\(i\\), use exchange argument proof \\(w(g_i) \\ge w(o_i)\\): if \\(w(g_i) <w(o_i)\\), swap can \\(o_i\\) \\(\\{g_1, \\ldots, g_{i-1}\\}\\) obtain, this and greedy choice \\(g_i\\) (\\(g_i\\) is weight maximum). therefore \\(w(G) \\ge w(O)\\). </p></div>
</div>

<div class="viz-placeholder" data-viz="ch16-viz-matroid"></div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body"><p>need in: it "greedy efficient"edge. problem can or. Activity Selection Problem not is, can through graph solution. </p></div>
</div>`,
 visualizations: [
 {
 id: 'ch16-viz-matroid',
 title: 'Graph Matroid Greedy (Kruskal)',
 description: 'in graph by weight greedy edge, ',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 400});

 var nodes = [
 {id: 0, x: 150, y: 80, label: 'A'},
 {id: 1, x: 350, y: 60, label: 'B'},
 {id: 2, x: 550, y: 80, label: 'C'},
 {id: 3, x: 120, y: 230, label: 'D'},
 {id: 4, x: 350, y: 260, label: 'E'},
 {id: 5, x: 570, y: 230, label: 'F'}
];
 var edges = [
 {u: 0, v: 1, w: 7},
 {u: 0, v: 3, w: 5},
 {u: 1, v: 2, w: 8},
 {u: 1, v: 3, w: 9},
 {u: 1, v: 4, w: 7},
 {u: 2, v: 4, w: 5},
 {u: 3, v: 4, w: 6},
 {u: 4, v: 5, w: 8},
 {u: 2, v: 5, w: 9}
];
 // Sort by weight descending for max-weight forest
 var sorted = edges.slice().sort(function(a, b) {return b.w - a.w;});
 var step = 0;
 var selected = [];
 var rejected = [];

 // Union-Find
 var parent, rank2;
 function init() {parent = []; rank2 = []; for (var i = 0; i <nodes.length; i++) {parent[i] = i; rank2[i] = 0;}}
 function find(x) {while (parent[x]!== x) {parent[x] = parent[parent[x]]; x = parent[x];} return x;}
 function union(a, b) {
 a = find(a); b = find(b);
 if (a === b) return false;
 if (rank2[a] <rank2[b]) {var t = a; a = b; b = t;}
 parent[b] = a;
 if (rank2[a] === rank2[b]) rank2[a]++;
 return true;
}

 function reset() {
 step = 0; selected = []; rejected = [];
 init();
 draw();
}

 function advance() {
 if (step>= sorted.length) return;
 var e = sorted[step];
 if (union(e.u, e.v)) {
 selected.push(step);
} else {
 rejected.push(step);
}
 step++;
 draw();
}

 function draw() {
 viz.clear();
 viz.screenText('graph greedy (by weight edge)', viz.width / 2, 18, viz.colors.white, 14, 'center');

 // Draw all edges first (unprocessed)
 for (var i = 0; i <sorted.length; i++) {
 var e = sorted[i];
 var n1 = nodes[e.u], n2 = nodes[e.v];
 var col = viz.colors.axis + '44';
 var lw = 1;
 if (selected.indexOf(i)>= 0) {
 col = viz.colors.green;
 lw = 3;
} else if (rejected.indexOf(i)>= 0) {
 col = viz.colors.red + '44';
 lw = 1;
} else if (i === step) {
 col = viz.colors.yellow;
 lw = 2.5;
}
 viz.drawEdge(n1.x, n1.y, n2.x, n2.y, col, false, e.w, lw);
}

 // Draw nodes
 for (var i = 0; i <nodes.length; i++) {
 viz.drawNode(nodes[i].x, nodes[i].y, 20, nodes[i].label, viz.colors.blue, viz.colors.white);
}

 // Edge list on right
 viz.screenText('edge (by weight):', 30, 310, viz.colors.text, 11, 'left');
 for (var i = 0; i <sorted.length; i++) {
 var e = sorted[i];
 var label = nodes[e.u].label + '-' + nodes[e.v].label + ':' + e.w;
 var tc = viz.colors.text;
 if (selected.indexOf(i)>= 0) tc = viz.colors.green;
 else if (rejected.indexOf(i)>= 0) tc = viz.colors.red;
 else if (i === step) tc = viz.colors.yellow;
 viz.screenText(label, 30 + i * 75, 330, tc, 11, 'left');
}

 var totalW = 0;
 for (var i = 0; i <selected.length; i++) {
 totalW += sorted[selected[i]].w;
}
 viz.screenText('edge: ' + selected.length + ' weight: ' + totalW, viz.width / 2, 370, viz.colors.green, 13, 'center');
}

 init();

 VizEngine.createButton(controls, '', advance);
 VizEngine.createButton(controls, '', reset);

 draw();
 return viz;
}
}
],
 exercises: [
 {
 question: 'graph satisfy two (swap). ',
 hint: ': subset also is. swap: use edge equals. ',
 solution: '(I1): is graph, graph graph still, so any edge subset also is. (I2) swap: \\(A, B\\) is and \\(|A| <|B|\\). edge = -, so \\(A\\)> \\(B\\). therefore \\(B\\) have edge \\(A\\) two different, this edge \\(A\\). '
},
 {
 question: ' \\(S = \\{1,2,3,4\\}\\), \\(\\mathcal{I} = \\{\\emptyset, \\{1\\}, \\{2\\}, \\{3\\}, \\{4\\}, \\{1,2\\}, \\{1,3\\}, \\{2,3\\}\\}\\). determine \\((S, \\mathcal{I})\\) is otherwise. ',
 hint: 'check swap: \\(|A| <|B|\\). ',
 solution: ': each subset also in \\(\\mathcal{I}\\),. swap: \\(A = \\{4\\}\\) (size 1) \\(B = \\{1,2\\}\\) (size 2). need there exists \\(x \\in B \\setminus A = \\{1,2\\}\\) \\(A \\cup \\{x\\} \\in \\mathcal{I}\\). \\(\\{4,1\\} \\notin \\mathcal{I}\\) and \\(\\{4,2\\} \\notin \\mathcal{I}\\). swap, so not is. '
},
 {
 question: 'what 0-1 knapsack problem not can use solve?',
 hint: 'feasible solution (not W item subset) is otherwise satisfy swap. ',
 solution: '0-1 knapsack row \\(\\mathcal{I} = \\{A \\subseteq S: \\sum_{i \\in A} w_i \\le W\\}\\) satisfy (subset more), not satisfy swap.: item \\(w_1 = 3, w_2 = 3, w_3 = 5\\), capacity \\(W = 6\\). \\(A = \\{3\\}\\) (5), \\(B = \\{1,2\\}\\) (6), \\(|A| <|B|\\), \\(A \\cup \\{1\\} = \\{1,3\\}\\) 8> 6 and \\(A \\cup \\{2\\} = \\{2,3\\}\\) 8> 6, swap. so knapsack row not is. '
}
]
},
 // ===== Section 5: Fractional Knapsack & When Greedy Fails =====
 {
 id: 'ch16-sec05',
 title: 'Fractional Knapsack & Greedy Limitations',
 content: `<h2>5 Fractional Knapsack and greedy </h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Greedy shines on the fractional knapsack but fails on the 0-1 knapsack. This section contrasts the two variants, revealing why the discrete nature of the 0-1 knapsack requires dynamic programming (Chapter 17) instead.</p></div></div>

<p>Fractional Knapsack Problem (fractional knapsack) item, this greedy strategy (by sorting) optimal. 0-1 knapsack not, greedy not again correct. through this two problem, I can solution greedy use. </p>

<div class="env-block definition">
<div class="env-title">Definition 16.8 (Fractional Knapsack)</div>
<div class="env-body"><p>given \\(n\\) item, item \\(i\\) value \\(v_i\\), \\(w_i\\). knapsack capacity \\(W\\). item \\(x_i \\in [0, 1]\\).: $$\\max \\sum_{i=1}^{n} v_i x_i \\quad \\text{s.t.} \\sum_{i=1}^{n} w_i x_i \\le W$$</p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Fractional Knapsack</div>
<div class="env-body"><p>
1. compute each item \\(r_i = v_i / w_i\\)<br>
2. by \\(r_i\\) sorting<br>
3. capacity \\(C = W\\), value \\(V = 0\\)<br>
4. for each item \\(i\\) (by):<br>
&nbsp;&nbsp;&nbsp;&nbsp; \\(x_i = \\min(1, C / w_i)\\) <br>
&nbsp;&nbsp;&nbsp;&nbsp;\\(V = V + v_i \\cdot x_i\\), \\(C = C - w_i \\cdot x_i\\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;if \\(C = 0\\) then break<br>
5. \\(V\\)
</p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 16.5</div>
<div class="env-body"><p>by greedy Fractional Knapsack algorithm is optimal. time complexity \\(O(n\\log n)\\). </p></div>
</div>

<div class="viz-placeholder" data-viz="ch16-viz-fractional-knapsack"></div>

<div class="env-block warning">
<div class="env-title">Warning: 0-1 Knapsack</div>
<div class="env-body"><p>in 0-1 knapsack, by greedy may optimal.: item A (value 60, 10, 6), item B (value 100, 20, 5), item C (value 120, 30, 4). capacity 50. <br>
greedy: A(10) + B(20) + 20 not C, value 160. <br>
optimal: B(20) + C(30) = 220. <br>
greedy 38%!</p></div>
</div>

<div class="viz-placeholder" data-viz="ch16-viz-greedy-fails"></div>

<div class="env-block intuition">
<div class="env-title">Intuition: When Does Greedy Fail?</div>
<div class="env-body"><p>greedy:</p>
<p>1. <strong>not partition constraint:</strong> 0-1 knapsack, because not can item, greedy may capacity. </p>
<p>2. <strong>:</strong> when select use term, path edge. </p>
<p>3. <strong>:</strong> row not satisfy swap, problem (greedy only can \\(O(\\ln n)\\)). </p>
<p>4. <strong>:</strong> not. </p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body"><p>greedy not always optimal, in NP-hard problem, greedy can . e.g. greedy \\(H_n = O(\\ln n)\\), this is term optimal (P = NP). </p></div>
</div>
<div class="env-block bridge"><div class="env-title">Looking Ahead</div><div class="env-body"><p>The 0-1 knapsack exposed greedy's limitation: when subproblems overlap and choices interact, we need dynamic programming. Chapter 17 develops DP systematically, turning overlapping subproblems from a curse into a computational advantage.</p></div></div>`,
 visualizations: [
 {
 id: 'ch16-viz-fractional-knapsack',
 title: 'Fractional Knapsack Greedy Process',
 description: 'by sorting, knapsack',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 400});
 var items = [
 {name: 'A', v: 60, w: 10},
 {name: 'B', v: 100, w: 20},
 {name: 'C', v: 120, w: 30}
];
 var W = 50;
 // Sort by value/weight ratio descending
 items.sort(function(a, b) {return (b.v / b.w) - (a.v / a.w);});
 var step = 0;
 var taken = [];

 function reset() {
 step = 0; taken = [];
 draw();
}

 function advance() {
 if (step>= items.length) return;
 var remain = W;
 for (var i = 0; i <taken.length; i++) remain -= taken[i].wTaken;
 if (remain <= 0) return;
 var it = items[step];
 var frac = Math.min(1, remain / it.w);
 taken.push({name: it.name, frac: frac, vTaken: it.v * frac, wTaken: it.w * frac});
 step++;
 draw();
}

 function draw() {
 viz.clear();
 viz.screenText('Fractional Knapsack -- by greedy', viz.width / 2, 20, viz.colors.white, 15, 'center');
 viz.screenText('knapsack capacity W = ' + W, viz.width / 2, 42, viz.colors.yellow, 13, 'center');

 // Items table
 var cols = ['item', 'value', '', ''];
 var tx = 40;
 var ty = 70;
 for (var c = 0; c <cols.length; c++) {
 viz.screenText(cols[c], tx + c * 80, ty, viz.colors.text, 11, 'left');
}
 for (var i = 0; i <items.length; i++) {
 var it = items[i];
 var highlight = i <step? viz.colors.green: (i === step? viz.colors.yellow: viz.colors.text);
 viz.screenText(it.name, tx, ty + 22 + i * 20, highlight, 12, 'left');
 viz.screenText(String(it.v), tx + 80, ty + 22 + i * 20, highlight, 12, 'left');
 viz.screenText(String(it.w), tx + 160, ty + 22 + i * 20, highlight, 12, 'left');
 viz.screenText((it.v / it.w).toFixed(1), tx + 240, ty + 22 + i * 20, highlight, 12, 'left');
}

 // Knapsack visual
 var kx = 400;
 var ky = 70;
 var kw = 200;
 var kh = 250;
 var ctx = viz.ctx;
 ctx.strokeStyle = viz.colors.axis;
 ctx.lineWidth = 2;
 ctx.strokeRect(kx, ky, kw, kh);
 viz.screenText('knapsack', kx + kw / 2, ky - 10, viz.colors.white, 12, 'center');

 // Fill knapsack
 var fillY = ky + kh;
 var totalV = 0;
 var totalW2 = 0;
 var itemColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple];
 for (var i = 0; i <taken.length; i++) {
 var t = taken[i];
 var fillH = (t.wTaken / W) * kh;
 fillY -= fillH;
 ctx.fillStyle = itemColors[i % itemColors.length] + 'aa';
 ctx.fillRect(kx + 2, fillY, kw - 4, fillH);
 var label = t.name + ' (' + (t.frac <1? (t.frac * 100).toFixed(0) + '%': '100%') + ')';
 viz.screenText(label, kx + kw / 2, fillY + fillH / 2, viz.colors.white, 11, 'center');
 totalV += t.vTaken;
 totalW2 += t.wTaken;
}

 viz.screenText(': ' + totalW2.toFixed(1) + '/' + W, kx + kw / 2, ky + kh + 20, viz.colors.text, 12, 'center');
 viz.screenText('value: ' + totalV.toFixed(1), kx + kw / 2, ky + kh + 40, viz.colors.green, 14, 'center');
}

 VizEngine.createButton(controls, '', advance);
 VizEngine.createButton(controls, '', reset);

 draw();
 return viz;
}
},
 {
 id: 'ch16-viz-greedy-fails',
 title: 'Greedy vs DP: 0-1 Knapsack Comparison',
 description: 'greedy in 0-1 knapsack ',
 setup: function(body, controls) {
 var viz = new VizEngine(body, {width: 700, height: 380});
 var items = [
 {name: 'A', v: 60, w: 10},
 {name: 'B', v: 100, w: 20},
 {name: 'C', v: 120, w: 30}
];
 var W = 50;

 function draw() {
 viz.clear();
 viz.screenText('0-1 knapsack: greedy vs optimal', viz.width / 2, 20, viz.colors.white, 15, 'center');
 viz.screenText('capacity W = ' + W, viz.width / 2, 42, viz.colors.text, 12, 'center');

 // Items info
 viz.screenText('item', 50, 75, viz.colors.text, 12, 'left');
 viz.screenText('value', 120, 75, viz.colors.text, 12, 'left');
 viz.screenText('', 180, 75, viz.colors.text, 12, 'left');
 viz.screenText('v/w', 240, 75, viz.colors.text, 12, 'left');
 for (var i = 0; i <items.length; i++) {
 viz.screenText(items[i].name, 50, 100 + i * 22, viz.colors.white, 12, 'left');
 viz.screenText(String(items[i].v), 120, 100 + i * 22, viz.colors.white, 12, 'left');
 viz.screenText(String(items[i].w), 180, 100 + i * 22, viz.colors.white, 12, 'left');
 viz.screenText((items[i].v / items[i].w).toFixed(1), 240, 100 + i * 22, viz.colors.white, 12, 'left');
}

 // Greedy solution
 var gx = 100;
 var gy = 200;
 viz.screenText('greedy solution (by v/w)', gx, gy, viz.colors.red, 13, 'left');
 viz.screenText(' A (w=10) + B (w=20) = 30, value 160', gx, gy + 25, viz.colors.red, 12, 'left');
 viz.screenText('C (w=30) not 20', gx, gy + 45, viz.colors.text, 11, 'left');

 // Draw greedy knapsack
 var ctx = viz.ctx;
 ctx.strokeStyle = viz.colors.red;
 ctx.lineWidth = 2;
 ctx.strokeRect(gx, gy + 65, 120, 80);
 ctx.fillStyle = viz.colors.blue + '88';
 ctx.fillRect(gx + 2, gy + 65 + 48, 116, 30);
 viz.screenText('A:60', gx + 60, gy + 65 + 63, viz.colors.white, 11, 'center');
 ctx.fillStyle = viz.colors.teal + '88';
 ctx.fillRect(gx + 2, gy + 67, 116, 46);
 viz.screenText('B:100', gx + 60, gy + 90, viz.colors.white, 11, 'center');
 viz.screenText('= 160', gx + 60, gy + 160, viz.colors.red, 14, 'center');

 // Optimal solution
 var ox = 400;
 viz.screenText('optimal solution (DP)', ox, gy, viz.colors.green, 13, 'left');
 viz.screenText(' B (w=20) + C (w=30) = 50, value 220', ox, gy + 25, viz.colors.green, 12, 'left');
 viz.screenText('exactly knapsack!', ox, gy + 45, viz.colors.text, 11, 'left');

 ctx.strokeStyle = viz.colors.green;
 ctx.lineWidth = 2;
 ctx.strokeRect(ox, gy + 65, 120, 80);
 ctx.fillStyle = viz.colors.teal + '88';
 ctx.fillRect(ox + 2, gy + 67, 116, 32);
 viz.screenText('B:100', ox + 60, gy + 83, viz.colors.white, 11, 'center');
 ctx.fillStyle = viz.colors.orange + '88';
 ctx.fillRect(ox + 2, gy + 99, 116, 44);
 viz.screenText('C:120', ox + 60, gy + 121, viz.colors.white, 11, 'center');
 viz.screenText('= 220', ox + 60, gy + 160, viz.colors.green, 14, 'center');

 viz.screenText('greedy ' + ((220 - 160) / 220 * 100).toFixed(0) + '%!', viz.width / 2, gy + 185, viz.colors.yellow, 14, 'center');
}

 draw();
 return viz;
}
}
],
 exercises: [
 {
 question: 'proof Fractional Knapsack greedy algorithm is optimal. ',
 hint: 'assume there exists more solution, exchange argument: more solution. ',
 solution: 'greedy solution \\(G\\), assume there exists more solution \\(O\\) \\(\\sum v_i x_i^O> \\sum v_i x_i^G\\). \\(j\\) is \\(x_j^O \\ne x_j^G\\) item (by sorting). have \\(x_j^O <x_j^G\\) (otherwise then greedy will). \\(O\\) \\(x_j\\) increase \\(\\delta\\), decrease \\(x_k\\) \\(\\delta \\cdot w_j / w_k\\) (\\(r_j \\ge r_k\\)). solution value increase \\(\\delta(v_j - v_k w_j/w_k) = \\delta w_j(r_j - r_k) \\ge 0\\)., \\(O\\) not \\(G\\). '
},
 {
 question: 'given 5 item: (v=10,w=2), (v=5,w=3), (v=15,w=5), (v=7,w=7), (v=6,w=1), (v=18,w=4), (v=3,w=1). knapsack capacity \\(W=15\\). Fractional Knapsack greedy solution. ',
 hint: 'sorting. ',
 solution: ': (10/2=5), (5/3=1.67), (15/5=3), (7/7=1), (6/1=6), (18/4=4.5), (3/1=3). sorting: 6(6/1), 5(10/2), 4.5(18/4), 3(15/5 3/1), 1.67(5/3), 1(7/7). greedy: all(6,w=1), all(10,w=2), all(18,w=4), all(15,w=5), all(3,w=1), use w=13, 2, 5 2/3, 5*2/3=3.33. = 6+10+18+15+3+3.33 = 55.33. '
},
 {
 question: 'what Activity Selection Problem can use greedy, Activity Selection not row? from"partition "solution. ',
 hint: 'not each activity same, equivalent to"partition "equal. ',
 solution: 'not Activity Selection, each activity 1, is. select end activity"", not will. this Fractional Knapsack item -- greedy efficient. Activity Selection, different activity weight different, select weight activity may multiple weight activity, 0-1 knapsack not partition item. at this point greedy choice may"", need DP. '
},
 {
 question: 'problem: given \\(U\\) subset \\(S_1, \\ldots, S_m\\), greedy each times element subset. proof greedy at most \\(H_n = \\sum_{i=1}^{n} 1/i\\) optimal solution subset (\\(n = |U|\\)). ',
 hint: 'optimal solution \\(k\\) subset. each, element at least decrease \\(1/k\\). ',
 solution: ' OPT use \\(k\\) subset all \\(n\\) element. in greedy \\(t\\), also have \\(n_t\\) element. OPT \\(k\\) subset all \\(n_t\\), so there exists subset \\(\\ge n_t / k\\). greedy at least not it, so \\(n_{t+1} \\le n_t - n_t/k = n_t(1 - 1/k)\\). \\(n_t \\le n(1-1/k)^t \\le ne^{-t/k}\\). when \\(t = k\\ln n\\), \\(n_t <1\\), all. greedy use \\(\\le k\\ln n = k \\cdot H_n\\) subset, \\(H_n\\) OPT. '
},
 {
 question: 'greedy algorithm use three,. ',
 hint: 'greedy-choice property, optimal substructure,. ',
 solution: '(1) **greedy-choice property**: there exists optimal solution contain greedy element.: Activity Selection -- optimal solution contain end activity. (2) **optimal substructure**: do greedy choice, subproblem optimal solution+greedy choice=problem optimal solution.: Huffman encoding -- merge minimum frequency, subproblem optimal+=problem optimal. (3) ****: row, greedy maximum problem optimal.: graph Kruskal MST algorithm. '
}
]
}
]
});
