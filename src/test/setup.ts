import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import React from 'react'
import { vi } from 'vitest'

afterEach(() => {
  cleanup()
})

vi.mock('next/image', () => ({
  default: (props: React.ComponentProps<'img'> & { src?: string }) => {
    const { src, alt, ...rest } = props
    return React.createElement('img', { src, alt, ...rest })
  },
}))
