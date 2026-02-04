"use client";

import { useParams, useRouter } from "next/navigation";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import type { z } from "zod";
import type {
	BookingContextType,
	BookingData,
	BookingErrors,
	BookingStep,
	ConfirmationInfo,
	ContactInfo,
	PaymentErrors,
	PaymentInfo,
} from "@/components/booking/types";
import {
	getNextStep,
	getPreviousStep,
	isBookingStep,
} from "@/lib/bookingSteps";
import { contactSchema, mapContactErrors } from "@/lib/bookingValidation";

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const initialContact: ContactInfo = {
	name: "",
	email: "",
	phone: "",
	visitReason: "",
};

const initialPayment: PaymentInfo = {
	method: "card",
};

const initialBookingData: BookingData = {
	contact: initialContact,
	payment: initialPayment,
	confirmationNumber: undefined,
};

const initialErrors: BookingErrors = {
	contact: {},
	payment: {},
	confirmation: {},
};

const cardFieldKeys: (keyof PaymentInfo)[] = [
	"cardNumber",
	"cardExpiry",
	"cardCvc",
	"billingZip",
	"policyAccepted",
];

const normalizeStepParam = (stepParam: unknown): BookingStep => {
	const normalized = Array.isArray(stepParam) ? stepParam[0] : stepParam;
	return isBookingStep(String(normalized))
		? (normalized as BookingStep)
		: "contact";
};

const isContactDataValid = (contact: ContactInfo) =>
	contactSchema.safeParse(contact).success;

const isPaymentDataValid = (payment: PaymentInfo) => {
	if (payment.method !== "card") return true;
	return Boolean(
		payment.cardNumber?.trim() &&
			payment.cardExpiry?.trim() &&
			payment.cardCvc?.trim() &&
			payment.billingZip?.trim() &&
			payment.policyAccepted,
	);
};

const canAccessBookingStep = (
	step: BookingStep,
	contactValid: boolean,
	paymentValid: boolean,
) => {
	if (step === "contact") return true;
	if (step === "payment") return contactValid;
	return contactValid && paymentValid;
};

const firstIncompleteBookingStep = (
	contactValid: boolean,
	paymentValid: boolean,
): BookingStep => {
	if (!contactValid) return "contact";
	if (!paymentValid) return "payment";
	return "confirmation";
};

const removeKeys = <T extends object>(source: T, keys: (keyof T)[]) => {
	const next = { ...source };
	for (const key of keys) {
		delete next[key];
	}
	return next;
};

const buildPaymentErrors = (payment: PaymentInfo): PaymentErrors => {
	const nextErrors: PaymentErrors = {};
	if (payment.method === "card") {
		if (!payment.cardNumber) {
			nextErrors.cardNumber = "Card number is required";
		}

		if (!payment.cardExpiry) {
			nextErrors.cardExpiry = "Expiry date is required";
		}

		if (!payment.cardCvc) {
			nextErrors.cardCvc = "CVC is required";
		}

		if (!payment.billingZip) {
			nextErrors.billingZip = "Billing zip code is required";
		}

		if (!payment.policyAccepted) {
			nextErrors.policyAccepted = "Please accept the cancellation policy";
		}
	}
	return nextErrors;
};

const getContactFieldError = (field: keyof ContactInfo, value: string) => {
	const fieldSchema = contactSchema.shape[field] as z.ZodTypeAny;
	const result = fieldSchema.safeParse(value);
	if (result.success) return undefined;
	return result.error.issues[0]?.message ?? "Invalid value";
};

