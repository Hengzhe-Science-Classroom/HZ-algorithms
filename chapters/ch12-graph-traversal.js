window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch12',
    number: 12,
    title: 'Graph Traversal',
    subtitle: 'Graph Traversal: BFS, DFS, Edge Classification, and Applications',
    sections: [

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 1: Graph Representations
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch12-sec01',
        title: '1. Graph Representations',
        content: `
<h2>Graph Representations</h2>
<div class="env-block bridge"><div class="env-title">Chapter Overview</div><div class="env-body"><p>The data structures of Chapters 8 through 11 are tools; graphs are where they come alive. Graphs model relationships: social networks, road maps, dependencies, circuits. This chapter introduces graph representations and the two fundamental traversal algorithms, Breadth-First Search (BFS) and Depth-First Search (DFS), along with edge classification. These traversals are the building blocks for shortest paths (Chapter 14), MSTs (Chapter 15), topological sorting (Chapter 13), and much more.</p></div></div>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Before we can run algorithms on graphs, we must store them. This section compares the adjacency matrix and adjacency list representations, analyzing the space and time tradeoffs that determine which to use for a given problem.</p></div></div>


<p>
A <strong>graph</strong> \(G = (V, E)\) consists of a set \(V\) of <em>vertices</em> and a set \(E\) of <em>edges</em>.
Edges may be <strong>directed</strong> or <strong>undirected</strong>, and may carry <strong>weights</strong>.
The choice of data structure for representing a graph profoundly affects the running time of graph algorithms.
</p>

<div class="env-block definition">
<div class="env-title">Definition 12.1 (Graph)</div>
<div class="env-body">
<p>
A <strong>directed graph</strong> \(G = (V, E)\) has \(E \\subseteq V \\times V\).
An <strong>undirected graph</strong> has \(E\) as a set of unordered pairs from \(V\).
We write \(n = |V|\) and \(m = |E|\).
</p>
</div>
</div>

<h3>1.1 Adjacency Matrix</h3>

<p>
An \(n \\times n\) matrix \(A\) where \(A[i][j] = 1\) if \((i,j) \\in E\), else \(A[i][j] = 0\).
For weighted graphs, \(A[i][j]\) stores the weight (or \(\\infty\) if no edge).
</p>

<div class="env-block theorem">
<div class="env-title">Space & Time</div>
<div class="env-body">
<p>
Space: \(\\Theta(n^2)\). Check edge: \(O(1)\). Enumerate neighbors: \(\\Theta(n)\).
Best for <strong>dense graphs</strong> (\(m = \\Theta(n^2)\)) or when edge-existence queries are frequent.
</p>
</div>
</div>

<h3>1.2 Adjacency List</h3>

<p>
An array of \(n\) lists. The list \(\\text{Adj}[u]\) contains all vertices \(v\) such that \((u, v) \\in E\).
For weighted graphs, each entry stores \((v, w)\).
</p>

<div class="env-block theorem">
<div class="env-title">Space & Time</div>
<div class="env-body">
<p>
Space: \(\\Theta(n + m)\). Enumerate neighbors of \(u\): \(O(\\deg(u))\). Check edge: \(O(\\deg(u))\).
Best for <strong>sparse graphs</strong> (\(m = O(n)\)) and most algorithms.
</p>
</div>
</div>

<h3>1.3 Edge List</h3>

<p>
A simple list of all edges \((u, v)\) (or \((u, v, w)\) for weighted). Space \(\\Theta(m)\).
Useful for algorithms that iterate over all edges (e.g., Kruskal's MST, Bellman-Ford).
</p>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body">
<p>
The <strong>handshaking lemma</strong>: for undirected graphs, \(\\sum_{v \\in V} \\deg(v) = 2m\).
For directed graphs, \(\\sum_{v} \\text{in-deg}(v) = \\sum_{v} \\text{out-deg}(v) = m\).
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch12-viz-graph-rep"></div>
`,
        visualizations: [
        {
            id: 'ch12-viz-graph-rep',
            title: 'Graph Representations Comparison',
            description: 'View the same graph as adjacency matrix, adjacency list, and edge list.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 480});

                // Example graph: 5 vertices
                const labels = ['A', 'B', 'C', 'D', 'E'];
                const n = 5;
                const edges = [[0,1],[0,2],[1,2],[1,3],[2,4],[3,4]];
                const adj = Array.from({length: n}, () => Array(n).fill(0));
                edges.forEach(([u,v]) => { adj[u][v] = 1; adj[v][u] = 1; });
                const adjList = Array.from({length: n}, () => []);
                edges.forEach(([u,v]) => { adjList[u].push(v); adjList[v].push(u); });

                let mode = 'matrix';

                function drawGraph() {
                    const cx = 160, cy = 180, r = 80;
                    const positions = [];
                    for (let i = 0; i < n; i++) {
                        const angle = -Math.PI/2 + (2*Math.PI*i/n);
                        positions.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
                    }
                    edges.forEach(([u,v]) => {
                        viz.drawEdge(positions[u][0], positions[u][1], positions[v][0], positions[v][1], viz.colors.axis, false);
                    });
                    positions.forEach(([px, py], i) => {
                        viz.drawNode(px, py, 20, labels[i], viz.colors.blue);
                    });
                }

                function draw() {
                    viz.clear();
                    viz.screenText('Graph', 160, 30, viz.colors.white, 16, 'center');
                    drawGraph();

                    const rx = 350, ry = 30;
                    if (mode === 'matrix') {
                        viz.screenText('Adjacency Matrix', 510, ry, viz.colors.yellow, 15, 'center');
                        const cellW = 36, cellH = 28;
                        const sx = rx + 40, sy = ry + 30;
                        // Column headers
                        for (let j = 0; j < n; j++) {
                            viz.screenText(labels[j], sx + j * cellW + cellW/2, sy - 8, viz.colors.teal, 12, 'center');
                        }
                        // Rows
                        for (let i = 0; i < n; i++) {
                            viz.screenText(labels[i], sx - 16, sy + i * cellH + cellH/2, viz.colors.teal, 12, 'center');
                            for (let j = 0; j < n; j++) {
                                const c = adj[i][j] ? viz.colors.blue + '44' : viz.colors.bg;
                                viz.drawArrayCell(sx + j * cellW, sy + i * cellH, cellW, cellH, adj[i][j], c, adj[i][j] ? viz.colors.white : viz.colors.text);
                            }
                        }
                        viz.screenText('Space: O(n^2) = O(25)', 510, sy + n * cellH + 30, viz.colors.text, 12, 'center');
                    } else if (mode === 'adjlist') {
                        viz.screenText('Adjacency List', 510, ry, viz.colors.yellow, 15, 'center');
                        const sy = ry + 30;
                        for (let i = 0; i < n; i++) {
                            const py = sy + i * 36;
                            viz.screenText(labels[i] + ':', rx, py + 14, viz.colors.teal, 13, 'left');
                            const neighbors = adjList[i].map(j => labels[j]);
                            for (let k = 0; k < neighbors.length; k++) {
                                viz.drawArrayCell(rx + 30 + k * 40, py, 36, 28, neighbors[k], viz.colors.blue + '33', viz.colors.white);
                            }
                        }
                        viz.screenText('Space: O(n+m) = O(17)', 510, sy + n * 36 + 20, viz.colors.text, 12, 'center');
                    } else {
                        viz.screenText('Edge List', 510, ry, viz.colors.yellow, 15, 'center');
                        const sy = ry + 30;
                        for (let i = 0; i < edges.length; i++) {
                            const py = sy + i * 30;
                            const [u,v] = edges[i];
                            viz.screenText('(' + labels[u] + ', ' + labels[v] + ')', rx + 80, py + 14, viz.colors.white, 13, 'center');
                            viz.drawArrayCell(rx + 20, py, 40, 26, labels[u], viz.colors.blue + '33', viz.colors.white);
                            viz.drawArrayCell(rx + 62, py, 40, 26, labels[v], viz.colors.green + '33', viz.colors.white);
                        }
                        viz.screenText('Space: O(m) = O(6)', 510, sy + edges.length * 30 + 20, viz.colors.text, 12, 'center');
                    }

                    // Complexity summary
                    viz.screenText('Comparison', 160, 310, viz.colors.white, 14, 'center');
                    const tbl = [
                        ['Operation', 'Matrix', 'Adj List', 'Edge List'],
                        ['Space', 'O(n^2)', 'O(n+m)', 'O(m)'],
                        ['Edge?', 'O(1)', 'O(deg)', 'O(m)'],
                        ['Neighbors', 'O(n)', 'O(deg)', 'O(m)'],
                    ];
                    const tw = 130, th = 24, tsx = 30, tsy = 330;
                    for (let r = 0; r < tbl.length; r++) {
                        for (let c = 0; c < tbl[r].length; c++) {
                            const bg = r === 0 ? viz.colors.axis + '44' : viz.colors.bg;
                            const tc = r === 0 ? viz.colors.yellow : viz.colors.white;
                            viz.drawArrayCell(tsx + c * tw, tsy + r * th, tw, th, tbl[r][c], bg, tc);
                        }
                    }
                }

                VizEngine.createSelect(controls, 'Representation:', ['matrix', 'adjlist', 'edgelist'], function(v) {
                    mode = v;
                    draw();
                });

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'For an undirected graph with \\(n = 1000\\) vertices and \\(m = 5000\\) edges, which representation uses less memory: adjacency matrix or adjacency list?',
                hint: 'Compare \\(n^2 = 10^6\\) with \\(n + 2m = 11000\\).',
                solution: 'Adjacency list uses \\(O(n + m) = O(11000)\\) entries, while the adjacency matrix uses \\(O(n^2) = O(10^6)\\). The adjacency list is vastly more space-efficient for this sparse graph.'
            },
            {
                question: 'Prove the handshaking lemma: in an undirected graph, \\(\\sum_{v \\in V} \\deg(v) = 2|E|\\).',
                hint: 'Each edge contributes to the degree of exactly two vertices.',
                solution: 'Each edge \\(\\{u, v\\}\\) is counted once in \\(\\deg(u)\\) and once in \\(\\deg(v)\\). Summing all degrees counts every edge exactly twice, giving \\(\\sum_v \\deg(v) = 2|E|\\).'
            },
            {
                question: 'Given a directed graph stored as an adjacency list, how would you compute the in-degree of every vertex in \\(O(n + m)\\) time?',
                hint: 'Scan all adjacency lists; for each edge \\((u,v)\\) encountered, increment \\(\\text{in-deg}[v]\\).',
                solution: 'Initialize an array \\(\\text{indeg}[0..n-1] = 0\\). For each vertex \\(u\\), iterate over \\(\\text{Adj}[u]\\): for each \\(v \\in \\text{Adj}[u]\\), increment \\(\\text{indeg}[v]\\). Total work is \\(\\sum_u |\\text{Adj}[u]| = m\\), so overall \\(O(n + m)\\).'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 2: BFS
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch12-sec02',
        title: '2. Breadth-First Search (BFS)',
        content: `
<h2>Breadth-First Search</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>BFS explores a graph level by level, discovering all vertices at distance \(d\) before any at distance \(d+1\). It computes shortest paths in unweighted graphs and produces a BFS tree. The \(O(V + E)\) running time makes it a workhorse for graph exploration.</p></div></div>


<p>
Breadth-first search (BFS) explores a graph in "wavefronts": it visits all vertices at distance 1 from the source before those at distance 2, and so on.
BFS uses a <strong>queue</strong> to maintain the frontier.
</p>

<div class="env-block algorithm">
<div class="env-title">Algorithm 12.1: BFS(G, s)</div>
<div class="env-body">
<p>
<strong>Input:</strong> Graph \(G = (V, E)\), source vertex \(s\).<br>
<strong>Output:</strong> Distance \(d[v]\) and predecessor \(\\pi[v]\) for each reachable vertex.
</p>
<pre>
for each v in V:
    d[v] = INF; color[v] = WHITE; pi[v] = NIL
d[s] = 0; color[s] = GRAY
Q = empty queue
ENQUEUE(Q, s)
while Q is not empty:
    u = DEQUEUE(Q)
    for each v in Adj[u]:
        if color[v] == WHITE:
            d[v] = d[u] + 1
            pi[v] = u
            color[v] = GRAY
            ENQUEUE(Q, v)
    color[u] = BLACK
</pre>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 12.1 (BFS Correctness)</div>
<div class="env-body">
<p>
After BFS(G, s), for every vertex \(v\) reachable from \(s\), \(d[v] = \\delta(s, v)\),
the shortest-path distance (in terms of number of edges). The predecessor subgraph
\(G_\\pi\) forms a <strong>BFS tree</strong> rooted at \(s\).
</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof Sketch</div>
<div class="env-body">
<p>
By induction on distance. Let \(V_k = \\{v : \\delta(s,v) = k\\}\\). We show that BFS discovers all vertices
in \(V_k\) before any vertex in \(V_{k+1}\), and sets \(d[v] = k\) for \(v \\in V_k\).
The key invariant is that the queue always contains vertices with distances \(d\) and possibly \(d+1\) (but never \(d+2\)),
which follows from the FIFO property. See CLRS Theorem 22.5 for the complete proof.
</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Complexity</div>
<div class="env-body">
<p>
Time: \(O(n + m)\) (each vertex enqueued/dequeued once; each edge examined once).
Space: \(O(n)\) for the queue and auxiliary arrays.
</p>
</div>
</div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body">
<p>
Think of dropping a stone in a pond: ripples expand outward in concentric circles.
BFS explores the graph in the same way, one "layer" at a time. Layer \(k\) contains
all vertices at distance exactly \(k\) from the source.
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch12-viz-bfs"></div>

<div class="viz-placeholder" data-viz="ch12-viz-bfs-tree"></div>
`,
        visualizations: [
        {
            id: 'ch12-viz-bfs',
            title: 'BFS Wavefront Animation',
            description: 'Step through BFS on a graph, watching the wavefront expand layer by layer.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 450});

                // Graph with labeled vertices
                const labels = ['S','A','B','C','D','E','F','G'];
                const n = labels.length;
                const positions = [
                    [100, 100], [220, 60], [220, 180], [340, 60],
                    [340, 180], [460, 100], [460, 220], [580, 140]
                ];
                const edgeList = [[0,1],[0,2],[1,2],[1,3],[2,4],[3,4],[3,5],[4,5],[4,6],[5,7],[6,7]];
                const adjL = Array.from({length: n}, () => []);
                edgeList.forEach(([u,v]) => { adjL[u].push(v); adjL[v].push(u); });

                // BFS state
                let dist = [];
                let parent = [];
                let order = [];
                let queue = [];
                let step = 0;
                let maxStep = 0;

                function runBFS() {
                    dist = Array(n).fill(-1);
                    parent = Array(n).fill(-1);
                    order = [];
                    dist[0] = 0;
                    const q = [0];
                    order.push({type: 'visit', v: 0, d: 0, queue: [...q]});
                    let qi = 0;
                    while (qi < q.length) {
                        const u = q[qi++];
                        for (const v of adjL[u]) {
                            if (dist[v] === -1) {
                                dist[v] = dist[u] + 1;
                                parent[v] = u;
                                q.push(v);
                                order.push({type: 'visit', v: v, d: dist[v], parent: u, queue: q.slice(qi)});
                            }
                        }
                        order.push({type: 'done', v: u, queue: q.slice(qi)});
                    }
                    maxStep = order.length;
                }

                runBFS();

                function draw() {
                    viz.clear();
                    viz.screenText('BFS from S (step ' + step + '/' + maxStep + ')', 350, 20, viz.colors.white, 15, 'center');

                    // Determine colors based on current step
                    const visited = new Set();
                    const finished = new Set();
                    const currentDist = Array(n).fill(-1);
                    const curParent = Array(n).fill(-1);
                    let curQueue = [];

                    for (let i = 0; i < step && i < order.length; i++) {
                        const s = order[i];
                        if (s.type === 'visit') {
                            visited.add(s.v);
                            currentDist[s.v] = s.d;
                            if (s.parent !== undefined) curParent[s.v] = s.parent;
                        } else if (s.type === 'done') {
                            finished.add(s.v);
                        }
                        curQueue = s.queue || [];
                    }

                    // Draw edges
                    edgeList.forEach(([u, v]) => {
                        let ec = viz.colors.axis + '44';
                        // Tree edge?
                        if ((curParent[v] === u || curParent[u] === v) && visited.has(u) && visited.has(v)) {
                            ec = viz.colors.green;
                        }
                        viz.drawEdge(positions[u][0], positions[u][1], positions[v][0], positions[v][1], ec, false);
                    });

                    // Draw nodes
                    for (let i = 0; i < n; i++) {
                        let color = viz.colors.axis + '44';
                        if (finished.has(i)) color = viz.colors.blue;
                        else if (visited.has(i)) color = viz.colors.orange;
                        viz.drawNode(positions[i][0], positions[i][1], 22, labels[i], color);
                        if (currentDist[i] >= 0) {
                            viz.screenText('d=' + currentDist[i], positions[i][0], positions[i][1] + 32, viz.colors.yellow, 11, 'center');
                        }
                    }

                    // Queue display
                    viz.screenText('Queue:', 50, 340, viz.colors.teal, 13, 'left');
                    for (let i = 0; i < curQueue.length; i++) {
                        viz.drawArrayCell(110 + i * 42, 328, 38, 26, labels[curQueue[i]], viz.colors.teal + '33', viz.colors.white);
                    }

                    // Distance summary
                    viz.screenText('Distances:', 50, 390, viz.colors.text, 12, 'left');
                    for (let i = 0; i < n; i++) {
                        const dStr = currentDist[i] >= 0 ? String(currentDist[i]) : '-';
                        viz.drawArrayCell(50 + i * 60, 405, 55, 26, labels[i] + ':' + dStr,
                            currentDist[i] >= 0 ? viz.colors.blue + '33' : viz.colors.bg, viz.colors.white);
                    }
                }

                VizEngine.createButton(controls, 'Reset', function() { step = 0; draw(); });
                VizEngine.createButton(controls, 'Step', function() { if (step < maxStep) { step++; draw(); } });
                VizEngine.createButton(controls, 'Run All', function() { step = maxStep; draw(); });

                draw();
                return viz;
            }
        },
        {
            id: 'ch12-viz-bfs-tree',
            title: 'BFS Tree Visualization',
            description: 'See the BFS tree extracted from the traversal, showing shortest-path distances.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 400});

                const labels = ['S','A','B','C','D','E','F','G'];
                const n = labels.length;
                // BFS tree edges from S: S-A, S-B, A-C, B-D, C-E/D-E, E-F, E-G or similar
                const edgeList = [[0,1],[0,2],[1,2],[1,3],[2,4],[3,4],[3,5],[4,5],[4,6],[5,7],[6,7]];
                const adjL = Array.from({length: n}, () => []);
                edgeList.forEach(([u,v]) => { adjL[u].push(v); adjL[v].push(u); });

                // Run BFS
                const dist = Array(n).fill(-1);
                const par = Array(n).fill(-1);
                dist[0] = 0;
                const q = [0];
                let qi = 0;
                while (qi < q.length) {
                    const u = q[qi++];
                    for (const v of adjL[u]) {
                        if (dist[v] === -1) {
                            dist[v] = dist[u] + 1;
                            par[v] = u;
                            q.push(v);
                        }
                    }
                }

                // Layout tree by layers
                const maxD = Math.max(...dist);
                const layers = Array.from({length: maxD + 1}, () => []);
                for (let i = 0; i < n; i++) layers[dist[i]].push(i);

                const treePos = Array(n);
                for (let d = 0; d <= maxD; d++) {
                    const count = layers[d].length;
                    for (let i = 0; i < count; i++) {
                        const v = layers[d][i];
                        treePos[v] = [120 + (i + 0.5) * (460 / count), 60 + d * 80];
                    }
                }

                function draw() {
                    viz.clear();
                    viz.screenText('BFS Tree from S', 350, 20, viz.colors.white, 15, 'center');

                    // Draw tree edges
                    for (let v = 0; v < n; v++) {
                        if (par[v] >= 0) {
                            viz.drawTreeEdge(treePos[par[v]][0], treePos[par[v]][1], treePos[v][0], treePos[v][1], viz.colors.green);
                        }
                    }

                    // Draw non-tree edges (dashed)
                    edgeList.forEach(([u, v]) => {
                        if (par[v] !== u && par[u] !== v) {
                            const ctx = viz.ctx;
                            ctx.strokeStyle = viz.colors.axis + '44';
                            ctx.lineWidth = 1;
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            ctx.moveTo(treePos[u][0], treePos[u][1]);
                            ctx.lineTo(treePos[v][0], treePos[v][1]);
                            ctx.stroke();
                            ctx.setLineDash([]);
                        }
                    });

                    // Draw nodes
                    const layerColors = [viz.colors.blue, viz.colors.teal, viz.colors.green, viz.colors.orange, viz.colors.purple];
                    for (let v = 0; v < n; v++) {
                        const c = layerColors[dist[v] % layerColors.length];
                        viz.drawNode(treePos[v][0], treePos[v][1], 22, labels[v], c);
                        viz.screenText('d=' + dist[v], treePos[v][0], treePos[v][1] + 30, viz.colors.yellow, 11, 'center');
                    }

                    // Layer labels
                    for (let d = 0; d <= maxD; d++) {
                        viz.screenText('Layer ' + d, 50, 60 + d * 80, viz.colors.text, 11, 'center');
                    }
                }

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Run BFS from vertex 1 on the graph with edges \\(\\{(0,1),(1,2),(1,3),(2,4),(3,4),(4,5)\\}\\). What is \\(d[5]\\)?',
                hint: 'Trace the wavefront: layer 0 = {1}, layer 1 = {0,2,3}, layer 2 = {4}, layer 3 = {5}.',
                solution: '\\(d[5] = 3\\). The shortest path is \\(1 \\to 2 \\to 4 \\to 5\\) (or \\(1 \\to 3 \\to 4 \\to 5\\)).'
            },
            {
                question: 'Show that BFS on an unweighted undirected graph computes shortest paths. Specifically, prove that if \\(d[v] = k\\) after BFS, then \\(\\delta(s, v) = k\\).',
                hint: 'Use induction: show \\(d[v] \\ge \\delta(s,v)\\) always holds, then show equality by induction on \\(\\delta(s,v)\\).',
                solution: 'First, \\(d[v] \\ge \\delta(s,v)\\) since BFS only assigns \\(d[v] = d[u] + 1\\), so \\(d[v]\\) is the length of some path. For the other direction, use induction on \\(k = \\delta(s,v)\\). Base: \\(d[s] = 0 = \\delta(s,s)\\). Step: suppose the claim holds for all \\(u\\) with \\(\\delta(s,u) = k-1\\). For \\(v\\) with \\(\\delta(s,v) = k\\), there exists \\(u\\) adjacent to \\(v\\) with \\(\\delta(s,u) = k-1\\), so \\(d[u] = k-1\\). When BFS dequeues \\(u\\), if \\(v\\) is still white, then \\(d[v] = k\\). The FIFO property ensures \\(v\\) cannot have been discovered earlier with a larger distance.'
            },
            {
                question: 'What is the maximum size of the BFS queue during execution on a complete graph \\(K_n\\)?',
                hint: 'After dequeuing the source, all \\(n-1\\) other vertices are enqueued.',
                solution: 'When the source \\(s\\) is dequeued, all \\(n - 1\\) vertices become gray and are enqueued simultaneously. So the maximum queue size is \\(n - 1\\).'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 3: DFS
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch12-sec03',
        title: '3. Depth-First Search (DFS)',
        content: `
<h2>Depth-First Search</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>DFS plunges as deep as possible along each branch before backtracking. It assigns discovery and finish times to each vertex, creating a temporal structure that reveals powerful information about the graph's structure.</p></div></div>


<p>
Depth-first search (DFS) explores as deeply as possible along each branch before backtracking.
DFS assigns each vertex a <strong>discovery time</strong> \(d[v]\) and a <strong>finish time</strong> \(f[v]\),
which encode rich structural information about the graph.
</p>

<div class="env-block algorithm">
<div class="env-title">Algorithm 12.2: DFS(G)</div>
<div class="env-body">
<pre>
time = 0
for each v in V:
    color[v] = WHITE; pi[v] = NIL
for each v in V:
    if color[v] == WHITE:
        DFS-VISIT(G, v)

DFS-VISIT(G, u):
    time = time + 1; d[u] = time
    color[u] = GRAY
    for each v in Adj[u]:
        if color[v] == WHITE:
            pi[v] = u
            DFS-VISIT(G, v)
    color[u] = BLACK
    time = time + 1; f[u] = time
</pre>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 12.2 (Parenthesis Theorem)</div>
<div class="env-body">
<p>
In any DFS of a graph \(G = (V, E)\), for any two vertices \(u\) and \(v\),
exactly one of the following holds:
</p>
<ul>
<li>\([d[u], f[u]]\) and \([d[v], f[v]]\) are entirely disjoint (neither is an ancestor of the other).</li>
<li>\([d[u], f[u]] \\subset [d[v], f[v]]\) (\(u\) is a descendant of \(v\) in the DFS forest).</li>
<li>\([d[v], f[v]] \\subset [d[u], f[u]]\) (\(v\) is a descendant of \(u\) in the DFS forest).</li>
</ul>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">White-Path Theorem</div>
<div class="env-body">
<p>
Vertex \(v\) is a descendant of \(u\) in the DFS forest if and only if, at time \(d[u]\),
there exists a path from \(u\) to \(v\) consisting entirely of white vertices.
</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Complexity</div>
<div class="env-body">
<p>
Time: \(O(n + m)\). Each vertex is visited exactly once; each edge is examined once (directed) or twice (undirected).
Space: \(O(n)\) for the recursion stack (in the worst case, e.g., a path graph).
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch12-viz-dfs"></div>
`,
        visualizations: [
        {
            id: 'ch12-viz-dfs',
            title: 'DFS with Discovery/Finish Times',
            description: 'Step through DFS on a directed graph, watching discovery and finish timestamps.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 450});

                const labels = ['A','B','C','D','E','F'];
                const n = labels.length;
                const positions = [
                    [100, 100], [250, 60], [400, 100],
                    [100, 260], [250, 300], [400, 260]
                ];
                // Directed edges
                const edges = [[0,1],[0,3],[1,2],[1,4],[2,5],[3,4],[4,5]];
                const adjL = Array.from({length: n}, () => []);
                edges.forEach(([u,v]) => { adjL[u].push(v); });

                // Run full DFS and record steps
                let steps = [];
                function buildDFS() {
                    steps = [];
                    const color = Array(n).fill(0); // 0=white, 1=gray, 2=black
                    const d = Array(n).fill(0);
                    const f = Array(n).fill(0);
                    const par = Array(n).fill(-1);
                    let time = 0;
                    function visit(u) {
                        time++;
                        d[u] = time;
                        color[u] = 1;
                        steps.push({colors: [...color], d: [...d], f: [...f], current: u, action: 'discover', par: [...par]});
                        for (const v of adjL[u]) {
                            if (color[v] === 0) {
                                par[v] = u;
                                visit(v);
                            }
                        }
                        time++;
                        f[u] = time;
                        color[u] = 2;
                        steps.push({colors: [...color], d: [...d], f: [...f], current: u, action: 'finish', par: [...par]});
                    }
                    for (let i = 0; i < n; i++) {
                        if (color[i] === 0) visit(i);
                    }
                }
                buildDFS();

                let step = 0;

                function draw() {
                    viz.clear();
                    viz.screenText('DFS (step ' + step + '/' + steps.length + ')', 350, 20, viz.colors.white, 15, 'center');

                    let curState = null;
                    if (step > 0 && step <= steps.length) {
                        curState = steps[step - 1];
                    }

                    // Draw edges
                    edges.forEach(([u, v]) => {
                        const r = 22;
                        const dx = positions[v][0] - positions[u][0];
                        const dy = positions[v][1] - positions[u][1];
                        const len = Math.sqrt(dx*dx + dy*dy);
                        const ux = dx/len, uy = dy/len;
                        let ec = viz.colors.axis + '55';
                        if (curState && curState.par[v] === u) ec = viz.colors.green;
                        viz.drawEdge(
                            positions[u][0] + ux*r, positions[u][1] + uy*r,
                            positions[v][0] - ux*r, positions[v][1] - uy*r,
                            ec, true
                        );
                    });

                    // Draw nodes
                    for (let i = 0; i < n; i++) {
                        let color = viz.colors.axis + '44';
                        if (curState) {
                            if (curState.colors[i] === 2) color = viz.colors.blue;
                            else if (curState.colors[i] === 1) color = viz.colors.orange;
                        }
                        if (curState && curState.current === i) {
                            const hc = curState.action === 'discover' ? viz.colors.yellow : viz.colors.green;
                            viz.drawNode(positions[i][0], positions[i][1], 26, '', hc + '33');
                        }
                        viz.drawNode(positions[i][0], positions[i][1], 22, labels[i], color);

                        // Timestamps
                        if (curState) {
                            let ts = '';
                            if (curState.d[i] > 0) ts += curState.d[i];
                            if (curState.f[i] > 0) ts += '/' + curState.f[i];
                            else if (curState.d[i] > 0) ts += '/-';
                            if (ts) viz.screenText(ts, positions[i][0], positions[i][1] + 34, viz.colors.yellow, 11, 'center');
                        }
                    }

                    // Legend
                    viz.screenText('Legend:', 520, 60, viz.colors.text, 12, 'left');
                    viz.drawNode(530, 90, 10, '', viz.colors.axis + '44');
                    viz.screenText('White (undiscovered)', 550, 90, viz.colors.text, 11, 'left');
                    viz.drawNode(530, 120, 10, '', viz.colors.orange);
                    viz.screenText('Gray (in stack)', 550, 120, viz.colors.text, 11, 'left');
                    viz.drawNode(530, 150, 10, '', viz.colors.blue);
                    viz.screenText('Black (finished)', 550, 150, viz.colors.text, 11, 'left');

                    // Current action
                    if (curState) {
                        const act = curState.action === 'discover' ? 'Discover ' : 'Finish ';
                        viz.screenText(act + labels[curState.current], 350, 420, viz.colors.yellow, 14, 'center');
                    }

                    // Parenthesis representation
                    if (curState) {
                        viz.screenText('Parenthesis: d[v]/f[v]', 350, 380, viz.colors.text, 11, 'center');
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
                question: 'Run DFS on the directed graph with edges \\(\\{(0,1),(0,2),(1,3),(2,3),(3,4)\\}\\) starting from vertex 0. Give discovery and finish times for all vertices.',
                hint: 'Follow the DFS-VISIT recursion: 0 discovers 1, 1 discovers 3, 3 discovers 4. Then backtrack.',
                solution: 'One possible DFS order: \\(d[0]=1, d[1]=2, d[3]=3, d[4]=4, f[4]=5, f[3]=6, f[1]=7, d[2]=8, f[2]=9, f[0]=10\\).'
            },
            {
                question: 'Prove the parenthesis theorem: for any two vertices \\(u, v\\), the intervals \\([d[u], f[u]]\\) and \\([d[v], f[v]]\\) are either disjoint or one contains the other.',
                hint: 'Consider the cases when \\(d[u] < d[v]\\): either \\(v\\) is discovered during the exploration of \\(u\\) (nested), or after \\(u\\) finishes (disjoint).',
                solution: 'WLOG \\(d[u] < d[v]\\). Case 1: \\(d[v] < f[u]\\). Then \\(v\\) was discovered while \\(u\\) was gray, so \\(v\\) is a descendant of \\(u\\) in the DFS tree. Since DFS finishes descendants before ancestors, \\(f[v] < f[u]\\), giving \\([d[v], f[v]] \\subset [d[u], f[u]]\\). Case 2: \\(d[v] > f[u]\\). Then the intervals are disjoint. The case \\(d[v] = f[u]\\) is impossible since a vertex is finished only after all its edges are explored.'
            },
            {
                question: 'What is the worst-case recursion depth of DFS? When does it occur?',
                hint: 'Consider a path graph \\(v_1 \\to v_2 \\to \\cdots \\to v_n\\).',
                solution: 'The worst-case recursion depth is \\(\\Theta(n)\\), occurring on a path graph (or any graph with a Hamiltonian path that DFS follows). Each recursive call pushes one frame onto the call stack. This can cause a stack overflow for very large graphs, motivating iterative DFS implementations.'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 4: Edge Classification
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch12-sec04',
        title: '4. Edge Classification',
        content: `
<h2>Edge Classification in DFS</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>DFS classifies every edge as a tree, back, forward, or cross edge. This classification is not just a curiosity: back edges detect cycles, and the absence of back edges characterizes DAGs (directed acyclic graphs), which are central to Chapter 13.</p></div></div>


<p>
DFS classifies every edge \((u, v)\) of the graph into one of four types, based on
the state of \(v\) when the edge is explored from \(u\).
</p>

<div class="env-block definition">
<div class="env-title">Definition 12.2 (Edge Types)</div>
<div class="env-body">
<p>During DFS, when we explore edge \((u, v)\):</p>
<ul>
<li><strong>Tree edge</strong>: \(v\) is white. Edge is part of the DFS forest.</li>
<li><strong>Back edge</strong>: \(v\) is gray. Edge goes to an ancestor in the DFS tree. Self-loops are back edges.</li>
<li><strong>Forward edge</strong>: \(v\) is black and \(d[u] < d[v]\). Edge goes to a descendant (via a non-tree path).</li>
<li><strong>Cross edge</strong>: \(v\) is black and \(d[u] > d[v]\). Edge goes to a vertex in a different subtree or an already-finished vertex.</li>
</ul>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 12.3 (Edge Classification by Timestamps)</div>
<div class="env-body">
<p>In a DFS of a directed graph, edge \((u, v)\) is:</p>
<ul>
<li><strong>Tree/Forward</strong> if \(d[u] < d[v] < f[v] < f[u]\) (v's interval nested in u's).</li>
<li><strong>Back</strong> if \(d[v] \\le d[u] < f[u] \\le f[v]\) (u's interval nested in v's).</li>
<li><strong>Cross</strong> if \(d[v] < f[v] < d[u] < f[u]\) (v's interval entirely before u's).</li>
</ul>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 12.4 (Undirected Graphs)</div>
<div class="env-body">
<p>
In DFS on an <strong>undirected</strong> graph, every edge is either a <strong>tree edge</strong> or a <strong>back edge</strong>.
There are no forward or cross edges.
</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof</div>
<div class="env-body">
<p>
Consider an edge \(\\{u, v\\}\) in an undirected graph, explored from \(u\) to \(v\).
If \(v\) is white, it is a tree edge. If \(v\) is gray, it is a back edge (to an ancestor).
Can \(v\) be black? If \(v\) is black, then \(v\) was finished before \(u\) was discovered.
But since \(\\{u, v\\}\) is an edge and \(v\) was explored first, when DFS explored \(v\),
it would have discovered \(u\) (since \(u\) is adjacent to \(v\)). Contradiction with \(u\)
being discovered after \(v\) finishes. Thus \(v\) cannot be black.
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch12-viz-edge-class"></div>
`,
        visualizations: [
        {
            id: 'ch12-viz-edge-class',
            title: 'Edge Classification Visualization',
            description: 'Run DFS on a directed graph and see how each edge is classified.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 450});

                const labels = ['A','B','C','D','E','F'];
                const n = labels.length;
                const positions = [
                    [100, 80], [260, 60], [420, 80],
                    [100, 280], [260, 300], [420, 280]
                ];
                // Directed edges with various classifications possible
                const edges = [
                    [0, 1], [1, 2], [0, 3], [3, 4],
                    [4, 1], // back or cross
                    [2, 5], [5, 3], // back
                    [0, 4], // forward
                ];
                const adjL = Array.from({length: n}, () => []);
                edges.forEach(([u,v]) => { adjL[u].push(v); });

                // Full DFS
                const color = Array(n).fill(0);
                const d = Array(n).fill(0);
                const f = Array(n).fill(0);
                const par = Array(n).fill(-1);
                let time = 0;
                const edgeTypes = [];

                function visit(u) {
                    time++;
                    d[u] = time;
                    color[u] = 1;
                    for (const v of adjL[u]) {
                        if (color[v] === 0) {
                            par[v] = u;
                            edgeTypes.push({u, v, type: 'Tree'});
                            visit(v);
                        } else if (color[v] === 1) {
                            edgeTypes.push({u, v, type: 'Back'});
                        } else {
                            if (d[u] < d[v]) {
                                edgeTypes.push({u, v, type: 'Forward'});
                            } else {
                                edgeTypes.push({u, v, type: 'Cross'});
                            }
                        }
                    }
                    time++;
                    f[u] = time;
                    color[u] = 2;
                }
                for (let i = 0; i < n; i++) {
                    if (color[i] === 0) visit(i);
                }

                // Build edge type map
                const edgeTypeMap = {};
                edgeTypes.forEach(e => { edgeTypeMap[e.u + '-' + e.v] = e.type; });

                const typeColors = {
                    'Tree': viz.colors.green,
                    'Back': viz.colors.red,
                    'Forward': viz.colors.blue,
                    'Cross': viz.colors.orange
                };

                function draw() {
                    viz.clear();
                    viz.screenText('DFS Edge Classification (Directed Graph)', 350, 20, viz.colors.white, 15, 'center');

                    // Draw edges with classification colors
                    const r = 22;
                    edges.forEach(([u, v]) => {
                        const dx = positions[v][0] - positions[u][0];
                        const dy = positions[v][1] - positions[u][1];
                        const len = Math.sqrt(dx*dx + dy*dy);
                        const ux1 = dx/len, uy1 = dy/len;
                        const key = u + '-' + v;
                        const type = edgeTypeMap[key] || 'Tree';
                        const ec = typeColors[type];
                        viz.drawEdge(
                            positions[u][0] + ux1*r, positions[u][1] + uy1*r,
                            positions[v][0] - ux1*r, positions[v][1] - uy1*r,
                            ec, true, null, 2
                        );
                        // Label edge type
                        const mx = (positions[u][0] + positions[v][0]) / 2;
                        const my = (positions[u][1] + positions[v][1]) / 2;
                        const nx = -dy/len, ny = dx/len;
                        viz.screenText(type, mx + nx * 18, my + ny * 18, ec, 10, 'center');
                    });

                    // Draw nodes with timestamps
                    for (let i = 0; i < n; i++) {
                        viz.drawNode(positions[i][0], positions[i][1], 22, labels[i], viz.colors.blue);
                        viz.screenText(d[i] + '/' + f[i], positions[i][0], positions[i][1] + 34, viz.colors.yellow, 11, 'center');
                    }

                    // Legend
                    const lx = 500, ly = 170;
                    viz.screenText('Edge Types:', lx, ly, viz.colors.white, 13, 'left');
                    const types = ['Tree', 'Back', 'Forward', 'Cross'];
                    types.forEach((t, i) => {
                        const ctx = viz.ctx;
                        ctx.strokeStyle = typeColors[t];
                        ctx.lineWidth = 3;
                        ctx.beginPath();
                        ctx.moveTo(lx, ly + 25 + i * 25);
                        ctx.lineTo(lx + 30, ly + 25 + i * 25);
                        ctx.stroke();
                        viz.screenText(t, lx + 40, ly + 25 + i * 25, typeColors[t], 12, 'left');
                    });

                    // Timestamp table
                    viz.screenText('Timestamps (d/f):', 100, 380, viz.colors.text, 12, 'left');
                    for (let i = 0; i < n; i++) {
                        viz.drawArrayCell(60 + i * 80, 395, 75, 28,
                            labels[i] + ': ' + d[i] + '/' + f[i],
                            viz.colors.blue + '22', viz.colors.white);
                    }
                }

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Prove that a directed graph has a cycle if and only if DFS finds a back edge.',
                hint: 'Forward direction: a cycle implies a back edge because the first vertex on the cycle to be discovered will see a gray ancestor. Reverse: a back edge \\((u, v)\\) means \\(v\\) is an ancestor of \\(u\\), so the tree path \\(v \\rightsquigarrow u\\) plus edge \\((u, v)\\) forms a cycle.',
                solution: '(=>) Suppose \\(G\\) has a cycle \\(v_1 \\to v_2 \\to \\cdots \\to v_k \\to v_1\\). Let \\(v_i\\) be the first vertex on the cycle discovered by DFS. By the white-path theorem, all other cycle vertices become descendants of \\(v_i\\). When DFS explores the edge from \\(v_{i-1}\\) (or \\(v_k\\) if \\(i=1\\)) to \\(v_i\\), \\(v_i\\) is gray (still on the stack). This is a back edge. (<=) If \\((u,v)\\) is a back edge, then \\(v\\) is an ancestor of \\(u\\) in the DFS tree. The tree path \\(v \\rightsquigarrow u\\) together with the edge \\((u, v)\\) forms a cycle.'
            },
            {
                question: 'Why can an undirected graph DFS not produce forward or cross edges?',
                hint: 'Consider what happens when DFS at vertex \\(u\\) examines edge \\(\\{u, v\\}\\) and \\(v\\) is black.',
                solution: 'If \\(v\\) were black when exploring \\(\\{u, v\\}\\) from \\(u\\), then \\(v\\) was finished before \\(u\\) was discovered. But \\(v\\) is adjacent to \\(u\\), so when DFS explored \\(v\\), it would have discovered \\(u\\) (since \\(u\\) was white at that point). This contradicts \\(u\\) being discovered after \\(v\\) finishes. Therefore \\(v\\) can only be white (tree edge) or gray (back edge) when explored from \\(u\\).'
            },
            {
                question: 'Given a DFS with timestamps \\(d[u]=3, f[u]=8, d[v]=5, f[v]=7\\), classify the edge \\((u, v)\\).',
                hint: 'Check containment of intervals.',
                solution: 'Since \\([5, 7] \\subset [3, 8]\\), \\(v\\) is a descendant of \\(u\\). The edge \\((u, v)\\) is either a tree edge (if \\(v\\) was discovered directly from \\(u\\)) or a forward edge (if \\(v\\) was reached via another path from \\(u\\)). Both have the same interval relationship; the distinction requires checking whether \\(\\pi[v] = u\\).'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 5: Applications
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch12-sec05',
        title: '5. Applications of BFS & DFS',
        content: `
<h2>Applications of BFS & DFS</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>We close with applications: bipartiteness testing (BFS-based), cycle detection (DFS-based), and connected component computation. These applications demonstrate how BFS and DFS serve as subroutines in larger graph algorithms.</p></div></div>


<h3>5.1 Cycle Detection</h3>

<div class="env-block theorem">
<div class="env-title">Theorem 12.5</div>
<div class="env-body">
<p>
<strong>Directed graph:</strong> \(G\) has a cycle \(\iff\) DFS produces a back edge.<br>
<strong>Undirected graph:</strong> \(G\) has a cycle \(\iff\) DFS produces a back edge (i.e., an edge to a gray vertex that is not the parent).
</p>
</div>
</div>

<h3>5.2 Bipartiteness Testing</h3>

<div class="env-block definition">
<div class="env-title">Definition 12.3 (Bipartite Graph)</div>
<div class="env-body">
<p>
A graph is <strong>bipartite</strong> if its vertex set can be partitioned into two sets \(L\) and \(R\)
such that every edge has one endpoint in \(L\) and one in \(R\).
</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 12.6</div>
<div class="env-body">
<p>
A graph is bipartite if and only if it contains no odd-length cycle.
This can be tested in \(O(n + m)\) time using BFS: assign colors alternately by layer;
if any edge connects two vertices of the same color, the graph is not bipartite.
</p>
</div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm 12.3: Bipartiteness Test via BFS</div>
<div class="env-body">
<pre>
color = array of -1 (uncolored)
for each vertex s:
    if color[s] == -1:
        color[s] = 0
        Q = {s}
        while Q not empty:
            u = DEQUEUE(Q)
            for each v in Adj[u]:
                if color[v] == -1:
                    color[v] = 1 - color[u]
                    ENQUEUE(Q, v)
                elif color[v] == color[u]:
                    return "NOT bipartite"
return "bipartite"
</pre>
</div>
</div>

<h3>5.3 Connected Components</h3>

<p>
In an undirected graph, BFS or DFS from each unvisited vertex identifies all <strong>connected components</strong>.
In a directed graph, we need more sophisticated algorithms (Kosaraju, Tarjan) for <strong>strongly connected components</strong> (Chapter 13).
</p>

<h3>5.4 Path Finding</h3>

<p>
BFS finds shortest paths in unweighted graphs. DFS can find <em>any</em> path (not necessarily shortest).
Both construct predecessor arrays \(\\pi[v]\) that can be traced back to recover the path.
</p>

<div class="viz-placeholder" data-viz="ch12-viz-bipartite"></div>

<div class="viz-placeholder" data-viz="ch12-viz-cycle"></div>

<div class="viz-placeholder" data-viz="ch12-viz-components"></div>

<div class="env-block bridge"><div class="env-title">Looking Ahead</div><div class="env-body"><p>DFS reveals the temporal structure of a graph through discovery and finish times. Chapter 13 exploits this structure for two fundamental problems: topological sorting of DAGs and decomposing directed graphs into strongly connected components.</p></div></div>`,
        visualizations: [
        {
            id: 'ch12-viz-bipartite',
            title: 'Bipartiteness Checker',
            description: 'BFS-based 2-coloring: see whether a graph is bipartite and find an odd cycle if not.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 400});

                const examples = {
                    bipartite: {
                        labels: ['A','B','C','D','E','F'],
                        edges: [[0,1],[0,3],[1,2],[2,5],[3,4],[4,5]],
                        positions: [[80,100],[220,60],[360,100],[80,260],[220,300],[360,260]]
                    },
                    notBipartite: {
                        labels: ['A','B','C','D','E'],
                        edges: [[0,1],[1,2],[2,3],[3,4],[4,0],[1,3]],
                        positions: [[180,60],[320,100],[350,250],[180,300],[80,180]]
                    }
                };

                let current = 'bipartite';

                function checkBipartite(labels, edges) {
                    const n = labels.length;
                    const adjL = Array.from({length: n}, () => []);
                    edges.forEach(([u,v]) => { adjL[u].push(v); adjL[v].push(u); });
                    const color = Array(n).fill(-1);
                    let isBip = true;
                    let badEdge = null;
                    color[0] = 0;
                    const q = [0];
                    let qi = 0;
                    while (qi < q.length) {
                        const u = q[qi++];
                        for (const v of adjL[u]) {
                            if (color[v] === -1) {
                                color[v] = 1 - color[u];
                                q.push(v);
                            } else if (color[v] === color[u]) {
                                isBip = false;
                                badEdge = [u, v];
                            }
                        }
                    }
                    return {color, isBip, badEdge};
                }

                function draw() {
                    viz.clear();
                    const ex = examples[current];
                    const {color, isBip, badEdge} = checkBipartite(ex.labels, ex.edges);

                    viz.screenText(isBip ? 'Bipartite!' : 'Not Bipartite (odd cycle)', 350, 20,
                        isBip ? viz.colors.green : viz.colors.red, 16, 'center');

                    // Draw edges
                    ex.edges.forEach(([u, v]) => {
                        let ec = viz.colors.axis + '55';
                        if (badEdge && ((badEdge[0] === u && badEdge[1] === v) || (badEdge[0] === v && badEdge[1] === u))) {
                            ec = viz.colors.red;
                        }
                        viz.drawEdge(ex.positions[u][0], ex.positions[u][1], ex.positions[v][0], ex.positions[v][1], ec, false, null, ec === viz.colors.red ? 3 : 1.5);
                    });

                    // Draw nodes
                    const bipColors = [viz.colors.blue, viz.colors.orange];
                    for (let i = 0; i < ex.labels.length; i++) {
                        const c = color[i] >= 0 ? bipColors[color[i]] : viz.colors.axis;
                        viz.drawNode(ex.positions[i][0], ex.positions[i][1], 22, ex.labels[i], c);
                        viz.screenText('Set ' + (color[i] >= 0 ? color[i] : '?'), ex.positions[i][0], ex.positions[i][1] + 34, viz.colors.text, 10, 'center');
                    }

                    // Explanation
                    const ey = 370;
                    if (isBip) {
                        viz.screenText('All edges connect vertices of different colors (sets).', 350, ey, viz.colors.green, 12, 'center');
                    } else {
                        viz.screenText('Red edge connects two same-color vertices => odd cycle exists.', 350, ey, viz.colors.red, 12, 'center');
                    }
                }

                VizEngine.createSelect(controls, 'Example:', [
                    {value: 'bipartite', label: 'Bipartite Graph'},
                    {value: 'notBipartite', label: 'Non-Bipartite Graph'}
                ], function(v) { current = v; draw(); });

                draw();
                return viz;
            }
        },
        {
            id: 'ch12-viz-cycle',
            title: 'Cycle Detection via DFS',
            description: 'DFS-based cycle detection in a directed graph. Back edges indicate cycles.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 380});

                const examples = {
                    acyclic: {
                        labels: ['A','B','C','D','E'],
                        edges: [[0,1],[0,2],[1,3],[2,3],[3,4]],
                        positions: [[100,80],[250,50],[250,180],[400,120],[550,120]]
                    },
                    cyclic: {
                        labels: ['A','B','C','D','E'],
                        edges: [[0,1],[1,2],[2,3],[3,1],[3,4]],
                        positions: [[100,120],[250,50],[400,80],[400,220],[550,180]]
                    }
                };

                let current = 'acyclic';

                function detectCycle(labels, edges) {
                    const n = labels.length;
                    const adjL = Array.from({length: n}, () => []);
                    edges.forEach(([u,v]) => { adjL[u].push(v); });
                    const color = Array(n).fill(0);
                    const backEdges = [];
                    function visit(u) {
                        color[u] = 1;
                        for (const v of adjL[u]) {
                            if (color[v] === 1) backEdges.push([u, v]);
                            else if (color[v] === 0) visit(v);
                        }
                        color[u] = 2;
                    }
                    for (let i = 0; i < n; i++) {
                        if (color[i] === 0) visit(i);
                    }
                    return backEdges;
                }

                function draw() {
                    viz.clear();
                    const ex = examples[current];
                    const backEdges = detectCycle(ex.labels, ex.edges);
                    const hasCycle = backEdges.length > 0;

                    viz.screenText(hasCycle ? 'Cycle Detected!' : 'No Cycle (DAG)', 350, 20,
                        hasCycle ? viz.colors.red : viz.colors.green, 16, 'center');

                    const backSet = new Set(backEdges.map(([u,v]) => u + '-' + v));

                    // Draw edges
                    const r = 22;
                    ex.edges.forEach(([u, v]) => {
                        const dx = ex.positions[v][0] - ex.positions[u][0];
                        const dy = ex.positions[v][1] - ex.positions[u][1];
                        const len = Math.sqrt(dx*dx + dy*dy);
                        const ux1 = dx/len, uy1 = dy/len;
                        const isBack = backSet.has(u + '-' + v);
                        viz.drawEdge(
                            ex.positions[u][0] + ux1*r, ex.positions[u][1] + uy1*r,
                            ex.positions[v][0] - ux1*r, ex.positions[v][1] - uy1*r,
                            isBack ? viz.colors.red : viz.colors.axis, true, null, isBack ? 3 : 1.5
                        );
                        if (isBack) {
                            const mx = (ex.positions[u][0] + ex.positions[v][0]) / 2;
                            const my = (ex.positions[u][1] + ex.positions[v][1]) / 2;
                            viz.screenText('BACK', mx + 15, my - 10, viz.colors.red, 10, 'center');
                        }
                    });

                    for (let i = 0; i < ex.labels.length; i++) {
                        viz.drawNode(ex.positions[i][0], ex.positions[i][1], 22, ex.labels[i], viz.colors.blue);
                    }

                    if (hasCycle) {
                        viz.screenText('Back edge ' + ex.labels[backEdges[0][0]] + ' -> ' + ex.labels[backEdges[0][1]] + ' creates a cycle.',
                            350, 340, viz.colors.red, 12, 'center');
                    }
                }

                VizEngine.createSelect(controls, 'Graph:', [
                    {value: 'acyclic', label: 'DAG (no cycle)'},
                    {value: 'cyclic', label: 'Cyclic graph'}
                ], function(v) { current = v; draw(); });

                draw();
                return viz;
            }
        },
        {
            id: 'ch12-viz-components',
            title: 'Connected Components via BFS/DFS',
            description: 'Identify all connected components in an undirected graph by coloring.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 380});

                const labels = ['A','B','C','D','E','F','G','H','I'];
                const n = labels.length;
                const positions = [
                    [80, 100], [180, 60], [180, 160],
                    [320, 80], [420, 60], [420, 160],
                    [560, 100], [560, 220], [660, 160]
                ];
                const edges = [[0,1],[0,2],[1,2],[3,4],[3,5],[4,5],[6,7],[7,8],[6,8]];
                const adjL = Array.from({length: n}, () => []);
                edges.forEach(([u,v]) => { adjL[u].push(v); adjL[v].push(u); });

                // Find components
                const comp = Array(n).fill(-1);
                let numComp = 0;
                for (let i = 0; i < n; i++) {
                    if (comp[i] === -1) {
                        const q = [i];
                        comp[i] = numComp;
                        let qi = 0;
                        while (qi < q.length) {
                            const u = q[qi++];
                            for (const v of adjL[u]) {
                                if (comp[v] === -1) {
                                    comp[v] = numComp;
                                    q.push(v);
                                }
                            }
                        }
                        numComp++;
                    }
                }

                const compColors = [viz.colors.blue, viz.colors.green, viz.colors.orange, viz.colors.purple, viz.colors.pink];

                function draw() {
                    viz.clear();
                    viz.screenText('Connected Components: ' + numComp + ' components', 350, 20, viz.colors.white, 15, 'center');

                    // Draw edges
                    edges.forEach(([u, v]) => {
                        viz.drawEdge(positions[u][0], positions[u][1], positions[v][0], positions[v][1], compColors[comp[u]], false);
                    });

                    // Draw nodes
                    for (let i = 0; i < n; i++) {
                        viz.drawNode(positions[i][0], positions[i][1], 22, labels[i], compColors[comp[i]]);
                        viz.screenText('C' + comp[i], positions[i][0], positions[i][1] + 34, viz.colors.text, 10, 'center');
                    }

                    // Summary
                    for (let c = 0; c < numComp; c++) {
                        const members = [];
                        for (let i = 0; i < n; i++) if (comp[i] === c) members.push(labels[i]);
                        viz.screenText('Component ' + c + ': {' + members.join(', ') + '}',
                            350, 310 + c * 22, compColors[c], 12, 'center');
                    }
                }

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Give an \\(O(n + m)\\) algorithm to determine whether an undirected graph is bipartite.',
                hint: 'Use BFS: attempt a 2-coloring by assigning alternate colors to neighbors.',
                solution: 'Run BFS from any unvisited vertex. Color the source with color 0. For each neighbor, assign color 1 - color[parent]. If any edge connects two same-colored vertices, return "not bipartite". Repeat for all connected components. Time: \\(O(n + m)\\) since it is just a modified BFS.'
            },
            {
                question: 'A DAG has no cycles. Prove that DFS on a DAG produces no back edges.',
                hint: 'A back edge from \\(u\\) to ancestor \\(v\\) creates the cycle \\(v \\rightsquigarrow u \\to v\\).',
                solution: 'Suppose for contradiction that DFS produces a back edge \\((u, v)\\). Then \\(v\\) is an ancestor of \\(u\\) in the DFS tree, meaning there is a tree path \\(v \\rightsquigarrow u\\). Combined with edge \\((u, v)\\), this forms a cycle, contradicting the assumption that \\(G\\) is a DAG. Therefore, DFS on a DAG produces no back edges.'
            },
            {
                question: 'How many connected components does the graph with vertex set \\(\\{1,2,3,4,5,6\\}\\) and edges \\(\\{(1,2),(2,3),(4,5)\\}\\) have?',
                hint: 'Vertex 6 is isolated.',
                solution: 'Three components: \\(\\{1,2,3\\}\\), \\(\\{4,5\\}\\), and \\(\\{6\\}\\). Component count = 3.'
            },
            {
                question: 'Given BFS from source \\(s\\) on an unweighted graph, prove that the BFS tree gives shortest paths from \\(s\\) to every reachable vertex.',
                hint: 'Use the predecessor array \\(\\pi\\) and the distance array \\(d\\). The path via predecessors has length \\(d[v]\\), and no shorter path exists by the BFS correctness theorem.',
                solution: 'For any vertex \\(v\\), the path obtained by following predecessors \\(v, \\pi[v], \\pi[\\pi[v]], \\ldots, s\\) has exactly \\(d[v]\\) edges. By Theorem 12.1, \\(d[v] = \\delta(s, v)\\), the true shortest-path distance. The BFS tree edge from \\(\\pi[v]\\) to \\(v\\) satisfies \\(d[v] = d[\\pi[v]] + 1\\), so the tree path is optimal.'
            },
            {
                question: 'Design an algorithm to find the diameter (longest shortest path) of an unweighted undirected tree in \\(O(n)\\) time.',
                hint: 'Run BFS from any vertex to find the farthest vertex \\(u\\). Then run BFS from \\(u\\) to find the farthest vertex \\(v\\). The diameter is \\(d(u, v)\\).',
                solution: 'Step 1: Pick any vertex \\(s\\), run BFS to find the farthest vertex \\(u\\). Step 2: Run BFS from \\(u\\) to find the farthest vertex \\(v\\). The distance \\(d(u, v)\\) is the diameter. Proof: one endpoint of a longest path must be farthest from \\(s\\), and the other endpoint is farthest from the first. Both BFS calls take \\(O(n)\\) on a tree (since \\(m = n-1\\)).'
            },
            {
                question: 'What is the time complexity of BFS on a graph stored as an adjacency matrix? Why is it different from the adjacency list version?',
                hint: 'Finding all neighbors of \\(u\\) costs \\(O(n)\\) per vertex in a matrix.',
                solution: 'With an adjacency matrix, for each dequeued vertex we scan an entire row of length \\(n\\) to find neighbors, giving \\(O(n)\\) per vertex and \\(O(n^2)\\) total. With adjacency lists, we only scan the actual neighbors: \\(O(\\deg(u))\\) per vertex, summing to \\(O(n + m)\\). The matrix version is worse for sparse graphs but comparable for dense graphs.'
            }
        ]
    }
    ]
});
