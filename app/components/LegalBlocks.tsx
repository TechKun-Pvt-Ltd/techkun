"use client";
import React from "react";
import EmailLink from "@/app/components/EmailLink";

export type LegalBlock =
    | { type: "heading"; level: 3 | 4 | 5; text: string; id?: string }
    | { type: "p"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "dl"; items: { term: string; def: string }[] }
    | { type: "fields"; items: { label: string; value: string }[] }
    | { type: "email"; address: string; label?: string };

const HEADING_CLASS_NAME: Record<3 | 4 | 5, string> = {
    3: "item-subtitle",
    4: "type-body-lg",
    5: "type-body-md"
};
const HEADING_STYLE: Record<3 | 4 | 5, React.CSSProperties> = {
    3: {color: "var(--foreground)"},
    4: {color: "var(--foreground)"},
    5: {color: "var(--foreground)", fontWeight: "var(--font-weight-semibold)"}
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
                    return <p key={index} className="type-body-md">{block.text}</p>;
                case "ul":
                    return <ul key={index}>
                        {block.items.map((item, itemIndex) => <li key={itemIndex} className="type-body-md">{item}</li>)}
                    </ul>;
                case "dl":
                    return <dl key={index}>
                        {block.items.map((item, itemIndex) => <React.Fragment key={itemIndex}>
                            <dt className="type-body-md">{item.term}</dt>
                            <dd className="type-body-md">{item.def}</dd>
                        </React.Fragment>)}
                    </dl>;
                case "fields":
                    return <dl key={index}>
                        {block.items.map((item, itemIndex) => <React.Fragment key={itemIndex}>
                            <dt className="type-body-md">{item.label}</dt>
                            <dd className="type-body-md">{item.value}</dd>
                        </React.Fragment>)}
                    </dl>;
                case "email":
                    return <p key={index} className="type-body-md">
                        <EmailLink address={block.address}>{block.label ?? block.address}</EmailLink>
                    </p>;
            }
        })}
    </>;
}
