import fs from "fs";
import path from "path";
import { readFileFromPath, parseAsYaml, removeFileExtension } from "./lib.js";

function generateTsInterface(schemaName: string, schema: any, isRoot = true): string {
    let tsInterface = `export interface ${schemaName} ${isRoot ? '' : 'extends Record<string, unknown> '} {\n`;

    const requiredProps = schema.required || [];

    for (const key in schema.properties) {
        const prop = schema.properties[key];
        const optional = !requiredProps.includes(key) ? "?" : "";
        let type = "any";

        if (prop.type === "string") {
            type = "string";
        } else if (prop.type === "number") {
            type = "number";
        } else if (prop.type === "boolean") {
            type = "boolean";
        } else if (prop.type === "array") {
            const itemType = prop.items ? getTypeFromSchema(prop.items) : "any";
            type = `${itemType}[]`;
        } else if (prop.type === "object") {
            // For nested objects, generate an inline type or a new interface if it's complex
            type = getTypeFromSchema(prop);
        } else if (prop.enum) {
            type = prop.enum.map((e: string | number) => typeof e === 'string' ? `'${e}'` : e).join(" | ");
        }
        tsInterface += `    ${key}${optional}: ${type};
`;
    }
    tsInterface += `}
`;
    return tsInterface;
}

function getTypeFromSchema(propSchema: any): string {
    if (propSchema.type === "string") {
        return "string";
    } else if (propSchema.type === "number") {
        return "number";
    } else if (propSchema.type === "boolean") {
        return "boolean";
    } else if (propSchema.type === "array") {
        const itemType = propSchema.items ? getTypeFromSchema(propSchema.items) : "any";
        return `${itemType}[]`;
    } else if (propSchema.type === "object") {
        // Recursively generate for nested objects
        return generateTsInterface("", propSchema, false);
    } else if (propSchema.enum) {
        return propSchema.enum.map((e: string | number) => typeof e === 'string' ? `'${e}'` : e).join(" | ");
    }
    return "any";
}

export function buildDocs() {

}

export function buildAssets() {

}

export function buildTypeDeclarationFile() {
    console.log("Building TypeScript declaration files...");

    const schemasDir = "schemas";
    const distDir = "dist";

    // Process source schemas
    const sourceSchemasPath = path.join(schemasDir, "source");
    const sourceFiles = fs.readdirSync(sourceSchemasPath);

    for (const file of sourceFiles) {
        if (file.endsWith(".schema.yaml")) {
            const schemaPath = path.join(sourceSchemasPath, file);
            const schemaContent = readFileFromPath(schemaPath);
            const parsedSchema = parseAsYaml(schemaContent);
            const schemaName = removeFileExtension(file).replace(".schema", "").split("-").map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
            
            const tsInterface = generateTsInterface(schemaName, parsedSchema);

            const outputPath = path.join(distDir, "source", `${schemaName}.d.ts`);
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, tsInterface);
            console.log(`Generated ${outputPath}`);
        }
    }

    // Process output schemas (similar logic, but for output directory)
    const outputSchemasPath = path.join(schemasDir, "output");
    const outputFiles = fs.readdirSync(outputSchemasPath);

    for (const file of outputFiles) {
        if (file.endsWith(".schema.yaml")) {
            const schemaPath = path.join(outputSchemasPath, file);
            const schemaContent = readFileFromPath(schemaPath);
            const parsedSchema = parseAsYaml(schemaContent);
            const schemaName = removeFileExtension(file).replace(".schema", "").split("-").map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
            
            const tsInterface = generateTsInterface(schemaName, parsedSchema);

            const outputPath = path.join(distDir, "output", `${schemaName}.d.ts`);
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, tsInterface);
            console.log(`Generated ${outputPath}`);
        }
    }

    console.log("TypeScript declaration files built.");
}