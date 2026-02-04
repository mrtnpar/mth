import Image from "next/image";
import BookingCard from "./BookingCard";

export default function ContactInfoCard() {
	return (
		<BookingCard className="px-5 py-6">
			<div className="flex flex-col items-center text-center">
				<div className="flex items-center justify-center">
					<Image
						src="/booking/brand-logo.png"
						alt="Gold Spa"
						width={80}
						height={80}
					/>
				</div>
				<p className="mt-3 text-title font-semibold text-ink-heading">
					Gold Spa
				</p>
			</div>

			<div className="mt-6 grid grid-cols-label gap-y-4 text-sm">
				<span className="font-medium text-ink-muted">Address</span>
				<span className="leading-6 text-ink">
					2525 Camino del Rio S
					<br />
					Suite 315 Room 8
					<br />
					San Diego, CA 92108
				</span>
				<span className="font-medium text-ink-muted">Email</span>
				<span className="font-medium text-primary">goldspa@gmail.com</span>
				<span className="font-medium text-ink-muted">Phone</span>
				<span className="font-medium text-primary">+11 123 4567 222</span>
			</div>
		</BookingCard>
	);
}
