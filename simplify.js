function simplify(node) {
    if(node === null) {
        return null;
    }
    if(node.left !== null) {
        node.left = simplify(node.left);
    }
    if(node.right !== null) {
        node.right = simplify(node.right);
    }

    switch(node.token) {
    case "+":
        return simplifyAddition(node);
    case "-":
        return simplifySubstraction(node);
    case "*":
        return simplifyMultiplication(node);
    case "/":
        return simplifyDivision(node);
    case "^":
        return simplifyPower(node);
    case "log":
        return simplifyLog(node);
    case "ln":
        return simplifyLn(node);
    case "sqrt":
        return simplifySqrt(node);;
    case "rt":
        return simplifyRt(node);;
    case "sin":
    case "cos":
    case "tg":
    case "ctg":
        return simplifyTrigonometry(node);
    }
    return node;
}

function simplifyAddition(node) {
    var leftNum = toNumber(node.left);
    var rightNum = toNumber(node.right);
    var newNode = null;
    if(!isNaN(leftNum) && !isNaN(rightNum)) {
        newNode = calculate(node, leftNum, rightNum);
    }
    else if(!isNaN(leftNum)) {
        if( leftNum === 0 ) {
            newNode = node.right;
        }
    }
    else if(!isNaN(rightNum)) {
        if( rightNum === 0 ) {
            newNode = node.left;
        }
    }
    var ret = node;
    if(newNode !== null) {
        ret = nodeSubstitute(node, newNode);
    }

    if( ret.right.token === "-" && ret.right.right === null ) {
        //unary minus to the right
        ret.token = "-";
        ret.right = ret.right.left;
    }

    return ret;
}

function simplifyBinaryMinus(node) {
    var newNode = null;
    var leftNum = toNumber(node.left);
    if(!isNaN(leftNum)) {
        newNode = new Node((leftNum * -1).toString());
    }
    else {
        if(node.left.token === "-" && node.left.right === null) {
            newNode = node.left.left;
        }
    }
    return newNode
}


function simplifySubstraction(node) {
    var newNode = null;
    if(node.right === null) {
        newNode = simplifyBinaryMinus(node);
    }
    else {
        var leftNum = toNumber(node.left);
        var rightNum = toNumber(node.right);

        if(!isNaN(leftNum) && !isNaN(rightNum)) {
            newNode = calculate(node, leftNum, rightNum);
        }
        else if(!isNaN(leftNum)) {
            if( leftNum === 0 ) {
                node.left = node.right;
                node.right = null;
            }
        }
        else if(!isNaN(rightNum)) {
            if( rightNum === 0 ) {
                newNode = node.left;
            }
        }

    }

    var ret = node;
    if(newNode !== null) {
        ret = nodeSubstitute(node, newNode);
    }

    if( ret.right != null && ret.right.token === "-" && ret.right.right === null ) {
        //unary minus to the right
        ret.token = "+";
        ret.right = ret.right.left;
    }
    return ret;
}

function simplifyMultiplication(node) {
    var leftNum = toNumber(node.left);
    var rightNum = toNumber(node.right);
    var newNode = null;
    if(!isNaN(leftNum) && !isNaN(rightNum)) {
        newNode = calculate(node, leftNum, rightNum);
    }
    else if(!isNaN(leftNum)) {
        if(leftNum === 0) {
            newNode = new Node("0");
        }
        else if(leftNum === 1) {
            newNode = node.right;
        }
    }
    else if(!isNaN(rightNum)) {
        if( rightNum === 0 ) {
            newNode = new Node("0");
        }
        else if( rightNum === 1 ) {
            newNode = node.left;
        }
    }

    if(newNode !== null) {
        return nodeSubstitute(node, newNode);
    }
    return node;
}

function simplifyDivision(node) {
    var leftNum = toNumber(node.left);
    var rightNum = toNumber(node.right);
    var newNode = null;
    if(!isNaN(leftNum) && !isNaN(rightNum)) {
        newNode = calculate(node, leftNum, rightNum);
    }
    else if(!isNaN(leftNum)) {
        if(leftNum === 0) {
            newNode = new Node("0");
        }
    }
    else if(!isNaN(rightNum)) {
        if( rightNum === 1 ) {
            newNode = node.left;
        }
    }

    if(newNode !== null) {
        return nodeSubstitute(node, newNode);
    }
    return node;
}

