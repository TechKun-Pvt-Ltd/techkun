import { pathToFileURL } from "node:url";

export default async function () {
    const resourceUrl = pathToFileURL(this.resourcePath).href;
    const module = await import(resourceUrl);

    const defaultExport = module.default;
    if (typeof defaultExport === "string")
        return defaultExport;
    if (typeof defaultExport === "object")
        return "export default " + JSON.stringify(defaultExport);

    throw new Error(`${this.resourcePath} must default-export a string or an object`);
};
