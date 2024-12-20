export interface NavLinkProps {
  href: string
  children?: React.ReactNode
  label?: string
}

export const configSidebarlinks: NavLinkProps[] = [
  { href: '/', label: 'Dashboard' },
  { href: '/pedidos', label: 'Pedidos' },
  { href: '/clientes', label: 'Clientes' },
  { href: '/enderecos', label: 'Endereços' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/recheios', label: 'Recheios' },
  { href: '/categorias', label: 'Categorias' },
  { href: '/relatorios', label: 'Relatórios' },
  { href: '/organizacao', label: 'Organização' },
  { href: '/topper', label: 'Topper' },
  { href: '/financeiro', label: 'Financeiro' },
  { href: '/fornecedores', label: 'Fornecedores' },
]
