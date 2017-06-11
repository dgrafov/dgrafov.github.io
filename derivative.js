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
        return additionDerivative(node, left, right);
    break;
    case "-":
        return substractionDerivative(node, left, right);
    break;
    case "*":
        return multiplicationDerivative(node, left, right);
    break;
    case "/":
        return divisionDerivative(node, left, right);
    break;
    case "^":
        return powerDerivative(node, left, right);
    break;
    case "log":
        return logDerivative(node, left, right);
    break;
    case "ln":
        return lnDerivative(node, left);
    break;
    case "sqrt":
        return sqrtDerivative(node, left);
    break;
    case "rt":
        return rtDerivative(node, left, right);
    break;
    case "sin":
        return sinDerivative(node, left, right);
    break;
    case "cos":
        return cosDerivative(node, left, right);
    break;
    case "tg":
        return tgDerivative(node, left, right);
    break;
    case "ctg":
        return ctgDerivative(node, left, right);
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

function additionDerivative(node, left, right) {
    //check for constant
    if (left.token === "0" && right.token === "0") {
        return new Node("0");
    }
    if(left.token === "0") {
        return right;
    }
    if(right.token === "0") {
        return left;
    }
    return connectNodes(new Node("+"), left, right);
}

function substractionDerivative(node, left, right) {
    //unary
    if(node.right === null) {
        if (left.token === "0") {
            return new Node("0");
        }
        return connectNodes(new Node("-"), left, null);
    }
    //binary
    //check for constant
    if (left.token === "0" && right.token === "0") {
        return new Node("0");
    }
    if(left.token === "0") {
        return connectNodes(new Node("-"), right, null);
    }
    if(right.token === "0") {
        return left;
    }
    return connectNodes(new Node("-"), left, right);
}

function multiplicationDerivative(node, left, right) {
    //check for constant
    if (left.token === "0" && right.token === "0") {
        return new Node("0");
    }
    if(left.token === "0") {
        return connectNodes(new Node("*"), copyTree(node.left), right); //(k*f(x))' = k*f'(x)
    }
    if(right.token === "0") {
        return connectNodes(new Node("*"), left, copyTree(node.right)); //(f(x)*k)' = f'(x)*k
    }
    return connectNodes(new Node("+"),
        connectNodes(new Node("*"), left, copyTree(node.right)), // u'*v
        connectNodes(new Node("*"), copyTree(node.left), right)); // u*v'
}

function divisionDerivative(node, left, right) {
    //check for constant
    if (left.token === "0" && right.token === "0") {
        return new Node("0");
    }
    if(left.token === "0") {
        return connectNodes(new Node("/"),
            connectNodes(new Node("-"),
                connectNodes(new Node("*"), copyTree(node.left), right), // a*f'(x)
                null),
            connectNodes(new Node("^"), copyTree(node.right), new Node("2"))); // f(x)^2
    }
    if(right.token === "0") {
        return connectNodes(new Node("/"), left, copyTree(node.right)); //(f(x)/k)' = f'(x)/k
    }

    return connectNodes(new Node("/"),
        connectNodes(new Node("-"),
            connectNodes(new Node("*"), left, copyTree(node.right)), // u'*v
            connectNodes(new Node("*"), copyTree(node.left), right)), // u*v'
        connectNodes(new Node("^"),
            copyTree(node.right),   // v
            new Node("2"))); // v
}

function powerDerivative(node, left, right) {
    //check for constant
    if (left.token === "0" && right.token === "0") {
        return new Node("0");
    }
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
}

function logDerivative(node, left, right) {
    //check for constant
    if (left.token === "0" && right.token === "0") {
        return new Node("0");
    }
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
}

function lnDerivative(node, left) {
    //check for constant
    if (left.token === "0") {
        return new Node("0");
    }

    return connectNodes(new Node("/"), left, copyTree(node.left)); // f'(x)/f(x)
}

function sqrtDerivative(node, left) {
    //check for constant
    if (left.token === "0") {
        return new Node("0");
    }

    return connectNodes(new Node("/"),
            left, // f'(x)
            connectNodes(new Node("*"),
                new Node("2"),
                connectNodes(new Node("sqrt"), copyTree(node.left), null)));
}


function rtDerivative(node, left, right) {
    //check for constant
    if (left.token === "0" && right.token === "0") {
        return new Node("0");
    }
    if(left.token === "0") {
        return connectNodes(new Node("/"),
                right, // f'(x)
                connectNodes(new Node("*"),
                    copyTree(node.left),
                    connectNodes(new Node("rt"),
                        copyTree(node.left),
                        connectNodes(new Node("^"),
                            copyTree(node.right), // f(x)
                            connectNodes(new Node("-"), copyTree(node.left), new Node("1"))))));
    }
    return derivative(
        connectNodes(new Node("^"),
            copyTree(node.right),
            connectNodes(new Node("/"),
                new Node("1"),
                copyTree(node.left))));
}

function sinDerivative(node, left, right) {
    //check for constant
    if(left.token === "0") {
        return new Node("0");
    }
    return connectNodes(new Node("*"),
        connectNodes(new Node("cos"), copyTree(node.left), null), // cos(f(x))
        left); //f'(x)
}

function cosDerivative(node, left, right) {
    //check for constant
    if(left.token === "0") {
        return new Node("0");
    }
    return connectNodes(new Node("-"),
        connectNodes(new Node("*"),
            connectNodes(new Node("sin"), copyTree(node.left), null), // sin(f(x))
            left), //f'(x)
        null);
}

function tgDerivative(node, left, right) {
    //check for constant
    if(left.token === "0") {
        return new Node("0");
    }
    return connectNodes(new Node("/"),
            left, //f'(x)
            connectNodes(new Node("^"),
                connectNodes(new Node("cos"), copyTree(node.left), null), // cos(f(x))
                new Node("2")));
}

function ctgDerivative(node, left, right) {
    //check for constant
    if(left.token === "0") {
        return new Node("0");
    }
    return connectNodes(new Node("-"),
        connectNodes(new Node("/"),
            left,
            connectNodes(new Node("^"),
                connectNodes(new Node("sin"), copyTree(node.left), null), // sin(f(x))
                new Node("2"))),
        null);
}


























