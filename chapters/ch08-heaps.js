// ============================================================
// Ch 8 · Heaps & Priority Queues
// ============================================================
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch08',
    number: 8,
    title: 'Heaps & Priority Queues',
    subtitle: 'Heaps & Priority Queues',
    sections: [
        // ============================================================
        // Section 1 : Binary Heaps
        // ============================================================
        {
            id: 'ch08-sec01',
            title: 'Binary Heaps',
            content: `<h2>Binary Heaps</h2>
<div class="env-block bridge"><div class="env-title">Chapter Overview</div><div class="env-body"><p>With the sorting arc complete (Chapters 4 through 7), we now turn to data structures. A priority queue maintains a dynamic set of elements with priorities, supporting efficient insertion and extraction of the maximum (or minimum). The heap is its canonical implementation, and it underpins algorithms from Heapsort to Dijkstra's shortest paths (Chapter 14) and Prim's MST (Chapter 15). This chapter develops heaps from the ground up.</p></div></div>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>We begin with the binary heap: a nearly complete binary tree stored in an array, where every node's key is at least as large as its children's. We develop the Insert and Extract-Max operations and prove their \(O(\log n)\) time bounds.</p></div></div>

<p>A <strong>binary heap</strong> is a nearly complete binary tree stored compactly in an array. It supports efficient priority queue operations — insert and extract-min/max — in \\(O(\\log n)\\) time.</p>

<div class="env-block definition"><div class="env-title">Definition (Max-Heap Property)</div><div class="env-body">
<p>A <em>max-heap</em> is an array \\(A[0..n-1]\\) representing a nearly complete binary tree such that for every node \\(i\\) other than the root:</p>
$$A[\\text{parent}(i)] \\ge A[i]$$
<p>where \\(\\text{parent}(i) = \\lfloor (i-1)/2 \\rfloor\\), \\(\\text{left}(i) = 2i+1\\), \\(\\text{right}(i) = 2i+2\\).</p>
</div></div>

<p>The height of a heap with \\(n\\) elements is \\(\\Theta(\\log n)\\), since the underlying tree is nearly complete.</p>

<div class="env-block theorem"><div class="env-title">Theorem (Heap Height)</div><div class="env-body">
<p>A heap with \\(n\\) elements has height \\(h = \\lfloor \\log_2 n \\rfloor\\).</p>
</div></div>

<h3>Heapify (Sift-Down)</h3>
<p>The key maintenance operation is <code>MaxHeapify(A, i)</code>: assuming the subtrees rooted at \\(\\text{left}(i)\\) and \\(\\text{right}(i)\\) are valid max-heaps, fix the heap property at node \\(i\\) by floating it down.</p>

<div class="env-block algorithm"><div class="env-title">Algorithm: MaxHeapify(A, i)</div><div class="env-body">
<p>1. \\(l \\leftarrow 2i+1,\\; r \\leftarrow 2i+2\\)</p>
<p>2. \\(\\text{largest} \\leftarrow i\\)</p>
<p>3. If \\(l < n\\) and \\(A[l] > A[\\text{largest}]\\), set \\(\\text{largest} \\leftarrow l\\)</p>
<p>4. If \\(r < n\\) and \\(A[r] > A[\\text{largest}]\\), set \\(\\text{largest} \\leftarrow r\\)</p>
<p>5. If \\(\\text{largest} \\ne i\\): swap \\(A[i] \\leftrightarrow A[\\text{largest}]\\), then MaxHeapify(A, largest)</p>
</div></div>

<p>Running time: \\(O(h) = O(\\log n)\\).</p>

<h3>Insert (Sift-Up)</h3>
<p>To insert a key, place it at the end of the array and <em>sift up</em>: repeatedly swap with the parent until the heap property is restored.</p>

<div class="viz-placeholder" data-viz="ch08-viz-heap-ops"></div>

<h3>Extract-Max</h3>
<p>Remove the root (maximum element), move the last element to the root, and call MaxHeapify on the root. Both insert and extract-max run in \\(O(\\log n)\\).</p>

<div class="env-block example"><div class="env-title">Example</div><div class="env-body">
<p>Given max-heap \\([16, 14, 10, 8, 7, 9, 3]\\):</p>
<p>Extract-max removes 16, moves 3 to root: \\([3, 14, 10, 8, 7, 9]\\), then heapify gives \\([14, 8, 10, 3, 7, 9]\\).</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch08-viz-heap-ops',
                    title: 'Binary Heap: Insert & Extract-Max',
                    description: 'Interactive binary heap showing tree+array dual view with animated insert and extract operations.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 420});
                        let heap = [50, 30, 40, 10, 20, 15, 35];
                        let highlights = {};
                        let message = '';

                        function parent(i) { return Math.floor((i - 1) / 2); }
                        function left(i) { return 2 * i + 1; }
                        function right(i) { return 2 * i + 2; }

                        function draw() {
                            viz.clear();
                            viz.screenText('Max-Heap: Tree + Array View', 350, 15, viz.colors.white, 15, 'center', 'top');

                            // Draw tree
                            var n = heap.length;
                            if (n === 0) {
                                viz.screenText('Heap is empty', 350, 120, viz.colors.text, 14);
                                drawArray();
                                if (message) viz.screenText(message, 350, 400, viz.colors.yellow, 12, 'center', 'bottom');
                                return;
                            }
                            var positions = [];
                            var treeTop = 50;
                            var levelH = 55;
                            for (var i = 0; i < n; i++) {
                                var level = Math.floor(Math.log2(i + 1));
                                var maxLevel = Math.floor(Math.log2(n));
                                var posInLevel = i - (Math.pow(2, level) - 1);
                                var nodesInLevel = Math.pow(2, level);
                                var spacing = 660 / (nodesInLevel + 1);
                                var px = 20 + spacing * (posInLevel + 1);
                                var py = treeTop + level * levelH;
                                positions.push({x: px, y: py});
                            }
                            // Draw edges
                            for (var i = 1; i < n; i++) {
                                var p = parent(i);
                                viz.drawTreeEdge(positions[p].x, positions[p].y, positions[i].x, positions[i].y, viz.colors.axis);
                            }
                            // Draw nodes
                            for (var i = 0; i < n; i++) {
                                var color = highlights[i] ? viz.colors.orange : viz.colors.blue;
                                viz.drawTreeNode(positions[i].x, positions[i].y, 18, heap[i], color, viz.colors.white);
                            }

                            drawArray();
                            if (message) viz.screenText(message, 350, 400, viz.colors.yellow, 12, 'center', 'bottom');
                        }

                        function drawArray() {
                            var arrY = 320;
                            var cellW = Math.min(45, 600 / Math.max(heap.length, 1));
                            var startX = 350 - (heap.length * cellW) / 2;
                            viz.screenText('Array representation:', 350, arrY - 18, viz.colors.text, 11, 'center', 'bottom');
                            for (var i = 0; i < heap.length; i++) {
                                var hl = highlights[i] ? viz.colors.orange : null;
                                viz.drawArrayCell(startX + i * cellW, arrY, cellW, 30, heap[i], viz.colors.bg, viz.colors.white, hl);
                                viz.screenText(String(i), startX + i * cellW + cellW / 2, arrY + 34, viz.colors.text, 10, 'center', 'top');
                            }
                        }

                        function siftUp(i) {
                            while (i > 0 && heap[parent(i)] < heap[i]) {
                                var p = parent(i);
                                var tmp = heap[p]; heap[p] = heap[i]; heap[i] = tmp;
                                i = p;
                            }
                        }

                        function siftDown(i) {
                            var n = heap.length;
                            while (true) {
                                var l = left(i), r = right(i), largest = i;
                                if (l < n && heap[l] > heap[largest]) largest = l;
                                if (r < n && heap[r] > heap[largest]) largest = r;
                                if (largest === i) break;
                                var tmp = heap[i]; heap[i] = heap[largest]; heap[largest] = tmp;
                                i = largest;
                            }
                        }

                        var inputEl = document.createElement('input');
                        inputEl.type = 'number';
                        inputEl.value = '25';
                        inputEl.style.cssText = 'width:60px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:6px;';
                        controls.appendChild(inputEl);

                        VizEngine.createButton(controls, 'Insert', function() {
                            var val = parseInt(inputEl.value);
                            if (isNaN(val)) return;
                            heap.push(val);
                            siftUp(heap.length - 1);
                            highlights = {};
                            highlights[heap.indexOf(val)] = true;
                            message = 'Inserted ' + val + ', sifted up to maintain heap property';
                            draw();
                        });

                        VizEngine.createButton(controls, 'Extract-Max', function() {
                            if (heap.length === 0) { message = 'Heap is empty!'; draw(); return; }
                            var max = heap[0];
                            heap[0] = heap[heap.length - 1];
                            heap.pop();
                            if (heap.length > 0) siftDown(0);
                            highlights = {};
                            if (heap.length > 0) highlights[0] = true;
                            message = 'Extracted max = ' + max;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Random Heap', function() {
                            var n = 7 + Math.floor(Math.random() * 6);
                            heap = [];
                            for (var i = 0; i < n; i++) {
                                heap.push(Math.floor(Math.random() * 90) + 10);
                                siftUp(heap.length - 1);
                            }
                            highlights = {};
                            message = 'New random max-heap with ' + n + ' elements';
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Starting from max-heap \\([90, 70, 80, 40, 50, 60, 30]\\), show the heap after inserting 85.',
                    hint: 'Insert 85 at position 7, then sift up: compare with parent at index 3 (40), swap; then compare with parent at index 1 (70), swap.',
                    solution: 'After insert at end: \\([90,70,80,40,50,60,30,85]\\). Sift up: swap 85 with 40 (index 3) giving \\([90,70,80,85,50,60,30,40]\\). Then swap 85 with 70 (index 1) giving \\([90,85,80,70,50,60,30,40]\\).'
                },
                {
                    question: 'What is the minimum and maximum number of elements in a heap of height \\(h\\)?',
                    hint: 'A heap of height \\(h\\) is a nearly complete binary tree with all levels full except possibly the last.',
                    solution: 'Minimum: \\(2^h\\) (last level has exactly 1 node). Maximum: \\(2^{h+1}-1\\) (complete binary tree).'
                },
                {
                    question: 'Show that in a max-heap of \\(n\\) elements, the leaves are at indices \\(\\lfloor n/2 \\rfloor, \\lfloor n/2 \\rfloor + 1, \\ldots, n-1\\).',
                    hint: 'A node \\(i\\) is a leaf if its left child \\(2i+1 \\ge n\\), i.e., \\(i \\ge n/2\\).',
                    solution: 'Node \\(i\\) is a leaf iff \\(2i+1 \\ge n\\), i.e., \\(i \\ge (n-1)/2\\), i.e., \\(i \\ge \\lceil n/2 \\rceil - 1 + 1 = \\lfloor n/2 \\rfloor\\). So leaves occupy indices \\(\\lfloor n/2\\rfloor\\) through \\(n-1\\).'
                }
            ]
        },
        // ============================================================
        // Section 2 : Building a Heap in O(n)
        // ============================================================
        {
            id: 'ch08-sec02',
            title: 'Building a Heap',
            content: `<h2>Building a Heap in \\(O(n)\\)</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>A natural question: can we build a heap from an unsorted array faster than \(n\) individual insertions? The bottom-up Build-Heap procedure achieves \(O(n)\) time, a result whose proof uses a beautiful summation argument.</p></div></div>

<p>A naive approach inserts elements one by one in \\(O(n \\log n)\\). But we can build a heap from an unordered array in \\(O(n)\\) using bottom-up heapify.</p>

<div class="env-block algorithm"><div class="env-title">Algorithm: BuildMaxHeap(A)</div><div class="env-body">
<p>1. \\(n \\leftarrow |A|\\)</p>
<p>2. For \\(i = \\lfloor n/2 \\rfloor - 1\\) down to 0:</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;MaxHeapify(A, i)</p>
</div></div>

<p>The key insight: leaves (indices \\(\\lfloor n/2 \\rfloor\\) to \\(n-1\\)) are already trivial heaps. We only need to fix internal nodes from bottom to top.</p>

<div class="env-block theorem"><div class="env-title">Theorem (Linear Build-Heap)</div><div class="env-body">
<p>BuildMaxHeap runs in \\(O(n)\\) time.</p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p>At height \\(h\\), there are at most \\(\\lceil n/2^{h+1} \\rceil\\) nodes, each requiring \\(O(h)\\) work for heapify. The total cost is:</p>
$$\\sum_{h=0}^{\\lfloor \\log n \\rfloor} \\left\\lceil \\frac{n}{2^{h+1}} \\right\\rceil \\cdot O(h) = O\\!\\left(n \\sum_{h=0}^{\\infty} \\frac{h}{2^h}\\right) = O(n)$$
<p>since \\(\\sum_{h=0}^{\\infty} h/2^h = 2\\).</p>
<p class="qed">∎</p>
</div></div>

<div class="viz-placeholder" data-viz="ch08-viz-build-heap"></div>

<div class="env-block example"><div class="env-title">Example</div><div class="env-body">
<p>Build max-heap from \\([4, 1, 3, 2, 16, 9, 10, 14, 8, 7]\\):</p>
<p>Process nodes from index 4 down to 0. After heapify at each step, the result is \\([16, 14, 10, 8, 7, 9, 3, 2, 4, 1]\\).</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch08-viz-build-heap',
                    title: 'Build Heap Step-by-Step',
                    description: 'Watch bottom-up heap construction on a random array.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 400});
                        let arr = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7];
                        let currentStep = -1;
                        let steps = [];
                        let highlightIdx = -1;

                        function computeSteps() {
                            var a = arr.slice();
                            steps = [{arr: a.slice(), idx: -1, label: 'Initial array'}];
                            var n = a.length;
                            for (var i = Math.floor(n / 2) - 1; i >= 0; i--) {
                                // sift down
                                var j = i;
                                while (true) {
                                    var l = 2 * j + 1, r = 2 * j + 2, largest = j;
                                    if (l < n && a[l] > a[largest]) largest = l;
                                    if (r < n && a[r] > a[largest]) largest = r;
                                    if (largest === j) break;
                                    var tmp = a[j]; a[j] = a[largest]; a[largest] = tmp;
                                    j = largest;
                                }
                                steps.push({arr: a.slice(), idx: i, label: 'Heapify at index ' + i + ' (value ' + a[i] + ')'});
                            }
                        }

                        function drawTree(a, hl) {
                            var n = a.length;
                            if (n === 0) return;
                            var positions = [];
                            for (var i = 0; i < n; i++) {
                                var level = Math.floor(Math.log2(i + 1));
                                var posInLevel = i - (Math.pow(2, level) - 1);
                                var nodesInLevel = Math.pow(2, level);
                                var spacing = 660 / (nodesInLevel + 1);
                                positions.push({x: 20 + spacing * (posInLevel + 1), y: 40 + level * 55});
                            }
                            for (var i = 1; i < n; i++) {
                                var p = Math.floor((i - 1) / 2);
                                viz.drawTreeEdge(positions[p].x, positions[p].y, positions[i].x, positions[i].y, viz.colors.axis);
                            }
                            for (var i = 0; i < n; i++) {
                                var color = (i === hl) ? viz.colors.orange : viz.colors.blue;
                                viz.drawTreeNode(positions[i].x, positions[i].y, 17, a[i], color, viz.colors.white);
                            }
                        }

                        function draw() {
                            viz.clear();
                            var step = steps[currentStep] || steps[0];
                            drawTree(step.arr, step.idx);
                            // Array
                            var cellW = Math.min(45, 620 / step.arr.length);
                            var startX = 350 - (step.arr.length * cellW) / 2;
                            for (var i = 0; i < step.arr.length; i++) {
                                var hl = (i === step.idx) ? viz.colors.orange : null;
                                viz.drawArrayCell(startX + i * cellW, 310, cellW, 28, step.arr[i], viz.colors.bg, viz.colors.white, hl);
                            }
                            viz.screenText('Step ' + (currentStep + 1) + '/' + steps.length + ': ' + step.label, 350, 370, viz.colors.yellow, 12, 'center', 'top');
                        }

                        computeSteps();
                        currentStep = 0;

                        VizEngine.createButton(controls, 'Prev', function() {
                            if (currentStep > 0) currentStep--;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Next', function() {
                            if (currentStep < steps.length - 1) currentStep++;
                            draw();
                        });
                        VizEngine.createButton(controls, 'New Random', function() {
                            var n = 8 + Math.floor(Math.random() * 5);
                            arr = [];
                            for (var i = 0; i < n; i++) arr.push(Math.floor(Math.random() * 90) + 1);
                            computeSteps();
                            currentStep = 0;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Auto Play', function() {
                            currentStep = 0;
                            draw();
                            var timer = setInterval(function() {
                                currentStep++;
                                if (currentStep >= steps.length) { clearInterval(timer); return; }
                                draw();
                            }, 800);
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show the result of BuildMaxHeap on \\([5, 3, 17, 10, 84, 19, 6, 22, 9]\\).',
                    hint: 'Start heapify at index \\(\\lfloor 9/2 \\rfloor - 1 = 3\\), processing indices 3, 2, 1, 0.',
                    solution: 'Index 3: compare 10 with children 22, 9 -> swap with 22: \\([5,3,17,22,84,19,6,10,9]\\). Index 2: compare 17 with 19, 6 -> swap with 19: \\([5,3,19,22,84,17,6,10,9]\\). Index 1: compare 3 with 22, 84 -> swap with 84: \\([5,84,19,22,3,17,6,10,9]\\) -> heapify 4: no change. Index 0: compare 5 with 84, 19 -> swap with 84: \\([84,5,19,22,3,17,6,10,9]\\) -> swap 5 with 22: \\([84,22,19,5,3,17,6,10,9]\\) -> swap 5 with 10: \\([84,22,19,10,3,17,6,5,9]\\).'
                },
                {
                    question: 'Prove that \\(\\sum_{h=0}^{\\infty} h/2^h = 2\\).',
                    hint: 'Use the identity \\(\\sum_{h=0}^{\\infty} h x^h = x/(1-x)^2\\) evaluated at \\(x = 1/2\\).',
                    solution: 'Let \\(S = \\sum_{h=0}^{\\infty} h x^h\\). Since \\(\\sum h x^h = x/(1-x)^2\\), setting \\(x=1/2\\) gives \\(S = (1/2)/(1/2)^2 = (1/2)/(1/4) = 2\\).'
                },
                {
                    question: 'Why does BuildMaxHeap process nodes from \\(\\lfloor n/2 \\rfloor - 1\\) down to 0 and not in the reverse order?',
                    hint: 'Heapify at node \\(i\\) assumes the subtrees rooted at children of \\(i\\) are already valid heaps.',
                    solution: 'MaxHeapify requires that both subtrees of the given node already satisfy the heap property. Processing bottom-up ensures that when we heapify node \\(i\\), nodes \\(i+1, i+2, \\ldots\\) have already been heapified, so their subtrees are valid heaps.'
                }
            ]
        },
        // ============================================================
        // Section 3 : Heapsort
        // ============================================================
        {
            id: 'ch08-sec03',
            title: 'Heapsort',
            content: `<h2>Heapsort</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>With Build-Heap and Extract-Max, we can sort in-place: build a max-heap, then repeatedly extract the maximum. This is Heapsort, an \(O(n \log n)\) in-place sorting algorithm that complements Merge Sort and Quicksort.</p></div></div>

<p>Heapsort combines BuildMaxHeap with repeated extract-max to sort in-place in \\(O(n \\log n)\\) worst-case time.</p>

<div class="env-block algorithm"><div class="env-title">Algorithm: Heapsort(A)</div><div class="env-body">
<p>1. BuildMaxHeap(A)</p>
<p>2. For \\(i = n-1\\) down to 1:</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;a. Swap \\(A[0] \\leftrightarrow A[i]\\)</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;b. Reduce heap size by 1</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;c. MaxHeapify(A, 0) on the reduced heap</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (Heapsort Complexity)</div><div class="env-body">
<p>Heapsort runs in \\(O(n \\log n)\\) time and uses \\(O(1)\\) auxiliary space (in-place).</p>
</div></div>

<p>Heapsort is not stable (equal elements may change relative order). It has excellent worst-case guarantees, unlike quicksort which degrades to \\(O(n^2)\\) in the worst case.</p>

<div class="viz-placeholder" data-viz="ch08-viz-heapsort"></div>

<div class="env-block example"><div class="env-title">Example</div><div class="env-body">
<p>Sorting \\([4, 1, 3, 2, 16, 9, 10, 14, 8, 7]\\):</p>
<p>After BuildMaxHeap: \\([16, 14, 10, 8, 7, 9, 3, 2, 4, 1]\\).</p>
<p>Each iteration swaps root with last unsorted element and heapifies. After all iterations: \\([1, 2, 3, 4, 7, 8, 9, 10, 14, 16]\\).</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch08-viz-heapsort',
                    title: 'Heapsort Step-by-Step',
                    description: 'Watch heapsort extract the max repeatedly.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 380});
                        let original = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7];
                        let steps = [];
                        let currentStep = 0;

                        function buildMaxHeap(a) {
                            var n = a.length;
                            for (var i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(a, n, i);
                        }
                        function siftDown(a, size, i) {
                            while (true) {
                                var l = 2*i+1, r = 2*i+2, largest = i;
                                if (l < size && a[l] > a[largest]) largest = l;
                                if (r < size && a[r] > a[largest]) largest = r;
                                if (largest === i) break;
                                var tmp = a[i]; a[i] = a[largest]; a[largest] = tmp;
                                i = largest;
                            }
                        }

                        function computeSteps() {
                            steps = [];
                            var a = original.slice();
                            steps.push({arr: a.slice(), heapSize: a.length, label: 'Initial array', swapIdx: -1});
                            buildMaxHeap(a);
                            steps.push({arr: a.slice(), heapSize: a.length, label: 'After BuildMaxHeap', swapIdx: -1});
                            for (var i = a.length - 1; i >= 1; i--) {
                                var tmp = a[0]; a[0] = a[i]; a[i] = tmp;
                                siftDown(a, i, 0);
                                steps.push({arr: a.slice(), heapSize: i, label: 'Swap root with index ' + i + ', heapify', swapIdx: i});
                            }
                        }

                        function draw() {
                            viz.clear();
                            var step = steps[currentStep];
                            var n = step.arr.length;
                            var cellW = Math.min(50, 650 / n);
                            var startX = 350 - (n * cellW) / 2;
                            // bar chart
                            var maxVal = Math.max.apply(null, step.arr);
                            for (var i = 0; i < n; i++) {
                                var h = (step.arr[i] / maxVal) * 200;
                                var color;
                                if (i >= step.heapSize) color = viz.colors.green;
                                else if (i === 0 && step.swapIdx >= 0) color = viz.colors.orange;
                                else color = viz.colors.blue;
                                viz.ctx.fillStyle = color;
                                viz.ctx.fillRect(startX + i * cellW + 2, 260 - h, cellW - 4, h);
                                viz.screenText(String(step.arr[i]), startX + i * cellW + cellW / 2, 268, viz.colors.white, 10, 'center', 'top');
                                viz.screenText(String(i), startX + i * cellW + cellW / 2, 282, viz.colors.text, 9, 'center', 'top');
                            }
                            // Divider for sorted portion
                            if (step.heapSize < n) {
                                var divX = startX + step.heapSize * cellW;
                                viz.ctx.strokeStyle = viz.colors.green;
                                viz.ctx.lineWidth = 2;
                                viz.ctx.setLineDash([4, 3]);
                                viz.ctx.beginPath(); viz.ctx.moveTo(divX, 40); viz.ctx.lineTo(divX, 290); viz.ctx.stroke();
                                viz.ctx.setLineDash([]);
                                viz.screenText('sorted', (divX + startX + n * cellW) / 2, 30, viz.colors.green, 11, 'center', 'top');
                                viz.screenText('heap', (startX + divX) / 2, 30, viz.colors.blue, 11, 'center', 'top');
                            }
                            viz.screenText('Step ' + (currentStep + 1) + '/' + steps.length + ': ' + step.label, 350, 340, viz.colors.yellow, 12, 'center', 'top');
                        }

                        computeSteps();

                        VizEngine.createButton(controls, 'Prev', function() {
                            if (currentStep > 0) currentStep--;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Next', function() {
                            if (currentStep < steps.length - 1) currentStep++;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Auto Play', function() {
                            currentStep = 0;
                            draw();
                            var timer = setInterval(function() {
                                currentStep++;
                                if (currentStep >= steps.length) { clearInterval(timer); return; }
                                draw();
                            }, 600);
                        });
                        VizEngine.createButton(controls, 'New Random', function() {
                            var n = 8 + Math.floor(Math.random() * 5);
                            original = [];
                            for (var i = 0; i < n; i++) original.push(Math.floor(Math.random() * 90) + 5);
                            computeSteps();
                            currentStep = 0;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Is heapsort a stable sorting algorithm? Explain why or why not.',
                    hint: 'Consider the array \\([2a, 2b, 1]\\) where \\(2a\\) and \\(2b\\) have equal keys. Which ends up first after heapsort?',
                    solution: 'Heapsort is not stable. When we swap the root with the last element, equal keys can be rearranged. For example, \\([2a, 2b, 1]\\): after build-heap, \\([2a, 2b, 1]\\); swap root (2a) with index 2: \\([1, 2b, 2a]\\); heapify: \\([2b, 1, 2a]\\); swap root with index 1: \\([1, 2b, 2a]\\). Final sorted: \\([1, 2b, 2a]\\) — the relative order of equal keys is reversed.'
                },
                {
                    question: 'What is the best-case running time of heapsort? Can it do better than \\(O(n \\log n)\\)?',
                    hint: 'Consider what happens when all elements are identical.',
                    solution: 'When all elements are identical, every heapify call returns immediately (no swaps needed). BuildMaxHeap is \\(O(n)\\) and each of the \\(n-1\\) extract-max operations does \\(O(1)\\) heapify. So the best case is \\(O(n)\\). However, for distinct elements, heapsort is always \\(\\Theta(n \\log n)\\).'
                },
                {
                    question: 'Compare heapsort with quicksort and mergesort on: (a) worst-case time, (b) space, (c) stability, (d) cache behavior.',
                    hint: 'Think about in-place vs. extra space, worst-case guarantees, and memory access patterns.',
                    solution: '(a) Worst-case: heapsort \\(O(n\\log n)\\), quicksort \\(O(n^2)\\), mergesort \\(O(n\\log n)\\). (b) Space: heapsort \\(O(1)\\) in-place, quicksort \\(O(\\log n)\\) stack, mergesort \\(O(n)\\). (c) Stability: heapsort not stable, quicksort not stable (Lomuto can be made stable), mergesort stable. (d) Cache: heapsort has poor locality (jumps between levels), quicksort has excellent locality (sequential scan), mergesort has good locality.'
                }
            ]
        },
        // ============================================================
        // Section 4 : d-ary Heaps
        // ============================================================
        {
            id: 'ch08-sec04',
            title: 'd-ary Heaps',
            content: `<h2>d-ary Heaps</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>What if each node has more than two children? A \(d\)-ary heap trades deeper trees for fewer levels, optimizing the tradeoff between Insert (\(O(\log_d n)\)) and Extract-Max (\(O(d \log_d n)\)). The optimal choice of \(d\) depends on the operation mix.</p></div></div>

<p>A <strong>d-ary heap</strong> generalizes binary heaps: each node has at most \\(d\\) children instead of 2.</p>

<div class="env-block definition"><div class="env-title">Definition (d-ary Heap)</div><div class="env-body">
<p>A d-ary max-heap stores elements in an array where the children of node \\(i\\) are at indices \\(di+1, di+2, \\ldots, di+d\\), and \\(A[\\text{parent}(i)] \\ge A[i]\\) for all non-root \\(i\\), with \\(\\text{parent}(i) = \\lfloor (i-1)/d \\rfloor\\).</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (d-ary Heap Complexity)</div><div class="env-body">
<p>For a d-ary heap with \\(n\\) elements:</p>
<ul>
<li>Height: \\(\\Theta(\\log_d n)\\)</li>
<li><strong>Extract-max</strong>: \\(O(d \\log_d n)\\) — sift-down compares with all \\(d\\) children at each level</li>
<li><strong>Insert / Increase-key</strong>: \\(O(\\log_d n)\\) — sift-up compares only with parent</li>
</ul>
</div></div>

<p>When \\(d\\) is large, insert becomes faster but extract-max becomes slower. The optimal \\(d\\) depends on the ratio of insert to extract operations. For Dijkstra's algorithm with \\(m\\) decrease-key and \\(n\\) extract-min operations, choosing \\(d = m/n\\) gives total time \\(O(m \\log_{m/n} n)\\).</p>

<div class="viz-placeholder" data-viz="ch08-viz-dary-heap"></div>

<div class="env-block example"><div class="env-title">Example</div><div class="env-body">
<p>A 3-ary heap \\([100, 80, 70, 90, 40, 50, 60, 30, 20, 10]\\): node 0 has children at 1, 2, 3; node 1 has children at 4, 5, 6; node 2 has children at 7, 8, 9.</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch08-viz-dary-heap',
                    title: 'd-ary Heap Visualization',
                    description: 'Compare heap shapes for different values of d.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 420});
                        let d = 2;
                        let heap = [];
                        let message = '';

                        function parentOf(i) { return Math.floor((i - 1) / d); }
                        function childStart(i) { return d * i + 1; }

                        function siftUp(i) {
                            while (i > 0 && heap[parentOf(i)] < heap[i]) {
                                var p = parentOf(i);
                                var tmp = heap[p]; heap[p] = heap[i]; heap[i] = tmp;
                                i = p;
                            }
                        }
                        function siftDown(i) {
                            var n = heap.length;
                            while (true) {
                                var start = childStart(i);
                                var largest = i;
                                for (var k = 0; k < d && start + k < n; k++) {
                                    if (heap[start + k] > heap[largest]) largest = start + k;
                                }
                                if (largest === i) break;
                                var tmp = heap[i]; heap[i] = heap[largest]; heap[largest] = tmp;
                                i = largest;
                            }
                        }

                        function initHeap() {
                            heap = [];
                            var vals = [90, 50, 70, 30, 20, 60, 40, 10, 80, 55, 25, 45, 15];
                            for (var i = 0; i < vals.length; i++) {
                                heap.push(vals[i]);
                                siftUp(heap.length - 1);
                            }
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText(d + '-ary Max-Heap (d = ' + d + ')', 350, 12, viz.colors.white, 15, 'center', 'top');

                            var n = heap.length;
                            if (n === 0) { viz.screenText('Empty heap', 350, 200, viz.colors.text, 14); return; }

                            // Compute tree layout using BFS levels
                            var levels = [];
                            var queue = [0];
                            while (queue.length > 0) {
                                var nextQueue = [];
                                var levelNodes = [];
                                for (var q = 0; q < queue.length; q++) {
                                    var idx = queue[q];
                                    levelNodes.push(idx);
                                    var start = childStart(idx);
                                    for (var k = 0; k < d; k++) {
                                        if (start + k < n) nextQueue.push(start + k);
                                    }
                                }
                                levels.push(levelNodes);
                                queue = nextQueue;
                            }

                            var positions = [];
                            for (var i = 0; i < n; i++) positions.push({x: 0, y: 0});
                            var treeTop = 45;
                            var levelH = Math.min(60, 300 / Math.max(levels.length, 1));
                            for (var lv = 0; lv < levels.length; lv++) {
                                var nodes = levels[lv];
                                var spacing = 680 / (nodes.length + 1);
                                for (var j = 0; j < nodes.length; j++) {
                                    positions[nodes[j]] = {x: 10 + spacing * (j + 1), y: treeTop + lv * levelH};
                                }
                            }

                            // Edges
                            for (var i = 1; i < n; i++) {
                                var p = parentOf(i);
                                viz.drawTreeEdge(positions[p].x, positions[p].y, positions[i].x, positions[i].y, viz.colors.axis);
                            }
                            // Nodes
                            var r = Math.max(12, 20 - levels.length);
                            for (var i = 0; i < n; i++) {
                                viz.drawTreeNode(positions[i].x, positions[i].y, r, heap[i], viz.colors.blue, viz.colors.white);
                            }

                            // Array
                            var cellW = Math.min(40, 650 / n);
                            var startX = 350 - (n * cellW) / 2;
                            var arrY = 350;
                            viz.screenText('Array:', 30, arrY + 5, viz.colors.text, 11, 'left', 'top');
                            for (var i = 0; i < n; i++) {
                                viz.drawArrayCell(startX + i * cellW, arrY, cellW, 26, heap[i], viz.colors.bg, viz.colors.white);
                                viz.screenText(String(i), startX + i * cellW + cellW / 2, arrY + 30, viz.colors.text, 9, 'center', 'top');
                            }

                            viz.screenText('Height = ' + (levels.length - 1) + ', each sift-down checks up to ' + d + ' children', 350, arrY + 50, viz.colors.yellow, 11, 'center', 'top');
                        }

                        initHeap();

                        VizEngine.createSelect(controls, 'd = ', [
                            {value: '2', label: '2 (binary)'},
                            {value: '3', label: '3 (ternary)'},
                            {value: '4', label: '4'},
                            {value: '5', label: '5'}
                        ], function(val) {
                            d = parseInt(val);
                            initHeap();
                            draw();
                        });

                        var inputEl = document.createElement('input');
                        inputEl.type = 'number';
                        inputEl.value = '75';
                        inputEl.style.cssText = 'width:55px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:6px;';
                        controls.appendChild(inputEl);

                        VizEngine.createButton(controls, 'Insert', function() {
                            var val = parseInt(inputEl.value);
                            if (isNaN(val)) return;
                            heap.push(val);
                            siftUp(heap.length - 1);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Extract-Max', function() {
                            if (heap.length === 0) return;
                            heap[0] = heap[heap.length - 1];
                            heap.pop();
                            if (heap.length > 0) siftDown(0);
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'For a d-ary heap with \\(n\\) elements, express the height in terms of \\(n\\) and \\(d\\).',
                    hint: 'A complete d-ary tree of height \\(h\\) has \\((d^{h+1}-1)/(d-1)\\) nodes.',
                    solution: 'Height \\(h = \\lfloor \\log_d((d-1)n + 1) \\rfloor - 1 = \\Theta(\\log_d n) = \\Theta(\\log n / \\log d)\\).'
                },
                {
                    question: 'For Dijkstra\'s algorithm on a graph with \\(n\\) vertices and \\(m\\) edges, what value of \\(d\\) minimizes the running time using a d-ary heap?',
                    hint: 'Dijkstra does \\(n\\) extract-min (each \\(O(d\\log_d n)\\)) and \\(m\\) decrease-key (each \\(O(\\log_d n)\\)).',
                    solution: 'Total time: \\(O(nd\\log_d n + m\\log_d n)\\). Setting \\(d = \\max(2, m/n)\\) gives \\(O(m\\log_{m/n} n)\\). When \\(m = \\Theta(n^{1+\\epsilon})\\), this becomes \\(O(m/\\epsilon)\\), nearly linear.'
                },
                {
                    question: 'Implement Increase-Key for a d-ary max-heap and analyze its complexity.',
                    hint: 'Similar to insert: update the key and sift up.',
                    solution: 'IncreaseKey(A, i, newKey): set \\(A[i] = \\text{newKey}\\), then sift up from \\(i\\): while \\(i > 0\\) and \\(A[\\text{parent}(i)] < A[i]\\), swap and move to parent. This traverses at most the height of the tree, so \\(O(\\log_d n)\\).'
                }
            ]
        },
        // ============================================================
        // Section 5 : Fibonacci Heaps
        // ============================================================
        {
            id: 'ch08-sec05',
            title: 'Fibonacci Heaps Overview',
            content: `<h2>Fibonacci Heaps</h2>
<div class="env-block bridge"><div class="env-title">Section Roadmap</div><div class="env-body"><p>Fibonacci heaps support Decrease-Key in \(O(1)\) amortized time, which is critical for achieving optimal bounds in Dijkstra's and Prim's algorithms. This section provides an overview of their lazy structure and the amortized analysis (from Chapter 3) that makes them work.</p></div></div>

<p>A <strong>Fibonacci heap</strong> is a collection of heap-ordered trees that achieves excellent amortized bounds, making it ideal for algorithms like Dijkstra and Prim.</p>

<div class="env-block definition"><div class="env-title">Definition (Fibonacci Heap)</div><div class="env-body">
<p>A Fibonacci heap is a collection of min-heap-ordered trees. It maintains:</p>
<ul>
<li>A pointer to the minimum node</li>
<li>A doubly-linked circular root list of tree roots</li>
<li>Each node stores: key, degree, mark (whether it has lost a child since becoming a non-root), parent and child pointers</li>
</ul>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (Fibonacci Heap Amortized Bounds)</div><div class="env-body">
<p>A Fibonacci heap supports the following amortized time bounds:</p>
<table style="margin:8px 0;border-collapse:collapse;">
<tr><td style="padding:2px 12px;border:1px solid #30363d;">Insert</td><td style="padding:2px 12px;border:1px solid #30363d;">\\(O(1)\\)</td></tr>
<tr><td style="padding:2px 12px;border:1px solid #30363d;">Find-Min</td><td style="padding:2px 12px;border:1px solid #30363d;">\\(O(1)\\)</td></tr>
<tr><td style="padding:2px 12px;border:1px solid #30363d;">Decrease-Key</td><td style="padding:2px 12px;border:1px solid #30363d;">\\(O(1)\\)</td></tr>
<tr><td style="padding:2px 12px;border:1px solid #30363d;">Merge (Union)</td><td style="padding:2px 12px;border:1px solid #30363d;">\\(O(1)\\)</td></tr>
<tr><td style="padding:2px 12px;border:1px solid #30363d;">Extract-Min</td><td style="padding:2px 12px;border:1px solid #30363d;">\\(O(\\log n)\\)</td></tr>
<tr><td style="padding:2px 12px;border:1px solid #30363d;">Delete</td><td style="padding:2px 12px;border:1px solid #30363d;">\\(O(\\log n)\\)</td></tr>
</table>
</div></div>

<h3>Key Operations</h3>
<p><strong>Insert</strong>: Create a new single-node tree and add to root list. Update min if needed. \\(O(1)\\).</p>
<p><strong>Extract-Min</strong>: Remove min node, add its children to root list, then <em>consolidate</em> — merge trees of equal degree until all roots have distinct degrees. This is the expensive operation: \\(O(\\log n)\\) amortized.</p>
<p><strong>Decrease-Key</strong>: Cut the node from its parent, add to root list. If parent is marked, perform <em>cascading cut</em>. \\(O(1)\\) amortized.</p>

<div class="env-block proof"><div class="env-title">Proof Sketch (Amortized Analysis)</div><div class="env-body">
<p>Use potential function \\(\\Phi = t + 2m\\) where \\(t\\) = number of trees in root list, \\(m\\) = number of marked nodes.</p>
<p>Insert: actual \\(O(1)\\), \\(\\Delta\\Phi = +1\\), amortized \\(O(1)\\).</p>
<p>Extract-Min: actual \\(O(t + \\log n)\\) for consolidation, \\(\\Delta\\Phi = O(\\log n) - t\\), amortized \\(O(\\log n)\\).</p>
<p>Decrease-Key with \\(c\\) cascading cuts: actual \\(O(c)\\), \\(\\Delta\\Phi = -(c-1)\\), amortized \\(O(1)\\).</p>
<p class="qed">∎</p>
</div></div>

<h3>Why "Fibonacci"?</h3>
<p>The maximum degree of any node in an \\(n\\)-node Fibonacci heap is \\(O(\\log n)\\). This is because a node of degree \\(k\\) has at least \\(F_{k+2} \\ge \\phi^k\\) descendants, where \\(F_k\\) is the \\(k\\)-th Fibonacci number and \\(\\phi = (1+\\sqrt{5})/2\\) is the golden ratio.</p>

<div class="viz-placeholder" data-viz="ch08-viz-fib-heap"></div>

<h3>Applications</h3>
<ul>
<li><strong>Dijkstra's algorithm</strong>: With Fibonacci heap, \\(O(V \\log V + E)\\) vs. \\(O((V+E) \\log V)\\) with binary heap.</li>
<li><strong>Prim's algorithm</strong>: Same improvement for MST computation.</li>
</ul>

<div class="env-block theorem"><div class="env-title">Theorem (Priority Queue Comparison)</div><div class="env-body">
<table style="margin:8px 0;border-collapse:collapse;font-size:0.9em;">
<tr style="border-bottom:2px solid #30363d;"><th style="padding:4px 10px;">Operation</th><th style="padding:4px 10px;">Binary Heap</th><th style="padding:4px 10px;">d-ary Heap</th><th style="padding:4px 10px;">Fibonacci Heap</th></tr>
<tr><td style="padding:4px 10px;">Insert</td><td style="padding:4px 10px;">\\(O(\\log n)\\)</td><td style="padding:4px 10px;">\\(O(\\log_d n)\\)</td><td style="padding:4px 10px;">\\(O(1)^*\\)</td></tr>
<tr><td style="padding:4px 10px;">Extract-Min</td><td style="padding:4px 10px;">\\(O(\\log n)\\)</td><td style="padding:4px 10px;">\\(O(d\\log_d n)\\)</td><td style="padding:4px 10px;">\\(O(\\log n)^*\\)</td></tr>
<tr><td style="padding:4px 10px;">Decrease-Key</td><td style="padding:4px 10px;">\\(O(\\log n)\\)</td><td style="padding:4px 10px;">\\(O(\\log_d n)\\)</td><td style="padding:4px 10px;">\\(O(1)^*\\)</td></tr>
<tr><td style="padding:4px 10px;">Merge</td><td style="padding:4px 10px;">\\(O(n)\\)</td><td style="padding:4px 10px;">\\(O(n)\\)</td><td style="padding:4px 10px;">\\(O(1)^*\\)</td></tr>
</table>
<p>(\\(^*\\) = amortized)</p>
</div></div>
<div class="env-block bridge"><div class="env-title">Looking Ahead</div><div class="env-body"><p>Heaps give us efficient access to the maximum or minimum, but what about searching for arbitrary keys? Chapter 9 introduces binary search trees and their balanced variants (Red-Black and AVL trees), which support search, insert, delete, and order queries all in \(O(\log n)\) time.</p></div></div>`,
            visualizations: [
                {
                    id: 'ch08-viz-fib-heap',
                    title: 'Fibonacci Heap Structure',
                    description: 'Visualize the forest of trees in a Fibonacci heap with insert and extract-min.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 400});
                        // Simplified Fibonacci heap visualization
                        let roots = []; // each root: {key, children: [], marked: false}
                        let minIdx = -1;
                        let opLog = [];

                        function makeNode(key) { return {key: key, children: [], marked: false}; }

                        function findMin() {
                            minIdx = -1;
                            var minVal = Infinity;
                            for (var i = 0; i < roots.length; i++) {
                                if (roots[i].key < minVal) { minVal = roots[i].key; minIdx = i; }
                            }
                        }

                        function insert(key) {
                            roots.push(makeNode(key));
                            findMin();
                            opLog.push('Insert ' + key);
                        }

                        function link(y, x) {
                            // Make y a child of x
                            x.children.push(y);
                            y.marked = false;
                        }

                        function consolidate() {
                            var maxDeg = Math.ceil(Math.log2(countNodes() + 1)) + 2;
                            var A = new Array(maxDeg + 1).fill(null);
                            var rootList = roots.slice();
                            for (var i = 0; i < rootList.length; i++) {
                                var x = rootList[i];
                                var deg = x.children.length;
                                while (deg < A.length && A[deg] !== null) {
                                    var y = A[deg];
                                    if (x.key > y.key) { var tmp = x; x = y; y = tmp; }
                                    link(y, x);
                                    A[deg] = null;
                                    deg++;
                                }
                                if (deg < A.length) A[deg] = x;
                            }
                            roots = [];
                            for (var i = 0; i < A.length; i++) {
                                if (A[i] !== null) roots.push(A[i]);
                            }
                            findMin();
                        }

                        function extractMin() {
                            if (roots.length === 0) return -1;
                            findMin();
                            if (minIdx < 0) return -1;
                            var minNode = roots[minIdx];
                            // Add children to root list
                            for (var i = 0; i < minNode.children.length; i++) {
                                roots.push(minNode.children[i]);
                            }
                            roots.splice(minIdx, 1);
                            if (roots.length > 0) consolidate();
                            else minIdx = -1;
                            opLog.push('ExtractMin = ' + minNode.key);
                            return minNode.key;
                        }

                        function countNodes() {
                            var count = 0;
                            function cnt(node) { count++; for (var i = 0; i < node.children.length; i++) cnt(node.children[i]); }
                            for (var i = 0; i < roots.length; i++) cnt(roots[i]);
                            return count;
                        }

                        function drawSubtree(node, px, py, spread, r) {
                            var isMin = (roots[minIdx] === node);
                            var color = isMin ? viz.colors.orange : (node.marked ? viz.colors.red : viz.colors.teal);
                            viz.drawTreeNode(px, py, r, node.key, color, viz.colors.white);
                            var nc = node.children.length;
                            if (nc === 0) return;
                            var childSpread = spread / Math.max(nc, 1);
                            var startX = px - spread / 2 + childSpread / 2;
                            for (var i = 0; i < nc; i++) {
                                var cx = startX + i * childSpread;
                                var cy = py + 55;
                                viz.drawTreeEdge(px, py, cx, cy, viz.colors.axis);
                                drawSubtree(node.children[i], cx, cy, childSpread * 0.8, r * 0.9);
                            }
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Fibonacci Heap (root list linked by dashed line)', 350, 10, viz.colors.white, 14, 'center', 'top');
                            findMin();

                            if (roots.length === 0) {
                                viz.screenText('Empty', 350, 200, viz.colors.text, 14);
                            } else {
                                var totalWidth = 660;
                                var treeWidth = totalWidth / roots.length;
                                var r = Math.max(12, 18 - roots.length);
                                for (var i = 0; i < roots.length; i++) {
                                    var cx = 20 + treeWidth * (i + 0.5);
                                    drawSubtree(roots[i], cx, 60, treeWidth * 0.8, r);
                                }
                                // Dashed line connecting roots
                                viz.ctx.strokeStyle = viz.colors.text;
                                viz.ctx.lineWidth = 1;
                                viz.ctx.setLineDash([4, 3]);
                                for (var i = 0; i < roots.length - 1; i++) {
                                    var x1 = 20 + treeWidth * (i + 0.5) + r + 2;
                                    var x2 = 20 + treeWidth * (i + 1 + 0.5) - r - 2;
                                    viz.ctx.beginPath(); viz.ctx.moveTo(x1, 60); viz.ctx.lineTo(x2, 60); viz.ctx.stroke();
                                }
                                viz.ctx.setLineDash([]);
                            }

                            // Show last few operations
                            var startLog = Math.max(0, opLog.length - 3);
                            for (var i = startLog; i < opLog.length; i++) {
                                viz.screenText(opLog[i], 350, 340 + (i - startLog) * 16, viz.colors.yellow, 11, 'center', 'top');
                            }
                            viz.screenText('Total nodes: ' + countNodes() + ', Trees: ' + roots.length, 350, 390, viz.colors.text, 11, 'center', 'top');
                        }

                        // Initialize with some values
                        [10, 20, 5, 30, 15, 25].forEach(function(v) { insert(v); });

                        var inputEl = document.createElement('input');
                        inputEl.type = 'number';
                        inputEl.value = '8';
                        inputEl.style.cssText = 'width:55px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:6px;';
                        controls.appendChild(inputEl);

                        VizEngine.createButton(controls, 'Insert', function() {
                            var val = parseInt(inputEl.value);
                            if (isNaN(val)) return;
                            insert(val);
                            draw();
                        });
                        VizEngine.createButton(controls, 'Extract-Min', function() {
                            extractMin();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            roots = [];
                            opLog = [];
                            [10, 20, 5, 30, 15, 25].forEach(function(v) { insert(v); });
                            opLog = [];
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Why does the consolidation step in Extract-Min achieve \\(O(\\log n)\\) amortized time despite potentially processing many trees?',
                    hint: 'Consider the potential function \\(\\Phi = t + 2m\\) and how the number of trees changes during consolidation.',
                    solution: 'Before consolidation there are \\(t\\) trees. After consolidation, each root has a distinct degree, so at most \\(O(\\log n)\\) trees remain (since max degree is \\(O(\\log n)\\)). The actual cost is \\(O(t + \\log n)\\), but the potential drops by \\(t - O(\\log n)\\), so the amortized cost is \\(O(t + \\log n) + O(\\log n) - t = O(\\log n)\\).'
                },
                {
                    question: 'Explain the cascading cut mechanism and why marking is needed.',
                    hint: 'Without marking, a node could lose many children without being cut, ruining the degree bound.',
                    solution: 'When we decrease a key and cut a node from its parent, we mark the parent. If a marked parent loses another child, we cut it too and continue cascading. This ensures no non-root node loses more than one child before being cut. This guarantees that a node of degree \\(k\\) has at least \\(F_{k+2}\\) descendants, bounding the max degree to \\(O(\\log n)\\).'
                },
                {
                    question: 'Show that a node of degree \\(k\\) in a Fibonacci heap has at least \\(F_{k+2}\\) descendants (including itself).',
                    hint: 'Let \\(s_k\\) be the minimum size of a subtree rooted at a degree-\\(k\\) node. The \\(i\\)-th child had degree at least \\(i-2\\) when linked.',
                    solution: 'Let the children be in order of when they were linked. The \\(i\\)-th child (\\(i \\ge 2\\)) had degree \\(\\ge i-2\\) when linked and has lost at most one child since, so current degree \\(\\ge i-2\\). So \\(s_k \\ge 2 + \\sum_{i=2}^{k} s_{i-2}\\). By induction, \\(s_k \\ge F_{k+2}\\) where \\(F_0=0, F_1=1, F_2=1, \\ldots\\). Since \\(F_{k+2} \\ge \\phi^k\\), a degree-\\(k\\) node has \\(\\ge \\phi^k\\) descendants, so max degree is \\(O(\\log_\\phi n) = O(\\log n)\\).'
                },
                {
                    question: 'In Dijkstra\'s algorithm with a Fibonacci heap, why is the total time \\(O(V \\log V + E)\\) instead of \\(O((V+E)\\log V)\\)?',
                    hint: 'Count how many times each operation is called: \\(V\\) inserts, \\(V\\) extract-mins, and at most \\(E\\) decrease-keys.',
                    solution: 'Dijkstra performs \\(V\\) inserts (\\(O(1)\\) each), \\(V\\) extract-mins (\\(O(\\log V)\\) amortized each), and up to \\(E\\) decrease-keys (\\(O(1)\\) amortized each). Total: \\(O(V) + O(V \\log V) + O(E) = O(V \\log V + E)\\). With binary heap, decrease-key costs \\(O(\\log V)\\), giving \\(O((V + E) \\log V)\\).'
                },
                {
                    question: 'What practical disadvantages do Fibonacci heaps have compared to binary heaps?',
                    hint: 'Consider constant factors, pointer overhead, and cache behavior.',
                    solution: 'Fibonacci heaps have: (1) Large constant factors — many pointer manipulations per operation. (2) High memory overhead — each node stores parent, child, sibling pointers, degree, and mark bit. (3) Poor cache locality — nodes scattered in memory, unlike array-based binary heaps. (4) Complex implementation prone to bugs. In practice, d-ary heaps or pairing heaps often outperform Fibonacci heaps for typical graph sizes.'
                }
            ]
        }
    ]
});
