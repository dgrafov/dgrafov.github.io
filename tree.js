var noFunctionError = "Введите функцию";
var unknownFunction = "Неизвестная функция: "
var unknownSymbol = "Неизвестный символ: "
var noClosingBracket = "Не хватает закрывающей скобки"
var noOpeningBracket = "Не хватает открывающей скобки"

//think of types of operands in the tree. Then we can simplify trees like log(a, b) to one node
//without calculating a logarithm value. add token type to the node

//simplification
// a+-*b,
// a/b ????
// 0+x, x+0
// 0-x, x-0
// -1 * x ????
// 1*x
// 0*x
// 0^x
// x^0
// 1^x
// x^1
// ln1, log1
// f(x) / f(x)
// f(x) / -f(x)
// f(x) / f(x)*k ????
// u(x)/(f(x)/g(x))
// (-x)^2k
// (x^a)^b
// log(f(x), f(x))

//improvements: parse 2x, 2tg etc
//cache trees until input changes



//add arc- functions

function loadExample(exampleId) {
    document.getElementById('function').value = document.getElementById(exampleId).innerHTML;
}

function showCalculate() {
    hideTree();
    hideError();
    var input = document.getElementById('function').value;

    if(input.length > 0) {
        console.log("calculate: " + input);
        var ret = buildTree(input);
        if(ret[0] === true) {
            var derivativeTree = derivative(ret[1]);
            drawTree(derivativeTree);
        }
        else {
            displayError(ret[1]);
        }
    }
    else {
        displayError(noFunctionError);
    }
}

function showBuildTree() {
    hideTree();
    hideError();
    var input = document.getElementById('function').value;
    if(input.length > 0) {
        console.log("buildTree:" + input);
        var ret = buildTree(input);
        if(ret[0] === true) {
            drawTree(ret[1]);
        }
        else {
            displayError(ret[1]);
        }
    }
    else {
        displayError(noFunctionError);
    }
}

function showSupportedSymbols() {
    document.getElementById('supportedSymbols').style.display = "block";
    var button = document.getElementById('supportedSymbolsButton');
    button.onclick = hideSupportedSymbols;
    button.innerHTML = "Скрыть";
}

function hideSupportedSymbols() {
    document.getElementById('supportedSymbols').style.display = "none";
    var button = document.getElementById('supportedSymbolsButton');
    button.onclick = showSupportedSymbols;
    button.innerHTML = "Показать";
}

function hideTree() {
    document.getElementById('treeDiv').style.display = "none";
}

function hideError() {
    document.getElementById('errorDiv').style.display = "none";
}

function buildTree(input) {
    input = input.split(' ').join('');
    var opStack = [];
    var outStack = [];
    var error = "";

    var i = 0;
    while(i < input.length && error === "") {
        if(isOperator(input[i])) {
            if((i == 0 || input[i - 1] === '(' || isOperator(input[i - 1]))
                && input[i] === '-') {
                // unary minus
                var op = new Operator(input[i], true, false);
            }
            else{
                var op = new Operator(input[i], false, false);
            }

            while(opStack.length > 0
                && opStack[opStack.length - 1] !== '('
                && op.prio <= opStack[opStack.length - 1].prio)
            {
                popOperatorFromStack(opStack, outStack);
            }
            opStack.push(op);
            i++;
        }

        else if(input[i] === '(') {
            opStack.push(input[i]);
            i++;
        }

        else if(input[i] === ')') {

            while(opStack.length > 0 && opStack[opStack.length - 1] !== '(')
            {
                popOperatorFromStack(opStack, outStack);
            }

            if(opStack.length > 0 && opStack[opStack.length - 1] === '(') {
                opStack.pop();
                if(opStack.length > 0 && opStack[opStack.length - 1].func === true) {
                    popOperatorFromStack(opStack, outStack);
                }
            }
            else {
                error = noOpeningBracket;
            }


            i++;
        }

        else if(input[i] === ',') {

            while(opStack.length > 0 && opStack[opStack.length - 1] !== '(')
            {
                popOperatorFromStack(opStack, outStack);
            }

            if(opStack.length == 0) {
                error = noOpeningBracket;
            }
            i++;
        }

        else if (isLetter(input[i])){
            // operand or function
            var n = i;
            var str = "";
            do {
                str += input[n];
                n++;
            } while (n < input.length
                &&  (isLetter(input[n]) || input[n] === '.' ));

            if(str.length === 1) {
                //operand
                outStack.push(new Node(str));
            }
            else {
                var op = processFunction(str);
                if(op !== null) {
                    opStack.push(op);
                }
                else{
                    //error unknown function
                    error = unknownFunction + str;
                }
            }
            i = n;
        }

        else if (isDigit(input[i])) {
            // numeric operand
            var n = i;
            var numStr = "";
            do {
                numStr += input[n];
                n++;
            } while (n < input.length
                &&  (isDigit(input[n]) || input[n] === '.' ));
            outStack.push(new Node(parseFloat(numStr)));
            i = n;
        }
        else {
            //error
            error = unknownSymbol + input[i];
            console.log(error);
            break;
        }
    }
    if(error === "") {
        while(opStack.length > 0 && error === "") {
            if(opStack[opStack.length - 1].token == '(' ) {
                error = noClosingBracket;
            }
            else {
                popOperatorFromStack(opStack, outStack);
            }

        }
        return [true, outStack[0]];
    }

    return [false, error];
}

