// components/MobileHeader.tsx
import React from 'react';
import { MenuIcon, InstallIcon, LockClosedIcon, LockOpenIcon } from './icons';

interface MobileHeaderProps {
    title: string;
    onMenuClick: () => void;
    deferredPrompt: any;
    onInstallPrompt: () => void;
    isPrivacyModeEnabled: boolean;
    isPrivacyUnlocked: boolean;
    onToggleLock: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ title, onMenuClick, deferredPrompt, onInstallPrompt, isPrivacyModeEnabled, isPrivacyUnlocked, onToggleLock }) => {
    return (
        // Z-index updated to 20 to be below the Sidebar
        <header className="md:hidden flex items-center gap-4 fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 h-20 z-20 border-b border-slate-200/50 dark:border-slate-700/50 pt-[env(safe-area-inset-top)]">
            <button
                onClick={onMenuClick}
                className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                aria-label="Abrir menu"
            >
                <MenuIcon className="w-6 h-6" />
            </button>
            <div className="flex-grow flex justify-center">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                    {title}
                </h1>
            </div>
            
            <div className="flex items-center gap-2">
                {isPrivacyModeEnabled && (
                    <button onClick={onToggleLock} className="p-2 text-slate-600 dark:text-slate-300" aria-label={isPrivacyUnlocked ? "Ocultar valores" : "Mostrar valores"}>
                        {isPrivacyUnlocked ? <LockOpenIcon className="w-6 h-6 text-lime-400" /> : <LockClosedIcon className="w-6 h-6 text-slate-400" />}
                    </button>
                )}

                {deferredPrompt && (
                    <button
                        onClick={onInstallPrompt}
                        className="p-2 text-slate-600 dark:text-slate-300 hover:text-lime-500 dark:hover:text-lime-400"
                        aria-label="Instalar Aplicativo"
                    >
                        <InstallIcon className="w-6 h-6" />
                    </button>
                )}
            </div>
        </header>
    );
};

export default MobileHeader;
