import { redirect } from 'next/navigation'
import { isBookingStep } from '@/lib/bookingSteps'
import StepContact from '@/components/booking/StepContact'
import StepPayment from '@/components/booking/StepPayment'
import StepConfirmation from '@/components/booking/StepConfirmation'

type BookingPageProps = {
  params: { step?: string | string[] } | Promise<{ step?: string | string[] }>
}

export default async function BookingPage({ params }: BookingPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const rawStep = resolvedParams?.step
  const step = Array.isArray(rawStep) ? rawStep[0] : rawStep

  if (!step) {
    return <StepContact />
  }

  if (!isBookingStep(step)) {
    redirect('/booking/contact')
  }

  if (step === 'contact') {
    return <StepContact />
  }

  return step === 'payment' ? <StepPayment /> : <StepConfirmation />
}
