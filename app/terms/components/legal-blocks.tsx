"use client";
import React from "react";
import EmailLink from "@/app/components/EmailLink";
import type {LegalBlock} from "@/app/terms/content";

const HEADING_CLASS_NAME: Record<3 | 4, string> = {
    3: "item-subtitle",
    4: "text-lg"
};
const HEADING_STYLE: Record<3 | 4, React.CSSProperties> = {
    3: {color: "var(--foreground)"},
    4: {color: "var(--foreground)"}
};

export default function LegalBlocks({blocks}: { blocks: LegalBlock[] }) {
    return <>
        {blocks.map((block, index) => {
            switch (block.type) {
                case "heading": {
                    const Heading = `h${block.level}` as "h3" | "h4";
                    return <Heading
                        key={index} id={block.id}
                        className={HEADING_CLASS_NAME[block.level]} style={HEADING_STYLE[block.level]}
                    >
                        {block.text}
                    </Heading>;
                }
                case "p":
                    return <p key={index} className="text-base">{block.text}</p>;
                case "ul":
                    return <ul key={index}>
                        {block.items.map((item, itemIndex) => <li key={itemIndex} className="text-base">{item}</li>)}
                    </ul>;
                case "fields":
                    return <dl key={index}>
                        {block.items.map((item, itemIndex) => <React.Fragment key={itemIndex}>
                            <dt className="text-base">{item.label}</dt>
                            <dd className="text-base">{item.value}</dd>
                        </React.Fragment>)}
                    </dl>;
                case "email":
                    return <p key={index} className="text-base">
                        <EmailLink style={{ color: "var(--primary-200)" }} address={block.address} text={block.label ?? block.address} />
                    </p>;
            }
        })}
    </>;
}
