import fs from "node:fs";
import path from "node:path";

const pkgRoot = path.resolve(
	process.cwd(),
	"node_modules",
	"framer-motion"
);

const pkgJsonPath = path.join(pkgRoot, "package.json");

if (!fs.existsSync(pkgJsonPath)) {
	console.error("framer-motion not found");
	process.exit(1);
}

const pkg = JSON.parse(
	fs.readFileSync(pkgJsonPath, "utf8")
);

const seqSourcePath = path.join(pkgRoot, "dist/es/animation/sequence/create.mjs");
if (!fs.existsSync(seqSourcePath)) {
	console.error(
		`framer-motion internal path moved (expected ${seqSourcePath} for framer-motion@${pkg.version}). ` +
		`Update patch-motion-internals.mjs before this install can proceed.`
	);
	process.exit(1);
}

fs.writeFileSync(
	path.join(pkgRoot, "dist/es/internals.mjs"),
	`export * from "./animation/sequence/create.mjs";\n`
);

fs.writeFileSync(
	path.join(pkgRoot, "dist/cjs/internals.cjs"),
	`module.exports = require("./animation/sequence/create.js");\n`
);

fs.writeFileSync(
	path.join(pkgRoot, "dist/internals.d.ts"),
	`
import {AnimationSequence, SequenceOptions, AnimationScope, GeneratorFactory, ResolvedAnimationDefinitions} from "./index.d.ts";
declare function createAnimationsFromSequence(
    sequence: AnimationSequence,
    options?: SequenceOptions,
    scope?: AnimationScope,
    generators?: { [key: string]: GeneratorFactory }
): ResolvedAnimationDefinitions;\n`
);

pkg.exports ??= {};

pkg.exports["./internals"] = {
	types: "./dist/internals.d.ts",
	import: "./dist/es/internals.mjs",
	require: "./dist/cjs/internals.cjs",
	default: "./dist/cjs/internals.cjs"
};

fs.writeFileSync(
	pkgJsonPath,
	JSON.stringify(pkg, null, 2) + "\n"
);

console.log("Patched framer-motion with ./internals export");