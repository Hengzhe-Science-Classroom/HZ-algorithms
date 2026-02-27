// ============================================================
//  Ch 18 · 回溯与分支定界 (Backtracking & Branch and Bound)
// ============================================================
window.CHAPTERS.push({
    id: 'ch18',
    number: 18,
    title: '回溯与分支定界',
    subtitle: 'Backtracking & Branch and Bound — Systematic Search with Pruning',
    sections: [
        // ===== Section 1: Backtracking Framework =====
        {
            id: 'ch18-sec01',
            title: '回溯算法框架',
            content: `<h2>1 回溯算法框架</h2>
<p>回溯 (backtracking) 是一种系统地搜索问题解空间的算法范式。它通过逐步构建候选解, 在发现当前路径不可能产生合法解时立即<strong>剪枝 (prune)</strong> 并回退, 从而避免对全部解空间的穷举。</p>

<div class="env-block definition">
<div class="env-title">Definition 18.1 (State-Space Tree)</div>
<div class="env-body"><p><strong>状态空间树 (state-space tree):</strong> 将问题的搜索过程表示为一棵树。根节点表示空解, 每个内部节点表示部分解, 叶节点表示完整解或死胡同。从根到叶的路径对应一种解的构建过程。</p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Generic Backtracking</div>
<div class="env-body"><p>
<strong>Backtrack(node, state):</strong><br>
1. 若 state 是完整解, 记录/返回<br>
2. 对于 state 的每个候选扩展 \\(c\\):<br>
&nbsp;&nbsp;&nbsp;&nbsp;a. 若 \\(c\\) 可行 (通过约束检查):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i. 做出选择: state \\(\\leftarrow\\) state + \\(c\\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ii. Backtrack(child, state)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;iii. 撤销选择: state \\(\\leftarrow\\) state - \\(c\\) (回溯)<br>
&nbsp;&nbsp;&nbsp;&nbsp;b. 否则剪枝 (跳过此分支)
</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 18.2 (Pruning)</div>
<div class="env-body"><p><strong>剪枝</strong>是回溯算法的核心优化: 在状态空间树中, 若当前部分解已经违反约束或不可能导致最优解, 则不再探索其子树。常见剪枝策略:</p>
<p>1. <strong>可行性剪枝:</strong> 部分解违反约束, 直接回退。</p>
<p>2. <strong>界限剪枝:</strong> 计算当前路径的上界/下界, 若不优于已知最优解, 则剪枝。</p>
<p>3. <strong>对称性剪枝:</strong> 利用问题的对称性避免搜索等价状态。</p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-backtrack-framework"></div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body"><p>回溯就像在迷宫中探路: 走到死胡同就退回上一个岔路口, 尝试另一条路。剪枝则是提前判断"这条路走不通"而不用走到底才发现。好的剪枝能将指数级搜索变为实际可行。</p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body"><p>回溯的最坏时间复杂度通常仍是指数级 (例如 \\(O(n!)\\) 或 \\(O(2^n)\\)), 但通过有效剪枝, 实际运行时间往往远小于最坏情况。分析回溯的平均复杂度通常需要考虑剪枝的效率。</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch18-viz-backtrack-framework',
                    title: '回溯搜索树: 子集枚举',
                    description: '展示回溯在子集枚举中的状态空间树和剪枝',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var elements = [1, 2, 3, 4];
                        var target = 5; // subset sum target
                        var treeNodes = [];
                        var treeEdges = [];
                        var step = 0;
                        var pruned = {};

                        function buildSubsetTree(idx, currentSum, path, x, y, spread) {
                            var id = treeNodes.length;
                            var label = path.length === 0 ? 'root' : path.join(',');
                            var isPruned = currentSum > target;
                            var isSolution = currentSum === target;
                            treeNodes.push({id: id, x: x, y: y, label: label, sum: currentSum, pruned: isPruned, solution: isSolution, depth: idx});

                            if (isPruned || idx >= elements.length) return id;

                            // Branch: include elements[idx]
                            var leftId = buildSubsetTree(idx + 1, currentSum + elements[idx], path.concat([elements[idx]]), x - spread, y + 60, spread * 0.45);
                            treeEdges.push({from: id, to: leftId, label: '+' + elements[idx]});

                            // Branch: exclude elements[idx]
                            var rightId = buildSubsetTree(idx + 1, currentSum, path.slice(), x + spread, y + 60, spread * 0.45);
                            treeEdges.push({from: id, to: rightId, label: 'skip'});

                            return id;
                        }

                        buildSubsetTree(0, 0, [], 350, 50, 160);
                        var maxNodes = treeNodes.length;

                        function draw() {
                            viz.clear();
                            viz.screenText('子集和回溯 (target = ' + target + ', 集合 = {' + elements.join(',') + '})', viz.width / 2, 18, viz.colors.white, 14, 'center');

                            var shown = Math.min(step, maxNodes);

                            // Draw edges
                            for (var i = 0; i < treeEdges.length; i++) {
                                var e = treeEdges[i];
                                if (e.from >= shown || e.to >= shown) continue;
                                var from = treeNodes[e.from];
                                var to = treeNodes[e.to];
                                var eCol = to.pruned ? viz.colors.red + '44' : viz.colors.axis;
                                viz.drawTreeEdge(from.x, from.y, to.x, to.y, eCol);
                                viz.screenText(e.label, (from.x + to.x) / 2 - 15, (from.y + to.y) / 2 - 5, viz.colors.text, 9, 'center');
                            }

                            // Draw nodes
                            for (var i = 0; i < shown; i++) {
                                var nd = treeNodes[i];
                                var col, r;
                                if (nd.solution) {
                                    col = viz.colors.green;
                                    r = 16;
                                } else if (nd.pruned) {
                                    col = viz.colors.red + '66';
                                    r = 12;
                                } else {
                                    col = viz.colors.blue;
                                    r = 14;
                                }
                                viz.drawTreeNode(nd.x, nd.y, r, nd.sum, col, viz.colors.white);
                            }

                            // Legend
                            var ly = viz.height - 35;
                            viz.drawNode(50, ly, 8, '', viz.colors.green, viz.colors.white);
                            viz.screenText('解 (sum = target)', 65, ly, viz.colors.green, 10, 'left');
                            viz.drawNode(200, ly, 8, '', viz.colors.red + '66', viz.colors.white);
                            viz.screenText('剪枝 (sum > target)', 215, ly, viz.colors.red, 10, 'left');
                            viz.drawNode(380, ly, 8, '', viz.colors.blue, viz.colors.white);
                            viz.screenText('正常节点', 395, ly, viz.colors.blue, 10, 'left');

                            viz.screenText('已探索: ' + shown + '/' + maxNodes + ' 节点', viz.width - 100, ly, viz.colors.text, 11, 'center');
                        }

                        VizEngine.createButton(controls, '下一步', function() {
                            if (step < maxNodes) { step++; draw(); }
                        });
                        VizEngine.createButton(controls, '快进5', function() {
                            step = Math.min(step + 5, maxNodes); draw();
                        });
                        VizEngine.createButton(controls, '全部展开', function() {
                            step = maxNodes; draw();
                        });
                        VizEngine.createButton(controls, '重置', function() {
                            step = 0; draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '写出生成 \\(\\{1, 2, \\ldots, n\\}\\) 的所有排列的回溯算法伪代码。分析不加剪枝时的时间复杂度。',
                    hint: '在每一层选择一个尚未使用的元素。',
                    solution: 'Permutations(perm, used, n): if |perm| = n: output perm; return. For i = 1 to n: if not used[i]: used[i] = true; perm.append(i); Permutations(perm, used, n); perm.pop(); used[i] = false. 时间复杂度: 叶节点数 = n!, 每个节点工作 O(n), 总计 O(n * n!)。'
                },
                {
                    question: '对于子集和问题 (判断集合 \\(S\\) 中是否存在子集和为 \\(T\\)), 设计两种剪枝策略并分析其效果。',
                    hint: '考虑: (1) 当前和已超过目标; (2) 当前和加上剩余所有元素仍不够。',
                    solution: '(1) **上界剪枝**: 若当前部分和 > T, 则不可能找到解, 剪枝。前提: 所有元素非负。(2) **下界剪枝**: 若当前部分和 + 剩余所有元素的和 < T, 则即使全选也不够, 剪枝。(3) **排序优化**: 将元素降序排列, 使上界剪枝更早触发。效果: 在很多实际实例上, 这两种剪枝可以将搜索空间从 O(2^n) 减少到多项式量级。'
                },
                {
                    question: '回溯和 DFS 有什么关系?',
                    hint: '回溯本质上是在隐式图上做 DFS。',
                    solution: '回溯本质上是对状态空间树的<strong>深度优先搜索 (DFS)</strong>。DFS 按深度优先的顺序遍历树的节点, 回溯在此基础上增加了<strong>剪枝</strong>: 在 DFS 过程中, 一旦发现当前节点不满足约束或不可能导向解, 就不再继续深入该子树, 直接回退到父节点。因此, 回溯 = DFS + 剪枝。若不剪枝, 回溯退化为完整的 DFS, 即暴力枚举。'
                }
            ]
        },
        // ===== Section 2: N-Queens =====
        {
            id: 'ch18-sec02',
            title: 'N 皇后问题',
            content: `<h2>2 N 皇后问题</h2>
<p>N 皇后问题是回溯算法的经典范例: 在 \\(N \\times N\\) 的棋盘上放置 \\(N\\) 个皇后, 使得任意两个皇后不同行、不同列、不同对角线。</p>

<div class="env-block definition">
<div class="env-title">Definition 18.3 (N-Queens Problem)</div>
<div class="env-body"><p>在 \\(N \\times N\\) 棋盘上放置 \\(N\\) 个皇后, 要求: (1) 每行恰好一个皇后; (2) 每列至多一个皇后; (3) 每条对角线 (正反) 至多一个皇后。</p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: N-Queens Backtracking</div>
<div class="env-body"><p>
<strong>SolveQueens(row, cols, diag1, diag2):</strong><br>
1. 若 row = N, 找到一个解, 记录并返回<br>
2. 对于 col = 0, 1, ..., N-1:<br>
&nbsp;&nbsp;&nbsp;&nbsp;若 col 不在 cols 中, 且 row-col 不在 diag1 中, 且 row+col 不在 diag2 中:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;放置皇后在 (row, col)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SolveQueens(row+1, cols+{col}, diag1+{row-col}, diag2+{row+col})<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;移除皇后 (回溯)
</p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 18.1</div>
<div class="env-body"><p>对于 \\(N \\ge 4\\), N 皇后问题有解。解的数量随 \\(N\\) 增长非常快: \\(N=4\\) 有 2 个解, \\(N=8\\) 有 92 个解, \\(N=12\\) 有 14200 个解。</p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-nqueens"></div>

<div class="env-block example">
<div class="env-title">Example 18.1</div>
<div class="env-body"><p>4 皇后的一个解: 第 0 行放在第 1 列, 第 1 行放在第 3 列, 第 2 行放在第 0 列, 第 3 行放在第 2 列。即列位置为 [1, 3, 0, 2]。</p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body"><p>N 皇后的回溯算法在最坏情况下时间为 \\(O(N!)\\), 但由于列和对角线的约束剪枝, 实际搜索的节点数远小于 \\(N^N\\) (无剪枝的暴力)。对称性剪枝 (只搜索棋盘的一半, 利用镜像/旋转) 可进一步减半搜索量。</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch18-viz-nqueens',
                    title: 'N 皇后回溯可视化',
                    description: '逐步放置皇后, 展示冲突检测和回溯过程',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450});
                        var N = 6;
                        var queens = []; // queens[row] = col
                        var history = []; // sequence of {action, row, col}
                        var histIdx = 0;
                        var solutions = [];

                        function isValid(row, col) {
                            for (var i = 0; i < row; i++) {
                                if (queens[i] === col) return false;
                                if (Math.abs(queens[i] - col) === Math.abs(i - row)) return false;
                            }
                            return true;
                        }

                        function solve() {
                            history = [];
                            solutions = [];
                            queens = [];
                            function bt(row) {
                                if (row === N) {
                                    solutions.push(queens.slice());
                                    history.push({action: 'solution', queens: queens.slice()});
                                    return;
                                }
                                for (var col = 0; col < N; col++) {
                                    history.push({action: 'try', row: row, col: col});
                                    if (isValid(row, col)) {
                                        queens[row] = col;
                                        history.push({action: 'place', row: row, col: col});
                                        bt(row + 1);
                                        history.push({action: 'remove', row: row, col: col});
                                        queens.length = row;
                                    } else {
                                        history.push({action: 'conflict', row: row, col: col});
                                    }
                                }
                            }
                            bt(0);
                        }

                        solve();

                        var currentQueens = [];
                        var currentTry = null;
                        var currentConflict = false;
                        var solutionFound = null;

                        function applyUpTo(idx) {
                            currentQueens = [];
                            currentTry = null;
                            currentConflict = false;
                            solutionFound = null;
                            for (var i = 0; i <= idx && i < history.length; i++) {
                                var h = history[i];
                                if (h.action === 'place') {
                                    currentQueens[h.row] = h.col;
                                } else if (h.action === 'remove') {
                                    currentQueens.length = h.row;
                                } else if (h.action === 'try') {
                                    currentTry = {row: h.row, col: h.col};
                                    currentConflict = false;
                                } else if (h.action === 'conflict') {
                                    currentConflict = true;
                                    currentTry = {row: h.row, col: h.col};
                                } else if (h.action === 'solution') {
                                    solutionFound = h.queens.slice();
                                }
                            }
                        }

                        function draw() {
                            viz.clear();
                            applyUpTo(histIdx);

                            viz.screenText(N + '-Queens 回溯', viz.width / 2, 18, viz.colors.white, 15, 'center');

                            var cellSize = Math.min(40, (viz.height - 100) / N);
                            var boardX = (viz.width - N * cellSize) / 2;
                            var boardY = 50;
                            var ctx = viz.ctx;

                            // Draw board
                            for (var r = 0; r < N; r++) {
                                for (var c = 0; c < N; c++) {
                                    var px = boardX + c * cellSize;
                                    var py = boardY + r * cellSize;
                                    var light = (r + c) % 2 === 0;
                                    ctx.fillStyle = light ? '#2a2a4a' : '#1a1a3a';
                                    ctx.fillRect(px, py, cellSize, cellSize);
                                    ctx.strokeStyle = viz.colors.axis + '44';
                                    ctx.lineWidth = 0.5;
                                    ctx.strokeRect(px, py, cellSize, cellSize);
                                }
                            }

                            // Highlight try position
                            if (currentTry) {
                                var tx = boardX + currentTry.col * cellSize;
                                var ty = boardY + currentTry.row * cellSize;
                                ctx.fillStyle = currentConflict ? viz.colors.red + '44' : viz.colors.yellow + '44';
                                ctx.fillRect(tx, ty, cellSize, cellSize);
                            }

                            // Draw queens
                            for (var r = 0; r < currentQueens.length; r++) {
                                if (currentQueens[r] !== undefined) {
                                    var qx = boardX + currentQueens[r] * cellSize + cellSize / 2;
                                    var qy = boardY + r * cellSize + cellSize / 2;
                                    viz.screenText('Q', qx, qy, viz.colors.green, cellSize * 0.6, 'center', 'middle');
                                }
                            }

                            // Conflict marker
                            if (currentConflict && currentTry) {
                                var cx2 = boardX + currentTry.col * cellSize + cellSize / 2;
                                var cy2 = boardY + currentTry.row * cellSize + cellSize / 2;
                                viz.screenText('X', cx2, cy2, viz.colors.red, cellSize * 0.5, 'center', 'middle');
                            }

                            // Info
                            var infoY = boardY + N * cellSize + 20;
                            viz.screenText('Step ' + histIdx + '/' + (history.length - 1), viz.width / 2, infoY, viz.colors.text, 12, 'center');
                            viz.screenText('已找到 ' + solutions.length + ' 个解', viz.width / 2, infoY + 22, viz.colors.teal, 12, 'center');

                            if (solutionFound) {
                                viz.screenText('Solution: [' + solutionFound.join(', ') + ']', viz.width / 2, infoY + 44, viz.colors.green, 13, 'center');
                            }
                        }

                        VizEngine.createButton(controls, '下一步', function() {
                            if (histIdx < history.length - 1) { histIdx++; draw(); }
                        });
                        VizEngine.createButton(controls, '快进10', function() {
                            histIdx = Math.min(histIdx + 10, history.length - 1); draw();
                        });
                        VizEngine.createButton(controls, '到下一个解', function() {
                            for (var i = histIdx + 1; i < history.length; i++) {
                                if (history[i].action === 'solution') { histIdx = i; draw(); return; }
                            }
                        });
                        VizEngine.createButton(controls, '重置', function() {
                            histIdx = 0; draw();
                        });
                        VizEngine.createSlider(controls, 'N', 4, 8, N, 1, function(v) {
                            N = Math.round(v); solve(); histIdx = 0; draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '对于 8 皇后问题, 不加任何剪枝的暴力搜索需要检查多少种放置? 加上列约束后呢? 加上对角线约束后约能减少多少?',
                    hint: '暴力: \\(N^N\\) 种放置。列约束: \\(N!\\) 种排列。',
                    solution: '不加剪枝: \\(8^8 = 16,777,216\\) 种 (每行 8 个选择, 8 行)。加上列约束 (每列至多一个): \\(8! = 40,320\\) 种排列。加上对角线约束后, 实际只需检查约 15,720 个节点 (通过回溯统计), 比 \\(8!\\) 又减少约 61%。最终只有 92 个解。'
                },
                {
                    question: '如何利用对称性将 N 皇后的搜索量减半? 具体来说, 对于 8 皇后, 设第一行的皇后在第 \\(c\\) 列, 只搜索 \\(c \\le 3\\) 的情况是否足够?',
                    hint: '利用棋盘的左右镜像对称。',
                    solution: '8x8 棋盘关于中线左右对称。如果限制第一行皇后放在左半部分 (\\(c \\le 3\\)), 那么右半部分的解可以通过镜像得到。但注意: 当 \\(c = 3\\) 或 \\(c = 4\\) (中间位置) 时, 镜像可能与自身相同 (中心对称解), 需要避免重复计数。具体: 只搜 \\(c = 0, 1, 2, 3\\), 对每个找到的解判断其镜像是否与自身相同; 非自对称解的贡献乘 2, 自对称解贡献不变。这样搜索量约减半。'
                },
                {
                    question: '将 N 皇后扩展为 N 皇后完成问题 (N-Queens Completion): 给定棋盘上已放置了一些皇后, 判断能否补全为 N 皇后的解。这个问题的计算复杂度是什么?',
                    hint: '这是一个著名的 NP 完全问题。',
                    solution: 'N 皇后完成问题是 NP 完全的 (Gent et al., 2017)。即使 N 皇后问题本身对于空棋盘总有解, 但当部分皇后已经固定时, 判断是否能完成是 NP 完全的。这意味着 (除非 P=NP) 不存在多项式时间算法, 回溯是实际求解的主要方法。'
                }
            ]
        },
        // ===== Section 3: Subset Sum & Graph Coloring =====
        {
            id: 'ch18-sec03',
            title: '子集和与图着色',
            content: `<h2>3 子集和与图着色</h2>

<h3>3.1 子集和 (Subset Sum)</h3>
<p>给定集合 \\(S = \\{s_1, \\ldots, s_n\\}\\) 和目标值 \\(T\\), 判断是否存在 \\(S\\) 的子集, 其元素和恰好为 \\(T\\)。</p>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Subset Sum Backtracking</div>
<div class="env-body"><p>
<strong>SubsetSum(idx, currentSum, remaining):</strong><br>
1. 若 currentSum = T, 找到解, 返回 true<br>
2. 若 idx = n 或 currentSum > T, 返回 false (剪枝 1: 超过目标)<br>
3. 若 currentSum + remaining < T, 返回 false (剪枝 2: 不够)<br>
4. 选择 \\(s_{\\text{idx}}\\): return SubsetSum(idx+1, currentSum + \\(s_{\\text{idx}}\\), remaining - \\(s_{\\text{idx}}\\))<br>
5. 不选 \\(s_{\\text{idx}}\\): return SubsetSum(idx+1, currentSum, remaining - \\(s_{\\text{idx}}\\))
</p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-subset-sum"></div>

<h3>3.2 图着色 (Graph Coloring)</h3>
<p>给定无向图 \\(G = (V, E)\\) 和 \\(k\\) 种颜色, 给每个顶点着色使得相邻顶点颜色不同。判断是否存在合法的 \\(k\\)-着色。</p>

<div class="env-block definition">
<div class="env-title">Definition 18.4 (Graph k-Coloring)</div>
<div class="env-body"><p>\\(k\\)-着色: 函数 \\(c: V \\to \\{1, 2, \\ldots, k\\}\\), 使得 \\(\\forall (u,v) \\in E, c(u) \\ne c(v)\\)。图的<strong>色数 (chromatic number)</strong> \\(\\chi(G)\\) 是最小的合法 \\(k\\)。</p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Graph Coloring Backtracking</div>
<div class="env-body"><p>
<strong>ColorGraph(v):</strong><br>
1. 若 v = |V|, 所有顶点已着色, 返回 true<br>
2. 对于颜色 c = 1, 2, ..., k:<br>
&nbsp;&nbsp;&nbsp;&nbsp;若颜色 c 与 v 的所有已着色邻居不冲突:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;color[v] = c<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;若 ColorGraph(v+1), 返回 true<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;color[v] = 0 (回溯)
</p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-graph-coloring"></div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body"><p>图 \\(k\\)-着色判定问题对 \\(k \\ge 3\\) 是 NP 完全的。回溯在实际中的效率取决于顶点排序 (启发式: 先着色度数高的顶点) 和颜色选择顺序。</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch18-viz-subset-sum',
                    title: '子集和回溯树',
                    description: '展示子集和搜索的状态空间树, 灰色表示被剪枝的分支',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var S = [3, 5, 6, 7];
                        var T = 15;
                        var treeData = [];
                        var edgeData = [];

                        function buildTree() {
                            treeData = [];
                            edgeData = [];
                            var remaining = S.reduce(function(a, b) { return a + b; }, 0);

                            function bt(idx, sum, rem, x, y, spread) {
                                var id = treeData.length;
                                var pruned = sum > T;
                                var hopeless = sum + rem < T;
                                var solution = sum === T;
                                treeData.push({id: id, x: x, y: y, sum: sum, idx: idx, pruned: pruned || hopeless, solution: solution, hopeless: hopeless});

                                if (solution || pruned || hopeless || idx >= S.length) return id;

                                // Include S[idx]
                                var leftId = bt(idx + 1, sum + S[idx], rem - S[idx], x - spread, y + 65, spread * 0.45);
                                edgeData.push({from: id, to: leftId, label: '+' + S[idx]});

                                // Exclude S[idx]
                                var rightId = bt(idx + 1, sum, rem - S[idx], x + spread, y + 65, spread * 0.45);
                                edgeData.push({from: id, to: rightId, label: 'skip'});

                                return id;
                            }

                            bt(0, 0, remaining, 350, 45, 160);
                        }

                        buildTree();
                        var showAll = true;

                        function draw() {
                            viz.clear();
                            viz.screenText('子集和回溯 (S={' + S.join(',') + '}, T=' + T + ')', viz.width / 2, 18, viz.colors.white, 14, 'center');

                            // Draw edges
                            for (var i = 0; i < edgeData.length; i++) {
                                var e = edgeData[i];
                                var from = treeData[e.from];
                                var to = treeData[e.to];
                                var col = to.pruned ? viz.colors.text + '33' : viz.colors.axis;
                                viz.drawTreeEdge(from.x, from.y, to.x, to.y, col);
                                var labelCol = to.pruned ? viz.colors.text + '33' : viz.colors.text;
                                viz.screenText(e.label, (from.x + to.x) / 2 + (to.x > from.x ? 10 : -10), (from.y + to.y) / 2, labelCol, 9, 'center');
                            }

                            // Draw nodes
                            for (var i = 0; i < treeData.length; i++) {
                                var nd = treeData[i];
                                var col, r;
                                if (nd.solution) {
                                    col = viz.colors.green; r = 16;
                                } else if (nd.pruned && nd.hopeless) {
                                    col = viz.colors.orange + '44'; r = 12;
                                } else if (nd.pruned) {
                                    col = viz.colors.red + '44'; r = 12;
                                } else {
                                    col = viz.colors.blue; r = 14;
                                }
                                viz.drawTreeNode(nd.x, nd.y, r, nd.sum, col, viz.colors.white);
                            }

                            // Legend
                            var ly = viz.height - 30;
                            viz.drawNode(30, ly, 7, '', viz.colors.green);
                            viz.screenText('解', 44, ly, viz.colors.green, 10, 'left');
                            viz.drawNode(80, ly, 7, '', viz.colors.red + '44');
                            viz.screenText('sum>T', 94, ly, viz.colors.red, 10, 'left');
                            viz.drawNode(160, ly, 7, '', viz.colors.orange + '44');
                            viz.screenText('sum+rem<T', 174, ly, viz.colors.orange, 10, 'left');
                            viz.drawNode(270, ly, 7, '', viz.colors.blue);
                            viz.screenText('正常', 284, ly, viz.colors.blue, 10, 'left');

                            var totalNodes = treeData.length;
                            var prunedCount = treeData.filter(function(n) { return n.pruned; }).length;
                            viz.screenText('总节点: ' + totalNodes + ', 剪枝: ' + prunedCount + ' (' + Math.round(prunedCount / totalNodes * 100) + '%)', viz.width - 150, ly, viz.colors.text, 11, 'center');
                        }

                        VizEngine.createSlider(controls, 'Target', 5, 21, T, 1, function(v) {
                            T = Math.round(v); buildTree(); draw();
                        });

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'ch18-viz-graph-coloring',
                    title: '图着色回溯',
                    description: '逐步为图的顶点着色, 展示冲突检测和回溯',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var nodes = [
                            {id: 0, x: 200, y: 80, label: 'A'},
                            {id: 1, x: 400, y: 80, label: 'B'},
                            {id: 2, x: 500, y: 200, label: 'C'},
                            {id: 3, x: 350, y: 310, label: 'D'},
                            {id: 4, x: 150, y: 200, label: 'E'}
                        ];
                        var edges = [
                            [0,1],[0,4],[1,2],[1,3],[2,3],[3,4],[0,3]
                        ];
                        var adj = [];
                        for (var i = 0; i < nodes.length; i++) adj[i] = [];
                        for (var i = 0; i < edges.length; i++) {
                            adj[edges[i][0]].push(edges[i][1]);
                            adj[edges[i][1]].push(edges[i][0]);
                        }
                        var nColors = 3;
                        var colorNames = ['', viz.colors.red, viz.colors.green, viz.colors.blue];
                        var colorLabels = ['', 'R', 'G', 'B'];
                        var coloring = new Array(nodes.length).fill(0);
                        var history2 = [];
                        var histIdx2 = 0;

                        function solve2() {
                            history2 = [];
                            coloring = new Array(nodes.length).fill(0);
                            function bt(v) {
                                if (v === nodes.length) {
                                    history2.push({action: 'solution', coloring: coloring.slice()});
                                    return true;
                                }
                                for (var c = 1; c <= nColors; c++) {
                                    history2.push({action: 'try', vertex: v, color: c});
                                    var ok = true;
                                    for (var ni = 0; ni < adj[v].length; ni++) {
                                        if (coloring[adj[v][ni]] === c) { ok = false; break; }
                                    }
                                    if (ok) {
                                        coloring[v] = c;
                                        history2.push({action: 'assign', vertex: v, color: c, coloring: coloring.slice()});
                                        if (bt(v + 1)) return true;
                                        coloring[v] = 0;
                                        history2.push({action: 'undo', vertex: v});
                                    } else {
                                        history2.push({action: 'conflict', vertex: v, color: c});
                                    }
                                }
                                return false;
                            }
                            bt(0);
                        }

                        solve2();
                        var curColoring = new Array(nodes.length).fill(0);
                        var curTry = null;
                        var curConflict = false;
                        var solutionColoring = null;

                        function applyHist(idx) {
                            curColoring = new Array(nodes.length).fill(0);
                            curTry = null;
                            curConflict = false;
                            solutionColoring = null;
                            for (var i = 0; i <= idx && i < history2.length; i++) {
                                var h = history2[i];
                                if (h.action === 'assign') {
                                    curColoring = h.coloring.slice();
                                    curTry = null;
                                } else if (h.action === 'undo') {
                                    curColoring[h.vertex] = 0;
                                    curTry = null;
                                } else if (h.action === 'try') {
                                    curTry = {vertex: h.vertex, color: h.color};
                                    curConflict = false;
                                } else if (h.action === 'conflict') {
                                    curTry = {vertex: h.vertex, color: h.color};
                                    curConflict = true;
                                } else if (h.action === 'solution') {
                                    solutionColoring = h.coloring.slice();
                                    curColoring = h.coloring.slice();
                                }
                            }
                        }

                        function draw() {
                            viz.clear();
                            applyHist(histIdx2);
                            viz.screenText('图着色回溯 (' + nColors + ' 色)', viz.width / 2, 18, viz.colors.white, 14, 'center');

                            // Draw edges
                            for (var i = 0; i < edges.length; i++) {
                                var u = edges[i][0], v = edges[i][1];
                                viz.drawEdge(nodes[u].x, nodes[u].y, nodes[v].x, nodes[v].y, viz.colors.axis, false);
                            }

                            // Draw nodes
                            for (var i = 0; i < nodes.length; i++) {
                                var nd = nodes[i];
                                var c = curColoring[i];
                                var col = c > 0 ? colorNames[c] : viz.colors.axis + '44';
                                var label = nd.label + (c > 0 ? '(' + colorLabels[c] + ')' : '');
                                var r2 = 24;
                                if (curTry && curTry.vertex === i) {
                                    if (curConflict) {
                                        viz.drawNode(nd.x, nd.y, r2 + 5, '', viz.colors.red + '44');
                                    } else {
                                        viz.drawNode(nd.x, nd.y, r2 + 5, '', viz.colors.yellow + '44');
                                    }
                                }
                                viz.drawNode(nd.x, nd.y, r2, label, col, viz.colors.white);
                            }

                            // Info
                            viz.screenText('Step ' + histIdx2 + '/' + (history2.length - 1), viz.width / 2, 370, viz.colors.text, 12, 'center');
                            if (solutionColoring) {
                                viz.screenText('Solution found!', viz.width / 2, 395, viz.colors.green, 14, 'center');
                            }
                        }

                        VizEngine.createButton(controls, '下一步', function() {
                            if (histIdx2 < history2.length - 1) { histIdx2++; draw(); }
                        });
                        VizEngine.createButton(controls, '快进5', function() {
                            histIdx2 = Math.min(histIdx2 + 5, history2.length - 1); draw();
                        });
                        VizEngine.createButton(controls, '到解', function() {
                            for (var i = histIdx2 + 1; i < history2.length; i++) {
                                if (history2[i].action === 'solution') { histIdx2 = i; draw(); return; }
                            }
                            histIdx2 = history2.length - 1; draw();
                        });
                        VizEngine.createButton(controls, '重置', function() {
                            histIdx2 = 0; draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '对于集合 \\(S = \\{2, 5, 8, 11, 14\\}\\) 和目标 \\(T = 19\\), 画出回溯搜索树 (标注剪枝), 找出所有解。',
                    hint: '对每个元素决定选或不选。上界剪枝: sum > 19; 下界剪枝: sum + remaining < 19。',
                    solution: '所有解: {5, 14} (和=19), {8, 11} (和=19), {2, 5, 8} (和=15, 不是), ... 只有 {5, 14} 和 {8, 11} 和为 19。剪枝示例: 选 2+5+8=15 后, 下一个选 11 得 26>19 剪枝; 选 2+5=7, remaining=25, 7+25=32>=19 继续; 选 2+5+8+11=26>19 剪枝。'
                },
                {
                    question: '证明: 对于完全图 \\(K_n\\), 色数 \\(\\chi(K_n) = n\\)。',
                    hint: '\\(K_n\\) 中每对顶点都相邻。',
                    solution: '\\(\\chi(K_n) \\ge n\\): 在 \\(K_n\\) 中, 任意两个顶点都相邻, 因此没有两个顶点可以共用同一颜色。n 个顶点需要 n 种不同颜色。\\(\\chi(K_n) \\le n\\): 给第 \\(i\\) 个顶点着第 \\(i\\) 种颜色, 这是合法的 n-着色。因此 \\(\\chi(K_n) = n\\)。'
                },
                {
                    question: '图着色的回溯算法中, 顶点排序策略对性能有重大影响。比较以下策略: (a) 任意顺序; (b) 按度数递减; (c) DSatur (最饱和度优先)。',
                    hint: 'DSatur: 优先着色"已着色邻居使用颜色种类数"最多的顶点。',
                    solution: '(a) 任意顺序: 最简单但效率最低, 可能在低度顶点上浪费大量搜索。(b) 度数递减: 先处理约束最强的顶点, 提前发现冲突, 剪枝效果好。(c) DSatur: 动态选择"饱和度"(相邻已用颜色数) 最高的顶点, 通常比静态度数排序更好, 因为它适应当前着色状态。实验表明 DSatur 在大多数实例上优于固定顺序。平均减少搜索节点数可达数量级。'
                }
            ]
        },
        // ===== Section 4: Branch and Bound =====
        {
            id: 'ch18-sec04',
            title: '分支定界',
            content: `<h2>4 分支定界</h2>
<p>分支定界 (Branch and Bound, B&B) 是回溯的增强版, 专门用于<strong>优化问题</strong>。它不仅通过约束剪枝, 还通过<strong>界限函数 (bounding function)</strong> 来估计子树中可能的最优值, 若估计值不优于当前已知最优解, 则整棵子树被剪掉。</p>

<div class="env-block definition">
<div class="env-title">Definition 18.5 (Branch and Bound)</div>
<div class="env-body"><p>分支定界由三部分组成:</p>
<p>1. <strong>分支 (Branch):</strong> 将问题分解为若干子问题 (状态空间树的子节点)。</p>
<p>2. <strong>定界 (Bound):</strong> 对每个子问题计算目标函数的<strong>上界</strong> (最大化问题) 或<strong>下界</strong> (最小化问题)。</p>
<p>3. <strong>剪枝 (Prune):</strong> 若某子问题的界不优于当前最优解 (称为 <strong>incumbent</strong>), 则剪去该子树。</p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 18.2</div>
<div class="env-body"><p>分支定界算法总是找到最优解 (若存在)。证明: 最优解所在的分支永远不会被剪掉, 因为其界至少等于最优值, 不劣于 incumbent。</p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Generic B&B (Maximization)</div>
<div class="env-body"><p>
1. 初始化: best = \\(-\\infty\\), 将根节点加入活节点表 (优先队列, 按上界排序)<br>
2. 当活节点表非空:<br>
&nbsp;&nbsp;&nbsp;&nbsp;取出上界最大的节点 \\(v\\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;若 \\(v\\) 是叶节点 (完整解):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;若 value(v) > best, 更新 best<br>
&nbsp;&nbsp;&nbsp;&nbsp;否则:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对 \\(v\\) 的每个子节点 \\(u\\):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计算 bound(u)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;若 bound(u) > best, 将 \\(u\\) 加入活节点表<br>
3. 返回 best
</p></div>
</div>

<div class="env-block warning">
<div class="env-title">Warning</div>
<div class="env-body"><p>界限函数的质量至关重要: 越紧的界剪枝越多, 但计算界本身的代价也要考虑。理想的界限函数应该既紧又快。</p></div>
</div>

<div class="env-block example">
<div class="env-title">Example 18.2 (0-1 Knapsack B&B)</div>
<div class="env-body"><p>对 0-1 背包, 上界可用<strong>分数松弛</strong>: 在当前部分解的基础上, 用分数背包贪心估计剩余容量能获得的最大价值。这个上界是紧的 (等于 LP 松弛值), 且计算只需 \\(O(n)\\)。</p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-bnb-knapsack"></div>`,
            visualizations: [
                {
                    id: 'ch18-viz-bnb-knapsack',
                    title: '0-1 背包的分支定界',
                    description: '展示 B&B 搜索树, 标注上界和剪枝',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 440});
                        var items = [
                            {name: 'A', v: 40, w: 2},
                            {name: 'B', v: 30, w: 5},
                            {name: 'C', v: 50, w: 10},
                            {name: 'D', v: 10, w: 5}
                        ];
                        var W = 16;
                        // Sort by value density
                        items.sort(function(a, b) { return (b.v / b.w) - (a.v / a.w); });

                        function fractionalBound(idx, curW, curV) {
                            var bound = curV;
                            var remW = W - curW;
                            for (var i = idx; i < items.length && remW > 0; i++) {
                                if (items[i].w <= remW) {
                                    bound += items[i].v;
                                    remW -= items[i].w;
                                } else {
                                    bound += items[i].v * (remW / items[i].w);
                                    remW = 0;
                                }
                            }
                            return bound;
                        }

                        var treeNodes3 = [];
                        var treeEdges3 = [];
                        var bestVal = 0;

                        function buildBnBTree(idx, curW, curV, x, y, spread) {
                            var id = treeNodes3.length;
                            var bound = fractionalBound(idx, curW, curV);
                            var pruned = bound <= bestVal && idx < items.length;
                            var overweight = curW > W;
                            var isLeaf = idx >= items.length;

                            if (!overweight && curV > bestVal) bestVal = curV;

                            treeNodes3.push({
                                id: id, x: x, y: y, value: curV, weight: curW,
                                bound: Math.round(bound * 10) / 10,
                                pruned: pruned || overweight, isLeaf: isLeaf,
                                overweight: overweight, isBest: false
                            });

                            if (pruned || overweight || isLeaf) return id;

                            // Include item[idx]
                            var leftId = buildBnBTree(idx + 1, curW + items[idx].w, curV + items[idx].v, x - spread, y + 70, spread * 0.48);
                            treeEdges3.push({from: id, to: leftId, label: '+' + items[idx].name});

                            // Exclude item[idx]
                            var rightId = buildBnBTree(idx + 1, curW, curV, x + spread, y + 70, spread * 0.48);
                            treeEdges3.push({from: id, to: rightId, label: 'skip'});

                            return id;
                        }

                        buildBnBTree(0, 0, 0, 350, 50, 165);
                        // Mark best
                        for (var i = 0; i < treeNodes3.length; i++) {
                            if (treeNodes3[i].value === bestVal && !treeNodes3[i].overweight) {
                                treeNodes3[i].isBest = true;
                            }
                        }

                        var showN = 0;

                        function draw() {
                            viz.clear();
                            viz.screenText('0-1 背包 B&B (W=' + W + ')', viz.width / 2, 15, viz.colors.white, 14, 'center');
                            viz.screenText('Items: ' + items.map(function(it){ return it.name + '(v=' + it.v + ',w=' + it.w + ')'; }).join(', '), viz.width / 2, 35, viz.colors.text, 10, 'center');

                            var shown = showN === 0 ? treeNodes3.length : Math.min(showN, treeNodes3.length);

                            // Edges
                            for (var i = 0; i < treeEdges3.length; i++) {
                                var e = treeEdges3[i];
                                if (e.from >= shown || e.to >= shown) continue;
                                var from = treeNodes3[e.from];
                                var to = treeNodes3[e.to];
                                var col = to.pruned ? viz.colors.text + '33' : viz.colors.axis;
                                viz.drawTreeEdge(from.x, from.y, to.x, to.y, col);
                                viz.screenText(e.label, (from.x + to.x) / 2 + (to.x > from.x ? 12 : -12), (from.y + to.y) / 2, viz.colors.text, 8, 'center');
                            }

                            // Nodes
                            for (var i = 0; i < shown; i++) {
                                var nd = treeNodes3[i];
                                var col, r;
                                if (nd.isBest) {
                                    col = viz.colors.green; r = 18;
                                } else if (nd.overweight) {
                                    col = viz.colors.red + '55'; r = 14;
                                } else if (nd.pruned) {
                                    col = viz.colors.text + '44'; r = 14;
                                } else {
                                    col = viz.colors.blue; r = 15;
                                }
                                viz.drawTreeNode(nd.x, nd.y, r, nd.value, col, viz.colors.white);
                                // Show bound
                                if (!nd.overweight && !nd.isLeaf) {
                                    viz.screenText('ub:' + nd.bound, nd.x, nd.y + r + 10, viz.colors.yellow, 8, 'center');
                                }
                                if (nd.overweight) {
                                    viz.screenText('w>' + W, nd.x, nd.y + r + 10, viz.colors.red, 8, 'center');
                                }
                            }

                            // Legend
                            var ly = viz.height - 25;
                            viz.drawNode(30, ly, 7, '', viz.colors.green);
                            viz.screenText('最优', 44, ly, viz.colors.green, 10, 'left');
                            viz.drawNode(90, ly, 7, '', viz.colors.red + '55');
                            viz.screenText('超重', 104, ly, viz.colors.red, 10, 'left');
                            viz.drawNode(160, ly, 7, '', viz.colors.text + '44');
                            viz.screenText('界限剪枝', 174, ly, viz.colors.text, 10, 'left');

                            viz.screenText('最优值: ' + bestVal, viz.width - 100, ly, viz.colors.green, 13, 'center');
                        }

                        VizEngine.createButton(controls, '逐步展开', function() {
                            if (showN < treeNodes3.length) { showN++; draw(); }
                        });
                        VizEngine.createButton(controls, '全部展开', function() {
                            showN = 0; draw();
                        });
                        VizEngine.createButton(controls, '重置', function() {
                            showN = 1; draw();
                        });

                        showN = 0;
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '解释分支定界中"界限函数"的作用。对于最小化问题, 应该计算什么界? 为什么?',
                    hint: '最小化: 下界。若子问题的下界已经不小于当前最优, 则无需继续。',
                    solution: '对于最小化问题, 应计算每个子问题的<strong>下界</strong>。原因: 下界是子问题可能达到的最小值的乐观估计。若子问题的下界 >= 当前已知最优解 (incumbent), 则该子问题中不可能有更好的解, 可以安全剪枝。下界越紧 (越接近实际最优), 剪枝效果越好。类比: 最大化问题计算上界, 若上界 <= incumbent 则剪枝。'
                },
                {
                    question: '为 0-1 背包的分支定界设计界限函数。解释为什么"分数松弛上界"是有效的。',
                    hint: '分数松弛允许取物品的一部分, 其最优值 >= 0-1 背包的最优值。',
                    solution: '上界: 在当前已选物品的基础上, 对剩余物品按性价比排序, 用分数背包贪心来估计。这个上界有效是因为: (1) 分数背包的最优值 >= 0-1 背包的最优值 (松弛约束得到更大可行域); (2) 分数背包可以 O(n) 时间贪心求解, 计算代价低; (3) 这个上界等于 LP 松弛值, 通常比较紧。若上界 <= 当前最优值 (incumbent), 则该分支不可能超过 incumbent, 可以剪枝。'
                },
                {
                    question: '比较分支定界的不同搜索策略: (a) 最佳优先 (Best-First); (b) 深度优先 (DFS); (c) 广度优先 (BFS)。各有什么优缺点?',
                    hint: '考虑: 找到最优解的速度、内存使用、剪枝效果。',
                    solution: '(a) **最佳优先 (按界排序的优先队列)**: 优先展开最有希望的节点。优点: 通常最快找到最优解, 剪枝效果最好。缺点: 内存消耗大 (活节点表可能很大)。(b) **DFS**: 尽快到达叶节点获得可行解 (incumbent)。优点: 内存消耗小 (O(depth)), 早期获得 incumbent 有助于剪枝。缺点: 可能先探索差的分支。(c) **BFS**: 按层展开。优点: 最先找到最浅的解。缺点: 内存消耗最大, 剪枝效果差 (incumbent 更新慢)。实际中常用 best-first 或 DFS with best-first restarts 的混合策略。'
                }
            ]
        },
        // ===== Section 5: TSP via B&B =====
        {
            id: 'ch18-sec05',
            title: 'TSP 的分支定界',
            content: `<h2>5 TSP 的分支定界</h2>
<p>旅行商问题 (TSP) 是分支定界最经典的应用之一。虽然 TSP 是 NP-hard 的, 但 B&B 通过好的下界函数可以在实际中求解相当规模的实例。</p>

<div class="env-block definition">
<div class="env-title">Definition 18.6 (TSP)</div>
<div class="env-body"><p>给定 \\(n\\) 个城市和两两之间的距离矩阵 \\(d[i][j]\\), 求一条访问所有城市恰好一次并返回起点的最短回路 (哈密顿回路)。</p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: TSP Branch and Bound</div>
<div class="env-body"><p>
<strong>分支策略:</strong> 在部分路径 \\((v_1, \\ldots, v_k)\\) 后, 分支到下一个未访问的城市。<br><br>
<strong>下界函数 (Reduced Cost Matrix):</strong><br>
1. 从距离矩阵中, 对每行减去行最小值, 对每列减去列最小值<br>
2. 所有减去的值之和 = <strong>归约代价 (reduction cost)</strong><br>
3. 下界 = 当前路径代价 + 归约代价<br><br>
此下界是 TSP 最优值的有效下界, 因为任何哈密顿回路在每行每列恰好有一个 "1", 归约不会排除任何可行解。
</p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-tsp-bnb"></div>

<div class="env-block theorem">
<div class="env-title">Theorem 18.3</div>
<div class="env-body"><p>TSP 的分支定界在最坏情况下仍然是指数时间, 但通过好的下界和搜索策略, 可以在合理时间内精确求解数百甚至上千个城市的实例 (结合 Held-Karp 下界和 cutting planes)。</p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark: 更强的下界</div>
<div class="env-body"><p>更高质量的 TSP 下界包括:<br>
1. <strong>1-tree bound (Held-Karp):</strong> 基于最小生成树, 是 LP 松弛的对偶, 通常非常紧。<br>
2. <strong>LP relaxation:</strong> 将整数约束松弛为连续约束, 用线性规划求解。<br>
实际的 TSP 求解器 (如 Concorde) 结合了 B&B、cutting planes 和启发式, 能精确求解数万城市的实例。</p></div>
</div>

<div class="env-block example">
<div class="env-title">Example 18.3</div>
<div class="env-body"><p>对于 5 个城市的 TSP, B&B 通常只需探索状态空间树的一小部分 (几十个节点), 而暴力需要 \\((5-1)!/2 = 12\\) 条回路。对于更大的实例, 差距急剧增大。</p></div>
</div>

<div class="viz-placeholder" data-viz="ch18-viz-tsp-tour"></div>

<div class="env-block intuition">
<div class="env-title">Intuition: Backtracking vs B&B vs DP for TSP</div>
<div class="env-body"><p>三种方法都能精确求解 TSP, 但适用场景不同:</p>
<p><strong>纯回溯:</strong> 简单但慢, 适合 \\(n \\le 12\\) 左右。</p>
<p><strong>B&B:</strong> 加上好的下界后, 可处理 \\(n \\le 30-50\\); 实际中结合高级技术可更大。</p>
<p><strong>位掩码 DP (Held-Karp):</strong> 时间 \\(O(2^n n^2)\\), 空间 \\(O(2^n n)\\), 适合 \\(n \\le 20\\) (内存限制)。</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch18-viz-tsp-bnb',
                    title: 'TSP 分支定界搜索树',
                    description: '展示 B&B 如何通过下界剪枝搜索 TSP 的解空间',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 440});

                        var cities = ['A', 'B', 'C', 'D', 'E'];
                        var nC = cities.length;
                        var dist = [
                            [0, 20, 30, 10, 11],
                            [15, 0, 16, 4, 2],
                            [3, 5, 0, 2, 4],
                            [19, 6, 18, 0, 3],
                            [16, 4, 7, 16, 0]
                        ];

                        // B&B with reduction bound
                        var bnbNodes = [];
                        var bnbEdges = [];
                        var bestTour = null;
                        var bestCost = Infinity;

                        function reduceBound(matrix, n2) {
                            var cost = 0;
                            // Row reduction
                            for (var i = 0; i < n2; i++) {
                                var mn = Infinity;
                                for (var j = 0; j < n2; j++) {
                                    if (matrix[i][j] < mn) mn = matrix[i][j];
                                }
                                if (mn !== Infinity && mn > 0) {
                                    cost += mn;
                                    for (var j = 0; j < n2; j++) {
                                        if (matrix[i][j] !== Infinity) matrix[i][j] -= mn;
                                    }
                                }
                            }
                            // Col reduction
                            for (var j = 0; j < n2; j++) {
                                var mn2 = Infinity;
                                for (var i = 0; i < n2; i++) {
                                    if (matrix[i][j] < mn2) mn2 = matrix[i][j];
                                }
                                if (mn2 !== Infinity && mn2 > 0) {
                                    cost += mn2;
                                    for (var i = 0; i < n2; i++) {
                                        if (matrix[i][j] !== Infinity) matrix[i][j] -= mn2;
                                    }
                                }
                            }
                            return cost;
                        }

                        function solveTSP() {
                            bnbNodes = [];
                            bnbEdges = [];
                            bestCost = Infinity;
                            bestTour = null;

                            // Simple DFS B&B
                            function bt(path, visited, cost, x, y, spread) {
                                var id = bnbNodes.length;
                                var last = path[path.length - 1];

                                // Lower bound: cost + sum of min outgoing edges for unvisited
                                var lb = cost;
                                for (var i = 0; i < nC; i++) {
                                    if (visited[i] && i !== last) continue;
                                    var minOut = Infinity;
                                    for (var j = 0; j < nC; j++) {
                                        if (i === j) continue;
                                        if (visited[j] && j !== 0) continue;
                                        if (path.length === nC && j !== 0) continue;
                                        minOut = Math.min(minOut, dist[i][j]);
                                    }
                                    if (minOut !== Infinity) lb += minOut;
                                }

                                var pruned = lb >= bestCost && path.length < nC;
                                var isComplete = path.length === nC;
                                var totalCost = isComplete ? cost + dist[last][0] : cost;

                                if (isComplete && totalCost < bestCost) {
                                    bestCost = totalCost;
                                    bestTour = path.slice();
                                }

                                bnbNodes.push({
                                    id: id, x: x, y: y,
                                    path: path.slice(),
                                    cost: cost,
                                    lb: Math.round(lb),
                                    pruned: pruned,
                                    isComplete: isComplete,
                                    totalCost: totalCost,
                                    isBest: false
                                });

                                if (pruned || isComplete) return id;

                                var childSpread = spread / Math.max(1, nC - path.length);
                                var childX = x - spread / 2;
                                var childCount = 0;
                                for (var next = 0; next < nC; next++) {
                                    if (visited[next]) continue;
                                    visited[next] = true;
                                    path.push(next);
                                    var cx = childX + childCount * childSpread;
                                    var childId = bt(path, visited, cost + dist[last][next], cx, y + 65, childSpread * 0.7);
                                    bnbEdges.push({from: id, to: childId, label: cities[next]});
                                    path.pop();
                                    visited[next] = false;
                                    childCount++;
                                }

                                return id;
                            }

                            var visited0 = new Array(nC).fill(false);
                            visited0[0] = true;
                            bt([0], visited0, 0, 350, 40, 300);

                            // Mark best
                            for (var i = 0; i < bnbNodes.length; i++) {
                                if (bnbNodes[i].isComplete && bnbNodes[i].totalCost === bestCost) {
                                    bnbNodes[i].isBest = true;
                                }
                            }
                        }

                        solveTSP();

                        function draw() {
                            viz.clear();
                            viz.screenText('TSP 分支定界 (5 城市)', viz.width / 2, 15, viz.colors.white, 14, 'center');

                            // Draw edges
                            for (var i = 0; i < bnbEdges.length; i++) {
                                var e = bnbEdges[i];
                                var from = bnbNodes[e.from];
                                var to = bnbNodes[e.to];
                                var col = to.pruned ? viz.colors.text + '33' : viz.colors.axis;
                                viz.drawTreeEdge(from.x, from.y, to.x, to.y, col);
                                viz.screenText(e.label, (from.x + to.x) / 2 + (to.x > from.x ? 8 : -8), (from.y + to.y) / 2 - 3, viz.colors.text, 8, 'center');
                            }

                            // Draw nodes
                            for (var i = 0; i < bnbNodes.length; i++) {
                                var nd = bnbNodes[i];
                                var col, r;
                                if (nd.isBest) {
                                    col = viz.colors.green; r = 14;
                                } else if (nd.pruned) {
                                    col = viz.colors.red + '44'; r = 10;
                                } else if (nd.isComplete) {
                                    col = viz.colors.orange; r = 12;
                                } else {
                                    col = viz.colors.blue; r = 11;
                                }
                                var label = nd.isComplete ? nd.totalCost : nd.cost;
                                viz.drawTreeNode(nd.x, nd.y, r, label, col, viz.colors.white);
                                if (!nd.isComplete && !nd.pruned) {
                                    viz.screenText('lb:' + nd.lb, nd.x, nd.y + r + 8, viz.colors.yellow, 7, 'center');
                                }
                                if (nd.pruned) {
                                    viz.screenText('X', nd.x + r + 3, nd.y - r, viz.colors.red, 9, 'center');
                                }
                            }

                            // Stats
                            var totalN = bnbNodes.length;
                            var prunedN = bnbNodes.filter(function(n) { return n.pruned; }).length;
                            viz.screenText('节点: ' + totalN + ', 剪枝: ' + prunedN, 120, viz.height - 25, viz.colors.text, 11, 'center');
                            if (bestTour) {
                                var tourStr = bestTour.map(function(c) { return cities[c]; }).join(' -> ') + ' -> ' + cities[0];
                                viz.screenText('最优: ' + tourStr + ' = ' + bestCost, viz.width / 2, viz.height - 25, viz.colors.green, 12, 'center');
                            }
                        }

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'ch18-viz-tsp-tour',
                    title: 'TSP 最优路线图',
                    description: '在地图上展示 B&B 找到的最优旅行路线',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 380});
                        var cities = [
                            {x: 100, y: 100, label: 'A'},
                            {x: 350, y: 60, label: 'B'},
                            {x: 550, y: 130, label: 'C'},
                            {x: 500, y: 280, label: 'D'},
                            {x: 200, y: 250, label: 'E'},
                            {x: 350, y: 180, label: 'F'}
                        ];
                        var nC2 = cities.length;
                        var dist2 = [];
                        for (var i = 0; i < nC2; i++) {
                            dist2[i] = [];
                            for (var j = 0; j < nC2; j++) {
                                var dx = cities[i].x - cities[j].x;
                                var dy = cities[i].y - cities[j].y;
                                dist2[i][j] = Math.round(Math.sqrt(dx * dx + dy * dy));
                            }
                        }

                        // Nearest neighbor heuristic
                        function nearestNeighbor() {
                            var visited = new Array(nC2).fill(false);
                            var tour = [0];
                            visited[0] = true;
                            for (var step = 1; step < nC2; step++) {
                                var last = tour[tour.length - 1];
                                var best = -1, bestD = Infinity;
                                for (var j = 0; j < nC2; j++) {
                                    if (!visited[j] && dist2[last][j] < bestD) {
                                        bestD = dist2[last][j];
                                        best = j;
                                    }
                                }
                                tour.push(best);
                                visited[best] = true;
                            }
                            return tour;
                        }

                        // Brute force optimal
                        function bruteForce() {
                            var perm = [];
                            for (var i = 1; i < nC2; i++) perm.push(i);
                            var bestT = null, bestC = Infinity;
                            function permute(arr, l) {
                                if (l === arr.length) {
                                    var c = dist2[0][arr[0]];
                                    for (var i = 0; i < arr.length - 1; i++) c += dist2[arr[i]][arr[i + 1]];
                                    c += dist2[arr[arr.length - 1]][0];
                                    if (c < bestC) { bestC = c; bestT = [0].concat(arr.slice()); }
                                    return;
                                }
                                for (var i = l; i < arr.length; i++) {
                                    var t = arr[l]; arr[l] = arr[i]; arr[i] = t;
                                    permute(arr, l + 1);
                                    t = arr[l]; arr[l] = arr[i]; arr[i] = t;
                                }
                            }
                            permute(perm, 0);
                            return {tour: bestT, cost: bestC};
                        }

                        var nnTour = nearestNeighbor();
                        var optResult = bruteForce();
                        var showMode = 'optimal'; // 'nn' or 'optimal'

                        function tourCost(tour) {
                            var c = 0;
                            for (var i = 0; i < tour.length - 1; i++) c += dist2[tour[i]][tour[i + 1]];
                            c += dist2[tour[tour.length - 1]][tour[0]];
                            return c;
                        }

                        function draw() {
                            viz.clear();
                            var tour = showMode === 'nn' ? nnTour : optResult.tour;
                            var cost = tourCost(tour);
                            var title = showMode === 'nn' ? '最近邻启发式' : '最优解 (B&B/暴力)';
                            var titleCol = showMode === 'nn' ? viz.colors.orange : viz.colors.green;

                            viz.screenText('TSP: ' + title, viz.width / 2, 18, titleCol, 15, 'center');

                            // Draw all edges lightly
                            for (var i = 0; i < nC2; i++) {
                                for (var j = i + 1; j < nC2; j++) {
                                    viz.drawEdge(cities[i].x, cities[i].y, cities[j].x, cities[j].y, viz.colors.axis + '22', false);
                                }
                            }

                            // Draw tour
                            for (var i = 0; i < tour.length; i++) {
                                var u = tour[i];
                                var v = tour[(i + 1) % tour.length];
                                viz.drawEdge(cities[u].x, cities[u].y, cities[v].x, cities[v].y, titleCol, true, null, 3);
                            }

                            // Draw cities
                            for (var i = 0; i < nC2; i++) {
                                viz.drawNode(cities[i].x, cities[i].y, 22, cities[i].label, viz.colors.blue, viz.colors.white);
                            }

                            viz.screenText('总距离: ' + cost, viz.width / 2, 340, titleCol, 14, 'center');
                            if (showMode === 'nn') {
                                viz.screenText('最优: ' + optResult.cost + ' (差 ' + Math.round((cost - optResult.cost) / optResult.cost * 100) + '%)', viz.width / 2, 362, viz.colors.text, 12, 'center');
                            }
                        }

                        VizEngine.createButton(controls, '最优解', function() {
                            showMode = 'optimal'; draw();
                        });
                        VizEngine.createButton(controls, '最近邻启发式', function() {
                            showMode = 'nn'; draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '对于距离矩阵 \\(\\begin{pmatrix} \\infty & 10 & 15 & 20 \\\\ 5 & \\infty & 9 & 10 \\\\ 6 & 13 & \\infty & 12 \\\\ 8 & 8 & 9 & \\infty \\end{pmatrix}\\), 计算根节点的归约代价下界。',
                    hint: '行归约: 每行减最小值。列归约: 每列减最小值。',
                    solution: '行归约: 行0减10, 行1减5, 行2减6, 行3减8, 行减总 = 29。归约后矩阵: [[inf,0,5,10],[0,inf,4,5],[0,7,inf,6],[0,0,1,inf]]。列归约: 列0减0, 列1减0, 列2减1, 列3减5, 列减总 = 6。总归约代价 = 29 + 6 = 35。这是 TSP 最优解的下界。'
                },
                {
                    question: '解释为什么 TSP 的分支定界实际效率远好于最坏情况。具体来说, 什么因素决定了 B&B 实际探索的节点数?',
                    hint: '考虑: 下界质量、初始解质量、问题结构。',
                    solution: '影响 B&B 实际效率的关键因素: (1) **下界质量**: 越紧的下界 (如 Held-Karp 下界通常在最优值的 1-2% 内), 剪枝越多。(2) **初始解 (incumbent) 质量**: 用启发式 (如最近邻、2-opt) 快速找到好的初始解, 使得更多节点的下界超过 incumbent。(3) **搜索策略**: best-first 优先展开最有前途的节点。(4) **问题结构**: "随机"TSP 实例通常比精心构造的困难实例更容易。实际中, 好的 B&B 实现对 50-100 城市的 TSP 只需探索状态空间的极小部分 (远少于 \\(n!\\))。'
                },
                {
                    question: '比较回溯和分支定界在以下问题上的适用性: (a) N 皇后 (判定/计数); (b) 0-1 背包 (优化); (c) SAT (判定)。',
                    hint: '判定问题用回溯, 优化问题用 B&B。',
                    solution: '(a) **N 皇后 (判定/计数)**: 使用回溯。这是约束满足问题, 没有优化目标, 不需要界限函数。剪枝来自列/对角线约束。(b) **0-1 背包 (优化)**: 使用 B&B。有明确的优化目标 (最大化价值), 可以用分数松弛作为上界进行界限剪枝。也可以用 DP (伪多项式时间)。(c) **SAT (判定)**: 使用回溯 (DPLL/CDCL 算法)。核心是回溯 + 单元传播 (unit propagation) + 冲突驱动的学习 (CDCL)。虽然不是优化问题, 但 CDCL 中的冲突分析可以看作一种"智能剪枝"。'
                },
                {
                    question: '设计一个回溯算法求解数独 (Sudoku)。描述状态表示、选择策略和剪枝方法。',
                    hint: '状态: 当前棋盘; 选择: 为空格填数字; 约束: 行/列/宫内不重复。',
                    solution: '**状态**: 9x9 棋盘, 部分已填。**选择**: 选一个空格, 尝试填 1-9。**约束检查**: 填入数字后检查行、列、3x3 宫是否有重复。**剪枝**: (1) 可行性剪枝: 违反行/列/宫约束则回退。(2) **MRV 启发式**: 优先填"候选数字最少"的空格 (Minimum Remaining Values), 最早发现冲突。(3) **约束传播**: 填一个数字后, 更新同行/列/宫其他空格的候选集, 若某空格候选为空则回退 (naked singles)。(4) 高级: 利用 naked pairs/triples 等推理技术进一步收缩候选集。这些剪枝使得大多数数独可以在不到 100 次回溯内求解。'
                },
                {
                    question: '总结本章三种算法范式 (贪心、DP、回溯/B&B) 的适用场景, 各给出一个典型问题。',
                    hint: '从问题性质 (优化/判定/计数)、子问题结构、复杂度等角度比较。',
                    solution: '**贪心**: 适合有贪心选择性质的问题, 时间通常 \\(O(n\\log n)\\)。典型: 活动选择、Huffman 编码、分数背包。**DP**: 适合有最优子结构 + 重叠子问题的优化/计数问题, 时间通常多项式 (或伪多项式)。典型: 0-1 背包、LCS、编辑距离、矩阵链乘法。**回溯/B&B**: 适合约束满足问题 (回溯) 和 NP-hard 优化问题 (B&B), 最坏指数时间, 但剪枝后实际可行。典型: N 皇后 (回溯), TSP (B&B), SAT (回溯+学习)。选择指南: 能贪心就贪心 (最快); 不能贪心尝试 DP (多项式); DP 也不行就回溯/B&B (指数但有剪枝)。'
                }
            ]
        }
    ]
});
