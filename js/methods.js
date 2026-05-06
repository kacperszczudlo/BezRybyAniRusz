// Zabezpieczenie przed wielokrotnym wykonaniem
let isInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded wywołane');
  // Jeśli już zainicjalizowano, nie wykonuj ponownie
  if (isInitialized) {
    console.log('Już zainicjalizowano, pomijam');
    return;
  }
  isInitialized = true;

  console.log('Inicjalizacja kodu');

  const loader = document.getElementById('loader');
  const methodsContainer = document.getElementById('methodsContainer');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // Klucz API YouTube
  const API_KEY = 'AIzaSyAlio65JA1wm8j67rnYOGr9FPTxMELlNYY';

  // Funkcja do pobierania danych o filmie z YouTube API
  async function fetchVideoDetails(videoId) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,status&id=${videoId}&key=${API_KEY}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        return {
          title: video.snippet.title,
          views: video.statistics.viewCount || '0',
          likes: video.statistics.likeCount || '0',
          embeddable: video.status.embeddable,
          available: true
        };
      } else {
        return {
          title: 'Film niedostępny',
          views: '0',
          likes: '0',
          embeddable: false,
          available: false
        };
      }
    } catch (error) {
      console.error(`Błąd podczas pobierania danych filmu ${videoId}:`, error);
      return {
        title: 'Błąd podczas ładowania filmu',
        views: '0',
        likes: '0',
        embeddable: false,
        available: false
      };
    }
  }

  // Statyczna lista z podstawowymi danymi
  const fishingMethods = [
    { id: 1, name: "Spinning", videoId: "hUurIgE2H8U", difficulty: "Średni", category: "spinning" },
    { id: 2, name: "Spinning", videoId: "IyUp5T6-piE", difficulty: "Średni", category: "spinning" },
    { id: 3, name: "Spinning", videoId: "SamrdgVjpQk", difficulty: "Średni", category: "spinning" },
    { id: 4, name: "Spławik", videoId: "4Sb0cqSndTk", difficulty: "Łatwy", category: "spławik" },
    { id: 5, name: "Spławik", videoId: "upK-3iJFwNQ", difficulty: "Łatwy", category: "spławik" },
    { id: 6, name: "Spławik", videoId: "l-gV4UfriGE", difficulty: "Łatwy", category: "spławik" },
    { id: 7, name: "Grunt", videoId: "-OinQ_Fn4lc", difficulty: "Łatwy", category: "grunt" },
    { id: 8, name: "Grunt", videoId: "icGScqmXmBo", difficulty: "Łatwy", category: "grunt" },
    { id: 9, name: "Grunt", videoId: "3TjpPwyMgBk", difficulty: "Łatwy", category: "grunt" },
    { id: 10, name: "Karp", videoId: "t2pv64sLFGY", difficulty: "Trudny", category: "karp" },
    { id: 11, name: "Karp", videoId: "2xu49SHg_9k", difficulty: "Trudny", category: "karp" },
    { id: 12, name: "Karp", videoId: "-mCalYsZASg", difficulty: "Trudny", category: "karp" },
    { id: 13, name: "Muchowa", videoId: "0-9GqI-f5PE", difficulty: "Trudny", category: "muchowa" },
    { id: 14, name: "Muchowa", videoId: "j7GXqUQQ2i0", difficulty: "Trudny", category: "muchowa" },
    { id: 15, name: "Muchowa", videoId: "Gk2ZusF6eJw", difficulty: "Trudny", category: "muchowa" },
    { id: 16, name: "Morska", videoId: "t4l8YeKNVss", difficulty: "Średni", category: "morska" },
    { id: 17, name: "Morska", videoId: "x_fNuU_EEy0", difficulty: "Średni", category: "morska" },
    { id: 18, name: "Morska", videoId: "hTPUEHdfZac", difficulty: "Średni", category: "morska" },
    { id: 19, name: "Podlodowe", videoId: "KpISHNqoaLQ", difficulty: "Średni", category: "podlodowe" },
    { id: 20, name: "Podlodowe", videoId: "R1r7RzzZBag", difficulty: "Średni", category: "podlodowe" },
    { id: 21, name: "Podlodowe", videoId: "8r4wyyr2tGY", difficulty: "Średni", category: "podlodowe" }
  ];

  // Funkcja wyświetlająca metody
  async function displayMethods(filter = 'all') {
    console.log(`Wywołano displayMethods z filtrem: ${filter}`);
    methodsContainer.innerHTML = '';
    loader.style.display = 'block';
    methodsContainer.style.display = 'none';

    const filteredMethods = filter === 'all' 
      ? fishingMethods 
      : fishingMethods.filter(method => method.category === filter);

    console.log(`Liczba filtrowanych metod: ${filteredMethods.length}`);
    console.log('Filtrowane metody:', filteredMethods.map(method => method.videoId));

    // Pobierz dane dla wszystkich filmów równolegle
    const videoDetailsPromises = filteredMethods.map(method => fetchVideoDetails(method.videoId));
    const videoDetailsArray = await Promise.all(videoDetailsPromises);

    // Wyświetl karty z filmami
    filteredMethods.forEach((method, index) => {
      const videoDetails = videoDetailsArray[index];
      
      const methodCard = document.createElement('div');
      methodCard.className = 'method-card';
      methodCard.dataset.category = method.category;

      if (videoDetails.available && videoDetails.embeddable) {
        methodCard.innerHTML = `
          <div class="method-difficulty" data-difficulty="${method.difficulty}">${method.difficulty}</div>
          <iframe class="method-video" src="https://www.youtube.com/embed/${method.videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
          <div class="method-info">
            <h2>${method.name}</h2>
            <p>${videoDetails.title}</p>
            <div class="method-views">${parseInt(videoDetails.views).toLocaleString('pl-PL')} wyświetleń</div>
            <div class="method-likes">${parseInt(videoDetails.likes).toLocaleString('pl-PL')} polubień</div>
          </div>
        `;
      } else {
        methodCard.innerHTML = `
          <div class="method-difficulty" data-difficulty="${method.difficulty}">${method.difficulty}</div>
          <div class="method-video" style="background-color: #000; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1rem;">
            Film niedostępny
          </div>
          <div class="method-info">
            <h2>${method.name}</h2>
            <p>${videoDetails.title}</p>
            <div class="method-views">0 wyświetleń</div>
            <div class="method-likes">0 polubień</div>
          </div>
        `;
      }

      console.log(`Dodano kartę dla filmu: ${method.videoId}`);
      methodsContainer.appendChild(methodCard);
    });

    console.log(`Liczba dzieci w methodsContainer: ${methodsContainer.children.length}`);
    loader.style.display = 'none';
    methodsContainer.style.display = 'grid';
  }

  // Wywołanie funkcji przy ładowaniu strony
  console.log('Wywołanie displayMethods przy ładowaniu strony');
  displayMethods();

  // Obsługa filtrów
  console.log(`Znaleziono ${filterButtons.length} przycisków filtrów`);
  filterButtons.forEach((button, index) => {
    console.log(`Dodano nasłuchiwanie dla przycisku ${index}: ${button.dataset.filter}`);
    button.addEventListener('click', () => {
      console.log(`Kliknięto przycisk z filtrem: ${button.dataset.filter}`);
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      loader.style.display = 'block';
      methodsContainer.style.display = 'none';

      setTimeout(() => {
        displayMethods(button.dataset.filter);
      }, 300);
    }, { once: true });
  });
});