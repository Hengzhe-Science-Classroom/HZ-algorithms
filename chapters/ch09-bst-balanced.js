// ============================================================
// Ch 9 · BST & Balanced Trees
// ============================================================
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch09',
    number: 9,
    title: 'BST & Balanced Trees',
    subtitle: 'Binary Search Trees & Balanced Trees',
    sections: [
        // ============================================================
        // Section 1 : BST Operations
        // ============================================================
        {
            id: 'ch09-sec01',
            title: 'BST Operations',
            content: `<h2>Binary Search Tree Operations</h2>
<p>A <strong>binary search tree (BST)</strong> is a rooted binary tree where each node \\(x\\) satisfies: all keys in the left subtree \\(\\le x.\\text{key}\\), and all keys in the right subtree \\(\\ge x.\\text{key}\\).</p>

<div class="env-block definition"><div class="env-title">Definition (Binary Search Tree)</div><div class="env-body">
<p>A BST is a binary tree \\(T\\) such that for every node \\(x\\):</p>
<ul>
<li>If \\(y\\) is in the left subtree of \\(x\\), then \\(y.\\text{key} \\le x.\\text{key}\\)</li>
<li>If \\(y\\) is in the right subtree of \\(x\\), then \\(y.\\text{key} \\ge x.\\text{key}\\)</li>
</ul>
</div></div>

<h3>Search</h3>
<p>To search for key \\(k\\): start at root, go left if \\(k < x.\\text{key}\\), right if \\(k > x.\\text{key}\\), done if equal or null. Time: \\(O(h)\\) where \\(h\\) is the tree height.</p>

<h3>Insert</h3>
<p>Follow the search path until reaching a null pointer, then place the new node there. Time: \\(O(h)\\).</p>

<h3>Delete</h3>
<p>Three cases for deleting node \\(z\\):</p>
<ol>
<li><strong>No children</strong>: Simply remove \\(z\\).</li>
<li><strong>One child</strong>: Replace \\(z\\) with its child.</li>
<li><strong>Two children</strong>: Find the successor (smallest key in right subtree), copy its key to \\(z\\), and delete the successor node (which has at most one child).</li>
</ol>

<div class="viz-placeholder" data-viz="ch09-viz-bst-editor"></div>

<div class="env-block theorem"><div class="env-title">Theorem (BST Operation Time)</div><div class="env-body">
<p>Search, Insert, Delete, Minimum, Maximum, Successor, and Predecessor all run in \\(O(h)\\) time, where \\(h\\) is the height of the tree.</p>
</div></div>

<div class="env-block example"><div class="env-title">Example</div><div class="env-body">
<p>For a BST with keys \\(\\{2, 5, 7, 10, 12, 15, 20\\}\\) inserted in a balanced way, \\(h = \\Theta(\\log n)\\). But inserting in sorted order gives a chain with \\(h = n - 1\\).</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch09-viz-bst-editor',
                    title: 'Interactive BST Editor',
                    description: 'Click to insert and delete nodes in a BST. Watch the tree restructure.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 420});
                        // BST node: {key, left, right}
                        let root = null;

                        function makeNode(key) { return {key: key, left: null, right: null}; }

                        function insert(node, key) {
                            if (!node) return makeNode(key);
                            if (key < node.key) node.left = insert(node.left, key);
                            else if (key > node.key) node.right = insert(node.right, key);
                            return node;
                        }

                        function findMin(node) {
                            while (node.left) node = node.left;
                            return node;
                        }

                        function deleteNode(node, key) {
                            if (!node) return null;
                            if (key < node.key) node.left = deleteNode(node.left, key);
                            else if (key > node.key) node.right = deleteNode(node.right, key);
                            else {
                                if (!node.left) return node.right;
                                if (!node.right) return node.left;
                                var succ = findMin(node.right);
                                node.key = succ.key;
                                node.right = deleteNode(node.right, succ.key);
                            }
                            return node;
                        }

                        function getHeight(node) {
                            if (!node) return -1;
                            return 1 + Math.max(getHeight(node.left), getHeight(node.right));
                        }

                        function countNodes(node) {
                            if (!node) return 0;
                            return 1 + countNodes(node.left) + countNodes(node.right);
                        }

                        function inorder(node, result) {
                            if (!node) return;
                            inorder(node.left, result);
                            result.push(node.key);
                            inorder(node.right, result);
                        }

                        // Layout: assign x,y positions using inorder index
                        function layoutTree(node) {
                            var positions = {};
                            var inorderKeys = [];
                            inorder(node, inorderKeys);
                            var h = getHeight(node);
                            var levelH = Math.min(60, 330 / Math.max(h + 1, 1));

                            function assignPos(n, depth) {
                                if (!n) return;
                                assignPos(n.left, depth + 1);
                                var idx = inorderKeys.indexOf(n.key);
                                var spacing = 660 / (inorderKeys.length + 1);
                                positions[n.key] = {x: 20 + spacing * (idx + 1), y: 50 + depth * levelH};
                                assignPos(n.right, depth + 1);
                            }
                            assignPos(node, 0);
                            return positions;
                        }

                        function drawTree(node, positions) {
                            if (!node) return;
                            if (node.left) {
                                viz.drawTreeEdge(positions[node.key].x, positions[node.key].y, positions[node.left.key].x, positions[node.left.key].y, viz.colors.axis);
                                drawTree(node.left, positions);
                            }
                            if (node.right) {
                                viz.drawTreeEdge(positions[node.key].x, positions[node.key].y, positions[node.right.key].x, positions[node.right.key].y, viz.colors.axis);
                                drawTree(node.right, positions);
                            }
                            var color = (node === root) ? viz.colors.orange : viz.colors.blue;
                            viz.drawTreeNode(positions[node.key].x, positions[node.key].y, 18, node.key, color, viz.colors.white);
                        }

                        let message = '';

                        function draw() {
                            viz.clear();
                            viz.screenText('Binary Search Tree', 350, 10, viz.colors.white, 15, 'center', 'top');
                            if (!root) {
                                viz.screenText('Tree is empty. Insert some keys!', 350, 200, viz.colors.text, 14);
                            } else {
                                var positions = layoutTree(root);
                                drawTree(root, positions);
                                var h = getHeight(root);
                                var n = countNodes(root);
                                var inorderResult = [];
                                inorder(root, inorderResult);
                                viz.screenText('n = ' + n + ', height = ' + h + ', Inorder: [' + inorderResult.join(', ') + ']', 350, 395, viz.colors.text, 11, 'center', 'top');
                            }
                            if (message) viz.screenText(message, 350, 412, viz.colors.yellow, 11, 'center', 'top');
                        }

                        // Initialize
                        [15, 6, 18, 3, 7, 17, 20, 2, 4, 13].forEach(function(v) { root = insert(root, v); });

                        var inputEl = document.createElement('input');
                        inputEl.type = 'number';
                        inputEl.value = '10';
                        inputEl.style.cssText = 'width:55px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:6px;';
                        controls.appendChild(inputEl);

                        VizEngine.createButton(controls, 'Insert', function() {
                            var val = parseInt(inputEl.value);
                            if (isNaN(val)) return;
                            root = insert(root, val);
                            message = 'Inserted ' + val;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Delete', function() {
                            var val = parseInt(inputEl.value);
                            if (isNaN(val)) return;
                            root = deleteNode(root, val);
                            message = 'Deleted ' + val;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Search', function() {
                            var val = parseInt(inputEl.value);
                            if (isNaN(val)) { message = 'Enter a number'; draw(); return; }
                            var node = root;
                            var path = [];
                            while (node) {
                                path.push(node.key);
                                if (val === node.key) { message = 'Found ' + val + '! Path: ' + path.join(' -> '); draw(); return; }
                                if (val < node.key) node = node.left;
                                else node = node.right;
                            }
                            message = val + ' not found. Path: ' + path.join(' -> ') + ' -> null';
                            draw();
                        });

                        VizEngine.createButton(controls, 'Clear', function() {
                            root = null;
                            message = 'Tree cleared';
                            draw();
                        });

                        VizEngine.createButton(controls, 'Random BST', function() {
                            root = null;
                            var n = 8 + Math.floor(Math.random() * 6);
                            var used = {};
                            for (var i = 0; i < n; i++) {
                                var v;
                                do { v = Math.floor(Math.random() * 95) + 1; } while (used[v]);
                                used[v] = true;
                                root = insert(root, v);
                            }
                            message = 'Random BST with ' + n + ' nodes';
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Draw the BST resulting from inserting \\(15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9\\) in order. What is its height?',
                    hint: 'Trace the insert path for each key.',
                    solution: 'Root is 15. Left subtree of 15: 6 with children 3 and 7. 3 has children 2 and 4. 7 has right child 13 with left child 9. Right subtree of 15: 18 with children 17 and 20. Height = 4.'
                },
                {
                    question: 'Show that the expected height of a randomly-built BST on \\(n\\) distinct keys is \\(O(\\log n)\\).',
                    hint: 'A randomly-built BST inserts keys in uniformly random order. Use the analogy with quicksort.',
                    solution: 'A randomly-built BST corresponds to quicksort: the root is the pivot, left and right subtrees correspond to elements less than and greater than the pivot. The expected depth of any node is \\(O(\\log n)\\) by the same recurrence as quicksort comparisons. More precisely, the expected height is \\(\\Theta(\\log n)\\) (Jensen proved the expected height is approximately \\(4.311 \\ln n\\)).'
                },
                {
                    question: 'Describe an algorithm to find the \\(k\\)-th smallest element in a BST without augmentation, and analyze its running time.',
                    hint: 'Do an inorder traversal and count.',
                    solution: 'Perform inorder traversal, maintaining a counter. When the counter reaches \\(k\\), return the current node. Time: \\(O(k + h)\\) where \\(h\\) is the height, since we may need to traverse up to \\(k\\) nodes. Without augmentation, we cannot do better than \\(O(k)\\) in the worst case.'
                }
            ]
        },
        // ============================================================
        // Section 2 : Traversals & Successor/Predecessor
        // ============================================================
        {
            id: 'ch09-sec02',
            title: 'Traversals & Successor/Predecessor',
            content: `<h2>Traversals & Successor/Predecessor</h2>

<h3>Tree Traversals</h3>
<p>Three standard traversals of a BST, each running in \\(\\Theta(n)\\) time:</p>
<ul>
<li><strong>Inorder</strong> (left, root, right): Visits keys in sorted order.</li>
<li><strong>Preorder</strong> (root, left, right): Useful for copying/serializing the tree.</li>
<li><strong>Postorder</strong> (left, right, root): Useful for deletion/deallocation.</li>
</ul>

<div class="env-block theorem"><div class="env-title">Theorem (Inorder Property)</div><div class="env-body">
<p>An inorder traversal of a BST visits keys in non-decreasing sorted order.</p>
</div></div>

<h3>Successor and Predecessor</h3>

<div class="env-block definition"><div class="env-title">Definition (Successor)</div><div class="env-body">
<p>The <em>successor</em> of node \\(x\\) is the node with the smallest key greater than \\(x.\\text{key}\\).</p>
</div></div>

<div class="env-block algorithm"><div class="env-title">Algorithm: TreeSuccessor(x)</div><div class="env-body">
<p>1. If \\(x\\) has a right child, return the minimum of the right subtree.</p>
<p>2. Otherwise, go up: let \\(y = x.\\text{parent}\\). While \\(y \\ne \\text{null}\\) and \\(x = y.\\text{right}\\): set \\(x = y,\\; y = y.\\text{parent}\\). Return \\(y\\).</p>
</div></div>

<p>Case 1 finds the leftmost node in the right subtree. Case 2 finds the lowest ancestor whose left subtree contains \\(x\\). Both take \\(O(h)\\) time.</p>

<div class="viz-placeholder" data-viz="ch09-viz-traversals"></div>

<div class="env-block example"><div class="env-title">Example</div><div class="env-body">
<p>In the BST \\(\\{2, 3, 4, 6, 7, 13, 15, 17, 18, 20\\}\\):</p>
<ul>
<li>Successor of 13: 13 has no right child, go up to 7, then up to 6, then up to 15. Since 6 is 15's left child, return 15.</li>
<li>Successor of 15: minimum of right subtree (17, 18, 20) is 17.</li>
</ul>
</div></div>`,
            visualizations: [
                {
                    id: 'ch09-viz-traversals',
                    title: 'BST Traversals',
                    description: 'Visualize inorder, preorder, and postorder traversals step by step.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 400});
                        let root = null;
                        let traversalOrder = [];
                        let currentStep = -1;
                        let mode = 'inorder';

                        function makeNode(key) { return {key: key, left: null, right: null}; }
                        function insertBST(node, key) {
                            if (!node) return makeNode(key);
                            if (key < node.key) node.left = insertBST(node.left, key);
                            else if (key > node.key) node.right = insertBST(node.right, key);
                            return node;
                        }

                        function inorderTrav(node, result) {
                            if (!node) return;
                            inorderTrav(node.left, result);
                            result.push(node.key);
                            inorderTrav(node.right, result);
                        }
                        function preorderTrav(node, result) {
                            if (!node) return;
                            result.push(node.key);
                            preorderTrav(node.left, result);
                            preorderTrav(node.right, result);
                        }
                        function postorderTrav(node, result) {
                            if (!node) return;
                            postorderTrav(node.left, result);
                            postorderTrav(node.right, result);
                            result.push(node.key);
                        }

                        function getHeight(node) {
                            if (!node) return -1;
                            return 1 + Math.max(getHeight(node.left), getHeight(node.right));
                        }

                        function layoutTree(node) {
                            var positions = {};
                            var keys = [];
                            inorderTrav(node, keys);
                            var h = getHeight(node);
                            var levelH = Math.min(60, 280 / Math.max(h + 1, 1));
                            function assign(n, depth) {
                                if (!n) return;
                                assign(n.left, depth + 1);
                                var idx = keys.indexOf(n.key);
                                var spacing = 660 / (keys.length + 1);
                                positions[n.key] = {x: 20 + spacing * (idx + 1), y: 50 + depth * levelH};
                                assign(n.right, depth + 1);
                            }
                            assign(node, 0);
                            return positions;
                        }

                        function drawTreeR(node, positions) {
                            if (!node) return;
                            if (node.left) {
                                viz.drawTreeEdge(positions[node.key].x, positions[node.key].y, positions[node.left.key].x, positions[node.left.key].y, viz.colors.axis);
                                drawTreeR(node.left, positions);
                            }
                            if (node.right) {
                                viz.drawTreeEdge(positions[node.key].x, positions[node.key].y, positions[node.right.key].x, positions[node.right.key].y, viz.colors.axis);
                                drawTreeR(node.right, positions);
                            }
                            var visitedIdx = -1;
                            for (var i = 0; i <= currentStep && i < traversalOrder.length; i++) {
                                if (traversalOrder[i] === node.key) visitedIdx = i;
                            }
                            var isCurrent = (currentStep >= 0 && currentStep < traversalOrder.length && traversalOrder[currentStep] === node.key);
                            var color = isCurrent ? viz.colors.orange : (visitedIdx >= 0 ? viz.colors.green : viz.colors.blue);
                            viz.drawTreeNode(positions[node.key].x, positions[node.key].y, 18, node.key, color, viz.colors.white);
                        }

                        function computeTraversal() {
                            traversalOrder = [];
                            if (mode === 'inorder') inorderTrav(root, traversalOrder);
                            else if (mode === 'preorder') preorderTrav(root, traversalOrder);
                            else postorderTrav(root, traversalOrder);
                            currentStep = -1;
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText(mode.charAt(0).toUpperCase() + mode.slice(1) + ' Traversal', 350, 10, viz.colors.white, 15, 'center', 'top');
                            if (!root) { viz.screenText('Empty tree', 350, 200, viz.colors.text, 14); return; }
                            var positions = layoutTree(root);
                            drawTreeR(root, positions);
                            // Show traversal sequence
                            var visited = currentStep >= 0 ? traversalOrder.slice(0, currentStep + 1) : [];
                            viz.screenText('Visited: [' + visited.join(', ') + ']', 350, 350, viz.colors.green, 12, 'center', 'top');
                            viz.screenText('Full order: [' + traversalOrder.join(', ') + ']', 350, 370, viz.colors.text, 11, 'center', 'top');
                        }

                        // Init
                        [15, 6, 18, 3, 7, 17, 20, 2, 4, 13].forEach(function(v) { root = insertBST(root, v); });
                        computeTraversal();

                        VizEngine.createSelect(controls, 'Mode:', [
                            {value: 'inorder', label: 'Inorder'},
                            {value: 'preorder', label: 'Preorder'},
                            {value: 'postorder', label: 'Postorder'}
                        ], function(val) {
                            mode = val;
                            computeTraversal();
                            draw();
                        });

                        VizEngine.createButton(controls, 'Step', function() {
                            if (currentStep < traversalOrder.length - 1) currentStep++;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            currentStep = -1;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Auto Play', function() {
                            currentStep = -1;
                            draw();
                            var timer = setInterval(function() {
                                currentStep++;
                                if (currentStep >= traversalOrder.length) { clearInterval(timer); return; }
                                draw();
                            }, 500);
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Give the inorder, preorder, and postorder traversals of a BST built by inserting \\(8, 4, 12, 2, 6, 10, 14\\).',
                    hint: 'The resulting BST is a complete binary tree with root 8.',
                    solution: 'Inorder: 2, 4, 6, 8, 10, 12, 14. Preorder: 8, 4, 2, 6, 12, 10, 14. Postorder: 2, 6, 4, 10, 14, 12, 8.'
                },
                {
                    question: 'Prove that the successor of a node \\(x\\) with no right child is the lowest ancestor of \\(x\\) whose left child is also an ancestor of \\(x\\).',
                    hint: 'Trace up from \\(x\\): while \\(x\\) is a right child, continue up. The first time \\(x\\) is a left child, its parent is the successor.',
                    solution: 'If \\(x\\) has no right child, the successor is not in its subtree. Going up, as long as \\(x\\) is a right child of its parent, the parent has a smaller key (already visited in inorder). When \\(x\\) is a left child of its parent \\(y\\), then \\(y.\\text{key}\\) is the next key after all of \\(y\\)\'s left subtree in inorder, which is exactly the successor of \\(x\\).'
                },
                {
                    question: 'Design a non-recursive inorder traversal using an explicit stack. What is its space complexity?',
                    hint: 'Push nodes while going left; pop and visit when there is no left child, then go right.',
                    solution: 'Initialize stack S, current = root. While S is not empty or current is not null: (1) While current is not null, push current, current = current.left. (2) current = S.pop(), visit current. (3) current = current.right. Space: O(h) for the stack, where h is the height.'
                }
            ]
        },
        // ============================================================
        // Section 3 : Red-Black Trees
        // ============================================================
        {
            id: 'ch09-sec03',
            title: 'Red-Black Trees',
            content: `<h2>Red-Black Trees</h2>
<p>A <strong>red-black tree</strong> is a BST with an extra bit per node (color: red or black) and balancing rules that guarantee \\(h = O(\\log n)\\).</p>

<div class="env-block definition"><div class="env-title">Definition (Red-Black Tree Properties)</div><div class="env-body">
<p>A red-black tree satisfies:</p>
<ol>
<li>Every node is either red or black.</li>
<li>The root is black.</li>
<li>Every leaf (NIL sentinel) is black.</li>
<li><strong>Red rule</strong>: If a node is red, both its children are black (no two consecutive reds).</li>
<li><strong>Black-height rule</strong>: For each node, all simple paths from the node to descendant leaves contain the same number of black nodes (the <em>black-height</em>).</li>
</ol>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (Red-Black Tree Height)</div><div class="env-body">
<p>A red-black tree with \\(n\\) internal nodes has height at most \\(2 \\log_2(n+1)\\).</p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof</div><div class="env-body">
<p>A subtree rooted at \\(x\\) contains at least \\(2^{\\text{bh}(x)} - 1\\) internal nodes (proved by induction on height). The root has black-height \\(\\text{bh} \\ge h/2\\) (by property 4, at most half the nodes on any path are red). So \\(n \\ge 2^{h/2} - 1\\), giving \\(h \\le 2 \\log_2(n+1)\\).</p>
<p class="qed">∎</p>
</div></div>

<h3>Rotations</h3>
<p>Rotations are local tree restructurings that preserve the BST property:</p>
<ul>
<li><strong>Left-Rotate(T, x)</strong>: Makes \\(x\\)'s right child \\(y\\) the new parent; \\(x\\) becomes \\(y\\)'s left child; \\(y\\)'s old left subtree becomes \\(x\\)'s new right subtree.</li>
<li><strong>Right-Rotate(T, y)</strong>: The inverse operation.</li>
</ul>

<div class="viz-placeholder" data-viz="ch09-viz-rb-rotation"></div>

<h3>Insertion Fixup</h3>
<p>After a standard BST insert (colored red), the red rule (property 4) may be violated. The fixup handles three cases based on the uncle node's color, using recoloring and rotations. Each fixup moves the violation up by two levels, so at most \\(O(\\log n)\\) recolorings and at most 2 rotations are needed.</p>

<div class="env-block algorithm"><div class="env-title">Algorithm: RB-Insert-Fixup Sketch</div><div class="env-body">
<p>While \\(z.\\text{parent}\\) is red:</p>
<p>&nbsp;&nbsp;<strong>Case 1</strong> (Uncle is red): Recolor parent and uncle black, grandparent red. Move \\(z\\) to grandparent.</p>
<p>&nbsp;&nbsp;<strong>Case 2</strong> (Uncle is black, \\(z\\) is inner child): Rotate \\(z\\) to become outer child (reduces to Case 3).</p>
<p>&nbsp;&nbsp;<strong>Case 3</strong> (Uncle is black, \\(z\\) is outer child): Recolor parent black, grandparent red, rotate grandparent.</p>
<p>Finally, color root black.</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch09-viz-rb-rotation',
                    title: 'Red-Black Tree Rotations & Insert',
                    description: 'Watch left and right rotations and RB-insert fixup.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 420});
                        // Simple RB tree implementation for visualization
                        var NIL = {key: null, color: 'black', left: null, right: null, parent: null};
                        NIL.left = NIL; NIL.right = NIL; NIL.parent = NIL;

                        var rbRoot = NIL;
                        var message = '';

                        function makeRBNode(key) {
                            return {key: key, color: 'red', left: NIL, right: NIL, parent: NIL};
                        }

                        function leftRotate(x) {
                            var y = x.right;
                            x.right = y.left;
                            if (y.left !== NIL) y.left.parent = x;
                            y.parent = x.parent;
                            if (x.parent === NIL) rbRoot = y;
                            else if (x === x.parent.left) x.parent.left = y;
                            else x.parent.right = y;
                            y.left = x;
                            x.parent = y;
                        }

                        function rightRotate(y) {
                            var x = y.left;
                            y.left = x.right;
                            if (x.right !== NIL) x.right.parent = y;
                            x.parent = y.parent;
                            if (y.parent === NIL) rbRoot = x;
                            else if (y === y.parent.left) y.parent.left = x;
                            else y.parent.right = x;
                            x.right = y;
                            y.parent = x;
                        }

                        function rbInsert(key) {
                            var z = makeRBNode(key);
                            var y = NIL, x = rbRoot;
                            while (x !== NIL) {
                                y = x;
                                if (z.key < x.key) x = x.left;
                                else if (z.key > x.key) x = x.right;
                                else return; // duplicate
                            }
                            z.parent = y;
                            if (y === NIL) rbRoot = z;
                            else if (z.key < y.key) y.left = z;
                            else y.right = z;
                            rbInsertFixup(z);
                        }

                        function rbInsertFixup(z) {
                            while (z.parent.color === 'red') {
                                if (z.parent === z.parent.parent.left) {
                                    var y = z.parent.parent.right;
                                    if (y.color === 'red') {
                                        z.parent.color = 'black';
                                        y.color = 'black';
                                        z.parent.parent.color = 'red';
                                        z = z.parent.parent;
                                    } else {
                                        if (z === z.parent.right) {
                                            z = z.parent;
                                            leftRotate(z);
                                        }
                                        z.parent.color = 'black';
                                        z.parent.parent.color = 'red';
                                        rightRotate(z.parent.parent);
                                    }
                                } else {
                                    var y = z.parent.parent.left;
                                    if (y.color === 'red') {
                                        z.parent.color = 'black';
                                        y.color = 'black';
                                        z.parent.parent.color = 'red';
                                        z = z.parent.parent;
                                    } else {
                                        if (z === z.parent.left) {
                                            z = z.parent;
                                            rightRotate(z);
                                        }
                                        z.parent.color = 'black';
                                        z.parent.parent.color = 'red';
                                        leftRotate(z.parent.parent);
                                    }
                                }
                            }
                            rbRoot.color = 'black';
                        }

                        function getHeightRB(node) {
                            if (node === NIL) return -1;
                            return 1 + Math.max(getHeightRB(node.left), getHeightRB(node.right));
                        }

                        function inorderRB(node, result) {
                            if (node === NIL) return;
                            inorderRB(node.left, result);
                            result.push(node);
                            inorderRB(node.right, result);
                        }

                        function layoutRB(root) {
                            var positions = {};
                            var nodes = [];
                            inorderRB(root, nodes);
                            var h = getHeightRB(root);
                            var levelH = Math.min(60, 310 / Math.max(h + 1, 1));
                            function assign(n, depth) {
                                if (n === NIL) return;
                                assign(n.left, depth + 1);
                                var idx = nodes.indexOf(n);
                                var spacing = 660 / (nodes.length + 1);
                                positions[n.key] = {x: 20 + spacing * (idx + 1), y: 50 + depth * levelH, node: n};
                                assign(n.right, depth + 1);
                            }
                            assign(root, 0);
                            return positions;
                        }

                        function drawRBTree(node, positions) {
                            if (node === NIL) return;
                            if (node.left !== NIL) {
                                viz.drawTreeEdge(positions[node.key].x, positions[node.key].y, positions[node.left.key].x, positions[node.left.key].y, viz.colors.axis);
                                drawRBTree(node.left, positions);
                            }
                            if (node.right !== NIL) {
                                viz.drawTreeEdge(positions[node.key].x, positions[node.key].y, positions[node.right.key].x, positions[node.right.key].y, viz.colors.axis);
                                drawRBTree(node.right, positions);
                            }
                            var color = node.color === 'red' ? viz.colors.red : '#555';
                            var strokeColor = node.color === 'red' ? viz.colors.red : viz.colors.white;
                            viz.drawNode(positions[node.key].x, positions[node.key].y, 18, node.key, color, viz.colors.white, strokeColor);
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Red-Black Tree', 350, 10, viz.colors.white, 15, 'center', 'top');
                            if (rbRoot === NIL) {
                                viz.screenText('Tree is empty', 350, 200, viz.colors.text, 14);
                            } else {
                                var positions = layoutRB(rbRoot);
                                drawRBTree(rbRoot, positions);
                                var nodes = [];
                                inorderRB(rbRoot, nodes);
                                var h = getHeightRB(rbRoot);
                                viz.screenText('n = ' + nodes.length + ', height = ' + h, 350, 385, viz.colors.text, 11, 'center', 'top');
                            }
                            if (message) viz.screenText(message, 350, 402, viz.colors.yellow, 11, 'center', 'top');
                        }

                        [11, 2, 14, 1, 7, 15, 5, 8].forEach(function(v) { rbInsert(v); });

                        var inputEl = document.createElement('input');
                        inputEl.type = 'number';
                        inputEl.value = '4';
                        inputEl.style.cssText = 'width:55px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:6px;';
                        controls.appendChild(inputEl);

                        VizEngine.createButton(controls, 'Insert', function() {
                            var val = parseInt(inputEl.value);
                            if (isNaN(val)) return;
                            rbInsert(val);
                            message = 'Inserted ' + val + ' (with RB fixup)';
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            rbRoot = NIL;
                            [11, 2, 14, 1, 7, 15, 5, 8].forEach(function(v) { rbInsert(v); });
                            message = 'Reset to default tree';
                            draw();
                        });

                        VizEngine.createButton(controls, 'Insert 1-15', function() {
                            rbRoot = NIL;
                            for (var i = 1; i <= 15; i++) rbInsert(i);
                            message = 'Inserted 1 through 15 sequentially';
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that a red-black tree with \\(n\\) internal nodes has height at most \\(2\\log_2(n+1)\\).',
                    hint: 'First prove by induction that a subtree rooted at \\(x\\) has at least \\(2^{\\text{bh}(x)}-1\\) internal nodes.',
                    solution: 'By induction: a node \\(x\\) at height 0 (leaf NIL) has \\(\\text{bh}(x) = 0\\) and \\(2^0 - 1 = 0\\) internal nodes. For internal \\(x\\): each child has black-height \\(\\ge \\text{bh}(x) - 1\\), so by IH, subtree of \\(x\\) has \\(\\ge 2(2^{\\text{bh}(x)-1}-1)+1 = 2^{\\text{bh}(x)}-1\\) internal nodes. For the root with height \\(h\\): by property 4, \\(\\text{bh}(\\text{root}) \\ge h/2\\). So \\(n \\ge 2^{h/2}-1\\), giving \\(h \\le 2\\log_2(n+1)\\).'
                },
                {
                    question: 'Show that the maximum number of rotations during an RB-Insert fixup is 2.',
                    hint: 'Analyze the three cases: Case 1 does only recoloring (no rotation), Cases 2+3 do at most 2 rotations total and then terminate.',
                    solution: 'Case 1: recolor only, move violation up (can repeat \\(O(\\log n)\\) times). Case 2: single rotation, falls through to Case 3. Case 3: single rotation, then terminates. Cases 2 and 3 happen at most once (total 2 rotations), then the loop ends. So at most \\(O(\\log n)\\) recolorings but at most 2 rotations.'
                },
                {
                    question: 'What is the minimum and maximum number of internal nodes in a red-black tree of black-height \\(k\\)?',
                    hint: 'Minimum: all nodes black. Maximum: alternate red and black on every path.',
                    solution: 'Minimum: all-black complete binary tree of height \\(k\\), giving \\(2^k - 1\\) nodes. Maximum: every black node has two red children (height \\(2k\\)), giving \\(2^{2k} - 1 = 4^k - 1\\) nodes.'
                }
            ]
        },
        // ============================================================
        // Section 4 : AVL Trees
        // ============================================================
        {
            id: 'ch09-sec04',
            title: 'AVL Trees',
            content: `<h2>AVL Trees</h2>
<p>AVL trees (Adelson-Velsky and Landis, 1962) were the first self-balancing BSTs. They maintain a stricter balance than red-black trees.</p>

<div class="env-block definition"><div class="env-title">Definition (AVL Property)</div><div class="env-body">
<p>An AVL tree is a BST where for every node \\(x\\):</p>
$$|h(x.\\text{left}) - h(x.\\text{right})| \\le 1$$
<p>where \\(h(\\cdot)\\) denotes the height of a subtree (with \\(h(\\text{null}) = -1\\)).</p>
</div></div>

<div class="env-block theorem"><div class="env-title">Theorem (AVL Height Bound)</div><div class="env-body">
<p>An AVL tree with \\(n\\) nodes has height \\(h < 1.4405 \\log_2(n+2) - 0.3277\\). Roughly, \\(h = \\Theta(\\log n)\\).</p>
</div></div>

<div class="env-block proof"><div class="env-title">Proof Sketch</div><div class="env-body">
<p>Let \\(N(h)\\) be the minimum number of nodes in an AVL tree of height \\(h\\). Then \\(N(h) = N(h-1) + N(h-2) + 1\\), similar to Fibonacci numbers. This gives \\(N(h) \\ge \\phi^h\\) where \\(\\phi = (1+\\sqrt{5})/2\\), so \\(h \\le \\log_\\phi n = O(\\log n)\\).</p>
<p class="qed">∎</p>
</div></div>

<h3>AVL Rotations</h3>
<p>After insertion or deletion, the balance factor (left height minus right height) of an ancestor may become \\(\\pm 2\\). Four rotation cases restore balance:</p>
<ul>
<li><strong>Left-Left (LL)</strong>: Right rotate.</li>
<li><strong>Right-Right (RR)</strong>: Left rotate.</li>
<li><strong>Left-Right (LR)</strong>: Left rotate left child, then right rotate.</li>
<li><strong>Right-Left (RL)</strong>: Right rotate right child, then left rotate.</li>
</ul>

<div class="viz-placeholder" data-viz="ch09-viz-avl"></div>

<h3>AVL vs. Red-Black Trees</h3>
<table style="margin:8px 0;border-collapse:collapse;font-size:0.9em;">
<tr style="border-bottom:2px solid #30363d;"><th style="padding:4px 10px;">Property</th><th style="padding:4px 10px;">AVL Tree</th><th style="padding:4px 10px;">Red-Black Tree</th></tr>
<tr><td style="padding:4px 10px;">Height bound</td><td style="padding:4px 10px;">\\(1.44\\log n\\)</td><td style="padding:4px 10px;">\\(2\\log n\\)</td></tr>
<tr><td style="padding:4px 10px;">Search</td><td style="padding:4px 10px;">Slightly faster</td><td style="padding:4px 10px;">Slightly slower</td></tr>
<tr><td style="padding:4px 10px;">Insert rotations</td><td style="padding:4px 10px;">\\(\\le 2\\)</td><td style="padding:4px 10px;">\\(\\le 2\\)</td></tr>
<tr><td style="padding:4px 10px;">Delete rotations</td><td style="padding:4px 10px;">\\(O(\\log n)\\)</td><td style="padding:4px 10px;">\\(\\le 3\\)</td></tr>
<tr><td style="padding:4px 10px;">Best for</td><td style="padding:4px 10px;">Lookup-heavy</td><td style="padding:4px 10px;">Insert/delete-heavy</td></tr>
</table>`,
            visualizations: [
                {
                    id: 'ch09-viz-avl',
                    title: 'AVL Tree Insert & Rotations',
                    description: 'Insert keys and watch AVL rotations maintain balance.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 420});
                        let avlRoot = null;
                        let message = '';

                        function makeAVL(key) { return {key: key, left: null, right: null, height: 0}; }
                        function h(node) { return node ? node.height : -1; }
                        function updateH(node) { if (node) node.height = 1 + Math.max(h(node.left), h(node.right)); }
                        function bf(node) { return node ? h(node.left) - h(node.right) : 0; }

                        function rotateRight(y) {
                            var x = y.left;
                            y.left = x.right;
                            x.right = y;
                            updateH(y); updateH(x);
                            return x;
                        }
                        function rotateLeft(x) {
                            var y = x.right;
                            x.right = y.left;
                            y.left = x;
                            updateH(x); updateH(y);
                            return y;
                        }

                        function avlInsert(node, key) {
                            if (!node) return makeAVL(key);
                            if (key < node.key) node.left = avlInsert(node.left, key);
                            else if (key > node.key) node.right = avlInsert(node.right, key);
                            else return node;
                            updateH(node);
                            var b = bf(node);
                            if (b > 1 && key < node.left.key) { message = 'LL rotation at ' + node.key; return rotateRight(node); }
                            if (b < -1 && key > node.right.key) { message = 'RR rotation at ' + node.key; return rotateLeft(node); }
                            if (b > 1 && key > node.left.key) { node.left = rotateLeft(node.left); message = 'LR rotation at ' + node.key; return rotateRight(node); }
                            if (b < -1 && key < node.right.key) { node.right = rotateRight(node.right); message = 'RL rotation at ' + node.key; return rotateLeft(node); }
                            return node;
                        }

                        function inorderAVL(node, result) {
                            if (!node) return;
                            inorderAVL(node.left, result);
                            result.push(node);
                            inorderAVL(node.right, result);
                        }

                        function layoutAVL(root) {
                            var positions = {};
                            var nodes = [];
                            inorderAVL(root, nodes);
                            var maxH = h(root);
                            var levelH = Math.min(60, 300 / Math.max(maxH + 1, 1));
                            function assign(n, depth) {
                                if (!n) return;
                                assign(n.left, depth + 1);
                                var idx = nodes.indexOf(n);
                                var spacing = 660 / (nodes.length + 1);
                                positions[n.key] = {x: 20 + spacing * (idx + 1), y: 50 + depth * levelH, node: n};
                                assign(n.right, depth + 1);
                            }
                            assign(root, 0);
                            return positions;
                        }

                        function drawAVLTree(node, positions) {
                            if (!node) return;
                            if (node.left) {
                                viz.drawTreeEdge(positions[node.key].x, positions[node.key].y, positions[node.left.key].x, positions[node.left.key].y, viz.colors.axis);
                                drawAVLTree(node.left, positions);
                            }
                            if (node.right) {
                                viz.drawTreeEdge(positions[node.key].x, positions[node.key].y, positions[node.right.key].x, positions[node.right.key].y, viz.colors.axis);
                                drawAVLTree(node.right, positions);
                            }
                            var b = bf(node);
                            var color = (Math.abs(b) > 1) ? viz.colors.red : viz.colors.teal;
                            viz.drawTreeNode(positions[node.key].x, positions[node.key].y, 18, node.key, color, viz.colors.white);
                            // Show balance factor
                            viz.screenText('bf=' + b, positions[node.key].x, positions[node.key].y - 22, viz.colors.text, 9, 'center', 'bottom');
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('AVL Tree (balance factors shown)', 350, 10, viz.colors.white, 15, 'center', 'top');
                            if (!avlRoot) {
                                viz.screenText('Empty tree', 350, 200, viz.colors.text, 14);
                            } else {
                                var positions = layoutAVL(avlRoot);
                                drawAVLTree(avlRoot, positions);
                                var nodes = [];
                                inorderAVL(avlRoot, nodes);
                                viz.screenText('n = ' + nodes.length + ', height = ' + h(avlRoot), 350, 385, viz.colors.text, 11, 'center', 'top');
                            }
                            if (message) viz.screenText(message, 350, 402, viz.colors.yellow, 11, 'center', 'top');
                        }

                        [10, 20, 30, 15, 25, 5, 3].forEach(function(v) { avlRoot = avlInsert(avlRoot, v); });

                        var inputEl = document.createElement('input');
                        inputEl.type = 'number';
                        inputEl.value = '12';
                        inputEl.style.cssText = 'width:55px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:6px;';
                        controls.appendChild(inputEl);

                        VizEngine.createButton(controls, 'Insert', function() {
                            var val = parseInt(inputEl.value);
                            if (isNaN(val)) return;
                            message = 'Inserted ' + val + ' (no rotation needed)';
                            avlRoot = avlInsert(avlRoot, val);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Insert 1-20', function() {
                            avlRoot = null;
                            message = '';
                            for (var i = 1; i <= 20; i++) avlRoot = avlInsert(avlRoot, i);
                            message = 'Inserted 1 through 20 (worst case for unbalanced BST, but AVL stays balanced)';
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            avlRoot = null;
                            message = '';
                            [10, 20, 30, 15, 25, 5, 3].forEach(function(v) { avlRoot = avlInsert(avlRoot, v); });
                            message = 'Reset';
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Show the AVL tree after inserting \\(3, 2, 1, 4, 5, 6, 7\\) in order, indicating each rotation.',
                    hint: 'After inserting 1 (into 3-2), LL case triggers right rotation. After inserting 5, RR case at 4.',
                    solution: 'Insert 3: root 3. Insert 2: left of 3. Insert 1: left of 2 -> LL at 3, rotate right -> root 2 with children 1, 3. Insert 4: right of 3. Insert 5: right of 4 -> RR at 3, rotate left -> 2 with children 1, 4 (4 has children 3, 5). Insert 6: right of 5 -> RR at 2, rotate left -> root 4, left 2 (children 1, 3), right 5 (right 6). Insert 7: right of 6 -> RR at 5, rotate left -> root 4, right 6 (children 5, 7). Final: balanced tree with height 2.'
                },
                {
                    question: 'Prove that the minimum number of nodes in an AVL tree of height \\(h\\) satisfies \\(N(h) = N(h-1) + N(h-2) + 1\\) with \\(N(0) = 1, N(1) = 2\\).',
                    hint: 'For minimum nodes, one subtree has height \\(h-1\\) and the other \\(h-2\\) (maximum imbalance of 1).',
                    solution: 'To minimize nodes at height \\(h\\): one child subtree has height \\(h-1\\) (with minimum nodes \\(N(h-1)\\)), the other has height \\(h-2\\) (with minimum nodes \\(N(h-2)\\)), plus the root. So \\(N(h) = N(h-1) + N(h-2) + 1\\). Base: \\(N(0) = 1\\) (single node), \\(N(1) = 2\\) (root + one child). This recurrence gives \\(N(h) = F_{h+3} - 1\\) where \\(F_k\\) is the \\(k\\)-th Fibonacci number.'
                },
                {
                    question: 'Why does AVL deletion potentially require \\(O(\\log n)\\) rotations while insertion needs at most 2?',
                    hint: 'After a single rotation fixes one level during deletion, the height of the rotated subtree may decrease, requiring another fix higher up.',
                    solution: 'During insertion, a rotation at the deepest unbalanced ancestor restores its original height, so no further ancestors become unbalanced. During deletion, a rotation can reduce the subtree height by 1, which may cause the parent to become unbalanced, propagating up to the root. So deletion may need up to \\(O(\\log n)\\) rotations (one per level).'
                }
            ]
        },
        // ============================================================
        // Section 5 : Order-Statistic Trees
        // ============================================================
        {
            id: 'ch09-sec05',
            title: 'Order-Statistic Trees',
            content: `<h2>Order-Statistic Trees</h2>
<p>An <strong>order-statistic tree</strong> augments a balanced BST (e.g., red-black tree) so that we can efficiently find the \\(i\\)-th smallest element and determine the rank of any element.</p>

<div class="env-block definition"><div class="env-title">Definition (Augmented Size Field)</div><div class="env-body">
<p>Each node \\(x\\) stores \\(x.\\text{size} = 1 + x.\\text{left}.\\text{size} + x.\\text{right}.\\text{size}\\), the number of nodes in the subtree rooted at \\(x\\). (With \\(\\text{NIL}.\\text{size} = 0\\).)</p>
</div></div>

<h3>OS-Select(x, i) — Find the i-th smallest element</h3>
<div class="env-block algorithm"><div class="env-title">Algorithm: OS-Select(x, i)</div><div class="env-body">
<p>1. \\(r \\leftarrow x.\\text{left}.\\text{size} + 1\\) &nbsp;(rank of \\(x\\) in its subtree)</p>
<p>2. If \\(i = r\\), return \\(x\\)</p>
<p>3. If \\(i < r\\), return OS-Select(\\(x.\\text{left}\\), \\(i\\))</p>
<p>4. If \\(i > r\\), return OS-Select(\\(x.\\text{right}\\), \\(i - r\\))</p>
</div></div>

<h3>OS-Rank(T, x) — Find the rank of x</h3>
<div class="env-block algorithm"><div class="env-title">Algorithm: OS-Rank(T, x)</div><div class="env-body">
<p>1. \\(r \\leftarrow x.\\text{left}.\\text{size} + 1\\)</p>
<p>2. \\(y \\leftarrow x\\)</p>
<p>3. While \\(y \\ne T.\\text{root}\\):</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;If \\(y = y.\\text{parent}.\\text{right}\\), then \\(r \\leftarrow r + y.\\text{parent}.\\text{left}.\\text{size} + 1\\)</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;\\(y \\leftarrow y.\\text{parent}\\)</p>
<p>4. Return \\(r\\)</p>
</div></div>

<p>Both operations run in \\(O(\\log n)\\) time. The key insight: maintaining the size field during rotations costs only \\(O(1)\\) extra work per rotation.</p>

<div class="viz-placeholder" data-viz="ch09-viz-os-tree"></div>

<div class="env-block theorem"><div class="env-title">Theorem (Augmenting Red-Black Trees)</div><div class="env-body">
<p>If a field \\(f(x)\\) of node \\(x\\) can be computed from \\(x\\), \\(x.\\text{left}\\), and \\(x.\\text{right}\\) in \\(O(1)\\) time, then it can be maintained during insert and delete without asymptotically increasing the running time.</p>
</div></div>

<div class="env-block example"><div class="env-title">Example</div><div class="env-body">
<p>Other augmentations: interval trees (store max endpoint in subtree), segment trees, etc. The augmentation theorem applies whenever the field depends only on the node and its immediate children's fields.</p>
</div></div>`,
            visualizations: [
                {
                    id: 'ch09-viz-os-tree',
                    title: 'Order-Statistic Tree',
                    description: 'See subtree sizes and perform rank/select queries.',
                    setup: function(body, controls) {
                        const viz = new VizEngine(body, {width: 700, height: 420});
                        // Simple BST with size field
                        let osRoot = null;
                        let message = '';
                        let highlightKey = -1;

                        function makeOS(key) { return {key: key, left: null, right: null, size: 1}; }
                        function getSize(n) { return n ? n.size : 0; }
                        function updateSize(n) { if (n) n.size = 1 + getSize(n.left) + getSize(n.right); }

                        function osInsert(node, key) {
                            if (!node) return makeOS(key);
                            if (key < node.key) node.left = osInsert(node.left, key);
                            else if (key > node.key) node.right = osInsert(node.right, key);
                            updateSize(node);
                            return node;
                        }

                        function osSelect(node, i) {
                            if (!node) return null;
                            var r = getSize(node.left) + 1;
                            if (i === r) return node;
                            if (i < r) return osSelect(node.left, i);
                            return osSelect(node.right, i - r);
                        }

                        function osRank(node, key) {
                            if (!node) return 0;
                            if (key < node.key) return osRank(node.left, key);
                            if (key > node.key) return getSize(node.left) + 1 + osRank(node.right, key);
                            return getSize(node.left) + 1;
                        }

                        function inorderOS(node, result) {
                            if (!node) return;
                            inorderOS(node.left, result);
                            result.push(node);
                            inorderOS(node.right, result);
                        }

                        function getHeightOS(node) {
                            if (!node) return -1;
                            return 1 + Math.max(getHeightOS(node.left), getHeightOS(node.right));
                        }

                        function layoutOS(root) {
                            var positions = {};
                            var nodes = [];
                            inorderOS(root, nodes);
                            var maxH = getHeightOS(root);
                            var levelH = Math.min(55, 290 / Math.max(maxH + 1, 1));
                            function assign(n, depth) {
                                if (!n) return;
                                assign(n.left, depth + 1);
                                var idx = nodes.indexOf(n);
                                var spacing = 660 / (nodes.length + 1);
                                positions[n.key] = {x: 20 + spacing * (idx + 1), y: 50 + depth * levelH, node: n};
                                assign(n.right, depth + 1);
                            }
                            assign(root, 0);
                            return positions;
                        }

                        function drawOSTree(node, positions) {
                            if (!node) return;
                            if (node.left) {
                                viz.drawTreeEdge(positions[node.key].x, positions[node.key].y, positions[node.left.key].x, positions[node.left.key].y, viz.colors.axis);
                                drawOSTree(node.left, positions);
                            }
                            if (node.right) {
                                viz.drawTreeEdge(positions[node.key].x, positions[node.key].y, positions[node.right.key].x, positions[node.right.key].y, viz.colors.axis);
                                drawOSTree(node.right, positions);
                            }
                            var color = (node.key === highlightKey) ? viz.colors.orange : viz.colors.purple;
                            viz.drawTreeNode(positions[node.key].x, positions[node.key].y, 18, node.key, color, viz.colors.white);
                            viz.screenText('s=' + node.size, positions[node.key].x, positions[node.key].y - 22, viz.colors.teal, 9, 'center', 'bottom');
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Order-Statistic Tree (s = subtree size)', 350, 10, viz.colors.white, 15, 'center', 'top');
                            if (!osRoot) {
                                viz.screenText('Empty', 350, 200, viz.colors.text, 14);
                            } else {
                                var positions = layoutOS(osRoot);
                                drawOSTree(osRoot, positions);
                            }
                            if (message) viz.screenText(message, 350, 395, viz.colors.yellow, 11, 'center', 'top');
                        }

                        [26, 17, 41, 14, 21, 30, 47, 10, 16, 19, 23, 28, 38, 7, 12, 15, 20].forEach(function(v) { osRoot = osInsert(osRoot, v); });

                        var inputEl = document.createElement('input');
                        inputEl.type = 'number';
                        inputEl.value = '5';
                        inputEl.style.cssText = 'width:55px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;margin-right:6px;';
                        controls.appendChild(inputEl);

                        VizEngine.createButton(controls, 'Select(i)', function() {
                            var i = parseInt(inputEl.value);
                            if (isNaN(i) || i < 1 || i > getSize(osRoot)) { message = 'i must be 1..' + getSize(osRoot); highlightKey = -1; draw(); return; }
                            var node = osSelect(osRoot, i);
                            highlightKey = node ? node.key : -1;
                            message = 'The ' + i + '-th smallest element is ' + (node ? node.key : 'N/A');
                            draw();
                        });

                        VizEngine.createButton(controls, 'Rank(key)', function() {
                            var key = parseInt(inputEl.value);
                            if (isNaN(key)) { message = 'Enter a valid key'; draw(); return; }
                            var r = osRank(osRoot, key);
                            highlightKey = key;
                            message = 'Rank of ' + key + ' = ' + r;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Insert', function() {
                            var val = parseInt(inputEl.value);
                            if (isNaN(val)) return;
                            osRoot = osInsert(osRoot, val);
                            highlightKey = val;
                            message = 'Inserted ' + val;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In an order-statistic tree with keys \\(\\{7, 10, 12, 14, 15, 16, 17, 19, 20, 21, 23, 26, 28, 30, 38, 41, 47\\}\\), what does OS-Select(root, 10) return?',
                    hint: 'Count: the 10th smallest key in sorted order.',
                    solution: 'Sorted keys: 7, 10, 12, 14, 15, 16, 17, 19, 20, 21, ... The 10th smallest is 21.'
                },
                {
                    question: 'Explain how to maintain the size field during a left rotation in \\(O(1)\\) time.',
                    hint: 'After left rotation of x (y = x.right becomes new parent), update sizes of x and y.',
                    solution: 'After left rotation, x becomes y\'s left child. New x.size = x.left.size + x.right.size + 1 (using the new x.right which was y.left). New y.size = y.left.size + y.right.size + 1 = x.size + y.right.size + 1. Only two size updates needed, each O(1).'
                },
                {
                    question: 'Design an \\(O(n\\log n)\\) algorithm to count the number of inversions in an array using an order-statistic tree.',
                    hint: 'Insert elements right-to-left. For each element, count how many previously inserted elements are smaller.',
                    solution: 'Process array from right to left. For each element a[i], insert it into an OS tree. Before inserting, the number of elements already in the tree that are smaller than a[i] equals Rank(a[i]) - 1 (or 0 if a[i] is the smallest). These are elements to the right of a[i] that are smaller, i.e., inversions involving a[i]. Sum all such counts. Each insert and rank query is O(log n), total O(n log n).'
                }
            ]
        }
    ]
});
