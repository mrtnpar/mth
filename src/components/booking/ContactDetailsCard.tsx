"use client";

import type React from "react";
import type { ContactInfo } from "@/components/booking/types";
import { useBooking } from "@/contexts/BookingContext";
import BookingCard from "./BookingCard";
import { BookingInput, BookingTextarea } from "./BookingField";
import FormSection from "./FormSection";

export default function ContactDetailsCard() {
	const { steps, navigation } = useBooking();
	const {
		data: contact,
		errors,
		update,
		validate,
		validateField,
	} = steps.contact;

	const handleChange =
		(field: keyof ContactInfo) =>
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const value = event.target.value;
			update({ [field]: value } as Partial<ContactInfo>);
			validateField?.(field, value);
		};

	const handleBlur =
		(field: keyof ContactInfo) =>
		(event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			validateField?.(field, event.target.value);
		};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validate()) {
			navigation.nextStep();
		}
	};

	return (
		<BookingCard className="px-6 py-6 md:px-8 md:py-7">
			<FormSection
				as="form"
				id="contact-form"
				onSubmit={handleSubmit}
				title="Enter your details below"
				bodyClassName="space-y-5"
			>
				<BookingInput
					id="name"
					type="text"
					label="Full Name"
					placeholder="Input text"
					value={contact.name}
					onChange={handleChange("name")}
					onBlur={handleBlur("name")}
					error={errors.name}
				/>

				<BookingInput
					id="email"
					type="email"
					label="Email"
					placeholder="Input text"
					value={contact.email}
					onChange={handleChange("email")}
					onBlur={handleBlur("email")}
					error={errors.email}
				/>

				<BookingInput
					id="phone"
					type="tel"
					label="Phone"
					placeholder="(555) 123-4567"
					value={contact.phone}
					onChange={handleChange("phone")}
					onBlur={handleBlur("phone")}
					mask="(___) ___-____"
					replacement={{ _: /\d/ }}
					error={errors.phone}
				/>

				<BookingTextarea
					id="reason"
					label="Visit reason"
					placeholder="Input text"
					value={contact.visitReason || ""}
					onChange={handleChange("visitReason")}
					onBlur={handleBlur("visitReason")}
					rows={3}
				/>
			</FormSection>
		</BookingCard>
	);
}
