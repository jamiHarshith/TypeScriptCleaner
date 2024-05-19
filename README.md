# TypeScript Cleaner

## Overview
This is a project to clean up your TypeScript code.

## Features / Edge cases handled:

- Identifies and removes code with syntactic errors (e.g., missing semicolons).
- Identifies and removes code with semantic errors (e.g., type mismatches, undeclared variables).
- Handles nested errors, incomplete constructs, and complex expressions.
- Enforces strict type-checking rules to capture implicit `any` types and other strict type checks.

## How to use
Assuming you have python, node and npm installed, you can run the following command to install and use the project:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd TypeScriptCleaner

2. **Install TypeScript**:
   ```bash
   npm install typescript

3. **Install Flask**:
   ```bash
   pip install Flask

4. **Run the TypeScript cleaner**:
    ```bash
    python app.py

5. **Create an input TypeScript file**:
    ```
        // Syntax error: missing semicolon
        function syntaxErrorFunction(a, b: number) {
            return a + b // Syntax error: missing semicolon
        }

        // Type error: incompatible types
        function typeErrorFunction() {
            let x: number = "This is a type error";
        }

        // Implicit any type error
        function implicitAnyFunction(a, b) {
            return a + b;
        }

        // Valid function
        function validFunction(a: number, b: number): number {
            return a + b;
        }

        // Reference error: variable not defined
        function referenceErrorFunction() {
            console.log(notDefinedVariable);
        }

        // Nested error
        function nestedErrorFunction() {
            if (true) {
                let x: number = "Nested type error";
            }
        }

        // Incomplete construct
        function incompleteFunction(a: number, b: number) {
            return a + // Incomplete return statement
        }

        // Multiple declarations with an error
        let a = 1, b = "Error"; // Type error`
    ```

6. **Run the App on Browser**:
    app should be running at `http://127.0.0.1:5000` enter the URL in your browser to access the UI.
    
    And you can input your file and submit to get your cleaned output and is stored in `correct_code.ts`.
    And the wrong and removed code will be stored in `wrong_code.ts`
