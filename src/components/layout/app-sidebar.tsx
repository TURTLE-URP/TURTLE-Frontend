import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import type { Icon } from '@phosphor-icons/react'
import {
  Buildings,
  CaretDown,
  Chair,
  ClipboardText,
  Package,
  SignOut,
  SquaresFour,
  User,
  UsersThree,
  Warehouse,
} from '@phosphor-icons/react'
import { getMockSesion } from '@/features/proveedores/data/mock-session'
import { puedeGestionarProveedores } from '@/features/proveedores/logic/access'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

type AppPath =
  | '/'
  | '/mesas'
  | '/insumos'
  | '/abastecimiento'
  | '/abasto'
  | '/usuarios'
  | '/proveedores'

type GroupId = 'gestion' | 'operacion'

interface NavItem {
  to: AppPath
  label: string
  icon: Icon
  gated?: 'proveedores'
}

interface NavGroup {
  id: GroupId
  label: string
  items: NavItem[]
}

const EMPRESA_NOMBRE = 'El Rinconcito Norteño'

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'gestion',
    label: 'Gestión',
    items: [
      { to: '/insumos', label: 'Insumos', icon: Package },
      { to: '/proveedores', label: 'Proveedores', icon: Buildings, gated: 'proveedores' },
      { to: '/', label: 'Almacenes', icon: Warehouse },
      { to: '/usuarios', label: 'Personal', icon: UsersThree },
      { to: '/mesas', label: 'Mesas', icon: Chair },
    ],
  },
  {
    id: 'operacion',
    label: 'Operación en almacén',
    items: [
      { to: '/abastecimiento', label: 'Cotiz. de Abasto', icon: SquaresFour },
      { to: '/abasto', label: 'Órdenes de Abasto', icon: ClipboardText },
    ],
  },
]

function isActive(pathname: string, to: AppPath) {
  return pathname === to
}

function displayNameFromEmail(email: string) {
  const local = email.split('@')[0] ?? email
  if (!local) return email
  return local.charAt(0).toUpperCase() + local.slice(1)
}

function initialsFromEmail(email: string) {
  const local = email.split('@')[0] ?? email
  return (local.charAt(0) || 'U').toUpperCase()
}

export function AppSidebar() {
  const { pathname } = useLocation()
  const session = useAuthStore((state) => state.session)
  const signOut = useAuthStore((state) => state.signOut)
  const canProveedores = puedeGestionarProveedores(getMockSesion().rol)

  const groups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      if (item.gated === 'proveedores') return canProveedores
      return true
    }),
  })).filter((group) => group.items.length > 0)

  const [openGroups, setOpenGroups] = useState<Record<GroupId, boolean>>({
    gestion: false,
    operacion: false,
  })

  function toggleGroup(id: GroupId) {
    setOpenGroups((current) => ({ ...current, [id]: !current[id] }))
  }

  const userName = session ? displayNameFromEmail(session.email) : 'Invitado'
  const userRole = session
    ? canProveedores
      ? 'Administrador'
      : 'Invitado'
    : 'Sin sesión'
  const userInitial = session ? initialsFromEmail(session.email) : '?'

  return (
    <aside
      aria-label="Navegación principal"
      className="flex h-full w-72 shrink-0 flex-col border-r border-border bg-background"
    >
      <div className="shrink-0 px-3 pt-4 pb-2">
        <div className="rounded-2xl bg-muted/80 px-4 py-3.5">
          <p className="text-lg font-semibold tracking-[0.22em] text-foreground uppercase">
            TURTLE
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">{EMPRESA_NOMBRE}</p>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-2">
        {groups.map((group) => {
          const open = openGroups[group.id]
          const panelId = `sidebar-group-${group.id}`

          return (
            <div key={group.id}>
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex w-full items-center justify-between rounded-md px-1 py-1 text-left text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <span>{group.label}</span>
                <CaretDown
                  size={14}
                  className={cn('shrink-0 transition-transform duration-200', open && 'rotate-180')}
                />
              </button>

              {open ? (
                <ul id={panelId} className="mt-1.5 space-y-1.5">
                  {group.items.map(({ to, label, icon: IconComp }) => {
                    const active = isActive(pathname, to)
                    return (
                      <li key={to}>
                        <Link
                          to={to}
                          className={cn(
                            'flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors',
                            active
                              ? 'border-transparent bg-muted text-foreground'
                              : 'border-border bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                          )}
                          aria-current={active ? 'page' : undefined}
                        >
                          <IconComp
                            size={18}
                            weight={active ? 'fill' : 'regular'}
                            className={active ? 'text-foreground' : 'text-muted-foreground'}
                          />
                          <span>{label}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </div>
          )
        })}
      </nav>

      <div className="mt-auto shrink-0 border-t border-border px-3 py-3">
        {session ? (
          <div className="flex items-center gap-3 rounded-xl px-1 py-1">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground"
            >
              {userInitial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{userName}</p>
              <p className="truncate text-xs text-muted-foreground">{userRole}</p>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              aria-label="Cerrar sesión"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <SignOut size={18} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-3 rounded-xl px-1 py-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted"
            >
              <User size={18} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">Invitado</p>
              <p className="truncate text-xs text-muted-foreground">Iniciar sesión</p>
            </div>
          </Link>
        )}
      </div>
    </aside>
  )
}
