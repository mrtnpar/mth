import type { BookingStep } from '@/components/booking/types'

export const bookingSteps: BookingStep[] = ['contact', 'payment', 'confirmation']

export function isBookingStep(step: string): step is BookingStep {
  return bookingSteps.includes(step as BookingStep)
}

export function getStepIndex(step: BookingStep) {
  return bookingSteps.indexOf(step)
}

export function getNextStep(step: BookingStep) {
  const index = getStepIndex(step)
  return bookingSteps[Math.min(index + 1, bookingSteps.length - 1)]
}

export function getPreviousStep(step: BookingStep) {
  const index = getStepIndex(step)
  return bookingSteps[Math.max(index - 1, 0)]
}
