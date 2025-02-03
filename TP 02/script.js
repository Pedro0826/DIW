/*CODIGO PARA ABRIR O JSON SERVER: npx json-server --watch db/db.json --port 3001*/

const API_KEY = 'dc9f1f51b24d66404530ee7a28e408ed'; // Substitua pela sua chave da API
const API_URL = `https://api.themoviedb.org/3/tv/airing_today?api_key=${API_KEY}&language=pt-BR&page=1`;
const SEARCH_API_URL = `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=pt-BR&page=1&query=`;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const carouselIndicators = document.getElementById('carousel-indicators');
const carouselInner = document.getElementById('carousel-inner');
const seriesContainer = document.getElementById('series-cards');
const ola = document.getElementById('seriesContainer');
const API_FAVORITAS = 'http://localhost:3001/favoritas'; 
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');

window.addEventListener('load', () => {
  if (!sessionStorage.getItem('alertShown')) {
    alert("Para que o site funcione corretamente, certifique-se de rodar o comando abaixo no terminal:\n\nnpx json-server --watch db/db.json --port 3001");
    sessionStorage.setItem('alertShown', 'true');
  }
});


// Faz a requisição para a API
fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    const series1 = data.results.slice(0, 5); // Pegue as primeiras 5 séries para o carrossel
    const series2 = data.results.slice(5, 9); // Pegue as 4 séries seguintes para os blocos

    // Cria o carrossel
    series1.forEach((serie, index) => {
      const indicator = document.createElement('button');
      indicator.type = 'button';
      indicator.setAttribute('data-bs-target', '#carouselExampleCaptions');
      indicator.setAttribute('data-bs-slide-to', index);
      if (index === 0) {
        indicator.classList.add('active');
        indicator.setAttribute('aria-current', 'true');
      }
      indicator.setAttribute('aria-label', `Slide ${index + 1}`);
      carouselIndicators.appendChild(indicator);

      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');
      if (index === 0) {
        carouselItem.classList.add('active');
      }

      carouselItem.innerHTML = 
        `<a href="detalhes.html?id=${serie.id}">
          <img src="https://image.tmdb.org/t/p/original${serie.backdrop_path}" class="card-img-top" alt="${serie.name}" width="50%" height="auto">
        </a>
        <div class="carousel-caption d-none d-md-block">
          <h5>${serie.name}</h5>
          <p>${serie.overview}</p>
        </div>`;

      carouselInner.appendChild(carouselItem);
    });

    // Cria os blocos de séries
    series2.forEach(seriesItem => {
      const seriesCard = document.createElement('div');
      seriesCard.classList.add('col');

      seriesCard.innerHTML = 
        `<div class="card">
          <a href="detalhes.html?id=${seriesItem.id}">
            <img src="https://image.tmdb.org/t/p/original${seriesItem.poster_path}" class="card-img-top" alt="${seriesItem.name}" width="50%" height="auto">
          </a>
          <div class="card-body">
            <h5 class="card-title">${seriesItem.name}</h5>
            <p class="card-text">${seriesItem.overview}</p>
          </div>
        </div>`;

      ola.appendChild(seriesCard);
    });
  })
  .catch(error => console.error('Erro ao carregar as séries populares:', error));

const autorContainer = document.getElementById('autor-container');
const API_AUTOR = 'http://localhost:3001/autor';

fetch(API_AUTOR)
  .then(response => response.json())
  .then(data => {
    const autor = data;

    autorContainer.innerHTML = 
      `<div class="autor-info">
        <h2>Sobre o Autor</h2>
        <div class="autor-avatar">
          <img src="${autor.avatar}" alt="" class="img-fluid rounded-circle">
        </div>
        <div class="autor-dados">
          <h3>${autor.nome}</h3>
          <p><strong>Email:</strong> ${autor.email}</p>
          <p><strong>Curso:</strong> ${autor.curso}</p>
          <p><strong>Turma:</strong> ${autor.turma}</p>
          <p><strong>Mini Bio:</strong> ${autor.minibio}</p>
          
          <div class="redes-sociais">
            <h5>Redes Sociais:</h5>
            <ul>
              <li><a href="${autor.redes_sociais.facebook}" target="_blank"><i class="fab fa-facebook-f"></i> Facebook</a></li>
              <li><a href="${autor.redes_sociais.twitter}" target="_blank"><i class="fab fa-twitter"></i> Twitter</a></li>
              <li><a href="${autor.redes_sociais.instagram}" target="_blank"><i class="fab fa-instagram"></i> Instagram</a></li>
            </ul>
          </div>
        </div>
      </div>`;
  })
  .catch(error => console.error('Erro ao carregar as informações do autor:', error));

const seriesFavoritasContainer = document.getElementById('seriesFavoritasContainer');

fetch(API_FAVORITAS)
  .then(response => response.json())
  .then(favoritas => {
    console.log(favoritas); // Verifique a estrutura da resposta da API
    favoritas.forEach(serie => {
      const seriesCard = document.createElement('div');
      seriesCard.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3');

      seriesCard.innerHTML = 
        `<div class="card">
          <a href="detalhes.html?id=${serie.id}">
            <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top" alt="${serie.name || 'Imagem indisponível'}">
          </a>
          <div class="card-body">
            <h5 class="card-title">${serie.name || 'Título indisponível'}</h5>
            <p class="card-text">${serie.overview ? serie.overview : 'Descrição indisponível'}</p>
            <button class="btn btn-primary" onclick="addFavorite(${serie.id}, '${serie.name}', '${serie.poster_path}', '${serie.overview || 'Descrição indisponível'}')">Adicionar aos Favoritos</button>
          </div>
        </div>`;

      seriesFavoritasContainer.appendChild(seriesCard);
    });
  })
  .catch(error => console.error('Erro ao carregar as séries favoritas:', error));


