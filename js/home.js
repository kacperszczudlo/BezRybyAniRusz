// home.js
async function fetchProducts() {
  try {
    const response = await fetch('../json/products.json');
    if (!response.ok) throw new Error('Błąd pobierania produktów');
    return await response.json();
  } catch (error) {
    console.error('Wystąpił błąd:', error);
    return [];
  }
}

async function displayFeaturedProducts() {
  const products = await fetchProducts();
  const track = document.getElementById('scroll-track');
  if (!track || products.length === 0) return;

  const categories = [
    'Wędki', 'Przynęty', 'Plecionki', 'Siedzenia', 'Podbieraki',
    'Kołowrotki', 'Haczyki', 'Spławiki', 'Odzież wędkarska', 'Siatki na ryby'
  ];

  const selectedProducts = categories.map(category => products.find(p => p.category === category)).filter(Boolean);

  selectedProducts.forEach(product => {
    const item = document.createElement('div');
    item.classList.add('scroll-item');
    item.innerHTML = `
      <img src="${product.image || 'https://via.placeholder.com/300x200?text=Brak+zdjęcia'}" alt="${product.title}">
      <p class="product-name">${product.title}</p>
      <p class="product-price">Cena: ${product.price.toFixed(2)} PLN</p>
      <button class="add-to-cart-button" data-product-id="${product.id}">Dodaj do koszyka</button>
    `;
    track.appendChild(item);

    const button = item.querySelector('.add-to-cart-button');
    button.addEventListener('click', () => {
      window.toggleCart(product.id, product.title, product.price, button);
    });
  });

  window.updateCartButtons(); // Aktualizuj przyciski po załadowaniu produktów

  const scrollLeftBtn = document.getElementById('scroll-left');
  const scrollRightBtn = document.getElementById('scroll-right');
  let currentIndex = 0;
  const itemWidth = 320;
  const maxIndex = selectedProducts.length - 3;

  function updateScroll() {
    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    scrollLeftBtn.classList.toggle('hidden', currentIndex <= 0);
    scrollRightBtn.classList.toggle('hidden', currentIndex >= maxIndex);
  }

  scrollLeftBtn.addEventListener('click', () => { currentIndex--; updateScroll(); });
  scrollRightBtn.addEventListener('click', () => { currentIndex++; updateScroll(); });
  updateScroll();
}

document.addEventListener('DOMContentLoaded', displayFeaturedProducts);