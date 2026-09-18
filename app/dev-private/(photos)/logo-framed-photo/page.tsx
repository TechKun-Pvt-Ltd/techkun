/** @jsxImportSource react */
import LogoImageFrame from "@/app/sections/05_Cofounders/components/LogoImageFrame.tsx";
import imageData from "@/public/cofounders/uz_reads.jpeg";

const SIZE = 800;
export default function LogoFramedPhoto() {
    return <div style={{
        width: SIZE, height: SIZE,
        alignContent: "center",
        backgroundColor: "var(--background)",
        paddingBlockEnd: SIZE * 0.0375,
        paddingInlineStart: SIZE * 0.075, paddingInlineEnd: SIZE * 0.0025,
        borderRadius: "50%", overflow: "clip"
    }}>
        <LogoImageFrame style={{ width: "100%" }} imageData={imageData} />
    </div>;
}