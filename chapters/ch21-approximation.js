window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch21',
    number: 21,
    title: '近似与随机化算法',
    subtitle: 'Approximation & Randomized Algorithms',
    sections: [

        /* ============================================================
           Section 1: Approximation Algorithms & Ratios
           ============================================================ */
        {
            id: 'ch21-sec01',
            title: 'Approximation Algorithms & Ratios',
            content: `
<h2>近似算法与近似比</h2>

<p>When facing NP-hard optimization problems, we often cannot find exact solutions in polynomial time. <strong>Approximation algorithms</strong> trade optimality for efficiency, providing solutions with <em>provable guarantees</em> on how far they are from optimal.</p>

<div class="env-block definition">
<div class="env-title">Definition 21.1 (Approximation Ratio)</div>
<div class="env-body">
<p>An algorithm has <strong>approximation ratio</strong> \\(\\rho(n)\\) if for every input of size \\(n\\):</p>
$$\\max\\left(\\frac{C}{C^*},\\, \\frac{C^*}{C}\\right) \\leq \\rho(n),$$
<p>where \\(C\\) is the cost of the algorithm's solution and \\(C^*\\) is the optimal cost. For minimization: \\(C / C^* \\leq \\rho\\). For maximization: \\(C^* / C \\leq \\rho\\).</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 21.2 (PTAS and FPTAS)</div>
<div class="env-body">
<p>A <strong>polynomial-time approximation scheme (PTAS)</strong> is a family of algorithms \\(\\{A_\\varepsilon\\}_{\\varepsilon > 0}\\) where \\(A_\\varepsilon\\) achieves ratio \\((1 + \\varepsilon)\\) in time \\(O(n^{f(1/\\varepsilon)})\\).</p>
<p>A <strong>fully polynomial-time approximation scheme (FPTAS)</strong> achieves ratio \\((1 + \\varepsilon)\\) in time polynomial in both \\(n\\) and \\(1/\\varepsilon\\).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch21-viz-approx-landscape"></div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body">
<p>The approximation ratio landscape for NP-hard problems varies enormously:</p>
<ul>
  <li><strong>Vertex Cover:</strong> 2-approximation (easy), cannot do \\((2 - \\varepsilon)\\) under UGC.</li>
  <li><strong>Set Cover:</strong> \\(O(\\ln n)\\)-approximation (greedy), cannot do \\((1 - \\varepsilon) \\ln n\\) unless P = NP.</li>
  <li><strong>TSP with triangle inequality:</strong> 3/2-approximation (Christofides).</li>
  <li><strong>General TSP:</strong> No constant-factor approximation unless P = NP.</li>
  <li><strong>Knapsack:</strong> FPTAS exists.</li>
  <li><strong>MAX-CLIQUE:</strong> Cannot approximate within \\(n^{1-\\varepsilon}\\) unless P = NP.</li>
</ul>
</div>
</div>

<h3>Why Approximation?</h3>
<p>For many practical applications, a solution that is guaranteed to be within a factor of 2 of optimal is far more useful than an exact algorithm that takes exponential time. Approximation algorithms are often simple, fast, and come with rigorous performance guarantees.</p>
`,
            visualizations: [
                {
                    id: 'ch21-viz-approx-landscape',
                    title: 'Approximation Ratio Landscape',
                    description: 'See the spectrum of approximability for different NP-hard problems.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});

                        var problems = [
                            {name: 'Knapsack', ratio: 'FPTAS', bar: 1.05, color: '#3fb950'},
                            {name: 'TSP (metric)', ratio: '3/2', bar: 1.5, color: '#3fb9a0'},
                            {name: 'Vertex Cover', ratio: '2', bar: 2.0, color: '#58a6ff'},
                            {name: 'Set Cover', ratio: 'O(ln n)', bar: 3.5, color: '#bc8cff'},
                            {name: 'Bin Packing', ratio: '1.5', bar: 1.5, color: '#d29922'},
                            {name: 'MAX-3SAT', ratio: '8/7', bar: 1.14, color: '#f0883e'},
                            {name: 'General TSP', ratio: 'None*', bar: 8, color: '#f85149'},
                            {name: 'Max Clique', ratio: 'n^(1-e)*', bar: 7, color: '#f85149'}
                        ];

                        function draw() {
                            viz.clear();
                            viz.screenText('Approximability Landscape of NP-Hard Problems', 350, 20, viz.colors.white, 14);
                            viz.screenText('Bar height = best known approximation ratio (log scale)', 350, 42, viz.colors.text, 10);

                            var barW = 60;
                            var startX = 50;
                            var baseY = 350;
                            var maxLogRatio = Math.log(10);

                            problems.forEach(function(p, i) {
                                var x = startX + i * 80;
                                var logR = Math.log(Math.max(p.bar, 1.01));
                                var h = (logR / maxLogRatio) * 260;
                                h = Math.min(h, 280);

                                var ctx = viz.ctx;
                                ctx.fillStyle = p.color + '88';
                                ctx.fillRect(x, baseY - h, barW, h);
                                ctx.strokeStyle = p.color;
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(x, baseY - h, barW, h);

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText(p.ratio, x + barW / 2, baseY - h - 4);

                                ctx.save();
                                ctx.translate(x + barW / 2, baseY + 10);
                                ctx.rotate(Math.PI / 4);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(p.name, 0, 0);
                                ctx.restore();
                            });

                            viz.screenText('* No polynomial-time constant-factor approx unless P=NP', 350, 408, viz.colors.red, 10);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'If a minimization algorithm always returns a solution of cost at most \\(3 \\cdot OPT + 5\\), is this a 3-approximation?',
                    hint: 'The additive term prevents a constant ratio when OPT is small.',
                    solution: 'No, not exactly. The ratio \\(C/C^* = (3 \\cdot OPT + 5)/OPT = 3 + 5/OPT\\), which approaches 3 as OPT grows but can be much larger when OPT is small. It is an asymptotic 3-approximation. For a true 3-approximation, we need \\(C \\leq 3 \\cdot OPT\\) for all inputs.'
                },
                {
                    question: 'Explain why general TSP (without triangle inequality) has no constant-factor approximation unless P = NP.',
                    hint: 'Use a reduction from Hamiltonian cycle. Make non-Hamiltonian tours extremely expensive.',
                    solution: 'Suppose algorithm \\(A\\) achieves ratio \\(\\rho\\) for general TSP. Given a Hamiltonian cycle instance \\(G = (V, E)\\), create TSP with \\(w(u,v) = 1\\) for \\((u,v) \\in E\\) and \\(w(u,v) = \\rho \\cdot n + 1\\) otherwise. If \\(G\\) has a Hamiltonian cycle, OPT = \\(n\\), and \\(A\\) returns tour of cost \\(\\leq \\rho \\cdot n\\). If \\(G\\) has no Hamiltonian cycle, every tour uses at least one non-edge, so cost \\(\\geq (n-1) + \\rho n + 1 > \\rho \\cdot n\\). Thus \\(A\\) would distinguish the two cases, solving the NP-complete Hamiltonian cycle problem.'
                },
                {
                    question: 'What is the difference between a PTAS and an FPTAS? Give an example of each.',
                    hint: 'FPTAS is polynomial in both \\(n\\) and \\(1/\\varepsilon\\), while PTAS may be exponential in \\(1/\\varepsilon\\).',
                    solution: 'A PTAS runs in time \\(O(n^{f(1/\\varepsilon)})\\) for some function \\(f\\), which is polynomial for fixed \\(\\varepsilon\\) but may be impractical when \\(\\varepsilon\\) is small (e.g., \\(n^{1/\\varepsilon}\\)). An FPTAS runs in time \\(O(\\text{poly}(n, 1/\\varepsilon))\\), e.g., \\(O(n^2/\\varepsilon)\\). Example FPTAS: Knapsack (via scaling and DP). Example PTAS (but not FPTAS): Euclidean TSP (Arora\'s algorithm runs in \\(n^{O(1/\\varepsilon)}\\)). SET-COVER has no PTAS unless P = NP.'
                }
            ]
        },

        /* ============================================================
           Section 2: Vertex Cover 2-Approximation
           ============================================================ */
        {
            id: 'ch21-sec02',
            title: 'Vertex Cover: 2-Approximation',
            content: `
<h2>顶点覆盖的2-近似</h2>

<p>The <strong>Minimum Vertex Cover</strong> problem asks for the smallest set of vertices that "covers" all edges. It is NP-hard, but has an elegant 2-approximation.</p>

<div class="env-block algorithm">
<div class="env-title">Algorithm 21.1: Vertex Cover 2-Approximation</div>
<div class="env-body">
<p><strong>Input:</strong> Graph \\(G = (V, E)\\)</p>
<p><strong>Output:</strong> Vertex cover \\(C\\) with \\(|C| \\leq 2 \\cdot OPT\\)</p>
<ol>
  <li>\\(C \\gets \\emptyset\\), \\(E' \\gets E\\).</li>
  <li><strong>While</strong> \\(E' \\neq \\emptyset\\):</li>
  <li>&emsp; Pick any edge \\((u, v) \\in E'\\).</li>
  <li>&emsp; Add both \\(u\\) and \\(v\\) to \\(C\\).</li>
  <li>&emsp; Remove from \\(E'\\) all edges incident to \\(u\\) or \\(v\\).</li>
  <li><strong>Return</strong> \\(C\\).</li>
</ol>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 21.1</div>
<div class="env-body">
<p>Algorithm 21.1 is a polynomial-time 2-approximation for Minimum Vertex Cover.</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof</div>
<div class="env-body">
<p><strong>Feasibility:</strong> Every edge is either picked in Step 3 (then both endpoints are in \\(C\\)) or was removed when an incident vertex was added. So \\(C\\) covers all edges.</p>
<p><strong>Approximation ratio:</strong> Let \\(A\\) be the set of edges picked in Step 3. These edges form a <strong>matching</strong> (no two share an endpoint). So \\(|C| = 2|A|\\). Any vertex cover must include at least one endpoint of each edge in \\(A\\), so \\(OPT \\geq |A|\\). Therefore \\(|C| = 2|A| \\leq 2 \\cdot OPT\\). \\(\\square\\)</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch21-viz-vertex-cover"></div>

<div class="env-block remark">
<div class="env-title">Remark: Tightness</div>
<div class="env-body">
<p>The ratio of 2 is tight for this algorithm: consider a perfect matching on \\(2n\\) vertices. The algorithm picks all \\(2n\\) vertices, while OPT = \\(n\\). Under the <strong>Unique Games Conjecture</strong>, no polynomial-time algorithm achieves ratio better than 2 for general Vertex Cover.</p>
</div>
</div>

<h3>LP Relaxation Approach</h3>

<p>An alternative 2-approximation uses <strong>linear programming relaxation</strong>:</p>
<ol>
  <li>Formulate as integer LP: minimize \\(\\sum_v x_v\\) subject to \\(x_u + x_v \\geq 1\\) for all \\((u,v) \\in E\\), \\(x_v \\in \\{0, 1\\}\\).</li>
  <li>Relax to \\(x_v \\in [0, 1]\\) and solve the LP in polynomial time.</li>
  <li>Round: include vertex \\(v\\) iff \\(x_v \\geq 1/2\\).</li>
</ol>
<p>This also yields a 2-approximation and demonstrates the power of LP relaxation + rounding.</p>
`,
            visualizations: [
                {
                    id: 'ch21-viz-vertex-cover',
                    title: 'Vertex Cover: Approximate vs Optimal',
                    description: 'Watch the greedy matching-based 2-approximation and compare with the optimal vertex cover.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450});
                        var nodes = [
                            {x:100,y:120},{x:250,y:80},{x:400,y:100},{x:550,y:120},
                            {x:100,y:300},{x:250,y:330},{x:400,y:310},{x:550,y:290}
                        ];
                        var edges = [
                            [0,1],[1,2],[2,3],[0,4],[1,5],[2,6],[3,7],
                            [4,5],[5,6],[6,7],[1,4],[2,5],[3,6]
                        ];
                        var cover = [];
                        var matchingEdges = [];
                        var optCover = null;
                        var showMode = 'approx';

                        function draw() {
                            viz.clear();
                            viz.screenText('Vertex Cover: 2-Approximation vs Optimal', 350, 18, viz.colors.white, 14);

                            edges.forEach(function(e) {
                                var u = nodes[e[0]], v = nodes[e[1]];
                                var covered = cover.indexOf(e[0]) >= 0 || cover.indexOf(e[1]) >= 0;
                                var isMatching = matchingEdges.some(function(m) { return (m[0] === e[0] && m[1] === e[1]) || (m[0] === e[1] && m[1] === e[0]); });
                                var col = isMatching ? viz.colors.yellow : (covered ? viz.colors.green : viz.colors.red);
                                viz.drawEdge(u.x, u.y, v.x, v.y, col, false, '', isMatching ? 3 : 1.5);
                            });

                            nodes.forEach(function(n, i) {
                                var inCover = cover.indexOf(i) >= 0;
                                viz.drawNode(n.x, n.y, 18, i.toString(), inCover ? viz.colors.yellow : viz.colors.blue, viz.colors.white);
                            });

                            var allCovered = edges.every(function(e) { return cover.indexOf(e[0]) >= 0 || cover.indexOf(e[1]) >= 0; });
                            viz.screenText('Cover: {' + cover.sort().join(', ') + '}    Size: ' + cover.length, 350, 390, viz.colors.yellow, 13);
                            if (allCovered) {
                                viz.screenText('All edges covered!', 350, 415, viz.colors.green, 12);
                            }
                            if (optCover !== null) {
                                viz.screenText('Optimal size: ' + optCover.length + '    Ratio: ' + (cover.length / optCover.length).toFixed(2), 350, 435, viz.colors.teal, 12);
                            }
                        }

                        function approxCover() {
                            cover = [];
                            matchingEdges = [];
                            var remaining = edges.slice();
                            var used = {};
                            while (remaining.length > 0) {
                                var e = remaining[0];
                                cover.push(e[0]);
                                cover.push(e[1]);
                                matchingEdges.push(e);
                                used[e[0]] = true;
                                used[e[1]] = true;
                                remaining = remaining.filter(function(r) { return !used[r[0]] && !used[r[1]]; });
                            }
                        }

                        function findOptimal() {
                            var n = nodes.length;
                            var best = null;
                            for (var mask = 0; mask < (1 << n); mask++) {
                                var s = [];
                                for (var i = 0; i < n; i++) { if (mask & (1 << i)) s.push(i); }
                                if (best !== null && s.length >= best.length) continue;
                                var valid = edges.every(function(e) { return s.indexOf(e[0]) >= 0 || s.indexOf(e[1]) >= 0; });
                                if (valid) best = s;
                            }
                            return best;
                        }

                        VizEngine.createButton(controls, '2-Approx', function() {
                            approxCover();
                            showMode = 'approx';
                            draw();
                        });
                        VizEngine.createButton(controls, 'Optimal', function() {
                            optCover = findOptimal();
                            cover = optCover.slice();
                            matchingEdges = [];
                            showMode = 'optimal';
                            draw();
                        });
                        VizEngine.createButton(controls, 'Compare', function() {
                            approxCover();
                            optCover = findOptimal();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            cover = []; matchingEdges = []; optCover = null;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Why does the set \\(A\\) of edges picked by the 2-approximation form a matching?',
                    hint: 'After picking edge \\((u,v)\\), what happens to other edges incident to \\(u\\) or \\(v\\)?',
                    solution: 'When edge \\((u,v)\\) is picked, ALL edges incident to \\(u\\) or \\(v\\) are removed from \\(E\'\\). So no future picked edge can share an endpoint with \\((u,v)\\). Therefore no two picked edges share an endpoint, which is the definition of a matching.'
                },
                {
                    question: 'Construct a graph where the 2-approximation achieves exactly ratio 2.',
                    hint: 'Use a perfect matching.',
                    solution: 'Take \\(n\\) disjoint edges: \\((v_1, v_2), (v_3, v_4), \\ldots, (v_{2n-1}, v_{2n})\\). The algorithm picks both endpoints of each edge, giving \\(|C| = 2n\\). But the optimal cover picks one endpoint per edge: \\(|C^*| = n\\). Ratio = \\(2n/n = 2\\).'
                },
                {
                    question: 'Show that the LP relaxation rounding scheme also gives a 2-approximation.',
                    hint: 'Round all variables with \\(x_v \\geq 1/2\\) to 1.',
                    solution: 'Let \\(x^*\\) be the LP optimum. For every edge \\((u,v)\\), \\(x^*_u + x^*_v \\geq 1\\), so at least one of \\(x^*_u, x^*_v \\geq 1/2\\). After rounding, this vertex is included, so the rounded solution is a valid cover. The cost of the rounded solution is \\(|\\{v : x^*_v \\geq 1/2\\}| \\leq \\sum_v 2x^*_v = 2 \\cdot LP^* \\leq 2 \\cdot OPT\\) (since LP relaxation is a lower bound on the IP optimum).'
                }
            ]
        },

        /* ============================================================
           Section 3: Set Cover & Greedy Analysis
           ============================================================ */
        {
            id: 'ch21-sec03',
            title: 'Set Cover Greedy Approximation',
            content: `
<h2>集合覆盖的贪心近似</h2>

<div class="env-block definition">
<div class="env-title">Definition 21.3 (Minimum Set Cover)</div>
<div class="env-body">
<p><strong>Input:</strong> Universe \\(U = \\{1, 2, \\ldots, n\\}\\), collection of sets \\(S_1, \\ldots, S_m \\subseteq U\\).</p>
<p><strong>Goal:</strong> Find minimum number of sets whose union is \\(U\\).</p>
</div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm 21.2: Greedy Set Cover</div>
<div class="env-body">
<ol>
  <li>\\(C \\gets \\emptyset\\), \\(\\text{uncovered} \\gets U\\).</li>
  <li><strong>While</strong> uncovered \\(\\neq \\emptyset\\):</li>
  <li>&emsp; Select set \\(S_i\\) that covers the most uncovered elements.</li>
  <li>&emsp; Add \\(S_i\\) to \\(C\\).</li>
  <li>&emsp; Remove covered elements from uncovered.</li>
  <li><strong>Return</strong> \\(C\\).</li>
</ol>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 21.2 (Greedy Set Cover Ratio)</div>
<div class="env-body">
<p>The greedy algorithm achieves approximation ratio \\(H_n = \\sum_{k=1}^n \\frac{1}{k} = O(\\ln n)\\).</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof Sketch</div>
<div class="env-body">
<p>Assign a cost to each element: when \\(S_i\\) is chosen and covers \\(k\\) new elements, each gets cost \\(1/k\\). The total cost equals the number of sets chosen. By a careful accounting argument, the cost assigned to elements covered by any optimal set \\(S_j\\) is at most \\(H_{|S_j|}\\). Summing over OPT sets gives total cost \\(\\leq H_n \\cdot OPT\\).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch21-viz-set-cover"></div>

<div class="env-block theorem">
<div class="env-title">Theorem 21.3 (Inapproximability)</div>
<div class="env-body">
<p>Unless \\(\\mathbf{P} = \\mathbf{NP}\\), Set Cover cannot be approximated within factor \\((1 - \\varepsilon) \\ln n\\) for any \\(\\varepsilon > 0\\). So the greedy algorithm is essentially optimal!</p>
</div>
</div>

<h3>Weighted Set Cover</h3>

<p>When sets have weights \\(w_i\\), the greedy algorithm selects the set maximizing new coverage per unit cost: \\(|S_i \\cap \\text{uncovered}| / w_i\\). This achieves the same \\(H_n\\) ratio for the weighted version.</p>
`,
            visualizations: [
                {
                    id: 'ch21-viz-set-cover',
                    title: 'Greedy Set Cover Visualizer',
                    description: 'Watch the greedy algorithm pick sets one by one to cover the universe.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450});
                        var universe = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                        var sets = [
                            {name: 'S1', elems: [1, 2, 3, 4], color: '#58a6ff'},
                            {name: 'S2', elems: [3, 4, 5, 6, 7], color: '#3fb9a0'},
                            {name: 'S3', elems: [6, 7, 8], color: '#bc8cff'},
                            {name: 'S4', elems: [8, 9, 10], color: '#f0883e'},
                            {name: 'S5', elems: [1, 5, 9], color: '#f85149'},
                            {name: 'S6', elems: [2, 4, 6, 8, 10], color: '#d29922'}
                        ];
                        var chosen = [];
                        var covered = {};
                        var step = 0;

                        function draw() {
                            viz.clear();
                            viz.screenText('Greedy Set Cover', 350, 20, viz.colors.white, 14);

                            viz.screenText('Universe:', 60, 60, viz.colors.text, 12);
                            universe.forEach(function(e, i) {
                                var x = 120 + i * 55;
                                var isCov = covered[e];
                                viz.drawNode(x, 60, 16, e.toString(), isCov ? viz.colors.green : viz.colors.axis, viz.colors.white);
                            });

                            sets.forEach(function(s, si) {
                                var y = 120 + si * 50;
                                var isChosen = chosen.indexOf(si) >= 0;
                                var newCount = 0;
                                s.elems.forEach(function(e) { if (!covered[e]) newCount++; });

                                viz.screenText(s.name + ': {' + s.elems.join(',') + '}', 130, y, isChosen ? s.color : viz.colors.text, 12);
                                if (isChosen) {
                                    viz.screenText('CHOSEN', 300, y, s.color, 11);
                                } else if (step > 0) {
                                    viz.screenText('(+' + newCount + ' new)', 300, y, viz.colors.text, 10);
                                }

                                s.elems.forEach(function(e, ei) {
                                    var ex = 380 + ei * 35;
                                    var eInSet = true;
                                    var covByThis = isChosen && eInSet;
                                    viz.drawNode(ex, y, 10, e.toString(), covByThis ? s.color : viz.colors.axis + '44', viz.colors.white);
                                });
                            });

                            var covCount = Object.keys(covered).length;
                            viz.screenText('Covered: ' + covCount + '/' + universe.length + '    Sets used: ' + chosen.length, 350, 420, viz.colors.yellow, 13);
                            if (covCount === universe.length) {
                                viz.screenText('Complete cover found!', 350, 440, viz.colors.green, 12);
                            }
                        }

                        function greedyStep() {
                            if (Object.keys(covered).length === universe.length) return;
                            var bestIdx = -1, bestCount = 0;
                            sets.forEach(function(s, si) {
                                if (chosen.indexOf(si) >= 0) return;
                                var cnt = 0;
                                s.elems.forEach(function(e) { if (!covered[e]) cnt++; });
                                if (cnt > bestCount) { bestCount = cnt; bestIdx = si; }
                            });
                            if (bestIdx >= 0) {
                                chosen.push(bestIdx);
                                sets[bestIdx].elems.forEach(function(e) { covered[e] = true; });
                                step++;
                            }
                        }

                        VizEngine.createButton(controls, 'Greedy Step', function() { greedyStep(); draw(); });
                        VizEngine.createButton(controls, 'Run All', function() {
                            while (Object.keys(covered).length < universe.length) greedyStep();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            chosen = []; covered = {}; step = 0; draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'For universe \\(U = \\{1, \\ldots, n\\}\\) and \\(n\\) singleton sets plus one set containing all elements, what does greedy choose? What is optimal?',
                    hint: 'Greedy always picks the set covering the most uncovered elements.',
                    solution: 'Greedy picks the big set \\(U\\) first (covers all \\(n\\) elements), giving solution size 1. Optimal is also 1 (just the big set). In this case greedy is optimal. The worst case for greedy occurs with more adversarial set structures.'
                },
                {
                    question: 'Construct a Set Cover instance where the greedy algorithm uses \\(\\Omega(\\ln n)\\) times more sets than optimal.',
                    hint: 'Use sets of geometrically decreasing size.',
                    solution: 'Let \\(|U| = n\\). Create 2 "big" sets each of size \\(n/2\\) partitioning \\(U\\) (optimal = 2 sets). Also create \\(\\ln n\\) sets where set \\(i\\) covers \\(n/2^i\\) elements chosen adversarially so greedy picks these instead: the first covers \\(n/2\\) elements (tying with big sets), but after choosing it, the remaining are split so each subsequent greedy choice covers half the remaining. Greedy uses \\(\\sim \\ln n\\) sets while optimal uses 2, giving ratio \\(\\sim (\\ln n)/2\\).'
                },
                {
                    question: 'Prove that the greedy Set Cover algorithm runs in polynomial time.',
                    hint: 'Analyze each iteration: how many elements remain and what work is done?',
                    solution: 'In each iteration, at least one new element is covered (since the chosen set covers the most new elements and at least one uncovered element exists). So there are at most \\(n\\) iterations. Each iteration: scan \\(m\\) sets, for each set count uncovered elements (\\(O(n)\\) with a hash set). Total: \\(O(nm)\\) per iteration, \\(O(n^2 m)\\) overall. With better data structures (lazy evaluation), this can be improved to \\(O(\\sum_i |S_i|)\\).'
                }
            ]
        },

        /* ============================================================
           Section 4: TSP Approximation
           ============================================================ */
        {
            id: 'ch21-sec04',
            title: 'TSP with Triangle Inequality',
            content: `
<h2>满足三角不等式的 TSP 近似</h2>

<p>The <strong>Traveling Salesman Problem (TSP)</strong> asks for the shortest tour visiting all cities. While general TSP has no constant-factor approximation, the <em>metric</em> version (distances satisfy the triangle inequality) admits good approximations.</p>

<div class="env-block definition">
<div class="env-title">Definition 21.4 (Metric TSP)</div>
<div class="env-body">
<p>Given \\(n\\) cities with distances \\(d(i,j)\\) satisfying \\(d(i,j) \\leq d(i,k) + d(k,j)\\) for all \\(i,j,k\\), find a tour of minimum total distance.</p>
</div>
</div>

<h3>MST-Based 2-Approximation</h3>

<div class="env-block algorithm">
<div class="env-title">Algorithm 21.3: MST-based TSP Approximation</div>
<div class="env-body">
<ol>
  <li>Compute a minimum spanning tree (MST) of the complete graph.</li>
  <li>Double every edge of the MST to get an Eulerian multigraph.</li>
  <li>Find an Eulerian circuit of this multigraph.</li>
  <li>Shortcut: convert to a Hamiltonian cycle by skipping visited vertices.</li>
</ol>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 21.4</div>
<div class="env-body">
<p>Algorithm 21.3 is a 2-approximation for Metric TSP.</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof</div>
<div class="env-body">
<p>Let \\(T^*\\) be the optimal tour cost. Removing one edge from the optimal tour gives a spanning tree, so \\(MST \\leq T^*\\). The Eulerian circuit on the doubled MST has cost \\(2 \\cdot MST\\). Shortcutting (using triangle inequality) can only decrease cost. So the final tour cost \\(\\leq 2 \\cdot MST \\leq 2 \\cdot T^*\\). \\(\\square\\)</p>
</div>
</div>

<h3>Christofides' Algorithm (3/2-Approximation)</h3>

<div class="env-block algorithm">
<div class="env-title">Algorithm 21.4: Christofides (1976)</div>
<div class="env-body">
<ol>
  <li>Compute MST \\(T\\).</li>
  <li>Let \\(O\\) = set of odd-degree vertices in \\(T\\).</li>
  <li>Find a minimum-weight perfect matching \\(M\\) on \\(O\\).</li>
  <li>Combine \\(T \\cup M\\) to get an Eulerian multigraph.</li>
  <li>Find Eulerian circuit, then shortcut to Hamiltonian cycle.</li>
</ol>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 21.5 (Christofides)</div>
<div class="env-body">
<p>Christofides' algorithm achieves ratio \\(3/2\\). This was the best known for nearly 50 years until Karlin, Klein & Oveis Gharan (2020) achieved \\(3/2 - \\varepsilon\\) for some small \\(\\varepsilon > 0\\).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch21-viz-tsp"></div>
`,
            visualizations: [
                {
                    id: 'ch21-viz-tsp',
                    title: 'TSP: MST vs Christofides',
                    description: 'Compare the MST-based 2-approximation with Christofides\' 3/2-approximation on random points.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450});
                        var numCities = 10;
                        var cities = [];
                        var mstTour = [];
                        var greedyTour = [];
                        var showMode = 'mst';

                        function genCities() {
                            cities = [];
                            for (var i = 0; i < numCities; i++) {
                                cities.push({x: 60 + Math.random() * 580, y: 60 + Math.random() * 320});
                            }
                        }

                        function dist(a, b) {
                            var dx = cities[a].x - cities[b].x, dy = cities[a].y - cities[b].y;
                            return Math.sqrt(dx * dx + dy * dy);
                        }

                        function computeMST() {
                            var n = cities.length;
                            var inTree = new Array(n).fill(false);
                            var minEdge = new Array(n).fill(Infinity);
                            var parent = new Array(n).fill(-1);
                            var mstEdges = [];
                            minEdge[0] = 0;
                            for (var iter = 0; iter < n; iter++) {
                                var u = -1;
                                for (var i = 0; i < n; i++) {
                                    if (!inTree[i] && (u === -1 || minEdge[i] < minEdge[u])) u = i;
                                }
                                inTree[u] = true;
                                if (parent[u] !== -1) mstEdges.push([parent[u], u]);
                                for (var v = 0; v < n; v++) {
                                    if (!inTree[v]) {
                                        var d = dist(u, v);
                                        if (d < minEdge[v]) { minEdge[v] = d; parent[v] = u; }
                                    }
                                }
                            }
                            return mstEdges;
                        }

                        function mstToTour(mstEdges) {
                            var n = cities.length;
                            var adj = [];
                            for (var i = 0; i < n; i++) adj.push([]);
                            mstEdges.forEach(function(e) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
                            var visited = new Array(n).fill(false);
                            var tour = [];
                            function dfs(u) {
                                visited[u] = true;
                                tour.push(u);
                                adj[u].forEach(function(v) { if (!visited[v]) dfs(v); });
                            }
                            dfs(0);
                            return tour;
                        }

                        function nearestNeighborTour() {
                            var n = cities.length;
                            var visited = new Array(n).fill(false);
                            var tour = [0];
                            visited[0] = true;
                            for (var step = 1; step < n; step++) {
                                var last = tour[tour.length - 1];
                                var best = -1, bestD = Infinity;
                                for (var j = 0; j < n; j++) {
                                    if (!visited[j] && dist(last, j) < bestD) { bestD = dist(last, j); best = j; }
                                }
                                tour.push(best);
                                visited[best] = true;
                            }
                            return tour;
                        }

                        function tourLength(tour) {
                            var total = 0;
                            for (var i = 0; i < tour.length; i++) {
                                total += dist(tour[i], tour[(i + 1) % tour.length]);
                            }
                            return total;
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Metric TSP Approximation', 350, 18, viz.colors.white, 14);

                            var tour = showMode === 'mst' ? mstTour : greedyTour;
                            var label = showMode === 'mst' ? 'MST-based 2-approx' : 'Nearest Neighbor heuristic';

                            if (tour.length > 0) {
                                for (var i = 0; i < tour.length; i++) {
                                    var a = cities[tour[i]], b = cities[tour[(i + 1) % tour.length]];
                                    viz.drawEdge(a.x, a.y, b.x, b.y, showMode === 'mst' ? viz.colors.teal : viz.colors.orange, false, '', 2);
                                }
                                viz.screenText(label + '    Tour length: ' + tourLength(tour).toFixed(1), 350, 425, viz.colors.yellow, 12);
                            }

                            if (showMode === 'mst' && mstTour.length > 0) {
                                var mstEdges = computeMST();
                                mstEdges.forEach(function(e) {
                                    var a = cities[e[0]], b = cities[e[1]];
                                    viz.drawEdge(a.x, a.y, b.x, b.y, viz.colors.axis, false, '', 1);
                                });
                            }

                            cities.forEach(function(c, i) {
                                viz.drawNode(c.x, c.y, 12, i.toString(), viz.colors.blue, viz.colors.white);
                            });
                        }

                        function recompute() {
                            var mstEdges = computeMST();
                            mstTour = mstToTour(mstEdges);
                            greedyTour = nearestNeighborTour();
                        }

                        genCities();
                        recompute();

                        VizEngine.createButton(controls, 'MST Tour', function() { showMode = 'mst'; draw(); });
                        VizEngine.createButton(controls, 'Nearest Neighbor', function() { showMode = 'nn'; draw(); });
                        VizEngine.createButton(controls, 'New Cities', function() { genCities(); recompute(); draw(); });
                        VizEngine.createSlider(controls, 'Cities', 5, 20, numCities, 1, function(v) { numCities = Math.round(v); genCities(); recompute(); draw(); });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Why is the triangle inequality essential for the MST-based TSP approximation?',
                    hint: 'The shortcutting step relies on triangle inequality.',
                    solution: 'In the shortcutting step, when we skip a visited vertex \\(v\\) and go directly from \\(u\\) to \\(w\\), we need \\(d(u, w) \\leq d(u, v) + d(v, w)\\) to ensure the shortcut does not increase the tour length. Without triangle inequality, skipping vertices could create longer paths, invalidating the 2-approximation guarantee.'
                },
                {
                    question: 'Why is the cost of the minimum perfect matching on odd-degree vertices at most \\(T^*/2\\) in Christofides\' algorithm?',
                    hint: 'The optimal tour visits all odd-degree vertices. Consider alternating edges of the tour restricted to these vertices.',
                    solution: 'The optimal tour \\(T^*\\) visits all vertices, including all odd-degree vertices of the MST. Restricting \\(T^*\\) to the odd-degree vertices \\(O\\) (using triangle inequality to shortcut) gives a Hamiltonian cycle on \\(O\\) with cost \\(\\leq T^*\\). This cycle can be decomposed into two perfect matchings (alternating edges). The cheaper one has cost \\(\\leq T^*/2\\). Since we find the minimum matching, \\(M \\leq T^*/2\\). Total: MST + M \\(\\leq T^* + T^*/2 = 3T^*/2\\).'
                },
                {
                    question: 'Given 4 cities at coordinates (0,0), (1,0), (1,1), (0,1), compute the MST-based tour and the optimal tour.',
                    hint: 'The cities form a unit square.',
                    solution: 'The MST connects the 4 cities with 3 edges of total weight 3 (e.g., (0,0)-(1,0)-(1,1)-(0,1)). DFS ordering gives tour: (0,0)-(1,0)-(1,1)-(0,1)-(0,0) with total length \\(1 + 1 + 1 + 1 = 4\\). The optimal tour visits all 4 vertices of the square: perimeter = 4. The MST-based shortcut also gives 4, which happens to be optimal. The diagonal tour (0,0)-(1,0)-(0,1)-(1,1)-(0,0) has cost \\(1 + \\sqrt{2} + \\sqrt{2} + 1 \\approx 4.83\\), which is worse.'
                }
            ]
        },

        /* ============================================================
           Section 5: Randomized Algorithms
           ============================================================ */
        {
            id: 'ch21-sec05',
            title: 'Randomized Algorithms',
            content: `
<h2>随机化算法</h2>

<p>Randomized algorithms use random choices to achieve good expected performance or high-probability guarantees. They are often simpler and faster than deterministic alternatives.</p>

<div class="env-block definition">
<div class="env-title">Definition 21.5 (Las Vegas vs Monte Carlo)</div>
<div class="env-body">
<ul>
  <li><strong>Las Vegas:</strong> Always correct, randomized running time. E.g., randomized QuickSort.</li>
  <li><strong>Monte Carlo:</strong> Always fast, correct with high probability. E.g., randomized primality testing.</li>
</ul>
</div>
</div>

<h3>Karger's Min-Cut Algorithm</h3>

<div class="env-block algorithm">
<div class="env-title">Algorithm 21.5: Karger's Contraction Algorithm</div>
<div class="env-body">
<p><strong>Input:</strong> Undirected multigraph \\(G = (V, E)\\)</p>
<p><strong>Output:</strong> A cut (possibly the minimum cut)</p>
<ol>
  <li><strong>While</strong> \\(|V| > 2\\):</li>
  <li>&emsp; Pick a uniformly random edge \\((u, v)\\).</li>
  <li>&emsp; <strong>Contract</strong> \\((u, v)\\): merge \\(u\\) and \\(v\\) into a single vertex, keep parallel edges, remove self-loops.</li>
  <li>The remaining edges between the 2 super-vertices define a cut.</li>
</ol>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 21.6</div>
<div class="env-body">
<p>Karger's algorithm outputs the minimum cut with probability \\(\\geq \\frac{2}{n(n-1)}\\).</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof</div>
<div class="env-body">
<p>Let \\(k\\) be the min-cut size. At step \\(i\\) (when \\(n - i\\) vertices remain), the graph has \\(\\geq k(n-i)/2\\) edges. The probability of NOT contracting a min-cut edge is:</p>
$$\\prod_{i=0}^{n-3} \\left(1 - \\frac{k}{k(n-i)/2}\\right) = \\prod_{i=0}^{n-3} \\frac{n - i - 2}{n - i} = \\frac{2}{n(n-1)}.$$
<p>Repeating \\(\\binom{n}{2} \\ln n\\) times and taking the best cut gives success probability \\(\\geq 1 - 1/n\\).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch21-viz-karger"></div>

<h3>MAX-SAT Randomized Approximation</h3>

<div class="env-block algorithm">
<div class="env-title">Algorithm 21.6: Random MAX-SAT</div>
<div class="env-body">
<p>Set each variable independently to TRUE with probability 1/2.</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 21.7</div>
<div class="env-body">
<p>For a CNF formula with \\(m\\) clauses each of size \\(\\geq k\\), the expected number of satisfied clauses is \\(\\geq m(1 - 2^{-k})\\). For MAX-3SAT, this is \\(\\geq 7m/8\\), giving an \\(8/7\\)-approximation.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch21-viz-monte-carlo"></div>

<h3>Derandomization: Method of Conditional Expectations</h3>

<p>The random MAX-SAT algorithm can be <strong>derandomized</strong>: set each variable greedily so that the conditional expectation of satisfied clauses never decreases. This converts the randomized \\(8/7\\)-approximation into a deterministic one!</p>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body">
<p>The interplay between randomization and approximation is deep. <strong>Semidefinite programming</strong> (SDP) relaxation with randomized rounding achieves the best known ratios for many problems, including MAX-CUT (Goemans-Williamson 0.878-approximation).</p>
</div>
</div>
`,
            visualizations: [
                {
                    id: 'ch21-viz-karger',
                    title: 'Karger\'s Contraction Algorithm',
                    description: 'Watch random edge contractions reduce the graph to 2 super-vertices, revealing a cut.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450});
                        var origNodes, origEdges;
                        var nodes, edges, groups;
                        var bestCut = Infinity;
                        var trials = 0;

                        function initGraph() {
                            origNodes = [
                                {id:0,x:150,y:150},{id:1,x:300,y:80},{id:2,x:450,y:150},
                                {id:3,x:150,y:300},{id:4,x:300,y:350},{id:5,x:450,y:300}
                            ];
                            origEdges = [
                                [0,1],[1,2],[0,3],[3,4],[4,5],[2,5],
                                [1,4],[0,4],[2,4],[1,5]
                            ];
                            resetGraph();
                        }

                        function resetGraph() {
                            nodes = origNodes.map(function(n) { return {id: n.id, x: n.x, y: n.y, members: [n.id]}; });
                            edges = origEdges.map(function(e) { return [e[0], e[1]]; });
                        }

                        function findNode(id) { return nodes.find(function(n) { return n.id === id; }); }

                        function contractRandom() {
                            if (nodes.length <= 2) return false;
                            var validEdges = edges.filter(function(e) { return e[0] !== e[1]; });
                            if (validEdges.length === 0) return false;
                            var idx = Math.floor(Math.random() * validEdges.length);
                            var e = validEdges[idx];
                            var u = findNode(e[0]), v = findNode(e[1]);
                            u.members = u.members.concat(v.members);
                            u.x = (u.x + v.x) / 2;
                            u.y = (u.y + v.y) / 2;
                            edges = edges.map(function(ed) {
                                return [ed[0] === v.id ? u.id : ed[0], ed[1] === v.id ? u.id : ed[1]];
                            });
                            edges = edges.filter(function(ed) { return ed[0] !== ed[1]; });
                            nodes = nodes.filter(function(n) { return n.id !== v.id; });
                            return true;
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Karger\'s Random Contraction', 350, 18, viz.colors.white, 14);

                            edges.forEach(function(e) {
                                var u = findNode(e[0]), v = findNode(e[1]);
                                if (u && v) {
                                    viz.drawEdge(u.x, u.y, v.x, v.y, viz.colors.axis, false, '', 1.5);
                                }
                            });

                            var colors = [viz.colors.blue, viz.colors.teal, viz.colors.purple, viz.colors.orange, viz.colors.pink, viz.colors.green];
                            nodes.forEach(function(n, i) {
                                var r = 14 + n.members.length * 4;
                                var col = nodes.length === 2 ? (i === 0 ? viz.colors.green : viz.colors.red) : colors[i % colors.length];
                                viz.drawNode(n.x, n.y, r, '{' + n.members.join(',') + '}', col, viz.colors.white);
                            });

                            viz.screenText('Vertices: ' + nodes.length + '    Edges: ' + edges.filter(function(e){return e[0]!==e[1];}).length, 350, 400, viz.colors.text, 12);

                            if (nodes.length === 2) {
                                var cutSize = edges.filter(function(e) { return e[0] !== e[1]; }).length;
                                if (cutSize < bestCut) bestCut = cutSize;
                                viz.screenText('Cut size: ' + cutSize + '    Best so far: ' + bestCut + '    Trials: ' + trials, 350, 425, viz.colors.yellow, 13);
                            }
                        }

                        initGraph();

                        VizEngine.createButton(controls, 'Contract', function() {
                            if (nodes.length <= 2) return;
                            contractRandom();
                            if (nodes.length === 2) trials++;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Run Trial', function() {
                            resetGraph();
                            while (nodes.length > 2) contractRandom();
                            trials++;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Run 20 Trials', function() {
                            for (var t = 0; t < 20; t++) {
                                resetGraph();
                                while (nodes.length > 2) contractRandom();
                                var cs = edges.filter(function(e) { return e[0] !== e[1]; }).length;
                                if (cs < bestCut) bestCut = cs;
                                trials++;
                            }
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            resetGraph(); bestCut = Infinity; trials = 0; draw();
                        });

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'ch21-viz-monte-carlo',
                    title: 'MAX-SAT Random Approximation',
                    description: 'Run random assignments on a MAX-SAT instance and track how many clauses are satisfied.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 430});
                        var numVars = 5;
                        var clauses = [
                            [1, -2, 3],
                            [-1, 2, 4],
                            [2, -3, 5],
                            [-2, 3, -4],
                            [1, 4, -5],
                            [-1, -3, 5],
                            [2, 3, -5],
                            [1, -4, 5]
                        ];
                        var assignment = [true, true, false, true, false];
                        var history = [];
                        var maxSat = 0;

                        function evalClause(c) {
                            return c.some(function(l) { return l > 0 ? assignment[l-1] : !assignment[-l-1]; });
                        }
                        function countSat() { return clauses.filter(evalClause).length; }

                        function draw() {
                            viz.clear();
                            viz.screenText('MAX-3SAT: Random Assignment Approximation', 350, 20, viz.colors.white, 14);
                            viz.screenText('Expected >= 7/8 of clauses = ' + (7 * clauses.length / 8).toFixed(1) + ' out of ' + clauses.length, 350, 45, viz.colors.text, 11);

                            for (var i = 0; i < numVars; i++) {
                                viz.drawNode(80 + i * 70, 90, 16, 'x' + (i+1), assignment[i] ? viz.colors.green : viz.colors.red, viz.colors.white);
                                viz.screenText(assignment[i] ? 'T' : 'F', 80 + i * 70, 115, viz.colors.text, 10);
                            }

                            var satCount = 0;
                            clauses.forEach(function(c, ci) {
                                var y = 150 + ci * 30;
                                var sat = evalClause(c);
                                if (sat) satCount++;
                                var cStr = c.map(function(l) { return (l < 0 ? '~x' : 'x') + Math.abs(l); }).join(' v ');
                                viz.screenText('(' + cStr + ')', 200, y, sat ? viz.colors.green : viz.colors.red, 11);
                                viz.screenText(sat ? 'SAT' : 'UNSAT', 370, y, sat ? viz.colors.green : viz.colors.red, 11);
                            });

                            viz.screenText('Satisfied: ' + satCount + '/' + clauses.length, 520, 200, viz.colors.yellow, 14);
                            viz.screenText('Best: ' + maxSat + '/' + clauses.length, 520, 225, viz.colors.teal, 13);

                            if (history.length > 1) {
                                var barW = Math.min(20, 400 / history.length);
                                var baseY = 410;
                                history.forEach(function(h, hi) {
                                    var bh = (h / clauses.length) * 80;
                                    var ctx = viz.ctx;
                                    ctx.fillStyle = h >= 7 * clauses.length / 8 ? viz.colors.green + '88' : viz.colors.blue + '88';
                                    ctx.fillRect(450 + hi * barW, baseY - bh, barW - 1, bh);
                                });
                                viz.screenText('Trial history', 550, 330, viz.colors.text, 10);
                            }
                        }

                        function randomAssign() {
                            assignment = [];
                            for (var i = 0; i < numVars; i++) assignment.push(Math.random() > 0.5);
                            var s = countSat();
                            history.push(s);
                            if (s > maxSat) maxSat = s;
                        }

                        VizEngine.createButton(controls, 'Random Trial', function() { randomAssign(); draw(); });
                        VizEngine.createButton(controls, 'Run 50 Trials', function() {
                            for (var i = 0; i < 50; i++) randomAssign();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            assignment = [true,true,false,true,false]; history = []; maxSat = 0; draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'What is the probability that Karger\'s algorithm finds the min-cut in a single trial on a graph with \\(n = 10\\) vertices?',
                    hint: 'Use the formula \\(\\frac{2}{n(n-1)}\\).',
                    solution: 'The probability is \\(\\frac{2}{10 \\times 9} = \\frac{2}{90} = \\frac{1}{45} \\approx 0.022\\). To boost success probability to \\(\\geq 1 - 1/n = 0.9\\), repeat \\(\\binom{10}{2} \\ln 10 = 45 \\ln 10 \\approx 104\\) times.'
                },
                {
                    question: 'Prove that the random MAX-SAT algorithm satisfies at least \\(m(1 - 2^{-k})\\) clauses in expectation, where each clause has \\(\\geq k\\) literals.',
                    hint: 'Compute the probability that a single clause is unsatisfied.',
                    solution: 'A clause with \\(k\\) literals is unsatisfied only if ALL its literals are false. Each literal is false with probability \\(1/2\\) independently. So \\(\\Pr[\\text{clause unsatisfied}] = 2^{-k}\\), and \\(\\Pr[\\text{clause satisfied}] = 1 - 2^{-k}\\). By linearity of expectation: \\(E[\\text{clauses satisfied}] = \\sum_{j=1}^m \\Pr[C_j \\text{ sat}] \\geq m(1 - 2^{-k})\\). For \\(k = 3\\): at least \\(7m/8\\) clauses.'
                },
                {
                    question: 'Explain how to derandomize the MAX-SAT algorithm using the method of conditional expectations.',
                    hint: 'Set variables one at a time, always choosing the value that keeps the conditional expectation highest.',
                    solution: 'Set variables \\(x_1, x_2, \\ldots, x_n\\) one by one. At each step, compute the conditional expectation of satisfied clauses for both \\(x_i = T\\) and \\(x_i = F\\), given the previously fixed variables. Choose the value giving the higher conditional expectation. The conditional expectation can be computed in \\(O(m)\\) time: for each clause, compute \\(\\Pr[\\text{sat} | \\text{fixed vars}]\\) based on remaining random variables. Since we always maintain \\(E[\\text{sat} | \\text{fixed}] \\geq m(1-2^{-k})\\), the final deterministic assignment satisfies \\(\\geq m(1-2^{-k})\\) clauses.'
                },
                {
                    question: 'How many independent trials of Karger\'s algorithm are needed to find the min-cut with probability at least \\(1 - 1/n^2\\)?',
                    hint: 'Each trial succeeds with probability \\(\\geq 2/(n(n-1))\\). Use \\((1-p)^k \\leq e^{-pk}\\).',
                    solution: 'Each trial fails with probability \\(\\leq 1 - \\frac{2}{n(n-1)}\\). After \\(k\\) trials, all fail with probability \\(\\leq (1 - \\frac{2}{n(n-1)})^k \\leq e^{-2k/(n(n-1))}\\). For this to be \\(\\leq 1/n^2\\), we need \\(e^{-2k/(n(n-1))} \\leq 1/n^2\\), so \\(k \\geq n(n-1) \\ln n\\). Thus \\(O(n^2 \\ln n)\\) trials suffice. Total time: \\(O(n^2 \\ln n \\cdot (n + m))\\) where \\(m = |E|\\).'
                },
                {
                    question: 'A randomized algorithm for MAX-CUT places each vertex in set \\(S\\) or \\(\\bar{S}\\) uniformly at random. What is the expected fraction of edges cut?',
                    hint: 'What is the probability that an edge has endpoints in different sets?',
                    solution: 'For any edge \\((u,v)\\), the probability that \\(u\\) and \\(v\\) are in different sets is \\(1/2\\) (one is in \\(S\\), the other in \\(\\bar{S}\\)). By linearity of expectation, the expected number of cut edges is \\(m/2\\), where \\(m = |E|\\). Since the optimal cut has at most \\(m\\) edges, this gives a 2-approximation (\\(E[\\text{cut}] \\geq OPT/2\\)). The Goemans-Williamson SDP algorithm improves this to a 1.139-approximation (ratio \\(\\approx 0.878\\) of optimal).'
                },
                {
                    question: 'Compare the Karger-Stein algorithm with basic Karger. What improvement does it achieve?',
                    hint: 'Karger-Stein uses a recursive contraction strategy.',
                    solution: 'Basic Karger contracts down to 2 vertices and repeats \\(O(n^2 \\log n)\\) times with total time \\(O(n^2 m \\log n)\\). Karger-Stein observes that contracting is "safest" when many vertices remain (probability of destroying min-cut is low). It contracts to \\(n/\\sqrt{2}\\) vertices, then recursively runs two independent copies. This gives success probability \\(O(1/\\log n)\\) per trial, requiring only \\(O(\\log^2 n)\\) trials. Total time: \\(O(n^2 \\log^3 n)\\), much better than \\(O(n^2 m \\log n)\\) for dense graphs.'
                }
            ]
        }
    ]
});
