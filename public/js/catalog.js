const CatalogAPI = {
    items: [], // Сюда сохраним данные из базы
    currentType: 'catalog', // По умолчанию каталог

    // Получаем данные с сервера при загрузке
    init: async (type) => {
        CatalogAPI.currentType = type;
        let endpoint = '/api/books';
        
        // Меняем эндпоинт в зависимости от страницы
        if (type === 'archives') endpoint = '/api/archives';
        if (type === 'curations') endpoint = '/api/curations';

        try {
            const response = await fetch(endpoint);
            CatalogAPI.items = await response.json();
            CatalogAPI.renderItems('all'); 
        } catch (error) {
            console.error(`Ошибка загрузки ${type}:`, error);
            const container = document.getElementById('catalog-container');
            if (container) container.innerHTML = '<p class="text-red-500">Не удалось загрузить данные с сервера.</p>';
        }
    },

    // Отрисовка карточек
    renderItems: (filterValue) => {
        const container = document.getElementById('catalog-container');
        if (!container) return;

        container.innerHTML = ''; // Очищаем контейнер
        let visibleCount = 0;

        CatalogAPI.items.forEach(item => {
            // Для архивов проверяем doc_type, для остальных - category
            const itemCategory = item.doc_type || item.category;

            if (filterValue === 'all' || itemCategory === filterValue) {
                visibleCount++;
                
                // Картинка-заглушка
                const imageUrl = item.image_url || 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800';

                // Формируем подзаголовок в зависимости от типа таблицы
                let subtitle = item.author || '';
                if (CatalogAPI.currentType === 'archives') subtitle = `Оригинал, ${item.year}`;
                if (CatalogAPI.currentType === 'curations') subtitle = item.description || '';

                // Для подборок карточка немного шире (aspect-[16/9]), для книг (aspect-[3/4])
                const aspectClass = CatalogAPI.currentType === 'curations' ? 'aspect-[16/9]' : 'aspect-[3/4]';
                // Ссылка ведет на каталог для подборок, и на деталку для книг/архивов
                const linkHref = CatalogAPI.currentType === 'curations' ? `catalog.html?category=${item.category}` : `book_detail.html?id=${item.id}`;

                const itemHTML = `
                    <a href="${linkHref}" class="catalog-item book-card block transition-opacity duration-300 page-enter">
                        <div class="${aspectClass} overflow-hidden bg-gray-100 mb-4 relative shadow-sm">
                            <img src="${imageUrl}" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="${item.title}">
                        </div>
                        <div class="flex justify-between items-start mb-1">
                            <h3 class="font-serif text-lg font-bold text-primary group-hover:underline">${item.title}</h3>
                        </div>
                        <p class="text-sm text-gray-500 mb-3">${subtitle}</p>
                    </a>
                `;
                container.insertAdjacentHTML('beforeend', itemHTML);
            }
        });

        // Обновляем счетчик
        const countElement = document.getElementById('results-count');
        if (countElement) countElement.innerText = visibleCount;
    }
};

const CatalogFilters = {
    filterByCategory: (category, btnElement) => {
        // Подсветка активной кнопки
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-600');
        });

        btnElement.classList.remove('bg-gray-100', 'text-gray-600');
        btnElement.classList.add('bg-primary', 'text-white');

        CatalogAPI.renderItems(category);
    }
};

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('catalog-container')) {
        const path = window.location.pathname;
        let pageType = 'catalog';
        
        if (path.includes('archives')) pageType = 'archives';
        if (path.includes('curations')) pageType = 'curations';
        
        CatalogAPI.init(pageType);
    }
});