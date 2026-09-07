import { pathToFileURL } from "node:url";

export default async function () {
    const resourceUrl = pathToFileURL(this.resourcePath).href;
    const module = await import(resourceUrl);

    const css = module.default;
    if (typeof css !== "string")
        throw new Error(`${this.resourcePath} must default-export a CSS string`);

    return css;
};