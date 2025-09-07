declare module "json-schema-to-markdown" {
    function jsonSchemaToMarkdown(schema: object, startingOctothorpes?: string): string;
    export = jsonSchemaToMarkdown;
}