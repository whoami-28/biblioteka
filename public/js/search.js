document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');

    const displayQuery = document.getElementById('search-query-display');
    const noResultsMsg = document.getElementById('no-results-msg');

    if (!query) {
        displayQuery.innerText = 'Пустой запрос';
        noResultsMsg.classList.remove('hidden');
        return;
    }

    displayQuery.innerText = `"${query}"`;

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        const { books, archives, curations } = data;
        const total = books.length + archives.length + curations.length;

        document.getElementById('count-all').innerText = total;
        document.getElementById('count-books').innerText = books.length;
        document.getElementById('count-archives').innerText = archives.length;
        document.getElementById('count-curations').innerText = curations.length;

        if (total === 0) {
            noResultsMsg.classList.remove('hidden');
            return;
        }

        if (books.length > 0) {
            document.getElementById('section-books').classList.remove('hidden');
            const container = document.getElementById('search-books-container');
            books.forEach(book => {
                const img = book.image_url || 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80';
                container.innerHTML += `
                    <a href="book_detail.html?id=${book.id}" class="book-card block group">
                        <div class="aspect-[3/4] overflow-hidden bg-gray-100 mb-4 shadow-sm relative">
                            <img class="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0" src="${img}" alt="${book.title}"/>
                        </div>
                        <h4 class="font-serif font-bold text-xl mb-1 text-primary group-hover:underline">${book.title}</h4>
                        <p class="text-sm text-gray-500 font-light">${book.author}</p>
                    </a>
                `;
            });
        }

        if (archives.length > 0) {
            document.getElementById('section-archives').classList.remove('hidden');
            const container = document.getElementById('search-archives-container');
            archives.forEach(arch => {
                container.innerHTML += `
                    <div class="p-6 bg-white border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                        <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">${arch.doc_type} • ${arch.year}</span>
                        <h4 class="font-serif font-bold text-xl text-primary mb-2">${arch.title}</h4>
                        <p class="text-sm text-gray-500">${arch.description}</p>
                    </div>
                `;
            });
        }

        if (curations.length > 0) {
            document.getElementById('section-curations').classList.remove('hidden');
            const container = document.getElementById('search-curations-container');
            curations.forEach(cur => {
                container.innerHTML += `
                    <a href="catalog.html?category=${cur.category}" class="relative group overflow-hidden h-64 block shadow-md">
                        <div class="absolute inset-0 bg-primary opacity-60 z-10 transition-opacity group-hover:opacity-80"></div>
                        <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale" src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800" alt="Collection">
                        <div class="absolute inset-0 z-20 flex flex-col justify-end p-8 text-white">
                            <span class="text-[10px] font-bold uppercase tracking-[0.3em] mb-2 text-white/80">Категория: ${cur.category}</span>
                            <h3 class="text-2xl font-serif font-bold">${cur.title}</h3>
                            <p class="text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-w-xs mt-2">${cur.description}</p>
                        </div>
                    </a>
                `;
            });
        }

    } catch (err) {
        console.error('Ошибка поиска:', err);
    }
});