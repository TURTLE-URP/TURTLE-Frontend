import { UsersThree, Check } from '@phosphor-icons/react';

interface Props {
  kpis: { total: number; activos: number; pendientes: number };
}

export function UsuarioKpiCards({ kpis }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <StatCard 
        label="Usuarios totales" 
        value={kpis.total.toString()} 
        detail="en tu workspace" 
        icon={<UsersThree size={20} />} 
        tone="blue" 
      />
      <StatCard 
        label="Usuarios activos" 
        value={kpis.activos.toString()} 
        detail="con acceso habilitado" 
        icon={<Check size={20} />} 
        tone="green" 
      />
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  detail, 
  icon, 
  tone = 'blue' 
}: { 
  label: string; 
  value: string; 
  detail: string; 
  icon: React.ReactNode; 
  tone?: 'blue' | 'green' | 'orange' 
}) {
  const styles = {
    blue: 'bg-[#e3eef6] text-[#477596]',
    green: 'bg-[#e2f3ec] text-[#2b8068]',
    orange: 'bg-[#fff0d9] text-[#a8732e]',
  };
  
  return (
    <div className="border border-[#e1e8e3] bg-white p-4 rounded-lg shadow-xs">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#82938b]">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-[#24423c]">{value}</p>
        </div>
        <div className={`grid size-9 place-items-center rounded-md ${styles[tone]}`}>{icon}</div>
      </div>
      <p className="mt-3 text-[11px] text-[#a0ada7]">{detail}</p>
    </div>
  );
}