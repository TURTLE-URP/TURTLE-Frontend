import React from 'react'
import { Chair, User } from '@phosphor-icons/react'

interface TurtleSidebarProps {
  currentRoute?: string
}

export const TurtleSidebar: React.FC<TurtleSidebarProps> = ({ currentRoute = 'mesas' }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 min-h-screen select-none">
      {/* Top branding */}
      <div>
        <div className="flex items-center gap-3 p-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30">
            {/* Turtle Icon */}
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Head */}
              <path
                d="M12 1.8C10.8 1.8 9.9 2.7 9.9 3.8V5.8H14.1V3.8C14.1 2.7 13.2 1.8 12 1.8Z"
                fill="currentColor"
              />
              {/* Tail */}
              <path d="M12 22.2L13.1 19.5H10.9L12 22.2Z" fill="currentColor" />
              {/* Front Left Flipper */}
              <path
                d="M5.2 6.8C4.1 7.6 3.2 9 3.5 10.4C3.8 11.6 5 12.2 6.2 11.8C7.5 11.3 8.3 9.8 8.8 8.4C7.5 7.6 6.3 7 5.2 6.8Z"
                fill="currentColor"
              />
              {/* Front Right Flipper */}
              <path
                d="M18.8 6.8C19.9 7.6 20.8 9 20.5 10.4C20.2 11.6 19 12.2 17.8 11.8C16.5 11.3 15.7 9.8 15.2 8.4C16.5 7.6 17.7 7 18.8 6.8Z"
                fill="currentColor"
              />
              {/* Back Left Flipper */}
              <path
                d="M6.8 16.2C5.5 17 4.8 18.3 5.2 19.6C5.5 20.6 6.8 21.1 7.8 20.5C9 19.7 9.5 18.2 9.4 16.8C8.5 16.4 7.6 16.2 6.8 16.2Z"
                fill="currentColor"
              />
              {/* Back Right Flipper */}
              <path
                d="M17.2 16.2C18.5 17 19.2 18.3 18.8 19.6C18.5 20.6 17.2 21.1 16.2 20.5C15 19.7 14.5 18.2 14.6 16.8C15.5 16.4 16.4 16.2 17.2 16.2Z"
                fill="currentColor"
              />
              {/* Shell Body */}
              <path
                d="M12 5C8.1 5 5.5 8.2 5.5 12.5C5.5 16.8 8.1 20 12 20C15.9 20 18.5 16.8 18.5 12.5C18.5 8.2 15.9 5 12 5Z"
                fill="currentColor"
              />
              {/* Shell Inner Facets (scales) */}
              <path
                d="M12 8.5L14.5 10.5V14.5L12 16.5L9.5 14.5V10.5L12 8.5Z"
                stroke="#059669"
                strokeWidth="1.3"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M12 5V8.5M14.5 10.5L18.2 9.8M14.5 14.5L18.2 15.2M12 16.5V20M9.5 14.5L5.8 15.2M9.5 10.5L5.8 9.8"
                stroke="#059669"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-tight text-slate-800 leading-tight">
              Turtle
            </h1>
            <p className="text-xs text-slate-500 font-medium">Sistema de restaurante</p>
          </div>
        </div>

        {/* Menu Section */}
        <div className="px-4 py-6">
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 block mb-2">
            Principal
          </span>

          <nav className="space-y-1">
            <a
              href="/mesas"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentRoute === 'mesas'
                  ? 'bg-emerald-50/80 text-emerald-700 font-semibold border-l-4 border-emerald-600 -ml-1 pl-3'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Chair
                className={`w-5 h-5 ${currentRoute === 'mesas' ? 'text-emerald-600' : 'text-slate-400'}`}
                weight={currentRoute === 'mesas' ? 'bold' : 'regular'}
              />
              <span>Estado de Mesas</span>
            </a>
          </nav>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">Anfitrión</p>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Turno activo
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
