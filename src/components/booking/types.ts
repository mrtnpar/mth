export interface ContactInfo {
  name: string
  email: string
  phone: string
  visitReason?: string
}

export type ContactErrors = Partial<Record<keyof ContactInfo, string>>

export interface PaymentInfo {
  method: 'card' | 'paypal'
  cardNumber?: string
  cardExpiry?: string
  cardCvc?: string
  billingZip?: string
  policyAccepted?: boolean
}

export type PaymentErrors = Partial<Record<keyof PaymentInfo, string>>

export interface ConfirmationInfo {
  confirmationNumber?: string
}

export type ConfirmationErrors = Partial<Record<keyof ConfirmationInfo, string>>

export interface BookingData {
  contact: ContactInfo
  payment: PaymentInfo
  confirmationNumber?: string
}

export type BookingStep = 'contact' | 'payment' | 'confirmation'

export interface BookingErrors {
  contact: ContactErrors
  payment: PaymentErrors
  confirmation: ConfirmationErrors
}

export interface StepState<Data, Errors> {
  data: Data
  errors: Errors
  update: (data: Partial<Data>) => void
  validate: () => boolean
  validateField?: (field: keyof Data, value?: string) => boolean
}

export interface BookingContextType {
  steps: {
    all: {
      data: BookingData
      errors: BookingErrors
      validate: () => boolean
    }
    contact: StepState<ContactInfo, ContactErrors>
    payment: StepState<PaymentInfo, PaymentErrors>
    confirmation: StepState<ConfirmationInfo, ConfirmationErrors>
  }
  navigation: {
    currentStep: BookingStep
    goToStep: (step: BookingStep) => void
    nextStep: () => void
    previousStep: () => void
  }
}
