// ============================================================
// Ch 10 · 哈希表与跳表 — Hash Tables & Skip Lists
// ============================================================
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch10',
    number: 10,
    title: '哈希表与跳表',
    subtitle: 'Hash Tables & Skip Lists',
    sections: [
        // ============================================================
        // Section 1 : 哈希函数 — Hash Functions
        // ============================================================
        {
            id: 'ch10-sec01',
            title: '哈希函数',
            content: `<h2>Hash Functions</h2>
<p>A <strong>hash table</strong> maps keys from a large universe \\(U\\) to a table of size \\(m\\) via a hash function \\(h: U \\to \\{0, 1, \\ldots, m-1\\}\\). The goal is \\(O(1)\\) expected-time operations.</p>

<div class="env-block definition"><div class="env-title">Definition (Hash Function)</div><div class="env-body">
<p>A hash function \\(h: U \\to \\{0, \\ldots, m-1\\}\\) maps each key \\(k \\in U\\) to a <em>slot</em> \\(h(k)\\) in a table of size \\(m\\). A good hash function distributes keys uniformly and independently.</p>
</div></div>

<h3>Division Method</h3>
$$h(k) = k \\bmod m$$
<p>Simple but sensitive to \\(m\\). Choose \\(m\\) to be a prime not close to a power of 2.</p>

<h3>Multiplication Method</h3>
$$h(k) = \\lfloor m \\cdot (kA \\bmod 1) \\rfloor$$
<p>where \\(A \\in (0,1)\\). Knuth suggests \\(A = (\\sqrt{5} - 1)/2 \\approx 0.6180\\). Less sensitive to \\(m\\).</p>

<h3>Universal Hashing</h3>
<div class="env-block definition"><div class="env-title">Definition (Universal Hash Family)</div><div class="env-body">
<p>A family \\(\\mathcal{H}\\) of hash functions is <em>universal</em> if for any two distinct keys \\(k_1 \\ne k_2\\):</p>
$$\\Pr_{h \\in \\mathcal{H}}[h(k_1) = h(k_2)] \\le \\frac{1}{m}$$
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (Carter-Wegman Universal Family)</div><div class="env-body">
<p>For prime \\(p > |U|\\), the family \\(h_{a,b}(k) = ((ak + b) \\bmod p) \\bmod m\\) with \\(a \\in \\{1, \\ldots, p-1\\}, b \\in \\{0, \\ldots, p-1\\}\\) is universal.</p>
</div></div>

<div class="viz-placeholder" data-viz="ch10-viz-hash-functions"></div>

<div class="env-block theorem"><div class="env-title">Theorem (Expected Chain Length)</div><div class="env-body">
<p>With universal hashing and \\(n\\) keys in a table of size \\(m\\), the expected length of any chain is \\(\\alpha = n/m\\) (the <em>load factor</em>). Expected search time: \\(O(1 + \\alpha)\\).</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch10-viz-hash-functions',
                    title: 'Hash Function Comparison',
                    description: 'Compare division and multiplication methods on different inputs.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 400});
                        let m = 11;
                        let method = 'division';
                        let keys = [15, 23, 44, 7, 89, 31, 56, 72, 18, 99, 3, 67, 40, 28, 61];
                        let A_const = (Math.sqrt(5) - 1) / 2;

                        function hashDiv(k) { return k % m; }
                        function hashMult(k) { return Math.floor(m * ((k * A_const) % 1)); }

                        function draw() {
                            viz.clear();
                            viz.screenText('Hash Function: ' + method + ' method (m = ' + m + ')', 350, 10, viz.colors.white, 15, 'center', 'top');

                            var hashFn = (method === 'division') ? hashDiv : hashMult;
                            var buckets = new Array(m).fill(null).map(function() { return []; });
                            for (var i = 0; i < keys.length; i++) {
                                var slot = hashFn(keys[i]);
                                buckets[slot].push(keys[i]);
                            }

                            // Draw table
                            var cellW = Math.min(55, 650 / m);
                            var startX = 350 - (m * cellW) / 2;
                            var tableY = 60;
                            for (var i = 0; i < m; i++) {
                                var px = startX + i * cellW;
                                viz.drawArrayCell(px, tableY, cellW, 30, i, viz.colors.bg, viz.colors.text);
                                // Draw chain below
                                for (var j = 0; j < buckets[i].length; j++) {
                                    var cy = tableY + 35 + j * 28;
                                    var color = (j === 0) ? viz.colors.blue : (j === 1) ? viz.colors.teal : viz.colors.purple;
                                    viz.drawArrayCell(px + 2, cy, cellW - 4, 24, buckets[i][j], color, viz.colors.white);
                                }
                            }

                            // Stats
                            var maxChain = 0;
                            var totalUsed = 0;
                            for (var i = 0; i < m; i++) {
                                if (buckets[i].length > maxChain) maxChain = buckets[i].length;
                                if (buckets[i].length > 0) totalUsed++;
                            }
                            var loadFactor = (keys.length / m).toFixed(2);
                            viz.screenText('Keys: [' + keys.join(', ') + ']', 350, 310, viz.colors.text, 11, 'center', 'top');
                            viz.screenText('Load factor = ' + loadFactor + ', Max chain = ' + maxChain + ', Slots used = ' + totalUsed + '/' + m, 350, 330, viz.colors.yellow, 11, 'center', 'top');

                            if (method === 'division') {
                                viz.screenText('h(k) = k mod ' + m, 350, 355, viz.colors.teal, 12, 'center', 'top');
                            } else {
                                viz.screenText('h(k) = floor(' + m + ' * (k * 0.6180 mod 1))', 350, 355, viz.colors.teal, 12, 'center', 'top');
                            }
                        }

                        VizEngine.createSelect(controls, 'Method:', [
                            {value: 'division', label: 'Division'},
                            {value: 'multiplication', label: 'Multiplication'}
                        ], function(val) { method = val; draw(); });

                        VizEngine.createSelect(controls, 'm =', [
                            {value: '7', label: '7'},
                            {value: '11', label: '11'},
                            {value: '13', label: '13'},
                            {value: '16', label: '16'}
                        ], function(val) { m = parseInt(val); draw(); });

                        VizEngine.createButton(controls, 'Random Keys', function() {
                            keys = [];
                            var n = 12 + Math.floor(Math.random() * 6);
                            for (var i = 0; i < n; i++) keys.push(Math.floor(Math.random() * 100) + 1);
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Hash keys \\(\\{10, 22, 31, 4, 15, 28, 17, 88, 59\\}\\) into a table of size \\(m = 11\\) using the division method. Show the resulting chains.',
                    hint: 'Compute \\(k \\bmod 11\\) for each key.',
                    solution: 'h(10)=10, h(22)=0, h(31)=9, h(4)=4, h(15)=4, h(28)=6, h(17)=6, h(88)=0, h(59)=4. Slot 0: [22, 88], Slot 4: [4, 15, 59], Slot 6: [28, 17], Slot 9: [31], Slot 10: [10]. Max chain length = 3 (slot 4).'
                },
                {
                    question: 'Why should \\(m\\) not be a power of 2 for the division method?',
                    hint: 'What does \\(k \\bmod 2^p\\) depend on?',
                    solution: 'If \\(m = 2^p\\), then \\(k \\bmod m\\) depends only on the lowest \\(p\\) bits of \\(k\\). If the keys have patterns in their low-order bits (common in practice, e.g., even numbers always hash to even slots), the distribution will be poor. A prime \\(m\\) uses all bits of \\(k\\) in the modular reduction.'
                },
                {
                    question: 'Prove that the Carter-Wegman family \\(h_{a,b}(k) = ((ak+b) \\bmod p) \\bmod m\\) is universal.',
                    hint: 'Show that for distinct \\(k_1, k_2\\), the pair \\((ak_1+b \\bmod p, ak_2+b \\bmod p)\\) is uniform over \\(\\mathbb{Z}_p^2\\) minus the diagonal.',
                    solution: 'For distinct \\(k_1, k_2\\) and random \\(a \\in \\{1,\\ldots,p-1\\}, b \\in \\{0,\\ldots,p-1\\}\\): let \\(r_1 = ak_1+b \\bmod p, r_2 = ak_2+b \\bmod p\\). The mapping \\((a,b) \\mapsto (r_1,r_2)\\) is a bijection on \\(\\{(r_1,r_2) : r_1 \\ne r_2\\}\\). So \\(r_1, r_2\\) are uniform and distinct in \\(\\mathbb{Z}_p\\). The number of \\((r_1,r_2)\\) with \\(r_1 \\ne r_2\\) and \\(r_1 \\bmod m = r_2 \\bmod m\\) is at most \\(p(p-1)/m\\) out of \\(p(p-1)\\) total, giving collision probability \\(\\le 1/m\\).'
                }
            ]
        },
        // ============================================================
        // Section 2 : 碰撞处理 — Collision Resolution
        // ============================================================
        {
            id: 'ch10-sec02',
            title: '碰撞处理',
            content: `<h2>Collision Resolution</h2>

<h3>Chaining</h3>
<p>Each slot contains a linked list of all keys that hash to it. Simple and effective when the load factor \\(\\alpha = n/m\\) is moderate.</p>

<div class="env-block theorem"><div class="env-title">Theorem (Chaining Performance)</div><div class="env-body">
<p>With simple uniform hashing and chaining:</p>
<ul>
<li>Unsuccessful search: \\(\\Theta(1 + \\alpha)\\) expected time</li>
<li>Successful search: \\(\\Theta(1 + \\alpha)\\) expected time</li>
</ul>
<p>If \\(n = O(m)\\), all operations are \\(O(1)\\) expected time.</p>
</div></div>

<h3>Open Addressing</h3>
<p>All elements stored in the table itself. When a collision occurs, <em>probe</em> alternative slots according to a probe sequence \\(h(k, 0), h(k, 1), h(k, 2), \\ldots\\)</p>

<div class="env-block definition"><div class="env-title">Definition (Probe Sequences)</div><div class="env-body">
<ul>
<li><strong>Linear probing</strong>: \\(h(k, i) = (h'(k) + i) \\bmod m\\). Simple but suffers from <em>primary clustering</em>.</li>
<li><strong>Quadratic probing</strong>: \\(h(k, i) = (h'(k) + c_1 i + c_2 i^2) \\bmod m\\). Reduces clustering but may not visit all slots.</li>
<li><strong>Double hashing</strong>: \\(h(k, i) = (h_1(k) + i \\cdot h_2(k)) \\bmod m\\). Best distribution; visits all slots if \\(h_2(k)\\) is coprime to \\(m\\).</li>
</ul>
</div></div>

<div class="viz-placeholder" data-viz="ch10-viz-open-addressing"></div>

<div class="env-block theorem"><div class="env-title">Theorem (Open Addressing Bounds)</div><div class="env-body">
<p>Under uniform hashing with load factor \\(\\alpha < 1\\):</p>
<ul>
<li>Expected probes for unsuccessful search: \\(\\le 1/(1-\\alpha)\\)</li>
<li>Expected probes for successful search: \\(\\le (1/\\alpha) \\ln(1/(1-\\alpha))\\)</li>
</ul>
</div></div>

<p>At \\(\\alpha = 0.5\\): about 2 probes for miss, 1.39 for hit. At \\(\\alpha = 0.9\\): about 10 for miss, 2.56 for hit. Performance degrades rapidly as the table fills.</p>`,
            visualizations: [
                {
                    id: 'ch10-viz-open-addressing',
                    title: 'Open Addressing Probe Tracer',
                    description: 'Watch different probing strategies resolve collisions.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 420});
                        let m = 13;
                        let table = new Array(m).fill(null);
                        let probeMethod = 'linear';
                        let probeTrail = [];
                        let message = '';

                        function h1(k) { return k % m; }
                        function h2(k) { return 1 + (k % (m - 1)); }

                        function probe(k, i) {
                            if (probeMethod === 'linear') return (h1(k) + i) % m;
                            if (probeMethod === 'quadratic') return (h1(k) + i + 3 * i * i) % m;
                            return (h1(k) + i * h2(k)) % m;
                        }

                        function insertKey(k) {
                            probeTrail = [];
                            for (var i = 0; i < m; i++) {
                                var slot = probe(k, i);
                                probeTrail.push(slot);
                                if (table[slot] === null) {
                                    table[slot] = k;
                                    message = 'Inserted ' + k + ' at slot ' + slot + ' after ' + (i + 1) + ' probe(s)';
                                    return;
                                }
                            }
                            message = 'Table full! Could not insert ' + k;
                        }

                        function searchKey(k) {
                            probeTrail = [];
                            for (var i = 0; i < m; i++) {
                                var slot = probe(k, i);
                                probeTrail.push(slot);
                                if (table[slot] === k) {
                                    message = 'Found ' + k + ' at slot ' + slot + ' after ' + (i + 1) + ' probe(s)';
                                    return;
                                }
                                if (table[slot] === null) {
                                    message = k + ' not found (empty slot at ' + slot + '), ' + (i + 1) + ' probe(s)';
                                    return;
                                }
                            }
                            message = k + ' not found, ' + m + ' probes (full scan)';
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Open Addressing: ' + probeMethod + ' probing (m = ' + m + ')', 350, 10, viz.colors.white, 15, 'center', 'top');

                            var cellW = Math.min(50, 650 / m);
                            var startX = 350 - (m * cellW) / 2;
                            var tableY = 60;

                            var probeSet = {};
                            for (var i = 0; i < probeTrail.length; i++) probeSet[probeTrail[i]] = i + 1;

                            for (var i = 0; i < m; i++) {
                                var px = startX + i * cellW;
                                var hl = probeSet[i] ? viz.colors.orange : null;
                                var val = table[i] !== null ? table[i] : '';
                                var bg = table[i] !== null ? viz.colors.blue + '44' : viz.colors.bg;
                                viz.drawArrayCell(px, tableY, cellW, 35, val, bg, viz.colors.white, hl);
                                viz.screenText(String(i), px + cellW / 2, tableY + 40, viz.colors.text, 10, 'center', 'top');
                                if (probeSet[i]) {
                                    viz.screenText('#' + probeSet[i], px + cellW / 2, tableY - 5, viz.colors.orange, 10, 'center', 'bottom');
                                }
                            }

                            // Probe sequence visualization
                            if (probeTrail.length > 0) {
                                var trailY = 140;
                                viz.screenText('Probe sequence:', 30, trailY, viz.colors.text, 12, 'left', 'top');
                                for (var i = 0; i < probeTrail.length; i++) {
                                    var px = 160 + i * 40;
                                    if (px > 660) break;
                                    var isLast = (i === probeTrail.length - 1);
                                    var color = isLast ? viz.colors.green : viz.colors.orange;
                                    viz.drawNode(px, trailY + 8, 14, probeTrail[i], color, viz.colors.white);
                                    if (i < probeTrail.length - 1) {
                                        viz.ctx.strokeStyle = viz.colors.axis;
                                        viz.ctx.lineWidth = 1;
                                        viz.ctx.beginPath(); viz.ctx.moveTo(px + 16, trailY + 8); viz.ctx.lineTo(px + 24, trailY + 8); viz.ctx.stroke();
                                    }
                                }
                            }

                            // Load factor bar
                            var filled = 0;
                            for (var i = 0; i < m; i++) if (table[i] !== null) filled++;
                            var lf = (filled / m);
                            var barY = 190;
                            viz.screenText('Load factor: ' + lf.toFixed(2) + ' (' + filled + '/' + m + ' slots)', 350, barY, viz.colors.text, 12, 'center', 'top');
                            viz.ctx.fillStyle = viz.colors.bg;
                            viz.ctx.fillRect(150, barY + 20, 400, 16);
                            viz.ctx.strokeStyle = viz.colors.axis;
                            viz.ctx.strokeRect(150, barY + 20, 400, 16);
                            var barColor = lf < 0.5 ? viz.colors.green : (lf < 0.75 ? viz.colors.yellow : viz.colors.red);
                            viz.ctx.fillStyle = barColor;
                            viz.ctx.fillRect(150, barY + 20, 400 * lf, 16);

                            // Expected probes
                            if (lf > 0 && lf < 1) {
                                var expMiss = (1 / (1 - lf)).toFixed(2);
                                var expHit = ((1 / lf) * Math.log(1 / (1 - lf))).toFixed(2);
                                viz.screenText('Expected probes: miss = ' + expMiss + ', hit = ' + expHit, 350, barY + 45, viz.colors.teal, 11, 'center', 'top');
                            }

                            if (message) viz.screenText(message, 350, 380, viz.colors.yellow, 11, 'center', 'top');
                        }

                        // Initialize
                        [10, 22, 31, 4, 15, 28, 17].forEach(function(k) { insertKey(k); });
                        probeTrail = [];
                        message = '';

                        VizEngine.createSelect(controls, 'Probing:', [
                            {value: 'linear', label: 'Linear'},
                            {value: 'quadratic', label: 'Quadratic'},
                            {value: 'double', label: 'Double Hashing'}
                        ], function(val) {
                            probeMethod = val;
                            table = new Array(m).fill(null);
                            [10, 22, 31, 4, 15, 28, 17].forEach(function(k) { insertKey(k); });
                            probeTrail = [];
                            message = 'Rebuilt with ' + val + ' probing';
                            draw();
                        });

                        var inputEl = document.createElement('input');
                        inputEl.type = 'number';
                        inputEl.value = '44';
                        inputEl.style.cssText = 'width:55px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:6px;';
                        controls.appendChild(inputEl);

                        VizEngine.createButton(controls, 'Insert', function() {
                            var val = parseInt(inputEl.value);
                            if (isNaN(val)) return;
                            insertKey(val);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Search', function() {
                            var val = parseInt(inputEl.value);
                            if (isNaN(val)) return;
                            searchKey(val);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Clear', function() {
                            table = new Array(m).fill(null);
                            probeTrail = [];
                            message = 'Table cleared';
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Insert keys \\(10, 22, 31, 4, 15, 28, 17, 88, 59\\) into a hash table of size 11 using linear probing with \\(h(k) = k \\bmod 11\\). Show the final table.',
                    hint: 'When a collision occurs, try the next slot (wrapping around).',
                    solution: 'h(10)=10: slot 10. h(22)=0: slot 0. h(31)=9: slot 9. h(4)=4: slot 4. h(15)=4 collision -> 5. h(28)=6: slot 6. h(17)=6 collision -> 7. h(88)=0 collision -> 1. h(59)=4 collision -> 5 collision -> 6 collision -> 7 collision -> 8. Final: [22,88,-,-,4,15,28,17,59,31,10] where - means empty.'
                },
                {
                    question: 'Explain primary clustering in linear probing and how double hashing mitigates it.',
                    hint: 'In linear probing, long occupied runs tend to grow longer because new keys that hash anywhere into the run extend it.',
                    solution: 'Primary clustering: in linear probing, a contiguous block of occupied slots acts as a "cluster." Any new key hashing to any slot in the cluster must probe to the end, extending the cluster. Longer clusters grow faster (a cluster of size k has probability proportional to k+1 of growing). Double hashing mitigates this because the probe step h2(k) varies per key, so different keys that hash to the same slot follow different probe sequences, avoiding the sequential probing pattern.'
                },
                {
                    question: 'Prove that the expected number of probes in an unsuccessful search with open addressing is at most \\(1/(1-\\alpha)\\).',
                    hint: 'The probability that slot \\(h(k,0)\\) is occupied is \\(\\alpha\\). Given that, the conditional probability the next slot is also occupied is at most \\((n-1)/(m-1) < \\alpha\\).',
                    solution: 'Under uniform hashing: Pr[probe 1 is occupied] = n/m = alpha. Given i occupied probes, Pr[probe i+1 is occupied] <= (n-i)/(m-i) <= alpha. So Pr[at least i probes] <= alpha^(i-1). Expected probes = sum_{i=0}^{infinity} alpha^i = 1/(1-alpha). This is an upper bound since the conditional probabilities are actually decreasing.'
                }
            ]
        },
        // ============================================================
        // Section 3 : 完美哈希与布谷鸟哈希 — Perfect & Cuckoo Hashing
        // ============================================================
        {
            id: 'ch10-sec03',
            title: '完美哈希与布谷鸟哈希',
            content: `<h2>Perfect Hashing & Cuckoo Hashing</h2>

<h3>Perfect Hashing</h3>
<p>When the key set is static (known in advance), we can achieve \\(O(1)\\) worst-case lookup using <em>perfect hashing</em>.</p>

<div class="env-block definition"><div class="env-title">Definition (Perfect Hash Function)</div><div class="env-body">
<p>A hash function \\(h\\) is <em>perfect</em> for a set \\(S\\) if it has no collisions: \\(h(k_1) \\ne h(k_2)\\) for all distinct \\(k_1, k_2 \\in S\\).</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (FKS Perfect Hashing)</div><div class="env-body">
<p>Fredman, Koml&oacute;s, and Szemer&eacute;di (1984): For \\(n\\) static keys, a two-level hash table uses \\(O(n)\\) space and achieves \\(O(1)\\) worst-case lookup.</p>
<p>Level 1: Universal hash function maps \\(n\\) keys to \\(m = n\\) slots. Level 2: Each slot \\(j\\) with \\(n_j\\) collisions uses a secondary table of size \\(n_j^2\\) with a perfect hash function (found by trying random universal hash functions).</p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof (Space is \\(O(n)\\))</div><div class="env-body">
<p>Total space = \\(\\sum_{j=0}^{m-1} n_j^2\\). By the birthday bound with universal hashing: \\(E[\\sum n_j^2] = n + n(n-1)/m\\). With \\(m = n\\): \\(E[\\sum n_j^2] = n + n - 1 < 2n\\). So expected total space is \\(O(n)\\).</p>
<p class="qed">∎</p>
</div></div>

<h3>Cuckoo Hashing</h3>
<p>Cuckoo hashing (Pagh & Rodler, 2004) uses two hash functions \\(h_1, h_2\\) and two tables. Each key is stored in exactly one of its two possible locations.</p>

<div class="env-block algorithm"><div class="env-title">Algorithm: Cuckoo Insert(k)</div><div class="env-body">
<p>1. If \\(T_1[h_1(k)]\\) or \\(T_2[h_2(k)]\\) is empty, place \\(k\\) there.</p>
<p>2. Otherwise, evict the key at \\(T_1[h_1(k)]\\), place \\(k\\) there.</p>
<p>3. The evicted key tries its alternative location. Repeat.</p>
<p>4. If a cycle is detected (too many evictions), rehash with new hash functions.</p>
</div></div>

<div class="viz-placeholder" data-viz="ch10-viz-cuckoo"></div>

<div class="env-block theorem"><div class="env-title">Theorem (Cuckoo Hashing Guarantees)</div><div class="env-body">
<p>With two tables of size \\((1+\\epsilon)n\\) each: lookup is \\(O(1)\\) worst case (check two locations). Insert is \\(O(1)\\) amortized expected. The probability of needing a rehash during any single insert is \\(O(1/n^2)\\).</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch10-viz-cuckoo',
                    title: 'Cuckoo Hashing Kick Animation',
                    description: 'Watch keys bounce between two tables during cuckoo insert.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 400});
                        let m = 7;
                        let T1 = new Array(m).fill(null);
                        let T2 = new Array(m).fill(null);
                        let message = '';
                        let kickTrail = [];
                        // Fixed hash functions
                        let a1 = 3, b1 = 5, a2 = 7, b2 = 2;
                        function hash1(k) { return Math.abs((a1 * k + b1) % 97) % m; }
                        function hash2(k) { return Math.abs((a2 * k + b2) % 89) % m; }

                        function cuckooInsert(key) {
                            kickTrail = [];
                            var k = key;
                            var maxKicks = 20;
                            for (var i = 0; i < maxKicks; i++) {
                                var slot1 = hash1(k);
                                kickTrail.push({table: 1, slot: slot1, key: k});
                                if (T1[slot1] === null) {
                                    T1[slot1] = k;
                                    message = 'Inserted ' + key + ' in T1[' + slot1 + '] after ' + (i + 1) + ' step(s)';
                                    return true;
                                }
                                // Evict from T1
                                var evicted = T1[slot1];
                                T1[slot1] = k;
                                k = evicted;

                                var slot2 = hash2(k);
                                kickTrail.push({table: 2, slot: slot2, key: k});
                                if (T2[slot2] === null) {
                                    T2[slot2] = k;
                                    message = 'Inserted ' + key + ' after ' + (i + 1) + ' kick(s), placed ' + k + ' in T2[' + slot2 + ']';
                                    return true;
                                }
                                // Evict from T2
                                evicted = T2[slot2];
                                T2[slot2] = k;
                                k = evicted;
                            }
                            message = 'Cycle detected after ' + maxKicks + ' kicks! Need rehash.';
                            return false;
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Cuckoo Hashing (two tables, two hash functions)', 350, 10, viz.colors.white, 15, 'center', 'top');

                            var cellW = Math.min(60, 500 / m);
                            var startX1 = 100;
                            var startX2 = 400;
                            var tableY = 60;

                            // T1
                            viz.screenText('Table T1 (h1)', startX1 + (m * cellW) / 2, tableY - 15, viz.colors.blue, 12, 'center', 'bottom');
                            for (var i = 0; i < m; i++) {
                                var val = T1[i] !== null ? T1[i] : '';
                                var bg = T1[i] !== null ? viz.colors.blue + '44' : viz.colors.bg;
                                var hl = null;
                                for (var j = 0; j < kickTrail.length; j++) {
                                    if (kickTrail[j].table === 1 && kickTrail[j].slot === i) hl = viz.colors.orange;
                                }
                                viz.drawArrayCell(startX1, tableY + i * 32, cellW, 28, val, bg, viz.colors.white, hl);
                                viz.screenText(String(i), startX1 - 15, tableY + i * 32 + 14, viz.colors.text, 10, 'right', 'middle');
                            }

                            // T2
                            viz.screenText('Table T2 (h2)', startX2 + (m * cellW) / 2, tableY - 15, viz.colors.teal, 12, 'center', 'bottom');
                            for (var i = 0; i < m; i++) {
                                var val = T2[i] !== null ? T2[i] : '';
                                var bg = T2[i] !== null ? viz.colors.teal + '44' : viz.colors.bg;
                                var hl = null;
                                for (var j = 0; j < kickTrail.length; j++) {
                                    if (kickTrail[j].table === 2 && kickTrail[j].slot === i) hl = viz.colors.orange;
                                }
                                viz.drawArrayCell(startX2, tableY + i * 32, cellW, 28, val, bg, viz.colors.white, hl);
                                viz.screenText(String(i), startX2 - 15, tableY + i * 32 + 14, viz.colors.text, 10, 'right', 'middle');
                            }

                            // Kick trail
                            if (kickTrail.length > 0) {
                                var trailStr = kickTrail.map(function(k) {
                                    return k.key + '->T' + k.table + '[' + k.slot + ']';
                                }).join(', ');
                                viz.screenText('Kick trail: ' + trailStr, 350, 320, viz.colors.orange, 10, 'center', 'top');
                            }

                            if (message) viz.screenText(message, 350, 370, viz.colors.yellow, 11, 'center', 'top');
                        }

                        // Initialize
                        [20, 50, 53, 75, 100, 67].forEach(function(k) { cuckooInsert(k); });
                        kickTrail = [];
                        message = '';

                        var inputEl = document.createElement('input');
                        inputEl.type = 'number';
                        inputEl.value = '33';
                        inputEl.style.cssText = 'width:55px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:6px;';
                        controls.appendChild(inputEl);

                        VizEngine.createButton(controls, 'Insert', function() {
                            var val = parseInt(inputEl.value);
                            if (isNaN(val)) return;
                            cuckooInsert(val);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Lookup', function() {
                            var val = parseInt(inputEl.value);
                            if (isNaN(val)) return;
                            kickTrail = [];
                            var s1 = hash1(val), s2 = hash2(val);
                            kickTrail.push({table: 1, slot: s1, key: val});
                            kickTrail.push({table: 2, slot: s2, key: val});
                            if (T1[s1] === val) message = 'Found ' + val + ' in T1[' + s1 + ']';
                            else if (T2[s2] === val) message = 'Found ' + val + ' in T2[' + s2 + ']';
                            else message = val + ' not found (checked T1[' + s1 + '] and T2[' + s2 + '])';
                            draw();
                        });

                        VizEngine.createButton(controls, 'Clear', function() {
                            T1 = new Array(m).fill(null);
                            T2 = new Array(m).fill(null);
                            kickTrail = [];
                            message = 'Tables cleared';
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In the FKS perfect hashing scheme, why do we use table size \\(n_j^2\\) for the secondary table at slot \\(j\\)?',
                    hint: 'Think of the birthday paradox: the probability of no collision among \\(n_j\\) items in a table of size \\(m_j\\).',
                    solution: 'By the birthday bound, if we hash \\(n_j\\) keys into a table of size \\(m_j = n_j^2\\) using a universal hash function, the expected number of collisions is \\(\\binom{n_j}{2} \\cdot \\frac{1}{m_j} = \\frac{n_j(n_j-1)}{2n_j^2} < 1/2\\). By Markov, Pr[any collision] < 1/2. So with probability > 1/2, a random universal hash function gives zero collisions. We can find one in O(n_j^2) expected time.'
                },
                {
                    question: 'What advantages does cuckoo hashing have over chaining and linear probing?',
                    hint: 'Consider worst-case lookup time and cache behavior.',
                    solution: 'Cuckoo hashing guarantees O(1) worst-case lookup (check exactly 2 locations). Chaining has O(n) worst case, and linear probing has O(n) worst case. Cuckoo hashing also has good cache behavior since each lookup accesses at most 2 cache lines. The downside is that insertion can be expensive (O(1) amortized but with occasional rehashes).'
                },
                {
                    question: 'Prove that the expected total space in an FKS scheme is \\(O(n)\\).',
                    hint: 'Show \\(E[\\sum n_j^2] < 2n\\) when \\(m = n\\).',
                    solution: 'Let \\(n_j\\) be the number of keys in slot \\(j\\). We have \\(\\sum n_j^2 = n + 2C\\) where \\(C\\) is the total number of collisions. With a universal hash function and \\(m = n\\): \\(E[C] = \\binom{n}{2} \\cdot \\frac{1}{m} = \\frac{n(n-1)}{2n} = \\frac{n-1}{2}\\). So \\(E[\\sum n_j^2] = n + 2 \\cdot \\frac{n-1}{2} = 2n - 1 = O(n)\\).'
                }
            ]
        },
        // ============================================================
        // Section 4 : 跳表 — Skip Lists
        // ============================================================
        {
            id: 'ch10-sec04',
            title: '跳表',
            content: `<h2>Skip Lists</h2>
<p>A <strong>skip list</strong> (Pugh, 1990) is a randomized data structure that provides \\(O(\\log n)\\) expected-time search, insert, and delete — comparable to balanced BSTs but simpler to implement.</p>

<div class="env-block definition"><div class="env-title">Definition (Skip List)</div><div class="env-body">
<p>A skip list is a hierarchy of linked lists \\(L_0, L_1, \\ldots, L_h\\):</p>
<ul>
<li>\\(L_0\\) contains all \\(n\\) elements in sorted order.</li>
<li>Each element in \\(L_i\\) appears in \\(L_{i+1}\\) independently with probability \\(p\\) (typically \\(p = 1/2\\)).</li>
<li>\\(L_h\\) contains only the sentinel \\(-\\infty\\) (header).</li>
</ul>
</div></div>

<h3>Search</h3>
<p>Start at the highest level. At each level, scan right until the next element exceeds the target, then drop down one level. When we reach level 0, we have found the element (or its predecessor).</p>

<h3>Insert</h3>
<p>Search for the position, then insert at level 0 and "flip a coin" to decide whether to promote to each higher level.</p>

<div class="viz-placeholder" data-viz="ch10-viz-skip-list"></div>

<div class="env-block theorem"><div class="env-title">Theorem (Skip List Expected Performance)</div><div class="env-body">
<p>With \\(p = 1/2\\):</p>
<ul>
<li>Expected height: \\(O(\\log n)\\)</li>
<li>Expected search time: \\(O(\\log n)\\)</li>
<li>Expected space: \\(O(n)\\) (each element has expected \\(1/(1-p) = 2\\) copies)</li>
</ul>
</div></div>

<div class="env-block proof"><div class="env-title">Proof (Expected Search Cost)</div><div class="env-body">
<p>Analyze the search path backwards (from found element back to header at top level). At each step, we either go up (with probability \\(p\\)) or go left (with probability \\(1-p\\)). The expected number of steps to reach the top is the expected number of coin flips to get \\(\\log n\\) heads, which is \\(O(\\log n / p) = O(\\log n)\\) for \\(p = 1/2\\).</p>
<p class="qed">∎</p>
</div></div>

<div class="env-block example"><div class="env-title">Example</div><div class="env-body">
<p>Skip list with elements \\(\\{3, 6, 7, 9, 12, 17, 19, 21, 25, 26\\}\\):</p>
<p>Level 3: -inf -> 6 -> 25 -> +inf</p>
<p>Level 2: -inf -> 6 -> 9 -> 17 -> 25 -> +inf</p>
<p>Level 1: -inf -> 3 -> 6 -> 7 -> 9 -> 12 -> 17 -> 21 -> 25 -> +inf</p>
<p>Level 0: all elements</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch10-viz-skip-list',
                    title: 'Skip List Search & Insert',
                    description: 'Watch the search path through skip list levels.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 400});
                        var maxLevel = 5;
                        // Skip list nodes: {key, forward: [level0Next, level1Next, ...], level}
                        var header = {key: -Infinity, forward: new Array(maxLevel + 1).fill(null), level: maxLevel};
                        var searchPath = [];
                        var message = '';

                        function randomLevel() {
                            var lvl = 0;
                            while (lvl < maxLevel && Math.random() < 0.5) lvl++;
                            return lvl;
                        }

                        function skipInsert(key) {
                            var update = new Array(maxLevel + 1).fill(null);
                            var x = header;
                            for (var i = maxLevel; i >= 0; i--) {
                                while (x.forward[i] && x.forward[i].key < key) x = x.forward[i];
                                update[i] = x;
                            }
                            x = x.forward[0];
                            if (x && x.key === key) return; // duplicate
                            var newLevel = randomLevel();
                            var newNode = {key: key, forward: new Array(newLevel + 1).fill(null), level: newLevel};
                            for (var i = 0; i <= newLevel; i++) {
                                newNode.forward[i] = update[i].forward[i];
                                update[i].forward[i] = newNode;
                            }
                        }

                        function skipSearch(key) {
                            searchPath = [];
                            var x = header;
                            for (var i = maxLevel; i >= 0; i--) {
                                while (x.forward[i] && x.forward[i].key < key) {
                                    searchPath.push({node: x, level: i, action: 'right'});
                                    x = x.forward[i];
                                }
                                searchPath.push({node: x, level: i, action: 'down'});
                            }
                            x = x.forward[0];
                            if (x && x.key === key) {
                                message = 'Found ' + key + ' in ' + searchPath.length + ' steps';
                                return true;
                            }
                            message = key + ' not found, ' + searchPath.length + ' steps';
                            return false;
                        }

                        function getAllNodes() {
                            var nodes = [];
                            var x = header.forward[0];
                            while (x) { nodes.push(x); x = x.forward[0]; }
                            return nodes;
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Skip List', 350, 5, viz.colors.white, 15, 'center', 'top');

                            var nodes = getAllNodes();
                            var allNodes = [header].concat(nodes);
                            var n = allNodes.length;
                            var cellW = Math.min(55, 660 / (n + 1));
                            var startX = 20;
                            var baseY = 330;
                            var levelH = 45;

                            // Compute max actual level
                            var actualMaxLvl = 0;
                            for (var i = 0; i < allNodes.length; i++) {
                                if (allNodes[i].level > actualMaxLvl) actualMaxLvl = allNodes[i].level;
                            }

                            // Search path set for highlighting
                            var pathSet = {};
                            for (var i = 0; i < searchPath.length; i++) {
                                var sp = searchPath[i];
                                pathSet[sp.node.key + '_' + sp.level] = sp.action;
                            }

                            // Draw each node column
                            for (var ni = 0; ni < allNodes.length; ni++) {
                                var node = allNodes[ni];
                                var px = startX + ni * cellW + cellW / 2;
                                var label = (node === header) ? 'H' : String(node.key);
                                for (var lv = 0; lv <= node.level; lv++) {
                                    var py = baseY - lv * levelH;
                                    var inPath = pathSet[node.key + '_' + lv];
                                    var color = inPath ? viz.colors.orange : viz.colors.blue;
                                    viz.drawNode(px, py, 16, label, color, viz.colors.white);
                                    // Forward arrow
                                    if (node.forward[lv]) {
                                        var nextIdx = allNodes.indexOf(node.forward[lv]);
                                        if (nextIdx >= 0) {
                                            var nx = startX + nextIdx * cellW + cellW / 2;
                                            viz.ctx.strokeStyle = inPath === 'right' ? viz.colors.orange : viz.colors.axis;
                                            viz.ctx.lineWidth = inPath === 'right' ? 2 : 1;
                                            viz.ctx.beginPath();
                                            viz.ctx.moveTo(px + 17, py);
                                            viz.ctx.lineTo(nx - 17, py);
                                            viz.ctx.stroke();
                                            // Arrow head
                                            viz.ctx.fillStyle = viz.ctx.strokeStyle;
                                            viz.ctx.beginPath();
                                            viz.ctx.moveTo(nx - 17, py);
                                            viz.ctx.lineTo(nx - 22, py - 3);
                                            viz.ctx.lineTo(nx - 22, py + 3);
                                            viz.ctx.closePath();
                                            viz.ctx.fill();
                                        }
                                    }
                                }
                            }

                            // Level labels
                            for (var lv = 0; lv <= actualMaxLvl; lv++) {
                                viz.screenText('L' + lv, 8, baseY - lv * levelH, viz.colors.text, 10, 'left', 'middle');
                            }

                            if (message) viz.screenText(message, 350, 375, viz.colors.yellow, 11, 'center', 'top');
                        }

                        // Initialize
                        [3, 6, 7, 9, 12, 17, 19, 21, 25, 26].forEach(function(v) { skipInsert(v); });

                        var inputEl = document.createElement('input');
                        inputEl.type = 'number';
                        inputEl.value = '17';
                        inputEl.style.cssText = 'width:55px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:6px;';
                        controls.appendChild(inputEl);

                        VizEngine.createButton(controls, 'Search', function() {
                            var val = parseInt(inputEl.value);
                            if (isNaN(val)) return;
                            skipSearch(val);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Insert', function() {
                            var val = parseInt(inputEl.value);
                            if (isNaN(val)) return;
                            skipInsert(val);
                            searchPath = [];
                            message = 'Inserted ' + val;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Rebuild', function() {
                            header = {key: -Infinity, forward: new Array(maxLevel + 1).fill(null), level: maxLevel};
                            [3, 6, 7, 9, 12, 17, 19, 21, 25, 26].forEach(function(v) { skipInsert(v); });
                            searchPath = [];
                            message = 'Rebuilt (random levels may differ)';
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'What is the expected number of levels (height) in a skip list with \\(n\\) elements and promotion probability \\(p = 1/2\\)?',
                    hint: 'The maximum level of any element is the max of \\(n\\) geometric random variables.',
                    solution: 'Each element reaches level \\(k\\) with probability \\((1/2)^k\\). By the union bound, Pr[any element reaches level \\(c \\log n\\)] \\(\\le n \\cdot (1/2)^{c \\log n} = n^{1-c}\\). For \\(c > 1\\), this goes to 0. The expected max level is \\(\\Theta(\\log n)\\). More precisely, \\(E[\\text{height}] \\approx \\log_2 n + 1/(1-p) = \\log_2 n + 2\\).'
                },
                {
                    question: 'Compare skip lists with balanced BSTs (e.g., red-black trees) in terms of complexity, implementation, and concurrency.',
                    hint: 'Think about ease of implementation, lock-free algorithms, and constant factors.',
                    solution: 'Time complexity: both O(log n) expected (skip list) vs. O(log n) worst case (RB tree). Implementation: skip lists are much simpler (no rotation logic). Concurrency: skip lists are easier to make lock-free (insert/delete can be made concurrent with CAS operations on forward pointers), while balancing operations in RB trees are harder to parallelize. Space: skip list uses O(n) expected vs O(n) for RB tree. Skip list constant factors are slightly larger due to multiple pointer levels.'
                },
                {
                    question: 'Prove that the expected space used by a skip list with \\(n\\) elements is \\(O(n)\\).',
                    hint: 'Each element appears at level \\(k\\) with probability \\(p^k\\). Sum the expected number of copies.',
                    solution: 'Expected total pointers = \\(\\sum_{i=1}^{n} \\sum_{k=0}^{\\infty} p^k = n \\cdot \\frac{1}{1-p}\\). For \\(p = 1/2\\): expected space = \\(2n = O(n)\\). Each element has \\(1/(1-p)\\) expected copies across all levels.'
                }
            ]
        },
        // ============================================================
        // Section 5 : 布隆过滤器 — Bloom Filters
        // ============================================================
        {
            id: 'ch10-sec05',
            title: '布隆过滤器',
            content: `<h2>Bloom Filters</h2>
<p>A <strong>Bloom filter</strong> (Bloom, 1970) is a space-efficient probabilistic data structure for set membership queries. It may yield false positives but never false negatives.</p>

<div class="env-block definition"><div class="env-title">Definition (Bloom Filter)</div><div class="env-body">
<p>A Bloom filter consists of:</p>
<ul>
<li>A bit array \\(B[0..m-1]\\), initially all zeros.</li>
<li>\\(k\\) independent hash functions \\(h_1, \\ldots, h_k\\), each mapping keys to \\(\\{0, \\ldots, m-1\\}\\).</li>
</ul>
<p><strong>Insert(x)</strong>: Set \\(B[h_i(x)] = 1\\) for all \\(i = 1, \\ldots, k\\).</p>
<p><strong>Query(x)</strong>: Return "possibly in set" if \\(B[h_i(x)] = 1\\) for all \\(i\\); otherwise "definitely not in set".</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (False Positive Rate)</div><div class="env-body">
<p>After inserting \\(n\\) elements into a Bloom filter with \\(m\\) bits and \\(k\\) hash functions, the false positive probability is approximately:</p>
$$f \\approx \\left(1 - e^{-kn/m}\\right)^k$$
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (Optimal Number of Hash Functions)</div><div class="env-body">
<p>The false positive rate is minimized when \\(k = (m/n) \\ln 2\\). At the optimum:</p>
$$f_{\\min} = (1/2)^k = (0.6185\\ldots)^{m/n}$$
<p>For a target false positive rate \\(f\\), we need \\(m = -n \\ln f / (\\ln 2)^2 \\approx 1.44 n \\log_2(1/f)\\) bits.</p>
</div></div>

<div class="viz-placeholder" data-viz="ch10-viz-bloom"></div>

<h3>Applications</h3>
<ul>
<li><strong>Web caching</strong>: Squid uses Bloom filters to check if a URL is cached without accessing disk.</li>
<li><strong>Databases</strong>: LSM-trees use Bloom filters to avoid unnecessary disk reads for missing keys.</li>
<li><strong>Network routing</strong>: Detect routing loops or duplicates.</li>
<li><strong>Spell checking</strong>: Compact dictionary membership test.</li>
</ul>

<div class="env-block example"><div class="env-title">Example</div><div class="env-body">
<p>With \\(n = 1000\\) elements and target \\(f = 1\\%\\): \\(m = 1.44 \\times 1000 \\times \\log_2(100) \\approx 9585\\) bits (about 1.2 KB). With \\(k = 7\\) hash functions.</p>
<p>Compare with storing 1000 elements explicitly: at least 1000 pointers/entries, typically many KB.</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch10-viz-bloom',
                    title: 'Bloom Filter Bit Array',
                    description: 'Insert elements and test membership. See false positive rates.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 400});
                        let m = 32;
                        let k = 3;
                        let bits = new Array(m).fill(0);
                        let insertedKeys = [];
                        let message = '';
                        let falsePositives = 0;
                        let trueNegatives = 0;
                        let queryHighlights = {};

                        function hashK(key, i) {
                            // Simple hash: (key * prime_i + offset) mod m
                            var primes = [31, 37, 41, 43, 47, 53, 59];
                            return Math.abs((key * primes[i % primes.length] + i * 17 + 7) % m);
                        }

                        function bloomInsert(key) {
                            queryHighlights = {};
                            for (var i = 0; i < k; i++) {
                                var slot = hashK(key, i);
                                bits[slot] = 1;
                                queryHighlights[slot] = true;
                            }
                            insertedKeys.push(key);
                        }

                        function bloomQuery(key) {
                            queryHighlights = {};
                            for (var i = 0; i < k; i++) {
                                var slot = hashK(key, i);
                                queryHighlights[slot] = true;
                                if (bits[slot] === 0) return false;
                            }
                            return true;
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Bloom Filter (m = ' + m + ' bits, k = ' + k + ' hash functions)', 350, 8, viz.colors.white, 14, 'center', 'top');

                            // Draw bit array in 2 rows
                            var cellW = Math.min(38, 680 / (m / 2));
                            var perRow = Math.ceil(m / 2);
                            for (var i = 0; i < m; i++) {
                                var row = Math.floor(i / perRow);
                                var col = i % perRow;
                                var px = 10 + col * cellW;
                                var py = 40 + row * 40;
                                var bg = bits[i] ? viz.colors.blue : viz.colors.bg;
                                var hl = queryHighlights[i] ? viz.colors.orange : null;
                                viz.drawArrayCell(px, py, cellW - 2, 30, bits[i], bg, viz.colors.white, hl);
                                viz.screenText(String(i), px + (cellW - 2) / 2, py + 34, viz.colors.text, 8, 'center', 'top');
                            }

                            // Stats
                            var onesCount = bits.filter(function(b) { return b === 1; }).length;
                            var fillRatio = (onesCount / m).toFixed(3);
                            var theoreticalFP = Math.pow(1 - Math.exp(-k * insertedKeys.length / m), k);

                            var statsY = 155;
                            viz.screenText('Elements inserted: ' + insertedKeys.length, 350, statsY, viz.colors.text, 11, 'center', 'top');
                            viz.screenText('Bits set: ' + onesCount + '/' + m + ' (' + (fillRatio * 100).toFixed(1) + '%)', 350, statsY + 18, viz.colors.text, 11, 'center', 'top');
                            viz.screenText('Theoretical false positive rate: ' + (theoreticalFP * 100).toFixed(2) + '%', 350, statsY + 36, viz.colors.teal, 11, 'center', 'top');
                            viz.screenText('Optimal k for this m/n: ' + ((m / Math.max(insertedKeys.length, 1)) * Math.LN2).toFixed(1), 350, statsY + 54, viz.colors.text, 11, 'center', 'top');

                            // Inserted keys
                            var keyStr = insertedKeys.length <= 15 ? insertedKeys.join(', ') : insertedKeys.slice(0, 15).join(', ') + '...';
                            viz.screenText('Keys: {' + keyStr + '}', 350, statsY + 80, viz.colors.text, 10, 'center', 'top');

                            // Fill ratio bar
                            var barY = statsY + 100;
                            viz.ctx.fillStyle = viz.colors.bg;
                            viz.ctx.fillRect(150, barY, 400, 14);
                            viz.ctx.strokeStyle = viz.colors.axis;
                            viz.ctx.strokeRect(150, barY, 400, 14);
                            var barColor = fillRatio < 0.3 ? viz.colors.green : (fillRatio < 0.6 ? viz.colors.yellow : viz.colors.red);
                            viz.ctx.fillStyle = barColor;
                            viz.ctx.fillRect(150, barY, 400 * fillRatio, 14);
                            viz.screenText('Fill ratio', 350, barY + 18, viz.colors.text, 10, 'center', 'top');

                            if (message) viz.screenText(message, 350, barY + 40, viz.colors.yellow, 12, 'center', 'top');
                        }

                        // Init
                        [10, 20, 30, 42, 55].forEach(function(v) { bloomInsert(v); });
                        queryHighlights = {};
                        message = '';

                        var inputEl = document.createElement('input');
                        inputEl.type = 'number';
                        inputEl.value = '25';
                        inputEl.style.cssText = 'width:55px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:6px;';
                        controls.appendChild(inputEl);

                        VizEngine.createButton(controls, 'Insert', function() {
                            var val = parseInt(inputEl.value);
                            if (isNaN(val)) return;
                            bloomInsert(val);
                            message = 'Inserted ' + val + ' (set k = ' + k + ' bits)';
                            draw();
                        });

                        VizEngine.createButton(controls, 'Query', function() {
                            var val = parseInt(inputEl.value);
                            if (isNaN(val)) return;
                            var result = bloomQuery(val);
                            var actual = insertedKeys.indexOf(val) >= 0;
                            if (result && actual) message = val + ': POSITIVE (true positive)';
                            else if (result && !actual) message = val + ': POSITIVE (FALSE POSITIVE!)';
                            else message = val + ': NEGATIVE (true negative)';
                            draw();
                        });

                        VizEngine.createButton(controls, 'Clear', function() {
                            bits = new Array(m).fill(0);
                            insertedKeys = [];
                            queryHighlights = {};
                            message = 'Cleared';
                            draw();
                        });

                        VizEngine.createSelect(controls, 'k = ', [
                            {value: '2', label: '2'},
                            {value: '3', label: '3'},
                            {value: '5', label: '5'},
                            {value: '7', label: '7'}
                        ], function(val) {
                            k = parseInt(val);
                            bits = new Array(m).fill(0);
                            var oldKeys = insertedKeys.slice();
                            insertedKeys = [];
                            oldKeys.forEach(function(v) { bloomInsert(v); });
                            queryHighlights = {};
                            message = 'Rebuilt with k = ' + k;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'For \\(n = 100\\) elements and a desired false positive rate of \\(1\\%\\), compute the required number of bits \\(m\\) and hash functions \\(k\\).',
                    hint: 'Use \\(m = -n \\ln f / (\\ln 2)^2\\) and \\(k = (m/n) \\ln 2\\).',
                    solution: '\\(m = -100 \\times \\ln(0.01) / (\\ln 2)^2 = 100 \\times 4.605 / 0.4805 \\approx 958\\) bits (about 120 bytes). \\(k = (958/100) \\times \\ln 2 \\approx 6.64\\), round to \\(k = 7\\).'
                },
                {
                    question: 'Explain why a Bloom filter cannot support deletion. How does a counting Bloom filter solve this?',
                    hint: 'Setting a bit to 0 might affect other elements that also hash to that bit.',
                    solution: 'A standard Bloom filter cannot delete because multiple keys may set the same bit. Clearing a bit for one key would create false negatives for other keys that hash to the same bit. A counting Bloom filter replaces each bit with a counter. Insert increments k counters; delete decrements them. A position is "set" if its counter > 0. This allows deletion but uses more space (e.g., 4 bits per counter instead of 1 bit).'
                },
                {
                    question: 'Derive the optimal number of hash functions \\(k = (m/n) \\ln 2\\) by minimizing the false positive rate.',
                    hint: 'Let \\(f = (1 - e^{-kn/m})^k\\). Take \\(\\ln f\\) and differentiate with respect to \\(k\\), treating \\(p = e^{-kn/m}\\) as a function of \\(k\\).',
                    solution: 'Let \\(g = kn/m\\) and \\(f = (1-e^{-g})^k\\). Take \\(\\ln f = k \\ln(1-e^{-g})\\). Substituting \\(g = kn/m\\), minimize over \\(k\\). Let \\(p = e^{-kn/m}\\), then \\(f = (1-p)^k\\). Since \\(k = -(m/n) \\ln p\\), \\(\\ln f = -(m/n) \\ln p \\cdot \\ln(1-p)\\). By AM-GM or calculus, this is minimized at \\(p = 1/2\\), giving \\(k = (m/n) \\ln 2\\).'
                }
            ]
        }
    ]
});
