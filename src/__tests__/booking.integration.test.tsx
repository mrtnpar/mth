import React, { useLayoutEffect, useRef } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookingPage from '@/app/booking/[step]/page'
import StepContact from '@/components/booking/StepContact'
import StepPayment from '@/components/booking/StepPayment'
import { BookingProvider, useBooking } from '@/contexts/BookingContext'
import type { ContactInfo, PaymentInfo } from '@/components/booking/types'

const navigationMocks = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockReplace: vi.fn(),
  mockRedirect: vi.fn((url: string) => {
    throw new Error('NEXT_REDIRECT')
  }),
  params: { step: 'contact' as string | string[] | undefined },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: navigationMocks.mockPush,
    replace: navigationMocks.mockReplace,
    prefetch: vi.fn(),
  }),
  useParams: () => ({ step: navigationMocks.params.step }),
  redirect: navigationMocks.mockRedirect,
}))

const validContact: ContactInfo = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '5551234567',
  visitReason: 'Massage',
}

const validPayment: PaymentInfo = {
  method: 'card',
  cardNumber: '4111111111111111',
  cardExpiry: '1234',
  cardCvc: '1234',
  billingZip: '92108',
  policyAccepted: true,
}

function SeedContact({ data }: { data: Partial<ContactInfo> }) {
  const { steps } = useBooking()
  const seeded = useRef(false)

  useLayoutEffect(() => {
    if (seeded.current) return
    seeded.current = true
    steps.contact.update(data)
  }, [data, steps.contact])

  return null
}

function SeedPayment({ data }: { data: Partial<PaymentInfo> }) {
  const { steps } = useBooking()
  const seeded = useRef(false)

  useLayoutEffect(() => {
    if (seeded.current) return
    seeded.current = true
    steps.payment.update(data)
  }, [data, steps.payment])

  return null
}

function BookingDebug() {
  const { steps } = useBooking()
  return (
    <div data-testid="confirmation-number">
      {steps.all.data.confirmationNumber ?? ''}
    </div>
  )
}

function renderWithProvider(
  ui: React.ReactElement,
  options?: { step?: string; seedContact?: Partial<ContactInfo>; seedPayment?: Partial<PaymentInfo> },
) {
  navigationMocks.params.step = options?.step ?? 'contact'
  return render(
    <BookingProvider>
      {options?.seedContact ? <SeedContact data={options.seedContact} /> : null}
      {options?.seedPayment ? <SeedPayment data={options.seedPayment} /> : null}
      {ui}
      <BookingDebug />
    </BookingProvider>,
  )
}

beforeEach(() => {
  navigationMocks.params.step = 'contact'
  navigationMocks.mockPush.mockClear()
  navigationMocks.mockReplace.mockClear()
  navigationMocks.mockRedirect.mockClear()
})

describe('booking integration', () => {
  it('renders the contact step page with the form', async () => {
    navigationMocks.params.step = 'contact'
    const element = await BookingPage({ params: { step: 'contact' } })

    render(
      <BookingProvider>
        {element}
      </BookingProvider>,
    )

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled()
  })

  it('redirects invalid booking steps to /booking/contact', async () => {
    await expect(BookingPage({ params: { step: 'not-a-step' } })).rejects.toThrow(
      'NEXT_REDIRECT',
    )
    expect(navigationMocks.mockRedirect).toHaveBeenCalledWith('/booking/contact')
  })

  it('submits valid contact details and navigates to payment', async () => {
    const user = userEvent.setup()
    renderWithProvider(<StepContact />, { step: 'contact' })

    await user.type(screen.getByLabelText(/full name/i), validContact.name)
    await user.type(screen.getByLabelText(/email/i), validContact.email)
    await user.type(screen.getByLabelText(/phone/i), validContact.phone)
    await user.type(screen.getByLabelText(/visit reason/i), validContact.visitReason ?? '')

    const continueButton = screen.getByRole('button', { name: /continue/i })
    expect(continueButton).toBeEnabled()

    await user.click(continueButton)

    await waitFor(() => {
      expect(navigationMocks.mockPush).toHaveBeenCalledWith('/booking/payment')
    })
  })

  it('shows validation errors for an invalid email', async () => {
    const user = userEvent.setup()
    renderWithProvider(<StepContact />, { step: 'contact' })

    await user.type(screen.getByLabelText(/full name/i), validContact.name)
    await user.type(screen.getByLabelText(/email/i), 'not-an-email')
    await user.type(screen.getByLabelText(/phone/i), validContact.phone)
    await user.tab()

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled()
  })

  it('guards payment when contact data is incomplete', async () => {
    renderWithProvider(<StepPayment />, { step: 'payment' })

    await waitFor(() => {
      expect(navigationMocks.mockReplace).toHaveBeenCalledWith('/booking/contact')
    })
  })

  it('shows payment errors and does not navigate when fields are missing', async () => {
    const user = userEvent.setup()
    renderWithProvider(<StepPayment />, { step: 'payment', seedContact: validContact })

    await user.click(screen.getByRole('button', { name: /book appointment/i }))

    expect(await screen.findByText(/card number is required/i)).toBeInTheDocument()
    expect(screen.getByText(/please accept the cancellation policy/i)).toBeInTheDocument()
    expect(navigationMocks.mockPush).not.toHaveBeenCalled()
  })

  it('submits valid payment details, sets confirmation, and navigates', async () => {
    const user = userEvent.setup()
    renderWithProvider(<StepPayment />, {
      step: 'payment',
      seedContact: validContact,
      seedPayment: { method: 'card' },
    })

    await user.type(screen.getByLabelText(/card number/i), validPayment.cardNumber ?? '')
    await user.type(screen.getByLabelText(/expiry date/i), validPayment.cardExpiry ?? '')
    await user.type(screen.getByLabelText(/cvv/i), validPayment.cardCvc ?? '')
    await user.type(screen.getByLabelText(/billing zip code/i), validPayment.billingZip ?? '')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /book appointment/i }))

    await waitFor(() => {
      expect(navigationMocks.mockPush).toHaveBeenCalledWith('/booking/confirmation')
    })

    await waitFor(() => {
      expect(screen.getByTestId('confirmation-number')).toHaveTextContent(/BK-/)
    })
  })
})
