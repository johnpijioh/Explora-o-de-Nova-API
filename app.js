const CHAVE_API = '22f6c5580eb3be734a3c30a1238a90cf';
const URL_BASE = 'https://api.themoviedb.org/3';
const URL_IMAGEM_POSTER = 'https://image.tmdb.org/t/p/w342';
const URL_IMAGEM_PERFIL = 'https://image.tmdb.org/t/p/w342';

const campoBuscaFilme = document.getElementById("campo-busca");
const mensagemStatusFilme = document.getElementById("mensagem-status-filme");

const campoBuscaAtor = document.getElementById("campo-ator");
const mensagemStatusAtor = document.getElementById("mensagem-status-ator");

const listaResultados = document.getElementById("lista-resultados");
const mensagemStatusGeral = document.getElementById("mensagem-status-geral");

const containerPaginacao = document.getElementById("container-paginacao");
const botaoAnterior = document.getElementById("botao-anterior");
const botaoProximo = document.getElementById("botao-proximo");

let paginaAtual = 1;
let totalPaginas = 1;
let modoBusca = 'filme';
let ultimoTermoBusca = "";
let ultimoIdAtor = 0;

async function fetchApi(endpoint, params = "") {
  const url = `${URL_BASE}${endpoint}?api_key=${CHAVE_API}&language=pt-BR${params}`;
  
  try {
    const resposta = await fetch(url);
    if (!resposta.ok) {
      throw new Error(`Erro na API: ${resposta.statusText}`);
    }
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Falha no fetchApi:", erro); 
    throw erro; 
  }
}

function resetarBusca() {
  mensagemStatusFilme.textContent = "";
  mensagemStatusAtor.textContent = "";
  mensagemStatusGeral.textContent = "Abaixo aparecerão os resultados da busca:";
  listaResultados.innerHTML = "";
  controlarPaginacao('esconder');
  paginaAtual = 1;
  totalPaginas = 1;
}

function iniciarBuscaFilme() {
  modoBusca = 'filme';
  ultimoTermoBusca = campoBuscaFilme.value.trim();
  
  if (!ultimoTermoBusca) {
    resetarBusca();
    mensagemStatusFilme.textContent = "Digite o nome de um filme para pesquisar.";
    return;
  }
  
  buscarResultadosPaginados(true);
}

async function buscarAtores() {
  modoBusca = 'ator_lista';
  const termoBusca = campoBuscaAtor.value.trim();

  resetarBusca();

  if (!termoBusca) {
    mensagemStatusAtor.textContent = "Digite o nome de um ator para pesquisar.";
    return;
  }

  mensagemStatusAtor.textContent = "🎬 Procurando estrelas...";

  try {
    const params = `&query=${encodeURIComponent(termoBusca)}`;
    const dados = await fetchApi('/search/person', params);

    if (dados.results.length === 0) {
      mensagemStatusAtor.textContent = `Nenhum ator encontrado para "${termoBusca}".`;
      return;
    }

    exibirAtores(dados.results);
    mensagemStatusAtor.textContent = `Mostrando resultados para "${termoBusca}". Clique em um ator para ver os filmes.`;

  } catch (erro) {
    mensagemStatusAtor.textContent = "❌ Erro ao buscar atores.";
  }
}

function selecionarAtor(atorId, atorNome) {
  modoBusca = 'ator_filmes';
  ultimoIdAtor = atorId;
  ultimoTermoBusca = atorNome;
  
  buscarResultadosPaginados(true);
}

async function buscarResultadosPaginados(resetarPagina = false) {
  
  if (resetarPagina) {
    paginaAtual = 1;
    resetarBusca();
  } else {
    listaResultados.innerHTML = "";
  }

  mensagemStatusGeral.textContent = "🍿 Preparando a pipoca... buscando na cinemateca...";
  
  try {
    let endpoint = '';
    let params = '';
    
    if (modoBusca === 'filme') {
      endpoint = '/search/movie';
      params = `&query=${encodeURIComponent(ultimoTermoBusca)}&page=${paginaAtual}`;
    } else if (modoBusca === 'ator_filmes') {
      endpoint = '/discover/movie';
      params = `&with_cast=${ultimoIdAtor}&page=${paginaAtual}&sort_by=popularity.desc`;
    }

    const dados = await fetchApi(endpoint, params);

    if (dados.results.length === 0) {
      mensagemStatusGeral.textContent = `Nenhum resultado encontrado.`;
      return;
    }

    exibirFilmes(dados.results);
    totalPaginas = dados.total_pages;
    
    let status = `Página ${paginaAtual} de ${totalPaginas} `;
    if (modoBusca === 'filme') {
      status += `para "${ultimoTermoBusca}"`;
    } else if (modoBusca === 'ator_filmes') {
      status += `de filmes com "${ultimoTermoBusca}"`;
    }
    mensagemStatusGeral.textContent = status;
    
    controlarPaginacao('mostrar');

  } catch (erro) {
    mensagemStatusGeral.textContent = "❌ Erro ao buscar resultados.";
  }
}

function exibirFilmes(filmes) {
  listaResultados.innerHTML = "";

  filmes.forEach(filme => {
    const div = document.createElement("div");
    div.classList.add("card");

    const poster = filme.poster_path
      ? `${URL_IMAGEM_POSTER}${filme.poster_path}`
      : "https://via.placeholder.com/342x513?text=Sem+Poster";

    const ano = filme.release_date ? filme.release_date.split('-')[0] : "N/A";

    div.innerHTML = `
      <img src="${poster}" alt="Pôster do filme ${filme.title}">
      <h3>${filme.title}</h3>
      <p>Ano: ${ano}</p>
    `;
    listaResultados.appendChild(div);
  });
}

function exibirAtores(atores) {
  listaResultados.innerHTML = ""; 

  atores.forEach(ator => {
    if (ator.known_for_department !== 'Acting') return;

    const div = document.createElement("div");
    div.classList.add("card");
    div.setAttribute('onclick', `selecionarAtor(${ator.id}, '${ator.name.replace(/'/g, "\\'")}')`);


    const foto = ator.profile_path
      ? `${URL_IMAGEM_PERFIL}${ator.profile_path}`
      : "https://via.placeholder.com/342x513?text=Sem+Foto";

    div.innerHTML = `
      <img src="${foto}" alt="Foto de ${ator.name}">
      <h3>${ator.name}</h3>
      <p>Ator/Atriz</p>
    `;
    listaResultados.appendChild(div);
  });
}

function proximaPagina() {
  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    buscarResultadosPaginados(false);
  }
}

function paginaAnterior() {
  if (paginaAtual > 1) {
    paginaAtual--;
    buscarResultadosPaginados(false);
  }
}

function controlarPaginacao(acao) {
  if (acao === 'mostrar') {
    containerPaginacao.style.display = 'block';
    botaoAnterior.disabled = (paginaAtual === 1);
    botaoProximo.disabled = (paginaAtual === totalPaginas || paginaAtual === 500);
  } else {
    containerPaginacao.style.display = 'none';
  }
}

document.getElementById('botao-buscar-filme').addEventListener('click', iniciarBuscaFilme);
document.getElementById('botao-buscar-ator').addEventListener('click', buscarAtores);
botaoAnterior.addEventListener('click', paginaAnterior);
botaoProximo.addEventListener('click', proximaPagina);

controlarPaginacao('esconder');