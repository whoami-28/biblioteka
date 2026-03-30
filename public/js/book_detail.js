document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('id');

    if (!bookId) {
        document.querySelector('main').innerHTML = '<h1 class="text-center text-2xl mt-10">Книга не выбрана</h1>';
        return;
    }

    try {
        const response = await fetch(`/api/books/${bookId}`);
        if (!response.ok) throw new Error('Книга не найдена');
        
        const book = await response.json();

        document.getElementById('book-title').textContent = book.title;
        document.getElementById('book-author').textContent = book.author;
        document.getElementById('book-price').textContent = `$${book.price.toFixed(2)}`;

        const specs = document.getElementById('book-specs');
        if (specs) {
            specs.innerHTML = `
                <li><strong>Формат:</strong> ${book.format}</li>
                <li><strong>Объем:</strong> ${book.pages} страниц</li>
                <li><strong>Категория:</strong> ${book.category}</li>
            `;
        }

        const imgElement = document.getElementById('book-image');
        if (imgElement) {
            imgElement.src = book.image_url || 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000';
            imgElement.alt = book.title;
        }

    } catch (error) {
        console.error(error);
        document.querySelector('main').innerHTML = '<h1 class="text-center text-red-500 text-2xl mt-10">Ошибка загрузки книги</h1>';
    }

    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', async () => {
            try {
                const response = await fetch(`/api/books/${bookId}`);
                const bookData = await response.json();

                let cart = JSON.parse(localStorage.getItem('cart')) || [];

                const existingItem = cart.find(item => item.id === bookData.id);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: bookData.id,
                        title: bookData.title,
                        author: bookData.author,
                        price: bookData.price,
                        image_url: bookData.image_url,
                        quantity: 1
                    });
                }

                localStorage.setItem('cart', JSON.stringify(cart));

                const originalText = addToCartBtn.innerText;
                addToCartBtn.innerText = 'Добавлено!';
                addToCartBtn.classList.replace('bg-primary', 'bg-green-600');
                
                setTimeout(() => {
                    addToCartBtn.innerText = originalText;
                    addToCartBtn.classList.replace('bg-green-600', 'bg-primary');
                }, 2000);

            } catch (err) {
                console.error('Ошибка при добавлении в корзину', err);
            }
        });
    }
});