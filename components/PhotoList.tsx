import * as React from "react";

import {
	AnimatePresence,
	motion,
	type MotionValue,
	type Transition,
	useSpring,
	useTransform,
	useVelocity,
} from "motion/react";

import {
	clamp,
} from "motion";

import {
	Cursor,
} from "./Cursor";

import {
	usePointerPosition,
} from "../app/utils/use-pointer-position";

export interface PhotoProps
	extends React.ImgHTMLAttributes<HTMLImageElement> {
	src: string;

	fill?: boolean;

	priority?: boolean;
	quality?: number;

	placeholder?: string;
	blurDataURL?: string;
}

export function Photo({
						  src,
						  fill,
						  priority,
						  quality,
						  placeholder,
						  blurDataURL,
						  style,
						  ...props
					  }: PhotoProps) {
	const fillStyles = fill
		? {
			position: "absolute" as const,
			inset: 0,
			width: "100%",
			height: "100%",
			objectFit: "cover" as const,
		}
		: undefined;

	return (
		<img
			src={src}
			alt="photo"
			style={{
				...fillStyles,
				...style,
			}}
			{...props}
		/>
	);
}


/* -------------------------------------------------------------------------------------------------
 * Motion Helpers
 * -----------------------------------------------------------------------------------------------*/

function useCursorSkew(
	value: MotionValue<number>
) {
	const velocity = useVelocity(value);

	const clampedVelocity = useTransform(() =>
		clamp(
			-1000,
			1000,
			velocity.get()
		)
	);

	const springVelocity = useSpring(
		clampedVelocity,
		{
			damping: 10,
			stiffness: 200,
		}
	);

	return useTransform(
		springVelocity,
		[0, 100],
		[0, -1],
		{
			clamp: false,
		}
	);
}

/* -------------------------------------------------------------------------------------------------
 * Transitions
 * -----------------------------------------------------------------------------------------------*/

const revealTransition: Transition = {
	duration: 0.5,
	ease: [0, 0.54, 0.37, 0.97],
};

const exitTransition: Transition = {
	duration: 0.2,
	ease: "easeIn",
};

/* -------------------------------------------------------------------------------------------------
 * Photo List Item
 * -----------------------------------------------------------------------------------------------*/

interface PhotoListItemProps {
	label: string;
	number: number;
	image: string;
}

function PhotoListItem({
						   label,
						   number,
						   image,
					   }: PhotoListItemProps) {
	const [isHovered, setIsHovered] =
		React.useState(false);

	const pointer = usePointerPosition();

	const skewX =
		useCursorSkew(pointer.x);

	const skewY =
		useCursorSkew(pointer.y);

	const duplicatedLabel = (
		<>
            <span style={numberStyle}>
                0{number}
            </span>

			{label}
		</>
	);

	return (
		<motion.li
			style={{
				...listItemStyle,

				justifyContent: isHovered
					? "flex-end"
					: "flex-start",
			}}
			onHoverStart={() =>
				setIsHovered(true)
			}
			onHoverEnd={() =>
				setIsHovered(false)
			}
		>
			<motion.span
				layout
				style={labelStyle}
			>
				{duplicatedLabel}
			</motion.span>

			<motion.span
				layout
				style={labelStyle}
				aria-hidden
			>
				{duplicatedLabel}
			</motion.span>

			<AnimatePresence>
				{isHovered && (
					<Cursor
						key="cursor"
						follow
						offset={{
							x: 30,
							y: 30,
						}}
						variants={{
							default: {
								clipPath:
									"inset(0% 0% 0% 0%)",

								transition:
								revealTransition,
							},

							exit: {
								clipPath:
									"inset(50% 50% 50% 50%)",

								transition:
								exitTransition,
							},
						}}
						style={{
							skewX,
							skewY,

							originX: 0,
							originY: 0,
						}}
					>
						<motion.div
							variants={{
								default: {
									scale: 1,

									transition:
									revealTransition,
								},

								exit: {
									scale: 1.5,

									transition:
									exitTransition,
								},
							}}
							style={{
								width: 300,
								height: 400,
							}}
						>
							<Photo
								src={image}
								width={300}
								height={400}
								alt={`Photo of ${label}`}
							/>
						</motion.div>
					</Cursor>
				)}
			</AnimatePresence>
		</motion.li>
	);
}

/* -------------------------------------------------------------------------------------------------
 * Main Component
 * -----------------------------------------------------------------------------------------------*/

export default function PhotoList() {
	return (
		<ul style={listStyle}>
			<PhotoListItem
				label="Tokyo"
				number={1}
				image="/city-images/japan-bw.jpg"
			/>

			<PhotoListItem
				label="Amsterdam"
				number={2}
				image="/city-images/amsterdam-cityscape.jpg"
			/>

			<PhotoListItem
				label="London"
				number={3}
				image="/city-images/cityscape.jpg"
			/>
		</ul>
	);
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/

const listStyle: React.CSSProperties = {
	display: "flex",
	gap: 20,

	listStyle: "none",

	padding: 0,
	margin: 0,

	flexDirection: "column",
};

const listItemStyle: React.CSSProperties = {
	position: "relative",

	cursor: "pointer",
	overflow: "hidden",

	display: "flex",
	flexDirection: "column",

	alignItems: "flex-start",

	gap: 10,

	height: 48,
};

const labelStyle: React.CSSProperties = {
	color: "var(--white)",

	fontSize: 48,
	fontWeight: "bold",

	textTransform: "uppercase",

	display: "flex",
	alignItems: "center",

	gap: 10,

	lineHeight: "48px",
};

const numberStyle: React.CSSProperties = {
	fontSize: 48,
	fontWeight: "bold",

	textTransform: "uppercase",

	opacity: 0.5,

	fontVariantNumeric: "tabular-nums",
};