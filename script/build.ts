import fs from "fs";
import path from "path";
import { readFileFromPath, parseAsYaml, removeFileExtension } from "./lib.js";

function generateTsInterface(schemaName: string, schema: any): string {
    let tsInterface = `export interface ${schemaName} {
`;
    for (const key in schema.properties) {
        const prop = schema.properties[key];
        let type = "any";
        if (prop.type === "string") {
            type = "string";
        } else if (prop.type === "number") {
            type = "number";
        } else if (prop.type === "boolean") {
            type = "boolean";
        } else if (prop.type === "array") {
            // This is a simplified assumption, needs more robust handling for array item types
            type = "any[]"; 
        } else if (prop.type === "object") {
            // This is a simplified assumption, needs more robust handling for nested objects
            type = "any";
        }
        const optional = schema.required && !schema.required.includes(key) ? "?" : "";
        tsInterface += `    ${key}${optional}: ${type};
`;
    }
    tsInterface += `}
`;
    return tsInterface;
}

export function buildDocs() {

}

export function buildAssets() {

}

export function buildTypeDeclarationFile() {
    console.log("Building TypeScript declaration files...");

    // Build source type declarations
    const sourceSchemaPath = "schemas/source/booth.schema.yaml";
    const sourceSchemaContent = readFileFromPath(sourceSchemaPath);
    const parsedSourceSchema = parseAsYaml(sourceSchemaContent);
    const schemaName = "Booth"; // Assuming a simple mapping for now
    const tsInterface = generateTsInterface(schemaName, parsedSourceSchema);

    const outputPath = `dist/source/${removeFileExtension(path.basename(sourceSchemaPath))}.d.ts`;
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, tsInterface);
    console.log(`Generated ${outputPath}`);

    console.log("TypeScript declaration files built.");
}