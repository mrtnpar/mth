"use client";

import type React from "react";
import type { PaymentInfo } from "@/components/booking/types";
import { useBooking } from "@/contexts/BookingContext";
import BookingButton from "./BookingButton";
import BookingCard from "./BookingCard";
import BookingErrorText from "./BookingErrorText";
import { BookingInput } from "./BookingField";
import BookingLabel from "./BookingLabel";
import FormSection from "./FormSection";

export default function PaymentDetailsCard() {
	const booking = useBooking();
	const { steps, navigation } = booking;
	const { data: payment, errors, update, validate } = steps.payment;

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("useBooking state", booking);
		if (validate()) {
			const confirmationNumber = `BK-${Math.random()
				.toString(36)
				.substring(2, 9)
				.toUpperCase()}`;
			steps.confirmation.update({ confirmationNumber });
			navigation.nextStep();
		}
	};

	const handleChange =
		(field: keyof PaymentInfo) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			update({ [field]: event.target.value } as Partial<PaymentInfo>);
		};

	const handleCheckboxChange =
		(field: keyof PaymentInfo) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			update({ [field]: event.target.checked } as Partial<PaymentInfo>);
		};

	return (
		<BookingCard className="px-6 py-6 md:px-8 md:py-7">
			<FormSection
				as="form"
				id="payment-form"
				onSubmit={handleSubmit}
				title="Secure your appointment by card"
				titleClassName="text-subtitle font-semibold text-ink"
				bodyClassName="space-y-5"
			>
				<p className="text-sm text-ink-muted">
					A credit or debit card is required to book your appointment.
				</p>

				<div className="space-y-3">
					<BookingLabel className="text-sm font-medium text-ink-subtle">
						Card information
					</BookingLabel>

					<BookingInput
						id="cardNumber"
						label="Card number"
						labelClassName="sr-only"
						placeholder="1234 1234 1234 1234"
						value={payment.cardNumber ?? ""}
						onChange={handleChange("cardNumber")}
						autoComplete="cc-number"
						inputMode="numeric"
						mask="____ ____ ____ ____ ___"
						replacement={{ _: /\d/ }}
						error={errors.cardNumber}
					/>

					<div className="grid grid-cols-2 gap-3">
						<BookingInput
							id="cardExpiry"
							label="Expiry date"
							labelClassName="sr-only"
							placeholder="MM / YY"
							value={payment.cardExpiry ?? ""}
							onChange={handleChange("cardExpiry")}
							autoComplete="cc-exp"
							inputMode="numeric"
							mask="__ / __"
							replacement={{ _: /\d/ }}
							error={errors.cardExpiry}
						/>

						<BookingInput
							id="cardCvc"
							label="CVV"
							labelClassName="sr-only"
							placeholder="CVV"
							value={payment.cardCvc ?? ""}
							onChange={handleChange("cardCvc")}
							autoComplete="cc-csc"
							inputMode="numeric"
							mask="____"
							replacement={{ _: /\d/ }}
							error={errors.cardCvc}
						/>
					</div>

					<BookingInput
						id="billingZip"
						label="Billing zip code"
						labelClassName="sr-only"
						placeholder="Billing zip code"
						value={payment.billingZip ?? ""}
						onChange={handleChange("billingZip")}
						autoComplete="postal-code"
						inputMode="numeric"
						mask="_____-____"
						replacement={{ _: /\d/ }}
						error={errors.billingZip}
					/>
				</div>

				<div className="space-y-2">
					<label className="flex items-start gap-3 text-xs text-ink-subtle">
						<input
							type="checkbox"
							className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary accent-primary"
							checked={payment.policyAccepted ?? false}
							onChange={handleCheckboxChange("policyAccepted")}
						/>
						<span>
							We ask that you please reschedule or cancel at least 24 hours
							before the beginning of your appointment or you may be charged a
							cancellation fee of $50. In the event of emergency, contact us
							directly. Your card will be held in case of late cancellation and
							for future purchases. It will not be charged now.
						</span>
					</label>
					{errors.policyAccepted && (
						<BookingErrorText className="mt-0">
							{errors.policyAccepted}
						</BookingErrorText>
					)}
				</div>

				<BookingButton
					type="submit"
					className="w-full py-3 text-body shadow-none"
				>
					Book appointment
				</BookingButton>

				<p className="text-xs text-ink-muted text-center">
					By creating this appointment, you acknowledge you will receive
					automated transactional messages from this merchant.
				</p>
			</FormSection>
		</BookingCard>
	);
}
