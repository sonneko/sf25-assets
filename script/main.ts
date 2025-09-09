import { validateSource, validateOutput } from "./validate.js";
import { buildAssets, buildDocs, buildTypeDeclarationFile } from "./build.js";

async function main() {
    validateSource();
    buildAssets();
    validateOutput();
    buildDocs();
    await buildTypeDeclarationFile();
}

main();