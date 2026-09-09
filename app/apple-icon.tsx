/** @jsxImportSource react */
import {ImageResponse} from "next/og";
import logoPath from "@/public/logo-path.json";
import {viewBoxString} from "@/app/utils/graphics-utils";

export const size = {width: 180, height: 180};
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#1572DB",
                }}
            >
                <svg
                    width="108" height="90"
                    viewBox={viewBoxString(logoPath.viewBox)}
                >
                    <path d={logoPath.value} fill="#FFFFFF" />
                </svg>
            </div>
        ),
        {...size}
    );
}
