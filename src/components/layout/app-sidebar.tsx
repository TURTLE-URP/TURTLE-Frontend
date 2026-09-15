import { Link, useLocation } from '@tanstack/react-router'
import type { Icon } from '@phosphor-icons/react'
import {
  Warehouse,
  Chair,
  Package,
  Truck,
  ClipboardText,
  UsersThree,
  Buildings,
} from '@phosphor-icons/react'
import { getMockSesion } from '@/features/proveedores/data/mock-session'
import { puedeGestionarProveedores } from '@/features/proveedores/logic/access'

type AppPath =
  | '/'
  | '/mesas'
  | '/insumos'
  | '/abastecimiento'
  | '/abasto'
  | '/usuarios'
  | '/proveedores'

interface NavItem {
  to: AppPath
  label: string
  icon: Icon
  gated?: 'proveedores'
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Almacén', icon: Warehouse },
  { to: '/mesas', label: 'Mesas', icon: Chair },
  { to: '/insumos', label: 'Insumos', icon: Package },
  { to: '/abastecimiento', label: 'Abastecimiento', icon: Truck },
  { to: '/abasto', label: 'Abasto', icon: ClipboardText },
  { to: '/usuarios', label: 'Usuarios', icon: UsersThree },
  { to: '/proveedores', label: 'Proveedores', icon: Buildings, gated: 'proveedores' },
]

function isActive(pathname: string, to: AppPath) {
  return pathname === to
}

export function AppSidebar() {
  const { pathname } = useLocation()
  const canProveedores = puedeGestionarProveedores(getMockSesion().rol)

  const items = NAV_ITEMS.filter((item) => {
    if (item.gated === 'proveedores') return canProveedores
    return true
  })

  return (
    <aside
      aria-label="Navegación principal"
      className="flex w-64 shrink-0 flex-col border-r border-border bg-background"
    >
      <div className="px-4 py-5">
        <p className="mb-3 px-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Módulos
        </p>
        <nav className="space-y-1">
          {items.map(({ to, label, icon: IconComp }) => {
            const active = isActive(pathname, to)
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <IconComp
                  size={20}
                  weight={active ? 'fill' : 'regular'}
                  className={active ? 'text-foreground' : 'text-muted-foreground'}
                />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
