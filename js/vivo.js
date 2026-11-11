/*
  vivo.js: as peças interativas das aulas "vivas" do Preparatório AZ-900. Só deste site.
  versão 1 · 2026-11-11 · aula 1 (o que é nuvem e quem cuida do quê)
  Nasceu do vivo.js do Preparatório AWS (versão 13): o plantão, a central e a placa são os mesmos,
  com os textos do Azure. Cada aula nova ganha as suas configurações aqui.

  1. [data-plantao] gancho com palpites (as respostas ficam nos botões, em data-explica)
  2. [data-central] cada tarefa na sua coluna; data-central escolhe o conjunto (aula 1: "shopping", quem cuida do quê)
  3. [data-camadas] a responsabilidade compartilhada em camadas: local, IaaS, PaaS e SaaS (aula 1)
  4. [data-placa]   desmonte: as peças de uma placa e o nome de cada uma no Azure (aula 1)

  Com as animações pausadas (botão do topo ou "reduzir movimento"), tudo mostra o resultado direto.
*/
(function () {
  "use strict";

  const raiz = document.documentElement;
  const pausado = () => raiz.classList.contains("pausado");

  // ===================== 1. o plantão (gancho com palpites) =====================
  document.querySelectorAll("[data-plantao]").forEach(function (box) {
    const abrir = box.querySelector("[data-abrir]");
    const palpites = box.querySelectorAll("[data-explica]");
    const resposta = box.querySelector(".gancho-resposta");
    abrir.addEventListener("click", function () {
      box.classList.add("aberta");
      abrir.hidden = true;
      box.querySelectorAll("[data-revela]").forEach(el => (el.hidden = false));
      box.querySelector(".gancho-pergunta").focus();
    });
    palpites.forEach(function (b) {
      b.addEventListener("click", function () {
        palpites.forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        resposta.innerHTML = b.dataset.explica + (box.dataset.link ? ` <a href="${box.dataset.link}">${box.dataset.linkTexto}</a>.` : "");
      });
    });
  });

  // ===================== 2. a central: cada tarefa na sua coluna =====================
  // para cada tarefa, o resultado de cada escolha: [tipo, texto]; tipo: certo, meh (às vezes) ou falha.
  // "outro" vale para as escolhas sem texto próprio. Cada conjunto tem as frases do fim.
  const CENTRAIS = {
    shopping: {
      vigia: { certo: "microsoft",
        microsoft: "O shopping põe o vigia na porta. No Azure, a Microsoft cuida da segurança física do datacenter: portaria, câmeras, crachá.",
        outro: ["falha", "💥 A loja não tem como vigiar a porta do prédio. A segurança física do datacenter é da Microsoft, sempre."] },
      luz: { certo: "microsoft",
        microsoft: "Luz, gerador e ar-condicionado são do shopping. No Azure, energia e refrigeração do datacenter são da Microsoft.",
        outro: ["falha", "💥 Você nem entra no datacenter: energia e refrigeração são da Microsoft, em qualquer serviço."] },
      corredor: { certo: "microsoft",
        microsoft: "Corredores, cabos e elevadores são do shopping. No Azure, os servidores físicos e a rede física são da Microsoft.",
        outro: ["falha", "💥 Os servidores e os cabos de verdade ficam no prédio da Microsoft. São dela."] },
      chave: { certo: "voce",
        voce: "Quem recebe a chave da loja é decisão sua. Na nuvem, as contas, as senhas e o MFA são sempre seus.",
        microsoft: ["falha", "💥 O shopping não decide quem tem a chave da sua loja. Contas e acessos são sempre do cliente."],
        outro: ["falha", "💥 Não depende: em qualquer serviço, contas e acessos são do cliente."] },
      caderno: { certo: "voce",
        voce: "O caderno de clientes e as receitas são da loja. Na nuvem, os dados são sempre do cliente, em qualquer serviço.",
        microsoft: ["falha", "💥 O shopping não lê o seu caderno. Os dados são sempre do cliente: ele decide quem vê e como proteger."],
        outro: ["falha", "💥 Não depende: os dados são sempre do cliente."] },
      celular: { certo: "voce",
        voce: "O celular do caixa é da loja: senha de bloqueio, atualização, não deixar largado. Os aparelhos que acessam a nuvem são do cliente.",
        microsoft: ["falha", "💥 O shopping não cuida do celular da sua loja. Notebooks e celulares que acessam a nuvem são do cliente."],
        depende: ["meh", "Quase: num SaaS, a Microsoft ajuda em parte. Mas proteger os aparelhos da equipe é trabalho do cliente."] },
      fogao: { certo: "depende",
        depende: "Isso! Fogão próprio (máquina virtual, IaaS): a manutenção é sua. Fogão da praça de alimentação (serviço pronto, PaaS ou SaaS): é do shopping.",
        outro: ["meh", "Às vezes sim. Depende do serviço: numa máquina virtual (IaaS), o sistema operacional é seu; num serviço pronto (PaaS ou SaaS), é da Microsoft."] },
      caixa: { certo: "depende",
        depende: "Isso! O sistema do caixa feito pela loja é dela. O sistema pronto, alugado do shopping, ele mantém. Com os aplicativos é igual: depende do serviço.",
        outro: ["meh", "Às vezes sim. Depende: o aplicativo que você instalou é seu; o aplicativo pronto (SaaS) é da Microsoft."] },
      _faltou: "Faltou escolher quem cuida de",
      _unidade: ["tarefa", "tarefas"],
      _certas: "com quem cuida",
      _tudo: "🏆 <strong>Mudança para o shopping sem susto!</strong> O prédio é da Microsoft, a loja é sua, e o meio do caminho depende do serviço. É a responsabilidade compartilhada.",
      _quase: "As amarelas valem às vezes, dependendo do serviço; as vermelhas nunca. Troque e confira de novo."
    }
  };
  document.querySelectorAll("[data-central]").forEach(function (box) {
    const conjunto = CENTRAIS[box.dataset.central];
    const linhas = box.querySelectorAll("[data-tarefa]");
    const placar = box.querySelector("[data-placar]");
    const fala = box.querySelector(".casa-fala");
    const vai = box.querySelector(".vai");
    let espera = [];
    linhas.forEach(function (l) {
      l.querySelectorAll("[data-motor]").forEach(function (b) {
        b.addEventListener("click", function () {
          l.querySelectorAll("[data-motor]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
          l.className = "central-linha";
          l.querySelector(".central-saida").textContent = "";
        });
      });
    });
    vai.addEventListener("click", function () {
      espera.forEach(clearTimeout);
      espera = [];
      let certos = 0, faltam = 0;
      linhas.forEach(function (l, i) {
        const r = conjunto[l.dataset.tarefa];
        const sel = l.querySelector('[data-motor][aria-pressed="true"]');
        const saida = l.querySelector(".central-saida");
        l.className = "central-linha";
        if (!sel) { faltam++; saida.textContent = "Escolha uma coluna."; return; }
        const m = sel.dataset.motor;
        const res = r[m] || r.outro;
        const tipo = m === r.certo ? "certo" : res[0];
        const texto = m === r.certo ? "✅ " + r[m] : res[1];
        if (tipo === "certo") certos++;
        const mostra = function () {
          l.classList.add("rodando", tipo);
          saida.textContent = texto;
        };
        if (pausado()) mostra(); else espera.push(setTimeout(mostra, 150 + i * 450));
      });
      const fim = function () {
        const n = linhas.length;
        placar.textContent = certos + " de " + n;
        fala.innerHTML = faltam ? `${conjunto._faltou} ${faltam} ${conjunto._unidade[faltam > 1 ? 1 : 0]}.` :
          certos === n ? conjunto._tudo :
          `<strong>${certos} de ${n} ${conjunto._certas}.</strong> ${conjunto._quase}`;
      };
      if (pausado()) fim(); else espera.push(setTimeout(fim, 150 + linhas.length * 450));
    });
  });

  // ===================== 3. a responsabilidade compartilhada, em camadas =====================
  // em cada camada, quem cuida em cada modelo (local, IaaS, PaaS, SaaS): v = você, c = compartilhado, m = Microsoft
  const MODELOS = [
    { nome: "local", fala: "🏢 <strong>No seu datacenter (local), tudo é com você:</strong> do prédio aos dados. Como a cozinha do Cerrado Delivery hoje, com o servidor no escritório." },
    { nome: "IaaS", fala: "🖥️ <strong>IaaS, como uma máquina virtual do Azure:</strong> o prédio, a rede e os servidores físicos passam para a Microsoft. Do sistema operacional para cima, ainda é com você." },
    { nome: "PaaS", fala: "🧰 <strong>PaaS, como o Azure App Service:</strong> a Microsoft cuida também do sistema operacional. O aplicativo e os controles de rede ficam divididos." },
    { nome: "SaaS", fala: "📧 <strong>SaaS, como o Outlook do Microsoft 365:</strong> a Microsoft cuida de quase tudo. Mas os dados, as contas e quem tem acesso continuam seus, <strong>em qualquer modelo</strong>." }
  ];
  const ROTULO = { v: "você", c: "os dois", m: "Microsoft" };
  document.querySelectorAll("[data-camadas]").forEach(function (box) {
    const botoes = box.querySelectorAll("[data-modelo]");
    const camadas = box.querySelectorAll("[data-quem]");
    const fala = box.querySelector(".casa-fala");
    function escolhe(m) {
      botoes.forEach((b, k) => b.setAttribute("aria-pressed", String(k === m)));
      camadas.forEach(function (c, k) {
        const q = c.dataset.quem[m];
        c.classList.remove("voce", "junto", "ms");
        c.classList.add(q === "v" ? "voce" : q === "c" ? "junto" : "ms");
        c.querySelector(".quem").textContent = ROTULO[q];
        c.style.setProperty("--atraso", (pausado() ? 0 : k * 60) + "ms");
      });
      fala.innerHTML = MODELOS[m].fala;
    }
    botoes.forEach((b, k) => b.addEventListener("click", () => escolhe(k)));
    escolhe(0);
  });

  // ===================== 4. desmonte a nuvem: a placa =====================
  const PECAS = {};
  PECAS.placa = {
    cpu: { nome: "Processador", azure: "vCPU", texto: "Numa máquina virtual do Azure, você escolhe o tamanho, e o tamanho diz quantas vCPUs ela tem. Mais vCPUs, mais contas por segundo, e mais cara a hora." },
    ram: { nome: "Memória RAM", azure: "Memória (GiB)", texto: "Vem junto com o tamanho da máquina virtual. Precisa de mais? Troque o tamanho, sem abrir gabinete nenhum." },
    disco: { nome: "Disco (SSD)", azure: "Disco gerenciado", texto: "O disco da máquina virtual. Ele continua existindo, e cobrando, mesmo com a máquina parada, até você excluir." },
    rede: { nome: "Placa de rede", azure: "Rede virtual (VNet)", texto: "Liga a máquina às outras e à internet. No Azure, as máquinas ficam numa rede virtual, que é sua para configurar." },
    energia: { nome: "Fonte e cooler", azure: "Com a Microsoft", texto: "Energia, refrigeração, prédio e segurança física: você nunca vê, e já estão no preço da hora. É a parte da Microsoft na responsabilidade compartilhada." },
    _fim: "<strong>🔧 Placa desmontada!</strong> Agora você sabe o que está alugando quando liga uma máquina na nuvem.",
    _unidade: "peças"
  };
  document.querySelectorAll("[data-placa]").forEach(function (placa) {
    const conjunto = PECAS[placa.dataset.placa || "placa"];
    const ficha = placa.querySelector(".placa-ficha");
    const vistas = new Set();
    placa.querySelectorAll("[data-peca]").forEach(function (b) {
      b.addEventListener("click", function () {
        const p = conjunto[b.dataset.peca];
        vistas.add(b.dataset.peca);
        placa.querySelectorAll("[data-peca]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
        const total = Object.keys(conjunto).filter(k => k[0] !== "_").length;
        const fim = vistas.size === total
          ? "<p>" + conjunto._fim + "</p>"
          : `<p class="placa-contagem">${vistas.size} de ${total} ${conjunto._unidade}</p>`;
        ficha.innerHTML = `<span class="olho">${p.nome}</span><h4>No Azure:</h4><span class="na-aws">${p.azure}</span><p>${p.texto}</p>${fim}`;
        ficha.classList.remove("troca");
        void ficha.offsetWidth;
        ficha.classList.add("troca");
      });
    });
  });
})();
