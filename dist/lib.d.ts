import Ajv from "ajv";
export declare const SCHEMA_PATH: {
    outputBooth: string;
    outputIndex: string;
    sourceBlog: string;
    sourceBooth: string;
    sourceConfig: string;
    sourceLostItem: string;
    sourceNews: string;
    sourceTimeTable: string;
};
export declare function escapeHtml(target: string): string;
export declare function readFileFromPath(pathFromCwd: string): string;
export declare function parseAsYaml(content: string): unknown;
export declare function parseAsMdAndEscape(content: string): string;
export declare function parseAsMd(content: string): string;
export declare const validates: {
    [k: string]: Ajv.ValidateFunction<unknown>;
};
export declare function getAllFilesInDirAsPath(dirName: string): string[];
export declare function getFileExtension(fileName: string): string;
export declare function removeFileExtension(fileName: string): string;
export declare function assertFileExistence(filePath: string, errorMessage: string): void;
