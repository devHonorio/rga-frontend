export interface EditTopper {
  tema: string
  name: string
  idade: number
  price: number
  description: string
  banner: string
  tem_topper: boolean
  recebido: boolean
  fornecedor: 'FORNECEDOR_PRINCIPAL' | 'FORNECEDOR_SECUNDARIO'
}
