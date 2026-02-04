import BookingStepLayout from "./BookingStepLayout";
import ConfirmationServicesCard from "./ConfirmationServicesCard";
import ConfirmationSuccessCard from "./ConfirmationSuccessCard";
import ContactInfoCard from "./ContactInfoCard";

export default function StepConfirmation() {
	return (
		<BookingStepLayout containerClassName="max-w-xl">
			<h1 className="md:hidden text-title font-bold text-center">
				Book appointment
			</h1>
			<div className="mt-5 space-y-4">
				<ConfirmationSuccessCard />
				<ContactInfoCard />
				<ConfirmationServicesCard />
			</div>
		</BookingStepLayout>
	);
}
