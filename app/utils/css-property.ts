import { CSSInterpolation } from '@emotion/serialize'
import { css } from '@emotion/react';

type Property = {
	name: string
	styles: string
};

export function property(name: string): (
	template: TemplateStringsArray,
	...args: CSSInterpolation[]
) => Property;
export function property(name: string): (...args: CSSInterpolation[]) => Property;
export function property(name: string) {
	return function (...args: CSSInterpolation[]) {
		let insertable = css(...args)
		const finalName = `--${name}-${insertable.name}`
		return {
			name: finalName,
			styles: `@property ${finalName} {${insertable.styles}}`,
			anim: 1
		};
	};
}