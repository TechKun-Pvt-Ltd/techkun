let canvasCtx: CanvasRenderingContext2D;

export type FontMetrics = {
	baseline: number;
	ascender: number;
	descender: number;
	xHeight: number;
	capHeight: number;
};

export async function measureFont(font: string): Promise<FontMetrics> {
	await document.fonts.ready;

	if (!canvasCtx)
		canvasCtx = document.createElement("canvas").getContext("2d")!;

	canvasCtx.font = font;
	const xMetrics = canvasCtx.measureText("x");
	const capMetrics = canvasCtx.measureText("H");

	const baseline = capMetrics.fontBoundingBoxAscent;

	return {
		baseline,
		ascender: 0,
		descender: baseline + capMetrics.fontBoundingBoxDescent,
		xHeight: baseline - xMetrics.actualBoundingBoxAscent,
		capHeight: baseline - capMetrics.actualBoundingBoxAscent
	};
}