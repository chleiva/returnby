// Scientific Calculator Implementation
// Handles button clicks, arithmetic operations, scientific functions, and error handling.

// Initialize calculator state and attach event listeners
function initCalculator() {
    // DOM Elements
    const calcInput = document.getElementById('calc-input');
    const calcResult = document.getElementById('calc-result');
    const buttons = document.querySelectorAll('.button');

    // Memory variable
    let memory = 0;

    // Initialize calculator state
    calcInput.value = '';
    calcResult.textContent = '0';
    
    // Attach event listeners to buttons
    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });

    // Handle button clicks
    function handleButtonClick(event) {
        const button = event.target;
        const buttonId = button.id;
        const buttonText = button.textContent;
        const currentInput = calcInput.value;
        
        // Handle digit buttons
        if (button.classList.contains('button-digit')) {
            if (buttonId === 'decimal') {
                // Prevent multiple decimals in a number
                if (!currentInput.includes('.') || !currentInput.split(/[\+\-\*\/]/).pop().includes('.')) {
                    calcInput.value += buttonText;
                }
            } else {
                calcInput.value += buttonText;
            }
        }
        // Handle operation buttons
        else if (button.classList.contains('button-operation')) {
            if (buttonId === 'subtract' && (currentInput === '' || /[\+\-\*\/]$/.test(currentInput))) {
                // Handle negative numbers
                calcInput.value += buttonText;
            } else if (!/[\+\-\*\/]$/.test(currentInput)) {
                calcInput.value += buttonText;
            }
        }
        // Handle function buttons
        else if (button.classList.contains('button-function')) {
            handleFunction(buttonId);
        }
        // Handle equals button
        else if (buttonId === 'equals') {
            evaluateExpression();
        }
        // Handle clear button
        else if (buttonId === 'clear') {
            calcInput.value = '';
            calcResult.textContent = '0';
        }
        // Handle backspace button
        else if (buttonId === 'backspace') {
            calcInput.value = currentInput.slice(0, -1);
        }
        // Handle memory buttons
        else if (buttonId === 'memory-clear') {
            memory = 0;
        } else if (buttonId === 'memory-recall') {
            calcInput.value += memory.toString();
        } else if (buttonId === 'memory-plus') {
            memory += parseFloat(calcResult.textContent || '0');
        } else if (buttonId === 'memory-minus') {
            memory -= parseFloat(calcResult.textContent || '0');
        }
    }

    // Handle scientific functions
    function handleFunction(func) {
        const currentInput = calcInput.value;
        let result;
        
        try {
            switch (func) {
                case 'sin':
                    result = Math.sin(parseFloat(currentInput) * Math.PI / 180);
                    break;
                case 'cos':
                    result = Math.cos(parseFloat(currentInput) * Math.PI / 180);
                    break;
                case 'tan':
                    result = Math.tan(parseFloat(currentInput) * Math.PI / 180);
                    break;
                case 'log':
                    result = Math.log10(parseFloat(currentInput));
                    break;
                case 'ln':
                    result = Math.log(parseFloat(currentInput));
                    break;
                case 'sqrt':
                    result = Math.sqrt(parseFloat(currentInput));
                    break;
                case 'pow':
                    calcInput.value += '^';
                    return;
                case 'pi':
                    calcInput.value += Math.PI.toString();
                    return;
                case 'e':
                    calcInput.value += Math.E.toString();
                    return;
                case 'factorial':
                    result = factorial(parseFloat(currentInput));
                    break;
                default:
                    return;
            }
            calcInput.value = '';
            calcResult.textContent = result.toString();
        } catch (error) {
            calcResult.textContent = 'Error';
        }
    }

    // Factorial function
    function factorial(n) {
        if (n < 0 || !Number.isInteger(n)) {
            throw new Error('Invalid input for factorial');
        }
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    // Evaluate the expression with operator precedence and parentheses
    function evaluateExpression() {
        const expression = calcInput.value;
        
        try {
            // Replace ^ with ** for exponentiation
            const processedExpression = expression.replace(/\^/g, '**');
            
            // Validate the expression
            if (!/^[0-9\+\-\*\/\.\s\(\)\*\*]+$/.test(processedExpression)) {
                throw new Error('Invalid characters in expression');
            }
            
            // Evaluate the expression
            const result = new Function(`return ${processedExpression}`)();
            
            // Handle division by zero
            if (!isFinite(result)) {
                throw new Error('Division by zero');
            }
            
            calcResult.textContent = result.toString();
        } catch (error) {
            calcResult.textContent = 'Error';
        }
    }
}