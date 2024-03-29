import { AuthProvider } from './Authcontext'
import { ProviderAddress } from './dataContexts/addressContext'
import { ProviderCategorys } from './dataContexts/categorysContext'
import { ProviderClient } from './dataContexts/clientesContext'
import { ProviderOrders } from './dataContexts/ordersContext'
import { ProviderProduct } from './dataContexts/productsContext'

export const ProvidersContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthProvider>
        <ProviderCategorys>
          <ProviderClient>
            <ProviderAddress>
              <ProviderOrders>
                <ProviderProduct>{children}</ProviderProduct>
              </ProviderOrders>
            </ProviderAddress>
          </ProviderClient>
        </ProviderCategorys>
      </AuthProvider>
    </>
  )
}
