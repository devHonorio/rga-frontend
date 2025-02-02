'use client'
import { FormDataCliente } from '@/app/clientes/types'
import { useFormClient } from '@/app/clientes/useFormClient'
import { MFooter } from '@/components/comum/Modal/components/MFooter'
import { InputForm } from '@/components/ui-componets/input-form'
import { SelectSearch } from '@/components/ui-componets/select-search'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { useContextClient } from '@/contexts/dataContexts/clientesContext/useContextClient'
import { PlusCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { ModalAddress } from '../address/ModalAddress'
import { useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { useQuery } from '@tanstack/react-query'
import { AddressProps } from '@/app/enderecos/types'
import { api } from '@/services/api/apiClient'

const fetchDebounce = debounce((func: () => void) => func(), 500)

export const ModalClient = ({
  onOpenClient,
  handleOpenClient,
}: {
  onOpenClient: boolean
  handleOpenClient: () => void
}) => {
  const { addClient, getAllClients } = useContextClient()
  const methods = useFormClient()

  const [openModalAddress, setOpenModalAddress] = useState(false)

  const [enebleSearch, setEnableSearch] = useState(false)
  const [address, setAddress] = useState('rua')

  const { data, refetch, isLoading } = useQuery<AddressProps[]>({
    queryKey: ['search-address', address],
    queryFn: async () => {
      const response = await api.get(`/search-address/${address}`)
      console.log(response.data)
      return response.data
    },
    enabled: enebleSearch && address.length > 2,
  })

  useEffect(() => {
    fetchDebounce(() => {
      setEnableSearch(true)
      refetch().finally(() => setEnableSearch(false))
      console.log('debounce:address')
    })
  }, [address])

  const submit = async ({ name, tel, address_id }: FormDataCliente) => {
    console.log({ name, tel, address_id })
    addClient({
      name: name
        .toLocaleLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''),
      tel,
      address_id,
    })
      .then(() => {
        handleOpenClient()
        methods.reset({})
        getAllClients()
        toast.success(`${name} adicionado com sucesso!`)
      })
      .catch((error) => {
        toast.error(error.response.data?.error)

        console.log(error)
      })
  }

  return (
    <Dialog
      onOpenChange={() => {
        handleOpenClient()
        methods.reset({})
      }}
      open={onOpenClient}
    >
      <DialogTrigger asChild>
        <Button>
          Adicionar cliente
          <PlusCircle className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar cliente</DialogTitle>
        </DialogHeader>
        <Form {...methods}>
          <form className="flex flex-col gap-5">
            <InputForm control={methods.control} name="id" readOnly className="hidden" />

            <InputForm
              control={methods.control}
              name="name"
              type="text"
              label="Nome"
              placeholder="Nome"
              showMessageError
            />

            <InputForm
              control={methods.control}
              name="tel"
              type="text"
              label="Telefone"
              placeholder="Telefone"
              showMessageError
            />

            <SelectSearch
              control={methods.control}
              name="address_id"
              label="Endereço"
              data={data?.map(({ id, address_complete }) => ({ value: id, label: address_complete }))}
              onSelect={(value) => methods.setValue('address_id', value)}
              onValueChange={(value) => setAddress(value)}
              commandEmpty={
                <ModalAddress
                  openAddress={openModalAddress}
                  handleOpenAddress={() => setOpenModalAddress(!openModalAddress)}
                />
              }
              isLoading={isLoading}
              shouldFilter={false}
            />

            <MFooter>
              <Button type="button" onClick={() => submit(methods.getValues())}>
                Salvar
              </Button>
            </MFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
