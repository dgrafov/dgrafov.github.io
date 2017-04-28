

/*

sqrt(x)
rt(n, x)
sin
cos
tg
ctg
e^x
a^x
ln(x)
log(a, x)

удалить пробелы
обработка ошибок (пустой стек)
*/
window.onload = function() {
	document.getElementById('out').innerHTML = 'Hello JavaScript!'
	var input = "(-3*(x+1)-8/(-x))/(x^(2+k)+x)";
	var opStack = [];
	var outStack = [];

	for(i in input) {
		console.log("Token: " + input[i]);

		if(isOperator(input[i])) {
			if((i == 0 || input[i - 1] === '(') && input[i] === '-') {
				// unary minus
				var op = new Operator(input[i], true);
			}
			else{
				var op = new Operator(input[i], false);
			}

			console.log("Operator (" + op.prio + ")");

			while(opStack.length > 0
				&& opStack[opStack.length - 1] !== '('
				&& op.prio <= opStack[opStack.length - 1].prio)
			{
				popOperatorFromStack(opStack, outStack);
			}
			opStack.push(op);
		}

		else if(input[i] === '(') {
			console.log("Opening bracket");
			opStack.push(input[i]);
		}

		else if(input[i] === ')') {
			console.log("Closing bracket");

			while(opStack.length > 0 && opStack[opStack.length - 1] !== '(')
			{
				popOperatorFromStack(opStack, outStack);
			}

			if(opStack.length > 0 && opStack[opStack.length - 1] === '(') {
				opStack.pop();
			}

		}
		else {
			console.log("Operand");
			outStack.push(new Node(input[i]));
		}
	}

	while(opStack.length > 0)
	{
		popOperatorFromStack(opStack, outStack);
	}

	console.log("outStack:" + outStack.length);
	printTree(outStack[0]);


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

function Node(token) {
    this.parent = null;
    this.left = null;
    this.right = null;
    this.token = token;
}

function Operator(token, unary) {
    this.token = token;
    //prio
    this.prio = 0;
    //type (binary/unary)
    this.unary = false;
   	if(unary) {
   		this.unary = true;
   		// only minus here
   		this.prio = 4;
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

function isOperator(token) {
	if( token === '+' || token === '-' || token === '*' || token === '/' || token === '^') {
		return true;
	}
	return false;
}







