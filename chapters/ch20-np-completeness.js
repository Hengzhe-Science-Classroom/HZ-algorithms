window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch20',
    number: 20,
    title: 'NP-Completeness & Reductions',
    subtitle: 'NP-Completeness & Reductions',
    sections: [

        /* ============================================================
           Section 1: P, NP, and co-NP
           ============================================================ */
        {
            id: 'ch20-sec01',
            title: 'P, NP, and co-NP',
            content: `
<h2>P, NP and co-NP</h2>
<div class="env-block bridge"><div class="env-title">Chapter Overview</div><div class="env-body"><p>Throughout Chapters 4 through 19, we designed polynomial-time algorithms for a wide variety of problems. But some problems, such as the Travelling Salesman, Boolean satisfiability, and graph coloring, seem to require exponential time. Are they truly harder, or are we just not clever enough? NP-completeness theory, one of the great intellectual achievements of computer science, provides a framework for answering this question. This chapter develops the theory of P, NP, polynomial reductions, and the Cook-Levin theorem.</p></div></div>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>We define the complexity classes P (problems solvable in polynomial time), NP (problems whose solutions are verifiable in polynomial time), and co-NP. The central question, whether P = NP, is the most important open problem in computer science.</p></div></div>


<p>Complexity theory classifies decision problems by the computational resources needed to solve or verify them. The central question — <strong>P vs NP</strong> — is the most important open problem in computer science.</p>

<div class="env-block definition">
<div class="env-title">Definition 20.1 (Decision Problem)</div>
<div class="env-body">
<p>A <strong>decision problem</strong> is a function \\(L : \\{0,1\\}^* \\to \\{0,1\\}\\). An instance \\(x\\) is a <strong>YES-instance</strong> if \\(L(x) = 1\\), and a <strong>NO-instance</strong> otherwise. We identify \\(L\\) with the set of YES-instances: \\(L = \\{x \\in \\{0,1\\}^* : L(x) = 1\\}\\).</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 20.2 (Class P)</div>
<div class="env-body">
<p>\\(\\mathbf{P}\\) is the class of decision problems solvable by a deterministic Turing machine in time \\(O(n^k)\\) for some constant \\(k\\), where \\(n = |x|\\) is the input size.</p>
<p>Informally: problems that can be <em>solved efficiently</em>.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 20.3 (Class NP)</div>
<div class="env-body">
<p>\\(\\mathbf{NP}\\) is the class of decision problems for which YES-instances have a polynomial-length <strong>certificate</strong> (witness) that can be <strong>verified</strong> in polynomial time.</p>
<p>Formally, \\(L \\in \\mathbf{NP}\\) iff there exists a polynomial-time verifier \\(V\\) and polynomial \\(p\\) such that:</p>
$$x \\in L \\iff \\exists\\, c \\in \\{0,1\\}^{p(|x|)} \\text{ such that } V(x, c) = 1.$$
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 20.4 (Class co-NP)</div>
<div class="env-body">
<p>\\(\\mathbf{co\\text{-}NP}\\) is the class of problems whose <em>complement</em> is in NP. That is, \\(L \\in \\mathbf{co\\text{-}NP}\\) iff NO-instances have efficiently verifiable certificates.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch20-viz-classes"></div>

<div class="env-block example">
<div class="env-title">Examples</div>
<div class="env-body">
<ul>
  <li><strong>SHORTEST-PATH</strong> \\(\\in\\) P: Given \\(G, s, t, k\\), is there an \\(s\\)-\\(t\\) path of length \\(\\leq k\\)? Dijkstra solves it in polynomial time.</li>
  <li><strong>HAMILTONIAN-CYCLE</strong> \\(\\in\\) NP: Given \\(G\\), does it contain a Hamiltonian cycle? Certificate: the cycle itself. Verification: check it visits every vertex exactly once. No polynomial-time algorithm known.</li>
  <li><strong>PRIMES</strong> \\(\\in\\) P \\(\\cap\\) co-NP: "Is \\(n\\) prime?" was shown to be in P by Agrawal-Kayal-Saxena (2002).</li>
  <li><strong>COMPOSITE</strong>: Certificate for YES = a nontrivial factor. So COMPOSITE \\(\\in\\) NP. Since COMPOSITE = complement of PRIMES, PRIMES \\(\\in\\) co-NP.</li>
</ul>
</div>
</div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body">
<p>Clearly \\(\\mathbf{P} \\subseteq \\mathbf{NP}\\) and \\(\\mathbf{P} \\subseteq \\mathbf{co\\text{-}NP}\\). Whether \\(\\mathbf{P} = \\mathbf{NP}\\) or \\(\\mathbf{NP} = \\mathbf{co\\text{-}NP}\\) remains open.</p>
</div>
</div>
`,
            visualizations: [
                {
                    id: 'ch20-viz-classes',
                    title: 'Complexity Class Diagram',
                    description: 'Interactive Venn diagram of P, NP, co-NP, and NP-complete. Click classes to highlight and see example problems.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450});
                        var highlighted = 'none';
                        var classes = [
                            {name: 'NP', cx: 280, cy: 220, rx: 220, ry: 180, color: 'rgba(88,166,255,0.12)', stroke: '#58a6ff'},
                            {name: 'co-NP', cx: 420, cy: 220, rx: 220, ry: 180, color: 'rgba(188,140,255,0.12)', stroke: '#bc8cff'},
                            {name: 'P', cx: 350, cy: 260, rx: 100, ry: 80, color: 'rgba(63,185,80,0.15)', stroke: '#3fb950'},
                            {name: 'NP-complete', cx: 180, cy: 180, rx: 70, ry: 40, color: 'rgba(248,81,73,0.15)', stroke: '#f85149'}
                        ];
                        var problems = [
                            {name: 'SHORTEST-PATH', x: 350, y: 290, cls: 'P'},
                            {name: 'SORTING', x: 350, y: 260, cls: 'P'},
                            {name: 'MST', x: 350, y: 230, cls: 'P'},
                            {name: 'SAT', x: 180, y: 180, cls: 'NP-complete'},
                            {name: 'CLIQUE', x: 180, y: 200, cls: 'NP-complete'},
                            {name: 'HAM-CYCLE', x: 140, y: 160, cls: 'NP-complete'},
                            {name: 'FACTORING', x: 350, y: 140, cls: 'NP inter co-NP'},
                            {name: 'PRIMES', x: 350, y: 310, cls: 'P'}
                        ];

                        function draw() {
                            viz.clear();
                            viz.screenText('Complexity Classes (conjectured relationship)', 350, 20, viz.colors.text, 13);

                            var ctx = viz.ctx;
                            classes.forEach(function(c) {
                                var active = highlighted === c.name || highlighted === 'none';
                                ctx.fillStyle = active ? c.color : 'rgba(30,30,60,0.3)';
                                ctx.beginPath();
                                ctx.ellipse(c.cx, c.cy, c.rx, c.ry, 0, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.strokeStyle = active ? c.stroke : '#333';
                                ctx.lineWidth = active ? 2 : 1;
                                ctx.stroke();
                            });

                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillStyle = viz.colors.blue; ctx.fillText('NP', 120, 100);
                            ctx.fillStyle = viz.colors.purple; ctx.fillText('co-NP', 580, 100);
                            ctx.fillStyle = viz.colors.green; ctx.fillText('P', 350, 340);
                            ctx.fillStyle = viz.colors.red; ctx.fillText('NP-complete', 180, 140);

                            problems.forEach(function(p) {
                                ctx.fillStyle = highlighted === 'none' || highlighted === p.cls ? viz.colors.yellow : '#444';
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(p.name, p.x, p.y);
                            });

                            if (highlighted !== 'none') {
                                var desc = {
                                    'P': 'P: Solvable in polynomial time. Contained in both NP and co-NP.',
                                    'NP': 'NP: YES-instances have polynomial certificates verifiable in poly time.',
                                    'co-NP': 'co-NP: NO-instances have polynomial certificates. Complement of NP.',
                                    'NP-complete': 'NP-complete: Hardest problems in NP. If any is in P, then P = NP.'
                                };
                                viz.screenText(desc[highlighted] || '', 350, 430, viz.colors.white, 11);
                            }
                        }

                        VizEngine.createButton(controls, 'All', function() { highlighted = 'none'; draw(); });
                        VizEngine.createButton(controls, 'P', function() { highlighted = 'P'; draw(); });
                        VizEngine.createButton(controls, 'NP', function() { highlighted = 'NP'; draw(); });
                        VizEngine.createButton(controls, 'co-NP', function() { highlighted = 'co-NP'; draw(); });
                        VizEngine.createButton(controls, 'NP-complete', function() { highlighted = 'NP-complete'; draw(); });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Explain why \\(\\mathbf{P} \\subseteq \\mathbf{NP}\\). Is the converse known to be true?',
                    hint: 'If you can solve a problem in polynomial time, can you verify a certificate in polynomial time?',
                    solution: 'If \\(L \\in \\mathbf{P}\\), then a polynomial-time algorithm can decide \\(L\\) directly, so we can verify any certificate by simply ignoring it and solving the problem. Hence \\(L \\in \\mathbf{NP}\\). The converse (\\(\\mathbf{NP} \\subseteq \\mathbf{P}\\)) is the famous open P vs NP question. It is widely conjectured that \\(\\mathbf{P} \\neq \\mathbf{NP}\\).'
                },
                {
                    question: 'Show that if \\(\\mathbf{P} = \\mathbf{NP}\\), then \\(\\mathbf{NP} = \\mathbf{co\\text{-}NP}\\).',
                    hint: 'P is closed under complementation.',
                    solution: 'If \\(\\mathbf{P} = \\mathbf{NP}\\), then for any \\(L \\in \\mathbf{NP}\\), \\(L \\in \\mathbf{P}\\). Since \\(\\mathbf{P}\\) is closed under complementation (if a deterministic poly-time TM decides \\(L\\), flip its answer to decide \\(\\bar{L}\\)), \\(\\bar{L} \\in \\mathbf{P} = \\mathbf{NP}\\), so \\(L \\in \\mathbf{co\\text{-}NP}\\). Hence \\(\\mathbf{NP} \\subseteq \\mathbf{co\\text{-}NP}\\). By symmetry, \\(\\mathbf{co\\text{-}NP} \\subseteq \\mathbf{NP}\\).'
                },
                {
                    question: 'Is GRAPH-ISOMORPHISM known to be NP-complete? What is its status?',
                    hint: 'Think about where it lies between P and NP-complete.',
                    solution: 'GRAPH-ISOMORPHISM is in NP (certificate: the isomorphism mapping). It is NOT known to be NP-complete. In fact, Babai (2015) showed it can be solved in quasi-polynomial time \\(2^{O((\\log n)^c)}\\). It is believed to be neither in P nor NP-complete, making it one of the few natural problems suspected to be of intermediate difficulty (NP-intermediate, which would exist if P is not equal to NP by Ladner\'s theorem).'
                }
            ]
        },

        /* ============================================================
           Section 2: Polynomial Reductions
           ============================================================ */
        {
            id: 'ch20-sec02',
            title: 'Polynomial Reductions',
            content: `
<h2>Polynomial Reductions</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Polynomial reductions allow us to show that one problem is "at least as hard as" another. If we can reduce problem A to problem B in polynomial time, then a polynomial algorithm for B would give one for A as well. This is the mechanism for proving NP-hardness.</p></div></div>


<p>Reductions are the fundamental tool for comparing the computational difficulty of problems. If we can transform one problem into another efficiently, then solving the second also solves the first.</p>

<div class="env-block definition">
<div class="env-title">Definition 20.5 (Polynomial-Time Reduction)</div>
<div class="env-body">
<p>Language \\(A\\) is <strong>polynomial-time reducible</strong> to language \\(B\\), written \\(A \\leq_p B\\), if there exists a polynomial-time computable function \\(f : \\{0,1\\}^* \\to \\{0,1\\}^*\\) such that for all \\(x\\):</p>
$$x \\in A \\iff f(x) \\in B.$$
<p>We call \\(f\\) a <strong>polynomial-time reduction</strong> (or Karp reduction).</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Lemma 20.1</div>
<div class="env-body">
<p>If \\(A \\leq_p B\\) and \\(B \\in \\mathbf{P}\\), then \\(A \\in \\mathbf{P}\\).</p>
<p>Equivalently: if \\(A \\leq_p B\\) and \\(A \\notin \\mathbf{P}\\), then \\(B \\notin \\mathbf{P}\\).</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof</div>
<div class="env-body">
<p>Given \\(x\\), compute \\(f(x)\\) in polynomial time, then run the polynomial-time algorithm for \\(B\\) on \\(f(x)\\). The composition is polynomial. \\(\\square\\)</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 20.6 (NP-Hard, NP-Complete)</div>
<div class="env-body">
<p>A problem \\(B\\) is:</p>
<ul>
  <li><strong>NP-hard</strong> if every problem in NP reduces to \\(B\\): \\(\\forall A \\in \\mathbf{NP},\\; A \\leq_p B\\).</li>
  <li><strong>NP-complete</strong> if \\(B\\) is NP-hard <em>and</em> \\(B \\in \\mathbf{NP}\\).</li>
</ul>
</div>
</div>

<div class="viz-placeholder" data-viz="ch20-viz-reduction-chain"></div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body">
<p>Think of a reduction \\(A \\leq_p B\\) as saying "\\(B\\) is at least as hard as \\(A\\)." If \\(B\\) is NP-complete, it is among the "hardest" problems in NP — solving any one NP-complete problem in polynomial time would mean \\(\\mathbf{P} = \\mathbf{NP}\\).</p>
</div>
</div>

<h3>How to Prove NP-Completeness</h3>

<ol>
  <li>Show \\(B \\in \\mathbf{NP}\\) (exhibit a polynomial certificate and verifier).</li>
  <li>Pick a known NP-complete problem \\(A\\) and show \\(A \\leq_p B\\).</li>
</ol>

<p>By transitivity of \\(\\leq_p\\), this establishes that <em>every</em> problem in NP reduces to \\(B\\).</p>

<div class="viz-placeholder" data-viz="ch20-viz-cert-verifier"></div>
`,
            visualizations: [
                {
                    id: 'ch20-viz-reduction-chain',
                    title: 'Reduction Chain Visualizer',
                    description: 'See how NP-completeness proofs chain: SAT -> 3-SAT -> CLIQUE -> VERTEX-COVER -> ...',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var chain = [
                            {name: 'CIRCUIT-SAT', x: 350, y: 50, desc: 'First NP-complete (Cook-Levin)'},
                            {name: 'SAT', x: 350, y: 120, desc: 'Boolean satisfiability'},
                            {name: '3-SAT', x: 200, y: 200, desc: 'SAT with 3 literals per clause'},
                            {name: 'CLIQUE', x: 80, y: 290, desc: 'Find a clique of size k'},
                            {name: 'VERTEX-COVER', x: 200, y: 370, desc: 'Cover all edges with k vertices'},
                            {name: 'INDEPENDENT-SET', x: 80, y: 370, desc: 'Find k independent vertices'},
                            {name: 'SUBSET-SUM', x: 500, y: 200, desc: 'Subset summing to target'},
                            {name: 'HAM-CYCLE', x: 500, y: 290, desc: 'Hamiltonian cycle in graph'},
                            {name: 'TSP', x: 620, y: 370, desc: 'Shortest tour visiting all cities'},
                            {name: 'SET-COVER', x: 350, y: 370, desc: 'Cover universe with k sets'}
                        ];
                        var reductions = [
                            {from: 0, to: 1}, {from: 1, to: 2}, {from: 2, to: 3},
                            {from: 3, to: 4}, {from: 3, to: 5}, {from: 1, to: 6},
                            {from: 2, to: 7}, {from: 7, to: 8}, {from: 2, to: 9}
                        ];
                        var selectedNode = -1;

                        function draw() {
                            viz.clear();
                            viz.screenText('NP-Completeness Reduction Chain', 350, 20, viz.colors.white, 14);

                            reductions.forEach(function(r) {
                                var from = chain[r.from], to = chain[r.to];
                                var dx = to.x - from.x, dy = to.y - from.y;
                                var len = Math.sqrt(dx * dx + dy * dy);
                                var ux = dx / len, uy = dy / len;
                                viz.drawEdge(from.x + ux * 20, from.y + uy * 14, to.x - ux * 20, to.y - uy * 14, viz.colors.orange, true, '', 1.5);
                            });

                            chain.forEach(function(c, i) {
                                var active = selectedNode === i;
                                var col = i === 0 ? viz.colors.red : viz.colors.blue;
                                if (active) col = viz.colors.yellow;
                                var ctx = viz.ctx;
                                ctx.fillStyle = active ? 'rgba(210,153,34,0.2)' : (col + '22');
                                var w = ctx.measureText(c.name).width;
                                var bw = Math.max(w + 20, 80), bh = 24;
                                ctx.fillStyle = active ? 'rgba(210,153,34,0.2)' : (col + '22');
                                ctx.fillRect(c.x - bw / 2, c.y - bh / 2, bw, bh);
                                ctx.strokeStyle = active ? viz.colors.yellow : col;
                                ctx.lineWidth = active ? 2 : 1;
                                ctx.strokeRect(c.x - bw / 2, c.y - bh / 2, bw, bh);
                                ctx.fillStyle = active ? viz.colors.yellow : viz.colors.white;
                                ctx.font = (active ? 'bold ' : '') + '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(c.name, c.x, c.y);
                            });

                            if (selectedNode >= 0) {
                                viz.screenText(chain[selectedNode].name + ': ' + chain[selectedNode].desc, 350, 410, viz.colors.yellow, 12);
                            }
                            viz.screenText('Arrow A -> B means A reduces to B (A is at most as hard as B)', 350, 395, viz.colors.text, 10);
                        }

                        viz.canvas.addEventListener('click', function(evt) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = evt.clientX - rect.left, my = evt.clientY - rect.top;
                            selectedNode = -1;
                            chain.forEach(function(c, i) {
                                if (Math.abs(mx - c.x) < 50 && Math.abs(my - c.y) < 16) selectedNode = i;
                            });
                            draw();
                        });

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'ch20-viz-cert-verifier',
                    title: 'NP Certificate Verifier',
                    description: 'Provide a certificate for a CLIQUE or HAM-CYCLE instance and watch verification in action.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var problem = 'CLIQUE';
                        var nodes = [
                            {x: 150, y: 100}, {x: 300, y: 80}, {x: 400, y: 150},
                            {x: 350, y: 280}, {x: 200, y: 300}, {x: 100, y: 200}
                        ];
                        var graphEdges = [
                            [0,1],[0,5],[1,2],[1,5],[2,3],[2,4],[3,4],[4,5],[0,4],[1,3]
                        ];
                        var k = 3;
                        var certificate = [0, 1, 5];
                        var verifyResult = null;

                        function draw() {
                            viz.clear();
                            viz.screenText('NP Certificate Verifier: ' + problem + ' (k=' + k + ')', 350, 20, viz.colors.white, 14);

                            graphEdges.forEach(function(e) {
                                var u = nodes[e[0]], v = nodes[e[1]];
                                var bothInCert = certificate.indexOf(e[0]) >= 0 && certificate.indexOf(e[1]) >= 0;
                                viz.drawEdge(u.x, u.y, v.x, v.y, bothInCert ? viz.colors.yellow : viz.colors.axis, false, '', bothInCert ? 2.5 : 1);
                            });

                            nodes.forEach(function(n, i) {
                                var inCert = certificate.indexOf(i) >= 0;
                                viz.drawNode(n.x, n.y, 18, i.toString(), inCert ? viz.colors.yellow : viz.colors.blue, viz.colors.white);
                            });

                            viz.screenText('Certificate: {' + certificate.join(', ') + '}', 530, 100, viz.colors.teal, 12);

                            if (verifyResult !== null) {
                                var msg = verifyResult ? 'VERIFIED: Certificate is valid!' : 'REJECTED: Not a valid ' + k + '-clique';
                                var col = verifyResult ? viz.colors.green : viz.colors.red;
                                viz.screenText(msg, 350, 370, col, 14);
                            }
                        }

                        function verify() {
                            if (certificate.length !== k) { verifyResult = false; return; }
                            for (var i = 0; i < certificate.length; i++) {
                                for (var j = i + 1; j < certificate.length; j++) {
                                    var a = certificate[i], b = certificate[j];
                                    var hasEdge = graphEdges.some(function(e) {
                                        return (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a);
                                    });
                                    if (!hasEdge) { verifyResult = false; return; }
                                }
                            }
                            verifyResult = true;
                        }

                        VizEngine.createButton(controls, 'Verify', function() { verify(); draw(); });
                        VizEngine.createButton(controls, 'Cert: {0,1,5}', function() { certificate = [0,1,5]; verifyResult = null; draw(); });
                        VizEngine.createButton(controls, 'Cert: {1,2,3}', function() { certificate = [1,2,3]; verifyResult = null; draw(); });
                        VizEngine.createButton(controls, 'Cert: {2,3,4}', function() { certificate = [2,3,4]; verifyResult = null; draw(); });
                        VizEngine.createButton(controls, 'Cert: {0,1,4,5}', function() { certificate = [0,1,4,5]; k = 4; verifyResult = null; draw(); });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that \\(\\leq_p\\) is transitive: if \\(A \\leq_p B\\) and \\(B \\leq_p C\\), then \\(A \\leq_p C\\).',
                    hint: 'Compose the two reduction functions.',
                    solution: 'Let \\(f\\) reduce \\(A\\) to \\(B\\) and \\(g\\) reduce \\(B\\) to \\(C\\). Define \\(h(x) = g(f(x))\\). Then \\(x \\in A \\iff f(x) \\in B \\iff g(f(x)) \\in C\\), so \\(h\\) reduces \\(A\\) to \\(C\\). Since \\(|f(x)|\\) is polynomial in \\(|x|\\) (poly-time computation produces poly-size output), \\(g(f(x))\\) runs in polynomial time in \\(|x|\\). So \\(h\\) is a polynomial-time reduction.'
                },
                {
                    question: 'Prove that INDEPENDENT-SET \\(\\leq_p\\) CLIQUE.',
                    hint: 'Use the complement graph.',
                    solution: 'Given graph \\(G = (V, E)\\) and integer \\(k\\), construct complement graph \\(\\bar{G} = (V, \\bar{E})\\) where \\((u,v) \\in \\bar{E}\\) iff \\((u,v) \\notin E\\). Then \\(S\\) is an independent set of size \\(k\\) in \\(G\\) iff \\(S\\) is a clique of size \\(k\\) in \\(\\bar{G}\\). The reduction \\(f(G, k) = (\\bar{G}, k)\\) is computable in \\(O(|V|^2)\\) time.'
                },
                {
                    question: 'Why is it important that a reduction runs in polynomial time? What would happen if we allowed exponential-time reductions?',
                    hint: 'Think about what classes would collapse.',
                    solution: 'Polynomial-time reductions preserve the distinction between P and NP. If we allowed exponential-time reductions, we could solve any problem during the reduction itself: compute the answer in exponential time, then output a fixed YES or NO instance of the target problem. This would make every decidable problem reducible to every other, destroying all useful complexity distinctions.'
                }
            ]
        },

        /* ============================================================
           Section 3: Cook-Levin Theorem
           ============================================================ */
        {
            id: 'ch20-sec03',
            title: 'Cook-Levin Theorem',
            content: `
<h2>Cook-Levin Theorem</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>The Cook-Levin theorem proves that SAT (Boolean satisfiability) is NP-complete: it is in NP, and every NP problem reduces to it. This establishes the first NP-complete problem, from which all others follow by chains of reductions.</p></div></div>


<p>The foundation of NP-completeness theory is the remarkable theorem of Cook (1971) and Levin (1973), which established the first NP-complete problem.</p>

<div class="env-block definition">
<div class="env-title">Definition 20.7 (SAT)</div>
<div class="env-body">
<p><strong>SAT</strong> (Boolean Satisfiability): Given a Boolean formula \\(\\phi\\) in conjunctive normal form (CNF), is there a truth assignment to the variables that makes \\(\\phi\\) true?</p>
<p>A CNF formula is a conjunction of <strong>clauses</strong>, where each clause is a disjunction of <strong>literals</strong> (variables or their negations):</p>
$$\\phi = (x_1 \\vee \\overline{x_2} \\vee x_3) \\wedge (\\overline{x_1} \\vee x_2) \\wedge (x_2 \\vee \\overline{x_3}).$$
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 20.1 (Cook-Levin)</div>
<div class="env-body">
<p><strong>SAT is NP-complete.</strong></p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof Sketch</div>
<div class="env-body">
<p><strong>SAT \\(\\in\\) NP:</strong> Certificate = truth assignment. Verify by evaluating \\(\\phi\\) in linear time.</p>
<p><strong>SAT is NP-hard:</strong> For any \\(L \\in \\mathbf{NP}\\) with verifier \\(V\\), we encode the computation of \\(V(x, c)\\) as a Boolean formula:</p>
<ol>
  <li>Express the Turing machine's computation tableau as Boolean variables: one variable per cell per timestep.</li>
  <li>Encode start configuration, transition rules, and acceptance condition as CNF clauses.</li>
  <li>The formula is satisfiable iff there exists a certificate \\(c\\) such that \\(V\\) accepts.</li>
  <li>The construction is polynomial in the running time of \\(V\\), hence polynomial in \\(|x|\\).</li>
</ol>
</div>
</div>

<div class="viz-placeholder" data-viz="ch20-viz-sat-builder"></div>

<h3>3-SAT</h3>

<div class="env-block definition">
<div class="env-title">Definition 20.8 (3-SAT)</div>
<div class="env-body">
<p><strong>3-SAT</strong> is SAT restricted to formulas where each clause has <em>exactly 3 literals</em>.</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 20.2</div>
<div class="env-body">
<p><strong>3-SAT is NP-complete.</strong> (Proved by reducing SAT to 3-SAT using auxiliary variables to split long clauses.)</p>
</div>
</div>

<p>The reduction from SAT to 3-SAT works by replacing each clause \\((l_1 \\vee l_2 \\vee \\cdots \\vee l_k)\\) with \\(k > 3\\) by introducing fresh variables \\(y_1, \\ldots, y_{k-3}\\) and creating clauses:</p>
$$(l_1 \\vee l_2 \\vee y_1) \\wedge (\\overline{y_1} \\vee l_3 \\vee y_2) \\wedge \\cdots \\wedge (\\overline{y_{k-3}} \\vee l_{k-1} \\vee l_k).$$

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body">
<p><strong>2-SAT</strong> is in P! It can be solved in linear time using implication graphs and SCC. The jump from 2 to 3 literals per clause is where intractability begins.</p>
</div>
</div>
`,
            visualizations: [
                {
                    id: 'ch20-viz-sat-builder',
                    title: 'SAT Instance Builder & Solver',
                    description: 'Build a CNF formula by setting variable assignments and check if the formula is satisfiable.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 430});
                        var numVars = 4;
                        var assignment = [true, false, true, false];
                        var clauses = [
                            [1, -2, 3],
                            [-1, 2, -4],
                            [2, 3, 4],
                            [-1, -3, 4],
                            [1, -2, -3]
                        ];

                        function evalClause(clause, assign) {
                            return clause.some(function(lit) {
                                var v = Math.abs(lit) - 1;
                                return lit > 0 ? assign[v] : !assign[v];
                            });
                        }

                        function evalFormula() {
                            return clauses.every(function(c) { return evalClause(c, assignment); });
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('SAT Instance: Evaluate assignment on CNF formula', 350, 20, viz.colors.white, 13);

                            var startX = 80;
                            for (var i = 0; i < numVars; i++) {
                                var val = assignment[i] ? 'T' : 'F';
                                var col = assignment[i] ? viz.colors.green : viz.colors.red;
                                viz.drawNode(startX + i * 80, 70, 20, 'x' + (i + 1), col, viz.colors.white);
                                viz.screenText(val, startX + i * 80, 100, col, 12);
                            }

                            viz.screenText('Click variables to toggle. Clauses:', 550, 70, viz.colors.text, 11);

                            clauses.forEach(function(clause, ci) {
                                var y = 150 + ci * 50;
                                var clauseStr = '(';
                                clause.forEach(function(lit, li) {
                                    if (li > 0) clauseStr += ' v ';
                                    var v = Math.abs(lit);
                                    clauseStr += (lit < 0 ? '~' : '') + 'x' + v;
                                });
                                clauseStr += ')';
                                var sat = evalClause(clause, assignment);
                                viz.screenText('C' + (ci + 1) + ': ' + clauseStr, 200, y, viz.colors.white, 13);
                                viz.screenText(sat ? 'TRUE' : 'FALSE', 500, y, sat ? viz.colors.green : viz.colors.red, 13, 'left');

                                clause.forEach(function(lit, li) {
                                    var v = Math.abs(lit) - 1;
                                    var litVal = lit > 0 ? assignment[v] : !assignment[v];
                                    var cx = 560 + li * 40;
                                    viz.drawNode(cx, y, 10, (lit < 0 ? '~' : '') + 'x' + (v + 1), litVal ? viz.colors.green : viz.colors.red, viz.colors.white);
                                });
                            });

                            var allSat = evalFormula();
                            viz.screenText(allSat ? 'SATISFIABLE' : 'NOT SATISFIED (try flipping variables)', 350, 420, allSat ? viz.colors.green : viz.colors.red, 15);
                        }

                        viz.canvas.addEventListener('click', function(evt) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = evt.clientX - rect.left, my = evt.clientY - rect.top;
                            for (var i = 0; i < numVars; i++) {
                                var dx = mx - (80 + i * 80), dy = my - 70;
                                if (dx * dx + dy * dy < 500) {
                                    assignment[i] = !assignment[i];
                                    draw();
                                    return;
                                }
                            }
                        });

                        VizEngine.createButton(controls, 'Brute Force Solve', function() {
                            for (var mask = 0; mask < (1 << numVars); mask++) {
                                var a = [];
                                for (var j = 0; j < numVars; j++) a.push(Boolean(mask & (1 << j)));
                                if (clauses.every(function(c) { return evalClause(c, a); })) {
                                    assignment = a;
                                    draw();
                                    return;
                                }
                            }
                            draw();
                            viz.screenText('UNSATISFIABLE!', 350, 400, viz.colors.red, 16);
                        });
                        VizEngine.createButton(controls, 'Random Assignment', function() {
                            assignment = [];
                            for (var i = 0; i < numVars; i++) assignment.push(Math.random() > 0.5);
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Why is SAT in NP? What is the certificate and how long does verification take?',
                    hint: 'The certificate is a truth assignment to all variables.',
                    solution: 'Certificate: a truth assignment \\(a : \\{x_1, \\ldots, x_n\\} \\to \\{T, F\\}\\). This has size \\(n\\) (polynomial). Verification: substitute the assignment into each clause and check all clauses are satisfied. This takes \\(O(m \\cdot k)\\) time where \\(m\\) is the number of clauses and \\(k\\) is the max clause length, which is polynomial in the formula size.'
                },
                {
                    question: 'Reduce the 5-literal clause \\((x_1 \\vee x_2 \\vee x_3 \\vee x_4 \\vee x_5)\\) to 3-SAT.',
                    hint: 'Introduce auxiliary variables to split the clause.',
                    solution: 'Introduce fresh variables \\(y_1, y_2\\). Replace with: \\((x_1 \\vee x_2 \\vee y_1) \\wedge (\\overline{y_1} \\vee x_3 \\vee y_2) \\wedge (\\overline{y_2} \\vee x_4 \\vee x_5)\\). The original clause is satisfiable iff the new set of clauses is satisfiable (with appropriate \\(y\\) values).'
                },
                {
                    question: 'Explain why 2-SAT is in P while 3-SAT is NP-complete.',
                    hint: 'Consider the implication graph structure of 2-SAT.',
                    solution: '2-SAT has a special structure: each clause \\((a \\vee b)\\) is equivalent to implications \\(\\overline{a} \\Rightarrow b\\) and \\(\\overline{b} \\Rightarrow a\\). Build an implication graph and find SCCs. The formula is satisfiable iff no variable and its negation are in the same SCC. This takes \\(O(n + m)\\) time. 3-SAT lacks this implication structure; the extra literal per clause creates exponentially many possible satisfying assignments to consider, and no polynomial shortcut is known.'
                }
            ]
        },

        /* ============================================================
           Section 4: Classic NP-Complete Problems
           ============================================================ */
        {
            id: 'ch20-sec04',
            title: 'Classic NP-Complete Problems',
            content: `
<h2>Classic NP-Complete Problems</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>From SAT, we build a web of NP-complete problems by reduction: 3-SAT, CLIQUE, VERTEX COVER, INDEPENDENT SET, SUBSET SUM, HAMILTONIAN CYCLE, and more. Each reduction illuminates a structural connection between seemingly different problems.</p></div></div>


<p>Starting from SAT and 3-SAT, a rich web of NP-complete problems has been established through reductions. Here are the most important ones.</p>

<h3>Graph Problems</h3>

<div class="env-block definition">
<div class="env-title">CLIQUE</div>
<div class="env-body">
<p><strong>Input:</strong> Graph \\(G = (V, E)\\), integer \\(k\\).</p>
<p><strong>Question:</strong> Does \\(G\\) contain a clique (complete subgraph) of size \\(\\geq k\\)?</p>
<p><strong>NP-completeness:</strong> 3-SAT \\(\\leq_p\\) CLIQUE.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">VERTEX-COVER</div>
<div class="env-body">
<p><strong>Input:</strong> Graph \\(G = (V, E)\\), integer \\(k\\).</p>
<p><strong>Question:</strong> Is there a set \\(S \\subseteq V\\) with \\(|S| \\leq k\\) such that every edge has at least one endpoint in \\(S\\)?</p>
<p><strong>NP-completeness:</strong> CLIQUE \\(\\leq_p\\) VERTEX-COVER (via complement graph: \\(S\\) is a clique of size \\(k\\) in \\(G\\) iff \\(V \\setminus S\\) is a vertex cover of size \\(n - k\\) in \\(\\bar{G}\\)).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch20-viz-3sat-clique"></div>

<h3>Subset & Number Problems</h3>

<div class="env-block definition">
<div class="env-title">SUBSET-SUM</div>
<div class="env-body">
<p><strong>Input:</strong> Integers \\(a_1, \\ldots, a_n\\) and target \\(W\\).</p>
<p><strong>Question:</strong> Is there \\(S \\subseteq \\{1, \\ldots, n\\}\\) with \\(\\sum_{i \\in S} a_i = W\\)?</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">PARTITION</div>
<div class="env-body">
<p><strong>Input:</strong> Integers \\(a_1, \\ldots, a_n\\).</p>
<p><strong>Question:</strong> Can \\(\\{1, \\ldots, n\\}\\) be partitioned into \\(S\\) and \\(\\bar{S}\\) with \\(\\sum_{i \\in S} a_i = \\sum_{i \\in \\bar{S}} a_i\\)?</p>
</div>
</div>

<h3>Hamiltonian Cycle and TSP</h3>

<div class="env-block definition">
<div class="env-title">HAMILTONIAN-CYCLE</div>
<div class="env-body">
<p><strong>Input:</strong> Graph \\(G\\).</p>
<p><strong>Question:</strong> Does \\(G\\) contain a cycle visiting every vertex exactly once?</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">TSP (Decision Version)</div>
<div class="env-body">
<p><strong>Input:</strong> Complete weighted graph, budget \\(B\\).</p>
<p><strong>Question:</strong> Is there a tour visiting all vertices with total weight \\(\\leq B\\)?</p>
<p>HAM-CYCLE \\(\\leq_p\\) TSP: Set weight 1 for existing edges, weight 2 for non-edges, budget \\(B = n\\).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch20-viz-np-gallery"></div>

<div class="env-block warning">
<div class="env-title">Common Misconception</div>
<div class="env-body">
<p>NP-complete does NOT mean "impossible to solve." It means no <em>polynomial-time</em> algorithm is known (and likely none exists). Many NP-complete problems can be solved exactly for small instances, or approximately for larger ones.</p>
</div>
</div>
`,
            visualizations: [
                {
                    id: 'ch20-viz-3sat-clique',
                    title: '3-SAT to CLIQUE Reduction',
                    description: 'See the classic reduction: each clause becomes a group, edges connect compatible literals.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450});
                        var clauses = [
                            [1, -2, 3],
                            [-1, 2, 3],
                            [1, 2, -3]
                        ];
                        var k = clauses.length;

                        function litStr(l) { return (l < 0 ? '~x' : 'x') + Math.abs(l); }
                        function compatible(l1, l2) { return l1 !== -l2; }

                        var nodePositions = [];
                        var cx = [180, 350, 520];
                        clauses.forEach(function(clause, ci) {
                            clause.forEach(function(lit, li) {
                                nodePositions.push({
                                    clause: ci, litIdx: li, lit: lit,
                                    x: cx[ci] + (li - 1) * 55,
                                    y: 150 + ci * 100
                                });
                            });
                        });

                        var clique = [];
                        var showClique = false;

                        function draw() {
                            viz.clear();
                            viz.screenText('3-SAT -> CLIQUE Reduction (k = ' + k + ')', 350, 20, viz.colors.white, 14);

                            clauses.forEach(function(clause, ci) {
                                viz.screenText('C' + (ci+1) + ': (' + clause.map(litStr).join(' v ') + ')', cx[ci], 100, viz.colors.text, 12);
                                var ctx = viz.ctx;
                                ctx.strokeStyle = viz.colors.axis + '44';
                                ctx.lineWidth = 1;
                                ctx.setLineDash([4, 4]);
                                ctx.strokeRect(cx[ci] - 85, 120 + ci * 100, 170, 50);
                                ctx.setLineDash([]);
                            });

                            for (var i = 0; i < nodePositions.length; i++) {
                                for (var j = i + 1; j < nodePositions.length; j++) {
                                    var ni = nodePositions[i], nj = nodePositions[j];
                                    if (ni.clause === nj.clause) continue;
                                    if (!compatible(ni.lit, nj.lit)) continue;
                                    var inClique = showClique && clique.indexOf(i) >= 0 && clique.indexOf(j) >= 0;
                                    viz.drawEdge(ni.x, ni.y, nj.x, nj.y, inClique ? viz.colors.yellow : viz.colors.axis + '44', false, '', inClique ? 2.5 : 0.8);
                                }
                            }

                            nodePositions.forEach(function(n, i) {
                                var inCl = showClique && clique.indexOf(i) >= 0;
                                viz.drawNode(n.x, n.y, 16, litStr(n.lit), inCl ? viz.colors.yellow : viz.colors.teal, viz.colors.white);
                            });

                            viz.screenText('Edges connect compatible literals from different clauses', 350, 420, viz.colors.text, 11);
                            if (showClique) {
                                viz.screenText('Clique of size ' + k + ' found -> SAT assignment exists!', 350, 440, viz.colors.green, 12);
                            }
                        }

                        VizEngine.createButton(controls, 'Find k-Clique', function() {
                            for (var a = 0; a < 3; a++) {
                                for (var b = 3; b < 6; b++) {
                                    for (var c = 6; c < 9; c++) {
                                        var na = nodePositions[a], nb = nodePositions[b], nc = nodePositions[c];
                                        if (compatible(na.lit, nb.lit) && compatible(na.lit, nc.lit) && compatible(nb.lit, nc.lit)) {
                                            clique = [a, b, c];
                                            showClique = true;
                                            draw();
                                            return;
                                        }
                                    }
                                }
                            }
                        });
                        VizEngine.createButton(controls, 'Reset', function() { showClique = false; clique = []; draw(); });

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'ch20-viz-np-gallery',
                    title: 'NP-Complete Problem Gallery',
                    description: 'Explore different NP-complete problems with small interactive instances.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var currentProblem = 'VERTEX-COVER';
                        var vcNodes = [
                            {x:150,y:100},{x:300,y:80},{x:450,y:120},
                            {x:130,y:250},{x:300,y:300},{x:470,y:260}
                        ];
                        var vcEdges = [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5],[0,4]];
                        var vcSelected = [false,false,false,false,false,false];

                        var ssNums = [3, 7, 1, 8, 4];
                        var ssTarget = 11;
                        var ssSel = [false,false,false,false,false];

                        function draw() {
                            viz.clear();
                            viz.screenText('NP-Complete Gallery: ' + currentProblem, 350, 20, viz.colors.white, 14);

                            if (currentProblem === 'VERTEX-COVER') {
                                vcEdges.forEach(function(e) {
                                    var u = vcNodes[e[0]], v = vcNodes[e[1]];
                                    var covered = vcSelected[e[0]] || vcSelected[e[1]];
                                    viz.drawEdge(u.x,u.y,v.x,v.y, covered ? viz.colors.green : viz.colors.red, false, '', covered ? 2 : 1.5);
                                });
                                vcNodes.forEach(function(n, i) {
                                    viz.drawNode(n.x,n.y,18,i.toString(), vcSelected[i]?viz.colors.yellow:viz.colors.blue, viz.colors.white);
                                });
                                var coverSize = vcSelected.filter(function(s){return s;}).length;
                                var allCovered = vcEdges.every(function(e){return vcSelected[e[0]]||vcSelected[e[1]];});
                                viz.screenText('Cover size: ' + coverSize + '    ' + (allCovered ? 'All edges covered!' : 'Some edges uncovered'), 350, 370, allCovered ? viz.colors.green : viz.colors.red, 13);
                                viz.screenText('Click vertices to add/remove from cover', 350, 395, viz.colors.text, 11);
                            } else if (currentProblem === 'SUBSET-SUM') {
                                viz.screenText('Target: ' + ssTarget, 350, 70, viz.colors.yellow, 16);
                                var sum = 0;
                                ssNums.forEach(function(n, i) {
                                    var x = 100 + i * 110;
                                    viz.drawNode(x, 180, 28, n.toString(), ssSel[i] ? viz.colors.green : viz.colors.blue, viz.colors.white);
                                    if (ssSel[i]) sum += n;
                                    viz.screenText(ssSel[i] ? 'IN' : 'OUT', x, 225, ssSel[i] ? viz.colors.green : viz.colors.text, 11);
                                });
                                viz.screenText('Current sum: ' + sum, 350, 290, sum === ssTarget ? viz.colors.green : viz.colors.orange, 16);
                                if (sum === ssTarget) viz.screenText('TARGET REACHED!', 350, 320, viz.colors.green, 14);
                                viz.screenText('Click numbers to toggle selection', 350, 395, viz.colors.text, 11);
                            }
                        }

                        viz.canvas.addEventListener('click', function(evt) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = evt.clientX - rect.left, my = evt.clientY - rect.top;
                            if (currentProblem === 'VERTEX-COVER') {
                                vcNodes.forEach(function(n, i) {
                                    if ((mx-n.x)*(mx-n.x)+(my-n.y)*(my-n.y) < 400) { vcSelected[i] = !vcSelected[i]; draw(); }
                                });
                            } else if (currentProblem === 'SUBSET-SUM') {
                                ssNums.forEach(function(n, i) {
                                    var x = 100 + i * 110;
                                    if ((mx-x)*(mx-x)+(my-180)*(my-180) < 900) { ssSel[i] = !ssSel[i]; draw(); }
                                });
                            }
                        });

                        VizEngine.createButton(controls, 'Vertex Cover', function() { currentProblem = 'VERTEX-COVER'; draw(); });
                        VizEngine.createButton(controls, 'Subset Sum', function() { currentProblem = 'SUBSET-SUM'; draw(); });
                        VizEngine.createButton(controls, 'Reset', function() {
                            vcSelected = [false,false,false,false,false,false];
                            ssSel = [false,false,false,false,false];
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that CLIQUE is NP-complete by reducing from 3-SAT.',
                    hint: 'For a formula with \\(k\\) clauses, create a node for each literal in each clause. Connect compatible literals from different clauses.',
                    solution: 'CLIQUE is in NP (certificate: the clique vertices, verify all pairs are edges in \\(O(k^2)\\)). Reduction from 3-SAT: Given formula \\(\\phi\\) with \\(k\\) clauses, create a graph \\(G\\) with a node for each literal occurrence. Connect two nodes iff (1) they are in different clauses and (2) they are not contradictory (\\(x_i\\) and \\(\\neg x_i\\)). Claim: \\(\\phi\\) is satisfiable iff \\(G\\) has a \\(k\\)-clique. Forward: a satisfying assignment picks one true literal per clause; these form a \\(k\\)-clique (all compatible). Backward: a \\(k\\)-clique contains one node per clause with no contradictions, giving a consistent truth assignment satisfying all clauses.'
                },
                {
                    question: 'Show VERTEX-COVER is NP-complete by reducing from INDEPENDENT-SET.',
                    hint: '\\(S\\) is an independent set iff \\(V \\setminus S\\) is a vertex cover.',
                    solution: 'VERTEX-COVER is in NP (certificate: the vertex cover \\(S\\), verify \\(|S| \\leq k\\) and every edge is covered). Reduction: Given (\\(G, k\\)) for INDEPENDENT-SET, output (\\(G, n - k\\)) for VERTEX-COVER. \\(S\\) is an independent set of size \\(\\geq k\\) iff \\(V \\setminus S\\) is a vertex cover of size \\(\\leq n - k\\). Proof: \\(S\\) independent means no edge has both endpoints in \\(S\\), so every edge has at least one endpoint in \\(V \\setminus S\\). Since INDEPENDENT-SET is NP-complete (reduces from CLIQUE via complement graph), VERTEX-COVER is NP-complete.'
                },
                {
                    question: 'Is the SHORTEST-PATH problem NP-complete? Justify your answer.',
                    hint: 'Can you solve it in polynomial time?',
                    solution: 'No, SHORTEST-PATH is in P. Dijkstra\'s algorithm solves it in \\(O((V + E) \\log V)\\) with a binary heap, and BFS solves the unweighted version in \\(O(V + E)\\). Since SHORTEST-PATH \\(\\in\\) P and we believe \\(\\mathbf{P} \\neq \\mathbf{NP}\\), it cannot be NP-complete (an NP-complete problem in P would imply P = NP).'
                },
                {
                    question: 'Reduce SUBSET-SUM to PARTITION.',
                    hint: 'Add a single extra element to force the partition to have a specific sum.',
                    solution: 'Given SUBSET-SUM instance \\((a_1, \\ldots, a_n, W)\\), let \\(T = \\sum a_i\\). Create PARTITION instance \\((a_1, \\ldots, a_n, T - 2W)\\) (if \\(T - 2W \\geq 0\\)) with total sum \\(2T - 2W\\). A partition into equal halves of sum \\(T - W\\) exists iff a subset summing to \\(W\\) exists. If \\(T < 2W\\), add element \\(2W - T\\) with total \\(2W\\), and partition into halves of \\(W\\).'
                }
            ]
        },

        /* ============================================================
           Section 5: Reduction Techniques & Practice
           ============================================================ */
        {
            id: 'ch20-sec05',
            title: 'Reduction Techniques & Practice',
            content: `
<h2>Reduction Techniques & Practice</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Proving a new problem NP-complete is a practical skill. This section presents reduction techniques (gadgets, local replacement, component design) and walks through several complete proofs, preparing you to recognize and prove NP-completeness in new settings.</p></div></div>


<p>Designing reductions is both an art and a science. Here we discuss common techniques and practice with several important reductions.</p>

<h3>Restriction Technique</h3>
<p>If a special case of problem \\(B\\) is already NP-complete, then \\(B\\) is NP-complete. For example:</p>
<ul>
  <li>3-COLORING is NP-complete (by reduction from 3-SAT).</li>
  <li>Since 3-COLORING is a special case of \\(k\\)-COLORING, \\(k\\)-COLORING is NP-complete for all \\(k \\geq 3\\).</li>
</ul>

<h3>Gadget-Based Reductions</h3>
<p>Many reductions use <strong>gadgets</strong> — small substructures that enforce specific behaviors:</p>
<ul>
  <li><strong>Variable gadgets:</strong> Components with exactly two states (true/false).</li>
  <li><strong>Clause gadgets:</strong> Components that are "satisfied" iff at least one connected variable is in the right state.</li>
  <li><strong>Connection gadgets:</strong> Wires that transmit information between components.</li>
</ul>

<div class="viz-placeholder" data-viz="ch20-viz-gadget"></div>

<h3>Reduction Strategy Summary</h3>

<div class="env-block algorithm">
<div class="env-title">How to Prove NP-Completeness</div>
<div class="env-body">
<ol>
  <li><strong>Choose source problem:</strong> Pick a known NP-complete problem \\(A\\) that "feels similar" to your target \\(B\\).</li>
  <li><strong>Design the reduction:</strong> For any instance \\(x\\) of \\(A\\), construct instance \\(f(x)\\) of \\(B\\) such that \\(x \\in A \\iff f(x) \\in B\\).</li>
  <li><strong>Prove correctness:</strong> Both directions of the iff.</li>
  <li><strong>Prove polynomial time:</strong> \\(f\\) is computable in \\(O(|x|^k)\\) time.</li>
  <li><strong>Prove \\(B \\in \\mathbf{NP}\\):</strong> Exhibit certificate and polynomial-time verifier.</li>
</ol>
</div>
</div>

<h3>The NP-Completeness Web</h3>

<div class="viz-placeholder" data-viz="ch20-viz-web"></div>

<div class="env-block remark">
<div class="env-title">Remark: Garey & Johnson Catalog</div>
<div class="env-body">
<p>The classic reference "Computers and Intractability" by Garey and Johnson (1979) catalogs over 300 NP-complete problems. The NP-completeness compendium continues to grow, with new problems regularly shown to be NP-complete.</p>
</div>
</div>

<h3>What If Your Problem Is NP-Complete?</h3>
<ol>
  <li><strong>Approximation algorithms:</strong> Find solutions within a guaranteed factor of optimal (Ch 21).</li>
  <li><strong>Parameterized complexity:</strong> If a parameter \\(k\\) is small, \\(O(f(k) \\cdot n^c)\\) may be tractable.</li>
  <li><strong>Heuristics:</strong> SAT solvers, branch-and-bound, local search — often work well in practice.</li>
  <li><strong>Special cases:</strong> Many NP-complete problems become polynomial on restricted inputs (e.g., 2-SAT, planar graphs).</li>
</ol>

<div class="env-block bridge"><div class="env-title">Looking Ahead</div><div class="env-body"><p>NP-completeness tells us that exact polynomial-time solutions are unlikely. But we still need to solve these problems in practice. Chapter 21 explores two strategies for coping: approximation algorithms that guarantee near-optimal solutions in polynomial time, and randomized algorithms that use probabilistic techniques to solve or approximate hard problems efficiently.</p></div></div>`,
            visualizations: [
                {
                    id: 'ch20-viz-gadget',
                    title: 'Reduction Gadgets',
                    description: 'Explore variable and clause gadgets used in NP-completeness reductions.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var gadgetType = 'variable';
                        var varState = true;

                        function draw() {
                            viz.clear();
                            if (gadgetType === 'variable') {
                                viz.screenText('Variable Gadget for 3-COLORING Reduction', 350, 20, viz.colors.white, 14);
                                viz.screenText('A triangle forces the 3 vertices to have 3 different colors.', 350, 50, viz.colors.text, 11);
                                viz.screenText('TRUE and FALSE vertices represent the variable states.', 350, 70, viz.colors.text, 11);

                                var trueCol = varState ? viz.colors.green : viz.colors.red;
                                var falseCol = varState ? viz.colors.red : viz.colors.green;
                                var baseCol = viz.colors.blue;

                                viz.drawEdge(250, 200, 450, 200, viz.colors.axis, false, '', 2);
                                viz.drawEdge(250, 200, 350, 120, viz.colors.axis, false, '', 2);
                                viz.drawEdge(450, 200, 350, 120, viz.colors.axis, false, '', 2);

                                viz.drawNode(250, 200, 22, 'T', trueCol, viz.colors.white);
                                viz.drawNode(450, 200, 22, 'F', falseCol, viz.colors.white);
                                viz.drawNode(350, 120, 22, 'B', baseCol, viz.colors.white);

                                viz.screenText('T = ' + (varState ? 'GREEN' : 'RED') + '   F = ' + (varState ? 'RED' : 'GREEN'), 350, 260, viz.colors.text, 12);
                                viz.screenText('Variable x = ' + (varState ? 'TRUE' : 'FALSE'), 350, 290, viz.colors.yellow, 14);
                                viz.screenText('Click to toggle variable state', 350, 380, viz.colors.text, 11);
                            } else {
                                viz.screenText('Clause Gadget (OR of 3 literals)', 350, 20, viz.colors.white, 14);
                                viz.screenText('The clause gadget can be properly colored iff >= 1 input is TRUE (green).', 350, 50, viz.colors.text, 11);

                                var inputs = [viz.colors.green, viz.colors.red, viz.colors.green];
                                var labels = ['x1', '~x2', 'x3'];
                                for (var i = 0; i < 3; i++) {
                                    viz.drawNode(150 + i * 150, 130, 18, labels[i], inputs[i], viz.colors.white);
                                    viz.drawEdge(150 + i * 150, 148, 350, 230, viz.colors.axis, false, '', 1.5);
                                }

                                var clauseSat = inputs.some(function(c) { return c === viz.colors.green; });
                                viz.drawNode(350, 250, 24, 'OR', clauseSat ? viz.colors.green : viz.colors.red, viz.colors.white);
                                viz.screenText('Clause: (x1 v ~x2 v x3) = ' + (clauseSat ? 'TRUE' : 'FALSE'), 350, 310, clauseSat ? viz.colors.green : viz.colors.red, 14);
                            }
                        }

                        viz.canvas.addEventListener('click', function() {
                            if (gadgetType === 'variable') { varState = !varState; draw(); }
                        });

                        VizEngine.createButton(controls, 'Variable Gadget', function() { gadgetType = 'variable'; draw(); });
                        VizEngine.createButton(controls, 'Clause Gadget', function() { gadgetType = 'clause'; draw(); });

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'ch20-viz-web',
                    title: 'NP-Completeness Web',
                    description: 'Explore the web of reductions among classic NP-complete problems.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var problems = [
                            {name: 'SAT', x: 350, y: 45, color: '#f85149'},
                            {name: '3-SAT', x: 200, y: 120, color: '#f0883e'},
                            {name: 'CLIQUE', x: 80, y: 210, color: '#58a6ff'},
                            {name: 'IND-SET', x: 80, y: 310, color: '#58a6ff'},
                            {name: 'VTX-COVER', x: 200, y: 310, color: '#58a6ff'},
                            {name: '3-COLOR', x: 200, y: 210, color: '#3fb9a0'},
                            {name: 'SUBSET-SUM', x: 500, y: 120, color: '#bc8cff'},
                            {name: 'PARTITION', x: 620, y: 210, color: '#bc8cff'},
                            {name: 'HAM-CYCLE', x: 370, y: 210, color: '#3fb950'},
                            {name: 'TSP', x: 370, y: 310, color: '#3fb950'},
                            {name: 'SET-COVER', x: 500, y: 310, color: '#d29922'},
                            {name: 'BIN-PACK', x: 620, y: 310, color: '#d29922'}
                        ];
                        var reds = [
                            [0,1],[1,2],[2,3],[3,4],[1,5],
                            [0,6],[6,7],[1,8],[8,9],[1,10],[6,11]
                        ];

                        function draw() {
                            viz.clear();
                            viz.screenText('The NP-Completeness Web of Reductions', 350, 20, viz.colors.white, 13);

                            reds.forEach(function(r) {
                                var a = problems[r[0]], b = problems[r[1]];
                                var dx=b.x-a.x,dy=b.y-a.y,ln=Math.sqrt(dx*dx+dy*dy);
                                var ux=dx/ln,uy=dy/ln;
                                viz.drawEdge(a.x+ux*30,a.y+uy*14,b.x-ux*30,b.y-uy*14, viz.colors.orange, true, '', 1.5);
                            });

                            problems.forEach(function(p) {
                                var ctx = viz.ctx;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                var tw = ctx.measureText(p.name).width;
                                var bw = tw + 16, bh = 22;
                                ctx.fillStyle = p.color + '33';
                                ctx.fillRect(p.x - bw/2, p.y - bh/2, bw, bh);
                                ctx.strokeStyle = p.color;
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(p.x - bw/2, p.y - bh/2, bw, bh);
                                ctx.fillStyle = viz.colors.white;
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(p.name, p.x, p.y);
                            });

                            viz.screenText('Arrow from A to B means A <=p B', 350, 390, viz.colors.text, 11);
                            viz.screenText('All problems above are NP-complete', 350, 408, viz.colors.text, 10);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show that 3-COLORING is NP-complete by describing a reduction from 3-SAT.',
                    hint: 'Use variable gadgets (triangles) and clause gadgets. Connect them via a shared "base" vertex.',
                    solution: '3-COLORING is in NP (certificate: the coloring, verify in \\(O(V+E)\\)). Reduction from 3-SAT: (1) Create base triangle with vertices T (true), F (false), B (base) — these get 3 different colors. (2) Variable gadget: for each variable \\(x_i\\), create a triangle with \\(x_i\\), \\(\\neg x_i\\), and B. This forces \\(x_i\\) and \\(\\neg x_i\\) to get colors T or F (opposite). (3) Clause gadget: for each clause \\((l_1 \\vee l_2 \\vee l_3)\\), create a small subgraph that can be 3-colored iff at least one \\(l_i\\) has color T. This uses an OR-gadget of constant size. The formula is satisfiable iff the graph is 3-colorable.'
                },
                {
                    question: 'Prove that HAM-CYCLE \\(\\leq_p\\) TSP.',
                    hint: 'Assign weights to edges based on whether they exist in the original graph.',
                    solution: 'Given graph \\(G = (V, E)\\) for HAM-CYCLE, create a complete weighted graph \\(K_n\\) where \\(w(u,v) = 1\\) if \\((u,v) \\in E\\) and \\(w(u,v) = 2\\) otherwise. Set budget \\(B = n\\). \\(G\\) has a Hamiltonian cycle iff \\(K_n\\) has a tour of weight \\(\\leq n\\) (since a Hamiltonian cycle uses \\(n\\) edges, all of weight 1, giving total \\(n\\)). Any tour with a non-edge has weight \\(> n\\). Reduction is polynomial.'
                },
                {
                    question: 'If someone claims to have a polynomial-time algorithm for SAT, what would be the consequence for all NP problems?',
                    hint: 'SAT is NP-complete.',
                    solution: 'Since SAT is NP-complete, every problem \\(L \\in \\mathbf{NP}\\) satisfies \\(L \\leq_p\\) SAT. If SAT \\(\\in \\mathbf{P}\\), then by the closure of P under polynomial reductions, every \\(L \\in \\mathbf{NP}\\) is also in P. This means \\(\\mathbf{P} = \\mathbf{NP}\\). This would also imply NP = co-NP and collapse several other complexity classes. It would have profound implications for cryptography (most public-key cryptosystems assume P is not equal to NP).'
                },
                {
                    question: 'Is GRAPH-2-COLORING NP-complete? Justify.',
                    hint: 'What is the relationship between 2-coloring and bipartiteness?',
                    solution: 'No, GRAPH-2-COLORING is in P. A graph is 2-colorable iff it is bipartite (no odd cycles). This can be checked by BFS/DFS in \\(O(V + E)\\) time: attempt to 2-color with a BFS, checking for conflicts. If it succeeds, the graph is 2-colorable; if a conflict is found, it is not. Since it is in P (assuming P is not equal to NP), it cannot be NP-complete.'
                },
                {
                    question: 'The decision problem "Does graph \\(G\\) have a clique of size \\(\\geq k\\)?" is NP-complete. Is the optimization problem "Find the maximum clique" also NP-hard? How are they related?',
                    hint: 'If you could solve the optimization in polynomial time, could you solve the decision version?',
                    solution: 'Yes, the optimization version is NP-hard. If we could find the maximum clique in polynomial time, we could solve the decision version by comparing the max clique size to \\(k\\). Conversely, with a polynomial-time decision oracle for CLIQUE, we can find the max clique by binary search on \\(k\\) (\\(O(\\log n)\\) queries) and then extracting vertices greedily. So the decision and optimization versions are polynomially equivalent.'
                },
                {
                    question: 'Show that the complement of SAT (i.e., "is the formula unsatisfiable?") is in co-NP.',
                    hint: 'By definition of co-NP.',
                    solution: 'UNSAT = "is \\(\\phi\\) unsatisfiable?" A YES-instance of UNSAT means every assignment fails. The complement of UNSAT is SAT, which is in NP. By definition, UNSAT \\(\\in\\) co-NP. Note: a certificate for UNSAT would be a proof that NO assignment works. No short certificate is known for this (this would require NP = co-NP). A certificate for SAT (a satisfying assignment) serves as a refutation of UNSAT.'
                }
            ]
        }
    ]
});
