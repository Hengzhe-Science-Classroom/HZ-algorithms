window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch14',
    number: 14,
    title: 'Shortest Paths',
    subtitle: 'Shortest Paths: Dijkstra, Bellman-Ford, Floyd-Warshall, and Johnson',
    sections: [

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 1: Relaxation Framework
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch14-sec01',
        title: '1. Relaxation Framework',
        content: `
<h2>The Relaxation Framework</h2>
<div class="env-block bridge"><div class="env-title">Chapter Overview</div><div class="env-body"><p>Graph traversal (Chapter 12) finds reachable vertices; topological sort (Chapter 13) orders them. Now we add edge weights and ask: what is the cheapest way to get from one vertex to another? The shortest path problem is one of the most fundamental and widely applied problems in all of computer science, powering GPS navigation, network routing, and countless optimization tasks. This chapter develops four classic algorithms, each suited to different graph structures.</p></div></div>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>All shortest path algorithms share a common operation: edge relaxation. If we discover a shorter path to a vertex through an edge, we update our estimate. This section formalizes the relaxation framework and proves its key properties, which underpin every algorithm in the chapter.</p></div></div>


<p>
All single-source shortest path algorithms share a common subroutine: <strong>edge relaxation</strong>.
Given an estimate \\(d[v]\\) of the shortest-path weight from source \\(s\\) to each vertex \\(v\\),
relaxation improves these estimates by exploiting individual edges.
</p>

<div class="env-block definition">
<div class="env-title">Definition 14.1 (Shortest-Path Weight)</div>
<div class="env-body">
<p>
For a weighted directed graph \\(G = (V, E, w)\\) with weight function \\(w: E \\to \\mathbb{R}\\),
the <strong>shortest-path weight</strong> from \\(u\\) to \\(v\\) is:
$$\\delta(u, v) = \\begin{cases} \\min\\{w(p) : p \\text{ is a path from } u \\text{ to } v\\} & \\text{if a path exists,} \\\\ \\infty & \\text{otherwise.} \\end{cases}$$
If there exists a <strong>negative-weight cycle</strong> reachable from \\(u\\), then \\(\\delta(u, v) = -\\infty\\)
for all \\(v\\) reachable from the cycle.
</p>
</div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm 14.1: RELAX(u, v, w)</div>
<div class="env-body">
<pre>
RELAX(u, v, w):
    if d[v] > d[u] + w(u, v):
        d[v] = d[u] + w(u, v)
        pi[v] = u
</pre>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 14.1 (Relaxation Properties)</div>
<div class="env-body">
<p>Let \\(d[v]\\) be initialized to \\(\\infty\\) for all \\(v \\ne s\\), with \\(d[s] = 0\\). After any sequence of relaxations:</p>
<ul>
<li><strong>Upper-bound property:</strong> \\(d[v] \\ge \\delta(s, v)\\) always holds.</li>
<li><strong>No-path property:</strong> If \\(\\delta(s, v) = \\infty\\), then \\(d[v] = \\infty\\) always.</li>
<li><strong>Convergence property:</strong> If \\(s \\rightsquigarrow u \\to v\\) is a shortest path and \\(d[u] = \\delta(s, u)\\) before relaxing \\((u, v)\\), then \\(d[v] = \\delta(s, v)\\) afterward.</li>
<li><strong>Path-relaxation property:</strong> If edges on a shortest path \\(s = v_0 \\to v_1 \\to \\cdots \\to v_k\\) are relaxed in order, then \\(d[v_k] = \\delta(s, v_k)\\).</li>
</ul>
</div>
</div>

<div class="env-block warning">
<div class="env-title">Warning: Negative Cycles</div>
<div class="env-body">
<p>
If a negative-weight cycle is reachable from \\(s\\), shortest paths are undefined for vertices
reachable from the cycle. Dijkstra's algorithm assumes non-negative weights; Bellman-Ford detects negative cycles.
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch14-viz-relax"></div>
`,
        visualizations: [
        {
            id: 'ch14-viz-relax',
            title: 'Edge Relaxation Demonstration',
            description: 'Watch how relaxation updates distance estimates along edges.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 400});

                const labels = ['S','A','B','C','D'];
                const n = labels.length;
                const positions = [[80,180],[220,80],[220,280],[400,180],[560,180]];
                const edges = [[0,1,4],[0,2,2],[1,3,3],[2,1,1],[2,3,5],[3,4,1]];
                const adjL = Array.from({length: n}, () => []);
                edges.forEach(([u,v,w]) => { adjL[u].push({v, w}); });

                let dist = [0, Infinity, Infinity, Infinity, Infinity];
                let parent = [-1, -1, -1, -1, -1];
                let relaxHistory = [];
                let step = 0;

                // Pre-compute a good relaxation order
                const relaxOrder = [
                    [0, 1, 4], [0, 2, 2], [2, 1, 1], [1, 3, 3], [2, 3, 5], [3, 4, 1]
                ];

                function reset() {
                    dist = [0, Infinity, Infinity, Infinity, Infinity];
                    parent = [-1, -1, -1, -1, -1];
                    relaxHistory = [];
                    step = 0;
                }

                function doRelax() {
                    if (step >= relaxOrder.length) return;
                    const [u, v, w] = relaxOrder[step];
                    const oldD = dist[v];
                    if (dist[v] > dist[u] + w) {
                        dist[v] = dist[u] + w;
                        parent[v] = u;
                        relaxHistory.push({u, v, w, old: oldD, newD: dist[v], improved: true});
                    } else {
                        relaxHistory.push({u, v, w, old: oldD, newD: dist[v], improved: false});
                    }
                    step++;
                }

                function draw() {
                    viz.clear();
                    viz.screenText('Edge Relaxation (step ' + step + '/' + relaxOrder.length + ')', 350, 20, viz.colors.white, 15, 'center');

                    // Draw edges
                    const r = 22;
                    edges.forEach(([u, v, w]) => {
                        const dx = positions[v][0] - positions[u][0];
                        const dy = positions[v][1] - positions[u][1];
                        const len = Math.sqrt(dx*dx + dy*dy);
                        const ux1 = dx/len, uy1 = dy/len;
                        let ec = viz.colors.axis + '55';
                        // Highlight current relaxation edge
                        if (step > 0) {
                            const last = relaxHistory[step - 1];
                            if (last && last.u === u && last.v === v) {
                                ec = last.improved ? viz.colors.green : viz.colors.red;
                            }
                        }
                        viz.drawEdge(
                            positions[u][0] + ux1*r, positions[u][1] + uy1*r,
                            positions[v][0] - ux1*r, positions[v][1] - uy1*r,
                            ec, true, w, 2
                        );
                    });

                    // Draw nodes
                    for (let i = 0; i < n; i++) {
                        let c = viz.colors.blue;
                        if (i === 0) c = viz.colors.green;
                        viz.drawNode(positions[i][0], positions[i][1], 22, labels[i], c);
                        const dStr = dist[i] === Infinity ? 'INF' : String(dist[i]);
                        viz.screenText('d=' + dStr, positions[i][0], positions[i][1] + 34, viz.colors.yellow, 11, 'center');
                    }

                    // Relaxation log
                    if (step > 0) {
                        const last = relaxHistory[step - 1];
                        const status = last.improved ? 'IMPROVED' : 'NO CHANGE';
                        const oldStr = last.old === Infinity ? 'INF' : String(last.old);
                        viz.screenText(
                            'Relax(' + labels[last.u] + ',' + labels[last.v] + '): d[' + labels[last.v] + ']=' + oldStr +
                            ' > d[' + labels[last.u] + ']+' + last.w + '=' + (dist[last.u] === Infinity ? 'INF' : (dist[last.u])) + '? ' + status,
                            350, 360, last.improved ? viz.colors.green : viz.colors.red, 12, 'center'
                        );
                    }
                }

                VizEngine.createButton(controls, 'Reset', function() { reset(); draw(); });
                VizEngine.createButton(controls, 'Relax Next', function() { doRelax(); draw(); });
                VizEngine.createButton(controls, 'Relax All', function() { while (step < relaxOrder.length) doRelax(); draw(); });

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Prove the upper-bound property: after any sequence of relaxations starting from \\(d[s]=0\\) and \\(d[v]=\\infty\\) for \\(v \\ne s\\), we always have \\(d[v] \\ge \\delta(s,v)\\).',
                hint: 'Use induction on the number of relaxation steps. Each relaxation sets \\(d[v] = d[u] + w(u,v)\\), and by induction \\(d[u] \\ge \\delta(s,u)\\).',
                solution: 'Base case: Initially \\(d[s] = 0 = \\delta(s,s)\\) and \\(d[v] = \\infty \\ge \\delta(s,v)\\) for all \\(v\\). Induction: Suppose \\(d[v] \\ge \\delta(s,v)\\) holds before a relaxation of edge \\((u,v)\\). If the relaxation updates \\(d[v]\\), the new value is \\(d[u] + w(u,v) \\ge \\delta(s,u) + w(u,v) \\ge \\delta(s,v)\\) (by induction hypothesis and the triangle inequality). If no update occurs, \\(d[v]\\) is unchanged and still \\(\\ge \\delta(s,v)\\).'
            },
            {
                question: 'Given a weighted graph where all edge weights are equal to 1, which shortest-path algorithm is most efficient?',
                hint: 'Unit weights mean the graph is effectively unweighted.',
                solution: 'BFS is most efficient: \\(O(n + m)\\) time with no overhead for priority queues or repeated relaxations. Dijkstra would work but uses \\(O((n+m)\\log n)\\). Since all weights are 1, BFS layers correspond exactly to shortest-path distances.'
            },
            {
                question: 'Can a shortest path in a graph with \\(n\\) vertices have more than \\(n - 1\\) edges? When?',
                hint: 'Consider simple paths vs. paths through negative cycles.',
                solution: 'In a graph without negative cycles, a shortest path is always simple and has at most \\(n - 1\\) edges. If negative cycles exist, shortest "paths" are undefined (can be made arbitrarily short by cycling). The convention is \\(\\delta(s,v) = -\\infty\\) for vertices reachable via a negative cycle from \\(s\\).'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 2: Dijkstra's Algorithm
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch14-sec02',
        title: '2. Dijkstra\'s Algorithm',
        content: `
<h2>Dijkstra's Algorithm</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Dijkstra's algorithm solves single-source shortest paths in graphs with non-negative edge weights. It greedily processes the closest unvisited vertex, using a priority queue (from Chapter 8). With a Fibonacci heap, it achieves \(O(V \log V + E)\) time.</p></div></div>


<p>
Dijkstra's algorithm (1959) solves the single-source shortest path problem for graphs with
<strong>non-negative edge weights</strong>. It greedily extracts the vertex with the minimum tentative
distance, permanently "settling" it.
</p>

<div class="env-block algorithm">
<div class="env-title">Algorithm 14.2: Dijkstra(G, s)</div>
<div class="env-body">
<pre>
DIJKSTRA(G, w, s):
    for each v in V:
        d[v] = INF; pi[v] = NIL
    d[s] = 0
    Q = min-priority-queue(V, key = d)
    S = {}  // settled vertices
    while Q is not empty:
        u = EXTRACT-MIN(Q)
        S = S + {u}
        for each v in Adj[u]:
            RELAX(u, v, w)  // may DECREASE-KEY(Q, v)
</pre>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 14.2 (Dijkstra Correctness)</div>
<div class="env-body">
<p>
If all edge weights are non-negative, then when vertex \\(u\\) is extracted from the priority queue,
\\(d[u] = \\delta(s, u)\\).
</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof Sketch</div>
<div class="env-body">
<p>
By contradiction. Suppose \\(u\\) is the first vertex extracted with \\(d[u] > \\delta(s, u)\\).
Consider the true shortest path \\(s \\rightsquigarrow u\\). Let \\(y\\) be the first vertex on this
path not in \\(S\\), and \\(x\\) its predecessor (in \\(S\\)). Then \\(d[y] = \\delta(s, y)\\) (by convergence,
since \\((x, y)\\) was relaxed when \\(x\\) was extracted). Since \\(u\\) was extracted before \\(y\\),
\\(d[u] \\le d[y] = \\delta(s, y) \\le \\delta(s, u)\\) (non-negative weights ensure the path doesn't
decrease after \\(y\\)). This contradicts \\(d[u] > \\delta(s, u)\\). \\(\\square\\)
</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Complexity</div>
<div class="env-body">
<p>
With a binary min-heap: \\(O((n + m) \\log n)\\).<br>
With a Fibonacci heap: \\(O(m + n \\log n)\\).<br>
With an array (no heap): \\(O(n^2)\\) — optimal for dense graphs.
</p>
</div>
</div>

<div class="env-block warning">
<div class="env-title">Warning</div>
<div class="env-body">
<p>
Dijkstra's algorithm <strong>fails</strong> with negative edge weights. A settled vertex's distance
might later be improved through a negative edge, violating the greedy invariant.
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch14-viz-dijkstra"></div>
`,
        visualizations: [
        {
            id: 'ch14-viz-dijkstra',
            title: 'Dijkstra Step-Through with Priority Queue',
            description: 'Watch Dijkstra extract min-distance vertices and relax edges, with the priority queue state shown.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 480});

                const labels = ['S','A','B','C','D','E'];
                const n = labels.length;
                const positions = [[80,180],[220,80],[220,280],[400,80],[400,280],[560,180]];
                const edges = [[0,1,10],[0,2,3],[1,3,2],[2,1,4],[2,3,8],[2,4,2],[3,5,7],[4,3,3],[4,5,5]];
                const adjL = Array.from({length: n}, () => []);
                edges.forEach(([u,v,w]) => { adjL[u].push({v, w}); });

                // Pre-compute Dijkstra steps
                let steps = [];
                function buildDijkstra() {
                    steps = [];
                    const dist = Array(n).fill(Infinity);
                    const parent = Array(n).fill(-1);
                    const settled = new Set();
                    dist[0] = 0;

                    // Priority queue as sorted array
                    const pq = Array.from({length: n}, (_, i) => i);
                    steps.push({
                        dist: [...dist], parent: [...parent], settled: new Set(settled),
                        pq: pq.filter(v => !settled.has(v)).sort((a, b) => dist[a] - dist[b]),
                        action: 'init', current: -1
                    });

                    for (let i = 0; i < n; i++) {
                        // Extract min
                        let u = -1, minD = Infinity;
                        for (let v = 0; v < n; v++) {
                            if (!settled.has(v) && dist[v] < minD) {
                                minD = dist[v];
                                u = v;
                            }
                        }
                        if (u === -1) break;
                        settled.add(u);
                        steps.push({
                            dist: [...dist], parent: [...parent], settled: new Set(settled),
                            pq: Array.from({length: n}, (_, i) => i).filter(v => !settled.has(v)).sort((a, b) => dist[a] - dist[b]),
                            action: 'extract', current: u
                        });

                        for (const {v, w} of adjL[u]) {
                            if (!settled.has(v) && dist[u] + w < dist[v]) {
                                dist[v] = dist[u] + w;
                                parent[v] = u;
                            }
                        }
                        steps.push({
                            dist: [...dist], parent: [...parent], settled: new Set(settled),
                            pq: Array.from({length: n}, (_, i) => i).filter(v => !settled.has(v)).sort((a, b) => dist[a] - dist[b]),
                            action: 'relax', current: u
                        });
                    }
                }
                buildDijkstra();

                let step = 0;

                function draw() {
                    viz.clear();
                    viz.screenText('Dijkstra\'s Algorithm (step ' + step + '/' + steps.length + ')', 350, 20, viz.colors.white, 15, 'center');

                    const curState = step < steps.length ? steps[step] : steps[steps.length - 1];

                    // Draw edges with weights
                    const r = 22;
                    edges.forEach(([u, v, w]) => {
                        const dx = positions[v][0] - positions[u][0];
                        const dy = positions[v][1] - positions[u][1];
                        const len = Math.sqrt(dx*dx + dy*dy);
                        const ux1 = dx/len, uy1 = dy/len;
                        let ec = viz.colors.axis + '44';
                        if (curState.parent[v] === u) ec = viz.colors.green;
                        viz.drawEdge(
                            positions[u][0] + ux1*r, positions[u][1] + uy1*r,
                            positions[v][0] - ux1*r, positions[v][1] - uy1*r,
                            ec, true, w, ec === viz.colors.green ? 2.5 : 1.5
                        );
                    });

                    // Draw nodes
                    for (let i = 0; i < n; i++) {
                        let c = viz.colors.axis + '44';
                        if (curState.settled.has(i)) c = viz.colors.blue;
                        if (curState.current === i) c = viz.colors.yellow;
                        if (i === 0) c = viz.colors.green;
                        viz.drawNode(positions[i][0], positions[i][1], 22, labels[i], c);
                        const dStr = curState.dist[i] === Infinity ? 'INF' : String(curState.dist[i]);
                        viz.screenText('d=' + dStr, positions[i][0], positions[i][1] + 34, viz.colors.yellow, 11, 'center');
                    }

                    // Priority Queue
                    viz.screenText('Priority Queue (min-heap):', 50, 380, viz.colors.teal, 12, 'left');
                    for (let i = 0; i < curState.pq.length; i++) {
                        const v = curState.pq[i];
                        const dStr = curState.dist[v] === Infinity ? 'INF' : String(curState.dist[v]);
                        viz.drawArrayCell(50 + i * 80, 398, 75, 26,
                            labels[v] + ':' + dStr,
                            i === 0 ? viz.colors.yellow + '33' : viz.colors.teal + '22', viz.colors.white);
                    }

                    // Settled set
                    const settledArr = Array.from(curState.settled).map(i => labels[i]);
                    viz.screenText('Settled: {' + settledArr.join(', ') + '}', 50, 445, viz.colors.blue, 12, 'left');

                    // Action
                    if (curState.action === 'extract') {
                        viz.screenText('Extract min: ' + labels[curState.current] + ' (d=' + curState.dist[curState.current] + ')',
                            500, 445, viz.colors.yellow, 12, 'left');
                    } else if (curState.action === 'relax') {
                        viz.screenText('Relaxed edges from ' + labels[curState.current],
                            500, 445, viz.colors.green, 12, 'left');
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
                question: 'Run Dijkstra\'s algorithm from vertex S on the graph with edges \\(\\{(S,A,7),(S,B,2),(A,C,1),(B,A,3),(B,C,8),(C,D,4)\\}\\). Give the final distances.',
                hint: 'Extract order: S(0), B(2), A(5), C(6), D(10).',
                solution: '\\(d[S]=0, d[B]=2, d[A]=5\\) (via \\(S \\to B \\to A\\)), \\(d[C]=6\\) (via \\(S \\to B \\to A \\to C\\)), \\(d[D]=10\\) (via \\(\\ldots \\to C \\to D\\)). The greedy extract-min order is \\(S, B, A, C, D\\).'
            },
            {
                question: 'Why does Dijkstra fail with negative edges? Give a concrete example.',
                hint: 'Consider three vertices S, A, B with edges S->A (1), S->B (5), B->A (-10).',
                solution: 'Graph: S->A (weight 1), S->B (weight 5), B->A (weight -10). Dijkstra settles A with d[A]=1 (via S->A). But the true shortest path is S->B->A with weight 5+(-10)=-5. After settling A, Dijkstra never updates d[A] again. The greedy invariant "once settled, always optimal" breaks because negative edges can create shorter paths through unsettled vertices.'
            },
            {
                question: 'Compare the time complexity of Dijkstra with different priority queue implementations for a graph with \\(n = 10^6\\) and \\(m = 5 \\times 10^6\\).',
                hint: 'Binary heap: \\(O((n+m)\\log n)\\). Fibonacci heap: \\(O(m + n \\log n)\\). Array: \\(O(n^2)\\).',
                solution: 'Binary heap: \\(O((n+m)\\log n) \\approx 6 \\times 10^6 \\times 20 \\approx 1.2 \\times 10^8\\). Fibonacci heap: \\(O(m + n \\log n) \\approx 5 \\times 10^6 + 10^6 \\times 20 \\approx 2.5 \\times 10^7\\). Array: \\(O(n^2) = 10^{12}\\), far too slow. For this sparse graph, Fibonacci heap is theoretically best, though in practice binary heap often wins due to lower constants.'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 3: Bellman-Ford Algorithm
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch14-sec03',
        title: '3. Bellman-Ford Algorithm',
        content: `
<h2>Bellman-Ford Algorithm</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>What if some edge weights are negative? Dijkstra's greedy strategy fails, but the Bellman-Ford algorithm handles negative weights by relaxing all edges \(V - 1\) times. It also detects negative-weight cycles, which make shortest paths undefined.</p></div></div>


<p>
The Bellman-Ford algorithm handles graphs with <strong>negative edge weights</strong> and can
<strong>detect negative-weight cycles</strong>. It performs \\(|V| - 1\\) rounds of relaxing <em>all</em> edges.
</p>

<div class="env-block algorithm">
<div class="env-title">Algorithm 14.3: Bellman-Ford(G, s)</div>
<div class="env-body">
<pre>
BELLMAN-FORD(G, w, s):
    for each v in V:
        d[v] = INF; pi[v] = NIL
    d[s] = 0
    for i = 1 to |V| - 1:
        for each edge (u, v) in E:
            RELAX(u, v, w)
    // Negative cycle detection
    for each edge (u, v) in E:
        if d[v] > d[u] + w(u, v):
            return "negative cycle"
    return d, pi
</pre>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 14.3 (Bellman-Ford Correctness)</div>
<div class="env-body">
<p>
If \\(G\\) contains no negative-weight cycle reachable from \\(s\\), then after \\(|V|-1\\) rounds,
\\(d[v] = \\delta(s, v)\\) for all \\(v\\). If a negative cycle is reachable, the algorithm detects it.
</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof</div>
<div class="env-body">
<p>
A shortest path has at most \\(n - 1\\) edges (since it is simple).
By the path-relaxation property, after round \\(i\\), the algorithm has correctly computed
shortest paths of at most \\(i\\) edges. After \\(n - 1\\) rounds, all shortest paths are correct.
For negative-cycle detection: if any edge can still be relaxed after \\(n - 1\\) rounds,
there exists a path with \\(n\\) edges that is shorter, which implies a negative cycle. \\(\\square\\)
</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Complexity</div>
<div class="env-body">
<p>Time: \\(O(nm)\\). Space: \\(O(n)\\).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch14-viz-bellman-ford"></div>

<div class="viz-placeholder" data-viz="ch14-viz-neg-cycle"></div>
`,
        visualizations: [
        {
            id: 'ch14-viz-bellman-ford',
            title: 'Bellman-Ford Relaxation Rounds',
            description: 'Watch n-1 rounds of edge relaxation converging to shortest-path distances.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 450});

                const labels = ['S','A','B','C','D'];
                const n = labels.length;
                const positions = [[80,200],[220,80],[380,80],[380,280],[560,180]];
                const edgeList = [[0,1,6],[0,2,7],[1,2,8],[1,3,5],[1,4,-4],[2,3,-3],[2,4,9],[3,1,-2],[4,2,7],[4,3,7]];

                // Build steps
                let rounds = [];
                function buildBF() {
                    rounds = [];
                    const dist = Array(n).fill(Infinity);
                    dist[0] = 0;
                    const parent = Array(n).fill(-1);
                    rounds.push({dist: [...dist], parent: [...parent], round: 0, relaxed: []});

                    for (let i = 1; i < n; i++) {
                        const relaxed = [];
                        for (const [u, v, w] of edgeList) {
                            if (dist[u] + w < dist[v]) {
                                dist[v] = dist[u] + w;
                                parent[v] = u;
                                relaxed.push([u, v]);
                            }
                        }
                        rounds.push({dist: [...dist], parent: [...parent], round: i, relaxed: relaxed});
                    }
                }
                buildBF();

                let round = 0;

                function draw() {
                    viz.clear();
                    const state = rounds[round];
                    viz.screenText('Bellman-Ford: Round ' + state.round + ' of ' + (n - 1), 350, 20, viz.colors.white, 15, 'center');

                    const relaxedSet = new Set(state.relaxed.map(([u,v]) => u + '-' + v));

                    // Draw edges
                    const r = 22;
                    edgeList.forEach(([u, v, w]) => {
                        const dx = positions[v][0] - positions[u][0];
                        const dy = positions[v][1] - positions[u][1];
                        const len = Math.sqrt(dx*dx + dy*dy);
                        const ux1 = dx/len, uy1 = dy/len;
                        let ec = viz.colors.axis + '44';
                        if (state.parent[v] === u) ec = viz.colors.green;
                        if (relaxedSet.has(u + '-' + v)) ec = viz.colors.yellow;
                        const wc = w < 0 ? viz.colors.red : viz.colors.yellow;
                        viz.drawEdge(
                            positions[u][0] + ux1*r, positions[u][1] + uy1*r,
                            positions[v][0] - ux1*r, positions[v][1] - uy1*r,
                            ec, true, null, 1.5
                        );
                        // Weight label
                        const mx = (positions[u][0] + positions[v][0]) / 2;
                        const my = (positions[u][1] + positions[v][1]) / 2;
                        const nx = -(positions[v][1] - positions[u][1]) / len;
                        const ny = (positions[v][0] - positions[u][0]) / len;
                        viz.screenText(String(w), mx + nx * 14, my + ny * 14, wc, 11, 'center');
                    });

                    // Draw nodes
                    for (let i = 0; i < n; i++) {
                        let c = i === 0 ? viz.colors.green : viz.colors.blue;
                        viz.drawNode(positions[i][0], positions[i][1], 22, labels[i], c);
                        const dStr = state.dist[i] === Infinity ? 'INF' : String(state.dist[i]);
                        viz.screenText('d=' + dStr, positions[i][0], positions[i][1] + 34, viz.colors.yellow, 11, 'center');
                    }

                    // Distance table
                    viz.screenText('Distances after round ' + state.round + ':', 50, 380, viz.colors.text, 12, 'left');
                    for (let i = 0; i < n; i++) {
                        const dStr = state.dist[i] === Infinity ? 'INF' : String(state.dist[i]);
                        viz.drawArrayCell(50 + i * 100, 398, 90, 26,
                            labels[i] + ': ' + dStr,
                            viz.colors.blue + '22', viz.colors.white);
                    }

                    if (state.relaxed.length > 0) {
                        viz.screenText('Edges relaxed this round: ' + state.relaxed.length,
                            450, 380, viz.colors.yellow, 11, 'left');
                    } else if (state.round > 0) {
                        viz.screenText('No edges relaxed (converged)', 450, 380, viz.colors.green, 11, 'left');
                    }
                }

                VizEngine.createButton(controls, 'Reset', function() { round = 0; draw(); });
                VizEngine.createButton(controls, 'Next Round', function() { if (round < rounds.length - 1) { round++; draw(); } });
                VizEngine.createButton(controls, 'All Rounds', function() { round = rounds.length - 1; draw(); });

                draw();
                return viz;
            }
        },
        {
            id: 'ch14-viz-neg-cycle',
            title: 'Negative Cycle Detection',
            description: 'See how Bellman-Ford detects a negative-weight cycle after n-1 rounds.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 380});

                const labels = ['S','A','B','C'];
                const n = labels.length;
                const positions = [[100,140],[280,60],[460,140],[280,260]];
                const edgeList = [[0,1,1],[1,2,3],[2,3,-6],[3,1,2]];

                // Run BF
                const dist = Array(n).fill(Infinity);
                dist[0] = 0;
                const parent = Array(n).fill(-1);
                const distHistory = [[...dist]];

                for (let i = 1; i < n; i++) {
                    for (const [u, v, w] of edgeList) {
                        if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
                            dist[v] = dist[u] + w;
                            parent[v] = u;
                        }
                    }
                    distHistory.push([...dist]);
                }

                // Check for negative cycle
                let negCycleEdge = null;
                for (const [u, v, w] of edgeList) {
                    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
                        negCycleEdge = [u, v];
                        break;
                    }
                }

                function draw() {
                    viz.clear();
                    viz.screenText('Negative Cycle Detection', 350, 20, viz.colors.white, 15, 'center');

                    // Draw edges
                    const r = 22;
                    edgeList.forEach(([u, v, w]) => {
                        const dx = positions[v][0] - positions[u][0];
                        const dy = positions[v][1] - positions[u][1];
                        const len = Math.sqrt(dx*dx + dy*dy);
                        const ux1 = dx/len, uy1 = dy/len;
                        // Highlight cycle edges
                        const cycleEdges = [[1,2],[2,3],[3,1]];
                        const isCycle = cycleEdges.some(([a,b]) => a === u && b === v);
                        const ec = isCycle ? viz.colors.red : viz.colors.axis;
                        viz.drawEdge(
                            positions[u][0] + ux1*r, positions[u][1] + uy1*r,
                            positions[v][0] - ux1*r, positions[v][1] - uy1*r,
                            ec, true, w, isCycle ? 3 : 1.5
                        );
                    });

                    // Draw nodes
                    for (let i = 0; i < n; i++) {
                        let c = i === 0 ? viz.colors.green : viz.colors.blue;
                        viz.drawNode(positions[i][0], positions[i][1], 22, labels[i], c);
                    }

                    // Show round-by-round distances
                    viz.screenText('Round-by-round distances:', 50, 310, viz.colors.text, 12, 'left');
                    for (let r = 0; r < distHistory.length; r++) {
                        viz.screenText('R' + r + ':', 50, 335 + r * 18, viz.colors.text, 11, 'left');
                        for (let i = 0; i < n; i++) {
                            const dStr = distHistory[r][i] === Infinity ? 'INF' : String(distHistory[r][i]);
                            viz.screenText(labels[i] + '=' + dStr, 100 + i * 80, 335 + r * 18, viz.colors.white, 11, 'left');
                        }
                    }

                    // Negative cycle message
                    viz.screenText('Negative cycle: A -> B -> C -> A, total weight = 3 + (-6) + 2 = -1', 350, 280, viz.colors.red, 13, 'center');
                    if (negCycleEdge) {
                        viz.screenText('After n-1 rounds, edge (' + labels[negCycleEdge[0]] + ',' + labels[negCycleEdge[1]] + ') can still be relaxed!',
                            350, 300, viz.colors.red, 11, 'center');
                    }
                }

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Run Bellman-Ford from S on the graph \\(\\{(S,A,5),(S,B,8),(A,B,-3),(B,C,2),(A,C,7)\\}\\). Give distances after each round.',
                hint: 'Round 1 relaxes S->A, S->B. Round 2 relaxes A->B, A->C, B->C.',
                solution: 'Round 0: d = [0, INF, INF, INF]. Round 1: relax S->A gives d[A]=5, S->B gives d[B]=8, A->B gives d[B]=min(8,2)=2, B->C gives d[C]=4, A->C gives d[C]=min(4,12)=4. Round 2: A->B gives d[B]=min(2,2)=2 (no change). Final: d[S]=0, d[A]=5, d[B]=2, d[C]=4.'
            },
            {
                question: 'Why does Bellman-Ford need exactly \\(n - 1\\) rounds? Could fewer suffice?',
                hint: 'A shortest simple path has at most \\(n - 1\\) edges. Round \\(i\\) handles paths with \\(i\\) edges.',
                solution: 'A shortest path in a graph without negative cycles is simple (no repeated vertices) and thus has at most \\(n - 1\\) edges. Round \\(i\\) correctly computes shortest paths using at most \\(i\\) edges (by the path-relaxation property). So \\(n - 1\\) rounds suffice to handle paths of all possible lengths. Fewer rounds might not suffice: consider a path graph \\(v_0 \\to v_1 \\to \\cdots \\to v_{n-1}\\) where round \\(i\\) first settles \\(v_i\\).'
            },
            {
                question: 'Can you optimize Bellman-Ford to terminate early if no relaxation occurs in a round?',
                hint: 'If no distance changes in round \\(i\\), no further changes will occur.',
                solution: 'Yes. If no edge is relaxed in a complete round, all distances have converged and we can terminate early. This optimization does not change the worst-case complexity (\\(O(nm)\\)) but significantly improves performance on many practical instances. The best case becomes \\(O(m)\\) (one round with no relaxations after initialization).'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 4: DAG Shortest Paths
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch14-sec04',
        title: '4. Shortest Paths in DAGs',
        content: `
<h2>Shortest Paths in DAGs</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>In DAGs, shortest paths can be computed in \(O(V + E)\) time by processing vertices in topological order (from Chapter 13). No priority queue is needed, making this the fastest single-source shortest path algorithm for acyclic graphs.</p></div></div>


<p>
For <strong>directed acyclic graphs</strong>, we can solve single-source shortest paths
(even with negative weights) in \\(O(n + m)\\) time by relaxing edges in
<strong>topological order</strong>.
</p>

<div class="env-block algorithm">
<div class="env-title">Algorithm 14.4: DAG-Shortest-Paths(G, s)</div>
<div class="env-body">
<pre>
DAG-SHORTEST-PATHS(G, w, s):
    topologically sort G
    for each v in V:
        d[v] = INF; pi[v] = NIL
    d[s] = 0
    for each u in topological order:
        for each v in Adj[u]:
            RELAX(u, v, w)
</pre>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 14.4</div>
<div class="env-body">
<p>
DAG-Shortest-Paths correctly computes \\(\\delta(s, v)\\) for all \\(v\\) in \\(O(n + m)\\) time.
It works with negative edge weights (no negative cycles exist in a DAG).
</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof</div>
<div class="env-body">
<p>
By the path-relaxation property. In topological order, if \\(s = v_0 \\to v_1 \\to \\cdots \\to v_k\\)
is a shortest path, then \\(v_0, v_1, \\ldots, v_k\\) appear in topological order (since all edges
go from earlier to later in topological order). The edges of this path are relaxed in order,
so \\(d[v_k] = \\delta(s, v_k)\\). \\(\\square\\)
</p>
</div>
</div>

<div class="env-block remark">
<div class="env-title">Application: PERT/CPM</div>
<div class="env-body">
<p>
The <strong>critical path method</strong> uses DAG shortest paths (with negated weights for longest path)
to find the <strong>critical path</strong> in a project schedule, i.e., the longest path determining
minimum project completion time.
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch14-viz-dag-sp"></div>
`,
        visualizations: [
        {
            id: 'ch14-viz-dag-sp',
            title: 'DAG Shortest Paths in Topological Order',
            description: 'Watch edges relax in topological order, solving shortest paths in one pass.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 420});

                const labels = ['S','A','B','C','D','E'];
                const n = labels.length;
                const positions = [[60,180],[180,80],[180,280],[340,180],[500,100],[500,260]];
                const edgeList = [[0,1,5],[0,2,3],[1,3,6],[1,4,2],[2,1,2],[2,3,7],[2,4,4],[3,4,-1],[3,5,1],[4,5,-2]];
                const adjL = Array.from({length: n}, () => []);
                edgeList.forEach(([u,v,w]) => { adjL[u].push({v, w}); });

                // Topological order (precomputed for this DAG)
                const topoOrder = [0, 2, 1, 3, 4, 5];

                let steps = [];
                function buildSteps() {
                    steps = [];
                    const dist = Array(n).fill(Infinity);
                    dist[0] = 0;
                    const parent = Array(n).fill(-1);
                    steps.push({dist: [...dist], parent: [...parent], current: -1, processed: new Set()});

                    for (const u of topoOrder) {
                        const processed = new Set(steps[steps.length - 1].processed);
                        processed.add(u);
                        for (const {v, w} of adjL[u]) {
                            if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
                                dist[v] = dist[u] + w;
                                parent[v] = u;
                            }
                        }
                        steps.push({dist: [...dist], parent: [...parent], current: u, processed});
                    }
                }
                buildSteps();

                let step = 0;

                function draw() {
                    viz.clear();
                    const state = steps[step];
                    viz.screenText('DAG Shortest Paths (step ' + step + '/' + (steps.length - 1) + ')', 350, 20, viz.colors.white, 15, 'center');

                    // Show topological order
                    viz.screenText('Topological order:', 50, 50, viz.colors.teal, 11, 'left');
                    for (let i = 0; i < topoOrder.length; i++) {
                        const c = state.processed.has(topoOrder[i]) ? viz.colors.green + '44' : viz.colors.bg;
                        viz.drawArrayCell(200 + i * 50, 38, 45, 24, labels[topoOrder[i]], c, viz.colors.white);
                    }

                    // Draw edges
                    const r = 22;
                    edgeList.forEach(([u, v, w]) => {
                        const dx = positions[v][0] - positions[u][0];
                        const dy = positions[v][1] - positions[u][1];
                        const len = Math.sqrt(dx*dx + dy*dy);
                        const ux1 = dx/len, uy1 = dy/len;
                        let ec = viz.colors.axis + '44';
                        if (state.parent[v] === u) ec = viz.colors.green;
                        viz.drawEdge(
                            positions[u][0] + ux1*r, positions[u][1] + uy1*r,
                            positions[v][0] - ux1*r, positions[v][1] - uy1*r,
                            ec, true, w, ec === viz.colors.green ? 2.5 : 1.5
                        );
                    });

                    // Draw nodes
                    for (let i = 0; i < n; i++) {
                        let c = viz.colors.axis + '44';
                        if (state.processed.has(i)) c = viz.colors.blue;
                        if (state.current === i) c = viz.colors.yellow;
                        if (i === 0) c = viz.colors.green;
                        viz.drawNode(positions[i][0], positions[i][1], 22, labels[i], c);
                        const dStr = state.dist[i] === Infinity ? 'INF' : String(state.dist[i]);
                        viz.screenText('d=' + dStr, positions[i][0], positions[i][1] + 34, viz.colors.yellow, 11, 'center');
                    }

                    // Current vertex
                    if (state.current >= 0) {
                        viz.screenText('Processing: ' + labels[state.current], 350, 390, viz.colors.yellow, 13, 'center');
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
                question: 'Explain how to find the longest path in a DAG using shortest-path techniques.',
                hint: 'Negate all edge weights and find the shortest path.',
                solution: 'Negate all edge weights: set \\(w\'(u,v) = -w(u,v)\\). Run DAG-Shortest-Paths with the negated weights. The resulting \\(-d[v]\\) gives the longest path distance from \\(s\\) to \\(v\\). This works because a shortest path under negated weights corresponds to a longest path under original weights. This is \\(O(n + m)\\).'
            },
            {
                question: 'Why can we not use Dijkstra on a DAG with negative weights?',
                hint: 'Dijkstra requires non-negative weights, regardless of graph structure.',
                solution: 'Dijkstra\'s greedy property (once settled, always optimal) relies on non-negative weights. Even in a DAG, a negative edge could create a shorter path through an unsettled vertex. While a DAG has no negative cycles (which is a separate issue), Dijkstra\'s correctness proof specifically requires \\(w(u,v) \\ge 0\\) for all edges. The DAG shortest-paths algorithm works correctly with negative weights because it processes vertices in topological order, not greedy min-distance order.'
            },
            {
                question: 'How would you count the number of shortest paths from \\(s\\) to each vertex in a DAG?',
                hint: 'Maintain a count array: when relaxing edge \\((u,v)\\), update the count based on whether \\(d[v]\\) improves or ties.',
                solution: 'Initialize \\(\\text{count}[s] = 1\\), \\(\\text{count}[v] = 0\\) for \\(v \\ne s\\). Process in topological order. When relaxing \\((u, v)\\): if \\(d[u] + w < d[v]\\), set \\(d[v] = d[u] + w\\) and \\(\\text{count}[v] = \\text{count}[u]\\). If \\(d[u] + w = d[v]\\), add \\(\\text{count}[v] += \\text{count}[u]\\). Time: \\(O(n + m)\\).'
            }
        ]
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 5: All-Pairs Shortest Paths
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'ch14-sec05',
        title: '5. All-Pairs Shortest Paths',
        content: `
<h2>All-Pairs Shortest Paths</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Sometimes we need shortest paths between all pairs of vertices. Floyd-Warshall solves this in \(O(V^3)\) using dynamic programming, while Johnson's algorithm combines Bellman-Ford and Dijkstra to handle sparse graphs more efficiently.</p></div></div>


<p>
The all-pairs shortest paths (APSP) problem asks for \\(\\delta(u, v)\\) for every pair \\((u, v)\\).
We present two classical algorithms: Floyd-Warshall and Johnson's.
</p>

<h3>5.1 Floyd-Warshall Algorithm</h3>

<div class="env-block algorithm">
<div class="env-title">Algorithm 14.5: Floyd-Warshall</div>
<div class="env-body">
<pre>
FLOYD-WARSHALL(W):
    // W = weight matrix, W[i][j] = w(i,j), INF if no edge
    D = copy of W
    D[i][i] = 0 for all i
    for k = 0 to n-1:       // intermediate vertices {0,...,k}
        for i = 0 to n-1:
            for j = 0 to n-1:
                D[i][j] = min(D[i][j], D[i][k] + D[k][j])
    return D
</pre>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 14.5 (Floyd-Warshall)</div>
<div class="env-body">
<p>
Floyd-Warshall computes all-pairs shortest paths in \\(O(n^3)\\) time and \\(O(n^2)\\) space.
It handles negative edges but not negative cycles (which can be detected if \\(D[i][i] < 0\\) for some \\(i\\)).
</p>
</div>
</div>

<div class="env-block intuition">
<div class="env-title">Dynamic Programming Interpretation</div>
<div class="env-body">
<p>
Let \\(d_{ij}^{(k)}\\) = shortest path from \\(i\\) to \\(j\\) using only vertices \\(\\{0, 1, \\ldots, k\\}\\) as intermediaries.
Recurrence: \\(d_{ij}^{(k)} = \\min(d_{ij}^{(k-1)}, d_{ik}^{(k-1)} + d_{kj}^{(k-1)})\\).
At each step \\(k\\), we decide whether to route through vertex \\(k\\).
</p>
</div>
</div>

<h3>5.2 Johnson's Algorithm</h3>

<div class="env-block algorithm">
<div class="env-title">Algorithm 14.6: Johnson's Algorithm</div>
<div class="env-body">
<pre>
JOHNSON(G, w):
    // Add new vertex q with 0-weight edges to all v
    G' = G + {q}; w(q, v) = 0 for all v
    // Bellman-Ford from q to get reweighting
    h = Bellman-Ford(G', q)
    if negative cycle: return error
    // Reweight: w'(u,v) = w(u,v) + h[u] - h[v] >= 0
    for each (u,v) in E:
        w'(u,v) = w(u,v) + h[u] - h[v]
    // Run Dijkstra from each vertex
    for each u in V:
        Dijkstra(G, w', u) -> d'[u][*]
        // Correct: delta(u,v) = d'[u][v] - h[u] + h[v]
        for each v:
            D[u][v] = d'[u][v] - h[u] + h[v]
    return D
</pre>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 14.6 (Johnson's)</div>
<div class="env-body">
<p>
Johnson's algorithm solves APSP in \\(O(nm + n^2 \\log n)\\) with a Fibonacci heap Dijkstra,
or \\(O(nm \\log n)\\) with a binary heap. It is faster than Floyd-Warshall on sparse graphs.
</p>
</div>
</div>

<div class="env-block remark">
<div class="env-title">Comparison</div>
<div class="env-body">
<p>
Floyd-Warshall: \\(O(n^3)\\), simple, best for dense graphs. <br>
Johnson's: \\(O(nm + n^2 \\log n)\\), better for sparse graphs (\\(m = O(n)\\) gives \\(O(n^2 \\log n)\\) vs. \\(O(n^3)\\)). <br>
\\(n\\) Dijkstra runs (no neg weights): \\(O(n(n + m) \\log n)\\), fails with negative edges.
</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch14-viz-floyd"></div>

<div class="viz-placeholder" data-viz="ch14-viz-johnson"></div>

<div class="env-block bridge"><div class="env-title">Looking Ahead</div><div class="env-body"><p>Shortest paths find the cheapest route; minimum spanning trees find the cheapest way to connect all vertices. Chapter 15 develops MST algorithms (Kruskal, Prim, Boruvka), which use the priority queues from Chapter 8 and the Union-Find from Chapter 11.</p></div></div>`,
        visualizations: [
        {
            id: 'ch14-viz-floyd',
            title: 'Floyd-Warshall Matrix Animation',
            description: 'Watch the distance matrix evolve as intermediate vertices are added.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 450});

                const labels = ['A','B','C','D'];
                const n = labels.length;
                const INF = 999;
                // Weight matrix
                const W = [
                    [0, 3, INF, 7],
                    [8, 0, 2, INF],
                    [5, INF, 0, 1],
                    [2, INF, INF, 0]
                ];

                // Build all stages
                const stages = [];
                const D = W.map(r => [...r]);
                stages.push({D: D.map(r => [...r]), k: -1});
                for (let k = 0; k < n; k++) {
                    for (let i = 0; i < n; i++) {
                        for (let j = 0; j < n; j++) {
                            if (D[i][k] + D[k][j] < D[i][j]) {
                                D[i][j] = D[i][k] + D[k][j];
                            }
                        }
                    }
                    stages.push({D: D.map(r => [...r]), k: k});
                }

                let stage = 0;

                function draw() {
                    viz.clear();
                    const state = stages[stage];
                    const kLabel = state.k === -1 ? 'Initial' : 'k = ' + labels[state.k] + ' (' + state.k + ')';
                    viz.screenText('Floyd-Warshall: ' + kLabel, 350, 20, viz.colors.white, 15, 'center');

                    // Draw matrix
                    const cellW = 65, cellH = 38;
                    const sx = 200, sy = 60;

                    // Headers
                    for (let j = 0; j < n; j++) {
                        viz.screenText(labels[j], sx + j * cellW + cellW/2, sy - 12, viz.colors.teal, 13, 'center');
                    }
                    for (let i = 0; i < n; i++) {
                        viz.screenText(labels[i], sx - 20, sy + i * cellH + cellH/2, viz.colors.teal, 13, 'center');
                    }

                    // Matrix cells
                    const prevD = stage > 0 ? stages[stage - 1].D : null;
                    for (let i = 0; i < n; i++) {
                        for (let j = 0; j < n; j++) {
                            const val = state.D[i][j];
                            const str = val >= INF ? 'INF' : String(val);
                            let bg = viz.colors.bg;
                            if (prevD && val !== prevD[i][j]) bg = viz.colors.green + '33';
                            if (state.k >= 0 && (i === state.k || j === state.k)) bg = viz.colors.blue + '22';
                            if (i === j) bg = viz.colors.axis + '22';
                            viz.drawArrayCell(sx + j * cellW, sy + i * cellH, cellW, cellH, str, bg, val >= INF ? viz.colors.text : viz.colors.white);
                        }
                    }

                    // Explanation
                    if (state.k >= 0) {
                        viz.screenText('Considering paths through vertex ' + labels[state.k],
                            350, sy + n * cellH + 30, viz.colors.yellow, 13, 'center');
                        viz.screenText('D[i][j] = min(D[i][j], D[i][' + labels[state.k] + '] + D[' + labels[state.k] + '][j])',
                            350, sy + n * cellH + 55, viz.colors.text, 12, 'center');
                    }

                    // Graph visualization
                    const gx = 80, gy = 310;
                    const gpos = [[gx, gy], [gx+120, gy-50], [gx+120, gy+50], [gx+240, gy]];
                    const graphEdges = [[0,1,3],[0,3,7],[1,2,2],[2,0,5],[2,3,1],[3,0,2]];
                    const r = 16;
                    graphEdges.forEach(([u,v,w]) => {
                        const dx = gpos[v][0] - gpos[u][0];
                        const dy = gpos[v][1] - gpos[u][1];
                        const len = Math.sqrt(dx*dx + dy*dy);
                        const ux1 = dx/len, uy1 = dy/len;
                        viz.drawEdge(gpos[u][0]+ux1*r, gpos[u][1]+uy1*r, gpos[v][0]-ux1*r, gpos[v][1]-uy1*r, viz.colors.axis, true, w, 1);
                    });
                    for (let i = 0; i < n; i++) {
                        let c = viz.colors.blue;
                        if (state.k === i) c = viz.colors.yellow;
                        viz.drawNode(gpos[i][0], gpos[i][1], 16, labels[i], c);
                    }
                }

                VizEngine.createButton(controls, 'Reset', function() { stage = 0; draw(); });
                VizEngine.createButton(controls, 'Next k', function() { if (stage < stages.length - 1) { stage++; draw(); } });
                VizEngine.createButton(controls, 'All', function() { stage = stages.length - 1; draw(); });

                draw();
                return viz;
            }
        },
        {
            id: 'ch14-viz-johnson',
            title: 'Johnson\'s Reweighting',
            description: 'See how Johnson\'s algorithm reweights edges to eliminate negative weights while preserving shortest paths.',
            setup: function(body, controls) {
                const viz = new VizEngine(body, {width: 700, height: 400});

                const labels = ['A','B','C','D'];
                const n = labels.length;
                const positions = [[100,120],[300,60],[300,220],[520,140]];
                const edges = [[0,1,1],[1,2,-3],[2,0,4],[2,3,2],[0,3,5]];

                // Bellman-Ford from a virtual source q with 0-weight edges to all vertices
                const h = Array(n).fill(0); // h[v] = shortest distance from q to v
                // Virtual source: dist from q = 0 to all vertices, then relax
                const dist = Array(n).fill(0); // all start at 0 (distance from q)
                for (let round = 0; round < n - 1; round++) {
                    for (const [u, v, w] of edges) {
                        if (dist[u] + w < dist[v]) {
                            dist[v] = dist[u] + w;
                        }
                    }
                }
                for (let i = 0; i < n; i++) h[i] = dist[i];

                // Reweight
                const newWeights = edges.map(([u, v, w]) => w + h[u] - h[v]);

                let showReweighted = false;

                function draw() {
                    viz.clear();
                    viz.screenText(showReweighted ? 'Reweighted Graph (all non-negative)' : 'Original Graph (has negative edges)',
                        350, 20, viz.colors.white, 15, 'center');

                    const r = 22;
                    edges.forEach(([u, v, w], idx) => {
                        const dx = positions[v][0] - positions[u][0];
                        const dy = positions[v][1] - positions[u][1];
                        const len = Math.sqrt(dx*dx + dy*dy);
                        const ux1 = dx/len, uy1 = dy/len;
                        const displayW = showReweighted ? newWeights[idx] : w;
                        const ec = displayW < 0 ? viz.colors.red : viz.colors.axis;
                        viz.drawEdge(
                            positions[u][0] + ux1*r, positions[u][1] + uy1*r,
                            positions[v][0] - ux1*r, positions[v][1] - uy1*r,
                            ec, true, displayW, 2
                        );
                    });

                    for (let i = 0; i < n; i++) {
                        viz.drawNode(positions[i][0], positions[i][1], 22, labels[i], viz.colors.blue);
                        viz.screenText('h=' + h[i], positions[i][0], positions[i][1] + 34, viz.colors.teal, 11, 'center');
                    }

                    // Explanation
                    viz.screenText('h values from Bellman-Ford:', 80, 310, viz.colors.teal, 12, 'left');
                    for (let i = 0; i < n; i++) {
                        viz.screenText('h[' + labels[i] + '] = ' + h[i], 80 + i * 120, 335, viz.colors.white, 12, 'left');
                    }
                    viz.screenText("w'(u,v) = w(u,v) + h[u] - h[v]", 350, 365, viz.colors.yellow, 12, 'center');
                    viz.screenText('Reweighted edges preserve shortest paths: delta\'(u,v) = delta(u,v) + h[u] - h[v]', 350, 385, viz.colors.text, 11, 'center');
                }

                VizEngine.createSelect(controls, 'Weights:', [
                    {value: 'original', label: 'Original'},
                    {value: 'reweighted', label: 'Reweighted'}
                ], function(v) { showReweighted = (v === 'reweighted'); draw(); });

                draw();
                return viz;
            }
        }
        ],
        exercises: [
            {
                question: 'Run Floyd-Warshall on the graph with weight matrix \\(W = \\begin{pmatrix} 0 & 5 & \\infty \\\\ \\infty & 0 & 2 \\\\ 3 & \\infty & 0 \\end{pmatrix}\\). Give the final distance matrix.',
                hint: 'After k=0: through A. After k=1: through A,B. After k=2: through A,B,C.',
                solution: 'k=0: D = [[0,5,INF],[INF,0,2],[3,8,0]] (path C->A->B). k=1: D = [[0,5,7],[INF,0,2],[3,8,0]] (path A->B->C). k=2: D = [[0,5,7],[5,0,2],[3,8,0]] (path B->C->A). Final: D[0][2]=7, D[1][0]=5, D[2][1]=8.'
            },
            {
                question: 'Prove that Johnson\'s reweighting preserves shortest paths. That is, if \\(p\\) is a shortest \\(s \\to t\\) path under \\(w\\), it is also shortest under \\(w\'(u,v) = w(u,v) + h(u) - h(v)\\).',
                hint: 'The reweighted path length telescopes: the \\(h\\) terms cancel except for endpoints.',
                solution: 'For any path \\(p = v_0 \\to v_1 \\to \\cdots \\to v_k\\), the reweighted length is: \\(w\'(p) = \\sum_{i=0}^{k-1} [w(v_i, v_{i+1}) + h(v_i) - h(v_{i+1})] = w(p) + h(v_0) - h(v_k)\\). The \\(h\\) terms telescope! Since \\(h(v_0) - h(v_k)\\) is the same for ALL paths from \\(v_0\\) to \\(v_k\\), the relative ordering of path weights is preserved. A shortest path under \\(w\\) remains shortest under \\(w\'\\), and \\(\\delta\'(s,t) = \\delta(s,t) + h(s) - h(t)\\).'
            },
            {
                question: 'When is Floyd-Warshall preferred over Johnson\'s algorithm?',
                hint: 'Compare \\(O(n^3)\\) with \\(O(nm + n^2 \\log n)\\) for different graph densities.',
                solution: 'Floyd-Warshall is preferred for dense graphs (\\(m = \\Theta(n^2)\\)) because: (1) Both are \\(O(n^3)\\) on dense graphs but Floyd-Warshall has smaller constants and simpler implementation. (2) Floyd-Warshall has excellent cache performance (sequential matrix access). (3) Johnson\'s requires building the transpose and running Bellman-Ford + n Dijkstras, with higher overhead. For sparse graphs (\\(m = O(n)\\)), Johnson\'s is \\(O(n^2 \\log n)\\), much better than Floyd-Warshall\'s \\(O(n^3)\\).'
            },
            {
                question: 'How can you detect negative-weight cycles using Floyd-Warshall?',
                hint: 'Check the diagonal of the distance matrix.',
                solution: 'After running Floyd-Warshall, check if \\(D[i][i] < 0\\) for any vertex \\(i\\). If so, there is a negative-weight cycle containing vertex \\(i\\). This is because \\(D[i][i]\\) represents the shortest "path" from \\(i\\) back to \\(i\\), which is 0 if no negative cycle exists (the empty path) and negative if a negative cycle through \\(i\\) exists.'
            },
            {
                question: 'Design an \\(O(n^3)\\) algorithm to find the transitive closure of a directed graph.',
                hint: 'Use Floyd-Warshall with Boolean values: replace min with OR, and + with AND.',
                solution: 'Initialize \\(T[i][j] = 1\\) if \\((i,j) \\in E\\) or \\(i = j\\), else \\(T[i][j] = 0\\). Run the Floyd-Warshall structure: for k, i, j: \\(T[i][j] = T[i][j] \\lor (T[i][k] \\land T[k][j])\\). After completion, \\(T[i][j] = 1\\) iff there is a path from \\(i\\) to \\(j\\). This is the Warshall algorithm, a special case of Floyd-Warshall for reachability.'
            }
        ]
    }
    ]
});
