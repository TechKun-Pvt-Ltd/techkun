import React from "react";

type AsProp<C extends React.ElementType> = { as?: C };

type PropsWithAs<C extends React.ElementType, Props> = Props & AsProp<C>;

export type PolymorphicComponentProps<C extends React.ElementType = React.ElementType, Props = {}> =
	PropsWithAs<C, Props>
	& Omit<React.ComponentProps<C>, keyof PropsWithAs<C, Props>>;