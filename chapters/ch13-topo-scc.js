window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch13',
    number: 13,
    title: 'Topological Sort & Strongly Connected Components',
    subtitle: 'Topological Sort & Strongly Connected Components',
    sections: [

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 1: DAGs and Properties
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch13-sec01',
        title: '1. DAGs and Properties',
        content: `
<h2>Directed Acyclic Graphs</h2>
<div class="env-block bridge"><div class="env-title">Chapter Overview</div><div class="env-body"><p>Chapter 12 introduced BFS and DFS as exploration tools. Now we harness DFS to solve two fundamental structural problems: topological sorting of directed acyclic graphs (DAGs) and finding strongly connected components (SCCs) of general directed graphs. Topological sort orders tasks so that dependencies are respected; SCC decomposition reveals the coarse structure of a directed graph. Both rely on the discovery/finish time structure of DFS.</p></div></div>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>We begin by formally defining DAGs and establishing their key properties. A directed graph is a DAG if and only if it has no back edges (from Chapter 12's edge classification), and every DAG admits a topological ordering.</p></div></div>


<p>
A <strong>directed acyclic graph (DAG)</strong> is a directed graph with no cycles.
DAGs arise naturally in dependency modeling: course prerequisites, build systems, task scheduling,
and causal networks. Many efficient algorithms exploit the DAG structure.
</p>

<div class="env-block definition">
<div class="env-title">Definition 13.1 (DAG)</div>
<div class="env-body">
<p>
A directed graph \\(G = (V, E)\\) is a <strong>DAG</strong> if it contains no directed cycle,
i.e., no sequence of distinct vertices \\(v_1, v_2, \\ldots, v_k\\) with edges
\\(v_1 \\to v_2 \\to \\cdots \\to v_k \\to v_1\\).
</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 13.1</div>
<div class="env-body">
<p>A directed graph is a DAG if and only if DFS produces no back edges.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 13.2 (Topological Order)</div>
<div class="env-body">
<p>
A <strong>topological ordering</strong> of a DAG \\(G = (V, E)\\) is a linear ordering
of all vertices such that for every edge \\((u, v) \\in E\\), vertex \\(u\\) appears before \\(v\\)
in the ordering. Equivalently, it is a bijection \\(\\sigma: V \\to \\{1, \\ldots, n\\}\\) such that
\\((u, v) \\in E \\implies \\sigma(u) < \\sigma(v)\\).
</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 13.2</div>
<div class="env-body">
<p>
A directed graph admits a topological ordering if and only if it is a DAG.
Moreover, every DAG has at least one vertex with in-degree 0 (a <strong>source</strong>).
</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof (Source Existence)</div>
<div class="env-body">
<p>
Suppose every vertex has in-degree \\(\\ge 1\\). Start at any vertex \\(v_0\\), follow an incoming edge
to \\(v_1\\), then to \\(v_2\\), etc. Since \\(V\\) is finite, this walk must revisit some vertex,
forming a cycle. Contradiction with DAG. Hence some vertex has in-degree 0.
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch13-viz-dag"></div>
`,
        visualizations: [
        {
            id: 'ch13-viz-dag',
            title: 'DAG Visualizer',
            description: 'Explore a DAG and its properties: sources, sinks, and topological layers.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 420});

                const labels = ['A','B','C','D','E','F','G','H'];
                const n = labels.length;
                const edges = [[0,1],[0,2],[1,3],[1,4],[2,4],[2,5],[3,6],[4,6],[4,7],[5,7]];
                const adjL = Array.from({length: n}, () => []);
                const inDeg = Array(n).fill(0);
                edges.forEach(([u,v]) => { adjL[u].push(v); inDeg[v]++; });

                // Compute topological layers (longest path from a source)
                const layer = Array(n).fill(0);
                // BFS-based layering
                const q = [];
                const indCopy = [...inDeg];
                for (let i = 0; i < n; i++) if (indCopy[i] === 0) q.push(i);
                let qi = 0;
                while (qi < q.length) {
                    const u = q[qi++];
                    for (const v of adjL[u]) {
                        layer[v] = Math.max(layer[v], layer[u] + 1);
                        indCopy[v]--;
                        if (indCopy[v] === 0) q.push(v);
                    }
                }

                const maxLayer = Math.max(...layer);
                const layerNodes = Array.from({length: maxLayer + 1}, () => []);
                for (let i = 0; i < n; i++) layerNodes[layer[i]].push(i);

                // Position by layer
                const positions = Array(n);
                for (let l = 0; l <= maxLayer; l++) {
                    const count = layerNodes[l].length;
                    for (let i = 0; i < count; i++) {
                        const v = layerNodes[l][i];
                        positions[v] = [100 + l * 140, 80 + (i + 0.5) * (280 / count)];
                    }
                }

                function draw() {
                    viz.clear();
                    viz.screenText('DAG Properties', 350, 20, viz.colors.white, 15, 'center');

                    // Layer backgrounds
                    for (let l = 0; l <= maxLayer; l++) {
                        const ctx = viz.ctx;
                        ctx.fillStyle = l % 2 === 0 ? '#1a1a40' + '33' : '#2a2a50' + '33';
                        ctx.fillRect(45 + l * 140, 40, 130, 320);
                        viz.screenText('Layer ' + l, 110 + l * 140, 55, viz.colors.text, 10, 'center');
                    }

                    // Draw edges
                    const r = 20;
                    edges.forEach(([u, v]) => {
                        const dx = positions[v][0] - positions[u][0];
                        const dy = positions[v][1] - positions[u][1];
                        const len = Math.sqrt(dx*dx + dy*dy);
                        const ux1 = dx/len, uy1 = dy/len;
                        viz.drawEdge(
                            positions[u][0] + ux1*r, positions[u][1] + uy1*r,
                            positions[v][0] - ux1*r, positions[v][1] - uy1*r,
                            viz.colors.axis, true
                        );
                    });

                    // Draw nodes
                    for (let i = 0; i < n; i++) {
                        let c = viz.colors.blue;
                        if (inDeg[i] === 0) c = viz.colors.green; // source
                        if (adjL[i].length === 0) c = viz.colors.orange; // sink
                        viz.drawNode(positions[i][0], positions[i][1], 20, labels[i], c);
                    }

                    // Legend
                    viz.screenText('Sources (in-deg 0)', 600, 380, viz.colors.green, 11, 'center');
                    viz.screenText('Sinks (out-deg 0)', 600, 400, viz.colors.orange, 11, 'center');
                }

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Prove that every DAG has at least one sink (vertex with out-degree 0).',
                hint: 'Mirror the source argument: follow outgoing edges from any vertex.',
                solution: 'Suppose every vertex has out-degree \\(\\ge 1\\). Start at any vertex \\(v_0\\), follow an outgoing edge to \\(v_1\\), then to \\(v_2\\), etc. Since \\(V\\) is finite, we must revisit a vertex, creating a directed cycle. This contradicts the DAG property. Hence some vertex has out-degree 0.'
            },
            {
                question: 'How many topological orderings does a path graph \\(v_1 \\to v_2 \\to \\cdots \\to v_n\\) have?',
                hint: 'Each vertex has a unique position forced by the path structure.',
                solution: 'Exactly 1. The ordering \\(v_1, v_2, \\ldots, v_n\\) is the only valid topological order since each \\(v_i\\) must precede \\(v_{i+1}\\).'
            },
            {
                question: 'What is the maximum number of edges a DAG on \\(n\\) vertices can have?',
                hint: 'In a topological order, each vertex can have edges only to later vertices.',
                solution: 'Fix a topological ordering. Vertex at position \\(i\\) can have edges to positions \\(i+1, \\ldots, n\\). Maximum edges: \\(\\sum_{i=1}^{n-1}(n-i) = \\binom{n}{2} = \\frac{n(n-1)}{2}\\).'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 2: Topological Sort via DFS
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch13-sec02',
        title: '2. Topological Sort via DFS',
        content: `
<h2>Topological Sort via DFS</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>The DFS-based topological sort is elegant: run DFS on the entire graph and output vertices in reverse order of their finish times. We prove correctness using the parenthesis theorem and the property that finish times decrease along DAG edges.</p></div></div>


<p>
The simplest topological sort algorithm runs DFS and outputs vertices in
<strong>reverse finish-time order</strong>. When a vertex is finished (colored black),
it is prepended to the output list.
</p>

<div class="env-block algorithm">
<div class="env-title">Algorithm 13.1: Topological Sort (DFS)</div>
<div class="env-body">
<pre>
TOPOLOGICAL-SORT(G):
    L = empty list
    for each v in V:
        color[v] = WHITE
    for each v in V:
        if color[v] == WHITE:
            DFS-TOPO(G, v, L)
    return L

DFS-TOPO(G, u, L):
    color[u] = GRAY
    for each v in Adj[u]:
        if color[v] == WHITE:
            DFS-TOPO(G, v, L)
        elif color[v] == GRAY:
            error "cycle detected"
    color[u] = BLACK
    L.prepend(u)  // push to front
</pre>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 13.3 (Correctness)</div>
<div class="env-body">
<p>
For any edge \\((u, v)\\) in a DAG, \\(f[u] > f[v]\\) (where \\(f\\) is the DFS finish time).
Therefore, reverse finish-time order is a valid topological ordering.
</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof</div>
<div class="env-body">
<p>
Consider edge \\((u, v)\\). When DFS explores \\((u, v)\\), \\(v\\) is either white, gray, or black.
If gray, then \\(v\\) is an ancestor of \\(u\\), giving a cycle (impossible in a DAG).
If white, then \\(v\\) becomes a descendant of \\(u\\), so \\(f[v] < f[u]\\).
If black, then \\(v\\) already finished, so \\(f[v] < f[u]\\).
In all valid cases, \\(f[u] > f[v]\\). \\(\\square\\)
</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Complexity</div>
<div class="env-body">
<p>Time: \\(O(n + m)\\). Space: \\(O(n)\\).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch13-viz-topo-dfs"></div>
`,
        visualizations: [
        {
            id: 'ch13-viz-topo-dfs',
            title: 'DFS-Based Topological Sort',
            description: 'Step through DFS on a DAG and watch the topological order build in reverse finish-time.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 450});

                const labels = ['A','B','C','D','E','F','G'];
                const n = labels.length;
                const edges = [[0,1],[0,2],[1,3],[2,3],[2,5],[3,4],[5,4],[5,6]];
                const adjL = Array.from({length: n}, () => []);
                edges.forEach(([u,v]) => { adjL[u].push(v); });

                const positions = [
                    [80, 120], [200, 60], [200, 200],
                    [340, 120], [480, 120], [340, 260], [480, 260]
                ];

                // Run DFS and record steps
                let steps = [];
                let topoOrder = [];
                function buildDFS() {
                    steps = [];
                    topoOrder = [];
                    const color = Array(n).fill(0);
                    let time = 0;
                    const d = Array(n).fill(0);
                    const f = Array(n).fill(0);

                    function visit(u) {
                        time++;
                        d[u] = time;
                        color[u] = 1;
                        steps.push({type: 'discover', v: u, colors: [...color], d: [...d], f: [...f], topo: [...topoOrder]});
                        for (const v of adjL[u]) {
                            if (color[v] === 0) {
                                visit(v);
                            }
                        }
                        time++;
                        f[u] = time;
                        color[u] = 2;
                        topoOrder.unshift(u);
                        steps.push({type: 'finish', v: u, colors: [...color], d: [...d], f: [...f], topo: [...topoOrder]});
                    }
                    for (let i = 0; i < n; i++) {
                        if (color[i] === 0) visit(i);
                    }
                }
                buildDFS();

                let step = 0;

                function draw() {
                    viz.clear();
                    viz.screenText('DFS Topological Sort (step ' + step + '/' + steps.length + ')', 350, 20, viz.colors.white, 15, 'center');

                    let curState = step > 0 ? steps[step - 1] : null;
                    const curColors = curState ? curState.colors : Array(n).fill(0);
                    const curTopo = curState ? curState.topo : [];

                    // Draw edges
                    const r = 20;
                    edges.forEach(([u, v]) => {
                        const dx = positions[v][0] - positions[u][0];
                        const dy = positions[v][1] - positions[u][1];
                        const len = Math.sqrt(dx*dx + dy*dy);
                        const ux1 = dx/len, uy1 = dy/len;
                        viz.drawEdge(
                            positions[u][0] + ux1*r, positions[u][1] + uy1*r,
                            positions[v][0] - ux1*r, positions[v][1] - uy1*r,
                            viz.colors.axis + '66', true
                        );
                    });

                    // Draw nodes
                    const colorMap = [viz.colors.axis + '44', viz.colors.orange, viz.colors.blue];
                    for (let i = 0; i < n; i++) {
                        let c = colorMap[curColors[i]];
                        if (curState && curState.v === i) {
                            viz.drawNode(positions[i][0], positions[i][1], 26, '', viz.colors.yellow + '33');
                        }
                        viz.drawNode(positions[i][0], positions[i][1], 20, labels[i], c);
                        // Timestamps
                        if (curState) {
                            let ts = '';
                            if (curState.d[i] > 0) ts += curState.d[i];
                            if (curState.f[i] > 0) ts += '/' + curState.f[i];
                            if (ts) viz.screenText(ts, positions[i][0], positions[i][1] + 30, viz.colors.yellow, 10, 'center');
                        }
                    }

                    // Current action
                    if (curState) {
                        const act = curState.type === 'discover' ? 'Discover ' : 'Finish ';
                        viz.screenText(act + labels[curState.v], 350, 360, viz.colors.yellow, 14, 'center');
                    }

                    // Topological order
                    viz.screenText('Topological Order (built right-to-left):', 50, 390, viz.colors.teal, 12, 'left');
                    for (let i = 0; i < curTopo.length; i++) {
                        viz.drawArrayCell(50 + i * 55, 408, 50, 28, labels[curTopo[i]], viz.colors.green + '33', viz.colors.white);
                    }
                }

                VizEngine.createButton(controls, 'Reset', function() { step = 0; draw(); });
                VizEngine.createButton(controls, 'Step', function() { if (step < steps.length) { step++; draw(); } });
                VizEngine.createButton(controls, 'Run All', function() { step = steps.length; draw(); });

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Run DFS topological sort on the DAG with edges \\(\\{(1,2),(1,3),(2,4),(3,4),(4,5)\\}\\). Give one valid topological order.',
                hint: 'Finish times determine the order: last to finish goes first.',
                solution: 'One valid order: \\(1, 3, 2, 4, 5\\). Another: \\(1, 2, 3, 4, 5\\). The DFS-based algorithm depends on the adjacency list ordering.'
            },
            {
                question: 'If a DAG has a unique topological ordering, what can you say about its structure?',
                hint: 'At each step, there must be a unique vertex with in-degree 0.',
                solution: 'The DAG must have a Hamiltonian path (a path visiting all vertices exactly once). This is because at each step of the topological sort, there is exactly one vertex with in-degree 0 among the remaining vertices. This unique source is forced to be next in the ordering. The edges along this path form a Hamiltonian path in the DAG.'
            },
            {
                question: 'Can you modify the DFS topological sort to detect cycles? What should be done when a gray vertex is encountered?',
                hint: 'A gray vertex in the recursion stack means a back edge exists.',
                solution: 'Yes. In DFS-TOPO, when exploring edge \\((u, v)\\) and \\(v\\) is gray, we have found a back edge, which means a cycle exists. We can report "cycle detected" and optionally trace the cycle by following the recursion stack from \\(v\\) to \\(u\\). This is already shown in Algorithm 13.1.'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 3: Kahn's Algorithm
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch13-sec03',
        title: '3. Kahn\'s Algorithm (BFS-Based Topological Sort)',
        content: `
<h2>Kahn\'s Algorithm — BFS-Based Topological Sort</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Kahn's algorithm provides a BFS-based alternative: repeatedly remove vertices with zero in-degree. It has the added benefit of detecting cycles (if not all vertices are removed, the graph has a cycle) and is often preferred in practice for dependency resolution.</p></div></div>


<p>
Kahn's algorithm (1962) takes a different approach: it repeatedly removes vertices
with in-degree 0 (sources). When a source is removed, the in-degrees of its neighbors decrease,
potentially creating new sources.
</p>

<div class="env-block algorithm">
<div class="env-title">Algorithm 13.2: Kahn's Algorithm</div>
<div class="env-body">
<pre>
KAHN-TOPO-SORT(G):
    compute in-degree[v] for all v
    Q = queue of all vertices with in-degree 0
    L = empty list
    while Q is not empty:
        u = DEQUEUE(Q)
        L.append(u)
        for each v in Adj[u]:
            in-degree[v] -= 1
            if in-degree[v] == 0:
                ENQUEUE(Q, v)
    if |L| < |V|:
        error "cycle detected"
    return L
</pre>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 13.4</div>
<div class="env-body">
<p>
Kahn's algorithm produces a valid topological ordering of a DAG in \\(O(n + m)\\) time.
If the graph has a cycle, \\(|L| < |V|\\) because no vertex in the cycle ever reaches in-degree 0.
</p>
</div>
</div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body">
<p>
Think of tasks with prerequisites. Tasks with no prerequisites can start immediately (in-degree 0).
Once completed, they unlock new tasks. Kahn's algorithm simulates this natural scheduling process.
</p>
</div>
</div>

<div class="env-block remark">
<div class="env-title">Remark: DFS vs. Kahn's</div>
<div class="env-body">
<p>
Both run in \\(O(n + m)\\). DFS-based sort produces reverse finish-time ordering.
Kahn's provides a more intuitive "peeling" approach and is easier to parallelize.
If a priority queue is used instead of a regular queue, Kahn's produces the
<strong>lexicographically smallest</strong> topological order.
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch13-viz-kahn"></div>
`,
        visualizations: [
        {
            id: 'ch13-viz-kahn',
            title: 'Kahn\'s Algorithm Step-Through',
            description: 'Watch sources being removed one by one, revealing the topological order.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 450});

                const labels = ['A','B','C','D','E','F','G'];
                const n = labels.length;
                const edges = [[0,2],[0,3],[1,3],[2,4],[3,4],[3,5],[4,6],[5,6]];
                const adjL = Array.from({length: n}, () => []);
                const origInDeg = Array(n).fill(0);
                edges.forEach(([u,v]) => { adjL[u].push(v); origInDeg[v]++; });

                const positions = [
                    [80, 100], [80, 260], [220, 100],
                    [220, 260], [380, 180], [380, 320], [540, 240]
                ];

                // Run Kahn's and record steps
                let steps = [];
                function buildKahn() {
                    steps = [];
                    const inDeg = [...origInDeg];
                    const q = [];
                    const removed = new Set();
                    const topo = [];
                    for (let i = 0; i < n; i++) if (inDeg[i] === 0) q.push(i);
                    steps.push({queue: [...q], inDeg: [...inDeg], topo: [...topo], removed: new Set(removed), action: 'init'});

                    let qi = 0;
                    while (qi < q.length) {
                        const u = q[qi++];
                        topo.push(u);
                        removed.add(u);
                        steps.push({queue: q.slice(qi), inDeg: [...inDeg], topo: [...topo], removed: new Set(removed), action: 'remove', v: u});

                        for (const v of adjL[u]) {
                            inDeg[v]--;
                            if (inDeg[v] === 0) q.push(v);
                        }
                        steps.push({queue: q.slice(qi), inDeg: [...inDeg], topo: [...topo], removed: new Set(removed), action: 'update', v: u});
                    }
                }
                buildKahn();

                let step = 0;

                function draw() {
                    viz.clear();
                    viz.screenText('Kahn\'s Algorithm (step ' + step + '/' + steps.length + ')', 350, 20, viz.colors.white, 15, 'center');

                    const curState = step < steps.length ? steps[step] : steps[steps.length - 1];

                    // Draw edges
                    const r = 20;
                    edges.forEach(([u, v]) => {
                        if (curState.removed.has(u)) return;
                        const dx = positions[v][0] - positions[u][0];
                        const dy = positions[v][1] - positions[u][1];
                        const len = Math.sqrt(dx*dx + dy*dy);
                        const ux1 = dx/len, uy1 = dy/len;
                        viz.drawEdge(
                            positions[u][0] + ux1*r, positions[u][1] + uy1*r,
                            positions[v][0] - ux1*r, positions[v][1] - uy1*r,
                            viz.colors.axis + '66', true
                        );
                    });

                    // Draw nodes
                    for (let i = 0; i < n; i++) {
                        if (curState.removed.has(i)) {
                            viz.drawNode(positions[i][0], positions[i][1], 20, labels[i], viz.colors.axis + '22', viz.colors.text + '44');
                            continue;
                        }
                        let c = viz.colors.blue;
                        if (curState.inDeg[i] === 0) c = viz.colors.green;
                        if (curState.action !== 'init' && curState.v === i) c = viz.colors.yellow;
                        viz.drawNode(positions[i][0], positions[i][1], 20, labels[i], c);
                        viz.screenText('in:' + curState.inDeg[i], positions[i][0], positions[i][1] + 30, viz.colors.text, 10, 'center');
                    }

                    // Queue
                    viz.screenText('Queue:', 50, 385, viz.colors.teal, 12, 'left');
                    for (let i = 0; i < curState.queue.length; i++) {
                        viz.drawArrayCell(110 + i * 45, 372, 40, 26, labels[curState.queue[i]], viz.colors.teal + '33', viz.colors.white);
                    }

                    // Topological order
                    viz.screenText('Topo Order:', 50, 420, viz.colors.green, 12, 'left');
                    for (let i = 0; i < curState.topo.length; i++) {
                        viz.drawArrayCell(130 + i * 45, 408, 40, 26, labels[curState.topo[i]], viz.colors.green + '33', viz.colors.white);
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
                question: 'Run Kahn\'s algorithm on the DAG with edges \\(\\{(A,C),(B,C),(C,D),(C,E),(D,F),(E,F)\\}\\). Give the topological order if ties are broken alphabetically.',
                hint: 'Initially A and B have in-degree 0. Alphabetically, A comes first.',
                solution: 'Step 1: Queue = {A, B}. Remove A, update in-degrees. Step 2: Remove B, C becomes in-degree 0. Step 3: Remove C, D and E become in-degree 0. Step 4: Remove D, Step 5: Remove E, F becomes 0. Step 6: Remove F. Order: A, B, C, D, E, F.'
            },
            {
                question: 'How would you modify Kahn\'s algorithm to count the total number of distinct topological orderings?',
                hint: 'At each step, all vertices with in-degree 0 can be placed next. Use recursion/backtracking.',
                solution: 'Use backtracking: at each step, try each vertex with in-degree 0 as the next in the order. For each choice, decrease in-degrees of neighbors, recurse, then restore. The total count is the sum over all branches. This has exponential worst-case complexity since the number of topological orders can be exponential (e.g., \\(n!\\) for a graph with no edges).'
            },
            {
                question: 'What happens if you use a min-heap instead of a regular queue in Kahn\'s algorithm?',
                hint: 'The min-heap always selects the smallest-label source available.',
                solution: 'Using a min-heap (priority queue) produces the <strong>lexicographically smallest</strong> topological ordering. Each extraction picks the smallest-label vertex with in-degree 0. Time becomes \\(O((n + m) \\log n)\\) due to heap operations.'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 4: Kosaraju's Algorithm
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch13-sec04',
        title: '4. Kosaraju\'s Algorithm (SCC via Two-Pass DFS)',
        content: `
<h2>Kosaraju\'s Algorithm — Strongly Connected Components</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>For general directed graphs (which may have cycles), strongly connected components (SCCs) partition the vertices into maximal sets of mutually reachable vertices. Kosaraju's algorithm finds all SCCs using two DFS passes: one on the original graph and one on the transpose.</p></div></div>


<div class="env-block definition">
<div class="env-title">Definition 13.3 (Strongly Connected)</div>
<div class="env-body">
<p>
In a directed graph, vertices \\(u\\) and \\(v\\) are <strong>strongly connected</strong>
if there exist paths \\(u \\rightsquigarrow v\\) and \\(v \\rightsquigarrow u\\).
A <strong>strongly connected component (SCC)</strong> is a maximal set of mutually strongly connected vertices.
</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 13.4 (Component Graph)</div>
<div class="env-body">
<p>
The <strong>component graph</strong> \\(G^{\\text{SCC}} = (V^{\\text{SCC}}, E^{\\text{SCC}})\\) is obtained
by contracting each SCC into a single super-vertex. The component graph is always a <strong>DAG</strong>.
</p>
</div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm 13.3: Kosaraju's Algorithm</div>
<div class="env-body">
<pre>
KOSARAJU(G):
    // Pass 1: DFS on G, record finish order
    S = empty stack
    visited = set()
    for each v in V:
        if v not in visited:
            DFS1(G, v, visited, S)

    // Pass 2: DFS on G^T in reverse finish order
    G_T = transpose(G)  // reverse all edges
    comp = array[|V|] = -1
    c = 0
    while S is not empty:
        v = S.pop()
        if comp[v] == -1:
            DFS2(G_T, v, comp, c)
            c += 1

DFS1(G, u, visited, S):
    visited.add(u)
    for each v in Adj[u]:
        if v not in visited:
            DFS1(G, v, visited, S)
    S.push(u)

DFS2(G_T, u, comp, c):
    comp[u] = c
    for each v in Adj_T[u]:
        if comp[v] == -1:
            DFS2(G_T, v, comp, c)
</pre>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 13.5 (Kosaraju Correctness)</div>
<div class="env-body">
<p>
Kosaraju's algorithm correctly identifies all SCCs in \\(O(n + m)\\) time.
The key insight: in the first DFS, the SCC whose vertex finishes last is a "source" SCC in the component DAG.
Exploring from it in \\(G^T\\) visits exactly that SCC.
</p>
</div>
</div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body">
<p>
Pass 1 orders SCCs so that source components finish last. Pass 2 on the transpose graph
ensures that DFS from a source SCC stays within that SCC (since in \\(G^T\\), the source
SCC becomes a sink, preventing escape to other components).
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch13-viz-kosaraju"></div>
`,
        visualizations: [
        {
            id: 'ch13-viz-kosaraju',
            title: 'Kosaraju\'s Two-Pass Algorithm',
            description: 'Visualize both passes of Kosaraju\'s algorithm: DFS on G, then DFS on G^T.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 450});

                const labels = ['A','B','C','D','E','F','G','H'];
                const n = labels.length;
                const edges = [
                    [0,1],[1,2],[2,0], // SCC {A,B,C}
                    [2,3],[3,4],[4,5],[5,3], // SCC {D,E,F}
                    [4,6],[6,7],[7,6] // SCC {G,H}
                ];
                const positions = [
                    [80,100],[180,50],[180,170],
                    [320,100],[420,50],[420,170],
                    [560,80],[560,180]
                ];

                const adjL = Array.from({length: n}, () => []);
                const adjT = Array.from({length: n}, () => []);
                edges.forEach(([u,v]) => { adjL[u].push(v); adjT[v].push(u); });

                // Pass 1: DFS on G
                const visitedP1 = Array(n).fill(false);
                const finishOrder = [];
                function dfs1(u) {
                    visitedP1[u] = true;
                    for (const v of adjL[u]) if (!visitedP1[v]) dfs1(v);
                    finishOrder.push(u);
                }
                for (let i = 0; i < n; i++) if (!visitedP1[i]) dfs1(i);

                // Pass 2: DFS on G^T
                const comp = Array(n).fill(-1);
                let numComp = 0;
                function dfs2(u, c) {
                    comp[u] = c;
                    for (const v of adjT[u]) if (comp[v] === -1) dfs2(v, c);
                }
                for (let i = n - 1; i >= 0; i--) {
                    const v = finishOrder[i];
                    if (comp[v] === -1) {
                        dfs2(v, numComp);
                        numComp++;
                    }
                }

                const compColors = [viz.colors.blue, viz.colors.green, viz.colors.orange, viz.colors.purple, viz.colors.pink];

                let showPhase = 'result';

                function draw() {
                    viz.clear();

                    if (showPhase === 'finish') {
                        viz.screenText('Pass 1: DFS on G (finish order)', 350, 20, viz.colors.white, 15, 'center');
                    } else if (showPhase === 'transpose') {
                        viz.screenText('Transpose Graph G^T', 350, 20, viz.colors.white, 15, 'center');
                    } else {
                        viz.screenText('Result: ' + numComp + ' Strongly Connected Components', 350, 20, viz.colors.white, 15, 'center');
                    }

                    const r = 20;
                    // Draw edges
                    const edgesToDraw = showPhase === 'transpose' ?
                        edges.map(([u,v]) => [v, u]) : edges;
                    edgesToDraw.forEach(([u, v]) => {
                        const dx = positions[v][0] - positions[u][0];
                        const dy = positions[v][1] - positions[u][1];
                        const len = Math.sqrt(dx*dx + dy*dy);
                        if (len < 1) return;
                        const ux1 = dx/len, uy1 = dy/len;
                        let ec = viz.colors.axis + '55';
                        if (showPhase === 'result' && comp[u] === comp[v]) ec = compColors[comp[u]];
                        viz.drawEdge(
                            positions[u][0] + ux1*r, positions[u][1] + uy1*r,
                            positions[v][0] - ux1*r, positions[v][1] - uy1*r,
                            ec, true
                        );
                    });

                    // Draw nodes
                    for (let i = 0; i < n; i++) {
                        let c = viz.colors.blue;
                        if (showPhase === 'result') c = compColors[comp[i]];
                        viz.drawNode(positions[i][0], positions[i][1], 20, labels[i], c);
                    }

                    if (showPhase === 'finish') {
                        viz.screenText('Finish Order (bottom = first):', 100, 280, viz.colors.teal, 12, 'left');
                        for (let i = 0; i < finishOrder.length; i++) {
                            viz.drawArrayCell(100 + i * 50, 300, 45, 26, labels[finishOrder[i]], viz.colors.teal + '33', viz.colors.white);
                            viz.screenText(String(i + 1), 122 + i * 50, 340, viz.colors.text, 10, 'center');
                        }
                        viz.screenText('Process in reverse: rightmost first for Pass 2', 350, 370, viz.colors.yellow, 11, 'center');
                    }

                    if (showPhase === 'result') {
                        // Component summary
                        for (let c = 0; c < numComp; c++) {
                            const members = [];
                            for (let i = 0; i < n; i++) if (comp[i] === c) members.push(labels[i]);
                            viz.screenText('SCC ' + c + ': {' + members.join(', ') + '}',
                                350, 290 + c * 24, compColors[c], 13, 'center');
                        }

                        // Meta-graph
                        viz.screenText('Component DAG:', 350, 380, viz.colors.white, 12, 'center');
                        viz.screenText('SCC0 -> SCC1 -> SCC2', 350, 400, viz.colors.text, 12, 'center');
                    }
                }

                VizEngine.createSelect(controls, 'Phase:', [
                    {value: 'finish', label: 'Pass 1: Finish Order'},
                    {value: 'transpose', label: 'Transpose G^T'},
                    {value: 'result', label: 'Result: SCCs'}
                ], function(v) { showPhase = v; draw(); });

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Run Kosaraju\'s algorithm on the graph with edges \\(\\{(1,2),(2,3),(3,1),(3,4),(4,5),(5,6),(6,4)\\}\\). Identify all SCCs.',
                hint: 'Pass 1: DFS from 1 gives finish order. Pass 2: DFS on transpose in reverse finish order.',
                solution: 'SCC 1: \\(\\{1, 2, 3\\}\\) (cycle \\(1 \\to 2 \\to 3 \\to 1\\)). SCC 2: \\(\\{4, 5, 6\\}\\) (cycle \\(4 \\to 5 \\to 6 \\to 4\\)). The component DAG has edge SCC1 \\(\\to\\) SCC2 (via edge \\(3 \\to 4\\)).'
            },
            {
                question: 'Why does Kosaraju\'s algorithm require the transpose graph? Why not just do two DFS passes on \\(G\\)?',
                hint: 'Consider what happens if you DFS from a "source" SCC in G: you would visit multiple SCCs.',
                solution: 'In Pass 2, we process vertices in reverse finish order. The vertex with the latest finish time belongs to a source SCC in the component DAG. If we DFS on \\(G\\) from this vertex, we would reach other SCCs (following inter-SCC edges). Using \\(G^T\\) reverses these inter-SCC edges, so a source SCC in \\(G\\) becomes a sink in \\(G^T\\), preventing DFS from escaping the component. This ensures each DFS2 call explores exactly one SCC.'
            },
            {
                question: 'Prove that the component graph \\(G^{\\text{SCC}}\\) is always a DAG.',
                hint: 'If there were a cycle among SCCs, all vertices in those SCCs would be mutually reachable.',
                solution: 'Suppose \\(G^{\\text{SCC}}\\) has a cycle: \\(C_1 \\to C_2 \\to \\cdots \\to C_k \\to C_1\\). Then for any \\(u \\in C_1\\) and \\(v \\in C_2\\), there exists a path \\(u \\to v\\) (via inter-component edges) and \\(v \\to u\\) (via the cycle of components). So \\(u\\) and \\(v\\) are strongly connected, contradicting that they are in different SCCs. Therefore \\(G^{\\text{SCC}}\\) is a DAG.'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 5: Tarjan's Algorithm
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch13-sec05',
        title: '5. Tarjan\'s Algorithm (SCC via Single-Pass DFS)',
        content: `
<h2>Tarjan\'s Algorithm — Single-Pass SCC Algorithm</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Tarjan's algorithm finds SCCs in a single DFS pass using a stack and "low-link" values. It is more space-efficient than Kosaraju's and reveals how the SCC structure (the "meta-graph") is always a DAG, connecting back to topological sorting.</p></div></div>


<p>
Tarjan's algorithm (1972) finds all SCCs in a single DFS pass using a clever
<strong>low-link</strong> numbering scheme. It maintains a stack of vertices in the current
DFS exploration and identifies SCC roots by comparing discovery times with low-link values.
</p>

<div class="env-block algorithm">
<div class="env-title">Algorithm 13.4: Tarjan's SCC Algorithm</div>
<div class="env-body">
<pre>
index = 0; S = empty stack
for each v in V:
    if v.index is undefined:
        STRONGCONNECT(v)

STRONGCONNECT(v):
    v.index = v.lowlink = index++
    S.push(v); v.onStack = true
    for each (v, w) in E:
        if w.index is undefined:
            STRONGCONNECT(w)
            v.lowlink = min(v.lowlink, w.lowlink)
        elif w.onStack:
            v.lowlink = min(v.lowlink, w.index)
    // If v is a root of an SCC
    if v.lowlink == v.index:
        SCC = {}
        repeat:
            w = S.pop(); w.onStack = false
            SCC.add(w)
        until w == v
        output SCC
</pre>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 13.5 (Low-Link Value)</div>
<div class="env-body">
<p>
The <strong>low-link</strong> value \\(\\text{low}[v]\\) is the smallest index reachable from \\(v\\)
through edges in the DFS subtree of \\(v\\), including back edges to vertices on the stack.
Formally, \\(\\text{low}[v] = \\min(\\{\\text{index}[v]\\} \\cup \\{\\text{low}[w] : (v,w) \\text{ is tree edge}\\} \\cup \\{\\text{index}[w] : (v,w) \\text{ is back/cross edge to stack}\\})\\).
</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 13.6</div>
<div class="env-body">
<p>
Vertex \\(v\\) is the <strong>root</strong> of an SCC if and only if \\(\\text{low}[v] = \\text{index}[v]\\).
When this condition holds, all vertices on the stack from \\(v\\) upward form the SCC.
</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Complexity</div>
<div class="env-body">
<p>
Time: \\(O(n + m)\\). Space: \\(O(n)\\). Only a single DFS pass is needed (unlike Kosaraju's two passes).
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch13-viz-tarjan"></div>

<div class="viz-placeholder" data-viz="ch13-viz-metagraph"></div>

<div class="env-block bridge"><div class="env-title">Looking Ahead</div><div class="env-body"><p>Graph traversal and structural decomposition are the foundation. Chapter 14 builds on them to solve one of the most practically important graph problems: finding shortest paths, using algorithms from Dijkstra to Floyd-Warshall.</p></div></div>`,
        visualizations: [
        {
            id: 'ch13-viz-tarjan',
            title: 'Tarjan\'s Algorithm with Low-Link Tracking',
            description: 'Step through Tarjan\'s algorithm watching indices, low-links, and the SCC stack.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 450});

                const labels = ['A','B','C','D','E','F','G','H'];
                const n = labels.length;
                const edges = [
                    [0,1],[1,2],[2,0],
                    [2,3],[3,4],[4,5],[5,3],
                    [4,6],[6,7],[7,6]
                ];
                const adjL = Array.from({length: n}, () => []);
                edges.forEach(([u,v]) => { adjL[u].push(v); });

                const positions = [
                    [80,100],[180,50],[180,170],
                    [320,100],[420,50],[420,170],
                    [560,80],[560,180]
                ];

                // Run Tarjan's and record steps
                let steps = [];
                let sccs = [];
                function buildTarjan() {
                    steps = [];
                    sccs = [];
                    const idx = Array(n).fill(-1);
                    const low = Array(n).fill(-1);
                    const onStack = Array(n).fill(false);
                    const stack = [];
                    let index = 0;

                    function strongConnect(v) {
                        idx[v] = low[v] = index++;
                        stack.push(v);
                        onStack[v] = true;
                        steps.push({type: 'discover', v, idx: [...idx], low: [...low], stack: [...stack], sccs: sccs.map(s => [...s])});

                        for (const w of adjL[v]) {
                            if (idx[w] === -1) {
                                strongConnect(w);
                                low[v] = Math.min(low[v], low[w]);
                                steps.push({type: 'update', v, w, idx: [...idx], low: [...low], stack: [...stack], sccs: sccs.map(s => [...s])});
                            } else if (onStack[w]) {
                                low[v] = Math.min(low[v], idx[w]);
                                steps.push({type: 'back', v, w, idx: [...idx], low: [...low], stack: [...stack], sccs: sccs.map(s => [...s])});
                            }
                        }

                        if (low[v] === idx[v]) {
                            const scc = [];
                            let w;
                            do {
                                w = stack.pop();
                                onStack[w] = false;
                                scc.push(w);
                            } while (w !== v);
                            sccs.push(scc);
                            steps.push({type: 'scc', v, scc: [...scc], idx: [...idx], low: [...low], stack: [...stack], sccs: sccs.map(s => [...s])});
                        }
                    }

                    for (let i = 0; i < n; i++) {
                        if (idx[i] === -1) strongConnect(i);
                    }
                }
                buildTarjan();

                let step = 0;

                function draw() {
                    viz.clear();
                    viz.screenText('Tarjan\'s Algorithm (step ' + step + '/' + steps.length + ')', 350, 20, viz.colors.white, 15, 'center');

                    const curState = step > 0 ? steps[step - 1] : null;

                    // Determine which SCC each node belongs to
                    const nodeComp = Array(n).fill(-1);
                    if (curState) {
                        curState.sccs.forEach((scc, ci) => {
                            scc.forEach(v => { nodeComp[v] = ci; });
                        });
                    }

                    const compColors = [viz.colors.green, viz.colors.purple, viz.colors.orange, viz.colors.pink];

                    // Draw edges
                    const r = 20;
                    edges.forEach(([u, v]) => {
                        const dx = positions[v][0] - positions[u][0];
                        const dy = positions[v][1] - positions[u][1];
                        const len = Math.sqrt(dx*dx + dy*dy);
                        if (len < 1) return;
                        const ux1 = dx/len, uy1 = dy/len;
                        viz.drawEdge(
                            positions[u][0] + ux1*r, positions[u][1] + uy1*r,
                            positions[v][0] - ux1*r, positions[v][1] - uy1*r,
                            viz.colors.axis + '55', true
                        );
                    });

                    // Draw nodes
                    for (let i = 0; i < n; i++) {
                        let c = viz.colors.axis + '44';
                        if (curState && curState.idx[i] >= 0) {
                            c = viz.colors.blue;
                            if (curState.stack.includes(i)) c = viz.colors.orange;
                        }
                        if (nodeComp[i] >= 0) c = compColors[nodeComp[i] % compColors.length];
                        viz.drawNode(positions[i][0], positions[i][1], 20, labels[i], c);

                        // idx/low
                        if (curState && curState.idx[i] >= 0) {
                            viz.screenText(curState.idx[i] + '/' + curState.low[i],
                                positions[i][0], positions[i][1] + 30, viz.colors.yellow, 10, 'center');
                        }
                    }

                    // Stack
                    viz.screenText('Stack:', 50, 310, viz.colors.teal, 12, 'left');
                    if (curState) {
                        for (let i = 0; i < curState.stack.length; i++) {
                            viz.drawArrayCell(110 + i * 42, 298, 38, 26, labels[curState.stack[i]], viz.colors.orange + '33', viz.colors.white);
                        }
                    }

                    // Action
                    if (curState) {
                        let actionText = '';
                        if (curState.type === 'discover') actionText = 'Discover ' + labels[curState.v] + ' (index=' + curState.idx[curState.v] + ')';
                        else if (curState.type === 'update') actionText = 'Update low[' + labels[curState.v] + '] from child ' + labels[curState.w];
                        else if (curState.type === 'back') actionText = 'Back edge to ' + labels[curState.w] + ', update low[' + labels[curState.v] + ']';
                        else if (curState.type === 'scc') actionText = 'SCC found: {' + curState.scc.map(v => labels[v]).join(',') + '}';
                        viz.screenText(actionText, 350, 350, viz.colors.yellow, 12, 'center');
                    }

                    // SCCs found
                    if (curState && curState.sccs.length > 0) {
                        viz.screenText('SCCs found:', 50, 385, viz.colors.green, 12, 'left');
                        curState.sccs.forEach((scc, ci) => {
                            viz.screenText('{' + scc.map(v => labels[v]).join(',') + '}',
                                50 + ci * 120, 405, compColors[ci % compColors.length], 11, 'left');
                        });
                    }

                    // idx/low label
                    viz.screenText('Labels: index/lowlink', 580, 280, viz.colors.text, 10, 'center');
                }

                VizEngine.createButton(controls, 'Reset', function() { step = 0; draw(); });
                VizEngine.createButton(controls, 'Step', function() { if (step < steps.length) { step++; draw(); } });
                VizEngine.createButton(controls, 'Run All', function() { step = steps.length; draw(); });

                draw();
                return viz;
            }
        },
        {
            id: 'ch13-viz-metagraph',
            title: 'SCC Meta-Graph Constructor',
            description: 'See how SCCs contract into a DAG (component graph).',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 400});

                const labels = ['A','B','C','D','E','F','G','H'];
                const n = labels.length;
                const edges = [
                    [0,1],[1,2],[2,0],
                    [2,3],[3,4],[4,5],[5,3],
                    [4,6],[6,7],[7,6]
                ];
                const positions = [
                    [80,80],[160,40],[160,140],
                    [300,80],[380,40],[380,140],
                    [520,60],[520,140]
                ];

                // SCCs (pre-computed)
                const sccGroups = [[0,1,2],[3,4,5],[6,7]];
                const comp = Array(n).fill(-1);
                sccGroups.forEach((g, ci) => g.forEach(v => { comp[v] = ci; }));
                const compColors = [viz.colors.blue, viz.colors.green, viz.colors.orange];

                let showMode = 'original';

                function draw() {
                    viz.clear();

                    if (showMode === 'original') {
                        viz.screenText('Original Directed Graph', 350, 20, viz.colors.white, 15, 'center');

                        // Highlight SCC regions
                        sccGroups.forEach((g, ci) => {
                            const xs = g.map(v => positions[v][0]);
                            const ys = g.map(v => positions[v][1]);
                            const minX = Math.min(...xs) - 30, maxX = Math.max(...xs) + 30;
                            const minY = Math.min(...ys) - 30, maxY = Math.max(...ys) + 30;
                            const ctx = viz.ctx;
                            ctx.fillStyle = compColors[ci] + '15';
                            ctx.strokeStyle = compColors[ci] + '44';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 3]);
                            ctx.beginPath();
                            ctx.roundRect(minX, minY, maxX - minX, maxY - minY, 15);
                            ctx.fill();
                            ctx.stroke();
                            ctx.setLineDash([]);
                        });

                        const r = 18;
                        edges.forEach(([u, v]) => {
                            const dx = positions[v][0] - positions[u][0];
                            const dy = positions[v][1] - positions[u][1];
                            const len = Math.sqrt(dx*dx + dy*dy);
                            if (len < 1) return;
                            const ux1 = dx/len, uy1 = dy/len;
                            const ec = comp[u] === comp[v] ? compColors[comp[u]] : viz.colors.axis;
                            viz.drawEdge(
                                positions[u][0] + ux1*r, positions[u][1] + uy1*r,
                                positions[v][0] - ux1*r, positions[v][1] - uy1*r,
                                ec, true
                            );
                        });

                        for (let i = 0; i < n; i++) {
                            viz.drawNode(positions[i][0], positions[i][1], 18, labels[i], compColors[comp[i]]);
                        }
                    } else {
                        viz.screenText('Component DAG (Meta-Graph)', 350, 20, viz.colors.white, 15, 'center');

                        const metaPos = [[150, 150], [350, 150], [550, 150]];
                        const metaLabels = [
                            '{A,B,C}', '{D,E,F}', '{G,H}'
                        ];

                        // Meta-edges
                        const metaEdges = [[0,1],[1,2]]; // SCC0 -> SCC1, SCC1 -> SCC2
                        const mr = 40;
                        metaEdges.forEach(([u, v]) => {
                            viz.drawEdge(metaPos[u][0] + mr + 5, metaPos[u][1], metaPos[v][0] - mr - 5, metaPos[v][1], viz.colors.white, true, null, 2);
                        });

                        metaPos.forEach(([px, py], i) => {
                            viz.drawNode(px, py, 40, '', compColors[i]);
                            viz.screenText(metaLabels[i], px, py, viz.colors.white, 11, 'center');
                            viz.screenText('SCC ' + i, px, py + 50, compColors[i], 12, 'center');
                        });

                        viz.screenText('The component graph is always a DAG.', 350, 300, viz.colors.text, 12, 'center');
                        viz.screenText('Topological order of SCCs: SCC0, SCC1, SCC2', 350, 325, viz.colors.yellow, 12, 'center');
                    }
                }

                VizEngine.createSelect(controls, 'View:', [
                    {value: 'original', label: 'Original Graph with SCCs'},
                    {value: 'meta', label: 'Component DAG'}
                ], function(v) { showMode = v; draw(); });

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Run Tarjan\'s algorithm on the graph with edges \\(\\{(1,2),(2,3),(3,1),(2,4),(4,5),(5,4)\\}\\). Give the SCCs and the order in which they are found.',
                hint: 'Start DFS from vertex 1. Track index and lowlink values.',
                solution: 'DFS from 1: visit 1 (0/0), 2 (1/1), 3 (2/2). Edge 3->1: update low[3]=0. Backtrack: low[2]=0. Edge 2->4: visit 4 (3/3), 5 (4/4). Edge 5->4: update low[5]=3. Backtrack: low[4]=3. At 4: low=index=3, pop SCC {5,4}. Backtrack to 2: low[2]=0. At 1: low=index=0, pop SCC {3,2,1}. SCCs found in order: {4,5}, {1,2,3}.'
            },
            {
                question: 'Compare Kosaraju\'s and Tarjan\'s algorithms. What are the advantages of each?',
                hint: 'Consider number of passes, implementation complexity, and practical performance.',
                solution: 'Kosaraju: Two passes, requires building transpose graph (extra O(n+m) space), simpler to understand. Tarjan: Single pass, no transpose needed, uses a stack + lowlink (slightly more complex bookkeeping). In practice, Tarjan is preferred for large graphs because it avoids building the transpose and makes a single pass. Both have the same O(n+m) time complexity.'
            },
            {
                question: 'How many SCCs does a DAG on \\(n\\) vertices have?',
                hint: 'In a DAG, no two distinct vertices are mutually reachable.',
                solution: 'A DAG has exactly \\(n\\) SCCs, each containing a single vertex. This is because if any SCC had more than one vertex, those vertices would form a cycle, contradicting the DAG property.'
            },
            {
                question: 'Given a directed graph, describe how to find the number of vertices reachable from every vertex in \\(O(n + m)\\) time using SCCs.',
                hint: 'First find SCCs. Then work on the component DAG in reverse topological order.',
                solution: 'Step 1: Find all SCCs using Tarjan\'s algorithm. Each SCC of size \\(k\\) has \\(k\\) vertices reachable within it. Step 2: Build the component DAG. Process the DAG in reverse topological order. For each SCC node, the number of reachable vertices is its size plus the sum of reachable vertices from its successors (avoiding double counting via careful DAG DP). The total time is \\(O(n + m)\\) for SCC computation plus \\(O(|V^{SCC}| + |E^{SCC}|)\\) for the DAG DP.'
            },
            {
                question: 'Prove that if \\(u\\) and \\(v\\) are in the same SCC, they must both be on the DFS stack at some point during Tarjan\'s algorithm.',
                hint: 'Both are in the subtree rooted at the SCC root, and neither is popped until the root is processed.',
                solution: 'Let \\(r\\) be the root of the SCC (first vertex discovered in the SCC). Since \\(u\\) and \\(v\\) are in the same SCC, there are paths \\(r \\rightsquigarrow u\\) and \\(r \\rightsquigarrow v\\) within the SCC. By the white-path theorem, both \\(u\\) and \\(v\\) become descendants of \\(r\\) in the DFS tree. They are pushed onto the stack when discovered and are not popped until \\(r\\) is identified as the SCC root (when \\(\\text{low}[r] = \\text{index}[r]\\)). Therefore, both are on the stack simultaneously at least when \\(r\\) is about to pop the SCC.'
            },
            {
                question: 'Can Tarjan\'s algorithm be used to find 2-connected components (biconnected components) in an undirected graph?',
                hint: 'A similar low-link approach works for finding articulation points and bridges.',
                solution: 'Yes, with modifications. For undirected graphs, a similar DFS with lowlink values finds articulation points (where low[child] >= disc[u]) and bridges (where low[child] > disc[u]). Biconnected components can be found by maintaining an edge stack: when an articulation point is identified, all edges since the current DFS call form a biconnected component. The time complexity remains O(n + m).'
            }
        ]
    }
    ]
});
