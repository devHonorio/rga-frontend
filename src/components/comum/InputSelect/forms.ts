import { useForm } from 'react-hook-form'
import { FormData } from './types'

export const useStateInputSearch = () => {
  const { register, watch, setValue } = useForm<FormData>({})
  return { register, watch, setValue }
}