import BookingCard from "./BookingCard";

const services = [
	{ name: "Botox", duration: "45 mins", price: "$200" },
	{ name: "Botox", duration: "45 mins", price: "$200" },
];

export default function ConfirmationServicesCard() {
	return (
		<BookingCard className="px-5 py-5">
			<p className="text-xs font-semibold text-ink-muted">Services</p>
			<div className="mt-4 space-y-4">
				{services.map((service, index) => (
					<div key={`${service.name}-${index}`}>
						<p className="text-sm font-semibold text-ink">{service.name}</p>
						<p className="mt-1 text-xs text-ink-muted">
							{service.duration} <span className="px-1">•</span>{" "}
							{service.price}
						</p>
					</div>
				))}
			</div>
		</BookingCard>
	);
}
