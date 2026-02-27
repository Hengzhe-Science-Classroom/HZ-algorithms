// Chapter 7: 排序下界与线性时间排序 — Sorting Lower Bounds & Linear-Time Sorting
window.CHAPTERS.push({
    id: 'ch07',
    number: 7,
    title: '排序下界与线性时间排序',
    subtitle: 'Sorting Lower Bounds & Linear-Time Sorting',
    sections: [
        // ── Section 1: Decision Tree Model ──
        {
            id: 'ch07-sec01',
            title: '决策树模型',
            content: `<h2>决策树模型</h2>
<p>我们已经学习了多种排序算法：插入排序 \\(O(n^2)\\)、归并排序 \\(O(n \\log n)\\)、快速排序期望 \\(O(n \\log n)\\)。一个自然的问题是：<strong>排序能否做得更快？</strong></p>

<p>要回答这个问题，我们需要一个计算模型来定义"更快"的含义。</p>

<div class="env-block definition"><div class="env-title">Definition (Comparison-Based Sorting)</div><div class="env-body">
<p><strong>基于比较的排序算法</strong>只通过元素间的比较（\\(<, \\leq, =, \\geq, >\\)）来获取元素的相对顺序信息。算法不能直接检查元素的具体值（如二进制位）。</p>
<p>归并排序、快速排序、堆排序、插入排序等都是基于比较的排序。</p>
</div></div>

<div class="env-block definition"><div class="env-title">Definition (Decision Tree)</div><div class="env-body">
<p>对于任何基于比较的排序算法和固定的输入大小 \\(n\\)，算法的执行过程可以表示为一棵<strong>决策树</strong>：</p>
<p>- 每个<strong>内部节点</strong>表示一次比较 \\(a_i : a_j\\)</p>
<p>- 每个<strong>叶子节点</strong>表示一个排列（排序结果）</p>
<p>- 从根到叶子的路径对应一次完整的排序过程</p>
<p>- 树的<strong>高度</strong>是最坏情况下的比较次数</p>
</div></div>

<div class="viz-placeholder" data-viz="ch07-viz-decision-tree"></div>

<div class="env-block intuition"><div class="env-title">Intuition</div><div class="env-body">
<p>决策树像一个"二十问游戏"：每次提问（比较）将剩余的可能排列分为两组。要区分所有 \\(n!\\) 种排列，需要足够多的问题。</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch07-viz-decision-tree',
                    title: '排序决策树',
                    description: '展示 n=3 和 n=4 的排序决策树',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var nVal = 3;

                        function draw() {
                            viz.clear();
                            viz.screenText('Decision Tree for Sorting n=' + nVal + ' Elements', 350, 18, viz.colors.white, 15, 'center');

                            if (nVal === 3) {
                                // n=3 decision tree (insertion sort style)
                                var nodeR = 18;

                                // Level 0: a1:a2
                                viz.drawNode(350, 60, nodeR, 'a1:a2', viz.colors.orange, viz.colors.white);

                                // Level 1
                                viz.drawTreeEdge(350, 78, 200, 120, viz.colors.blue);
                                viz.drawTreeEdge(350, 78, 500, 120, viz.colors.red);
                                viz.screenText('\u2264', 265, 95, viz.colors.blue, 11, 'center');
                                viz.screenText('>', 435, 95, viz.colors.red, 11, 'center');

                                // a1<=a2 branch: a2:a3
                                viz.drawNode(200, 135, nodeR, 'a2:a3', viz.colors.orange, viz.colors.white);
                                // a1>a2 branch: a1:a3
                                viz.drawNode(500, 135, nodeR, 'a1:a3', viz.colors.orange, viz.colors.white);

                                // Level 2 from left (a2:a3)
                                viz.drawTreeEdge(200, 153, 120, 195, viz.colors.blue);
                                viz.drawTreeEdge(200, 153, 280, 195, viz.colors.red);
                                viz.screenText('\u2264', 155, 170, viz.colors.blue, 10, 'center');
                                viz.screenText('>', 245, 170, viz.colors.red, 10, 'center');

                                // Leaf: a1,a2,a3 (a1<=a2<=a3)
                                viz.drawNode(120, 210, 16, '', viz.colors.green, viz.colors.white);
                                viz.screenText('1,2,3', 120, 235, viz.colors.green, 10, 'center');

                                // Internal: a1:a3
                                viz.drawNode(280, 210, nodeR, 'a1:a3', viz.colors.orange, viz.colors.white);

                                // From a1:a3 (left subtree)
                                viz.drawTreeEdge(280, 228, 230, 265, viz.colors.blue);
                                viz.drawTreeEdge(280, 228, 330, 265, viz.colors.red);

                                viz.drawNode(230, 280, 16, '', viz.colors.green, viz.colors.white);
                                viz.screenText('1,3,2', 230, 305, viz.colors.green, 10, 'center');
                                viz.drawNode(330, 280, 16, '', viz.colors.green, viz.colors.white);
                                viz.screenText('3,1,2', 330, 305, viz.colors.green, 10, 'center');

                                // Level 2 from right (a1:a3)
                                viz.drawTreeEdge(500, 153, 420, 195, viz.colors.blue);
                                viz.drawTreeEdge(500, 153, 580, 195, viz.colors.red);
                                viz.screenText('\u2264', 455, 170, viz.colors.blue, 10, 'center');
                                viz.screenText('>', 545, 170, viz.colors.red, 10, 'center');

                                // Internal: a2:a3
                                viz.drawNode(420, 210, nodeR, 'a2:a3', viz.colors.orange, viz.colors.white);
                                // Leaf: a2,a1,a3
                                viz.drawNode(580, 210, 16, '', viz.colors.green, viz.colors.white);
                                viz.screenText('2,1,3', 580, 235, viz.colors.green, 10, 'center');

                                viz.drawTreeEdge(420, 228, 380, 265, viz.colors.blue);
                                viz.drawTreeEdge(420, 228, 460, 265, viz.colors.red);

                                viz.drawNode(380, 280, 16, '', viz.colors.green, viz.colors.white);
                                viz.screenText('2,3,1', 380, 305, viz.colors.green, 10, 'center');
                                viz.drawNode(460, 280, 16, '', viz.colors.green, viz.colors.white);
                                viz.screenText('3,2,1', 460, 305, viz.colors.green, 10, 'center');

                                // Stats
                                viz.screenText('Leaves (permutations): 3! = 6', 350, 340, viz.colors.yellow, 12, 'center');
                                viz.screenText('Height = 3 comparisons (worst case)', 350, 360, viz.colors.teal, 12, 'center');
                                viz.screenText('Lower bound: \u2308log\u2082(3!)\u2309 = \u2308log\u2082(6)\u2309 = 3', 350, 380, viz.colors.green, 12, 'center');
                            } else {
                                // n=4 summary
                                viz.screenText('For n=4: 4! = 24 permutations', 350, 70, viz.colors.yellow, 14, 'center');
                                viz.screenText('Lower bound: \u2308log\u2082(24)\u2309 = 5 comparisons', 350, 95, viz.colors.teal, 14, 'center');

                                // Draw a compressed tree
                                var levels = 5;
                                for (var lev = 0; lev <= levels; lev++) {
                                    var nodesAtLevel = Math.min(Math.pow(2, lev), 32);
                                    var spacing = 660 / (nodesAtLevel + 1);
                                    for (var nd = 0; nd < nodesAtLevel; nd++) {
                                        var px = 20 + spacing * (nd + 1);
                                        var py = 130 + lev * 48;
                                        if (lev < levels) {
                                            viz.ctx.fillStyle = viz.colors.orange;
                                            viz.ctx.beginPath();
                                            viz.ctx.arc(px, py, 5, 0, Math.PI * 2);
                                            viz.ctx.fill();
                                        } else {
                                            viz.ctx.fillStyle = viz.colors.green;
                                            viz.ctx.beginPath();
                                            viz.ctx.arc(px, py, 4, 0, Math.PI * 2);
                                            viz.ctx.fill();
                                        }
                                    }
                                    if (lev < 3) {
                                        viz.screenText('Level ' + lev, 680, 130 + lev * 48, viz.colors.text, 10, 'right');
                                    }
                                }
                                viz.screenText('...', 350, 130 + 3 * 48, viz.colors.text, 14, 'center');
                                viz.screenText('Level ' + levels + ': \u226524 leaves', 680, 130 + levels * 48, viz.colors.text, 10, 'right');

                                viz.screenText('Orange = comparisons, Green = permutation outputs', 350, 390, viz.colors.text, 11, 'center');
                                viz.screenText('Merge sort achieves 5 comparisons for n=4 (optimal!)', 350, 410, viz.colors.green, 11, 'center');
                            }
                        }

                        draw();

                        VizEngine.createSelect(controls, 'n', [
                            {value: '3', label: 'n = 3 (detailed)'},
                            {value: '4', label: 'n = 4 (overview)'}
                        ], function(v) {
                            nVal = parseInt(v);
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '为 \\(n = 3\\) 的元素画出使用插入排序的决策树。它与归并排序的决策树有什么不同？',
                    hint: '插入排序先比较 a[1]:a[0]，然后将 a[2] 插入。',
                    solution: '插入排序的决策树：根节点比较 a[1]:a[0]。左子树（a[1]<a[0]，交换后有序[a1,a0]）接下来比较 a[2]:a[1]。右子树（a[1]>=a[0]，已有序[a0,a1]）接下来比较 a[2]:a[1]。最坏情况也是 3 次比较，与归并排序相同。但树的形状不同：插入排序的某些路径只需 2 次比较（如已排序输入），归并排序固定 3 次比较。'
                },
                {
                    question: '一个 \\(n\\) 元素排序决策树至少有多少个叶子？最多有多少个？',
                    hint: '至少要覆盖所有 \\(n!\\) 种排列。某些排列可能出现多次。',
                    solution: '至少 \\(n!\\) 个叶子（每种排列至少对应一个叶子，否则算法无法处理某些输入）。最多 \\(2^h\\) 个叶子（\\(h\\) 是树高），但一棵高为 \\(h\\) 的二叉树最多有 \\(2^h\\) 个叶子。有些叶子可能是不可达的（对应矛盾的比较序列），也可能一种排列对应多个叶子（冗余比较）。'
                },
                {
                    question: '如果允许三路比较（每次比较返回 \\(<, =, >\\) 三种结果），排序的下界变为多少？',
                    hint: '决策树变为三叉树。',
                    solution: '三叉树高度为 \\(h\\) 时最多有 \\(3^h\\) 个叶子。需要 \\(3^h \\geq n!\\)，即 \\(h \\geq \\log_3(n!) = \\log_3 n! = \\frac{\\ln n!}{\\ln 3} \\approx \\frac{n \\ln n}{\\ln 3}\\)。仍然是 \\(\\Omega(n \\log n)\\)，只是常数因子从 \\(1/\\ln 2 \\approx 1.443\\) 变为 \\(1/\\ln 3 \\approx 0.910\\)。三路比较不改变渐近下界。'
                }
            ]
        },

        // ── Section 2: Omega(n log n) Lower Bound ──
        {
            id: 'ch07-sec02',
            title: 'Omega(n log n) 下界',
            content: `<h2>\\(\\Omega(n \\log n)\\) 排序下界</h2>

<div class="env-block theorem"><div class="env-title">Theorem (Comparison Sort Lower Bound)</div><div class="env-body">
<p>任何基于比较的排序算法在最坏情况下需要 \\(\\Omega(n \\log n)\\) 次比较。</p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p>设算法在大小为 \\(n\\) 的输入上的决策树高度为 \\(h\\)。</p>
<p>1. 决策树是一棵二叉树，高度为 \\(h\\) 的二叉树最多有 \\(2^h\\) 个叶子。</p>
<p>2. 要正确排序所有可能的输入排列，决策树至少需要 \\(n!\\) 个叶子。</p>
<p>3. 因此 \\(2^h \\geq n!\\)，即 \\(h \\geq \\log_2(n!)\\)。</p>
<p>4. 由 Stirling 近似 \\(n! \\geq (n/e)^n\\)：</p>
$$h \\geq \\log_2(n!) \\geq \\log_2\\left(\\frac{n}{e}\\right)^n = n \\log_2 n - n \\log_2 e = \\Omega(n \\log n)$$
<p class="qed">∎</p>
</div></div>

<div class="viz-placeholder" data-viz="ch07-viz-lower-bound"></div>

<p>更精确地，下界为：</p>
$$\\lceil \\log_2(n!) \\rceil = n \\log_2 n - n \\log_2 e + \\frac{1}{2} \\log_2 n + O(1) \\approx n \\log_2 n - 1.4427n$$

<div class="env-block example"><div class="env-title">Example</div><div class="env-body">
<p>对于 \\(n = 10\\)：\\(\\log_2(10!) = \\log_2(3628800) \\approx 21.8\\)，即至少需要 22 次比较。</p>
<p>归并排序在 \\(n = 10\\) 时最多用约 \\(n \\lceil \\log_2 n \\rceil - 2^{\\lceil \\log_2 n\\rceil} + 1 = 10 \\cdot 4 - 16 + 1 = 25\\) 次比较。</p>
<p>差距说明归并排序在最坏情况下并非完全最优（但接近）。</p>
</div></div>

<div class="env-block warning"><div class="env-title">Warning</div><div class="env-body">
<p>此下界仅适用于<strong>基于比较</strong>的排序算法。如果我们可以利用元素的额外信息（如它们是有限范围的整数），可以用非比较排序打破这个下界。这就是下一节的主题。</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch07-viz-lower-bound',
                    title: '排序下界与实际算法比较',
                    description: '对比 n! 的 log 与各算法的比较次数',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});

                        function logFactorial(n) {
                            var s = 0;
                            for (var i = 2; i <= n; i++) s += Math.log2(i);
                            return s;
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Comparison Count: Lower Bound vs Algorithms', 350, 18, viz.colors.white, 14, 'center');

                            var plotL = 80, plotR = 650, plotT = 50, plotB = 340;
                            var maxN = 100;

                            // Axes
                            viz.ctx.strokeStyle = viz.colors.axis;
                            viz.ctx.lineWidth = 1;
                            viz.ctx.beginPath();
                            viz.ctx.moveTo(plotL, plotT);
                            viz.ctx.lineTo(plotL, plotB);
                            viz.ctx.lineTo(plotR, plotB);
                            viz.ctx.stroke();
                            viz.screenText('n', plotR + 10, plotB, viz.colors.text, 12);
                            viz.screenText('comparisons', plotL - 10, plotT - 10, viz.colors.text, 11, 'center');

                            for (var ti = 0; ti <= maxN; ti += 20) {
                                var tx = plotL + (ti / maxN) * (plotR - plotL);
                                viz.screenText(String(ti), tx, plotB + 15, viz.colors.text, 10, 'center');
                            }

                            var maxY = maxN * Math.log2(maxN) * 1.2;

                            // Curves
                            var curves = [
                                {name: 'log\u2082(n!)', fn: function(n) { return logFactorial(n); }, color: viz.colors.red, dash: false},
                                {name: 'n log\u2082 n', fn: function(n) { return n * Math.log2(n); }, color: viz.colors.orange, dash: true},
                                {name: 'Merge sort', fn: function(n) { var lg = Math.ceil(Math.log2(n)); return n * lg - Math.pow(2, lg) + 1; }, color: viz.colors.blue, dash: false},
                                {name: 'n(n-1)/2 (bubble)', fn: function(n) { return n * (n - 1) / 2; }, color: viz.colors.purple, dash: true}
                            ];

                            for (var ci = 0; ci < curves.length; ci++) {
                                var curve = curves[ci];
                                viz.ctx.strokeStyle = curve.color;
                                viz.ctx.lineWidth = 2;
                                if (curve.dash) viz.ctx.setLineDash([6, 4]);
                                viz.ctx.beginPath();
                                var started = false;
                                for (var xn = 2; xn <= maxN; xn++) {
                                    var yv = curve.fn(xn);
                                    if (yv > maxY) break;
                                    var sx = plotL + (xn / maxN) * (plotR - plotL);
                                    var sy = plotB - (yv / maxY) * (plotB - plotT);
                                    if (!started) { viz.ctx.moveTo(sx, sy); started = true; }
                                    else viz.ctx.lineTo(sx, sy);
                                }
                                viz.ctx.stroke();
                                viz.ctx.setLineDash([]);
                            }

                            // Legend
                            var legX = 420, legY = 355;
                            for (var li = 0; li < curves.length; li++) {
                                var lx = legX + (li % 2) * 150;
                                var ly = legY + Math.floor(li / 2) * 18;
                                viz.ctx.fillStyle = curves[li].color;
                                viz.ctx.fillRect(lx, ly - 5, 12, 12);
                                viz.screenText(curves[li].name, lx + 16, ly + 1, curves[li].color, 10, 'left');
                            }

                            viz.screenText('Red line = information-theoretic lower bound', 350, 395, viz.colors.red, 11, 'center');
                        }

                        draw();

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '精确计算 \\(\\lceil \\log_2(n!) \\rceil\\) 对 \\(n = 5, 8, 12\\)。比较它们与 \\(n \\lceil \\log_2 n \\rceil\\)（归并排序上界）。',
                    hint: '\\(5! = 120,\\; 8! = 40320,\\; 12! = 479001600\\)。',
                    solution: '\\(n=5\\): \\(\\lceil \\log_2 120 \\rceil = 7\\)。归并排序 \\(\\leq 5 \\cdot 3 - 8 + 1 = 8\\)。Gap = 1。\\(n=8\\): \\(\\lceil \\log_2 40320 \\rceil = 16\\)。归并排序 \\(\\leq 8 \\cdot 3 - 8 + 1 = 17\\)。Gap = 1。\\(n=12\\): \\(\\lceil \\log_2 479001600 \\rceil = 29\\)。归并排序 \\(\\leq 12 \\cdot 4 - 16 + 1 = 33\\)。Gap = 4。随着 \\(n\\) 增大，gap 增大，说明归并排序不是最优的（但差距不大）。'
                },
                {
                    question: '信息论下界说明排序至少需要 \\(\\log_2(n!)\\) 比特的信息。这与排序下界有什么关系？',
                    hint: '每次比较最多提供 1 比特信息。',
                    solution: '输入有 \\(n!\\) 种可能的排列。为确定是哪一种，需要 \\(\\log_2(n!)\\) 比特的信息。每次比较（两路比较）最多提供 1 比特信息（两种结果中的一种）。因此至少需要 \\(\\lceil \\log_2(n!) \\rceil\\) 次比较。这正是决策树高度的下界。信息论提供了另一种理解排序下界的方式。'
                },
                {
                    question: '排序下界 \\(\\Omega(n \\log n)\\) 是否意味着不存在 \\(O(n)\\) 的排序算法？',
                    hint: '注意下界的前提条件。',
                    solution: '不是！下界只适用于基于比较的模型。如果可以利用元素的具体值（而非仅比较），就可以打破这个下界。计数排序（\\(O(n + k)\\)）、基数排序（\\(O(d(n + k))\\)）和桶排序（期望 \\(O(n)\\)）都不基于比较，可以在特定条件下实现线性时间排序。'
                }
            ]
        },

        // ── Section 3: Counting Sort ──
        {
            id: 'ch07-sec03',
            title: '计数排序',
            content: `<h2>计数排序</h2>
<p><strong>计数排序</strong>（Counting Sort）是一种非比较排序算法。它利用元素值域有限的特点，在 \\(O(n + k)\\) 时间内完成排序（\\(k\\) 是值域大小）。</p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Counting Sort)</div><div class="env-body">
<p><strong>CountingSort(A, n, k):</strong></p>
<p>1. 创建计数数组 \\(C[0..k]\\)，初始化为 0</p>
<p>2. For \\(i = 1\\) to \\(n\\)：\\(C[A[i]]{+}{+}\\)（计数每个值的出现次数）</p>
<p>3. For \\(i = 1\\) to \\(k\\)：\\(C[i] = C[i] + C[i-1]\\)（计算前缀和 = 累积计数）</p>
<p>4. For \\(i = n\\) downto \\(1\\)：</p>
<p>&emsp; \\(B[C[A[i]]] = A[i]\\)；\\(C[A[i]]{-}{-}\\)</p>
<p>5. 将 \\(B\\) 复制回 \\(A\\)</p>
</div></div>

<div class="viz-placeholder" data-viz="ch07-viz-counting-sort"></div>

<div class="env-block theorem"><div class="env-title">Theorem</div><div class="env-body">
<p>计数排序的时间复杂度为 \\(\\Theta(n + k)\\)，空间复杂度为 \\(\\Theta(n + k)\\)。当 \\(k = O(n)\\) 时，时间复杂度为 \\(\\Theta(n)\\)。</p>
</div></div>

<div class="env-block definition"><div class="env-title">Key Properties</div><div class="env-body">
<p><strong>稳定性：</strong> 计数排序是稳定的——相等元素的相对顺序在排序后保持不变。步骤 4 中从后往前扫描是保证稳定性的关键。</p>
<p><strong>非原地：</strong> 需要 \\(O(n + k)\\) 的额外空间。</p>
<p><strong>非比较：</strong> 不通过比较来确定顺序，而是直接利用元素值作为数组下标。</p>
</div></div>

<div class="env-block warning"><div class="env-title">Warning</div><div class="env-body">
<p>当 \\(k \\gg n\\) 时（如对 \\(n = 100\\) 个值域为 \\([0, 10^9]\\) 的整数排序），计数排序极其低效——需要创建 \\(10^9\\) 大小的计数数组。此时应使用其他排序方法。</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch07-viz-counting-sort',
                    title: '计数排序演示',
                    description: '交互式展示计数排序的计数、累积和放置过程',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var arr = [4, 2, 2, 8, 3, 3, 1, 4, 2];
                        var maxVal = 9;
                        var phase = 0; // 0=count, 1=prefix, 2=place, 3=done
                        var placeIdx = arr.length - 1;

                        var counts = [];
                        var prefix = [];
                        var output = [];

                        function reset() {
                            counts = [];
                            prefix = [];
                            output = [];
                            for (var i = 0; i <= maxVal; i++) { counts.push(0); prefix.push(0); }
                            for (var j = 0; j < arr.length; j++) output.push(null);
                            phase = 0;
                            placeIdx = arr.length - 1;
                        }

                        reset();

                        function draw() {
                            viz.clear();
                            viz.screenText('Counting Sort', 350, 18, viz.colors.white, 15, 'center');

                            var n = arr.length;
                            var cellW = 45, cellH = 32;

                            // Input array
                            viz.screenText('Input A:', 20, 55, viz.colors.text, 11, 'left');
                            var aStartX = 90;
                            for (var i = 0; i < n; i++) {
                                var hl = (phase === 2 && i === placeIdx) ? viz.colors.yellow : null;
                                viz.drawArrayCell(aStartX + i * cellW, 40, cellW, cellH, arr[i], viz.colors.bg, viz.colors.white, hl);
                            }

                            // Count array
                            var cStartX = 90;
                            var cCellW = 42;
                            viz.screenText('Count C:', 20, 100, viz.colors.text, 11, 'left');

                            var displayCounts = phase === 0 ? counts : prefix;
                            var usedMax = Math.max.apply(null, arr) + 1;
                            for (var ci = 0; ci < usedMax; ci++) {
                                var cCol = displayCounts[ci] > 0 ? viz.colors.blue + '44' : viz.colors.bg;
                                viz.drawArrayCell(cStartX + ci * cCellW, 85, cCellW, cellH, displayCounts[ci], cCol, viz.colors.white);
                                // Index label
                                viz.screenText(String(ci), cStartX + ci * cCellW + cCellW / 2, 85 + cellH + 10, viz.colors.text, 9, 'center');
                            }

                            // Output array
                            viz.screenText('Output B:', 20, 165, viz.colors.text, 11, 'left');
                            for (var oi = 0; oi < n; oi++) {
                                var val = output[oi] !== null ? output[oi] : '';
                                var oCol = output[oi] !== null ? viz.colors.green + '44' : viz.colors.bg;
                                viz.drawArrayCell(aStartX + oi * cellW, 150, cellW, cellH, val, oCol, viz.colors.white);
                            }

                            // Phase description
                            var phaseNames = ['Phase 1: Counting', 'Phase 2: Prefix Sums', 'Phase 3: Placement', 'Done!'];
                            viz.screenText(phaseNames[phase], 350, 210, viz.colors.yellow, 14, 'center');

                            // Bar chart of counts
                            var barW = 35;
                            var barMaxH = 100;
                            var barStartX = (700 - usedMax * (barW + 6)) / 2;
                            var barStartY = 380;
                            var maxC = Math.max.apply(null, displayCounts.slice(0, usedMax));
                            if (maxC === 0) maxC = 1;

                            for (var bi = 0; bi < usedMax; bi++) {
                                var h = (displayCounts[bi] / maxC) * barMaxH;
                                var px = barStartX + bi * (barW + 6);
                                var py = barStartY - h;
                                var barCol = phase <= 1 ? viz.colors.blue : viz.colors.green;
                                viz.ctx.fillStyle = barCol;
                                viz.ctx.fillRect(px, py, barW, h);
                                viz.screenText(String(displayCounts[bi]), px + barW / 2, py - 8, viz.colors.white, 10, 'center');
                                viz.screenText(String(bi), px + barW / 2, barStartY + 10, viz.colors.text, 10, 'center');
                            }

                            if (phase <= 1) {
                                viz.screenText('Count/Prefix array values as bars', 350, barStartY + 28, viz.colors.text, 10, 'center');
                            }
                        }

                        draw();

                        VizEngine.createButton(controls, 'Step', function() {
                            if (phase === 0) {
                                // Count phase
                                for (var i = 0; i < arr.length; i++) counts[arr[i]]++;
                                phase = 1;
                            } else if (phase === 1) {
                                // Prefix sum
                                for (var ci = 0; ci <= maxVal; ci++) prefix[ci] = counts[ci];
                                for (var pi = 1; pi <= maxVal; pi++) prefix[pi] += prefix[pi - 1];
                                phase = 2;
                                placeIdx = arr.length - 1;
                            } else if (phase === 2) {
                                // Place one element
                                if (placeIdx >= 0) {
                                    var val = arr[placeIdx];
                                    prefix[val]--;
                                    output[prefix[val]] = val;
                                    placeIdx--;
                                    if (placeIdx < 0) phase = 3;
                                }
                            }
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            reset();
                            draw();
                        });
                        VizEngine.createButton(controls, 'New Array', function() {
                            arr = [];
                            for (var i = 0; i < 10; i++) arr.push(Math.floor(Math.random() * 8) + 1);
                            reset();
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '对数组 \\([3, 6, 4, 1, 3, 4, 1, 4]\\) 执行计数排序（值域 0-6），写出每个阶段后的 C 数组。',
                    hint: '先计数，再前缀和，再放置。',
                    solution: '计数后 C = [0, 2, 0, 2, 3, 0, 1]（C[i] = i 出现的次数）。前缀和后 C = [0, 2, 2, 4, 7, 7, 8]（C[i] = \\(\\leq i\\) 的元素个数）。放置过程（从后往前）：A[7]=4, C[4]=7->6, B[6]=4; A[6]=1, C[1]=2->1, B[1]=1; ... 最终 B = [1, 1, 3, 3, 4, 4, 4, 6]。'
                },
                {
                    question: '为什么步骤 4 中要从后往前（downto）扫描？如果从前往后会怎样？',
                    hint: '考虑稳定性。',
                    solution: '从后往前保证稳定性。前缀和 C[v] 记录的是值为 v 的元素应放在的最后一个位置。从后往前扫描时，后出现的相等元素先被放到较后的位置（C[v]--），先出现的相等元素后被放到较前的位置。这保持了相等元素的原始相对顺序。如果从前往后扫描，相等元素的顺序会反转，排序不再稳定。稳定性对基数排序至关重要。'
                },
                {
                    question: '如何将计数排序扩展为能处理负整数的情况？',
                    hint: '偏移值域。',
                    solution: '找到最小值 \\(\\text{min}\\) 和最大值 \\(\\text{max}\\)。对每个元素加上偏移 \\(-\\text{min}\\)，使所有值 \\(\\geq 0\\)。在值域 \\([0, \\text{max} - \\text{min}]\\) 上执行计数排序。输出时减去偏移。时间复杂度 \\(O(n + k)\\)，其中 \\(k = \\text{max} - \\text{min}\\)。'
                }
            ]
        },

        // ── Section 4: Radix Sort ──
        {
            id: 'ch07-sec04',
            title: '基数排序',
            content: `<h2>基数排序</h2>
<p><strong>基数排序</strong>（Radix Sort）通过逐位（或逐数字）排序来处理多关键字排序问题。它从最低有效位（LSD）到最高有效位依次对每一位使用稳定排序（通常是计数排序）。</p>

<div class="env-block algorithm"><div class="env-title">Algorithm (LSD Radix Sort)</div><div class="env-body">
<p><strong>RadixSort(A, d):</strong></p>
<p>1. For \\(i = 1\\) to \\(d\\)（从最低位到最高位）：</p>
<p>2. &emsp; 对 A 按第 \\(i\\) 位使用稳定排序（如计数排序）</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem</div><div class="env-body">
<p>给定 \\(n\\) 个 \\(d\\) 位数，每位取值范围 \\([0, k-1]\\)，基数排序的时间复杂度为 \\(O(d(n + k))\\)。</p>
<p>若每个数可用 \\(b\\) 比特表示，选择 \\(r\\) 比特为一组（即 \\(k = 2^r\\)，\\(d = \\lceil b/r \\rceil\\)），则时间为 \\(O(\\frac{b}{r}(n + 2^r))\\)。当 \\(r = \\log_2 n\\) 时，时间为 \\(O(bn/\\log n)\\)。</p>
</div></div>

<div class="viz-placeholder" data-viz="ch07-viz-radix-sort"></div>

<div class="env-block intuition"><div class="env-title">Intuition</div><div class="env-body">
<p>为什么从最低位开始而不是最高位？从最低位开始（LSD），利用稳定排序的性质：当处理第 \\(i\\) 位时，第 \\(1\\) 到 \\(i-1\\) 位已经排好了。相同第 \\(i\\) 位的元素保持之前的相对顺序（稳定性），从而保证所有位排完后整体有序。</p>
</div></div>

<div class="env-block example"><div class="env-title">Example</div><div class="env-body">
<p>对于 32 位整数（\\(b = 32\\)），选 \\(r = 8\\)（按字节分）：\\(d = 4\\) 趟，\\(k = 256\\)。时间 \\(O(4(n + 256)) = O(n)\\)（当 \\(n \\gg 256\\) 时）。</p>
<p>对于 64 位整数，选 \\(r = 16\\)：\\(d = 4\\) 趟，\\(k = 65536\\)。时间 \\(O(4(n + 65536))\\)，当 \\(n \\geq 10^5\\) 时接近线性。</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch07-viz-radix-sort',
                    title: '基数排序逐位演示',
                    description: '交互式展示 LSD 基数排序的每一趟处理',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var arr = [329, 457, 657, 839, 436, 720, 355];
                        var maxDigits = 3;
                        var currentDigit = 0;
                        var sortedArr = arr.slice();

                        function getDigit(num, d) {
                            return Math.floor(num / Math.pow(10, d)) % 10;
                        }

                        function stableSortByDigit(a, d) {
                            var buckets = [];
                            for (var i = 0; i < 10; i++) buckets.push([]);
                            for (var j = 0; j < a.length; j++) {
                                buckets[getDigit(a[j], d)].push(a[j]);
                            }
                            var result = [];
                            for (var b = 0; b < 10; b++) {
                                for (var k = 0; k < buckets[b].length; k++) {
                                    result.push(buckets[b][k]);
                                }
                            }
                            return result;
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Radix Sort (LSD, base 10)', 350, 18, viz.colors.white, 15, 'center');

                            var n = sortedArr.length;
                            var cellW = 60, cellH = 35;
                            var startX = (700 - n * cellW) / 2;

                            // Current array
                            viz.screenText('Current array (after sorting digit ' + currentDigit + '):', 20, 55, viz.colors.text, 11, 'left');
                            var colors = [];
                            for (var i = 0; i < n; i++) {
                                colors.push(viz.colors.bg);
                            }
                            viz.drawArray(sortedArr, startX, 65, cellW, cellH);

                            // Highlight current digit in each number
                            viz.screenText('Digit position ' + currentDigit + ' (ones=' + (currentDigit === 0 ? 'current' : '') + ', tens=' + (currentDigit === 1 ? 'current' : '') + ', hundreds=' + (currentDigit === 2 ? 'current' : '') + '):', 20, 120, viz.colors.orange, 11, 'left');

                            // Show buckets
                            var buckets = [];
                            for (var b = 0; b < 10; b++) buckets.push([]);
                            for (var j = 0; j < n; j++) {
                                buckets[getDigit(sortedArr[j], currentDigit)].push(sortedArr[j]);
                            }

                            var bucketY = 150;
                            var bucketCellW = 55, bucketCellH = 28;
                            viz.screenText('Buckets (by digit ' + currentDigit + '):', 20, bucketY - 5, viz.colors.teal, 11, 'left');

                            for (var bi = 0; bi < 10; bi++) {
                                var bx = 50;
                                var by = bucketY + bi * (bucketCellH + 2);
                                if (by + bucketCellH > 400) break;
                                viz.screenText(String(bi) + ':', bx - 20, by + bucketCellH / 2, viz.colors.yellow, 11, 'right');
                                for (var bj = 0; bj < buckets[bi].length; bj++) {
                                    var bColor = viz.colors.bg;
                                    viz.drawArrayCell(bx + bj * bucketCellW, by, bucketCellW, bucketCellH, buckets[bi][bj], bColor, viz.colors.white);
                                    // Highlight the current digit
                                    var numStr = String(buckets[bi][bj]).padStart(3, '0');
                                    var digitPos = 2 - currentDigit; // position in string
                                    var digitChar = numStr[digitPos];
                                    viz.screenText(digitChar, bx + bj * bucketCellW + bucketCellW / 2, by + bucketCellH + 8, viz.colors.orange, 9, 'center');
                                }
                                if (buckets[bi].length === 0) {
                                    viz.screenText('(empty)', bx + 10, by + bucketCellH / 2, viz.colors.axis, 9, 'left');
                                }
                            }
                        }

                        draw();

                        VizEngine.createButton(controls, 'Sort This Digit', function() {
                            sortedArr = stableSortByDigit(sortedArr, currentDigit);
                            draw();
                        });
                        VizEngine.createButton(controls, 'Next Digit', function() {
                            if (currentDigit < maxDigits - 1) {
                                sortedArr = stableSortByDigit(sortedArr, currentDigit);
                                currentDigit++;
                                draw();
                            }
                        });
                        VizEngine.createButton(controls, 'Full Sort', function() {
                            sortedArr = arr.slice();
                            for (var d = 0; d < maxDigits; d++) {
                                sortedArr = stableSortByDigit(sortedArr, d);
                            }
                            currentDigit = maxDigits - 1;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            sortedArr = arr.slice();
                            currentDigit = 0;
                            draw();
                        });
                        VizEngine.createButton(controls, 'New Array', function() {
                            arr = [];
                            for (var i = 0; i < 7; i++) arr.push(Math.floor(Math.random() * 900) + 100);
                            sortedArr = arr.slice();
                            currentDigit = 0;
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '对 \\([170, 45, 75, 90, 802, 24, 2, 66]\\) 执行基数排序。写出每一趟排序后的数组。',
                    hint: '三位数，从个位开始。',
                    solution: '原始: [170, 45, 75, 90, 802, 24, 2, 66]。按个位排序: [170, 90, 802, 2, 24, 45, 75, 66]。按十位排序: [802, 2, 24, 45, 66, 170, 75, 90]。按百位排序: [2, 24, 45, 66, 75, 90, 170, 802]。'
                },
                {
                    question: '基数排序的稳定性为什么至关重要？如果内部排序不稳定会发生什么？',
                    hint: '考虑先排的低位信息是否被保留。',
                    solution: '稳定性保证了当高位相同时，低位的排序结果被保持。例如排 [329, 355] 按十位排序后都在 "5" 桶中。因为之前按个位排序时 355 < 329（5<9），稳定排序保持 355 在 329 前面。如果不稳定，之前低位排序建立的顺序会被打乱，导致最终结果不正确。'
                },
                {
                    question: '如何用基数排序对字符串排序？复杂度是什么？',
                    hint: '字符串可以看作字符的"数字"序列。',
                    solution: '将字符串看作以字符为"数字"的数。对于等长字符串（长度 \\(d\\)），从最后一个字符到第一个字符依次用计数排序（\\(k = |\\Sigma|\\)，字母表大小）。时间 \\(O(d(n + |\\Sigma|))\\)。对于不等长字符串，用 MSD 基数排序（从最高位开始），短字符串在对应位用特殊的最小值字符。或者先按长度分组再排序。'
                },
                {
                    question: '基数排序什么时候比快速排序快？什么时候更慢？',
                    hint: '比较 \\(O(dn)\\) 和 \\(O(n \\log n)\\)。',
                    solution: '基数排序时间 \\(O(d(n+k))\\)。当 \\(d\\) 是常数且 \\(k = O(n)\\) 时，为 \\(O(n)\\)，优于快速排序。例如排序 100 万个 32 位整数：基数排序 \\(O(4n) = 4 \\times 10^6\\) 操作，快速排序 \\(O(n \\log n) \\approx 2 \\times 10^7\\)。但当 \\(d\\) 很大（如长字符串）或 \\(k\\) 很大时，基数排序可能更慢。另外，快速排序的缓存局部性更好，实际中常数因子更小。'
                }
            ]
        },

        // ── Section 5: Bucket Sort ──
        {
            id: 'ch07-sec05',
            title: '桶排序',
            content: `<h2>桶排序</h2>
<p><strong>桶排序</strong>（Bucket Sort）假设输入数据均匀分布在某个区间（如 \\([0, 1)\\)），将数据分配到等宽的"桶"中，再对每个桶内部排序。</p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Bucket Sort)</div><div class="env-body">
<p><strong>BucketSort(A, n):</strong></p>
<p>1. 创建 \\(n\\) 个空桶 \\(B[0], B[1], \\ldots, B[n-1]\\)</p>
<p>2. For \\(i = 1\\) to \\(n\\)：将 \\(A[i]\\) 放入桶 \\(B[\\lfloor n \\cdot A[i] \\rfloor]\\)</p>
<p>3. 对每个非空桶用插入排序（或其他排序）</p>
<p>4. 依次连接所有桶的内容</p>
</div></div>

<div class="viz-placeholder" data-viz="ch07-viz-bucket-sort"></div>

<div class="env-block theorem"><div class="env-title">Theorem</div><div class="env-body">
<p>当输入在 \\([0, 1)\\) 上均匀分布时，桶排序的<strong>期望</strong>时间复杂度为 \\(\\Theta(n)\\)。</p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p>设 \\(n_i\\) 为桶 \\(i\\) 中的元素数。对桶 \\(i\\) 使用插入排序的时间为 \\(O(n_i^2)\\)。总时间：</p>
$$T(n) = \\Theta(n) + \\sum_{i=0}^{n-1} O(n_i^2)$$
<p>取期望：\\(E[T(n)] = \\Theta(n) + \\sum_{i=0}^{n-1} E[n_i^2]\\)。</p>
<p>由于均匀分布，每个元素落入桶 \\(i\\) 的概率为 \\(1/n\\)。\\(n_i \\sim \\text{Binomial}(n, 1/n)\\)。</p>
$$E[n_i^2] = \\text{Var}[n_i] + (E[n_i])^2 = \\frac{n-1}{n^2} + \\frac{1}{n^2} \\cdot n^2 \\cdot \\frac{1}{n^2} \\ldots$$
<p>更直接地：\\(E[n_i^2] = n \\cdot \\frac{1}{n} \\cdot (1 - \\frac{1}{n}) + (n \\cdot \\frac{1}{n})^2 = 2 - 1/n\\)。</p>
$$\\sum_{i=0}^{n-1} E[n_i^2] = n(2 - 1/n) = 2n - 1 = \\Theta(n)$$
<p class="qed">∎</p>
</div></div>

<div class="viz-placeholder" data-viz="ch07-viz-sort-comparison"></div>

<div class="env-block example"><div class="env-title">Example (Summary: When to Use What)</div><div class="env-body">
<p><strong>计数排序：</strong> 值域小的整数（如年龄 0-150、成绩 0-100）。</p>
<p><strong>基数排序：</strong> 固定长度的整数或字符串（如电话号码、IP 地址、固定格式 ID）。</p>
<p><strong>桶排序：</strong> 均匀分布的浮点数、哈希值。</p>
<p><strong>比较排序：</strong> 通用情况，无法利用数据特殊结构时。</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch07-viz-bucket-sort',
                    title: '桶排序演示',
                    description: '交互式展示桶排序的分桶和排序过程',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var n = 12;
                        var arr = [];
                        var numBuckets = 5;
                        var sorted = false;

                        function generateData() {
                            arr = [];
                            for (var i = 0; i < n; i++) arr.push(parseFloat((Math.random()).toFixed(2)));
                            sorted = false;
                        }
                        generateData();

                        function draw() {
                            viz.clear();
                            viz.screenText('Bucket Sort (uniform distribution on [0, 1))', 350, 18, viz.colors.white, 14, 'center');

                            // Input array as bar chart
                            var barW = 30;
                            var maxH = 80;
                            var barStartX = (700 - n * (barW + 4)) / 2;
                            var barStartY = 100;

                            viz.screenText('Input:', 20, 60, viz.colors.text, 11, 'left');

                            for (var i = 0; i < n; i++) {
                                var h = arr[i] * maxH;
                                var px = barStartX + i * (barW + 4);
                                var py = barStartY - h;
                                var bucketIdx = Math.min(Math.floor(arr[i] * numBuckets), numBuckets - 1);
                                var bucketColors = [viz.colors.blue, viz.colors.teal, viz.colors.green, viz.colors.orange, viz.colors.purple, viz.colors.red, viz.colors.yellow, viz.colors.pink];
                                var col = bucketColors[bucketIdx % bucketColors.length];
                                viz.ctx.fillStyle = col;
                                viz.ctx.fillRect(px, py, barW, h);
                                viz.screenText(arr[i].toFixed(2), px + barW / 2, barStartY + 8, viz.colors.text, 8, 'center');
                            }

                            // Buckets
                            var buckets = [];
                            for (var b = 0; b < numBuckets; b++) buckets.push([]);
                            for (var j = 0; j < n; j++) {
                                var bi = Math.min(Math.floor(arr[j] * numBuckets), numBuckets - 1);
                                buckets[bi].push(arr[j]);
                            }
                            if (sorted) {
                                for (var b2 = 0; b2 < numBuckets; b2++) {
                                    buckets[b2].sort(function(a, b) { return a - b; });
                                }
                            }

                            var bucketY = 135;
                            viz.screenText('Buckets' + (sorted ? ' (sorted)' : '') + ':', 20, bucketY, viz.colors.teal, 11, 'left');
                            var bucketColors2 = [viz.colors.blue, viz.colors.teal, viz.colors.green, viz.colors.orange, viz.colors.purple, viz.colors.red, viz.colors.yellow, viz.colors.pink];

                            for (var bi2 = 0; bi2 < numBuckets; bi2++) {
                                var by = bucketY + 18 + bi2 * 36;
                                var range0 = (bi2 / numBuckets).toFixed(2);
                                var range1 = ((bi2 + 1) / numBuckets).toFixed(2);
                                viz.screenText('[' + range0 + ',' + range1 + ')', 70, by + 12, bucketColors2[bi2 % bucketColors2.length], 10, 'right');

                                for (var bj = 0; bj < buckets[bi2].length; bj++) {
                                    viz.drawArrayCell(90 + bj * 55, by, 55, 28, buckets[bi2][bj].toFixed(2), bucketColors2[bi2 % bucketColors2.length] + '33', viz.colors.white);
                                }
                                if (buckets[bi2].length === 0) {
                                    viz.screenText('(empty)', 100, by + 14, viz.colors.axis, 9, 'left');
                                }
                            }

                            // Output if sorted
                            if (sorted) {
                                var output = [];
                                for (var oi = 0; oi < numBuckets; oi++) {
                                    for (var oj = 0; oj < buckets[oi].length; oj++) {
                                        output.push(buckets[oi][oj]);
                                    }
                                }
                                var outY = bucketY + 18 + numBuckets * 36 + 10;
                                viz.screenText('Output:', 20, outY, viz.colors.green, 11, 'left');
                                var outBarX = (700 - output.length * (barW + 4)) / 2;
                                for (var ok = 0; ok < output.length; ok++) {
                                    var oh = output[ok] * maxH;
                                    var opx = outBarX + ok * (barW + 4);
                                    var opy = outY + 70 - oh;
                                    viz.ctx.fillStyle = viz.colors.green;
                                    viz.ctx.fillRect(opx, opy, barW, oh);
                                    viz.screenText(output[ok].toFixed(2), opx + barW / 2, outY + 78, viz.colors.text, 8, 'center');
                                }
                            }
                        }

                        draw();

                        VizEngine.createButton(controls, 'Sort Buckets', function() {
                            sorted = true;
                            draw();
                        });
                        VizEngine.createButton(controls, 'New Data', function() {
                            generateData();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            sorted = false;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'Buckets', 3, 10, numBuckets, 1, function(v) {
                            numBuckets = Math.round(v);
                            sorted = false;
                            draw();
                        });

                        return viz;
                    }
                },
                {
                    id: 'ch07-viz-sort-comparison',
                    title: '排序算法综合对比',
                    description: '总结所有排序算法的复杂度和适用场景',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});

                        function draw() {
                            viz.clear();
                            viz.screenText('Sorting Algorithm Comparison', 350, 18, viz.colors.white, 15, 'center');

                            var algorithms = [
                                {name: 'Insertion Sort', best: 'n', avg: 'n^2', worst: 'n^2', space: '1', stable: 'Yes', type: 'Comp'},
                                {name: 'Merge Sort', best: 'n log n', avg: 'n log n', worst: 'n log n', space: 'n', stable: 'Yes', type: 'Comp'},
                                {name: 'Quicksort', best: 'n log n', avg: 'n log n', worst: 'n^2', space: 'log n', stable: 'No', type: 'Comp'},
                                {name: 'Heapsort', best: 'n log n', avg: 'n log n', worst: 'n log n', space: '1', stable: 'No', type: 'Comp'},
                                {name: 'Counting Sort', best: 'n+k', avg: 'n+k', worst: 'n+k', space: 'n+k', stable: 'Yes', type: 'Non-comp'},
                                {name: 'Radix Sort', best: 'dn', avg: 'dn', worst: 'dn', space: 'n+k', stable: 'Yes', type: 'Non-comp'},
                                {name: 'Bucket Sort', best: 'n', avg: 'n', worst: 'n^2', space: 'n+k', stable: 'Yes', type: 'Non-comp'}
                            ];

                            var headers = ['Algorithm', 'Best', 'Average', 'Worst', 'Space', 'Stable', 'Type'];
                            var colWidths = [130, 75, 75, 75, 70, 55, 85];
                            var startX = 20;
                            var startY = 50;
                            var rowH = 30;

                            // Header
                            var hx = startX;
                            for (var h = 0; h < headers.length; h++) {
                                viz.ctx.fillStyle = viz.colors.blue + '33';
                                viz.ctx.fillRect(hx, startY, colWidths[h], rowH);
                                viz.ctx.strokeStyle = viz.colors.axis;
                                viz.ctx.lineWidth = 0.5;
                                viz.ctx.strokeRect(hx, startY, colWidths[h], rowH);
                                viz.screenText(headers[h], hx + colWidths[h] / 2, startY + rowH / 2, viz.colors.blue, 11, 'center');
                                hx += colWidths[h];
                            }

                            // Rows
                            for (var r = 0; r < algorithms.length; r++) {
                                var alg = algorithms[r];
                                var ry = startY + (r + 1) * rowH;
                                var vals = [alg.name, alg.best, alg.avg, alg.worst, alg.space, alg.stable, alg.type];
                                var rx = startX;
                                var rowColor = alg.type === 'Comp' ? viz.colors.bg : '#1a2a1a';

                                for (var c = 0; c < vals.length; c++) {
                                    viz.ctx.fillStyle = rowColor;
                                    viz.ctx.fillRect(rx, ry, colWidths[c], rowH);
                                    viz.ctx.strokeStyle = viz.colors.axis;
                                    viz.ctx.lineWidth = 0.5;
                                    viz.ctx.strokeRect(rx, ry, colWidths[c], rowH);
                                    var textCol = viz.colors.white;
                                    if (c === 3 && vals[c] === 'n^2') textCol = viz.colors.red;
                                    if (c === 3 && (vals[c] === 'n log n' || vals[c] === 'n+k' || vals[c] === 'dn')) textCol = viz.colors.green;
                                    viz.screenText(vals[c], rx + colWidths[c] / 2, ry + rowH / 2, textCol, 10, 'center');
                                    rx += colWidths[c];
                                }
                            }

                            // Lower bound line
                            var lbY = startY + (algorithms.length + 1) * rowH + 15;
                            viz.screenText('Lower bound for comparison sorts: \u03A9(n log n)', 350, lbY, viz.colors.red, 13, 'center');
                            viz.screenText('Non-comparison sorts bypass this by exploiting element structure', 350, lbY + 22, viz.colors.green, 12, 'center');

                            // Color legend
                            viz.ctx.fillStyle = viz.colors.bg;
                            viz.ctx.fillRect(250, lbY + 40, 15, 15);
                            viz.ctx.strokeStyle = viz.colors.axis;
                            viz.ctx.strokeRect(250, lbY + 40, 15, 15);
                            viz.screenText('Comparison-based', 270, lbY + 48, viz.colors.text, 10, 'left');

                            viz.ctx.fillStyle = '#1a2a1a';
                            viz.ctx.fillRect(420, lbY + 40, 15, 15);
                            viz.ctx.strokeStyle = viz.colors.axis;
                            viz.ctx.strokeRect(420, lbY + 40, 15, 15);
                            viz.screenText('Non-comparison', 440, lbY + 48, viz.colors.text, 10, 'left');
                        }

                        draw();

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '桶排序的最坏情况什么时候发生？时间复杂度是什么？',
                    hint: '考虑所有元素落入同一个桶的情况。',
                    solution: '最坏情况发生在所有元素落入同一个桶时（如所有元素值非常接近）。此时该桶需要排序 \\(n\\) 个元素，使用插入排序为 \\(O(n^2)\\)。如果桶内使用 \\(O(n \\log n)\\) 的排序算法，最坏情况为 \\(O(n \\log n)\\)。桶排序的线性期望复杂度依赖于输入的均匀分布假设。'
                },
                {
                    question: '如果桶排序的输入不是均匀分布（如正态分布），如何调整桶的宽度以保持期望线性时间？',
                    hint: '使分配到每个桶的期望元素数相等。',
                    solution: '使用分位数（quantiles）来确定桶的边界，使每个桶的期望元素数为 \\(O(1)\\)。对于正态分布 \\(N(\\mu, \\sigma^2)\\)，桶边界用正态 CDF 的逆函数确定：第 \\(i\\) 个桶的范围为 \\([\\Phi^{-1}(i/n), \\Phi^{-1}((i+1)/n))\\)。如果分布未知，可以先采样估计分位数，或者使用自适应桶划分。'
                },
                {
                    question: '比较排序、计数排序、基数排序和桶排序在以下场景中的选择：(1) 排序 100 万个 32 位整数 (2) 排序 1000 个浮点数 (3) 排序 100 万个长度 20 的字符串',
                    hint: '考虑数据特点和各算法的适用条件。',
                    solution: '(1) 100 万个 32 位整数：基数排序最优，\\(O(4n)\\) 用 4 趟字节级计数排序。比较排序需 \\(O(n \\log n) \\approx 2 \\times 10^7\\)，基数排序约 \\(4 \\times 10^6\\)。(2) 1000 个浮点数：比较排序（如快速排序），因为 \\(n\\) 小，常数因子更重要，且浮点数不适合直接计数。(3) 100 万个长度 20 的字符串：基数排序（MSD）或比较排序。如果字符集小（如 ASCII），基数排序 \\(O(20 \\cdot 10^6)\\) 很高效。比较排序 \\(O(n \\log n \\cdot 20) \\approx 4 \\times 10^8\\)（每次比较最多扫描 20 字符）。基数排序可能更快。'
                },
                {
                    question: '存在比 \\(O(n \\log n)\\) 更快的通用排序算法吗？在什么意义下？',
                    hint: '考虑不同的计算模型。',
                    solution: '在基于比较的模型中，\\(\\Omega(n \\log n)\\) 是无条件的下界。但在其他模型中可以更快：(1) Word RAM 模型：如果元素是 \\(w\\) 比特的整数，可以用 Andersson 等人的算法在 \\(O(n \\sqrt{\\log \\log n})\\) 期望时间排序。(2) 量子计算模型：量子排序的下界仍是 \\(\\Omega(n \\log n)\\)。(3) 并行模型：用 \\(n\\) 个处理器可以 \\(O(\\log n)\\) 时间排序（如 AKS 排序网络）。(4) 随机输入：如果已知输入分布，桶排序可以 \\(O(n)\\)。所以"通用"取决于计算模型和输入假设。'
                },
                {
                    question: '设计一个排序算法，对值域为 \\([0, n^2 - 1]\\) 的 \\(n\\) 个整数在 \\(\\Theta(n)\\) 时间内排序。',
                    hint: '将每个数看成两位的 \\(n\\) 进制数。',
                    solution: '将每个数 \\(x\\) 表示为 \\(x = a \\cdot n + b\\)，其中 \\(a = \\lfloor x/n \\rfloor,\\; b = x \\bmod n\\)，两位都在 \\([0, n-1]\\) 范围。使用基数排序：第一趟按 \\(b\\) 排序（计数排序，\\(k = n\\)，时间 \\(O(n)\\)），第二趟按 \\(a\\) 排序（计数排序，\\(k = n\\)，时间 \\(O(n)\\)）。总时间 \\(O(2 \\cdot (n + n)) = \\Theta(n)\\)。'
                }
            ]
        }
    ]
});
