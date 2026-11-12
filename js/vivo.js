/*
  vivo.js: as peças interativas das aulas "vivas" do Preparatório AZ-900. Só deste site.
  versão 2 · 2026-11-12 · aulas 1 (o que é nuvem e quem cuida do quê) e 2 (benefícios da nuvem)
  Nasceu do vivo.js do Preparatório AWS (versão 13): o plantão, a central e a placa são os mesmos,
  com os textos do Azure. Cada aula nova ganha as suas configurações aqui.

  1. [data-plantao] gancho com palpites (as respostas ficam nos botões, em data-explica)
  2. [data-central] cada tarefa na sua coluna; data-central escolhe o conjunto (aula 1: "shopping", quem cuida do quê)
  3. [data-camadas] a responsabilidade compartilhada em camadas: local, IaaS, PaaS e SaaS (aula 1)
  4. [data-placa]   desmonte: as peças de uma placa e o nome de cada uma no Azure (aula 1)
  5. [data-domingo] o domingo da pizza: fornos, forno gigante, segunda cozinha, alarme e porteiro, das 18h às 23h (aula 2)
  6. [data-noves]   a régua dos noves: quantos minutos por mês cabem fora do ar em cada SLA (aula 2)

  Com as animações pausadas (botão do topo ou "reduzir movimento"), tudo mostra o resultado direto.
*/
(function () {
  "use strict";

  const raiz = document.documentElement;
  const pausado = () => raiz.classList.contains("pausado");
  const num = n => Math.round(n).toLocaleString("pt-BR");

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

  // ===================== 5. o domingo da pizza =====================
  // dez meias horas, das 18h às 22h30. Cada forno normal assa 20 pedidos por meia hora.
  const HORAS = ["18h", "18h30", "19h", "19h30", "20h", "20h30", "21h", "21h30", "22h", "22h30"];
  const PEDIDOS = [20, 35, 60, 90, 120, 100, 70, 50, 30, 15];
  const QUEDA = 5;      // às 20h30 cai a luz da cozinha principal
  const ROBOS = 8;      // às 22h chegam 100 pedidos falsos de uma vez
  document.querySelectorAll("[data-domingo]").forEach(function (box) {
    const pecas = box.querySelectorAll("[data-peca-sim]");
    const grafico = box.querySelector(".dom-grafico");
    const fornos = box.querySelector(".dom-fornos");
    const feed = box.querySelector(".dom-feed");
    const veredito = box.querySelector(".dom-veredito");
    const campos = {};
    box.querySelectorAll("[data-n]").forEach(el => (campos[el.dataset.n] = el));
    let espera = [];

    // as colunas do gráfico: a procura (contorno) e o que saiu do forno (cheio)
    grafico.innerHTML = HORAS.map(h => `<div class="dom-col"><span class="dom-procura"></span><span class="dom-feito"></span><small>${h}</small></div>`).join("");
    const cols = grafico.querySelectorAll(".dom-col");

    pecas.forEach(b => b.addEventListener("click", () => b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"))));
    const ligado = id => box.querySelector(`[data-peca-sim="${id}"]`).getAttribute("aria-pressed") === "true";

    function noite() {
      const op = { mais: ligado("mais"), gigante: ligado("gigante"), cozinha: ligado("cozinha"), alarme: ligado("alarme"), porteiro: ligado("porteiro") };
      const unidade = op.gigante ? 40 : 20;   // o forno gigante assa o dobro…
      const preco = op.gigante ? 2 : 1;       // …e custa o dobro por meia hora
      const passos = [];
      let anterior = PEDIDOS[0];
      HORAS.forEach(function (h, i) {
        const falsos = i === ROBOS && !op.porteiro ? 100 : 0;
        const total = PEDIDOS[i] + falsos;
        // sem o alarme, ninguém vê o movimento: os fornos novos chegam meia hora atrasados
        const visto = op.alarme ? total : anterior;
        const n = op.mais ? Math.max(2, Math.ceil(visto / unidade)) : 2;
        // sem a segunda cozinha, a queda de luz para tudo; sem o alarme, ninguém percebe e dura mais
        const fora = !op.cozinha && (i === QUEDA || i === QUEDA + 1 || (!op.alarme && i === QUEDA + 2));
        const capacidade = fora ? 0 : n * unidade;
        const feitos = Math.min(PEDIDOS[i], Math.round(capacidade * PEDIDOS[i] / total));
        const custo = n * preco + (op.cozinha ? 1 : 0);
        const robos = falsos ? Math.min(capacidade, total) - feitos : 0;
        let fala = "";
        if (i === 0) fala = `🍕 ${h}: abrem os pedidos. ${n} forno${n > 1 ? "s" : ""}${op.gigante ? " gigantes" : ""} ligado${n > 1 ? "s" : ""}.`;
        else if (i === 4) fala = feitos < PEDIDOS[i] ? `🔥 ${h}: pico de ${PEDIDOS[i]} pedidos! ${op.gigante && !op.mais ? "O forno gigante tem teto: " : ""}${PEDIDOS[i] - feitos} ficaram sem pizza.` : `🔥 ${h}: pico de ${PEDIDOS[i]} pedidos, e ${n} fornos dando conta. ${op.mais ? "Escala horizontal: mais fornos." : ""}`;
        else if (i === QUEDA) fala = fora ? `⚡ ${h}: caiu a luz da cozinha principal. Tudo parado!` : `⚡ ${h}: caiu a luz da cozinha principal, e a segunda cozinha assumiu sem ninguém perceber. Alta disponibilidade.`;
        else if (i === QUEDA + 2 && fora) fala = `😴 ${h}: sem o alarme, o gerente só descobriu a queda agora.`;
        else if (i === ROBOS) fala = falsos ? `🤖 ${h}: chegaram 100 pedidos falsos de uma vez.${op.mais ? ` E ${n} fornos foram ligados para assar pizza para robôs!` : ` Eles tomaram o lugar dos pedidos de verdade.`}` : `🤖 ${h}: chegaram 100 pedidos falsos, e o porteiro barrou todos na porta.`;
        else if (i === 9) fala = `🌙 ${h}: últimos pedidos. ${op.mais ? `Sobraram ${n} fornos ligados: a escala também diminui.` : "Os mesmos fornos de sempre, quase parados."}`;
        passos.push({ i, total, feitos, n, custo, robos, fora, fala });
        anterior = total;
      });
      return { op, passos };
    }

    function mostraPasso(p, soma) {
      const c = cols[p.i];
      c.style.setProperty("--p", p.total / 220);
      c.style.setProperty("--f", p.feitos / 220);
      c.classList.toggle("fora", p.fora);
      c.classList.toggle("perdeu", p.feitos < PEDIDOS[p.i]);
      c.classList.toggle("robos", p.i === ROBOS && p.total > PEDIDOS[p.i]);
      fornos.textContent = p.fora ? "⚡ sem luz" : "🔥".repeat(Math.min(p.n, 8)) + (p.n > 8 ? ` +${p.n - 8}` : "");
      if (p.fala) feed.insertAdjacentHTML("beforeend", `<li>${p.fala}</li>`);
      campos.entregues.textContent = num(soma.entregues);
      campos.perdidos.textContent = num(soma.perdidos);
      campos.custo.textContent = num(soma.custo);
      campos.robos.textContent = num(soma.robos);
    }

    function fim(r, soma) {
      const op = r.op;
      let txt;
      if (!soma.perdidos && !soma.robos && op.mais && !op.gigante) txt = "🏆 <strong>Domingo perfeito!</strong> Nenhum pedido perdido, e você pagou só os fornos de cada meia hora. Escala horizontal, alta disponibilidade, gerenciamento e segurança: os quatro benefícios trabalhando juntos.";
      else if (!soma.perdidos && !soma.robos) txt = `✅ <strong>Ninguém ficou sem pizza</strong>, mas a conta deu ${soma.custo} fornos pagos. Dá para gastar menos: ${op.gigante ? "o forno gigante custa o dobro a noite inteira, até as 22h30, com quase nenhum pedido." : "tente de novo."}`;
      else {
        const dicas = [];
        if (!op.mais) dicas.push(op.gigante ? "o forno gigante tem teto: no pico, ainda faltou forno" : "dois fornos não dão conta do pico");
        if (!op.cozinha) dicas.push("a queda de luz parou a cozinha");
        if (!op.porteiro) dicas.push("os pedidos falsos atrapalharam");
        if (!op.alarme && op.mais) dicas.push("sem o alarme, os fornos novos chegaram atrasados");
        const cabeca = soma.perdidos ? `${num(soma.perdidos)} pedidos perdidos` : "Ninguém ficou sem pizza";
        const robos = soma.robos ? `${soma.perdidos ? " e" : ", mas"} ${num(soma.robos)} pizzas foram para robôs` : "";
        txt = `<strong>${cabeca}${robos}.</strong> O que deu errado: ${dicas.join("; ")}. Ligue outras peças e abra os pedidos de novo.`;
      }
      veredito.innerHTML = txt;
    }

    box.querySelector(".vai").addEventListener("click", function () {
      espera.forEach(clearTimeout);
      espera = [];
      feed.innerHTML = "";
      veredito.innerHTML = "";
      const r = noite();
      const soma = { entregues: 0, perdidos: 0, custo: 0, robos: 0 };
      r.passos.forEach(function (p, k) {
        const anda = function () {
          soma.entregues += p.feitos;
          soma.perdidos += PEDIDOS[p.i] - p.feitos;
          soma.custo += p.custo;
          soma.robos += p.robos;
          mostraPasso(p, soma);
          if (k === r.passos.length - 1) fim(r, soma);
        };
        if (pausado()) anda(); else espera.push(setTimeout(anda, 200 + k * 650));
      });
    });

    box.querySelector(".de-novo").addEventListener("click", function () {
      espera.forEach(clearTimeout);
      espera = [];
      pecas.forEach(b => b.setAttribute("aria-pressed", "false"));
      cols.forEach(c => { c.style.removeProperty("--p"); c.style.removeProperty("--f"); c.className = "dom-col"; });
      feed.innerHTML = "";
      veredito.innerHTML = "";
      fornos.textContent = "🔥🔥";
      Object.values(campos).forEach(el => (el.textContent = "—"));
    });
  });

  // ===================== 6. a régua dos noves =====================
  document.querySelectorAll("[data-noves]").forEach(function (box) {
    const botoes = box.querySelectorAll("[data-sla]");
    const minMes = box.querySelector("[data-min-mes]");
    const minAno = box.querySelector("[data-min-ano]");
    const pizzas = box.querySelector(".noves-pizzas");
    const fala = box.querySelector(".casa-fala");
    function escolhe(b) {
      botoes.forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      const sla = parseFloat(b.dataset.sla);
      const fora = 1 - sla / 100;
      const mes = 30 * 24 * 60 * fora;     // um mês de 30 dias
      const ano = 365 * 24 * 60 * fora;
      const formata = m => m >= 120 ? `${(m / 60).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} horas` : `${m.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} minutos`;
      minMes.textContent = formata(mes);
      minAno.textContent = formata(ano);
      // uma pizza leva uns 10 minutos no forno: quantas deixariam de sair por mês
      const n = Math.round(mes / 10);
      pizzas.innerHTML = n ? "🍕".repeat(Math.min(n, 44)) + (n > 44 ? ` <small>+${n - 44}</small>` : "") : "<small>menos de uma pizza</small>";
      fala.innerHTML = `Com <strong>${b.textContent}</strong>, o serviço pode ficar fora uns <strong>${formata(mes)} por mês</strong>: ${n ? `umas ${n} pizzas que não saem do forno` : "menos tempo do que assar uma pizza"}. Cada nove a mais divide esse tempo por dez.`;
    }
    botoes.forEach(b => b.addEventListener("click", () => escolhe(b)));
    escolhe(botoes[1]);
  });
})();
