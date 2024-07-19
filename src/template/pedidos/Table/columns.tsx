'use client'

import { ColumnDef } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Printer, SquareMenu, SquarePen, XCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { useFormContext } from 'react-hook-form'
import { useModal } from '@/contexts/modal'
import { Column } from '@/template/recheios/Table/columns/components'
import { FormDataPedidos } from '@/app/pedidos/types'
import { StatusProps } from '@/app/pedidos/schema'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { useContextOrders } from '@/contexts/dataContexts/ordersContext/useContextOrders'
import { useView } from '@/contexts/view'
import { GetOrder } from '@/types/order'
import { useModalPrint } from '@/contexts/modalPrint'

export const columns: ColumnDef<GetOrder>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => {
      const toggleSorting = () => column.toggleSorting(column.getIsSorted() === 'asc')

      return <Column.SortingHead label="Data" toggleSorting={toggleSorting} />
    },
    cell: ({ cell }) => <div className="text-nowrap">{new Date(cell.getValue<string>()).toLocaleDateString()}</div>,
  },
  {
    accessorKey: 'client.name',
    header: ({ column }) => {
      const toggleSorting = () => column.toggleSorting(column.getIsSorted() === 'asc')

      return <Column.SortingHead label="Nome" toggleSorting={toggleSorting} />
    },
    cell: ({ cell }) => cell.getValue<string>(),
  },

  {
    accessorKey: 'delivery',
    header: ({ column }) => {
      const toggleSorting = () => column.toggleSorting(column.getIsSorted() === 'asc')

      return <Column.SortingHead toggleSorting={toggleSorting} label="Delivery" />
    },
    cell: ({ cell }) => (cell.getValue<boolean>() ? 'Entrega' : 'Retirada'),
  },
  {
    accessorKey: 'total',
    header: ({ column }) => {
      const toggleSorting = () => column.toggleSorting(column.getIsSorted() === 'asc')

      return <Column.SortingHead toggleSorting={toggleSorting} label="Total" />
    },
    cell: ({ cell }) =>
      cell.getValue<number>().toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      const toggleSorting = () => column.toggleSorting(column.getIsSorted() === 'asc')

      return <Column.SortingHead toggleSorting={toggleSorting} label="Status" />
    },
    cell: ({ cell }) => {
      const status = cell.getValue<StatusProps>()

      const statusNormalized = status === 'EM_PRODUCAO' ? 'EM PRODUÇÃO' : status
      return <Badge variant={status.toLocaleLowerCase() as BadgeProps['variant']}>{statusNormalized}</Badge>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { removeOrder, getAllOrders } = useContextOrders()
      const methods = useFormContext<FormDataPedidos>()
      const linha = row.original

      const { address, orderProduct, date, bolo, payment, docesPP, ...rest } = linha

      const order: FormDataPedidos = {
        address: address?.id,
        value_frete: address?.value_frete,
        logistic: address?.type_frete,
        cakes: bolo?.map((cake) => ({
          id: cake.id,
          peso: cake.peso,
          formato: cake.formato,
          massa: cake.massa,
          recheios: cake.recheio,
          price: cake.price,
          cobertura: cake.cobertura,
          decoracao: cake.description ?? '',
          banner: cake.banner,
          tem_topper: cake.topper ? true : false,
          topper: {
            tema: cake.topper?.tema ?? '',
            name: cake.topper?.name ?? '',
            idade: cake.topper?.idade,
            price: cake.topper?.price ?? 15,
            description: cake.topper?.description ?? '',
            banner: cake.topper?.banner ?? '',
            recebido: cake.topper?.recebido ?? false,
          },
        })),
        orderProduct: orderProduct.reduce(
          (acc, item) => {
            if (item.category.priority < 0) {
              return acc
            }
            if (typeof acc[item.category.priority] === 'undefined') {
              acc[item.category.priority] = [item]

              return acc
            }

            acc[item.category.priority].push(item)

            return acc
          },
          [] as FormDataPedidos['orderProduct'],
        ),
        docesPP,
        date: new Date(date),
        payment: payment.map((pay) => {
          return {
            date: pay.date ? new Date(pay.date) : new Date(),
            paid: pay.paid,
            value: pay.value,
            formPayment: pay.type,
          }
        }),
        ...rest,
      }

      const { handleOpenOrder } = useModal()
      const { handleOpen, setId } = useView()
      const { handleOpen: handleOpenPrint } = useModalPrint()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => {
                setId(linha.id)
                handleOpenPrint()
              }}
            >
              Imprimir
              <Printer className="ml-2 h-4 w-4" />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setId(linha.id)
                handleOpen()
              }}
            >
              Vizualizar
              <SquareMenu className="ml-2 h-4 w-4" />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                console.log(order)
                methods.reset(order)
                handleOpenOrder()
              }}
            >
              Editar
              <SquarePen className="ml-2 h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600 hover:bg-red-600 hover:text-white"
              onClick={() =>
                removeOrder(linha.id)
                  .then(() => {
                    toast(`Pedido de ${linha.client.name} removido com sucesso`)
                    getAllOrders()
                  })
                  .catch((error) => toast.error(error.response.data?.error))
              }
            >
              Excluir <XCircle className="ml-2 h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