function derivative(node) {
    if(node === null) {
        return null;
    }
    var left = null;
    var right = null;
    console.log("Token " + node.token);
    if(node.left !== null) {
        left = derivative(node.left);
    }
    if(node.right !== null) {
        right = derivative(node.right);
    }

    switch(node.token) {
    case "+":
        return connectNodes(new Node("+"), left, right);
    break;
    case "-":
        return connectNodes(new Node("-"), left, right);
    break;
    case "*":
        // left was constant
        if(left.token === "0") {
            return connectNodes(new Node("*"), copyTree(node.left), right); //(k*f(x))' = k*f'(x)
        }
        // right was constant
        if(right.token === "0") {
            return connectNodes(new Node("*"), left, copyTree(node.right)); //(f(x)*k)' = f'(x)*k
        }
        //both constants are impossible due to initial simplification of the input

        //general case
        return connectNodes(new Node("+"),
            connectNodes(new Node("*"), left, copyTree(node.right)), // u'*v
            connectNodes(new Node("*"), copyTree(node.left), right)); // u*v'
    break;
    case "/":
        // right was constant
        if(right.token === "0") {
            return connectNodes(new Node("/"), left, copyTree(node.right)); //(f(x)/k)' = f'(x)/k
        }
        //both constants are impossible due to initial simplification of the input

        //general case
        return connectNodes(new Node("/"),
            connectNodes(new Node("-"),
                connectNodes(new Node("*"), left, copyTree(node.right)), // u'*v
                connectNodes(new Node("*"), copyTree(node.left), right)), // u*v'
            connectNodes(new Node("^"),
                copyTree(node.right),   // v
                new Node("2"))); // v
    break;
    case "^":
        // left was constant, it's a^f(x) case: return a^f(x) * ln(a) * f'(x)
        if(left.token === "0") {
            //check for e.
            if(node.left.token === "e") {
                return connectNodes(new Node("*"), copyTree(node), right); // e^f(x) * f'(x)
            }
            //just constant
            return connectNodes(new Node("*"),
                connectNodes(new Node("*"), copyTree(node), right), //a^f(x) * f'(x)
                connectNodes(new Node("ln"), copyTree(node.left), null)); // ln(a)
        }
        // right was constant, it's f(x)^a case: return a*f(x)^(a-1)*f'(x)
        if(right.token === "0") {
            return connectNodes(new Node("*"),
                connectNodes(new Node("*"), copyTree(node.right), // a*
                    connectNodes(new Node("^"), copyTree(node.left), // f(x)^
                        connectNodes(new Node("-"), copyTree(node.right), new Node("1")))), // (a-1)
                left); // f'(x)
        }

        // general case: f(x)^u(x). After trick with e^(u(x)*ln(f(x)) we'll have:
        // f(x)^u(x) * (u(x)*ln(f(x)))'
        return connectNodes(new Node("*"),
            copyTree(node),//f(x)^u(x)
            derivative(
                connectNodes(new Node("*"),
                    copyTree(node.right),
                    connectNodes(new Node("ln"), copyTree(node.left), null)))) //(u(x) * ln(f(x)))'
    break;
    case "log":
        // left was constant: log(a, f(x)) case:
        if(left.token === "0") {
            if(right.token === "0") {
                //log(a, b) - is a constant -> 0
                return left;
            }

            // f'(x)/(f(x)*ln(a))
            return connectNodes(new Node("/"),
                right, // f'(x)
                connectNodes(new Node("*"),
                    copyTree(node.right), //f(x)
                    connectNodes(new Node("ln"), copyTree(node.left), null))); // ln(a)
        }

        //log(f(x), g(x)) case. Transition to new log base: e
        //log(f(x), g(x)) = ln(g(x))/ln(f(x))
        return derivative(
            connectNodes(new Node("/"),
                connectNodes(new Node("ln"), copyTree(node.right), null), //ln(g(x))
                connectNodes(new Node("ln"), copyTree(node.left), null))); //ln(f(x))
    break;
    case "ln":
        return connectNodes(new Node("/"), left, copyTree(node.left)); // f'(x)/f(x)
    break;
    case "sqrt":
        return connectNodes(new Node("/"),
            left, // f'(x)
            connectNodes(new Node("*"),
                new Node("2"),
                connectNodes(new Node("sqrt"), copyTree(node.left), null)));
    break;
    case "rt":
        return connectNodes(new Node("/"),
            right, // f'(x)
            connectNodes(new Node("*"),
                copyTree(node.left),
                connectNodes(new Node("rt"),
                    copyTree(node.left),
                    connectNodes(new Node("^"),
                        copyTree(node.right), // f(x)
                        connectNodes(new Node("-"), copyTree(node.left), new Node("1"))))));
    break;
    case "sin":
        return connectNodes(new Node("*"),
            connectNodes(new Node("cos"), copyTree(node.left), null), // cos(f(x))
            left); //f'(x)
    break;
    case "cos":
        return connectNodes(new Node("-"),
            connectNodes(new Node("*"),
                connectNodes(new Node("sin"), copyTree(node.left), null), // sin(f(x))
                left), //f'(x)
            null);
    break;
    case "tg":
        return connectNodes(new Node("/"),
                left, //f'(x)
                connectNodes(new Node("^"),
                    connectNodes(new Node("cos"), copyTree(node.left), null), // cos(f(x))
                    new Node("2")));
    break;
    case "ctg":
        return connectNodes(new Node("-"),
            connectNodes(new Node("/"),
                left,
                connectNodes(new Node("^"),
                    connectNodes(new Node("sin"), copyTree(node.left), null), // sin(f(x))
                    new Node("2"))),
            null);
    break;
    case "x":
        return new Node("1");
    default:
        //constant
        return new Node("0");

    }
    console.log("Error in derivativeTree, last node: " + printTree(node));
    return null;
}

