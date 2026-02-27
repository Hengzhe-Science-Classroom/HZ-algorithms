window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch19',
    number: 19,
    title: '最大流与最小割',
    subtitle: 'Max-Flow & Min-Cut',
    sections: [

        /* ============================================================
           Section 1: Flow Networks
           ============================================================ */
        {
            id: 'ch19-sec01',
            title: 'Flow Networks',
            content: `
<h2>流网络 (Flow Networks)</h2>

<p>A <strong>flow network</strong> is a directed graph \\(G = (V, E)\\) equipped with a <strong>capacity function</strong> \\(c : E \\to \\mathbb{R}_{\\geq 0}\\), a distinguished <strong>source</strong> vertex \\(s\\), and a <strong>sink</strong> vertex \\(t\\).</p>

<div class="env-block definition">
<div class="env-title">Definition 19.1 (Flow)</div>
<div class="env-body">
<p>A <strong>flow</strong> in network \\(G = (V, E, c, s, t)\\) is a function \\(f : E \\to \\mathbb{R}_{\\geq 0}\\) satisfying:</p>
<ol>
  <li><strong>Capacity constraint:</strong> For every edge \\((u, v) \\in E\\),
  $$0 \\leq f(u, v) \\leq c(u, v).$$</li>
  <li><strong>Flow conservation:</strong> For every vertex \\(v \\in V \\setminus \\{s, t\\}\\),
  $$\\sum_{u:(u,v)\\in E} f(u,v) = \\sum_{w:(v,w)\\in E} f(v,w).$$</li>
</ol>
<p>The <strong>value</strong> of the flow is \\(|f| = \\sum_{v:(s,v)\\in E} f(s,v) - \\sum_{u:(u,s)\\in E} f(u,s)\\).</p>
</div>
</div>

<p>Intuitively, flow conservation says that every intermediate vertex passes on exactly as much flow as it receives. The source generates flow and the sink absorbs it.</p>

<div class="env-block example">
<div class="env-title">Example: A Simple Flow Network</div>
<div class="env-body">
<p>Consider a network with 4 vertices \\(\\{s, a, b, t\\}\\) and edges with capacities: \\(s \\to a\\) (10), \\(s \\to b\\) (5), \\(a \\to b\\) (4), \\(a \\to t\\) (8), \\(b \\to t\\) (10). A valid flow sends 8 units through \\(s \\to a \\to t\\) and 5 through \\(s \\to b \\to t\\), plus 2 through \\(s \\to a \\to b \\to t\\), giving \\(|f| = 15\\).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch19-viz-flow-network"></div>

<h3>Residual Graphs</h3>

<div class="env-block definition">
<div class="env-title">Definition 19.2 (Residual Graph)</div>
<div class="env-body">
<p>Given a flow \\(f\\), the <strong>residual graph</strong> \\(G_f = (V, E_f)\\) has edges:</p>
<ul>
  <li><strong>Forward edge</strong> \\((u, v)\\) with residual capacity \\(c_f(u, v) = c(u, v) - f(u, v)\\) when \\(f(u, v) < c(u, v)\\).</li>
  <li><strong>Backward edge</strong> \\((v, u)\\) with residual capacity \\(c_f(v, u) = f(u, v)\\) when \\(f(u, v) > 0\\).</li>
</ul>
</div>
</div>

<p>The residual graph captures the remaining room to push more flow forward, and the ability to "cancel" existing flow by pushing backward.</p>

<div class="viz-placeholder" data-viz="ch19-viz-residual"></div>

<div class="env-block definition">
<div class="env-title">Definition 19.3 (Augmenting Path)</div>
<div class="env-body">
<p>An <strong>augmenting path</strong> is a path from \\(s\\) to \\(t\\) in the residual graph \\(G_f\\). The <strong>bottleneck</strong> of the path is the minimum residual capacity along its edges.</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 19.1</div>
<div class="env-body">
<p>A flow \\(f\\) is a maximum flow if and only if there is no augmenting path from \\(s\\) to \\(t\\) in \\(G_f\\).</p>
</div>
</div>
`,
            visualizations: [
                {
                    id: 'ch19-viz-flow-network',
                    title: 'Interactive Flow Network',
                    description: 'Explore a flow network with capacity and flow labels on each directed edge.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var nodes = [
                            {id: 's', x: 80, y: 210, label: 's', color: viz.colors.green},
                            {id: 'a', x: 280, y: 100, label: 'a', color: viz.colors.blue},
                            {id: 'b', x: 280, y: 320, label: 'b', color: viz.colors.blue},
                            {id: 'c', x: 480, y: 100, label: 'c', color: viz.colors.blue},
                            {id: 'd', x: 480, y: 320, label: 'd', color: viz.colors.blue},
                            {id: 't', x: 620, y: 210, label: 't', color: viz.colors.red}
                        ];
                        var edges = [
                            {from: 's', to: 'a', cap: 10, flow: 0},
                            {from: 's', to: 'b', cap: 8,  flow: 0},
                            {from: 'a', to: 'c', cap: 7,  flow: 0},
                            {from: 'a', to: 'b', cap: 5,  flow: 0},
                            {from: 'b', to: 'd', cap: 10, flow: 0},
                            {from: 'c', to: 't', cap: 8,  flow: 0},
                            {from: 'c', to: 'd', cap: 3,  flow: 0},
                            {from: 'd', to: 't', cap: 12, flow: 0}
                        ];

                        function getNode(id) { return nodes.find(function(n) { return n.id === id; }); }

                        function draw() {
                            viz.clear();
                            viz.screenText('Flow Network: f/c on each edge', 350, 20, viz.colors.text, 13);
                            edges.forEach(function(e) {
                                var u = getNode(e.from), v = getNode(e.to);
                                var dx = v.x - u.x, dy = v.y - u.y;
                                var len = Math.sqrt(dx * dx + dy * dy);
                                var ux = dx / len, uy = dy / len;
                                var x1 = u.x + ux * 22, y1 = u.y + uy * 22;
                                var x2 = v.x - ux * 22, y2 = v.y - uy * 22;
                                var edgeColor = e.flow > 0 ? viz.colors.orange : viz.colors.axis;
                                var lw = e.flow > 0 ? 2.5 : 1.5;
                                viz.drawEdge(x1, y1, x2, y2, edgeColor, true, e.flow + '/' + e.cap, lw);
                            });
                            nodes.forEach(function(n) {
                                viz.drawNode(n.x, n.y, 20, n.label, n.color, viz.colors.white);
                            });
                            var totalFlow = 0;
                            edges.forEach(function(e) {
                                if (e.from === 's') totalFlow += e.flow;
                            });
                            viz.screenText('|f| = ' + totalFlow, 350, 405, viz.colors.yellow, 14);
                        }

                        function bfsAugment() {
                            var parent = {};
                            var parentEdge = {};
                            var visited = {};
                            var queue = ['s'];
                            visited['s'] = true;
                            while (queue.length > 0) {
                                var u = queue.shift();
                                if (u === 't') break;
                                edges.forEach(function(e, i) {
                                    if (e.from === u && !visited[e.to] && e.flow < e.cap) {
                                        visited[e.to] = true;
                                        parent[e.to] = u;
                                        parentEdge[e.to] = {idx: i, dir: 'fwd'};
                                        queue.push(e.to);
                                    }
                                    if (e.to === u && !visited[e.from] && e.flow > 0) {
                                        visited[e.from] = true;
                                        parent[e.from] = u;
                                        parentEdge[e.from] = {idx: i, dir: 'bwd'};
                                        queue.push(e.from);
                                    }
                                });
                            }
                            if (!visited['t']) return false;
                            var bottleneck = Infinity;
                            var v = 't';
                            while (v !== 's') {
                                var pe = parentEdge[v];
                                var e = edges[pe.idx];
                                if (pe.dir === 'fwd') bottleneck = Math.min(bottleneck, e.cap - e.flow);
                                else bottleneck = Math.min(bottleneck, e.flow);
                                v = parent[v];
                            }
                            v = 't';
                            while (v !== 's') {
                                var pe2 = parentEdge[v];
                                var e2 = edges[pe2.idx];
                                if (pe2.dir === 'fwd') e2.flow += bottleneck;
                                else e2.flow -= bottleneck;
                                v = parent[v];
                            }
                            return true;
                        }

                        VizEngine.createButton(controls, 'Augment (BFS)', function() {
                            var found = bfsAugment();
                            draw();
                            if (!found) {
                                viz.screenText('No augmenting path found -- max flow reached!', 350, 385, viz.colors.green, 12);
                            }
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            edges.forEach(function(e) { e.flow = 0; });
                            draw();
                        });

                        VizEngine.createButton(controls, 'Solve All', function() {
                            edges.forEach(function(e) { e.flow = 0; });
                            while (bfsAugment()) {}
                            draw();
                        });

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'ch19-viz-residual',
                    title: 'Residual Graph Viewer',
                    description: 'Toggle between the original network and its residual graph to see forward/backward edges.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var nodePos = [
                            {id: 's', x: 100, y: 200},
                            {id: 'a', x: 300, y: 100},
                            {id: 'b', x: 300, y: 300},
                            {id: 't', x: 500, y: 200}
                        ];
                        var edges = [
                            {from: 's', to: 'a', cap: 10, flow: 7},
                            {from: 's', to: 'b', cap: 5,  flow: 5},
                            {from: 'a', to: 'b', cap: 4,  flow: 2},
                            {from: 'a', to: 't', cap: 8,  flow: 5},
                            {from: 'b', to: 't', cap: 10, flow: 7}
                        ];
                        var showResidual = false;

                        function getNode(id) { return nodePos.find(function(n) { return n.id === id; }); }

                        function draw() {
                            viz.clear();
                            var title = showResidual ? 'Residual Graph G_f' : 'Original Flow Network';
                            viz.screenText(title, 350, 20, viz.colors.white, 14);

                            if (!showResidual) {
                                edges.forEach(function(e) {
                                    var u = getNode(e.from), v = getNode(e.to);
                                    var dx = v.x - u.x, dy = v.y - u.y;
                                    var len = Math.sqrt(dx * dx + dy * dy);
                                    var ux2 = dx / len, uy2 = dy / len;
                                    viz.drawEdge(u.x + ux2 * 22, u.y + uy2 * 22, v.x - ux2 * 22, v.y - uy2 * 22,
                                        e.flow > 0 ? viz.colors.orange : viz.colors.axis, true, e.flow + '/' + e.cap, e.flow > 0 ? 2.5 : 1.5);
                                });
                            } else {
                                edges.forEach(function(e) {
                                    var u = getNode(e.from), v = getNode(e.to);
                                    var dx = v.x - u.x, dy = v.y - u.y;
                                    var len = Math.sqrt(dx * dx + dy * dy);
                                    var ux2 = dx / len, uy2 = dy / len;
                                    var nx = -uy2 * 6, ny = ux2 * 6;
                                    if (e.cap - e.flow > 0) {
                                        viz.drawEdge(u.x + ux2 * 22 + nx, u.y + uy2 * 22 + ny,
                                            v.x - ux2 * 22 + nx, v.y - uy2 * 22 + ny,
                                            viz.colors.teal, true, (e.cap - e.flow).toString(), 2);
                                    }
                                    if (e.flow > 0) {
                                        viz.drawEdge(v.x - ux2 * 22 - nx, v.y - uy2 * 22 - ny,
                                            u.x + ux2 * 22 - nx, u.y + uy2 * 22 - ny,
                                            viz.colors.red, true, e.flow.toString(), 1.5);
                                    }
                                });
                            }

                            nodePos.forEach(function(n) {
                                var c = (n.id === 's') ? viz.colors.green : (n.id === 't') ? viz.colors.red : viz.colors.blue;
                                viz.drawNode(n.x, n.y, 20, n.id, c, viz.colors.white);
                            });

                            if (showResidual) {
                                viz.screenText('Teal = forward residual   Red = backward residual', 350, 380, viz.colors.text, 11);
                            }
                        }

                        VizEngine.createButton(controls, 'Toggle Residual', function() {
                            showResidual = !showResidual;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In a flow network, if vertex \\(v\\) (not \\(s\\) or \\(t\\)) has incoming flow of 7 and outgoing flow of 5, is this a valid flow?',
                    hint: 'Check flow conservation: incoming must equal outgoing for all intermediate vertices.',
                    solution: 'No. Flow conservation requires that incoming flow equals outgoing flow for every vertex except \\(s\\) and \\(t\\). Since \\(7 \\neq 5\\), this violates conservation.'
                },
                {
                    question: 'Given edge \\((u, v)\\) with capacity 10 and current flow 6, what edges appear in the residual graph and with what capacities?',
                    hint: 'Forward edge has remaining capacity; backward edge has flow that can be cancelled.',
                    solution: 'Forward edge \\((u, v)\\) with residual capacity \\(10 - 6 = 4\\), and backward edge \\((v, u)\\) with residual capacity \\(6\\).'
                },
                {
                    question: 'Prove that the value of any flow is at most the capacity of any cut. (Weak duality.)',
                    hint: 'Write the flow value as net flow across the cut, then apply the capacity constraint.',
                    solution: 'Let \\((S, T)\\) be any \\(s\\)-\\(t\\) cut. Then \\(|f| = \\sum_{u \\in S, v \\in T} f(u,v) - \\sum_{u \\in T, v \\in S} f(u,v) \\leq \\sum_{u \\in S, v \\in T} c(u,v) = c(S,T)\\), since \\(f(u,v) \\leq c(u,v)\\) and \\(f(u,v) \\geq 0\\).'
                }
            ]
        },

        /* ============================================================
           Section 2: Ford-Fulkerson Method
           ============================================================ */
        {
            id: 'ch19-sec02',
            title: 'Ford-Fulkerson Method',
            content: `
<h2>Ford-Fulkerson 方法</h2>

<p>The <strong>Ford-Fulkerson method</strong> is the foundational strategy for computing maximum flows: repeatedly find an augmenting path in the residual graph and push flow along it.</p>

<div class="env-block algorithm">
<div class="env-title">Algorithm 19.1: Ford-Fulkerson</div>
<div class="env-body">
<p><strong>Input:</strong> Flow network \\(G = (V, E, c, s, t)\\)</p>
<p><strong>Output:</strong> Maximum flow \\(f\\)</p>
<ol>
  <li>Initialize \\(f(e) = 0\\) for all \\(e \\in E\\).</li>
  <li><strong>While</strong> there exists an augmenting path \\(P\\) from \\(s\\) to \\(t\\) in \\(G_f\\):</li>
  <li>&emsp; Let \\(\\delta = \\min_{e \\in P} c_f(e)\\) (bottleneck).</li>
  <li>&emsp; <strong>For each</strong> edge \\(e = (u,v) \\in P\\):</li>
  <li>&emsp;&emsp; If \\(e\\) is a forward edge: \\(f(u,v) \\gets f(u,v) + \\delta\\).</li>
  <li>&emsp;&emsp; If \\(e\\) is a backward edge: \\(f(v,u) \\gets f(v,u) - \\delta\\).</li>
  <li><strong>Return</strong> \\(f\\).</li>
</ol>
</div>
</div>

<div class="env-block warning">
<div class="env-title">Warning: Termination</div>
<div class="env-body">
<p>With <strong>integer capacities</strong>, Ford-Fulkerson always terminates after at most \\(|f^*|\\) augmentations (each adds at least 1 unit). With irrational capacities, it may not terminate! The running time with integer capacities is \\(O(|E| \\cdot |f^*|)\\), which can be very slow.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch19-viz-ford-fulkerson"></div>

<h3>Choosing Augmenting Paths</h3>

<p>The choice of augmenting path dramatically affects performance:</p>

<table class="algo-table" style="width:100%; border-collapse:collapse; margin:12px 0;">
<tr style="border-bottom:1px solid #30363d;">
  <th style="text-align:left;padding:6px;">Strategy</th>
  <th style="text-align:left;padding:6px;">Path Selection</th>
  <th style="text-align:left;padding:6px;">Time Complexity</th>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
  <td style="padding:6px;">Arbitrary (DFS)</td>
  <td style="padding:6px;">Any path</td>
  <td style="padding:6px;">\\(O(|E| \\cdot |f^*|)\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
  <td style="padding:6px;">Shortest path (BFS)</td>
  <td style="padding:6px;">Fewest edges</td>
  <td style="padding:6px;">\\(O(V E^2)\\)</td>
</tr>
<tr>
  <td style="padding:6px;">Fattest path</td>
  <td style="padding:6px;">Max bottleneck</td>
  <td style="padding:6px;">\\(O(E^2 \\log V \\log C)\\)</td>
</tr>
</table>

<div class="env-block example">
<div class="env-title">Example: Bad DFS Choice</div>
<div class="env-body">
<p>Consider: \\(s \\to a\\) (1000), \\(s \\to b\\) (1000), \\(a \\to b\\) (1), \\(a \\to t\\) (1000), \\(b \\to t\\) (1000). If DFS alternates between \\(s \\to a \\to b \\to t\\) and \\(s \\to b \\to a \\to t\\), each augmentation pushes only 1 unit through the cross-edge, requiring 2000 iterations instead of 2.</p>
</div>
</div>
`,
            visualizations: [
                {
                    id: 'ch19-viz-ford-fulkerson',
                    title: 'Ford-Fulkerson Step-by-Step',
                    description: 'Watch Ford-Fulkerson find augmenting paths and push flow. Compare DFS vs BFS path selection.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450});
                        var nodeList = [
                            {id: 's', x: 70, y: 225, color: '#3fb950'},
                            {id: 'a', x: 230, y: 90},
                            {id: 'b', x: 230, y: 360},
                            {id: 'c', x: 420, y: 90},
                            {id: 'd', x: 420, y: 360},
                            {id: 't', x: 620, y: 225, color: '#f85149'}
                        ];
                        var edgeList = [
                            {from: 's', to: 'a', cap: 16, flow: 0},
                            {from: 's', to: 'b', cap: 13, flow: 0},
                            {from: 'a', to: 'c', cap: 12, flow: 0},
                            {from: 'a', to: 'b', cap: 4,  flow: 0},
                            {from: 'b', to: 'a', cap: 10, flow: 0},
                            {from: 'b', to: 'd', cap: 14, flow: 0},
                            {from: 'c', to: 'b', cap: 9,  flow: 0},
                            {from: 'c', to: 't', cap: 20, flow: 0},
                            {from: 'd', to: 'c', cap: 7,  flow: 0},
                            {from: 'd', to: 't', cap: 4,  flow: 0}
                        ];
                        var augCount = 0;
                        var pathEdges = [];

                        function getNode(id) { return nodeList.find(function(n) { return n.id === id; }); }

                        function draw() {
                            viz.clear();
                            viz.screenText('Ford-Fulkerson (CLRS Fig 26.6)', 350, 18, viz.colors.text, 13);
                            edgeList.forEach(function(e, i) {
                                var u = getNode(e.from), v = getNode(e.to);
                                var dx = v.x - u.x, dy = v.y - u.y;
                                var len = Math.sqrt(dx * dx + dy * dy);
                                var ux2 = dx / len, uy2 = dy / len;
                                var onPath = pathEdges.indexOf(i) >= 0;
                                var col = onPath ? viz.colors.yellow : (e.flow > 0 ? viz.colors.orange : viz.colors.axis);
                                var lw2 = onPath ? 3 : (e.flow > 0 ? 2 : 1.5);
                                viz.drawEdge(u.x + ux2 * 22, u.y + uy2 * 22, v.x - ux2 * 22, v.y - uy2 * 22, col, true, e.flow + '/' + e.cap, lw2);
                            });
                            nodeList.forEach(function(n) {
                                var c = n.color || viz.colors.blue;
                                viz.drawNode(n.x, n.y, 20, n.id, c, viz.colors.white);
                            });
                            var totalFlow = 0;
                            edgeList.forEach(function(e) { if (e.from === 's') totalFlow += e.flow; });
                            edgeList.forEach(function(e) { if (e.to === 's') totalFlow -= e.flow; });
                            viz.screenText('Augmentations: ' + augCount + '    |f| = ' + totalFlow, 350, 435, viz.colors.yellow, 13);
                        }

                        function bfsAugment() {
                            var parent = {};
                            var parentEdge = {};
                            var visited = {};
                            var queue = ['s'];
                            visited['s'] = true;
                            pathEdges = [];
                            while (queue.length > 0) {
                                var u = queue.shift();
                                if (u === 't') break;
                                for (var i = 0; i < edgeList.length; i++) {
                                    var e = edgeList[i];
                                    if (e.from === u && !visited[e.to] && e.flow < e.cap) {
                                        visited[e.to] = true;
                                        parent[e.to] = u;
                                        parentEdge[e.to] = {idx: i, dir: 'fwd'};
                                        queue.push(e.to);
                                    }
                                    if (e.to === u && !visited[e.from] && e.flow > 0) {
                                        visited[e.from] = true;
                                        parent[e.from] = u;
                                        parentEdge[e.from] = {idx: i, dir: 'bwd'};
                                        queue.push(e.from);
                                    }
                                }
                            }
                            if (!visited['t']) return false;
                            var bottleneck = Infinity;
                            var v = 't';
                            while (v !== 's') {
                                var pe = parentEdge[v];
                                var ed = edgeList[pe.idx];
                                pathEdges.push(pe.idx);
                                if (pe.dir === 'fwd') bottleneck = Math.min(bottleneck, ed.cap - ed.flow);
                                else bottleneck = Math.min(bottleneck, ed.flow);
                                v = parent[v];
                            }
                            v = 't';
                            while (v !== 's') {
                                var pe2 = parentEdge[v];
                                var ed2 = edgeList[pe2.idx];
                                if (pe2.dir === 'fwd') ed2.flow += bottleneck;
                                else ed2.flow -= bottleneck;
                                v = parent[v];
                            }
                            augCount++;
                            return true;
                        }

                        VizEngine.createButton(controls, 'Step (BFS Augment)', function() {
                            var ok = bfsAugment();
                            draw();
                            if (!ok) viz.screenText('Max flow reached!', 350, 415, viz.colors.green, 12);
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            edgeList.forEach(function(e) { e.flow = 0; });
                            augCount = 0;
                            pathEdges = [];
                            draw();
                        });

                        VizEngine.createButton(controls, 'Run to Completion', function() {
                            edgeList.forEach(function(e) { e.flow = 0; });
                            augCount = 0;
                            pathEdges = [];
                            while (bfsAugment()) {}
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In the Ford-Fulkerson method, why is it necessary to add backward edges to the residual graph?',
                    hint: 'Consider what happens when a greedy forward-only strategy makes a suboptimal choice.',
                    solution: 'Backward edges allow the algorithm to "undo" previously made flow decisions. Without them, the algorithm might get stuck at a suboptimal flow. For example, if flow was sent along a suboptimal path, backward edges let subsequent augmentations reroute that flow, ensuring the algorithm can reach the true maximum.'
                },
                {
                    question: 'Show that with integer capacities, Ford-Fulkerson terminates and the maximum flow is integer-valued.',
                    hint: 'Use induction on the number of augmentations. Each augmentation pushes an integer amount.',
                    solution: 'Initially all flows are 0 (integer). Each augmentation pushes bottleneck \\(\\delta\\), which is the minimum of integer residual capacities (since all capacities and current flows are integer), so \\(\\delta \\geq 1\\) is an integer. After augmenting, all flows remain integer. The total flow increases by at least 1 each step and is bounded by \\(|f^*| \\leq \\sum_v c(s,v)\\), so the algorithm terminates in at most \\(|f^*|\\) steps.'
                },
                {
                    question: 'Construct an example where DFS-based Ford-Fulkerson requires \\(2|f^*|\\) augmentations while BFS requires only 2.',
                    hint: 'Use a diamond graph with a tiny cross-edge.',
                    solution: 'Let \\(s \\to a\\) and \\(s \\to b\\) each have capacity \\(M\\), \\(a \\to b\\) has capacity 1, \\(a \\to t\\) and \\(b \\to t\\) each have capacity \\(M\\). BFS finds \\(s \\to a \\to t\\) (sending \\(M\\)) and \\(s \\to b \\to t\\) (sending \\(M\\)) in 2 steps. DFS might alternate \\(s \\to a \\to b \\to t\\) and \\(s \\to b \\to a \\to t\\), each sending 1 unit, for \\(2M\\) steps.'
                }
            ]
        },

        /* ============================================================
           Section 3: Edmonds-Karp Algorithm
           ============================================================ */
        {
            id: 'ch19-sec03',
            title: 'Edmonds-Karp Algorithm',
            content: `
<h2>Edmonds-Karp 算法</h2>

<p>The <strong>Edmonds-Karp algorithm</strong> is Ford-Fulkerson with BFS for finding augmenting paths. This simple choice yields a polynomial-time guarantee independent of the flow value.</p>

<div class="env-block algorithm">
<div class="env-title">Algorithm 19.2: Edmonds-Karp</div>
<div class="env-body">
<p><strong>Input:</strong> Flow network \\(G = (V, E, c, s, t)\\)</p>
<p><strong>Output:</strong> Maximum flow \\(f\\)</p>
<ol>
  <li>Initialize \\(f(e) = 0\\) for all \\(e\\).</li>
  <li><strong>While</strong> BFS finds a shortest augmenting path \\(P\\) in \\(G_f\\) from \\(s\\) to \\(t\\):</li>
  <li>&emsp; Augment \\(f\\) along \\(P\\).</li>
  <li><strong>Return</strong> \\(f\\).</li>
</ol>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 19.2 (Edmonds-Karp Complexity)</div>
<div class="env-body">
<p>The Edmonds-Karp algorithm makes at most \\(O(VE)\\) augmentations. Combined with \\(O(E)\\) per BFS, the total running time is \\(O(VE^2)\\).</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof Sketch</div>
<div class="env-body">
<p>Key insight: Let \\(d_f(v)\\) be the BFS distance from \\(s\\) to \\(v\\) in \\(G_f\\). One can show:</p>
<ol>
  <li>\\(d_f(v)\\) is <strong>monotonically non-decreasing</strong> across augmentations.</li>
  <li>Each edge can become a bottleneck (critical) at most \\(O(V)\\) times (because each time it becomes critical, \\(d_f\\) for one of its endpoints increases by at least 2).</li>
  <li>There are \\(O(E)\\) edges, each critical \\(O(V)\\) times, so \\(O(VE)\\) augmentations total.</li>
</ol>
</div>
</div>

<div class="viz-placeholder" data-viz="ch19-viz-edmonds-karp"></div>

<h3>Comparison with Ford-Fulkerson</h3>

<div class="viz-placeholder" data-viz="ch19-viz-ff-vs-ek"></div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body">
<p>For dense graphs, Dinic's algorithm improves to \\(O(V^2 E)\\), and for unit-capacity graphs to \\(O(E \\sqrt{V})\\). Push-relabel algorithms achieve \\(O(V^2 E)\\) or even \\(O(V^3)\\) with FIFO selection.</p>
</div>
</div>
`,
            visualizations: [
                {
                    id: 'ch19-viz-edmonds-karp',
                    title: 'Edmonds-Karp BFS Layers',
                    description: 'Visualize BFS layering in the residual graph and the shortest augmenting path chosen at each step.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var nodes = [
                            {id: 's', x: 60, y: 210},
                            {id: '1', x: 200, y: 80},
                            {id: '2', x: 200, y: 210},
                            {id: '3', x: 200, y: 340},
                            {id: '4', x: 400, y: 80},
                            {id: '5', x: 400, y: 210},
                            {id: '6', x: 400, y: 340},
                            {id: 't', x: 580, y: 210}
                        ];
                        var edgeData = [
                            {from: 's', to: '1', cap: 10, flow: 0},
                            {from: 's', to: '2', cap: 10, flow: 0},
                            {from: 's', to: '3', cap: 10, flow: 0},
                            {from: '1', to: '4', cap: 4,  flow: 0},
                            {from: '1', to: '5', cap: 8,  flow: 0},
                            {from: '2', to: '5', cap: 9,  flow: 0},
                            {from: '3', to: '5', cap: 6,  flow: 0},
                            {from: '3', to: '6', cap: 5,  flow: 0},
                            {from: '4', to: 't', cap: 10, flow: 0},
                            {from: '5', to: 't', cap: 15, flow: 0},
                            {from: '6', to: 't', cap: 10, flow: 0},
                            {from: '5', to: '4', cap: 5,  flow: 0},
                            {from: '5', to: '6', cap: 4,  flow: 0}
                        ];
                        var step = 0;
                        var currentPath = [];

                        function getN(id) { return nodes.find(function(n) { return n.id === id; }); }

                        function draw() {
                            viz.clear();
                            viz.screenText('Edmonds-Karp: BFS Shortest Augmenting Paths', 350, 18, viz.colors.text, 13);
                            edgeData.forEach(function(e, i) {
                                var u = getN(e.from), v = getN(e.to);
                                var dx = v.x - u.x, dy = v.y - u.y;
                                var len = Math.sqrt(dx * dx + dy * dy);
                                var ux2 = dx / len, uy2 = dy / len;
                                var onPath = currentPath.indexOf(i) >= 0;
                                var col = onPath ? viz.colors.yellow : (e.flow > 0 ? viz.colors.orange : viz.colors.axis);
                                viz.drawEdge(u.x + ux2 * 18, u.y + uy2 * 18, v.x - ux2 * 18, v.y - uy2 * 18, col, true, e.flow + '/' + e.cap, onPath ? 3 : 1.5);
                            });
                            nodes.forEach(function(n) {
                                var col = (n.id === 's') ? viz.colors.green : (n.id === 't') ? viz.colors.red : viz.colors.blue;
                                viz.drawNode(n.x, n.y, 16, n.id, col, viz.colors.white);
                            });
                            var tf = 0;
                            edgeData.forEach(function(e) { if (e.from === 's') tf += e.flow; });
                            viz.screenText('Step: ' + step + '    |f| = ' + tf, 350, 405, viz.colors.yellow, 13);
                        }

                        function bfsStep() {
                            var parent = {}, parentIdx = {}, visited = {}, queue = ['s'];
                            visited['s'] = true;
                            currentPath = [];
                            while (queue.length > 0) {
                                var u = queue.shift();
                                if (u === 't') break;
                                for (var i = 0; i < edgeData.length; i++) {
                                    var e = edgeData[i];
                                    if (e.from === u && !visited[e.to] && e.flow < e.cap) {
                                        visited[e.to] = true; parent[e.to] = u; parentIdx[e.to] = {i: i, d: 'f'}; queue.push(e.to);
                                    }
                                    if (e.to === u && !visited[e.from] && e.flow > 0) {
                                        visited[e.from] = true; parent[e.from] = u; parentIdx[e.from] = {i: i, d: 'b'}; queue.push(e.from);
                                    }
                                }
                            }
                            if (!visited['t']) return false;
                            var bn = Infinity, v = 't';
                            while (v !== 's') {
                                var pi = parentIdx[v]; currentPath.push(pi.i);
                                var ed = edgeData[pi.i];
                                bn = Math.min(bn, pi.d === 'f' ? ed.cap - ed.flow : ed.flow);
                                v = parent[v];
                            }
                            v = 't';
                            while (v !== 's') {
                                var pi2 = parentIdx[v];
                                if (pi2.d === 'f') edgeData[pi2.i].flow += bn;
                                else edgeData[pi2.i].flow -= bn;
                                v = parent[v];
                            }
                            step++;
                            return true;
                        }

                        VizEngine.createButton(controls, 'BFS Augment', function() {
                            var ok = bfsStep();
                            draw();
                            if (!ok) viz.screenText('Max flow reached!', 350, 385, viz.colors.green, 12);
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            edgeData.forEach(function(e) { e.flow = 0; }); step = 0; currentPath = []; draw();
                        });
                        VizEngine.createButton(controls, 'Solve', function() {
                            edgeData.forEach(function(e) { e.flow = 0; }); step = 0; currentPath = [];
                            while (bfsStep()) {} draw();
                        });
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'ch19-viz-ff-vs-ek',
                    title: 'Ford-Fulkerson vs Edmonds-Karp',
                    description: 'Compare the number of augmentations needed by DFS vs BFS path selection on a pathological example.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 380});
                        var M = 100;

                        function solve(useBfs) {
                            var ed = [
                                {from: 's', to: 'a', cap: M, flow: 0},
                                {from: 's', to: 'b', cap: M, flow: 0},
                                {from: 'a', to: 'b', cap: 1,  flow: 0},
                                {from: 'a', to: 't', cap: M, flow: 0},
                                {from: 'b', to: 't', cap: M, flow: 0}
                            ];
                            var count = 0;
                            while (true) {
                                var parent = {}, pEdge = {}, visited = {};
                                var frontier = ['s'];
                                visited['s'] = true;
                                if (useBfs) {
                                    while (frontier.length > 0) {
                                        var u = frontier.shift();
                                        if (u === 't') break;
                                        for (var i = 0; i < ed.length; i++) {
                                            if (ed[i].from === u && !visited[ed[i].to] && ed[i].flow < ed[i].cap) {
                                                visited[ed[i].to] = true; parent[ed[i].to] = u; pEdge[ed[i].to] = {i: i, d: 'f'}; frontier.push(ed[i].to);
                                            }
                                            if (ed[i].to === u && !visited[ed[i].from] && ed[i].flow > 0) {
                                                visited[ed[i].from] = true; parent[ed[i].from] = u; pEdge[ed[i].from] = {i: i, d: 'b'}; frontier.push(ed[i].from);
                                            }
                                        }
                                    }
                                } else {
                                    var stack = ['s'];
                                    while (stack.length > 0) {
                                        var u2 = stack.pop();
                                        if (u2 === 't') break;
                                        for (var j = 0; j < ed.length; j++) {
                                            if (ed[j].from === u2 && !visited[ed[j].to] && ed[j].flow < ed[j].cap) {
                                                visited[ed[j].to] = true; parent[ed[j].to] = u2; pEdge[ed[j].to] = {i: j, d: 'f'}; stack.push(ed[j].to);
                                            }
                                            if (ed[j].to === u2 && !visited[ed[j].from] && ed[j].flow > 0) {
                                                visited[ed[j].from] = true; parent[ed[j].from] = u2; pEdge[ed[j].from] = {i: j, d: 'b'}; stack.push(ed[j].from);
                                            }
                                        }
                                    }
                                }
                                if (!visited['t']) break;
                                var bn = Infinity, v = 't';
                                while (v !== 's') { var pe = pEdge[v]; var ee = ed[pe.i]; bn = Math.min(bn, pe.d === 'f' ? ee.cap - ee.flow : ee.flow); v = parent[v]; }
                                v = 't';
                                while (v !== 's') { var pe2 = pEdge[v]; if (pe2.d === 'f') ed[pe2.i].flow += bn; else ed[pe2.i].flow -= bn; v = parent[v]; }
                                count++;
                            }
                            var tf = 0;
                            ed.forEach(function(e) { if (e.from === 's') tf += e.flow; });
                            return {count: count, flow: tf};
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Pathological Example: s -> a -> b cross-edge cap = 1, others = ' + M, 350, 25, viz.colors.text, 12);

                            var npos = [{id:'s',x:100,y:190},{id:'a',x:300,y:100},{id:'b',x:300,y:280},{id:'t',x:500,y:190}];
                            var eList = [
                                {f:'s',t:'a',c:M},{f:'s',t:'b',c:M},{f:'a',t:'b',c:1},{f:'a',t:'t',c:M},{f:'b',t:'t',c:M}
                            ];
                            eList.forEach(function(e) {
                                var u = npos.find(function(n){return n.id===e.f;});
                                var v = npos.find(function(n){return n.id===e.t;});
                                var dx=v.x-u.x, dy=v.y-u.y, ln=Math.sqrt(dx*dx+dy*dy), ux3=dx/ln, uy3=dy/ln;
                                viz.drawEdge(u.x+ux3*22,u.y+uy3*22,v.x-ux3*22,v.y-uy3*22,viz.colors.axis,true,e.c.toString(),1.5);
                            });
                            npos.forEach(function(n) {
                                var c = n.id==='s'?viz.colors.green:n.id==='t'?viz.colors.red:viz.colors.blue;
                                viz.drawNode(n.x,n.y,20,n.id,c,viz.colors.white);
                            });

                            var dfsR = solve(false);
                            var bfsR = solve(true);

                            viz.screenText('DFS (Ford-Fulkerson): ' + dfsR.count + ' augmentations, |f| = ' + dfsR.flow, 350, 330, viz.colors.red, 13);
                            viz.screenText('BFS (Edmonds-Karp): ' + bfsR.count + ' augmentations, |f| = ' + bfsR.flow, 350, 355, viz.colors.green, 13);
                        }

                        VizEngine.createSlider(controls, 'M', 2, 500, M, 1, function(val) { M = Math.round(val); draw(); });
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that in Edmonds-Karp, the BFS distance \\(d_f(v)\\) from \\(s\\) to any vertex \\(v\\) is monotonically non-decreasing over augmentations.',
                    hint: 'Suppose for contradiction that after an augmentation, \\(d_{f\'}(v) < d_f(v)\\) for some \\(v\\). Consider the vertex closest to \\(s\\) in \\(G_{f\'}\\) where this happens.',
                    solution: 'Suppose \\(d_{f\'}(v) < d_f(v)\\) for some \\(v\\), and pick \\(v\\) minimizing \\(d_{f\'}(v)\\). Let \\(u\\) be the predecessor of \\(v\\) on a shortest \\(s\\)-\\(v\\) path in \\(G_{f\'}\\). Then \\(d_{f\'}(u) = d_{f\'}(v) - 1\\). By minimality, \\(d_{f\'}(u) \\geq d_f(u)\\). If \\((u,v) \\in G_f\\), then \\(d_f(v) \\leq d_f(u) + 1 \\leq d_{f\'}(u) + 1 = d_{f\'}(v)\\), contradiction. So \\((u,v) \\notin G_f\\) but \\((u,v) \\in G_{f\'}\\), meaning the augmenting path used edge \\((v,u)\\), so \\(d_f(u) = d_f(v) + 1\\), giving \\(d_{f\'}(v) > d_{f\'}(u) \\geq d_f(u) = d_f(v) + 1 > d_f(v)\\), contradiction.'
                },
                {
                    question: 'What is the maximum number of augmenting path iterations in Edmonds-Karp on a graph with \\(|V| = 8\\) and \\(|E| = 20\\)?',
                    hint: 'The bound is \\(O(VE)\\).',
                    solution: 'The bound is \\(O(VE) = O(8 \\times 20) = O(160)\\) augmentations in the worst case.'
                },
                {
                    question: 'Why does using BFS (shortest path) instead of DFS eliminate the exponential worst case of Ford-Fulkerson?',
                    hint: 'Think about how BFS prevents the algorithm from using long, inefficient augmenting paths.',
                    solution: 'BFS always finds a shortest augmenting path (fewest edges). This ensures that after each augmentation, at least one edge becomes critical (saturated), and each edge can become critical at most \\(O(V/2)\\) times because each time the BFS distance increases by at least 2. This gives \\(O(VE)\\) total augmentations regardless of capacity values, eliminating the dependency on \\(|f^*|\\) that causes the exponential worst case in DFS-based Ford-Fulkerson.'
                }
            ]
        },

        /* ============================================================
           Section 4: Max-Flow Min-Cut Theorem
           ============================================================ */
        {
            id: 'ch19-sec04',
            title: 'Max-Flow Min-Cut Theorem',
            content: `
<h2>最大流最小割定理</h2>

<p>The <strong>max-flow min-cut theorem</strong> is one of the most beautiful and important results in combinatorial optimization. It establishes a duality between the maximum flow and the minimum cut.</p>

<div class="env-block definition">
<div class="env-title">Definition 19.4 (s-t Cut)</div>
<div class="env-body">
<p>An \\(s\\)-\\(t\\) <strong>cut</strong> \\((S, T)\\) is a partition of \\(V\\) into \\(S\\) and \\(T = V \\setminus S\\) with \\(s \\in S\\) and \\(t \\in T\\). The <strong>capacity</strong> of the cut is:</p>
$$c(S, T) = \\sum_{u \\in S,\\, v \\in T,\\, (u,v) \\in E} c(u, v).$$
<p>Note: only edges from \\(S\\) to \\(T\\) count (not \\(T\\) to \\(S\\)).</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 19.3 (Max-Flow Min-Cut)</div>
<div class="env-body">
<p>The following three statements are equivalent:</p>
<ol>
  <li>\\(f\\) is a maximum flow in \\(G\\).</li>
  <li>The residual graph \\(G_f\\) contains no augmenting path from \\(s\\) to \\(t\\).</li>
  <li>\\(|f| = c(S, T)\\) for some \\(s\\)-\\(t\\) cut \\((S, T)\\).</li>
</ol>
<p>In particular, \\(\\max_f |f| = \\min_{(S,T)} c(S, T)\\).</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof</div>
<div class="env-body">
<p><strong>(1)\\(\\Rightarrow\\)(2):</strong> If there were an augmenting path, we could increase \\(|f|\\), contradicting maximality.</p>
<p><strong>(2)\\(\\Rightarrow\\)(3):</strong> Let \\(S = \\{v : v\\) is reachable from \\(s\\) in \\(G_f\\}\\) and \\(T = V \\setminus S\\). Since \\(t \\notin S\\), this is a valid cut. For any \\(u \\in S, v \\in T\\) with \\((u,v) \\in E\\), we must have \\(f(u,v) = c(u,v)\\) (otherwise \\(v\\) is reachable). For \\(v \\in T, u \\in S\\) with \\((v,u) \\in E\\), \\(f(v,u) = 0\\). Thus \\(|f| = c(S,T)\\).</p>
<p><strong>(3)\\(\\Rightarrow\\)(1):</strong> By weak duality, \\(|f| \\leq c(S, T)\\) for any cut. If equality holds, \\(f\\) must be maximum.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch19-viz-mincut"></div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body">
<p>Think of a flow network as a pipe system. The maximum amount of water from source to sink is limited by the <em>narrowest bottleneck</em> that separates source from sink. A min-cut is precisely this bottleneck. No matter how cleverly you route the water, you cannot exceed the capacity of the tightest barrier.</p>
</div>
</div>

<h3>Finding the Min-Cut</h3>

<p>After computing a maximum flow \\(f\\), construct the residual graph \\(G_f\\) and run BFS/DFS from \\(s\\). The set \\(S\\) of reachable vertices gives the min-cut \\((S, V \\setminus S)\\). The saturated edges crossing from \\(S\\) to \\(T\\) form the min-cut edges.</p>

<div class="viz-placeholder" data-viz="ch19-viz-cut-finder"></div>
`,
            visualizations: [
                {
                    id: 'ch19-viz-mincut',
                    title: 'Max-Flow = Min-Cut Visualization',
                    description: 'See the duality: compute max flow, then highlight the min-cut edges.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var nodes = [
                            {id: 's', x: 80, y: 210},
                            {id: 'a', x: 230, y: 90},
                            {id: 'b', x: 230, y: 330},
                            {id: 'c', x: 450, y: 90},
                            {id: 'd', x: 450, y: 330},
                            {id: 't', x: 600, y: 210}
                        ];
                        var edges = [
                            {from: 's', to: 'a', cap: 11, flow: 0},
                            {from: 's', to: 'b', cap: 12, flow: 0},
                            {from: 'a', to: 'c', cap: 12, flow: 0},
                            {from: 'b', to: 'a', cap: 1, flow: 0},
                            {from: 'b', to: 'd', cap: 11, flow: 0},
                            {from: 'c', to: 't', cap: 19, flow: 0},
                            {from: 'd', to: 'c', cap: 7, flow: 0},
                            {from: 'd', to: 't', cap: 4, flow: 0}
                        ];
                        var showCut = false;
                        var cutSet = {};

                        function getN(id) { return nodes.find(function(n) { return n.id === id; }); }

                        function computeMaxFlow() {
                            edges.forEach(function(e) { e.flow = 0; });
                            while (true) {
                                var parent = {}, pEdge = {}, visited = {}, queue = ['s'];
                                visited['s'] = true;
                                while (queue.length > 0) {
                                    var u = queue.shift();
                                    if (u === 't') break;
                                    for (var i = 0; i < edges.length; i++) {
                                        if (edges[i].from === u && !visited[edges[i].to] && edges[i].flow < edges[i].cap) {
                                            visited[edges[i].to] = true; parent[edges[i].to] = u; pEdge[edges[i].to] = {i: i, d: 'f'}; queue.push(edges[i].to);
                                        }
                                        if (edges[i].to === u && !visited[edges[i].from] && edges[i].flow > 0) {
                                            visited[edges[i].from] = true; parent[edges[i].from] = u; pEdge[edges[i].from] = {i: i, d: 'b'}; queue.push(edges[i].from);
                                        }
                                    }
                                }
                                if (!visited['t']) break;
                                var bn = Infinity, v = 't';
                                while (v !== 's') { var pe = pEdge[v]; var ed = edges[pe.i]; bn = Math.min(bn, pe.d === 'f' ? ed.cap - ed.flow : ed.flow); v = parent[v]; }
                                v = 't';
                                while (v !== 's') { var pe2 = pEdge[v]; if (pe2.d === 'f') edges[pe2.i].flow += bn; else edges[pe2.i].flow -= bn; v = parent[v]; }
                            }
                        }

                        function findMinCut() {
                            cutSet = {};
                            var visited = {}, queue = ['s'];
                            visited['s'] = true;
                            while (queue.length > 0) {
                                var u = queue.shift();
                                for (var i = 0; i < edges.length; i++) {
                                    if (edges[i].from === u && !visited[edges[i].to] && edges[i].flow < edges[i].cap) {
                                        visited[edges[i].to] = true; queue.push(edges[i].to);
                                    }
                                    if (edges[i].to === u && !visited[edges[i].from] && edges[i].flow > 0) {
                                        visited[edges[i].from] = true; queue.push(edges[i].from);
                                    }
                                }
                            }
                            nodes.forEach(function(n) {
                                cutSet[n.id] = visited[n.id] ? 'S' : 'T';
                            });
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Max-Flow Min-Cut Theorem', 350, 18, viz.colors.white, 14);

                            if (showCut) {
                                nodes.forEach(function(n) {
                                    var inS = cutSet[n.id] === 'S';
                                    var ctx = viz.ctx;
                                    ctx.fillStyle = inS ? 'rgba(63,185,80,0.1)' : 'rgba(248,81,73,0.1)';
                                    ctx.beginPath(); ctx.arc(n.x, n.y, 40, 0, Math.PI * 2); ctx.fill();
                                });
                            }

                            edges.forEach(function(e) {
                                var u = getN(e.from), v = getN(e.to);
                                var dx = v.x - u.x, dy = v.y - u.y;
                                var len = Math.sqrt(dx * dx + dy * dy);
                                var ux2 = dx / len, uy2 = dy / len;
                                var isCutEdge = showCut && cutSet[e.from] === 'S' && cutSet[e.to] === 'T';
                                var col = isCutEdge ? viz.colors.red : (e.flow > 0 ? viz.colors.orange : viz.colors.axis);
                                var lw = isCutEdge ? 3.5 : (e.flow > 0 ? 2 : 1.5);
                                viz.drawEdge(u.x + ux2 * 22, u.y + uy2 * 22, v.x - ux2 * 22, v.y - uy2 * 22, col, true, e.flow + '/' + e.cap, lw);
                            });

                            nodes.forEach(function(n) {
                                var c = (n.id === 's') ? viz.colors.green : (n.id === 't') ? viz.colors.red : viz.colors.blue;
                                if (showCut) {
                                    c = cutSet[n.id] === 'S' ? viz.colors.green : viz.colors.red;
                                }
                                viz.drawNode(n.x, n.y, 20, n.id, c, viz.colors.white);
                            });

                            var tf = 0;
                            edges.forEach(function(e) { if (e.from === 's') tf += e.flow; });
                            viz.screenText('|f| = ' + tf, 250, 400, viz.colors.yellow, 14);

                            if (showCut) {
                                var cutCap = 0;
                                edges.forEach(function(e) {
                                    if (cutSet[e.from] === 'S' && cutSet[e.to] === 'T') cutCap += e.cap;
                                });
                                viz.screenText('c(S,T) = ' + cutCap, 450, 400, viz.colors.red, 14);
                                viz.screenText('S = {' + nodes.filter(function(n){return cutSet[n.id]==='S';}).map(function(n){return n.id;}).join(',') + '}', 350, 380, viz.colors.text, 11);
                            }
                        }

                        computeMaxFlow();

                        VizEngine.createButton(controls, 'Show Min-Cut', function() {
                            findMinCut();
                            showCut = true;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Hide Cut', function() {
                            showCut = false;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Recompute', function() {
                            computeMaxFlow();
                            showCut = false;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'ch19-viz-cut-finder',
                    title: 'Min-Cut Edge Finder',
                    description: 'Click to mark vertices as S or T and see the cut capacity update in real time.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 380});
                        var nodes = [
                            {id: 's', x: 80, y: 190, side: 'S'},
                            {id: 'a', x: 220, y: 80, side: 'S'},
                            {id: 'b', x: 220, y: 300, side: 'S'},
                            {id: 'c', x: 400, y: 80, side: 'T'},
                            {id: 'd', x: 400, y: 300, side: 'T'},
                            {id: 't', x: 560, y: 190, side: 'T'}
                        ];
                        var edges = [
                            {from: 's', to: 'a', cap: 10},
                            {from: 's', to: 'b', cap: 8},
                            {from: 'a', to: 'c', cap: 7},
                            {from: 'a', to: 'b', cap: 5},
                            {from: 'b', to: 'd', cap: 10},
                            {from: 'c', to: 't', cap: 8},
                            {from: 'c', to: 'd', cap: 3},
                            {from: 'd', to: 't', cap: 12}
                        ];

                        function getN(id) { return nodes.find(function(n) { return n.id === id; }); }

                        function draw() {
                            viz.clear();
                            viz.screenText('Click nodes to toggle S/T membership', 350, 18, viz.colors.text, 12);
                            edges.forEach(function(e) {
                                var u = getN(e.from), v = getN(e.to);
                                var dx = v.x - u.x, dy = v.y - u.y;
                                var len = Math.sqrt(dx * dx + dy * dy), ux2 = dx/len, uy2 = dy/len;
                                var isCut = u.side === 'S' && v.side === 'T';
                                var col = isCut ? viz.colors.red : viz.colors.axis;
                                viz.drawEdge(u.x+ux2*22,u.y+uy2*22,v.x-ux2*22,v.y-uy2*22,col,true,e.cap.toString(),isCut?3:1.5);
                            });
                            nodes.forEach(function(n) {
                                var c = n.side === 'S' ? viz.colors.green : viz.colors.red;
                                viz.drawNode(n.x, n.y, 20, n.id + '(' + n.side + ')', c, viz.colors.white);
                            });
                            var cutCap = 0;
                            edges.forEach(function(e) {
                                if (getN(e.from).side === 'S' && getN(e.to).side === 'T') cutCap += e.cap;
                            });
                            viz.screenText('Cut capacity c(S,T) = ' + cutCap, 350, 360, viz.colors.yellow, 14);
                        }

                        viz.canvas.addEventListener('click', function(evt) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = evt.clientX - rect.left, my = evt.clientY - rect.top;
                            nodes.forEach(function(n) {
                                if (n.id === 's' || n.id === 't') return;
                                var dx2 = mx - n.x, dy2 = my - n.y;
                                if (dx2 * dx2 + dy2 * dy2 < 400) {
                                    n.side = n.side === 'S' ? 'T' : 'S';
                                    draw();
                                }
                            });
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In a flow network with max flow value 23, you find a cut with capacity 25. Can this cut be a min-cut?',
                    hint: 'What does the max-flow min-cut theorem say about the relationship between max flow and min cut?',
                    solution: 'No. By the max-flow min-cut theorem, the minimum cut capacity equals the maximum flow value (23). A cut with capacity 25 > 23 cannot be a minimum cut.'
                },
                {
                    question: 'Given a maximum flow, describe an algorithm to find the minimum cut and analyze its complexity.',
                    hint: 'Use the residual graph after computing max flow.',
                    solution: 'After computing max flow \\(f\\): (1) Build residual graph \\(G_f\\). (2) Run BFS/DFS from \\(s\\) in \\(G_f\\) to find all reachable vertices \\(S\\). (3) Set \\(T = V \\setminus S\\). The min-cut is \\((S, T)\\), and the cut edges are \\(\\{(u,v) : u \\in S, v \\in T, (u,v) \\in E\\}\\). Complexity: \\(O(V + E)\\) after the max flow is computed.'
                },
                {
                    question: 'Prove: If all capacities in a flow network are integers, then there exists a maximum flow that is integer-valued on every edge.',
                    hint: 'Use the integrality of Ford-Fulkerson augmentations.',
                    solution: 'Ford-Fulkerson with integer capacities starts with all-zero (integer) flow. Each augmenting path has integer bottleneck (min of integer residual capacities). Thus each augmentation preserves integrality of all flows. The algorithm terminates (since flow increases by at least 1 each step, bounded by total source capacity), producing an integer maximum flow.'
                }
            ]
        },

        /* ============================================================
           Section 5: Bipartite Matching & Applications
           ============================================================ */
        {
            id: 'ch19-sec05',
            title: 'Bipartite Matching & Applications',
            content: `
<h2>二部匹配与应用</h2>

<p>One of the most powerful applications of max-flow is solving <strong>bipartite matching</strong> problems by reduction to network flow.</p>

<div class="env-block definition">
<div class="env-title">Definition 19.5 (Bipartite Matching)</div>
<div class="env-body">
<p>Given a bipartite graph \\(G = (L \\cup R, E)\\), a <strong>matching</strong> \\(M \\subseteq E\\) is a set of edges with no shared endpoints. A <strong>maximum matching</strong> is a matching of maximum cardinality.</p>
</div>
</div>

<h3>Reduction to Max-Flow</h3>

<div class="env-block algorithm">
<div class="env-title">Algorithm 19.3: Bipartite Matching via Max-Flow</div>
<div class="env-body">
<ol>
  <li>Create a source \\(s\\) and sink \\(t\\).</li>
  <li>Add edge \\((s, u)\\) with capacity 1 for each \\(u \\in L\\).</li>
  <li>Add edge \\((v, t)\\) with capacity 1 for each \\(v \\in R\\).</li>
  <li>For each \\((u, v) \\in E\\), add edge \\((u, v)\\) with capacity 1.</li>
  <li>Compute max-flow. Matched edges are those with \\(f(u, v) = 1\\).</li>
</ol>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 19.4 (Correctness)</div>
<div class="env-body">
<p>The maximum flow in the constructed network equals the maximum matching in \\(G\\). By integrality, the max-flow is integer-valued, so each edge carries flow 0 or 1, corresponding to a valid matching.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch19-viz-bipartite"></div>

<h3>Konig's Theorem</h3>

<div class="env-block theorem">
<div class="env-title">Theorem 19.5 (Konig, 1931)</div>
<div class="env-body">
<p>In a bipartite graph, the size of a <strong>maximum matching</strong> equals the size of a <strong>minimum vertex cover</strong>.</p>
</div>
</div>

<p>This is a direct consequence of the max-flow min-cut theorem applied to the bipartite matching network. The min-cut translates to a minimum vertex cover.</p>

<h3>Hall's Marriage Theorem</h3>

<div class="env-block theorem">
<div class="env-title">Theorem 19.6 (Hall, 1935)</div>
<div class="env-body">
<p>A bipartite graph \\(G = (L \\cup R, E)\\) has a <strong>perfect matching</strong> (matching all of \\(L\\)) if and only if for every subset \\(S \\subseteq L\\):</p>
$$|N(S)| \\geq |S|,$$
<p>where \\(N(S)\\) is the set of neighbors of \\(S\\) in \\(R\\).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch19-viz-hall"></div>

<h3>Other Applications of Max-Flow</h3>
<ul>
  <li><strong>Edge-disjoint paths:</strong> Maximum number of edge-disjoint \\(s\\)-\\(t\\) paths = max flow with unit capacities (Menger's theorem).</li>
  <li><strong>Project selection:</strong> Choose projects to maximize profit subject to dependency constraints (via min-cut).</li>
  <li><strong>Image segmentation:</strong> Partition pixels into foreground/background by min-cut on a pixel-adjacency graph.</li>
  <li><strong>Baseball elimination:</strong> Determine if a team can still win the league.</li>
</ul>
`,
            visualizations: [
                {
                    id: 'ch19-viz-bipartite',
                    title: 'Bipartite Matching via Max-Flow',
                    description: 'Watch the reduction from bipartite matching to max-flow and see matched edges highlighted.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450});
                        var left = ['L1', 'L2', 'L3', 'L4'];
                        var right = ['R1', 'R2', 'R3', 'R4'];
                        var bEdges = [
                            {l: 0, r: 0}, {l: 0, r: 1},
                            {l: 1, r: 1}, {l: 1, r: 2},
                            {l: 2, r: 0}, {l: 2, r: 3},
                            {l: 3, r: 2}, {l: 3, r: 3}
                        ];
                        var matched = [];

                        function lx() { return 200; }
                        function rx() { return 500; }
                        function ly(i) { return 80 + i * 90; }
                        function ry(i) { return 80 + i * 90; }

                        function draw() {
                            viz.clear();
                            viz.screenText('Bipartite Matching via Max-Flow', 350, 18, viz.colors.white, 14);

                            viz.drawNode(60, 230, 18, 's', viz.colors.green, viz.colors.white);
                            viz.drawNode(640, 230, 18, 't', viz.colors.red, viz.colors.white);

                            left.forEach(function(l, i) {
                                viz.drawEdge(78, 230, lx() - 18, ly(i), viz.colors.axis, true, '1', 1);
                            });
                            right.forEach(function(r, i) {
                                viz.drawEdge(rx() + 18, ry(i), 622, 230, viz.colors.axis, true, '1', 1);
                            });

                            bEdges.forEach(function(be) {
                                var isMatched = matched.some(function(m) { return m.l === be.l && m.r === be.r; });
                                var col = isMatched ? viz.colors.yellow : viz.colors.axis;
                                var lw = isMatched ? 3 : 1;
                                viz.drawEdge(lx() + 18, ly(be.l), rx() - 18, ry(be.r), col, true, isMatched ? '1' : '', lw);
                            });

                            left.forEach(function(l, i) {
                                viz.drawNode(lx(), ly(i), 16, l, viz.colors.teal, viz.colors.white);
                            });
                            right.forEach(function(r, i) {
                                viz.drawNode(rx(), ry(i), 16, r, viz.colors.purple, viz.colors.white);
                            });

                            viz.screenText('Matching size: ' + matched.length, 350, 430, viz.colors.yellow, 14);
                        }

                        function computeMatching() {
                            var cap = {};
                            var allNodes = ['s'].concat(left).concat(right).concat(['t']);
                            allNodes.forEach(function(u) {
                                cap[u] = {};
                                allNodes.forEach(function(v) { cap[u][v] = 0; });
                            });
                            left.forEach(function(l) { cap['s'][l] = 1; });
                            right.forEach(function(r) { cap[r]['t'] = 1; });
                            bEdges.forEach(function(be) { cap[left[be.l]][right[be.r]] = 1; });

                            var flow = {};
                            allNodes.forEach(function(u) { flow[u] = {}; allNodes.forEach(function(v) { flow[u][v] = 0; }); });

                            while (true) {
                                var parent = {}, visited = {}, queue = ['s'];
                                visited['s'] = true;
                                while (queue.length > 0) {
                                    var u = queue.shift();
                                    if (u === 't') break;
                                    allNodes.forEach(function(v) {
                                        if (!visited[v] && cap[u][v] - flow[u][v] > 0) {
                                            visited[v] = true; parent[v] = u; queue.push(v);
                                        }
                                        if (!visited[v] && flow[v][u] > 0) {
                                            visited[v] = true; parent[v] = u; queue.push(v);
                                        }
                                    });
                                }
                                if (!visited['t']) break;
                                var v2 = 't';
                                while (v2 !== 's') {
                                    var p = parent[v2];
                                    if (cap[p][v2] - flow[p][v2] > 0) flow[p][v2]++;
                                    else flow[v2][p]--;
                                    v2 = p;
                                }
                            }

                            matched = [];
                            bEdges.forEach(function(be) {
                                if (flow[left[be.l]][right[be.r]] === 1) {
                                    matched.push(be);
                                }
                            });
                        }

                        VizEngine.createButton(controls, 'Find Max Matching', function() {
                            computeMatching();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            matched = [];
                            draw();
                        });

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'ch19-viz-hall',
                    title: 'Hall\'s Marriage Theorem',
                    description: 'Explore Hall\'s condition: select a subset S of left vertices and check if |N(S)| >= |S|.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var left = ['A', 'B', 'C', 'D'];
                        var right = ['1', '2', '3', '4'];
                        var adj = [
                            [0, 1], [0, 2],
                            [1, 0], [1, 1],
                            [2, 2], [2, 3],
                            [3, 3]
                        ];
                        var selected = [false, false, false, false];

                        function draw() {
                            viz.clear();
                            viz.screenText('Hall\'s Condition: |N(S)| >= |S| for all S', 350, 20, viz.colors.white, 13);
                            var selIndices = [];
                            selected.forEach(function(s, i) { if (s) selIndices.push(i); });
                            var neighbors = {};
                            adj.forEach(function(e) {
                                if (selected[e[0]]) neighbors[e[1]] = true;
                            });
                            var nCount = Object.keys(neighbors).length;
                            var sCount = selIndices.length;

                            adj.forEach(function(e) {
                                var isActive = selected[e[0]];
                                viz.drawEdge(220, 80 + e[0] * 80, 480, 80 + e[1] * 80, isActive ? viz.colors.yellow : viz.colors.axis, false, '', isActive ? 2 : 1);
                            });

                            left.forEach(function(l, i) {
                                var c = selected[i] ? viz.colors.yellow : viz.colors.teal;
                                viz.drawNode(200, 80 + i * 80, 18, l, c, viz.colors.white);
                            });
                            right.forEach(function(r, i) {
                                var c = neighbors[i] ? viz.colors.orange : viz.colors.purple;
                                viz.drawNode(500, 80 + i * 80, 18, r, c, viz.colors.white);
                            });

                            if (sCount > 0) {
                                var hallOk = nCount >= sCount;
                                viz.screenText('|S| = ' + sCount + ',  |N(S)| = ' + nCount, 350, 370, hallOk ? viz.colors.green : viz.colors.red, 14);
                                viz.screenText(hallOk ? 'Hall\'s condition SATISFIED' : 'Hall\'s condition VIOLATED', 350, 390, hallOk ? viz.colors.green : viz.colors.red, 13);
                            } else {
                                viz.screenText('Click left nodes to select subset S', 350, 380, viz.colors.text, 12);
                            }
                        }

                        viz.canvas.addEventListener('click', function(evt) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = evt.clientX - rect.left, my = evt.clientY - rect.top;
                            left.forEach(function(l, i) {
                                var dx = mx - 200, dy = my - (80 + i * 80);
                                if (dx * dx + dy * dy < 400) {
                                    selected[i] = !selected[i];
                                    draw();
                                }
                            });
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A company has 5 jobs and 5 workers. Worker \\(i\\) is qualified for a subset of jobs. Model this as a bipartite matching problem and explain how to determine if all jobs can be filled.',
                    hint: 'Create a bipartite graph with workers on one side and jobs on the other.',
                    solution: 'Create bipartite graph \\(G = (W \\cup J, E)\\) where \\(W\\) = workers, \\(J\\) = jobs, and \\((w_i, j_k) \\in E\\) iff worker \\(i\\) is qualified for job \\(k\\). Add source \\(s\\) connected to all workers (cap 1) and sink \\(t\\) connected from all jobs (cap 1). Compute max-flow. All jobs can be filled iff max-flow = 5 (perfect matching). By Hall\'s theorem, this holds iff every subset of \\(k\\) jobs has at least \\(k\\) qualified workers.'
                },
                {
                    question: 'Prove that Konig\'s theorem (max matching = min vertex cover in bipartite graphs) follows from the max-flow min-cut theorem.',
                    hint: 'Translate the min-cut in the flow network to a vertex cover.',
                    solution: 'Consider the flow network for bipartite matching. A min-cut \\((S, T)\\) partitions vertices. Let \\(L_T = L \\cap T\\) (left vertices in \\(T\\)) and \\(R_S = R \\cap S\\) (right vertices in \\(S\\)). The cut capacity is \\(|L_T| + |R_S|\\) (edges \\(s \\to L_T\\) and \\(R_S \\to t\\), each capacity 1). The set \\(L_T \\cup R_S\\) forms a vertex cover: every edge \\((u,v)\\) has either \\(u \\in L_T\\) or \\(v \\in R_S\\) (otherwise the \\(u \\to v\\) edge of infinite capacity would be in the cut). So min vertex cover \\(\\leq\\) min cut = max flow = max matching. Since every matching requires at least one endpoint per edge to be covered, max matching \\(\\leq\\) min cover, giving equality.'
                },
                {
                    question: 'What is the time complexity of finding a maximum bipartite matching using Edmonds-Karp? How does Hopcroft-Karp improve upon this?',
                    hint: 'Think about the structure of the flow network: \\(|V| = |L| + |R| + 2\\) and \\(|E| = |L| + |R| + |E_G|\\).',
                    solution: 'With Edmonds-Karp on the bipartite flow network: \\(O(VE^2)\\) where \\(V = |L|+|R|+2\\) and \\(E = |L|+|R|+|E_G|\\). Since the max flow \\(\\leq \\min(|L|, |R|)\\), and each augmentation uses \\(O(E)\\), a tighter bound is \\(O(\\sqrt{V} \\cdot E)\\) using the Hopcroft-Karp algorithm, which finds a maximal set of vertex-disjoint shortest augmenting paths in each phase, with at most \\(O(\\sqrt{V})\\) phases.'
                },
                {
                    question: 'Show how to use max-flow to find the maximum number of edge-disjoint paths from \\(s\\) to \\(t\\) in a directed graph.',
                    hint: 'Assign capacity 1 to each edge.',
                    solution: 'Set capacity \\(c(e) = 1\\) for every edge \\(e\\). Compute max-flow from \\(s\\) to \\(t\\). By integrality, the max-flow is integer, and each edge carries flow 0 or 1. Edges with flow 1 decompose into edge-disjoint \\(s\\)-\\(t\\) paths (each path uses each edge at most once). The number of such paths equals \\(|f^*|\\). This is Menger\'s theorem: the max number of edge-disjoint \\(s\\)-\\(t\\) paths equals the min number of edges whose removal disconnects \\(s\\) from \\(t\\).'
                },
                {
                    question: 'Design a flow network to solve: given \\(n\\) students and \\(m\\) projects, each student can do at most 2 projects and each project needs exactly 3 students. When is an assignment possible?',
                    hint: 'Adjust capacities at source and sink edges.',
                    solution: 'Source \\(s\\) connects to each student with capacity 2 (each student does at most 2 projects). Each project connects to sink \\(t\\) with capacity 3 (each project needs exactly 3 students). Each student-project edge has capacity 1 (a student either does a project or not). A valid assignment exists iff max-flow = \\(3m\\) (all projects fully staffed). This also requires \\(2n \\geq 3m\\).'
                },
                {
                    question: 'In the CLRS network (6 nodes, 10 edges from Section 2 visualization), compute the maximum flow by hand using Edmonds-Karp.',
                    hint: 'Run BFS augmenting paths systematically: s to t via shortest paths first.',
                    solution: 'The CLRS network (Fig 26.6) has max flow = 23. Edmonds-Karp finds paths like: (1) s->a->c->t with bottleneck 12, (2) s->b->d->t with bottleneck 4, (3) s->b->d->c->t with bottleneck 7, yielding total flow 23. The min-cut is ({s, a, b}, {c, d, t}) with capacity 12 + 7 + 4 = 23.'
                }
            ]
        }
    ]
});
