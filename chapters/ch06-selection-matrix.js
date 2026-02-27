// Chapter 6: 选择与矩阵乘法 — Selection, Matrix Multiplication & FFT
window.CHAPTERS.push({
    id: 'ch06',
    number: 6,
    title: '选择与矩阵乘法',
    subtitle: 'Selection, Matrix Multiplication & FFT',
    sections: [
        // ── Section 1: Randomized Select ──
        {
            id: 'ch06-sec01',
            title: '随机化选择算法',
            content: `<h2>随机化选择算法</h2>
<p><strong>选择问题（Selection Problem）</strong>：给定一个无序数组 \\(A[1..n]\\) 和一个整数 \\(k\\)（\\(1 \\leq k \\leq n\\)），找出第 \\(k\\) 小的元素。</p>

<div class="env-block definition"><div class="env-title">Definition (Order Statistics)</div><div class="env-body">
<p>第 \\(k\\) 小的元素又称第 \\(k\\) <strong>顺序统计量</strong>（\\(k\\)-th order statistic）。特别地：</p>
<p>- \\(k = 1\\)：最小值</p>
<p>- \\(k = n\\)：最大值</p>
<p>- \\(k = \\lfloor (n+1)/2 \\rfloor\\)：中位数</p>
</div></div>

<p>朴素方法：先排序再取第 \\(k\\) 个，时间 \\(O(n \\log n)\\)。但我们可以做得更好。</p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Randomized Select / QuickSelect)</div><div class="env-body">
<p><strong>RandomizedSelect(A, lo, hi, k):</strong></p>
<p>1. 若 \\(lo = hi\\)，返回 \\(A[lo]\\)</p>
<p>2. \\(p = \\text{RandomizedPartition}(A, lo, hi)\\)</p>
<p>3. 令 \\(q = p - lo + 1\\)（pivot 在子数组中的秩）</p>
<p>4. 若 \\(k = q\\)：返回 \\(A[p]\\)</p>
<p>5. 若 \\(k < q\\)：返回 RandomizedSelect(A, lo, p-1, k)</p>
<p>6. 否则：返回 RandomizedSelect(A, p+1, hi, k-q)</p>
</div></div>

<div class="viz-placeholder" data-viz="ch06-viz-quickselect"></div>

<div class="env-block theorem"><div class="env-title">Theorem</div><div class="env-body">
<p>RandomizedSelect 的期望时间复杂度为 \\(O(n)\\)。最坏情况为 \\(O(n^2)\\)。</p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof Sketch</div><div class="env-body">
<p>设 \\(T(n)\\) 为期望运行时间。Partition 花费 \\(O(n)\\)，之后只递归一侧。若 pivot 的秩均匀随机分布在 \\([1, n]\\)，则：</p>
$$E[T(n)] \\leq \\frac{1}{n} \\sum_{q=1}^{n} T(\\max(q-1, n-q)) + O(n) \\leq \\frac{2}{n} \\sum_{k=n/2}^{n-1} T(k) + O(n)$$
<p>用代入法可证 \\(E[T(n)] = O(n)\\)。直觉：每次分区后平均缩小为原来的 3/4，\\(n + 3n/4 + 9n/16 + \\cdots = O(n)\\)（几何级数）。</p>
<p class="qed">∎</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch06-viz-quickselect',
                    title: 'QuickSelect 演示',
                    description: '交互式演示随机化选择过程',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var arr = [7, 3, 9, 1, 5, 8, 2, 6, 4];
                        var k = 5;
                        var steps = [];
                        var stepIdx = 0;

                        function recordSelect(a, lo, hi, target) {
                            steps = [];
                            var b = a.slice();
                            function sel(arr2, lo2, hi2, k2) {
                                if (lo2 === hi2) {
                                    steps.push({arr: arr2.slice(), lo: lo2, hi: hi2, pivot: -1, pivotIdx: lo2, k: k2, msg: 'Found: A[' + lo2 + '] = ' + arr2[lo2]});
                                    return;
                                }
                                var r = lo2 + Math.floor(Math.random() * (hi2 - lo2 + 1));
                                var tmp = arr2[r]; arr2[r] = arr2[hi2]; arr2[hi2] = tmp;
                                var pivot = arr2[hi2];
                                var i = lo2 - 1;
                                for (var j = lo2; j < hi2; j++) {
                                    if (arr2[j] <= pivot) {
                                        i++;
                                        var t = arr2[i]; arr2[i] = arr2[j]; arr2[j] = t;
                                    }
                                }
                                var t2 = arr2[i + 1]; arr2[i + 1] = arr2[hi2]; arr2[hi2] = t2;
                                var p = i + 1;
                                var q = p - lo2 + 1;
                                steps.push({arr: arr2.slice(), lo: lo2, hi: hi2, pivot: pivot, pivotIdx: p, k: k2, msg: 'Pivot=' + pivot + ' at pos ' + p + ', rank=' + q + ' in range, looking for k=' + k2});
                                if (k2 === q) {
                                    steps.push({arr: arr2.slice(), lo: lo2, hi: hi2, pivot: pivot, pivotIdx: p, k: k2, msg: 'Found! k=' + k2 + ', element = ' + pivot});
                                } else if (k2 < q) {
                                    sel(arr2, lo2, p - 1, k2);
                                } else {
                                    sel(arr2, p + 1, hi2, k2 - q);
                                }
                            }
                            sel(b, lo, hi, target);
                        }

                        recordSelect(arr, 0, arr.length - 1, k);

                        function draw() {
                            viz.clear();
                            var n = arr.length;
                            viz.screenText('QuickSelect: Find k-th smallest (k=' + k + ')', 350, 18, viz.colors.white, 15, 'center');

                            var step = stepIdx < steps.length ? steps[stepIdx] : steps[steps.length - 1];
                            var cellW = 55, cellH = 40;
                            var startX = (700 - n * cellW) / 2;

                            var colors = [];
                            var highlights = [];
                            for (var i = 0; i < n; i++) {
                                colors.push(viz.colors.bg);
                                highlights.push(null);
                                if (i >= step.lo && i <= step.hi) {
                                    colors[i] = '#1a2a3a';
                                } else {
                                    colors[i] = '#0a0a1a';
                                }
                            }
                            if (step.pivotIdx >= 0 && step.pivotIdx < n) highlights[step.pivotIdx] = viz.colors.orange;

                            viz.drawArray(step.arr, startX, 55, cellW, cellH, colors, highlights);

                            // Draw pointers for lo and hi
                            if (step.lo <= step.hi) {
                                viz.drawPointer(startX + step.lo * cellW + cellW / 2, 50, 'lo', viz.colors.green);
                                viz.drawPointer(startX + step.hi * cellW + cellW / 2, 50, 'hi', viz.colors.red);
                            }

                            viz.screenText(step.msg, 350, 130, viz.colors.yellow, 12, 'center');

                            // Bar chart
                            var barW = 40;
                            var maxH = 150;
                            var barStartX = (700 - n * (barW + 6)) / 2;
                            var barStartY = 340;
                            var maxVal = Math.max.apply(null, step.arr);
                            for (var bi = 0; bi < n; bi++) {
                                var h = (step.arr[bi] / maxVal) * maxH;
                                var px = barStartX + bi * (barW + 6);
                                var py = barStartY - h;
                                var barCol = viz.colors.blue;
                                if (bi < step.lo || bi > step.hi) barCol = viz.colors.axis;
                                if (bi === step.pivotIdx) barCol = viz.colors.orange;
                                viz.ctx.fillStyle = barCol;
                                viz.ctx.fillRect(px, py, barW, h);
                                viz.screenText(String(step.arr[bi]), px + barW / 2, py - 8, viz.colors.white, 10, 'center');
                            }

                            viz.screenText('Step ' + (stepIdx + 1) + '/' + steps.length, 350, 370, viz.colors.text, 11, 'center');
                            viz.screenText('Orange = pivot | Active range highlighted', 350, 390, viz.colors.text, 10, 'center');
                        }

                        draw();

                        VizEngine.createButton(controls, 'Prev', function() {
                            if (stepIdx > 0) { stepIdx--; draw(); }
                        });
                        VizEngine.createButton(controls, 'Next', function() {
                            if (stepIdx < steps.length - 1) { stepIdx++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            stepIdx = 0; draw();
                        });
                        VizEngine.createButton(controls, 'New Array', function() {
                            arr = [];
                            for (var i = 0; i < 9; i++) arr.push(Math.floor(Math.random() * 30) + 1);
                            recordSelect(arr, 0, arr.length - 1, k);
                            stepIdx = 0;
                            draw();
                        });
                        VizEngine.createSlider(controls, 'k', 1, arr.length, k, 1, function(v) {
                            k = Math.round(v);
                            recordSelect(arr, 0, arr.length - 1, k);
                            stepIdx = 0;
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '对数组 \\([12, 3, 5, 7, 19, 4, 26, 8]\\)，用 QuickSelect 找第 4 小的元素（假设第一次 pivot 选 8）。写出 Partition 后数组和下一步递归调用。',
                    hint: 'Partition 后 pivot 8 在 index 5。k=4 < 6，所以在左半边继续。',
                    solution: 'Partition with pivot=8: 小于等于 8 的有 3,5,7,4,8，大于的有 12,19,26。数组变为 [3,5,7,4,8,12,19,26]，pivot 在 index 4。秩 q=5。k=4 < 5，所以在 A[0..3]=[3,5,7,4] 中找第 4 小。继续在此子数组上执行 QuickSelect。答案为 7。'
                },
                {
                    question: 'QuickSelect 与 QuickSort 的区别是什么？为什么 QuickSelect 是 \\(O(n)\\) 而 QuickSort 是 \\(O(n \\log n)\\)？',
                    hint: 'QuickSelect 每次只递归一侧。',
                    solution: 'QuickSort 递归两侧子数组，总工作量每层为 \\(O(n)\\)，共 \\(O(\\log n)\\) 层。QuickSelect 只递归一侧，工作量为 \\(n + n/2 + n/4 + \\cdots = O(n)\\)（几何级数收敛到 \\(2n\\)）。关键区别在于 QuickSelect 丢弃了不包含目标的那一半。'
                },
                {
                    question: '如何用 QuickSelect 在 \\(O(n)\\) 时间内找到数组的中位数，然后用它将数组分为两半？',
                    hint: 'QuickSelect 找中位数后，数组已经被部分分区。',
                    solution: '调用 QuickSelect(A, 0, n-1, n/2) 找到中位数 m。执行完后，A 的前 n/2 个元素都 <= m，后 n/2 个元素都 >= m（虽然各半未排序）。这就已经将数组分为了两半。总时间 O(n)。'
                }
            ]
        },

        // ── Section 2: Median of Medians ──
        {
            id: 'ch06-sec02',
            title: '中位数的中位数算法',
            content: `<h2>中位数的中位数算法</h2>
<p>随机化选择算法虽然期望时间 \\(O(n)\\)，但最坏情况是 \\(O(n^2)\\)。<strong>中位数的中位数</strong>（Median of Medians, MoM）算法保证了 \\(O(n)\\) 的最坏情况时间。</p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Median of Medians / BFPRT)</div><div class="env-body">
<p><strong>DeterministicSelect(A, k):</strong></p>
<p>1. 将 \\(A\\) 分成 \\(\\lceil n/5 \\rceil\\) 组，每组 5 个元素（最后一组可能不满）</p>
<p>2. 对每组排序，找出中位数，得到中位数数组 \\(M\\)</p>
<p>3. 递归调用 DeterministicSelect(\\(M\\), \\(|M|/2\\)) 找到 \\(M\\) 的中位数 \\(x\\)</p>
<p>4. 以 \\(x\\) 为 pivot 对 \\(A\\) 分区</p>
<p>5. 根据 \\(k\\) 与 \\(x\\) 的秩的关系，递归到相应的子数组</p>
</div></div>

<div class="viz-placeholder" data-viz="ch06-viz-mom"></div>

<div class="env-block theorem"><div class="env-title">Theorem (BFPRT, 1973)</div><div class="env-body">
<p>Median of Medians 算法保证了至少有 \\(3n/10 - 6\\) 个元素比 pivot 小，至少有 \\(3n/10 - 6\\) 个元素比 pivot 大。因此分区后较大一侧最多有 \\(7n/10 + 6\\) 个元素。</p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p>\\(n/5\\) 组中，至少有一半的组的中位数 \\(\\leq x\\)（因为 \\(x\\) 是中位数的中位数），即至少 \\(\\lceil n/10 \\rceil\\) 组。这些组中每组至少有 3 个元素 \\(\\leq x\\)（中位数及其下方两个）。</p>
<p>因此至少有 \\(3 \\lceil n/10 \\rceil \\geq 3n/10 - 6\\) 个元素 \\(\\leq x\\)。对称地，至少 \\(3n/10 - 6\\) 个元素 \\(\\geq x\\)。</p>
<p>递推关系：\\(T(n) \\leq T(n/5) + T(7n/10) + O(n)\\)。由于 \\(1/5 + 7/10 = 9/10 < 1\\)，用代入法可证 \\(T(n) = O(n)\\)。</p>
<p class="qed">∎</p>
</div></div>

<div class="env-block warning"><div class="env-title">Warning</div><div class="env-body">
<p>为什么分 5 组而不是 3 组？如果分 3 组：\\(T(n) \\leq T(n/3) + T(2n/3) + O(n)\\)，此时 \\(1/3 + 2/3 = 1\\)，递推解为 \\(O(n \\log n)\\)，不是线性的！分 7、9 等组也可以，但 5 是使算法线性的最小组大小。</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch06-viz-mom',
                    title: '中位数的中位数可视化',
                    description: '展示分组、求中位数、选取中位数的中位数的过程',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var arr = [12, 3, 18, 7, 22, 5, 15, 9, 1, 25, 11, 4, 20, 8, 16, 6, 23, 14, 2, 19];
                        var groupSize = 5;

                        function draw() {
                            viz.clear();
                            var n = arr.length;
                            viz.screenText('Median of Medians (groups of ' + groupSize + ')', 350, 18, viz.colors.white, 15, 'center');

                            var numGroups = Math.ceil(n / groupSize);
                            var cellW = 30, cellH = 28;
                            var groupGap = 15;
                            var totalW = numGroups * (groupSize * cellW + groupGap) - groupGap;
                            var startX = Math.max(10, (700 - totalW) / 2);

                            // Step 1: Show groups
                            viz.screenText('Step 1: Divide into groups of ' + groupSize, 350, 42, viz.colors.orange, 12, 'center');

                            var medians = [];
                            for (var g = 0; g < numGroups; g++) {
                                var groupStart = g * groupSize;
                                var groupEnd = Math.min(groupStart + groupSize, n);
                                var group = arr.slice(groupStart, groupEnd);
                                var sorted = group.slice().sort(function(a, b) { return a - b; });
                                var medIdx = Math.floor((sorted.length - 1) / 2);
                                var med = sorted[medIdx];
                                medians.push(med);

                                var gx = startX + g * (groupSize * cellW + groupGap);
                                // Draw group box
                                viz.ctx.strokeStyle = viz.colors.axis;
                                viz.ctx.lineWidth = 1;
                                viz.ctx.strokeRect(gx - 2, 55, group.length * cellW + 4, cellH + 4);
                                viz.screenText('G' + (g + 1), gx + group.length * cellW / 2, 53, viz.colors.text, 9, 'center', 'bottom');

                                for (var i = 0; i < group.length; i++) {
                                    var col = group[i] === med ? viz.colors.orange : viz.colors.bg;
                                    viz.drawArrayCell(gx + i * cellW, 57, cellW, cellH, group[i], col, viz.colors.white);
                                }

                                // Show sorted group below
                                for (var j = 0; j < sorted.length; j++) {
                                    var col2 = j === medIdx ? viz.colors.orange : '#1a1a40';
                                    viz.drawArrayCell(gx + j * cellW, 105, cellW, cellH, sorted[j], col2, viz.colors.white);
                                }
                            }

                            viz.screenText('Step 2: Sort each group, find medians (orange)', 350, 98, viz.colors.teal, 12, 'center');

                            // Step 3: Show medians array
                            viz.screenText('Step 3: Medians array:', 100, 160, viz.colors.yellow, 12, 'left');
                            var medStartX = (700 - medians.length * 40) / 2;
                            var sortedMedians = medians.slice().sort(function(a, b) { return a - b; });
                            var momIdx = Math.floor((sortedMedians.length - 1) / 2);
                            var mom = sortedMedians[momIdx];

                            for (var mi = 0; mi < medians.length; mi++) {
                                var mCol = medians[mi] === mom ? viz.colors.red : viz.colors.orange + '88';
                                viz.drawArrayCell(medStartX + mi * 40, 175, 40, cellH, medians[mi], mCol, viz.colors.white);
                            }

                            viz.screenText('Step 4: Median of medians (MoM) = ' + mom, 350, 225, viz.colors.red, 13, 'center');

                            // Show partition result
                            var less = [], equal = [], greater = [];
                            for (var pi = 0; pi < n; pi++) {
                                if (arr[pi] < mom) less.push(arr[pi]);
                                else if (arr[pi] === mom) equal.push(arr[pi]);
                                else greater.push(arr[pi]);
                            }

                            var secY = 260;
                            viz.screenText('Step 5: Partition around MoM = ' + mom, 350, secY, viz.colors.green, 12, 'center');
                            secY += 20;

                            // Less
                            viz.screenText('< ' + mom + ' (' + less.length + '):', 20, secY + 14, viz.colors.blue, 11, 'left');
                            for (var li = 0; li < less.length; li++) {
                                viz.drawArrayCell(120 + li * 32, secY, 32, 28, less[li], viz.colors.blue + '44', viz.colors.white);
                            }

                            secY += 35;
                            viz.screenText('= ' + mom + ' (' + equal.length + '):', 20, secY + 14, viz.colors.red, 11, 'left');
                            for (var ei = 0; ei < equal.length; ei++) {
                                viz.drawArrayCell(120 + ei * 32, secY, 32, 28, equal[ei], viz.colors.red + '44', viz.colors.white);
                            }

                            secY += 35;
                            viz.screenText('> ' + mom + ' (' + greater.length + '):', 20, secY + 14, viz.colors.purple, 11, 'left');
                            for (var gi = 0; gi < greater.length; gi++) {
                                viz.drawArrayCell(120 + gi * 32, secY, 32, 28, greater[gi], viz.colors.purple + '44', viz.colors.white);
                            }

                            secY += 40;
                            viz.screenText('Guarantee: each side has at most 7n/10 + 6 = ' + Math.ceil(7 * n / 10 + 6) + ' elements', 350, secY, viz.colors.green, 11, 'center');
                        }

                        draw();

                        VizEngine.createButton(controls, 'New Array', function() {
                            arr = [];
                            for (var i = 0; i < 20; i++) arr.push(Math.floor(Math.random() * 50) + 1);
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '对数组 \\([10, 3, 7, 15, 1, 8, 12, 4, 9, 6]\\)，用 Median of Medians 找出 pivot。分组大小为 5。',
                    hint: '第一组 [10,3,7,15,1]，第二组 [8,12,4,9,6]。',
                    solution: '第一组排序 [1,3,7,10,15]，中位数 = 7。第二组排序 [4,6,8,9,12]，中位数 = 8。中位数数组 [7,8]，其中位数 = 7。所以 MoM pivot = 7。分区后 < 7: [3,1,4,6]，= 7: [7]，> 7: [10,15,8,12,9]。'
                },
                {
                    question: '为什么 Median of Medians 分组大小为 3 不行但分组大小为 5 可以？精确推导递推关系。',
                    hint: '分 3 组时，保证淘汰的比例是多少？',
                    solution: '分 3 组时：至少有 \\(\\lceil n/6 \\rceil\\) 组的中位数 \\(\\leq x\\)，每组 2 个元素 \\(\\leq x\\)。淘汰 \\(2n/6 = n/3\\)，剩余 \\(2n/3\\)。递推 \\(T(n) = T(n/3) + T(2n/3) + O(n)\\)。解为 \\(O(n \\log n)\\)，不是线性。分 5 组时：淘汰 \\(3n/10\\)，剩余 \\(7n/10\\)。递推 \\(T(n) = T(n/5) + T(7n/10) + O(n)\\)。因 \\(1/5 + 7/10 = 9/10 < 1\\)，解为 \\(O(n)\\)。'
                },
                {
                    question: '虽然 Median of Medians 是 \\(O(n)\\)，但实际中为什么常用随机化选择而非 MoM？',
                    hint: '比较两者的常数因子。',
                    solution: 'MoM 虽然最坏 \\(O(n)\\)，但常数因子很大（约 \\(5n\\) 以上的比较次数）。随机化选择的期望比较次数约 \\(3.39n\\)，且实现简单。MoM 需要分组、排序组、递归找中位数的中位数，开销大。实际中随机化选择几乎总是更快，且 \\(O(n^2)\\) 最坏情况的概率极小。MoM 主要在理论上重要——它证明了线性时间选择是可能的。'
                }
            ]
        },

        // ── Section 3: Strassen's Algorithm ──
        {
            id: 'ch06-sec03',
            title: 'Strassen 矩阵乘法',
            content: `<h2>Strassen 矩阵乘法</h2>
<p>两个 \\(n \\times n\\) 矩阵的标准乘法需要 \\(O(n^3)\\) 的运算量。<strong>Strassen 算法</strong>（1969）通过减少递归乘法的次数，将复杂度降至 \\(O(n^{\\log_2 7}) \\approx O(n^{2.807})\\)。</p>

<h3>标准矩阵乘法</h3>
<p>将 \\(n \\times n\\) 矩阵分为四个 \\(n/2 \\times n/2\\) 的子矩阵：</p>
$$\\begin{pmatrix} A_{11} & A_{12} \\\\ A_{21} & A_{22} \\end{pmatrix} \\cdot \\begin{pmatrix} B_{11} & B_{12} \\\\ B_{21} & B_{22} \\end{pmatrix} = \\begin{pmatrix} C_{11} & C_{12} \\\\ C_{21} & C_{22} \\end{pmatrix}$$
<p>标准方法需要 <strong>8 次</strong>子矩阵乘法：\\(T(n) = 8T(n/2) + O(n^2) = O(n^3)\\)。</p>

<h3>Strassen 的关键思想</h3>
<p>Strassen 发现只需 <strong>7 次</strong>乘法（代价是更多加减法）：</p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Strassen)</div><div class="env-body">
<p>定义 7 个乘积：</p>
<p>\\(M_1 = (A_{11} + A_{22})(B_{11} + B_{22})\\)</p>
<p>\\(M_2 = (A_{21} + A_{22})B_{11}\\)</p>
<p>\\(M_3 = A_{11}(B_{12} - B_{22})\\)</p>
<p>\\(M_4 = A_{22}(B_{21} - B_{11})\\)</p>
<p>\\(M_5 = (A_{11} + A_{12})B_{22}\\)</p>
<p>\\(M_6 = (A_{21} - A_{11})(B_{11} + B_{12})\\)</p>
<p>\\(M_7 = (A_{12} - A_{22})(B_{21} + B_{22})\\)</p>
<p>则：</p>
<p>\\(C_{11} = M_1 + M_4 - M_5 + M_7\\)</p>
<p>\\(C_{12} = M_3 + M_5\\)</p>
<p>\\(C_{21} = M_2 + M_4\\)</p>
<p>\\(C_{22} = M_1 - M_2 + M_3 + M_6\\)</p>
</div></div>

<div class="viz-placeholder" data-viz="ch06-viz-strassen"></div>

<div class="env-block theorem"><div class="env-title">Theorem</div><div class="env-body">
<p>Strassen 算法的时间复杂度为 \\(T(n) = 7T(n/2) + O(n^2) = O(n^{\\log_2 7}) \\approx O(n^{2.807})\\)。</p>
</div></div>

<div class="env-block intuition"><div class="env-title">Intuition</div><div class="env-body">
<p>用加法换乘法。矩阵加法是 \\(O(n^2)\\)，在递推关系中是低阶项。将 8 次乘法减为 7 次，虽然只少了 1 次，但在递归展开后效果显著：\\(8^{\\log_2 n} = n^3\\) 变为 \\(7^{\\log_2 n} = n^{\\log_2 7} \\approx n^{2.807}\\)。</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch06-viz-strassen',
                    title: 'Strassen 矩阵分块可视化',
                    description: '展示矩阵的分块和 7 次乘法的构造',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var showFormula = 0;

                        function draw() {
                            viz.clear();
                            viz.screenText('Strassen Matrix Multiplication', 350, 18, viz.colors.white, 15, 'center');

                            var matS = 80;
                            var cellS = matS / 2;

                            // Matrix A
                            var ax = 50, ay = 60;
                            viz.screenText('A', ax + matS / 2, ay - 10, viz.colors.blue, 14, 'center');
                            var aColors = [
                                [viz.colors.blue + '33', viz.colors.teal + '33'],
                                [viz.colors.orange + '33', viz.colors.purple + '33']
                            ];
                            var aLabels = [['A11', 'A12'], ['A21', 'A22']];
                            for (var r = 0; r < 2; r++) {
                                for (var c = 0; c < 2; c++) {
                                    viz.drawArrayCell(ax + c * cellS, ay + r * cellS, cellS, cellS, aLabels[r][c], aColors[r][c], viz.colors.white);
                                }
                            }

                            // Times sign
                            viz.screenText('\u00D7', ax + matS + 20, ay + matS / 2, viz.colors.white, 20, 'center');

                            // Matrix B
                            var bx = ax + matS + 45, by = ay;
                            viz.screenText('B', bx + matS / 2, by - 10, viz.colors.green, 14, 'center');
                            var bColors = [
                                [viz.colors.green + '33', viz.colors.yellow + '33'],
                                [viz.colors.red + '33', viz.colors.pink + '33']
                            ];
                            var bLabels = [['B11', 'B12'], ['B21', 'B22']];
                            for (var r2 = 0; r2 < 2; r2++) {
                                for (var c2 = 0; c2 < 2; c2++) {
                                    viz.drawArrayCell(bx + c2 * cellS, by + r2 * cellS, cellS, cellS, bLabels[r2][c2], bColors[r2][c2], viz.colors.white);
                                }
                            }

                            // Equals sign
                            viz.screenText('=', bx + matS + 20, ay + matS / 2, viz.colors.white, 20, 'center');

                            // Matrix C
                            var cx = bx + matS + 40, cy = ay;
                            viz.screenText('C', cx + matS / 2, cy - 10, viz.colors.orange, 14, 'center');
                            var cLabels = [['C11', 'C12'], ['C21', 'C22']];
                            for (var r3 = 0; r3 < 2; r3++) {
                                for (var c3 = 0; c3 < 2; c3++) {
                                    viz.drawArrayCell(cx + c3 * cellS, cy + r3 * cellS, cellS, cellS, cLabels[r3][c3], viz.colors.orange + '33', viz.colors.white);
                                }
                            }

                            // Show 7 multiplications
                            var formulas = [
                                {label: 'M1', formula: '(A11+A22)(B11+B22)', color: viz.colors.blue},
                                {label: 'M2', formula: '(A21+A22)(B11)', color: viz.colors.teal},
                                {label: 'M3', formula: '(A11)(B12-B22)', color: viz.colors.green},
                                {label: 'M4', formula: '(A22)(B21-B11)', color: viz.colors.orange},
                                {label: 'M5', formula: '(A11+A12)(B22)', color: viz.colors.purple},
                                {label: 'M6', formula: '(A21-A11)(B11+B12)', color: viz.colors.red},
                                {label: 'M7', formula: '(A12-A22)(B21+B22)', color: viz.colors.yellow}
                            ];

                            viz.screenText('7 Multiplications (instead of 8):', 350, 170, viz.colors.white, 13, 'center');

                            var col1X = 60, col2X = 380;
                            for (var fi = 0; fi < formulas.length; fi++) {
                                var fx = fi < 4 ? col1X : col2X;
                                var fy = 195 + (fi % 4) * 22;
                                viz.screenText(formulas[fi].label + ' = ' + formulas[fi].formula, fx, fy, formulas[fi].color, 12, 'left');
                            }

                            // Result formulas
                            var resY = 295;
                            viz.screenText('Result:', 60, resY, viz.colors.white, 13, 'left');
                            var results = [
                                'C11 = M1 + M4 - M5 + M7',
                                'C12 = M3 + M5',
                                'C21 = M2 + M4',
                                'C22 = M1 - M2 + M3 + M6'
                            ];
                            for (var ri = 0; ri < results.length; ri++) {
                                viz.screenText(results[ri], 60 + (ri % 2) * 330, resY + 22 + Math.floor(ri / 2) * 22, viz.colors.yellow, 12, 'left');
                            }

                            // Complexity comparison
                            viz.screenText('Standard: 8 multiplications => T(n) = 8T(n/2) + O(n^2) = O(n^3)', 350, 370, viz.colors.red, 12, 'center');
                            viz.screenText('Strassen: 7 multiplications => T(n) = 7T(n/2) + O(n^2) = O(n^2.807)', 350, 392, viz.colors.green, 12, 'center');
                        }

                        draw();

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '验证 Strassen 公式 \\(C_{11} = M_1 + M_4 - M_5 + M_7\\) 确实等于 \\(A_{11}B_{11} + A_{12}B_{21}\\)。',
                    hint: '展开 \\(M_1, M_4, M_5, M_7\\) 的定义并简化。',
                    solution: '\\(M_1 = A_{11}B_{11} + A_{11}B_{22} + A_{22}B_{11} + A_{22}B_{22}\\)。\\(M_4 = A_{22}B_{21} - A_{22}B_{11}\\)。\\(M_5 = A_{11}B_{22} + A_{12}B_{22}\\)。\\(M_7 = A_{12}B_{21} + A_{12}B_{22} - A_{22}B_{21} - A_{22}B_{22}\\)。求和：\\(M_1 + M_4 - M_5 + M_7 = A_{11}B_{11} + A_{11}B_{22} + A_{22}B_{11} + A_{22}B_{22} + A_{22}B_{21} - A_{22}B_{11} - A_{11}B_{22} - A_{12}B_{22} + A_{12}B_{21} + A_{12}B_{22} - A_{22}B_{21} - A_{22}B_{22} = A_{11}B_{11} + A_{12}B_{21}\\)。正确！'
                },
                {
                    question: '如果有人发现只需 6 次子矩阵乘法就能完成 \\(2 \\times 2\\) 矩阵乘法，其递归算法的复杂度是什么？',
                    hint: '\\(T(n) = 6T(n/2) + O(n^2)\\)。',
                    solution: '\\(T(n) = 6T(n/2) + O(n^2)\\)。\\(\\log_2 6 \\approx 2.585\\)。由主定理 Case 1（\\(n^{\\log_2 6} \\gg n^2\\)），\\(T(n) = O(n^{\\log_2 6}) \\approx O(n^{2.585})\\)。'
                },
                {
                    question: '当前已知最好的矩阵乘法复杂度是什么？Strassen 的意义何在？',
                    hint: '查找 \\(\\omega\\)（矩阵乘法指数）的最新结果。',
                    solution: '当前最好的理论结果约为 \\(O(n^{2.371552})\\)（Williams 等人 2024）。Strassen 的历史意义在于它首次证明了矩阵乘法可以突破 \\(O(n^3)\\) 的"自然"屏障，开启了快速矩阵乘法的研究领域。实际中，由于巨大的常数因子，\\(\\omega < 2.373\\) 的算法只在天文数字级别的 \\(n\\) 才优于 Strassen。Strassen 本身在 \\(n > 100\\) 左右就开始优于标准算法。'
                },
                {
                    question: 'Strassen 算法在实际中有什么局限性？为什么不总是使用它？',
                    hint: '考虑数值稳定性、缓存、和小矩阵。',
                    solution: '(1) 数值稳定性差：大量加减法引入浮点误差累积。(2) 缓存不友好：大量临时矩阵破坏局部性。(3) 小矩阵时常数因子大，不如标准算法。(4) 只适用于方阵（非方阵需要填充）。(5) 18 次加法 vs 标准的 4 次。实际中通常在 \\(n > 100{\\sim}1000\\) 时使用 Strassen，更小的矩阵用标准或优化的 BLAS 算法。'
                }
            ]
        },

        // ── Section 4: FFT Introduction ──
        {
            id: 'ch06-sec04',
            title: '快速傅里叶变换',
            content: `<h2>快速傅里叶变换 (FFT)</h2>
<p><strong>快速傅里叶变换</strong>（Fast Fourier Transform, FFT）是分治法最深刻的应用之一。它将<strong>离散傅里叶变换</strong>（DFT）的计算从 \\(O(n^2)\\) 加速到 \\(O(n \\log n)\\)。</p>

<div class="env-block definition"><div class="env-title">Definition (DFT)</div><div class="env-body">
<p>给定序列 \\(a = (a_0, a_1, \\ldots, a_{n-1})\\)（\\(n\\) 为 2 的幂），其 DFT 为 \\(\\hat{a} = (\\hat{a}_0, \\hat{a}_1, \\ldots, \\hat{a}_{n-1})\\)：</p>
$$\\hat{a}_k = \\sum_{j=0}^{n-1} a_j \\omega_n^{jk}, \\quad k = 0, 1, \\ldots, n-1$$
<p>其中 \\(\\omega_n = e^{2\\pi i/n}\\) 是 \\(n\\) 次单位根。</p>
</div></div>

<p>FFT 的核心思想是<strong>分治</strong>：将 DFT 按奇偶下标分为两个 \\(n/2\\) 大小的子问题。</p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Cooley-Tukey FFT)</div><div class="env-body">
<p><strong>FFT(a, n):</strong></p>
<p>1. 若 \\(n = 1\\)，返回 \\(a\\)</p>
<p>2. \\(a_{\\text{even}} = (a_0, a_2, \\ldots, a_{n-2})\\)</p>
<p>3. \\(a_{\\text{odd}} = (a_1, a_3, \\ldots, a_{n-1})\\)</p>
<p>4. \\(\\hat{y}_{\\text{even}} = \\text{FFT}(a_{\\text{even}}, n/2)\\)</p>
<p>5. \\(\\hat{y}_{\\text{odd}} = \\text{FFT}(a_{\\text{odd}}, n/2)\\)</p>
<p>6. For \\(k = 0\\) to \\(n/2 - 1\\)：</p>
<p>&emsp; \\(\\hat{a}_k = \\hat{y}_{\\text{even},k} + \\omega_n^k \\hat{y}_{\\text{odd},k}\\)</p>
<p>&emsp; \\(\\hat{a}_{k+n/2} = \\hat{y}_{\\text{even},k} - \\omega_n^k \\hat{y}_{\\text{odd},k}\\)</p>
</div></div>

<div class="viz-placeholder" data-viz="ch06-viz-butterfly"></div>

<div class="env-block theorem"><div class="env-title">Theorem</div><div class="env-body">
<p>FFT 计算 DFT 的时间复杂度为 \\(O(n \\log n)\\)。</p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p>递推 \\(T(n) = 2T(n/2) + O(n)\\)，由主定理 \\(T(n) = O(n \\log n)\\)。</p>
<p>步骤 6 的正确性来源于<strong>蝶形运算</strong>（butterfly operation）：利用 \\(\\omega_n^{k+n/2} = -\\omega_n^k\\) 的性质，一次乘法和两次加减法同时算出两个输出。</p>
<p class="qed">∎</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch06-viz-butterfly',
                    title: 'FFT 蝶形图',
                    description: '展示 FFT 的蝶形运算结构',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var nBits = 3; // n = 8

                        function bitReverse(x, bits) {
                            var result = 0;
                            for (var i = 0; i < bits; i++) {
                                result = (result << 1) | (x & 1);
                                x >>= 1;
                            }
                            return result;
                        }

                        function draw() {
                            viz.clear();
                            var n = Math.pow(2, nBits);
                            var stages = nBits;

                            viz.screenText('FFT Butterfly Diagram (n=' + n + ')', 350, 18, viz.colors.white, 15, 'center');

                            var gapX = 600 / (stages + 1);
                            var gapY = 340 / n;
                            var startX = 70;
                            var startY = 55;

                            // Bit-reversal permutation
                            var order = [];
                            for (var i = 0; i < n; i++) order.push(bitReverse(i, nBits));

                            // Input labels (bit-reversed order)
                            for (var i2 = 0; i2 < n; i2++) {
                                var y = startY + i2 * gapY;
                                viz.screenText('a[' + order[i2] + ']', startX - 35, y, viz.colors.text, 11, 'right');
                                viz.ctx.fillStyle = viz.colors.blue;
                                viz.ctx.beginPath();
                                viz.ctx.arc(startX, y, 4, 0, Math.PI * 2);
                                viz.ctx.fill();
                            }

                            // Draw stages
                            for (var s = 0; s < stages; s++) {
                                var x1 = startX + s * gapX;
                                var x2 = startX + (s + 1) * gapX;
                                var blockSize = Math.pow(2, s + 1);
                                var halfBlock = blockSize / 2;

                                viz.screenText('Stage ' + (s + 1), (x1 + x2) / 2, startY - 15, viz.colors.orange, 11, 'center');

                                for (var b = 0; b < n; b += blockSize) {
                                    for (var k = 0; k < halfBlock; k++) {
                                        var topIdx = b + k;
                                        var botIdx = b + k + halfBlock;
                                        var y1 = startY + topIdx * gapY;
                                        var y2 = startY + botIdx * gapY;

                                        // Lines from input to output
                                        // Top: gets both inputs
                                        viz.ctx.strokeStyle = viz.colors.blue;
                                        viz.ctx.lineWidth = 1;
                                        viz.ctx.beginPath();
                                        viz.ctx.moveTo(x1, y1);
                                        viz.ctx.lineTo(x2, y1);
                                        viz.ctx.stroke();

                                        viz.ctx.strokeStyle = viz.colors.teal;
                                        viz.ctx.beginPath();
                                        viz.ctx.moveTo(x1, y2);
                                        viz.ctx.lineTo(x2, y1);
                                        viz.ctx.stroke();

                                        // Bottom: gets both inputs with -
                                        viz.ctx.strokeStyle = viz.colors.blue;
                                        viz.ctx.beginPath();
                                        viz.ctx.moveTo(x1, y1);
                                        viz.ctx.lineTo(x2, y2);
                                        viz.ctx.stroke();

                                        viz.ctx.strokeStyle = viz.colors.red;
                                        viz.ctx.beginPath();
                                        viz.ctx.moveTo(x1, y2);
                                        viz.ctx.lineTo(x2, y2);
                                        viz.ctx.stroke();

                                        // Nodes at output
                                        viz.ctx.fillStyle = viz.colors.blue;
                                        viz.ctx.beginPath();
                                        viz.ctx.arc(x2, y1, 4, 0, Math.PI * 2);
                                        viz.ctx.fill();
                                        viz.ctx.fillStyle = viz.colors.blue;
                                        viz.ctx.beginPath();
                                        viz.ctx.arc(x2, y2, 4, 0, Math.PI * 2);
                                        viz.ctx.fill();

                                        // Twiddle factor label
                                        if (k > 0 || halfBlock > 1) {
                                            var tw = k + '/' + blockSize;
                                            viz.screenText('\u03C9^' + tw, (x1 + x2) / 2, (y1 + y2) / 2, viz.colors.yellow, 8, 'center');
                                        }
                                    }
                                }
                            }

                            // Output labels
                            var outX = startX + stages * gapX;
                            for (var o = 0; o < n; o++) {
                                var oy = startY + o * gapY;
                                viz.screenText('A[' + o + ']', outX + 25, oy, viz.colors.green, 11, 'left');
                            }

                            viz.screenText('Blue = +, Red/Teal = \u00B1 with twiddle factor \u03C9^k', 350, startY + n * gapY + 15, viz.colors.text, 11, 'center');
                            viz.screenText('Each stage: n/2 butterfly operations => O(n) per stage, O(n log n) total', 350, startY + n * gapY + 35, viz.colors.yellow, 11, 'center');
                        }

                        draw();

                        VizEngine.createSelect(controls, 'Size', [
                            {value: '2', label: 'n = 4'},
                            {value: '3', label: 'n = 8'},
                            {value: '4', label: 'n = 16'}
                        ], function(v) {
                            nBits = parseInt(v);
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '对 \\(n = 4\\)，写出 DFT 矩阵 \\(F_4\\)（即 \\(\\hat{a} = F_4 \\cdot a\\) 中的 \\(F_4\\)）。',
                    hint: '\\(F_4[j][k] = \\omega_4^{jk}\\)，其中 \\(\\omega_4 = e^{2\\pi i / 4} = i\\)。',
                    solution: '\\(\\omega_4 = i\\)。\\(F_4 = \\begin{pmatrix} 1 & 1 & 1 & 1 \\\\ 1 & i & -1 & -i \\\\ 1 & -1 & 1 & -1 \\\\ 1 & -i & -1 & i \\end{pmatrix}\\)。直接矩阵乘法需要 16 次乘法，而 FFT 只需 4 次（加上加减法）。'
                },
                {
                    question: '为什么 FFT 要求 \\(n\\) 是 2 的幂？如果 \\(n\\) 不是 2 的幂怎么办？',
                    hint: '考虑零填充（zero-padding）。',
                    solution: '因为 FFT 的分治依赖于将序列等分为奇偶两部分，要求 \\(n\\) 是 2 的幂。如果 \\(n\\) 不是 2 的幂，可以零填充到最近的 2 的幂（不影响结果的本质信息），或者使用 Bluestein 算法（chirp-z 变换）处理任意 \\(n\\)。混合基 FFT 可以处理 \\(n = 2^a \\cdot 3^b \\cdot 5^c \\cdots\\) 的情况。'
                },
                {
                    question: 'FFT 的逆变换（IFFT）与 FFT 有什么关系？',
                    hint: '观察 DFT 矩阵 \\(F_n\\) 的逆。',
                    solution: 'IFFT 的公式为 \\(a_j = \\frac{1}{n} \\sum_{k=0}^{n-1} \\hat{a}_k \\omega_n^{-jk}\\)。这与 FFT 几乎相同，只是将 \\(\\omega_n\\) 替换为 \\(\\omega_n^{-1}\\)（即取共轭），最后除以 \\(n\\)。因此 IFFT 可以复用 FFT 的代码，只需修改旋转因子的方向并在最后乘以 \\(1/n\\)。'
                }
            ]
        },

        // ── Section 5: Polynomial Multiplication ──
        {
            id: 'ch06-sec05',
            title: '多项式乘法',
            content: `<h2>多项式乘法</h2>
<p>FFT 的一个最重要的应用是<strong>快速多项式乘法</strong>，将两个 \\(n\\) 次多项式的乘法从 \\(O(n^2)\\) 加速到 \\(O(n \\log n)\\)。</p>

<div class="env-block definition"><div class="env-title">Definition (Polynomial Multiplication)</div><div class="env-body">
<p>给定多项式 \\(A(x) = \\sum_{i=0}^{n-1} a_i x^i\\) 和 \\(B(x) = \\sum_{j=0}^{n-1} b_j x^j\\)，它们的乘积：</p>
$$C(x) = A(x) \\cdot B(x) = \\sum_{k=0}^{2n-2} c_k x^k, \\quad c_k = \\sum_{i+j=k} a_i b_j$$
<p>系数 \\(c_k\\) 就是 \\(a\\) 和 \\(b\\) 的<strong>卷积</strong>（convolution）。</p>
</div></div>

<p>朴素计算卷积需要 \\(O(n^2)\\) 次乘法。FFT 的方法基于一个关键观察：</p>

<div class="env-block theorem"><div class="env-title">Theorem (Convolution Theorem)</div><div class="env-body">
<p>卷积在频域中变为逐点乘法：\\(\\widehat{a * b} = \\hat{a} \\cdot \\hat{b}\\)。</p>
</div></div>

<div class="env-block algorithm"><div class="env-title">Algorithm (FFT-based Polynomial Multiplication)</div><div class="env-body">
<p>1. 将 \\(a\\) 和 \\(b\\) 零填充到长度 \\(2n\\)（补零到 2 的幂）</p>
<p>2. \\(\\hat{a} = \\text{FFT}(a)\\)，\\(\\hat{b} = \\text{FFT}(b)\\)</p>
<p>3. \\(\\hat{c}_k = \\hat{a}_k \\cdot \\hat{b}_k\\)（逐点乘法）</p>
<p>4. \\(c = \\text{IFFT}(\\hat{c})\\)</p>
</div></div>

<div class="viz-placeholder" data-viz="ch06-viz-poly-mult"></div>

<div class="env-block example"><div class="env-title">Example (Big Integer Multiplication)</div><div class="env-body">
<p>大整数可以看作多项式（以 10 或 \\(2^{32}\\) 为基）。两个 \\(n\\) 位整数的乘法等价于系数为数字的多项式乘法。使用 FFT，可以在 \\(O(n \\log n)\\) 时间内完成（加上进位处理）。这就是 Schonhage-Strassen 算法的基础。</p>
</div></div>

<div class="env-block intuition"><div class="env-title">Intuition</div><div class="env-body">
<p>多项式有两种表示：<strong>系数表示</strong>和<strong>点值表示</strong>。在系数表示下，乘法需要 \\(O(n^2)\\)。在点值表示下，乘法只需 \\(O(n)\\)（逐点相乘）。FFT 在两种表示之间高效转换：</p>
<p>系数 \\(\\xrightarrow{\\text{FFT } O(n\\log n)}\\) 点值 \\(\\xrightarrow{\\text{逐点乘 } O(n)}\\) 点值 \\(\\xrightarrow{\\text{IFFT } O(n\\log n)}\\) 系数</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch06-viz-poly-mult',
                    title: '多项式乘法流水线',
                    description: '展示 FFT 多项式乘法的三步流程',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});

                        // Example: A(x) = 1 + 2x + 3x^2, B(x) = 4 + 5x
                        var polyA = [1, 2, 3, 0];
                        var polyB = [4, 5, 0, 0];

                        function naiveMultiply(a, b) {
                            var n = a.length + b.length - 1;
                            var c = [];
                            for (var i = 0; i < n; i++) c.push(0);
                            for (var i2 = 0; i2 < a.length; i2++) {
                                for (var j = 0; j < b.length; j++) {
                                    c[i2 + j] += a[i2] * b[j];
                                }
                            }
                            return c;
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('FFT Polynomial Multiplication Pipeline', 350, 18, viz.colors.white, 15, 'center');

                            // Show polynomials
                            var polyAStr = polyA[0] + ' + ' + polyA[1] + 'x + ' + polyA[2] + 'x^2';
                            var polyBStr = polyB[0] + ' + ' + polyB[1] + 'x';
                            viz.screenText('A(x) = ' + polyAStr, 200, 50, viz.colors.blue, 13, 'center');
                            viz.screenText('B(x) = ' + polyBStr, 500, 50, viz.colors.green, 13, 'center');

                            // Pipeline boxes
                            var boxW = 140, boxH = 50;
                            var pipelineSteps = [
                                {label: 'Coefficient\nRepresentation', x: 90, color: viz.colors.orange},
                                {label: 'FFT\nO(n log n)', x: 250, color: viz.colors.blue},
                                {label: 'Point-value\nMultiply O(n)', x: 410, color: viz.colors.green},
                                {label: 'IFFT\nO(n log n)', x: 570, color: viz.colors.purple}
                            ];
                            var pipeY = 85;

                            for (var i = 0; i < pipelineSteps.length; i++) {
                                var ps = pipelineSteps[i];
                                viz.ctx.fillStyle = ps.color + '22';
                                viz.ctx.fillRect(ps.x - boxW / 2, pipeY, boxW, boxH);
                                viz.ctx.strokeStyle = ps.color;
                                viz.ctx.lineWidth = 2;
                                viz.ctx.strokeRect(ps.x - boxW / 2, pipeY, boxW, boxH);
                                var lines = ps.label.split('\n');
                                for (var li = 0; li < lines.length; li++) {
                                    viz.screenText(lines[li], ps.x, pipeY + 16 + li * 18, ps.color, 11, 'center');
                                }
                                if (i < pipelineSteps.length - 1) {
                                    viz.ctx.strokeStyle = viz.colors.axis;
                                    viz.ctx.lineWidth = 2;
                                    viz.ctx.beginPath();
                                    viz.ctx.moveTo(ps.x + boxW / 2, pipeY + boxH / 2);
                                    viz.ctx.lineTo(pipelineSteps[i + 1].x - boxW / 2, pipeY + boxH / 2);
                                    viz.ctx.stroke();
                                    // Arrow head
                                    var ax = pipelineSteps[i + 1].x - boxW / 2;
                                    var ay = pipeY + boxH / 2;
                                    viz.ctx.fillStyle = viz.colors.axis;
                                    viz.ctx.beginPath();
                                    viz.ctx.moveTo(ax, ay);
                                    viz.ctx.lineTo(ax - 8, ay - 4);
                                    viz.ctx.lineTo(ax - 8, ay + 4);
                                    viz.ctx.closePath();
                                    viz.ctx.fill();
                                }
                            }

                            // Show coefficient arrays
                            var coeffY = 160;
                            viz.screenText('Coefficients of A:', 50, coeffY, viz.colors.blue, 11, 'left');
                            viz.drawArray(polyA, 200, coeffY - 15, 45, 30, null, null);

                            coeffY += 40;
                            viz.screenText('Coefficients of B:', 50, coeffY, viz.colors.green, 11, 'left');
                            viz.drawArray(polyB, 200, coeffY - 15, 45, 30, null, null);

                            // Naive result
                            var result = naiveMultiply(polyA.filter(function(v, idx) { return idx < 3; }), polyB.filter(function(v, idx) { return idx < 2; }));
                            coeffY += 45;
                            viz.screenText('C = A * B:', 50, coeffY, viz.colors.yellow, 11, 'left');
                            viz.drawArray(result, 200, coeffY - 15, 45, 30, null, null);

                            var cStr = result.map(function(v, i) {
                                if (v === 0) return '';
                                if (i === 0) return String(v);
                                return v + 'x^' + i;
                            }).filter(function(s) { return s !== ''; }).join(' + ');
                            viz.screenText('C(x) = ' + cStr, 350, coeffY + 30, viz.colors.yellow, 13, 'center');

                            // Complexity comparison
                            var cmpY = 330;
                            viz.screenText('Complexity Comparison:', 350, cmpY, viz.colors.white, 13, 'center');
                            viz.screenText('Naive: O(n^2) multiplications', 250, cmpY + 22, viz.colors.red, 12, 'center');
                            viz.screenText('FFT: O(n log n) operations', 500, cmpY + 22, viz.colors.green, 12, 'center');

                            // For n = 10^6
                            viz.screenText('For n = 1,000,000:', 350, cmpY + 50, viz.colors.text, 11, 'center');
                            viz.screenText('Naive: ~10^12 ops', 250, cmpY + 70, viz.colors.red, 11, 'center');
                            viz.screenText('FFT: ~2 * 10^7 ops', 500, cmpY + 70, viz.colors.green, 11, 'center');
                            viz.screenText('50,000x speedup!', 350, cmpY + 90, viz.colors.orange, 12, 'center');
                        }

                        draw();

                        VizEngine.createButton(controls, 'Random Polynomials', function() {
                            polyA = [];
                            polyB = [];
                            for (var i = 0; i < 4; i++) polyA.push(Math.floor(Math.random() * 10));
                            for (var j = 0; j < 4; j++) polyB.push(Math.floor(Math.random() * 10));
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '用 FFT 方法计算 \\(A(x) = 1 + 2x\\) 和 \\(B(x) = 3 + 4x\\) 的乘积。详细写出每一步。',
                    hint: '零填充到长度 4，做 FFT，逐点乘，IFFT。',
                    solution: 'A = [1,2,0,0], B = [3,4,0,0]。FFT(A) at \\(\\omega_4^k\\) (k=0,1,2,3): A(1)=3, A(i)=1+2i, A(-1)=-1, A(-i)=1-2i。FFT(B): B(1)=7, B(i)=3+4i, B(-1)=-1, B(-i)=3-4i。逐点乘：C(1)=21, C(i)=(1+2i)(3+4i)=-5+10i, C(-1)=1, C(-i)=(1-2i)(3-4i)=-5-10i。IFFT: c_k = (1/4)\\(\\sum\\) C_j \\(\\omega^{-jk}\\)。c = [3, 10, 8, 0]。所以 C(x) = 3 + 10x + 8x^2。验证：(1+2x)(3+4x) = 3 + 4x + 6x + 8x^2 = 3 + 10x + 8x^2。正确！'
                },
                {
                    question: 'FFT 除了多项式乘法，还有哪些应用？',
                    hint: '信号处理、图像处理、数论。',
                    solution: '(1) 信号处理：频谱分析、滤波、音频处理；(2) 图像处理：图像压缩（JPEG用DCT，FFT的变体）、卷积滤波；(3) 大整数乘法：Schonhage-Strassen 算法；(4) 字符串匹配：通配符匹配可转化为多项式乘法；(5) 计算科学：偏微分方程的谱方法；(6) 数论：数论变换（NTT）用于模运算下的卷积。'
                },
                {
                    question: '为什么说多项式乘法的下界是 \\(\\Omega(n \\log n)\\)？',
                    hint: '信息论论证：输出有 \\(2n-1\\) 个系数。',
                    solution: '这是一个著名的开放问题！严格来说，\\(\\Omega(n \\log n)\\) 的下界至今未被证明（在代数计算模型下）。在某些受限模型（如只允许加减乘运算的线性电路模型）中，可以证明 \\(\\Omega(n \\log n)\\) 下界。但在一般计算模型中，我们只知道 \\(\\Omega(n)\\) 的平凡下界（因为输出有 \\(2n-1\\) 个系数需要写出）。FFT 给出的 \\(O(n \\log n)\\) 被广泛认为是最优的，但严格证明仍是开放问题。'
                },
                {
                    question: '如何用 FFT 在 \\(O(n \\log n)\\) 时间内计算一个多项式在 \\(n\\) 个点处的值（多点求值）？',
                    hint: 'DFT 本身就是在单位根处求值。',
                    solution: 'FFT 直接计算的是多项式在 \\(n\\) 个单位根 \\(\\omega_n^0, \\omega_n^1, \\ldots, \\omega_n^{n-1}\\) 处的值，这就是多点求值。如果要在任意 \\(n\\) 个点处求值，可以使用 Bluestein 变换或分治子积树（subproduct tree）方法，后者的复杂度为 \\(O(n \\log^2 n)\\)。对于特殊的等间距点，chirp-z 变换可以在 \\(O(n \\log n)\\) 内完成。'
                }
            ]
        }
    ]
});
