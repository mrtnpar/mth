import type { LabelHTMLAttributes, ReactNode } from "react";

type BookingLabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
	children: ReactNode;
};

export default function BookingLabel({
	className,
	...props
}: BookingLabelProps) {
	const base = "block text-sm font-medium text-ink-subtle";

	return <label className={`${base} ${className ?? ""}`.trim()} {...props} />;
}
