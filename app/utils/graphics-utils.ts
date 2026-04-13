export interface ViewBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function viewBoxString({ x, y, width, height }: ViewBox) {
    return `${x} ${y} ${width} ${height}`;
}