function copyTree(root) {
    if(root === null) {
        return null;
    }
    return connectNodes(new Node(root.token), copyTree(root.left), copyTree(root.right));
}

function connectNodes(parent, left, right) {
    parent.left = left;
    parent.right = right;

    if(left !== null) {
        left.parent = parent;
    }

    if(right !== null) {
        right.parent = parent;
    }
    return parent;
}

function isLetter(c) {
  return c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z';
}

function isDigit(c) {
  return c >= '1' && c <= '9';
}

function processFunction(str) {
    str = str.toLowerCase();
    var unary = false;
    switch(str) {
    case "sqrt":
    case "sin":
    case "cos":
    case "tg":
    case "ctg":
    case "ln":
        unary = true;
        break;
    case "rt":
    case "log":
        unary = false;
        break;
    default:
        console.log("Unknown function: " + str);
        return null;
    }
    return new Operator(str, unary, true);
}

function popOperatorFromStack(operatorStack, outputStack) {
    var operator = operatorStack.pop();
    var node = new Node(operator.token);
    if (operator.unary === false) {
        node.right = outputStack.pop();
        node.right.parent = node;
    }

    node.left = outputStack.pop();
    node.left.parent = node;

    outputStack.push(node);
}

function printTree(root) {
    var queue = [];
    queue.push(null);
    queue.push(root);
    var str = "";
    while(queue.length > 0) {
        var cur = queue.shift();
        if(cur === null) {
            if (queue.length > 0) {
                queue.push(null);
                str += '\n';
            }
        }
        else {
            str += cur.token + " ";
            if (cur.token !== "X") {
                if(cur.left !== null) {
                    queue.push(cur.left);
                }
                else {
                    queue.push(new Node("X"));
                }

                if(cur.right !== null) {
                    queue.push(cur.right);
                }
                else {
                    queue.push(new Node("X"));
                }
            }

        }
    }
    console.log(str);
}

