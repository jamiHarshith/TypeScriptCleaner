import ts from "typescript";
import fs from "fs";

const inputFilePath = 'input.ts';
const outputFilePath = 'correct_code.ts';
const outputFilePath2 = 'wrong_code.ts';

function cleanCode(filePath) {
    const compilerOptions = {
        noEmit: true,
        strict: true,           // Enable all strict type-checking options
        noImplicitAny: true,    // Raise error on expressions and declarations with an implied 'any' type
        strictNullChecks: true, // Enable strict null checks
        strictFunctionTypes: true,
        strictPropertyInitialization: true,
        noImplicitThis: true,
        alwaysStrict: true
    };
    const program = ts.createProgram([filePath], compilerOptions);
    const sourceCode = fs.readFileSync(filePath, 'utf8');
    const sourceFile = program.getSourceFile(filePath);
    // const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.Latest, true);

    if (!sourceFile) {
        throw new Error(`Could not find file: ${filePath}`);
    }

    // Get syntactic diagnostics using transpileModule
    const transpileOutput = ts.transpileModule(sourceCode, {
        compilerOptions: { noEmit: true, target: ts.ScriptTarget.ESNext },
        reportDiagnostics: true
    });

    // syntactic errors
    // const sourceFile2 = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.Latest, true);

    // const syntacticDiagnostics = ts.getPreEmitDiagnostics(ts.createProgram([filePath], {}));
    // console.log(syntacticDiagnostics);

    // Get all diagnostics, including syntactic and semantic errors
    const semanticDiagnostics = program.getSemanticDiagnostics(sourceFile);
    const declarationDiagnostics = program.getDeclarationDiagnostics(sourceFile);
    const diagnostics = [
        // ...program.getSyntacticDiagnostics(sourceFile),
        ...transpileOutput.diagnostics,
        ...semanticDiagnostics,
        ...declarationDiagnostics
    ];

    const errorNodes = new Set();
    // console.log(diagnostics)

    // diagnostics.forEach(diagnostic => {
    //     if (diagnostic.file) {
    //         const node = findNodeAtPosition(sourceFile, diagnostic.start);
    //         if (node) {
    //             errorNodes.add(node);
    //         }
    //         else{
    //             console.log('didnt find')
    //         }
    //     }
    // });

    diagnostics.forEach(diagnostic => {
        if (diagnostic.start !== undefined && diagnostic.length !== undefined) {
            for (let i = diagnostic.start; i < diagnostic.start + diagnostic.length; i++) {
                errorNodes.add(i);
            }
        }
    });

    // console.log(errorNodes)
    const cleanedStatements = sourceFile.statements.filter(stmt => !containsErrorNode(stmt, errorNodes));
    const wrongStatements = sourceFile.statements.filter(stmt => containsErrorNode(stmt, errorNodes));
    // console.log(wrongStatements)

    //correct code
    const printer = ts.createPrinter();
    const resultFile = ts.createSourceFile(outputFilePath, '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
    const result = printer.printList(ts.ListFormat.MultiLine, ts.factory.createNodeArray(cleanedStatements), resultFile);

    //wrong code
    const resultFile2 = ts.createSourceFile(outputFilePath2, '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
    const result2 = printer.printList(ts.ListFormat.MultiLine, ts.factory.createNodeArray(wrongStatements), resultFile2);

    fs.writeFileSync(outputFilePath, result);
    fs.writeFileSync(outputFilePath2, result2);
    // console.log(`Cleaned code has been written to ${outputFilePath}`);
    // console.log(`Wrong code has been written to ${outputFilePath2}`);
}

function findNodeAtPosition(sourceFile, position) {
    function find(node) {
        if (node.getStart(sourceFile) <= position && node.getEnd() >= position) {
            return ts.forEachChild(node, find) || node;
        }
    }
    return find(sourceFile);
}

// function containsErrorNode(node, errorNodes) {
//     let hasError = false;
//     function find(node) {
//         if (errorNodes.has(node)) {
//             hasError = true;
//             return;
//         }
//         ts.forEachChild(node, find);
//     }
//     find(node);
//     return hasError;
// }

function containsErrorNode(node, errorPositions) {
    let hasError = false;
    function find(node) {
        const start = node.getStart();
        const end = node.getEnd();
        for (let i = start; i < end; i++) {
            if (errorPositions.has(i)) {
                hasError = true;
                return;
            }
        }
        ts.forEachChild(node, find);
    }
    find(node);
    return hasError;
}

cleanCode(inputFilePath);