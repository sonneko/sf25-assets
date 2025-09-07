import { getAllFilesInDirAsPath, readFileFromPath, validates, getFileExtension, removeFileExtension, parseAsYaml, assertFileExistence } from "./lib.js";
import fs from "fs";

export function validateSource() {
    console.log("Validating source files...");

    // Validate booth source files
    const boothPaths = getAllFilesInDirAsPath("src/booth");
    for (const path of boothPaths) {
        const extension = getFileExtension(path);
        const baseName = removeFileExtension(path);

        if (extension === "yaml") {
            const fileContent = readFileFromPath("src/booth/" + path);
            const parsedContent = parseAsYaml(fileContent);
            
            // Validate YAML file against schema
            const isValid = validates.sourceBooth(parsedContent);
            if (!isValid) {
                console.error(`Failed to validate src/booth/${path}:`);
                console.error(validates.sourceBooth.errors);
                process.exit(1);
            }
            console.log(`Successfully validated src/booth/${path}`);

            // Assert existence of corresponding Markdown file
            const mdPath = `src/booth/${baseName}.md`;
            assertFileExistence(mdPath, `Missing Markdown file for src/booth/${path}`);
        }
    }

    // Validate blog source files
    const blogPaths = getAllFilesInDirAsPath("src/blog");
    for (const path of blogPaths) {
        const extension = getFileExtension(path);
        const baseName = removeFileExtension(path);

        if (extension === "yaml") {
            const fileContent = readFileFromPath("src/blog/" + path);
            const parsedContent = parseAsYaml(fileContent);
            
            // Validate YAML file against schema
            const isValid = validates.sourceBlog(parsedContent);
            if (!isValid) {
                console.error(`Failed to validate src/blog/${path}:`);
                console.error(validates.sourceBlog.errors);
                process.exit(1);
            }
            console.log(`Successfully validated src/blog/${path}`);

            // Assert existence of corresponding Markdown file
            const mdPath = `src/blog/${baseName}.md`;
            assertFileExistence(mdPath, `Missing Markdown file for src/blog/${path}`);
        }
    }

    // Validate news source files
    const newsPaths = getAllFilesInDirAsPath("src/news");
    for (const path of newsPaths) {
        const extension = getFileExtension(path);

        if (extension === "yaml") {
            const fileContent = readFileFromPath("src/news/" + path);
            const parsedContent = parseAsYaml(fileContent);
            
            // Validate YAML file against schema
            const isValid = validates.sourceNews(parsedContent);
            if (!isValid) {
                console.error(`Failed to validate src/news/${path}:`);
                console.error(validates.sourceNews.errors);
                process.exit(1);
            }
            console.log(`Successfully validated src/news/${path}`);
        }
    }

    // Validate lostItems source files
    const lostItemPaths = getAllFilesInDirAsPath("src/lostItems");
    for (const path of lostItemPaths) {
        const extension = getFileExtension(path);
        const baseName = removeFileExtension(path);

        if (extension === "yaml") {
            const fileContent = readFileFromPath("src/lostItems/" + path);
            const parsedContent = parseAsYaml(fileContent);
            
            // Validate YAML file against schema
            const isValid = validates.sourceLostItem(parsedContent);
            if (!isValid) {
                console.error(`Failed to validate src/lostItems/${path}:`);
                console.error(validates.sourceLostItem.errors);
                process.exit(1);
            }
            console.log(`Successfully validated src/lostItems/${path}`);

            // Assert existence of corresponding WebP image file
            const webpPath = `src/lostItems/${baseName}.webp`;
            assertFileExistence(webpPath, `Missing WebP file for src/lostItems/${path}`);
        }
    }

    // Validate src/timeTable.yaml
    const timeTableContent = readFileFromPath("src/timeTable.yaml");
    const parsedTimeTable = parseAsYaml(timeTableContent);
    if (!validates.sourceTimeTable(parsedTimeTable)) {
        console.error(`Failed to validate src/timeTable.yaml:`);
        console.error(validates.sourceTimeTable.errors);
        process.exit(1);
    }
    console.log(`Successfully validated src/timeTable.yaml`);

    // Validate src/config.yaml
    const configContent = readFileFromPath("src/config.yaml");
    const parsedConfig = parseAsYaml(configContent);
    if (!validates.sourceConfig(parsedConfig)) {
        console.error(`Failed to validate src/config.yaml:`);
        console.error(validates.sourceConfig.errors);
        process.exit(1);
    }
    console.log(`Successfully validated src/config.yaml`);

    console.log("Source validation complete.");
}

export function validateOutput() {
    console.log("Validating output files...");

    // Validate out/index.json
    const indexContent = readFileFromPath("out/index.json");
    const parsedIndex = JSON.parse(indexContent);
    if (!validates.outputIndex(parsedIndex)) {
        console.error(`Failed to validate out/index.json:`);
        console.error(validates.outputIndex.errors);
        process.exit(1);
    }
    console.log(`Successfully validated out/index.json`);

    // Validate out/booth.json
    const boothJsonContent = readFileFromPath("out/booth.json");
    const parsedBoothJson = JSON.parse(boothJsonContent);
    if (!validates.outputBooth(parsedBoothJson)) {
        console.error(`Failed to validate out/booth.json:`);
        console.error(validates.outputBooth.errors);
        process.exit(1);
    }
    console.log(`Successfully validated out/booth.json`);

    // Validate existence of generated HTML and WebP files for booths
    const srcBoothPaths = getAllFilesInDirAsPath("src/booth");
    for (const p of srcBoothPaths) {
        const baseName = removeFileExtension(p);
        const extension = getFileExtension(p);

        if (extension === "md") {
            const outputPath = `out/booths/${baseName}.html`;
            assertFileExistence(outputPath, `Missing generated HTML file for booth: ${p}`);
        } else if (extension === "webp") {
            const outputPath = `out/booths/${p}`;
            assertFileExistence(outputPath, `Missing copied WebP file for booth: ${p}`);
        }
    }

    // Validate existence of generated HTML and WebP files for blogs
    const srcBlogPaths = getAllFilesInDirAsPath("src/blog");
    for (const p of srcBlogPaths) {
        const baseName = removeFileExtension(p);
        const extension = getFileExtension(p);

        if (extension === "md") {
            const outputPath = `out/blogs/${baseName}.html`;
            assertFileExistence(outputPath, `Missing generated HTML file for blog: ${p}`);
        } else if (extension === "webp") {
            const outputPath = `out/blogs/${p}`;
            assertFileExistence(outputPath, `Missing copied WebP file for blog: ${p}`);
        }
    }

    console.log("Output validation complete.");
}