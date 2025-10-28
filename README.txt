FEITO POR JOÃO VITOR REIS ALVES

O projeto passou por uma repaginada completa no visual e na lógica de busca, visando uma experiência mais moderna e focada na qualidade das imagens.

1. Repaginada Visual
O site foi completamente reestilizado com uma paleta de Azul Marinho e Cinza, substituindo o esquema de cores anterior.

Paleta de Cores: Fundo em azul marinho profundo (#1e293b) com elementos de destaque e botões em tons de cinza ardósia (#475569), garantindo um visual dark mode elegante.

Cards de Resultado Aprimorados: Os pôsteres e fotos de perfil agora são carregados em alta resolução (w342) e exibidos em cards maiores. Ao passar o mouse sobre qualquer card, é aplicado um leve efeito de zoom, melhorando a interatividade e o foco visual.

2. Nova Lógica de Busca de Ator
A seção de busca de ator foi totalmente reconstruída para funcionar em um fluxo intuitivo de duas etapas:

Busca de Ator: Ao pesquisar um nome (ex: "Tom Hanks"), o site exibe uma grade de cards com as fotos de perfil dos atores correspondentes.

Visualização da Filmografia: Ao clicar na imagem (card) de um ator, o site faz uma nova requisição à API e substitui a grade de resultados pela filmografia completa daquele ator.

3. Paginação Unificada e Corrigida
A navegação entre páginas foi estabilizada e estendida a todo o site:

Paginação Funcional: O erro que impedia a mudança de página (sempre retornando à Página 1) foi corrigido no app.js. Os botões "Próxima" e "Anterior" agora funcionam perfeitamente para avançar e retroceder nos resultados.

Suporte Total: A paginação é aplicada automaticamente tanto para a busca de filmes por título quanto para a lista de filmes por ator (após o clique).

Feedback ao Usuário: As mensagens de status indicam de forma clara a página atual e o total (ex: "Página 3 de 8 de filmes com 'Tom Hanks'").

4. Mensagens Amigáveis de Carregamento
Todos os alert ou console.log técnicos foram removidos. Agora, durante o carregamento dos dados da API, o usuário recebe mensagens temáticas e amigáveis diretamente na interface:

Ao buscar atores: "🎬 Procurando estrelas..."

Ao carregar filmes/filmografias: "🍿 Preparando a pipoca... buscando na cinemateca..."