const CatalogFilters = {
    filterByCategory: (category, btnElement) => {
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-600');
        });

        btnElement.classList.remove('bg-gray-100', 'text-gray-600');
        btnElement.classList.add('bg-primary', 'text-white');

        const items = document.querySelectorAll('.catalog-item');
        let visibleCount = 0;

        items.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.classList.remove('hidden');
                visibleCount++;
                item.style.opacity = '0';
                setTimeout(() => item.style.opacity = '1', 50);
            } else {
                item.classList.add('hidden');
            }
        });

        document.getElementById('results-count').innerText = visibleCount;
    }
};