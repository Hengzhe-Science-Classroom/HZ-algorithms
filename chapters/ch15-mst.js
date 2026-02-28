window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch15',
    number: 15,
    title: 'Minimum Spanning Trees',
    subtitle: 'Minimum Spanning Trees: Cut Property, Kruskal, Prim, and Boruvka',
    sections: [

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 1: Cut Property and Generic MST
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch15-sec01',
        title: '1. Cut Property & Generic MST',
        content: `
<h2>Cut Property & Generic MST</h2>

<p>
A <strong>spanning tree</strong> of a connected undirected graph \\(G = (V, E)\\) is a subgraph
that is a tree connecting all vertices. A <strong>minimum spanning tree (MST)</strong>
is a spanning tree whose total edge weight is minimized.
</p>

<div class="env-block definition">
<div class="env-title">Definition 15.1 (Spanning Tree)</div>
<div class="env-body">
<p>
For a connected undirected graph \\(G = (V, E, w)\\), a <strong>spanning tree</strong> \\(T = (V, E_T)\\)
is a subgraph that is acyclic and connected, with \\(|E_T| = |V| - 1\\).
The <strong>weight</strong> of \\(T\\) is \\(w(T) = \\sum_{e \\in E_T} w(e)\\). A <strong>minimum spanning tree</strong>
minimizes \\(w(T)\\) over all spanning trees.
</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 15.2 (Cut)</div>
<div class="env-body">
<p>
A <strong>cut</strong> \\((S, V \\setminus S)\\) of \\(G\\) is a partition of \\(V\\) into two non-empty sets.
An edge <strong>crosses</strong> the cut if its endpoints are in different sets.
An edge is a <strong>light edge</strong> crossing a cut if it has minimum weight among all crossing edges.
A cut <strong>respects</strong> a set \\(A \\subseteq E\\) if no edge in \\(A\\) crosses the cut.
</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 15.1 (Cut Property / Safe Edge Theorem)</div>
<div class="env-body">
<p>
Let \\(A\\) be a subset of some MST, and let \\((S, V \\setminus S)\\) be any cut that <strong>respects</strong> \\(A\\).
If \\(e\\) is a <strong>light edge</strong> crossing the cut, then \\(e\\) is <strong>safe</strong> for \\(A\\):
that is, \\(A \\cup \\{e\\}\\) is also a subset of some MST.
</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof (Cut-and-Paste)</div>
<div class="env-body">
<p>
Let \\(T\\) be an MST containing \\(A\\), and suppose \\(e = \\{u, v\\}\\) is a light edge crossing
\\((S, V \\setminus S)\\) that is not in \\(T\\). Adding \\(e\\) to \\(T\\) creates a unique cycle.
This cycle must contain another edge \\(e'\\) crossing the cut (since \\(u\\) and \\(v\\) are on
different sides). Since the cut respects \\(A\\), \\(e' \\notin A\\). Let \\(T' = T \\cup \\{e\\} \\setminus \\{e'\\}\\).
Then \\(T'\\) is a spanning tree with \\(w(T') = w(T) + w(e) - w(e') \\le w(T)\\) (since \\(e\\) is light).
So \\(T'\\) is also an MST, and \\(A \\cup \\{e\\} \\subseteq T'\\). \\(\\square\\)
</p>
</div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm 15.1: Generic MST</div>
<div class="env-body">
<pre>
GENERIC-MST(G, w):
    A = {}
    while A does not form a spanning tree:
        find a safe edge e for A
        A = A + {e}
    return A
</pre>
</div>
</div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body">
<p>
All classical MST algorithms (Kruskal, Prim, Boruvka) are instances of this generic algorithm.
They differ in <em>how</em> they find safe edges, but all rely on the cut property for correctness.
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch15-viz-cut"></div>

<div class="viz-placeholder" data-viz="ch15-viz-generic-mst"></div>
`,
        visualizations: [
        {
            id: 'ch15-viz-cut',
            title: 'Cut Property Demonstration',
            description: 'Explore cuts of a graph and see how the light crossing edge belongs to the MST.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 450});

                const labels = ['A','B','C','D','E','F'];
                const n = labels.length;
                const positions = [
                    [100, 120], [250, 60], [400, 60],
                    [100, 300], [250, 340], [400, 300]
                ];
                const edges = [
                    [0,1,4],[0,3,2],[1,2,6],[1,3,5],[1,4,7],
                    [2,4,3],[2,5,8],[3,4,9],[4,5,1]
                ];

                // MST edges (precomputed): {0,3}:2, {4,5}:1, {2,4}:3, {0,1}:4, {1,2}:6
                const mstEdges = new Set(['0-3','4-5','2-4','0-1','1-2']);

                let cutSet = new Set([0, 1, 2]); // S = {A, B, C}

                const cutOptions = [
                    {label: '{A,B,C} | {D,E,F}', set: [0,1,2]},
                    {label: '{A,D} | {B,C,E,F}', set: [0,3]},
                    {label: '{A} | {B,C,D,E,F}', set: [0]},
                    {label: '{A,B,D} | {C,E,F}', set: [0,1,3]}
                ];

                function draw() {
                    viz.clear();
                    viz.screenText('Cut Property: Light Crossing Edge', 350, 20, viz.colors.white, 15, 'center');

                    // Draw cut background
                    const ctx = viz.ctx;
                    ctx.fillStyle = viz.colors.blue + '15';
                    ctx.beginPath();
                    // Draw region around S vertices
                    for (let i = 0; i < n; i++) {
                        if (cutSet.has(i)) {
                            ctx.moveTo(positions[i][0] + 40, positions[i][1]);
                            ctx.arc(positions[i][0], positions[i][1], 40, 0, Math.PI * 2);
                        }
                    }
                    ctx.fill();

                    ctx.fillStyle = viz.colors.orange + '15';
                    ctx.beginPath();
                    for (let i = 0; i < n; i++) {
                        if (!cutSet.has(i)) {
                            ctx.moveTo(positions[i][0] + 40, positions[i][1]);
                            ctx.arc(positions[i][0], positions[i][1], 40, 0, Math.PI * 2);
                        }
                    }
                    ctx.fill();

                    // Find crossing edges and light edge
                    const crossingEdges = [];
                    edges.forEach(([u, v, w], idx) => {
                        if (cutSet.has(u) !== cutSet.has(v)) {
                            crossingEdges.push({u, v, w, idx});
                        }
                    });
                    let lightEdge = null;
                    let lightW = Infinity;
                    crossingEdges.forEach(e => {
                        if (e.w < lightW) { lightW = e.w; lightEdge = e; }
                    });

                    // Draw edges
                    const r = 22;
                    edges.forEach(([u, v, w], idx) => {
                        const isCrossing = cutSet.has(u) !== cutSet.has(v);
                        const isLight = lightEdge && lightEdge.idx === idx;
                        const isMST = mstEdges.has(Math.min(u,v) + '-' + Math.max(u,v));
                        let ec = viz.colors.axis + '33';
                        let lw = 1.5;
                        if (isCrossing) { ec = viz.colors.yellow + '66'; lw = 2; }
                        if (isLight) { ec = viz.colors.green; lw = 3; }
                        viz.drawEdge(positions[u][0], positions[u][1], positions[v][0], positions[v][1], ec, false, w, lw);
                        if (isMST) {
                            // Small MST indicator
                            const mx = (positions[u][0] + positions[v][0]) / 2;
                            const my = (positions[u][1] + positions[v][1]) / 2;
                            viz.screenText('*', mx + 8, my - 12, viz.colors.purple, 14, 'center');
                        }
                    });

                    // Draw nodes
                    for (let i = 0; i < n; i++) {
                        const c = cutSet.has(i) ? viz.colors.blue : viz.colors.orange;
                        viz.drawNode(positions[i][0], positions[i][1], 22, labels[i], c);
                    }

                    // Info
                    const sLabels = [];
                    const vsLabels = [];
                    for (let i = 0; i < n; i++) {
                        if (cutSet.has(i)) sLabels.push(labels[i]);
                        else vsLabels.push(labels[i]);
                    }
                    viz.screenText('S = {' + sLabels.join(',') + '}', 150, 400, viz.colors.blue, 12, 'center');
                    viz.screenText('V\\S = {' + vsLabels.join(',') + '}', 400, 400, viz.colors.orange, 12, 'center');

                    viz.screenText('Crossing edges: ' + crossingEdges.length, 350, 420, viz.colors.text, 11, 'center');
                    if (lightEdge) {
                        viz.screenText('Light edge: {' + labels[lightEdge.u] + ',' + labels[lightEdge.v] + '} w=' + lightEdge.w + ' (green)',
                            350, 440, viz.colors.green, 12, 'center');
                    }

                    viz.screenText('* = MST edge', 600, 400, viz.colors.purple, 10, 'center');
                }

                VizEngine.createSelect(controls, 'Cut:', cutOptions.map(o => ({value: o.label, label: o.label})), function(v) {
                    const opt = cutOptions.find(o => o.label === v);
                    cutSet = new Set(opt.set);
                    draw();
                });

                draw();
                return viz;
            }
        },
        {
            id: 'ch15-viz-generic-mst',
            title: 'Generic MST Algorithm',
            description: 'Build the MST edge by edge using safe edges from the cut property.',
            setup: function(body, controls) {
                var viz = new VizEngine(body, {width: 700, height: 420});

                var labels = ['A','B','C','D','E','F'];
                var n = labels.length;
                var positions = [
                    [100, 120], [250, 60], [400, 60],
                    [100, 300], [250, 340], [400, 300]
                ];
                var edges = [
                    [0,1,4],[0,3,2],[1,2,6],[1,3,5],[1,4,7],
                    [2,4,3],[2,5,8],[3,4,9],[4,5,1]
                ];

                // Precompute MST using Kruskal for reference
                var sortedE = edges.map(function(e, i) { return {u: e[0], v: e[1], w: e[2], idx: i}; });
                sortedE.sort(function(a, b) { return a.w - b.w; });

                var parent = [];
                var mstOrder = [];

                function makeSet() {
                    parent = [];
                    for (var i = 0; i < n; i++) parent.push(i);
                }

                function find(x) {
                    while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
                    return x;
                }

                function union(x, y) {
                    var rx = find(x), ry = find(y);
                    if (rx === ry) return false;
                    parent[ry] = rx;
                    return true;
                }

                function computeMST() {
                    makeSet();
                    mstOrder = [];
                    for (var i = 0; i < sortedE.length; i++) {
                        var e = sortedE[i];
                        if (find(e.u) !== find(e.v)) {
                            union(e.u, e.v);
                            mstOrder.push(e.idx);
                        }
                    }
                }
                computeMST();

                var step = 0;
                var totalWeight = 0;

                function reset() {
                    step = 0;
                    totalWeight = 0;
                }

                function draw() {
                    viz.clear();
                    viz.screenText('Generic MST: Adding Safe Edges', 350, 18, viz.colors.white, 15, 'center');

                    var currentMST = mstOrder.slice(0, step);
                    var tw = 0;
                    for (var i = 0; i < currentMST.length; i++) tw += edges[currentMST[i]][2];

                    viz.screenText('MST edges: ' + step + '/' + (n - 1) + ' | weight: ' + tw, 350, 40, viz.colors.yellow, 12, 'center');

                    // Determine current components
                    var cParent = [];
                    for (var i = 0; i < n; i++) cParent.push(i);
                    function cFind(x) { while (cParent[x] !== x) { cParent[x] = cParent[cParent[x]]; x = cParent[x]; } return x; }
                    function cUnion(x, y) { cParent[cFind(x)] = cFind(y); }
                    for (var i = 0; i < currentMST.length; i++) {
                        var e = edges[currentMST[i]];
                        cUnion(e[0], e[1]);
                    }

                    // Draw edges
                    var r = 22;
                    var mstSet = {};
                    for (var i = 0; i < currentMST.length; i++) mstSet[currentMST[i]] = true;
                    var nextEdge = step < mstOrder.length ? mstOrder[step] : -1;

                    for (var i = 0; i < edges.length; i++) {
                        var u = edges[i][0], v = edges[i][1], w = edges[i][2];
                        var ec = viz.colors.axis + '33';
                        var lw = 1;
                        if (mstSet[i]) { ec = viz.colors.green; lw = 3; }
                        if (i === nextEdge) { ec = viz.colors.yellow; lw = 3; }
                        viz.drawEdge(positions[u][0], positions[u][1], positions[v][0], positions[v][1], ec, false, w, lw);
                    }

                    // Draw nodes colored by component
                    var compColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.pink, viz.colors.green];
                    var compMap = {};
                    var ci = 0;
                    for (var i = 0; i < n; i++) {
                        var root = cFind(i);
                        if (compMap[root] === undefined) compMap[root] = ci++;
                    }
                    for (var i = 0; i < n; i++) {
                        var cc = compMap[cFind(i)] || 0;
                        viz.drawNode(positions[i][0], positions[i][1], r, labels[i], compColors[cc % compColors.length]);
                    }

                    // Show next safe edge info
                    if (nextEdge >= 0) {
                        var ne = edges[nextEdge];
                        viz.screenText('Next safe edge: {' + labels[ne[0]] + ',' + labels[ne[1]] + '} w=' + ne[2], 350, 395, viz.colors.yellow, 12, 'center');
                        viz.screenText('This edge crosses the cut between two components (safe by cut property)', 350, 412, viz.colors.text, 10, 'center');
                    } else if (step >= n - 1) {
                        viz.screenText('MST complete!', 350, 395, viz.colors.green, 14, 'center');
                    }
                }

                VizEngine.createButton(controls, 'Reset', function() { reset(); draw(); });
                VizEngine.createButton(controls, 'Add Safe Edge', function() { if (step < mstOrder.length) step++; draw(); });
                VizEngine.createButton(controls, 'Build All', function() { step = mstOrder.length; draw(); });

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Prove that if all edge weights are distinct, the MST is unique.',
                hint: 'Suppose two MSTs \\(T_1, T_2\\) differ. Consider the lightest edge in \\(T_1 \\triangle T_2\\).',
                solution: 'Suppose \\(T_1 \\ne T_2\\) are both MSTs with distinct weights. Let \\(e\\) be the minimum-weight edge in \\(T_1 \\triangle T_2\\). WLOG \\(e \\in T_1 \\setminus T_2\\). Adding \\(e\\) to \\(T_2\\) creates a cycle \\(C\\). Some edge \\(e\' \\in C \\setminus T_1\\) must exist (otherwise \\(T_1\\) would contain a cycle). Since \\(e\' \\in T_2 \\setminus T_1\\) and \\(e\\) has minimum weight in the symmetric difference, \\(w(e) < w(e\')\\). Then \\(T_2\' = T_2 \\cup \\{e\\} \\setminus \\{e\'\\}\\) has \\(w(T_2\') < w(T_2)\\), contradicting \\(T_2\\) being an MST.'
            },
            {
                question: 'Show that every MST edge is a light edge across some cut.',
                hint: 'Removing an MST edge splits the tree into two components, defining a cut.',
                solution: 'Let \\(e = \\{u, v\\}\\) be an MST edge. Removing \\(e\\) from the MST splits it into two components \\(S\\) and \\(V \\setminus S\\). This defines a cut, and \\(e\\) crosses it. If \\(e\\) were not light, some lighter edge \\(e\'\\) crosses the same cut. Then \\(T \\cup \\{e\'\\} \\setminus \\{e\\}\\) would be a spanning tree with smaller weight, contradicting optimality. So \\(e\\) must be light across this cut.'
            },
            {
                question: 'Can a graph have multiple MSTs? When?',
                hint: 'Duplicate edge weights can lead to ties in the cut property.',
                solution: 'Yes, when there are ties in edge weights. Specifically, a graph has a unique MST if and only if for every cut, the minimum-weight crossing edge is unique. If two edges crossing a cut have the same minimum weight, either could be chosen, potentially yielding different MSTs with the same total weight.'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 2: Kruskal's Algorithm
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch15-sec02',
        title: '2. Kruskal\'s Algorithm',
        content: `
<h2>Kruskal's Algorithm with Union-Find</h2>

<p>
Kruskal's algorithm builds the MST by processing edges in order of <strong>increasing weight</strong>,
adding an edge if it does not create a cycle. Cycle detection is efficiently handled
by a <strong>union-find</strong> (disjoint set) data structure.
</p>

<div class="env-block algorithm">
<div class="env-title">Algorithm 15.2: Kruskal(G)</div>
<div class="env-body">
<pre>
KRUSKAL(G, w):
    A = {}
    for each v in V:
        MAKE-SET(v)
    sort edges E by weight w
    for each (u, v) in sorted E:
        if FIND(u) != FIND(v):
            A = A + {(u, v)}
            UNION(u, v)
    return A
</pre>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 15.2 (Kruskal Correctness)</div>
<div class="env-body">
<p>
Kruskal's algorithm is an instance of the generic MST algorithm. When considering edge \\(e = \\{u, v\\}\\)
where \\(u\\) and \\(v\\) are in different components, let \\(S\\) be the component containing \\(u\\).
Then \\((S, V \\setminus S)\\) is a cut respecting \\(A\\), and \\(e\\) is the lightest crossing edge
(since all lighter edges have already been considered and either added or rejected).
By the cut property, \\(e\\) is safe.
</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Complexity</div>
<div class="env-body">
<p>
Sorting: \\(O(m \\log m) = O(m \\log n)\\).
Union-Find operations: \\(O(m \\cdot \\alpha(n))\\) with union by rank and path compression,
where \\(\\alpha\\) is the inverse Ackermann function (effectively constant).
Total: \\(O(m \\log n)\\).
</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Union-Find Operations</div>
<div class="env-body">
<p>
<strong>MAKE-SET(x)</strong>: Create a singleton set \\(\\{x\\}\\).<br>
<strong>FIND(x)</strong>: Return the representative of the set containing \\(x\\). Uses <strong>path compression</strong>.<br>
<strong>UNION(x, y)</strong>: Merge the sets containing \\(x\\) and \\(y\\). Uses <strong>union by rank</strong>.
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch15-viz-kruskal"></div>
`,
        visualizations: [
        {
            id: 'ch15-viz-kruskal',
            title: 'Kruskal\'s Algorithm with Union-Find',
            description: 'Watch Kruskal process sorted edges and grow the MST, with union-find state shown.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 480});

                const labels = ['A','B','C','D','E','F','G'];
                const n = labels.length;
                const positions = [
                    [100, 120], [250, 50], [400, 50],
                    [550, 120], [450, 250], [250, 280], [100, 280]
                ];
                const edges = [
                    [0,1,7],[0,6,5],[1,2,8],[1,5,9],[1,6,7],
                    [2,3,5],[2,4,7],[3,4,6],[4,5,8],[4,6,11],[5,6,6]
                ];

                // Sort edges by weight
                const sorted = edges.map((e, i) => ({u: e[0], v: e[1], w: e[2], idx: i}));
                sorted.sort((a, b) => a.w - b.w);

                // Build Kruskal steps
                let steps = [];
                function buildKruskal() {
                    steps = [];
                    const parent = Array.from({length: n}, (_, i) => i);
                    const rank = Array(n).fill(0);
                    const mstEdges = [];
                    const rejected = [];

                    function find(x) {
                        if (parent[x] !== x) parent[x] = find(parent[x]);
                        return parent[x];
                    }
                    function union(x, y) {
                        const px = find(x), py = find(y);
                        if (px === py) return false;
                        if (rank[px] < rank[py]) parent[px] = py;
                        else if (rank[px] > rank[py]) parent[py] = px;
                        else { parent[py] = px; rank[px]++; }
                        return true;
                    }

                    steps.push({mst: [], rejected: [], current: null, parent: [...parent], components: n});

                    for (const e of sorted) {
                        const pu = find(e.u), pv = find(e.v);
                        if (pu !== pv) {
                            union(e.u, e.v);
                            mstEdges.push(e);
                            steps.push({mst: [...mstEdges], rejected: [...rejected], current: e, action: 'add', parent: parent.map((_, i) => find(i)), components: steps[steps.length-1].components - 1});
                        } else {
                            rejected.push(e);
                            steps.push({mst: [...mstEdges], rejected: [...rejected], current: e, action: 'reject', parent: parent.map((_, i) => find(i)), components: steps[steps.length-1].components});
                        }
                    }
                }
                buildKruskal();

                let step = 0;

                function draw() {
                    viz.clear();
                    const state = steps[step];
                    viz.screenText('Kruskal\'s Algorithm (step ' + step + '/' + (steps.length - 1) + ')', 350, 20, viz.colors.white, 15, 'center');

                    const mstSet = new Set(state.mst.map(e => e.idx));
                    const rejSet = new Set(state.rejected.map(e => e.idx));

                    // Draw edges
                    edges.forEach(([u, v, w], idx) => {
                        let ec = viz.colors.axis + '22';
                        let lw = 1;
                        if (mstSet.has(idx)) { ec = viz.colors.green; lw = 3; }
                        else if (rejSet.has(idx)) { ec = viz.colors.red + '44'; lw = 1; }
                        if (state.current && state.current.idx === idx) {
                            ec = state.action === 'add' ? viz.colors.yellow : viz.colors.red;
                            lw = 3;
                        }
                        viz.drawEdge(positions[u][0], positions[u][1], positions[v][0], positions[v][1], ec, false, w, lw);
                    });

                    // Color components
                    const compColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.pink, viz.colors.green, viz.colors.red];
                    const compMap = {};
                    let compIdx = 0;
                    for (let i = 0; i < n; i++) {
                        const p = state.parent[i];
                        if (!(p in compMap)) compMap[p] = compIdx++;
                    }

                    // Draw nodes
                    for (let i = 0; i < n; i++) {
                        const ci = compMap[state.parent[i]] || 0;
                        viz.drawNode(positions[i][0], positions[i][1], 22, labels[i], compColors[ci % compColors.length]);
                    }

                    // Edge processing order
                    viz.screenText('Sorted edges:', 50, 370, viz.colors.text, 11, 'left');
                    const startIdx = Math.max(0, step - 4);
                    for (let i = startIdx; i < Math.min(sorted.length, startIdx + 8); i++) {
                        const e = sorted[i];
                        let color = viz.colors.text;
                        if (mstSet.has(e.idx)) color = viz.colors.green;
                        else if (rejSet.has(e.idx)) color = viz.colors.red;
                        const marker = i < step ? (mstSet.has(e.idx) ? 'V' : 'X') : ' ';
                        viz.screenText(marker + ' {' + labels[e.u] + ',' + labels[e.v] + '}:' + e.w,
                            50 + (i - startIdx) * 85, 390, color, 10, 'left');
                    }

                    // Status
                    if (state.current) {
                        const act = state.action === 'add' ? 'ADD' : 'REJECT (cycle)';
                        viz.screenText('Edge {' + labels[state.current.u] + ',' + labels[state.current.v] + '} w=' + state.current.w + ': ' + act,
                            350, 420, state.action === 'add' ? viz.colors.green : viz.colors.red, 13, 'center');
                    }
                    viz.screenText('Components: ' + state.components, 350, 445, viz.colors.text, 11, 'center');

                    // MST weight
                    const mstWeight = state.mst.reduce((s, e) => s + e.w, 0);
                    viz.screenText('MST weight: ' + mstWeight, 600, 370, viz.colors.yellow, 12, 'left');
                }

                VizEngine.createButton(controls, 'Reset', function() { step = 0; draw(); });
                VizEngine.createButton(controls, 'Step', function() { if (step < steps.length - 1) { step++; draw(); } });
                VizEngine.createButton(controls, 'Run All', function() { step = steps.length - 1; draw(); });

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Run Kruskal\'s algorithm on the graph with edges \\(\\{(A,B,1),(B,C,4),(A,C,3),(C,D,2),(B,D,5)\\}\\). Give the MST edges.',
                hint: 'Sort: (A,B,1), (C,D,2), (A,C,3), (B,C,4), (B,D,5).',
                solution: 'Sorted order: (A,B,1), (C,D,2), (A,C,3), (B,C,4), (B,D,5). Step 1: Add (A,B,1). Step 2: Add (C,D,2). Step 3: Add (A,C,3) - connects components {A,B} and {C,D}. Step 4: Reject (B,C,4) - cycle. Step 5: Reject (B,D,5) - cycle. MST = {(A,B,1), (C,D,2), (A,C,3)}, weight = 6.'
            },
            {
                question: 'What is the time complexity of Kruskal\'s algorithm if we use a simpler union-find without path compression?',
                hint: 'Without path compression, FIND takes \\(O(\\log n)\\) with union by rank.',
                solution: 'With union by rank but no path compression, each FIND takes \\(O(\\log n)\\). There are \\(O(m)\\) FIND operations (two per edge), giving \\(O(m \\log n)\\) for union-find. Sorting is also \\(O(m \\log n)\\). Total: \\(O(m \\log n)\\), same as with full optimization (since sorting dominates). Path compression improves the union-find to \\(O(m \\alpha(n))\\), but the overall complexity is still \\(O(m \\log n)\\) due to sorting.'
            },
            {
                question: 'Can Kruskal\'s algorithm be adapted to find the maximum spanning tree?',
                hint: 'Sort edges in decreasing order of weight.',
                solution: 'Yes. Sort edges in <strong>decreasing</strong> order of weight and apply the same algorithm. Each added edge is the heaviest edge that does not create a cycle. This works because the cut property applies symmetrically: the heaviest crossing edge of any cut belongs to some maximum spanning tree.'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 3: Prim's Algorithm
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch15-sec03',
        title: '3. Prim\'s Algorithm',
        content: `
<h2>Prim's Algorithm with Priority Queue</h2>

<p>
Prim's algorithm grows a single MST tree from a starting vertex, repeatedly adding the
<strong>cheapest edge</strong> connecting the tree to a non-tree vertex. It resembles Dijkstra's algorithm
but uses edge weights (not cumulative distances) as keys.
</p>

<div class="env-block algorithm">
<div class="env-title">Algorithm 15.3: Prim(G, r)</div>
<div class="env-body">
<pre>
PRIM(G, w, r):
    for each v in V:
        key[v] = INF; pi[v] = NIL; inMST[v] = false
    key[r] = 0
    Q = min-priority-queue(V, key)
    while Q is not empty:
        u = EXTRACT-MIN(Q)
        inMST[u] = true
        for each v in Adj[u]:
            if not inMST[v] and w(u,v) < key[v]:
                key[v] = w(u, v)
                pi[v] = u
                DECREASE-KEY(Q, v, key[v])
    return {(v, pi[v]) : v != r}
</pre>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 15.3 (Prim Correctness)</div>
<div class="env-body">
<p>
At each step, the set of tree vertices \\(S\\) and non-tree vertices \\(V \\setminus S\\) form a cut.
The extracted vertex \\(u\\) is connected by the minimum-weight edge crossing this cut.
By the cut property, this edge is safe. Hence Prim's algorithm produces an MST.
</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Complexity</div>
<div class="env-body">
<p>
With binary min-heap: \\(O((n + m) \\log n)\\).<br>
With Fibonacci heap: \\(O(m + n \\log n)\\).<br>
With array (no heap): \\(O(n^2)\\) — optimal for dense graphs.
</p>
</div>
</div>

<div class="env-block remark">
<div class="env-title">Prim vs. Kruskal</div>
<div class="env-body">
<p>
Prim grows one tree; Kruskal grows a forest. Prim is better for dense graphs (especially with
\\(O(n^2)\\) array implementation). Kruskal is better for sparse graphs and is simpler to implement
with a good union-find. Both run in \\(O(m \\log n)\\) with heaps.
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch15-viz-prim"></div>
`,
        visualizations: [
        {
            id: 'ch15-viz-prim',
            title: 'Prim\'s Growing Tree',
            description: 'Watch the MST grow from a starting vertex, with the priority queue showing cheapest connections.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 480});

                const labels = ['A','B','C','D','E','F','G'];
                const n = labels.length;
                const positions = [
                    [100, 120], [250, 50], [400, 50],
                    [550, 120], [450, 250], [250, 280], [100, 280]
                ];
                const edges = [
                    [0,1,7],[0,6,5],[1,2,8],[1,5,9],[1,6,7],
                    [2,3,5],[2,4,7],[3,4,6],[4,5,8],[4,6,11],[5,6,6]
                ];
                const adjL = Array.from({length: n}, () => []);
                edges.forEach(([u,v,w], idx) => {
                    adjL[u].push({v, w, idx});
                    adjL[v].push({u: v, v: u, w, idx}); // undirected: also store reverse
                });
                // Fix: store correctly for undirected
                const adjList = Array.from({length: n}, () => []);
                edges.forEach(([u,v,w], idx) => {
                    adjList[u].push({to: v, w, idx});
                    adjList[v].push({to: u, w, idx});
                });

                // Build Prim steps
                let steps = [];
                function buildPrim() {
                    steps = [];
                    const key = Array(n).fill(Infinity);
                    const parent = Array(n).fill(-1);
                    const inMST = Array(n).fill(false);
                    const mstEdgeIdxs = [];
                    key[0] = 0;

                    steps.push({key: [...key], parent: [...parent], inMST: [...inMST], mstEdges: [...mstEdgeIdxs], current: -1});

                    for (let iter = 0; iter < n; iter++) {
                        // Find min key not in MST
                        let u = -1, minK = Infinity;
                        for (let v = 0; v < n; v++) {
                            if (!inMST[v] && key[v] < minK) {
                                minK = key[v];
                                u = v;
                            }
                        }
                        if (u === -1) break;
                        inMST[u] = true;

                        // Find the MST edge
                        if (parent[u] !== -1) {
                            const e = edges.findIndex(([a,b,w]) =>
                                ((a === u && b === parent[u]) || (a === parent[u] && b === u)) && w === key[u]
                            );
                            if (e >= 0) mstEdgeIdxs.push(e);
                        }

                        // Relax neighbors
                        for (const {to: v, w} of adjList[u]) {
                            if (!inMST[v] && w < key[v]) {
                                key[v] = w;
                                parent[v] = u;
                            }
                        }

                        steps.push({key: [...key], parent: [...parent], inMST: [...inMST], mstEdges: [...mstEdgeIdxs], current: u});
                    }
                }
                buildPrim();

                let step = 0;

                function draw() {
                    viz.clear();
                    const state = steps[step];
                    viz.screenText('Prim\'s Algorithm (step ' + step + '/' + (steps.length - 1) + ')', 350, 20, viz.colors.white, 15, 'center');

                    const mstSet = new Set(state.mstEdges);

                    // Draw edges
                    edges.forEach(([u, v, w], idx) => {
                        let ec = viz.colors.axis + '22';
                        let lw = 1;
                        if (mstSet.has(idx)) { ec = viz.colors.green; lw = 3; }
                        // Highlight frontier edges
                        if (!mstSet.has(idx) && ((state.inMST[u] && !state.inMST[v]) || (!state.inMST[u] && state.inMST[v]))) {
                            ec = viz.colors.yellow + '66';
                            lw = 2;
                        }
                        viz.drawEdge(positions[u][0], positions[u][1], positions[v][0], positions[v][1], ec, false, w, lw);
                    });

                    // Draw nodes
                    for (let i = 0; i < n; i++) {
                        let c = viz.colors.axis + '44';
                        if (state.inMST[i]) c = viz.colors.blue;
                        if (state.current === i) c = viz.colors.yellow;
                        viz.drawNode(positions[i][0], positions[i][1], 22, labels[i], c);
                        const kStr = state.key[i] === Infinity ? 'INF' : String(state.key[i]);
                        viz.screenText('key=' + kStr, positions[i][0], positions[i][1] + 34, viz.colors.yellow, 10, 'center');
                    }

                    // Priority queue (non-MST vertices sorted by key)
                    const pq = [];
                    for (let i = 0; i < n; i++) {
                        if (!state.inMST[i]) pq.push(i);
                    }
                    pq.sort((a, b) => state.key[a] - state.key[b]);

                    viz.screenText('Priority Queue:', 50, 385, viz.colors.teal, 12, 'left');
                    for (let i = 0; i < pq.length; i++) {
                        const v = pq[i];
                        const kStr = state.key[v] === Infinity ? 'INF' : String(state.key[v]);
                        viz.drawArrayCell(50 + i * 70, 400, 65, 26,
                            labels[v] + ':' + kStr,
                            i === 0 ? viz.colors.yellow + '33' : viz.colors.teal + '22', viz.colors.white);
                    }

                    // MST weight
                    const mstWeight = state.mstEdges.reduce((s, idx) => s + edges[idx][2], 0);
                    viz.screenText('MST weight so far: ' + mstWeight, 350, 445, viz.colors.green, 12, 'center');

                    // Current action
                    if (state.current >= 0) {
                        viz.screenText('Extract: ' + labels[state.current] + ' (key=' + state.key[state.current] + ')',
                            350, 462, viz.colors.yellow, 11, 'center');
                    }
                }

                VizEngine.createButton(controls, 'Reset', function() { step = 0; draw(); });
                VizEngine.createButton(controls, 'Step', function() { if (step < steps.length - 1) { step++; draw(); } });
                VizEngine.createButton(controls, 'Run All', function() { step = steps.length - 1; draw(); });

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Run Prim\'s algorithm starting from vertex A on the graph with edges \\(\\{(A,B,2),(A,C,3),(B,C,1),(B,D,4),(C,D,5)\\}\\).',
                hint: 'Start with tree = {A}. Cheapest connection: (A,B,2).',
                solution: 'Step 1: Tree = {A}. Extract A. Update: key[B]=2, key[C]=3. Step 2: Extract B (key=2). Add edge (A,B). Update: key[C]=min(3,1)=1, key[D]=4. Step 3: Extract C (key=1). Add edge (B,C). Update: key[D]=min(4,5)=4. Step 4: Extract D (key=4). Add edge (B,D). MST = {(A,B,2), (B,C,1), (B,D,4)}, weight = 7.'
            },
            {
                question: 'Explain why Prim\'s key[v] stores the weight of the cheapest edge connecting v to the current tree, not the total path weight from the root.',
                hint: 'Compare with Dijkstra, which stores cumulative distance.',
                solution: 'In MST construction, we want the minimum-weight edge crossing the cut between the tree and non-tree vertices. The total path weight from the root is irrelevant; only the single edge connecting a non-tree vertex to the tree matters. Storing the cheapest such edge as key[v] directly implements the cut property: the vertex with minimum key is connected by the lightest crossing edge, which is safe to add. If we stored cumulative distances (like Dijkstra), we would get a shortest-path tree, not an MST.'
            },
            {
                question: 'For a dense graph with \\(m = \\Theta(n^2)\\), which implementation of Prim is fastest?',
                hint: 'Compare \\(O(n^2)\\) (array) vs. \\(O((n+m)\\log n) = O(n^2 \\log n)\\) (binary heap) vs. \\(O(m + n \\log n) = O(n^2)\\) (Fibonacci heap).',
                solution: 'The simple array implementation is \\(O(n^2)\\), which matches the Fibonacci heap at \\(O(m + n \\log n) = O(n^2)\\) but with much smaller constants. The binary heap gives \\(O(n^2 \\log n)\\), which is worse. So for dense graphs, the \\(O(n^2)\\) array-based Prim (scanning all vertices to find the minimum key) is preferred due to simplicity and optimal practical performance.'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 4: Boruvka's Algorithm
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch15-sec04',
        title: '4. Boruvka\'s Algorithm',
        content: `
<h2>Boruvka's Algorithm</h2>

<p>
Boruvka's algorithm (1926) is the oldest MST algorithm. In each <strong>phase</strong>,
every connected component selects its <strong>lightest outgoing edge</strong>,
and all selected edges are added simultaneously. The number of components
halves each phase, so \\(O(\\log n)\\) phases suffice.
</p>

<div class="env-block algorithm">
<div class="env-title">Algorithm 15.4: Boruvka(G)</div>
<div class="env-body">
<pre>
BORUVKA(G, w):
    initialize each vertex as its own component
    A = {}
    while number of components > 1:
        for each component C:
            find the lightest edge leaving C
            mark it for addition
        add all marked edges to A
        merge components connected by new edges
    return A
</pre>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 15.4</div>
<div class="env-body">
<p>
Boruvka's algorithm correctly computes an MST in \\(O(m \\log n)\\) time.
Each phase takes \\(O(m)\\) time (scanning all edges to find lightest outgoing edges).
After each phase, the number of components decreases by at least half, giving \\(O(\\log n)\\) phases.
</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Correctness</div>
<div class="env-body">
<p>
Each component \\(C\\) defines a cut \\((C, V \\setminus C)\\). The lightest edge leaving \\(C\\) is the
light edge crossing this cut. By the cut property, it is safe for the current MST subset.
Adding all such edges simultaneously is valid because each safe edge can be added independently
(the cut property does not require sequential processing).
</p>
</div>
</div>

<div class="env-block remark">
<div class="env-title">Historical Note & Parallelism</div>
<div class="env-body">
<p>
Boruvka's algorithm (1926) predates both Kruskal (1956) and Prim (1957).
Its phase-based structure makes it highly <strong>parallelizable</strong>: within each phase,
all components can find their lightest edges in parallel. It is also the basis of
many randomized and near-linear-time MST algorithms.
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch15-viz-boruvka"></div>
`,
        visualizations: [
        {
            id: 'ch15-viz-boruvka',
            title: 'Boruvka\'s Phase-Based MST',
            description: 'Watch components simultaneously select cheapest edges in each phase.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 450});

                const labels = ['A','B','C','D','E','F'];
                const n = labels.length;
                const positions = [
                    [100, 100], [260, 60], [420, 100],
                    [100, 280], [260, 320], [420, 280]
                ];
                const edges = [
                    [0,1,4],[0,3,1],[1,2,6],[1,3,5],[1,4,3],
                    [2,4,7],[2,5,2],[3,4,8],[4,5,9]
                ];

                // Build Boruvka phases
                let phases = [];
                function buildBoruvka() {
                    phases = [];
                    const parent = Array.from({length: n}, (_, i) => i);
                    const mstEdges = [];

                    function find(x) {
                        if (parent[x] !== x) parent[x] = find(parent[x]);
                        return parent[x];
                    }
                    function union(x, y) {
                        const px = find(x), py = find(y);
                        if (px === py) return;
                        parent[px] = py;
                    }

                    let numComponents = n;
                    phases.push({mstEdges: [...mstEdges], parent: Array.from({length: n}, (_, i) => find(i)), numComponents, selectedEdges: [], phase: 0});

                    let phaseNum = 0;
                    while (numComponents > 1) {
                        phaseNum++;
                        // For each component, find lightest outgoing edge
                        const cheapest = {}; // comp -> edge
                        for (const [u, v, w] of edges) {
                            const pu = find(u), pv = find(v);
                            if (pu === pv) continue;
                            if (!(pu in cheapest) || w < cheapest[pu].w) cheapest[pu] = {u, v, w};
                            if (!(pv in cheapest) || w < cheapest[pv].w) cheapest[pv] = {u, v, w};
                        }

                        const selected = [];
                        const addedSet = new Set();
                        for (const comp in cheapest) {
                            const e = cheapest[comp];
                            const key = Math.min(e.u, e.v) + '-' + Math.max(e.u, e.v);
                            if (!addedSet.has(key)) {
                                addedSet.add(key);
                                selected.push(e);
                                if (find(e.u) !== find(e.v)) {
                                    union(e.u, e.v);
                                    mstEdges.push(e);
                                    numComponents--;
                                }
                            }
                        }

                        phases.push({mstEdges: [...mstEdges], parent: Array.from({length: n}, (_, i) => find(i)), numComponents, selectedEdges: selected, phase: phaseNum});
                    }
                }
                buildBoruvka();

                let phase = 0;

                function draw() {
                    viz.clear();
                    const state = phases[phase];
                    viz.screenText('Boruvka Phase ' + state.phase + ' (components: ' + state.numComponents + ')', 350, 20, viz.colors.white, 15, 'center');

                    const mstSet = new Set(state.mstEdges.map(e => Math.min(e.u,e.v) + '-' + Math.max(e.u,e.v)));
                    const selSet = new Set(state.selectedEdges.map(e => Math.min(e.u,e.v) + '-' + Math.max(e.u,e.v)));

                    // Draw edges
                    edges.forEach(([u, v, w]) => {
                        const key = Math.min(u,v) + '-' + Math.max(u,v);
                        let ec = viz.colors.axis + '22';
                        let lw = 1;
                        if (mstSet.has(key)) { ec = viz.colors.green; lw = 3; }
                        if (selSet.has(key) && !mstSet.has(key)) { ec = viz.colors.yellow; lw = 3; }
                        if (selSet.has(key) && mstSet.has(key)) { ec = viz.colors.yellow; lw = 3; }
                        viz.drawEdge(positions[u][0], positions[u][1], positions[v][0], positions[v][1], ec, false, w, lw);
                    });

                    // Color components
                    const compColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.pink, viz.colors.green];
                    const compMap = {};
                    let ci = 0;
                    for (let i = 0; i < n; i++) {
                        const p = state.parent[i];
                        if (!(p in compMap)) compMap[p] = ci++;
                    }

                    for (let i = 0; i < n; i++) {
                        const cc = compMap[state.parent[i]] || 0;
                        viz.drawNode(positions[i][0], positions[i][1], 22, labels[i], compColors[cc % compColors.length]);
                    }

                    // Selected edges
                    if (state.selectedEdges.length > 0) {
                        viz.screenText('Selected cheapest edges this phase:', 50, 380, viz.colors.yellow, 12, 'left');
                        state.selectedEdges.forEach((e, i) => {
                            viz.screenText('{' + labels[e.u] + ',' + labels[e.v] + '} w=' + e.w,
                                50 + i * 130, 400, viz.colors.yellow, 11, 'left');
                        });
                    }

                    // MST weight
                    const mstWeight = state.mstEdges.reduce((s, e) => s + e.w, 0);
                    viz.screenText('MST weight: ' + mstWeight, 350, 430, viz.colors.green, 12, 'center');
                }

                VizEngine.createButton(controls, 'Reset', function() { phase = 0; draw(); });
                VizEngine.createButton(controls, 'Next Phase', function() { if (phase < phases.length - 1) { phase++; draw(); } });
                VizEngine.createButton(controls, 'All Phases', function() { phase = phases.length - 1; draw(); });

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Why does the number of components decrease by at least half in each Boruvka phase?',
                hint: 'Each component selects at least one edge, connecting it to another component.',
                solution: 'In each phase, every component selects its cheapest outgoing edge, connecting it to at least one other component. When two components are merged, the resulting component "covers" at least 2 original components. In the worst case, components pair up exactly (each pair merges via one edge), halving the count. So after phase \\(k\\), there are at most \\(n / 2^k\\) components, giving \\(\\lceil \\log_2 n \\rceil\\) phases.'
            },
            {
                question: 'Can two components select the same edge in a Boruvka phase? Does this cause any issues?',
                hint: 'If edge \\(\\{u,v\\}\\) is cheapest for both the component of \\(u\\) and the component of \\(v\\), both select it.',
                solution: 'Yes, two components can (and often do) select the same edge. If \\(\\{u,v\\}\\) is the cheapest outgoing edge for both components containing \\(u\\) and \\(v\\) respectively, both select it. This is not a problem: the edge is simply added once to the MST, merging the two components. The implementation must deduplicate to avoid counting the edge twice.'
            },
            {
                question: 'Compare Boruvka, Kruskal, and Prim in terms of parallelizability.',
                hint: 'Which algorithm has independent operations that can execute simultaneously?',
                solution: 'Boruvka is the most parallelizable: in each phase, all components can find their cheapest outgoing edge independently (embarrassingly parallel). Prim is inherently sequential (each step depends on the previous extraction). Kruskal is partially parallelizable (edges can be sorted in parallel, but the union-find processing is sequential). Boruvka achieves \\(O(\\log n)\\) parallel rounds with \\(O(m)\\) work per round, making it the basis for parallel MST algorithms.'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 5: Correctness Proofs & MST Properties
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch15-sec05',
        title: '5. Correctness & MST Properties',
        content: `
<h2>Correctness Proofs & MST Properties</h2>

<h3>5.1 Cycle Property</h3>

<div class="env-block theorem">
<div class="env-title">Theorem 15.5 (Cycle Property)</div>
<div class="env-body">
<p>
For any cycle \\(C\\) in \\(G\\), the <strong>maximum-weight edge</strong> in \\(C\\) (if unique)
does <strong>not</strong> belong to any MST.
</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof</div>
<div class="env-body">
<p>
Let \\(e\\) be the unique maximum-weight edge in cycle \\(C\\), and suppose \\(e \\in T\\) for some MST \\(T\\).
Removing \\(e\\) splits \\(T\\) into two components, defining a cut. Some other edge \\(e'\\) of \\(C\\)
must cross this cut (since \\(C - \\{e\\}\\) still connects the endpoints).
Since \\(w(e') < w(e)\\), \\(T' = T \\cup \\{e'\\} \\setminus \\{e\\}\\) is a spanning tree with \\(w(T') < w(T)\\),
contradicting the optimality of \\(T\\). \\(\\square\\)
</p>
</div>
</div>

<h3>5.2 Uniqueness</h3>

<div class="env-block theorem">
<div class="env-title">Theorem 15.6 (Uniqueness with Distinct Weights)</div>
<div class="env-body">
<p>
If all edge weights are distinct, the MST is unique.
</p>
</div>
</div>

<h3>5.3 Bottleneck Spanning Tree</h3>

<div class="env-block definition">
<div class="env-title">Definition 15.3 (Bottleneck Spanning Tree)</div>
<div class="env-body">
<p>
A <strong>bottleneck spanning tree</strong> minimizes the maximum edge weight (the "bottleneck"):
\\(T^* = \\arg\\min_T \\max_{e \\in T} w(e)\\).
</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 15.7</div>
<div class="env-body">
<p>
Every MST is a bottleneck spanning tree (but not vice versa).
</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof Sketch</div>
<div class="env-body">
<p>
Let \\(T\\) be an MST and \\(T'\\) be any other spanning tree. We show \\(\\max_{e \\in T} w(e) \\le \\max_{e \\in T'} w(e)\\).
Consider the heaviest edge \\(e = \\{u,v\\}\\) in \\(T\\). The path from \\(u\\) to \\(v\\) in \\(T'\\) must
use at least one edge not in \\(T\\). By the cycle property applied to \\(T \\cup \\{\\text{any edge of that path}\\}\\),
each such edge has weight \\(\\ge w(e)\\) (otherwise \\(T\\) wouldn't be an MST). So \\(T'\\) also
contains an edge of weight \\(\\ge w(e)\\).
</p>
</div>
</div>

<h3>5.4 MST and Shortest Paths</h3>

<div class="env-block warning">
<div class="env-title">Warning: MST \\(\\ne\\) Shortest Paths</div>
<div class="env-body">
<p>
The MST does <strong>not</strong> generally minimize the distance between any particular pair of vertices.
Example: triangle with weights 1, 1, 1.5. The MST removes the 1.5 edge, but the shortest path
between its endpoints uses that edge. MST minimizes <em>total</em> weight, not individual distances.
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch15-viz-race"></div>

<div class="viz-placeholder" data-viz="ch15-viz-cycle-property"></div>

<div class="viz-placeholder" data-viz="ch15-viz-edge-update"></div>
`,
        visualizations: [
        {
            id: 'ch15-viz-race',
            title: 'Kruskal vs. Prim Race',
            description: 'Watch both algorithms build the MST on the same graph side by side.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 450});

                const labels = ['A','B','C','D','E'];
                const n = labels.length;
                // Two copies of the same graph
                const posL = [[50,120],[140,60],[230,60],[230,180],[140,200]];
                const posR = [[420,120],[510,60],[600,60],[600,180],[510,200]];
                const edges = [[0,1,2],[0,4,3],[1,2,1],[1,4,4],[2,3,5],[3,4,6]];

                // Kruskal
                const sorted = edges.map((e,i) => ({...e, u:e[0], v:e[1], w:e[2], idx:i})).sort((a,b) => a.w - b.w);
                // Fix: need proper structure
                const sortedEdges = edges.map(([u,v,w], i) => ({u,v,w,idx:i}));
                sortedEdges.sort((a,b) => a.w - b.w);

                let kruskalMST = [];
                let primMST = [];

                function buildBoth() {
                    // Kruskal
                    kruskalMST = [];
                    const kParent = Array.from({length: n}, (_,i) => i);
                    function kFind(x) { return kParent[x] === x ? x : (kParent[x] = kFind(kParent[x])); }
                    function kUnion(x,y) { kParent[kFind(x)] = kFind(y); }
                    const kSteps = [[]];
                    for (const e of sortedEdges) {
                        if (kFind(e.u) !== kFind(e.v)) {
                            kUnion(e.u, e.v);
                            kruskalMST.push(e.idx);
                            kSteps.push([...kruskalMST]);
                        }
                    }

                    // Prim
                    primMST = [];
                    const pKey = Array(n).fill(Infinity);
                    const pPar = Array(n).fill(-1);
                    const pInMST = Array(n).fill(false);
                    pKey[0] = 0;
                    const pSteps = [[]];
                    const adjList = Array.from({length: n}, () => []);
                    edges.forEach(([u,v,w], idx) => {
                        adjList[u].push({to:v, w, idx});
                        adjList[v].push({to:u, w, idx});
                    });

                    for (let iter = 0; iter < n; iter++) {
                        let u = -1, minK = Infinity;
                        for (let v = 0; v < n; v++) {
                            if (!pInMST[v] && pKey[v] < minK) { minK = pKey[v]; u = v; }
                        }
                        if (u === -1) break;
                        pInMST[u] = true;
                        if (pPar[u] !== -1) {
                            const eIdx = edges.findIndex(([a,b,w]) =>
                                ((a===u && b===pPar[u]) || (a===pPar[u] && b===u)) && w === pKey[u]
                            );
                            if (eIdx >= 0) primMST.push(eIdx);
                        }
                        for (const {to:v, w} of adjList[u]) {
                            if (!pInMST[v] && w < pKey[v]) { pKey[v] = w; pPar[v] = u; }
                        }
                        pSteps.push([...primMST]);
                    }

                    return {kSteps, pSteps};
                }

                const {kSteps, pSteps} = buildBoth();
                const maxSteps = Math.max(kSteps.length, pSteps.length);
                let step = 0;

                function drawGraph(pos, mstSet, title, x) {
                    viz.screenText(title, x + 90, 40, viz.colors.white, 13, 'center');
                    edges.forEach(([u, v, w], idx) => {
                        let ec = viz.colors.axis + '22';
                        let lw = 1;
                        if (mstSet.has(idx)) { ec = viz.colors.green; lw = 3; }
                        viz.drawEdge(pos[u][0], pos[u][1], pos[v][0], pos[v][1], ec, false, w, lw);
                    });
                    for (let i = 0; i < n; i++) {
                        viz.drawNode(pos[i][0], pos[i][1], 18, labels[i], viz.colors.blue);
                    }
                }

                function draw() {
                    viz.clear();
                    viz.screenText('Kruskal vs. Prim Race (step ' + step + ')', 350, 15, viz.colors.white, 15, 'center');

                    const kIdx = Math.min(step, kSteps.length - 1);
                    const pIdx = Math.min(step, pSteps.length - 1);

                    drawGraph(posL, new Set(kSteps[kIdx]), 'Kruskal', 50);
                    drawGraph(posR, new Set(pSteps[pIdx]), 'Prim (from A)', 420);

                    // Divider
                    const ctx = viz.ctx;
                    ctx.strokeStyle = viz.colors.axis;
                    ctx.lineWidth = 1;
                    ctx.setLineDash([4,4]);
                    ctx.beginPath(); ctx.moveTo(340, 30); ctx.lineTo(340, 290); ctx.stroke();
                    ctx.setLineDash([]);

                    // Kruskal info
                    const kw = kSteps[kIdx].reduce((s, idx) => s + edges[idx][2], 0);
                    viz.screenText('Kruskal edges: ' + kSteps[kIdx].length + ', weight: ' + kw, 170, 280, viz.colors.green, 11, 'center');

                    // Prim info
                    const pw = pSteps[pIdx].reduce((s, idx) => s + edges[idx][2], 0);
                    viz.screenText('Prim edges: ' + pSteps[pIdx].length + ', weight: ' + pw, 530, 280, viz.colors.green, 11, 'center');

                    // Both produce same MST
                    if (step >= maxSteps - 1) {
                        viz.screenText('Both algorithms produce the same MST!', 350, 310, viz.colors.yellow, 14, 'center');
                    }

                    // Strategy comparison
                    viz.screenText('Kruskal: global edge sorting', 170, 350, viz.colors.teal, 11, 'center');
                    viz.screenText('Prim: local tree growth', 530, 350, viz.colors.teal, 11, 'center');
                }

                VizEngine.createButton(controls, 'Reset', function() { step = 0; draw(); });
                VizEngine.createButton(controls, 'Step', function() { if (step < maxSteps - 1) { step++; draw(); } });
                VizEngine.createButton(controls, 'Run All', function() { step = maxSteps - 1; draw(); });

                draw();
                return viz;
            }
        },
        {
            id: 'ch15-viz-cycle-property',
            title: 'Cycle Property Demonstrator',
            description: 'Select a cycle in the graph and see that its heaviest edge is not in the MST.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 380});

                const labels = ['A','B','C','D','E'];
                const n = labels.length;
                const positions = [[100,140],[260,60],[420,60],[420,240],[260,240]];
                const edges = [[0,1,3],[1,2,5],[2,3,2],[3,4,4],[4,0,6],[1,4,7],[1,3,8]];

                // MST (precomputed): edges with weights 2,3,4,5 = total 14
                const mstEdges = new Set([0, 1, 2, 3]); // (A,B,3), (B,C,5), (C,D,2), (D,E,4)

                const cycles = [
                    {name: 'A-B-E-A', verts: [0,1,4,0], edgeIdxs: [0,5,4]},
                    {name: 'B-C-D-E-B', verts: [1,2,3,4,1], edgeIdxs: [1,2,3,5]},
                    {name: 'A-B-D-E-A', verts: [0,1,3,4,0], edgeIdxs: [0,6,3,4]},
                ];

                let selectedCycle = 0;

                function draw() {
                    viz.clear();
                    viz.screenText('Cycle Property: Heaviest Edge Not in MST', 350, 20, viz.colors.white, 15, 'center');

                    const cycle = cycles[selectedCycle];
                    const cycleEdgeSet = new Set(cycle.edgeIdxs);
                    let maxW = -1, maxIdx = -1;
                    cycle.edgeIdxs.forEach(idx => {
                        if (edges[idx][2] > maxW) { maxW = edges[idx][2]; maxIdx = idx; }
                    });

                    // Draw edges
                    edges.forEach(([u, v, w], idx) => {
                        let ec = viz.colors.axis + '33';
                        let lw = 1;
                        if (cycleEdgeSet.has(idx)) {
                            ec = idx === maxIdx ? viz.colors.red : viz.colors.yellow;
                            lw = idx === maxIdx ? 4 : 2.5;
                        }
                        if (mstEdges.has(idx)) {
                            const ctx = viz.ctx;
                            // Draw MST indicator
                            const mx = (positions[u][0] + positions[v][0]) / 2;
                            const my = (positions[u][1] + positions[v][1]) / 2;
                            ctx.fillStyle = viz.colors.green + '22';
                            ctx.beginPath();
                            ctx.arc(mx, my, 12, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        viz.drawEdge(positions[u][0], positions[u][1], positions[v][0], positions[v][1], ec, false, w, lw);
                    });

                    // Draw nodes
                    for (let i = 0; i < n; i++) {
                        viz.drawNode(positions[i][0], positions[i][1], 22, labels[i], viz.colors.blue);
                    }

                    // Info
                    viz.screenText('Cycle: ' + cycle.name, 100, 330, viz.colors.yellow, 13, 'left');
                    viz.screenText('Heaviest edge in cycle: w=' + maxW + ' (red)', 100, 355, viz.colors.red, 12, 'left');
                    const inMST = mstEdges.has(maxIdx);
                    viz.screenText('In MST? ' + (inMST ? 'YES (violation!)' : 'NO (as expected)'),
                        450, 355, inMST ? viz.colors.red : viz.colors.green, 12, 'left');
                    viz.screenText('Green circles = MST edges', 450, 330, viz.colors.green, 11, 'left');
                }

                VizEngine.createSelect(controls, 'Cycle:', cycles.map((c, i) => ({value: String(i), label: c.name})), function(v) {
                    selectedCycle = parseInt(v);
                    draw();
                });

                draw();
                return viz;
            }
        },
        {
            id: 'ch15-viz-edge-update',
            title: 'MST Edge Update',
            description: 'See how the MST changes when a new edge is added or an edge weight decreases.',
            setup: function(body, controls) {
                var viz = new VizEngine(body, {width: 700, height: 420});

                var labels = ['A','B','C','D','E','F'];
                var n = labels.length;
                var positions = [
                    [100, 120], [280, 60], [460, 120],
                    [100, 300], [280, 340], [460, 300]
                ];
                // Original graph
                var edges = [
                    [0,1,4],[0,3,2],[1,2,6],[1,3,5],[1,4,7],
                    [2,4,3],[2,5,8],[3,4,9],[4,5,1]
                ];
                // MST: {4,5}:1, {0,3}:2, {2,4}:3, {0,1}:4, {1,2}:6
                var mstIndices = [8, 1, 5, 0, 2]; // sorted by weight for display

                // Scenarios: add a new edge or decrease a weight
                var scenarios = [
                    {name: 'Add edge (D,F) w=3', action: 'add', edge: [3,5,3], desc: 'New edge creates cycle D-E-F-C-B-D'},
                    {name: 'Decrease (B,C) to w=2', action: 'decrease', edgeIdx: 2, newW: 2, desc: 'Was w=6, now w=2. Path B-A-D-E-C forms cycle.'},
                    {name: 'Add edge (A,E) w=10', action: 'add', edge: [0,4,10], desc: 'Too heavy; MST unchanged'}
                ];
                var scenIdx = 0;
                var showUpdate = false;

                function computeMST(edgeList) {
                    var se = edgeList.map(function(e, i) { return {u: e[0], v: e[1], w: e[2], idx: i}; });
                    se.sort(function(a, b) { return a.w - b.w; });
                    var p = [];
                    for (var i = 0; i < n; i++) p.push(i);
                    function f(x) { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; }
                    var mst = [];
                    for (var i = 0; i < se.length; i++) {
                        var ru = f(se[i].u), rv = f(se[i].v);
                        if (ru !== rv) { p[ru] = rv; mst.push(se[i].idx); }
                    }
                    return mst;
                }

                function draw() {
                    viz.clear();
                    var sc = scenarios[scenIdx];
                    viz.screenText('MST Edge Update', 350, 18, viz.colors.white, 15, 'center');
                    viz.screenText(sc.name, 350, 40, viz.colors.yellow, 13, 'center');

                    // Build current edge list
                    var curEdges = edges.slice();
                    if (sc.action === 'decrease') {
                        curEdges = curEdges.map(function(e, i) {
                            if (i === sc.edgeIdx) return [e[0], e[1], sc.newW];
                            return e;
                        });
                    }

                    var originalMST = computeMST(edges);
                    var newEdges = curEdges.slice();
                    if (sc.action === 'add') {
                        newEdges.push(sc.edge);
                    }
                    var updatedMST = computeMST(newEdges);

                    var displayMST = showUpdate ? updatedMST : originalMST;
                    var displayEdges = showUpdate ? newEdges : edges;
                    var mstSet = {};
                    for (var i = 0; i < displayMST.length; i++) mstSet[displayMST[i]] = true;

                    var r = 20;
                    // Draw edges
                    for (var i = 0; i < displayEdges.length; i++) {
                        var e = displayEdges[i];
                        var u = e[0], v = e[1], w = e[2];
                        var ec = viz.colors.axis + '44';
                        var lw = 1.5;
                        if (mstSet[i]) { ec = viz.colors.green; lw = 3; }
                        // Highlight the new/changed edge
                        if (showUpdate && sc.action === 'add' && i === displayEdges.length - 1) {
                            ec = mstSet[i] ? viz.colors.orange : viz.colors.red;
                            lw = 3;
                        }
                        if (showUpdate && sc.action === 'decrease' && i === sc.edgeIdx) {
                            ec = mstSet[i] ? viz.colors.orange : viz.colors.red;
                            lw = 3;
                        }
                        viz.drawEdge(positions[u][0], positions[u][1], positions[v][0], positions[v][1], ec, false, w, lw);
                    }

                    // Draw nodes
                    for (var i = 0; i < n; i++) {
                        viz.drawNode(positions[i][0], positions[i][1], r, labels[i], viz.colors.blue, viz.colors.white);
                    }

                    // MST weight
                    var tw = 0;
                    for (var i = 0; i < displayMST.length; i++) tw += displayEdges[displayMST[i]][2];
                    viz.screenText('MST weight: ' + tw, 350, 385, viz.colors.green, 12, 'center');
                    viz.screenText(showUpdate ? 'After update' : 'Before update', 350, 400, showUpdate ? viz.colors.orange : viz.colors.text, 11, 'center');
                    viz.screenText(sc.desc, 350, 415, viz.colors.text, 10, 'center');
                }

                VizEngine.createButton(controls, 'Prev Scenario', function() {
                    scenIdx = (scenIdx - 1 + scenarios.length) % scenarios.length;
                    showUpdate = false;
                    draw();
                });
                VizEngine.createButton(controls, 'Next Scenario', function() {
                    scenIdx = (scenIdx + 1) % scenarios.length;
                    showUpdate = false;
                    draw();
                });
                VizEngine.createButton(controls, 'Toggle Update', function() {
                    showUpdate = !showUpdate;
                    draw();
                });

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Prove the cycle property: if \\(e\\) is the unique heaviest edge in a cycle \\(C\\), then \\(e\\) is not in any MST.',
                hint: 'Assume \\(e \\in T\\) for some MST, remove \\(e\\), and replace it with a lighter cycle edge.',
                solution: 'Suppose \\(e = \\{u,v\\}\\) is the unique heaviest edge in cycle \\(C\\) and \\(e \\in T\\) for some MST \\(T\\). Removing \\(e\\) from \\(T\\) splits it into components \\(T_u\\) and \\(T_v\\). The remaining edges of \\(C\\) form a path from \\(u\\) to \\(v\\), so some edge \\(e\'\\) of this path crosses the cut \\((T_u, T_v)\\). Since \\(e\\) is the unique heaviest in \\(C\\), \\(w(e\') < w(e)\\). Then \\(T\' = T \\cup \\{e\'\\} \\setminus \\{e\\}\\) is a spanning tree with \\(w(T\') < w(T)\\), contradicting \\(T\\) being an MST.'
            },
            {
                question: 'Show that every MST is a bottleneck spanning tree.',
                hint: 'For any non-MST spanning tree \\(T\'\\), show its bottleneck is at least as large as the MST\'s.',
                solution: 'Let \\(T\\) be an MST and \\(T\'\\) any spanning tree. Let \\(e = \\max_{e \\in T} w(e)\\) be the MST bottleneck. Suppose \\(\\max_{e \\in T\'} w(e) < w(e)\\). Then all edges of \\(T\'\\) have weight \\(< w(e)\\). But \\(e\\) is in \\(T\\) and removing it creates a cut. The path in \\(T\'\\) connecting the endpoints of \\(e\\) must cross this cut. By the cut property, \\(e\\) is the light edge for this cut. But if all edges of \\(T\'\\) weigh less than \\(e\\), some edge of \\(T\'\\) crossing this cut weighs less than \\(e\\), meaning \\(e\\) is not the light edge, contradicting \\(T\\) being an MST.'
            },
            {
                question: 'Give a graph where the MST is different from the shortest-path tree from any source.',
                hint: 'Consider a triangle.',
                solution: 'Triangle A-B-C with weights: w(A,B) = 3, w(B,C) = 3, w(A,C) = 5. MST: {(A,B,3), (B,C,3)}, total weight 6. Shortest-path tree from A: {(A,B,3), (A,C,5)}, since the shortest path A->C uses the direct edge (weight 5) rather than A->B->C (weight 6). The SPT has total weight 8, which is larger than the MST.'
            },
            {
                question: 'Design an algorithm to update the MST when a new edge is added to the graph.',
                hint: 'Adding edge \\(\\{u,v\\}\\) to the MST creates a cycle. Apply the cycle property.',
                solution: 'When adding edge \\(e = \\{u,v,w\\}\\): (1) Find the path from \\(u\\) to \\(v\\) in the current MST \\(T\\) (BFS/DFS in \\(O(n)\\)). (2) Find the maximum-weight edge \\(e\'\\) on this path. (3) If \\(w(e) < w(e\')\\), replace: \\(T\' = T \\cup \\{e\\} \\setminus \\{e\'\\}\\). If \\(w(e) \\ge w(e\')\\), the MST is unchanged (\\(e\\) is the heaviest in the cycle, so by the cycle property it is not in any MST). Time: \\(O(n)\\).'
            },
            {
                question: 'Prove that the second-best MST differs from the best MST by exactly one edge swap.',
                hint: 'Show that the second-best MST can be obtained by swapping one MST edge for one non-MST edge.',
                solution: 'Let \\(T\\) be the MST and \\(T\'\\) the second-best MST. Consider the symmetric difference \\(T \\triangle T\'\\). Both are spanning trees with \\(n-1\\) edges, so \\(|T \\triangle T\'|\\) is even. Suppose \\(|T \\triangle T\'| > 2\\). Take the minimum-weight edge \\(e \\in T\' \\setminus T\\). Adding \\(e\\) to \\(T\\) creates a cycle; the heaviest non-\\(e\\) edge \\(f\\) in this cycle is in \\(T \\setminus T\'\\) (otherwise \\(T\\) would contain a cycle). Then \\(T\'\' = T \\cup \\{e\\} \\setminus \\{f\\}\\) satisfies \\(w(T) \\le w(T\'\') \\le w(T\')\\) and \\(T\'\' \\ne T\\). If \\(w(T\'\') < w(T\')\\), this contradicts \\(T\'\\) being second-best. If equal, \\(T\'\'\\) is also second-best with a smaller symmetric difference with \\(T\\). By induction, some second-best MST differs from \\(T\\) by exactly one swap.'
            },
            {
                question: 'What is the time complexity of finding the MST if the edge weights are integers in the range \\([1, W]\\)?',
                hint: 'Kruskal\'s bottleneck is sorting. Integer sorting can be done faster.',
                solution: 'With integer weights in \\([1, W]\\), we can sort edges using counting sort in \\(O(m + W)\\) time. Kruskal then runs in \\(O(m + W + m \\alpha(n)) = O(m + W)\\). For \\(W = O(m)\\), this gives \\(O(m \\alpha(n))\\), which is nearly linear. For small \\(W\\) (constant), the MST can be found in \\(O(m \\alpha(n))\\) time, essentially linear.'
            }
        ]
    }
    ]
});
