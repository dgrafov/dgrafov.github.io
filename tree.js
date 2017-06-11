function buildTree(input) {
    var opStack = [];
    var outStack = [];
    var error = "";

    var i = 0;
    while(i < input.length && error === "") {
        if(isOperator(input[i])) {
            if((i == 0 || input[i - 1] === '(' || input[i - 1] === "," || isOperator(input[i - 1]))
                && input[i] === '-') {
                // unary minus
                var op = new Operator(input[i], true, false);
            }
            else{
                var op = new Operator(input[i], false, false);
            }

            while(opStack.length > 0
                && opStack[opStack.length - 1] !== '('
                && (op.unary === false && op.prio <= opStack[opStack.length - 1].prio
                    || op.unary === true && op.prio < opStack[opStack.length - 1].prio))
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
        return [true, simplify(outStack[0])];
        //return [true, outStack[0]];
    }

    return [false, error];
}

function buildExpression(node) {
    var out = "";
    if(node.left === null && node.right === null) {
        // constant or vairable
        return node.token;
    }

    var leftStr = buildExpression(node.left);
    var rightStr = "";


    if(node.right !== null) {
        rightStr = buildExpression(node.right);
    }

    if(isOperator(node.token)) {
        var opening = "";
        var closing = "";
        if(node.parent !== null && isOperator(node.parent.token)) {
            var parentOp = null;
            var op = null;
            if(node.parent.right === null) {
                parentOp = new Operator(node.parent.token, true, false);
            }
            else {
                parentOp = new Operator(node.parent.token, false, false);
            }

            if(node.right === null) {
                op = new Operator(node.token, true, false);
            }
            else {
                op = new Operator(node.token, false, false);
            }

            if(op.prio < parentOp.prio
                || (op.prio === parentOp.prio && ((parentOp.token === "-"  && node.parent.right === node) || parentOp.token === "^"))) {

                opening = "(";
                closing = ")";
            }

        }


        if (node.right === null) {
            out = opening + node.token + leftStr + closing;
        }
        else {
            out = opening + leftStr + " " + node.token  + " " + rightStr + closing;
        }

    }
    else {
        //function
        if (node.right === null) {
            out = node.token + "(" + leftStr + ")";
        }
        else {
            out = node.token + "(" + leftStr + ", " + rightStr + ")";
        }
    }
    return out;

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

function drawTree(root, divId, canvasId) {
    document.getElementById(divId).style.display = "block";
    var canvas = document.getElementById(canvasId);

    var nodeRadPx = 12;

    var height = getTreeHeight(root);
    var width = Math.pow(2, height - 1);

    var heightPx = nodeRadPx * 2 * height * 2;
    var widthPx =  nodeRadPx * 2 * width * 2;

    canvas.width = widthPx;
    canvas.height = heightPx;

    drawSubTree(root, canvas, 0, widthPx, nodeRadPx + 1, nodeRadPx);
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
                this.prio = 5;
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
  return c >= '0' && c <= '9';
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

function nodeSubstitute(node, newNode) {
    newNode.parent = node.parent;
    if(node.parent !== null) {
        if(node.parent.left === node) {
            node.parent.left = newNode;
        }
        else {
            node.parent.right = newNode;
        }
    }
    return newNode;
}

function toNumber(node) {
    if(node.left === null && node.right === null) {
        return parseFloat(node.token);
    }
    return NaN;
}