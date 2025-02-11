import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const navigation = [
    { name: 'Home', href: '/' },
    {
        name: 'Predictions',
        href: '#',
        submenu: [
            { name: 'Today\'s Matches', href: '/predictions/today' },
            { name: 'Tomorrow\'s Matches', href: '/predictions/tomorrow' },
            // { name: 'Analysis', href: '/predictions/analysis' },
        ]
    },
    { name: 'Live Scores', href: '/live-scores' },
    { name: 'News', href: '/news' },
    { name: 'Blog', href: '/blog' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${
            scrolled ? 'bg-red-900/95 backdrop-blur-md shadow-lg' : 'bg-red-900 opacity-100'
        }`}>
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-white font-bold text-xl">
                            PredictionSport
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <div key={item.name} className="relative group">
                                {item.submenu ? (
                                    <button
                                        onClick={() => setActiveSubmenu(activeSubmenu === item.name ? null : item.name)}
                                        className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium inline-flex items-center"
                                    >
                                        {item.name}
                                        <ChevronDown className="ml-1 h-4 w-4" />
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                                    >
                                        {item.name}
                                    </Link>
                                )}

                                {item.submenu && (
                                    <div className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
                                        activeSubmenu === item.name ? 'opacity-100 visible' : 'opacity-0 invisible'
                                    }`}>
                                        <div className="py-1">
                                            {item.submenu.map((subItem) => (
                                                <Link
                                                    key={subItem.name}
                                                    href={subItem.href}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-red-800"
                        >
                            {isOpen ? (
                                <X className="block h-6 w-6" />
                            ) : (
                                <Menu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`md:hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navigation.map((item) => (
                            <div key={item.name}>
                                {item.submenu ? (
                                    <div>
                                        <button
                                            onClick={() => setActiveSubmenu(activeSubmenu === item.name ? null : item.name)}
                                            className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                                        >
                                            <div className="flex justify-between items-center">
                                                {item.name}
                                                <ChevronDown className={`h-4 w-4 transform transition-transform ${
                                                    activeSubmenu === item.name ? 'rotate-180' : ''
                                                }`} />
                                            </div>
                                        </button>
                                        <div className={`pl-4 space-y-1 ${activeSubmenu === item.name ? 'block' : 'hidden'}`}>
                                            {item.submenu.map((subItem) => (
                                                <Link
                                                    key={subItem.name}
                                                    href={subItem.href}
                                                    className="text-gray-400 hover:text-white block px-3 py-2 text-sm"
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    );
}