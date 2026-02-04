import { z } from 'zod'
import type { ContactErrors, ContactInfo } from '@/components/booking/types'

export const contactSchema = z.object({
  name: z.string().trim().min(1, { message: 'Full name is required' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email' }),
  phone: z
    .string()
    .trim()
    .min(1, { message: 'Phone is required' })
    .regex(
      /^(?:\+?1[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/,
      { message: 'Enter a valid US phone number' }
    ),
  visitReason: z.string().optional(),
})

export function mapContactErrors(error: z.ZodError<ContactInfo>) {
  const result: ContactErrors = {}
  const { fieldErrors } = error.flatten()

  for (const [key, messages] of Object.entries(fieldErrors)) {
    if (!messages || messages.length === 0) continue
    result[key as keyof ContactInfo] = messages[0]
  }

  return result
}
