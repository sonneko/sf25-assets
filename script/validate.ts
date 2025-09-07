import { getAllFilesInDirAsPath, readFileFromPath, validates, getFileExtension } from "./lib.js";

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
            try {
                fs.accessSync(mdPath);
                console.log(`Found corresponding Markdown file: ${mdPath}`);
            } catch (error) {
                console.error(`Error: Missing Markdown file for src/booth/${path}: ${mdPath}`);
                process.exit(1);
            }
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
            try {
                fs.accessSync(mdPath);
                console.log(`Found corresponding Markdown file: ${mdPath}`);
            } catch (error) {
                console.error(`Error: Missing Markdown file for src/blog/${path}: ${mdPath}`);
                process.exit(1);
            }
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
    console.log("Source validation complete.");
}

export function validateOutput() {

}