// ============================================================
// Chapter 0 · Introduction & Models of Computation
// Introduction to Algorithms & Models of Computation
// ============================================================
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch00',
    number: 0,
    title: 'Introduction & Models of Computation',
    subtitle: 'Introduction to Algorithms & Models of Computation',
    sections: [
        // --------------------------------------------------------
        // Section 1: What is an Algorithm?
        // --------------------------------------------------------
        {
            id: 'ch00-sec01',
            title: 'What Is an Algorithm',
            content: `<h2>What Is an Algorithm</h2>
<div class="env-block bridge"><div class="env-title">Chapter Overview</div><div class="env-body"><p>Welcome to the study of algorithms. This opening chapter lays the foundation for everything that follows: we define what an algorithm is, develop tools for proving correctness, introduce the computational model we will use for analysis, and get our first taste of running time analysis. By the end, you will see why the quest for efficient algorithms matters and what lies ahead in this course.</p></div></div>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>In this section, we pin down the formal definition of an algorithm and introduce the sorting problem as our running example. We also meet Insertion Sort, the simplest sorting algorithm, which will serve as the subject for the analysis techniques developed in the rest of the chapter.</p></div></div>

<p>An <strong>algorithm</strong> is a well-defined, finite sequence of instructions that transforms an input into a desired output. This deceptively simple definition hides a rich tapestry of ideas that have occupied mathematicians and computer scientists for over a century.</p>

<div class="env-block definition">
<div class="env-title">Definition (Algorithm)</div>
<div class="env-body">
<p>An <strong>algorithm</strong> is a finite procedure that:</p>
<ol>
<li><strong>Input</strong>: takes zero or more values from a specified set;</li>
<li><strong>Output</strong>: produces at least one value;</li>
<li><strong>Definiteness</strong>: each step is precisely and unambiguously specified;</li>
<li><strong>Finiteness</strong>: terminates after a finite number of steps for every valid input;</li>
<li><strong>Effectiveness</strong>: each step is basic enough to be carried out in finite time.</li>
</ol>
</div>
</div>

<p>Consider the simplest possible computational problem: given a sequence \\(A = \\langle a_1, a_2, \\ldots, a_n \\rangle\\), produce a permutation \\(\\langle a'_1, a'_2, \\ldots, a'_n \\rangle\\) such that \\(a'_1 \\le a'_2 \\le \\cdots \\le a'_n\\). This is the <strong>sorting problem</strong>, and it will serve as our running example throughout this chapter.</p>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body">
<p>Think of an algorithm as a recipe. Just as a recipe specifies exact ingredients (inputs), precise instructions (steps), and a finished dish (output), an algorithm provides a systematic procedure for solving a computational problem. The key difference: an algorithm must work correctly for <em>every</em> valid input, not just the specific case you happen to test.</p>
</div>
</div>

<p>The study of algorithms encompasses several fundamental questions:</p>
<ul>
<li><strong>Correctness</strong>: Does the algorithm produce the right answer for every input?</li>
<li><strong>Efficiency</strong>: How much time and space does it consume?</li>
<li><strong>Optimality</strong>: Can we do better, or have we reached a fundamental limit?</li>
</ul>

<div class="viz-placeholder" data-viz="ch00-viz-algo-pipeline"></div>

<p>We will begin with the simplest sorting algorithm &mdash; <strong>Insertion Sort</strong> &mdash; and use it to illustrate all three questions.</p>`,
            visualizations: [
                {
                    id: 'ch00-viz-algo-pipeline',
                    title: 'Algorithm Pipeline',
                    description: 'Interactive illustration of an algorithm as an input-process-output pipeline',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 300});
                        var inputArr = [5, 2, 8, 1, 9, 3];
                        var sortedArr = [1, 2, 3, 5, 8, 9];
                        var phase = 0; // 0=input, 1=processing, 2=output

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var W = viz.width, H = viz.height;

                            // Title
                            viz.screenText('Algorithm as a Black Box', W / 2, 25, viz.colors.white, 16);

                            // Input box
                            ctx.fillStyle = viz.colors.blue + '22';
                            ctx.fillRect(30, 70, 180, 160);
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(30, 70, 180, 160);
                            viz.screenText('Input', 120, 60, viz.colors.blue, 14);

                            // Draw input array
                            for (var i = 0; i < inputArr.length; i++) {
                                var px = 50 + (i % 3) * 50;
                                var py = 90 + Math.floor(i / 3) * 55;
                                viz.drawArrayCell(px, py, 40, 40, inputArr[i],
                                    phase >= 1 ? viz.colors.blue + '44' : viz.colors.bg,
                                    viz.colors.white,
                                    phase >= 1 ? viz.colors.blue : null);
                            }

                            // Arrow input -> process
                            ctx.strokeStyle = phase >= 1 ? viz.colors.teal : viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(220, 150); ctx.lineTo(270, 150); ctx.stroke();
                            ctx.fillStyle = phase >= 1 ? viz.colors.teal : viz.colors.axis;
                            ctx.beginPath(); ctx.moveTo(280, 150); ctx.lineTo(268, 143); ctx.lineTo(268, 157); ctx.closePath(); ctx.fill();

                            // Process box
                            ctx.fillStyle = phase >= 1 ? viz.colors.teal + '22' : viz.colors.bg;
                            ctx.fillRect(285, 90, 130, 120);
                            ctx.strokeStyle = phase >= 1 ? viz.colors.teal : viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(285, 90, 130, 120);
                            viz.screenText('Algorithm', 350, 80, phase >= 1 ? viz.colors.teal : viz.colors.axis, 14);

                            if (phase >= 1) {
                                viz.screenText('Insertion', 350, 135, viz.colors.teal, 13);
                                viz.screenText('Sort', 350, 155, viz.colors.teal, 13);
                                // Gear icon
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath(); ctx.arc(350, 180, 10, 0, Math.PI * 2); ctx.stroke();
                            } else {
                                viz.screenText('?', 350, 150, viz.colors.axis, 24);
                            }

                            // Arrow process -> output
                            ctx.strokeStyle = phase >= 2 ? viz.colors.green : viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(425, 150); ctx.lineTo(475, 150); ctx.stroke();
                            ctx.fillStyle = phase >= 2 ? viz.colors.green : viz.colors.axis;
                            ctx.beginPath(); ctx.moveTo(485, 150); ctx.lineTo(473, 143); ctx.lineTo(473, 157); ctx.closePath(); ctx.fill();

                            // Output box
                            ctx.fillStyle = phase >= 2 ? viz.colors.green + '22' : viz.colors.bg;
                            ctx.fillRect(490, 70, 180, 160);
                            ctx.strokeStyle = phase >= 2 ? viz.colors.green : viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.strokeRect(490, 70, 180, 160);
                            viz.screenText('Output', 580, 60, phase >= 2 ? viz.colors.green : viz.colors.axis, 14);

                            if (phase >= 2) {
                                for (var j = 0; j < sortedArr.length; j++) {
                                    var px2 = 510 + (j % 3) * 50;
                                    var py2 = 90 + Math.floor(j / 3) * 55;
                                    viz.drawArrayCell(px2, py2, 40, 40, sortedArr[j],
                                        viz.colors.green + '44', viz.colors.white, viz.colors.green);
                                }
                            }

                            // Properties checklist
                            var props = ['Definiteness', 'Finiteness', 'Correctness'];
                            for (var k = 0; k < props.length; k++) {
                                var checked = phase >= 2;
                                viz.screenText((checked ? '\u2713 ' : '\u25CB ') + props[k],
                                    350, 240 + k * 20,
                                    checked ? viz.colors.green : viz.colors.text, 12);
                            }
                        }

                        draw();

                        VizEngine.createButton(controls, 'Next Step', function() {
                            phase = (phase + 1) % 3;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            phase = 0;
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Which of the five properties of an algorithm (Input, Output, Definiteness, Finiteness, Effectiveness) is violated by the following procedure: "Keep incrementing \\(x\\) until \\(x\\) is a perfect square that is also negative"?',
                    hint: 'Can a perfect square be negative (in the reals)?',
                    solution: 'Finiteness is violated. No real perfect square is negative, so the loop never terminates. The procedure runs forever on every input.'
                },
                {
                    question: 'Give an example of a well-defined procedure that is NOT an algorithm according to our definition.',
                    hint: 'Think about procedures that might not terminate.',
                    solution: 'A procedure that enumerates all prime numbers: while n = 2, 3, 5, ..., print n if n is prime. This procedure is well-defined and effective, but it never terminates (there are infinitely many primes), so it violates finiteness.'
                },
                {
                    question: 'The sorting problem requires producing a permutation of the input. Why is the permutation requirement important?',
                    hint: 'What if we dropped the permutation requirement?',
                    solution: 'Without the permutation requirement, we could trivially output any sorted sequence (e.g., [1, 1, 1, ...]) regardless of input. The permutation requirement ensures the output contains exactly the same elements as the input, just rearranged.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 2: Correctness and Loop Invariants
        // --------------------------------------------------------
        {
            id: 'ch00-sec02',
            title: 'Correctness & Loop Invariants',
            content: `<h2>Correctness & Loop Invariants</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Having defined Insertion Sort, a natural question arises: how do we <em>know</em> it works? This section introduces loop invariants, the primary tool for proving iterative algorithms correct, and applies it to Insertion Sort.</p></div></div>

<p>How do we <em>prove</em> that an algorithm is correct? For iterative algorithms, the primary tool is the <strong>loop invariant</strong>.</p>

<div class="env-block definition">
<div class="env-title">Definition (Loop Invariant)</div>
<div class="env-body">
<p>A <strong>loop invariant</strong> is a property that holds:</p>
<ol>
<li><strong>Initialization</strong>: The property is true before the first iteration.</li>
<li><strong>Maintenance</strong>: If it is true before an iteration, it remains true after that iteration.</li>
<li><strong>Termination</strong>: When the loop terminates, the invariant gives a useful property that helps show correctness.</li>
</ol>
</div>
</div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body">
<p>A loop invariant is like mathematical induction applied to loops. Initialization is the base case, maintenance is the inductive step, and termination connects back to the problem specification.</p>
</div>
</div>

<div class="env-block algorithm">
<div class="env-title">Algorithm (Insertion Sort)</div>
<div class="env-body">
<pre>
INSERTION-SORT(A, n)
  for j = 2 to n
      key = A[j]
      // Insert A[j] into sorted subarray A[1..j-1]
      i = j - 1
      while i > 0 and A[i] > key
          A[i+1] = A[i]
          i = i - 1
      A[i+1] = key
</pre>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem (Correctness of Insertion Sort)</div>
<div class="env-body">
<p><strong>Loop Invariant</strong>: At the start of each iteration of the outer <code>for</code> loop (indexed by \\(j\\)), the subarray \\(A[1..j-1]\\) consists of the elements originally in \\(A[1..j-1]\\), but in sorted order.</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof</div>
<div class="env-body">
<p><strong>Initialization</strong>: When \\(j = 2\\), the subarray \\(A[1..1]\\) contains a single element, which is trivially sorted. \\(\\checkmark\\)</p>
<p><strong>Maintenance</strong>: The inner <code>while</code> loop shifts elements \\(A[j-1], A[j-2], \\ldots\\) one position to the right until the correct position for <code>key</code> \\(= A[j]\\) is found. After placing <code>key</code>, the subarray \\(A[1..j]\\) is sorted. \\(\\checkmark\\)</p>
<p><strong>Termination</strong>: The loop terminates when \\(j = n + 1\\). Substituting into the invariant, \\(A[1..n]\\) is sorted and is a permutation of the original array. \\(\\checkmark\\)</p>
<p class="qed">&marker;</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch00-viz-insertion-sort"></div>

<p>The visualization above lets you step through Insertion Sort and observe the loop invariant at each stage. The <span style="color:#3fb950;">green</span> region is the sorted prefix; the <span style="color:#f0883e;">orange</span> element is the key being inserted.</p>`,
            visualizations: [
                {
                    id: 'ch00-viz-insertion-sort',
                    title: 'Insertion Sort Step-by-Step',
                    description: 'Interactive step-through of insertion sort with loop invariant highlighted',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 380});
                        var original = [5, 2, 8, 1, 9, 3, 7, 4];
                        var arr = original.slice();
                        var n = arr.length;
                        var cellW = 55, cellH = 45;
                        var startX = 80, startY = 100;

                        // Build step history
                        var steps = [];
                        var a = original.slice();
                        // Initial state
                        steps.push({arr: a.slice(), j: 1, i: -1, phase: 'init', sorted: 1, keyVal: null, comparisons: 0, swaps: 0});
                        var totalComp = 0, totalSwap = 0;
                        for (var jj = 1; jj < n; jj++) {
                            var key = a[jj];
                            steps.push({arr: a.slice(), j: jj, i: jj - 1, phase: 'pick', sorted: jj, keyVal: key, comparisons: totalComp, swaps: totalSwap});
                            var ii = jj - 1;
                            while (ii >= 0 && a[ii] > key) {
                                totalComp++;
                                a[ii + 1] = a[ii];
                                totalSwap++;
                                steps.push({arr: a.slice(), j: jj, i: ii, phase: 'shift', sorted: jj, keyVal: key, comparisons: totalComp, swaps: totalSwap});
                                ii--;
                            }
                            if (ii >= 0) totalComp++;
                            a[ii + 1] = key;
                            steps.push({arr: a.slice(), j: jj, i: ii + 1, phase: 'place', sorted: jj + 1, keyVal: key, comparisons: totalComp, swaps: totalSwap});
                        }
                        steps.push({arr: a.slice(), j: n, i: -1, phase: 'done', sorted: n, keyVal: null, comparisons: totalComp, swaps: totalSwap});

                        var step = 0;

                        function draw() {
                            viz.clear();
                            var s = steps[step];
                            var ctx = viz.ctx;

                            viz.screenText('Insertion Sort \u2014 Loop Invariant Visualization', viz.width / 2, 25, viz.colors.white, 15);

                            // Draw array
                            for (var idx = 0; idx < n; idx++) {
                                var color = viz.colors.bg;
                                var hl = null;
                                if (idx < s.sorted && s.phase !== 'init') {
                                    color = viz.colors.green + '33';
                                }
                                if (s.phase === 'pick' && idx === s.j) {
                                    hl = viz.colors.orange;
                                }
                                if (s.phase === 'shift' && idx === s.i + 1) {
                                    hl = viz.colors.red;
                                }
                                if (s.phase === 'place' && idx === s.i) {
                                    hl = viz.colors.orange;
                                    color = viz.colors.green + '33';
                                }
                                viz.drawArrayCell(startX + idx * cellW, startY, cellW, cellH, s.arr[idx], color, viz.colors.white, hl);
                            }

                            // Index labels
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            for (var idx2 = 0; idx2 < n; idx2++) {
                                ctx.fillText(idx2, startX + idx2 * cellW + cellW / 2, startY + cellH + 16);
                            }

                            // Sorted region bracket
                            if (s.sorted > 0 && s.phase !== 'init') {
                                ctx.strokeStyle = viz.colors.green;
                                ctx.lineWidth = 2;
                                var bx1 = startX;
                                var bx2 = startX + s.sorted * cellW;
                                var by = startY - 15;
                                ctx.beginPath(); ctx.moveTo(bx1, by + 8); ctx.lineTo(bx1, by); ctx.lineTo(bx2, by); ctx.lineTo(bx2, by + 8); ctx.stroke();
                                viz.screenText('sorted', (bx1 + bx2) / 2, by - 10, viz.colors.green, 11);
                            }

                            // Key indicator
                            if (s.keyVal !== null) {
                                viz.screenText('key = ' + s.keyVal, viz.width - 100, startY + 20, viz.colors.orange, 14);
                            }

                            // Phase description
                            var desc = '';
                            if (s.phase === 'init') desc = 'Initial array. The invariant trivially holds for A[0..0].';
                            else if (s.phase === 'pick') desc = 'Pick key = A[' + s.j + '] = ' + s.keyVal + '. Sorted prefix: A[0..' + (s.j - 1) + '].';
                            else if (s.phase === 'shift') desc = 'A[' + s.i + '] = ' + s.arr[s.i] + ' > key, shift right.';
                            else if (s.phase === 'place') desc = 'Place key = ' + s.keyVal + ' at position ' + s.i + '. Sorted prefix grows.';
                            else if (s.phase === 'done') desc = 'Done! The entire array is sorted. Loop invariant \u2192 correctness.';
                            viz.screenText(desc, viz.width / 2, startY + cellH + 50, viz.colors.text, 12);

                            // Stats
                            viz.screenText('Comparisons: ' + s.comparisons + '    Shifts: ' + s.swaps, viz.width / 2, startY + cellH + 75, viz.colors.purple, 11);
                            viz.screenText('Step ' + (step + 1) + ' / ' + steps.length, viz.width / 2, viz.height - 20, viz.colors.text, 11);

                            // Loop invariant box
                            ctx.fillStyle = viz.colors.teal + '15';
                            ctx.fillRect(40, startY + cellH + 95, viz.width - 80, 60);
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 1;
                            ctx.strokeRect(40, startY + cellH + 95, viz.width - 80, 60);
                            viz.screenText('Loop Invariant', viz.width / 2, startY + cellH + 108, viz.colors.teal, 12);
                            viz.screenText('A[0..' + (Math.max(0, s.sorted - 1)) + '] is a sorted permutation of the original A[0..' + (Math.max(0, s.sorted - 1)) + ']',
                                viz.width / 2, startY + cellH + 130, viz.colors.white, 11);
                        }

                        draw();

                        VizEngine.createButton(controls, '\u25C0 Prev', function() {
                            if (step > 0) { step--; draw(); }
                        });
                        VizEngine.createButton(controls, 'Next \u25B6', function() {
                            if (step < steps.length - 1) { step++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            step = 0; draw();
                        });
                        VizEngine.createButton(controls, 'Auto Play', function() {
                            var interval = setInterval(function() {
                                if (step < steps.length - 1) { step++; draw(); }
                                else clearInterval(interval);
                            }, 600);
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'State a loop invariant for the inner <code>while</code> loop of Insertion Sort and prove initialization and maintenance.',
                    hint: 'The inner loop shifts elements. What is true about A[i+2..j] at the start of each inner iteration?',
                    solution: 'Invariant: at the start of each inner iteration, A[i+2..j] contains the original elements of A[i+1..j-1] (each shifted right by one), and A[i+2..j] is sorted and all elements in A[i+2..j] are greater than key. Initialization: when i = j-1, A[j+1..j] is empty, so the invariant holds vacuously. Maintenance: if A[i] > key, we set A[i+1] = A[i], extending the shifted region by one. The sorted order is preserved because we only move elements larger than key.'
                },
                {
                    question: 'Prove that Insertion Sort is a <strong>stable</strong> sorting algorithm.',
                    hint: 'Focus on the condition A[i] > key (strict inequality). What happens to equal elements?',
                    solution: 'The inner loop condition is A[i] > key (strict). When A[i] = key, the loop stops and key is placed at position i+1, which is immediately after the equal element. Since equal elements are never swapped past each other, their original relative order is preserved. Therefore Insertion Sort is stable.'
                },
                {
                    question: 'What is the best-case and worst-case number of comparisons for Insertion Sort on an array of size \\(n\\)?',
                    hint: 'Best case: already sorted. Worst case: reverse sorted.',
                    solution: 'Best case (already sorted): each key is compared once with its predecessor and found to be in place. Total: n-1 comparisons, so \\(\\Theta(n)\\). Worst case (reverse sorted): each key A[j] must be compared with all j-1 elements before it. Total: \\(\\sum_{j=2}^{n}(j-1) = n(n-1)/2 = \\Theta(n^2)\\) comparisons.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 3: The RAM Model
        // --------------------------------------------------------
        {
            id: 'ch00-sec03',
            title: 'RAM Model of Computation',
            content: `<h2>RAM Model of Computation</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Correctness is only half the story. To measure efficiency, we need a precise model of what operations cost. This section introduces the Random Access Machine (RAM) model, which provides the foundation for all the running time analyses in this course.</p></div></div>

<p>To analyze algorithms rigorously, we need a precise model of computation that tells us what operations are available and how much they cost. The <strong>Random Access Machine (RAM)</strong> model is the standard abstraction used throughout algorithm analysis.</p>

<div class="env-block definition">
<div class="env-title">Definition (RAM Model)</div>
<div class="env-body">
<p>The <strong>Random Access Machine</strong> (RAM) model of computation consists of:</p>
<ul>
<li>An unbounded sequence of <strong>memory cells</strong> \\(M[0], M[1], M[2], \\ldots\\), each capable of holding an arbitrarily large integer.</li>
<li>A finite set of <strong>registers</strong> (including a program counter).</li>
<li>A set of <strong>primitive operations</strong>, each taking \\(O(1)\\) time:
  <ul>
  <li>Arithmetic: \\(+, -, \\times, \\lfloor / \\rfloor, \\mathrm{mod}\\)</li>
  <li>Comparison: \\(<, \\le, =, \\ge, >\\)</li>
  <li>Memory access: load \\(M[i]\\), store to \\(M[i]\\) (random access)</li>
  <li>Control flow: branch, jump, halt</li>
  </ul>
</li>
</ul>
</div>
</div>

<div class="env-block warning">
<div class="env-title">Warning</div>
<div class="env-body">
<p>The RAM model is an <em>abstraction</em>. Real computers have caches, pipelines, branch prediction, and finite word sizes. The RAM model ignores these details to focus on the <em>intrinsic</em> complexity of algorithms. In practice, cache behavior can dominate running time for large datasets.</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch00-viz-ram-model"></div>

<p>Under the RAM model, each line of pseudocode executes in constant time. This lets us count the number of times each line executes and sum their costs to get the total running time.</p>

<div class="env-block example">
<div class="env-title">Example (Counting Operations in Insertion Sort)</div>
<div class="env-body">
<p>Consider Insertion Sort on input of size \\(n\\):</p>
<table style="width:100%;border-collapse:collapse;margin:8px 0;">
<tr style="border-bottom:1px solid #30363d;"><th style="text-align:left;padding:4px;">Line</th><th style="text-align:left;padding:4px;">Cost</th><th style="text-align:left;padding:4px;">Times</th></tr>
<tr><td style="padding:4px;"><code>for j = 2 to n</code></td><td style="padding:4px;">\\(c_1\\)</td><td style="padding:4px;">\\(n\\)</td></tr>
<tr><td style="padding:4px;"><code>key = A[j]</code></td><td style="padding:4px;">\\(c_2\\)</td><td style="padding:4px;">\\(n-1\\)</td></tr>
<tr><td style="padding:4px;"><code>i = j - 1</code></td><td style="padding:4px;">\\(c_3\\)</td><td style="padding:4px;">\\(n-1\\)</td></tr>
<tr><td style="padding:4px;"><code>while i > 0 and A[i] > key</code></td><td style="padding:4px;">\\(c_4\\)</td><td style="padding:4px;">\\(\\sum_{j=2}^{n} t_j\\)</td></tr>
<tr><td style="padding:4px;"><code>A[i+1] = A[i]</code></td><td style="padding:4px;">\\(c_5\\)</td><td style="padding:4px;">\\(\\sum_{j=2}^{n} (t_j - 1)\\)</td></tr>
<tr><td style="padding:4px;"><code>i = i - 1</code></td><td style="padding:4px;">\\(c_6\\)</td><td style="padding:4px;">\\(\\sum_{j=2}^{n} (t_j - 1)\\)</td></tr>
<tr><td style="padding:4px;"><code>A[i+1] = key</code></td><td style="padding:4px;">\\(c_7\\)</td><td style="padding:4px;">\\(n-1\\)</td></tr>
</table>
<p>where \\(t_j\\) is the number of times the while-loop test executes for iteration \\(j\\).</p>
<p>Total: \\(T(n) = c_1 n + (c_2 + c_3 + c_7)(n-1) + c_4 \\sum t_j + (c_5 + c_6)\\sum(t_j - 1)\\).</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch00-viz-ram-model',
                    title: 'RAM Model Memory Simulator',
                    description: 'Interactive RAM model showing registers, memory cells, and operations',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var memory = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        var registers = {PC: 0, R0: 0, R1: 0, R2: 0};
                        var program = [
                            {op: 'LOAD', args: ['R0', 5], desc: 'R0 \u2190 5'},
                            {op: 'STORE', args: ['R0', 0], desc: 'M[0] \u2190 R0'},
                            {op: 'LOAD', args: ['R1', 3], desc: 'R1 \u2190 3'},
                            {op: 'STORE', args: ['R1', 1], desc: 'M[1] \u2190 R1'},
                            {op: 'ADD', args: ['R2', 'R0', 'R1'], desc: 'R2 \u2190 R0 + R1'},
                            {op: 'STORE', args: ['R2', 2], desc: 'M[2] \u2190 R2'},
                            {op: 'HALT', args: [], desc: 'Halt'}
                        ];
                        var pc = 0;
                        var running = false;

                        function executeStep() {
                            if (pc >= program.length) return;
                            var instr = program[pc];
                            if (instr.op === 'LOAD') {
                                registers[instr.args[0]] = instr.args[1];
                            } else if (instr.op === 'STORE') {
                                memory[instr.args[1]] = registers[instr.args[0]];
                            } else if (instr.op === 'ADD') {
                                registers[instr.args[0]] = registers[instr.args[1]] + registers[instr.args[2]];
                            }
                            pc++;
                            registers.PC = pc;
                        }

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            viz.screenText('RAM Model Simulator', viz.width / 2, 22, viz.colors.white, 15);

                            // Registers
                            viz.screenText('Registers', 90, 55, viz.colors.blue, 13);
                            var regNames = ['PC', 'R0', 'R1', 'R2'];
                            for (var r = 0; r < regNames.length; r++) {
                                var ry = 75 + r * 38;
                                ctx.fillStyle = viz.colors.blue + '22';
                                ctx.fillRect(30, ry, 120, 30);
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 1;
                                ctx.strokeRect(30, ry, 120, 30);
                                viz.screenText(regNames[r], 60, ry + 15, viz.colors.blue, 12, 'center', 'middle');
                                viz.screenText(String(registers[regNames[r]]), 120, ry + 15, viz.colors.white, 13, 'center', 'middle');
                            }

                            // Memory cells
                            viz.screenText('Memory', viz.width / 2 + 50, 55, viz.colors.teal, 13);
                            for (var m = 0; m < 12; m++) {
                                var mx = 200 + (m % 6) * 75;
                                var my = 75 + Math.floor(m / 6) * 38;
                                var highlight = null;
                                // Highlight recently written cell
                                if (pc > 0 && pc <= program.length) {
                                    var prev = program[pc - 1];
                                    if (prev && prev.op === 'STORE' && prev.args[1] === m) {
                                        highlight = viz.colors.orange;
                                    }
                                }
                                ctx.fillStyle = highlight ? highlight + '33' : viz.colors.bg;
                                ctx.fillRect(mx, my, 68, 30);
                                ctx.strokeStyle = highlight || viz.colors.teal;
                                ctx.lineWidth = highlight ? 2 : 0.5;
                                ctx.strokeRect(mx, my, 68, 30);
                                viz.screenText('M[' + m + ']', mx + 25, my + 15, viz.colors.text, 10, 'center', 'middle');
                                viz.screenText(String(memory[m]), mx + 52, my + 15, viz.colors.white, 12, 'center', 'middle');
                            }

                            // Program listing
                            viz.screenText('Program', viz.width / 2, 175, viz.colors.purple, 13);
                            for (var p = 0; p < program.length; p++) {
                                var py = 195 + p * 24;
                                var isCurrent = (p === pc && pc < program.length);
                                if (isCurrent) {
                                    ctx.fillStyle = viz.colors.purple + '33';
                                    ctx.fillRect(80, py - 4, viz.width - 160, 22);
                                }
                                var textCol = p < pc ? viz.colors.green : (isCurrent ? viz.colors.orange : viz.colors.text);
                                var prefix = p < pc ? '\u2713 ' : (isCurrent ? '\u25B6 ' : '  ');
                                viz.screenText(prefix + p + ': ' + program[p].desc, viz.width / 2, py + 7, textCol, 12);
                            }

                            // Status
                            var status = pc >= program.length ? 'HALTED' : 'Ready (PC = ' + pc + ')';
                            viz.screenText(status, viz.width / 2, viz.height - 18, pc >= program.length ? viz.colors.green : viz.colors.text, 12);

                            // Cost note
                            viz.screenText('Each instruction costs O(1) time under the RAM model', viz.width / 2, viz.height - 38, viz.colors.text, 10);
                        }

                        draw();

                        VizEngine.createButton(controls, 'Step', function() {
                            executeStep();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Run All', function() {
                            while (pc < program.length) executeStep();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            pc = 0;
                            registers = {PC: 0, R0: 0, R1: 0, R2: 0};
                            memory = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In the RAM model, which of the following operations are \\(O(1)\\)? (a) Adding two integers, (b) Sorting an array, (c) Accessing \\(M[i]\\) for arbitrary \\(i\\), (d) Multiplying two \\(n\\)-bit numbers.',
                    hint: 'Under the standard RAM model, primitive arithmetic on words is O(1).',
                    solution: '(a) O(1) \u2014 arithmetic on machine words is a primitive. (c) O(1) \u2014 random access by definition. (b) NOT O(1) \u2014 sorting requires at least \\(\\Omega(n \\log n)\\) comparisons. (d) Under the unit-cost RAM, O(1); under the log-cost RAM (where cost depends on operand size), it would be \\(O(n^2)\\) or \\(O(n \\log n)\\) depending on the multiplication algorithm.'
                },
                {
                    question: 'Why does the RAM model assume each memory access costs \\(O(1)\\) even though real memory has a hierarchy (L1, L2, L3 cache, RAM, disk)?',
                    hint: 'Think about the purpose of the model as an abstraction.',
                    solution: 'The RAM model is an abstraction for analyzing the intrinsic complexity of algorithms independent of hardware details. The O(1) access assumption simplifies analysis and captures the dominant cost factor for many algorithms. When cache effects matter (e.g., for matrix multiplication or B-trees), we use specialized models like the external memory model or cache-oblivious model.'
                },
                {
                    question: 'Compute the exact number of primitive operations that Insertion Sort performs on the input \\([3, 1, 2]\\).',
                    hint: 'Trace through the pseudocode line by line, counting each executed statement.',
                    solution: 'j=2: key=1, compare A[1]=3>1 (1 comp), shift 3 right (1 shift), place 1 at position 1. j=3: key=2, compare A[2]=3>2 (1 comp), shift 3 right (1 shift), compare A[1]=1>2 false (1 comp), place 2 at position 2. Total detailed count: for-loop test: 3, assignments key=A[j]: 2, i=j-1: 2, while tests: 2+2=4 (counting the failing test), shifts: 1+1=2, i--: 1+1=2, final place: 2. Grand total depends on exact counting convention, but approximately 17-20 primitive operations.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 4: Analyzing Insertion Sort
        // --------------------------------------------------------
        {
            id: 'ch00-sec04',
            title: 'Running Time Analysis of Insertion Sort',
            content: `<h2>Running Time Analysis of Insertion Sort</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>With the RAM model in hand, we can now analyze Insertion Sort rigorously. This section derives best-case, worst-case, and average-case running times, revealing the quadratic cost that motivates the search for faster algorithms.</p></div></div>

<p>Let us put the RAM model to work and derive precise running time bounds for Insertion Sort.</p>

<div class="env-block theorem">
<div class="env-title">Theorem (Running Time of Insertion Sort)</div>
<div class="env-body">
<p>On an input of size \\(n\\):</p>
<ul>
<li><strong>Best case</strong> (already sorted): \\(T(n) = \\Theta(n)\\).</li>
<li><strong>Worst case</strong> (reverse sorted): \\(T(n) = \\Theta(n^2)\\).</li>
<li><strong>Average case</strong> (random permutation): \\(T(n) = \\Theta(n^2)\\).</li>
</ul>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof (Worst case)</div>
<div class="env-body">
<p>When the input is in reverse sorted order, each element \\(A[j]\\) must be compared with all \\(j-1\\) preceding elements. The total number of comparisons is:</p>
$$\\sum_{j=2}^{n}(j-1) = 1 + 2 + \\cdots + (n-1) = \\frac{n(n-1)}{2} = \\Theta(n^2).$$
<p class="qed">&marker;</p>
</div>
</div>

<div class="env-block proof">
<div class="env-title">Proof (Average case)</div>
<div class="env-body">
<p>For a random permutation, the expected number of inversions is \\(\\binom{n}{2}/2 = n(n-1)/4\\). Each comparison-and-shift resolves at most one inversion, so the expected work is \\(\\Theta(n^2)\\).</p>
<p class="qed">&marker;</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch00-viz-comparison-counter"></div>

<p>The visualization above lets you experiment with different input configurations and observe how the number of comparisons changes. Notice the quadratic growth in the worst case versus the linear growth in the best case.</p>

<div class="viz-placeholder" data-viz="ch00-viz-input-size-timing"></div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body">
<p>The key insight: in the worst case, each of the \\(n\\) elements must "travel" past \\(O(n)\\) other elements. This gives \\(O(n) \\times O(n) = O(n^2)\\) work. The question that drives much of algorithm design: can we reduce the distance each element must travel?</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch00-viz-comparison-counter',
                    title: 'Comparison Counter',
                    description: 'Count comparisons for different input orderings',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 350});
                        var size = 8;
                        var inputType = 'random';

                        function generateInput(type, n) {
                            var a = [];
                            if (type === 'sorted') {
                                for (var i = 1; i <= n; i++) a.push(i);
                            } else if (type === 'reverse') {
                                for (var i = n; i >= 1; i--) a.push(i);
                            } else {
                                for (var i = 1; i <= n; i++) a.push(i);
                                for (var i = n - 1; i > 0; i--) {
                                    var j = Math.floor(Math.random() * (i + 1));
                                    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
                                }
                            }
                            return a;
                        }

                        function countComparisons(arr) {
                            var a = arr.slice();
                            var comp = 0;
                            var perIter = [];
                            for (var j = 1; j < a.length; j++) {
                                var key = a[j];
                                var i = j - 1;
                                var c = 0;
                                while (i >= 0 && a[i] > key) {
                                    a[i + 1] = a[i];
                                    i--;
                                    c++;
                                }
                                if (i >= 0) c++;
                                else c++;
                                a[i + 1] = key;
                                comp += c;
                                perIter.push(c);
                            }
                            return {total: comp, perIter: perIter};
                        }

                        function draw() {
                            var arr = generateInput(inputType, size);
                            var result = countComparisons(arr);
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Insertion Sort \u2014 Comparison Counter', viz.width / 2, 22, viz.colors.white, 14);
                            viz.screenText('Input (' + inputType + '): [' + arr.join(', ') + ']', viz.width / 2, 48, viz.colors.text, 12);
                            viz.screenText('Total comparisons: ' + result.total + '     n(n-1)/2 = ' + (size * (size - 1) / 2), viz.width / 2, 68, viz.colors.orange, 12);

                            // Bar chart of per-iteration comparisons
                            var barW = Math.min(50, (viz.width - 160) / result.perIter.length - 4);
                            var maxH = 180;
                            var startX = (viz.width - result.perIter.length * (barW + 4)) / 2;
                            var baseY = 280;

                            var maxVal = Math.max.apply(null, result.perIter.concat([1]));
                            for (var i = 0; i < result.perIter.length; i++) {
                                var h = (result.perIter[i] / maxVal) * maxH;
                                var px = startX + i * (barW + 4);
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillRect(px, baseY - h, barW, h);
                                ctx.strokeStyle = viz.colors.axis;
                                ctx.lineWidth = 0.5;
                                ctx.strokeRect(px, baseY - h, barW, h);
                                viz.screenText(String(result.perIter[i]), px + barW / 2, baseY - h - 10, viz.colors.white, 10);
                                viz.screenText('j=' + (i + 2), px + barW / 2, baseY + 12, viz.colors.text, 9);
                            }

                            viz.screenText('Comparisons per outer iteration', viz.width / 2, baseY + 35, viz.colors.text, 11);

                            // Theory line for worst case
                            if (inputType === 'reverse') {
                                viz.screenText('\u2190 Linear growth (1, 2, 3, ..., n-1) confirms \u0398(n\u00B2)', viz.width / 2, baseY + 55, viz.colors.red, 10);
                            } else if (inputType === 'sorted') {
                                viz.screenText('\u2190 Constant per iteration confirms \u0398(n)', viz.width / 2, baseY + 55, viz.colors.green, 10);
                            }
                        }

                        draw();

                        VizEngine.createSelect(controls, 'Input: ', [
                            {value: 'random', label: 'Random'},
                            {value: 'sorted', label: 'Sorted'},
                            {value: 'reverse', label: 'Reverse'}
                        ], function(v) { inputType = v; draw(); });

                        VizEngine.createSlider(controls, 'n = ', 4, 20, size, 1, function(v) { size = Math.round(v); draw(); });
                        VizEngine.createButton(controls, 'Regenerate', function() { draw(); });

                        return viz;
                    }
                },
                {
                    id: 'ch00-viz-input-size-timing',
                    title: 'Running Time vs Input Size',
                    description: 'Plot of comparison count versus n for best/worst/average cases',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 350, scale: 12, originX: 70, originY: 310});

                        function draw() {
                            viz.clear();
                            viz.drawGrid(2);
                            viz.drawAxes();
                            viz.screenText('Running Time of Insertion Sort', viz.width / 2, 18, viz.colors.white, 14);

                            // Best case: T(n) = n-1
                            viz.drawFunction(function(n) { return n > 0 ? (n - 1) / 10 : 0; }, 0, 50, viz.colors.green, 2.5, 200);
                            // Average case: T(n) = n(n-1)/4
                            viz.drawFunction(function(n) { return n > 0 ? n * (n - 1) / 40 : 0; }, 0, 50, viz.colors.orange, 2.5, 200);
                            // Worst case: T(n) = n(n-1)/2
                            viz.drawFunction(function(n) { return n > 0 ? n * (n - 1) / 20 : 0; }, 0, 50, viz.colors.red, 2.5, 200);

                            // Legend
                            var lx = viz.width - 180, ly = 45;
                            var ctx = viz.ctx;
                            ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 30, ly); ctx.stroke();
                            viz.screenText('Best: \u0398(n)', lx + 80, ly, viz.colors.green, 11, 'center', 'middle');

                            ctx.strokeStyle = viz.colors.orange;
                            ctx.beginPath(); ctx.moveTo(lx, ly + 20); ctx.lineTo(lx + 30, ly + 20); ctx.stroke();
                            viz.screenText('Avg: \u0398(n\u00B2)', lx + 80, ly + 20, viz.colors.orange, 11, 'center', 'middle');

                            ctx.strokeStyle = viz.colors.red;
                            ctx.beginPath(); ctx.moveTo(lx, ly + 40); ctx.lineTo(lx + 30, ly + 40); ctx.stroke();
                            viz.screenText('Worst: \u0398(n\u00B2)', lx + 80, ly + 40, viz.colors.red, 11, 'center', 'middle');

                            // Axis labels
                            viz.screenText('n', viz.width - 15, viz.originY + 5, viz.colors.text, 13);
                            viz.screenText('T(n)', 20, 20, viz.colors.text, 13);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the exact number of comparisons Insertion Sort makes on the input \\([4, 3, 2, 1]\\).',
                    hint: 'Trace through each outer iteration and count the inner loop tests.',
                    solution: 'j=2: key=3, compare with 4 (1 comparison), shift. j=3: key=2, compare with 4, 3 (2 comparisons), shift both. j=4: key=1, compare with 4, 3, 2 (3 comparisons), shift all. Total: 1+2+3 = 6 = n(n-1)/2 with n=4.'
                },
                {
                    question: 'Why is the average case also \\(\\Theta(n^2)\\) and not, say, \\(\\Theta(n^{1.5})\\)?',
                    hint: 'Use the expected number of inversions in a random permutation.',
                    solution: 'A random permutation of n elements has \\(\\binom{n}{2}/2 = n(n-1)/4\\) expected inversions (each pair is inverted with probability 1/2). Each comparison in insertion sort fixes at most one inversion, so the expected number of comparisons is at least \\(n(n-1)/4 = \\Theta(n^2)\\). The upper bound is also \\(\\Theta(n^2)\\) since it cannot exceed the worst case.'
                },
                {
                    question: 'Describe an input distribution for which Insertion Sort runs in \\(O(n)\\) expected time.',
                    hint: 'Think about nearly-sorted arrays.',
                    solution: 'If each element is at most \\(k\\) positions away from its sorted position (for constant \\(k\\)), then the inner loop executes at most \\(k\\) times per outer iteration. Total: \\(O(kn) = O(n)\\). Example: start with a sorted array and swap each adjacent pair with probability 1/2. This creates an array where each element is displaced by at most 1 position.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 5: From Insertion Sort to Better Algorithms
        // --------------------------------------------------------
        {
            id: 'ch00-sec05',
            title: 'From Insertion Sort to Better Algorithms',
            content: `<h2>From Insertion Sort to Better Algorithms</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Insertion Sort is \(\Theta(n^2)\), but can we do better? This final section previews the divide-and-conquer paradigm through Merge Sort and outlines the algorithmic landscape we will explore in subsequent chapters.</p></div></div>

<p>Insertion Sort's \\(\\Theta(n^2)\\) worst-case time is impractical for large inputs. Can we do better? The answer, as we will see in later chapters, is a resounding <strong>yes</strong>: algorithms like Merge Sort achieve \\(\\Theta(n \\log n)\\) time, which is provably optimal for comparison-based sorting.</p>

<div class="env-block theorem">
<div class="env-title">Theorem (Comparison-Based Sorting Lower Bound — Preview)</div>
<div class="env-body">
<p>Any comparison-based sorting algorithm must make at least \\(\\Omega(n \\log n)\\) comparisons in the worst case.</p>
</div>
</div>

<p>This means there is an exponential gap between the \\(\\Theta(n^2)\\) of Insertion Sort and the \\(\\Theta(n \\log n)\\) optimum. Closing this gap is one of the great achievements of algorithm design.</p>

<div class="viz-placeholder" data-viz="ch00-viz-sort-comparison"></div>

<p>Let us preview the idea behind Merge Sort using a <strong>divide-and-conquer</strong> strategy:</p>
<ol>
<li><strong>Divide</strong>: Split the array into two halves.</li>
<li><strong>Conquer</strong>: Recursively sort each half.</li>
<li><strong>Combine</strong>: Merge the two sorted halves in \\(O(n)\\) time.</li>
</ol>

<div class="viz-placeholder" data-viz="ch00-viz-merge-preview"></div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body">
<p>Why does divide-and-conquer help? Because it reduces the "travel distance" of each element. In Insertion Sort, an element may need to move \\(O(n)\\) positions. In Merge Sort, each merge step only moves elements \\(O(1)\\) positions within their local context, and there are only \\(O(\\log n)\\) levels of recursion. Hence: \\(O(n) \\times O(\\log n) = O(n \\log n)\\).</p>
</div>
</div>

<p>In the chapters ahead, we will develop the mathematical toolkit (asymptotic analysis, recurrences, amortized analysis) to make these arguments precise, and then we will explore a rich landscape of algorithm design paradigms.</p>

<div class="env-block definition">
<div class="env-title">Definition (Algorithmic Paradigm)</div>
<div class="env-body">
<p>An <strong>algorithmic paradigm</strong> is a general approach or methodology for designing algorithms. The major paradigms we will study include:</p>
<ul>
<li><strong>Divide and Conquer</strong>: break the problem into smaller subproblems, solve recursively, combine.</li>
<li><strong>Greedy</strong>: make the locally optimal choice at each step.</li>
<li><strong>Dynamic Programming</strong>: solve overlapping subproblems, store results to avoid recomputation.</li>
<li><strong>Backtracking</strong>: systematically explore the solution space, pruning infeasible branches.</li>
</ul>
</div>
</div>
<div class="env-block bridge"><div class="env-title">Looking Ahead</div><div class="env-body"><p>We have established the foundations: algorithms, correctness proofs, the RAM model, and basic running time analysis. In Chapter 1, we formalize the language of efficiency with asymptotic notation (\(O, \Omega, \Theta\)), giving us the mathematical vocabulary to compare algorithms precisely.</p></div></div>`,
            visualizations: [
                {
                    id: 'ch00-viz-sort-comparison',
                    title: 'Sorting Algorithm Comparison',
                    description: 'Compare n^2 vs n log n growth to see why better algorithms matter',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 350, scale: 5, originX: 80, originY: 310});

                        function draw() {
                            viz.clear();
                            viz.drawGrid(5);
                            viz.drawAxes();
                            viz.screenText('Sorting Complexity: n\u00B2 vs n log n', viz.width / 2, 18, viz.colors.white, 14);

                            // n^2
                            viz.drawFunction(function(n) { return n > 0 ? n * n / 100 : 0; }, 0, 100, viz.colors.red, 2.5, 300);
                            // n log n
                            viz.drawFunction(function(n) { return n > 1 ? n * Math.log2(n) / 100 : 0; }, 1, 100, viz.colors.green, 2.5, 300);
                            // n (linear reference)
                            viz.drawFunction(function(n) { return n / 100; }, 0, 100, viz.colors.axis, 1, 200);

                            // Annotations
                            var ctx = viz.ctx;
                            var lx = viz.width - 170, ly = 50;
                            ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 25, ly); ctx.stroke();
                            viz.screenText('n\u00B2 (Insertion Sort)', lx + 95, ly, viz.colors.red, 11, 'center', 'middle');

                            ctx.strokeStyle = viz.colors.green;
                            ctx.beginPath(); ctx.moveTo(lx, ly + 20); ctx.lineTo(lx + 25, ly + 20); ctx.stroke();
                            viz.screenText('n log n (Merge Sort)', lx + 95, ly + 20, viz.colors.green, 11, 'center', 'middle');

                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(lx, ly + 40); ctx.lineTo(lx + 25, ly + 40); ctx.stroke();
                            viz.screenText('n (linear)', lx + 95, ly + 40, viz.colors.axis, 11, 'center', 'middle');

                            viz.screenText('n', viz.width - 15, viz.originY + 5, viz.colors.text, 13);
                            viz.screenText('T(n)', 20, 20, viz.colors.text, 13);
                        }

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'ch00-viz-merge-preview',
                    title: 'Merge Sort Preview',
                    description: 'Animated preview of the merge sort divide-and-conquer approach',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 380});
                        var arr = [38, 27, 43, 3, 9, 82, 10];

                        // Precompute merge sort tree
                        function buildTree(a, depth, x, w) {
                            var node = {arr: a.slice(), depth: depth, x: x, w: w, children: []};
                            if (a.length <= 1) {
                                node.sorted = a.slice();
                                return node;
                            }
                            var mid = Math.floor(a.length / 2);
                            var left = buildTree(a.slice(0, mid), depth + 1, x, w / 2);
                            var right = buildTree(a.slice(mid), depth + 1, x + w / 2, w / 2);
                            node.children = [left, right];
                            // Merge
                            var merged = [];
                            var li = 0, ri = 0;
                            while (li < left.sorted.length && ri < right.sorted.length) {
                                if (left.sorted[li] <= right.sorted[ri]) merged.push(left.sorted[li++]);
                                else merged.push(right.sorted[ri++]);
                            }
                            while (li < left.sorted.length) merged.push(left.sorted[li++]);
                            while (ri < right.sorted.length) merged.push(right.sorted[ri++]);
                            node.sorted = merged;
                            return node;
                        }

                        var tree = buildTree(arr, 0, 0, viz.width);
                        var showDepth = 0;
                        var maxDepth = 3;

                        function drawNode(node) {
                            if (node.depth > showDepth) return;
                            var y = 60 + node.depth * 80;
                            var cx = node.x + node.w / 2;
                            var cellW = Math.min(35, (node.w - 20) / Math.max(node.arr.length, 1));
                            var startX = cx - (node.arr.length * cellW) / 2;

                            var displayArr = node.depth < showDepth ? node.sorted : node.arr;
                            var color = node.depth < showDepth ? viz.colors.green + '44' : viz.colors.bg;
                            for (var i = 0; i < displayArr.length; i++) {
                                viz.drawArrayCell(startX + i * cellW, y, cellW, 28, displayArr[i], color, viz.colors.white,
                                    node.depth < showDepth ? viz.colors.green : null);
                            }

                            // Draw edges to children
                            if (node.children.length > 0 && node.depth < showDepth) {
                                for (var c = 0; c < node.children.length; c++) {
                                    var child = node.children[c];
                                    var childCx = child.x + child.w / 2;
                                    viz.ctx.strokeStyle = viz.colors.axis;
                                    viz.ctx.lineWidth = 1;
                                    viz.ctx.beginPath();
                                    viz.ctx.moveTo(cx, y + 32);
                                    viz.ctx.lineTo(childCx, y + 78);
                                    viz.ctx.stroke();
                                }
                            }

                            for (var c2 = 0; c2 < node.children.length; c2++) {
                                drawNode(node.children[c2]);
                            }
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Merge Sort: Divide & Conquer', viz.width / 2, 22, viz.colors.white, 14);

                            var labels = ['Original', 'Split', 'Split again', 'Fully divided & merged up'];
                            viz.screenText('Depth ' + showDepth + ': ' + labels[Math.min(showDepth, labels.length - 1)],
                                viz.width / 2, 42, viz.colors.teal, 12);

                            drawNode(tree);

                            viz.screenText('Depth ' + showDepth + ' / ' + maxDepth, viz.width / 2, viz.height - 15, viz.colors.text, 11);
                        }

                        draw();

                        VizEngine.createButton(controls, 'Next Level', function() {
                            if (showDepth < maxDepth) { showDepth++; draw(); }
                        });
                        VizEngine.createButton(controls, 'Prev Level', function() {
                            if (showDepth > 0) { showDepth--; draw(); }
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            showDepth = 0; draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'For \\(n = 1{,}000{,}000\\), approximately how many comparisons does Insertion Sort make in the worst case versus Merge Sort? Express your answer as a ratio.',
                    hint: 'Insertion Sort: n(n-1)/2. Merge Sort: approximately n log_2 n.',
                    solution: 'Insertion Sort: n(n-1)/2 = 10^6 * (10^6 - 1)/2 approx 5 * 10^{11}. Merge Sort: n * log_2(n) = 10^6 * 20 = 2 * 10^7. Ratio: approximately 5*10^{11} / 2*10^7 = 25,000. Merge Sort is about 25,000 times faster!'
                },
                {
                    question: 'Even though Insertion Sort is \\(\\Theta(n^2)\\), it is often faster than Merge Sort for small \\(n\\) (say \\(n < 50\\)). Why?',
                    hint: 'Think about constant factors and overhead.',
                    solution: 'Asymptotic notation hides constant factors. Insertion Sort has very small constants (simple inner loop, no recursion overhead, no auxiliary memory). Merge Sort has overhead from recursive calls, array copying, and memory allocation. For small n, these constant factors dominate. This is why practical sorting implementations (like Timsort in Python) use Insertion Sort for small subarrays within a Merge Sort framework.'
                },
                {
                    question: 'Insertion Sort is an <strong>in-place</strong> algorithm (uses \\(O(1)\\) extra memory). Is Merge Sort in-place? Why does this matter?',
                    hint: 'Standard Merge Sort uses an auxiliary array for merging.',
                    solution: 'Standard Merge Sort is NOT in-place; it requires \\(\\Theta(n)\\) auxiliary space for the merge step. This matters because: (1) memory allocation is expensive, (2) extra memory increases cache misses, and (3) for very large data sets, memory may be limited. In-place merge algorithms exist but are complex and have larger constant factors. This space/time tradeoff is a recurring theme in algorithm design.'
                },
                {
                    question: 'Suppose you have a sorting algorithm that makes \\(n^{1.5}\\) comparisons. Does this violate the \\(\\Omega(n \\log n)\\) lower bound?',
                    hint: 'Is \\(n^{1.5}\\) always larger than \\(n \\log n\\)?',
                    solution: 'No, it does not violate the lower bound. Since \\(n^{1.5} = n \\cdot n^{0.5} \\ge n \\log n\\) for sufficiently large \\(n\\) (because \\(\\sqrt{n}\\) grows faster than \\(\\log n\\)), making \\(n^{1.5}\\) comparisons is consistent with the \\(\\Omega(n \\log n)\\) lower bound. The algorithm is correct but not optimal \u2014 it makes more comparisons than necessary.'
                },
                {
                    question: 'We have discussed correctness proofs via loop invariants for iterative algorithms. How would you prove the correctness of a recursive algorithm like Merge Sort?',
                    hint: 'Think about mathematical induction on the input size.',
                    solution: 'Use strong induction on the input size n. Base case: n <= 1, the array is trivially sorted. Inductive step: assume the algorithm correctly sorts all arrays of size < n. For input of size n, the two recursive calls sort subarrays of size floor(n/2) and ceil(n/2), both < n, so by the inductive hypothesis they produce sorted subarrays. The merge step then correctly interleaves two sorted arrays into one sorted array (which can itself be proved via a loop invariant). Therefore the output is a sorted permutation of the input.'
                }
            ]
        }
    ]
});
