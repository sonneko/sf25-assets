import {validateSource, validateOutput } from "./validate.js";
import { buildAssets, buildDocs, buildTypeDeclarationFile } from "./build.js";

function main() {
    validateSource();
    buildAssets();
    validateOutput();
    buildDocs();
    buildTypeDeclarationFile();
}

main();