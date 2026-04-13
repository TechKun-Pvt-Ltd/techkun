import React from 'react';
import { theme as twTheme } from "tailwindcss/defaultConfig";

function getRoundedRectPath(length: number) {
    const xLeft = 608.609375; // Fixed left point
    const xRight = xLeft + length; // Dynamic right point based on length

    const path = `
      M ${xRight} 520.144531 
      L ${xLeft} 520.144531 
      C ${xLeft - 23.683594} 520.144531 ${xLeft - 42.859375} 500.964844 ${xLeft - 42.859375} 477.277344 
      C ${xLeft - 42.859375} 453.597656 ${xLeft - 23.683594} 434.417969 ${xLeft} 434.417969 
      L ${xRight} 434.417969 
      C ${xRight + 23.679688} 434.417969 ${xRight + 42.859375} 453.597656 ${xRight + 42.859375} 477.277344 
      C ${xRight + 42.859375} 500.964844 ${xRight + 23.679688} 520.144531 ${xRight} 520.144531
    `.trim();

    return path;
};

function getRectanglePath(length: number) {
    const xLeft = 0; // Fixed left point
    const xRight = length; // Dynamic right boundary

    const path = `
      M ${xLeft} 76.105469
      L ${xRight} 76.105469
      L ${xRight} 883.894531
      L ${xLeft} 883.894531
      Z
    `.trim();

    return path;
};


const TechKunLogoSvg: React.FC<{ size?: number, length: number }> = ({ size = 1280, length }) => {
    const range = 960;
    const pathLength = length * (range / size);
    const offset = 300 * (size / range);
    const pixelExpansion = length <= offset ? 0 : length - offset;
    const expansion = pathLength <= 300 ? 0 : pathLength - 300;
    const width = size + pixelExpansion;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={width} zoomAndPan="magnify" viewBox={`0 0 ${range * (width / size)} ${range}`} height={size} version="1.0">
            <defs>
                <clipPath id="689955e9f6">
                    <path d="M 251.328125 271.140625 L 269.652344 271.140625 C 300.179688 270.945312 330.714844 270.871094 361.222656 270.40625 C 369.617188 270.28125 378.519531 268.910156 378.324219 257.632812 C 378.054688 241 378.175781 224.167969 375.730469 207.777344 C 372.425781 185.683594 356.671875 172.644531 334.09375 172.496094 L 141.160156 172.496094 C 125.378906 172.570312 113.003906 179.808594 105.175781 193.855469 C 84.132812 231.628906 105.957031 270.550781 148.746094 271.066406 L 251.328125 271.140625 M 379.496094 561.878906 L 379.496094 379.640625 C 379.496094 359.234375 376.535156 356.277344 356.351562 356.300781 C 285.015625 356.375 213.675781 356.933594 142.339844 356.203125 C 82.496094 355.59375 35.523438 319.042969 18.347656 261.722656 C 1.199219 204.449219 20.941406 144.703125 68.015625 111.996094 C 88.246094 97.953125 111.09375 89.195312 135.410156 89 C 207.53125 88.390625 279.777344 87.359375 351.777344 90.46875 C 411.300781 93.035156 460.425781 148.792969 462.191406 209.441406 L 462.285156 253.476562 C 462.214844 268.890625 464.046875 270.894531 479.875 271.117188 L 512.902344 270.992188 C 599.730469 270.75 686.578125 270.332031 773.402344 270.527344 C 786.640625 270.550781 796.425781 266.46875 805.871094 257.21875 C 828.746094 234.808594 856.195312 225.929688 887.726562 235.054688 C 919.117188 244.152344 937.953125 265.828125 945.734375 297.023438 C 954.003906 330.296875 936.441406 368.410156 905.78125 385.515625 C 872.609375 404.03125 834.027344 399.921875 809.050781 373.476562 C 796.992188 360.703125 783.582031 356.398438 766.675781 356.449219 L 487.851562 356.300781 C 464.828125 356.25 461.847656 359.160156 461.894531 382.160156 L 462.359375 727.066406 C 462.359375 731.125 462.308594 735.214844 462.628906 739.273438 C 464.953125 768.628906 485.332031 787.320312 514.273438 786.683594 C 545.441406 786.023438 564.058594 768.242188 564.5 737.242188 L 564.722656 621.058594 C 564.722656 575.40625 564.695312 529.730469 564.597656 484.078125 C 564.550781 465.78125 570.199219 450.246094 586.46875 440.359375 C 610.742188 425.632812 641.808594 439.675781 648.441406 468.351562 C 649.980469 475.027344 650.421875 482.097656 650.421875 488.972656 L 650.101562 737.242188 C 649.640625 796.890625 614.480469 846.378906 561.714844 863.921875 C 504.632812 882.90625 441.929688 866.023438 407.53125 822.15625 C 389.304688 798.945312 380.109375 772.375 379.769531 742.871094 L 379.253906 652.375 C 379.179688 622.207031 379.226562 592.042969 379.226562 561.878906 Z M 379.496094 561.878906 " clipRule="nonzero" />
                </clipPath>
                <clipPath id="b500516018">
                    <path d={getRoundedRectPath(pathLength)} clipRule="nonzero" />
                </clipPath>
            </defs>
            <g clipPath="url(#689955e9f6)">
                <path fill="#5692d8" d="M 0 76.105469 L 959.097656 76.105469 L 959.097656 883.894531 L 0 883.894531 Z M 0 76.105469 " fillOpacity="1" fillRule="nonzero" />
            </g>
            <text x="560" y="160" fontSize={48 * (range / 360)} fontWeight={
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (twTheme?.fontWeight as any).medium
            }>
                We are <tspan fill="#2a6bb7">TechKun</tspan>
            </text>
            <text x="1040" y="328" fontSize={36 * (range / 360)} fontWeight={
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (twTheme?.fontWeight as any).normal
            }>
                We create excellence.
            </text>
            <g clipPath="url(#b500516018)">
                <path fill="#5692d8" d={getRectanglePath(959.097656 + expansion)} fillOpacity="1" fillRule="nonzero" />
            </g>
        </svg>
    );
};

export default TechKunLogoSvg;
