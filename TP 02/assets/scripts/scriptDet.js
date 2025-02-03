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

// Função para obter o ID da série a partir da URL
function getSerieIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); // Retorna o valor do parâmetro "id"
  }
  
  // Extrai toda a parte após o ponto de interrogação
  
    console.log('Teste direto no HTML');
    const params = new URLSearchParams(window.location.search);
    console.log('Query String:', window.location.search); 
    const serieId = params.get('id');
    console.log('ID da série:', serieId);
  
  
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

        <!-- Data de estreia -->
        <h3>Data do Primeiro e Último Episódio Lançado </h3>
        <p>${dadosSerie.first_air_date} // ${dadosSerie.last_air_date}</p>

        <!-- Número de episódios e temporadas -->
        <h3>Número de Episódios e Temporadas</h3>
        <p>${dadosSerie.number_of_episodes} Episódios // ${dadosSerie.number_of_seasons} Temporada(s)</p>

        <!-- Avaliações -->
        <h3>Quantidade de Avaliações</h3>
        <p>${dadosSerie.vote_count} Avaliações</p>

        <!-- Média geral -->
        <h3>Média Geral</h3>
        <p>Nota : ${dadosSerie.vote_average}</p>

        <!-- Botão para adicionar a "Minhas Séries" -->
        <button class="btn btn-primary" onclick="addFavorite(${dadosSerie.id}, '${dadosSerie.name}', '${dadosSerie.poster_path}', '${dadosSerie.overview || 'Descrição indisponível'}')">Adicionar aos Favoritos</button>
    </div>
`;
              })
              .catch(error => console.error('Erro ao buscar detalhes da série:', error));
  
          // Buscar elenco
          fetch(ELENCO_URL)
              .then(response => response.json())
              .then(data => {
                  const elenco = data.cast.slice(0, 8); // Pegar os 4 primeiros atores
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
  }

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