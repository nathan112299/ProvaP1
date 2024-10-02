const listaPersonagens = document.getElementById("listaPersonagens");
const botaoNovosPersonagens = document.getElementById("botaoNovosPersonagens");
const entradaBusca = document.getElementById("entradaBusca");
const listaFavoritos = document.getElementById("listaFavoritos");

let todosPersonagens = [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let paginaAtual = 1;

// Busca todos os personagens
function buscarTodosPersonagens(pagina = 1) {
  fetch(`https://rickandmortyapi.com/api/character?page=${pagina}`)
    .then(resposta => {
      if (!resposta.ok) throw new Error("Erro na requisição");
      return resposta.json();
    })

    .then(dados => {
      todosPersonagens = [...todosPersonagens, ...dados.results];
      exibirPersonagens(todosPersonagens);
      exibirFavoritos();
    })
    
    // .catch(erro => {
    //   alert("Problema com a requisição. Tente novamente mais tarde.");
    //   console.error(erro);
    // });
}

// Cria um elemento de personagem
function criarElementoPersonagem(personagem) {
  const divPersonagem = document.createElement("div");
  divPersonagem.className = "item-personagem";

  const img = document.createElement("img");
  img.src = personagem.image;
  img.alt = personagem.name;

  const botaoFavorito = document.createElement("button");
  botaoFavorito.textContent = favoritos.includes(personagem.id) ? "Remover Favorito" : "Favoritar";
  botaoFavorito.className = "botao-favorito";

  botaoFavorito.addEventListener("click", (e) => {
    e.stopPropagation();
    if (favoritos.includes(personagem.id)) {
      removerFavorito(personagem.id);
    } else {
      adicionarFavorito(personagem.id);
    }
    atualizarTextoBotao(botaoFavorito, personagem.id);
  });

  divPersonagem.addEventListener("click", () => {
    alert(`Detalhes do personagem: ${personagem.name}\nStatus: ${personagem.status}\nEspécie: ${personagem.species}`);
  });

  divPersonagem.append(img, botaoFavorito);
  return divPersonagem;
}

// Atualiza o texto do botão de favorito
function atualizarTextoBotao(botao, id) {
  botao.textContent = favoritos.includes(id) ? "Remover Favorito" : "Favoritar";
}

// Exibe personagens na lista
function exibirPersonagens(personagens) {
  listaPersonagens.innerHTML = "";
  personagens.forEach(personagem => {
    listaPersonagens.appendChild(criarElementoPersonagem(personagem));
  });
}

// Adiciona um personagem aos favoritos
function adicionarFavorito(id) {
  if (!favoritos.includes(id)) {
    favoritos.push(id);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    alert(`Personagem ${id} adicionado aos favoritos!`);
    exibirFavoritos();
  } else {
    alert(`Personagem ${id} já está nos favoritos!`);
  }
}

// Remove um personagem dos favoritos
function removerFavorito(id) {
  favoritos = favoritos.filter(favoritoId => favoritoId !== id);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  alert(`Personagem ${id} removido dos favoritos!`);
  exibirFavoritos();
}

// Exibe os favoritos
function exibirFavoritos() {
  listaFavoritos.innerHTML = "";
  favoritos.forEach(id => {
    const personagem = todosPersonagens.find(p => p.id === id);
    if (personagem) {
      listaFavoritos.appendChild(criarElementoPersonagem(personagem));
    }
  });
}

// Filtra personagens pela busca
function filtrarPersonagens() {
  const termoBusca = entradaBusca.value.toLowerCase();
  const personagensFiltrados = todosPersonagens.filter(personagem => 
    personagem.name.toLowerCase().includes(termoBusca)
  );
  exibirPersonagens(personagensFiltrados);
}

// Trata o scroll para carregar mais personagens
function tratarScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    paginaAtual++;
    buscarTodosPersonagens(paginaAtual);
  }
}

// Inicializa
buscarTodosPersonagens(paginaAtual);

botaoNovosPersonagens.addEventListener("click", () => {
  const personagensAleatorios = todosPersonagens.sort(() => 0.5 - Math.random()).slice(0, 10);
  exibirPersonagens(personagensAleatorios);
});

entradaBusca.addEventListener("input", filtrarPersonagens);
window.addEventListener("scroll", tratarScroll);
