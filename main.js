
//simplification

// -1 * x
// f(x) / -f(x)
// f(x) / f(x)*k ????
// u(x)/(f(x)/g(x))
// (-x)^2k
// f(x) + (-g(x))

// log(f(x), f(x))

// (x^a)^b = x ^ (a+b)

//improvements: parse 2x, 2tg (x+b)(x+c) etc

//add arc- functions

// TODO Refactoring introduce a separate token for unary minus not to check children every time

//TODO Fix a stupid approach of having only left child for unary operators and functions. It should be left for post-operator
//and right - for pre-operator

var originalTree = null;
var derivativeTree = null;
var lastInput = null;

function loadExample(exampleId) {
    document.getElementById('function').value = document.getElementById(exampleId).innerHTML;
}

function calculateDerivative() {
    var input = document.getElementById('function').value;

    if(input.length > 0) {
        input = input.split(' ').join('');

        if(lastInput !== input) {
            lastInput = input;
            originalTree = null;
            derivativeTree = null;
            var ret = buildTree(input);
            if(ret[0] === true) {
                derivativeTree = simplify(derivative(ret[1]));
                originalTree = ret[1];

                displayResult(buildExpression(derivativeTree));
            }
            else {
                displayError(ret[1]);
            }
        }
    }
    else {
        displayError(currentLanguage.noFunctionError);
    }
}

function showOriginalTree() {
    if(originalTree !== null) {
        drawTree(originalTree, "originalTreeDiv", "originalTreeCanvas");

        var button = document.getElementById('originalTreeButton');
        button.onclick = hideOriginalTree;
        button.innerHTML = "^";
    }
    else {
        displayError(currentLanguage.noTreeError);
    }
}

function hideOriginalTree() {
    document.getElementById('originalTreeDiv').style.display = "none";

    var button = document.getElementById('originalTreeButton');
    button.onclick = showOriginalTree;
    button.innerHTML = "v";
}

function showDerivativeTree() {
    if(derivativeTree !== null) {
        drawTree(derivativeTree, "derivativeTreeDiv", "derivativeTreeCanvas");

        var button = document.getElementById('derivativeTreeButton');
        button.onclick = hideDerivativeTree;
        button.innerHTML = "^";
    }
    else {
        displayError(currentLanguage.noTreeError);
    }
}

function hideDerivativeTree() {
    document.getElementById('derivativeTreeDiv').style.display = "none";

    var button = document.getElementById('derivativeTreeButton');
    button.onclick = showDerivativeTree;
    button.innerHTML = "v";
}

function displayError(msg) {
    document.getElementById('errorDiv').style.display = "block";
    document.getElementById('errorText').innerHTML = msg;
    hideResult();
}

function displayResult(res) {
    document.getElementById('difDiv').style.display = "block";
    document.getElementById('result').innerHTML = res;
    hideOriginalTree();
    hideDerivativeTree();
    hideError();
}

function showSupportedSymbols() {
    document.getElementById('supportedSymbols').style.display = "block";
    var button = document.getElementById('supportedSymbolsButton');
    button.onclick = hideSupportedSymbols;
    button.innerHTML = "^";
}

function hideSupportedSymbols() {
    document.getElementById('supportedSymbols').style.display = "none";
    var button = document.getElementById('supportedSymbolsButton');
    button.onclick = showSupportedSymbols;
    button.innerHTML = "v";
}


function hideError() {
    document.getElementById('errorDiv').style.display = "none";
}

function hideResult() {
    document.getElementById('difDiv').style.display = "none";
    hideDerivativeTree();
    hideOriginalTree();
}














