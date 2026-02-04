import BookingStepLayout from "./BookingStepLayout";
import ContactInfoCard from "./ContactInfoCard";
import PaymentDetailsCard from "./PaymentDetailsCard";

export default function StepPayment() {
	return (
		<BookingStepLayout>
			<h1 className="md:hidden text-title font-bold text-center">
				Book appointment
			</h1>
			<div className="mt-5 grid gap-6 md:grid-cols-[280px_minmax(0,1fr)] md:items-start">
				<ContactInfoCard />
				<PaymentDetailsCard />
			</div>
		</BookingStepLayout>
	);
}
