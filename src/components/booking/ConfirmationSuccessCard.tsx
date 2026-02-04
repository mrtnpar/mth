"use client";

import { useBooking } from "@/contexts/BookingContext";
import BookingCard from "./BookingCard";

function SuccessCheckmark() {
	return (
		<div className="relative flex size-success items-center justify-center">
			<svg
				className="absolute inset-0 h-full w-full"
				viewBox="0 0 200 200"
				role="img"
				aria-hidden="true"
				focusable="false"
			>
				<circle cx="100" cy="100" r="100" fill="var(--color-success-bg)" />
			</svg>
			<svg
				className="relative h-24 w-24"
				viewBox="0 0 48 36"
				fill="none"
				role="img"
				aria-label="Success checkmark"
			>
				<path
					d="M6 20l10 10L42 6"
					stroke="var(--color-success)"
					strokeWidth="7.4"
					strokeLinecap="round"
					strokeLinejoin="round"
					transform="translate(4 4)"
				/>
				<path
					d="M6 20l10 10L42 6"
					stroke="var(--color-success-deep)"
					strokeWidth="7.4"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M6 20l10 10L42 6"
					stroke="var(--color-surface)"
					strokeWidth="4.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
	);
}

export default function ConfirmationSuccessCard() {
	const { steps } = useBooking();
	const { contact, confirmationNumber } = steps.all.data;
	const email = contact.email?.trim();

	return (
		<BookingCard className="px-6 py-confirmation text-center">
			<div className="flex flex-col gap-4 items-center">
				<SuccessCheckmark />
				<p className="mt-5 text-title font-bold text-ink-soft">
					Your appointment has been booked!
				</p>
				<p className="mt-2 text-base leading-6 text-ink-strong">
					A confirmation has been sent to{" "}
					{email ? (
						<span className="font-medium text-ink">{email}</span>
					) : (
						"your email address"
					)}
					.
				</p>
				{confirmationNumber && (
					<p className="text-xs font-semibold text-ink-muted">
						Confirmation #{confirmationNumber}
					</p>
				)}
			</div>
		</BookingCard>
	);
}