function simplifyPower(node) {
    var leftNum = toNumber(node.left);
    var rightNum = toNumber(node.right);
    var newNode = null;
    if(!isNaN(leftNum) && !isNaN(rightNum)) {
        newNode = calculate(node, leftNum, rightNum);
    }
    else if(!isNaN(leftNum)) {
        if(leftNum === 0) {
            newNode = new Node("0");
        }
        else if(leftNum === 1) {
            newNode = new Node("1");
        }
    }
    else if(!isNaN(rightNum)) {
        if(rightNum === "0") {
            newNode = new Node("1");
        }
        else if(rightNum === 1) {
            newNode = node.left;
        }
    }

    if(newNode !== null) {
        return nodeSubstitute(node, newNode);
    }
    return node;
}

function calculateLog(node, leftNum, rightNum) {
    var count = 0;
    while(rightNum != 1) {
        if(rightNum % leftNum === 0) {
            rightNum = rightNum / leftNum;
            count++;
        }
        else {
            return null;
        }
    }
    return new Node(count.toString());
}

function simplifyLog(node) {
    var leftNum = toNumber(node.left);
    var rightNum = toNumber(node.right);
    var newNode = null;
    if(!isNaN(leftNum) && !isNaN(rightNum)) {
        newNode = calculateLog(node, leftNum, rightNum);
    }

    else if(!isNaN(rightNum)) {
     if(rightNum === 1) {
            newNode = new Node("0");
        }
    }

    if(newNode !== null) {
        return nodeSubstitute(node, newNode);
    }
    return node;
}

function simplifyLn(node) {
    var leftNum = toNumber(node.left);
    var newNode = null;
    if(!isNaN(leftNum)) {
     if(leftNum === 1) {
            newNode = new Node("0");
        }
    }

    if(newNode !== null) {
        return nodeSubstitute(node, newNode);
    }
    return node;
}

function calculateRt(node, leftNum, rightNum) {
    rt = Math.pow(rightNum, 1 / leftNum);
    if(rt % 1 === 0) {
        return new Node(rt.toString());
    }
    return null;
}

function simplifyRt(node) {
    var leftNum = toNumber(node.left);
    var rightNum = toNumber(node.right);
    var newNode = null;
    if(!isNaN(leftNum) && !isNaN(rightNum)) {
        newNode = calculateRt(node, leftNum, rightNum);
    }
    else if(!isNaN(leftNum)) {
        if(leftNum === 1) {
            newNode = node.right;
        }
    }
    else if(!isNaN(rightNum)) {
        if(rightNum === 0) {
            newNode = new Node("0");
        }
        else if(rightNum === 1) {
            newNode = new Node("1");
        }
    }

    if(newNode !== null) {
        return nodeSubstitute(node, newNode);
    }
    return node;
}

function simplifySqrt(node) {
    var leftNum = 2;
    var rightNum = toNumber(node.left);
    var newNode = null;

    if(!isNaN(rightNum)) {
        newNode = calculateRt(node, leftNum, rightNum);
    }

    if(newNode !== null) {
        return nodeSubstitute(node, newNode);
    }
    return node;
}

function simplifyTrigonometry(node) {
    var newNode = null;
    var leftNum = toNumber(node.left);

    if(!isNaN(leftNum) && leftNum === 0) {
        switch(node.token) {
            case "sin":
                newNode = new Node("0");
            break;
            case "cos":
                newNode = new Node("1");
            break;
        }
    }

    if(newNode !== null) {
        return nodeSubstitute(node, newNode);
    }
    return node;
}

function calculate(node, leftNum, rightNum) {
    var newNode = null;
    switch(node.token) {
        case "+":
            newNode = new Node((leftNum + rightNum).toString());
        break;
        case "-":
            newNode = new Node((leftNum - rightNum).toString());
        break;
        case "*":
            newNode = new Node((leftNum * rightNum).toString());
        break;
        case "/":
            if(leftNum % rightNum === 0 && rightNum !== 0) {
                newNode = new Node((leftNum / rightNum).toString());
            }
        break;
        case "^":
            newNode = new Node(Math.pow(leftNum, rightNum).toString());
        break;
    }
    return newNode;
}