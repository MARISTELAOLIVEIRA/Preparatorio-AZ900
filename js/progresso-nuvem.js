/* progresso-nuvem.js: o "meu progresso" das trilhas também na nuvem (com login, js/conta.js).
   O checklist continua sendo do aulas.js (comum a todos os sites, salva no navegador);
   aqui só escutamos as caixas das trilhas 1 a 3 e conversamos com o Supabase.
   Cada módulo vira um item "T1-1", "T1-2"... (trilha e posição). */
(function () {
  if (!window.CONTA) return;
  const listas = [1, 2, 3].map((n) => document.getElementById("trilha-" + n)).filter(Boolean);
  const caixas = (lista) => Array.from(lista.querySelectorAll('input[type="checkbox"]'));
  const item = (lista, posicao) => "T" + lista.id.split("-")[1] + "-" + (posicao + 1);

  // marcou ou desmarcou: logado, guarda na nuvem
  listas.forEach((lista) => {
    caixas(lista).forEach((caixa, posicao) => {
      caixa.addEventListener("change", () => {
        if (CONTA.usuario()) CONTA.salvarProgresso({ [item(lista, posicao)]: caixa.checked });
      });
    });
  });

  // ao entrar: o que foi marcado no navegador ou na nuvem vale nos dois
  CONTA.aoMudar(async (usuario) => {
    if (!usuario) return;
    const daNuvem = await CONTA.carregarProgresso();
    if (!daNuvem) return;
    const soAqui = {};
    listas.forEach((lista) => {
      const todas = caixas(lista);
      todas.forEach((caixa, posicao) => {
        const it = item(lista, posicao);
        if (caixa.checked && !(it in daNuvem)) soAqui[it] = true;
        if (daNuvem[it]) caixa.checked = true;
      });
      // avisa o aulas.js para salvar no navegador e atualizar a barra (sem mandar de novo para a nuvem)
      if (todas.length) todas[0].dispatchEvent(new Event("change"));
    });
    CONTA.salvarProgresso(soAqui);
  });
})();
