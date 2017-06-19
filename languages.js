var russian =
{
    title: "Символьное вычисление производной",
    mainHeader: "Символьное вычисление производной",
    supportedSymbols: "Поддерживаемые символы: ",
    supportedSymbolsTable:
        "<tr>" +
            "<th>Обозначение</th>" +
            "<th>Описание</th>" +
        "</tr>" +
        "<tr>" +
            "<td>.</td>" +
            "<td>Десятичный разделитель</td>" +
        "</tr>" +
        "<tr>" +
            "<td>,</td>" +
            "<td>Разделитель аргументов функции</td>" +
        "</tr>" +
        "<tr>" +
            "<td>+</td>" +
            "<td>Сложение</td>" +
        "</tr>" +
        "<tr>" +
            "<td>-</td>" +
            "<td>Вычитание</td>" +
        "</tr>" +
        "<tr>" +
            "<td>-</td>" +
            "<td>Унарный минус</td>" +
        "</tr>" +
        "<tr>" +
            "<td>*</td>" +
            "<td>Умножение</td>" +
        "</tr>" +
        "<tr>" +
            "<td>/</td>" +
            "<td>Деление</td>" +
        "</tr>" +
        "<tr>" +
            "<td>^</td>" +
            "<td>Возведение в степень</td>" +
        "</tr>" +
        "<tr>" +
            "<td>e</td>" +
            "<td>Константа, основание натурального логарифма</td>" +
        "</tr>" +
        "<tr>" +
            "<td>(</td>" +
            "<td>Открывающая скобка</td>" +
        "</tr>" +
        "<tr>" +
            "<td>)</td>" +
            "<td>Закрывающая скобка</td>" +
        "</tr>" +
        "<tr>" +
            "<td>sqrt</td>" +
            "<td>Извлечение квадратного корня: sqrt(x)</td>" +
        "</tr>" +
        "<tr>" +
            "<td>rt</td>" +
            "<td>Извлечение корня заданной степени: rt(n, x)</td>" +
        "</tr>" +
        "<tr>" +
            "<td>sin</td>" +
            "<td>Синус: sin(x)</td>" +
        "</tr>" +
        "<tr>" +
            "<td>cos</td>" +
            "<td>Косинус: cos(x)</td>" +
        "</tr>" +
        "<tr>" +
            "<td>tg</td>" +
            "<td>Тангенс: tg(x)</td>" +
        "</tr>" +
        "<tr>" +
            "<td>ctg</td>" +
            "<td>Котангенс: ctg(x)</td>" +
        "</tr>" +
        "<tr>" +
            "<td>ln</td>" +
            "<td>Натуральный логарифм: ln(x)</td>" +
        "</tr>" +
        "<tr>" +
            "<td>log</td>" +
            "<td>Логарифм по заданномy основанию: log(n, x)</td>" +
        "</tr>",
    examples: "Примеры: ",
    insertExample: "Вставить",
    calculate: "Вычислить df(x)/dx",
    errorHeader: "Что-то пошло не так:",
    derivativeHeader: "Производная:",
    functionSyntaxTreeHeader: "Синтаксическое дерево для функции: ",
    derivativeSyntaxTreeHeader: "Синтаксическое дерево для производной: ",
    aboutHeader: "О проекте:",
    about: "<p>" +
        "Эта страница демонстрирует реализацию символьного вычисления производной функции одной переменной с использованием" +
        "<a href='https://ru.wikipedia.org/wiki/%D0%90%D0%B1%D1%81%D1%82%D1%80%D0%B0%D0%BA%D1%82%D0%BD%D0%BE%D0%B5_%D1%81%D0%B8%D0%BD%D1%82%D0%B0%D0%BA%D1%81%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B5_%D0%B4%D0%B5%D1%80%D0%B5%D0%B2%D0%BE'>абстрактного синтаксического дерева</a>. " +
        "Дерево строится с помощью <a href='https://ru.wikipedia.org/wiki/%D0%90%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC_%D1%81%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BE%D1%87%D0%BD%D0%BE%D0%B9_%D1%81%D1%82%D0%B0%D0%BD%D1%86%D0%B8%D0%B8' >Алгоритма сортировочной станции</a>." +
        "</p>" +
        "<p>" +
        "После вычисления производной можно также посмотреть деревья, которые получились при разборе исходной функции и вычислении ее производной." +
        "</p>" +
        "<p>" +
        "Все вычисления производятся в браузере, без участия сервера. Полный код реализаци можно посмотреть в коде страницы." +
        "</p>" +
        "<p>" +
        "Если у вас есть вопрос, можете написать мне письмо: <a href='mailto:dvgrafov@gmail.com'>dvgrafov@gmail.com</a>" +
        "</p>",
    noFunctionError: "Введите функцию",
    noTreeError: "Сначала вычислите производную",
    unknownFunctionError: "Неизвестная функция: ",
    unknownSymbolError: "Неизвестный символ: ",
    noClosingBracketError: "Не хватает закрывающей скобки",
    noOpeningBracketError: "Не хватает открывающей скобки",
    notEnoughOperandsError: "Не хватает операндов для оператора: "
}

