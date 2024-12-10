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
import { CheckCircle, Circle, MoreHorizontal, Printer, SquarePen, XCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { useFormContext } from 'react-hook-form'
import { useModal } from '@/contexts/modal'
import { FormDataPedidos } from '@/app/pedidos/types'
import { StatusProps } from '@/app/pedidos/schema'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { useContextOrders } from '@/contexts/dataContexts/ordersContext/useContextOrders'
import { useView } from '@/contexts/view'
import { GetOrder } from '@/types/order'
import { useModalPrint } from '@/contexts/modalPrint'
import { DataTableColumnHeader } from '@/components/data-table/ColumnHeader'
import { api } from '@/services/api/apiClient'

export const columns: ColumnDef<GetOrder>[] = [
  {
    id: 'handleStatus',
    header: ({ table }) => {
      const { getAllOrders } = useContextOrders()
      const selectedRowIds = table.getSelectedRowModel().rows.map((row) => row.original.id)

      return (
        <Button
          className="w-full"
          size="sm"
          variant="link"
          disabled={selectedRowIds.length === 0}
          onClick={async () => {
            await api
              .patch('/relatorios', { ids: selectedRowIds, status: 'RASCUNHO' })
              .catch((error) => {
                toast.error(error.response.data?.error)
              })
              .then(() => {
                table.resetRowSelection()
                toast.success('Pedidos rascunhados com sucesso!')
              })

            getAllOrders(true).catch(() => {
              toast.error('Erro ao buscar pedidos')
            })
          }}
        >
          Rascunhar
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button variant="link" className="w-full" onClick={() => row.toggleSelected()}>
          {row.getIsSelected() ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
        </Button>
      </div>
    ),
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Data" />
    },
    cell: ({ cell }) => <div className="text-nowrap">{new Date(cell.getValue<string>())?.toLocaleDateString()}</div>,
  },
  {
    id: 'name',
    accessorKey: 'client.name',
    header: 'Nome',
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ cell }) =>
      cell.getValue<number>().toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />
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
      const { setId } = useView()
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
                    getAllOrders(true)
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
