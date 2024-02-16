import { z } from 'zod'
import { schema } from './schema'

export interface InputSelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
  data: OptionProps[]
  label?: string
  setValueId: (value: string) => void
}

export interface OptionProps {
  label: string
  value: string
}

export type FormData = z.infer<typeof schema>