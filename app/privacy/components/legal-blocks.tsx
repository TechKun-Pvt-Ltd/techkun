"use client";
import React from "react";
import EmailLink from "@/app/components/EmailLink";
import type {LegalBlock} from "@/app/privacy/content";

const HEADING_CLASS_NAME: Record<3 | 4 | 5, string> = {
    3: "item-subtitle",
    4: "text-lg",
    5: "text-base"
};
const HEADING_STYLE: Record<3 | 4 | 5, React.CSSProperties> = {
    3: {color: "var(--foreground)"},
    4: {color: "var(--foreground)"},
    5: {color: "var(--foreground)", fontWeight: 600}
};

export default function LegalBlocks({blocks}: { blocks: LegalBlock[] }) {
    return <>
        {blocks.map((block, index) => {
            switch (block.type) {
                case "heading": {
                    const Heading = `h${block.level}` as "h3" | "h4" | "h5";
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
                case "dl":
                    return <dl key={index}>
                        {block.items.map((item, itemIndex) => <React.Fragment key={itemIndex}>
                            <dt className="text-base">{item.term}</dt>
                            <dd className="text-base">{item.def}</dd>
                        </React.Fragment>)}
                    </dl>;
                case "fields":
                    return <dl key={index}>
                        {block.items.map((item, itemIndex) => <React.Fragment key={itemIndex}>
                            <dt className="text-base">{item.label}</dt>
                            <dd className="text-base">{item.value}</dd>
                        </React.Fragment>)}
                    </dl>;
                case "email":
                    return <p key={index} className="text-base">
                        <EmailLink style={{ color: "var(--primary-300)" }} address={block.address}>{block.label ?? block.address}</EmailLink>
                    </p>;
            }
        })}
    </>;
}
