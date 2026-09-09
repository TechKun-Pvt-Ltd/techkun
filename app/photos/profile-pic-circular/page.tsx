/** @jsxImportSource react */
import TechKunLogoSvg from "@/app/photos/TechKunLogoSvg.tsx";

const xPadding = 18;
const xOffset = 0.5;
const yOffset = 4;

export default function ProfilePic() {
    return <main>
        <section className="pt-32" style={{justifyItems: "center"}}>
            <div>
                <TechKunLogoSvg xPadding={xPadding} xOffset={xOffset} yOffset={yOffset} />
            </div>
        </section>
    </main>;
}