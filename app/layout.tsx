/** @jsxImportSource react */
import React from 'react';
import "@/app/styles/globals.css";

// Do not import local files with transitive imports in any of the `css.mjs` files
// The only job of these files is to export CSS strings
// TODO: Figure out an alternative with Linaria or Wyw-in-js
import "@/app/styles/generated-css/typography.css";
import "@/app/styles/generated-css/colors.css";
import "@/app/styles/generated-css/spacing.css";
import "@/app/styles/generated-css/device-breakpoints.css";

// const Quicksand = localFont({
//     src: "../../fonts/Quicksand-VariableFont_wght.ttf",
//     weight: "100 900"
// });

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <html lang="en">{children}</html>;
}
