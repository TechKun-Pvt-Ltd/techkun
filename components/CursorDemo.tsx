import * as React from "react";
import { Fragment } from "react/jsx-runtime";
import { motion, animate, useMotionValue } from "motion/react";

import {
	useCursorState,
	Cursor,
} from "./Cursor";

/* -------------------------------------------------------------------------------------------------
 * Demo
 * -----------------------------------------------------------------------------------------------*/

function CursorDemo() {
	const cursorState = useCursorState();

	const rotation = useMotionValue(0);

	React.useEffect(() => {
		if (cursorState.targetBoundingBox) {
			// Snap reticule rotation
			animate(
				rotation,
				Math.round(rotation.get() / 180) * 180,
				{
					type: "spring",
					bounce: 0.3,
				}
			);
		} else {
			// Idle spinning animation
			animate(
				rotation,
				[
					rotation.get(),
					rotation.get() + 360,
				],
				{
					duration: 3,
					ease: "linear",
					repeat: Infinity,
				}
			);
		}
	}, [cursorState.targetBoundingBox]);

	return (
		<div className="container">
			<Button>About</Button>
			<Button>Blog</Button>
			<Button>Contact</Button>
			<Button>Photos</Button>

			{/* Small center dot */}
			<Cursor
				magnetic={{
					morph: false,
					snap: 0,
				}}
				style={{
					width: 5,
					height: 5,
				}}
				className="cursor"
			/>

			{/* Outer reticule */}
			<Cursor
				magnetic={{
					snap: 0.9,
				}}
				style={{
					// rotate: rotation,
					width: 40,
					height: 40,
				}}
				variants={{
					pressed: {
						scale:
							cursorState.targetBoundingBox
								? 0.9
								: 0.7,
					},
				}}
				className="reticule"
			>
				<Fragment>
					<ReticuleCorner
						top={0}
						left={0}
					/>

					<ReticuleCorner
						top={0}
						right={0}
					/>

					<ReticuleCorner
						bottom={0}
						left={0}
					/>

					<ReticuleCorner
						bottom={0}
						right={0}
					/>
				</Fragment>
			</Cursor>

			<DemoStyles />
		</div>
	);
}

/* -------------------------------------------------------------------------------------------------
 * Button
 * -----------------------------------------------------------------------------------------------*/

function Button({ children }: { children: React.ReactNode }) {
	return (
		<motion.button
			className="button"
			whileTap={{ scale: 0.9 }}
		>
			{children}
		</motion.button>
	);
}

/* -------------------------------------------------------------------------------------------------
 * Reticule Corner
 * -----------------------------------------------------------------------------------------------*/

function ReticuleCorner({
	thickness = 2,
	length = 10,
	...position
}) {
	return (
		<>
			{/* Vertical segment */}
			<motion.div
				layout
				className="corner"
				style={{
					width: thickness,
					height: length,
					...position,
				}}
			/>

			{/* Horizontal segment */}
			<motion.div
				layout
				className="corner"
				style={{
					width: length,
					height: thickness,
					...position,
				}}
			/>
		</>
	);
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/

function DemoStyles() {
	return (
		<style>
			{`
                .container {
                    display: grid;
                    grid-template-columns: 1fr 400px;
                    gap: 30px;
                    align-items: center;
                    justify-content: center;
                }

                @media (max-width: 650px) {
                    .container {
                        grid-template-columns: 1fr 200px;
                        gap: 10px;
                    }
                }

                .container > :nth-child(4) {
                    grid-column: 2;
                    grid-row: 1 / span 3;
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                }

                .corner {
                    background: white;
                    position: absolute;
                }

                .cursor {
                    background-color: #fff;
                }

                .reticule {
                    background-color: transparent;
                    border-radius: 0;
                }

                .button {
                    background: none;
                    padding: 8px;
                    width: 140px;
                    height: 50px;
                    color: white;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border: 1px dashed #fff4;
                    border-radius: 0;

                    user-select: none;
                }
            `}
		</style>
	);
}

export default CursorDemo;