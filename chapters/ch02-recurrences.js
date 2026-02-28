// ============================================================
// Chapter 2 · Recurrences & the Master Theorem
// Recurrences & the Master Theorem
// ============================================================
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch02',
    number: 2,
    title: 'Recurrences & the Master Theorem',
    subtitle: 'Recurrences & the Master Theorem',
    sections: [
        // --------------------------------------------------------
        // Section 1: Divide-and-Conquer Recurrences
        // --------------------------------------------------------
        {
            id: 'ch02-sec01',
            title: 'Divide-and-Conquer Recurrences',
            content: `<h2>Divide-and-Conquer Recurrences</h2>
<p>Recursive algorithms naturally give rise to <strong>recurrence relations</strong> that describe their running time. Understanding how to solve these recurrences is a core skill in algorithm analysis.</p>

<div class="env-block definition">
<div class="env-title">Definition (Recurrence Relation)</div>
<div class="env-body">
<p>A <strong>recurrence relation</strong> expresses the value of a function \\(T(n)\\) in terms of its values at smaller arguments:</p>
$$T(n) = \\begin{cases} \\Theta(1) & \\text{if } n \\le n_0 \\\\ a \\, T(n/b) + f(n) & \\text{if } n > n_0 \\end{cases}$$
<p>where \\(a \\ge 1\\) is the number of subproblems, \\(n/b\\) is the size of each subproblem (\\(b > 1\\)), and \\(f(n)\\) is the cost of dividing and combining.</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example (Common Recurrences)</div>
<div class="env-body">
<table style="width:100%;border-collapse:collapse;margin:8px 0;">
<tr style="border-bottom:1px solid #30363d;"><th style="padding:4px;">Algorithm</th><th style="padding:4px;">Recurrence</th><th style="padding:4px;">Solution</th></tr>
<tr><td style="padding:4px;">Binary Search</td><td style="padding:4px;">\\(T(n) = T(n/2) + O(1)\\)</td><td style="padding:4px;">\\(O(\\log n)\\)</td></tr>
<tr><td style="padding:4px;">Merge Sort</td><td style="padding:4px;">\\(T(n) = 2T(n/2) + O(n)\\)</td><td style="padding:4px;">\\(O(n \\log n)\\)</td></tr>
<tr><td style="padding:4px;">Strassen's</td><td style="padding:4px;">\\(T(n) = 7T(n/2) + O(n^2)\\)</td><td style="padding:4px;">\\(O(n^{\\log_2 7})\\)</td></tr>
<tr><td style="padding:4px;">Karatsuba</td><td style="padding:4px;">\\(T(n) = 3T(n/2) + O(n)\\)</td><td style="padding:4px;">\\(O(n^{\\log_2 3})\\)</td></tr>
</table>
</div>
</div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body">
<p>Think of a recurrence as describing a tree of recursive calls. The running time is the total work done across all levels of this tree. The key question is: where does most of the work happen &mdash; at the root (combining), at the leaves (base cases), or is it evenly distributed?</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch02-viz-recursion-tree-intro"></div>

<p>We will study three methods for solving recurrences:</p>
<ol>
<li><strong>Substitution method</strong>: guess the answer and prove it by induction.</li>
<li><strong>Recursion-tree method</strong>: visualize the recursion as a tree and sum costs.</li>
<li><strong>Master Theorem</strong>: a cookbook formula for the standard divide-and-conquer form.</li>
</ol>`,
            visualizations: [
                {
                    id: 'ch02-viz-recursion-tree-intro',
                    title: 'Recursion Tree Overview',
                    description: 'See how a divide-and-conquer algorithm creates a tree of subproblems',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var a = 2, b = 2;
                        var maxDepth = 4;

                        function draw() {
                            viz.clear();
                            viz.screenText('Recursion Tree: T(n) = ' + a + 'T(n/' + b + ') + f(n)', viz.width / 2, 22, viz.colors.white, 14);

                            var levels = Math.min(maxDepth, 5);
                            var nodeR = 18;
                            var levelH = 65;
                            var startY = 60;

                            // Draw tree level by level
                            for (var d = 0; d <= levels; d++) {
                                var nodesAtLevel = Math.pow(a, d);
                                var subSize = 'n/' + Math.pow(b, d);
                                if (d === 0) subSize = 'n';
                                if (Math.pow(b, d) === 1) subSize = 'n';

                                var y = startY + d * levelH;
                                var spacing = Math.min((viz.width - 60) / nodesAtLevel, 80);
                                var totalWidth = nodesAtLevel * spacing;
                                var startX = (viz.width - totalWidth) / 2 + spacing / 2;

                                // Cap displayed nodes
                                var displayNodes = Math.min(nodesAtLevel, 16);
                                var actualSpacing = (viz.width - 60) / displayNodes;
                                var actualStartX = 30 + actualSpacing / 2;

                                for (var i = 0; i < displayNodes; i++) {
                                    var x = actualStartX + i * actualSpacing;
                                    var col = d === 0 ? viz.colors.orange : (d === levels ? viz.colors.green : viz.colors.blue);
                                    viz.drawNode(x, y, nodeR, '', col, viz.colors.white);

                                    // Draw edges to children
                                    if (d < levels) {
                                        var childNodes = Math.min(Math.pow(a, d + 1), 16);
                                        var childSpacing = (viz.width - 60) / childNodes;
                                        var childStartX = 30 + childSpacing / 2;
                                        for (var c = 0; c < a; c++) {
                                            var childIdx = i * a + c;
                                            if (childIdx < childNodes) {
                                                var cx = childStartX + childIdx * childSpacing;
                                                var cy = startY + (d + 1) * levelH;
                                                viz.drawTreeEdge(x, y + nodeR, cx, cy - nodeR, viz.colors.axis);
                                            }
                                        }
                                    }
                                }

                                // Level annotation
                                var levelCost = nodesAtLevel + ' nodes, each f(' + subSize + ')';
                                var totalLevelCost = 'a^' + d + ' = ' + nodesAtLevel;
                                viz.screenText('Depth ' + d + ': ' + totalLevelCost, viz.width - 70, y, viz.colors.text, 10, 'right', 'middle');
                            }

                            // Summary
                            var totalLevels = 'log_' + b + '(n)';
                            viz.screenText('Total depth: ' + totalLevels + ' levels    |    Leaves: a^(log_b n) = n^(log_b a) = n^' + (Math.log(a) / Math.log(b)).toFixed(2),
                                viz.width / 2, viz.height - 15, viz.colors.teal, 11);
                        }

                        draw();

                        VizEngine.createSlider(controls, 'a (subproblems) = ', 1, 4, a, 1, function(v) { a = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'b (divide by) = ', 2, 4, b, 1, function(v) { b = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'Depth = ', 1, 5, maxDepth, 1, function(v) { maxDepth = Math.round(v); draw(); });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Write the recurrence for an algorithm that divides a problem of size \\(n\\) into 3 subproblems of size \\(n/4\\) and takes \\(O(n^2)\\) time to divide and combine.',
                    hint: 'Follow the standard form T(n) = aT(n/b) + f(n).',
                    solution: '\\(T(n) = 3T(n/4) + cn^2\\) for some constant c, with \\(T(1) = \\Theta(1)\\). Here a=3, b=4, f(n)=O(n^2).'
                },
                {
                    question: 'In the recursion tree for \\(T(n) = 2T(n/2) + n\\), how many nodes are at depth \\(k\\)? What is the subproblem size at depth \\(k\\)?',
                    hint: 'At each level, the number of nodes doubles.',
                    solution: 'At depth k there are \\(2^k\\) nodes, each of size \\(n/2^k\\). The work at depth k is \\(2^k \\cdot (n/2^k) = n\\). The tree has \\(\\log_2 n\\) levels, so total work is \\(n \\log n\\).'
                },
                {
                    question: 'What is the total number of leaves in the recursion tree for \\(T(n) = aT(n/b) + f(n)\\)?',
                    hint: 'The tree has depth \\(\\log_b n\\) and each node has \\(a\\) children.',
                    solution: 'The number of leaves is \\(a^{\\log_b n}\\). Using the identity \\(a^{\\log_b n} = n^{\\log_b a}\\), we get \\(n^{\\log_b a}\\) leaves. Each leaf costs \\(\\Theta(1)\\), so the total leaf work is \\(\\Theta(n^{\\log_b a})\\).'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 2: The Substitution Method
        // --------------------------------------------------------
        {
            id: 'ch02-sec02',
            title: 'Substitution Method',
            content: `<h2>Substitution Method</h2>
<p>The substitution method is the most general technique: <strong>guess</strong> the solution and then <strong>prove</strong> it correct by mathematical induction.</p>

<div class="env-block definition">
<div class="env-title">Definition (Substitution Method)</div>
<div class="env-body">
<p>To solve \\(T(n)\\) by substitution:</p>
<ol>
<li><strong>Guess</strong> the form of the solution (e.g., \\(T(n) = O(n \\log n)\\)).</li>
<li><strong>Verify</strong> by induction: assume the bound holds for all \\(m < n\\), and prove it for \\(n\\).</li>
<li><strong>Choose constants</strong> \\(c\\) and \\(n_0\\) to make the induction work.</li>
</ol>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example (Merge Sort Recurrence)</div>
<div class="env-body">
<p>Prove that \\(T(n) = 2T(n/2) + n\\) has solution \\(T(n) = O(n \\log n)\\).</p>
<p><strong>Guess</strong>: \\(T(n) \\le c \\cdot n \\log n\\) for some constant \\(c > 0\\).</p>
<p><strong>Inductive step</strong>: Assume \\(T(m) \\le c \\cdot m \\log m\\) for all \\(m < n\\). Then:</p>
$$T(n) = 2T(n/2) + n \\le 2c(n/2)\\log(n/2) + n = cn(\\log n - 1) + n = cn\\log n - cn + n.$$
<p>We need \\(cn\\log n - cn + n \\le cn\\log n\\), which holds when \\(c \\ge 1\\).</p>
<p><strong>Base case</strong>: Choose \\(n_0 = 2\\). Then \\(T(2) = 2T(1) + 2 = 2\\Theta(1) + 2\\). For large enough \\(c\\), \\(T(2) \\le c \\cdot 2 \\log 2 = 2c\\). \\(\\checkmark\\)</p>
</div>
</div>

<div class="env-block warning">
<div class="env-title">Warning (Common Pitfalls)</div>
<div class="env-body">
<p><strong>Pitfall 1</strong>: Guessing too loosely. If you guess \\(T(n) = O(n^2)\\) for a recurrence whose true solution is \\(\\Theta(n \\log n)\\), the proof will succeed but the bound is not tight.</p>
<p><strong>Pitfall 2</strong>: Forgetting lower-order terms. When proving \\(T(n) \\le cn \\log n\\), you cannot conclude \\(T(n) \\le cn \\log n + n\\) and claim the bound holds &mdash; you have an extra \\(+n\\) term. Solution: strengthen the hypothesis to \\(T(n) \\le cn \\log n - dn\\) for some \\(d > 0\\).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch02-viz-substitution"></div>

<div class="env-block theorem">
<div class="env-title">Theorem (Strengthening the Induction)</div>
<div class="env-body">
<p>If a straightforward induction fails because of a lower-order additive term, subtract that term from the guess. For example, if trying to prove \\(T(n) \\le cn\\) fails because you get \\(T(n) \\le cn + b\\), try \\(T(n) \\le cn - b\\) instead.</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch02-viz-substitution',
                    title: 'Substitution Method Walkthrough',
                    description: 'Step-by-step verification of the inductive proof',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var step = 0;
                        var totalSteps = 5;

                        var stepTexts = [
                            {title: 'Step 1: The Recurrence', lines: ['T(n) = 2T(n/2) + n', 'We want to show T(n) = O(n log n)']},
                            {title: 'Step 2: The Guess', lines: ['Assume: T(n) <= c * n * log n for some c > 0', 'Inductive hypothesis: T(m) <= c * m * log m for m < n']},
                            {title: 'Step 3: Substitute', lines: ['T(n) = 2T(n/2) + n', '<= 2 * c * (n/2) * log(n/2) + n', '= c * n * (log n - 1) + n', '= c * n * log n - c * n + n']},
                            {title: 'Step 4: Verify the Bound', lines: ['Need: c*n*log n - c*n + n <= c*n*log n', 'Simplify: -c*n + n <= 0', 'i.e., n(1 - c) <= 0', 'Holds when c >= 1  \u2713']},
                            {title: 'Step 5: Conclusion', lines: ['With c >= 1 and suitable n_0:', 'T(n) <= c * n * log n for all n >= n_0', 'Therefore T(n) = O(n log n)  \u2713', 'Merge Sort runs in O(n log n) time!']}
                        ];

                        function draw() {
                            viz.clear();
                            viz.screenText('Substitution Method: T(n) = 2T(n/2) + n', viz.width / 2, 22, viz.colors.white, 14);

                            var s = stepTexts[step];
                            viz.screenText(s.title, viz.width / 2, 60, viz.colors.orange, 15);

                            for (var i = 0; i < s.lines.length; i++) {
                                var col = i === s.lines.length - 1 && step >= 3 ? viz.colors.green : viz.colors.white;
                                viz.screenText(s.lines[i], viz.width / 2, 100 + i * 35, col, 13);
                            }

                            // Progress bar
                            var ctx = viz.ctx;
                            var barY = viz.height - 40;
                            var barW = viz.width - 100;
                            ctx.fillStyle = viz.colors.bg;
                            ctx.fillRect(50, barY, barW, 8);
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.strokeRect(50, barY, barW, 8);
                            ctx.fillStyle = viz.colors.teal;
                            ctx.fillRect(50, barY, barW * (step + 1) / totalSteps, 8);

                            for (var p = 0; p < totalSteps; p++) {
                                var px = 50 + barW * (p + 0.5) / totalSteps;
                                viz.screenText(String(p + 1), px, barY + 20, p <= step ? viz.colors.teal : viz.colors.text, 10);
                            }
                        }

                        draw();

                        VizEngine.createButton(controls, '\u25C0 Prev', function() {
                            if (step > 0) { step--; draw(); }
                        });
                        VizEngine.createButton(controls, 'Next \u25B6', function() {
                            if (step < totalSteps - 1) { step++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() { step = 0; draw(); });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the substitution method to prove that \\(T(n) = T(n/2) + 1\\) is \\(O(\\log n)\\).',
                    hint: 'Guess T(n) <= c * log n. Substitute and verify.',
                    solution: 'Guess: T(n) <= c log n. Then T(n) = T(n/2) + 1 <= c log(n/2) + 1 = c(log n - 1) + 1 = c log n - c + 1. Need c log n - c + 1 <= c log n, i.e., -c + 1 <= 0, i.e., c >= 1. With c = 1 and base case T(2) = T(1) + 1 <= c * log 2 = c, which holds for large enough c. So T(n) = O(log n).'
                },
                {
                    question: 'Prove that \\(T(n) = 2T(n/2) + 1\\) is \\(O(n)\\) using the substitution method.',
                    hint: 'Try T(n) <= cn - d for some constants c, d > 0 to handle the +1.',
                    solution: 'Guess T(n) <= cn - d. Then T(n) = 2T(n/2) + 1 <= 2(c(n/2) - d) + 1 = cn - 2d + 1. Need cn - 2d + 1 <= cn - d, i.e., -2d + 1 <= -d, i.e., d >= 1. Choose d = 1, c large enough for base case. So T(n) <= cn - 1, i.e., T(n) = O(n).'
                },
                {
                    question: 'Attempt to prove \\(T(n) = 4T(n/2) + n\\) is \\(O(n^2)\\) by substitution. Does a straightforward guess \\(T(n) \\le cn^2\\) work?',
                    hint: 'Substitute and see if the algebra works out.',
                    solution: 'Guess T(n) <= cn^2. T(n) = 4T(n/2) + n <= 4c(n/2)^2 + n = 4c(n^2/4) + n = cn^2 + n. This gives cn^2 + n, not <= cn^2. The +n term is problematic. Strengthen: try T(n) <= cn^2 - dn. Then T(n) <= 4(c(n/2)^2 - d(n/2)) + n = cn^2 - 2dn + n. Need cn^2 - 2dn + n <= cn^2 - dn, i.e., -2dn + n <= -dn, i.e., n <= dn, i.e., d >= 1. Works with d >= 1!'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 3: The Recursion-Tree Method
        // --------------------------------------------------------
        {
            id: 'ch02-sec03',
            title: 'Recursion-Tree Method',
            content: `<h2>Recursion-Tree Method</h2>
<p>The recursion-tree method provides a visual way to solve recurrences by drawing out the tree of recursive calls and summing the work at each level.</p>

<div class="env-block definition">
<div class="env-title">Definition (Recursion Tree)</div>
<div class="env-body">
<p>For a recurrence \\(T(n) = aT(n/b) + f(n)\\):</p>
<ul>
<li>The <strong>root</strong> represents the original problem of size \\(n\\), with cost \\(f(n)\\).</li>
<li>Each internal node has \\(a\\) children, each representing a subproblem of size \\(n/b\\).</li>
<li>The tree has \\(\\log_b n\\) levels (depth 0 to \\(\\log_b n\\)).</li>
<li>At depth \\(k\\): there are \\(a^k\\) nodes, each with cost \\(f(n/b^k)\\).</li>
<li>Total cost at depth \\(k\\): \\(a^k \\cdot f(n/b^k)\\).</li>
<li>Total cost: \\(\\sum_{k=0}^{\\log_b n} a^k \\cdot f(n/b^k)\\).</li>
</ul>
</div>
</div>

<div class="viz-placeholder" data-viz="ch02-viz-recursion-tree-builder"></div>

<div class="env-block example">
<div class="env-title">Example (T(n) = 2T(n/2) + n)</div>
<div class="env-body">
<p>At depth \\(k\\): \\(2^k\\) nodes, each with cost \\(n/2^k\\). Level cost: \\(2^k \\cdot n/2^k = n\\).</p>
<p>Number of levels: \\(\\log_2 n\\). Leaf cost: \\(n^{\\log_2 2} \\cdot \\Theta(1) = \\Theta(n)\\).</p>
<p>Total: \\(n \\cdot \\log n + \\Theta(n) = \\Theta(n \\log n)\\). \\(\\checkmark\\)</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example (T(n) = 3T(n/4) + cn^2)</div>
<div class="env-body">
<p>At depth \\(k\\): \\(3^k\\) nodes, each with cost \\(c(n/4^k)^2 = cn^2/16^k\\).</p>
<p>Level cost: \\(3^k \\cdot cn^2 / 16^k = cn^2 (3/16)^k\\).</p>
<p>Total: \\(cn^2 \\sum_{k=0}^{\\log_4 n} (3/16)^k < cn^2 \\sum_{k=0}^{\\infty} (3/16)^k = cn^2 \\cdot \\frac{16}{13} = O(n^2)\\).</p>
<p>Since \\(3/16 < 1\\), the sum is a decreasing geometric series. The root dominates!</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch02-viz-level-cost"></div>`,
            visualizations: [
                {
                    id: 'ch02-viz-recursion-tree-builder',
                    title: 'Recursion Tree Builder',
                    description: 'Build and explore recursion trees for custom recurrences',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var a = 2, b = 2, fType = 'n';  // f(n) = n, n^2, 1, nlogn
                        var showLevel = 4;

                        function fCost(n) {
                            if (fType === '1') return 1;
                            if (fType === 'n') return n;
                            if (fType === 'n2') return n * n;
                            if (fType === 'nlogn') return n > 1 ? n * Math.log2(n) : 0;
                            return n;
                        }
                        function fLabel(s) {
                            if (fType === '1') return '1';
                            if (fType === 'n') return s;
                            if (fType === 'n2') return s + '\u00B2';
                            if (fType === 'nlogn') return s + 'log' + s;
                            return s;
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Recursion Tree: T(n) = ' + a + 'T(n/' + b + ') + ' + fLabel('n'), viz.width / 2, 20, viz.colors.white, 13);

                            var levels = Math.min(showLevel, 5);
                            var baseN = 64;
                            var totalCost = 0;
                            var levelCosts = [];
                            var nodeR = 14;

                            for (var d = 0; d <= levels; d++) {
                                var nodesAtLevel = Math.pow(a, d);
                                var subN = baseN / Math.pow(b, d);
                                var costPerNode = fCost(subN);
                                var levelCost = nodesAtLevel * costPerNode;
                                levelCosts.push(levelCost);
                                totalCost += levelCost;

                                var y = 50 + d * 60;
                                var displayNodes = Math.min(nodesAtLevel, 12);
                                var maxW = viz.width - 200;
                                var spacing = maxW / Math.max(displayNodes, 1);
                                var startX = 40 + spacing / 2;

                                for (var i = 0; i < displayNodes; i++) {
                                    var x = startX + i * spacing;
                                    var color = d === levels ? viz.colors.green : viz.colors.blue;
                                    viz.drawNode(x, y, nodeR, Math.round(subN), color, viz.colors.white);

                                    // Edges to children
                                    if (d < levels) {
                                        var childCount = Math.min(Math.pow(a, d + 1), 12);
                                        var childSpacing = maxW / Math.max(childCount, 1);
                                        var childStart = 40 + childSpacing / 2;
                                        for (var c = 0; c < a && i * a + c < childCount; c++) {
                                            var ci = i * a + c;
                                            viz.drawTreeEdge(x, y + nodeR, childStart + ci * childSpacing, y + 60 - nodeR, viz.colors.axis);
                                        }
                                    }
                                }

                                if (nodesAtLevel > 12) {
                                    viz.screenText('...', startX + 12 * spacing, y, viz.colors.text, 14);
                                }

                                // Level cost annotation
                                viz.screenText(nodesAtLevel + ' \u00D7 ' + fLabel(Math.round(subN).toString()) + ' = ' + Math.round(levelCost),
                                    viz.width - 70, y, viz.colors.orange, 10, 'right', 'middle');
                            }

                            // Bottom summary
                            viz.screenText('Total cost \u2248 ' + Math.round(totalCost) + '    |    n^(log_' + b + ' ' + a + ') = n^' + (Math.log(a) / Math.log(b)).toFixed(2),
                                viz.width / 2, viz.height - 30, viz.colors.teal, 12);

                            // Which part dominates?
                            var leafCost = levelCosts[levelCosts.length - 1];
                            var rootCost = levelCosts[0];
                            var dominance = '';
                            if (leafCost > rootCost * 3) dominance = 'Leaf-heavy (Case 1)';
                            else if (rootCost > leafCost * 3) dominance = 'Root-heavy (Case 3)';
                            else dominance = 'Balanced (Case 2)';
                            viz.screenText(dominance, viz.width / 2, viz.height - 10, viz.colors.purple, 11);
                        }

                        draw();

                        VizEngine.createSlider(controls, 'a = ', 1, 4, a, 1, function(v) { a = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'b = ', 2, 4, b, 1, function(v) { b = Math.round(v); draw(); });
                        VizEngine.createSelect(controls, 'f(n) = ', [
                            {value: '1', label: '1'},
                            {value: 'n', label: 'n'},
                            {value: 'n2', label: 'n\u00B2'},
                            {value: 'nlogn', label: 'n log n'}
                        ], function(v) { fType = v; draw(); });
                        VizEngine.createSlider(controls, 'Depth = ', 1, 5, showLevel, 1, function(v) { showLevel = Math.round(v); draw(); });

                        return viz;
                    }
                },
                {
                    id: 'ch02-viz-level-cost',
                    title: 'Level Cost Distribution',
                    description: 'Bar chart showing cost at each level of the recursion tree',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 380});
                        var a = 2, b = 2, fPow = 1; // f(n) = n^fPow
                        var baseN = 256;

                        function draw() {
                            viz.clear();
                            var fLabel = fPow === 0 ? '1' : (fPow === 1 ? 'n' : 'n^' + fPow);
                            viz.screenText('Level Costs: T(n) = ' + a + 'T(n/' + b + ') + ' + fLabel, viz.width / 2, 20, viz.colors.white, 13);

                            var depth = Math.ceil(Math.log(baseN) / Math.log(b));
                            var levelCosts = [];
                            for (var d = 0; d <= depth; d++) {
                                var nodes = Math.pow(a, d);
                                var subN = baseN / Math.pow(b, d);
                                var cost = nodes * Math.pow(subN, fPow);
                                levelCosts.push(cost);
                            }

                            var maxCost = Math.max.apply(null, levelCosts.concat([1]));
                            var barW = Math.min(40, (viz.width - 100) / levelCosts.length - 4);
                            var maxH = 250;
                            var startX = (viz.width - levelCosts.length * (barW + 4)) / 2;
                            var baseY = 340;

                            // Determine pattern
                            var ratio = levelCosts.length >= 2 ? levelCosts[1] / levelCosts[0] : 1;
                            var pattern = '';
                            if (ratio < 0.8) pattern = 'Decreasing (root-heavy)';
                            else if (ratio > 1.2) pattern = 'Increasing (leaf-heavy)';
                            else pattern = 'Constant per level (balanced)';

                            for (var i = 0; i < levelCosts.length; i++) {
                                var h = Math.max(2, (levelCosts[i] / maxCost) * maxH);
                                var px = startX + i * (barW + 4);
                                var isRoot = (i === 0);
                                var isLeaf = (i === levelCosts.length - 1);
                                var col = isRoot ? viz.colors.orange : (isLeaf ? viz.colors.green : viz.colors.blue);
                                viz.ctx.fillStyle = col;
                                viz.ctx.fillRect(px, baseY - h, barW, h);
                                viz.screenText(Math.round(levelCosts[i]).toString(), px + barW / 2, baseY - h - 10, viz.colors.white, 9);
                                viz.screenText('d=' + i, px + barW / 2, baseY + 10, viz.colors.text, 9);
                            }

                            viz.screenText('Cost per level of the recursion tree', viz.width / 2, 45, viz.colors.text, 11);
                            viz.screenText('Pattern: ' + pattern + '    |    Ratio: a/b^p = ' + (a / Math.pow(b, fPow)).toFixed(2),
                                viz.width / 2, viz.height - 10, viz.colors.teal, 11);
                        }

                        draw();

                        VizEngine.createSlider(controls, 'a = ', 1, 8, a, 1, function(v) { a = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'b = ', 2, 4, b, 1, function(v) { b = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'f(n) power = ', 0, 3, fPow, 0.5, function(v) { fPow = v; draw(); });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Draw the recursion tree for \\(T(n) = T(n/3) + T(2n/3) + n\\) and determine its depth. What can you say about the total cost?',
                    hint: 'The two branches have different depths. The longest path goes through the 2n/3 branch.',
                    solution: 'The shortest root-to-leaf path has depth log_3(n) (always taking n/3 branch). The longest has depth log_{3/2}(n) (always taking 2n/3 branch). Each complete level costs at most n (since subproblem sizes sum to n). Total cost: at most n * log_{3/2}(n) = O(n log n). In fact T(n) = Theta(n log n) since even the shortest path gives Omega(n log_3 n) = Omega(n log n).'
                },
                {
                    question: 'Using the recursion tree, solve \\(T(n) = 4T(n/2) + n\\).',
                    hint: 'At depth k: 4^k nodes each costing n/2^k. What is the level cost?',
                    solution: 'Level cost at depth k: 4^k * (n/2^k) = n * 2^k. This is a geometric series increasing by factor 2. Depth: log_2 n levels. Total: n * (1 + 2 + 4 + ... + 2^{log n}) = n * (2^{log_2 n + 1} - 1) = n * (2n - 1) = Theta(n^2). The leaves dominate: n^{log_2 4} = n^2. This is Master Theorem Case 1.'
                },
                {
                    question: 'Use the recursion tree to solve \\(T(n) = T(n/3) + T(2n/3) + 1\\).',
                    hint: 'What is the cost per level? How many levels?',
                    solution: 'At each level, the total cost equals the number of nodes at that level. The longest path has depth log_{3/2} n = O(log n). The total number of nodes is at most n (since each input element appears at most once in each level). More precisely: level 0 has 1 node, level 1 has 2, ..., and the tree is not complete. The total cost is O(n) by a careful argument: the leaf count is Theta(n) and dominates.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 4: The Master Theorem
        // --------------------------------------------------------
        {
            id: 'ch02-sec04',
            title: 'The Master Theorem',
            content: `<h2>The Master Theorem</h2>
<p>The Master Theorem provides a direct formula for recurrences of the form \\(T(n) = aT(n/b) + f(n)\\), where \\(a \\ge 1\\) and \\(b > 1\\).</p>

<div class="env-block theorem">
<div class="env-title">Theorem (Master Theorem, CLRS)</div>
<div class="env-body">
<p>Let \\(T(n) = aT(n/b) + f(n)\\) with \\(a \\ge 1, b > 1\\). Let \\(c_{\\text{crit}} = \\log_b a\\). Then:</p>
<p><strong>Case 1</strong>: If \\(f(n) = O(n^{c_{\\text{crit}} - \\epsilon})\\) for some \\(\\epsilon > 0\\), then \\(T(n) = \\Theta(n^{c_{\\text{crit}}})\\).</p>
<p><strong>Case 2</strong>: If \\(f(n) = \\Theta(n^{c_{\\text{crit}}} \\log^k n)\\) for some \\(k \\ge 0\\), then \\(T(n) = \\Theta(n^{c_{\\text{crit}}} \\log^{k+1} n)\\).</p>
<p><strong>Case 3</strong>: If \\(f(n) = \\Omega(n^{c_{\\text{crit}} + \\epsilon})\\) for some \\(\\epsilon > 0\\), and \\(af(n/b) \\le cf(n)\\) for some \\(c < 1\\) (regularity), then \\(T(n) = \\Theta(f(n))\\).</p>
</div>
</div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body">
<p>The Master Theorem compares the cost of the <strong>leaves</strong> (which is \\(\\Theta(n^{\\log_b a})\\)) against the cost of the <strong>root</strong> (which is \\(f(n)\\)):</p>
<ul>
<li><strong>Case 1</strong> (leaf-heavy): \\(f(n)\\) is polynomially smaller than \\(n^{\\log_b a}\\). The leaves dominate.</li>
<li><strong>Case 2</strong> (balanced): \\(f(n)\\) and \\(n^{\\log_b a}\\) are roughly equal. Work is evenly spread across levels, gaining a \\(\\log\\) factor.</li>
<li><strong>Case 3</strong> (root-heavy): \\(f(n)\\) is polynomially larger. The root dominates.</li>
</ul>
</div>
</div>

<div class="viz-placeholder" data-viz="ch02-viz-master-classifier"></div>

<div class="env-block example">
<div class="env-title">Example (Applying the Master Theorem)</div>
<div class="env-body">
<p><strong>(a)</strong> \\(T(n) = 9T(n/3) + n\\).</p>
<p>\\(a = 9, b = 3, c_{\\text{crit}} = \\log_3 9 = 2\\). \\(f(n) = n = O(n^{2-1})\\). Case 1: \\(T(n) = \\Theta(n^2)\\).</p>
<p><strong>(b)</strong> \\(T(n) = 2T(n/2) + n\\).</p>
<p>\\(a = 2, b = 2, c_{\\text{crit}} = 1\\). \\(f(n) = n = \\Theta(n^1)\\). Case 2 (k=0): \\(T(n) = \\Theta(n \\log n)\\).</p>
<p><strong>(c)</strong> \\(T(n) = 3T(n/4) + n \\log n\\).</p>
<p>\\(a = 3, b = 4, c_{\\text{crit}} = \\log_4 3 \\approx 0.793\\). \\(f(n) = n \\log n = \\Omega(n^{0.793 + \\epsilon})\\). Regularity: \\(3 \\cdot (n/4)\\log(n/4) \\le (3/4) n \\log n\\) for large \\(n\\). Case 3: \\(T(n) = \\Theta(n \\log n)\\).</p>
</div>
</div>

<div class="env-block warning">
<div class="env-title">Warning (Gaps in the Master Theorem)</div>
<div class="env-body">
<p>The three cases do not cover all possibilities! If \\(f(n)\\) and \\(n^{\\log_b a}\\) differ by less than a polynomial factor (e.g., \\(f(n) = n / \\log n\\) when \\(\\log_b a = 1\\)), the Master Theorem does not apply. Use the Akra-Bazzi method instead.</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch02-viz-master-classifier',
                    title: 'Master Theorem Case Classifier',
                    description: 'Input a, b, and f(n) to automatically determine which case applies',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 420});
                        var a = 2, b = 2, fPow = 1, fLogPow = 0; // f(n) = n^fPow * log^fLogPow(n)

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var ccrit = Math.log(a) / Math.log(b);
                            var fLabel = '';
                            if (fPow === 0 && fLogPow === 0) fLabel = '1';
                            else if (fLogPow === 0) fLabel = 'n^' + fPow.toFixed(1);
                            else if (fPow === 0) fLabel = 'log^' + fLogPow + ' n';
                            else fLabel = 'n^' + fPow.toFixed(1) + ' log^' + fLogPow + ' n';

                            viz.screenText('Master Theorem Classifier', viz.width / 2, 22, viz.colors.white, 15);
                            viz.screenText('T(n) = ' + a + 'T(n/' + b + ') + ' + fLabel, viz.width / 2, 50, viz.colors.orange, 14);
                            viz.screenText('c_crit = log_' + b + '(' + a + ') = ' + ccrit.toFixed(3), viz.width / 2, 75, viz.colors.teal, 13);

                            // Determine case
                            var caseNum = 0;
                            var result = '';
                            var caseColor = viz.colors.white;
                            var explanation = '';

                            if (fPow < ccrit - 0.001) {
                                caseNum = 1;
                                caseColor = viz.colors.green;
                                result = 'T(n) = \u0398(n^' + ccrit.toFixed(3) + ')';
                                explanation = 'f(n) = O(n^{c_crit - \u03B5}): leaf cost dominates.';
                            } else if (Math.abs(fPow - ccrit) < 0.001) {
                                caseNum = 2;
                                caseColor = viz.colors.blue;
                                result = 'T(n) = \u0398(n^' + ccrit.toFixed(3) + ' log^' + (fLogPow + 1) + ' n)';
                                explanation = 'f(n) = \u0398(n^{c_crit} log^k n): balanced, extra log factor.';
                            } else {
                                caseNum = 3;
                                caseColor = viz.colors.red;
                                result = 'T(n) = \u0398(' + fLabel + ')';
                                explanation = 'f(n) = \u03A9(n^{c_crit + \u03B5}): root cost dominates (check regularity).';
                            }

                            // Visual: Three case boxes
                            var boxW = 190, boxH = 80;
                            var cases = [
                                {num: 1, label: 'Case 1', desc: 'Leaf-heavy\nf(n) << n^c_crit', color: viz.colors.green},
                                {num: 2, label: 'Case 2', desc: 'Balanced\nf(n) \u2248 n^c_crit', color: viz.colors.blue},
                                {num: 3, label: 'Case 3', desc: 'Root-heavy\nf(n) >> n^c_crit', color: viz.colors.red}
                            ];

                            for (var i = 0; i < 3; i++) {
                                var bx = 50 + i * (boxW + 25);
                                var by = 110;
                                var active = (cases[i].num === caseNum);
                                ctx.fillStyle = active ? cases[i].color + '33' : viz.colors.bg;
                                ctx.fillRect(bx, by, boxW, boxH);
                                ctx.strokeStyle = active ? cases[i].color : viz.colors.axis;
                                ctx.lineWidth = active ? 3 : 1;
                                ctx.strokeRect(bx, by, boxW, boxH);
                                viz.screenText(cases[i].label, bx + boxW / 2, by + 20, active ? cases[i].color : viz.colors.text, 14);
                                var lines = cases[i].desc.split('\n');
                                for (var l = 0; l < lines.length; l++) {
                                    viz.screenText(lines[l], bx + boxW / 2, by + 40 + l * 18, active ? viz.colors.white : viz.colors.text, 10);
                                }
                            }

                            // Result
                            viz.screenText('\u25B6 ' + explanation, viz.width / 2, 220, caseColor, 13);
                            viz.screenText('Result: ' + result, viz.width / 2, 250, viz.colors.white, 15);

                            // Comparison scale
                            var scaleY = 300;
                            ctx.fillStyle = viz.colors.axis;
                            ctx.fillRect(50, scaleY, viz.width - 100, 2);
                            // Mark c_crit
                            var scaleMin = 0, scaleMax = 4;
                            var ccPos = 50 + (ccrit - scaleMin) / (scaleMax - scaleMin) * (viz.width - 100);
                            var fpPos = 50 + (fPow - scaleMin) / (scaleMax - scaleMin) * (viz.width - 100);

                            ctx.fillStyle = viz.colors.teal;
                            ctx.beginPath(); ctx.arc(ccPos, scaleY, 8, 0, Math.PI * 2); ctx.fill();
                            viz.screenText('c_crit', ccPos, scaleY - 18, viz.colors.teal, 11);
                            viz.screenText(ccrit.toFixed(2), ccPos, scaleY + 20, viz.colors.teal, 10);

                            ctx.fillStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.arc(fpPos, scaleY, 8, 0, Math.PI * 2); ctx.fill();
                            viz.screenText('f power', fpPos, scaleY - 18, viz.colors.orange, 11);
                            viz.screenText(fPow.toFixed(1), fpPos, scaleY + 20, viz.colors.orange, 10);

                            viz.screenText('0', 50, scaleY + 20, viz.colors.text, 9);
                            viz.screenText('4', viz.width - 50, scaleY + 20, viz.colors.text, 9);
                            viz.screenText('polynomial exponent scale', viz.width / 2, scaleY + 40, viz.colors.text, 10);
                        }

                        draw();

                        VizEngine.createSlider(controls, 'a = ', 1, 9, a, 1, function(v) { a = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'b = ', 2, 5, b, 1, function(v) { b = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'f(n) = n^p, p = ', 0, 3, fPow, 0.1, function(v) { fPow = v; draw(); });
                        VizEngine.createSlider(controls, 'log power k = ', 0, 3, fLogPow, 1, function(v) { fLogPow = Math.round(v); draw(); });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Apply the Master Theorem to \\(T(n) = 4T(n/2) + n^2\\).',
                    hint: 'Compute \\(c_{\\text{crit}} = \\log_2 4\\) and compare with the exponent of f(n).',
                    solution: 'a = 4, b = 2, c_crit = log_2 4 = 2. f(n) = n^2 = Theta(n^2 log^0 n). Since f(n) = Theta(n^{c_crit}), Case 2 applies with k=0: T(n) = Theta(n^2 log n).'
                },
                {
                    question: 'Apply the Master Theorem to \\(T(n) = 7T(n/2) + n^2\\).',
                    hint: '\\(c_{\\text{crit}} = \\log_2 7 \\approx 2.807\\).',
                    solution: 'a = 7, b = 2, c_crit = log_2 7 approx 2.807. f(n) = n^2 = O(n^{2.807 - 0.807}) = O(n^{c_crit - epsilon}) with epsilon approx 0.807. Case 1: T(n) = Theta(n^{log_2 7}) = Theta(n^{2.807}).'
                },
                {
                    question: 'For \\(T(n) = 2T(n/2) + n \\log n\\), can the Master Theorem be applied directly?',
                    hint: 'c_crit = 1 and f(n) = n log n. Compare f(n) with n^1.',
                    solution: 'a = 2, b = 2, c_crit = 1. f(n) = n log n = Theta(n^1 * log^1 n). This is Case 2 with k = 1: T(n) = Theta(n log^2 n). The Master Theorem handles the log factor via the extended Case 2.'
                },
                {
                    question: 'Solve \\(T(n) = T(n/2) + n^2\\) using the Master Theorem.',
                    hint: 'a = 1, b = 2.',
                    solution: 'a = 1, b = 2, c_crit = log_2 1 = 0. f(n) = n^2 = Omega(n^{0 + 2}), so epsilon = 2. Check regularity: a*f(n/b) = 1*(n/2)^2 = n^2/4 = (1/4)*f(n) <= c*f(n) with c = 1/4 < 1. Case 3: T(n) = Theta(n^2).'
                },
                {
                    question: 'Why does the Master Theorem fail for \\(T(n) = 2T(n/2) + n / \\log n\\)?',
                    hint: 'Compare f(n) = n / log n with n^{c_crit} = n.',
                    solution: 'c_crit = 1, so n^{c_crit} = n. f(n) = n/log n. For Case 1, we need f(n) = O(n^{1-epsilon}), but n/log n is not polynomially smaller than n (the ratio n / (n/log n) = log n, which is not n^epsilon for any epsilon > 0). For Case 2, we need f(n) = Theta(n log^k n), but n/log n = n log^{-1} n, and k must be >= 0. For Case 3, f must be polynomially larger, but it is smaller. None of the three cases apply. Use Akra-Bazzi or recursion tree instead. (The answer is Theta(n log log n).)'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 5: The Akra-Bazzi Method
        // --------------------------------------------------------
        {
            id: 'ch02-sec05',
            title: 'Akra-Bazzi Method',
            content: `<h2>Akra-Bazzi Method</h2>
<p>The Akra-Bazzi method generalizes the Master Theorem to handle unequal subproblem sizes and covers the "gaps" between the Master Theorem's three cases.</p>

<div class="env-block theorem">
<div class="env-title">Theorem (Akra-Bazzi, 1998)</div>
<div class="env-body">
<p>Consider the recurrence:</p>
$$T(n) = \\sum_{i=1}^{k} a_i T(b_i n + h_i(n)) + g(n)$$
<p>where \\(a_i > 0\\), \\(0 < b_i < 1\\), \\(|h_i(n)| = O(n / \\log^2 n)\\), and \\(|g'(n)| = O(n^c)\\) for some constant \\(c\\).</p>
<p>Find the unique \\(p\\) satisfying \\(\\sum_{i=1}^{k} a_i b_i^p = 1\\). Then:</p>
$$T(n) = \\Theta\\!\\left(n^p \\left(1 + \\int_1^n \\frac{g(u)}{u^{p+1}} \\, du\\right)\\right).$$
</div>
</div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body">
<p>The value \\(p\\) is the "balance point" of the recurrence: it is the exponent that makes the total work from subproblems exactly equal to the leaf count. The integral then accounts for the extra work \\(g(n)\\) at each level.</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example (Unequal Split)</div>
<div class="env-body">
<p>Solve \\(T(n) = T(n/3) + T(2n/3) + n\\).</p>
<p>Find \\(p\\) from \\((1/3)^p + (2/3)^p = 1\\). For \\(p = 1\\): \\(1/3 + 2/3 = 1\\). \\(\\checkmark\\)</p>
<p>Integral: \\(\\int_1^n \\frac{u}{u^2} \\, du = \\int_1^n \\frac{1}{u} \\, du = \\ln n\\).</p>
<p>Therefore: \\(T(n) = \\Theta(n(1 + \\ln n)) = \\Theta(n \\log n)\\).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch02-viz-akra-bazzi"></div>

<div class="env-block example">
<div class="env-title">Example (Gap Case)</div>
<div class="env-body">
<p>Solve \\(T(n) = 2T(n/2) + n / \\log n\\) (which the Master Theorem cannot handle).</p>
<p>Find \\(p\\): \\(2 \\cdot (1/2)^p = 1 \\Rightarrow (1/2)^{p-1} = 1 \\Rightarrow p = 1\\).</p>
<p>Integral: \\(\\int_1^n \\frac{u / \\log u}{u^2} \\, du = \\int_1^n \\frac{1}{u \\log u} \\, du = \\log(\\log n)\\).</p>
<p>Therefore: \\(T(n) = \\Theta(n(1 + \\log \\log n)) = \\Theta(n \\log \\log n)\\).</p>
</div>
</div>

<div class="env-block warning">
<div class="env-title">Warning</div>
<div class="env-body">
<p>The Akra-Bazzi method requires \\(g(n)\\) to have a polynomial growth bound on its derivative. Pathological functions like \\(g(n) = n^{2+\\sin n}\\) are excluded.</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch02-viz-akra-bazzi',
                    title: 'Akra-Bazzi p-Finder',
                    description: 'Numerically find the exponent p for the Akra-Bazzi theorem',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 380, scale: 60, originX: 100, originY: 300});
                        var a1 = 1, b1 = 0.33, a2 = 1, b2 = 0.67;

                        function findP() {
                            // Solve a1 * b1^p + a2 * b2^p = 1 by bisection
                            var lo = -2, hi = 10;
                            for (var iter = 0; iter < 100; iter++) {
                                var mid = (lo + hi) / 2;
                                var val = a1 * Math.pow(b1, mid) + a2 * Math.pow(b2, mid);
                                if (val > 1) lo = mid;
                                else hi = mid;
                            }
                            return (lo + hi) / 2;
                        }

                        function draw() {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();

                            viz.screenText('Akra-Bazzi: Find p where ' + a1 + '\u00B7(' + b1.toFixed(2) + ')^p + ' + a2 + '\u00B7(' + b2.toFixed(2) + ')^p = 1',
                                viz.width / 2, 18, viz.colors.white, 12);

                            // Plot the function h(p) = a1*b1^p + a2*b2^p
                            viz.drawFunction(function(p) {
                                return a1 * Math.pow(b1, p) + a2 * Math.pow(b2, p);
                            }, -1, 8, viz.colors.blue, 2.5, 300);

                            // Horizontal line at y=1
                            var y1 = viz.toScreen(0, 1);
                            viz.ctx.strokeStyle = viz.colors.orange;
                            viz.ctx.lineWidth = 1.5;
                            viz.ctx.setLineDash([4, 4]);
                            viz.ctx.beginPath(); viz.ctx.moveTo(0, y1[1]); viz.ctx.lineTo(viz.width, y1[1]); viz.ctx.stroke();
                            viz.ctx.setLineDash([]);
                            viz.screenText('y = 1', viz.width - 50, y1[1] - 12, viz.colors.orange, 11);

                            // Mark solution
                            var p = findP();
                            var sp = viz.toScreen(p, 1);
                            viz.ctx.fillStyle = viz.colors.green;
                            viz.ctx.beginPath(); viz.ctx.arc(sp[0], sp[1], 7, 0, Math.PI * 2); viz.ctx.fill();
                            viz.screenText('p = ' + p.toFixed(4), sp[0] + 15, sp[1] - 15, viz.colors.green, 13);

                            // Legend
                            viz.screenText('h(p) = \u03A3 a_i \u00B7 b_i^p', viz.width - 110, 55, viz.colors.blue, 11);
                            viz.screenText('Solution: T(n) = \u0398(n^' + p.toFixed(3) + ' \u00B7 (1 + integral))', viz.width / 2, viz.height - 15, viz.colors.teal, 12);
                            viz.screenText('p', viz.width - 15, viz.originY + 5, viz.colors.text, 12);
                        }

                        draw();

                        VizEngine.createSlider(controls, 'a\u2081 = ', 1, 4, a1, 1, function(v) { a1 = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'b\u2081 = ', 0.1, 0.9, b1, 0.01, function(v) { b1 = v; draw(); });
                        VizEngine.createSlider(controls, 'a\u2082 = ', 0, 4, a2, 1, function(v) { a2 = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'b\u2082 = ', 0.1, 0.9, b2, 0.01, function(v) { b2 = v; draw(); });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use Akra-Bazzi to solve \\(T(n) = T(n/5) + T(7n/10) + n\\).',
                    hint: 'Find p from (1/5)^p + (7/10)^p = 1.',
                    solution: 'Solve (1/5)^p + (7/10)^p = 1. At p=1: 1/5 + 7/10 = 9/10 < 1. At p=0: 1 + 1 = 2 > 1. So 0 < p < 1. Numerical solution: p approximately 0.84. Integral: integral from 1 to n of u/u^{p+1} du = integral u^{-p} du = n^{1-p}/(1-p). So T(n) = Theta(n^p * n^{1-p}) = Theta(n). Actually more carefully: since p < 1, the integral gives Theta(n^{1-p}), so T(n) = Theta(n^p * n^{1-p}) = Theta(n).'
                },
                {
                    question: 'Verify that the Master Theorem gives the same answer as Akra-Bazzi for \\(T(n) = 2T(n/2) + n\\).',
                    hint: 'Akra-Bazzi: 2*(1/2)^p = 1, so p = 1.',
                    solution: 'Akra-Bazzi: 2*(1/2)^p = 1, so (1/2)^{p-1} = 1, so p = 1. Integral: integral_1^n u/u^2 du = integral_1^n 1/u du = ln n. So T(n) = Theta(n * (1 + ln n)) = Theta(n log n). Master Theorem: a=2, b=2, c_crit=1, f(n)=n=Theta(n^1), Case 2: T(n) = Theta(n log n). Same answer!'
                },
                {
                    question: 'Show that the Master Theorem cannot handle \\(T(n) = 4T(n/2) + n^2 / \\log n\\), but Akra-Bazzi can. Find the solution.',
                    hint: 'c_crit = 2, and n^2/log n is not polynomially smaller or larger than n^2.',
                    solution: 'Master Theorem: a=4, b=2, c_crit=2. f(n) = n^2/log n. For Case 2, need f(n) = Theta(n^2 log^k n) for k >= 0, but f(n) = n^2 log^{-1} n (k=-1 < 0). Case 1 needs f = O(n^{2-epsilon}), but n^2/log n is not polynomially smaller. Case 3 requires f polynomially larger. No case applies. Akra-Bazzi: p = 2. Integral: integral_1^n (u^2/log u) / u^3 du = integral_1^n 1/(u log u) du = log(log n). So T(n) = Theta(n^2(1 + log log n)) = Theta(n^2 log log n).'
                }
            ]
        }
    ]
});
