import {viewBoxString} from "@/app/utils/graphics-utils";
import logoPath from "@/public/logo-path.json";

const aspectRatio = logoPath.viewBox.width / logoPath.viewBox.height;

export default function TechKunLogo() {
    const effectiveWidth = 1.5;

    return <svg xmlns="http://www.w3.org/2000/svg"
        width={`${effectiveWidth}em`} height={`${effectiveWidth / aspectRatio}em`}
        viewBox={viewBoxString(logoPath.viewBox)}
    >
        <use href="#logo-path" fill="var(--primary-color)"></use>
    </svg>;
};