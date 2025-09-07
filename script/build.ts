import fs from "fs";
import path from "path";
import { readFileFromPath, parseAsYaml, removeFileExtension, parseAsMd, getAllFilesInDirAsPath } from "./lib.js";

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
    console.log("Building assets...");

    const outDir = "out";
    fs.mkdirSync(outDir, { recursive: true });

    const allBooths: any[] = [];
    const allBlogs: any[] = [];
    const allNews: any[] = [];
    const allLostItems: any[] = [];
    let timeTable: any = {};
    let config: any = {};

    // Read and process booth data
    const boothPaths = getAllFilesInDirAsPath("src/booth");
    for (const p of boothPaths) {
        if (getFileExtension(p) === "yaml") {
            const content = readFileFromPath(`src/booth/${p}`);
            const parsed = parseAsYaml(content);
            allBooths.push(parsed);
        }
    }

    // Read and process blog data
    const blogPaths = getAllFilesInDirAsPath("src/blog");
    for (const p of blogPaths) {
        if (getFileExtension(p) === "yaml") {
            const content = readFileFromPath(`src/blog/${p}`);
            const parsed = parseAsYaml(content);
            allBlogs.push(parsed);
        }
    }

    // Read and process news data
    const newsPaths = getAllFilesInDirAsPath("src/news");
    for (const p of newsPaths) {
        if (getFileExtension(p) === "yaml") {
            const content = readFileFromPath(`src/news/${p}`);
            const parsed = parseAsYaml(content);
            allNews.push(parsed);
        }
    }

    // Read and process lostItems data
    const lostItemPaths = getAllFilesInDirAsPath("src/lostItems");
    for (const p of lostItemPaths) {
        if (getFileExtension(p) === "yaml") {
            const content = readFileFromPath(`src/lostItems/${p}`);
            const parsed = parseAsYaml(content);
            allLostItems.push(parsed);
        }
    }

    // Read timeTable.yaml
    timeTable = parseAsYaml(readFileFromPath("src/timeTable.yaml"));

    // Read config.yaml
    config = parseAsYaml(readFileFromPath("src/config.yaml"));

    // Generate index.json
    const indexJson = {
        booths: allBooths.map(b => ({ id: b.id, name: b.name, description: b.description })),
        blogs: allBlogs.map(b => ({ id: b.id, title: b.title, date: b.date })),
        news: allNews.map(n => ({ id: n.id, title: n.title, date: n.date })),
        lostItems: allLostItems.map(li => ({ id: li.id, name: li.name, date: li.date })),
        timeTable: timeTable,
        config: config,
    };
    fs.writeFileSync(path.join(outDir, "index.json"), JSON.stringify(indexJson, null, 2));
    console.log(`Generated ${path.join(outDir, "index.json")}`);

    // Generate booth.json (assuming it's a list of all booth details)
    fs.writeFileSync(path.join(outDir, "booth.json"), JSON.stringify(allBooths, null, 2));
    console.log(`Generated ${path.join(outDir, "booth.json")}`);

    // Generate individual booth pages and copy images
    const outBoothsDir = path.join(outDir, "booths");
    fs.mkdirSync(outBoothsDir, { recursive: true });

    for (const p of getAllFilesInDirAsPath("src/booth")) {
        const baseName = removeFileExtension(p);
        const extension = getFileExtension(p);

        if (extension === "md") {
            const mdContent = readFileFromPath(`src/booth/${p}`);
            const htmlContent = parseAsMd(mdContent);
            const outputPath = path.join(outBoothsDir, `${baseName}.html`);
            fs.writeFileSync(outputPath, htmlContent);
            console.log(`Generated ${outputPath}`);
        } else if (extension === "webp") {
            const srcPath = `src/booth/${p}`;
            const destPath = path.join(outBoothsDir, p);
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${srcPath} to ${destPath}`);
        }
    }

    // Generate individual blog pages and copy images
    const outBlogsDir = path.join(outDir, "blogs");
    fs.mkdirSync(outBlogsDir, { recursive: true });

    for (const p of getAllFilesInDirAsPath("src/blog")) {
        const baseName = removeFileExtension(p);
        const extension = getFileExtension(p);

        if (extension === "md") {
            const mdContent = readFileFromPath(`src/blog/${p}`);
            const htmlContent = parseAsMd(mdContent);
            const outputPath = path.join(outBlogsDir, `${baseName}.html`);
            fs.writeFileSync(outputPath, htmlContent);
            console.log(`Generated ${outputPath}`);
        } else if (extension === "webp") {
            const srcPath = `src/blog/${p}`;
            const destPath = path.join(outBlogsDir, p);
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${srcPath} to ${destPath}`);
        }
    }

    console.log("Assets built.");
}
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