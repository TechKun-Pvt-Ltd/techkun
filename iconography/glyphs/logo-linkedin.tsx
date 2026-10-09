"use client"
import {css} from "@emotion/react";
import createIcon from "@/iconography/create-icon";
import IconGradient from "@/iconography/IconGradient";

export default createIcon({
    kind: "brand",
    styles: ({url}) => css`
        --icon-paint: ${url("paint")};
    `,
    render: ({id}) => <>
        <defs>
            <IconGradient id={id("paint")} />
        </defs>
        <path d="M 18.8572 3 H 5.1428 C 3.96 3 3 3.96 3 5.1428 v 13.7143 C 3 20.04 3.96 21 5.1428 21 H 18.8572 C 20.04 21 21 20.04 21 18.8572 V 5.1428 C 21 3.96 20.04 3 18.8572 3 z M 8.5715 9.8572 v 8.1428 h -2.5715 V 9.8572 H 8.5715 z M 6 7.4872 c 0 -0.6 0.5143 -1.0585 1.2857 -1.0585 s 1.2557 0.4586 1.2857 1.0585 c 0 0.6 -0.48 1.0843 -1.2857 1.0843 C 6.5143 8.5715 6 8.0872 6 7.4872 z M 18 18 h -2.5715 c 0 0 0 -3.9686 0 -4.2857 c 0 -0.8572 -0.4285 -1.7143 -1.5 -1.7315 h -0.0343 C 12.8572 11.9828 12.4286 12.8657 12.4286 13.7143 c 0 0.39 0 4.2857 0 4.2857 h -2.5715 V 9.8572 h 2.5715 v 1.0972 c 0 0 0.8272 -1.0972 2.49 -1.0972 c 1.7015 0 3.0815 1.17 3.0815 3.54 V 18 z" />
    </>
});
