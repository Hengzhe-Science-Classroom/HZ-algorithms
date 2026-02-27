// Chapter 5: 快速排序与随机化 — Quicksort & Randomization
window.CHAPTERS.push({
    id: 'ch05',
    number: 5,
    title: '快速排序与随机化',
    subtitle: 'Quicksort & Randomization',
    sections: [
        // ── Section 1: Quicksort Algorithm ──
        {
            id: 'ch05-sec01',
            title: '快速排序算法',
            content: `<h2>快速排序算法</h2>
<p>快速排序（Quicksort）由 Tony Hoare 于 1960 年提出，是实际应用中最常用的排序算法之一。与归并排序不同，快速排序是<strong>原地排序</strong>（in-place），不需要额外的辅助数组。</p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Quicksort)</div><div class="env-body">
<p><strong>Quicksort(A, lo, hi):</strong></p>
<p>1. 若 \\(lo < hi\\)：</p>
<p>2. &emsp; \\(p = \\text{Partition}(A, lo, hi)\\)</p>
<p>3. &emsp; Quicksort(A, lo, p - 1)</p>
<p>4. &emsp; Quicksort(A, p + 1, hi)</p>
</div></div>

<p>快速排序的核心是 <strong>Partition</strong> 操作：选择一个<strong>枢轴</strong>（pivot），将所有小于枢轴的元素移到左边，大于枢轴的元素移到右边，最终枢轴就在其正确位置上。</p>

<div class="env-block intuition"><div class="env-title">Intuition</div><div class="env-body">
<p>归并排序的工作集中在"合并"步骤（分割很简单——取中点）。快速排序恰好相反：工作集中在"分割"步骤（Partition），而合并则无需任何操作——因为所有元素已经就位。</p>
</div></div>

<div class="viz-placeholder" data-viz="ch05-viz-quicksort-step"></div>

<p>快速排序的分治结构：</p>
<ul>
<li><strong>Divide：</strong> Partition 将数组分为两个子数组</li>
<li><strong>Conquer：</strong> 递归排序两个子数组</li>
<li><strong>Combine：</strong> 无需操作（原地完成）</li>
</ul>`,
            visualizations: [
                {
                    id: 'ch05-viz-quicksort-step',
                    title: '快速排序逐步演示',
                    description: '交互式演示快速排序的分区与递归过程',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var origArr = [6, 3, 8, 1, 5, 9, 2, 7];
                        var steps = [];
                        var stepIdx = 0;

                        function recordQS(a, lo, hi) {
                            if (lo >= hi) return;
                            var pivot = a[hi];
                            steps.push({type: 'pivot', arr: a.slice(), lo: lo, hi: hi, pivot: pivot, pivotIdx: hi});
                            var i = lo - 1;
                            for (var j = lo; j < hi; j++) {
                                if (a[j] <= pivot) {
                                    i++;
                                    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
                                    steps.push({type: 'swap', arr: a.slice(), lo: lo, hi: hi, i: i, j: j, pivot: pivot, pivotIdx: hi});
                                }
                            }
                            var tmp2 = a[i + 1]; a[i + 1] = a[hi]; a[hi] = tmp2;
                            steps.push({type: 'placed', arr: a.slice(), lo: lo, hi: hi, pivotIdx: i + 1, pivot: pivot});
                            var p = i + 1;
                            recordQS(a, lo, p - 1);
                            recordQS(a, p + 1, hi);
                        }

                        var temp = origArr.slice();
                        recordQS(temp, 0, temp.length - 1);

                        function draw() {
                            viz.clear();
                            var n = origArr.length;
                            viz.screenText('Quicksort (Lomuto Partition)', 350, 18, viz.colors.white, 15, 'center');

                            var step = stepIdx < steps.length ? steps[stepIdx] : null;
                            var currentArr = step ? step.arr : temp;
                            var cellW = 60, cellH = 40;
                            var startX = (700 - n * cellW) / 2;
                            var startY = 50;

                            var colors = [];
                            var highlights = [];
                            for (var k = 0; k < n; k++) {
                                colors.push(viz.colors.bg);
                                highlights.push(null);
                            }

                            if (step) {
                                // Highlight active range
                                for (var k2 = step.lo; k2 <= step.hi; k2++) {
                                    colors[k2] = '#1a2a3a';
                                }
                                if (step.type === 'pivot') {
                                    highlights[step.pivotIdx] = viz.colors.orange;
                                } else if (step.type === 'swap') {
                                    highlights[step.i] = viz.colors.green;
                                    highlights[step.j] = viz.colors.blue;
                                    highlights[step.pivotIdx] = viz.colors.orange;
                                } else if (step.type === 'placed') {
                                    highlights[step.pivotIdx] = viz.colors.red;
                                }
                            }

                            viz.drawArray(currentArr, startX, startY, cellW, cellH, colors, highlights);

                            // Bar chart
                            var barW = 40;
                            var maxH = 180;
                            var barStartX = (700 - n * (barW + 8)) / 2;
                            var barStartY = 340;
                            var maxVal = Math.max.apply(null, currentArr);
                            for (var bi = 0; bi < n; bi++) {
                                var h = (currentArr[bi] / maxVal) * maxH;
                                var px = barStartX + bi * (barW + 8);
                                var py = barStartY - h;
                                var barCol = viz.colors.blue;
                                if (step && bi >= step.lo && bi <= step.hi) barCol = viz.colors.teal;
                                if (step && step.type === 'placed' && bi === step.pivotIdx) barCol = viz.colors.red;
                                if (step && step.type === 'pivot' && bi === step.pivotIdx) barCol = viz.colors.orange;
                                viz.ctx.fillStyle = barCol;
                                viz.ctx.fillRect(px, py, barW, h);
                                viz.ctx.strokeStyle = viz.colors.axis;
                                viz.ctx.lineWidth = 0.5;
                                viz.ctx.strokeRect(px, py, barW, h);
                                viz.screenText(String(currentArr[bi]), px + barW / 2, py - 8, viz.colors.white, 11, 'center');
                            }

                            // Status
                            var msg = '';
                            if (step) {
                                if (step.type === 'pivot') msg = 'Choose pivot = ' + step.pivot + ' at index ' + step.pivotIdx + ', range [' + step.lo + '..' + step.hi + ']';
                                else if (step.type === 'swap') msg = 'Swap A[' + step.i + '] and A[' + step.j + '] (element <= pivot ' + step.pivot + ')';
                                else if (step.type === 'placed') msg = 'Pivot ' + step.pivot + ' placed at final position ' + step.pivotIdx;
                            } else {
                                msg = 'Sorting complete!';
                            }
                            viz.screenText(msg, 350, 370, viz.colors.yellow, 12, 'center');
                            viz.screenText('Step ' + (stepIdx + 1) + ' / ' + steps.length, 350, 395, viz.colors.text, 11, 'center');
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
                            origArr = [];
                            for (var i = 0; i < 8; i++) origArr.push(Math.floor(Math.random() * 90) + 5);
                            steps = [];
                            temp = origArr.slice();
                            recordQS(temp, 0, temp.length - 1);
                            stepIdx = 0;
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '对数组 \\([5, 3, 8, 4, 2, 7, 1, 6]\\) 使用 Lomuto 分区（最后一个元素为 pivot），写出第一次 Partition 后的数组状态。',
                    hint: 'Pivot = 6。扫描数组，将 \\(\\leq 6\\) 的元素交换到前面。',
                    solution: 'Pivot = 6。扫描后，\\(\\leq 6\\) 的元素为 5,3,4,2,1。交换过程后数组为 \\([5,3,4,2,1,6,8,7]\\)（pivot 6 在 index 5）。具体：i 从 -1 开始，j=0: 5<=6, swap(0,0); j=1: 3<=6, swap(1,1); j=2: 8>6, skip; j=3: 4<=6, swap(2,3)=[5,3,4,8,2,7,1,6]; j=4: 2<=6, swap(3,4)=[5,3,4,2,8,7,1,6]; j=5: 7>6, skip; j=6: 1<=6, swap(4,6)=[5,3,4,2,1,7,8,6]; 最后 swap(5,7)=[5,3,4,2,1,6,8,7]。'
                },
                {
                    question: '快速排序是稳定排序吗？为什么？',
                    hint: '考虑相等元素在分区过程中的相对位置变化。',
                    solution: '快速排序不是稳定排序。在分区过程中，交换操作可能改变相等元素的相对顺序。例如 \\([3_a, 2, 3_b, 1]\\) 以 1 为 pivot 分区后，\\(3_a\\) 和 \\(3_b\\) 的相对顺序可能改变。'
                },
                {
                    question: '快速排序的空间复杂度是多少？考虑递归栈的深度。',
                    hint: '最好情况和最坏情况下的栈深度不同。',
                    solution: '空间复杂度主要来自递归栈。最好情况（平衡分区）：栈深 \\(O(\\log n)\\)。最坏情况（已排序数组）：栈深 \\(O(n)\\)。使用尾递归优化（先递归较小的子数组，对较大的用迭代），可以保证栈深为 \\(O(\\log n)\\)。'
                }
            ]
        },

        // ── Section 2: Lomuto vs Hoare Partitioning ──
        {
            id: 'ch05-sec02',
            title: 'Lomuto 与 Hoare 分区',
            content: `<h2>Lomuto 与 Hoare 分区</h2>
<p>分区算法有两个经典版本：<strong>Lomuto 分区</strong>和 <strong>Hoare 分区</strong>。它们的功能相同（将数组围绕 pivot 分区），但策略和效率不同。</p>

<h3>Lomuto 分区</h3>
<div class="env-block algorithm"><div class="env-title">Algorithm (Lomuto Partition)</div><div class="env-body">
<p><strong>LomutoPartition(A, lo, hi):</strong></p>
<p>1. \\(pivot = A[hi]\\)</p>
<p>2. \\(i = lo - 1\\)</p>
<p>3. For \\(j = lo\\) to \\(hi - 1\\)：</p>
<p>&emsp; 若 \\(A[j] \\leq pivot\\)：\\(i{+}{+}\\)；swap(\\(A[i], A[j]\\))</p>
<p>4. swap(\\(A[i+1], A[hi]\\))</p>
<p>5. return \\(i + 1\\)</p>
</div></div>

<h3>Hoare 分区</h3>
<div class="env-block algorithm"><div class="env-title">Algorithm (Hoare Partition)</div><div class="env-body">
<p><strong>HoarePartition(A, lo, hi):</strong></p>
<p>1. \\(pivot = A[lo]\\)</p>
<p>2. \\(i = lo - 1,\\; j = hi + 1\\)</p>
<p>3. Loop：</p>
<p>&emsp; do \\(i{+}{+}\\) while \\(A[i] < pivot\\)</p>
<p>&emsp; do \\(j{-}{-}\\) while \\(A[j] > pivot\\)</p>
<p>&emsp; 若 \\(i \\geq j\\)：return \\(j\\)</p>
<p>&emsp; swap(\\(A[i], A[j]\\))</p>
</div></div>

<div class="viz-placeholder" data-viz="ch05-viz-partition-compare"></div>

<div class="env-block theorem"><div class="env-title">Comparison</div><div class="env-body">
<p><strong>交换次数：</strong> Hoare 分区平均交换次数约为 Lomuto 的三分之一。在随机输入上，Lomuto 做约 \\(n/2\\) 次交换，Hoare 做约 \\(n/6\\) 次。</p>
<p><strong>实现复杂度：</strong> Lomuto 更简单直观，适合教学。Hoare 的边界条件更微妙。</p>
<p><strong>退化行为：</strong> 对已排序数组，Lomuto（取最后元素为 pivot）退化为 \\(O(n^2)\\)。Hoare（取第一个元素）同样退化。</p>
</div></div>

<div class="env-block warning"><div class="env-title">Warning</div><div class="env-body">
<p>Hoare 分区返回的 \\(j\\) 不一定是 pivot 的最终位置！pivot 可能在 \\(A[lo..j]\\) 中的任意位置。递归时应调用 Quicksort(A, lo, j) 和 Quicksort(A, j+1, hi)，而不是跳过 pivot 位置。</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch05-viz-partition-compare',
                    title: 'Lomuto vs Hoare 对比',
                    description: '并排展示两种分区算法的执行过程',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var arr = [4, 7, 2, 6, 1, 3, 8, 5];

                        function lomutoSteps(a) {
                            var b = a.slice();
                            var sts = [];
                            var pivot = b[b.length - 1];
                            var i = -1;
                            sts.push({arr: b.slice(), i: -1, j: 0, pivot: pivot, msg: 'Pivot = ' + pivot, swaps: 0});
                            var swapCount = 0;
                            for (var j = 0; j < b.length - 1; j++) {
                                if (b[j] <= pivot) {
                                    i++;
                                    var tmp = b[i]; b[i] = b[j]; b[j] = tmp;
                                    swapCount++;
                                    sts.push({arr: b.slice(), i: i, j: j, pivot: pivot, msg: 'A[' + j + ']=' + b[i] + ' <= ' + pivot + ', swap', swaps: swapCount});
                                } else {
                                    sts.push({arr: b.slice(), i: i, j: j, pivot: pivot, msg: 'A[' + j + ']=' + a[j] + ' > ' + pivot + ', skip', swaps: swapCount});
                                }
                            }
                            var tmp2 = b[i + 1]; b[i + 1] = b[b.length - 1]; b[b.length - 1] = tmp2;
                            swapCount++;
                            sts.push({arr: b.slice(), i: i + 1, j: -1, pivot: pivot, msg: 'Place pivot at ' + (i + 1), swaps: swapCount});
                            return sts;
                        }

                        function hoareSteps(a) {
                            var b = a.slice();
                            var sts = [];
                            var pivot = b[0];
                            var i = -1, j = b.length;
                            var swapCount = 0;
                            sts.push({arr: b.slice(), i: 0, j: b.length - 1, pivot: pivot, msg: 'Pivot = ' + pivot, swaps: 0});
                            while (true) {
                                do { i++; } while (b[i] < pivot);
                                do { j--; } while (b[j] > pivot);
                                if (i >= j) {
                                    sts.push({arr: b.slice(), i: i, j: j, pivot: pivot, msg: 'i >= j, partition done at j=' + j, swaps: swapCount});
                                    break;
                                }
                                var tmp = b[i]; b[i] = b[j]; b[j] = tmp;
                                swapCount++;
                                sts.push({arr: b.slice(), i: i, j: j, pivot: pivot, msg: 'Swap A[' + i + ']=' + b[j] + ' and A[' + j + ']=' + b[i], swaps: swapCount});
                            }
                            return sts;
                        }

                        var lSteps = lomutoSteps(arr);
                        var hSteps = hoareSteps(arr);
                        var stepIdx = 0;

                        function draw() {
                            viz.clear();
                            var n = arr.length;
                            var cellW = 38, cellH = 32;

                            viz.screenText('Lomuto Partition', 175, 18, viz.colors.orange, 14, 'center');
                            viz.screenText('Hoare Partition', 525, 18, viz.colors.teal, 14, 'center');

                            // Lomuto side
                            var ls = stepIdx < lSteps.length ? lSteps[stepIdx] : lSteps[lSteps.length - 1];
                            var lStartX = 175 - (n * cellW) / 2;
                            var lColors = [];
                            var lHL = [];
                            for (var k = 0; k < n; k++) {
                                lColors.push(viz.colors.bg);
                                lHL.push(null);
                            }
                            if (ls.i >= 0 && ls.i < n) lHL[ls.i] = viz.colors.green;
                            if (ls.j >= 0 && ls.j < n) lHL[ls.j] = viz.colors.blue;
                            viz.drawArray(ls.arr, lStartX, 40, cellW, cellH, lColors, lHL);
                            viz.screenText(ls.msg, 175, 95, viz.colors.text, 11, 'center');
                            viz.screenText('Swaps: ' + ls.swaps, 175, 112, viz.colors.orange, 11, 'center');

                            // Bar chart for Lomuto
                            var barW = 25;
                            var maxH = 100;
                            var maxVal = Math.max.apply(null, ls.arr);
                            for (var bi = 0; bi < n; bi++) {
                                var h = (ls.arr[bi] / maxVal) * maxH;
                                var px = lStartX + bi * (barW + 5) + 5;
                                var py = 240 - h;
                                var c = viz.colors.blue;
                                if (bi === ls.i) c = viz.colors.green;
                                if (ls.arr[bi] === ls.pivot && (stepIdx === lSteps.length - 1 || ls.j === -1)) c = viz.colors.red;
                                viz.ctx.fillStyle = c;
                                viz.ctx.fillRect(px, py, barW, h);
                            }

                            // Hoare side
                            var hs = stepIdx < hSteps.length ? hSteps[stepIdx] : hSteps[hSteps.length - 1];
                            var hStartX = 525 - (n * cellW) / 2;
                            var hColors = [];
                            var hHL = [];
                            for (var k2 = 0; k2 < n; k2++) {
                                hColors.push(viz.colors.bg);
                                hHL.push(null);
                            }
                            if (hs.i >= 0 && hs.i < n) hHL[hs.i] = viz.colors.green;
                            if (hs.j >= 0 && hs.j < n) hHL[hs.j] = viz.colors.purple;
                            viz.drawArray(hs.arr, hStartX, 40, cellW, cellH, hColors, hHL);
                            viz.screenText(hs.msg, 525, 95, viz.colors.text, 11, 'center');
                            viz.screenText('Swaps: ' + hs.swaps, 525, 112, viz.colors.teal, 11, 'center');

                            // Bar chart for Hoare
                            for (var bi2 = 0; bi2 < n; bi2++) {
                                var h2 = (hs.arr[bi2] / maxVal) * maxH;
                                var px2 = hStartX + bi2 * (barW + 5) + 5;
                                var py2 = 240 - h2;
                                var c2 = viz.colors.teal;
                                if (bi2 === hs.i) c2 = viz.colors.green;
                                if (bi2 === hs.j) c2 = viz.colors.purple;
                                viz.ctx.fillStyle = c2;
                                viz.ctx.fillRect(px2, py2, barW, h2);
                            }

                            // Divider line
                            viz.ctx.strokeStyle = viz.colors.axis;
                            viz.ctx.lineWidth = 1;
                            viz.ctx.setLineDash([4, 4]);
                            viz.ctx.beginPath();
                            viz.ctx.moveTo(350, 10);
                            viz.ctx.lineTo(350, 410);
                            viz.ctx.stroke();
                            viz.ctx.setLineDash([]);

                            // Legend
                            viz.screenText('Green = i pointer', 120, 280, viz.colors.green, 11, 'left');
                            viz.screenText('Blue = j pointer (Lomuto)', 120, 298, viz.colors.blue, 11, 'left');
                            viz.screenText('Purple = j pointer (Hoare)', 400, 298, viz.colors.purple, 11, 'left');

                            var maxSteps = Math.max(lSteps.length, hSteps.length);
                            viz.screenText('Step ' + (stepIdx + 1) + ' / ' + maxSteps, 350, 400, viz.colors.text, 11, 'center');
                        }

                        draw();

                        VizEngine.createButton(controls, 'Prev', function() {
                            if (stepIdx > 0) { stepIdx--; draw(); }
                        });
                        VizEngine.createButton(controls, 'Next', function() {
                            var maxSteps = Math.max(lSteps.length, hSteps.length);
                            if (stepIdx < maxSteps - 1) { stepIdx++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            stepIdx = 0; draw();
                        });
                        VizEngine.createButton(controls, 'New Array', function() {
                            arr = [];
                            for (var i = 0; i < 8; i++) arr.push(Math.floor(Math.random() * 20) + 1);
                            lSteps = lomutoSteps(arr);
                            hSteps = hoareSteps(arr);
                            stepIdx = 0;
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '对同一数组 \\([3, 7, 1, 6, 4, 5, 2]\\) 分别执行 Lomuto 和 Hoare 分区，比较交换次数。',
                    hint: 'Lomuto: pivot = A[6] = 2。Hoare: pivot = A[0] = 3。',
                    solution: 'Lomuto (pivot=2): 扫描后只有 A[2]=1 <= 2，做 1 次元素交换 + 1 次 pivot 交换 = 2 次。结果 [1,2,7,6,4,5,3]。Hoare (pivot=3): i 从左找 >= 3 的，j 从右找 <= 3 的。i=0(3>=3), j=6(2<=3), swap => [2,7,1,6,4,5,3]; i=1(7>=3), j=5 -> j=4 -> j=3 -> j=2(1<=3), i>=j 不成立 => 再看 i=1,j=2, swap => [2,1,7,6,4,5,3]; i=2(7>=3), j=1(1<3), i>j, done。Hoare 做 2 次交换。'
                },
                {
                    question: '证明 Lomuto 分区的平均交换次数为 \\((n-1)/2\\)（假设输入是随机排列，pivot 是最后一个元素）。',
                    hint: '对每个 j，A[j] <= pivot 的概率是多少？',
                    solution: 'Pivot 是最后一个元素。前 \\(n-1\\) 个元素中，每个元素 \\(A[j] \\leq A[n]\\) 的概率为 \\((n-1)/n \\cdot 1/2 ... \\) 更精确地说：pivot 的秩（rank）为 \\(k\\) 的概率为 \\(1/n\\)。当 pivot 秩为 \\(k\\) 时，有 \\(k-1\\) 个元素 \\(\\leq\\) pivot，Lomuto 做 \\(k-1\\) 次交换加 1 次 pivot 交换。期望 = \\(\\sum_{k=1}^{n} \\frac{1}{n}(k-1+1) = \\frac{1}{n}\\sum_{k=1}^{n} k = \\frac{n+1}{2}\\)。更精确的分析考虑避免自交换后约为 \\((n-1)/2\\)。'
                },
                {
                    question: 'Hoare 分区中，为什么使用严格不等号 \\(A[i] < pivot\\) 和 \\(A[j] > pivot\\)（而不是 \\(\\leq\\) 和 \\(\\geq\\)）？如果改用非严格不等号会怎样？',
                    hint: '考虑所有元素都相等的情况。',
                    solution: '如果使用 \\(\\leq\\) 和 \\(\\geq\\)，当所有元素相等时，一个指针会一直移动到底而另一个不动，导致极不平衡的分区（\\(O(n^2)\\) 行为）。使用严格不等号时，两个指针在遇到等于 pivot 的元素时都会停下并交换，确保分区大致平衡。'
                }
            ]
        },

        // ── Section 3: Worst/Expected Case Analysis ──
        {
            id: 'ch05-sec03',
            title: '最坏情况与期望分析',
            content: `<h2>最坏情况与期望分析</h2>

<h3>最坏情况</h3>
<div class="env-block theorem"><div class="env-title">Theorem (Quicksort Worst Case)</div><div class="env-body">
<p>快速排序的最坏情况时间复杂度为 \\(\\Theta(n^2)\\)。</p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p>当每次分区都极不平衡（如输入已排序且选最后一个元素为 pivot）时，一边有 \\(n-1\\) 个元素，另一边为空：</p>
$$T(n) = T(n-1) + T(0) + \\Theta(n) = T(n-1) + \\Theta(n)$$
<p>展开得 \\(T(n) = \\Theta(n) + \\Theta(n-1) + \\cdots + \\Theta(1) = \\Theta(n^2)\\)。</p>
<p class="qed">∎</p>
</div></div>

<h3>期望时间分析</h3>
<p>假设输入是均匀随机排列。设 \\(T(n)\\) 是排序 \\(n\\) 个元素的期望比较次数。</p>

<div class="env-block theorem"><div class="env-title">Theorem (Expected Comparisons)</div><div class="env-body">
<p>快速排序的期望比较次数为 \\(2n \\ln n + O(n) \\approx 1.386 n \\log_2 n\\)。</p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p>设 \\(z_1 < z_2 < \\cdots < z_n\\) 是排序后的元素。定义指示随机变量：</p>
$$X_{ij} = \\begin{cases} 1 & \\text{if } z_i \\text{ and } z_j \\text{ are compared} \\\\ 0 & \\text{otherwise} \\end{cases}$$
<p>总比较次数 \\(X = \\sum_{i=1}^{n-1} \\sum_{j=i+1}^{n} X_{ij}\\)。</p>
<p>\\(z_i\\) 和 \\(z_j\\) 被比较当且仅当 \\(\\{z_i, z_{i+1}, \\ldots, z_j\\}\\) 中 \\(z_i\\) 或 \\(z_j\\) 先被选为 pivot。概率为 \\(\\frac{2}{j - i + 1}\\)。</p>
$$E[X] = \\sum_{i=1}^{n-1} \\sum_{j=i+1}^{n} \\frac{2}{j-i+1} = \\sum_{i=1}^{n-1} \\sum_{k=2}^{n-i+1} \\frac{2}{k} \\leq 2n \\sum_{k=2}^{n} \\frac{1}{k} = 2n(H_n - 1) = 2n \\ln n + O(n)$$
<p class="qed">∎</p>
</div></div>

<div class="viz-placeholder" data-viz="ch05-viz-comparison-count"></div>`,
            visualizations: [
                {
                    id: 'ch05-viz-comparison-count',
                    title: '快速排序比较次数统计',
                    description: '实验统计不同大小数组的平均比较次数',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var trials = 200;
                        var maxN = 100;

                        function qsortCount(arr) {
                            var count = 0;
                            function qs(a, lo, hi) {
                                if (lo >= hi) return;
                                var pivot = a[hi];
                                var i = lo - 1;
                                for (var j = lo; j < hi; j++) {
                                    count++;
                                    if (a[j] <= pivot) {
                                        i++;
                                        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
                                    }
                                }
                                var tmp2 = a[i + 1]; a[i + 1] = a[hi]; a[hi] = tmp2;
                                qs(a, lo, i);
                                qs(a, i + 2, hi);
                            }
                            qs(arr, 0, arr.length - 1);
                            return count;
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Quicksort: Comparison Count vs n', 350, 18, viz.colors.white, 15, 'center');

                            var dataPoints = [];
                            var step = 5;
                            for (var n = 5; n <= maxN; n += step) {
                                var totalComps = 0;
                                for (var t = 0; t < trials; t++) {
                                    var a = [];
                                    for (var i = 0; i < n; i++) a.push(Math.random());
                                    totalComps += qsortCount(a);
                                }
                                dataPoints.push({n: n, avg: totalComps / trials});
                            }

                            // Plot
                            var plotL = 80, plotR = 650, plotT = 50, plotB = 340;
                            var maxComp = dataPoints[dataPoints.length - 1].avg * 1.2;

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

                            // Tick marks
                            for (var ti = 0; ti <= maxN; ti += 20) {
                                var tx = plotL + (ti / maxN) * (plotR - plotL);
                                viz.screenText(String(ti), tx, plotB + 15, viz.colors.text, 10, 'center');
                            }

                            // Data points (empirical)
                            viz.ctx.fillStyle = viz.colors.blue;
                            for (var d = 0; d < dataPoints.length; d++) {
                                var dp = dataPoints[d];
                                var dx = plotL + (dp.n / maxN) * (plotR - plotL);
                                var dy = plotB - (dp.avg / maxComp) * (plotB - plotT);
                                viz.ctx.beginPath();
                                viz.ctx.arc(dx, dy, 3, 0, Math.PI * 2);
                                viz.ctx.fill();
                            }

                            // Theoretical 2n ln n curve
                            viz.ctx.strokeStyle = viz.colors.orange;
                            viz.ctx.lineWidth = 2;
                            viz.ctx.beginPath();
                            var first = true;
                            for (var tn = 5; tn <= maxN; tn++) {
                                var theory = 2 * tn * Math.log(tn);
                                var ttx = plotL + (tn / maxN) * (plotR - plotL);
                                var tty = plotB - (theory / maxComp) * (plotB - plotT);
                                if (first) { viz.ctx.moveTo(ttx, tty); first = false; }
                                else viz.ctx.lineTo(ttx, tty);
                            }
                            viz.ctx.stroke();

                            // n^2 curve (worst case)
                            viz.ctx.strokeStyle = viz.colors.red;
                            viz.ctx.lineWidth = 1;
                            viz.ctx.setLineDash([4, 4]);
                            viz.ctx.beginPath();
                            first = true;
                            for (var wn = 5; wn <= maxN; wn++) {
                                var worst = wn * wn / 2;
                                var wx = plotL + (wn / maxN) * (plotR - plotL);
                                var wy = plotB - (worst / maxComp) * (plotB - plotT);
                                if (wy < plotT) break;
                                if (first) { viz.ctx.moveTo(wx, wy); first = false; }
                                else viz.ctx.lineTo(wx, wy);
                            }
                            viz.ctx.stroke();
                            viz.ctx.setLineDash([]);

                            // Legend
                            viz.ctx.fillStyle = viz.colors.blue;
                            viz.ctx.fillRect(400, 360, 12, 12);
                            viz.screenText('Empirical avg', 418, 366, viz.colors.blue, 11, 'left');
                            viz.ctx.fillStyle = viz.colors.orange;
                            viz.ctx.fillRect(400, 378, 12, 12);
                            viz.screenText('2n ln n (theory)', 418, 384, viz.colors.orange, 11, 'left');
                            viz.ctx.fillStyle = viz.colors.red;
                            viz.ctx.fillRect(530, 360, 12, 12);
                            viz.screenText('n^2/2 (worst)', 548, 366, viz.colors.red, 11, 'left');
                        }

                        draw();

                        VizEngine.createButton(controls, 'Re-run Experiment', function() { draw(); });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '在期望分析中，为什么 \\(\\Pr[z_i \\text{ and } z_j \\text{ are compared}] = \\frac{2}{j-i+1}\\)？',
                    hint: '考虑集合 \\(\\{z_i, z_{i+1}, \\ldots, z_j\\}\\) 中哪个元素先被选为 pivot。',
                    solution: '\\(z_i\\) 和 \\(z_j\\) 被比较当且仅当在 \\(\\{z_i, z_{i+1}, \\ldots, z_j\\}\\) 中，\\(z_i\\) 或 \\(z_j\\) 是第一个被选为 pivot 的。如果选了 \\(z_k\\)（\\(i < k < j\\)），则 \\(z_i\\) 和 \\(z_j\\) 会被分到不同的子数组中，永远不会被比较。由对称性，该集合中每个元素等概率先被选，概率为 \\(\\frac{1}{j-i+1}\\)。所以 \\(z_i\\) 或 \\(z_j\\) 先被选的概率为 \\(\\frac{2}{j-i+1}\\)。'
                },
                {
                    question: '快速排序的期望比较次数 \\(2n \\ln n\\) 与归并排序的最坏情况 \\(n \\log_2 n\\) 相比如何？',
                    hint: '注意 \\(\\ln n\\) 和 \\(\\log_2 n\\) 的关系。',
                    solution: '\\(2n \\ln n = 2n \\cdot \\frac{\\log_2 n}{\\log_2 e} = \\frac{2}{\\log_2 e} \\cdot n \\log_2 n \\approx 1.386 n \\log_2 n\\)。归并排序最坏情况约为 \\(n \\log_2 n\\)。所以快速排序平均比归并排序多做约 39% 的比较。但快速排序由于更好的缓存局部性和更少的数据移动，实际中往往更快。'
                },
                {
                    question: '如果快速排序选择的 pivot 总是在中位数附近（即分区比例不超过 \\(1:9\\)），时间复杂度是什么？',
                    hint: '分析 \\(T(n) = T(n/10) + T(9n/10) + O(n)\\)。',
                    solution: '递推树每层的总工作量仍为 \\(O(n)\\)。树的深度为 \\(\\log_{10/9} n = O(\\log n)\\)（沿最长路径 \\(9n/10\\) 下降）。所以 \\(T(n) = O(n \\log n)\\)。实际上，即使分区比例只要是某个常数比例 \\(c : (1-c)\\)（\\(0 < c < 1\\)），都是 \\(O(n \\log n)\\)。'
                }
            ]
        },

        // ── Section 4: Randomized Quicksort ──
        {
            id: 'ch05-sec04',
            title: '随机化快速排序',
            content: `<h2>随机化快速排序</h2>
<p>确定性快速排序的最坏情况是 \\(O(n^2)\\)，且存在特定的输入可以触发这种退化。<strong>随机化快速排序</strong>通过随机选择 pivot 来避免这个问题。</p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Randomized Quicksort)</div><div class="env-body">
<p><strong>RandomizedPartition(A, lo, hi):</strong></p>
<p>1. 随机选择 \\(r \\in [lo, hi]\\)</p>
<p>2. swap(\\(A[r], A[hi]\\))</p>
<p>3. return Partition(A, lo, hi)</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem</div><div class="env-body">
<p>随机化快速排序对任意输入的<strong>期望</strong>运行时间为 \\(O(n \\log n)\\)。这里的期望是对算法的随机选择取的，不依赖于输入分布。</p>
</div></div>

<div class="env-block intuition"><div class="env-title">Intuition</div><div class="env-body">
<p>随机化将"最坏情况输入"变成了"最坏情况运气"。对于任何固定输入，以极高概率算法运行在 \\(O(n \\log n)\\) 时间内。只有极其罕见的随机选择序列才会导致 \\(O(n^2)\\)，其概率约为 \\(1/n!\\)。</p>
</div></div>

<div class="viz-placeholder" data-viz="ch05-viz-random-pivot"></div>

<p>随机化快速排序的一个重要性质是<strong>集中不等式</strong>（concentration）：运行时间不仅期望好，而且以高概率接近期望值。</p>

<div class="env-block theorem"><div class="env-title">Theorem (Tail Bound)</div><div class="env-body">
<p>对于随机化快速排序，\\(\\Pr[T(n) \\geq cn \\log n] \\leq n^{-\\alpha}\\) 对某个常数 \\(c, \\alpha > 0\\) 成立。即运行时间以多项式小的概率偏离期望。</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch05-viz-random-pivot',
                    title: '随机化 Pivot 分布实验',
                    description: '对同一数组多次运行随机化快速排序，观察比较次数的分布',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var n = 50;
                        var numTrials = 500;
                        var histogram = {};

                        function randomQSCount(size) {
                            var a = [];
                            for (var i = 0; i < size; i++) a.push(i); // Worst-case for deterministic
                            var count = 0;
                            function qs(arr, lo, hi) {
                                if (lo >= hi) return;
                                // Random pivot
                                var r = lo + Math.floor(Math.random() * (hi - lo + 1));
                                var tmp = arr[r]; arr[r] = arr[hi]; arr[hi] = tmp;
                                var pivot = arr[hi];
                                var i = lo - 1;
                                for (var j = lo; j < hi; j++) {
                                    count++;
                                    if (arr[j] <= pivot) {
                                        i++;
                                        var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
                                    }
                                }
                                var t2 = arr[i + 1]; arr[i + 1] = arr[hi]; arr[hi] = t2;
                                qs(arr, lo, i);
                                qs(arr, i + 2, hi);
                            }
                            qs(a, 0, a.length - 1);
                            return count;
                        }

                        function runExperiment() {
                            histogram = {};
                            for (var t = 0; t < numTrials; t++) {
                                var c = randomQSCount(n);
                                var bucket = Math.floor(c / 20) * 20;
                                histogram[bucket] = (histogram[bucket] || 0) + 1;
                            }
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Randomized QS on sorted array (n=' + n + ', ' + numTrials + ' trials)', 350, 18, viz.colors.white, 14, 'center');

                            var buckets = Object.keys(histogram).map(Number).sort(function(a, b) { return a - b; });
                            if (buckets.length === 0) return;

                            var maxCount = 0;
                            for (var k = 0; k < buckets.length; k++) {
                                if (histogram[buckets[k]] > maxCount) maxCount = histogram[buckets[k]];
                            }

                            var plotL = 60, plotR = 660, plotB = 340, plotT = 50;
                            var barW = Math.max(5, (plotR - plotL) / buckets.length - 2);

                            for (var i = 0; i < buckets.length; i++) {
                                var cnt = histogram[buckets[i]];
                                var h = (cnt / maxCount) * (plotB - plotT);
                                var px = plotL + i * (barW + 2);
                                var py = plotB - h;
                                viz.ctx.fillStyle = viz.colors.blue;
                                viz.ctx.fillRect(px, py, barW, h);
                            }

                            // Axis labels
                            viz.screenText('Comparison count', 350, plotB + 25, viz.colors.text, 11, 'center');
                            viz.screenText('Frequency', 30, (plotT + plotB) / 2, viz.colors.text, 11, 'center');

                            // Mark 2n ln n
                            var expected = 2 * n * Math.log(n);
                            var minBucket = buckets[0], maxBucket = buckets[buckets.length - 1];
                            var range = maxBucket - minBucket + 20;
                            var expX = plotL + ((expected - minBucket) / range) * (plotR - plotL);
                            viz.ctx.strokeStyle = viz.colors.orange;
                            viz.ctx.lineWidth = 2;
                            viz.ctx.setLineDash([5, 3]);
                            viz.ctx.beginPath();
                            viz.ctx.moveTo(expX, plotT);
                            viz.ctx.lineTo(expX, plotB);
                            viz.ctx.stroke();
                            viz.ctx.setLineDash([]);
                            viz.screenText('E[X] = 2n ln n = ' + Math.round(expected), expX, plotT - 8, viz.colors.orange, 11, 'center');

                            // Mark n^2 worst case
                            var worst = n * (n - 1) / 2;
                            viz.screenText('Worst case: n(n-1)/2 = ' + worst, 350, plotB + 45, viz.colors.red, 11, 'center');
                            viz.screenText('Note: sorted input is worst for deterministic QS, but fine for randomized!', 350, plotB + 60, viz.colors.green, 10, 'center');
                        }

                        runExperiment();
                        draw();

                        VizEngine.createButton(controls, 'Re-run', function() {
                            runExperiment();
                            draw();
                        });
                        VizEngine.createSlider(controls, 'n', 10, 200, n, 10, function(v) {
                            n = Math.round(v);
                            runExperiment();
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '为什么说随机化快速排序没有"最坏情况输入"，只有"最坏情况运气"？',
                    hint: '比较确定性算法和随机化算法的对手论证（adversary argument）。',
                    solution: '对于确定性快速排序，对手可以根据算法的 pivot 选择策略构造使其退化为 \\(O(n^2)\\) 的输入。对于随机化版本，对手必须在看到随机选择之前确定输入，因此无法针对随机 pivot 选择进行优化。对任何固定输入，只有当随机选择序列恰好总是选到极端元素时才会退化，而这一概率极低。'
                },
                {
                    question: '如果用 median-of-3（取首、中、尾三个元素的中位数作为 pivot）代替随机选择，能否保证 \\(O(n \\log n)\\) 最坏情况？',
                    hint: '尝试构造一个使 median-of-3 总是选到极端元素的输入。',
                    solution: '不能。可以构造"median-of-3 killer"序列使得 median-of-3 每次都选到近乎最大或最小的元素。例如 Musser(1997) 给出了这样的构造。因此 median-of-3 仍有 \\(O(n^2)\\) 最坏情况。但在实际随机输入上表现很好。'
                },
                {
                    question: '证明：随机化快速排序中，每个元素被选为 pivot 的期望次数为 \\(O(1)\\)。',
                    hint: '一旦一个元素被选为 pivot，它就到达了最终位置，不再参与后续递归。',
                    solution: '每个元素最多被选为 pivot 一次。一旦被选为 pivot，它在分区后到达正确位置，不会出现在任何后续的子问题中。因此每个元素被选为 pivot 的次数恰好为 0 或 1，期望次数 \\(\\leq 1\\)。'
                },
                {
                    question: '随机化快速排序和打乱后再确定性排序有什么区别？在什么情况下会选择随机化版本？',
                    hint: '考虑在线算法和只读输入的场景。',
                    solution: '两种方法的期望复杂度相同。但随机化版本有优势：(1) 不需要先打乱数组，节省了 \\(O(n)\\) 的预处理时间；(2) 如果输入是只读的或通过流到达，无法预先打乱；(3) 随机化版本可以在每一步独立做出随机选择，不依赖全局状态。打乱后确定性排序的优势在于更容易分析和调试。'
                }
            ]
        },

        // ── Section 5: Practical Optimizations ──
        {
            id: 'ch05-sec05',
            title: '实际优化',
            content: `<h2>实际优化</h2>
<p>理论上快速排序已经很高效，但在工程实践中还有许多优化技巧使其成为最常用的排序算法。</p>

<h3>1. 小数组切换到插入排序</h3>
<p>当子数组大小 \\(\\leq k\\)（通常 \\(k \\approx 10{-}20\\)）时，递归开销大于直接插入排序。因此在递归底部切换到插入排序。</p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Cutoff to Insertion Sort)</div><div class="env-body">
<p><strong>HybridQuicksort(A, lo, hi):</strong></p>
<p>1. 若 \\(hi - lo + 1 \\leq k\\)：InsertionSort(A, lo, hi)</p>
<p>2. 否则：标准快速排序</p>
</div></div>

<h3>2. 三路分区（Dutch National Flag）</h3>
<p>当数组中有大量重复元素时，标准二路分区效率低下。三路分区将数组分为三段：\\(< pivot\\)，\\(= pivot\\)，\\(> pivot\\)。</p>

<div class="env-block algorithm"><div class="env-title">Algorithm (3-Way Partition / Dutch National Flag)</div><div class="env-body">
<p><strong>ThreeWayPartition(A, lo, hi):</strong></p>
<p>1. \\(pivot = A[lo]\\)</p>
<p>2. \\(lt = lo,\\; gt = hi,\\; i = lo\\)</p>
<p>3. While \\(i \\leq gt\\)：</p>
<p>&emsp; 若 \\(A[i] < pivot\\)：swap(\\(A[lt], A[i]\\))；\\(lt{+}{+}\\)；\\(i{+}{+}\\)</p>
<p>&emsp; 若 \\(A[i] > pivot\\)：swap(\\(A[gt], A[i]\\))；\\(gt{-}{-}\\)</p>
<p>&emsp; 否则：\\(i{+}{+}\\)</p>
<p>4. 返回 \\((lt, gt)\\)</p>
<p>递归：Quicksort(A, lo, lt-1) 和 Quicksort(A, gt+1, hi)</p>
</div></div>

<div class="viz-placeholder" data-viz="ch05-viz-three-way"></div>

<h3>3. 尾递归优化</h3>
<p>为了保证栈深度为 \\(O(\\log n)\\)，先递归较小的子数组，然后对较大的子数组用迭代：</p>

<div class="env-block algorithm"><div class="env-title">Algorithm (Tail-Call Optimized QS)</div><div class="env-body">
<p><strong>QuicksortTailOpt(A, lo, hi):</strong></p>
<p>1. While \\(lo < hi\\)：</p>
<p>&emsp; \\(p = \\text{Partition}(A, lo, hi)\\)</p>
<p>&emsp; 若 \\(p - lo < hi - p\\)：</p>
<p>&emsp;&emsp; Quicksort(A, lo, p-1)；\\(lo = p + 1\\)</p>
<p>&emsp; 否则：</p>
<p>&emsp;&emsp; Quicksort(A, p+1, hi)；\\(hi = p - 1\\)</p>
</div></div>

<div class="viz-placeholder" data-viz="ch05-viz-optimizations"></div>

<h3>4. Introsort</h3>
<p>现代标准库（如 C++ STL 的 <code>std::sort</code>）通常使用 <strong>Introsort</strong>：当递归深度超过 \\(2 \\log_2 n\\) 时切换到堆排序，保证 \\(O(n \\log n)\\) 最坏情况。</p>`,
            visualizations: [
                {
                    id: 'ch05-viz-three-way',
                    title: '三路分区演示',
                    description: '展示 Dutch National Flag 三路分区处理重复元素',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 380});
                        var arr = [3, 1, 4, 1, 5, 3, 2, 3, 1, 4];
                        var steps = [];
                        var stepIdx = 0;

                        function recordThreeWay(a) {
                            steps = [];
                            var b = a.slice();
                            var pivot = b[0];
                            var lt = 0, gt = b.length - 1, i = 0;
                            steps.push({arr: b.slice(), lt: lt, gt: gt, i: i, pivot: pivot, msg: 'Init: pivot = ' + pivot});
                            while (i <= gt) {
                                if (b[i] < pivot) {
                                    var tmp = b[lt]; b[lt] = b[i]; b[i] = tmp;
                                    steps.push({arr: b.slice(), lt: lt, gt: gt, i: i, pivot: pivot, msg: 'A[' + i + ']=' + b[lt] + ' < ' + pivot + ', swap to lt'});
                                    lt++;
                                    i++;
                                } else if (b[i] > pivot) {
                                    var tmp2 = b[gt]; b[gt] = b[i]; b[i] = tmp2;
                                    steps.push({arr: b.slice(), lt: lt, gt: gt, i: i, pivot: pivot, msg: 'A[' + i + ']=' + b[gt] + ' > ' + pivot + ', swap to gt'});
                                    gt--;
                                } else {
                                    steps.push({arr: b.slice(), lt: lt, gt: gt, i: i, pivot: pivot, msg: 'A[' + i + ']=' + b[i] + ' == ' + pivot + ', advance i'});
                                    i++;
                                }
                            }
                            steps.push({arr: b.slice(), lt: lt, gt: gt, i: i, pivot: pivot, msg: 'Done: [0..' + (lt - 1) + '] < ' + pivot + ', [' + lt + '..' + gt + '] = ' + pivot + ', [' + (gt + 1) + '..' + (b.length - 1) + '] > ' + pivot});
                        }

                        recordThreeWay(arr);

                        function draw() {
                            viz.clear();
                            var n = arr.length;
                            viz.screenText('3-Way Partition (Dutch National Flag)', 350, 18, viz.colors.white, 15, 'center');

                            var step = stepIdx < steps.length ? steps[stepIdx] : steps[steps.length - 1];
                            var cellW = 50, cellH = 40;
                            var startX = (700 - n * cellW) / 2;

                            var colors = [];
                            var highlights = [];
                            for (var k = 0; k < n; k++) {
                                if (k < step.lt) colors.push(viz.colors.blue + '44');
                                else if (k > step.gt) colors.push(viz.colors.red + '44');
                                else colors.push(viz.colors.green + '22');
                                highlights.push(null);
                            }
                            if (step.i < n) highlights[step.i] = viz.colors.yellow;

                            viz.drawArray(step.arr, startX, 50, cellW, cellH, colors, highlights);

                            // Pointers
                            if (step.lt < n) {
                                viz.drawPointer(startX + step.lt * cellW + cellW / 2, 50 + cellH + 20, 'lt', viz.colors.blue);
                            }
                            if (step.gt < n) {
                                viz.drawPointer(startX + step.gt * cellW + cellW / 2, 50 + cellH + 20, 'gt', viz.colors.red);
                            }
                            if (step.i < n) {
                                viz.drawPointer(startX + step.i * cellW + cellW / 2, 45, 'i', viz.colors.yellow);
                            }

                            viz.screenText(step.msg, 350, 160, viz.colors.yellow, 12, 'center');

                            // Bar chart
                            var barW = 35;
                            var maxH = 120;
                            var barStartX = (700 - n * (barW + 6)) / 2;
                            var barStartY = 320;
                            var maxVal = Math.max.apply(null, step.arr);
                            for (var bi = 0; bi < n; bi++) {
                                var h = (step.arr[bi] / maxVal) * maxH;
                                var px = barStartX + bi * (barW + 6);
                                var py = barStartY - h;
                                var barCol = viz.colors.teal;
                                if (step.arr[bi] < step.pivot) barCol = viz.colors.blue;
                                else if (step.arr[bi] > step.pivot) barCol = viz.colors.red;
                                else barCol = viz.colors.green;
                                viz.ctx.fillStyle = barCol;
                                viz.ctx.fillRect(px, py, barW, h);
                                viz.screenText(String(step.arr[bi]), px + barW / 2, py - 8, viz.colors.white, 11, 'center');
                            }

                            // Legend
                            viz.screenText('< pivot', 150, 350, viz.colors.blue, 11, 'center');
                            viz.screenText('= pivot', 350, 350, viz.colors.green, 11, 'center');
                            viz.screenText('> pivot', 550, 350, viz.colors.red, 11, 'center');

                            viz.screenText('Step ' + (stepIdx + 1) + '/' + steps.length, 350, 375, viz.colors.text, 10, 'center');
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
                        VizEngine.createButton(controls, 'New (with duplicates)', function() {
                            arr = [];
                            var vals = [1, 2, 3, 4, 5];
                            for (var i = 0; i < 10; i++) arr.push(vals[Math.floor(Math.random() * vals.length)]);
                            recordThreeWay(arr);
                            stepIdx = 0;
                            draw();
                        });

                        return viz;
                    }
                },
                {
                    id: 'ch05-viz-optimizations',
                    title: '优化效果对比',
                    description: '比较不同优化策略对快速排序性能的影响',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 380});
                        var n = 1000;

                        function basicQS(a) {
                            var ops = 0;
                            function qs(arr, lo, hi) {
                                if (lo >= hi) return;
                                var pivot = arr[hi], i = lo - 1;
                                for (var j = lo; j < hi; j++) { ops++; if (arr[j] <= pivot) { i++; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; ops++; } }
                                var t2 = arr[i + 1]; arr[i + 1] = arr[hi]; arr[hi] = t2; ops++;
                                qs(arr, lo, i); qs(arr, i + 2, hi);
                            }
                            qs(a, 0, a.length - 1);
                            return ops;
                        }

                        function randomQS(a) {
                            var ops = 0;
                            function qs(arr, lo, hi) {
                                if (lo >= hi) return;
                                var r = lo + Math.floor(Math.random() * (hi - lo + 1));
                                var t0 = arr[r]; arr[r] = arr[hi]; arr[hi] = t0;
                                var pivot = arr[hi], i = lo - 1;
                                for (var j = lo; j < hi; j++) { ops++; if (arr[j] <= pivot) { i++; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; ops++; } }
                                var t2 = arr[i + 1]; arr[i + 1] = arr[hi]; arr[hi] = t2; ops++;
                                qs(arr, lo, i); qs(arr, i + 2, hi);
                            }
                            qs(a, 0, a.length - 1);
                            return ops;
                        }

                        function hybridQS(a) {
                            var ops = 0;
                            function insertionSort(arr, lo, hi) {
                                for (var i = lo + 1; i <= hi; i++) {
                                    var key = arr[i], j = i - 1;
                                    while (j >= lo && arr[j] > key) { arr[j + 1] = arr[j]; j--; ops++; }
                                    arr[j + 1] = key; ops++;
                                }
                            }
                            function qs(arr, lo, hi) {
                                if (hi - lo + 1 <= 16) { insertionSort(arr, lo, hi); return; }
                                var r = lo + Math.floor(Math.random() * (hi - lo + 1));
                                var t0 = arr[r]; arr[r] = arr[hi]; arr[hi] = t0;
                                var pivot = arr[hi], i = lo - 1;
                                for (var j = lo; j < hi; j++) { ops++; if (arr[j] <= pivot) { i++; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; ops++; } }
                                var t2 = arr[i + 1]; arr[i + 1] = arr[hi]; arr[hi] = t2; ops++;
                                qs(arr, lo, i); qs(arr, i + 2, hi);
                            }
                            qs(a, 0, a.length - 1);
                            return ops;
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Quicksort Optimization Comparison (n=' + n + ')', 350, 18, viz.colors.white, 14, 'center');

                            // Generate test array
                            var base = [];
                            for (var i = 0; i < n; i++) base.push(Math.random() * n);

                            var results = [
                                {name: 'Basic QS\n(last element pivot)', ops: basicQS(base.slice()), color: viz.colors.red},
                                {name: 'Randomized QS', ops: randomQS(base.slice()), color: viz.colors.blue},
                                {name: 'Hybrid QS\n(cutoff=16)', ops: hybridQS(base.slice()), color: viz.colors.green}
                            ];

                            var maxOps = 0;
                            for (var r = 0; r < results.length; r++) {
                                if (results[r].ops > maxOps) maxOps = results[r].ops;
                            }

                            var barW = 120, barH = 200;
                            var startX = 120;
                            var startY = 300;
                            var gap = 80;

                            for (var ri = 0; ri < results.length; ri++) {
                                var h = (results[ri].ops / maxOps) * barH;
                                var px = startX + ri * (barW + gap);
                                var py = startY - h;
                                viz.ctx.fillStyle = results[ri].color;
                                viz.ctx.fillRect(px, py, barW, h);
                                viz.ctx.strokeStyle = viz.colors.axis;
                                viz.ctx.lineWidth = 1;
                                viz.ctx.strokeRect(px, py, barW, h);
                                viz.screenText(String(results[ri].ops), px + barW / 2, py - 12, results[ri].color, 12, 'center');
                                var lines = results[ri].name.split('\n');
                                for (var li = 0; li < lines.length; li++) {
                                    viz.screenText(lines[li], px + barW / 2, startY + 15 + li * 16, viz.colors.text, 11, 'center');
                                }
                            }

                            viz.screenText('Operations (comparisons + swaps)', 30, 180, viz.colors.text, 11, 'left');
                        }

                        draw();

                        VizEngine.createButton(controls, 'Re-run', function() { draw(); });
                        VizEngine.createSlider(controls, 'n', 100, 5000, n, 100, function(v) {
                            n = Math.round(v);
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: '对只有 3 种不同值的数组（如 \\([1,2,3,1,2,3,1,2,3]\\)），比较标准快速排序和三路分区快速排序的时间复杂度。',
                    hint: '标准快速排序在有大量重复时会退化。三路分区可以一次将所有等于 pivot 的元素放到正确位置。',
                    solution: '标准快速排序：每次分区最多将一个等于 pivot 的元素放到最终位置。如果有 \\(n/3\\) 个相同元素，这些元素会被反复参与后续分区，总比较次数可达 \\(O(n^2/3)\\) 级别。三路分区快速排序：每次将所有等于 pivot 的元素一次性排除，递归只处理严格 < 和 > 的部分。对 3 种值的情况，只需常数次递归，总时间 \\(O(n)\\)。'
                },
                {
                    question: '为什么在递归底部切换到插入排序比直接递归到单个元素更好？最佳切换阈值 \\(k\\) 大约是多少？',
                    hint: '考虑递归调用的开销和插入排序在小数组上的优势。',
                    solution: '递归调用有固定开销（函数调用、栈帧分配等）。对于小数组，这些开销超过了排序本身的工作量。插入排序对小数组很高效（常数因子小，且对近乎有序的数据特别快）。最佳 \\(k\\) 取决于硬件和实现，通常在 10-20 之间。Java 的 Arrays.sort 使用 47，C++ STL 通常使用 16。'
                },
                {
                    question: 'Introsort 如何结合快速排序、堆排序和插入排序的优点？为什么递归深度阈值设为 \\(2\\log_2 n\\)？',
                    hint: '好的快速排序递归深度应该是多少？',
                    solution: 'Introsort 的策略：(1) 开始用随机化快速排序；(2) 如果递归深度超过 \\(2\\log_2 n\\)，说明 pivot 选择可能不好，切换到堆排序（\\(O(n\\log n)\\) 最坏情况保证）；(3) 对小子数组用插入排序。\\(2\\log_2 n\\) 是因为平衡的快速排序树深度为 \\(\\log_2 n\\)，留 2 倍余量容忍一些不平衡。超过此深度几乎可以确定遇到了退化情况。'
                },
                {
                    question: '快速排序在什么输入上表现最好？什么输入上最差？如何构造一个使确定性快速排序（pivot=A[lo]）退化的输入？',
                    hint: '考虑已排序、逆序和随机输入。',
                    solution: '最好情况：每次 pivot 恰好是中位数，分区完美平衡。随机输入接近此情况。最坏情况（pivot=A[lo]）：已排序或逆序数组，每次 pivot 是极端值，分区极不平衡。构造方法：对 pivot=A[lo]，输入 \\([1,2,3,...,n]\\) 就会导致每次 pivot=当前最小值，一边 0 个元素，另一边 \\(n-1\\) 个，递归深度 \\(n\\)，总比较 \\(n(n-1)/2\\)。'
                }
            ]
        }
    ]
});