export function BookingProvider({ children }: { children: ReactNode }) {
	const [bookingData, setBookingData] =
		useState<BookingData>(initialBookingData);
	const [errors, setErrors] = useState<BookingErrors>(initialErrors);
	const router = useRouter();
	const params = useParams();
	const currentStep = normalizeStepParam(params?.step);

	const isContactValid = useMemo(
		() => isContactDataValid(bookingData.contact),
		[bookingData.contact],
	);

	const isPaymentValid = useMemo(
		() => isPaymentDataValid(bookingData.payment),
		[bookingData.payment],
	);

	const canAccessStep = useCallback(
		(step: BookingStep) =>
			canAccessBookingStep(step, isContactValid, isPaymentValid),
		[isContactValid, isPaymentValid],
	);

	const firstIncompleteStep = useCallback(
		() => firstIncompleteBookingStep(isContactValid, isPaymentValid),
		[isContactValid, isPaymentValid],
	);

	const resolveStep = useCallback(
		(step: BookingStep) => (canAccessStep(step) ? step : firstIncompleteStep()),
		[canAccessStep, firstIncompleteStep],
	);

	useEffect(() => {
		if (!canAccessStep(currentStep)) {
			const target = firstIncompleteStep();
			if (target !== currentStep) {
				router.replace(`/booking/${target}`);
			}
		}
	}, [currentStep, canAccessStep, firstIncompleteStep, router]);

	const updateContact = (data: Partial<ContactInfo>) => {
		const keys = Object.keys(data) as (keyof ContactInfo)[];
		setBookingData((prev) => ({
			...prev,
			contact: { ...prev.contact, ...data },
		}));
		if (keys.length === 0) return;
		setErrors((prev) => ({
			...prev,
			contact: removeKeys(prev.contact, keys),
		}));
	};

	const validateContact = () => {
		const result = contactSchema.safeParse(bookingData.contact);
		if (result.success) {
			setErrors((prev) => ({ ...prev, contact: {} }));
			return true;
		}

		setErrors((prev) => ({ ...prev, contact: mapContactErrors(result.error) }));
		return false;
	};

	const validateContactField = (field: keyof ContactInfo, value?: string) => {
		const fieldValue = value ?? bookingData.contact[field] ?? "";
		const fieldError = getContactFieldError(field, fieldValue);

		setErrors((prev) => {
			const nextContact = fieldError
				? { ...prev.contact, [field]: fieldError }
				: removeKeys(prev.contact, [field]);
			return { ...prev, contact: nextContact };
		});

		return !fieldError;
	};

	const updatePayment = (data: Partial<PaymentInfo>) => {
		const keys = Object.keys(data) as (keyof PaymentInfo)[];
		setBookingData((prev) => ({
			...prev,
			payment: { ...prev.payment, ...data },
		}));
		if (keys.length === 0) return;
		setErrors((prev) => {
			let nextPayment = removeKeys(prev.payment, keys);
			if (data.method === "paypal") {
				nextPayment = removeKeys(nextPayment, cardFieldKeys);
			}
			return { ...prev, payment: nextPayment };
		});
	};

	const validatePayment = () => {
		const nextErrors = buildPaymentErrors(bookingData.payment);
		setErrors((prev) => ({ ...prev, payment: nextErrors }));
		return Object.keys(nextErrors).length === 0;
	};

	const updateConfirmation = (data: Partial<ConfirmationInfo>) => {
		setBookingData((prev) => ({
			...prev,
			confirmationNumber: data.confirmationNumber ?? prev.confirmationNumber,
		}));
		setErrors((prev) => {
			if (data.confirmationNumber === undefined) return prev;
			return { ...prev, confirmation: {} };
		});
	};

	const validateConfirmation = () => {
		setErrors((prev) => ({ ...prev, confirmation: {} }));
		return true;
	};

	const validateAll = () => {
		const contactValid = validateContact();
		const paymentValid = validatePayment();
		const confirmationValid = validateConfirmation();
		return contactValid && paymentValid && confirmationValid;
	};

	const goToStep = (step: BookingStep) => {
		router.push(`/booking/${resolveStep(step)}`);
	};

	const nextStep = () => {
		router.push(`/booking/${resolveStep(getNextStep(currentStep))}`);
	};

	const previousStep = () => {
		router.push(`/booking/${getPreviousStep(currentStep)}`);
	};

	return (
		<BookingContext.Provider
			value={{
				steps: {
					all: {
						data: bookingData,
						errors,
						validate: validateAll,
					},
					contact: {
						data: bookingData.contact,
						errors: errors.contact,
						update: updateContact,
						validate: validateContact,
						validateField: validateContactField,
					},
					payment: {
						data: bookingData.payment,
						errors: errors.payment,
						update: updatePayment,
						validate: validatePayment,
					},
					confirmation: {
						data: { confirmationNumber: bookingData.confirmationNumber },
						errors: errors.confirmation,
						update: updateConfirmation,
						validate: validateConfirmation,
					},
				},
				navigation: {
					goToStep,
					nextStep,
					previousStep,
					currentStep,
				},
			}}
		>
			{children}
		</BookingContext.Provider>
	);
}

export function useBooking() {
	const context = useContext(BookingContext);
	if (context === undefined) {
		throw new Error("useBooking must be used within a BookingProvider");
	}
	return context;
}
