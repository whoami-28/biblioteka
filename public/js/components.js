const AppComponents = {
    getHeader: (activePage) => `
        <nav class="relative w-full z-40 glass">
            <div class="flex justify-between items-center px-8 py-5 max-w-[1400px] mx-auto">
                <a href="index.html" class="text-2xl font-serif font-bold text-primary hover:opacity-80 transition-opacity">The Modern Curator</a>

                <div class="hidden md:flex space-x-8 font-sans text-sm">
                    <a href="catalog.html" class="${activePage === 'catalog' ? 'font-bold border-b-2 border-primary pb-1 text-primary' : 'text-academic-slate hover:text-primary transition-colors'}">Каталог</a>
                    <a href="archives.html" class="${activePage === 'archives' ? 'font-bold border-b-2 border-primary pb-1 text-primary' : 'text-academic-slate hover:text-primary transition-colors'}">Архивы</a>
                    <a href="curations.html" class="${activePage === 'curations' ? 'font-bold border-b-2 border-primary pb-1 text-primary' : 'text-academic-slate hover:text-primary transition-colors'}">Подборки</a>
                </div>

                <div class="flex items-center space-x-6">
                    <button onclick="AppComponents.toggleSearch()" class="text-primary hover:opacity-70 transition-opacity flex items-center">
                        <span class="material-symbols-outlined">search</span>
                    </button>
                    <a href="cart_checkout.html" class="${activePage === 'cart' ? 'text-primary border-b-2 border-primary pb-1' : 'text-primary hover:opacity-70 transition-opacity'} flex items-center">
                        <span class="material-symbols-outlined">shopping_cart</span>
                    </a>
                    <a href="account_profile.html" class="${activePage === 'profile' ? 'text-primary border-b-2 border-primary pb-1' : 'text-primary hover:opacity-70 transition-opacity'} flex items-center">
                        <span class="material-symbols-outlined" ${activePage === 'profile' ? 'style="font-variation-settings: \'FILL\' 1;"' : ''}>account_circle</span>
                    </a>
                </div>
            </div>
        </nav>
    `,

    getSearchModal: () => `
        <div id="global-search-modal" class="fixed inset-0 z-50 bg-[#F7FAFC]/95 backdrop-blur-md opacity-0 pointer-events-none transition-opacity duration-300 flex items-start justify-center pt-32">
            <div class="w-full max-w-3xl px-8 relative">
                <button onclick="AppComponents.toggleSearch()" class="absolute -top-12 right-8 text-gray-500 hover:text-primary">
                    <span class="material-symbols-outlined text-3xl">close</span>
                </button>
                <h2 class="font-serif text-3xl italic text-primary mb-6">Поиск по архивам</h2>
                <div class="relative">
                    <span class="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-primary text-3xl">search</span>
                    <input type="text" id="global-search-input" placeholder="Введите название, автора или эпоху..." 
                            class="w-full bg-transparent border-b-2 border-primary py-4 pl-12 pr-4 text-2xl font-serif text-primary focus:outline-none placeholder:text-gray-300"
                            onkeypress="if(event.key === 'Enter') window.location.href='search_results.html'">
                </div>
                <div class="mt-8 flex gap-4">
                    <span class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-2">Популярное:</span>
                    <div class="flex gap-2">
                        <a href="search_results.html" class="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 transition-colors">Брутализм</a>
                        <a href="search_results.html" class="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 transition-colors">Типографика</a>
                    </div>
                </div>
            </div>
        </div>
    `,

    getFooter: () => `
        <footer class="bg-primary text-white py-16 mt-20">
            <div class="max-w-[1400px] mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div class="md:col-span-2">
                    <h4 class="font-serif text-xl mb-4">The Modern Curator</h4>
                    <p class="font-serif italic text-gray-400 max-w-sm mb-6">«Архив — это диалог поколений, сохраненный в чернилах и свете».</p>
                </div>
                <div>
                    <h5 class="text-[10px] uppercase tracking-widest text-gray-500 mb-6 font-bold">Стандарты и Право</h5>
                    <ul class="space-y-4 text-sm text-gray-400 font-light">
                        <li><a href="#" class="hover:text-white transition-colors">Доступ для организаций</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Политика конфиденциальности</a></li>
                    </ul>
                </div>
            </div>
            <div class="max-w-[1400px] mx-auto px-8 mt-16 pt-8 border-t border-white/10 text-[10px] text-gray-500 uppercase tracking-widest">
                © 2024 The Modern Curator. Эксклюзивный цифровой архив.
            </div>
        </footer>
    `,

    init: (activePage = 'home') => {
        const headerPlaceholder = document.getElementById('app-header');
        const footerPlaceholder = document.getElementById('app-footer');
        const searchPlaceholder = document.getElementById('app-search');

        if (headerPlaceholder) headerPlaceholder.innerHTML = AppComponents.getHeader(activePage);
        if (footerPlaceholder) footerPlaceholder.innerHTML = AppComponents.getFooter();
        if (searchPlaceholder) searchPlaceholder.innerHTML = AppComponents.getSearchModal();
    },

    toggleSearch: () => {
        const modal = document.getElementById('global-search-modal');
        const input = document.getElementById('global-search-input');
        
        if (modal.classList.contains('opacity-0')) {
            modal.classList.remove('opacity-0', 'pointer-events-none');
            setTimeout(() => input.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            modal.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = '';
        }
    }
};