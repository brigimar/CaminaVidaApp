import Link from 'next/link';

const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Coordinadores', href: '/dashboard/coordinadores' },
    { name: 'Caminatas', href: '/dashboard/caminatas' },
    { name: 'Economía', href: '/dashboard/economia' },
    { name: 'Alertas', href: '/dashboard/alertas' },
];

export function Sidebar() {
    return (
        <div className="flex flex-col w-64 bg-gray-800 h-screen text-white">
            <div className="flex items-center justify-center h-16 border-b border-gray-700">
                <span className="text-xl font-bold">Camina Vida 3.0</span>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-2">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <p className="text-xs text-gray-400">Audit Mode</p>
            </div>
        </div>
    );
}
