import fs from "fs";
import yaml from "js-yaml";
import { marked, MarkedOptions } from "marked";
import createDOMPurify from 'dompurify';
import Ajv from "ajv";
import { JSDOM, Window } from "jsdom";

const ajv = new Ajv.default();

export const SCHEMA_PATH = {
    outputBooth: "/schemas/output/booth.schema.yaml",
    outputIndex: "/schemas/output/index.schema.yaml",
    sourceBlog: "/schemas/source/blog.schema.yaml",
    sourceBooth: "/schemas/source/booth.schema.yaml",
    sourceConfig: "/schemas/source/config.schema.yaml",
    sourceLostItem: "/schemas/source/lostItem.schema.yaml",
    sourceNews: "/schemas/source/news.schema.yaml",
    sourceTimeTable: "/schemas/source/timeTable.schema.yaml",
}


export function escapeHtml(target: string): string {
    return target.replace(/[&'`"<>]/g, (match: string) => {
        return {
            '&': '&amp;',
            "'": '&#x27;',
            '`': '&#x60;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;',
        }[match] as string;
    });
}

export function readFileFromPath(pathFromCwd: string): string {
    try {
        const fileContent: string = fs.readFileSync(`${process.cwd()}/${pathFromCwd}`, "utf-8");
        return fileContent;
    } catch (err) {
        console.error(`failed reading the file at ${pathFromCwd}\nbecause of the following error.${err}`);
        process.exit(1);
    }
}

export function parseAsYaml(content: string): unknown {
    try {
        const resultObj = yaml.load(content);
        return resultObj;
    } catch (err) {
        console.error(`failed parsing yaml file: ${err}`);
        process.exit(1);
    }
}

export function parseAsMd(content: string): string {
    // try {
    const window = new JSDOM("").window;
    const DOMPurify = createDOMPurify(window as unknown as Window)

        const options: MarkedOptions = {};
        const dangerousResultHtml = marked(content, options);
        const cleanResultHtml = DOMPurify.sanitize(dangerousResultHtml);
        const escapedHtml = escapeHtml(cleanResultHtml);
        return escapedHtml;
    // } catch (err) {
    //     console.error(`failed to parse MarkDown: ${err}`);
    //     process.exit(1);
    // }
}

export const validates = Object.fromEntries(
    Object.entries(SCHEMA_PATH).map(([key, path]) => {
        const fileContent = readFileFromPath(path);
        const parsed = parseAsYaml(fileContent);
        const validate = (() => {
            try {
                const validate = ajv.compile(parsed as Ajv.Schema);
                return validate;
            } catch (err) {
                console.error(`failed to parse json schema in ${path}: ${err}`);
                process.exit(1);
            }
        })();
        return [key, validate];
    })
);

export function getAllFilesInDirAsPath(dirName: string): string[] {
    const paths: string[] = fs.readdirSync(`${process.cwd()}/${dirName}`);
    return paths;
}

export function getFileExtension(fileName: string): string {
    const parts = fileName.split(".");
    return parts[parts.length - 1];
}

export function removeFileExtension(fileName: string): string {
    return fileName.split('.').slice(0, -1).join('.');
}

export function assertFileExistence(filePath: string, errorMessage: string): void {
    try {
        fs.accessSync(filePath);
        console.log(`Found corresponding file: ${filePath}`);
    } catch (error) {
        console.error(`Error: ${errorMessage}: ${filePath}`);
        process.exit(1);
    }
}
