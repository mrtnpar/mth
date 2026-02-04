import type {
  FormHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from 'react'
import BookingSectionTitle from './BookingSectionTitle'

type BaseProps = {
  title: string
  children: ReactNode
  className?: string
  bodyClassName?: string
  titleClassName?: string
}

type FormProps = BaseProps &
  FormHTMLAttributes<HTMLFormElement> & {
    as: 'form'
  }

type DivProps = BaseProps &
  HTMLAttributes<HTMLDivElement> & {
    as?: 'div'
  }

type FormSectionProps = FormProps | DivProps

export default function FormSection(props: FormSectionProps) {
  const {
    title,
    children,
    className,
    bodyClassName,
    titleClassName,
    as = 'div',
    ...rest
  } = props
  const bodyBase = 'mt-5'

  return (
    <div className={className}>
      <BookingSectionTitle className={titleClassName}>
        {title}
      </BookingSectionTitle>
      {as === 'form' ? (
        <form
          {...(rest as FormHTMLAttributes<HTMLFormElement>)}
          className={`${bodyBase} ${bodyClassName ?? ''}`.trim()}
        >
          {children}
        </form>
      ) : (
        <div
          {...(rest as HTMLAttributes<HTMLDivElement>)}
          className={`${bodyBase} ${bodyClassName ?? ''}`.trim()}
        >
          {children}
        </div>
      )}
    </div>
  )
}
