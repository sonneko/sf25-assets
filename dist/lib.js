import fs from "fs";
import yaml from "js-yaml";
import { marked } from "marked";
import createDOMPurify from 'dompurify';
import Ajv from "ajv";
import { JSDOM } from "jsdom";
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
};
export function escapeHtml(target) {
    return target.replace(/[&'`"<>]/g, (match) => {
        return {
            '&': '&amp;',
            "'": '&#x27;',
            '`': '&#x60;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;',
        }[match];
    });
}
export function readFileFromPath(pathFromCwd) {
    try {
        const fileContent = fs.readFileSync(`${process.cwd()}/${pathFromCwd}`, "utf-8");
        return fileContent;
    }
    catch (err) {
        console.error(`failed reading the file at ${pathFromCwd}\nbecause of the following error.${err}`);
        process.exit(1);
    }
}
export function parseAsYaml(content) {
    try {
        const resultObj = yaml.load(content);
        return resultObj;
    }
    catch (err) {
        console.error(`failed parsing yaml file: ${err}`);
        process.exit(1);
    }
}
export function parseAsMdAndEscape(content) {
    try {
        const window = new JSDOM("").window;
        const DOMPurify = createDOMPurify(window);
        const dangerousResultHtml = marked(content, {
            async: false
        });
        const cleanResultHtml = DOMPurify.sanitize(dangerousResultHtml);
        const escapedHtml = escapeHtml(cleanResultHtml);
        return escapedHtml;
    }
    catch (err) {
        console.error(`failed to parse MarkDown: ${err}`);
        process.exit(1);
    }
}
export function parseAsMd(content) {
    try {
        const window = new JSDOM("").window;
        const DOMPurify = createDOMPurify(window);
        const dangerousResultHtml = marked(content, {
            async: false
        });
        const cleanResultHtml = DOMPurify.sanitize(dangerousResultHtml);
        return cleanResultHtml;
    }
    catch (err) {
        console.error(`failed to parse MarkDown: ${err}`);
        process.exit(1);
    }
}
export const validates = Object.fromEntries(Object.entries(SCHEMA_PATH).map(([key, path]) => {
    const fileContent = readFileFromPath(path);
    const parsed = parseAsYaml(fileContent);
    const validate = (() => {
        try {
            const validate = ajv.compile(parsed);
            return validate;
        }
        catch (err) {
            console.error(`failed to parse json schema in ${path}: ${err}`);
            process.exit(1);
        }
    })();
    return [key, validate];
}));
export function getAllFilesInDirAsPath(dirName) {
    const paths = fs.readdirSync(`${process.cwd()}/${dirName}`);
    return paths;
}
export function getFileExtension(fileName) {
    const parts = fileName.split(".");
    return parts[parts.length - 1];
}
export function removeFileExtension(fileName) {
    return fileName.split('.').slice(0, -1).join('.');
}
export function assertFileExistence(filePath, errorMessage) {
    try {
        fs.accessSync(filePath);
        console.log(`Found corresponding file: ${filePath}`);
    }
    catch (error) {
        console.error(`Error: ${errorMessage}: ${filePath}`);
        process.exit(1);
    }
}
