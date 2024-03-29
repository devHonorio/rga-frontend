import { AddressProps } from '@/app/enderecos/types'
import { AxiosResponse } from 'axios'

export interface AddressContextData {
  address: AddressProps[]
  getAllAddresses: () => Promise<void>
  addAddress: (address: Omit<AddressProps, 'address_complete' | 'id'>) => Promise<AxiosResponse>
  removeAddress: (address_id: string) => Promise<AxiosResponse>
  editAddress: (address: Omit<AddressProps, 'address_complete'>) => Promise<AxiosResponse>
}
