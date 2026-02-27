// ============================================================
//  Ch 17 · 动态规划 (Dynamic Programming)
// ============================================================
window.CHAPTERS.push({
    id: 'ch17',
    number: 17,
    title: '动态规划',
    subtitle: 'Dynamic Programming — Optimal Substructure Meets Overlapping Subproblems',
    sections: [
        // ===== Section 1: Foundations =====
        {
            id: 'ch17-sec01',
            title: 'DP 的核心思想',
            content: `<h2>1 DP 的核心思想</h2>
<p>动态规划 (dynamic programming, DP) 是一种通过<strong>分解子问题</strong>、<strong>存储中间结果</strong>来避免重复计算的算法设计范式。它适用于具有两个关键性质的问题:</p>

<div class="env-block definition">
<div class="env-title">Definition 17.1 (Optimal Substructure)</div>
<div class="env-body"><p><strong>最优子结构:</strong> 问题的最优解包含其子问题的最优解。即, 可以通过组合子问题的最优解来构建原问题的最优解。</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 17.2 (Overlapping Subproblems)</div>
<div class="env-body"><p><strong>重叠子问题:</strong> 递归求解过程中, 同一个子问题会被多次求解。DP 通过记忆化 (memoization) 或表格法 (tabulation) 避免重复计算。</p></div>
</div>

<div class="env-block intuition">
<div class="env-title">Intuition: DP vs Greedy vs Divide & Conquer</div>
<div class="env-body"><p><strong>分治:</strong> 子问题不重叠, 独立求解后合并 (如归并排序)。<br>
<strong>贪心:</strong> 做出一次选择后不回头, 只需解一个子问题 (如活动选择)。<br>
<strong>DP:</strong> 子问题重叠, 需要保存结果; 可能需要考虑所有子问题的组合来做出最优选择。</p></div>
</div>

<div class="env-block example">
<div class="env-title">Example 17.1 (Fibonacci: DP Motivation)</div>
<div class="env-body"><p>朴素递归: \\(F(n) = F(n-1) + F(n-2)\\), 时间 \\(O(2^n)\\) — 因为大量子问题重复计算。<br>
DP (自底向上): 用数组存储 \\(F[0], F[1], \\ldots, F[n]\\), 时间 \\(O(n)\\)。这就是 DP 的威力。</p></div>
</div>

<div class="viz-placeholder" data-viz="ch17-viz-fib-tree"></div>

<div class="env-block definition">
<div class="env-title">Definition 17.3 (Top-Down vs Bottom-Up)</div>
<div class="env-body"><p><strong>自顶向下 (Top-Down / Memoization):</strong> 用递归实现, 第一次计算子问题时将结果缓存, 后续直接查表。优点: 只计算需要的子问题。<br>
<strong>自底向上 (Bottom-Up / Tabulation):</strong> 按拓扑序从最小子问题开始填表, 逐步构建更大的子问题的解。优点: 没有递归开销, 可优化空间。</p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: DP Design Recipe</div>
<div class="env-body"><p>
1. <strong>定义子问题:</strong> 确定 DP 状态, 即 \\(dp[i]\\) 或 \\(dp[i][j]\\) 代表什么<br>
2. <strong>写出递推关系:</strong> \\(dp[i]\\) 如何由更小的子问题表达<br>
3. <strong>确定基本情况:</strong> 最小子问题的解<br>
4. <strong>确定计算顺序:</strong> 确保计算 \\(dp[i]\\) 时, 所依赖的子问题已经求解<br>
5. <strong>提取最终答案:</strong> 从 DP 表中读出原问题的解<br>
6. (可选) <strong>回溯解:</strong> 若需要具体方案, 记录决策并回溯
</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch17-viz-fib-tree',
                    title: 'Fibonacci 递归树 vs 记忆化',
                    description: '对比朴素递归的重复计算与记忆化的剪枝效果',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var n = 6;
                        var mode = 'naive'; // 'naive' or 'memo'
                        var computeCount = 0;

                        function buildTree(k, depth, xCenter, xSpread) {
                            if (k <= 1) return {val: k, x: xCenter, depth: depth, children: [], computed: false};
                            var node = {val: k, x: xCenter, depth: depth, children: [], computed: false};
                            node.children.push(buildTree(k - 1, depth + 1, xCenter - xSpread, xSpread * 0.5));
                            node.children.push(buildTree(k - 2, depth + 1, xCenter + xSpread, xSpread * 0.5));
                            return node;
                        }

                        function flattenTree(node) {
                            var list = [node];
                            for (var i = 0; i < node.children.length; i++) {
                                list = list.concat(flattenTree(node.children[i]));
                            }
                            return list;
                        }

                        function markMemo(node, memo) {
                            if (memo[node.val] !== undefined) {
                                node.cached = true;
                                return;
                            }
                            memo[node.val] = true;
                            node.cached = false;
                            for (var i = 0; i < node.children.length; i++) {
                                markMemo(node.children[i], memo);
                            }
                        }

                        var tree = buildTree(n, 0, 350, 150);

                        function draw() {
                            viz.clear();
                            var title = mode === 'naive' ? 'Fibonacci 朴素递归树 (大量重复!)' : 'Fibonacci 记忆化 (绿色=缓存命中)';
                            viz.screenText(title, viz.width / 2, 18, viz.colors.white, 14, 'center');

                            tree = buildTree(n, 0, 350, 150);
                            if (mode === 'memo') markMemo(tree, {});

                            var flat = flattenTree(tree);
                            computeCount = 0;
                            var cacheHits = 0;

                            // Draw edges first
                            for (var i = 0; i < flat.length; i++) {
                                var nd = flat[i];
                                var py = 55 + nd.depth * 55;
                                for (var j = 0; j < nd.children.length; j++) {
                                    var ch = nd.children[j];
                                    var cy = 55 + ch.depth * 55;
                                    var eColor = (mode === 'memo' && ch.cached) ? viz.colors.green + '44' : viz.colors.axis;
                                    viz.drawTreeEdge(nd.x, py, ch.x, cy, eColor);
                                }
                            }

                            // Draw nodes
                            for (var i = 0; i < flat.length; i++) {
                                var nd = flat[i];
                                var py = 55 + nd.depth * 55;
                                var col;
                                if (mode === 'memo' && nd.cached) {
                                    col = viz.colors.green;
                                    cacheHits++;
                                } else {
                                    col = viz.colors.blue;
                                    computeCount++;
                                }
                                viz.drawTreeNode(nd.x, py, 16, 'F(' + nd.val + ')', col, viz.colors.white);
                            }

                            var info;
                            if (mode === 'naive') {
                                info = '总调用: ' + flat.length + ' 次 (指数级重复!)';
                            } else {
                                info = '实际计算: ' + computeCount + ', 缓存命中: ' + cacheHits + ' (线性!)';
                            }
                            viz.screenText(info, viz.width / 2, viz.height - 20, viz.colors.yellow, 13, 'center');
                        }

                        VizEngine.createButton(controls, '朴素递归', function() { mode = 'naive'; draw(); });
                        VizEngine.createButton(controls, '记忆化', function() { mode = 'memo'; draw(); });
                        VizEngine.createSlider(controls, 'n', 3, 7, n, 1, function(v) { n = Math.round(v); draw(); });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '设计一个 DP 算法计算 "爬楼梯" 问题: 有 \\(n\\) 级台阶, 每次可以上 1 级或 2 级, 共有多少种方式到达顶部? 写出递推关系和时间/空间复杂度。',
                    hint: '到达第 \\(n\\) 级的方式 = 到达第 \\(n-1\\) 级 + 到达第 \\(n-2\\) 级。',
                    solution: '递推: \\(dp[i] = dp[i-1] + dp[i-2]\\), 基本情况 \\(dp[0] = 1, dp[1] = 1\\)。这本质就是 Fibonacci 数列! 时间 \\(O(n)\\), 空间 \\(O(n)\\) (可优化到 \\(O(1)\\), 只需存前两个值)。'
                },
                {
                    question: '对比自顶向下 (记忆化递归) 与自底向上 (填表) 的优缺点。',
                    hint: '考虑: 子问题访问模式、递归栈、空间优化。',
                    solution: '**自顶向下**: 优点 — 只计算实际需要的子问题 (对稀疏子问题图有利), 代码直觉更接近递推关系。缺点 — 递归栈开销, 可能栈溢出, 常数较大。**自底向上**: 优点 — 无递归开销, 可以滚动数组优化空间, 对缓存更友好。缺点 — 必须计算所有子问题 (即使有些不需要), 需要确定正确的填表顺序。实际使用中, 自底向上通常更快, 自顶向下通常更易写。'
                },
                {
                    question: '解释为什么贪心能解决的问题 DP 也能解 (但反之不然), 并以活动选择为例说明。',
                    hint: 'DP 考虑所有子问题组合, 贪心只选一个。',
                    solution: 'DP 通过枚举所有可能的选择来找最优, 而贪心只做一次局部最优选择。因此 DP 严格比贪心更"通用": 任何贪心能解的问题, DP 都能解 (虽然可能慢)。以活动选择为例: DP 解法为 \\(dp[i]\\) = 前 \\(i\\) 个活动中的最大相容集大小, 转移时考虑是否选第 \\(i\\) 个活动。贪心直接按结束时间选, 不需要 DP 表, 更高效。反之, 0-1 背包只能用 DP, 贪心无法解决。'
                }
            ]
        },
        // ===== Section 2: Classic DP Problems =====
        {
            id: 'ch17-sec02',
            title: '经典 DP 问题: 切钢条与 LCS',
            content: `<h2>2 经典 DP 问题: 切钢条与 LCS</h2>

<h3>2.1 切钢条 (Rod Cutting)</h3>
<p>给定一根长为 \\(n\\) 的钢条和价格表 \\(p[1..n]\\), 其中 \\(p[i]\\) 是长度为 \\(i\\) 的钢条的售价。求切割方案使总收益最大。</p>

<div class="env-block definition">
<div class="env-title">Definition 17.4 (Rod Cutting)</div>
<div class="env-body"><p>$$r_n = \\max_{1 \\le i \\le n}\\{p_i + r_{n-i}\\}$$ 基本情况: \\(r_0 = 0\\)。这里 \\(r_n\\) 是长度为 \\(n\\) 的钢条的最优收益。</p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Bottom-Up Rod Cutting</div>
<div class="env-body"><p>
1. \\(r[0] = 0\\)<br>
2. 对于 \\(j = 1, 2, \\ldots, n\\):<br>
&nbsp;&nbsp;&nbsp;&nbsp;\\(q = -\\infty\\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;对于 \\(i = 1, 2, \\ldots, j\\):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\(q = \\max(q, p[i] + r[j-i])\\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;\\(r[j] = q\\)<br>
3. 返回 \\(r[n]\\)<br>
时间 \\(O(n^2)\\), 空间 \\(O(n)\\)。
</p></div>
</div>

<h3>2.2 最长公共子序列 (LCS)</h3>
<p>给定序列 \\(X = (x_1, \\ldots, x_m)\\) 和 \\(Y = (y_1, \\ldots, y_n)\\), 求它们的最长公共子序列长度。</p>

<div class="env-block definition">
<div class="env-title">Definition 17.5 (LCS Recurrence)</div>
<div class="env-body"><p>$$c[i][j] = \\begin{cases} 0 & \\text{if } i = 0 \\text{ or } j = 0 \\\\ c[i-1][j-1] + 1 & \\text{if } x_i = y_j \\\\ \\max(c[i-1][j], c[i][j-1]) & \\text{if } x_i \\ne y_j \\end{cases}$$</p></div>
</div>

<p>时间 \\(O(mn)\\), 空间 \\(O(mn)\\) (可优化到 \\(O(\\min(m,n))\\))。</p>

<div class="viz-placeholder" data-viz="ch17-viz-lcs"></div>

<div class="env-block example">
<div class="env-title">Example 17.2</div>
<div class="env-body"><p>\\(X = \\text{ABCBDAB}\\), \\(Y = \\text{BDCABA}\\)。LCS 长度为 4, 一个 LCS 为 BCBA。</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch17-viz-lcs',
                    title: 'LCS DP 表填充动画',
                    description: '逐步填充 LCS 的 DP 表, 高亮当前单元格和回溯路径',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450});
                        var X = 'ABCBDAB';
                        var Y = 'BDCABA';
                        var m = X.length;
                        var nn = Y.length;
                        var dp = [];
                        var dir = []; // 'diag', 'up', 'left'
                        for (var i = 0; i <= m; i++) {
                            dp[i] = new Array(nn + 1).fill(0);
                            dir[i] = new Array(nn + 1).fill('');
                        }

                        var step = 0;
                        var maxStep = m * nn;
                        var showPath = false;

                        function getIJ(s) {
                            var i = Math.floor(s / nn) + 1;
                            var j = (s % nn) + 1;
                            return [i, j];
                        }

                        function computeUpTo(s) {
                            for (var r = 0; r <= m; r++) {
                                dp[r] = new Array(nn + 1).fill(0);
                                dir[r] = new Array(nn + 1).fill('');
                            }
                            for (var k = 0; k < s; k++) {
                                var ij = getIJ(k);
                                var ii = ij[0], jj = ij[1];
                                if (X[ii - 1] === Y[jj - 1]) {
                                    dp[ii][jj] = dp[ii - 1][jj - 1] + 1;
                                    dir[ii][jj] = 'diag';
                                } else if (dp[ii - 1][jj] >= dp[ii][jj - 1]) {
                                    dp[ii][jj] = dp[ii - 1][jj];
                                    dir[ii][jj] = 'up';
                                } else {
                                    dp[ii][jj] = dp[ii][jj - 1];
                                    dir[ii][jj] = 'left';
                                }
                            }
                        }

                        function getBacktrackPath() {
                            var path = [];
                            var i = m, j = nn;
                            while (i > 0 && j > 0) {
                                if (dir[i][j] === 'diag') {
                                    path.push([i, j]);
                                    i--; j--;
                                } else if (dir[i][j] === 'up') {
                                    i--;
                                } else {
                                    j--;
                                }
                            }
                            return path;
                        }

                        function draw() {
                            viz.clear();
                            computeUpTo(step);
                            var cellW = 42;
                            var cellH = 34;
                            var ox = 80;
                            var oy = 70;

                            viz.screenText('LCS DP 表填充', viz.width / 2, 18, viz.colors.white, 15, 'center');
                            viz.screenText('X = ' + X + ',  Y = ' + Y, viz.width / 2, 42, viz.colors.yellow, 12, 'center');

                            // Column headers (Y)
                            viz.screenText('', ox, oy - 20, viz.colors.text, 11, 'center');
                            for (var j = 0; j <= nn; j++) {
                                var hdr = j === 0 ? '' : Y[j - 1];
                                viz.screenText(hdr, ox + (j + 1) * cellW + cellW / 2, oy - 8, viz.colors.teal, 13, 'center');
                            }

                            // Row headers (X)
                            for (var i = 0; i <= m; i++) {
                                var hdr2 = i === 0 ? '' : X[i - 1];
                                viz.screenText(hdr2, ox - 5, oy + (i + 1) * cellH + cellH / 2, viz.colors.teal, 13, 'right');
                            }

                            // Current cell
                            var curI = -1, curJ = -1;
                            if (step < maxStep) {
                                var cur = getIJ(step);
                                curI = cur[0]; curJ = cur[1];
                            }

                            // Backtrack path
                            var pathCells = {};
                            if (showPath && step === maxStep) {
                                var path = getBacktrackPath();
                                for (var p = 0; p < path.length; p++) {
                                    pathCells[path[p][0] + ',' + path[p][1]] = true;
                                }
                            }

                            // Draw cells
                            for (var i = 0; i <= m; i++) {
                                for (var j = 0; j <= nn; j++) {
                                    var px = ox + (j + 1) * cellW;
                                    var py = oy + (i + 1) * cellH;
                                    var bg = viz.colors.bg;
                                    var hl = null;

                                    if (i === curI && j === curJ) {
                                        hl = viz.colors.yellow;
                                    } else if (pathCells[i + ',' + j]) {
                                        hl = viz.colors.green;
                                    }

                                    var computed = (i === 0 || j === 0);
                                    if (i > 0 && j > 0) {
                                        var k = (i - 1) * nn + (j - 1);
                                        computed = k < step;
                                    }

                                    if (computed || i === 0 || j === 0) {
                                        viz.drawArrayCell(px, py, cellW, cellH, dp[i][j], bg, viz.colors.white, hl);
                                    } else {
                                        viz.drawArrayCell(px, py, cellW, cellH, '?', viz.colors.bg, viz.colors.text + '44', hl);
                                    }
                                }
                            }

                            // Info
                            if (step === maxStep) {
                                viz.screenText('LCS 长度 = ' + dp[m][nn], viz.width / 2, oy + (m + 2) * cellH + 15, viz.colors.green, 14, 'center');
                                if (showPath) {
                                    var path2 = getBacktrackPath();
                                    var lcs = '';
                                    for (var p = path2.length - 1; p >= 0; p--) {
                                        lcs += X[path2[p][0] - 1];
                                    }
                                    viz.screenText('LCS = ' + lcs, viz.width / 2, oy + (m + 2) * cellH + 35, viz.colors.teal, 13, 'center');
                                }
                            } else {
                                viz.screenText('Step ' + step + '/' + maxStep, viz.width / 2, oy + (m + 2) * cellH + 15, viz.colors.text, 12, 'center');
                            }
                        }

                        VizEngine.createButton(controls, '下一步', function() {
                            if (step < maxStep) { step++; draw(); }
                        });
                        VizEngine.createButton(controls, '快进10步', function() {
                            step = Math.min(step + 10, maxStep); draw();
                        });
                        VizEngine.createButton(controls, '全部填完', function() {
                            step = maxStep; draw();
                        });
                        VizEngine.createButton(controls, '显示回溯路径', function() {
                            step = maxStep; showPath = true; draw();
                        });
                        VizEngine.createButton(controls, '重置', function() {
                            step = 0; showPath = false; draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '对切钢条问题, 给定价格表 \\(p = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30]\\) (\\(p[0]=0\\)), 求 \\(r_7\\) (长度 7 的最优收益) 及切割方案。',
                    hint: '自底向上填表: \\(r[j] = \\max_{1 \\le i \\le j}(p[i] + r[j-i])\\)。',
                    solution: '\\(r[1]=1, r[2]=5, r[3]=8, r[4]=10, r[5]=13, r[6]=17, r[7]=18\\)。切割方案: 7 = 1 + 6, 收益 = 1 + 17 = 18。(或其他等价方案)'
                },
                {
                    question: '对 \\(X = \\text{STONE}\\) 和 \\(Y = \\text{LONGEST}\\), 求 LCS 长度并给出 DP 表。',
                    hint: '构建 5x7 的 DP 表。',
                    solution: 'LCS 长度 = 3, 一个 LCS 为 "ONE"。DP 表 (行=S,T,O,N,E; 列=L,O,N,G,E,S,T): 最后一行最大值为 3。'
                },
                {
                    question: 'LCS 的空间可以从 \\(O(mn)\\) 优化到 \\(O(\\min(m,n))\\)。如何做到? 如果还需要回溯 LCS 本身呢?',
                    hint: '只需两行 (当前行和上一行) 就能计算 DP 值。回溯需要 Hirschberg 算法。',
                    solution: '空间优化: 由于 \\(c[i][j]\\) 只依赖 \\(c[i-1][j-1], c[i-1][j], c[i][j-1]\\), 可以只保留两行 (或一行加一个临时变量), 空间 \\(O(\\min(m,n))\\)。回溯: 需要 Hirschberg 算法 — 分治思想, 在中间行分割, 递归求前半和后半的 LCS, 总空间仍为 \\(O(\\min(m,n))\\), 时间 \\(O(mn)\\)。'
                }
            ]
        },
        // ===== Section 3: Edit Distance =====
        {
            id: 'ch17-sec03',
            title: '编辑距离与矩阵链',
            content: `<h2>3 编辑距离与矩阵链</h2>

<h3>3.1 编辑距离 (Edit Distance)</h3>
<p>编辑距离 (Levenshtein distance) 衡量将一个字符串转换为另一个字符串所需的最少操作数 (插入、删除、替换)。</p>

<div class="env-block definition">
<div class="env-title">Definition 17.6 (Edit Distance)</div>
<div class="env-body"><p>设 \\(X = x_1 \\ldots x_m\\), \\(Y = y_1 \\ldots y_n\\)。编辑距离 \\(d[i][j]\\) 为将 \\(X[1..i]\\) 转换为 \\(Y[1..j]\\) 的最少操作数: $$d[i][j] = \\begin{cases} j & \\text{if } i = 0 \\\\ i & \\text{if } j = 0 \\\\ d[i-1][j-1] & \\text{if } x_i = y_j \\\\ 1 + \\min(d[i-1][j], d[i][j-1], d[i-1][j-1]) & \\text{otherwise} \\end{cases}$$</p></div>
</div>

<p>三个操作: \\(d[i-1][j] + 1\\) (从 \\(X\\) 删), \\(d[i][j-1] + 1\\) (向 \\(X\\) 插), \\(d[i-1][j-1] + 1\\) (替换)。</p>

<div class="viz-placeholder" data-viz="ch17-viz-edit-distance"></div>

<h3>3.2 矩阵链乘法 (Matrix Chain Multiplication)</h3>
<p>给定矩阵链 \\(A_1 A_2 \\cdots A_n\\), 其中 \\(A_i\\) 是 \\(p_{i-1} \\times p_i\\) 矩阵, 求最优加括号方案以最小化标量乘法次数。</p>

<div class="env-block definition">
<div class="env-title">Definition 17.7 (Matrix Chain DP)</div>
<div class="env-body"><p>$$m[i][j] = \\begin{cases} 0 & \\text{if } i = j \\\\ \\min_{i \\le k < j} \\{m[i][k] + m[k+1][j] + p_{i-1} p_k p_j\\} & \\text{if } i < j \\end{cases}$$</p></div>
</div>

<p>时间 \\(O(n^3)\\), 空间 \\(O(n^2)\\)。</p>

<div class="viz-placeholder" data-viz="ch17-viz-matrix-chain"></div>

<div class="env-block example">
<div class="env-title">Example 17.3</div>
<div class="env-body"><p>矩阵维度: \\(p = [30, 35, 15, 5, 10, 20, 25]\\) (6 个矩阵)。最优加括号: \\((A_1(A_2 A_3))((A_4 A_5)A_6)\\), 最少乘法次数 = 15125。</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch17-viz-edit-distance',
                    title: '编辑距离 DP 表与对齐路径',
                    description: '逐步填充编辑距离表, 显示最优对齐',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 440});
                        var X = 'KITTEN';
                        var Y = 'SITTING';
                        var m2 = X.length;
                        var n2 = Y.length;
                        var dpE = [];
                        var dirE = [];
                        var stepE = 0;
                        var maxStepE = (m2 + 1) * (n2 + 1);
                        var showPathE = false;

                        function computeAll() {
                            dpE = [];
                            dirE = [];
                            for (var i = 0; i <= m2; i++) {
                                dpE[i] = new Array(n2 + 1).fill(-1);
                                dirE[i] = new Array(n2 + 1).fill('');
                            }
                            for (var i = 0; i <= m2; i++) { dpE[i][0] = i; dirE[i][0] = 'up'; }
                            for (var j = 0; j <= n2; j++) { dpE[0][j] = j; dirE[0][j] = 'left'; }
                            dirE[0][0] = '';
                            for (var i = 1; i <= m2; i++) {
                                for (var j = 1; j <= n2; j++) {
                                    if (X[i - 1] === Y[j - 1]) {
                                        dpE[i][j] = dpE[i - 1][j - 1];
                                        dirE[i][j] = 'diag';
                                    } else {
                                        var del = dpE[i - 1][j] + 1;
                                        var ins = dpE[i][j - 1] + 1;
                                        var rep = dpE[i - 1][j - 1] + 1;
                                        var mn = Math.min(del, ins, rep);
                                        dpE[i][j] = mn;
                                        if (mn === rep) dirE[i][j] = 'diag';
                                        else if (mn === del) dirE[i][j] = 'up';
                                        else dirE[i][j] = 'left';
                                    }
                                }
                            }
                        }

                        function getBacktrackE() {
                            var path = [];
                            var i = m2, j = n2;
                            while (i > 0 || j > 0) {
                                path.push([i, j]);
                                if (dirE[i][j] === 'diag') { i--; j--; }
                                else if (dirE[i][j] === 'up') { i--; }
                                else { j--; }
                            }
                            path.push([0, 0]);
                            return path;
                        }

                        computeAll();

                        function draw() {
                            viz.clear();
                            var cellW = 40;
                            var cellH = 32;
                            var ox = 70;
                            var oy = 65;

                            viz.screenText('编辑距离: "' + X + '" -> "' + Y + '"', viz.width / 2, 18, viz.colors.white, 14, 'center');

                            var filledCount = 0;
                            if (stepE >= maxStepE) filledCount = maxStepE;
                            else filledCount = stepE;

                            // Headers
                            for (var j = 0; j <= n2; j++) {
                                var hdr = j === 0 ? '-' : Y[j - 1];
                                viz.screenText(hdr, ox + (j + 1) * cellW + cellW / 2, oy - 5, viz.colors.teal, 12, 'center');
                            }
                            for (var i = 0; i <= m2; i++) {
                                var hdr2 = i === 0 ? '-' : X[i - 1];
                                viz.screenText(hdr2, ox - 3, oy + (i + 1) * cellH + cellH / 2, viz.colors.teal, 12, 'right');
                            }

                            var pathCells = {};
                            if (showPathE) {
                                var bpath = getBacktrackE();
                                for (var p = 0; p < bpath.length; p++) {
                                    pathCells[bpath[p][0] + ',' + bpath[p][1]] = true;
                                }
                            }

                            // Draw cells
                            var cellIdx = 0;
                            for (var i = 0; i <= m2; i++) {
                                for (var j = 0; j <= n2; j++) {
                                    var px = ox + (j + 1) * cellW;
                                    var py = oy + (i + 1) * cellH;
                                    var hl = null;
                                    if (cellIdx === filledCount - 1 && filledCount <= maxStepE) {
                                        hl = viz.colors.yellow;
                                    } else if (pathCells[i + ',' + j]) {
                                        hl = viz.colors.green;
                                    }
                                    if (cellIdx < filledCount) {
                                        viz.drawArrayCell(px, py, cellW, cellH, dpE[i][j], viz.colors.bg, viz.colors.white, hl);
                                    } else {
                                        viz.drawArrayCell(px, py, cellW, cellH, '', viz.colors.bg, viz.colors.text + '44', null);
                                    }
                                    cellIdx++;
                                }
                            }

                            if (filledCount >= maxStepE) {
                                viz.screenText('编辑距离 = ' + dpE[m2][n2], viz.width / 2, oy + (m2 + 2) * cellH + 10, viz.colors.green, 14, 'center');
                            } else {
                                viz.screenText('Step ' + filledCount + '/' + maxStepE, viz.width / 2, oy + (m2 + 2) * cellH + 10, viz.colors.text, 12, 'center');
                            }
                        }

                        VizEngine.createButton(controls, '下一步', function() {
                            if (stepE < maxStepE) { stepE++; draw(); }
                        });
                        VizEngine.createButton(controls, '快进', function() {
                            stepE = Math.min(stepE + 10, maxStepE); draw();
                        });
                        VizEngine.createButton(controls, '全部', function() {
                            stepE = maxStepE; draw();
                        });
                        VizEngine.createButton(controls, '回溯路径', function() {
                            stepE = maxStepE; showPathE = true; draw();
                        });
                        VizEngine.createButton(controls, '重置', function() {
                            stepE = 0; showPathE = false; draw();
                        });

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'ch17-viz-matrix-chain',
                    title: '矩阵链乘法 DP',
                    description: '观察矩阵链的 DP 表和最优括号化',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var dims = [30, 35, 15, 5, 10, 20, 25];
                        var nMat = dims.length - 1;
                        var mDP = [];
                        var sDP = [];
                        for (var i = 0; i <= nMat; i++) {
                            mDP[i] = new Array(nMat + 1).fill(0);
                            sDP[i] = new Array(nMat + 1).fill(0);
                        }

                        function computeMatrix() {
                            for (var i = 1; i <= nMat; i++) mDP[i][i] = 0;
                            for (var l = 2; l <= nMat; l++) {
                                for (var i = 1; i <= nMat - l + 1; i++) {
                                    var j = i + l - 1;
                                    mDP[i][j] = Infinity;
                                    for (var k = i; k < j; k++) {
                                        var cost = mDP[i][k] + mDP[k + 1][j] + dims[i - 1] * dims[k] * dims[j];
                                        if (cost < mDP[i][j]) {
                                            mDP[i][j] = cost;
                                            sDP[i][j] = k;
                                        }
                                    }
                                }
                            }
                        }

                        function getParens(i, j) {
                            if (i === j) return 'A' + i;
                            return '(' + getParens(i, sDP[i][j]) + ' ' + getParens(sDP[i][j] + 1, j) + ')';
                        }

                        computeMatrix();

                        function draw() {
                            viz.clear();
                            viz.screenText('矩阵链乘法 DP', viz.width / 2, 18, viz.colors.white, 15, 'center');
                            viz.screenText('维度: ' + dims.join(' x '), viz.width / 2, 40, viz.colors.text, 11, 'center');

                            // Draw DP table (upper triangular)
                            var cellW = 65;
                            var cellH = 32;
                            var ox = 90;
                            var oy = 65;

                            // Headers
                            for (var j = 1; j <= nMat; j++) {
                                viz.screenText('A' + j, ox + (j - 1) * cellW + cellW / 2, oy - 8, viz.colors.teal, 11, 'center');
                                viz.screenText('A' + j, ox - 18, oy + (j - 1) * cellH + cellH / 2, viz.colors.teal, 11, 'center');
                            }

                            for (var i = 1; i <= nMat; i++) {
                                for (var j = 1; j <= nMat; j++) {
                                    var px = ox + (j - 1) * cellW;
                                    var py = oy + (i - 1) * cellH;
                                    if (j < i) {
                                        viz.drawArrayCell(px, py, cellW, cellH, '', viz.colors.bg, viz.colors.text + '22');
                                    } else if (i === j) {
                                        viz.drawArrayCell(px, py, cellW, cellH, 0, viz.colors.purple + '33', viz.colors.purple);
                                    } else {
                                        var val = mDP[i][j];
                                        var isAns = (i === 1 && j === nMat);
                                        var col = isAns ? viz.colors.green : viz.colors.blue + '33';
                                        var tc = isAns ? viz.colors.green : viz.colors.white;
                                        viz.drawArrayCell(px, py, cellW, cellH, val, col, tc);
                                    }
                                }
                            }

                            // Optimal parenthesization
                            var parens = getParens(1, nMat);
                            viz.screenText('最优括号化:', viz.width / 2, oy + nMat * cellH + 25, viz.colors.white, 13, 'center');
                            viz.screenText(parens, viz.width / 2, oy + nMat * cellH + 48, viz.colors.teal, 12, 'center');
                            viz.screenText('最少乘法次数: ' + mDP[1][nMat], viz.width / 2, oy + nMat * cellH + 72, viz.colors.green, 14, 'center');
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '计算 "SATURDAY" 到 "SUNDAY" 的编辑距离, 并给出具体的编辑操作序列。',
                    hint: '构建 8x6 的 DP 表。',
                    solution: '编辑距离 = 3。一种操作序列: (1) 将 S→S (match), (2) 删除 A, (3) 删除 T, (4) U→U (match), (5) R→N (replace), (6) D→D (match), (7) A→A (match), (8) Y→Y (match)。即: 2 次删除 + 1 次替换 = 3。'
                },
                {
                    question: '矩阵链乘法: 给定维度序列 \\(p = [5, 10, 3, 12, 5, 50, 6]\\), 求 \\(m[1][6]\\) 和最优括号化。',
                    hint: '按链长度从 2 到 6 依次填表。',
                    solution: '计算过程: \\(m[1][2]=150, m[2][3]=360, m[3][4]=180, m[4][5]=3000, m[5][6]=15000\\)。继续填三角: 最终 \\(m[1][6] = 2010\\)。最优括号化: \\(((A_1 A_2)(A_3 A_4))((A_5 A_6))\\) (具体需完整计算)。'
                },
                {
                    question: '证明编辑距离是一个度量 (metric): 满足非负性、同一性、对称性和三角不等式。',
                    hint: '对称性: 操作反转 (插入<->删除)。三角不等式: 组合两次编辑。',
                    solution: '(1) 非负性: 操作数 \\(\\ge 0\\), 显然。(2) 同一性: \\(d(X,X) = 0\\) (无需操作); \\(d(X,Y) = 0 \\Rightarrow X = Y\\)。(3) 对称性: 将 X 转为 Y 的操作可以反转 (插入变删除, 删除变插入, 替换变替换), 得到 Y 转为 X 的等长操作序列, 故 \\(d(X,Y) = d(Y,X)\\)。(4) 三角不等式: \\(d(X,Z) \\le d(X,Y) + d(Y,Z)\\), 因为可以先执行 X→Y 的操作再执行 Y→Z 的操作。'
                }
            ]
        },
        // ===== Section 4: DP on Sequences, Grids, Trees =====
        {
            id: 'ch17-sec04',
            title: 'DP 的多种形态',
            content: `<h2>4 DP 的多种形态</h2>
<p>DP 不局限于一维数组或二维表。不同问题结构催生不同形态的 DP: 序列 DP、网格 DP、区间 DP、树形 DP 等。</p>

<h3>4.1 0-1 背包 (Knapsack)</h3>
<div class="env-block definition">
<div class="env-title">Definition 17.8 (0-1 Knapsack)</div>
<div class="env-body"><p>\\(n\\) 个物品, 物品 \\(i\\) 有价值 \\(v_i\\) 和重量 \\(w_i\\)。背包容量 \\(W\\)。$$dp[i][j] = \\max(dp[i-1][j], \\; dp[i-1][j-w_i] + v_i)$$ 其中 \\(j \\ge w_i\\)。答案为 \\(dp[n][W]\\)。时间 \\(O(nW)\\), 伪多项式时间。</p></div>
</div>

<div class="viz-placeholder" data-viz="ch17-viz-knapsack"></div>

<h3>4.2 网格 DP (Grid DP)</h3>
<div class="env-block example">
<div class="env-title">Example 17.4 (Minimum Path Sum)</div>
<div class="env-body"><p>在 \\(m \\times n\\) 网格中, 每个格子有非负代价, 从左上到右下 (只能向右或向下走) 的最小路径和: $$dp[i][j] = \\text{grid}[i][j] + \\min(dp[i-1][j], dp[i][j-1])$$</p></div>
</div>

<h3>4.3 区间 DP (Interval DP)</h3>
<p>矩阵链乘法就是区间 DP 的典型。另一个例子是<strong>最优二叉搜索树</strong>: 给定键的搜索频率, 构建期望搜索代价最小的 BST。</p>

<div class="env-block definition">
<div class="env-title">Definition 17.9 (Optimal BST)</div>
<div class="env-body"><p>$$e[i][j] = \\begin{cases} q_{i-1} & \\text{if } j = i-1 \\\\ \\min_{i \\le r \\le j} \\{e[i][r-1] + e[r+1][j] + w(i,j)\\} & \\text{if } i \\le j \\end{cases}$$ 其中 \\(w(i,j) = \\sum_{l=i}^{j} p_l + \\sum_{l=i-1}^{j} q_l\\)。</p></div>
</div>

<h3>4.4 树形 DP (Tree DP)</h3>
<p>在树上做 DP, 状态通常定义在节点上, 由子节点的状态转移而来。经典例子: 树的最大独立集。</p>

<div class="env-block example">
<div class="env-title">Example 17.5 (Maximum Independent Set on Tree)</div>
<div class="env-body"><p>树上最大权独立集: \\(dp[v][0]\\) = 不选 \\(v\\) 时以 \\(v\\) 为根的子树的最大权, \\(dp[v][1]\\) = 选 \\(v\\) 时的最大权。$$dp[v][0] = \\sum_{u \\in \\text{children}(v)} \\max(dp[u][0], dp[u][1])$$ $$dp[v][1] = w_v + \\sum_{u \\in \\text{children}(v)} dp[u][0]$$</p></div>
</div>

<div class="viz-placeholder" data-viz="ch17-viz-grid-dp"></div>`,
            visualizations: [
                {
                    id: 'ch17-viz-knapsack',
                    title: '0-1 背包 DP 表',
                    description: '逐步填充 0-1 背包的 DP 表, 回溯选取的物品',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var items = [{name:'A', v:60, w:10}, {name:'B', v:100, w:20}, {name:'C', v:120, w:30}];
                        var W = 50;
                        var nItems = items.length;
                        var dp3 = [];
                        for (var i = 0; i <= nItems; i++) dp3[i] = new Array(W + 1).fill(0);

                        // Pre-compute
                        for (var i = 1; i <= nItems; i++) {
                            for (var j = 0; j <= W; j++) {
                                dp3[i][j] = dp3[i - 1][j];
                                if (j >= items[i - 1].w) {
                                    dp3[i][j] = Math.max(dp3[i][j], dp3[i - 1][j - items[i - 1].w] + items[i - 1].v);
                                }
                            }
                        }

                        var showStep = W + 1; // show all by default

                        function draw() {
                            viz.clear();
                            viz.screenText('0-1 背包 DP', viz.width / 2, 18, viz.colors.white, 15, 'center');
                            viz.screenText('物品: ' + items.map(function(it){return it.name + '(v=' + it.v + ',w=' + it.w + ')';}).join(', ') + '  容量W=' + W, viz.width / 2, 40, viz.colors.text, 11, 'center');

                            // Show compressed table (sample capacities)
                            var sampleW = [0, 10, 20, 30, 40, 50];
                            var cellW2 = 55;
                            var cellH2 = 34;
                            var ox2 = 120;
                            var oy2 = 65;

                            // Headers
                            viz.screenText('w=', ox2 - 20, oy2 - 10, viz.colors.text, 11, 'right');
                            for (var c = 0; c < sampleW.length; c++) {
                                viz.screenText(String(sampleW[c]), ox2 + c * cellW2 + cellW2 / 2, oy2 - 10, viz.colors.teal, 11, 'center');
                            }

                            for (var i = 0; i <= nItems; i++) {
                                var rowLabel = i === 0 ? 'none' : items[i - 1].name;
                                viz.screenText(rowLabel, ox2 - 10, oy2 + 10 + i * cellH2 + cellH2 / 2, viz.colors.teal, 11, 'right');
                                for (var c = 0; c < sampleW.length; c++) {
                                    var j = sampleW[c];
                                    var px = ox2 + c * cellW2;
                                    var py = oy2 + 10 + i * cellH2;
                                    var bg2 = viz.colors.bg;
                                    if (i === nItems && j === W) bg2 = viz.colors.green + '44';
                                    viz.drawArrayCell(px, py, cellW2, cellH2, dp3[i][j], bg2, viz.colors.white);
                                }
                            }

                            // Backtrack
                            var chosen = [];
                            var j2 = W;
                            for (var i = nItems; i >= 1; i--) {
                                if (dp3[i][j2] !== dp3[i - 1][j2]) {
                                    chosen.push(i - 1);
                                    j2 -= items[i - 1].w;
                                }
                            }

                            viz.screenText('最优值: ' + dp3[nItems][W], viz.width / 2, oy2 + 10 + (nItems + 1) * cellH2 + 15, viz.colors.green, 14, 'center');
                            var chosenNames = chosen.map(function(idx) { return items[idx].name; }).reverse().join(', ');
                            viz.screenText('选取: ' + chosenNames, viz.width / 2, oy2 + 10 + (nItems + 1) * cellH2 + 40, viz.colors.yellow, 13, 'center');

                            // Show visual knapsack
                            var kx = 500;
                            var ky = 230;
                            var kw2 = 120;
                            var kh2 = 130;
                            var ctx = viz.ctx;
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(kx, ky, kw2, kh2);
                            var fillY = ky + kh2;
                            var colArr = [viz.colors.blue, viz.colors.teal, viz.colors.orange];
                            for (var c2 = chosen.length - 1; c2 >= 0; c2--) {
                                var idx = chosen[c2];
                                var fh = (items[idx].w / W) * kh2;
                                fillY -= fh;
                                ctx.fillStyle = colArr[idx % colArr.length] + 'aa';
                                ctx.fillRect(kx + 2, fillY, kw2 - 4, fh);
                                viz.screenText(items[idx].name + ':' + items[idx].v, kx + kw2 / 2, fillY + fh / 2, viz.colors.white, 11, 'center');
                            }
                        }

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'ch17-viz-grid-dp',
                    title: '网格最短路径 DP',
                    description: '在网格上逐步计算从左上到右下的最小代价路径',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var grid = [
                            [1, 3, 1, 2],
                            [1, 5, 1, 3],
                            [4, 2, 1, 1],
                            [2, 1, 4, 2]
                        ];
                        var rows = grid.length;
                        var cols = grid[0].length;
                        var dpG = [];
                        for (var i = 0; i < rows; i++) dpG[i] = new Array(cols).fill(0);
                        dpG[0][0] = grid[0][0];
                        for (var j = 1; j < cols; j++) dpG[0][j] = dpG[0][j - 1] + grid[0][j];
                        for (var i = 1; i < rows; i++) dpG[i][0] = dpG[i - 1][0] + grid[i][0];
                        for (var i = 1; i < rows; i++) {
                            for (var j = 1; j < cols; j++) {
                                dpG[i][j] = grid[i][j] + Math.min(dpG[i - 1][j], dpG[i][j - 1]);
                            }
                        }

                        // Backtrack path
                        var path = [];
                        var pi = rows - 1, pj = cols - 1;
                        path.push([pi, pj]);
                        while (pi > 0 || pj > 0) {
                            if (pi === 0) { pj--; }
                            else if (pj === 0) { pi--; }
                            else if (dpG[pi - 1][pj] <= dpG[pi][pj - 1]) { pi--; }
                            else { pj--; }
                            path.push([pi, pj]);
                        }

                        var stepG = 0;
                        var maxStepG = rows * cols;

                        function draw() {
                            viz.clear();
                            viz.screenText('网格最短路径 DP', viz.width / 2, 18, viz.colors.white, 15, 'center');

                            var cellW3 = 65;
                            var cellH3 = 55;
                            var ox3 = 100;
                            var oy3 = 55;

                            var pathSet = {};
                            if (stepG >= maxStepG) {
                                for (var p = 0; p < path.length; p++) {
                                    pathSet[path[p][0] + ',' + path[p][1]] = true;
                                }
                            }

                            for (var i = 0; i < rows; i++) {
                                for (var j = 0; j < cols; j++) {
                                    var px = ox3 + j * (cellW3 + 10);
                                    var py = oy3 + i * (cellH3 + 10);
                                    var idx2 = i * cols + j;
                                    var onPath = pathSet[i + ',' + j];

                                    // Grid value
                                    var ctx = viz.ctx;
                                    ctx.fillStyle = onPath ? viz.colors.green + '33' : viz.colors.bg;
                                    ctx.fillRect(px, py, cellW3, cellH3);
                                    ctx.strokeStyle = onPath ? viz.colors.green : viz.colors.axis;
                                    ctx.lineWidth = onPath ? 2 : 1;
                                    ctx.strokeRect(px, py, cellW3, cellH3);

                                    viz.screenText(String(grid[i][j]), px + cellW3 / 2, py + 15, viz.colors.white, 14, 'center');

                                    if (idx2 < stepG) {
                                        viz.screenText(String(dpG[i][j]), px + cellW3 / 2, py + 38, viz.colors.yellow, 12, 'center');
                                    }
                                }
                            }

                            // Arrows
                            for (var i = 0; i < rows; i++) {
                                for (var j = 0; j < cols - 1; j++) {
                                    var ax = ox3 + j * (cellW3 + 10) + cellW3 + 2;
                                    var ay = oy3 + i * (cellH3 + 10) + cellH3 / 2;
                                    viz.screenText('>', ax + 3, ay, viz.colors.text + '44', 12, 'center');
                                }
                            }

                            if (stepG >= maxStepG) {
                                viz.screenText('最小路径和 = ' + dpG[rows - 1][cols - 1], viz.width / 2, oy3 + rows * (cellH3 + 10) + 15, viz.colors.green, 14, 'center');
                            }
                        }

                        VizEngine.createButton(controls, '下一步', function() {
                            if (stepG < maxStepG) { stepG++; draw(); }
                        });
                        VizEngine.createButton(controls, '全部', function() {
                            stepG = maxStepG; draw();
                        });
                        VizEngine.createButton(controls, '重置', function() {
                            stepG = 0; draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '给定 4 个物品: (价值, 重量) = (10, 5), (40, 4), (30, 6), (50, 3), 背包容量 W=10。用 DP 求最大价值, 并列出选取的物品。',
                    hint: '构建 4x10 的 DP 表 (行=物品, 列=容量)。',
                    solution: 'DP 表最后一行: dp[4][10] = 90。选取物品 2(40,4) + 物品 4(50,3), 总重 7, 总价值 90。回溯: dp[4][10]=90 != dp[3][10]=40, 选物品 4, 剩余容量 7; dp[3][7]=40 = dp[2][7]=40, 不选物品 3; dp[2][7]=40 != dp[1][7]=10, 选物品 2, 剩余容量 3; dp[1][3]=0, 不选物品 1。'
                },
                {
                    question: '最长递增子序列 (LIS) 的 DP 解: 写出递推关系, 给出 \\(O(n^2)\\) 和 \\(O(n\\log n)\\) 算法。',
                    hint: '\\(O(n^2)\\): \\(dp[i]\\) = 以 \\(a_i\\) 结尾的 LIS 长度。\\(O(n\\log n)\\): 维护 "tails" 数组。',
                    solution: '\\(O(n^2)\\): \\(dp[i] = 1 + \\max\\{dp[j] : j < i, a_j < a_i\\}\\)。LIS 长度 = \\(\\max_i dp[i]\\)。\\(O(n\\log n)\\): 维护 tails[] 数组, tails[k] = 长度为 k+1 的递增子序列的最小末尾元素。对每个 \\(a_i\\), 二分查找 tails[] 中第一个 \\(\\ge a_i\\) 的位置, 替换之; 若不存在, 追加。tails 的长度即 LIS 长度。'
                },
                {
                    question: '树上最大独立集的 DP 能否扩展到一般图? 为什么?',
                    hint: '一般图上的最大独立集是 NP-hard 的。',
                    solution: '不能直接扩展。树形 DP 利用了树的无环性和子问题的独立性 — 每个子树的选择不影响其他子树。一般图上存在环, 一个节点的选择可能影响多个"邻域", 子问题不再独立。最大独立集在一般图上是 NP-hard 的, 不太可能有多项式时间的 DP (除非 P=NP)。但对特殊图类 (如弦图、区间图), 仍可用类似 DP 的技术在多项式时间求解。'
                }
            ]
        },
        // ===== Section 5: Space Optimization & Bitmask DP =====
        {
            id: 'ch17-sec05',
            title: '空间优化与状态压缩 DP',
            content: `<h2>5 空间优化与状态压缩 DP</h2>
<p>在实际应用中, DP 的空间往往是瓶颈。本节介绍两种重要的优化技术: 滚动数组 (空间降维) 和位掩码 DP (状态压缩)。</p>

<h3>5.1 滚动数组 (Rolling Array)</h3>
<div class="env-block definition">
<div class="env-title">Definition 17.10 (Space Optimization)</div>
<div class="env-body"><p>若 DP 转移只依赖"前一行"(或前若干行), 可以只保留相关行, 将空间从 \\(O(mn)\\) 降到 \\(O(n)\\) 或 \\(O(1)\\)。</p></div>
</div>

<div class="env-block example">
<div class="env-title">Example 17.6 (0-1 Knapsack Space Optimization)</div>
<div class="env-body"><p>原始: \\(dp[i][j] = \\max(dp[i-1][j], dp[i-1][j-w_i]+v_i)\\), 空间 \\(O(nW)\\)。<br>
优化: 用一维数组 \\(dp[j]\\), <strong>从右向左</strong>更新: \\(dp[j] = \\max(dp[j], dp[j-w_i]+v_i)\\), 空间 \\(O(W)\\)。<br>
关键: 从右向左保证 \\(dp[j-w_i]\\) 用的是上一行的值 (每个物品最多选一次)。</p></div>
</div>

<h3>5.2 位掩码 DP (Bitmask DP)</h3>
<p>当问题涉及<strong>子集选择</strong>且 \\(n\\) 较小 (\\(\\le 20\\) 左右) 时, 可以用整数的二进制位来表示子集状态。</p>

<div class="env-block definition">
<div class="env-title">Definition 17.11 (Bitmask DP)</div>
<div class="env-body"><p>用整数 \\(S\\) 的第 \\(i\\) 位表示元素 \\(i\\) 是否在集合中。状态空间为 \\(\\{0, 1, \\ldots, 2^n - 1\\}\\)。<br>
常见操作: 检查第 \\(i\\) 位 \\((S \\gg i) \\& 1\\), 设置第 \\(i\\) 位 \\(S \\mid (1 \\ll i)\\), 枚举子集。</p></div>
</div>

<div class="env-block example">
<div class="env-title">Example 17.7 (TSP via Bitmask DP)</div>
<div class="env-body"><p>旅行商问题 (TSP): 给定 \\(n\\) 个城市和距离矩阵, 求最短哈密顿回路。<br>
DP: \\(dp[S][i]\\) = 从城市 0 出发, 恰好访问集合 \\(S\\) 中的城市, 最后停在城市 \\(i\\) 的最短路。<br>
$$dp[S][i] = \\min_{j \\in S \\setminus \\{i\\}} \\{dp[S \\setminus \\{i\\}][j] + \\text{dist}(j, i)\\}$$<br>
答案: \\(\\min_i \\{dp[\\text{ALL}][i] + \\text{dist}(i, 0)\\}\\)。时间 \\(O(2^n \\cdot n^2)\\), 空间 \\(O(2^n \\cdot n)\\)。</p></div>
</div>

<div class="viz-placeholder" data-viz="ch17-viz-bitmask-tsp"></div>

<div class="env-block warning">
<div class="env-title">Warning</div>
<div class="env-body"><p>位掩码 DP 的时间和空间都是指数级的, 但对于 \\(n \\le 20\\) 左右的问题来说, \\(2^{20} \\approx 10^6\\) 完全可行。这比暴力枚举的 \\(n!\\) (\\(20! \\approx 2.4 \\times 10^{18}\\)) 好得多。</p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body"><p>DP 的核心在于<strong>子问题定义</strong>。找到好的状态表示是艺术, 不是科学。常见的状态空间: 前缀/后缀 (序列 DP)、区间 (区间 DP)、子树 (树形 DP)、子集 (位掩码 DP)、轮廓线 (网格上的插头 DP)。</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch17-viz-bitmask-tsp',
                    title: 'TSP 位掩码 DP',
                    description: '小规模 TSP 的位掩码 DP 过程展示',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var cities = [
                            {x: 150, y: 100, label: '0'},
                            {x: 400, y: 80, label: '1'},
                            {x: 550, y: 200, label: '2'},
                            {x: 300, y: 300, label: '3'}
                        ];
                        var nC = cities.length;
                        var dist = [];
                        for (var i = 0; i < nC; i++) {
                            dist[i] = [];
                            for (var j = 0; j < nC; j++) {
                                var dx = cities[i].x - cities[j].x;
                                var dy = cities[i].y - cities[j].y;
                                dist[i][j] = Math.round(Math.sqrt(dx * dx + dy * dy));
                            }
                        }

                        // Solve TSP
                        var ALL = (1 << nC) - 1;
                        var INF = 1e9;
                        var dpT = [];
                        var parentT = [];
                        for (var s = 0; s <= ALL; s++) {
                            dpT[s] = new Array(nC).fill(INF);
                            parentT[s] = new Array(nC).fill(-1);
                        }
                        dpT[1][0] = 0; // start at city 0
                        for (var s = 1; s <= ALL; s++) {
                            for (var u = 0; u < nC; u++) {
                                if (!(s & (1 << u))) continue;
                                if (dpT[s][u] >= INF) continue;
                                for (var v = 0; v < nC; v++) {
                                    if (s & (1 << v)) continue;
                                    var ns = s | (1 << v);
                                    var nd = dpT[s][u] + dist[u][v];
                                    if (nd < dpT[ns][v]) {
                                        dpT[ns][v] = nd;
                                        parentT[ns][v] = u;
                                    }
                                }
                            }
                        }

                        // Find best tour
                        var bestEnd = 0, bestDist = INF;
                        for (var u = 1; u < nC; u++) {
                            var td = dpT[ALL][u] + dist[u][0];
                            if (td < bestDist) { bestDist = td; bestEnd = u; }
                        }

                        // Backtrack tour
                        var tour = [0];
                        var cur = bestEnd;
                        var curS = ALL;
                        var tourReverse = [bestEnd];
                        while (cur !== 0) {
                            var prev = parentT[curS][cur];
                            curS = curS ^ (1 << cur);
                            cur = prev;
                            if (cur !== 0) tourReverse.push(cur);
                        }
                        for (var i = tourReverse.length - 1; i >= 0; i--) tour.push(tourReverse[i]);
                        tour.push(0);

                        function draw() {
                            viz.clear();
                            viz.screenText('TSP 位掩码 DP (n=' + nC + ')', viz.width / 2, 18, viz.colors.white, 15, 'center');

                            // Draw all edges lightly
                            for (var i = 0; i < nC; i++) {
                                for (var j = i + 1; j < nC; j++) {
                                    viz.drawEdge(cities[i].x, cities[i].y, cities[j].x, cities[j].y, viz.colors.axis + '33', false, dist[i][j]);
                                }
                            }

                            // Draw tour
                            for (var i = 0; i < tour.length - 1; i++) {
                                var u = tour[i], v = tour[i + 1];
                                viz.drawEdge(cities[u].x, cities[u].y, cities[v].x, cities[v].y, viz.colors.green, true, null, 3);
                            }

                            // Draw cities
                            for (var i = 0; i < nC; i++) {
                                viz.drawNode(cities[i].x, cities[i].y, 22, cities[i].label, viz.colors.blue, viz.colors.white);
                            }

                            viz.screenText('最短回路: ' + tour.join(' -> '), viz.width / 2, 360, viz.colors.teal, 13, 'center');
                            viz.screenText('总距离: ' + bestDist, viz.width / 2, 385, viz.colors.green, 14, 'center');

                            // DP info
                            viz.screenText('状态数: 2^' + nC + ' x ' + nC + ' = ' + ((1 << nC) * nC), 100, 360, viz.colors.text, 11, 'left');
                            viz.screenText('vs 暴力: ' + nC + '! = ' + [1,1,2,6,24,120,720][nC], 100, 380, viz.colors.text, 11, 'left');
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '将 0-1 背包的二维 DP 优化为一维。解释为什么必须从右向左遍历容量。',
                    hint: '如果从左向右, \\(dp[j-w_i]\\) 已经被本轮更新, 相当于可以多次选同一物品 (完全背包)。',
                    solution: '一维 DP: for each item i, for j = W down to w_i: dp[j] = max(dp[j], dp[j-w_i]+v_i)。必须从右向左的原因: 在处理物品 i 时, dp[j-w_i] 应该是"不包含物品 i"的值 (即上一行的值)。从右向左遍历保证了 dp[j-w_i] 尚未在本轮被更新, 因此仍是上一行的值。从左向右遍历时, dp[j-w_i] 可能已经包含了物品 i, 导致物品 i 被选多次, 这实际上解决的是完全背包问题。'
                },
                {
                    question: 'Held-Karp TSP 算法的时间和空间复杂度是什么? 对于 \\(n = 20\\) 个城市, 估算所需的状态数和比暴力的改进倍数。',
                    hint: '状态数 = \\(2^n \\cdot n\\), 暴力 = \\(n!\\)。',
                    solution: '时间: \\(O(2^n \\cdot n^2)\\), 空间: \\(O(2^n \\cdot n)\\)。对于 \\(n = 20\\): 状态数 = \\(2^{20} \\cdot 20 \\approx 2 \\times 10^7\\), 时间 \\(\\approx 2^{20} \\cdot 400 \\approx 4 \\times 10^8\\) (可行)。暴力: \\(20! \\approx 2.4 \\times 10^{18}\\)。改进倍数: \\(\\frac{20!}{2^{20} \\cdot 20^2} \\approx \\frac{2.4 \\times 10^{18}}{4 \\times 10^8} = 6 \\times 10^9\\), 即快了约 60 亿倍。'
                },
                {
                    question: '设计一个位掩码 DP 解决 "最小权完美匹配" 问题: 给定 \\(2n\\) 个点和两两距离, 将它们配对使总距离最小。',
                    hint: '\\(dp[S]\\) = 集合 \\(S\\) 中的点已经配对完毕时的最小代价。每次取 \\(S\\) 中编号最小的未配对点, 枚举其配对对象。',
                    solution: '状态: \\(dp[S]\\) = 集合 \\(S\\) 表示的点都已配对的最小代价。转移: 找 \\(S\\) 中编号最小的点 \\(i\\), 枚举 \\(j \\in S, j \\ne i\\) 作为其配对: \\(dp[S] = \\min_{j \\in S, j>i} \\{dp[S \\setminus \\{i,j\\}] + dist(i,j)\\}\\)。基本情况: \\(dp[\\emptyset] = 0\\)。答案: \\(dp[\\text{ALL}]\\)。时间 \\(O(2^{2n} \\cdot n)\\), 对于 \\(2n \\le 20\\) 可行。'
                },
                {
                    question: '比较动态规划和贪心的时间复杂度。贪心通常比 DP 快多少? 举例说明。',
                    hint: '贪心: 排序 + 一次扫描。DP: 填表。',
                    solution: '贪心通常是 \\(O(n \\log n)\\) (排序) 或 \\(O(n)\\) (一次扫描)。DP 通常是 \\(O(n^2)\\) 或更高 (二维表)。例: 活动选择 — 贪心 \\(O(n\\log n)\\), DP \\(O(n^2)\\); 分数背包 — 贪心 \\(O(n\\log n)\\), 而 0-1 背包 DP \\(O(nW)\\) (伪多项式)。贪心快的本质原因: 贪心只做一次最优选择, DP 需要考虑所有可能的选择。但贪心只在有贪心选择性质时才正确, 适用范围更窄。'
                }
            ]
        }
    ]
});
