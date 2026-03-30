const CatalogAPI = {
    books: [],
    init: async () => {
        try {
            const response = await fetch('/api/books');
            CatalogAPI.books = await response.json();
            CatalogAPI.renderBooks('all');
        } catch (error) {
            console.error('Ошибка загрузки каталога:', error);
            document.getElementById('catalog-container').innerHTML = '<p class="text-red-500">Не удалось загрузить каталог.</p>';
        }
    },

    renderBooks: (category) => {
        const container = document.getElementById('catalog-container');
        if (!container) return;

        container.innerHTML = '';
        let visibleCount = 0;

        CatalogAPI.books.forEach(book => {
            if (category === 'all' || book.category === category) {
                visibleCount++;

                const imageUrl = book.image_url || 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800';

                const bookHTML = `
                    <a href="book_detail.html?id=${book.id}" class="catalog-item book-card block transition-opacity duration-300 page-enter">
                        <div class="aspect-[3/4] overflow-hidden bg-gray-100 mb-4 relative">
                            <img src="${imageUrl}" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="${book.title}">
                        </div>
                        <div class="flex justify-between items-start mb-1">
                            <h3 class="font-serif text-lg font-bold text-primary group-hover:underline">${book.title}</h3>
                        </div>
                        <p class="text-sm text-gray-500 mb-3">${book.author}</p>
                    </a>
                `;
                container.insertAdjacentHTML('beforeend', bookHTML);
            }
        });

        const countElement = document.getElementById('results-count');
        if (countElement) countElement.innerText = visibleCount;
    }
};

const CatalogFilters = {
    filterByCategory: (category, btnElement) => {
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-600');
        });

        btnElement.classList.remove('bg-gray-100', 'text-gray-600');
        btnElement.classList.add('bg-primary', 'text-white');

        CatalogAPI.renderBooks(category);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('catalog-container')) {
        CatalogAPI.init();
    }
});