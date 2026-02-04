import type { ReactNode } from "react";

type BookingStepLayoutProps = {
	children: ReactNode;
	footer?: ReactNode;
	className?: string;
	containerClassName?: string;
};

export default function BookingStepLayout({
	children,
	footer,
	className,
	containerClassName,
}: BookingStepLayoutProps) {
	const base = "min-h-screen bg-canvas flex flex-col";

	return (
		<div className={`${base} ${className ?? ""}`.trim()}>
			<div className="flex-1">
				<div
					className={`mx-auto w-full max-w-5xl px-4 pb-10 pt-6 md:pt-10 ${
						containerClassName ?? ""
					}`.trim()}
				>
					{children}
				</div>
			</div>
			{footer}
		</div>
	);
}