// Função para adicionar série aos favoritos
function addFavorite(id, name, poster_path, overview) {
  const favoriteSerie = {
    id,
    name,
    poster_path,
    overview, // Envia o overview junto
  };

  // Envia a requisição POST para a API
  fetch(API_FAVORITAS, {
    method: 'POST', // Método POST para adicionar
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(favoriteSerie), // Envia o objeto favoriteSerie como JSON
  })
  .then(response => response.json())
  .then(data => {
    console.log('Série adicionada aos favoritos:', data);
    // Aqui você pode atualizar a interface ou mostrar uma mensagem de sucesso
  })
  .catch(error => {
    console.error('Erro ao adicionar aos favoritos:', error);
  });
}

// Função para buscar séries com base no texto informado
function searchSeries(query) {
  if (!query) return; // Evita busca se o campo estiver vazio

  const url = `${SEARCH_API_URL}${encodeURIComponent(query)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const results = data.results;
      displaySearchResults(results); // Exibir resultados da pesquisa
    })
    .catch(error => console.error('Erro ao buscar séries:', error));
}

// Função para exibir os resultados da pesquisa
function displaySearchResults(results) {
  seriesContainer.innerHTML = ''; // Limpar os resultados anteriores

  results.forEach(series => {
    const seriesCard = document.createElement('div');
    seriesCard.classList.add('col');

    seriesCard.innerHTML = 
      `<div class="card">
        <a href="detalhes.html?id=${series.id}">
          <img src="https://image.tmdb.org/t/p/original${series.poster_path}" class="card-img-top" alt="${series.name}">
        </a>
        <div class="card-body">
          <h5 class="card-title">${series.name}</h5>
          <p class="card-text">${series.overview}</p>
          <button class="btn btn-primary" onclick="addFavorite(${series.id}, '${series.name}', '${series.poster_path}', '${series.overview}')">Adicionar aos Favoritos</button>
        </div>
      </div>`;

    seriesContainer.appendChild(seriesCard);
  });
}

// Evento para buscar séries ao pressionar "Enter" ou clicar no botão
searchBtn.addEventListener('click', () => {
  searchSeries(searchInput.value);
});
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    searchSeries(searchInput.value);
  }
});






/*// Função para obter o ID da série a partir da URL
function getSerieIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id'); // Retorna o valor do parâmetro "id"
}

// Extrai toda a parte após o ponto de interrogação
document.addEventListener("DOMContentLoaded", function () {
  console.log('Teste direto no HTML');
  const params = new URLSearchParams(window.location.search);
  console.log('Query String:', window.location.search); 
  const serieId = params.get('id');
  console.log('ID da série:', serieId);
});

console.log('O script está funcionando?');

if (serieId) {
    const SERIE_URL = `${BASE_URL}/tv/${serieId}?api_key=${API_KEY}&language=pt-BR`;
    const ELENCO_URL = `${BASE_URL}/tv/${serieId}/credits?api_key=${API_KEY}&language=pt-BR`;

    document.addEventListener('DOMContentLoaded', () => {
        const serieInfoContainer = document.getElementById('serie-info');
        const elencoContainer = document.getElementById('elenco');

        // Buscar detalhes da série
        fetch(SERIE_URL)
            .then(response => response.json())
            .then(dadosSerie => {
                // Preencher informações da série
                serieInfoContainer.innerHTML = `
                    <!-- Imagem da série -->
                    <div class="col-md-4">
                        <img src="${IMAGE_URL}${dadosSerie.poster_path}" class="img-fluid rounded" alt="${dadosSerie.name}">
                    </div>
                    <!-- Informações da série -->
                    <div class="col-md-8">
                        <!-- Sinopse -->
                        <h3>Sinopse</h3>
                        <p>${dadosSerie.overview}</p>

                        <!-- Diretor -->
                        <h3>Diretor</h3>
                        <p>Informação não disponível diretamente pela API</p>

                        <!-- Plataformas disponíveis -->
                        <h3>Plataformas Disponíveis</h3>
                        <p>Disney+ (exemplo fixo, ajuste conforme necessário)</p>

                        <!-- Botão para adicionar a "Minhas Séries" -->
                        <button type="button" class="btn btn-primary mt-3">Adicionar à Minhas Séries</button>
                    </div>
                `;
            })
            .catch(error => console.error('Erro ao buscar detalhes da série:', error));

        // Buscar elenco
        fetch(ELENCO_URL)
            .then(response => response.json())
            .then(data => {
                const elenco = data.cast.slice(0, 4); // Pegar os 4 primeiros atores
                elenco.forEach(ator => {
                    const card = document.createElement('div');
                    card.classList.add('card', 'mb-4');
                    card.innerHTML = `
                        <img src="${IMAGE_URL}${ator.profile_path}" class="card-img-top" alt="${ator.name}">
                        <div class="card-body">
                            <h5 class="card-title">${ator.name}</h5>
                        </div>
                    `;
                    elencoContainer.appendChild(card);
                });
            })
            .catch(error => console.error('Erro ao buscar elenco:', error));
    });
} else {
    console.error('ID da série não encontrado na URL');
}*/