/*
  treino.js: o portal de treino do Preparatório AZ-900 (versão 1 · 2026-11-11 · aula 1, o tour).
  Nasceu do motor do simulador de Fundamentos de Computação em Nuvem (simulador/portal.js), com a cara do
  Stela Cloud: nada de logo da Microsoft, e o nome do serviço no Azure escrito ao lado.
  Aqui é só treino: sem login, sem nota, e nada vai para o banco. O estado fica no navegador (localStorage).
  As missões e os critérios são só do Cerrado Delivery: não copie as do Ateliê nem as do Stela Cloud.

  Cada aula liberada ganha as suas missões em MISSOES (campo aula). Uma missão tem passos;
  cada passo é marcado sozinho quando o aluno faz a coisa no portal (marcar("id-do-passo")).
*/
(function () {

  const CHAVE = "az900-portal-treino-v1";

  // ---------- os serviços do menu (nome do Stela Cloud e o equivalente no Azure) ----------
  const SERVICOS = [
    { id: "inicio", nome: "Página inicial", icone: "🏠" },
    { id: "criar", nome: "Criar um recurso", icone: "＋" },
    { id: "todos", nome: "Todos os recursos", icone: "▦" },
    { id: "grupos", nome: "Grupos de recursos", icone: "🗂", azure: "Grupos de recursos", aula: 4 },
    { id: "compute", nome: "Stela Compute", icone: "🖥", azure: "Máquinas virtuais", aula: 5, cor: "--c-compute" },
    { id: "storage", nome: "Stela Storage", icone: "🗄", azure: "Contas de armazenamento", aula: 7, cor: "--c-storage" },
    { id: "network", nome: "Stela Network", icone: "🛡", azure: "Redes virtuais", aula: 6, cor: "--c-network" },
    { id: "identity", nome: "Stela Identity", icone: "🪪", azure: "Microsoft Entra ID", aula: 8, cor: "--c-identity" },
    { id: "custos", nome: "Stela Cost", icone: "💲", azure: "Gerenciamento de Custos", aula: 9, cor: "--c-vault" },
    { id: "monitor", nome: "Stela Monitor", icone: "📈", azure: "Azure Monitor", aula: 12, cor: "--c-monitor" },
  ];

  // ---------- as missões do Cerrado Delivery ----------
  const MISSOES = [
    {
      id: "tour",
      aula: 1,
      titulo: "Aula 1 · Tour pelo portal",
      pedido: "Antes de criar qualquer coisa, a equipe do Cerrado Delivery quer saber onde fica cada coisa no portal. Faça os seis passos:",
      passos: [
        { id: "busca", texto: "🔎 Ache um serviço pela barra de pesquisa (tente \"máquinas\")." },
        { id: "criar", texto: "＋ Abra \"Criar um recurso\" e veja as categorias." },
        { id: "todos", texto: "▦ Abra \"Todos os recursos\": por enquanto, vazio." },
        { id: "conta", texto: "👤 Clique na conta, no canto de cima, e ache a assinatura." },
        { id: "sino", texto: "🔔 Abra as notificações (o sino)." },
        { id: "ajuda", texto: "❓ Abra \"Ajuda + suporte\" e veja a integridade do serviço." },
      ],
    },
  ];

  // ---------- estado ----------
  function estadoInicial() {
    return { feitos: {} };
  }

  function carregar() {
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE));
      if (salvo && salvo.feitos) return salvo;
    } catch (erro) { /* sem localStorage: começa do zero */ }
    return estadoInicial();
  }

  let estado = carregar();

  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (erro) { /* navegador sem armazenamento */ }
  }

  // ---------- ajudantes ----------
  const tela = document.getElementById("sim-tela");
  const notificacao = document.getElementById("sim-notificacao");
  const menu = document.getElementById("sim-menu");
  const hamburguer = document.querySelector(".sim-hamburguer");
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function avisar(texto) {
    notificacao.textContent = texto;
    notificacao.hidden = false;
    clearTimeout(avisar.relogio);
    avisar.relogio = setTimeout(() => { notificacao.hidden = true; }, 5000);
  }

  function dica(texto) {
    const caixa = document.getElementById("sim-dica");
    caixa.innerHTML = texto;
    caixa.hidden = !texto;
  }

  // marca um passo da missão e comemora quando a missão inteira fica pronta
  function marcar(passo) {
    if (estado.feitos[passo]) return;
    estado.feitos[passo] = true;
    salvar();
    const m = MISSOES.find((x) => x.passos.some((p) => p.id === passo));
    const faltam = m.passos.filter((x) => !estado.feitos[x.id]).length;
    dica(faltam
      ? `<strong>✔ Passo feito!</strong> ${faltam === 1 ? "Falta 1." : `Faltam ${faltam}.`}`
      : `<strong>🏆 Tour completo!</strong> Você já sabe onde ficam a pesquisa, os recursos, a assinatura, as notificações e a ajuda. Na aula 4, o Cerrado Delivery cria o primeiro grupo de recursos.`);
    desenharMissoes();
  }

  function desenharMissoes() {
    const lista = document.getElementById("sim-lista-missoes");
    lista.innerHTML = MISSOES.map((m) => {
      const feitos = m.passos.filter((p) => estado.feitos[p.id]).length;
      const pronta = feitos === m.passos.length;
      return `<li class="${pronta ? "feita" : ""}"><strong>${pronta ? "✔" : "○"} ${esc(m.titulo)}</strong><span>${esc(m.pedido)}</span>
        <ol class="sim-passos">${m.passos.map((p) => `<li class="${estado.feitos[p.id] ? "feito" : ""}"><span aria-hidden="true">${estado.feitos[p.id] ? "✅" : "⬜"}</span> ${esc(p.texto)}<span class="visualmente-oculto">${estado.feitos[p.id] ? " (feito)" : " (a fazer)"}</span></li>`).join("")}</ol>
        <span class="sim-barrinha" style="--p:${feitos / m.passos.length}" aria-hidden="true"></span></li>`;
    }).join("");
    const passos = MISSOES.flatMap((m) => m.passos);
    const feitos = passos.filter((p) => estado.feitos[p.id]).length;
    document.getElementById("sim-placar").textContent = `${feitos} de ${passos.length} passos · novas missões chegam com as próximas aulas`;
  }

  // ---------- os painéis do topo (conta, sino, ajuda) ----------
  const PAINEIS = {
    conta: `<h3>Conta</h3>
      <dl class="sim-detalhes">
        <dt>Usuário</dt><dd>equipe@cerradodelivery (simulado)</dd>
        <dt>Diretório</dt><dd>Cerrado Delivery</dd>
        <dt>Assinatura</dt><dd>Assinatura de estudo</dd>
      </dl>
      <p class="sim-nota">A <strong>assinatura</strong> é a conta que recebe a fatura: tudo o que você cria fica dentro de uma. O diretório guarda quem pode entrar. As duas voltam na aula 4.</p>`,
    sino: `<h3>Notificações</h3>
      <ul class="sim-avisos">
        <li><time>agora</time>Bem-vindo ao portal de treino do Cerrado Delivery.</li>
        <li><time>agora</time>Nenhuma implantação em andamento. Quando você criar um recurso, o aviso aparece aqui.</li>
      </ul>`,
    ajuda: `<h3>Ajuda + suporte</h3>
      <p><span class="sim-bolinha" aria-hidden="true"></span><strong>Integridade do serviço:</strong> tudo funcionando nas regiões que você usa (simulado).</p>
      <p class="sim-nota">No Azure, a <strong>integridade do serviço</strong> diz se o problema é da Microsoft ou seu. Ela volta na aula 12. Para abrir um chamado, existe "Criar uma solicitação de suporte".</p>`,
  };

  function abrirPainel(qual, botao) {
    const caixa = document.getElementById("sim-painel-topo");
    const aberto = !caixa.hidden && caixa.dataset.qual === qual;
    document.querySelectorAll("[data-painel-topo]").forEach((b) => b.setAttribute("aria-expanded", "false"));
    if (aberto) { caixa.hidden = true; return; }
    caixa.innerHTML = PAINEIS[qual];
    caixa.dataset.qual = qual;
    caixa.hidden = false;
    botao.setAttribute("aria-expanded", "true");
    marcar(qual);
  }

  // ---------- as telas ----------
  function cabecalho(titulo, migalhas) {
    const trilha = (migalhas || []).map((m) => `<button type="button" class="sim-link" data-ir="${m[0]}">${esc(m[1])}</button> ›`).join(" ");
    const caminho = trilha ? `<p class="sim-migalhas">${trilha} <span>${esc(titulo)}</span></p>` : "";
    return `${caminho}<h2 class="sim-titulo">${esc(titulo)}</h2>`;
  }

  function botaoServico(s) {
    const cor = s.cor ? ` style="--cor:var(${s.cor})"` : "";
    const azure = s.azure && s.azure !== s.nome ? `<small>no Azure: ${esc(s.azure)}</small>` : "";
    return `<button type="button" data-ir="${s.id}"${cor}><span aria-hidden="true">${s.icone}</span><span>${esc(s.nome)}${azure}</span></button>`;
  }

  function telaEmBreve(s) {
    return `${cabecalho(s.nome, [["inicio", "Página inicial"]])}
      ${s.azure && s.azure !== s.nome ? `<p class="sim-equivale">No Azure: <strong>${esc(s.azure)}</strong></p>` : ""}
      <p class="sim-vazio">Nada para exibir ainda. Este serviço entra nas missões da aula ${s.aula}.</p>`;
  }

  const TELAS = {
    inicio() {
      return `${cabecalho("Página inicial")}
        <p class="sim-nota">Bem-vindo, equipe do Cerrado Delivery. Este é o painel do Stela Cloud, com os nomes do Azure ao lado.</p>
        <h3 class="sim-sub">Serviços</h3>
        <div class="sim-servicos">${SERVICOS.filter((s) => s.id !== "inicio").map(botaoServico).join("")}</div>
        <h3 class="sim-sub">Recursos recentes</h3>
        <p class="sim-vazio">Nenhum recurso ainda.</p>`;
    },

    criar() {
      return `${cabecalho("Criar um recurso", [["inicio", "Página inicial"]])}
        <p class="sim-nota">As categorias do portal. Cada uma entra numa aula.</p>
        <div class="sim-servicos sim-categorias">
          <button type="button" data-acao="breve" data-aula="4"><span aria-hidden="true">🗂</span><span>Grupo de recursos<small>aula 4</small></span></button>
          <button type="button" data-acao="breve" data-aula="5"><span aria-hidden="true">🖥</span><span>Computação<small>máquinas virtuais, contêineres e funções · aula 5</small></span></button>
          <button type="button" data-acao="breve" data-aula="6"><span aria-hidden="true">🛡</span><span>Rede<small>redes virtuais e VPN · aula 6</small></span></button>
          <button type="button" data-acao="breve" data-aula="7"><span aria-hidden="true">🗄</span><span>Armazenamento<small>contas de armazenamento · aula 7</small></span></button>
          <button type="button" data-acao="breve" data-aula="8"><span aria-hidden="true">🪪</span><span>Identidade<small>usuários e acessos · aula 8</small></span></button>
        </div>`;
    },

    todos() {
      return `${cabecalho("Todos os recursos", [["inicio", "Página inicial"]])}
        <div class="sim-tabela"><table><thead><tr><th>Nome</th><th>Tipo</th><th>Grupo de recursos</th><th>Localização</th></tr></thead><tbody></tbody></table></div>
        <p class="sim-vazio">Nenhum recurso para exibir. Tudo o que o Cerrado Delivery criar vai aparecer aqui, de todos os tipos.</p>`;
    },
  };

  // ---------- navegação ----------
  function ir(nome) {
    const s = SERVICOS.find((x) => x.id === nome);
    tela.innerHTML = TELAS[nome] ? TELAS[nome]() : s ? telaEmBreve(s) : TELAS.inicio();
    menu.querySelectorAll("[data-ir]").forEach((b) => b.toggleAttribute("aria-current", b.dataset.ir === nome));
    menu.classList.remove("aberto");
    hamburguer.setAttribute("aria-expanded", "false");
    if (nome === "criar" || nome === "todos") marcar(nome);
    tela.focus({ preventScroll: true });
  }

  // o menu lateral, com o equivalente do Azure embaixo de cada serviço
  menu.innerHTML = SERVICOS.map(botaoServico).join("");

  // ---------- eventos ----------
  document.addEventListener("click", (evento) => {
    const alvo = evento.target.closest("[data-ir], [data-acao], [data-painel-topo]");
    if (!alvo || !alvo.closest(".sim-portal")) return;
    if (alvo.dataset.painelTopo) return abrirPainel(alvo.dataset.painelTopo, alvo);
    if (alvo.dataset.ir) return ir(alvo.dataset.ir);
    if (alvo.dataset.acao === "breve") return avisar(`Este recurso entra nas missões da aula ${alvo.dataset.aula}.`);
  });

  document.addEventListener("keydown", (evento) => {
    const caixa = document.getElementById("sim-painel-topo");
    if (evento.key === "Escape" && !caixa.hidden) {
      caixa.hidden = true;
      const botao = document.querySelector('[data-painel-topo][aria-expanded="true"]');
      if (botao) { botao.setAttribute("aria-expanded", "false"); botao.focus(); }
    }
  });

  hamburguer.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    hamburguer.setAttribute("aria-expanded", String(aberto));
  });

  // a pesquisa procura pelo nome do Stela Cloud e pelo nome do Azure
  document.getElementById("sim-busca").addEventListener("input", (evento) => {
    const termo = evento.target.value.trim().toLowerCase();
    if (!termo) return ir("inicio");
    const achados = SERVICOS.filter((s) => (s.nome + " " + (s.azure || "")).toLowerCase().includes(termo));
    tela.innerHTML = `${cabecalho(`Resultados para "${termo}"`)}
      <h3 class="sim-sub">Serviços</h3>
      ${achados.length ? `<div class="sim-servicos">${achados.map(botaoServico).join("")}</div>` : `<p class="sim-vazio">Nenhum serviço encontrado. Tente "máquinas", "armazenamento" ou "custos".</p>`}
      <h3 class="sim-sub">Recursos</h3>
      <p class="sim-vazio">Nenhum recurso encontrado.</p>`;
    if (achados.length && termo.length >= 3) marcar("busca");
  });

  document.getElementById("sim-recomecar").addEventListener("click", () => {
    if (!window.confirm("Recomeçar o portal de treino? As missões voltam ao zero.")) return;
    estado = estadoInicial();
    salvar();
    dica("");
    desenharMissoes();
    ir("inicio");
  });

  desenharMissoes();
  ir("inicio");
})();
