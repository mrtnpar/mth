"use client";

import { useBooking } from "@/contexts/BookingContext";
import type { BookingStep } from "./types";

const steps: { key: BookingStep; label: string }[] = [
	{ key: "contact", label: "Contact" },
	{ key: "payment", label: "Payment" },
	{ key: "confirmation", label: "Confirmation" },
];

export default function BookingProgress() {
	const { navigation } = useBooking();
	const { currentStep, goToStep } = navigation;

	const currentIndex = steps.findIndex((s) => s.key === currentStep);

	return (
		<div className="w-full max-w-2xl mx-auto mb-8">
			<div className="flex items-center justify-between">
				{steps.map((step, index) => {
					const isCompleted = index < currentIndex;
					const isActive = index === currentIndex;

					return (
						<div key={step.key} className="flex items-center flex-1">
							<button
								type="button"
								onClick={() => goToStep(step.key)}
								className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
									isActive
										? "bg-blue-600 text-white"
										: isCompleted
											? "bg-green-600 text-white"
											: "bg-gray-200 text-gray-600"
								}`}
							>
								{isCompleted ? "✓" : index + 1}
							</button>
							<span
								className={`ml-2 text-sm font-medium ${
									isActive
										? "text-blue-600"
										: isCompleted
											? "text-green-600"
											: "text-gray-500"
								}`}
							>
								{step.label}
							</span>
							{index < steps.length - 1 && (
								<div
									className={`flex-1 h-1 mx-4 ${
										isCompleted ? "bg-green-600" : "bg-gray-200"
									}`}
								/>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