var english =
{
    title: "Symbolic computation of the derivative",
    mainHeader: "Symbolic computation of the derivative",
    supportedSymbols: "Supported symbols: ",
    supportedSymbolsTable:
        "<tr>" +
            "<th>Designation</th>" +
            "<th>Description</th>" +
        "</tr>" +
        "<tr>" +
            "<td>.</td>" +
            "<td>Decimal separator</td>" +
        "</tr>" +
        "<tr>" +
            "<td>,</td>" +
            "<td>Function arguments separator</td>" +
        "</tr>" +
        "<tr>" +
            "<td>+</td>" +
            "<td>Addition</td>" +
        "</tr>" +
        "<tr>" +
            "<td>-</td>" +
            "<td>Substraction</td>" +
        "</tr>" +
        "<tr>" +
            "<td>-</td>" +
            "<td>Unary minus</td>" +
        "</tr>" +
        "<tr>" +
            "<td>*</td>" +
            "<td>Multiplication</td>" +
        "</tr>" +
        "<tr>" +
            "<td>/</td>" +
            "<td>Division</td>" +
        "</tr>" +
        "<tr>" +
            "<td>^</td>" +
            "<td>Exponentiation</td>" +
        "</tr>" +
        "<tr>" +
            "<td>e</td>" +
            "<td>A constant, Base of the natural logarithm</td>" +
        "</tr>" +
        "<tr>" +
            "<td>(</td>" +
            "<td>Opening bracket</td>" +
        "</tr>" +
        "<tr>" +
            "<td>)</td>" +
            "<td>Closing bracket</td>" +
        "</tr>" +
        "<tr>" +
            "<td>sqrt</td>" +
            "<td>Square root: sqrt(x)</td>" +
        "</tr>" +
        "<tr>" +
            "<td>rt</td>" +
            "<td>n-th root: rt(n, x)</td>" +
        "</tr>" +
        "<tr>" +
            "<td>sin</td>" +
            "<td>Sine: sin(x)</td>" +
        "</tr>" +
        "<tr>" +
            "<td>cos</td>" +
            "<td>Cosine: cos(x)</td>" +
        "</tr>" +
        "<tr>" +
            "<td>tg</td>" +
            "<td>Tangent: tg(x)</td>" +
        "</tr>" +
        "<tr>" +
            "<td>ctg</td>" +
            "<td>Cotangent: ctg(x)</td>" +
        "</tr>" +
        "<tr>" +
            "<td>ln</td>" +
            "<td>Natural logarithm: ln(x)</td>" +
        "</tr>" +
        "<tr>" +
            "<td>log</td>" +
            "<td>Base n logarithm: log(n, x)</td>" +
        "</tr>",
    examples: "Examples: ",
    insertExample: "Insert",
    calculate: "Calculate df(x)/dx",
    errorHeader: "Something went wrong:",
    derivativeHeader: "Derivative:",
    functionSyntaxTreeHeader: "Function syntax tree: ",
    derivativeSyntaxTreeHeader: "Derivative syntax tree: ",
    aboutHeader: "About:",
    about: "<p>" +
        "The page demonstrates the implementation of the symbolic computation of the derivative using the " +
        "<a href='https://en.wikipedia.org/wiki/Abstract_syntax_tree'>abstract syntax tree</a>. " +
        "The tree is built by the <a href='https://en.wikipedia.org/wiki/Shunting-yard_algorithm' >Shunting-yard algorithm</a>. " +
        "</p>" +
        "<p>" +
        "After the derivative computation you can also see the syntax trees which were built from the input function and while computing the derivative." +
        "</p>" +
        "<p>" +
        "All computations are done in browser, no server connection is needed. The full Javascript code can be seen in page sources." +
        "</p>" +
        "<p>" +
        "If you have a question, you can contact me: <a href='mailto:dvgrafov@gmail.com'>dvgrafov@gmail.com</a>" +
        "</p>",
    noFunctionError: "Enter function first",
    noTreeError: "Calculate derivative first",
    unknownFunctionError: "Unknown function: ",
    unknownSymbolError: "Unknown symbol: ",
    noClosingBracketError: "Lack of closing bracket",
    noOpeningBracketError: "Lack of opening bracket",
    notEnoughOperandsError: "Lack of operands for the operator: "
}



var currentLanguage = english;

function changeLanguage (language) {
    currentLanguage = language;

    document.title = language.title;
    document.getElementById('mainHeader').innerHTML = language.mainHeader;

    document.getElementById('supportedSymbolsHeader').innerHTML = language.supportedSymbols;
    document.getElementById('supportedSymbols').innerHTML = language.supportedSymbolsTable;
    document.getElementById('examplesHeader').innerHTML = language.examples;
    for (i = 1; i < 7; i++) {
        //loop all examples
        document.getElementById('example' + i + 'Button').innerHTML = language.insertExample;
    }
    document.getElementById('calculateButton').innerHTML = language.calculate;
    document.getElementById('errorHeader').innerHTML = language.errorHeader;
    document.getElementById('derivativeHeader').innerHTML = language.derivativeHeader;
    document.getElementById('functionSyntaxTreeHeader').innerHTML = language.functionSyntaxTreeHeader;
    document.getElementById('derivativeSyntaxTreeHeader').innerHTML = language.derivativeSyntaxTreeHeader;
    document.getElementById('aboutHeader').innerHTML = language.aboutHeader;
    document.getElementById('about').innerHTML = language.about;

}

function getLanguage() {
    var name = "lang";
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search)) {
        switch(decodeURIComponent(name[1])) {
        case "en":
            return english;
        case "ru":
            return russian;
        default:
            //constant
            return english;
        }
    }
    return english;

}
