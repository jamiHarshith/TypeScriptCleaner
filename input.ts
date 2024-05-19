// input.ts


function correctFunction(a: number, b: number): number {
    return a + b;
}
function errorFunction1(a: string, b: number): number {
    return a + b; // Type error
}
function syntaxErrorFunction(a, b: number) {
    return a + b // Syntax error: missing semicolon
}

function correctFunction1(a: string, b: string): string {
    return a +  // Type error
}
