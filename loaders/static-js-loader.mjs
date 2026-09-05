import { pathToFileURL } from "node:url";

export default async function () {
    const resourceUrl = pathToFileURL(this.resourcePath).href;
    const module = await import(resourceUrl);

    const object = module.default;
    if (typeof object !== "object")
        throw new Error(`${this.resourcePath} must default-export an object`);

    return "export default " + JSON.stringify(object);
};