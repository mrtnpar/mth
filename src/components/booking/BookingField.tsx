import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { InputMask, type MaskOptions } from '@react-input/mask'
import BookingLabel from './BookingLabel'
import BookingErrorText from './BookingErrorText'

const inputBase =
  'mt-2 w-full rounded-input border-input-width bg-surface px-3 py-3 text-body text-ink placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary h-12'
const textAreaBase =
  'mt-2 w-full rounded-input border-input-width bg-surface px-3 py-3 text-body text-ink placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary'

type BookingInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> &
  MaskOptions & {
  id: string
  label: string
  error?: string
  labelClassName?: string
}

type BookingTextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & {
  id: string
  label: string
  error?: string
  labelClassName?: string
}

export function BookingInput({
  id,
  label,
  error,
  labelClassName,
  className,
  mask,
  replacement,
  showMask,
  separate,
  track,
  modify,
  ...props
}: BookingInputProps) {
  const inputClass = `${inputBase} ${
    error ? 'border-danger' : 'border-input'
  } ${className ?? ''}`.trim()
  const inputProps = {
    id,
    className: inputClass,
    ...props,
  }
  const hasMask = typeof mask === 'string' && mask.length > 0

  return (
    <div>
      <BookingLabel htmlFor={id} className={labelClassName}>
        {label}
      </BookingLabel>
      {hasMask ? (
        <InputMask
          mask={mask}
          replacement={replacement}
          showMask={showMask}
          separate={separate}
          track={track}
          modify={modify}
          {...inputProps}
        />
      ) : (
        <input {...inputProps} />
      )}
      {error && <BookingErrorText>{error}</BookingErrorText>}
    </div>
  )
}

export function BookingTextarea({
  id,
  label,
  error,
  labelClassName,
  className,
  ...props
}: BookingTextareaProps) {
  const textAreaClass = `${textAreaBase} ${
    error ? 'border-danger' : 'border-input'
  } ${className ?? ''}`.trim()

  return (
    <div>
      <BookingLabel htmlFor={id} className={labelClassName}>
        {label}
      </BookingLabel>
      <textarea id={id} className={textAreaClass} {...props} />
      {error && <BookingErrorText>{error}</BookingErrorText>}
    </div>
  )
}
