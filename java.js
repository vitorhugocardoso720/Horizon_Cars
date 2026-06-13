const usuarioPadrao = "admin";
const senhaPadrao = "1234";

let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let pecas = JSON.parse(localStorage.getItem("pecas")) || [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

const loginContainer = document.getElementById("loginContainer");
const sistema = document.getElementById("sistema");
const erroLogin = document.getElementById("erroLogin");

sistema.style.display = "none";

if (sessionStorage.getItem("logado") === "true") {
  abrirSistema();
}

document.getElementById("formLogin").addEventListener("submit", function(e) {

  e.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();

  erroLogin.textContent = "";

  if (
    usuario === usuarioPadrao &&
    senha === senhaPadrao
  ) {

    sessionStorage.setItem("logado", "true");

    abrirSistema();

  } else {

    erroLogin.textContent = "Usuário ou senha incorretos";

  }

});

function abrirSistema() {

  loginContainer.style.display = "none";
  sistema.style.display = "block";

  mostrarSecao("dashboard");

  atualizarTabelaClientes();
  atualizarTabelaPecas();
  atualizarTabelaVendas();
  atualizarDashboard();
  atualizarSelects();
  atualizarCategorias();

}

function logout() {

  sessionStorage.removeItem("logado");

  sistema.style.display = "none";
  loginContainer.style.display = "flex";

  document.getElementById("formLogin").reset();

}

function mostrarSecao(id) {

  document.querySelectorAll(".secao").forEach(secao => {
    secao.style.display = "none";
  });

  document.getElementById(id).style.display = "block";

}

function salvarDados() {

  localStorage.setItem("clientes", JSON.stringify(clientes));
  localStorage.setItem("pecas", JSON.stringify(pecas));
  localStorage.setItem("vendas", JSON.stringify(vendas));

}

document.getElementById("formCliente").addEventListener("submit", function(e) {

  e.preventDefault();

  const nome = document.getElementById("nomeCliente").value;
  const telefone = document.getElementById("telefoneCliente").value;

  clientes.push({
    nome,
    telefone
  });

  salvarDados();

  atualizarTabelaClientes();
  atualizarDashboard();

  this.reset();

});

function atualizarTabelaClientes() {

  const tabela = document.getElementById("tabelaClientes");

  tabela.innerHTML = "";

  clientes.forEach((cliente, index) => {

    tabela.innerHTML += `
      <tr>
        <td>${cliente.nome}</td>
        <td>${cliente.telefone}</td>
        <td>
          <button class="btn-excluir" onclick="excluirCliente(${index})">
            Excluir
          </button>
        </td>
      </tr>
    `;

  });

  atualizarSelects();

}

function excluirCliente(index) {

  clientes.splice(index, 1);

  salvarDados();

  atualizarTabelaClientes();
  atualizarDashboard();

}

document.getElementById("formPeca").addEventListener("submit", function(e) {

  e.preventDefault();

  const nome = document.getElementById("nomePeca").value;
  const categoria = document.getElementById("categoriaPeca").value;
  const quantidade = Number(document.getElementById("quantidadePeca").value);
  const minimo = Number(document.getElementById("estoqueMinimo").value);
  const preco = Number(document.getElementById("precoPeca").value);

  const codigo = "P" + Date.now();

  pecas.push({
    codigo,
    nome,
    categoria,
    quantidade,
    minimo,
    preco
  });

  salvarDados();

  atualizarTabelaPecas();
  atualizarDashboard();
  atualizarSelects();
  atualizarCategorias();

  this.reset();

});

function atualizarTabelaPecas() {

  const tabela = document.getElementById("tabelaPecas");

  tabela.innerHTML = "";

  const pesquisa = document.getElementById("pesquisaPeca").value.toLowerCase();

  const categoriaFiltro = document.getElementById("filtroCategoria").value;

  let lista = pecas.filter(peca => {

    return (
      peca.nome.toLowerCase().includes(pesquisa) &&
      (
        categoriaFiltro === "" ||
        peca.categoria === categoriaFiltro
      )
    );

  });

  lista.forEach((peca, index) => {

    let status = "OK";
    let classe = "status-ok";

    if (peca.quantidade <= peca.minimo) {

      status = "Baixo";
      classe = "status-baixo";

    }

    tabela.innerHTML += `
      <tr>
        <td>${peca.codigo}</td>
        <td>${peca.nome}</td>
        <td>${peca.categoria}</td>
        <td>${peca.quantidade}</td>
        <td>${peca.minimo}</td>
        <td>R$ ${peca.preco.toFixed(2)}</td>
        <td>
          <span class="${classe}">
            ${status}
          </span>
        </td>
        <td>
          <button class="btn-add" onclick="adicionarEstoque(${index})">
            +
          </button>

          <button class="btn-remover" onclick="removerEstoque(${index})">
            -
          </button>

          <button class="btn-excluir" onclick="excluirPeca(${index})">
            Excluir
          </button>
        </td>
      </tr>
    `;

  });

}

function adicionarEstoque(index) {

  const valor = Number(prompt("Quantidade para adicionar"));

  if (valor > 0) {

    pecas[index].quantidade += valor;

    salvarDados();

    atualizarTabelaPecas();
    atualizarDashboard();
    atualizarSelects();

  }

}

function removerEstoque(index) {

  const valor = Number(prompt("Quantidade para remover"));

  if (
    valor > 0 &&
    pecas[index].quantidade >= valor
  ) {

    pecas[index].quantidade -= valor;

    salvarDados();

    atualizarTabelaPecas();
    atualizarDashboard();
    atualizarSelects();

  }

}

function excluirPeca(index) {

  pecas.splice(index, 1);

  salvarDados();

  atualizarTabelaPecas();
  atualizarDashboard();
  atualizarSelects();
  atualizarCategorias();

}

function atualizarCategorias() {

  const filtro = document.getElementById("filtroCategoria");

  const categorias = [...new Set(pecas.map(p => p.categoria))];

  filtro.innerHTML = `
    <option value="">Todas Categorias</option>
  `;

  categorias.forEach(cat => {

    filtro.innerHTML += `
      <option value="${cat}">
        ${cat}
      </option>
    `;

  });

}

document
  .getElementById("pesquisaPeca")
  .addEventListener("input", atualizarTabelaPecas);

document
  .getElementById("filtroCategoria")
  .addEventListener("change", atualizarTabelaPecas);

function atualizarSelects() {

  const clienteVenda = document.getElementById("clienteVenda");
  const pecaVenda = document.getElementById("pecaVenda");

  clienteVenda.innerHTML = `
    <option value="">Cliente</option>
  `;

  clientes.forEach((cliente, index) => {

    clienteVenda.innerHTML += `
      <option value="${index}">
        ${cliente.nome}
      </option>
    `;

  });

  pecaVenda.innerHTML = `
    <option value="">Peça</option>
  `;

  pecas.forEach(peca => {

    pecaVenda.innerHTML += `
      <option value="${peca.codigo}">
        ${peca.nome} (${peca.quantidade})
      </option>
    `;

  });

}

document.getElementById("btnRegistrarVenda").addEventListener("click", () => {

  const clienteIndex =
    document.getElementById("clienteVenda").value;

  const codigo =
    document.getElementById("pecaVenda").value;

  const quantidade =
    Number(document.getElementById("quantidadeVenda").value);

  if (
    clienteIndex === "" ||
    codigo === ""
  ) {
    return;
  }

  const cliente = clientes[clienteIndex];

  const peca = pecas.find(p => p.codigo === codigo);

  if (
    !peca ||
    peca.quantidade < quantidade
  ) {

    alert("Estoque insuficiente");

    return;

  }

  peca.quantidade -= quantidade;

  const total = quantidade * peca.preco;

  vendas.unshift({

    data: new Date().toLocaleString(),
    cliente: cliente.nome,
    peca: peca.nome,
    quantidade,
    total

  });

  salvarDados();

  atualizarTabelaVendas();
  atualizarTabelaPecas();
  atualizarDashboard();
  atualizarSelects();

});

function atualizarTabelaVendas() {

  const tabela = document.getElementById("tabelaVendas");

  tabela.innerHTML = "";

  vendas.forEach(venda => {

    tabela.innerHTML += `
      <tr>
        <td>${venda.data}</td>
        <td>${venda.cliente}</td>
        <td>${venda.peca}</td>
        <td>${venda.quantidade}</td>
        <td>R$ ${venda.total.toFixed(2)}</td>
      </tr>
    `;

  });

}

function atualizarDashboard() {

  document.getElementById("totalClientes").textContent =
    clientes.length;

  document.getElementById("totalPecas").textContent =
    pecas.length;

  document.getElementById("totalVendas").textContent =
    vendas.length;

  let total = 0;

  pecas.forEach(peca => {

    total += peca.quantidade * peca.preco;

  });

  document.getElementById("valorEstoque").textContent =
    "R$ " + total.toFixed(2);

}

/* =========================
   MODO ESCURO COM SALVAMENTO
========================= */

const botaoTema = document.getElementById("temaBtn");

/* Verifica tema salvo */
const temaSalvo = localStorage.getItem("tema");

if (temaSalvo === "escuro") {

  document.body.classList.add("dark-mode");

  botaoTema.innerHTML = "☀️ Tema Claro";

} else {

  botaoTema.innerHTML = "🌙 Tema Escuro";

}

/* Alternar tema */
botaoTema.addEventListener("click", () => {

  document.body.classList.toggle("dark-mode");

  if(document.body.classList.contains("dark-mode")){

    botaoTema.innerHTML = "☀️ Tema Claro";

    localStorage.setItem("tema", "escuro");

  } else {

    botaoTema.innerHTML = "🌙 Tema Escuro";

    localStorage.setItem("tema", "claro");

  }

});