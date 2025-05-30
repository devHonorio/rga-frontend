export interface GetTopper {
  id: string
  tema: string
  name: string
  idade: number
  price: number
  description: string
  banner: string
  recebido: boolean
  fornecedor: 'FORNECEDOR_PRINCIPAL' | 'FORNECEDOR_SECUNDARIO'
}
