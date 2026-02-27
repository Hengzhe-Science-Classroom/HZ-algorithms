// Chapter 4: 归并排序与分治策略 — Merge Sort & the Divide-and-Conquer Paradigm
window.CHAPTERS.push({
    id: 'ch04',
    number: 4,
    title: '归并排序与分治策略',
    subtitle: 'Merge Sort & the Divide-and-Conquer Paradigm',
    sections: [
        // ── Section 1: Merge Sort Algorithm ──
        {
            id: 'ch04-sec01',
            title: '归并排序算法',
            content: `<h2>归并排序算法</h2>
<p>归并排序（Merge Sort）是分治思想在排序问题上的经典体现。它将一个数组递归地分成两半，分别排序后再合并，保证了 \\(O(n \\log n)\\) 的最坏情况时间复杂度。</p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Merge Sort)</div><div class="env-body">
<p><strong>MergeSort(A, l, r):</strong></p>
<p>1. 若 \\(l \\geq r\\)，返回</p>
<p>2. 令 \\(m = \\lfloor (l + r) / 2 \\rfloor\\)</p>
<p>3. MergeSort(A, l, m)</p>
<p>4. MergeSort(A, m+1, r)</p>
<p>5. Merge(A, l, m, r)</p>
</div></div>

<p>其中 <strong>Merge</strong> 过程是算法的核心：将两个已排序的子数组 \\(A[l..m]\\) 和 \\(A[m+1..r]\\) 合并为一个有序数组。</p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Merge)</div><div class="env-body">
<p><strong>Merge(A, l, m, r):</strong></p>
<p>1. 创建辅助数组 \\(L = A[l..m]\\)，\\(R = A[m+1..r]\\)</p>
<p>2. 令 \\(i = 0,\\; j = 0,\\; k = l\\)</p>
<p>3. 当 \\(i < |L|\\) 且 \\(j < |R|\\) 时：</p>
<p>&emsp; 若 \\(L[i] \\leq R[j]\\)，则 \\(A[k] = L[i],\\; i{+}{+}\\)</p>
<p>&emsp; 否则 \\(A[k] = R[j],\\; j{+}{+}\\)</p>
<p>&emsp; \\(k{+}{+}\\)</p>
<p>4. 将 \\(L\\) 或 \\(R\\) 中剩余元素复制到 \\(A\\)</p>
</div></div>

<div class="viz-placeholder" data-viz="ch04-viz-merge-sort-step"></div>

<div class="env-block intuition"><div class="env-title">Intuition</div><div class="env-body">
<p>想象你手里有两叠已排好的扑克牌。每次比较两叠顶端的牌，取较小的一张放到结果牌堆中。这就是归并的过程——简单、优雅、且只需线性时间。</p>
</div></div>

<p>归并排序的一个重要特性是它是<strong>稳定排序</strong>：相等元素的相对顺序在排序后不变。这在多关键字排序中非常有用。</p>`,
            visualizations: [
                {
                    id: 'ch04-viz-merge-sort-step',
                    title: '归并排序逐步演示',
                    description: '交互式演示归并排序的分割与合并过程',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var origArr = [38, 27, 43, 3, 9, 82, 10, 15];
                        var arr = origArr.slice();
                        var steps = [];
                        var stepIdx = 0;

                        function recordMergeSort(a, l, r, depth) {
                            if (l >= r) return;
                            var m = Math.floor((l + r) / 2);
                            steps.push({type: 'split', l: l, m: m, r: r, arr: a.slice(), depth: depth});
                            recordMergeSort(a, l, m, depth + 1);
                            recordMergeSort(a, m + 1, r, depth + 1);
                            var L = a.slice(l, m + 1);
                            var R = a.slice(m + 1, r + 1);
                            var i = 0, j = 0, k = l;
                            while (i < L.length && j < R.length) {
                                if (L[i] <= R[j]) { a[k++] = L[i++]; }
                                else { a[k++] = R[j++]; }
                            }
                            while (i < L.length) a[k++] = L[i++];
                            while (j < R.length) a[k++] = R[j++];
                            steps.push({type: 'merge', l: l, m: m, r: r, arr: a.slice(), depth: depth});
                        }

                        var temp = origArr.slice();
                        recordMergeSort(temp, 0, temp.length - 1, 0);

                        function draw() {
                            viz.clear();
                            var n = arr.length;
                            var cellW = 60, cellH = 40;
                            var startX = (700 - n * cellW) / 2;
                            var startY = 40;

                            viz.screenText('Merge Sort Step-by-Step', 350, 20, viz.colors.white, 16, 'center');

                            var step = stepIdx < steps.length ? steps[stepIdx] : null;
                            var currentArr = step ? step.arr : temp;
                            var colors = [];
                            var highlights = [];
                            for (var i = 0; i < n; i++) {
                                colors.push(viz.colors.bg);
                                highlights.push(null);
                            }
                            if (step) {
                                for (var j = step.l; j <= step.r; j++) {
                                    if (step.type === 'split') {
                                        colors[j] = '#1a2a4a';
                                        if (j <= step.m) highlights[j] = viz.colors.blue;
                                        else highlights[j] = viz.colors.teal;
                                    } else {
                                        colors[j] = '#1a3a2a';
                                        highlights[j] = viz.colors.green;
                                    }
                                }
                            }

                            viz.drawArray(currentArr, startX, startY, cellW, cellH, colors, highlights);

                            // Draw bar chart
                            var barW = 40;
                            var maxH = 180;
                            var barStartX = (700 - n * (barW + 8)) / 2;
                            var barStartY = 350;
                            var maxVal = Math.max.apply(null, currentArr);
                            for (var i = 0; i < n; i++) {
                                var h = (currentArr[i] / maxVal) * maxH;
                                var px = barStartX + i * (barW + 8);
                                var py = barStartY - h;
                                var barColor = viz.colors.blue;
                                if (step && i >= step.l && i <= step.r) {
                                    barColor = step.type === 'split' ? viz.colors.orange : viz.colors.green;
                                }
                                viz.ctx.fillStyle = barColor;
                                viz.ctx.fillRect(px, py, barW, h);
                                viz.ctx.strokeStyle = viz.colors.axis;
                                viz.ctx.lineWidth = 0.5;
                                viz.ctx.strokeRect(px, py, barW, h);
                                viz.screenText(String(currentArr[i]), px + barW / 2, py - 8, viz.colors.white, 11, 'center');
                            }

                            // Status text
                            var statusText = '';
                            if (step) {
                                if (step.type === 'split') {
                                    statusText = 'Split: A[' + step.l + '..' + step.r + '] at mid=' + step.m + ' (depth ' + step.depth + ')';
                                } else {
                                    statusText = 'Merge: A[' + step.l + '..' + step.r + '] merged (depth ' + step.depth + ')';
                                }
                            } else {
                                statusText = 'Sorting complete!';
                            }
                            viz.screenText(statusText, 350, 390, viz.colors.yellow, 13, 'center');
                            viz.screenText('Step ' + (stepIdx + 1) + ' / ' + steps.length, 350, 410, viz.colors.text, 11, 'center');
                        }

                        draw();

                        VizEngine.createButton(controls, 'Previous', function() {
                            if (stepIdx > 0) { stepIdx--; draw(); }
                        });
                        VizEngine.createButton(controls, 'Next', function() {
                            if (stepIdx < steps.length - 1) { stepIdx++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            stepIdx = 0; draw();
                        });
                        VizEngine.createButton(controls, 'New Array', function() {
                            origArr = [];
                            for (var i = 0; i < 8; i++) origArr.push(Math.floor(Math.random() * 90) + 5);
                            arr = origArr.slice();
                            steps = [];
                            temp = origArr.slice();
                            recordMergeSort(temp, 0, temp.length - 1, 0);
                            stepIdx = 0;
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '对数组 \\([5, 2, 4, 7, 1, 3, 2, 6]\\) 执行归并排序，写出第一次合并（最底层）后的子数组状态。',
                    hint: '先递归到最小子问题：单个元素。然后开始两两合并。',
                    solution: '第一次拆分到 \\([5],[2]\\)，合并得到 \\([2,5]\\)。然后 \\([4],[7]\\) 合并为 \\([4,7]\\)。以此类推。'
                },
                {
                    question: '归并排序的空间复杂度是多少？为什么不能做到原地（in-place）归并？',
                    hint: '考虑 Merge 步骤需要的辅助空间。',
                    solution: '空间复杂度 \\(O(n)\\)。Merge 操作需要将元素复制到辅助数组，因为在合并时需要同时读取和写入同一段区间。虽然存在原地归并的理论算法，但它们的常数因子极大，实际中几乎不使用。'
                },
                {
                    question: '证明归并操作 Merge(A, l, m, r) 的比较次数最多为 \\(n - 1\\)（其中 \\(n = r - l + 1\\)）。',
                    hint: '每次比较后，至少有一个元素被放入输出数组。',
                    solution: '设 \\(|L| = n_1,\\; |R| = n_2,\\; n = n_1 + n_2\\)。每次比较后恰好有一个元素被放到结果中。当一侧耗尽时停止比较。因此最多执行 \\(n_1 + n_2 - 1 = n - 1\\) 次比较。'
                }
            ]
        },

        // ── Section 2: Correctness & Analysis ──
        {
            id: 'ch04-sec02',
            title: '正确性与复杂度分析',
            content: `<h2>正确性与复杂度分析</h2>

<h3>正确性证明</h3>
<p>归并排序的正确性可以用<strong>循环不变量</strong>和<strong>结构归纳法</strong>来证明。</p>

<div class="env-block theorem"><div class="env-title">Theorem (Merge Correctness)</div><div class="env-body">
<p>若 \\(A[l..m]\\) 和 \\(A[m+1..r]\\) 在调用 Merge 前已排序，则 Merge 后 \\(A[l..r]\\) 已排序。</p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p><strong>循环不变量：</strong> 在合并循环的每次迭代开始时，\\(A[l..k-1]\\) 包含 \\(L[0..i-1]\\) 和 \\(R[0..j-1]\\) 中的所有元素，且已排序。同时 \\(L[i]\\) 和 \\(R[j]\\) 是各自子数组中未处理部分的最小元素。</p>
<p><strong>初始化：</strong> \\(k = l,\\; i = j = 0\\) 时，\\(A[l..l-1]\\) 为空，不变量平凡成立。</p>
<p><strong>保持：</strong> 若 \\(L[i] \\leq R[j]\\)，则 \\(L[i]\\) 是所有未处理元素中最小的（因为 \\(L[i] \\leq L[i+1..] \\) 且 \\(L[i] \\leq R[j] \\leq R[j+1..]\\)），将其放入 \\(A[k]\\) 后不变量继续成立。</p>
<p><strong>终止：</strong> 当循环结束时，所有元素已被放入 \\(A[l..r]\\) 且有序。</p>
<p class="qed">∎</p>
</div></div>

<h3>时间复杂度</h3>
<p>归并排序的递推关系为：</p>
$$T(n) = 2T(n/2) + \\Theta(n)$$
<p>其中 \\(\\Theta(n)\\) 是归并操作的开销。</p>

<div class="viz-placeholder" data-viz="ch04-viz-recursion-tree"></div>

<div class="env-block theorem"><div class="env-title">Theorem (Merge Sort Complexity)</div><div class="env-body">
<p>归并排序的时间复杂度为 \\(\\Theta(n \\log n)\\)，空间复杂度为 \\(\\Theta(n)\\)。</p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p>由主定理（Master Theorem），\\(T(n) = 2T(n/2) + \\Theta(n)\\) 属于 Case 2（\\(a = 2,\\; b = 2,\\; f(n) = \\Theta(n) = \\Theta(n^{\\log_b a})\\)），所以 \\(T(n) = \\Theta(n \\log n)\\)。</p>
<p>也可以用递归树分析：共 \\(\\log_2 n\\) 层，每层的合并总工作量为 \\(\\Theta(n)\\)，因此总复杂度 \\(\\Theta(n \\log n)\\)。</p>
<p class="qed">∎</p>
</div></div>

<p>与插入排序的 \\(O(n^2)\\) 相比，归并排序在大输入上有显著优势。当 \\(n = 10^6\\) 时，\\(n^2 = 10^{12}\\) 而 \\(n \\log_2 n \\approx 2 \\times 10^7\\)。</p>`,
            visualizations: [
                {
                    id: 'ch04-viz-recursion-tree',
                    title: '归并排序递归树',
                    description: '可视化递归树的各层合并工作量',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var nVal = 8;

                        function draw() {
                            viz.clear();
                            viz.screenText('Merge Sort Recursion Tree (n=' + nVal + ')', 350, 18, viz.colors.white, 15, 'center');

                            var levels = Math.ceil(Math.log2(nVal)) + 1;
                            var nodeR = 18;
                            var levelH = 60;
                            var startY = 55;

                            for (var lev = 0; lev < levels; lev++) {
                                var nodesAtLevel = Math.pow(2, lev);
                                var sizeAtLevel = Math.ceil(nVal / nodesAtLevel);
                                if (sizeAtLevel < 1) break;
                                var spacing = 660 / (nodesAtLevel + 1);

                                for (var nd = 0; nd < nodesAtLevel; nd++) {
                                    var px = 20 + spacing * (nd + 1);
                                    var py = startY + lev * levelH;
                                    var label = sizeAtLevel <= 1 ? '1' : String(sizeAtLevel);
                                    var col = lev === 0 ? viz.colors.orange : viz.colors.blue;
                                    viz.drawNode(px, py, nodeR, label, col, viz.colors.white);

                                    // Draw edges to children
                                    if (lev < levels - 1 && sizeAtLevel > 1) {
                                        var childSpacing = 660 / (nodesAtLevel * 2 + 1);
                                        var lx = 20 + childSpacing * (nd * 2 + 1);
                                        var rx = 20 + childSpacing * (nd * 2 + 2);
                                        var cy = startY + (lev + 1) * levelH;
                                        viz.drawTreeEdge(px, py + nodeR, lx, cy - nodeR, viz.colors.axis);
                                        viz.drawTreeEdge(px, py + nodeR, rx, cy - nodeR, viz.colors.axis);
                                    }
                                }

                                // Work at this level
                                var workAtLevel = nodesAtLevel * sizeAtLevel;
                                viz.screenText('Work: O(' + Math.min(workAtLevel, nVal) + ')', 680, startY + lev * levelH, viz.colors.yellow, 11, 'right');
                            }

                            viz.screenText('Total: O(n log n) = O(' + nVal + ' * ' + Math.ceil(Math.log2(nVal)) + ') = O(' + (nVal * Math.ceil(Math.log2(nVal))) + ')', 350, startY + levels * levelH - 10, viz.colors.green, 13, 'center');
                        }

                        draw();

                        VizEngine.createSlider(controls, 'n', 2, 32, nVal, 1, function(v) {
                            nVal = Math.round(v);
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '用递归树方法（不用主定理）证明 \\(T(n) = 2T(n/2) + n\\) 的解为 \\(\\Theta(n \\log n)\\)。',
                    hint: '画出递归树，计算每层的总代价，再对所有层求和。',
                    solution: '递归树共 \\(\\log_2 n\\) 层。第 \\(k\\) 层有 \\(2^k\\) 个子问题，每个大小 \\(n/2^k\\)，每个子问题的合并代价为 \\(n/2^k\\)。因此第 \\(k\\) 层总代价 = \\(2^k \\cdot n/2^k = n\\)。总代价 = \\(n \\cdot \\log_2 n = \\Theta(n \\log n)\\)。'
                },
                {
                    question: '归并排序的最好情况和最坏情况的比较次数分别是多少？（精确到常数）',
                    hint: '最好情况：每次归并时一侧先耗尽。最坏情况：两侧交替选取。',
                    solution: '最坏情况比较次数：\\(n \\lceil \\log_2 n \\rceil - 2^{\\lceil \\log_2 n \\rceil} + 1\\)。最好情况比较次数：\\(\\frac{n}{2} \\log_2 n\\)（当每次归并时，一侧的最大元素小于另一侧的最小元素，只需 \\(n/2\\) 次比较而非 \\(n-1\\) 次）。'
                },
                {
                    question: '如果将归并排序改为三路归并（3-way merge sort），其递推关系和时间复杂度是什么？',
                    hint: '递推变为 \\(T(n) = 3T(n/3) + ?\\)。合并三个有序数组的代价是多少？',
                    solution: '递推为 \\(T(n) = 3T(n/3) + O(n)\\)。三路合并每步将三个指针中的最小值放入结果，需 \\(O(n)\\) 比较。由主定理 \\(a=3,b=3\\)，仍有 \\(T(n) = \\Theta(n \\log n)\\)（底数变为 3，但 \\(\\log_3 n = \\log_2 n / \\log_2 3\\)，常数因子不同）。'
                }
            ]
        },

        // ── Section 3: Divide-and-Conquer Template ──
        {
            id: 'ch04-sec03',
            title: '分治法范式',
            content: `<h2>分治法范式</h2>
<p>归并排序体现了<strong>分治法（Divide and Conquer）</strong>的三步框架：</p>

<div class="env-block definition"><div class="env-title">Definition (Divide and Conquer)</div><div class="env-body">
<p>分治法是一种算法设计范式，包含三个步骤：</p>
<p>1. <strong>Divide（分割）：</strong> 将问题分解为若干规模更小的子问题。</p>
<p>2. <strong>Conquer（求解）：</strong> 递归地解决子问题。当子问题足够小时，直接求解。</p>
<p>3. <strong>Combine（合并）：</strong> 将子问题的解组合成原问题的解。</p>
</div></div>

<div class="viz-placeholder" data-viz="ch04-viz-dc-template"></div>

<p>分治法的时间复杂度通常由递推关系表达：</p>
$$T(n) = aT(n/b) + f(n)$$
<p>其中 \\(a\\) 是子问题数量，\\(n/b\\) 是每个子问题的规模，\\(f(n)\\) 是分割与合并的代价。这正是主定理适用的形式。</p>

<div class="env-block example"><div class="env-title">Example (Classic D&C Algorithms)</div><div class="env-body">
<p><strong>归并排序：</strong> \\(a = 2,\\; b = 2,\\; f(n) = \\Theta(n)\\) → \\(T(n) = \\Theta(n \\log n)\\)</p>
<p><strong>二分查找：</strong> \\(a = 1,\\; b = 2,\\; f(n) = \\Theta(1)\\) → \\(T(n) = \\Theta(\\log n)\\)</p>
<p><strong>Strassen 矩阵乘法：</strong> \\(a = 7,\\; b = 2,\\; f(n) = \\Theta(n^2)\\) → \\(T(n) = \\Theta(n^{\\log_2 7}) \\approx \\Theta(n^{2.807})\\)</p>
<p><strong>Karatsuba 乘法：</strong> \\(a = 3,\\; b = 2,\\; f(n) = \\Theta(n)\\) → \\(T(n) = \\Theta(n^{\\log_2 3}) \\approx \\Theta(n^{1.585})\\)</p>
</div></div>

<div class="env-block warning"><div class="env-title">Warning</div><div class="env-body">
<p>并非所有递归算法都是分治法。分治法的关键在于子问题是<strong>不重叠</strong>的。如果子问题重叠，应该使用动态规划（DP）来避免重复计算。例如，Fibonacci 数列的朴素递归虽然分成了两个子问题，但由于子问题重叠，其复杂度是指数级的。</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch04-viz-dc-template',
                    title: '分治法框架可视化',
                    description: '展示分治法的三步流程：分割、求解、合并',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 380});

                        var alg = 'merge';

                        function draw() {
                            viz.clear();
                            viz.screenText('Divide & Conquer Template', 350, 18, viz.colors.white, 15, 'center');

                            // Draw the three phases
                            var phases = ['DIVIDE', 'CONQUER', 'COMBINE'];
                            var phaseColors = [viz.colors.orange, viz.colors.blue, viz.colors.green];
                            var phaseX = [120, 350, 580];

                            for (var i = 0; i < 3; i++) {
                                var px = phaseX[i];
                                // Box
                                viz.ctx.fillStyle = phaseColors[i] + '22';
                                viz.ctx.fillRect(px - 80, 50, 160, 60);
                                viz.ctx.strokeStyle = phaseColors[i];
                                viz.ctx.lineWidth = 2;
                                viz.ctx.strokeRect(px - 80, 50, 160, 60);
                                viz.screenText(phases[i], px, 72, phaseColors[i], 16, 'center');

                                if (i < 2) {
                                    // Arrow
                                    viz.ctx.strokeStyle = viz.colors.axis;
                                    viz.ctx.lineWidth = 2;
                                    viz.ctx.beginPath();
                                    viz.ctx.moveTo(px + 80, 80);
                                    viz.ctx.lineTo(phaseX[i + 1] - 80, 80);
                                    viz.ctx.stroke();
                                    viz.ctx.fillStyle = viz.colors.axis;
                                    viz.ctx.beginPath();
                                    viz.ctx.moveTo(phaseX[i + 1] - 80, 80);
                                    viz.ctx.lineTo(phaseX[i + 1] - 90, 75);
                                    viz.ctx.lineTo(phaseX[i + 1] - 90, 85);
                                    viz.ctx.closePath();
                                    viz.ctx.fill();
                                }
                            }

                            // Show example based on selected algorithm
                            var descriptions = {};
                            if (alg === 'merge') {
                                descriptions = {
                                    title: 'Merge Sort',
                                    divide: 'Split array at midpoint',
                                    conquer: 'Sort each half recursively',
                                    combine: 'Merge two sorted halves',
                                    recurrence: 'T(n) = 2T(n/2) + O(n)'
                                };
                            } else if (alg === 'binary') {
                                descriptions = {
                                    title: 'Binary Search',
                                    divide: 'Compare with middle element',
                                    conquer: 'Search in one half',
                                    combine: 'No combination needed',
                                    recurrence: 'T(n) = T(n/2) + O(1)'
                                };
                            } else {
                                descriptions = {
                                    title: 'Strassen',
                                    divide: 'Partition into 4 submatrices',
                                    conquer: '7 recursive multiplications',
                                    combine: 'Add/subtract subresults',
                                    recurrence: 'T(n) = 7T(n/2) + O(n^2)'
                                };
                            }

                            viz.screenText(descriptions.title, 350, 140, viz.colors.yellow, 14, 'center');

                            for (var j = 0; j < 3; j++) {
                                var desc = [descriptions.divide, descriptions.conquer, descriptions.combine][j];
                                viz.screenText(desc, phaseX[j], 170, viz.colors.text, 12, 'center');
                            }

                            // Draw example tree
                            var treeY = 210;
                            // Root
                            viz.drawNode(350, treeY, 22, 'n', viz.colors.orange, viz.colors.white);
                            // Level 1
                            viz.drawTreeEdge(350, treeY + 22, 200, treeY + 65, viz.colors.axis);
                            viz.drawTreeEdge(350, treeY + 22, 500, treeY + 65, viz.colors.axis);
                            viz.drawNode(200, treeY + 80, 18, 'n/2', viz.colors.blue, viz.colors.white);
                            viz.drawNode(500, treeY + 80, 18, 'n/2', viz.colors.blue, viz.colors.white);
                            // Level 2
                            viz.drawTreeEdge(200, treeY + 98, 130, treeY + 130, viz.colors.axis);
                            viz.drawTreeEdge(200, treeY + 98, 270, treeY + 130, viz.colors.axis);
                            viz.drawTreeEdge(500, treeY + 98, 430, treeY + 130, viz.colors.axis);
                            viz.drawTreeEdge(500, treeY + 98, 570, treeY + 130, viz.colors.axis);
                            viz.drawNode(130, treeY + 145, 14, 'n/4', viz.colors.teal, viz.colors.white);
                            viz.drawNode(270, treeY + 145, 14, 'n/4', viz.colors.teal, viz.colors.white);
                            viz.drawNode(430, treeY + 145, 14, 'n/4', viz.colors.teal, viz.colors.white);
                            viz.drawNode(570, treeY + 145, 14, 'n/4', viz.colors.teal, viz.colors.white);

                            viz.screenText(descriptions.recurrence, 350, treeY + 165, viz.colors.green, 13, 'center');
                        }

                        draw();

                        VizEngine.createSelect(controls, 'Algorithm', [
                            {value: 'merge', label: 'Merge Sort'},
                            {value: 'binary', label: 'Binary Search'},
                            {value: 'strassen', label: 'Strassen'}
                        ], function(v) { alg = v; draw(); });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '设计一个分治算法来求数组中的最大元素。写出递推关系并分析时间复杂度。',
                    hint: '将数组分为两半，分别求最大值，然后取较大者。',
                    solution: '递推为 \\(T(n) = 2T(n/2) + O(1)\\)。由主定理 Case 1，\\(T(n) = \\Theta(n)\\)。比较次数恰好为 \\(n - 1\\)。这与线性扫描的比较次数相同，但分治版本允许并行化。'
                },
                {
                    question: '一个分治算法将问题分成 4 个子问题，每个大小为 \\(n/2\\)，合并代价为 \\(O(n^2)\\)。其时间复杂度是什么？',
                    hint: '使用主定理，\\(a = 4, b = 2, f(n) = n^2\\)。',
                    solution: '\\(\\log_b a = \\log_2 4 = 2\\)。\\(f(n) = n^2 = \\Theta(n^{\\log_b a})\\)，属于 Case 2。因此 \\(T(n) = \\Theta(n^2 \\log n)\\)。'
                },
                {
                    question: '为什么说分治法的子问题必须"不重叠"？给出一个重叠的反例并分析其代价。',
                    hint: '考虑 Fibonacci 数列的递归。',
                    solution: '朴素 Fibonacci 递归 \\(F(n) = F(n-1) + F(n-2)\\) 中，\\(F(n-2)\\) 被 \\(F(n-1)\\) 和 \\(F(n)\\) 都调用，导致指数级 \\(O(\\phi^n)\\) 的冗余计算。使用 DP 或备忘录法可将其降至 \\(O(n)\\)。'
                }
            ]
        },

        // ── Section 4: Counting Inversions ──
        {
            id: 'ch04-sec04',
            title: '逆序对计数',
            content: `<h2>逆序对计数</h2>
<p>逆序对计数是分治法在排序之外的经典应用。给定数组 \\(A[1..n]\\)，一个<strong>逆序对</strong>是满足 \\(i < j\\) 但 \\(A[i] > A[j]\\) 的下标对 \\((i, j)\\)。</p>

<div class="env-block definition"><div class="env-title">Definition (Inversions)</div><div class="env-body">
<p>数组 \\(A\\) 的逆序数定义为：</p>
$$\\text{inv}(A) = |\\{(i, j) : 1 \\leq i < j \\leq n \\text{ and } A[i] > A[j]\\}|$$
<p>逆序数衡量了数组偏离有序状态的程度。已排序数组的逆序数为 0，降序排列的逆序数为 \\(\\binom{n}{2} = n(n-1)/2\\)。</p>
</div></div>

<p>逆序对在许多场景中出现：衡量排名相似度（如 Kendall tau 距离）、协同过滤推荐系统、以及计算排列的奇偶性。</p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Count Inversions via Merge Sort)</div><div class="env-body">
<p><strong>CountInversions(A, l, r):</strong></p>
<p>1. 若 \\(l \\geq r\\)，返回 0</p>
<p>2. \\(m = \\lfloor (l + r) / 2 \\rfloor\\)</p>
<p>3. \\(\\text{left\\_inv} = \\text{CountInversions}(A, l, m)\\)</p>
<p>4. \\(\\text{right\\_inv} = \\text{CountInversions}(A, m+1, r)\\)</p>
<p>5. \\(\\text{split\\_inv} = \\text{MergeAndCount}(A, l, m, r)\\)</p>
<p>6. 返回 \\(\\text{left\\_inv} + \\text{right\\_inv} + \\text{split\\_inv}\\)</p>
</div></div>

<p>关键观察：在合并过程中，当 \\(R[j] < L[i]\\) 时，\\(R[j]\\) 与 \\(L[i], L[i+1], \\ldots, L[n_1-1]\\) 都构成逆序对。因此分裂逆序对的计数可以在归并过程中 \\(O(n)\\) 时间内完成。</p>

<div class="viz-placeholder" data-viz="ch04-viz-inversions"></div>

<div class="env-block theorem"><div class="env-title">Theorem</div><div class="env-body">
<p>逆序对计数问题可以在 \\(O(n \\log n)\\) 时间内解决。</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch04-viz-inversions',
                    title: '逆序对计数可视化',
                    description: '展示如何在归并过程中计数逆序对',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var arr = [2, 4, 1, 3, 5];
                        var stepLog = [];
                        var stepIdx = 0;

                        function countInv(a) {
                            stepLog = [];
                            var temp = a.slice();
                            function msort(arr2, l, r) {
                                if (l >= r) return 0;
                                var m = Math.floor((l + r) / 2);
                                var inv = 0;
                                inv += msort(arr2, l, m);
                                inv += msort(arr2, m + 1, r);
                                var L = arr2.slice(l, m + 1);
                                var R = arr2.slice(m + 1, r + 1);
                                var i = 0, j = 0, k = l, splitInv = 0;
                                while (i < L.length && j < R.length) {
                                    if (L[i] <= R[j]) {
                                        arr2[k++] = L[i++];
                                    } else {
                                        splitInv += L.length - i;
                                        stepLog.push({
                                            arr: arr2.slice(),
                                            l: l, m: m, r: r,
                                            li: l + i, rj: m + 1 + j,
                                            invCount: splitInv,
                                            msg: 'R[' + j + ']=' + R[j] + ' < L[' + i + ']=' + L[i] + ' => +' + (L.length - i) + ' inversions'
                                        });
                                        arr2[k++] = R[j++];
                                    }
                                }
                                while (i < L.length) arr2[k++] = L[i++];
                                while (j < R.length) arr2[k++] = R[j++];
                                inv += splitInv;
                                return inv;
                            }
                            var total = msort(temp, 0, temp.length - 1);
                            stepLog.push({arr: temp, l: 0, m: 0, r: temp.length - 1, li: -1, rj: -1, invCount: total, msg: 'Total inversions: ' + total});
                            return total;
                        }

                        countInv(arr);

                        function draw() {
                            viz.clear();
                            var n = arr.length;
                            var cellW = 55, cellH = 40;
                            var startX = (700 - n * cellW) / 2;

                            viz.screenText('Inversion Counting via Merge Sort', 350, 18, viz.colors.white, 15, 'center');

                            // Original array
                            viz.screenText('Original:', 60, 60, viz.colors.text, 12, 'left');
                            viz.drawArray(arr, startX, 45, cellW, cellH);

                            // Current step
                            if (stepIdx < stepLog.length) {
                                var st = stepLog[stepIdx];
                                viz.screenText('Step ' + (stepIdx + 1) + '/' + stepLog.length, 350, 110, viz.colors.yellow, 12, 'center');

                                var colors = [];
                                var highlights = [];
                                for (var i = 0; i < st.arr.length; i++) {
                                    colors.push(viz.colors.bg);
                                    highlights.push(null);
                                    if (i >= st.l && i <= st.r) {
                                        colors[i] = '#1a2a4a';
                                    }
                                    if (i === st.li) highlights[i] = viz.colors.red;
                                    if (i === st.rj) highlights[i] = viz.colors.green;
                                }
                                viz.drawArray(st.arr, startX, 130, cellW, cellH, colors, highlights);

                                // Draw inversion arcs
                                viz.screenText(st.msg, 350, 210, viz.colors.orange, 13, 'center');
                                viz.screenText('Split inversions so far: ' + st.invCount, 350, 235, viz.colors.teal, 12, 'center');

                                // Bar chart of current array state
                                var barW = 35;
                                var maxH = 120;
                                var barStartX = (700 - n * (barW + 10)) / 2;
                                var barStartY = 380;
                                var maxVal = Math.max.apply(null, st.arr);
                                for (var j = 0; j < n; j++) {
                                    var h = (st.arr[j] / maxVal) * maxH;
                                    var px = barStartX + j * (barW + 10);
                                    var py = barStartY - h;
                                    var barCol = viz.colors.blue;
                                    if (j === st.li) barCol = viz.colors.red;
                                    if (j === st.rj) barCol = viz.colors.green;
                                    viz.ctx.fillStyle = barCol;
                                    viz.ctx.fillRect(px, py, barW, h);
                                    viz.screenText(String(st.arr[j]), px + barW / 2, py - 8, viz.colors.white, 11, 'center');
                                }
                            }
                        }

                        draw();

                        VizEngine.createButton(controls, 'Prev', function() {
                            if (stepIdx > 0) { stepIdx--; draw(); }
                        });
                        VizEngine.createButton(controls, 'Next', function() {
                            if (stepIdx < stepLog.length - 1) { stepIdx++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            stepIdx = 0; draw();
                        });
                        VizEngine.createButton(controls, 'Random Array', function() {
                            arr = [];
                            for (var i = 0; i < 6; i++) arr.push(Math.floor(Math.random() * 20) + 1);
                            countInv(arr);
                            stepIdx = 0;
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '计算数组 \\([3, 1, 2, 5, 4]\\) 的逆序数。',
                    hint: '逐一检查所有 \\((i,j)\\) 对，其中 \\(i < j\\) 但 \\(A[i] > A[j]\\)。',
                    solution: '逆序对为 \\((3,1), (3,2), (5,4)\\)，共 3 个。'
                },
                {
                    question: '证明：一个有 \\(k\\) 个逆序对的数组，插入排序需要恰好 \\(k\\) 次交换。',
                    hint: '插入排序的每次交换消除恰好一个逆序对。',
                    solution: '在插入排序中，将 \\(A[j]\\) 插入到已排序部分时，每次与前一个元素交换都消除一个形如 \\((A[j-1], A[j])\\) 的逆序对，且不会产生新的逆序对。因此总交换次数 = 总逆序数 = \\(k\\)。'
                },
                {
                    question: '一个长度为 \\(n\\) 的排列的期望逆序数是多少？',
                    hint: '对每一对 \\((i,j)\\)，\\(A[i] > A[j]\\) 的概率是多少？',
                    solution: '共有 \\(\\binom{n}{2}\\) 对。对于任意一对位置 \\((i,j)\\) 其中 \\(i < j\\)，在随机排列中 \\(A[i] > A[j]\\) 的概率为 \\(1/2\\)。由期望的线性性，期望逆序数 = \\(\\binom{n}{2} \\cdot \\frac{1}{2} = \\frac{n(n-1)}{4}\\)。'
                },
                {
                    question: '如何修改逆序对算法来计算满足 \\(i < j\\) 且 \\(A[i] > 2A[j]\\) 的对数？',
                    hint: '在归并前增加一个额外的扫描步骤。',
                    solution: '在合并 \\(L\\) 和 \\(R\\) 之前，用双指针扫描计数满足 \\(L[i] > 2R[j]\\) 的对：对每个 \\(L[i]\\)，找到最大的 \\(j\\) 使得 \\(L[i] > 2R[j]\\)。由于 \\(L\\) 和 \\(R\\) 已排序，指针只需单调递增，总扫描为 \\(O(n)\\)。然后正常归并。总复杂度仍为 \\(O(n \\log n)\\)。'
                }
            ]
        },

        // ── Section 5: Closest Pair of Points ──
        {
            id: 'ch04-sec05',
            title: '最近点对问题',
            content: `<h2>最近点对问题</h2>
<p>给定平面上 \\(n\\) 个点，找出距离最近的一对点。朴素算法需要检查所有 \\(\\binom{n}{2}\\) 对点，时间复杂度 \\(O(n^2)\\)。利用分治法可以在 \\(O(n \\log n)\\) 时间内解决。</p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Closest Pair)</div><div class="env-body">
<p><strong>ClosestPair(P):</strong></p>
<p>1. 将点集 \\(P\\) 按 \\(x\\) 坐标排序</p>
<p>2. 用中位线将 \\(P\\) 分为左半部分 \\(P_L\\) 和右半部分 \\(P_R\\)</p>
<p>3. \\(\\delta_L = \\text{ClosestPair}(P_L)\\)，\\(\\delta_R = \\text{ClosestPair}(P_R)\\)</p>
<p>4. \\(\\delta = \\min(\\delta_L, \\delta_R)\\)</p>
<p>5. 构建<strong>带状区域</strong> \\(S\\)：中位线两侧 \\(\\delta\\) 宽度内的点</p>
<p>6. 将 \\(S\\) 中的点按 \\(y\\) 坐标排序</p>
<p>7. 对 \\(S\\) 中每个点，检查其后面最多 7 个点的距离</p>
<p>8. 返回全局最小距离</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (Closest Pair in Strip)</div><div class="env-body">
<p>在带状区域 \\(S\\) 中，按 \\(y\\) 坐标排序后，每个点最多需要与其后 7 个点比较。因此带状区域的处理时间为 \\(O(n)\\)。</p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof Sketch</div><div class="env-body">
<p>考虑一个 \\(\\delta \\times 2\\delta\\) 的矩形（中位线两侧各 \\(\\delta\\)）。将其划分为 8 个 \\(\\delta/2 \\times \\delta/2\\) 的小方格。每个小方格内至多有 1 个点（否则两点距离 \\(< \\delta\\)，与定义矛盾）。因此矩形内最多有 8 个点，每个点最多检查 7 个候选点。</p>
<p class="qed">∎</p>
</div></div>

<div class="viz-placeholder" data-viz="ch04-viz-closest-pair"></div>

<div class="viz-placeholder" data-viz="ch04-viz-strip-analysis"></div>`,
            visualizations: [
                {
                    id: 'ch04-viz-closest-pair',
                    title: '最近点对分治演示',
                    description: '在二维平面上展示分治求解最近点对的过程',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var points = [];
                        var n = 20;

                        function generatePoints() {
                            points = [];
                            for (var i = 0; i < n; i++) {
                                points.push({
                                    x: Math.random() * 600 + 50,
                                    y: Math.random() * 300 + 50
                                });
                            }
                        }
                        generatePoints();

                        var showStrip = false;
                        var closestPairResult = null;

                        function dist(a, b) {
                            return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
                        }

                        function findClosest() {
                            var minD = Infinity;
                            var p1 = null, p2 = null;
                            for (var i = 0; i < points.length; i++) {
                                for (var j = i + 1; j < points.length; j++) {
                                    var d = dist(points[i], points[j]);
                                    if (d < minD) {
                                        minD = d;
                                        p1 = i;
                                        p2 = j;
                                    }
                                }
                            }
                            return {dist: minD, i: p1, j: p2};
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Closest Pair of Points', 350, 18, viz.colors.white, 15, 'center');

                            closestPairResult = findClosest();

                            // Sort by x for midline
                            var sorted = points.slice().sort(function(a, b) { return a.x - b.x; });
                            var midX = sorted[Math.floor(n / 2)].x;

                            // Draw midline
                            viz.ctx.strokeStyle = viz.colors.yellow;
                            viz.ctx.lineWidth = 1;
                            viz.ctx.setLineDash([5, 5]);
                            viz.ctx.beginPath();
                            viz.ctx.moveTo(midX, 30);
                            viz.ctx.lineTo(midX, 380);
                            viz.ctx.stroke();
                            viz.ctx.setLineDash([]);
                            viz.screenText('mid', midX, 390, viz.colors.yellow, 10, 'center');

                            // Draw strip
                            if (showStrip && closestPairResult) {
                                var delta = closestPairResult.dist;
                                viz.ctx.fillStyle = viz.colors.purple + '15';
                                viz.ctx.fillRect(midX - delta, 30, delta * 2, 350);
                                viz.ctx.strokeStyle = viz.colors.purple;
                                viz.ctx.lineWidth = 1;
                                viz.ctx.setLineDash([3, 3]);
                                viz.ctx.strokeRect(midX - delta, 30, delta * 2, 350);
                                viz.ctx.setLineDash([]);
                                viz.screenText('strip width = 2\u03B4', midX, 385, viz.colors.purple, 10, 'center');
                            }

                            // Draw all points
                            for (var i = 0; i < points.length; i++) {
                                var col = points[i].x < midX ? viz.colors.blue : viz.colors.teal;
                                if (closestPairResult && (i === closestPairResult.i || i === closestPairResult.j)) {
                                    col = viz.colors.red;
                                }
                                viz.ctx.fillStyle = col;
                                viz.ctx.beginPath();
                                viz.ctx.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2);
                                viz.ctx.fill();
                            }

                            // Draw closest pair line
                            if (closestPairResult) {
                                var pa = points[closestPairResult.i];
                                var pb = points[closestPairResult.j];
                                viz.ctx.strokeStyle = viz.colors.red;
                                viz.ctx.lineWidth = 2;
                                viz.ctx.beginPath();
                                viz.ctx.moveTo(pa.x, pa.y);
                                viz.ctx.lineTo(pb.x, pb.y);
                                viz.ctx.stroke();

                                viz.screenText('\u03B4 = ' + closestPairResult.dist.toFixed(2), 600, 380, viz.colors.red, 12, 'center');
                            }
                        }

                        draw();

                        VizEngine.createButton(controls, 'New Points', function() {
                            generatePoints();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Toggle Strip', function() {
                            showStrip = !showStrip;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'n', 6, 40, n, 1, function(v) {
                            n = Math.round(v);
                            generatePoints();
                            draw();
                        });

                        return viz;
                    }
                },
                {
                    id: 'ch04-viz-strip-analysis',
                    title: '带状区域分析',
                    description: '展示为什么每个点只需检查常数个邻居',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 350});
                        var delta = 100;

                        function draw() {
                            viz.clear();
                            viz.screenText('Strip Analysis: Why Only 7 Neighbors?', 350, 18, viz.colors.white, 15, 'center');

                            var midX = 350;
                            var topY = 50;
                            var rectW = delta * 2;
                            var rectH = delta * 2;
                            var rectX = midX - delta;
                            var rectY = topY;

                            // Draw the 2delta x delta rectangle
                            viz.ctx.strokeStyle = viz.colors.orange;
                            viz.ctx.lineWidth = 2;
                            viz.ctx.strokeRect(rectX, rectY, rectW, rectH);

                            // Draw midline
                            viz.ctx.strokeStyle = viz.colors.yellow;
                            viz.ctx.lineWidth = 1;
                            viz.ctx.setLineDash([4, 4]);
                            viz.ctx.beginPath();
                            viz.ctx.moveTo(midX, rectY);
                            viz.ctx.lineTo(midX, rectY + rectH);
                            viz.ctx.stroke();
                            viz.ctx.setLineDash([]);

                            // Draw 8 grid cells (delta/2 x delta/2)
                            var cellW = delta / 2;
                            var cellH = delta / 2;
                            viz.ctx.strokeStyle = viz.colors.axis;
                            viz.ctx.lineWidth = 0.5;
                            for (var r = 0; r < 4; r++) {
                                for (var c = 0; c < 4; c++) {
                                    var cx = rectX + c * cellW;
                                    var cy = rectY + r * cellH;
                                    viz.ctx.strokeRect(cx, cy, cellW, cellH);

                                    // Label each cell
                                    var cellLabel = String(r * 4 + c + 1);
                                    viz.screenText(cellLabel, cx + cellW / 2, cy + cellH / 2, viz.colors.text, 10, 'center');
                                }
                            }

                            // Labels
                            viz.screenText('\u03B4', midX, rectY - 8, viz.colors.orange, 12, 'center');
                            viz.screenText('\u03B4', rectX - 12, rectY + delta, viz.colors.orange, 12, 'center');
                            viz.screenText('2\u03B4', midX, rectY + rectH + 15, viz.colors.orange, 12, 'center');
                            viz.screenText('PL', midX - delta / 2, rectY - 8, viz.colors.blue, 12, 'center');
                            viz.screenText('PR', midX + delta / 2, rectY - 8, viz.colors.teal, 12, 'center');

                            // Explanation
                            var textY = rectY + rectH + 40;
                            viz.screenText('Each cell has size \u03B4/2 x \u03B4/2', 350, textY, viz.colors.text, 12, 'center');
                            viz.screenText('Diagonal of cell = \u03B4/\u221A2 < \u03B4, so at most 1 point per cell', 350, textY + 20, viz.colors.text, 12, 'center');
                            viz.screenText('16 cells total => at most 8 points in rectangle (excluding query point)', 350, textY + 40, viz.colors.text, 12, 'center');
                            viz.screenText('=> each point checks at most 7 neighbors!', 350, textY + 60, viz.colors.green, 13, 'center');
                        }

                        draw();

                        VizEngine.createSlider(controls, '\u03B4 size', 50, 120, delta, 5, function(v) {
                            delta = Math.round(v);
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '为什么最近点对算法的带状区域处理需要按 \\(y\\) 坐标排序？如果不排序，最坏情况复杂度是什么？',
                    hint: '如果不排序，每个点可能需要与带状区域中所有其他点比较。',
                    solution: '按 \\(y\\) 坐标排序保证了我们只需检查每个点后面的常数（7）个点。如果不排序，一个点可能需要与带状区域中所有点比较，带状区域最多有 \\(O(n)\\) 个点，使得合并步骤退化为 \\(O(n^2)\\)，总复杂度变为 \\(O(n^2)\\)。'
                },
                {
                    question: '最近点对算法的总时间复杂度递推为 \\(T(n) = 2T(n/2) + O(n \\log n)\\)（因为带状区域的排序）。如何优化到 \\(T(n) = 2T(n/2) + O(n)\\)？',
                    hint: '可以预排序，或者在递归返回时维护已排序的子数组。',
                    solution: '预先按 \\(y\\) 坐标排序一次。在递归中，合并时像归并排序一样 \\(O(n)\\) 合并两个已按 \\(y\\) 排好序的子集。这样每层只需 \\(O(n)\\)，递推变为 \\(T(n) = 2T(n/2) + O(n)\\)，总复杂度 \\(O(n \\log n)\\)。'
                },
                {
                    question: '将最近点对算法推广到三维空间。分析其时间复杂度。',
                    hint: '分割用超平面，带状区域变为板状区域。每个点需要检查多少个邻居？',
                    solution: '在三维中，按某个坐标（如 \\(x\\)）分割。带状区域变为宽 \\(2\\delta\\) 的板（slab）。在 \\(\\delta \\times \\delta \\times 2\\delta\\) 的长方体中划分为 \\(\\delta/2\\) 边长的小立方体，共约 \\(2 \\times 2 \\times 4 = 16\\) 个小立方体，每个至多一个点。因此每个点检查常数个邻居。递推仍为 \\(T(n) = 2T(n/2) + O(n \\log n)\\)（或 \\(O(n)\\) 若预排序），总复杂度 \\(O(n \\log^2 n)\\) 或 \\(O(n \\log n)\\)。'
                },
                {
                    question: '如果要找出距离最远的一对点，能否用类似的分治策略？',
                    hint: '最远点对一定在凸包上。',
                    solution: '最远点对不能直接用类似的分治策略（因为最远点对可能跨越任意分区）。但可以先用 \\(O(n \\log n)\\) 计算凸包，然后用旋转卡壳（Rotating Calipers）方法在 \\(O(n)\\) 时间内找到凸包上的最远点对。总复杂度 \\(O(n \\log n)\\)。'
                },
                {
                    question: '证明：最近点对问题的任何基于比较的算法都需要 \\(\\Omega(n \\log n)\\) 时间。',
                    hint: '从元素唯一性问题（Element Distinctness）归约。',
                    solution: '给定一维数组 \\(A[1..n]\\)，构造二维点集 \\(\\{(A[i], 0) : 1 \\leq i \\leq n\\}\\)。这些点的最近距离为 0 当且仅当数组中存在重复元素。元素唯一性的下界为 \\(\\Omega(n \\log n)\\)，因此最近点对问题的下界也是 \\(\\Omega(n \\log n)\\)。'
                }
            ]
        }
    ]
});
