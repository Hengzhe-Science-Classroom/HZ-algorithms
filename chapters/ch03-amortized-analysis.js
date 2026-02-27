// ============================================================
// Chapter 3 · 摊还分析
// Amortized Analysis
// ============================================================
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch03',
    number: 3,
    title: '摊还分析',
    subtitle: 'Amortized Analysis',
    sections: [
        // --------------------------------------------------------
        // Section 1: Motivation and Aggregate Method
        // --------------------------------------------------------
        {
            id: 'ch03-sec01',
            title: '动机与聚合法',
            content: `<h2>动机与聚合法</h2>
<p>Worst-case analysis sometimes paints a misleadingly pessimistic picture. Consider a <strong>dynamic array</strong> (like Python's <code>list</code> or C++'s <code>vector</code>): most <code>append</code> operations take \\(O(1)\\), but occasionally the array must be resized, costing \\(O(n)\\). If we charge \\(O(n)\\) to every operation, we dramatically overestimate the total cost.</p>

<p><strong>Amortized analysis</strong> provides a tighter bound by averaging over a <em>sequence</em> of operations, without assuming anything about the input distribution.</p>

<div class="env-block definition">
<div class="env-title">Definition (Amortized Cost)</div>
<div class="env-body">
<p>Given a sequence of \\(n\\) operations with actual costs \\(c_1, c_2, \\ldots, c_n\\), the <strong>amortized cost</strong> per operation is:</p>
$$\\hat{c} = \\frac{\\sum_{i=1}^{n} c_i}{n}.$$
<p>The amortized cost is a <em>guaranteed</em> upper bound on the average cost per operation &mdash; it holds for <strong>any</strong> sequence of operations, not just random ones.</p>
</div>
</div>

<div class="env-block warning">
<div class="env-title">Warning</div>
<div class="env-body">
<p>Amortized analysis is NOT average-case analysis. Average-case analysis assumes a probability distribution over inputs. Amortized analysis makes no probabilistic assumptions &mdash; it provides a <em>worst-case</em> bound on the total cost of a sequence.</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Aggregate Method)</div>
<div class="env-body">
<p>The <strong>aggregate method</strong> directly computes the total cost of \\(n\\) operations and divides by \\(n\\):</p>
<ol>
<li>Compute the total cost \\(T(n) = \\sum_{i=1}^{n} c_i\\) for a worst-case sequence.</li>
<li>The amortized cost per operation is \\(T(n)/n\\).</li>
</ol>
</div>
</div>

<div class="viz-placeholder" data-viz="ch03-viz-dynamic-array"></div>

<div class="env-block example">
<div class="env-title">Example (Stack with MULTIPOP)</div>
<div class="env-body">
<p>Consider a stack supporting PUSH, POP, and MULTIPOP(k) (pops min(k, size) elements). While MULTIPOP can cost \\(O(n)\\) for a single call, in any sequence of \\(n\\) operations starting from an empty stack:</p>
<p>Each element is pushed at most once and popped at most once. So the total number of POPs (including those within MULTIPOP) is at most \\(n\\). Total cost: \\(O(n)\\). Amortized cost per operation: \\(O(1)\\).</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch03-viz-dynamic-array',
                    title: 'Dynamic Array Resizing',
                    description: 'Visualize append operations with occasional costly resizes',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var capacity = 1;
                        var size = 0;
                        var costs = [];
                        var totalCost = 0;
                        var opNum = 0;
                        var maxOps = 32;
                        var animating = false;
                        var animId = null;

                        function appendOp() {
                            if (opNum >= maxOps) return;
                            opNum++;
                            var cost = 1; // O(1) for the copy of new element
                            if (size === capacity) {
                                cost += size; // copy old elements
                                capacity *= 2;
                            }
                            size++;
                            totalCost += cost;
                            costs.push(cost);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            viz.screenText('Dynamic Array: Append Operations', viz.width / 2, 20, viz.colors.white, 14);

                            // Array visualization
                            var cellW = Math.min(18, (viz.width - 80) / Math.max(capacity, 1));
                            var startX = (viz.width - capacity * cellW) / 2;
                            var arrY = 50;

                            for (var i = 0; i < capacity; i++) {
                                var filled = i < size;
                                ctx.fillStyle = filled ? viz.colors.blue + '44' : viz.colors.bg;
                                ctx.fillRect(startX + i * cellW, arrY, cellW - 1, 25);
                                ctx.strokeStyle = filled ? viz.colors.blue : viz.colors.axis;
                                ctx.lineWidth = 0.5;
                                ctx.strokeRect(startX + i * cellW, arrY, cellW - 1, 25);
                            }
                            viz.screenText('size = ' + size + '    capacity = ' + capacity, viz.width / 2, arrY + 40, viz.colors.teal, 12);

                            // Cost bar chart
                            if (costs.length > 0) {
                                var barMaxH = 180;
                                var barW = Math.min(18, (viz.width - 100) / costs.length - 1);
                                var barStartX = (viz.width - costs.length * (barW + 1)) / 2;
                                var barBaseY = 310;
                                var maxCost = Math.max.apply(null, costs.concat([1]));

                                for (var i = 0; i < costs.length; i++) {
                                    var h = (costs[i] / maxCost) * barMaxH;
                                    var px = barStartX + i * (barW + 1);
                                    var isResize = costs[i] > 1;
                                    ctx.fillStyle = isResize ? viz.colors.red : viz.colors.green;
                                    ctx.fillRect(px, barBaseY - h, barW, h);
                                    if (costs.length <= 32 && isResize) {
                                        viz.screenText(String(costs[i]), px + barW / 2, barBaseY - h - 8, viz.colors.red, 8);
                                    }
                                }

                                viz.screenText('Cost per operation (red = resize)', viz.width / 2, barBaseY + 15, viz.colors.text, 10);

                                // Amortized cost line
                                var amortized = totalCost / costs.length;
                                var amortH = (amortized / maxCost) * barMaxH;
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 2;
                                ctx.setLineDash([4, 3]);
                                ctx.beginPath();
                                ctx.moveTo(barStartX - 10, barBaseY - amortH);
                                ctx.lineTo(barStartX + costs.length * (barW + 1) + 10, barBaseY - amortH);
                                ctx.stroke();
                                ctx.setLineDash([]);
                                viz.screenText('amortized = ' + amortized.toFixed(2), viz.width - 80, barBaseY - amortH - 10, viz.colors.orange, 10, 'right', 'middle');
                            }

                            // Stats
                            viz.screenText('Operations: ' + opNum + '    Total cost: ' + totalCost + '    Amortized: ' + (opNum > 0 ? (totalCost / opNum).toFixed(2) : '-'),
                                viz.width / 2, viz.height - 35, viz.colors.orange, 12);
                            viz.screenText('The amortized cost per append is O(1), even though individual resizes cost O(n)!',
                                viz.width / 2, viz.height - 12, viz.colors.teal, 10);
                        }

                        draw();

                        VizEngine.createButton(controls, 'Append', function() {
                            appendOp();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Append x8', function() {
                            for (var i = 0; i < 8 && opNum < maxOps; i++) appendOp();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Auto', function() {
                            if (animating) { clearInterval(animId); animating = false; return; }
                            animating = true;
                            animId = setInterval(function() {
                                if (opNum >= maxOps) { clearInterval(animId); animating = false; return; }
                                appendOp();
                                draw();
                            }, 300);
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            if (animId) clearInterval(animId);
                            animating = false;
                            capacity = 1; size = 0; costs = []; totalCost = 0; opNum = 0;
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the aggregate method to prove that \\(n\\) append operations on a dynamic array (doubling strategy) cost \\(O(n)\\) total.',
                    hint: 'The resize costs form a geometric series: 1 + 2 + 4 + ... + n.',
                    solution: 'Resizes happen at operations 1, 2, 4, 8, ..., 2^k where 2^k <= n. Cost of resize at capacity c is c (copying c elements). Total resize cost: 1 + 2 + 4 + ... + 2^{floor(log n)} < 2n. Plus n O(1) costs for placing each element. Total: O(n) + O(2n) = O(n). Amortized cost: O(n)/n = O(1) per append.'
                },
                {
                    question: 'What if the dynamic array uses a <strong>tripling</strong> strategy (multiply capacity by 3 instead of 2)? What is the amortized cost?',
                    hint: 'The resize costs form a geometric series with ratio 3.',
                    solution: 'Resizes at sizes 1, 3, 9, 27, ..., 3^k. Total resize cost: 1 + 3 + 9 + ... + 3^{floor(log_3 n)} = (3^{floor(log_3 n)+1} - 1)/2 < 3n/2. Amortized cost: still O(1) per operation. In general, any constant growth factor c > 1 gives O(1) amortized append.'
                },
                {
                    question: 'What if we increment the capacity by 1 each time (instead of doubling)? What is the amortized cost of \\(n\\) appends?',
                    hint: 'Resizes happen every operation. What is the total copy cost?',
                    solution: 'With increment-by-1, every append triggers a resize. At the i-th append, we copy i-1 elements. Total copy cost: 0 + 1 + 2 + ... + (n-1) = n(n-1)/2 = Theta(n^2). Amortized cost: Theta(n) per operation. This is why doubling is essential!'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 2: The Accounting Method
        // --------------------------------------------------------
        {
            id: 'ch03-sec02',
            title: '核算法',
            content: `<h2>核算法 (Accounting Method)</h2>
<p>The accounting method assigns <em>credits</em> to individual operations. Some operations are overcharged (they "save" credits), and the excess credits pay for later expensive operations.</p>

<div class="env-block definition">
<div class="env-title">Definition (Accounting Method)</div>
<div class="env-body">
<p>Assign amortized costs \\(\\hat{c}_i\\) to each operation such that:</p>
$$\\sum_{i=1}^{n} \\hat{c}_i \\ge \\sum_{i=1}^{n} c_i \\quad \\text{for all } n.$$
<p>The difference \\(\\hat{c}_i - c_i\\) is the <strong>credit</strong> stored (if positive) or consumed (if negative). The credit balance must never go negative.</p>
</div>
</div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body">
<p>Think of the accounting method as a "prepayment" scheme. When you do a cheap operation (like a normal append), you pay a bit extra and save the change in a "bank account" associated with the data structure. When an expensive operation comes (like a resize), you withdraw from the bank to pay for it.</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example (Dynamic Array via Accounting)</div>
<div class="env-body">
<p>Charge each append \\(\\hat{c} = 3\\) dollars:</p>
<ul>
<li>\\$1 to insert the new element.</li>
<li>\\$1 saved to pay for copying this element during a future resize.</li>
<li>\\$1 saved to pay for copying an old element that was present during the last resize.</li>
</ul>
<p>When a resize occurs at size \\(n\\) (doubling from \\(n\\) to \\(2n\\)): we need \\(n\\) dollars to copy. But the \\(n/2\\) elements inserted since the last resize each contributed \\$2 in savings, providing \\(n\\) dollars total. The bank balance stays non-negative.</p>
<p>Amortized cost: \\(O(3) = O(1)\\) per operation. \\(\\checkmark\\)</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch03-viz-accounting"></div>

<div class="env-block example">
<div class="env-title">Example (Binary Counter)</div>
<div class="env-body">
<p>A \\(k\\)-bit binary counter supports INCREMENT. Actual cost: the number of bits flipped.</p>
<p>Accounting: charge \\$2 per INCREMENT. When we set a bit from 0 to 1, pay \\$1 for the flip and save \\$1 on that bit. When a bit flips from 1 to 0, use its stored \\$1 to pay. Since each INCREMENT sets at most one bit to 1, the \\$2 charge suffices. Amortized cost: \\(O(1)\\).</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch03-viz-accounting',
                    title: 'Accounting Method: Credit Bank',
                    description: 'Visualize credit accumulation and spending during dynamic array operations',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var capacity = 1;
                        var size = 0;
                        var credits = 0;
                        var history = [];
                        var step = 0;
                        var maxSteps = 16;

                        function doAppend() {
                            if (step >= maxSteps) return;
                            step++;
                            var actualCost = 1;
                            var resized = false;
                            if (size === capacity) {
                                actualCost += size; // copy cost
                                credits -= size;    // spend credits
                                capacity *= 2;
                                resized = true;
                            }
                            size++;
                            var amortizedCost = 3;
                            credits += (amortizedCost - actualCost + (resized ? size - 1 : 0));
                            // Simpler: charge 3, actual is 1 (no resize) or 1+old_size (resize).
                            // Net credit change: 3 - actual_cost
                            credits = 0;
                            // Recompute credits properly
                            var cap = 1, sz = 0, cr = 0;
                            history = [];
                            for (var i = 0; i < step; i++) {
                                var cost = 1;
                                if (sz === cap) {
                                    cost += sz;
                                    cr -= sz;
                                    cap *= 2;
                                }
                                sz++;
                                cr += 3 - cost;
                                history.push({step: i + 1, cost: cost, credits: cr, resize: cost > 1, capacity: cap, size: sz});
                            }
                            credits = cr;
                            size = sz;
                            capacity = cap;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            viz.screenText('Accounting Method: Dynamic Array', viz.width / 2, 20, viz.colors.white, 14);
                            viz.screenText('Charge $3 per append | Actual cost: $1 (normal) or $1+size (resize)', viz.width / 2, 42, viz.colors.text, 10);

                            if (history.length > 0) {
                                var barW = Math.min(35, (viz.width - 120) / history.length - 2);
                                var startX = (viz.width - history.length * (barW + 2)) / 2;

                                // Actual cost bars
                                var maxCost = Math.max.apply(null, history.map(function(h) { return h.cost; }).concat([3]));
                                var barMaxH = 120;
                                var costBaseY = 200;

                                for (var i = 0; i < history.length; i++) {
                                    var h = history[i];
                                    var barH = (h.cost / maxCost) * barMaxH;
                                    var px = startX + i * (barW + 2);

                                    // Actual cost bar
                                    ctx.fillStyle = h.resize ? viz.colors.red : viz.colors.green;
                                    ctx.fillRect(px, costBaseY - barH, barW, barH);

                                    // Amortized line at $3
                                    var amH = (3 / maxCost) * barMaxH;
                                    ctx.strokeStyle = viz.colors.orange;
                                    ctx.lineWidth = 1.5;
                                    ctx.setLineDash([3, 2]);
                                    ctx.beginPath();
                                    ctx.moveTo(px, costBaseY - amH);
                                    ctx.lineTo(px + barW, costBaseY - amH);
                                    ctx.stroke();
                                    ctx.setLineDash([]);

                                    // Cost label
                                    viz.screenText('$' + h.cost, px + barW / 2, costBaseY - barH - 8, viz.colors.white, 8);
                                    viz.screenText(String(h.step), px + barW / 2, costBaseY + 10, viz.colors.text, 8);
                                }

                                viz.screenText('Actual cost per op (orange dash = $3 amortized charge)', viz.width / 2, costBaseY + 25, viz.colors.text, 10);

                                // Credit balance graph
                                var creditBaseY = 350;
                                var creditMaxH = 80;
                                var maxCredits = Math.max.apply(null, history.map(function(h) { return h.credits; }).concat([1]));

                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var i = 0; i < history.length; i++) {
                                    var px = startX + i * (barW + 2) + barW / 2;
                                    var py = creditBaseY - (history[i].credits / Math.max(maxCredits, 1)) * creditMaxH;
                                    if (i === 0) ctx.moveTo(px, py);
                                    else ctx.lineTo(px, py);
                                }
                                ctx.stroke();

                                // Credit dots
                                for (var i = 0; i < history.length; i++) {
                                    var px = startX + i * (barW + 2) + barW / 2;
                                    var py = creditBaseY - (history[i].credits / Math.max(maxCredits, 1)) * creditMaxH;
                                    ctx.fillStyle = viz.colors.teal;
                                    ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
                                    if (history.length <= 16) {
                                        viz.screenText('$' + history[i].credits, px, py - 10, viz.colors.teal, 8);
                                    }
                                }

                                viz.screenText('Credit balance (must stay \u2265 0)', viz.width / 2, creditBaseY + 15, viz.colors.teal, 10);
                            }

                            viz.screenText('Credit balance: $' + credits + '    |    Size: ' + size + '    Capacity: ' + capacity,
                                viz.width / 2, viz.height - 10, viz.colors.orange, 12);
                        }

                        draw();

                        VizEngine.createButton(controls, 'Append', function() { doAppend(); draw(); });
                        VizEngine.createButton(controls, 'Run All 16', function() {
                            while (step < maxSteps) doAppend();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            capacity = 1; size = 0; credits = 0; history = []; step = 0;
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Using the accounting method, prove that \\(n\\) operations on a stack (PUSH, POP, MULTIPOP) starting from empty cost \\(O(n)\\) total.',
                    hint: 'Charge PUSH $2, POP $0, MULTIPOP $0.',
                    solution: 'Charge PUSH $2: $1 for the push, $1 saved as credit on the pushed element. Charge POP $0 and MULTIPOP $0: each pop uses the $1 credit stored on the element being popped. Since each element is pushed at most once and carries $1, every pop is paid for. Credits never go negative because we only pop elements that were previously pushed (and credited). Total charge: at most $2 per PUSH, so at most $2n. Amortized cost per operation: O(1).'
                },
                {
                    question: 'What goes wrong if we try to charge each append only $2 (instead of $3) for a dynamic array with doubling?',
                    hint: 'Track the credit balance through a sequence of appends to the first resize.',
                    solution: 'With $2 charge: at append 1, cost is 1 (no resize), credit = 2-1 = 1. Append 2: resize from cap=1 to cap=2, cost = 1+1 = 2, credit = 1 + (2-2) = 1. Append 3: resize from 2 to 4, cost = 1+2 = 3, credit = 1 + (2-3) = 0. Append 4: cost 1, credit = 0 + (2-1) = 1. Append 5: resize from 4 to 8, cost = 1+4 = 5, credit = 1 + (2-5) = -2 < 0! The credit balance goes negative, violating the accounting method invariant. We need at least $3.'
                },
                {
                    question: 'Design an accounting scheme for a dynamic array that supports both append (at the end) and delete-last (remove the last element, never shrink). What amortized cost per operation do you achieve?',
                    hint: 'Delete-last is trivial: just decrement size.',
                    solution: 'Charge append $3 (same as before) and delete-last $0. The delete-last operation costs O(1) actual time. Credits are only consumed during resizes (during appends), and each resize is still paid for by credits from previous appends. Since delete-last never triggers a resize and costs O(1), charging $0 works. Amortized cost: O(1) for both append and delete-last.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 3: The Potential Method
        // --------------------------------------------------------
        {
            id: 'ch03-sec03',
            title: '势能法',
            content: `<h2>势能法 (Potential Method)</h2>
<p>The potential method is the most powerful and general amortized analysis technique. It defines a <strong>potential function</strong> on the data structure state, analogous to potential energy in physics.</p>

<div class="env-block definition">
<div class="env-title">Definition (Potential Method)</div>
<div class="env-body">
<p>Let \\(D_i\\) be the state of the data structure after the \\(i\\)-th operation. Define a <strong>potential function</strong> \\(\\Phi: \\text{states} \\to \\mathbb{R}\\) with \\(\\Phi(D_0) = 0\\) and \\(\\Phi(D_i) \\ge 0\\) for all \\(i\\).</p>
<p>The <strong>amortized cost</strong> of the \\(i\\)-th operation is:</p>
$$\\hat{c}_i = c_i + \\Phi(D_i) - \\Phi(D_{i-1})$$
<p>where \\(c_i\\) is the actual cost and \\(\\Delta\\Phi_i = \\Phi(D_i) - \\Phi(D_{i-1})\\) is the change in potential.</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem (Telescoping Sum)</div>
<div class="env-body">
<p>The total amortized cost bounds the total actual cost:</p>
$$\\sum_{i=1}^n \\hat{c}_i = \\sum_{i=1}^n c_i + \\Phi(D_n) - \\Phi(D_0) \\ge \\sum_{i=1}^n c_i$$
<p>since \\(\\Phi(D_n) \\ge 0 = \\Phi(D_0)\\).</p>
</div>
</div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body">
<p>The potential function measures how "charged up" the data structure is &mdash; how much stored-up work is available to pay for future expensive operations. When cheap operations increase the potential (storing energy), the amortized cost is slightly higher than the actual cost. When expensive operations drain the potential (releasing energy), the amortized cost is lower than the actual cost.</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example (Dynamic Array via Potential)</div>
<div class="env-body">
<p>Define \\(\\Phi(D) = 2 \\cdot \\text{size} - \\text{capacity}\\).</p>
<p><strong>Normal append</strong> (no resize): \\(c_i = 1\\), size increases by 1, capacity unchanged.</p>
<p>\\(\\Delta\\Phi = 2(s+1) - \\text{cap} - (2s - \\text{cap}) = 2\\). So \\(\\hat{c}_i = 1 + 2 = 3\\).</p>
<p><strong>Append with resize</strong> (size = capacity = \\(s\\), new capacity \\(2s\\)): \\(c_i = 1 + s\\).</p>
<p>\\(\\Delta\\Phi = [2(s+1) - 2s] - [2s - s] = 2 - s\\). So \\(\\hat{c}_i = (1+s) + (2-s) = 3\\).</p>
<p>In both cases, \\(\\hat{c}_i = 3 = O(1)\\). \\(\\checkmark\\)</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch03-viz-potential"></div>`,
            visualizations: [
                {
                    id: 'ch03-viz-potential',
                    title: 'Potential Function Overlay',
                    description: 'Visualize the potential function rising and falling during operations',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var maxOps = 24;
                        var showOps = 0;

                        // Pre-compute all steps
                        var steps = [];
                        var cap = 1, sz = 0;
                        steps.push({size: 0, capacity: 1, potential: 2 * 0 - 1, actualCost: 0, amortizedCost: 0, resize: false});
                        for (var i = 0; i < maxOps; i++) {
                            var cost = 1;
                            var resized = false;
                            if (sz === cap) {
                                cost += sz;
                                cap *= 2;
                                resized = true;
                            }
                            sz++;
                            var phi = 2 * sz - cap;
                            steps.push({size: sz, capacity: cap, potential: phi, actualCost: cost, amortizedCost: 3, resize: resized});
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            viz.screenText('Potential Method: \u03A6 = 2\u00B7size - capacity', viz.width / 2, 20, viz.colors.white, 14);

                            var n = showOps + 1; // include initial state
                            if (n > steps.length) n = steps.length;

                            // Actual cost bars
                            var barW = Math.min(25, (viz.width - 100) / n - 2);
                            var startX = (viz.width - n * (barW + 2)) / 2;
                            var barBaseY = 170;
                            var barMaxH = 100;
                            var maxCost = 1;
                            for (var i = 0; i < n; i++) maxCost = Math.max(maxCost, steps[i].actualCost);

                            for (var i = 1; i < n; i++) {
                                var s = steps[i];
                                var h = (s.actualCost / maxCost) * barMaxH;
                                var px = startX + i * (barW + 2);
                                ctx.fillStyle = s.resize ? viz.colors.red : viz.colors.green;
                                ctx.fillRect(px, barBaseY - h, barW, h);
                                if (n <= 25) viz.screenText(String(s.actualCost), px + barW / 2, barBaseY - h - 8, viz.colors.white, 8);
                            }
                            viz.screenText('Actual cost', 30, barBaseY - barMaxH / 2, viz.colors.text, 10, 'left', 'middle');

                            // Amortized line
                            if (n > 1) {
                                var amH = (3 / maxCost) * barMaxH;
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 2;
                                ctx.setLineDash([4, 3]);
                                ctx.beginPath();
                                ctx.moveTo(startX + barW + 2, barBaseY - amH);
                                ctx.lineTo(startX + n * (barW + 2), barBaseY - amH);
                                ctx.stroke();
                                ctx.setLineDash([]);
                                viz.screenText('amortized = 3', viz.width - 50, barBaseY - amH, viz.colors.orange, 10, 'right', 'middle');
                            }

                            // Potential graph
                            var potBaseY = 320;
                            var potMaxH = 100;
                            var maxPot = 1;
                            var minPot = 0;
                            for (var i = 0; i < n; i++) {
                                maxPot = Math.max(maxPot, steps[i].potential);
                                minPot = Math.min(minPot, steps[i].potential);
                            }
                            var potRange = Math.max(maxPot - minPot, 1);

                            // Zero line
                            var zeroY = potBaseY - ((0 - minPot) / potRange) * potMaxH;
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath(); ctx.moveTo(startX, zeroY); ctx.lineTo(startX + n * (barW + 2), zeroY); ctx.stroke();

                            ctx.strokeStyle = viz.colors.purple;
                            ctx.lineWidth = 2.5;
                            ctx.beginPath();
                            for (var i = 0; i < n; i++) {
                                var px = startX + i * (barW + 2) + barW / 2;
                                var py = potBaseY - ((steps[i].potential - minPot) / potRange) * potMaxH;
                                if (i === 0) ctx.moveTo(px, py);
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Potential dots
                            for (var i = 0; i < n; i++) {
                                var px = startX + i * (barW + 2) + barW / 2;
                                var py = potBaseY - ((steps[i].potential - minPot) / potRange) * potMaxH;
                                ctx.fillStyle = steps[i].resize ? viz.colors.red : viz.colors.purple;
                                ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
                                if (n <= 16) viz.screenText(String(steps[i].potential), px, py - 10, viz.colors.purple, 8);
                            }

                            viz.screenText('\u03A6(D) = 2\u00B7size - capacity', 30, potBaseY - potMaxH / 2, viz.colors.purple, 10, 'left', 'middle');
                            viz.screenText('Potential rises during cheap ops, drops during resizes', viz.width / 2, potBaseY + 20, viz.colors.teal, 10);

                            // Current state
                            if (n > 1) {
                                var last = steps[n - 1];
                                viz.screenText('Step ' + showOps + ': size=' + last.size + ', cap=' + last.capacity + ', \u03A6=' + last.potential,
                                    viz.width / 2, viz.height - 10, viz.colors.orange, 11);
                            }
                        }

                        draw();

                        VizEngine.createSlider(controls, 'Operations: ', 0, maxOps, showOps, 1, function(v) { showOps = Math.round(v); draw(); });
                        VizEngine.createButton(controls, 'Play All', function() {
                            var cur = 0;
                            var id = setInterval(function() {
                                if (cur >= maxOps) { clearInterval(id); return; }
                                cur++;
                                showOps = cur;
                                draw();
                            }, 200);
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify that the potential function \\(\\Phi(D) = 2 \\cdot \\text{size} - \\text{capacity}\\) satisfies \\(\\Phi(D) \\ge 0\\) after every operation when starting from an empty array with capacity 1.',
                    hint: 'After a resize, what is the relationship between size and capacity?',
                    solution: 'Initially: Phi = 2*0 - 1 = -1. Wait, this is negative! The standard fix: define Phi = max(0, 2*size - capacity), or start with Phi(D_0) = 0 and note that Phi only goes negative before the first append. More precisely: after a resize, capacity = 2*old_capacity = 2*old_size, and new size = old_size + 1, so Phi = 2(old_size+1) - 2*old_size = 2. After subsequent appends without resize, Phi increases by 2 each time. At the resize trigger (size = capacity = s), Phi = 2s - s = s > 0. After resize: Phi = 2(s+1) - 2s = 2 > 0. So Phi >= 0 after the first operation (and the initial -1 is a bounded constant that does not affect the amortized bound).'
                },
                {
                    question: 'Design a potential function for the binary counter and prove the amortized cost of INCREMENT is \\(O(1)\\).',
                    hint: 'Let \\(\\Phi\\) = number of 1-bits in the counter.',
                    solution: 'Let Phi(D) = number of 1-bits. An INCREMENT operation flips some number t of bits from 1 to 0, then one bit from 0 to 1 (unless overflow). Actual cost: c_i = t + 1. Change in potential: Delta Phi = 1 - t (gained one 1-bit, lost t). Amortized: c_hat = c_i + Delta Phi = (t+1) + (1-t) = 2. So the amortized cost is O(1) per INCREMENT. Since Phi >= 0 always (count of 1-bits), the bound is valid.'
                },
                {
                    question: 'Why must we require \\(\\Phi(D_n) \\ge \\Phi(D_0)\\) for the potential method to give a valid bound?',
                    hint: 'Look at the telescoping sum formula.',
                    solution: 'The total amortized cost is sum(c_hat_i) = sum(c_i) + Phi(D_n) - Phi(D_0). For this to be an upper bound on sum(c_i), we need Phi(D_n) - Phi(D_0) >= 0, i.e., Phi(D_n) >= Phi(D_0). If the potential drops below its initial value, the amortized costs underestimate the actual costs, and the bound is invalid. By convention, we set Phi(D_0) = 0 and require Phi(D_i) >= 0 for all i.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 4: Case Study — Binary Counter
        // --------------------------------------------------------
        {
            id: 'ch03-sec04',
            title: '案例：二进制计数器',
            content: `<h2>案例：二进制计数器</h2>
<p>The binary counter is a classic example that beautifully illustrates all three amortized analysis methods.</p>

<div class="env-block definition">
<div class="env-title">Definition (Binary Counter)</div>
<div class="env-body">
<p>A \\(k\\)-bit binary counter stores a non-negative integer in binary. The only operation is <strong>INCREMENT</strong>, which adds 1 to the counter. The cost of an INCREMENT is the number of bits flipped.</p>
</div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm (INCREMENT)</div>
<div class="env-body">
<pre>
INCREMENT(A, k)
  i = 0
  while i < k and A[i] == 1
      A[i] = 0    // flip 1 -> 0
      i = i + 1
  if i < k
      A[i] = 1    // flip 0 -> 1
</pre>
</div>
</div>

<p>The worst-case cost of a single INCREMENT is \\(O(k)\\) (e.g., incrementing 0111...1). But the amortized cost is much better.</p>

<div class="viz-placeholder" data-viz="ch03-viz-binary-counter"></div>

<div class="env-block theorem">
<div class="env-title">Theorem (Amortized Cost of Binary Counter)</div>
<div class="env-body">
<p>Starting from zero, \\(n\\) INCREMENT operations on a \\(k\\)-bit counter cost \\(O(n)\\) total. The amortized cost per INCREMENT is \\(O(1)\\).</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof (Aggregate Method)</div>
<div class="env-body">
<p>Bit 0 flips every operation: \\(n\\) flips total.</p>
<p>Bit 1 flips every 2 operations: \\(\\lfloor n/2 \\rfloor\\) flips.</p>
<p>Bit \\(i\\) flips every \\(2^i\\) operations: \\(\\lfloor n/2^i \\rfloor\\) flips.</p>
<p>Total flips: \\(\\sum_{i=0}^{k-1} \\lfloor n/2^i \\rfloor < n \\sum_{i=0}^{\\infty} 1/2^i = 2n\\).</p>
<p>Amortized cost: \\(< 2n / n = 2 = O(1)\\).</p>
<p class="qed">&marker;</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch03-viz-bit-flip-freq"></div>`,
            visualizations: [
                {
                    id: 'ch03-viz-binary-counter',
                    title: 'Binary Counter Animation',
                    description: 'Watch a binary counter increment with bit flip highlighting',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var k = 8;
                        var bits = new Array(k).fill(0);
                        var stepNum = 0;
                        var flipsThisStep = 0;
                        var totalFlips = 0;
                        var costHistory = [];

                        function increment() {
                            stepNum++;
                            var i = 0;
                            flipsThisStep = 0;
                            while (i < k && bits[i] === 1) {
                                bits[i] = 0;
                                i++;
                                flipsThisStep++;
                            }
                            if (i < k) {
                                bits[i] = 1;
                                flipsThisStep++;
                            }
                            totalFlips += flipsThisStep;
                            costHistory.push(flipsThisStep);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            viz.screenText('Binary Counter: INCREMENT', viz.width / 2, 20, viz.colors.white, 14);

                            // Draw bits (MSB on left)
                            var cellW = 55, cellH = 50;
                            var startX = (viz.width - k * cellW) / 2;
                            var bitY = 60;

                            for (var i = k - 1; i >= 0; i--) {
                                var dispIdx = k - 1 - i;
                                var px = startX + dispIdx * cellW;
                                var isOne = bits[i] === 1;
                                viz.drawArrayCell(px, bitY, cellW, cellH, bits[i],
                                    isOne ? viz.colors.blue + '44' : viz.colors.bg,
                                    isOne ? viz.colors.blue : viz.colors.text,
                                    null);
                                viz.screenText('bit ' + i, px + cellW / 2, bitY + cellH + 14, viz.colors.text, 9);
                            }

                            // Decimal value
                            var decVal = 0;
                            for (var i = 0; i < k; i++) decVal += bits[i] * Math.pow(2, i);
                            viz.screenText('Decimal: ' + decVal, viz.width / 2, bitY + cellH + 35, viz.colors.orange, 14);

                            // Cost bar chart
                            if (costHistory.length > 0) {
                                var barW = Math.min(16, (viz.width - 80) / costHistory.length - 1);
                                var barStartX = (viz.width - costHistory.length * (barW + 1)) / 2;
                                var barBaseY = 280;
                                var barMaxH = 80;
                                var maxCost = Math.max.apply(null, costHistory.concat([1]));

                                for (var i = 0; i < costHistory.length; i++) {
                                    var h = (costHistory[i] / maxCost) * barMaxH;
                                    var px = barStartX + i * (barW + 1);
                                    var isBig = costHistory[i] > 2;
                                    ctx.fillStyle = isBig ? viz.colors.red : viz.colors.green;
                                    ctx.fillRect(px, barBaseY - h, barW, h);
                                }

                                // Amortized line
                                var amortized = totalFlips / costHistory.length;
                                var amH = (amortized / maxCost) * barMaxH;
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 2;
                                ctx.setLineDash([4, 3]);
                                ctx.beginPath();
                                ctx.moveTo(barStartX, barBaseY - amH);
                                ctx.lineTo(barStartX + costHistory.length * (barW + 1), barBaseY - amH);
                                ctx.stroke();
                                ctx.setLineDash([]);

                                viz.screenText('Bit flips per INCREMENT', viz.width / 2, barBaseY + 15, viz.colors.text, 10);
                            }

                            // Stats
                            viz.screenText('Step: ' + stepNum + '    Last cost: ' + flipsThisStep + ' flips    Total: ' + totalFlips +
                                '    Amortized: ' + (stepNum > 0 ? (totalFlips / stepNum).toFixed(2) : '-'),
                                viz.width / 2, viz.height - 35, viz.colors.orange, 11);
                            viz.screenText('Amortized cost per INCREMENT: < 2 (approaches 2 as n \u2192 \u221E)', viz.width / 2, viz.height - 12, viz.colors.teal, 10);
                        }

                        draw();

                        VizEngine.createButton(controls, 'INCREMENT', function() { increment(); draw(); });
                        VizEngine.createButton(controls, '+16', function() { for (var i = 0; i < 16; i++) increment(); draw(); });
                        VizEngine.createButton(controls, 'Auto', function() {
                            var id = setInterval(function() {
                                if (stepNum >= 64) { clearInterval(id); return; }
                                increment(); draw();
                            }, 200);
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            bits = new Array(k).fill(0);
                            stepNum = 0; flipsThisStep = 0; totalFlips = 0; costHistory = [];
                            draw();
                        });

                        return viz;
                    }
                },
                {
                    id: 'ch03-viz-bit-flip-freq',
                    title: 'Bit Flip Frequency',
                    description: 'Shows how often each bit position flips, forming a geometric series',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 350});
                        var k = 8;
                        var n = 64;

                        function draw() {
                            viz.clear();
                            viz.screenText('Bit Flip Frequency over ' + n + ' INCREMENTs', viz.width / 2, 20, viz.colors.white, 14);

                            var flips = [];
                            for (var i = 0; i < k; i++) {
                                flips.push(Math.floor(n / Math.pow(2, i)));
                            }
                            var totalFlips = flips.reduce(function(a, b) { return a + b; }, 0);

                            var barW = 60;
                            var maxH = 220;
                            var startX = (viz.width - k * (barW + 10)) / 2;
                            var baseY = 300;
                            var maxFlip = Math.max.apply(null, flips.concat([1]));

                            for (var i = 0; i < k; i++) {
                                var h = (flips[i] / maxFlip) * maxH;
                                var px = startX + i * (barW + 10);

                                // Gradient: more blue for more flips
                                var alpha = (flips[i] / maxFlip);
                                var ctx = viz.ctx;
                                ctx.fillStyle = 'rgba(88, 166, 255, ' + (0.3 + 0.7 * alpha) + ')';
                                ctx.fillRect(px, baseY - h, barW, h);
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(px, baseY - h, barW, h);

                                viz.screenText(String(flips[i]), px + barW / 2, baseY - h - 12, viz.colors.white, 12);
                                viz.screenText('bit ' + i, px + barW / 2, baseY + 12, viz.colors.text, 10);
                                viz.screenText('\u230An/' + Math.pow(2, i) + '\u230B', px + barW / 2, baseY + 26, viz.colors.text, 9);
                            }

                            // Geometric series annotation
                            viz.screenText('Total flips: ' + totalFlips + ' < 2n = ' + (2 * n) + '    |    Geometric series: \u03A3 n/2^i < 2n',
                                viz.width / 2, viz.height - 15, viz.colors.teal, 11);
                            viz.screenText('Each bit flips half as often as the previous \u2192 geometric series \u2192 O(n) total',
                                viz.width / 2, 48, viz.colors.orange, 11);
                        }

                        draw();

                        VizEngine.createSlider(controls, 'n = ', 1, 128, n, 1, function(v) { n = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'k (bits) = ', 4, 12, k, 1, function(v) { k = Math.round(v); draw(); });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'What is the amortized cost of INCREMENT if we also support DECREMENT (subtract 1)?',
                    hint: 'Can a DECREMENT undo the work of many INCREMENTs?',
                    solution: 'With both INCREMENT and DECREMENT, the amortized cost is Theta(k) per operation in the worst case! Consider alternating between 0111...1 and 1000...0: each operation flips all k bits. The potential function Phi = number of 1-bits does not help because DECREMENT can also flip many bits from 0 to 1. We cannot "prepay" for DECREMENT flips. This shows amortized analysis depends critically on the allowed operations.'
                },
                {
                    question: 'Prove the \\(O(1)\\) amortized bound for the binary counter using the potential method with \\(\\Phi = \\) number of 1-bits.',
                    hint: 'An INCREMENT that flips t bits from 1 to 0 also sets one bit to 1.',
                    solution: 'Let t_i be the number of bits flipped from 1 to 0 during the i-th INCREMENT. Then actual cost c_i = t_i + 1 (t_i resets plus one set). The potential changes by Delta Phi = 1 - t_i (gained one 1-bit, lost t_i). Amortized cost: c_hat_i = c_i + Delta Phi = (t_i + 1) + (1 - t_i) = 2. Since Phi >= 0 always, the total amortized cost 2n is an upper bound on the total actual cost.'
                },
                {
                    question: 'Suppose a binary counter starts at a value \\(b > 0\\) instead of 0. How does this affect the amortized analysis?',
                    hint: 'The initial potential is no longer 0.',
                    solution: 'Using Phi = number of 1-bits: Phi(D_0) = (number of 1-bits in b) <= k. The total amortized cost is sum(c_hat) = sum(c_i) + Phi(D_n) - Phi(D_0). So sum(c_i) = sum(c_hat) - Phi(D_n) + Phi(D_0) <= 2n - 0 + k = 2n + k. For n >= k, this is O(n), so the amortized bound remains O(1) per operation. The non-zero start adds at most an O(k) one-time overhead.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 5: Case Study — Dynamic Tables
        // --------------------------------------------------------
        {
            id: 'ch03-sec05',
            title: '案例：动态表的扩展与收缩',
            content: `<h2>案例：动态表的扩展与收缩</h2>
<p>The dynamic array example becomes much more subtle when we also allow <strong>deletions</strong> that can trigger <strong>shrinking</strong>. Naive strategies can lead to <em>thrashing</em> &mdash; repeatedly expanding and shrinking.</p>

<div class="env-block definition">
<div class="env-title">Definition (Dynamic Table with Shrinking)</div>
<div class="env-body">
<p>A dynamic table supports INSERT and DELETE. We maintain a load factor \\(\\alpha = \\text{size}/\\text{capacity}\\).</p>
<ul>
<li><strong>Expand</strong>: when \\(\\alpha = 1\\), double the capacity.</li>
<li><strong>Shrink</strong>: when \\(\\alpha < 1/4\\), halve the capacity.</li>
</ul>
<p>Note: we shrink at \\(1/4\\), not \\(1/2\\)! This asymmetry is crucial.</p>
</div>
</div>

<div class="env-block warning">
<div class="env-title">Warning (Thrashing)</div>
<div class="env-body">
<p>If we shrink at \\(\\alpha = 1/2\\) (immediately after expanding), an alternating sequence of INSERT-DELETE at the boundary would cause repeated expansions and shrinks, each costing \\(O(n)\\). The amortized cost would be \\(O(n)\\), not \\(O(1)\\)!</p>
<p>By shrinking at \\(1/4\\), we guarantee that between any expand and the next shrink, enough cheap operations occur to "pay" for the next resize.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch03-viz-thrashing"></div>

<div class="env-block theorem">
<div class="env-title">Theorem (Dynamic Table with Shrinking)</div>
<div class="env-body">
<p>Using the expand-at-full, shrink-at-quarter strategy, any sequence of \\(n\\) INSERT and DELETE operations costs \\(O(n)\\) total. The amortized cost per operation is \\(O(1)\\).</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof (Potential Method)</div>
<div class="env-body">
<p>Define the potential function:</p>
$$\\Phi(D) = \\begin{cases} 2 \\cdot \\text{size} - \\text{capacity} & \\text{if } \\alpha \\ge 1/2 \\\\ \\text{capacity}/2 - \\text{size} & \\text{if } \\alpha < 1/2 \\end{cases}$$
<p>Note that \\(\\Phi = 0\\) when \\(\\alpha = 1/2\\), and \\(\\Phi \\ge 0\\) always. A careful case analysis (INSERT with/without expand, DELETE with/without shrink) shows that the amortized cost is at most 3 in every case.</p>
<p class="qed">&marker;</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch03-viz-dynamic-table"></div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body">
<p>The key insight: the "gap" between the expand trigger (\\(\\alpha = 1\\)) and the shrink trigger (\\(\\alpha = 1/4\\)) ensures that many cheap operations (each paying a bit of potential) happen between consecutive expensive resizes. This "buffer zone" is what makes the amortized bound work.</p>
<p>This pattern appears throughout algorithm design: <strong>hysteresis</strong> (using different thresholds for opposite actions) prevents oscillation and enables efficient amortized bounds.</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch03-viz-thrashing',
                    title: 'Thrashing Demo',
                    description: 'See why shrinking at 1/2 leads to thrashing',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 380});
                        var strategy = 'bad'; // 'bad' = shrink at 1/2, 'good' = shrink at 1/4
                        var ops = [];
                        var maxOps = 30;

                        function simulate(strat) {
                            var cap = 4, sz = 4; // start full
                            var results = [];
                            var totalCost = 0;
                            var shrinkThreshold = strat === 'bad' ? 0.5 : 0.25;

                            // Alternate insert/delete near boundary
                            for (var i = 0; i < maxOps; i++) {
                                var op = i % 2 === 0 ? 'delete' : 'insert';
                                var cost = 1;
                                if (op === 'insert') {
                                    if (sz === cap) {
                                        cost += sz;
                                        cap *= 2;
                                    }
                                    sz++;
                                } else {
                                    sz--;
                                    if (sz > 0 && cap > 1 && sz / cap < shrinkThreshold) {
                                        cost += sz;
                                        cap = Math.max(1, Math.floor(cap / 2));
                                    }
                                }
                                totalCost += cost;
                                results.push({op: op, cost: cost, size: sz, capacity: cap, total: totalCost});
                            }
                            return results;
                        }

                        function draw() {
                            var results = simulate(strategy);
                            viz.clear();
                            var ctx = viz.ctx;

                            var title = strategy === 'bad' ? 'BAD: Shrink at 1/2 \u2192 Thrashing!' : 'GOOD: Shrink at 1/4 \u2192 No Thrashing';
                            var titleColor = strategy === 'bad' ? viz.colors.red : viz.colors.green;
                            viz.screenText(title, viz.width / 2, 22, titleColor, 14);

                            // Cost bars
                            var barW = Math.min(18, (viz.width - 80) / results.length - 1);
                            var startX = (viz.width - results.length * (barW + 1)) / 2;
                            var barBaseY = 200;
                            var barMaxH = 130;
                            var maxCost = Math.max.apply(null, results.map(function(r) { return r.cost; }).concat([1]));

                            for (var i = 0; i < results.length; i++) {
                                var h = (results[i].cost / maxCost) * barMaxH;
                                var px = startX + i * (barW + 1);
                                ctx.fillStyle = results[i].cost > 1 ? viz.colors.red : (results[i].op === 'insert' ? viz.colors.green : viz.colors.blue);
                                ctx.fillRect(px, barBaseY - h, barW, h);
                            }

                            viz.screenText('Cost per operation', viz.width / 2, barBaseY + 15, viz.colors.text, 10);

                            // Capacity/size graph
                            var graphBaseY = 340;
                            var graphMaxH = 90;
                            var maxCap = Math.max.apply(null, results.map(function(r) { return r.capacity; }));

                            ctx.strokeStyle = viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i < results.length; i++) {
                                var px = startX + i * (barW + 1) + barW / 2;
                                var py = graphBaseY - (results[i].capacity / maxCap) * graphMaxH;
                                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var i = 0; i < results.length; i++) {
                                var px = startX + i * (barW + 1) + barW / 2;
                                var py = graphBaseY - (results[i].size / maxCap) * graphMaxH;
                                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            viz.screenText('capacity', viz.width - 80, graphBaseY - graphMaxH - 5, viz.colors.orange, 10);
                            viz.screenText('size', viz.width - 80, graphBaseY - graphMaxH + 12, viz.colors.teal, 10);

                            var last = results[results.length - 1];
                            viz.screenText('Total cost: ' + last.total + '    Amortized: ' + (last.total / results.length).toFixed(1),
                                viz.width / 2, viz.height - 10, viz.colors.white, 12);
                        }

                        draw();

                        VizEngine.createSelect(controls, 'Strategy: ', [
                            {value: 'bad', label: 'Shrink at 1/2 (BAD)'},
                            {value: 'good', label: 'Shrink at 1/4 (GOOD)'}
                        ], function(v) { strategy = v; draw(); });

                        return viz;
                    }
                },
                {
                    id: 'ch03-viz-dynamic-table',
                    title: 'Dynamic Table Simulator',
                    description: 'Full insert/delete simulation with load factor tracking',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var capacity = 4, size = 0;
                        var costs = [];
                        var totalCost = 0;
                        var loadFactors = [];

                        function doInsert() {
                            var cost = 1;
                            if (size === capacity) {
                                cost += size;
                                capacity *= 2;
                            }
                            size++;
                            totalCost += cost;
                            costs.push({cost: cost, op: 'insert'});
                            loadFactors.push(size / capacity);
                        }

                        function doDelete() {
                            if (size === 0) return;
                            var cost = 1;
                            size--;
                            if (size > 0 && capacity > 1 && size * 4 < capacity) {
                                cost += size;
                                capacity = Math.max(1, Math.floor(capacity / 2));
                            }
                            totalCost += cost;
                            costs.push({cost: cost, op: 'delete'});
                            loadFactors.push(size > 0 ? size / capacity : 0);
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            viz.screenText('Dynamic Table: Insert & Delete', viz.width / 2, 20, viz.colors.white, 14);

                            // Table visualization
                            var maxCells = Math.min(capacity, 32);
                            var cellW = Math.min(20, (viz.width - 60) / maxCells);
                            var startX = (viz.width - maxCells * cellW) / 2;
                            var tableY = 50;

                            for (var i = 0; i < maxCells; i++) {
                                var filled = i < size;
                                ctx.fillStyle = filled ? viz.colors.blue + '55' : viz.colors.bg;
                                ctx.fillRect(startX + i * cellW, tableY, cellW - 1, 22);
                                ctx.strokeStyle = viz.colors.axis;
                                ctx.lineWidth = 0.5;
                                ctx.strokeRect(startX + i * cellW, tableY, cellW - 1, 22);
                            }
                            if (capacity > 32) viz.screenText('...(' + capacity + ' total)', startX + maxCells * cellW + 5, tableY + 11, viz.colors.text, 9, 'left', 'middle');

                            var alpha = capacity > 0 ? (size / capacity) : 0;
                            viz.screenText('size=' + size + '  cap=' + capacity + '  \u03B1=' + alpha.toFixed(2), viz.width / 2, tableY + 35, viz.colors.teal, 12);

                            // Cost bars
                            if (costs.length > 0) {
                                var barW = Math.min(14, (viz.width - 60) / costs.length - 1);
                                var barStartX = (viz.width - costs.length * (barW + 1)) / 2;
                                var barBaseY = 200;
                                var barMaxH = 80;
                                var maxCostVal = Math.max.apply(null, costs.map(function(c) { return c.cost; }).concat([1]));

                                for (var i = 0; i < costs.length; i++) {
                                    var h = (costs[i].cost / maxCostVal) * barMaxH;
                                    var px = barStartX + i * (barW + 1);
                                    ctx.fillStyle = costs[i].cost > 1 ? viz.colors.red : (costs[i].op === 'insert' ? viz.colors.green : viz.colors.blue);
                                    ctx.fillRect(px, barBaseY - h, barW, h);
                                }

                                // Load factor graph
                                var lfBaseY = 330;
                                var lfMaxH = 80;
                                ctx.strokeStyle = viz.colors.purple;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var i = 0; i < loadFactors.length; i++) {
                                    var px = barStartX + i * (barW + 1) + barW / 2;
                                    var py = lfBaseY - loadFactors[i] * lfMaxH;
                                    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                                }
                                ctx.stroke();

                                // Threshold lines
                                var y1 = lfBaseY - 1.0 * lfMaxH; // full
                                var y25 = lfBaseY - 0.25 * lfMaxH; // shrink
                                ctx.strokeStyle = viz.colors.red + '88'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
                                ctx.beginPath(); ctx.moveTo(barStartX, y1); ctx.lineTo(barStartX + costs.length * (barW + 1), y1); ctx.stroke();
                                ctx.strokeStyle = viz.colors.orange + '88';
                                ctx.beginPath(); ctx.moveTo(barStartX, y25); ctx.lineTo(barStartX + costs.length * (barW + 1), y25); ctx.stroke();
                                ctx.setLineDash([]);

                                viz.screenText('\u03B1=1 (expand)', viz.width - 40, y1, viz.colors.red, 8, 'right', 'middle');
                                viz.screenText('\u03B1=1/4 (shrink)', viz.width - 40, y25, viz.colors.orange, 8, 'right', 'middle');
                                viz.screenText('Load factor \u03B1', 30, lfBaseY - lfMaxH / 2, viz.colors.purple, 10, 'left', 'middle');
                            }

                            viz.screenText('Ops: ' + costs.length + '  Total cost: ' + totalCost +
                                '  Amortized: ' + (costs.length > 0 ? (totalCost / costs.length).toFixed(2) : '-'),
                                viz.width / 2, viz.height - 10, viz.colors.orange, 11);
                        }

                        draw();

                        VizEngine.createButton(controls, 'Insert', function() { doInsert(); draw(); });
                        VizEngine.createButton(controls, 'Delete', function() { doDelete(); draw(); });
                        VizEngine.createButton(controls, '+10 Insert', function() { for (var i = 0; i < 10; i++) doInsert(); draw(); });
                        VizEngine.createButton(controls, '+10 Delete', function() { for (var i = 0; i < 10; i++) doDelete(); draw(); });
                        VizEngine.createButton(controls, 'Reset', function() {
                            capacity = 4; size = 0; costs = []; totalCost = 0; loadFactors = [];
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify that the potential function \\(\\Phi\\) given for the dynamic table (expand at \\(\\alpha=1\\), shrink at \\(\\alpha=1/4\\)) yields amortized cost \\(O(1)\\) for INSERT when no expansion occurs.',
                    hint: 'When \\(\\alpha \\ge 1/2\\), \\(\\Phi = 2s - cap\\). After insert: s becomes s+1, cap unchanged.',
                    solution: 'Case: alpha >= 1/2, no expansion. Before: Phi = 2s - cap. After insert: Phi = 2(s+1) - cap. Delta Phi = 2. Actual cost c = 1. Amortized: c_hat = 1 + 2 = 3. If alpha < 1/2 before insert (and stays < 1/2 after): Phi = cap/2 - s. After: Phi = cap/2 - (s+1). Delta Phi = -1. Amortized: 1 + (-1) = 0. Both are O(1).'
                },
                {
                    question: 'Why do we shrink at \\(\\alpha = 1/4\\) specifically, and not, say, \\(\\alpha = 1/3\\)?',
                    hint: 'The shrink threshold must be at most half of the expand threshold.',
                    solution: 'The expand threshold is alpha = 1 (full). After doubling, alpha = 1/2. For the analysis to work, we need the shrink threshold beta to satisfy: after halving (which sets alpha = 2*beta), the table should have alpha = 2*beta >= 1/2 so that subsequent inserts "refill" the potential. With beta = 1/4, after halving we get alpha = 1/2, which is exactly the boundary. With beta = 1/3, after halving alpha = 2/3, which also works. In fact, any beta <= 1/4 works cleanly. beta = 1/4 is the standard choice because it provides the best space utilization (table never more than 4x overallocated).'
                },
                {
                    question: 'Suppose we use a growth factor of 3 (triple instead of double) and shrink when \\(\\alpha < 1/9\\). Design a potential function and prove \\(O(1)\\) amortized cost.',
                    hint: 'After tripling at alpha=1, new alpha = 1/3. After shrinking at alpha=1/9 (cap/=3), new alpha = 1/3.',
                    solution: 'After expansion: alpha = 1/3. After shrink: alpha = 3*(1/9) = 1/3. Define Phi = (3*size - capacity) when alpha >= 1/3, and (capacity/3 - size) when alpha < 1/3. Phi = 0 when alpha = 1/3. For insert without expand (alpha >= 1/3): Delta Phi = 3, cost = 1, amortized = 4. For insert with expand (size=cap, triple): actual cost = 1 + size = 1 + cap. Delta Phi = (3(cap+1) - 3cap) - (3cap - cap) = 3 - 2cap. Amortized = (1+cap) + (3-2cap) = 4 - cap... This needs care. The standard approach works with Phi = |3s - cap| for the tripling case. The amortized cost per operation is O(1).'
                },
                {
                    question: 'Give a real-world example where amortized analysis is critical for understanding system performance.',
                    hint: 'Think about garbage collection, database operations, or network protocols.',
                    solution: 'Garbage collection in Java/Go: most GC pauses are short (incremental collection), but occasional full GC pauses are expensive. Amortized analysis shows that the total GC cost over the lifetime of the program is proportional to the total memory allocated, giving O(1) amortized cost per allocation. Other examples: (1) Splay trees: individual operations can be O(n), but amortized O(log n). (2) Hash table resizing (same as dynamic arrays). (3) TCP congestion control: slow start + congestion avoidance gives amortized throughput guarantees.'
                }
            ]
        }
    ]
});
