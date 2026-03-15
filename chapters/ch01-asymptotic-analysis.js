// ============================================================
// Chapter 1 · Asymptotic Analysis
// Asymptotic Notation & Growth of Functions
// ============================================================
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch01',
    number: 1,
    title: 'Asymptotic Analysis',
    subtitle: 'Asymptotic Notation & Growth of Functions',
    sections: [
        // --------------------------------------------------------
        // Section 1: Big-O, Big-Omega, Big-Theta
        // --------------------------------------------------------
        {
            id: 'ch01-sec01',
            title: 'O, \u03A9, \u0398 Notation',
            content: `<h2>\\(O\\), \\(\\Omega\\), \\(\\Theta\\) Notation</h2>
<div class="env-block bridge"><div class="env-title">Chapter Overview</div><div class="env-body"><p>In Chapter 0, we computed exact operation counts for Insertion Sort, but those expressions were complicated and machine-dependent. Asymptotic notation gives us a cleaner, more powerful language for describing algorithm efficiency, focusing on growth rates rather than exact constants. This chapter develops the mathematical toolkit that we will use to classify every algorithm in this course.</p></div></div>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>We begin with the three foundational notations: \(O\) (upper bound), \(\Omega\) (lower bound), and \(\Theta\) (tight bound). These are the workhorses of algorithm analysis, appearing in virtually every complexity statement you will encounter.</p></div></div>

<p>Asymptotic notation provides a mathematical language for describing the growth rate of functions, abstracting away constant factors and lower-order terms. It is the backbone of algorithm analysis.</p>

<div class="env-block definition">
<div class="env-title">Definition (Big-O)</div>
<div class="env-body">
<p>\\(f(n) = O(g(n))\\) if there exist positive constants \\(c\\) and \\(n_0\\) such that:</p>
$$0 \\le f(n) \\le c \\cdot g(n) \\quad \\text{for all } n \\ge n_0.$$
<p>Intuitively: \\(f\\) grows <strong>no faster than</strong> \\(g\\) (asymptotic upper bound).</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Big-Omega)</div>
<div class="env-body">
<p>\\(f(n) = \\Omega(g(n))\\) if there exist positive constants \\(c\\) and \\(n_0\\) such that:</p>
$$0 \\le c \\cdot g(n) \\le f(n) \\quad \\text{for all } n \\ge n_0.$$
<p>Intuitively: \\(f\\) grows <strong>at least as fast as</strong> \\(g\\) (asymptotic lower bound).</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Big-Theta)</div>
<div class="env-body">
<p>\\(f(n) = \\Theta(g(n))\\) if and only if \\(f(n) = O(g(n))\\) and \\(f(n) = \\Omega(g(n))\\). Equivalently, there exist positive constants \\(c_1, c_2, n_0\\) such that:</p>
$$c_1 \\cdot g(n) \\le f(n) \\le c_2 \\cdot g(n) \\quad \\text{for all } n \\ge n_0.$$
<p>Intuitively: \\(f\\) grows <strong>at the same rate as</strong> \\(g\\) (tight bound).</p>
</div>
</div>

<div class="env-block warning">
<div class="env-title">Warning</div>
<div class="env-body">
<p>The notation \\(f(n) = O(g(n))\\) is an abuse of notation: the \\(=\\) sign really means \\(\\in\\). We should write \\(f(n) \\in O(g(n))\\), but the \\(=\\) convention is standard in the algorithms literature (CLRS, Knuth, etc.).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch01-viz-big-o-demo"></div>

<div class="env-block example">
<div class="env-title">Example</div>
<div class="env-body">
<p>Show that \\(3n^2 + 5n + 2 = \\Theta(n^2)\\).</p>
<p><strong>Upper bound</strong>: For \\(n \\ge 1\\), \\(3n^2 + 5n + 2 \\le 3n^2 + 5n^2 + 2n^2 = 10n^2\\). So \\(c_2 = 10, n_0 = 1\\).</p>
<p><strong>Lower bound</strong>: For \\(n \\ge 0\\), \\(3n^2 + 5n + 2 \\ge 3n^2\\). So \\(c_1 = 3, n_0 = 0\\).</p>
<p>Therefore \\(3n^2 \\le 3n^2 + 5n + 2 \\le 10n^2\\) for all \\(n \\ge 1\\), confirming \\(\\Theta(n^2)\\).</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch01-viz-big-o-demo',
                    title: 'Big-O / Big-Omega / Big-Theta Visualizer',
                    description: 'Interactive demonstration of asymptotic bounds with adjustable constants',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400, scale: 25, originX: 70, originY: 360});
                        var c1 = 3, c2 = 10, n0 = 1;
                        var mode = 'theta'; // 'bigO', 'bigOmega', 'theta'

                        function f(n) { return 3 * n * n + 5 * n + 2; }
                        function g(n) { return n * n; }

                        function draw() {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();
                            viz.screenText('Asymptotic Notation: f(n) = 3n\u00B2 + 5n + 2, g(n) = n\u00B2', viz.width / 2, 18, viz.colors.white, 13);

                            var scaleFactor = 500;

                            // f(n)
                            viz.drawFunction(function(n) { return n >= 0 ? f(n) / scaleFactor : 0; }, 0, 14, viz.colors.white, 2.5, 200);

                            // c2 * g(n) upper bound
                            if (mode === 'bigO' || mode === 'theta') {
                                viz.drawFunction(function(n) { return n >= 0 ? c2 * g(n) / scaleFactor : 0; }, 0, 14, viz.colors.red, 2, 200);
                            }
                            // c1 * g(n) lower bound
                            if (mode === 'bigOmega' || mode === 'theta') {
                                viz.drawFunction(function(n) { return n >= 0 ? c1 * g(n) / scaleFactor : 0; }, 0, 14, viz.colors.green, 2, 200);
                            }

                            // n0 vertical line
                            var n0screen = viz.toScreen(n0, 0);
                            viz.ctx.strokeStyle = viz.colors.yellow;
                            viz.ctx.lineWidth = 1;
                            viz.ctx.setLineDash([4, 4]);
                            viz.ctx.beginPath(); viz.ctx.moveTo(n0screen[0], 0); viz.ctx.lineTo(n0screen[0], viz.height); viz.ctx.stroke();
                            viz.ctx.setLineDash([]);
                            viz.screenText('n\u2080 = ' + n0, n0screen[0] + 20, 35, viz.colors.yellow, 11);

                            // Legend
                            var lx = viz.width - 200, ly = 55;
                            var ctx = viz.ctx;
                            ctx.strokeStyle = viz.colors.white; ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 25, ly); ctx.stroke();
                            viz.screenText('f(n) = 3n\u00B2+5n+2', lx + 100, ly, viz.colors.white, 10, 'center', 'middle');

                            if (mode === 'bigO' || mode === 'theta') {
                                ctx.strokeStyle = viz.colors.red; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(lx, ly + 18); ctx.lineTo(lx + 25, ly + 18); ctx.stroke();
                                viz.screenText('c\u2082 \u00B7 g(n) = ' + c2 + 'n\u00B2', lx + 100, ly + 18, viz.colors.red, 10, 'center', 'middle');
                            }
                            if (mode === 'bigOmega' || mode === 'theta') {
                                ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(lx, ly + 36); ctx.lineTo(lx + 25, ly + 36); ctx.stroke();
                                viz.screenText('c\u2081 \u00B7 g(n) = ' + c1 + 'n\u00B2', lx + 100, ly + 36, viz.colors.green, 10, 'center', 'middle');
                            }

                            var label = mode === 'theta' ? '\u0398(n\u00B2)' : mode === 'bigO' ? 'O(n\u00B2)' : '\u03A9(n\u00B2)';
                            viz.screenText('Showing: ' + label, viz.width / 2, viz.height - 12, viz.colors.teal, 12);

                            viz.screenText('n', viz.width - 15, viz.originY + 5, viz.colors.text, 12);
                        }

                        draw();

                        VizEngine.createSelect(controls, 'Mode: ', [
                            {value: 'theta', label: '\u0398 (tight)'},
                            {value: 'bigO', label: 'O (upper)'},
                            {value: 'bigOmega', label: '\u03A9 (lower)'}
                        ], function(v) { mode = v; draw(); });

                        VizEngine.createSlider(controls, 'c\u2082 = ', 1, 20, c2, 0.5, function(v) { c2 = v; draw(); });
                        VizEngine.createSlider(controls, 'c\u2081 = ', 0.5, 10, c1, 0.5, function(v) { c1 = v; draw(); });
                        VizEngine.createSlider(controls, 'n\u2080 = ', 0, 10, n0, 1, function(v) { n0 = Math.round(v); draw(); });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove formally that \\(5n^3 + 2n^2 - 3n + 7 = O(n^3)\\) by finding explicit constants \\(c\\) and \\(n_0\\).',
                    hint: 'Bound each term above by a multiple of \\(n^3\\).',
                    solution: 'For n >= 1: 5n^3 + 2n^2 - 3n + 7 <= 5n^3 + 2n^3 + 0 + 7n^3 = 14n^3. So c = 14, n_0 = 1. More tightly: for n >= 1, 2n^2 <= 2n^3 and 7 <= 7n^3 and -3n <= 0 so 5n^3 + 2n^2 - 3n + 7 <= 14n^3.'
                },
                {
                    question: 'Is \\(n^2 = O(n)\\)? Prove or disprove.',
                    hint: 'Can you find a constant c such that \\(n^2 \\le cn\\) for all large n?',
                    solution: 'No. Suppose for contradiction that n^2 <= cn for all n >= n_0. Then n <= c for all n >= n_0, which is impossible since n grows without bound. Therefore n^2 is NOT O(n).'
                },
                {
                    question: 'Prove that \\(O(g(n)) \\cap \\Omega(g(n)) = \\Theta(g(n))\\).',
                    hint: 'Use the definitions directly.',
                    solution: 'If f in O(g) cap Omega(g), then there exist c_2, n_1 with f(n) <= c_2 g(n) for n >= n_1, and c_1, n_2 with c_1 g(n) <= f(n) for n >= n_2. Set n_0 = max(n_1, n_2). Then c_1 g(n) <= f(n) <= c_2 g(n) for all n >= n_0, which is exactly f in Theta(g). The reverse inclusion is immediate from the definitions.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 2: Little-o and Little-omega
        // --------------------------------------------------------
        {
            id: 'ch01-sec02',
            title: 'o and \u03C9 Notation',
            content: `<h2>\\(o\\) and \\(\\omega\\) Notation</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Big-\(O\), \(\Omega\), and \(\Theta\) describe growth rates up to constant factors. Sometimes we need stricter comparisons. This section introduces \(o\) (strictly slower) and \(\omega\) (strictly faster), which are useful for proving separation results between complexity classes.</p></div></div>

<p>The "big" notations describe asymptotic bounds that may or may not be tight. The "little" notations describe <em>strict</em> asymptotic relationships.</p>

<div class="env-block definition">
<div class="env-title">Definition (Little-o)</div>
<div class="env-body">
<p>\\(f(n) = o(g(n))\\) if for <strong>every</strong> positive constant \\(c > 0\\), there exists \\(n_0\\) such that:</p>
$$0 \\le f(n) < c \\cdot g(n) \\quad \\text{for all } n \\ge n_0.$$
<p>Equivalently: \\(\\lim_{n \\to \\infty} \\frac{f(n)}{g(n)} = 0\\).</p>
<p>Intuitively: \\(f\\) grows <strong>strictly slower</strong> than \\(g\\).</p>
</div>
</div>

<div class="env-block definition">
<div class="env-title">Definition (Little-omega)</div>
<div class="env-body">
<p>\\(f(n) = \\omega(g(n))\\) if for <strong>every</strong> positive constant \\(c > 0\\), there exists \\(n_0\\) such that:</p>
$$0 \\le c \\cdot g(n) < f(n) \\quad \\text{for all } n \\ge n_0.$$
<p>Equivalently: \\(\\lim_{n \\to \\infty} \\frac{f(n)}{g(n)} = \\infty\\).</p>
<p>Intuitively: \\(f\\) grows <strong>strictly faster</strong> than \\(g\\).</p>
</div>
</div>

<div class="env-block intuition">
<div class="env-title">Intuition</div>
<div class="env-body">
<p>Think of these notations as analogies to number comparisons:</p>
<table style="width:100%;border-collapse:collapse;margin:8px 0;">
<tr style="border-bottom:1px solid #30363d;"><th style="padding:4px;">Notation</th><th style="padding:4px;">Analogy</th><th style="padding:4px;">Meaning</th></tr>
<tr><td style="padding:4px;">\\(f = O(g)\\)</td><td style="padding:4px;">\\(a \\le b\\)</td><td style="padding:4px;">at most</td></tr>
<tr><td style="padding:4px;">\\(f = \\Omega(g)\\)</td><td style="padding:4px;">\\(a \\ge b\\)</td><td style="padding:4px;">at least</td></tr>
<tr><td style="padding:4px;">\\(f = \\Theta(g)\\)</td><td style="padding:4px;">\\(a = b\\)</td><td style="padding:4px;">equal rate</td></tr>
<tr><td style="padding:4px;">\\(f = o(g)\\)</td><td style="padding:4px;">\\(a < b\\)</td><td style="padding:4px;">strictly less</td></tr>
<tr><td style="padding:4px;">\\(f = \\omega(g)\\)</td><td style="padding:4px;">\\(a > b\\)</td><td style="padding:4px;">strictly greater</td></tr>
</table>
</div>
</div>

<div class="viz-placeholder" data-viz="ch01-viz-little-o"></div>

<div class="env-block example">
<div class="env-title">Example</div>
<div class="env-body">
<p>Show that \\(n = o(n^2)\\).</p>
<p>We need \\(\\lim_{n \\to \\infty} n / n^2 = \\lim_{n \\to \\infty} 1/n = 0\\). \\(\\checkmark\\)</p>
<p>Note: \\(n = O(n^2)\\) is also true, but \\(n \\ne \\Theta(n^2)\\). The little-o notation captures this distinction.</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem (Relationship between notations)</div>
<div class="env-body">
<p>For asymptotically non-negative functions \\(f\\) and \\(g\\):</p>
<ol>
<li>\\(f(n) = o(g(n))\\) implies \\(f(n) = O(g(n))\\), but not conversely.</li>
<li>\\(f(n) = \\omega(g(n))\\) implies \\(f(n) = \\Omega(g(n))\\), but not conversely.</li>
<li>\\(f(n) = \\Theta(g(n))\\) if and only if \\(f(n) = O(g(n))\\) and \\(f(n) = \\Omega(g(n))\\).</li>
<li>\\(f(n) = \\Theta(g(n))\\) implies \\(f(n) \\ne o(g(n))\\) and \\(f(n) \\ne \\omega(g(n))\\).</li>
</ol>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch01-viz-little-o',
                    title: 'Little-o Demonstration',
                    description: 'Shows that for any c, f(n) < c*g(n) eventually holds for little-o',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 380, scale: 20, originX: 70, originY: 340});
                        var cVal = 1;

                        function draw() {
                            viz.clear();
                            viz.drawGrid(1);
                            viz.drawAxes();
                            viz.screenText('Little-o: n = o(n\u00B2) \u2014 for every c, n < c\u00B7n\u00B2 eventually', viz.width / 2, 18, viz.colors.white, 13);

                            var sc = 200;
                            // f(n) = n
                            viz.drawFunction(function(n) { return n >= 0 ? n / sc * 10 : 0; }, 0, 30, viz.colors.white, 2.5, 200);
                            // c * g(n) = c * n^2
                            viz.drawFunction(function(n) { return n >= 0 ? cVal * n * n / sc * 10 : 0; }, 0, 30, viz.colors.orange, 2, 200);

                            // Find crossover point
                            var crossN = cVal > 0 ? 1 / cVal : Infinity;
                            if (crossN <= 30 && crossN > 0) {
                                var sp = viz.toScreen(crossN, crossN / sc * 10);
                                viz.ctx.fillStyle = viz.colors.yellow;
                                viz.ctx.beginPath(); viz.ctx.arc(sp[0], sp[1], 5, 0, Math.PI * 2); viz.ctx.fill();
                                viz.screenText('n\u2080 \u2248 ' + (1 / cVal).toFixed(1), sp[0] + 20, sp[1] - 10, viz.colors.yellow, 11);
                            }

                            // Legend
                            var lx = viz.width - 190, ly = 50;
                            var ctx = viz.ctx;
                            ctx.strokeStyle = viz.colors.white; ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 25, ly); ctx.stroke();
                            viz.screenText('f(n) = n', lx + 80, ly, viz.colors.white, 11, 'center', 'middle');

                            ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(lx, ly + 18); ctx.lineTo(lx + 25, ly + 18); ctx.stroke();
                            viz.screenText('c\u00B7n\u00B2, c = ' + cVal.toFixed(2), lx + 80, ly + 18, viz.colors.orange, 11, 'center', 'middle');

                            viz.screenText('No matter how small c is, c\u00B7n\u00B2 eventually dominates n', viz.width / 2, viz.height - 12, viz.colors.teal, 11);
                        }

                        draw();

                        VizEngine.createSlider(controls, 'c = ', 0.01, 2, cVal, 0.01, function(v) { cVal = v; draw(); });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that \\(n^2 = o(n^3)\\) using the limit definition.',
                    hint: 'Compute \\(\\lim_{n \\to \\infty} n^2 / n^3\\).',
                    solution: '\\(\\lim_{n \\to \\infty} n^2 / n^3 = \\lim_{n \\to \\infty} 1/n = 0\\). By the limit characterization of little-o, \\(n^2 = o(n^3)\\).'
                },
                {
                    question: 'Is \\(n^2 = o(n^2)\\)? Why or why not?',
                    hint: 'What is \\(\\lim n^2 / n^2\\)?',
                    solution: 'No. \\(\\lim_{n \\to \\infty} n^2 / n^2 = 1 \\ne 0\\). For little-o, the limit must be 0. We have \\(n^2 = \\Theta(n^2)\\) but \\(n^2 \\ne o(n^2)\\). A function is never little-o of itself (unless it is eventually zero).'
                },
                {
                    question: 'Prove or disprove: \\(\\ln n = o(n^\\epsilon)\\) for every \\(\\epsilon > 0\\).',
                    hint: 'Use L\'Hopital\'s rule on \\(\\ln n / n^\\epsilon\\).',
                    solution: 'True. By L\'Hopital: \\(\\lim_{n \\to \\infty} \\ln n / n^\\epsilon = \\lim_{n \\to \\infty} (1/n) / (\\epsilon n^{\\epsilon - 1}) = \\lim 1/(\\epsilon n^\\epsilon) = 0\\). So \\(\\ln n = o(n^\\epsilon)\\) for every \\(\\epsilon > 0\\). Logarithms grow slower than any positive polynomial power.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 3: Standard Growth Classes
        // --------------------------------------------------------
        {
            id: 'ch01-sec03',
            title: 'Standard Growth Classes',
            content: `<h2>Standard Growth Classes</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>With the notation in place, we now catalog the standard growth classes, from constant to exponential, that serve as the benchmarks against which we measure every algorithm.</p></div></div>

<p>In algorithm analysis, a small number of growth classes appear repeatedly. Understanding their relative order is essential.</p>

<div class="env-block theorem">
<div class="env-title">Theorem (Growth Rate Hierarchy)</div>
<div class="env-body">
<p>The following functions are ordered by asymptotic growth rate (each is \\(o\\) of the next):</p>
$$1 \\prec \\log \\log n \\prec \\log n \\prec \\sqrt{n} \\prec n \\prec n \\log n \\prec n^2 \\prec n^3 \\prec 2^n \\prec n! \\prec n^n$$
<p>where \\(f \\prec g\\) means \\(f = o(g)\\).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch01-viz-growth-race"></div>

<div class="env-block example">
<div class="env-title">Example (Practical Implications)</div>
<div class="env-body">
<p>Suppose a computer performs \\(10^9\\) operations per second. How large an input can each algorithm handle in 1 second?</p>
<table style="width:100%;border-collapse:collapse;margin:8px 0;">
<tr style="border-bottom:1px solid #30363d;"><th style="padding:4px;">\\(T(n)\\)</th><th style="padding:4px;">Max \\(n\\) in 1 sec</th></tr>
<tr><td style="padding:4px;">\\(\\log n\\)</td><td style="padding:4px;">\\(2^{10^9}\\) (astronomical)</td></tr>
<tr><td style="padding:4px;">\\(n\\)</td><td style="padding:4px;">\\(10^9\\)</td></tr>
<tr><td style="padding:4px;">\\(n \\log n\\)</td><td style="padding:4px;">\\(\\approx 3.9 \\times 10^7\\)</td></tr>
<tr><td style="padding:4px;">\\(n^2\\)</td><td style="padding:4px;">\\(\\approx 31{,}623\\)</td></tr>
<tr><td style="padding:4px;">\\(n^3\\)</td><td style="padding:4px;">\\(\\approx 1{,}000\\)</td></tr>
<tr><td style="padding:4px;">\\(2^n\\)</td><td style="padding:4px;">\\(\\approx 30\\)</td></tr>
<tr><td style="padding:4px;">\\(n!\\)</td><td style="padding:4px;">\\(\\approx 13\\)</td></tr>
</table>
</div>
</div>

<div class="viz-placeholder" data-viz="ch01-viz-growth-plotter"></div>

<div class="env-block theorem">
<div class="env-title">Theorem (Useful Asymptotic Facts)</div>
<div class="env-body">
<p>For all \\(a > 1\\), \\(b > 0\\), \\(c > 0\\):</p>
<ol>
<li>\\((\\log n)^b = o(n^c)\\) &mdash; any polynomial dominates any polylog.</li>
<li>\\(n^c = o(a^n)\\) &mdash; any exponential dominates any polynomial.</li>
<li>\\(\\log(n!) = \\Theta(n \\log n)\\) (by Stirling's approximation).</li>
<li>\\(\\sum_{k=1}^{n} k^p = \\Theta(n^{p+1})\\) for any constant \\(p \\ge 0\\).</li>
</ol>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch01-viz-growth-race',
                    title: 'Growth Rate Race',
                    description: 'Animated race between different growth classes as n increases',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 400});
                        var n = 1;
                        var maxN = 20;
                        var animating = false;
                        var animId = null;

                        var funcs = [
                            {name: '1', f: function() { return 1; }, color: null},
                            {name: 'log n', f: function(x) { return Math.log2(Math.max(x, 1)); }, color: null},
                            {name: '\u221An', f: function(x) { return Math.sqrt(x); }, color: null},
                            {name: 'n', f: function(x) { return x; }, color: null},
                            {name: 'n log n', f: function(x) { return x * Math.log2(Math.max(x, 1)); }, color: null},
                            {name: 'n\u00B2', f: function(x) { return x * x; }, color: null},
                            {name: '2\u207F', f: function(x) { return Math.pow(2, x); }, color: null}
                        ];
                        var colorList = ['#8b949e', '#58a6ff', '#3fb9a0', '#3fb950', '#d29922', '#f0883e', '#f85149'];
                        for (var i = 0; i < funcs.length; i++) funcs[i].color = colorList[i];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            viz.screenText('Growth Rate Race \u2014 n = ' + n, viz.width / 2, 22, viz.colors.white, 14);

                            // Compute values and normalize for bar chart
                            var vals = funcs.map(function(fn) { return fn.f(n); });
                            var maxVal = Math.max.apply(null, vals.concat([1]));
                            var barH = 30;
                            var gap = 8;
                            var maxBarW = viz.width - 200;
                            var startY = 60;

                            for (var i = 0; i < funcs.length; i++) {
                                var y = startY + i * (barH + gap);
                                var w = Math.max(2, (vals[i] / maxVal) * maxBarW);

                                // Label
                                viz.screenText(funcs[i].name, 70, y + barH / 2, funcs[i].color, 12, 'right', 'middle');

                                // Bar
                                ctx.fillStyle = funcs[i].color + '44';
                                ctx.fillRect(85, y, w, barH);
                                ctx.fillStyle = funcs[i].color;
                                ctx.fillRect(85, y, Math.min(w, 4), barH);

                                // Value text
                                var valStr = vals[i] >= 1e6 ? vals[i].toExponential(1) : (vals[i] % 1 === 0 ? vals[i].toString() : vals[i].toFixed(1));
                                viz.screenText(valStr, 90 + w + 5, y + barH / 2, funcs[i].color, 11, 'left', 'middle');
                            }

                            viz.screenText('Note: 2\u207F grows explosively; at n=20, 2\u00B2\u2070 = 1,048,576', viz.width / 2, viz.height - 15, viz.colors.text, 10);
                        }

                        draw();

                        VizEngine.createSlider(controls, 'n = ', 1, maxN, n, 1, function(v) {
                            n = Math.round(v);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Animate', function() {
                            if (animating) { clearInterval(animId); animating = false; return; }
                            n = 1;
                            animating = true;
                            animId = setInterval(function() {
                                if (n >= maxN) { clearInterval(animId); animating = false; return; }
                                n++;
                                draw();
                            }, 400);
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            if (animId) clearInterval(animId);
                            animating = false;
                            n = 1;
                            draw();
                        });

                        return viz;
                    }
                },
                {
                    id: 'ch01-viz-growth-plotter',
                    title: 'Growth Rate Plotter',
                    description: 'Plot and compare multiple growth functions with adjustable scale',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 380, scale: 15, originX: 70, originY: 340});
                        var logScale = false;
                        var showFuncs = {logn: true, sqrtn: true, n: true, nlogn: true, n2: true};

                        function draw() {
                            viz.clear();
                            viz.drawGrid(2);
                            viz.drawAxes();
                            viz.screenText('Growth Rate Plotter' + (logScale ? ' (log scale)' : ''), viz.width / 2, 18, viz.colors.white, 14);

                            var sc = logScale ? 1 : 100;
                            var transform = logScale ? function(y) { return y > 0 ? Math.log2(y + 1) : 0; } : function(y) { return y / sc; };

                            if (showFuncs.logn) viz.drawFunction(function(x) { return x > 1 ? transform(Math.log2(x)) : 0; }, 1, 40, viz.colors.blue, 2.5, 200);
                            if (showFuncs.sqrtn) viz.drawFunction(function(x) { return x >= 0 ? transform(Math.sqrt(x)) : 0; }, 0, 40, viz.colors.teal, 2.5, 200);
                            if (showFuncs.n) viz.drawFunction(function(x) { return x >= 0 ? transform(x) : 0; }, 0, 40, viz.colors.green, 2.5, 200);
                            if (showFuncs.nlogn) viz.drawFunction(function(x) { return x > 1 ? transform(x * Math.log2(x)) : 0; }, 1, 40, viz.colors.orange, 2.5, 200);
                            if (showFuncs.n2) viz.drawFunction(function(x) { return x >= 0 ? transform(x * x) : 0; }, 0, 40, viz.colors.red, 2.5, 200);

                            // Legend
                            var entries = [
                                {key: 'logn', label: 'log n', color: viz.colors.blue},
                                {key: 'sqrtn', label: '\u221An', color: viz.colors.teal},
                                {key: 'n', label: 'n', color: viz.colors.green},
                                {key: 'nlogn', label: 'n log n', color: viz.colors.orange},
                                {key: 'n2', label: 'n\u00B2', color: viz.colors.red}
                            ];
                            var lx = viz.width - 130, ly = 50;
                            for (var i = 0; i < entries.length; i++) {
                                if (showFuncs[entries[i].key]) {
                                    viz.ctx.strokeStyle = entries[i].color; viz.ctx.lineWidth = 2.5;
                                    viz.ctx.beginPath(); viz.ctx.moveTo(lx, ly + i * 18); viz.ctx.lineTo(lx + 20, ly + i * 18); viz.ctx.stroke();
                                    viz.screenText(entries[i].label, lx + 60, ly + i * 18, entries[i].color, 11, 'center', 'middle');
                                }
                            }
                        }

                        draw();

                        VizEngine.createButton(controls, 'Toggle Log Scale', function() { logScale = !logScale; draw(); });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Rank the following functions by growth rate from slowest to fastest: \\(n^2, 2^n, n \\log n, \\log^2 n, n^{1.5}, n!\\).',
                    hint: 'Use the standard hierarchy: polylog < polynomial < exponential < factorial.',
                    solution: '\\(\\log^2 n \\prec n \\log n \\prec n^{1.5} \\prec n^2 \\prec 2^n \\prec n!\\). Detailed: log^2 n = o(n) since logs grow slower than any polynomial. n log n = o(n^{1.5}) since n^{0.5} grows faster than log n. n^{1.5} = o(n^2) since 1.5 < 2. n^2 = o(2^n) since polynomials are o of exponentials. 2^n = o(n!) since n! grows faster.'
                },
                {
                    question: 'An algorithm runs in \\(T(n) = 3n^2 \\log n + 7n^{1.5}\\) time. What is the tightest \\(\\Theta\\)-bound?',
                    hint: 'Which term dominates?',
                    solution: '\\(\\Theta(n^2 \\log n)\\). Since \\(n^2 \\log n\\) grows faster than \\(n^{1.5}\\) (as \\(n^{0.5} \\log n \\to \\infty\\)), the dominant term is \\(3n^2 \\log n\\), giving \\(T(n) = \\Theta(n^2 \\log n)\\).'
                },
                {
                    question: 'For what value of \\(n\\) does \\(n^2\\) first exceed \\(100 n \\log_2 n\\)?',
                    hint: 'Solve \\(n > 100 \\log_2 n\\).',
                    solution: 'We need \\(n > 100 \\log_2 n\\). Testing: n=1000, 100*log2(1000) = 100*9.97 = 997 < 1000. So n=1000 works. More precisely, the crossover is around n = 995. For n < 995, n log n is smaller than n^2 by less than a factor of 100; for n >= 995, the quadratic term dominates even with the factor of 100.'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 4: Limit-Based Techniques
        // --------------------------------------------------------
        {
            id: 'ch01-sec04',
            title: 'Limit Method',
            content: `<h2>Limit Method</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Applying the formal definition of asymptotic notation can be tedious. The limit method provides a powerful shortcut: compute \(\lim_{n\to\infty} f(n)/g(n)\) and read off the relationship directly.</p></div></div>

<p>In many cases, the most elegant way to determine asymptotic relationships is through limits. This section develops the key limit-based techniques.</p>

<div class="env-block theorem">
<div class="env-title">Theorem (Limit Characterizations)</div>
<div class="env-body">
<p>Let \\(f(n)\\) and \\(g(n)\\) be eventually positive functions. Then:</p>
$$\\lim_{n \\to \\infty} \\frac{f(n)}{g(n)} = \\begin{cases}
0 & \\Rightarrow f(n) = o(g(n)) \\quad [\\text{and } f = O(g)]\\\\
c \\in (0, \\infty) & \\Rightarrow f(n) = \\Theta(g(n))\\\\
\\infty & \\Rightarrow f(n) = \\omega(g(n)) \\quad [\\text{and } f = \\Omega(g)]
\\end{cases}$$
</div>
</div>

<div class="env-block warning">
<div class="env-title">Warning</div>
<div class="env-body">
<p>The limit may not exist! For example, \\(f(n) = n(1 + \\sin n)\\) oscillates, and \\(\\lim f(n)/n\\) does not exist. In such cases, we must fall back to the \\(\\epsilon\\text{-}\\delta\\) definitions.</p>
</div>
</div>

<div class="env-block theorem">
<div class="env-title">Theorem (L'Hopital's Rule for Sequences)</div>
<div class="env-body">
<p>If \\(f(n)\\) and \\(g(n)\\) are differentiable, positive, and \\(g(n) \\to \\infty\\), then:</p>
$$\\lim_{n \\to \\infty} \\frac{f(n)}{g(n)} = \\lim_{n \\to \\infty} \\frac{f'(n)}{g'(n)}$$
<p>provided the right-hand limit exists (including \\(\\pm \\infty\\)).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch01-viz-ratio-plot"></div>

<div class="env-block example">
<div class="env-title">Example</div>
<div class="env-body">
<p>Show that \\(\\log n = o(n^{0.01})\\).</p>
<p>By L'Hopital: \\(\\lim \\frac{\\log n}{n^{0.01}} = \\lim \\frac{1/(n \\ln 2)}{0.01 \\, n^{-0.99}} = \\lim \\frac{n^{0.99}}{0.01 \\, n \\ln 2} = \\lim \\frac{1}{0.01 \\, n^{0.01} \\ln 2} = 0\\).</p>
<p>So \\(\\log n = o(n^{0.01})\\), even for this tiny exponent!</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example</div>
<div class="env-body">
<p>Compare \\(n^{100}\\) and \\(1.01^n\\).</p>
<p>\\(\\lim \\frac{n^{100}}{1.01^n}\\): repeatedly apply L'Hopital 100 times. Each differentiation reduces the polynomial degree by 1 while the exponential remains \\(1.01^n \\cdot (\\ln 1.01)^k\\). After 100 applications: \\(\\lim \\frac{100!}{1.01^n (\\ln 1.01)^{100}} = 0\\).</p>
<p>Therefore \\(n^{100} = o(1.01^n)\\). <em>Any</em> exponential eventually dominates <em>any</em> polynomial.</p>
</div>
</div>`,
            visualizations: [
                {
                    id: 'ch01-viz-ratio-plot',
                    title: 'Function Ratio Plotter',
                    description: 'Plot the ratio f(n)/g(n) to determine asymptotic relationship',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 380, scale: 15, originX: 70, originY: 300});
                        var fChoice = 'n2';
                        var gChoice = 'nlogn';

                        var funcMap = {
                            'logn': {label: 'log n', f: function(n) { return n > 1 ? Math.log2(n) : 0; }},
                            'sqrtn': {label: '\u221An', f: function(n) { return Math.sqrt(n); }},
                            'n': {label: 'n', f: function(n) { return n; }},
                            'nlogn': {label: 'n log n', f: function(n) { return n > 1 ? n * Math.log2(n) : 0; }},
                            'n15': {label: 'n^1.5', f: function(n) { return Math.pow(n, 1.5); }},
                            'n2': {label: 'n\u00B2', f: function(n) { return n * n; }},
                            'n3': {label: 'n\u00B3', f: function(n) { return n * n * n; }}
                        };

                        function draw() {
                            viz.clear();
                            viz.drawGrid(2);
                            viz.drawAxes();

                            var fObj = funcMap[fChoice], gObj = funcMap[gChoice];
                            viz.screenText('Ratio: f(n)/g(n) = ' + fObj.label + ' / ' + gObj.label, viz.width / 2, 18, viz.colors.white, 13);

                            viz.drawFunction(function(n) {
                                if (n <= 1) return 0;
                                var gv = gObj.f(n);
                                if (gv < 0.001) return 0;
                                return fObj.f(n) / gv;
                            }, 1, 40, viz.colors.orange, 2.5, 300);

                            // Horizontal line at y=0
                            viz.ctx.strokeStyle = viz.colors.axis;
                            viz.ctx.lineWidth = 0.5;

                            // Determine the asymptotic relationship
                            var testN = 10000;
                            var gTest = gObj.f(testN);
                            var ratio = gTest > 0 ? fObj.f(testN) / gTest : Infinity;
                            var smallRatio = gObj.f(100) > 0 ? fObj.f(100) / gObj.f(100) : Infinity;
                            var relationship = '';
                            if (ratio < 0.001) relationship = fObj.label + ' = o(' + gObj.label + ')   \u2192 0';
                            else if (ratio > 1000) relationship = fObj.label + ' = \u03C9(' + gObj.label + ')   \u2192 \u221E';
                            else relationship = fObj.label + ' = \u0398(' + gObj.label + ')   \u2192 ' + ratio.toFixed(2);

                            viz.screenText(relationship, viz.width / 2, viz.height - 15, viz.colors.teal, 13);
                            viz.screenText('n', viz.width - 15, viz.originY + 5, viz.colors.text, 12);
                            viz.screenText('f/g', 25, 20, viz.colors.text, 12);
                        }

                        draw();

                        var opts = [
                            {value: 'logn', label: 'log n'},
                            {value: 'sqrtn', label: '\u221An'},
                            {value: 'n', label: 'n'},
                            {value: 'nlogn', label: 'n log n'},
                            {value: 'n15', label: 'n^1.5'},
                            {value: 'n2', label: 'n\u00B2'},
                            {value: 'n3', label: 'n\u00B3'}
                        ];
                        VizEngine.createSelect(controls, 'f(n): ', opts, function(v) { fChoice = v; draw(); });
                        VizEngine.createSelect(controls, 'g(n): ', opts, function(v) { gChoice = v; draw(); });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the limit method to determine the asymptotic relationship between \\(f(n) = n \\ln n\\) and \\(g(n) = n^{1.1}\\).',
                    hint: 'Compute \\(\\lim \\frac{n \\ln n}{n^{1.1}}\\).',
                    solution: '\\(\\lim \\frac{n \\ln n}{n^{1.1}} = \\lim \\frac{\\ln n}{n^{0.1}}\\). By L\'Hopital: \\(\\lim \\frac{1/n}{0.1 n^{-0.9}} = \\lim \\frac{1}{0.1 n^{0.1}} = 0\\). So \\(n \\ln n = o(n^{1.1})\\).'
                },
                {
                    question: 'Determine: \\(n^{\\sqrt{n}}\\) vs \\(2^n\\). Which grows faster?',
                    hint: 'Take logarithms: compare \\(\\sqrt{n} \\ln n\\) vs \\(n \\ln 2\\).',
                    solution: 'Compare \\(\\log(n^{\\sqrt{n}}) = \\sqrt{n} \\log n\\) with \\(\\log(2^n) = n \\log 2\\). Ratio: \\(\\frac{\\sqrt{n} \\log n}{n \\log 2} = \\frac{\\log n}{\\sqrt{n} \\log 2} \\to 0\\). So \\(\\sqrt{n} \\log n = o(n)\\), meaning \\(n^{\\sqrt{n}} = o(2^n)\\). The exponential \\(2^n\\) grows faster.'
                },
                {
                    question: 'Give an example of two functions \\(f\\) and \\(g\\) that are asymptotically incomparable: neither \\(f = O(g)\\) nor \\(g = O(f)\\).',
                    hint: 'Use oscillating functions.',
                    solution: 'Let \\(f(n) = n\\) for odd \\(n\\) and \\(f(n) = 1\\) for even \\(n\\). Let \\(g(n) = 1\\) for odd \\(n\\) and \\(g(n) = n\\) for even \\(n\\). Then \\(f/g\\) oscillates between \\(n\\) and \\(1/n\\), so neither \\(f = O(g)\\) nor \\(g = O(f)\\). Alternatively: \\(f(n) = n^{1+\\sin n}\\) and \\(g(n) = n^{1+\\cos n}\\).'
                }
            ]
        },

        // --------------------------------------------------------
        // Section 5: Analyzing Code Fragments
        // --------------------------------------------------------
        {
            id: 'ch01-sec05',
            title: 'Analyzing Code Fragments',
            content: `<h2>Analyzing Code Fragments</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Theory meets practice in this section. We apply asymptotic analysis to real code fragments, learning to translate loops, conditionals, and nested structures into growth rate expressions. This skill is essential for every subsequent chapter.</p></div></div>

<p>The ultimate purpose of asymptotic notation is to analyze the running time of algorithms. Let us develop systematic techniques for analyzing common code patterns.</p>

<div class="env-block definition">
<div class="env-title">Definition (Rules of Thumb)</div>
<div class="env-body">
<ol>
<li><strong>Sequential composition</strong>: \\(T_1 + T_2 = O(\\max(T_1, T_2))\\).</li>
<li><strong>Nested loops</strong>: Multiply the iteration counts.</li>
<li><strong>Consecutive loops</strong>: Add the costs (and take the max).</li>
<li><strong>If-else</strong>: Take the max of the two branches.</li>
<li><strong>Function calls</strong>: Include the cost of the called function.</li>
</ol>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example (Nested Loops)</div>
<div class="env-body">
<pre>
for i = 1 to n
    for j = 1 to n
        // O(1) work
</pre>
<p>The inner loop runs \\(n\\) times for each of the \\(n\\) outer iterations. Total: \\(n \\times n = O(n^2)\\).</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example (Triangular Loop)</div>
<div class="env-body">
<pre>
for i = 1 to n
    for j = 1 to i
        // O(1) work
</pre>
<p>Total: \\(\\sum_{i=1}^{n} i = n(n+1)/2 = \\Theta(n^2)\\).</p>
</div>
</div>

<div class="env-block example">
<div class="env-title">Example (Logarithmic Loop)</div>
<div class="env-body">
<pre>
i = n
while i >= 1
    // O(1) work
    i = floor(i / 2)
</pre>
<p>The variable \\(i\\) halves each iteration: \\(n, n/2, n/4, \\ldots, 1\\). Number of iterations: \\(\\lfloor \\log_2 n \\rfloor + 1 = \\Theta(\\log n)\\).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch01-viz-code-analyzer"></div>

<div class="env-block example">
<div class="env-title">Example (Tricky: Double Logarithmic)</div>
<div class="env-body">
<pre>
i = 2
while i <= n
    // O(1) work
    i = i * i
</pre>
<p>The sequence of \\(i\\) values is \\(2, 4, 16, 256, \\ldots = 2^{2^k}\\). The loop runs while \\(2^{2^k} \\le n\\), i.e., \\(2^k \\le \\log_2 n\\), i.e., \\(k \\le \\log_2 \\log_2 n\\). Total: \\(\\Theta(\\log \\log n)\\).</p>
</div>
</div>

<div class="viz-placeholder" data-viz="ch01-viz-crossover"></div>
<div class="env-block bridge"><div class="env-title">Looking Ahead</div><div class="env-body"><p>Asymptotic notation tells us <em>how</em> to describe growth rates; Chapter 2 tackles a crucial question: how do we solve the recurrences that arise from recursive algorithms? The Master Theorem and other techniques will let us analyze divide-and-conquer algorithms like Merge Sort in seconds rather than pages.</p></div></div>`,
            visualizations: [
                {
                    id: 'ch01-viz-code-analyzer',
                    title: 'Code Fragment Analyzer',
                    description: 'Visualize iteration counts for common loop patterns',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 380});
                        var pattern = 'nested';
                        var nVal = 8;

                        function simulate(pat, n) {
                            var ops = 0;
                            var trace = [];
                            if (pat === 'nested') {
                                for (var i = 1; i <= n; i++) {
                                    for (var j = 1; j <= n; j++) {
                                        ops++;
                                    }
                                    trace.push(n);
                                }
                            } else if (pat === 'triangular') {
                                for (var i = 1; i <= n; i++) {
                                    var c = 0;
                                    for (var j = 1; j <= i; j++) {
                                        ops++;
                                        c++;
                                    }
                                    trace.push(c);
                                }
                            } else if (pat === 'logarithmic') {
                                var i = n;
                                while (i >= 1) {
                                    ops++;
                                    trace.push(i);
                                    i = Math.floor(i / 2);
                                }
                            } else if (pat === 'nlogn') {
                                for (var i = 1; i <= n; i++) {
                                    var j = n;
                                    var c = 0;
                                    while (j >= 1) {
                                        ops++;
                                        c++;
                                        j = Math.floor(j / 2);
                                    }
                                    trace.push(c);
                                }
                            }
                            return {ops: ops, trace: trace};
                        }

                        function draw() {
                            var result = simulate(pattern, nVal);
                            viz.clear();
                            var ctx = viz.ctx;

                            var labels = {
                                'nested': 'Nested: for i=1..n { for j=1..n }  \u2192 \u0398(n\u00B2)',
                                'triangular': 'Triangular: for i=1..n { for j=1..i }  \u2192 \u0398(n\u00B2)',
                                'logarithmic': 'Logarithmic: while i>=1 { i=i/2 }  \u2192 \u0398(log n)',
                                'nlogn': 'n log n: for i=1..n { j=n; while j>=1 { j/=2 } }  \u2192 \u0398(n log n)'
                            };
                            viz.screenText(labels[pattern], viz.width / 2, 22, viz.colors.white, 12);
                            viz.screenText('n = ' + nVal + '    Total operations: ' + result.ops, viz.width / 2, 45, viz.colors.orange, 13);

                            // Bar chart of per-iteration work
                            if (result.trace.length > 0) {
                                var maxH = 240;
                                var barW = Math.min(40, (viz.width - 100) / result.trace.length - 2);
                                var startX = (viz.width - result.trace.length * (barW + 2)) / 2;
                                var baseY = 320;
                                var maxVal = Math.max.apply(null, result.trace.concat([1]));

                                for (var i = 0; i < result.trace.length; i++) {
                                    var h = (result.trace[i] / maxVal) * maxH;
                                    var px = startX + i * (barW + 2);
                                    ctx.fillStyle = viz.colors.blue;
                                    ctx.fillRect(px, baseY - h, barW, h);
                                    if (result.trace.length <= 20) {
                                        viz.screenText(String(result.trace[i]), px + barW / 2, baseY - h - 8, viz.colors.white, 9);
                                    }
                                }
                                viz.screenText('Work per iteration', viz.width / 2, baseY + 18, viz.colors.text, 11);
                            }
                        }

                        draw();

                        VizEngine.createSelect(controls, 'Pattern: ', [
                            {value: 'nested', label: 'Nested \u0398(n\u00B2)'},
                            {value: 'triangular', label: 'Triangular \u0398(n\u00B2)'},
                            {value: 'logarithmic', label: 'Log \u0398(log n)'},
                            {value: 'nlogn', label: 'n log n'}
                        ], function(v) { pattern = v; draw(); });

                        VizEngine.createSlider(controls, 'n = ', 2, 32, nVal, 1, function(v) { nVal = Math.round(v); draw(); });

                        return viz;
                    }
                },
                {
                    id: 'ch01-viz-crossover',
                    title: 'Function Crossover Finder',
                    description: 'Find where one growth function overtakes another',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {width: 700, height: 350, scale: 8, originX: 70, originY: 310});
                        var c1 = 100, c2 = 1;

                        function draw() {
                            viz.clear();
                            viz.drawGrid(5);
                            viz.drawAxes();
                            viz.screenText('Crossover: ' + c1 + '\u00B7n vs ' + c2 + '\u00B7n\u00B2', viz.width / 2, 18, viz.colors.white, 13);

                            var sc = 100;
                            viz.drawFunction(function(n) { return n >= 0 ? c1 * n / sc : 0; }, 0, 70, viz.colors.green, 2.5, 300);
                            viz.drawFunction(function(n) { return n >= 0 ? c2 * n * n / sc : 0; }, 0, 70, viz.colors.red, 2.5, 300);

                            // Find crossover
                            var crossN = c2 > 0 ? c1 / c2 : Infinity;
                            if (crossN <= 70 && crossN > 0) {
                                var crossY = c1 * crossN / sc;
                                var sp = viz.toScreen(crossN, crossY);
                                viz.ctx.fillStyle = viz.colors.yellow;
                                viz.ctx.beginPath(); viz.ctx.arc(sp[0], sp[1], 6, 0, Math.PI * 2); viz.ctx.fill();
                                viz.screenText('n\u2080 = ' + crossN.toFixed(0), sp[0] + 15, sp[1] - 15, viz.colors.yellow, 12);
                            }

                            var ctx = viz.ctx;
                            var lx = viz.width - 180, ly = 50;
                            ctx.strokeStyle = viz.colors.green; ctx.lineWidth = 2.5;
                            ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 25, ly); ctx.stroke();
                            viz.screenText(c1 + 'n (linear)', lx + 90, ly, viz.colors.green, 11, 'center', 'middle');
                            ctx.strokeStyle = viz.colors.red;
                            ctx.beginPath(); ctx.moveTo(lx, ly + 18); ctx.lineTo(lx + 25, ly + 18); ctx.stroke();
                            viz.screenText(c2 + 'n\u00B2 (quadratic)', lx + 90, ly + 18, viz.colors.red, 11, 'center', 'middle');

                            viz.screenText('Even with a 100x constant advantage, the linear algorithm wins for n > ' + Math.ceil(c1 / c2),
                                viz.width / 2, viz.height - 12, viz.colors.teal, 10);
                        }

                        draw();

                        VizEngine.createSlider(controls, 'c\u2081 (linear) = ', 1, 200, c1, 1, function(v) { c1 = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'c\u2082 (quadratic) = ', 0.1, 10, c2, 0.1, function(v) { c2 = v; draw(); });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Analyze the following code fragment:\n<pre>for i = 1 to n\n    for j = 1 to i*i\n        // O(1) work</pre>',
                    hint: 'Sum \\(\\sum_{i=1}^n i^2\\).',
                    solution: 'Total work = \\(\\sum_{i=1}^n i^2 = \\frac{n(n+1)(2n+1)}{6} = \\Theta(n^3)\\).'
                },
                {
                    question: 'Analyze:\n<pre>i = 1\nwhile i <= n\n    j = i\n    while j <= n\n        j = j + i\n    i = i + 1</pre>',
                    hint: 'For each i, the inner loop runs \\(\\lfloor n/i \\rfloor\\) times. Sum the harmonic series.',
                    solution: 'For each i from 1 to n, the inner loop runs \\(\\lfloor n/i \\rfloor\\) times (j goes i, 2i, 3i, ..., up to n). Total: \\(\\sum_{i=1}^n \\lfloor n/i \\rfloor \\approx n \\sum_{i=1}^n 1/i = n \\cdot H_n = \\Theta(n \\log n)\\), where \\(H_n\\) is the n-th harmonic number.'
                },
                {
                    question: 'What is the running time of:\n<pre>for i = 1 to n\n    j = 1\n    while j < n\n        j = 2 * j\n    // O(i) work here</pre>',
                    hint: 'The while loop is independent of the outer loop iteration variable.',
                    solution: 'The while loop runs \\(\\lceil \\log_2 n \\rceil\\) times (j doubles until reaching n), contributing \\(O(\\log n)\\) per outer iteration. The "O(i) work" contributes \\(\\sum_{i=1}^n i = O(n^2)\\). Since the while loop also runs inside the for loop: total = \\(\\sum_{i=1}^n (\\log n + i) = n \\log n + n(n+1)/2 = \\Theta(n^2)\\). The \\(O(i)\\) work dominates.'
                }
            ]
        }
    ]
});
