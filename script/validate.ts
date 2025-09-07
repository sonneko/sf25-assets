import { getAllFilesInDirAsPath, readFileFromPath, validates, getFileExtension } from "./lib.js";

export function validateSource() {
    const paths = getAllFilesInDirAsPath("/src/booth");
    paths.map(path => {
        const extension = getFileExtension(path);
        if (extension === "yaml") {
            const fileContent = readFileFromPath("src/booth/" + path);
            
            // validate yaml file
            const isValid = validates.sourceBooth(fileContent);
            if (isValid === false) {
                console.error(`failed to validate ${path}`);
                process.exit(1);
            }

            // assert exsistence of [*].md
            
        }
    });
}

export function validateOutput() {

}