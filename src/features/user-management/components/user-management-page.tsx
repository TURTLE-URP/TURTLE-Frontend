import { useMemo, useState } from 'react'
import {
  Archive,
  ArrowDown,
  Check,
  DotsThree,
  Funnel,
  MagnifyingGlass,
  Plus,
  UserCircle,
  UsersThree,
  X,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

type UserStatus = 'Activo' | 'Pendiente' | 'Suspendido'
type UserRole = 'Administrador' | 'Editor' | 'Analista'

interface ManagedUser {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  lastAccess: string
  initials: string
  color: string
}

const initialUsers: ManagedUser[] = [
  { id: 1, name: 'Valentina Ríos', email: 'valentina.rios@egestionar.com', role: 'Administrador', status: 'Activo', lastAccess: 'Hoy, 09:42', initials: 'VR', color: 'bg-[#d6efe8] text-[#13705e]' },
  { id: 2, name: 'Santiago Morales', email: 'santiago.morales@egestionar.com', role: 'Editor', status: 'Activo', lastAccess: 'Hoy, 08:16', initials: 'SM', color: 'bg-[#e9ddf7] text-[#7651a8]' },
  { id: 3, name: 'Camila Torres', email: 'camila.torres@egestionar.com', role: 'Analista', status: 'Pendiente', lastAccess: 'Invitación enviada', initials: 'CT', color: 'bg-[#f8dfc6] text-[#a35f28]' },
  { id: 4, name: 'Diego Herrera', email: 'diego.herrera@egestionar.com', role: 'Editor', status: 'Activo', lastAccess: 'Ayer, 17:28', initials: 'DH', color: 'bg-[#dbe8f8] text-[#3d6997]' },
  { id: 5, name: 'Mariana López', email: 'mariana.lopez@egestionar.com', role: 'Analista', status: 'Suspendido', lastAccess: '12 mar, 14:05', initials: 'ML', color: 'bg-[#f6d9dd] text-[#aa4b5c]' },
  { id: 6, name: 'Nicolás Vargas', email: 'nicolas.vargas@egestionar.com', role: 'Editor', status: 'Activo', lastAccess: '11 mar, 11:32', initials: 'NV', color: 'bg-[#e3e7c9] text-[#68772e]' },
]

const statusStyles: Record<UserStatus, string> = {
  Activo: 'bg-[#e2f5ee] text-[#19755e]',
  Pendiente: 'bg-[#fff0d9] text-[#9c681e]',
  Suspendido: 'bg-[#fbe5e7] text-[#aa4b5c]',
}

export function UserManagementPage() {
  const [users, setUsers] = useState(initialUsers)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'Todos' | UserStatus>('Todos')
  const [selected, setSelected] = useState<number[]>([])
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const visibleUsers = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()
    return users.filter((user) => {
      const matchesQuery = !normalizedQuery || `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(normalizedQuery)
      return matchesQuery && (statusFilter === 'Todos' || user.status === statusFilter)
    })
  }, [query, statusFilter, users])

  const activeCount = users.filter((user) => user.status === 'Activo').length
  const pendingCount = users.filter((user) => user.status === 'Pendiente').length

  function toggleSelection(id: number) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  function toggleAll() {
    setSelected((current) => (current.length === visibleUsers.length ? [] : visibleUsers.map((user) => user.id)))
  }

  function toggleStatus(id: number) {
    setUsers((current) => current.map((user) => user.id === id ? { ...user, status: user.status === 'Activo' ? 'Suspendido' : 'Activo' } : user))
    setNotice('Estado del usuario actualizado')
  }

  function inviteUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsInviteOpen(false)
    setNotice('Invitación enviada correctamente')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f7f8f5] text-[#182d2c]">
      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="hidden w-60 shrink-0 border-r border-[#e4e9e4] bg-[#fbfcfa] px-5 py-7 lg:block">
          <div className="mb-10 flex items-center gap-2.5 px-2">
            <div className="grid size-8 place-items-center rounded-lg bg-[#19483f] text-white"><span className="font-serif text-lg">e</span></div>
            <span className="text-sm font-semibold tracking-tight">egestionar</span>
          </div>
          <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#91a19b]">Workspace</p>
          <nav className="mt-3 space-y-1" aria-label="Navegación del workspace">
            <a href="#resumen" className="flex items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-sm text-[#73827d] hover:bg-[#eff5f1]"><Archive size={18} /> Resumen</a>
            <a href="#usuarios" className="flex items-center gap-3 border-l-2 border-[#2b8c74] bg-[#edf6f1] px-3 py-2.5 text-sm font-semibold text-[#226b5a]"><UsersThree size={18} weight="fill" /> Usuarios</a>
            <a href="#actividad" className="flex items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-sm text-[#73827d] hover:bg-[#eff5f1]"><Check size={18} /> Actividad</a>
          </nav>
          <div className="mt-auto hidden border-t border-[#e4e9e4] pt-6 lg:block">
            <p className="px-2 text-xs text-[#91a19b]">Plan profesional</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e5ece7]"><div className="h-full w-3/5 rounded-full bg-[#e0a45f]" /></div>
            <p className="mt-2 px-2 text-xs text-[#73827d]">6 de 10 usuarios</p>
          </div>
        </aside>

        <main id="usuarios" className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2b8c74]">Administración</p>
                <h1 className="font-serif text-4xl tracking-tight text-[#173a36]">Usuarios</h1>
                <p className="mt-2 max-w-xl text-sm text-[#71827b]">Gestiona los accesos y permisos de tu equipo desde un solo lugar.</p>
              </div>
              <Button onClick={() => setIsInviteOpen(true)} className="h-10 rounded-md bg-[#19483f] px-4 text-sm hover:bg-[#276b5d]">
                <Plus weight="bold" /> Invitar usuario
              </Button>
            </div>

            <div className="mb-8 grid gap-3 sm:grid-cols-3">
              <StatCard label="Usuarios totales" value={users.length.toString()} detail="en tu workspace" icon={<UsersThree size={20} />} />
              <StatCard label="Usuarios activos" value={activeCount.toString()} detail="con acceso habilitado" icon={<Check size={20} />} tone="green" />
              <StatCard label="Invitaciones" value={pendingCount.toString()} detail="pendientes de aceptar" icon={<ArrowDown size={20} />} tone="orange" />
            </div>

            <section className="border border-[#e1e8e3] bg-white shadow-[0_12px_40px_rgba(35,68,58,0.05)]">
              <div className="flex flex-col gap-4 border-b border-[#e8eeea] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h2 className="text-sm font-semibold text-[#24423c]">Todos los usuarios</h2><p className="mt-1 text-xs text-[#91a19b]">{visibleUsers.length} resultados</p></div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <label className="relative"><MagnifyingGlass className="absolute left-3 top-2.5 text-[#91a19b]" size={16} /><span className="sr-only">Buscar usuarios</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar usuario..." className="h-9 w-full border border-[#dfe8e2] bg-[#fbfcfb] pl-9 pr-3 text-xs outline-none transition focus:border-[#3b9a81] sm:w-56" /></label>
                  <label className="relative"><Funnel className="pointer-events-none absolute left-3 top-2.5 text-[#91a19b]" size={15} /><span className="sr-only">Filtrar por estado</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="h-9 w-full appearance-none border border-[#dfe8e2] bg-[#fbfcfb] pl-9 pr-8 text-xs text-[#566b64] outline-none sm:w-36"><option>Todos</option><option>Activo</option><option>Pendiente</option><option>Suspendido</option></select></label>
                </div>
              </div>
              {selected.length > 0 && <div className="flex items-center justify-between bg-[#edf6f1] px-4 py-2 text-xs text-[#226b5a]"><span>{selected.length} seleccionados</span><button onClick={() => { setSelected([]); setNotice('Usuarios archivados') }} className="font-semibold hover:underline">Archivar selección</button></div>}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-[#fbfcfb] text-[10px] uppercase tracking-[0.12em] text-[#91a19b]"><tr><th className="w-12 px-4 py-3"><input type="checkbox" checked={visibleUsers.length > 0 && selected.length === visibleUsers.length} onChange={toggleAll} aria-label="Seleccionar todos" /></th><th className="px-3 py-3 font-semibold">Usuario</th><th className="px-3 py-3 font-semibold">Rol</th><th className="px-3 py-3 font-semibold">Estado</th><th className="px-3 py-3 font-semibold">Último acceso</th><th className="w-14 px-3 py-3" /></tr></thead>
                  <tbody className="divide-y divide-[#edf1ee]">{visibleUsers.map((user) => <tr key={user.id} className="group hover:bg-[#fcfdfc]"><td className="px-4 py-4"><input type="checkbox" checked={selected.includes(user.id)} onChange={() => toggleSelection(user.id)} aria-label={`Seleccionar a ${user.name}`} /></td><td className="px-3 py-4"><div className="flex items-center gap-3"><div className={`grid size-9 place-items-center rounded-full text-xs font-semibold ${user.color}`}>{user.initials}</div><div><p className="font-medium text-[#2c4740]">{user.name}</p><p className="mt-0.5 text-xs text-[#91a19b]">{user.email}</p></div></div></td><td className="px-3 py-4 text-xs text-[#62746d]">{user.role}</td><td className="px-3 py-4"><button onClick={() => toggleStatus(user.id)} className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[user.status]}`}>{user.status}</button></td><td className="px-3 py-4 text-xs text-[#81918b]">{user.lastAccess}</td><td className="px-3 py-4"><button className="grid size-7 place-items-center text-[#91a19b] hover:bg-[#edf6f1] hover:text-[#286c5c]" aria-label={`Más opciones para ${user.name}`}><DotsThree size={18} weight="bold" /></button></td></tr>)}</tbody>
                </table>
                {visibleUsers.length === 0 && <div className="px-6 py-12 text-center text-sm text-[#71827b]">No encontramos usuarios con esos criterios.</div>}
              </div>
              <div className="flex items-center justify-between border-t border-[#e8eeea] px-4 py-3 text-xs text-[#91a19b]"><span>Mostrando {visibleUsers.length} de {users.length}</span><div className="flex gap-1"><button className="border border-[#e1e8e3] px-2 py-1 text-[#b2bdb8]" disabled>Anterior</button><button className="border border-[#c7ddd3] bg-[#edf6f1] px-2.5 py-1 font-semibold text-[#286c5c]">1</button><button className="border border-[#e1e8e3] px-2 py-1">Siguiente</button></div></div>
            </section>
            {notice && <button onClick={() => setNotice('')} className="fixed bottom-6 right-6 flex items-center gap-3 bg-[#19483f] px-4 py-3 text-xs text-white shadow-lg"><Check size={16} weight="bold" /> {notice}<X size={15} /></button>}
          </div>
        </main>
      </div>
      {isInviteOpen && <div className="fixed inset-0 z-20 grid place-items-center bg-[#173a36]/30 px-5" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsInviteOpen(false)}><div role="dialog" aria-modal="true" aria-labelledby="invite-title" className="w-full max-w-md bg-white p-6 shadow-2xl"><div className="mb-6 flex items-start justify-between"><div><p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#2b8c74]">Nuevo acceso</p><h2 id="invite-title" className="font-serif text-2xl text-[#173a36]">Invitar usuario</h2></div><button onClick={() => setIsInviteOpen(false)} aria-label="Cerrar"><X size={20} className="text-[#91a19b]" /></button></div><form onSubmit={inviteUser} className="space-y-4"><label className="block text-xs font-semibold text-[#526860]">Nombre completo<input required className="mt-2 h-10 w-full border border-[#dfe8e2] px-3 text-sm outline-none focus:border-[#3b9a81]" placeholder="Ej. Ana García" /></label><label className="block text-xs font-semibold text-[#526860]">Correo electrónico<input required type="email" className="mt-2 h-10 w-full border border-[#dfe8e2] px-3 text-sm outline-none focus:border-[#3b9a81]" placeholder="ana@empresa.com" /></label><label className="block text-xs font-semibold text-[#526860]">Rol<select className="mt-2 h-10 w-full border border-[#dfe8e2] bg-white px-3 text-sm outline-none focus:border-[#3b9a81]"><option>Editor</option><option>Analista</option><option>Administrador</option></select></label><div className="flex justify-end gap-2 pt-3"><Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)}>Cancelar</Button><Button type="submit" className="rounded-md bg-[#19483f] hover:bg-[#276b5d]">Enviar invitación</Button></div></form></div></div>}
    </div>
  )
}

function StatCard({ label, value, detail, icon, tone = 'blue' }: { label: string; value: string; detail: string; icon: React.ReactNode; tone?: 'blue' | 'green' | 'orange' }) {
  const styles = { blue: 'bg-[#e3eef6] text-[#477596]', green: 'bg-[#e2f3ec] text-[#2b8068]', orange: 'bg-[#fff0d9] text-[#a8732e]' }
  return <div className="border border-[#e1e8e3] bg-white p-4"><div className="flex items-start justify-between"><div><p className="text-xs text-[#82938b]">{label}</p><p className="mt-2 text-2xl font-semibold tracking-tight text-[#24423c]">{value}</p></div><div className={`grid size-9 place-items-center rounded-md ${styles[tone]}`}>{icon}</div></div><p className="mt-3 text-[11px] text-[#a0ada7]">{detail}</p></div>
}