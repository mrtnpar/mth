import BookingStepLayout from "./BookingStepLayout";
import ContactDetailsCard from "./ContactDetailsCard";
import ContactFooter from "./ContactFooter";
import ContactInfoCard from "./ContactInfoCard";

export default function StepContact() {
	return (
		<BookingStepLayout footer={<ContactFooter />}>
			<h1 className="md:hidden text-title font-bold text-center">
				Book appointment
			</h1>
			<div className="mt-5 grid gap-6 md:grid-cols-[280px_minmax(0,1fr)] md:items-start">
				<ContactInfoCard />
				<ContactDetailsCard />
			</div>
		</BookingStepLayout>
	);
}
