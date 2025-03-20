let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

const adicionaAoCarrinho = (nomeProduto, precoProduto) => {
    const produto = { nome: nomeProduto, preco: precoProduto };
    carrinho.push(produto);
    atualizaContagemCarrinho();
    salvarCarrinho();
    alert(`O produto ${nomeProduto} foi adicionado ao seu carrinho.`);
}

const atualizaContagemCarrinho = () => {
    document.getElementById('carrinho-contagem').textContent = carrinho.length;
}

const salvarCarrinho = () => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

const carregaCarrinho = () => {
    carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    atualizaContagemCarrinho();
    mostrarItensCarrinho();
}

const mostrarItensCarrinho = () => {
    const containerCarrinho = document.getElementById('carrinho-container');
    const totalCarrinho = document.getElementById('carrinho-total');
    containerCarrinho.innerHTML = '';
    let total = 0;

    carrinho.forEach((produto, indice) => {
        const itemCarrinho = document.createElement('div');
        itemCarrinho.classList.add('carrinho__item');
        
        itemCarrinho.innerHTML = `
            <img src="./img/${produto.nome}.jpg" alt="${produto.nome}">
            <div class="carrinho__item--detalhes">
                <h3>${produto.nome}</h3>
                <p>${produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
            <button onclick="removerItemCarrinho(${indice})">Remover</button>
        `;

        containerCarrinho.appendChild(itemCarrinho);
        total += produto.preco;
    });

    totalCarrinho.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const removerItemCarrinho = (indice) => {
    carrinho.splice(indice, 1);
    atualizaContagemCarrinho();
    salvarCarrinho();
    mostrarItensCarrinho();
}

const limpaCarrinho = () => {
    carrinho = [];
    atualizaContagemCarrinho();
    salvarCarrinho();
    mostrarItensCarrinho();
}


//RESPOSTAS

//Etapa 02
//URL para buscar: https://viacep.com.br/ws/58400240/json/
//Método http para usar: GET
//Resposta do Reject: reject('Erro ao consultar o CEP'))
const buscarEndereco = (cep) => {
    const url = `https://viacep.com.br/ws/${cep}/json/`
    return new Promise((resolve, reject) => {
        fetch(url)
        .then(response => {
            if (!response.ok) {
               reject('Erro ao consultar o CEP');
            }
            resolve(response.json())
        })
        .then(data => {
            if (data.erro) {
                reject('Erro ao consultar o CEP');
            } else {
                resolve(data)
            }
        })
        .catch(() => reject('Erro ao consultar o CEP'));
    });
}

const consultaCep = () => {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    if (cep.length === 8) {
        buscarEndereco(cep)
            .then(({ logradouro, complemento, localidade, uf }) => {
                document.getElementById('logradouro').value = logradouro;
                document.getElementById('complemento').value = complemento;
                document.getElementById('cidade').value = localidade;
                document.getElementById('estado').value = uf;
            })
            .catch(alert);
    } else {
        alert('CEP inválido!');
    }
};

//Etapa 03
const gerarTextoMarketeiro = ({ nome, email, motivo, cep, endereco, cidade}) => {

    const card = document.createElement('div');
    card.style.width = '300px';
    card.style.border = '1px solid #ccc';
    card.style.borderRadius = '10px';
    card.style.padding = '15px';
    card.style.boxShadow = '2px 2px 10px rgba(0,0,0,0.1)';
    card.style.margin = '10px auto';
    card.style.fontFamily = 'Arial, sans-serif';
    card.style.backgroundColor = '#f9f9f9';

    card.innerHTML =    
    `Apresentamos ${nome}, um profissional altamente qualificado e referência no desenvolvimento avançado de
software. Com uma trajetória pautada pela inovação e excelência, {nome} tem se destacado na criação de
soluções tecnológicas de alto impacto, na qual tem transformado desafios complexos em sistemas eficientes
e escaláveis.
Comunicável e estrategista, ${nome} pode ser contatado via e-mail em ${email}, mantendo-se sempre
disponível para colaborações e projetos que demandem expertise em engenharia de software, inteligência
artificial e programação web. Seu principal objetivo no momento é ${motivo}, reforçando sua busca contínua
pelo aprimoramento e pela entrega de soluções robustas e inteligentes.
Atualmente, ${nome} reside na dinâmica cidade de ${cidade}, no endereço ${endereco}, CEP ${cep}, onde
continua sua missão de criar e arquitetar aplicações inovadoras. Seu conhecimento aprofundado em diversas
linguagens, frameworks e metodologias ágeis o posiciona como um líder técnico capaz de elevar qualquer
equipe ao mais alto nível de performance.
Com uma visão futurista e uma abordagem precisa para o desenvolvimento de software, ${nome} segue
transformando o cenário tecnológico com soluções que transcendem expectativas.`;

    document.body.appendChild(card);

}


document.getElementById('marketeiroForm').onsubmit = event => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.target));
    console.log(gerarTextoMarketeiro(formData));
};

//Não mexer neste método
function submeterDados(event) {

    const dadosFormulario = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        motivo: document.getElementById('motivo').value,
        cep: document.getElementById('cep').value,
        endereco: document.getElementById('logradouro').value,
        complemento: document.getElementById('complemento').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value
    };

    gerarTextoMarketeiro(dadosFormulario);
};


//Etapa 04
//URL para buscar: http://demo2582395.mockable.io/produtos
//Método http para usar: GET
//Resposta do Reject: reject('Erro ao consultar os Produtos'))
const consultarDadosConcorrencia = () => 
    fetch('http://demo2582395.mockable.io/produtos')
        .then(response => response.json())
        .catch(() => Promise.reject('Erro ao consultar os Produtos'));

const alterarValoresTabela = opcao => {
    consultarDadosConcorrencia()
        .then(data => modificaValores(data[opcao]))
        .catch(alert);
};

//Não mexer neste método
const modificaValores = ([produto1, produto2, produto3, produto4, produto5, produto6]) => {

    const tabela = document.getElementById("tabelaProdutos").getElementsByTagName('tbody')[0];
    tabela.rows[0].cells[1].innerText = produto1.preco;
    tabela.rows[0].cells[2].innerText = produto1.estoque;
    tabela.rows[1].cells[1].innerText = produto2.preco;
    tabela.rows[1].cells[2].innerText = produto2.estoque;
    tabela.rows[2].cells[1].innerText = produto3.preco;
    tabela.rows[2].cells[2].innerText = produto3.estoque;
    tabela.rows[3].cells[1].innerText = produto4.preco;
    tabela.rows[3].cells[2].innerText = produto4.estoque;
    tabela.rows[4].cells[1].innerText = produto5.preco;
    tabela.rows[4].cells[2].innerText = produto5.estoque;
    tabela.rows[5].cells[1].innerText = produto6.preco;
    tabela.rows[5].cells[2].innerText = produto6.estoque;

}

window.onload = carregaCarrinho;
