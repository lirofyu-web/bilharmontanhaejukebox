import React from 'react';
import { User } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { View } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ReceiptIcon } from './icons/ReceiptIcon';
import { CalculatorIcon } from './icons/CalculatorIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import AppLogo from './AppLogo'; // Import the new AppLogo component
import { MapIcon } from './icons/MapIcon';
import { CogIcon } from './icons/CogIcon';
import { BilliardIcon } from './icons/BilliardIcon';
import { ArrowsPointingOutIcon } from './icons/ArrowsPointingOutIcon';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onOpenFastBilling: () => void;
  user: User | null;
}

const navItems = [
    { view: 'DASHBOARD' as View, label: 'Dashboard', icon: HomeIcon },
    { view: 'CLIENTES' as View, label: 'Clientes', icon: UsersIcon },
    { view: 'COBRANCAS' as View, label: 'Cobranças', icon: ReceiptIcon },
    { view: 'DESPESAS' as View, label: 'Despesas', icon: CalculatorIcon },
    { view: 'ROTAS' as View, label: 'Rotas', icon: MapIcon },
    { view: 'RELATORIOS' as View, label: 'Relatórios', icon: ChartBarIcon },
];

const secondaryNavItems = [
    { view: 'CONFIGURACOES' as View, label: 'Configurações', icon: CogIcon },
]

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setIsOpen, onOpenFastBilling, user }) => {

    const handleViewChange = (view: View) => {
        setView(view);
        setIsOpen(false); // Close sidebar on navigation in mobile
    };
    
    const handleFastBillingClick = () => {
        onOpenFastBilling();
        setIsOpen(false); // Close sidebar on action
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const NavButton: React.FC<{item: {view: View, label: string, icon: React.FC<any>}}> = ({ item }) => {
        const Icon = item.icon;
        const isActive = currentView === item.view;
        return (
             <li key={item.view} className="mb-2">
                <button 
                    onClick={() => handleViewChange(item.view)}
                    className={`w-full flex items-center rounded-md p-3 transition-colors text-sm font-medium ${
                        isActive 
                        ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)] shadow-lg' 
                        : 'text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <Icon className="w-5 h-5 mr-4" />
                    <span>{item.label}</span>
                </button>
            </li>
        );
    };


    return (
        <>
            {/* Overlay for mobile */}
            <div
                onClick={() => setIsOpen(false)}
                className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            ></div>

            <aside className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 p-4 flex flex-col border-r border-slate-200 dark:border-slate-700 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 no-print ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between mb-4">
                    <AppLogo />
                    <button 
                        onClick={toggleFullScreen}
                        className="p-2 rounded-full text-red-500 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Tela Cheia"
                    >
                        <ArrowsPointingOutIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="mb-6">
                    <button 
                        onClick={handleFastBillingClick}
                        className="w-full flex items-center justify-center rounded-md p-3 transition-colors text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500 shadow-md"
                    >
                        <BilliardIcon className="w-5 h-5 mr-3" />
                        <span>Faturamento Rápido</span>
                    </button>
                </div>
                <nav className="flex-grow">
                    <ul>
                        {navItems.map(item => <NavButton key={item.view} item={item} />)}
                    </ul>
                </nav>
                <div className="mt-auto">
                     <nav>
                        <ul>
                            {secondaryNavItems.map(item => <NavButton key={item.view} item={item} />)}
                        </ul>
                    </nav>
                    <div className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
