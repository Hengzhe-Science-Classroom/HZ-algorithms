// ============================================================
//  Ch 16 · 贪心算法 (Greedy Algorithms)
// ============================================================
window.CHAPTERS.push({
    id: 'ch16',
    number: 16,
    title: '贪心算法',
    subtitle: 'Greedy Algorithms — Making Locally Optimal Choices',
    sections: [
        // ===== Section 1: Greedy Paradigm =====
        {
            id: 'ch16-sec01',
            title: '贪心策略概述',
            content: `<h2>1 贪心策略概述</h2>
<p>贪心算法 (greedy algorithm) 是一种在每一步都做出<strong>局部最优选择</strong>的算法范式, 期望由此达到全局最优解。与动态规划不同, 贪心不需要回溯或记忆过去的决策, 而是一路向前, 每次贪心地选择当前最有利的选项。</p>

<div class="env-block definition">
<div class="env-title">Definition 16.1 (Greedy Algorithm)</div>
<div class="env-body"><p>设问题的解由一系列选择 \\(c_1, c_2, \\ldots, c_k\\) 构成。贪心算法在第 \\(i\\) 步选择局部最优的 \\(c_i\\), 而不考虑后续步骤的影响。若对所有实例, 这样的策略都能得到全局最优解, 则称该贪心策略是<strong>正确</strong>的。</p></div>
</div>

<p>贪心算法的正确性通常依赖于两个关键性质:</p>

<div class="env-block definition">
<div class="env-title">Definition 16.2 (Greedy-Choice Property)</div>
<div class="env-body"><p><strong>贪心选择性质:</strong> 可以通过做出局部最优 (贪心) 选择来构造全局最优解。也就是说, 存在一个最优解包含贪心选择所选取的元素。</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 16.3 (Optimal Substructure)</div>
<div class="env-body"><p><strong>最优子结构:</strong> 做出贪心选择后, 剩余的子问题的最优解与原问题的贪心选择一起构成原问题的最优解。</p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 16.1 (Greedy Correctness Framework)</div>
<div class="env-body"><p>若问题同时具有贪心选择性质和最优子结构, 则贪心算法产生最优解。证明通常采用<strong>交换论证 (exchange argument)</strong>: 假设最优解 \\(O\\) 与贪心解 \\(G\\) 不同, 将 \\(O\\) 中某个元素替换为 \\(G\\) 的贪心选择, 证明替换后解不变差。</p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Generic Greedy Framework</div>
<div class="env-body"><p>
1. 将候选集合 \\(C\\) 中的元素按某种贪心准则排序<br>
2. 初始化解集 \\(S = \\emptyset\\)<br>
3. 对于排序后的每个元素 \\(e \\in C\\):<br>
&nbsp;&nbsp;&nbsp;&nbsp;若将 \\(e\\) 加入 \\(S\\) 仍然可行, 则 \\(S = S \\cup \\{e\\}\\)<br>
4. 返回 \\(S\\)
</p></div>
</div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body"><p>贪心就像在自助餐中, 每次都先拿最贵的菜 — 如果没有"只能选几道"的约束, 这策略肯定最优。但若有预算和容量限制, 贪心就不一定对了。关键在于<strong>问题结构是否允许局部最优推导出全局最优</strong>。</p></div>
</div>

<div class="viz-placeholder" data-viz="ch16-viz-greedy-vs-optimal"></div>

<div class="env-block warning">
<div class="env-title">Warning</div>
<div class="env-body"><p>贪心算法并不总是正确的! 经典反例是 0-1 背包问题: 按性价比贪心选取可能错过最优组合。证明贪心正确性是使用贪心算法的<strong>前提</strong>, 而非可选步骤。</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch16-viz-greedy-vs-optimal',
                    title: '贪心 vs 最优: 硬币找零',
                    description: '比较贪心策略与最优解在不同面额系统中的表现',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var denomSets = [
                            {name: '标准面额 (1,5,10,25)', denoms: [25,10,5,1], amount: 36},
                            {name: '特殊面额 (1,3,4)', denoms: [4,3,1], amount: 6},
                            {name: '面额 (1,6,10)', denoms: [10,6,1], amount: 12}
                        ];
                        var currentSet = 0;

                        function greedyChange(denoms, amount) {
                            var result = [];
                            var remain = amount;
                            for (var i = 0; i < denoms.length; i++) {
                                while (remain >= denoms[i]) {
                                    result.push(denoms[i]);
                                    remain -= denoms[i];
                                }
                            }
                            return result;
                        }

                        function optimalChange(denoms, amount) {
                            var dp = new Array(amount + 1).fill(Infinity);
                            var parent = new Array(amount + 1).fill(-1);
                            dp[0] = 0;
                            for (var i = 1; i <= amount; i++) {
                                for (var j = 0; j < denoms.length; j++) {
                                    if (denoms[j] <= i && dp[i - denoms[j]] + 1 < dp[i]) {
                                        dp[i] = dp[i - denoms[j]] + 1;
                                        parent[i] = denoms[j];
                                    }
                                }
                            }
                            var result = [];
                            var cur = amount;
                            while (cur > 0) { result.push(parent[cur]); cur -= parent[cur]; }
                            return result;
                        }

                        function draw() {
                            viz.clear();
                            var ds = denomSets[currentSet];
                            var greedy = greedyChange(ds.denoms, ds.amount);
                            var optimal = optimalChange(ds.denoms, ds.amount);

                            viz.screenText(ds.name, 350, 25, viz.colors.white, 16, 'center');
                            viz.screenText('目标金额: ' + ds.amount, 350, 48, viz.colors.yellow, 14, 'center');

                            // Greedy
                            viz.screenText('贪心解 (' + greedy.length + ' 枚硬币)', 350, 90, viz.colors.blue, 14, 'center');
                            var gx = 350 - greedy.length * 22;
                            for (var i = 0; i < greedy.length; i++) {
                                var px = gx + i * 44;
                                viz.drawNode(px, 130, 18, greedy[i], viz.colors.blue, viz.colors.white);
                            }

                            // Optimal
                            viz.screenText('最优解 (' + optimal.length + ' 枚硬币)', 350, 195, viz.colors.green, 14, 'center');
                            var ox = 350 - optimal.length * 22;
                            for (var i = 0; i < optimal.length; i++) {
                                var px2 = ox + i * 44;
                                viz.drawNode(px2, 235, 18, optimal[i], viz.colors.green, viz.colors.white);
                            }

                            // Verdict
                            var same = greedy.length === optimal.length;
                            var verdict = same ? 'Greedy = Optimal!' : 'Greedy is suboptimal!';
                            var vc = same ? viz.colors.green : viz.colors.red;
                            viz.screenText(verdict, 350, 300, vc, 18, 'center');

                            if (!same) {
                                viz.screenText('贪心多用了 ' + (greedy.length - optimal.length) + ' 枚硬币', 350, 325, viz.colors.orange, 13, 'center');
                            }

                            viz.screenText('面额系统: [' + ds.denoms.join(', ') + ']', 350, 370, viz.colors.text, 12, 'center');
                        }

                        VizEngine.createButton(controls, '上一组', function() {
                            currentSet = (currentSet - 1 + denomSets.length) % denomSets.length;
                            draw();
                        });
                        VizEngine.createButton(controls, '下一组', function() {
                            currentSet = (currentSet + 1) % denomSets.length;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '证明: 对于面额为 \\(1, 5, 10, 25\\) 的美国硬币系统, 贪心算法 (每次选最大可用面额) 总是给出最优的找零方案。',
                    hint: '使用交换论证。假设最优解使用了更多硬币, 证明可以用更大面额替换若干较小面额。',
                    solution: '设最优解 \\(O\\) 使用的硬币数少于或等于贪心解。考虑贪心选择的第一枚硬币 \\(c\\) (最大面额), 若 \\(O\\) 不包含 \\(c\\), 则 \\(O\\) 中替代 \\(c\\) 的若干小面额总和 \\(\\ge c\\)。可以验证: 任何由小于 25 的面额组成的 \\(\\ge 25\\) 的组合至少需要 2 枚硬币, 用一枚 25 替换不会增加硬币数。类似地处理 10, 5, 1。归纳即得贪心解最优。'
                },
                {
                    question: '给出一个反例, 说明对于面额 \\(\\{1, 3, 4\\}\\) 和目标金额 \\(6\\), 贪心算法不是最优的。',
                    hint: '贪心会先选 4, 然后选 1, 1; 但是有更好的方案。',
                    solution: '贪心: \\(6 = 4 + 1 + 1\\) (3 枚硬币)。最优: \\(6 = 3 + 3\\) (2 枚硬币)。贪心多用了一枚硬币。'
                },
                {
                    question: '解释贪心选择性质和最优子结构的区别。为什么两者都需要才能保证贪心正确?',
                    hint: '贪心选择性质保证第一步不出错, 最优子结构保证递归地不出错。',
                    solution: '贪心选择性质说明"做出局部最优选择不会错失全局最优解" — 即最优解中包含贪心选的那个元素。最优子结构说明"做完贪心选择后, 剩下的子问题可以独立地最优求解"。缺少前者, 第一步可能走错; 缺少后者, 即使第一步对了, 子问题的解可能与原问题的全局最优不一致。两者缺一不可。'
                }
            ]
        },
        // ===== Section 2: Activity Selection =====
        {
            id: 'ch16-sec02',
            title: '活动选择问题',
            content: `<h2>2 活动选择问题</h2>
<p>活动选择问题 (activity selection) 是贪心算法的经典范例: 给定 \\(n\\) 个活动, 每个活动 \\(a_i\\) 有开始时间 \\(s_i\\) 和结束时间 \\(f_i\\), 要求选出<strong>最多的互不重叠</strong>的活动。</p>

<div class="env-block definition">
<div class="env-title">Definition 16.4 (Activity Selection Problem)</div>
<div class="env-body"><p>给定活动集 \\(S = \\{a_1, \\ldots, a_n\\}\\), 其中 \\(a_i = [s_i, f_i)\\)。求 \\(S\\) 的最大相容子集 \\(A \\subseteq S\\), 使得 \\(A\\) 中任意两个活动不重叠: \\(\\forall a_i, a_j \\in A, \\ i \\ne j \\Rightarrow f_i \\le s_j \\text{ or } f_j \\le s_i\\).</p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Greedy Activity Selection</div>
<div class="env-body"><p>
1. 将活动按<strong>结束时间 \\(f_i\\) 递增</strong>排序<br>
2. 选择第一个活动 \\(a_1\\) (最早结束的)<br>
3. 对于后续的每个活动 \\(a_i\\):<br>
&nbsp;&nbsp;&nbsp;&nbsp;若 \\(s_i \\ge f_{\\text{last}}\\) (与已选的最后一个活动相容), 则选择 \\(a_i\\)<br>
4. 返回选中的活动集
</p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 16.2 (Greedy Activity Selection is Optimal)</div>
<div class="env-body"><p>按结束时间排序的贪心策略总是选出最大的相容活动子集。</p></div>
</div>

<div class="env-block proof">
<div class="env-title">Proof</div>
<div class="env-body"><p><strong>贪心选择性质:</strong> 设 \\(a_k\\) 是结束时间最早的活动。设 \\(O\\) 是任一最优解。若 \\(a_k \\notin O\\), 设 \\(O\\) 中第一个活动为 \\(a_j\\)。因为 \\(f_k \\le f_j\\), 用 \\(a_k\\) 替换 \\(a_j\\) 后得到的集合 \\(O'\\) 仍然相容且 \\(|O'| = |O|\\)。因此存在包含 \\(a_k\\) 的最优解。</p>
<p><strong>最优子结构:</strong> 选定 \\(a_k\\) 后, 剩余问题是从 \\(\\{a_i : s_i \\ge f_k\\}\\) 中选最多活动, 这是原问题的一个子实例。</p>
<p>由归纳法, 贪心解的大小等于最优解的大小。\\(\\blacksquare\\)</p></div>
</div>

<p>时间复杂度: 排序 \\(O(n\\log n)\\) + 扫描 \\(O(n)\\) = \\(O(n\\log n)\\)。</p>

<div class="viz-placeholder" data-viz="ch16-viz-activity-selection"></div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body"><p>注意: 按<strong>开始时间最晚</strong>排序的贪心同样正确 (逆向贪心)。但按<strong>持续时间最短</strong>或<strong>开始最早</strong>排序的贪心是错的 — 可以构造反例。</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch16-viz-activity-selection',
                    title: '活动选择: 贪心过程',
                    description: '按结束时间排序, 逐个选择兼容活动',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var activities = [
                            {id: 0, s: 1, f: 4},
                            {id: 1, s: 3, f: 5},
                            {id: 2, s: 0, f: 6},
                            {id: 3, s: 5, f: 7},
                            {id: 4, s: 3, f: 9},
                            {id: 5, s: 5, f: 9},
                            {id: 6, s: 6, f: 10},
                            {id: 7, s: 8, f: 11},
                            {id: 8, s: 8, f: 12},
                            {id: 9, s: 2, f: 14},
                            {id: 10, s: 12, f: 16}
                        ];
                        // Sort by finish time
                        activities.sort(function(a, b) { return a.f - b.f; });
                        var step = 0;
                        var selected = [];
                        var rejected = [];
                        var maxTime = 17;

                        function reset() {
                            step = 0;
                            selected = [];
                            rejected = [];
                            draw();
                        }

                        function advance() {
                            if (step >= activities.length) return;
                            var act = activities[step];
                            var lastF = selected.length > 0 ? activities[selected[selected.length - 1]].f : 0;
                            if (act.s >= lastF) {
                                selected.push(step);
                            } else {
                                rejected.push(step);
                            }
                            step++;
                            draw();
                        }

                        function selectAll() {
                            while (step < activities.length) {
                                var act = activities[step];
                                var lastF = selected.length > 0 ? activities[selected[selected.length - 1]].f : 0;
                                if (act.s >= lastF) {
                                    selected.push(step);
                                } else {
                                    rejected.push(step);
                                }
                                step++;
                            }
                            draw();
                        }

                        function draw() {
                            viz.clear();
                            var barH = 24;
                            var gap = 6;
                            var leftMargin = 80;
                            var topMargin = 55;
                            var timeScale = (viz.width - leftMargin - 40) / maxTime;

                            viz.screenText('活动选择 — 按结束时间贪心', viz.width / 2, 20, viz.colors.white, 15, 'center');

                            // Time axis
                            var axisY = topMargin + activities.length * (barH + gap) + 15;
                            var ctx = viz.ctx;
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(leftMargin, axisY);
                            ctx.lineTo(viz.width - 20, axisY);
                            ctx.stroke();
                            for (var t = 0; t <= maxTime; t += 2) {
                                var tx = leftMargin + t * timeScale;
                                ctx.beginPath(); ctx.moveTo(tx, axisY - 3); ctx.lineTo(tx, axisY + 3); ctx.stroke();
                                viz.screenText(String(t), tx, axisY + 14, viz.colors.text, 10, 'center');
                            }

                            // Draw activities
                            for (var i = 0; i < activities.length; i++) {
                                var act = activities[i];
                                var y = topMargin + i * (barH + gap);
                                var x1 = leftMargin + act.s * timeScale;
                                var w = (act.f - act.s) * timeScale;

                                var color, textC;
                                if (selected.indexOf(i) >= 0) {
                                    color = viz.colors.green;
                                    textC = viz.colors.white;
                                } else if (rejected.indexOf(i) >= 0) {
                                    color = viz.colors.red + '44';
                                    textC = viz.colors.red;
                                } else if (i === step) {
                                    color = viz.colors.yellow + '66';
                                    textC = viz.colors.yellow;
                                } else {
                                    color = viz.colors.blue + '33';
                                    textC = viz.colors.blue;
                                }

                                ctx.fillStyle = color;
                                ctx.fillRect(x1, y, w, barH);
                                ctx.strokeStyle = textC;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(x1, y, w, barH);

                                viz.screenText('a' + act.id, leftMargin - 25, y + barH / 2, textC, 12, 'center');
                                viz.screenText('[' + act.s + ',' + act.f + ')', x1 + w / 2, y + barH / 2, viz.colors.white, 11, 'center');
                            }

                            // Legend
                            var ly = axisY + 35;
                            ctx.fillStyle = viz.colors.green; ctx.fillRect(leftMargin, ly, 14, 14);
                            viz.screenText('已选', leftMargin + 22, ly + 7, viz.colors.green, 11, 'left');
                            ctx.fillStyle = viz.colors.red + '44'; ctx.fillRect(leftMargin + 70, ly, 14, 14);
                            viz.screenText('拒绝 (冲突)', leftMargin + 92, ly + 7, viz.colors.red, 11, 'left');
                            ctx.fillStyle = viz.colors.yellow + '66'; ctx.fillRect(leftMargin + 190, ly, 14, 14);
                            viz.screenText('当前考虑', leftMargin + 212, ly + 7, viz.colors.yellow, 11, 'left');

                            viz.screenText('已选活动数: ' + selected.length, viz.width - 80, 20, viz.colors.green, 14, 'center');
                        }

                        VizEngine.createButton(controls, '下一步', advance);
                        VizEngine.createButton(controls, '全部选完', selectAll);
                        VizEngine.createButton(controls, '重置', reset);

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '给出一个反例, 说明"按活动持续时间最短优先"的贪心策略并非最优。',
                    hint: '构造三个活动, 其中一个短活动与两个不重叠的活动都冲突。',
                    solution: '活动: \\(a_1 = [0, 4)\\), \\(a_2 = [3, 5)\\), \\(a_3 = [4, 8)\\)。按持续时间: \\(a_2\\) 最短 (时长 2), 选 \\(a_2\\) 后 \\(a_1, a_3\\) 都冲突, 得 1 个活动。而最优解选 \\(\\{a_1, a_3\\}\\) 得 2 个活动。'
                },
                {
                    question: '将活动选择问题的贪心正确性用交换论证严格写出。具体地, 对于 \\(n\\) 个活动按结束时间排好序后, 证明第一个贪心选择 (选结束最早的活动) 不会导致子优解。',
                    hint: '设最优解 OPT 中第一个活动为 \\(a_j\\), 贪心选的是 \\(a_1\\) (结束最早)。用 \\(a_1\\) 替换 \\(a_j\\)。',
                    solution: '设 OPT 选了 \\(a_j\\) 作为第一个活动 (\\(j \\ne 1\\))。因为 \\(f_1 \\le f_j\\) (排序), 用 \\(a_1\\) 替换 \\(a_j\\) 后, \\(a_1\\) 结束更早, 所以 OPT 中后续活动 \\(a_k\\) 满足 \\(s_k \\ge f_j \\ge f_1\\), 即 \\(a_k\\) 与 \\(a_1\\) 也相容。因此 OPT\' = (OPT \\ {\\(a_j\\)}) + {\\(a_1\\)} 仍是相容的且大小不变, 即为最优解。'
                },
                {
                    question: '对 \\(n\\) 个活动的加权版本 (每个活动有权重 \\(w_i\\), 最大化总权重), 贪心还能奏效吗? 为什么?',
                    hint: '加权活动选择需要 DP。',
                    solution: '不能。加权活动选择问题不具有贪心选择性质。反例: \\(a_1 = [0, 10), w_1 = 100\\); \\(a_2 = [0, 5), w_2 = 1\\); \\(a_3 = [5, 10), w_3 = 1\\)。按 \\(w/\\text{len}\\) 贪心或按结束时间贪心都可能选错。加权版本需要动态规划: 按结束时间排序后 \\(dp[i] = \\max(dp[i-1], w_i + dp[p(i)])\\), 其中 \\(p(i)\\) 是与 \\(a_i\\) 不冲突的最晚活动。'
                }
            ]
        },
        // ===== Section 3: Huffman Coding =====
        {
            id: 'ch16-sec03',
            title: 'Huffman 编码',
            content: `<h2>3 Huffman 编码</h2>
<p>Huffman 编码是一种<strong>最优前缀无关编码</strong>, 用于数据压缩。给定字符的频率, Huffman 贪心地构建一棵二叉树, 使得频率高的字符编码短, 频率低的字符编码长, 从而最小化总编码长度。</p>

<div class="env-block definition">
<div class="env-title">Definition 16.5 (Prefix-Free Code)</div>
<div class="env-body"><p>前缀无关码 (prefix-free code) 是指没有任何码字是另一个码字前缀的编码方案。这保证了编码可以无歧义地解码。每个前缀无关码对应一棵二叉树, 字符在叶子节点, 左/右分支分别对应 0/1。</p></div>
</div>

<div class="env-block definition">
<div class="env-title">Definition 16.6 (Cost of a Code)</div>
<div class="env-body"><p>设字符 \\(c\\) 的频率为 \\(f(c)\\), 编码长度为 \\(d_T(c)\\) (在树 \\(T\\) 中的深度)。编码的总代价为 $$B(T) = \\sum_{c \\in C} f(c) \\cdot d_T(c)$$ Huffman 算法最小化 \\(B(T)\\)。</p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Huffman Coding</div>
<div class="env-body"><p>
1. 创建 \\(n\\) 个叶节点, 每个对应一个字符, 加入优先队列 (按频率排序)<br>
2. 当队列中节点数 \\(> 1\\):<br>
&nbsp;&nbsp;&nbsp;&nbsp;取出频率最小的两个节点 \\(x, y\\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;创建新内部节点 \\(z\\), \\(f(z) = f(x) + f(y)\\), 左子 = \\(x\\), 右子 = \\(y\\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;将 \\(z\\) 插入优先队列<br>
3. 返回队列中唯一的节点 (即 Huffman 树的根)
</p></div>
</div>

<p>时间复杂度: \\(O(n \\log n)\\) (使用最小堆)。</p>

<div class="env-block theorem">
<div class="env-title">Theorem 16.3 (Huffman Optimality)</div>
<div class="env-body"><p>Huffman 算法产生的前缀无关码是最优的, 即 \\(B(T_{\\text{Huffman}}) \\le B(T)\\) 对所有前缀无关码树 \\(T\\) 成立。</p></div>
</div>

<div class="env-block proof">
<div class="env-title">Proof Sketch</div>
<div class="env-body"><p><strong>贪心选择性质:</strong> 频率最小的两个字符在最优树中一定是兄弟且处于最深层。(反证: 若不是, 将它们与最深的兄弟对交换, 总代价不增。)<br>
<strong>最优子结构:</strong> 将 \\(x, y\\) 合并为 \\(z\\) (频率之和) 后, 子问题是 \\((C \\setminus \\{x,y\\}) \\cup \\{z\\}\\) 上的 Huffman 编码, 其最优解加上 \\(x,y\\) 的分裂即为原问题的最优解。</p></div>
</div>

<div class="viz-placeholder" data-viz="ch16-viz-huffman"></div>

<div class="env-block example">
<div class="env-title">Example 16.1</div>
<div class="env-body"><p>字符频率: a:45, b:13, c:12, d:16, e:9, f:5。Huffman 编码: a=0, b=101, c=100, d=111, e=1101, f=1100。总代价 = \\(45 \\cdot 1 + 13 \\cdot 3 + 12 \\cdot 3 + 16 \\cdot 3 + 9 \\cdot 4 + 5 \\cdot 4 = 224\\) 位 (对于 100 个字符), 而等长编码需要 300 位。</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch16-viz-huffman',
                    title: 'Huffman 树构建过程',
                    description: '观察如何从字符频率构建 Huffman 编码树',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 450});
                        var chars = ['a','b','c','d','e','f'];
                        var freqs = [45, 13, 12, 16, 9, 5];
                        var buildSteps = [];
                        var currentStep = 0;

                        function buildHuffman() {
                            var nodes = [];
                            for (var i = 0; i < chars.length; i++) {
                                nodes.push({label: chars[i], freq: freqs[i], left: null, right: null, id: i});
                            }
                            buildSteps = [{queue: nodes.map(function(n){return {label:n.label,freq:n.freq,left:n.left,right:n.right,id:n.id};}), msg: 'Initial: ' + chars.length + ' leaf nodes'}];
                            var nextId = chars.length;
                            var pool = nodes.slice();
                            while (pool.length > 1) {
                                pool.sort(function(a,b){return a.freq - b.freq;});
                                var x = pool.shift();
                                var y = pool.shift();
                                var z = {label: '', freq: x.freq + y.freq, left: x, right: y, id: nextId++};
                                pool.push(z);
                                buildSteps.push({
                                    queue: pool.map(function(n){return n;}),
                                    merged: [x, y, z],
                                    msg: 'Merge ' + (x.label||x.freq) + '(' + x.freq + ') + ' + (y.label||y.freq) + '(' + y.freq + ') = ' + z.freq
                                });
                            }
                            return pool[0];
                        }

                        var root = buildHuffman();

                        function getTreeLayout(node, x, y, spread) {
                            if (!node) return [];
                            var items = [{node: node, x: x, y: y}];
                            if (node.left) {
                                items = items.concat(getTreeLayout(node.left, x - spread, y + 55, spread * 0.55));
                            }
                            if (node.right) {
                                items = items.concat(getTreeLayout(node.right, x + spread, y + 55, spread * 0.55));
                            }
                            return items;
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Huffman 编码树构建', viz.width / 2, 18, viz.colors.white, 15, 'center');

                            if (currentStep < buildSteps.length) {
                                var st = buildSteps[currentStep];
                                viz.screenText('Step ' + currentStep + ': ' + st.msg, viz.width / 2, 42, viz.colors.yellow, 12, 'center');

                                // Show queue
                                viz.screenText('队列:', 30, 75, viz.colors.text, 12, 'left');
                                var qx = 80;
                                for (var i = 0; i < st.queue.length; i++) {
                                    var n = st.queue[i];
                                    var lbl = (n.label || '*') + ':' + n.freq;
                                    var col = (st.merged && n === st.merged[2]) ? viz.colors.orange : viz.colors.blue;
                                    viz.drawNode(qx + i * 75, 75, 18, lbl, col, viz.colors.white);
                                }
                            }

                            // Draw final tree
                            var layout = getTreeLayout(root, 350, 120, 150);
                            for (var i = 0; i < layout.length; i++) {
                                var item = layout[i];
                                if (item.node.left) {
                                    var lc = layout.find(function(l){return l.node === item.node.left;});
                                    if (lc) {
                                        viz.drawTreeEdge(item.x, item.y, lc.x, lc.y, viz.colors.axis);
                                        viz.screenText('0', (item.x + lc.x) / 2 - 8, (item.y + lc.y) / 2, viz.colors.teal, 11, 'center');
                                    }
                                }
                                if (item.node.right) {
                                    var rc = layout.find(function(l){return l.node === item.node.right;});
                                    if (rc) {
                                        viz.drawTreeEdge(item.x, item.y, rc.x, rc.y, viz.colors.axis);
                                        viz.screenText('1', (item.x + rc.x) / 2 + 8, (item.y + rc.y) / 2, viz.colors.orange, 11, 'center');
                                    }
                                }
                            }
                            for (var i = 0; i < layout.length; i++) {
                                var item = layout[i];
                                var isLeaf = !item.node.left && !item.node.right;
                                var col = isLeaf ? viz.colors.green : viz.colors.purple;
                                var lbl = isLeaf ? item.node.label + ':' + item.node.freq : String(item.node.freq);
                                viz.drawTreeNode(item.x, item.y, isLeaf ? 18 : 15, lbl, col, viz.colors.white);
                            }

                            // Codes
                            function getCodes(node, prefix) {
                                if (!node) return [];
                                if (!node.left && !node.right) return [{ch: node.label, code: prefix || '0'}];
                                var result = [];
                                if (node.left) result = result.concat(getCodes(node.left, prefix + '0'));
                                if (node.right) result = result.concat(getCodes(node.right, prefix + '1'));
                                return result;
                            }
                            if (currentStep === buildSteps.length - 1) {
                                var codes = getCodes(root, '');
                                var cy = 415;
                                viz.screenText('编码结果:', 30, cy, viz.colors.white, 12, 'left');
                                for (var i = 0; i < codes.length; i++) {
                                    viz.screenText(codes[i].ch + '=' + codes[i].code, 110 + i * 95, cy, viz.colors.teal, 12, 'left');
                                }
                            }
                        }

                        VizEngine.createButton(controls, '下一步', function() {
                            if (currentStep < buildSteps.length - 1) { currentStep++; draw(); }
                        });
                        VizEngine.createButton(controls, '重置', function() {
                            currentStep = 0; draw();
                        });
                        VizEngine.createButton(controls, '显示最终树', function() {
                            currentStep = buildSteps.length - 1; draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '对字符频率 A:15, B:7, C:6, D:6, E:5 构建 Huffman 树, 写出每个字符的编码, 并计算总代价。',
                    hint: '先合并频率最小的两个: E(5) 和 C(6) 或 D(6)。',
                    solution: '合并步骤: (1) E(5)+D(6)=ED(11), (2) C(6)+B(7)=CB(13), (3) ED(11)+CB(13)=EDCB(24), (4) A(15)+EDCB(24)=root(39)。编码 (一种可能): A=0, E=100, D=101, C=110, B=111。总代价 = 15*1 + 5*3 + 6*3 + 6*3 + 7*3 = 15 + 15 + 18 + 18 + 21 = 87。'
                },
                {
                    question: '证明 Huffman 编码的贪心选择性质: 频率最低的两个字符在最优前缀无关码树中是兄弟且处于最深层。',
                    hint: '用交换论证: 如果最深层的兄弟对不是频率最低的, 交换后代价不增。',
                    solution: '设 \\(x, y\\) 频率最低, \\(a, b\\) 是最优树 \\(T\\) 中最深层的兄弟对 (深度为 \\(d_{\\max}\\))。若 \\(\\{a,b\\} \\ne \\{x,y\\}\\), 不妨设 \\(a \\ne x\\)。交换 \\(a\\) 和 \\(x\\) 的位置得到 \\(T\'\\)。代价变化: \\(\\Delta = f(x)(d_{\\max} - d(x)) + f(a)(d(x) - d_{\\max})= (f(x) - f(a))(d_{\\max} - d(x))\\)。因为 \\(f(x) \\le f(a)\\) 且 \\(d_{\\max} \\ge d(x)\\), 所以 \\(\\Delta \\le 0\\), 即代价不增。类似交换 \\(b, y\\)。因此最优树中 \\(x, y\\) 可以在最深层做兄弟。'
                },
                {
                    question: 'Huffman 编码的时间复杂度为什么是 \\(O(n\\log n)\\)? 如果字符已按频率排好序, 能否做到 \\(O(n)\\)?',
                    hint: '已排序时使用两个队列。',
                    solution: '标准做法用最小堆: \\(n\\) 次 insert + \\((n-1)\\) 次取两个最小 + 插入, 每次 \\(O(\\log n)\\), 共 \\(O(n\\log n)\\)。若已排序, 可用两个队列: Q1 存初始叶子, Q2 存合并节点。每次取两个最小只需比较 Q1, Q2 的队首 (O(1))。总共 \\(n-1\\) 次合并, 时间 \\(O(n)\\)。'
                }
            ]
        },
        // ===== Section 4: Matroids and Greedy =====
        {
            id: 'ch16-sec04',
            title: '拟阵与贪心理论',
            content: `<h2>4 拟阵与贪心理论</h2>
<p>什么时候贪心算法一定正确? <strong>拟阵 (matroid)</strong> 理论给出了一个漂亮的回答: 在拟阵上的加权最大独立集问题, 贪心算法总是最优的。</p>

<div class="env-block definition">
<div class="env-title">Definition 16.7 (Matroid)</div>
<div class="env-body"><p>拟阵 \\(M = (S, \\mathcal{I})\\) 由有限地集 \\(S\\) 和独立集族 \\(\\mathcal{I} \\subseteq 2^S\\) 组成, 满足:</p>
<p>(I1) <strong>遗传性:</strong> 若 \\(B \\in \\mathcal{I}\\) 且 \\(A \\subseteq B\\), 则 \\(A \\in \\mathcal{I}\\)。</p>
<p>(I2) <strong>交换性:</strong> 若 \\(A, B \\in \\mathcal{I}\\) 且 \\(|A| < |B|\\), 则存在 \\(x \\in B \\setminus A\\) 使得 \\(A \\cup \\{x\\} \\in \\mathcal{I}\\)。</p></div>
</div>

<div class="env-block example">
<div class="env-title">Example 16.2 (Graphic Matroid)</div>
<div class="env-body"><p>给定无向图 \\(G = (V, E)\\), 令 \\(S = E\\), \\(\\mathcal{I} = \\{A \\subseteq E : A \\text{ 是无环的 (森林)}\\}\\)。这是一个拟阵, 称为<strong>图拟阵</strong>。最大权独立集 = 最大权森林 = 最大生成森林。Kruskal 算法本质上就是图拟阵上的贪心。</p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 16.4 (Rado-Edmonds)</div>
<div class="env-body"><p>对于拟阵 \\(M = (S, \\mathcal{I})\\) 和权函数 \\(w: S \\to \\mathbb{R}^+\\), 贪心算法 (按权重递减排序, 依次选择能保持独立性的元素) 产生最大权独立集。</p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Greedy on Matroid</div>
<div class="env-body"><p>
1. 将 \\(S\\) 的元素按权重 \\(w\\) 递减排序: \\(w(e_1) \\ge w(e_2) \\ge \\cdots\\)<br>
2. \\(A = \\emptyset\\)<br>
3. 对于 \\(i = 1, 2, \\ldots, |S|\\):<br>
&nbsp;&nbsp;&nbsp;&nbsp;若 \\(A \\cup \\{e_i\\} \\in \\mathcal{I}\\) 则 \\(A = A \\cup \\{e_i\\}\\)<br>
4. 返回 \\(A\\)
</p></div>
</div>

<div class="env-block proof">
<div class="env-title">Proof Sketch (Rado-Edmonds Theorem)</div>
<div class="env-body"><p>设贪心解为 \\(G = \\{g_1, g_2, \\ldots, g_k\\}\\) (按选择顺序), 最优解为 \\(O = \\{o_1, \\ldots, o_m\\}\\) (按权重递减)。首先由交换性, \\(k = m\\) (两者都是极大独立集, 大小相同)。<br>
对于每个 \\(i\\), 用交换论证证明 \\(w(g_i) \\ge w(o_i)\\): 若 \\(w(g_i) < w(o_i)\\), 由交换性可以将 \\(o_i\\) 加入 \\(\\{g_1, \\ldots, g_{i-1}\\}\\) 得到独立集, 这与贪心选择 \\(g_i\\) 矛盾 (\\(g_i\\) 是剩余可选中权重最大的)。因此 \\(w(G) \\ge w(O)\\)。</p></div>
</div>

<div class="viz-placeholder" data-viz="ch16-viz-matroid"></div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body"><p>拟阵理论的重要意义在于: 它精确刻画了"贪心有效"的边界。很多实际问题可以归结为拟阵或拟阵交上的优化。活动选择问题虽然不直接是拟阵, 但可以通过区间图的结构来理解。</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch16-viz-matroid',
                    title: '图拟阵上的贪心 (Kruskal 视角)',
                    description: '在图拟阵上按权重递减贪心选边, 保持无环',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});

                        var nodes = [
                            {id: 0, x: 150, y: 80, label: 'A'},
                            {id: 1, x: 350, y: 60, label: 'B'},
                            {id: 2, x: 550, y: 80, label: 'C'},
                            {id: 3, x: 120, y: 230, label: 'D'},
                            {id: 4, x: 350, y: 260, label: 'E'},
                            {id: 5, x: 570, y: 230, label: 'F'}
                        ];
                        var edges = [
                            {u: 0, v: 1, w: 7},
                            {u: 0, v: 3, w: 5},
                            {u: 1, v: 2, w: 8},
                            {u: 1, v: 3, w: 9},
                            {u: 1, v: 4, w: 7},
                            {u: 2, v: 4, w: 5},
                            {u: 3, v: 4, w: 6},
                            {u: 4, v: 5, w: 8},
                            {u: 2, v: 5, w: 9}
                        ];
                        // Sort by weight descending for max-weight forest
                        var sorted = edges.slice().sort(function(a, b) { return b.w - a.w; });
                        var step = 0;
                        var selected = [];
                        var rejected = [];

                        // Union-Find
                        var parent, rank2;
                        function init() { parent = []; rank2 = []; for (var i = 0; i < nodes.length; i++) { parent[i] = i; rank2[i] = 0; } }
                        function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
                        function union(a, b) {
                            a = find(a); b = find(b);
                            if (a === b) return false;
                            if (rank2[a] < rank2[b]) { var t = a; a = b; b = t; }
                            parent[b] = a;
                            if (rank2[a] === rank2[b]) rank2[a]++;
                            return true;
                        }

                        function reset() {
                            step = 0; selected = []; rejected = [];
                            init();
                            draw();
                        }

                        function advance() {
                            if (step >= sorted.length) return;
                            var e = sorted[step];
                            if (union(e.u, e.v)) {
                                selected.push(step);
                            } else {
                                rejected.push(step);
                            }
                            step++;
                            draw();
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('图拟阵上的贪心 (按权重递减选边)', viz.width / 2, 18, viz.colors.white, 14, 'center');

                            // Draw all edges first (unprocessed)
                            for (var i = 0; i < sorted.length; i++) {
                                var e = sorted[i];
                                var n1 = nodes[e.u], n2 = nodes[e.v];
                                var col = viz.colors.axis + '44';
                                var lw = 1;
                                if (selected.indexOf(i) >= 0) {
                                    col = viz.colors.green;
                                    lw = 3;
                                } else if (rejected.indexOf(i) >= 0) {
                                    col = viz.colors.red + '44';
                                    lw = 1;
                                } else if (i === step) {
                                    col = viz.colors.yellow;
                                    lw = 2.5;
                                }
                                viz.drawEdge(n1.x, n1.y, n2.x, n2.y, col, false, e.w, lw);
                            }

                            // Draw nodes
                            for (var i = 0; i < nodes.length; i++) {
                                viz.drawNode(nodes[i].x, nodes[i].y, 20, nodes[i].label, viz.colors.blue, viz.colors.white);
                            }

                            // Edge list on right
                            viz.screenText('边序 (按权重递减):', 30, 310, viz.colors.text, 11, 'left');
                            for (var i = 0; i < sorted.length; i++) {
                                var e = sorted[i];
                                var label = nodes[e.u].label + '-' + nodes[e.v].label + ':' + e.w;
                                var tc = viz.colors.text;
                                if (selected.indexOf(i) >= 0) tc = viz.colors.green;
                                else if (rejected.indexOf(i) >= 0) tc = viz.colors.red;
                                else if (i === step) tc = viz.colors.yellow;
                                viz.screenText(label, 30 + i * 75, 330, tc, 11, 'left');
                            }

                            var totalW = 0;
                            for (var i = 0; i < selected.length; i++) {
                                totalW += sorted[selected[i]].w;
                            }
                            viz.screenText('已选边数: ' + selected.length + '  总权重: ' + totalW, viz.width / 2, 370, viz.colors.green, 13, 'center');
                        }

                        init();

                        VizEngine.createButton(controls, '下一步', advance);
                        VizEngine.createButton(controls, '重置', reset);

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '验证图拟阵满足拟阵的两个公理 (遗传性和交换性)。',
                    hint: '遗传性: 森林的子集还是森林。交换性: 利用森林的边数等于顶点数减连通分量数。',
                    solution: '(I1) 遗传性: 森林是无环图, 无环图的子图仍然无环, 所以森林的任意边子集也是森林。(I2) 交换性: 设 \\(A, B\\) 都是森林且 \\(|A| < |B|\\)。森林的边数 = 顶点数 - 连通分量数, 所以 \\(A\\) 的连通分量数 > \\(B\\) 的连通分量数。因此 \\(B\\) 中必有一条边连接 \\(A\\) 的两个不同连通分量, 加入该边后 \\(A\\) 仍无环。'
                },
                {
                    question: '设 \\(S = \\{1,2,3,4\\}\\), \\(\\mathcal{I} = \\{\\emptyset, \\{1\\}, \\{2\\}, \\{3\\}, \\{4\\}, \\{1,2\\}, \\{1,3\\}, \\{2,3\\}\\}\\)。判断 \\((S, \\mathcal{I})\\) 是否为拟阵。',
                    hint: '检查交换性: 找 \\(|A| < |B|\\) 的独立集对。',
                    solution: '遗传性: 每个独立集的子集也在 \\(\\mathcal{I}\\) 中, 成立。交换性: 取 \\(A = \\{4\\}\\) (大小 1) 和 \\(B = \\{1,2\\}\\) (大小 2)。需要存在 \\(x \\in B \\setminus A = \\{1,2\\}\\) 使得 \\(A \\cup \\{x\\} \\in \\mathcal{I}\\)。但 \\(\\{4,1\\} \\notin \\mathcal{I}\\) 且 \\(\\{4,2\\} \\notin \\mathcal{I}\\)。违反交换性, 所以不是拟阵。'
                },
                {
                    question: '为什么 0-1 背包问题不能用拟阵理论来解决?',
                    hint: '考虑可行解集 (重量不超 W 的物品子集) 是否满足交换性。',
                    solution: '0-1 背包的可行集 \\(\\mathcal{I} = \\{A \\subseteq S : \\sum_{i \\in A} w_i \\le W\\}\\) 满足遗传性 (子集重量更小), 但不满足交换性。反例: 物品重量 \\(w_1 = 3, w_2 = 3, w_3 = 5\\), 容量 \\(W = 6\\)。\\(A = \\{3\\}\\) (重 5), \\(B = \\{1,2\\}\\) (重 6), \\(|A| < |B|\\), 但 \\(A \\cup \\{1\\} = \\{1,3\\}\\) 重 8 > 6 且 \\(A \\cup \\{2\\} = \\{2,3\\}\\) 重 8 > 6, 无法交换。所以背包的可行集不是拟阵。'
                }
            ]
        },
        // ===== Section 5: Fractional Knapsack & When Greedy Fails =====
        {
            id: 'ch16-sec05',
            title: '分数背包与贪心的局限',
            content: `<h2>5 分数背包与贪心的局限</h2>
<p>分数背包问题 (fractional knapsack) 允许取物品的一部分, 这使得贪心策略 (按性价比排序) 成为最优。而 0-1 背包不允许切分, 贪心就不再正确。通过对比这两个问题, 我们可以深入理解贪心的适用范围。</p>

<div class="env-block definition">
<div class="env-title">Definition 16.8 (Fractional Knapsack)</div>
<div class="env-body"><p>给定 \\(n\\) 个物品, 物品 \\(i\\) 的价值为 \\(v_i\\), 重量为 \\(w_i\\)。背包容量为 \\(W\\)。允许取物品的 \\(x_i \\in [0, 1]\\) 部分。目标: $$\\max \\sum_{i=1}^{n} v_i x_i \\quad \\text{s.t.} \\sum_{i=1}^{n} w_i x_i \\le W$$</p></div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm: Fractional Knapsack</div>
<div class="env-body"><p>
1. 计算每个物品的性价比 \\(r_i = v_i / w_i\\)<br>
2. 按 \\(r_i\\) 递减排序<br>
3. 剩余容量 \\(C = W\\), 总价值 \\(V = 0\\)<br>
4. 对于每个物品 \\(i\\) (按性价比递减):<br>
&nbsp;&nbsp;&nbsp;&nbsp;取 \\(x_i = \\min(1, C / w_i)\\) 部分<br>
&nbsp;&nbsp;&nbsp;&nbsp;\\(V = V + v_i \\cdot x_i\\), \\(C = C - w_i \\cdot x_i\\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;若 \\(C = 0\\) 则 break<br>
5. 返回 \\(V\\)
</p></div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem 16.5</div>
<div class="env-body"><p>按性价比贪心的分数背包算法是最优的。时间复杂度 \\(O(n\\log n)\\)。</p></div>
</div>

<div class="viz-placeholder" data-viz="ch16-viz-fractional-knapsack"></div>

<div class="env-block warning">
<div class="env-title">Warning: 0-1 Knapsack</div>
<div class="env-body"><p>在 0-1 背包中, 按性价比贪心可能严重偏离最优。经典反例: 物品 A (价值 60, 重 10, 性价比 6), 物品 B (价值 100, 重 20, 性价比 5), 物品 C (价值 120, 重 30, 性价比 4)。容量 50。<br>
贪心: 选 A(10) + B(20) + 剩余 20 放不下 C, 总价值 160。<br>
最优: B(20) + C(30) = 220。<br>
贪心差了 38%!</p></div>
</div>

<div class="viz-placeholder" data-viz="ch16-viz-greedy-fails"></div>

<div class="env-block intuition">
<div class="env-title">Intuition: When Does Greedy Fail?</div>
<div class="env-body"><p>贪心失败的典型场景:</p>
<p>1. <strong>不可分割约束:</strong> 0-1 背包, 因为不能取物品的一部分, 贪心可能浪费容量。</p>
<p>2. <strong>全局依赖:</strong> 当前选择影响未来可用选项的质量, 如最短路径中负权边。</p>
<p>3. <strong>缺乏拟阵结构:</strong> 可行集不满足交换性, 如集合覆盖问题 (贪心只能给出 \\(O(\\ln n)\\) 近似)。</p>
<p>4. <strong>非单调目标:</strong> 局部改善不一定导致全局改善。</p></div>
</div>

<div class="env-block remark">
<div class="env-title">Remark</div>
<div class="env-body"><p>虽然贪心不总是最优, 但在很多 NP-hard 问题上, 贪心能给出好的<strong>近似比</strong>。例如集合覆盖的贪心近似比为 \\(H_n = O(\\ln n)\\), 这已是多项式时间内最优的 (除非 P = NP)。</p></div>
</div>`,
            visualizations: [
                {
                    id: 'ch16-viz-fractional-knapsack',
                    title: '分数背包贪心过程',
                    description: '按性价比排序, 逐个装入背包',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var items = [
                            {name: 'A', v: 60, w: 10},
                            {name: 'B', v: 100, w: 20},
                            {name: 'C', v: 120, w: 30}
                        ];
                        var W = 50;
                        // Sort by value/weight ratio descending
                        items.sort(function(a, b) { return (b.v / b.w) - (a.v / a.w); });
                        var step = 0;
                        var taken = [];

                        function reset() {
                            step = 0; taken = [];
                            draw();
                        }

                        function advance() {
                            if (step >= items.length) return;
                            var remain = W;
                            for (var i = 0; i < taken.length; i++) remain -= taken[i].wTaken;
                            if (remain <= 0) return;
                            var it = items[step];
                            var frac = Math.min(1, remain / it.w);
                            taken.push({name: it.name, frac: frac, vTaken: it.v * frac, wTaken: it.w * frac});
                            step++;
                            draw();
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('分数背包 — 按性价比贪心', viz.width / 2, 20, viz.colors.white, 15, 'center');
                            viz.screenText('背包容量 W = ' + W, viz.width / 2, 42, viz.colors.yellow, 13, 'center');

                            // Items table
                            var cols = ['物品', '价值', '重量', '性价比'];
                            var tx = 40;
                            var ty = 70;
                            for (var c = 0; c < cols.length; c++) {
                                viz.screenText(cols[c], tx + c * 80, ty, viz.colors.text, 11, 'left');
                            }
                            for (var i = 0; i < items.length; i++) {
                                var it = items[i];
                                var highlight = i < step ? viz.colors.green : (i === step ? viz.colors.yellow : viz.colors.text);
                                viz.screenText(it.name, tx, ty + 22 + i * 20, highlight, 12, 'left');
                                viz.screenText(String(it.v), tx + 80, ty + 22 + i * 20, highlight, 12, 'left');
                                viz.screenText(String(it.w), tx + 160, ty + 22 + i * 20, highlight, 12, 'left');
                                viz.screenText((it.v / it.w).toFixed(1), tx + 240, ty + 22 + i * 20, highlight, 12, 'left');
                            }

                            // Knapsack visual
                            var kx = 400;
                            var ky = 70;
                            var kw = 200;
                            var kh = 250;
                            var ctx = viz.ctx;
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(kx, ky, kw, kh);
                            viz.screenText('背包', kx + kw / 2, ky - 10, viz.colors.white, 12, 'center');

                            // Fill knapsack
                            var fillY = ky + kh;
                            var totalV = 0;
                            var totalW2 = 0;
                            var itemColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple];
                            for (var i = 0; i < taken.length; i++) {
                                var t = taken[i];
                                var fillH = (t.wTaken / W) * kh;
                                fillY -= fillH;
                                ctx.fillStyle = itemColors[i % itemColors.length] + 'aa';
                                ctx.fillRect(kx + 2, fillY, kw - 4, fillH);
                                var label = t.name + ' (' + (t.frac < 1 ? (t.frac * 100).toFixed(0) + '%' : '100%') + ')';
                                viz.screenText(label, kx + kw / 2, fillY + fillH / 2, viz.colors.white, 11, 'center');
                                totalV += t.vTaken;
                                totalW2 += t.wTaken;
                            }

                            viz.screenText('已装重量: ' + totalW2.toFixed(1) + '/' + W, kx + kw / 2, ky + kh + 20, viz.colors.text, 12, 'center');
                            viz.screenText('总价值: ' + totalV.toFixed(1), kx + kw / 2, ky + kh + 40, viz.colors.green, 14, 'center');
                        }

                        VizEngine.createButton(controls, '下一步', advance);
                        VizEngine.createButton(controls, '重置', reset);

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'ch16-viz-greedy-fails',
                    title: '贪心 vs DP: 0-1 背包对比',
                    description: '展示贪心在 0-1 背包上的失败',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 380});
                        var items = [
                            {name: 'A', v: 60, w: 10},
                            {name: 'B', v: 100, w: 20},
                            {name: 'C', v: 120, w: 30}
                        ];
                        var W = 50;

                        function draw() {
                            viz.clear();
                            viz.screenText('0-1 背包: 贪心 vs 最优', viz.width / 2, 20, viz.colors.white, 15, 'center');
                            viz.screenText('容量 W = ' + W, viz.width / 2, 42, viz.colors.text, 12, 'center');

                            // Items info
                            viz.screenText('物品', 50, 75, viz.colors.text, 12, 'left');
                            viz.screenText('价值', 120, 75, viz.colors.text, 12, 'left');
                            viz.screenText('重量', 180, 75, viz.colors.text, 12, 'left');
                            viz.screenText('v/w', 240, 75, viz.colors.text, 12, 'left');
                            for (var i = 0; i < items.length; i++) {
                                viz.screenText(items[i].name, 50, 100 + i * 22, viz.colors.white, 12, 'left');
                                viz.screenText(String(items[i].v), 120, 100 + i * 22, viz.colors.white, 12, 'left');
                                viz.screenText(String(items[i].w), 180, 100 + i * 22, viz.colors.white, 12, 'left');
                                viz.screenText((items[i].v / items[i].w).toFixed(1), 240, 100 + i * 22, viz.colors.white, 12, 'left');
                            }

                            // Greedy solution
                            var gx = 100;
                            var gy = 200;
                            viz.screenText('贪心解 (按 v/w)', gx, gy, viz.colors.red, 13, 'left');
                            viz.screenText('选 A (w=10) + B (w=20) = 重30, 价值160', gx, gy + 25, viz.colors.red, 12, 'left');
                            viz.screenText('C (w=30) 放不进剩余20', gx, gy + 45, viz.colors.text, 11, 'left');

                            // Draw greedy knapsack
                            var ctx = viz.ctx;
                            ctx.strokeStyle = viz.colors.red;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(gx, gy + 65, 120, 80);
                            ctx.fillStyle = viz.colors.blue + '88';
                            ctx.fillRect(gx + 2, gy + 65 + 48, 116, 30);
                            viz.screenText('A:60', gx + 60, gy + 65 + 63, viz.colors.white, 11, 'center');
                            ctx.fillStyle = viz.colors.teal + '88';
                            ctx.fillRect(gx + 2, gy + 67, 116, 46);
                            viz.screenText('B:100', gx + 60, gy + 90, viz.colors.white, 11, 'center');
                            viz.screenText('= 160', gx + 60, gy + 160, viz.colors.red, 14, 'center');

                            // Optimal solution
                            var ox = 400;
                            viz.screenText('最优解 (DP)', ox, gy, viz.colors.green, 13, 'left');
                            viz.screenText('选 B (w=20) + C (w=30) = 重50, 价值220', ox, gy + 25, viz.colors.green, 12, 'left');
                            viz.screenText('恰好装满背包!', ox, gy + 45, viz.colors.text, 11, 'left');

                            ctx.strokeStyle = viz.colors.green;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(ox, gy + 65, 120, 80);
                            ctx.fillStyle = viz.colors.teal + '88';
                            ctx.fillRect(ox + 2, gy + 67, 116, 32);
                            viz.screenText('B:100', ox + 60, gy + 83, viz.colors.white, 11, 'center');
                            ctx.fillStyle = viz.colors.orange + '88';
                            ctx.fillRect(ox + 2, gy + 99, 116, 44);
                            viz.screenText('C:120', ox + 60, gy + 121, viz.colors.white, 11, 'center');
                            viz.screenText('= 220', ox + 60, gy + 160, viz.colors.green, 14, 'center');

                            viz.screenText('贪心差了 ' + ((220 - 160) / 220 * 100).toFixed(0) + '%!', viz.width / 2, gy + 185, viz.colors.yellow, 14, 'center');
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '证明分数背包的贪心算法是最优的。',
                    hint: '假设存在更优解, 交换论证: 将更优解中的低性价比部分换成高性价比部分。',
                    solution: '设贪心解为 \\(G\\), 假设存在更优解 \\(O\\) 使得 \\(\\sum v_i x_i^O > \\sum v_i x_i^G\\)。设 \\(j\\) 是第一个 \\(x_j^O \\ne x_j^G\\) 的物品 (按性价比递减排序)。必有 \\(x_j^O < x_j^G\\) (否则贪心会多取)。将 \\(O\\) 中 \\(x_j\\) 增加 \\(\\delta\\), 同时减少后面某个 \\(x_k\\) 的 \\(\\delta \\cdot w_j / w_k\\) 部分 (\\(r_j \\ge r_k\\))。新解价值增加 \\(\\delta(v_j - v_k w_j/w_k) = \\delta w_j(r_j - r_k) \\ge 0\\)。矛盾, 说明 \\(O\\) 不优于 \\(G\\)。'
                },
                {
                    question: '给定 5 个物品: (v=10,w=2), (v=5,w=3), (v=15,w=5), (v=7,w=7), (v=6,w=1), (v=18,w=4), (v=3,w=1)。背包容量 \\(W=15\\)。求分数背包的贪心解。',
                    hint: '先算性价比并排序。',
                    solution: '性价比: (10/2=5), (5/3=1.67), (15/5=3), (7/7=1), (6/1=6), (18/4=4.5), (3/1=3)。排序: 6(6/1), 5(10/2), 4.5(18/4), 3(15/5 和 3/1), 1.67(5/3), 1(7/7)。贪心: 取全部(6,w=1), 取全部(10,w=2), 取全部(18,w=4), 取全部(15,w=5), 取全部(3,w=1), 已用 w=13, 剩余 2, 取 5 的 2/3, 得 5*2/3=3.33。总 = 6+10+18+15+3+3.33 = 55.33。'
                },
                {
                    question: '为什么活动选择问题可以用贪心, 但加权活动选择不行? 从"可分割性"角度解释。',
                    hint: '不加权时每个活动贡献相同, 相当于"可分割的"相等单位。',
                    solution: '不加权活动选择中, 每个活动的贡献为 1, 是同质的。选择一个结束最早的活动"释放"了最多的后续时间, 不会浪费。这类似于分数背包中物品同质 — 贪心有效。但加权活动选择中, 不同活动的权重不同, 选择一个高权重但占时长的活动可能排除多个中等权重的活动, 类似于 0-1 背包中不可分割的物品。此时贪心选择可能"浪费"时间窗口, 需要 DP 来权衡。'
                },
                {
                    question: '集合覆盖问题: 给定全集 \\(U\\) 和子集族 \\(S_1, \\ldots, S_m\\), 贪心每次选覆盖最多未覆盖元素的子集。证明贪心至多选 \\(H_n = \\sum_{i=1}^{n} 1/i\\) 倍于最优解数量的子集 (\\(n = |U|\\))。',
                    hint: '设最优解选了 \\(k\\) 个子集。每一步, 剩余未覆盖元素至少减少 \\(1/k\\) 的比例。',
                    solution: '设 OPT 用 \\(k\\) 个子集覆盖全部 \\(n\\) 个元素。在贪心的第 \\(t\\) 步, 设还有 \\(n_t\\) 个未覆盖的元素。OPT 的 \\(k\\) 个子集覆盖了全部 \\(n_t\\) 个, 所以存在一个子集覆盖 \\(\\ge n_t / k\\) 个。贪心选的至少不比它差, 所以 \\(n_{t+1} \\le n_t - n_t/k = n_t(1 - 1/k)\\)。故 \\(n_t \\le n(1-1/k)^t \\le ne^{-t/k}\\)。当 \\(t = k\\ln n\\) 时, \\(n_t < 1\\), 即全部覆盖。贪心用 \\(\\le k\\ln n = k \\cdot H_n\\) 个子集, 即 \\(H_n\\) 倍于 OPT。'
                },
                {
                    question: '总结贪心算法适用的三个判据, 并各举一个例子。',
                    hint: '贪心选择性质、最优子结构、以及拟阵结构。',
                    solution: '(1) **贪心选择性质**: 存在最优解包含贪心选的元素。例: 活动选择 — 最优解包含最早结束的活动。(2) **最优子结构**: 做完贪心选择后, 子问题的最优解+贪心选择=原问题最优解。例: Huffman 编码 — 合并最小频率对后, 子问题最优+分裂=原问题最优。(3) **拟阵结构**: 可行集构成拟阵, 贪心对加权最大独立集问题最优。例: 图拟阵上的 Kruskal MST 算法。'
                }
            ]
        }
    ]
});
