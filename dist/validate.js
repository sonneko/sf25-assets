import { getAllFilesInDirAsPath, readFileFromPath, validates, getFileExtension, removeFileExtension, parseAsYaml, assertFileExistence } from "./lib.js";
function validate(path, validateFn) {
    const fileContent = readFileFromPath(path);
    const parsedContent = parseAsYaml(fileContent);
    // Validate YAML file against schema
    const isValid = validateFn(parsedContent);
    if (!isValid) {
        console.error(`Failed to validate ${path}:`);
        console.error(validateFn.errors);
        process.exit(1);
    }
    console.log(`Successfully validated ${path}`);
}
export function validateSource() {
    console.log("Validating source files...");
    // Validate booth source files
    const boothPaths = getAllFilesInDirAsPath("src/booth");
    for (const path of boothPaths) {
        const extension = getFileExtension(path);
        const baseName = removeFileExtension(path);
        if (extension === "yaml") {
            validate(`src/booth/${path}`, validates.sourceBooth);
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
            validate(`src/blog/${path}`, validates.sourceBlog);
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
            validate(`src/news/${path}`, validates.sourceNews);
        }
    }
    // Validate lostItems source files
    const lostItemPaths = getAllFilesInDirAsPath("src/lostItems");
    for (const path of lostItemPaths) {
        const extension = getFileExtension(path);
        const baseName = removeFileExtension(path);
        if (extension === "yaml") {
            validate(`src/lostItems/${path}`, validates.sourceLostItem);
            // Assert existence of corresponding WebP image file
            const webpPath = `src/lostItems/${baseName}.webp`;
            assertFileExistence(webpPath, `Missing WebP file for src/lostItems/${path}`);
        }
    }
    // Validate src/timeTable.yaml
    validate("src/timeTable.yaml", validates.sourceTimeTable);
    // Validate src/config.yaml
    validate("src/config.yaml", validates.sourceConfig);
    console.log("Source validation complete.");
}
export function validateOutput() {
    console.log("Validating output files...");
    const validate = (path, validateFn) => {
        const indexContent = readFileFromPath(path);
        const parsedIndex = JSON.parse(indexContent);
        if (!validateFn(parsedIndex)) {
            console.error(`Failed to validate ${path}:`);
            console.error(validateFn.errors);
            process.exit(1);
        }
        console.log(`Successfully validated ${path}`);
    };
    // Validate out/index.json
    validate("out/index.json", validates.outputIndex);
    // Validate out/booth.json"
    validate("out/booth.json", validates.outputBooth);
    // Validate existence of generated HTML and WebP files for booths
    const srcBoothPaths = getAllFilesInDirAsPath("src/booth");
    for (const p of srcBoothPaths) {
        const baseName = removeFileExtension(p);
        const extension = getFileExtension(p);
        if (extension === "md") {
            const outputPath = `out/booths/${baseName}.html`;
            assertFileExistence(outputPath, `Missing generated HTML file for booth: ${p}`);
        }
        else if (extension === "webp") {
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
        }
        else if (extension === "webp") {
            const outputPath = `out/blogs/${p}`;
            assertFileExistence(outputPath, `Missing copied WebP file for blog: ${p}`);
        }
    }
    console.log("Output validation complete.");
}
