// ============================================================
// Ch 11 · 并查集 — Union-Find / Disjoint Sets
// ============================================================
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch11',
    number: 11,
    title: '并查集',
    subtitle: 'Union-Find / Disjoint Sets',
    sections: [
        // ============================================================
        // Section 1 : 不相交集合运算 — Disjoint-Set Operations
        // ============================================================
        {
            id: 'ch11-sec01',
            title: '不相交集合运算',
            content: `<h2>Disjoint-Set Operations</h2>
<p>The <strong>disjoint-set</strong> (union-find) data structure maintains a collection of disjoint dynamic sets \\(\\mathcal{S} = \\{S_1, S_2, \\ldots, S_k\\}\\). Each set has a <em>representative</em> element.</p>

<div class="env-block definition"><div class="env-title">Definition (Disjoint-Set ADT)</div><div class="env-body">
<p>Three operations:</p>
<ul>
<li><strong>MakeSet(x)</strong>: Create a new set \\(\\{x\\}\\) with \\(x\\) as representative.</li>
<li><strong>Find(x)</strong>: Return the representative of the set containing \\(x\\).</li>
<li><strong>Union(x, y)</strong>: Merge the sets containing \\(x\\) and \\(y\\) into one.</li>
</ul>
</div></div>

<h3>Representation: Forest of Trees</h3>
<p>Each set is a rooted tree. Each node points to its parent; the root points to itself and serves as the representative.</p>

<div class="env-block algorithm"><div class="env-title">Algorithm: Basic Implementation</div><div class="env-body">
<p><strong>MakeSet(x)</strong>: \\(x.\\text{parent} = x\\)</p>
<p><strong>Find(x)</strong>: Follow parent pointers until \\(x.\\text{parent} = x\\); return \\(x\\).</p>
<p><strong>Union(x, y)</strong>: \\(r_x = \\text{Find}(x),\\; r_y = \\text{Find}(y)\\). Set \\(r_y.\\text{parent} = r_x\\).</p>
</div></div>

<p>Without optimizations, a sequence of \\(n\\) MakeSet and \\(m\\) Find/Union operations can take \\(O(mn)\\) in the worst case (the tree degenerates to a chain).</p>

<div class="viz-placeholder" data-viz="ch11-viz-basic-uf"></div>

<div class="env-block example"><div class="env-title">Example</div><div class="env-body">
<p>MakeSet(1) through MakeSet(6). Then Union(1,2), Union(3,4), Union(5,6), Union(1,3), Union(1,5). The final forest is one tree rooted at 1 with all others connected.</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch11-viz-basic-uf',
                    title: 'Basic Union-Find Forest',
                    description: 'Create sets, union them, and find representatives.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 420});
                        let n = 8;
                        let parent = [];
                        let message = '';
                        let highlightSet = {};

                        function init() {
                            parent = [];
                            for (var i = 0; i < n; i++) parent.push(i);
                            highlightSet = {};
                            message = 'Initialized ' + n + ' singleton sets';
                        }

                        function find(x) {
                            while (parent[x] !== x) x = parent[x];
                            return x;
                        }

                        function union(x, y) {
                            var rx = find(x), ry = find(y);
                            if (rx === ry) {
                                message = x + ' and ' + y + ' are already in the same set (root: ' + rx + ')';
                                return;
                            }
                            parent[ry] = rx;
                            message = 'Union(' + x + ', ' + y + '): attached root ' + ry + ' under root ' + rx;
                        }

                        function getSets() {
                            var sets = {};
                            for (var i = 0; i < n; i++) {
                                var r = find(i);
                                if (!sets[r]) sets[r] = [];
                                sets[r].push(i);
                            }
                            return sets;
                        }

                        function getChildren(node) {
                            var ch = [];
                            for (var i = 0; i < n; i++) {
                                if (i !== node && parent[i] === node) ch.push(i);
                            }
                            return ch;
                        }

                        function layoutSubtree(root, x, y, spread) {
                            var positions = {};
                            positions[root] = {x: x, y: y};
                            function lay(node, px, py, sp) {
                                var children = getChildren(node);
                                if (children.length === 0) return;
                                var childSpread = sp / Math.max(children.length, 1);
                                var startX = px - sp / 2 + childSpread / 2;
                                for (var i = 0; i < children.length; i++) {
                                    var cx = startX + i * childSpread;
                                    var cy = py + 60;
                                    positions[children[i]] = {x: cx, y: cy};
                                    lay(children[i], cx, cy, childSpread * 0.8);
                                }
                            }
                            lay(root, x, y, spread);
                            return positions;
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Union-Find Forest (no optimization)', 350, 8, viz.colors.white, 14, 'center', 'top');

                            var sets = getSets();
                            var roots = Object.keys(sets).map(Number);
                            var totalWidth = 660;
                            var treeWidth = totalWidth / Math.max(roots.length, 1);

                            for (var ri = 0; ri < roots.length; ri++) {
                                var root = roots[ri];
                                var cx = 20 + treeWidth * (ri + 0.5);
                                var positions = layoutSubtree(root, cx, 55, treeWidth * 0.85);

                                // Draw edges
                                for (var i = 0; i < n; i++) {
                                    if (parent[i] !== i && positions[i] && positions[parent[i]]) {
                                        viz.drawTreeEdge(positions[parent[i]].x, positions[parent[i]].y, positions[i].x, positions[i].y, viz.colors.axis);
                                    }
                                }
                                // Draw nodes
                                for (var key in positions) {
                                    var nodeIdx = parseInt(key);
                                    var pos = positions[key];
                                    var isRoot = (parent[nodeIdx] === nodeIdx);
                                    var isHighlight = highlightSet[nodeIdx];
                                    var color = isHighlight ? viz.colors.orange : (isRoot ? viz.colors.green : viz.colors.blue);
                                    viz.drawTreeNode(pos.x, pos.y, 18, nodeIdx, color, viz.colors.white);
                                }
                            }

                            // Parent array
                            var arrY = 330;
                            var cellW = Math.min(50, 600 / n);
                            var startX = 350 - (n * cellW) / 2;
                            viz.screenText('parent[]:', startX - 60, arrY + 10, viz.colors.text, 11, 'right', 'middle');
                            for (var i = 0; i < n; i++) {
                                viz.drawArrayCell(startX + i * cellW, arrY, cellW, 28, parent[i], viz.colors.bg, viz.colors.white, highlightSet[i] ? viz.colors.orange : null);
                                viz.screenText(String(i), startX + i * cellW + cellW / 2, arrY + 32, viz.colors.text, 10, 'center', 'top');
                            }

                            var setsInfo = roots.map(function(r) { return '{' + sets[r].join(',') + '}'; }).join('  ');
                            viz.screenText('Sets: ' + setsInfo, 350, arrY + 50, viz.colors.teal, 11, 'center', 'top');

                            if (message) viz.screenText(message, 350, arrY + 70, viz.colors.yellow, 11, 'center', 'top');
                        }

                        init();

                        var inputX = document.createElement('input');
                        inputX.type = 'number';
                        inputX.value = '0';
                        inputX.style.cssText = 'width:40px;padding:3px 4px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:4px;';
                        controls.appendChild(inputX);

                        var inputY = document.createElement('input');
                        inputY.type = 'number';
                        inputY.value = '1';
                        inputY.style.cssText = 'width:40px;padding:3px 4px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:4px;';
                        controls.appendChild(inputY);

                        VizEngine.createButton(controls, 'Union(x,y)', function() {
                            var x = parseInt(inputX.value), y = parseInt(inputY.value);
                            if (isNaN(x) || isNaN(y) || x < 0 || x >= n || y < 0 || y >= n) { message = 'Invalid input'; draw(); return; }
                            highlightSet = {};
                            union(x, y);
                            highlightSet[x] = true;
                            highlightSet[y] = true;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Find(x)', function() {
                            var x = parseInt(inputX.value);
                            if (isNaN(x) || x < 0 || x >= n) { message = 'Invalid input'; draw(); return; }
                            var r = find(x);
                            highlightSet = {};
                            // Highlight path
                            var cur = x;
                            while (cur !== parent[cur]) { highlightSet[cur] = true; cur = parent[cur]; }
                            highlightSet[cur] = true;
                            message = 'Find(' + x + ') = ' + r;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            init();
                            draw();
                        });

                        VizEngine.createButton(controls, 'Demo Sequence', function() {
                            init();
                            var ops = [[0,1],[2,3],[4,5],[6,7],[0,2],[4,6],[0,4]];
                            var step = 0;
                            var timer = setInterval(function() {
                                if (step >= ops.length) { clearInterval(timer); return; }
                                highlightSet = {};
                                union(ops[step][0], ops[step][1]);
                                highlightSet[ops[step][0]] = true;
                                highlightSet[ops[step][1]] = true;
                                draw();
                                step++;
                            }, 700);
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show the union-find forest after: MakeSet(0..5), Union(0,1), Union(2,3), Union(0,2), Union(4,5), Union(0,4). Draw the parent array.',
                    hint: 'Trace each union step, attaching one root under the other.',
                    solution: 'After Union(0,1): parent = [0,0,2,3,4,5]. After Union(2,3): parent = [0,0,2,2,4,5]. After Union(0,2): parent = [0,0,0,2,4,5]. After Union(4,5): parent = [0,0,0,2,4,4]. After Union(0,4): parent = [0,0,0,2,0,4]. Tree: 0 is root, children 1,2,4. Node 2 has child 3. Node 4 has child 5.'
                },
                {
                    question: 'Construct a sequence of \\(n\\) MakeSet and \\(n-1\\) Union operations that creates a chain of height \\(n-1\\) (worst case for basic union).',
                    hint: 'Always attach the new root under the previous root.',
                    solution: 'MakeSet(0..n-1). Union(0,1): tree 0->1. Union(1,2): find(1)=0, so attach 2 under 0. But if we do Union(1,2) naively as parent[find(2)] = find(1), we get: Union(1,0), Union(2,1), Union(3,2)... Actually, to create a chain: do Union(0,1), Union(1,2) where parent[root(2)] = root(1) = 0, making 0->2 not a chain. To force a chain: Union(1,0) (parent[0]=1), Union(2,1) (parent[1]=2), etc. This gives chain n-1 -> n-2 -> ... -> 0.'
                },
                {
                    question: 'What is the running time of \\(m\\) operations (MakeSet, Find, Union) on \\(n\\) elements without any optimization?',
                    hint: 'A single Find can take \\(O(n)\\) if the tree is a chain.',
                    solution: 'Without optimization, Find takes \\(O(n)\\) worst case (chain of height n-1). Union calls Find twice, so also \\(O(n)\\). Total for \\(m\\) operations: \\(O(mn)\\).'
                }
            ]
        },
        // ============================================================
        // Section 2 : 按秩合并 — Union by Rank
        // ============================================================
        {
            id: 'ch11-sec02',
            title: '按秩合并',
            content: `<h2>Union by Rank</h2>
<p>The first optimization: always attach the shorter tree under the taller tree's root.</p>

<div class="env-block definition"><div class="env-title">Definition (Rank)</div><div class="env-body">
<p>Each node \\(x\\) maintains a <em>rank</em>, initially 0. The rank is an upper bound on the height of \\(x\\)'s subtree. In Union, the root with smaller rank becomes a child of the root with larger rank. If ranks are equal, one becomes the child and the other's rank increases by 1.</p>
</div></div>

<div class="env-block algorithm"><div class="env-title">Algorithm: Union by Rank</div><div class="env-body">
<p><strong>Union(x, y)</strong>:</p>
<p>1. \\(r_x = \\text{Find}(x),\\; r_y = \\text{Find}(y)\\)</p>
<p>2. If \\(r_x = r_y\\), return (same set).</p>
<p>3. If \\(r_x.\\text{rank} > r_y.\\text{rank}\\): \\(r_y.\\text{parent} = r_x\\)</p>
<p>4. Else if \\(r_x.\\text{rank} < r_y.\\text{rank}\\): \\(r_x.\\text{parent} = r_y\\)</p>
<p>5. Else: \\(r_y.\\text{parent} = r_x\\), \\(r_x.\\text{rank} \\mathrel{+}= 1\\)</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (Height Bound with Union by Rank)</div><div class="env-body">
<p>With union by rank (without path compression), any tree with root of rank \\(r\\) contains at least \\(2^r\\) nodes. Therefore, the rank (and height) of any tree is at most \\(\\lfloor \\log_2 n \\rfloor\\).</p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p>By induction on operations. A node of rank 0 has \\(\\ge 2^0 = 1\\) node (just itself). When two trees with roots of equal rank \\(r\\) merge, the new root has rank \\(r+1\\) and at least \\(2^r + 2^r = 2^{r+1}\\) nodes. When ranks differ, the rank of the new root doesn't increase. So a root of rank \\(r\\) has \\(\\ge 2^r\\) nodes, giving \\(r \\le \\log_2 n\\).</p>
<p class="qed">∎</p>
</div></div>

<div class="viz-placeholder" data-viz="ch11-viz-union-rank"></div>

<p>With union by rank alone, each Find takes \\(O(\\log n)\\), so \\(m\\) operations on \\(n\\) elements take \\(O(m \\log n)\\).</p>`,
            visualizations: [
                {
                    id: 'ch11-viz-union-rank',
                    title: 'Union by Rank',
                    description: 'Watch how rank-based union keeps trees balanced.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 420});
                        let n = 10;
                        let parent = [];
                        let rank = [];
                        let message = '';
                        let highlightSet = {};

                        function init() {
                            parent = [];
                            rank = [];
                            for (var i = 0; i < n; i++) { parent.push(i); rank.push(0); }
                            highlightSet = {};
                            message = 'Initialized ' + n + ' sets (all rank 0)';
                        }

                        function find(x) {
                            while (parent[x] !== x) x = parent[x];
                            return x;
                        }

                        function unionByRank(x, y) {
                            var rx = find(x), ry = find(y);
                            if (rx === ry) { message = x + ' and ' + y + ' already in same set'; return; }
                            if (rank[rx] > rank[ry]) {
                                parent[ry] = rx;
                                message = 'Union(' + x + ',' + y + '): rank[' + rx + ']=' + rank[rx] + ' > rank[' + ry + ']=' + rank[ry] + ', attach ' + ry + ' under ' + rx;
                            } else if (rank[rx] < rank[ry]) {
                                parent[rx] = ry;
                                message = 'Union(' + x + ',' + y + '): rank[' + rx + ']=' + rank[rx] + ' < rank[' + ry + ']=' + rank[ry] + ', attach ' + rx + ' under ' + ry;
                            } else {
                                parent[ry] = rx;
                                rank[rx]++;
                                message = 'Union(' + x + ',' + y + '): equal rank ' + rank[rx] + ', attach ' + ry + ' under ' + rx + ', rank[' + rx + '] -> ' + rank[rx];
                            }
                        }

                        function getSets() {
                            var sets = {};
                            for (var i = 0; i < n; i++) {
                                var r = find(i);
                                if (!sets[r]) sets[r] = [];
                                sets[r].push(i);
                            }
                            return sets;
                        }

                        function getChildren(node) {
                            var ch = [];
                            for (var i = 0; i < n; i++) {
                                if (i !== node && parent[i] === node) ch.push(i);
                            }
                            return ch;
                        }

                        function layoutSubtree(root, x, y, spread) {
                            var positions = {};
                            positions[root] = {x: x, y: y};
                            function lay(node, px, py, sp) {
                                var children = getChildren(node);
                                if (children.length === 0) return;
                                var childSpread = sp / Math.max(children.length, 1);
                                var startX = px - sp / 2 + childSpread / 2;
                                for (var i = 0; i < children.length; i++) {
                                    var cx = startX + i * childSpread;
                                    var cy = py + 60;
                                    positions[children[i]] = {x: cx, y: cy};
                                    lay(children[i], cx, cy, childSpread * 0.8);
                                }
                            }
                            lay(root, x, y, spread);
                            return positions;
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Union by Rank', 350, 8, viz.colors.white, 14, 'center', 'top');

                            var sets = getSets();
                            var roots = Object.keys(sets).map(Number);
                            var totalWidth = 660;
                            var treeWidth = totalWidth / Math.max(roots.length, 1);

                            for (var ri = 0; ri < roots.length; ri++) {
                                var root = roots[ri];
                                var cx = 20 + treeWidth * (ri + 0.5);
                                var positions = layoutSubtree(root, cx, 55, treeWidth * 0.85);

                                for (var i = 0; i < n; i++) {
                                    if (parent[i] !== i && positions[i] && positions[parent[i]]) {
                                        viz.drawTreeEdge(positions[parent[i]].x, positions[parent[i]].y, positions[i].x, positions[i].y, viz.colors.axis);
                                    }
                                }
                                for (var key in positions) {
                                    var nodeIdx = parseInt(key);
                                    var pos = positions[key];
                                    var isRoot = (parent[nodeIdx] === nodeIdx);
                                    var color = highlightSet[nodeIdx] ? viz.colors.orange : (isRoot ? viz.colors.green : viz.colors.blue);
                                    viz.drawTreeNode(pos.x, pos.y, 17, nodeIdx, color, viz.colors.white);
                                    if (isRoot) {
                                        viz.screenText('r=' + rank[nodeIdx], pos.x, pos.y - 22, viz.colors.yellow, 9, 'center', 'bottom');
                                    }
                                }
                            }

                            // Rank array
                            var arrY = 330;
                            var cellW = Math.min(45, 580 / n);
                            var startX = 350 - (n * cellW) / 2;
                            viz.screenText('rank[]:', startX - 50, arrY + 10, viz.colors.text, 11, 'right', 'middle');
                            for (var i = 0; i < n; i++) {
                                viz.drawArrayCell(startX + i * cellW, arrY, cellW, 26, rank[i], viz.colors.bg, viz.colors.white);
                                viz.screenText(String(i), startX + i * cellW + cellW / 2, arrY + 30, viz.colors.text, 10, 'center', 'top');
                            }

                            if (message) viz.screenText(message, 350, arrY + 55, viz.colors.yellow, 11, 'center', 'top');
                        }

                        init();

                        var inputX = document.createElement('input');
                        inputX.type = 'number'; inputX.value = '0';
                        inputX.style.cssText = 'width:38px;padding:3px 4px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:4px;';
                        controls.appendChild(inputX);
                        var inputY = document.createElement('input');
                        inputY.type = 'number'; inputY.value = '1';
                        inputY.style.cssText = 'width:38px;padding:3px 4px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:4px;';
                        controls.appendChild(inputY);

                        VizEngine.createButton(controls, 'Union(x,y)', function() {
                            var x = parseInt(inputX.value), y = parseInt(inputY.value);
                            if (isNaN(x) || isNaN(y) || x < 0 || x >= n || y < 0 || y >= n) return;
                            highlightSet = {};
                            unionByRank(x, y);
                            highlightSet[x] = true; highlightSet[y] = true;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset', function() { init(); draw(); });

                        VizEngine.createButton(controls, 'Demo', function() {
                            init();
                            var ops = [[0,1],[2,3],[4,5],[6,7],[8,9],[0,2],[4,6],[0,4],[8,0]];
                            var step = 0;
                            var timer = setInterval(function() {
                                if (step >= ops.length) { clearInterval(timer); return; }
                                highlightSet = {};
                                unionByRank(ops[step][0], ops[step][1]);
                                highlightSet[ops[step][0]] = true;
                                highlightSet[ops[step][1]] = true;
                                draw();
                                step++;
                            }, 800);
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove by induction that a tree created by union by rank with root rank \\(r\\) has at least \\(2^r\\) nodes.',
                    hint: 'The rank only increases when two trees of equal rank merge.',
                    solution: 'Base: rank 0 -> at least \\(2^0 = 1\\) node. Inductive step: a root reaches rank \\(r\\) only by merging two trees of rank \\(r-1\\). By IH, each has \\(\\ge 2^{r-1}\\) nodes. Together: \\(\\ge 2^{r-1} + 2^{r-1} = 2^r\\) nodes. When trees of unequal rank merge, the root rank stays the same, and nodes only increase.'
                },
                {
                    question: 'What is the maximum possible height of a union-by-rank tree with 16 elements? Show a construction that achieves this height.',
                    hint: 'Maximum height = maximum rank = \\(\\lfloor \\log_2 n \\rfloor\\).',
                    solution: 'Maximum rank with 16 elements is \\(\\lfloor \\log_2 16 \\rfloor = 4\\). Construction: merge 8 pairs to get 8 rank-1 trees, merge pairs to get 4 rank-2 trees, merge pairs to get 2 rank-3 trees, merge them to get 1 rank-4 tree. The resulting tree has height 4.'
                },
                {
                    question: 'What is an alternative to union by rank? Describe union by size and prove it achieves the same height bound.',
                    hint: 'Attach the tree with fewer nodes under the tree with more nodes.',
                    solution: 'Union by size: each root stores size (number of nodes in tree). In Union, attach smaller tree under larger. If equal, pick either. A tree of size s has height \\(\\le \\lfloor \\log_2 s \\rfloor\\): when a node moves deeper, its tree size at least doubles (it joins a tree of equal or larger size). Since its tree can double at most \\(\\lfloor \\log_2 n \\rfloor\\) times, the height is \\(O(\\log n)\\).'
                }
            ]
        },
        // ============================================================
        // Section 3 : 路径压缩 — Path Compression
        // ============================================================
        {
            id: 'ch11-sec03',
            title: '路径压缩',
            content: `<h2>Path Compression</h2>
<p>The second optimization: during Find, make every node on the find path point directly to the root.</p>

<div class="env-block algorithm"><div class="env-title">Algorithm: Find with Path Compression</div><div class="env-body">
<p><strong>Find(x)</strong>:</p>
<p>1. If \\(x.\\text{parent} \\ne x\\):</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;\\(x.\\text{parent} \\leftarrow \\text{Find}(x.\\text{parent})\\)</p>
<p>2. Return \\(x.\\text{parent}\\)</p>
</div></div>

<p>This recursive implementation is elegant: it flattens the tree in a single traversal. After a Find(x) call, every node on the path from \\(x\\) to the root becomes a direct child of the root.</p>

<div class="env-block theorem"><div class="env-title">Theorem (Path Compression + Union by Rank)</div><div class="env-body">
<p>With both union by rank and path compression, a sequence of \\(m\\) operations on \\(n\\) elements runs in \\(O(m \\cdot \\alpha(n))\\) time, where \\(\\alpha\\) is the <em>inverse Ackermann function</em>, which grows so slowly that \\(\\alpha(n) \\le 4\\) for all practical \\(n \\le 2^{2^{2^{65536}}}\\).</p>
</div></div>

<p>In practice, union-find is effectively \\(O(m)\\) — nearly constant time per operation.</p>

<div class="viz-placeholder" data-viz="ch11-viz-path-compress"></div>

<h3>Path Splitting and Path Halving</h3>
<p>Two simpler alternatives to full path compression:</p>
<ul>
<li><strong>Path splitting</strong>: Make every node on the find path point to its grandparent. Each node's parent is updated individually during the traversal.</li>
<li><strong>Path halving</strong>: Make every other node on the find path point to its grandparent. Processes the path in a single pass.</li>
</ul>
<p>Both achieve the same \\(O(m \\alpha(n))\\) amortized bound.</p>`,
            visualizations: [
                {
                    id: 'ch11-viz-path-compress',
                    title: 'Path Compression Animation',
                    description: 'Watch path compression flatten the tree during Find operations.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 420});
                        let n = 10;
                        let parent = [];
                        let rank = [];
                        let message = '';
                        let highlightSet = {};
                        let beforeParent = null;

                        function init() {
                            parent = [];
                            rank = [];
                            for (var i = 0; i < n; i++) { parent.push(i); rank.push(0); }
                            highlightSet = {};
                            message = '';
                            beforeParent = null;
                        }

                        function findNoCompress(x) {
                            while (parent[x] !== x) x = parent[x];
                            return x;
                        }

                        function findWithCompress(x) {
                            if (parent[x] !== x) {
                                parent[x] = findWithCompress(parent[x]);
                            }
                            return parent[x];
                        }

                        function unionByRank(x, y) {
                            var rx = findNoCompress(x), ry = findNoCompress(y);
                            if (rx === ry) return;
                            if (rank[rx] > rank[ry]) parent[ry] = rx;
                            else if (rank[rx] < rank[ry]) parent[rx] = ry;
                            else { parent[ry] = rx; rank[rx]++; }
                        }

                        function getChildren(node) {
                            var ch = [];
                            for (var i = 0; i < n; i++) {
                                if (i !== node && parent[i] === node) ch.push(i);
                            }
                            return ch;
                        }

                        function getSets() {
                            var sets = {};
                            for (var i = 0; i < n; i++) {
                                var r = findNoCompress(i);
                                if (!sets[r]) sets[r] = [];
                                sets[r].push(i);
                            }
                            return sets;
                        }

                        function layoutSubtree(root, x, y, spread, par) {
                            var positions = {};
                            positions[root] = {x: x, y: y};
                            function lay(node, px, py, sp) {
                                var children = [];
                                for (var i = 0; i < n; i++) {
                                    if (i !== node && par[i] === node) children.push(i);
                                }
                                if (children.length === 0) return;
                                var childSpread = sp / Math.max(children.length, 1);
                                var startX = px - sp / 2 + childSpread / 2;
                                for (var i = 0; i < children.length; i++) {
                                    var cx = startX + i * childSpread;
                                    var cy = py + 55;
                                    positions[children[i]] = {x: cx, y: cy};
                                    lay(children[i], cx, cy, childSpread * 0.8);
                                }
                            }
                            lay(root, x, y, spread);
                            return positions;
                        }

                        function drawForest(par, startY, label) {
                            var sets = {};
                            for (var i = 0; i < n; i++) {
                                var cur = i;
                                while (par[cur] !== cur) cur = par[cur];
                                if (!sets[cur]) sets[cur] = [];
                                sets[cur].push(i);
                            }
                            var roots = Object.keys(sets).map(Number);
                            var totalWidth = 660;
                            var treeWidth = totalWidth / Math.max(roots.length, 1);

                            viz.screenText(label, 350, startY - 18, viz.colors.text, 11, 'center', 'bottom');

                            for (var ri = 0; ri < roots.length; ri++) {
                                var root = roots[ri];
                                var cx = 20 + treeWidth * (ri + 0.5);
                                var positions = layoutSubtree(root, cx, startY, treeWidth * 0.85, par);

                                for (var i = 0; i < n; i++) {
                                    if (par[i] !== i && positions[i] && positions[par[i]]) {
                                        viz.drawTreeEdge(positions[par[i]].x, positions[par[i]].y, positions[i].x, positions[i].y, viz.colors.axis);
                                    }
                                }
                                for (var key in positions) {
                                    var nodeIdx = parseInt(key);
                                    var pos = positions[key];
                                    var isRoot = (par[nodeIdx] === nodeIdx);
                                    var color = highlightSet[nodeIdx] ? viz.colors.orange : (isRoot ? viz.colors.green : viz.colors.blue);
                                    viz.drawTreeNode(pos.x, pos.y, 15, nodeIdx, color, viz.colors.white);
                                }
                            }
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Path Compression: Before vs. After Find', 350, 5, viz.colors.white, 14, 'center', 'top');

                            if (beforeParent) {
                                drawForest(beforeParent, 50, 'Before Find:');
                                drawForest(parent, 230, 'After Find (path compressed):');
                            } else {
                                drawForest(parent, 60, 'Current forest:');
                            }

                            if (message) viz.screenText(message, 350, 400, viz.colors.yellow, 11, 'center', 'top');
                        }

                        // Build a tall chain for demo
                        function buildChain() {
                            init();
                            // Create a tall tree: 0<-1<-2<-3<-4<-5<-6<-7<-8<-9
                            for (var i = 1; i < n; i++) {
                                parent[i] = i - 1;
                            }
                            rank[0] = n - 1; // approximate
                            message = 'Built a chain: Find(9) will compress the path';
                        }

                        buildChain();

                        var inputEl = document.createElement('input');
                        inputEl.type = 'number'; inputEl.value = '9';
                        inputEl.style.cssText = 'width:40px;padding:3px 4px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:4px;';
                        controls.appendChild(inputEl);

                        VizEngine.createButton(controls, 'Find(x) + Compress', function() {
                            var x = parseInt(inputEl.value);
                            if (isNaN(x) || x < 0 || x >= n) return;
                            beforeParent = parent.slice();
                            // Highlight path
                            highlightSet = {};
                            var cur = x;
                            while (parent[cur] !== cur) { highlightSet[cur] = true; cur = parent[cur]; }
                            highlightSet[cur] = true;
                            var root = findWithCompress(x);
                            message = 'Find(' + x + ') = ' + root + ' — all path nodes now point to root';
                            draw();
                        });

                        VizEngine.createButton(controls, 'Build Chain', function() {
                            buildChain();
                            draw();
                        });

                        VizEngine.createButton(controls, 'Build Balanced', function() {
                            init();
                            var ops = [[0,1],[2,3],[4,5],[6,7],[8,9],[0,2],[4,6],[0,4],[8,0]];
                            for (var i = 0; i < ops.length; i++) unionByRank(ops[i][0], ops[i][1]);
                            beforeParent = null;
                            message = 'Built balanced tree with union by rank';
                            highlightSet = {};
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Starting from a chain 0 <- 1 <- 2 <- 3 <- 4 <- 5, show the parent array after Find(5) with path compression.',
                    hint: 'Path compression makes every node on the find path point directly to the root.',
                    solution: 'Before: parent = [0, 0, 1, 2, 3, 4]. Find(5) traverses: 5->4->3->2->1->0 (root). After compression: parent = [0, 0, 0, 0, 0, 0]. All nodes 1-5 now point directly to root 0.'
                },
                {
                    question: 'Show that path compression does not change the rank of any node.',
                    hint: 'Path compression only modifies parent pointers, not rank values.',
                    solution: 'Path compression sets parent[x] = root for all nodes on the find path. It does not modify the rank array at all. Ranks are only changed during Union (when two trees of equal rank merge). After path compression, ranks may no longer reflect actual heights (rank becomes an upper bound, not exact height), but this is fine for correctness of union by rank.'
                },
                {
                    question: 'Describe path halving and explain its advantage over full path compression.',
                    hint: 'Path halving requires only a single pass with no recursion.',
                    solution: 'Path halving: while x is not the root, set parent[x] = parent[parent[x]] (point to grandparent), then x = parent[x]. This processes every other node on the path, each time skipping one level. Advantage: iterative (no recursion stack), single pass, and achieves the same O(m * alpha(n)) amortized bound. In practice, it has smaller constant factors due to fewer pointer writes.'
                }
            ]
        },
        // ============================================================
        // Section 4 : 逆阿克曼函数分析 — Inverse Ackermann Analysis
        // ============================================================
        {
            id: 'ch11-sec04',
            title: '逆阿克曼函数分析',
            content: `<h2>Inverse Ackermann Analysis</h2>
<p>The amortized analysis of union-find with both optimizations is one of the most sophisticated in computer science, due to Tarjan (1975).</p>

<div class="env-block definition"><div class="env-title">Definition (Ackermann Function)</div><div class="env-body">
<p>The Ackermann function \\(A(k, j)\\) is defined recursively:</p>
$$A(k, j) = \\begin{cases} j + 1 & \\text{if } k = 0 \\\\ A(k-1, 1) & \\text{if } k \\ge 1, j = 0 \\\\ A(k-1, A(k, j-1)) & \\text{if } k \\ge 1, j \\ge 1 \\end{cases}$$
<p>This function grows incredibly fast. For example:</p>
<ul>
<li>\\(A(1, j) = j + 2\\)</li>
<li>\\(A(2, j) = 2j + 3\\)</li>
<li>\\(A(3, j) = 2^{j+3} - 3\\)</li>
<li>\\(A(4, 1) = 2^{2^{2^{2}}} - 3 = 65533\\)</li>
<li>\\(A(4, 2)\\) has over 19,000 digits</li>
</ul>
</div></div>

<div class="env-block definition"><div class="env-title">Definition (Inverse Ackermann)</div><div class="env-body">
<p>The inverse Ackermann function is:</p>
$$\\alpha(n) = \\min\\{k \\ge 1 : A(k, 1) \\ge n\\}$$
<p>For all practical values of \\(n\\) (even \\(n = 2^{65536}\\)), \\(\\alpha(n) \\le 4\\).</p>
</div></div>

<div class="viz-placeholder" data-viz="ch11-viz-ackermann"></div>

<div class="env-block theorem"><div class="env-title">Theorem (Tarjan, 1975)</div><div class="env-body">
<p>A sequence of \\(m\\) MakeSet, Union, and Find operations, of which \\(n\\) are MakeSet, runs in \\(O(m \\cdot \\alpha(n))\\) time with union by rank and path compression.</p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof Sketch (Amortized Analysis)</div><div class="env-body">
<p>The proof uses a sophisticated potential function based on rank groups. Key ideas:</p>
<p>1. Partition ranks into <em>blocks</em> \\(\\{0\\}, \\{1\\}, \\{2, 3\\}, \\{4, \\ldots, 2^3-1\\}, \\{2^3, \\ldots, 2^{2^3}-1\\}, \\ldots\\) The number of blocks for ranks up to \\(\\log n\\) is \\(\\alpha(n)\\).</p>
<p>2. Define potential \\(\\Phi(x)\\) for non-root node \\(x\\) based on how many times its rank group can "compress" before \\(x\\) escapes to a parent in a higher block.</p>
<p>3. Each Find that traverses a path of length \\(\\ell\\) has actual cost \\(O(\\ell)\\), but the potential drop pays for all but \\(O(\\alpha(n))\\) of the path steps.</p>
<p class="qed">∎</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (Optimality — Fredman & Saks, 1989)</div><div class="env-body">
<p>In the cell probe model, any disjoint-set data structure must use \\(\\Omega(m \\cdot \\alpha(n))\\) time for \\(m\\) operations on \\(n\\) elements. So union-find with both optimizations is asymptotically optimal.</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch11-viz-ackermann',
                    title: 'Ackermann Function Growth & Rank Evolution',
                    description: 'Explore the Ackermann function values and see how rank evolves during union-find operations.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 400});
                        let viewMode = 'ackermann';

                        // Ackermann function (with safety limit)
                        function ackermann(k, j, depth) {
                            if (depth > 100) return Infinity;
                            if (k === 0) return j + 1;
                            if (j === 0) return ackermann(k - 1, 1, depth + 1);
                            var inner = ackermann(k, j - 1, depth + 1);
                            if (inner > 1e15) return Infinity;
                            return ackermann(k - 1, inner, depth + 1);
                        }

                        function inverseAck(n) {
                            for (var k = 1; k <= 10; k++) {
                                if (ackermann(k, 1, 0) >= n) return k;
                            }
                            return 10;
                        }

                        function drawAckermann() {
                            viz.clear();
                            viz.screenText('Ackermann Function A(k, j)', 350, 10, viz.colors.white, 15, 'center', 'top');

                            // Table of values
                            var maxK = 5, maxJ = 5;
                            var cellW = 90, cellH = 32;
                            var startX = 120, startY = 50;

                            // Header row
                            viz.screenText('k \\ j', startX - 30, startY + cellH / 2, viz.colors.text, 12, 'center', 'middle');
                            for (var j = 0; j <= maxJ; j++) {
                                viz.drawArrayCell(startX + j * cellW, startY, cellW, cellH, 'j=' + j, viz.colors.bg, viz.colors.teal);
                            }

                            for (var k = 0; k <= maxK; k++) {
                                var py = startY + (k + 1) * cellH;
                                viz.screenText('k=' + k, startX - 30, py + cellH / 2, viz.colors.teal, 11, 'center', 'middle');
                                for (var j = 0; j <= maxJ; j++) {
                                    var val = ackermann(k, j, 0);
                                    var display = val > 1e10 ? 'HUGE' : (val === Infinity ? '...' : String(val));
                                    var color = val > 1000 ? viz.colors.red : (val > 10 ? viz.colors.orange : viz.colors.bg);
                                    viz.drawArrayCell(startX + j * cellW, py, cellW, cellH, display, color, viz.colors.white);
                                }
                            }

                            // Inverse Ackermann values
                            var invY = 310;
                            viz.screenText('Inverse Ackermann: alpha(n) = min{k >= 1 : A(k,1) >= n}', 350, invY, viz.colors.white, 12, 'center', 'top');
                            var nvals = [1, 3, 7, 61, 65534, 1e10, 1e100];
                            var labels = ['1', '3', '7', '61', '65534', '10^10', '10^100'];
                            for (var i = 0; i < nvals.length; i++) {
                                var alpha = inverseAck(nvals[i]);
                                var px = 50 + i * 90;
                                viz.screenText('n=' + labels[i], px, invY + 25, viz.colors.text, 10, 'center', 'top');
                                viz.drawNode(px, invY + 55, 14, alpha, viz.colors.teal, viz.colors.white);
                            }
                            viz.screenText('For all practical n, alpha(n) <= 4', 350, invY + 80, viz.colors.yellow, 12, 'center', 'top');
                        }

                        function drawRankEvolution() {
                            viz.clear();
                            viz.screenText('Rank Evolution during Union-Find', 350, 10, viz.colors.white, 15, 'center', 'top');

                            // Simulate union-find and track max rank
                            var sizes = [8, 16, 32, 64, 128, 256, 512, 1024];
                            var maxRanks = [];
                            for (var si = 0; si < sizes.length; si++) {
                                var sz = sizes[si];
                                var par = [];
                                var rk = [];
                                for (var i = 0; i < sz; i++) { par.push(i); rk.push(0); }
                                // Random unions
                                for (var i = 0; i < sz - 1; i++) {
                                    var a = i, b = i + 1;
                                    // Find roots
                                    var ra = a; while (par[ra] !== ra) ra = par[ra];
                                    var rb = b; while (par[rb] !== rb) rb = par[rb];
                                    if (ra !== rb) {
                                        if (rk[ra] > rk[rb]) par[rb] = ra;
                                        else if (rk[ra] < rk[rb]) par[ra] = rb;
                                        else { par[rb] = ra; rk[ra]++; }
                                    }
                                }
                                maxRanks.push(Math.max.apply(null, rk));
                            }

                            // Bar chart
                            var barW = 55;
                            var maxH = 200;
                            var maxR = Math.max.apply(null, maxRanks);
                            var startX = 80;
                            var baseY = 300;
                            for (var i = 0; i < sizes.length; i++) {
                                var h = (maxRanks[i] / maxR) * maxH;
                                var px = startX + i * (barW + 15);
                                viz.ctx.fillStyle = viz.colors.blue;
                                viz.ctx.fillRect(px, baseY - h, barW, h);
                                viz.ctx.strokeStyle = viz.colors.axis;
                                viz.ctx.strokeRect(px, baseY - h, barW, h);
                                viz.screenText(String(maxRanks[i]), px + barW / 2, baseY - h - 8, viz.colors.white, 12, 'center', 'bottom');
                                viz.screenText('n=' + sizes[i], px + barW / 2, baseY + 8, viz.colors.text, 10, 'center', 'top');

                                // Log2 line
                                var logH = (Math.log2(sizes[i]) / maxR) * maxH;
                                viz.ctx.fillStyle = viz.colors.orange;
                                viz.ctx.fillRect(px + barW + 2, baseY - logH, 4, logH);
                            }

                            viz.screenText('Blue = max rank achieved, Orange = log2(n)', 350, 340, viz.colors.text, 11, 'center', 'top');
                            viz.screenText('Max rank is always <= log2(n), confirming the bound', 350, 360, viz.colors.yellow, 11, 'center', 'top');
                        }

                        VizEngine.createSelect(controls, 'View:', [
                            {value: 'ackermann', label: 'Ackermann Table'},
                            {value: 'rank', label: 'Rank Evolution'}
                        ], function(val) {
                            viewMode = val;
                            if (viewMode === 'ackermann') drawAckermann();
                            else drawRankEvolution();
                        });

                        drawAckermann();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(A(3, 2)\\) and \\(A(4, 1)\\) using the Ackermann function definition.',
                    hint: '\\(A(3, j) = 2^{j+3} - 3\\). For \\(A(4, 1)\\), use \\(A(4, 1) = A(3, A(4, 0)) = A(3, A(3, 1))\\).',
                    solution: '\\(A(3, 2) = 2^{2+3} - 3 = 2^5 - 3 = 29\\). For \\(A(4, 1)\\): \\(A(4, 0) = A(3, 1) = 2^{1+3} - 3 = 13\\). \\(A(4, 1) = A(3, 13) = 2^{16} - 3 = 65533\\).'
                },
                {
                    question: 'What is \\(\\alpha(10^{80})\\) (the number of atoms in the observable universe)?',
                    hint: 'We need the smallest \\(k\\) such that \\(A(k, 1) \\ge 10^{80}\\).',
                    solution: '\\(A(1, 1) = 3\\), \\(A(2, 1) = 7\\), \\(A(3, 1) = 13\\), \\(A(4, 1) = 65533\\). Since \\(65533 < 10^{80}\\), check \\(A(5, 1) = A(4, A(5, 0)) = A(4, A(4, 1)) = A(4, 65533)\\), which is a tower of 2s of height \\(\\approx 65536\\), vastly exceeding \\(10^{80}\\). So \\(\\alpha(10^{80}) = 5\\). In fact, \\(\\alpha(n) \\le 4\\) for \\(n \\le 2^{65536}\\), and \\(10^{80} \\ll 2^{65536}\\), so \\(\\alpha(10^{80}) = 4\\).'
                },
                {
                    question: 'Explain intuitively why path compression alone (without union by rank) does not achieve \\(O(m \\cdot \\alpha(n))\\).',
                    hint: 'Without union by rank, trees can become very tall before compression occurs.',
                    solution: 'Without union by rank, a sequence of unions can create a chain of height n-1. The first Find on the deepest element costs O(n) even with compression. While compression speeds up future finds on the same path, adversarial union sequences can repeatedly create long paths that must be compressed. The tight bound for path compression alone is O(m log(1+m/n) n) per Tarjan and van Leeuwen. Both optimizations are needed for the O(m alpha(n)) bound.'
                }
            ]
        },
        // ============================================================
        // Section 5 : 应用 — Applications
        // ============================================================
        {
            id: 'ch11-sec05',
            title: '应用',
            content: `<h2>Applications of Union-Find</h2>
<p>Union-find is a fundamental building block for many algorithms. Its near-constant-time operations make it the tool of choice whenever we need to dynamically track connected components.</p>

<h3>1. Kruskal's MST Algorithm</h3>
<div class="env-block algorithm"><div class="env-title">Algorithm: Kruskal's MST</div><div class="env-body">
<p>1. Sort edges by weight.</p>
<p>2. Initialize union-find with \\(n\\) vertices.</p>
<p>3. For each edge \\((u, v)\\) in sorted order:</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;If Find(u) \\(\\ne\\) Find(v): add edge to MST, Union(u, v).</p>
<p>Running time: \\(O(E \\log E + E \\cdot \\alpha(V)) = O(E \\log E)\\) (dominated by sorting).</p>
</div></div>

<h3>2. Connected Components (Dynamic)</h3>
<p>Process edges one at a time. Each Union adds an edge; Find checks if two vertices are in the same component. Process \\(m\\) edges on \\(n\\) vertices in \\(O(m \\cdot \\alpha(n))\\).</p>

<div class="viz-placeholder" data-viz="ch11-viz-connected-comp"></div>

<h3>3. Equivalence Classes</h3>
<p>Given pairs of equivalent items, group all items into equivalence classes. Union-find naturally handles transitive closure: if \\(a \\sim b\\) and \\(b \\sim c\\), then Find(a) = Find(c) after Union(a,b) and Union(b,c).</p>

<h3>4. Percolation</h3>
<p>In an \\(n \\times n\\) grid, each cell is open with probability \\(p\\). Does a path exist from top to bottom through open cells? Union-find efficiently tracks whether top and bottom are connected as cells are opened.</p>

<div class="viz-placeholder" data-viz="ch11-viz-percolation"></div>

<h3>5. Image Segmentation</h3>
<p>Union adjacent pixels with similar colors. Each component becomes a segment. Felzenszwalb's algorithm uses union-find with a custom merge criterion based on color differences.</p>

<div class="env-block theorem"><div class="env-title">Theorem (Applications Summary)</div><div class="env-body">
<table style="margin:8px 0;border-collapse:collapse;font-size:0.9em;">
<tr style="border-bottom:2px solid #30363d;"><th style="padding:4px 10px;">Application</th><th style="padding:4px 10px;">Operations</th><th style="padding:4px 10px;">Total Time</th></tr>
<tr><td style="padding:4px 10px;">Kruskal's MST</td><td style="padding:4px 10px;">\\(E\\) unions, \\(E\\) finds</td><td style="padding:4px 10px;">\\(O(E \\log E)\\)</td></tr>
<tr><td style="padding:4px 10px;">Dynamic connectivity</td><td style="padding:4px 10px;">\\(m\\) mixed</td><td style="padding:4px 10px;">\\(O(m \\alpha(n))\\)</td></tr>
<tr><td style="padding:4px 10px;">Percolation</td><td style="padding:4px 10px;">\\(n^2\\) unions</td><td style="padding:4px 10px;">\\(O(n^2 \\alpha(n^2))\\)</td></tr>
<tr><td style="padding:4px 10px;">LCA (offline)</td><td style="padding:4px 10px;">\\(n + q\\) ops</td><td style="padding:4px 10px;">\\(O((n+q)\\alpha(n))\\)</td></tr>
</table>
</div></div>`,
            visualizations: [
                {
                    id: 'ch11-viz-connected-comp',
                    title: 'Connected Components with Union-Find',
                    description: 'Add edges to a graph and watch components merge.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 400});
                        let nv = 10;
                        let parent = [];
                        let rnk = [];
                        let edges = [];
                        let positions = [];
                        let message = '';

                        // Color palette for components
                        var palette = ['#58a6ff', '#3fb950', '#f0883e', '#bc8cff', '#f85149', '#d29922', '#f778ba', '#3fb9a0', '#8b949e', '#ff7b72'];

                        function init() {
                            parent = [];
                            rnk = [];
                            edges = [];
                            for (var i = 0; i < nv; i++) { parent.push(i); rnk.push(0); }
                            // Position nodes in a circle
                            positions = [];
                            var cx = 250, cy = 200, r = 140;
                            for (var i = 0; i < nv; i++) {
                                var angle = (2 * Math.PI * i / nv) - Math.PI / 2;
                                positions.push({x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle)});
                            }
                            message = nv + ' vertices, 0 edges, ' + nv + ' components';
                        }

                        function find(x) {
                            if (parent[x] !== x) parent[x] = find(parent[x]);
                            return parent[x];
                        }

                        function union(x, y) {
                            var rx = find(x), ry = find(y);
                            if (rx === ry) return false;
                            if (rnk[rx] > rnk[ry]) parent[ry] = rx;
                            else if (rnk[rx] < rnk[ry]) parent[rx] = ry;
                            else { parent[ry] = rx; rnk[rx]++; }
                            return true;
                        }

                        function getComponents() {
                            var comps = {};
                            for (var i = 0; i < nv; i++) {
                                var r = find(i);
                                if (!comps[r]) comps[r] = [];
                                comps[r].push(i);
                            }
                            return comps;
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Connected Components', 250, 10, viz.colors.white, 14, 'center', 'top');

                            // Draw edges
                            for (var i = 0; i < edges.length; i++) {
                                var e = edges[i];
                                viz.ctx.strokeStyle = viz.colors.axis;
                                viz.ctx.lineWidth = 1.5;
                                viz.ctx.beginPath();
                                viz.ctx.moveTo(positions[e[0]].x, positions[e[0]].y);
                                viz.ctx.lineTo(positions[e[1]].x, positions[e[1]].y);
                                viz.ctx.stroke();
                            }

                            // Assign colors by component
                            var comps = getComponents();
                            var compRoots = Object.keys(comps).map(Number);
                            var colorMap = {};
                            for (var ci = 0; ci < compRoots.length; ci++) {
                                var root = compRoots[ci];
                                for (var j = 0; j < comps[root].length; j++) {
                                    colorMap[comps[root][j]] = palette[ci % palette.length];
                                }
                            }

                            // Draw nodes
                            for (var i = 0; i < nv; i++) {
                                viz.drawNode(positions[i].x, positions[i].y, 18, i, colorMap[i], viz.colors.white);
                            }

                            // Component info panel on right
                            var panelX = 520;
                            viz.screenText('Components (' + compRoots.length + '):', panelX, 40, viz.colors.white, 12, 'left', 'top');
                            for (var ci = 0; ci < compRoots.length; ci++) {
                                var root = compRoots[ci];
                                viz.ctx.fillStyle = palette[ci % palette.length];
                                viz.ctx.fillRect(panelX, 62 + ci * 22, 12, 12);
                                viz.screenText('{' + comps[root].join(',') + '}', panelX + 18, 62 + ci * 22 + 6, viz.colors.white, 11, 'left', 'middle');
                            }

                            if (message) viz.screenText(message, 350, 380, viz.colors.yellow, 11, 'center', 'top');
                        }

                        init();

                        var inputX = document.createElement('input');
                        inputX.type = 'number'; inputX.value = '0';
                        inputX.style.cssText = 'width:35px;padding:3px 4px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:3px;';
                        controls.appendChild(inputX);
                        var inputY = document.createElement('input');
                        inputY.type = 'number'; inputY.value = '1';
                        inputY.style.cssText = 'width:35px;padding:3px 4px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:3px;';
                        controls.appendChild(inputY);

                        VizEngine.createButton(controls, 'Add Edge', function() {
                            var x = parseInt(inputX.value), y = parseInt(inputY.value);
                            if (isNaN(x) || isNaN(y) || x < 0 || x >= nv || y < 0 || y >= nv || x === y) { message = 'Invalid'; draw(); return; }
                            edges.push([x, y]);
                            var merged = union(x, y);
                            var comps = getComponents();
                            message = merged ? 'Edge (' + x + ',' + y + ') merged two components. Now ' + Object.keys(comps).length + ' components.' : 'Edge (' + x + ',' + y + ') within same component.';
                            draw();
                        });

                        VizEngine.createButton(controls, 'Random Edge', function() {
                            var x = Math.floor(Math.random() * nv);
                            var y;
                            do { y = Math.floor(Math.random() * nv); } while (y === x);
                            edges.push([x, y]);
                            union(x, y);
                            var comps = getComponents();
                            message = 'Added edge (' + x + ',' + y + '). ' + Object.keys(comps).length + ' components.';
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset', function() { init(); draw(); });

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'ch11-viz-percolation',
                    title: 'Percolation Grid',
                    description: 'Open cells in a grid and check if top connects to bottom.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 400});
                        let gridSize = 12;
                        let grid = []; // 0 = blocked, 1 = open
                        let parent = [];
                        let rnk = [];
                        let topNode, botNode;
                        let message = '';

                        function idx(r, c) { return r * gridSize + c; }
                        function init() {
                            var total = gridSize * gridSize + 2;
                            topNode = gridSize * gridSize;
                            botNode = gridSize * gridSize + 1;
                            parent = [];
                            rnk = [];
                            grid = [];
                            for (var i = 0; i < total; i++) { parent.push(i); rnk.push(0); }
                            for (var i = 0; i < gridSize * gridSize; i++) grid.push(0);
                            message = 'Click "Open Random" to open cells. Does top connect to bottom?';
                        }

                        function find(x) {
                            if (parent[x] !== x) parent[x] = find(parent[x]);
                            return parent[x];
                        }

                        function union(x, y) {
                            var rx = find(x), ry = find(y);
                            if (rx === ry) return;
                            if (rnk[rx] > rnk[ry]) parent[ry] = rx;
                            else if (rnk[rx] < rnk[ry]) parent[rx] = ry;
                            else { parent[ry] = rx; rnk[rx]++; }
                        }

                        function openCell(r, c) {
                            if (grid[idx(r, c)]) return;
                            grid[idx(r, c)] = 1;
                            // Connect to neighbors
                            var dirs = [[-1,0],[1,0],[0,-1],[0,1]];
                            for (var d = 0; d < dirs.length; d++) {
                                var nr = r + dirs[d][0], nc = c + dirs[d][1];
                                if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize && grid[idx(nr, nc)]) {
                                    union(idx(r, c), idx(nr, nc));
                                }
                            }
                            // Connect top row to topNode, bottom row to botNode
                            if (r === 0) union(idx(r, c), topNode);
                            if (r === gridSize - 1) union(idx(r, c), botNode);
                        }

                        function percolates() {
                            return find(topNode) === find(botNode);
                        }

                        function draw() {
                            viz.clear();
                            var perc = percolates();
                            viz.screenText('Percolation (' + gridSize + 'x' + gridSize + ')' + (perc ? ' — PERCOLATES!' : ''), 300, 8, perc ? viz.colors.green : viz.colors.white, 14, 'center', 'top');

                            var cellSize = Math.min(28, 340 / gridSize);
                            var startX = 300 - (gridSize * cellSize) / 2;
                            var startY = 35;

                            // Find the percolation cluster
                            var topRoot = find(topNode);

                            for (var r = 0; r < gridSize; r++) {
                                for (var c = 0; c < gridSize; c++) {
                                    var px = startX + c * cellSize;
                                    var py = startY + r * cellSize;
                                    var isOpen = grid[idx(r, c)];
                                    var color;
                                    if (!isOpen) {
                                        color = '#1a1a40';
                                    } else if (perc && find(idx(r, c)) === topRoot) {
                                        color = viz.colors.blue;
                                    } else {
                                        color = '#444466';
                                    }
                                    viz.ctx.fillStyle = color;
                                    viz.ctx.fillRect(px, py, cellSize - 1, cellSize - 1);
                                }
                            }

                            // Stats
                            var openCount = grid.filter(function(x) { return x; }).length;
                            var total = gridSize * gridSize;
                            var pOpen = (openCount / total * 100).toFixed(1);
                            viz.screenText('Open: ' + openCount + '/' + total + ' (' + pOpen + '%)', 625, 50, viz.colors.text, 11, 'center', 'top');
                            viz.screenText(perc ? 'Connected!' : 'Not connected', 625, 70, perc ? viz.colors.green : viz.colors.red, 12, 'center', 'top');

                            // Threshold info
                            viz.screenText('Theoretical threshold:', 625, 120, viz.colors.text, 10, 'center', 'top');
                            viz.screenText('p* = 0.5927...', 625, 135, viz.colors.yellow, 11, 'center', 'top');

                            if (message) viz.screenText(message, 350, 385, viz.colors.yellow, 11, 'center', 'top');
                        }

                        init();

                        VizEngine.createButton(controls, 'Open Random', function() {
                            // Open 5 random cells
                            for (var i = 0; i < 5; i++) {
                                var r = Math.floor(Math.random() * gridSize);
                                var c = Math.floor(Math.random() * gridSize);
                                openCell(r, c);
                            }
                            var openCount = grid.filter(function(x) { return x; }).length;
                            message = 'Opened cells. ' + openCount + ' open total.';
                            draw();
                        });

                        VizEngine.createButton(controls, 'Open Until Percolate', function() {
                            init();
                            var order = [];
                            for (var i = 0; i < gridSize * gridSize; i++) order.push(i);
                            // Shuffle
                            for (var i = order.length - 1; i > 0; i--) {
                                var j = Math.floor(Math.random() * (i + 1));
                                var tmp = order[i]; order[i] = order[j]; order[j] = tmp;
                            }
                            var count = 0;
                            for (var k = 0; k < order.length; k++) {
                                var r = Math.floor(order[k] / gridSize);
                                var c = order[k] % gridSize;
                                openCell(r, c);
                                count++;
                                if (percolates()) break;
                            }
                            message = 'Percolated after opening ' + count + '/' + (gridSize * gridSize) + ' cells (' + (count / (gridSize * gridSize) * 100).toFixed(1) + '%)';
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset', function() { init(); draw(); });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Trace Kruskal\'s algorithm using union-find on the graph with edges: (A,B,4), (A,C,8), (B,C,11), (B,D,8), (C,D,7), (C,E,1), (D,E,6). Show which edges are added to the MST.',
                    hint: 'Sort edges by weight: 1, 4, 6, 7, 8, 8, 11. For each, check if endpoints are in different sets.',
                    solution: 'Sorted: (C,E,1), (A,B,4), (D,E,6), (C,D,7), (A,C,8), (B,D,8), (B,C,11). Process: (C,E,1): Find(C) != Find(E), add, Union(C,E). (A,B,4): add, Union(A,B). (D,E,6): Find(D) != Find(E), add, Union(D,E). Now {C,D,E} merged. (C,D,7): Find(C) = Find(D), skip. (A,C,8): Find(A) != Find(C), add, Union(A,C). Now all connected. (B,D,8): same set, skip. MST edges: (C,E,1), (A,B,4), (D,E,6), (A,C,8). Total weight = 19.'
                },
                {
                    question: 'In percolation on an \\(n \\times n\\) grid, how many union-find operations does it take to check if the system percolates after opening each cell?',
                    hint: 'Opening one cell requires at most 4 union operations (one per neighbor), plus the virtual top/bottom connections.',
                    solution: 'For each of \\(n^2\\) cells: at most 4 unions with neighbors + at most 1 union with virtual top or bottom node = at most 5 unions per cell. After each opening, check percolation with 1 Find. Total: at most \\(5n^2\\) unions + \\(n^2\\) finds = \\(O(n^2)\\) operations. With union by rank and path compression: \\(O(n^2 \\alpha(n^2))\\) total time, which is essentially \\(O(n^2)\\).'
                },
                {
                    question: 'Design an offline algorithm for the following: given a tree \\(T\\) with root \\(r\\) and \\(q\\) queries of the form LCA(u, v), compute all answers in \\(O((n + q) \\alpha(n))\\) time.',
                    hint: 'This is Tarjan\'s offline LCA algorithm. Process nodes in DFS order. When backtracking from a subtree, union the child with the parent.',
                    solution: 'Tarjan\'s offline LCA: 1) Initialize union-find with n nodes, mark all unvisited. 2) DFS from root. When visiting node u: mark u visited. For each child v: recursively visit v, then Union(u, v), set ancestor[Find(u)] = u. After visiting all children of u, for each query LCA(u, w): if w is already visited, answer is ancestor[Find(w)]. Each union-find operation is O(alpha(n)), DFS visits each node once, each query is processed once. Total: O((n + q) alpha(n)).'
                },
                {
                    question: 'Can union-find support a Split or Delete operation efficiently? Explain why or why not.',
                    hint: 'Think about what happens when you try to disconnect a subtree.',
                    solution: 'Standard union-find does not support split/delete efficiently. Path compression and union by rank are designed for merge operations only. Splitting would require undoing previous unions, but path compression destroys the original tree structure. Solutions: (1) Link-cut trees support both link and cut in O(log n) amortized. (2) For offline problems, process operations in reverse (split becomes union). (3) Persistent union-find supports rollback but with O(log n) per operation.'
                }
            ]
        }
    ]
});
