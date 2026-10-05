/*
  treinos.js: "Qual é o serviço?" e o mini-simulado do preparatório AZ-900.
  Para mudar as perguntas, edite as listas SERVICOS e SIMULADO. Nada é salvo: é só treino.
*/
(function () {

  // ---------- dados (edite aqui) ----------

  // necessidade -> serviço do Azure que resolve
  const SERVICOS = [
    ["Hospedar um site sem cuidar de servidor.", "Serviço de Aplicativo do Azure"],
    ["Rodar um código só quando um evento acontece, pagando pelo tempo de execução.", "Azure Functions"],
    ["Ligar a sede ao Azure por uma conexão privada, que não passa pela internet.", "ExpressRoute"],
    ["Ligar a sede à rede virtual por um túnel criptografado pela internet.", "Gateway de VPN"],
    ["Fazer login uma vez e entrar em vários aplicativos da empresa.", "Microsoft Entra ID"],
    ["Impedir que alguém crie recursos fora da região Brasil Sul.", "Azure Policy"],
    ["Impedir que um recurso importante seja apagado por engano.", "Bloqueio de recurso"],
    ["Receber recomendações para economizar e melhorar a segurança.", "Azure Advisor"],
    ["Saber se uma falha é do próprio Azure, na sua região.", "Integridade do Serviço do Azure"],
    ["Levar dezenas de terabytes para o Azure sem depender da internet.", "Azure Data Box"],
    ["Estimar quanto um sistema vai custar antes de criar qualquer coisa.", "Calculadora de preços"],
    ["Gerenciar pelo Azure servidores que estão na empresa ou em outra nuvem.", "Azure Arc"],
    ["Ver métricas, logs e alertas dos seus próprios recursos.", "Azure Monitor"],
    ["Avaliar e planejar a migração dos servidores da empresa para o Azure.", "Migrações para Azure"]
  ];

  // pergunta, alternativas, índice da certa, explicação
  const SIMULADO = [
    ["Num serviço SaaS, o que continua sendo sempre responsabilidade do cliente?",
      ["Os datacenters", "O sistema operacional dos servidores", "Os dados, as contas e os dispositivos de acesso", "A rede física"], 2,
      "Em qualquer modelo (IaaS, PaaS ou SaaS), dados, contas e dispositivos de acesso ficam com o cliente."],
    ["Uma máquina virtual do Azure é um exemplo de qual tipo de serviço?",
      ["IaaS", "PaaS", "SaaS", "Serverless"], 0,
      "Na máquina virtual, o provedor entrega a infraestrutura e você cuida do sistema operacional para cima: é IaaS."],
    ["Ajustar os recursos automaticamente, para mais ou para menos, conforme a demanda muda é...",
      ["Alta disponibilidade", "Elasticidade", "Previsibilidade", "Governança"], 1,
      "Elasticidade é a escala automática que acompanha a demanda, para cima e para baixo."],
    ["O que é uma zona de disponibilidade?",
      ["Um país onde o Azure atua", "Um ou mais datacenters fisicamente separados dentro de uma região", "Um grupo de assinaturas", "Uma cópia de segurança"], 1,
      "Zonas têm energia, refrigeração e rede independentes: se uma cai, as outras da região continuam."],
    ["Qual é a ordem da hierarquia do Azure, do maior para o menor?",
      ["Assinaturas, grupos de gerenciamento, recursos, grupos de recursos",
       "Grupos de gerenciamento, assinaturas, grupos de recursos, recursos",
       "Recursos, grupos de recursos, assinaturas, grupos de gerenciamento",
       "Grupos de recursos, assinaturas, grupos de gerenciamento, recursos"], 1,
      "Grupos de gerenciamento reúnem assinaturas, que reúnem grupos de recursos, que reúnem recursos."],
    ["Um recurso pode pertencer a dois grupos de recursos ao mesmo tempo?",
      ["Sim, a quantos quiser", "Sim, desde que estejam na mesma região", "Não, a um só", "Só se for uma máquina virtual"], 2,
      "Cada recurso fica em um único grupo de recursos. Dá para mover, mas não para estar em dois."],
    ["Qual camada de armazenamento é a mais barata para guardar e a mais lenta para acessar?",
      ["Quente", "Fria", "De arquivo", "Premium"], 2,
      "A camada de arquivo é para o que quase nunca é lido: guardar custa pouco, ler demora e custa mais."],
    ["A redundância LRS guarda os dados como?",
      ["Três cópias num único datacenter da região", "Uma cópia em cada zona", "Cópias em duas regiões", "Uma cópia só"], 0,
      "LRS: três cópias no mesmo datacenter. ZRS espalha pelas zonas, GRS leva para outra região."],
    ["Qual a diferença entre Azure Policy e RBAC?",
      ["São a mesma coisa", "A Policy define quem pode agir; o RBAC define as regras dos recursos",
       "A Policy define as regras que os recursos precisam seguir; o RBAC define quem pode fazer o quê", "O RBAC só existe fora do Azure"], 2,
      "Policy olha para o recurso (pode ou não pode existir assim). RBAC olha para a pessoa (pode ou não pode agir)."],
    ["Autenticação e autorização são...",
      ["A mesma coisa", "Autenticação prova quem você é; autorização define o que você pode fazer",
       "Autorização prova quem você é; autenticação define o que você pode fazer", "Duas formas de MFA"], 1,
      "Primeiro o sistema confirma quem você é (autenticação), depois decide o que você pode fazer (autorização)."],
    ["A calculadora de preços e o Gerenciamento de Custos servem para...",
      ["A mesma coisa", "A calculadora estima antes; o Gerenciamento de Custos acompanha o gasto real",
       "A calculadora acompanha o gasto real; o Gerenciamento de Custos estima antes", "Só para empresas grandes"], 1,
      "Antes de criar: calculadora de preços. Depois de criar: Gerenciamento de Custos e orçamentos."],
    ["Qual princípio resume o Zero Trust?",
      ["Confiar em tudo que está dentro da rede", "Nunca confiar, sempre verificar", "Bloquear a internet", "Usar só senhas fortes"], 1,
      "No Zero Trust, cada acesso é verificado, mesmo dentro da rede da empresa."],
    ["Qual é a nota mínima para ser aprovado no AZ-900?",
      ["500", "600", "700", "800"], 2,
      "A pontuação vai até 1.000, e a aprovação é com 700 ou mais."]
  ];

  // ---------- funções ----------

  function embaralha(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  // monta um treino: cada rodada mostra uma pergunta, as opções e o retorno
  function treino(caixa, rodadas) {
    if (!caixa) return;
    const pergunta = caixa.querySelector(".pergunta");
    const opcoes = caixa.querySelector(".opcoes");
    const retorno = caixa.querySelector(".retorno");
    const placar = caixa.querySelector(".placar");
    const proxima = caixa.querySelector(".proxima");
    let fila = embaralha(rodadas);
    let feitas = 0;
    let acertos = 0;

    function mostra() {
      if (!fila.length) {
        fila = embaralha(rodadas);
      }
      const r = fila.pop();
      pergunta.textContent = r.texto;
      retorno.textContent = "";
      opcoes.innerHTML = "";
      r.alternativas.forEach(function (alt, i) {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = alt;
        b.addEventListener("click", function () {
          feitas++;
          const certo = i === r.certa;
          if (certo) acertos++;
          opcoes.querySelectorAll("button").forEach(function (x, k) {
            x.disabled = true;
            if (k === r.certa) x.classList.add("certo");
          });
          if (!certo) b.classList.add("errado");
          retorno.textContent = (certo ? "Compilou de primeira! " : "Curto-circuito. ") + r.explicacao;
          placar.textContent = acertos + " de " + feitas + " certas";
          proxima.focus();
        });
        opcoes.appendChild(b);
      });
    }

    proxima.addEventListener("click", mostra);
    mostra();
  }

  // "Qual é o serviço?": a certa e mais três serviços sorteados
  const rodadasServico = SERVICOS.map(function (par) {
    const outros = embaralha(SERVICOS.filter(function (p) { return p[1] !== par[1]; })).slice(0, 3).map(function (p) { return p[1]; });
    const alternativas = embaralha(outros.concat(par[1]));
    return {
      texto: par[0],
      alternativas: alternativas,
      certa: alternativas.indexOf(par[1]),
      explicacao: "A resposta é " + par[1] + "."
    };
  });

  const rodadasSimulado = SIMULADO.map(function (q) {
    return { texto: q[0], alternativas: q[1], certa: q[2], explicacao: q[3] };
  });

  treino(document.getElementById("servico"), rodadasServico);
  treino(document.getElementById("simulado"), rodadasSimulado);

})();