function drawTree(root) {
    document.getElementById('treeDiv').style.display = "block";
    var canvas = document.getElementById('treeCanvas');

    var nodeRadPx = 12;

    var height = getTreeHeight(root);
    var width = Math.pow(2, height - 1);

    var heightPx = nodeRadPx * 2 * height * 2;
    var widthPx =  nodeRadPx * 2 * width * 2;
    console.log("width: " + widthPx + ", height: " + heightPx);
    canvas.width = widthPx;
    canvas.height = heightPx;

    drawSubTree(root, canvas, 0, widthPx, nodeRadPx + 1, nodeRadPx);
}

function displayError(msg) {
    document.getElementById('errorDiv').style.display = "block";
    document.getElementById('errorText').innerHTML = msg;
}

function drawSubTree(root, canvas, xMin, xMax, y, nodeRadPx) {
        var ctx = canvas.getContext("2d");

        var x = ( xMax - xMin ) / 2 + xMin;

        var newY = y + nodeRadPx * 3;
        //draw lines
        if(root.left !== null) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(( x - xMin ) / 2 + xMin, newY);
            ctx.stroke();

        }
        if(root.right !== null) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(( xMax - x ) / 2 + x, newY);
            ctx.stroke();
        }

        //draw circle and fill
        ctx.beginPath();
        ctx.arc(x, y, nodeRadPx, 0, 2*Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.stroke();

        //draw text
        ctx.font = "12px Arial";
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(root.token, x, y + nodeRadPx / 2);

        //draw children
        if(root.left !== null) {
            drawSubTree(root.left, canvas, xMin, x, newY, nodeRadPx);
        }
        if(root.right !== null) {
            drawSubTree(root.right, canvas, x, xMax, newY, nodeRadPx);
        }
}

function getTreeHeight(root) {
    if (root === null) {
        return 0;
    }
    var leftH = getTreeHeight(root.left);
    var rightH = getTreeHeight(root.right);

    if (leftH > rightH) {
        return leftH + 1;
    } else {
        return rightH + 1;
    }
}

function Node(token) {
    this.parent = null;
    this.left = null;
    this.right = null;
    this.token = token;
}

function Operator(token, unary, func) {
    this.token = token;
    //prio
    this.prio = 0;
    //type (binary/unary)
    this.unary = unary;
    this.func = func;
    this.prio = 0;
    // priority - not needed for functions
    if(!this.func) {
        if(this.unary) {
            // only minus here
            this.prio = 5;
        }
        else {
            // binary operators
            if(token === '+' || token === '-' ) {
                this.prio = 3;
            }
            else if (token === '*' || token === '/' ) {
                this.prio = 4;
            }
            else if (token === '^') {
                this.prio = 6;
            }
        }
    }
}

function isOperator(token) {
    if( token === '+' || token === '-' || token === '*' || token === '/' || token === '^') {
        return true;
    }
    return false;
}







