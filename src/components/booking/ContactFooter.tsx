'use client'

import { contactSchema } from '@/lib/bookingValidation'
import { useBooking } from '@/contexts/BookingContext'
import BookingButton from './BookingButton'

export default function ContactFooter() {
  const { steps } = useBooking()
  const isValid = contactSchema.safeParse(steps.contact.data).success

  return (
    <div className="border-t border-border bg-surface/95">
      <div className="mx-auto w-full max-w-5xl px-4 py-4">
        <div className="flex">
          <BookingButton
            type="submit"
            form="contact-form"
            className="w-full md:ml-auto md:w-32"
            disabled={!isValid}
          >
            Continue
          </BookingButton>
        </div>
      </div>
    </div>
  )
}
