/*
  treino.js: o portal de treino do Preparatório AZ-900 (versão 4 · 2026-11-12 · aula 1, o tour; 2, os jeitos de gerenciar; 3, cada serviço no seu modelo; 4, o primeiro grupo de recursos).
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
    { id: "grupos", nome: "Grupos de recursos", icone: "🗂" },
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
      fim: "<strong>🏆 Tour completo!</strong> Você já sabe onde ficam a pesquisa, os recursos, a assinatura, as notificações e a ajuda.",
    },
    {
      id: "gerenciar",
      aula: 2,
      titulo: "Aula 2 · Os jeitos de gerenciar",
      pedido: "A Lia quer saber se dá para cuidar do Cerrado Delivery sem clicar em tudo. Além do portal, teste o terminal e ache o SLA:",
      passos: [
        { id: "shell", texto: "⌨️ Abra o Cloud Shell, o terminal do topo do portal." },
        { id: "comando", texto: "💻 Rode um comando: az account show (no Bash) ou Get-AzSubscription (no PowerShell)." },
        { id: "sla", texto: "📜 Na ajuda, abra \"Contratos de nível de serviço (SLA)\"." },
      ],
      fim: "<strong>🏆 Missão cumprida!</strong> Portal, linha de comando e PowerShell: os jeitos de gerenciar na nuvem. E o SLA diz quanto tempo o serviço promete ficar no ar.",
    },
    {
      id: "modelos",
      aula: 3,
      titulo: "Aula 3 · Cada serviço no seu modelo",
      pedido: "A Lia quer saber o que cada serviço entrega pronto. Em \"Criar um recurso\", abra os três serviços em destaque e diga o modelo de cada um:",
      passos: [
        { id: "m-vm", texto: "🖥 Máquina virtual: qual é o modelo?" },
        { id: "m-web", texto: "🌐 Aplicativo Web: qual é o modelo?" },
        { id: "m-func", texto: "⚡ Aplicativo de funções: qual é o modelo?" },
      ],
      fim: "<strong>🏆 Missão cumprida!</strong> Máquina virtual é IaaS, aplicativo web é PaaS e aplicativo de funções é serverless. Quanto mais pronto o serviço, menos você cuida.",
    },
    {
      id: "grupo",
      aula: 4,
      titulo: "Aula 4 · O primeiro grupo de recursos",
      pedido: "O contrato com o órgão do DF pede os dados no Brasil. Crie a \"sacola\" dos recursos dos pedidos:",
      passos: [
        { id: "grupo-criado", texto: "🗂 Crie o grupo rg-cerrado-pedidos na região do Brasil que tem zonas de disponibilidade." },
        { id: "grupo-todos", texto: "▦ Ache o grupo em \"Todos os recursos\"." },
        { id: "grupo-hierarquia", texto: "🧭 Abra o grupo e veja em qual assinatura e em qual grupo de gerenciamento ele está." },
      ],
      fim: "<strong>🏆 Missão cumprida!</strong> O primeiro grupo de recursos do Cerrado Delivery está no Sul do Brasil, dentro da assinatura, dentro do grupo de gerenciamento raiz.",
    },
  ];

  // os serviços em destaque da aula 3: o que cada um entrega pronto e o modelo certo
  const DESTAQUES = {
    vm: { icone: "🖥", nome: "Máquina virtual", azure: "Máquinas Virtuais do Azure", certo: "iaas",
      texto: "Você escolhe o sistema operacional, instala e atualiza o que quiser. O Azure entrega o hardware, a rede e a segurança física.",
      ok: "IaaS: você recebe a máquina e cuida do sistema operacional para cima. Controle máximo, responsabilidade máxima." },
    web: { icone: "🌐", nome: "Aplicativo Web", azure: "Serviço de Aplicativo do Azure (App Service)", certo: "paas",
      texto: "Você envia o código do site. O Azure cuida do sistema operacional, das atualizações e da escala.",
      ok: "PaaS: a plataforma vem pronta, e você só traz o código e os dados." },
    func: { icone: "⚡", nome: "Aplicativo de funções", azure: "Azure Functions", certo: "serverless",
      texto: "O código acorda quando um evento acontece, roda por alguns segundos e para. Você paga só o tempo em que ele rodou.",
      ok: "Serverless: sem máquina ligada esperando. Um evento acorda a função, e o Azure cobra só o tempo de execução." },
  };
  const NOMES_MODELO = { iaas: "IaaS", paas: "PaaS", saas: "SaaS", serverless: "Serverless" };

  // aula 4: as regiões do formulário, com o nome que o portal do Azure mostra
  const REGIOES = [
    { id: "brazilsouth", nome: "(América do Sul) Brazil South", onde: "Sul do Brasil · Estado de São Paulo" },
    { id: "brazilsoutheast", nome: "(América do Sul) Brazil Southeast", onde: "Sudeste do Brasil · Rio" },
    { id: "southcentralus", nome: "(EUA) South Central US", onde: "Centro-Sul dos EUA · Texas" },
    { id: "eastus", nome: "(EUA) East US", onde: "Leste dos EUA · Virgínia" },
    { id: "westeurope", nome: "(Europa) West Europe", onde: "Oeste da Europa · Países Baixos" },
  ];
  const regiao = (id) => REGIOES.find((r) => r.id === id) || REGIOES[0];
  const NOME_GRUPO = /^[\w.\-()]{1,90}$/;

  // ---------- estado ----------
  function estadoInicial() {
    return { feitos: {}, grupos: [] };
  }

  function carregar() {
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE));
      if (salvo && salvo.feitos) return Object.assign({ grupos: [] }, salvo);
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
      : m.fim);
    desenharMissoes();
  }

  function desenharMissoes() {
    const lista = document.getElementById("sim-lista-missoes");
    lista.innerHTML = MISSOES.map((m) => {
      const feitos = m.passos.filter((p) => estado.feitos[p.id]).length;
      const pronta = feitos === m.passos.length;
      const passos = `<ol class="sim-passos">${m.passos.map((p) => `<li class="${estado.feitos[p.id] ? "feito" : ""}"><span aria-hidden="true">${estado.feitos[p.id] ? "✅" : "⬜"}</span> ${esc(p.texto)}<span class="visualmente-oculto">${estado.feitos[p.id] ? " (feito)" : " (a fazer)"}</span></li>`).join("")}</ol>`;
      // missão cumprida fica recolhida: a lista cresce a cada aula
      if (pronta) return `<li class="feita"><details><summary><strong>✔ ${esc(m.titulo)}</strong></summary><span>${esc(m.pedido)}</span>${passos}</details></li>`;
      return `<li><strong>○ ${esc(m.titulo)}</strong><span>${esc(m.pedido)}</span>${passos}
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
      <p class="sim-nota">No Azure, a <strong>integridade do serviço</strong> diz se o problema é da Microsoft ou seu. Ela volta na aula 12. Para abrir um chamado, existe "Criar uma solicitação de suporte".</p>
      <details class="sim-sla" data-sla><summary>📜 Contratos de nível de serviço (SLA)</summary>
        <p>O <strong>SLA</strong> é a promessa escrita de quanto tempo cada serviço fica no ar, em porcentagem do mês, como 99,9%. Cada serviço tem o seu. Se a Microsoft não cumprir, o cliente recebe crédito na fatura.</p>
        <p class="sim-nota">No simulador, o SLA é só de mentirinha. No Azure de verdade, a Microsoft publica os SLAs de todos os serviços.</p>
      </details>`,
  };

  // o Cloud Shell simulado: Bash com a CLI do Azure ou PowerShell, só com alguns comandos
  PAINEIS.shell = `<h3>Cloud Shell <small>(simulado)</small></h3>
      <div class="sim-shell-abas" role="group" aria-label="Escolha o shell">
        <button type="button" data-shell="bash" aria-pressed="true">Bash</button>
        <button type="button" data-shell="ps" aria-pressed="false">PowerShell</button>
      </div>
      <pre class="sim-shell-saida" aria-live="polite"></pre>
      <form class="sim-shell-linha" data-shell-form><label><span class="sim-shell-prompt">equipe@Azure:~$</span>
        <span class="visualmente-oculto">Comando</span><input name="cmd" autocomplete="off" spellcheck="false"></label></form>
      <p class="sim-nota">Digite <strong>ajuda</strong> para ver os comandos que este terminal entende.</p>`;
  const SHELL = {
    bash: {
      prompt: "equipe@Azure:~$",
      boas: "Bem-vindo ao Cloud Shell (simulado). Shell: Bash, com a CLI do Azure (az).",
      cmds: {
        "az account show": `{
  "environmentName": "AzureCloud",
  "isDefault": true,
  "name": "Assinatura de estudo",
  "state": "Enabled",
  "tenantDisplayName": "Cerrado Delivery",
  "user": { "name": "equipe@cerradodelivery", "type": "user" }
}`,
        "az version": `{ "azure-cli": "simulado" }`,
      },
      dica: "Tente: az account show",
    },
    ps: {
      prompt: "PS /home/equipe>",
      boas: "Bem-vindo ao Cloud Shell (simulado). Shell: PowerShell, com o módulo Az.",
      cmds: {
        "get-azsubscription": `Name                  State
----                  -----
Assinatura de estudo  Enabled`,
        "get-azcontext": `Name                  Account                  Tenant
----                  -------                  ------
Assinatura de estudo  equipe@cerradodelivery   Cerrado Delivery`,
      },
      dica: "Tente: Get-AzSubscription",
    },
  };
  let shellAtual = "bash";

  function prepararShell(caixa) {
    const saida = caixa.querySelector(".sim-shell-saida");
    const prompt = caixa.querySelector(".sim-shell-prompt");
    const entrada = caixa.querySelector('input[name="cmd"]');
    function escreve(t) { saida.textContent += t + "\n"; saida.scrollTop = saida.scrollHeight; }
    function troca(qual) {
      shellAtual = qual;
      caixa.querySelectorAll("[data-shell]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.shell === qual)));
      prompt.textContent = SHELL[qual].prompt;
      saida.textContent = "";
      escreve(SHELL[qual].boas);
      escreve(SHELL[qual].dica);
    }
    caixa.querySelectorAll("[data-shell]").forEach((b) => b.addEventListener("click", () => troca(b.dataset.shell)));
    caixa.querySelector("[data-shell-form]").addEventListener("submit", (evento) => {
      evento.preventDefault();
      const texto = entrada.value.trim();
      entrada.value = "";
      if (!texto) return;
      const sh = SHELL[shellAtual];
      escreve(`${sh.prompt} ${texto}`);
      const chave = shellAtual === "ps" ? texto.toLowerCase() : texto.replace(/\s+/g, " ");
      if (["ajuda", "help"].includes(texto.toLowerCase())) return escreve("Comandos deste simulador: " + Object.keys(sh.cmds).join(", ") + ", clear.");
      if (["clear", "cls"].includes(texto.toLowerCase())) { saida.textContent = ""; return; }
      if (sh.cmds[chave]) { escreve(sh.cmds[chave]); return marcar("comando"); }
      escreve(`Este simulador não conhece "${texto}". ${sh.dica}`);
    });
    troca(shellAtual);
    entrada.focus();
  }

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
    if (qual === "shell") prepararShell(caixa);
    const sla = caixa.querySelector("[data-sla]");
    if (sla) sla.addEventListener("toggle", () => { if (sla.open) marcar("sla"); });
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
        ${tabelaGrupos() || '<p class="sim-vazio">Nenhum recurso ainda.</p>'}`;
    },

    grupos() {
      return `${cabecalho("Grupos de recursos", [["inicio", "Página inicial"]])}
        <div class="sim-barra-acoes"><button type="button" class="sim-botao primario" data-ir="criar-grupo">＋ Criar</button></div>
        ${tabelaGrupos() || '<p class="sim-vazio">Nenhum grupo de recursos para exibir.</p>'}`;
    },

    "criar-grupo"() {
      return `${cabecalho("Criar um grupo de recursos", [["inicio", "Página inicial"], ["grupos", "Grupos de recursos"]])}
        <form class="sim-form" data-form="grupo" novalidate>
          <fieldset><legend>Detalhes do projeto</legend>
            <label>Assinatura <select disabled><option>Assinatura de estudo</option></select></label>
            <label><span>Grupo de recursos <span class="sim-obrig">*</span></span><input name="nome" autocomplete="off" required></label>
          </fieldset>
          <fieldset><legend>Detalhes do recurso</legend>
            <label><span>Região <span class="sim-obrig">*</span></span><select name="regiao">${REGIOES.map((r) => `<option value="${r.id}"${r.id === "eastus" ? " selected" : ""}>${esc(r.nome)}</option>`).join("")}</select></label>
            <p class="sim-nota">A região do grupo guarda as informações sobre os recursos dele. Os recursos de dentro podem ficar em outras regiões.</p>
          </fieldset>
          <p class="sim-erro" data-erro hidden></p>
          <div class="sim-barra-acoes"><button type="submit" class="sim-botao primario">Revisar + criar</button><button type="button" class="sim-botao" data-ir="grupos">Cancelar</button></div>
        </form>`;
    },

    criar() {
      return `${cabecalho("Criar um recurso", [["inicio", "Página inicial"]])}
        <p class="sim-nota">As categorias do portal. Cada uma entra numa aula.</p>
        <div class="sim-servicos sim-categorias">
          <button type="button" data-ir="criar-grupo"><span aria-hidden="true">🗂</span><span>Grupo de recursos<small>aula 4</small></span></button>
          <button type="button" data-acao="breve" data-aula="5"><span aria-hidden="true">🖥</span><span>Computação<small>máquinas virtuais, contêineres e funções · aula 5</small></span></button>
          <button type="button" data-acao="breve" data-aula="6"><span aria-hidden="true">🛡</span><span>Rede<small>redes virtuais e VPN · aula 6</small></span></button>
          <button type="button" data-acao="breve" data-aula="7"><span aria-hidden="true">🗄</span><span>Armazenamento<small>contas de armazenamento · aula 7</small></span></button>
          <button type="button" data-acao="breve" data-aula="8"><span aria-hidden="true">🪪</span><span>Identidade<small>usuários e acessos · aula 8</small></span></button>
        </div>
        <h3 class="sim-sub">Em destaque</h3>
        <div class="sim-servicos">${Object.entries(DESTAQUES).map(([id, d]) => `<button type="button" data-servico="${id}"><span aria-hidden="true">${d.icone}</span><span>${esc(d.nome)}<small>no Azure: ${esc(d.azure)}</small></span></button>`).join("")}</div>`;
    },

    todos() {
      if (estado.grupos.some((g) => g.nome === "rg-cerrado-pedidos")) setTimeout(() => marcar("grupo-todos"), 0);
      return `${cabecalho("Todos os recursos", [["inicio", "Página inicial"]])}
        ${tabelaGrupos() || '<p class="sim-vazio">Nenhum recurso para exibir. Tudo o que o Cerrado Delivery criar vai aparecer aqui, de todos os tipos.</p>'}`;
    },
  };

  function tabelaGrupos() {
    if (!estado.grupos.length) return "";
    const linhas = estado.grupos.map((g) => `<tr><td><button type="button" class="sim-link" data-grupo="${esc(g.nome)}">${esc(g.nome)}</button></td><td>Grupo de recursos</td><td>Assinatura de estudo</td><td>${esc(regiao(g.regiao).nome)}</td></tr>`).join("");
    return `<div class="sim-tabela"><table><thead><tr><th>Nome</th><th>Tipo</th><th>Assinatura</th><th>Localização</th></tr></thead><tbody>${linhas}</tbody></table></div>`;
  }

  // a página do grupo: o caminho da hierarquia, como as migalhas do portal
  function telaGrupo(nome) {
    const g = estado.grupos.find((x) => x.nome === nome);
    if (!g) return TELAS.grupos();
    if (g.nome === "rg-cerrado-pedidos") setTimeout(() => marcar("grupo-hierarquia"), 0);
    const r = regiao(g.regiao);
    return `${cabecalho(g.nome, [["inicio", "Página inicial"], ["grupos", "Grupos de recursos"]])}
      <p class="sim-hierarquia" aria-label="Hierarquia"><span>🏢 Grupo de gerenciamento raiz</span> › <span>💳 Assinatura de estudo</span> › <strong>🛍️ ${esc(g.nome)}</strong> › <span>🍱 recursos</span></p>
      <div class="sim-barra-acoes"><button type="button" class="sim-botao perigo" data-excluir-grupo="${esc(g.nome)}">🗑 Excluir grupo de recursos</button></div>
      <dl class="sim-detalhes">
        <dt>Assinatura</dt><dd>Assinatura de estudo</dd>
        <dt>Grupo de gerenciamento</dt><dd>Grupo de gerenciamento raiz (do diretório Cerrado Delivery)</dd>
        <dt>Localização</dt><dd>${esc(r.nome)}: ${esc(r.onde)}</dd>
        <dt>Recursos</dt><dd>nenhum, por enquanto (a máquina virtual entra na aula 5)</dd>
      </dl>
      <p class="sim-nota">Excluir o grupo exclui tudo o que está dentro dele. No Azure de verdade, não tem volta.</p>`;
  }

  function criarGrupo(form) {
    const nome = String(form.nome.value || "").trim();
    const reg = form.regiao.value;
    const erro = form.querySelector("[data-erro]");
    let msg = "";
    if (!nome) msg = "O nome do grupo de recursos é obrigatório.";
    else if (!NOME_GRUPO.test(nome) || nome.endsWith(".")) msg = "O nome só aceita letras, números, sublinhado, hífen, ponto e parênteses, sem terminar em ponto.";
    else if (estado.grupos.some((g) => g.nome.toLowerCase() === nome.toLowerCase())) msg = `Já existe um grupo de recursos chamado ${nome}.`;
    if (msg) { erro.textContent = msg; erro.hidden = false; return; }
    estado.grupos.push({ nome: nome, regiao: reg });
    salvar();
    avisar(`Grupo de recursos ${nome} criado.`);
    if (!estado.feitos["grupo-criado"]) {
      const motivos = [];
      if (nome !== "rg-cerrado-pedidos") motivos.push("O nome combinado é rg-cerrado-pedidos.");
      if (!reg.startsWith("brazil")) motivos.push("O contrato pede os dados no Brasil: escolha uma região brasileira.");
      else if (reg === "brazilsoutheast") motivos.push("O Sudeste do Brasil (Rio) não tem zonas de disponibilidade. O pedido é a região do Brasil com zonas: o Sul do Brasil.");
      if (motivos.length) dica(`<strong>Ainda não cumpre a missão.</strong><ul>${motivos.map((m) => `<li>${esc(m)}</li>`).join("")}</ul> Para tentar de novo, abra o grupo, exclua e crie outro.`);
      else marcar("grupo-criado");
    }
    ir("grupos");
  }

  function telaDestaque(id) {
    const d = DESTAQUES[id];
    const feito = estado.feitos["m-" + id];
    return `${cabecalho(d.nome, [["inicio", "Página inicial"], ["criar", "Criar um recurso"]])}
      <p class="sim-equivale">No Azure: <strong>${esc(d.azure)}</strong></p>
      <p>${esc(d.texto)}</p>
      <h3 class="sim-sub">Qual é o modelo deste serviço?</h3>
      <div class="sim-modelos" role="group" aria-label="Escolha o modelo">${Object.entries(NOMES_MODELO).map(([m, n]) => `<button type="button" class="sim-botao" data-modelo-resp="${m}" data-servico="${id}"${feito && m === d.certo ? ' aria-pressed="true"' : ""}>${n}</button>`).join("")}</div>
      <p class="sim-nota">Monte o serviço de verdade nas próximas aulas. Aqui, é só reconhecer o modelo.</p>`;
  }

  function responderModelo(id, modelo) {
    const d = DESTAQUES[id];
    tela.querySelectorAll("[data-modelo-resp]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.modeloResp === modelo)));
    if (modelo === d.certo) {
      marcar("m-" + id);
      avisar(`✔ ${d.nome}: ${NOMES_MODELO[modelo]}.`);
      const faltam = Object.keys(DESTAQUES).filter((k) => !estado.feitos["m-" + k]).length;
      if (faltam) dica(`<strong>✔ ${esc(d.ok)}</strong> ${faltam === 1 ? "Falta 1." : `Faltam ${faltam}.`}`);
    } else {
      dica(`<strong>Ainda não.</strong> ${modelo === "saas" ? "SaaS é programa pronto para usar, como o e-mail. Aqui o código é seu." : "Releia o que o serviço entrega pronto: quem cuida do sistema operacional? E ele fica ligado o tempo todo?"}`);
    }
  }

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
    const alvo = evento.target.closest("[data-ir], [data-acao], [data-painel-topo], [data-servico], [data-grupo], [data-excluir-grupo]");
    if (!alvo || !alvo.closest(".sim-portal")) return;
    if (alvo.dataset.grupo) { tela.innerHTML = telaGrupo(alvo.dataset.grupo); tela.focus({ preventScroll: true }); return; }
    if (alvo.dataset.excluirGrupo) {
      const nome = alvo.dataset.excluirGrupo;
      if (!window.confirm(`Excluir ${nome} e tudo o que está dentro dele? No Azure de verdade, não tem volta.`)) return;
      estado.grupos = estado.grupos.filter((g) => g.nome !== nome);
      salvar();
      avisar(`${nome} excluído.`);
      return ir("grupos");
    }
    if (alvo.dataset.modeloResp) return responderModelo(alvo.dataset.servico, alvo.dataset.modeloResp);
    if (alvo.dataset.servico) {
      tela.innerHTML = telaDestaque(alvo.dataset.servico);
      tela.focus({ preventScroll: true });
      return;
    }
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

  tela.addEventListener("submit", (evento) => {
    if (evento.target.dataset.form !== "grupo") return;
    evento.preventDefault();
    criarGrupo(evento.target);
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
      ${(() => { const r = estado.grupos.filter((g) => g.nome.toLowerCase().includes(termo)); return r.length ? `<ul>${r.map((g) => `<li><button type="button" class="sim-link" data-grupo="${esc(g.nome)}">${esc(g.nome)}</button></li>`).join("")}</ul>` : '<p class="sim-vazio">Nenhum recurso encontrado.</p>'; })()}`;
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
