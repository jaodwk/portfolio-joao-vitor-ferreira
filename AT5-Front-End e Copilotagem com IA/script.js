document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Sistema de Tema Claro / Escuro ---
  const btnTheme = document.getElementById('btn-theme');
  
  if (btnTheme) {
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      btnTheme.textContent = '☀️ Tema Claro';
    }

    btnTheme.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      btnTheme.textContent = isDark ? '🌙 Tema Escuro' : '☀️ Tema Claro';
    });
  }

  // --- 2. Gráfico Interativo com Chart.js ---
  let meuGrafico = null;

  function renderizarGrafico(horasCelular) {
    const ctx = document.getElementById('graficoUso').getContext('2d');
    const horasRestantes = Math.max(0, 24 - horasCelular);

    if (meuGrafico) {
      meuGrafico.destroy();
    }

    meuGrafico = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Uso de Tela (h)', 'Outras Atividades (h)'],
        datasets: [{
          data: [horasCelular, horasRestantes],
          backgroundColor: ['#0d9488', '#cbd5e1'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  // --- 3. Lógica do Formulário e Veredito ---
  const formHabitos = document.getElementById('form-habitos');
  const painelResultados = document.getElementById('painel');

  if (formHabitos) {
    formHabitos.addEventListener('submit', (e) => {
      e.preventDefault();

      const horasInput = document.getElementById('horas-diarias');
      if (!horasInput) return;

      const horas = parseFloat(horasInput.value);
      const usoSemanal = (horas * 7).toFixed(1);
      const usoMensal = (horas * 30).toFixed(1);

      document.getElementById('metrica-dia').textContent = `${horas}h`;
      document.getElementById('metrica-semana').textContent = `${usoSemanal}h`;
      document.getElementById('metrica-mes').textContent = `${usoMensal}h`;

      const badge = document.getElementById('badge-perfil');
      const titulo = document.getElementById('titulo-veredito');
      const texto = document.getElementById('texto-veredito');

      if (horas <= 3) {
        badge.className = 'badge bg-success mb-3 align-self-start px-3 py-2 fs-6';
        badge.textContent = 'Uso Equilibrado';
        titulo.textContent = 'Um ritmo consciente';
        texto.textContent = 'Seu celular faz parte da sua rotina. Continue observando se esse uso combina com o que você quer para o seu dia.';
      } else if (horas <= 5) {
        badge.className = 'badge bg-warning text-dark mb-3 align-self-start px-3 py-2 fs-6';
        badge.textContent = 'Uso no Automático';
        titulo.textContent = 'Oportunidade de atenção';
        texto.textContent = 'Talvez você esteja gastando alguns minutos sem perceber. Que tal experimentar recuperar 15 minutos do seu dia?';
      } else {
        badge.className = 'badge bg-info text-dark mb-3 align-self-start px-3 py-2 fs-6';
        badge.textContent = 'Tempo a Recuperar';
        titulo.textContent = 'Espaço para novas escolhas';
        texto.textContent = 'Você identificou uma oportunidade de mudança. Comece com uma meta pequena e veja como se sente.';
      }

      painelResultados.classList.remove('d-none');
      renderizarGrafico(horas);
      painelResultados.scrollIntoView({ behavior: 'smooth' });

      // Salvar automaticamente no histórico após submeter
      salvarNoHistorico(horas, badge.textContent);
    });
  }

  // --- 4. Simulador de Tempo Recuperável ---
  const selectMeta = document.getElementById('select-meta');
  const elemSemana = document.getElementById('recuperado-semana');
  const elemMes = document.getElementById('recuperado-mes');

  function atualizarSimulador() {
    if (!selectMeta || !elemSemana || !elemMes) return;
    const minDiarios = parseInt(selectMeta.value, 10);
    
    const minSemana = minDiarios * 7;
    const minMes = minDiarios * 30;

    const hSemana = Math.floor(minSemana / 60);
    const mSemana = minSemana % 60;

    const hMes = Math.floor(minMes / 60);
    const mMes = minMes % 60;

    elemSemana.textContent = `${hSemana}h ${mSemana > 0 ? mSemana + 'min' : ''}`;
    elemMes.textContent = `${hMes}h ${mMes > 0 ? mMes + 'min' : ''}`;
  }

  if (selectMeta) {
    selectMeta.addEventListener('change', atualizarSimulador);
    atualizarSimulador();
  }

  // --- 5. Timer de Pausa Rápida ---
  const displayTimer = document.getElementById('display-timer');
  const btnIniciarTimer = document.getElementById('btn-iniciar-timer');
  const btnResetarTimer = document.getElementById('btn-resetar-timer');
  
  let temporizador = null;
  let segundosRestantes = 15 * 60; // 15 minutos
  let rodando = false;

  function formatarTempo(segundos) {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  if (btnIniciarTimer && displayTimer) {
    btnIniciarTimer.addEventListener('click', () => {
      if (!rodando) {
        rodando = true;
        btnIniciarTimer.textContent = 'Pausar';
        btnIniciarTimer.classList.replace('btn-primary-custom', 'btn-warning');

        temporizador = setInterval(() => {
          if (segundosRestantes > 0) {
            segundosRestantes--;
            displayTimer.textContent = formatarTempo(segundosRestantes);
          } else {
            clearInterval(temporizador);
            rodando = false;
            alert('Parabéns! Você concluiu sua pausa digital de 15 minutos.');
            btnIniciarTimer.textContent = 'Iniciar Pausa';
            btnIniciarTimer.classList.replace('btn-warning', 'btn-primary-custom');
            segundosRestantes = 15 * 60;
            displayTimer.textContent = formatarTempo(segundosRestantes);
          }
        }, 1000);
      } else {
        clearInterval(temporizador);
        rodando = false;
        btnIniciarTimer.textContent = 'Retomar Pausa';
        btnIniciarTimer.classList.replace('btn-warning', 'btn-primary-custom');
      }
    });

    if (btnResetarTimer) {
      btnResetarTimer.addEventListener('click', () => {
        clearInterval(temporizador);
        rodando = false;
        segundosRestantes = 15 * 60;
        displayTimer.textContent = formatarTempo(segundosRestantes);
        btnIniciarTimer.textContent = 'Iniciar Pausa';
        if (btnIniciarTimer.classList.contains('btn-warning')) {
          btnIniciarTimer.classList.replace('btn-warning', 'btn-primary-custom');
        }
      });
    }
  }

  // --- 6. Dicas Aleatórias de Bem-Estar ---
  const dicasArray = [
    "Experimentar o tédio de vez em quando é essencial para estimular a criatividade e dar descanso ao córtex prefrontal.",
    "Desativar notificações não essenciais reduz drasticamente os gatilhos de checagem automática do celular.",
    "Deixar o celular fora do quarto durante a noite melhora significativamente a qualidade do sono e a produção de melatonina.",
    "Fazer pausas visuais olhando para o horizonte a cada 20 minutos previne a fadiga ocular digital.",
    "Substituir 15 minutos de rolagem infinita por uma caminhada leve traz ganhos expressivos para o bem-estar físico."
  ];

  const btnNovaDica = document.getElementById('btn-nova-dica');
  const textoDica = document.getElementById('texto-dica');

  if (btnNovaDica && textoDica) {
    btnNovaDica.addEventListener('click', () => {
      const indiceAleatorio = Math.floor(Math.random() * dicasArray.length);
      textoDica.textContent = `"${dicasArray[indiceAleatorio]}"`;
    });
  }

  // --- 7. Histórico com LocalStorage ---
  const listaHistorico = document.getElementById('lista-historico');
  const btnLimparHistorico = document.getElementById('btn-limpar-historico');

  function carregarHistorico() {
    if (!listaHistorico) return;
    const historico = JSON.parse(localStorage.getItem('pausa_digital_historico')) || [];
    
    if (historico.length === 0) {
      listaHistorico.innerHTML = '<li class="list-group-item bg-transparent text-secondary-custom text-center">Nenhum registro salvo ainda. Preencha o questionário acima!</li>';
      if (btnLimparHistorico) btnLimparHistorico.classList.add('d-none');
      return;
    }

    listaHistorico.innerHTML = '';
    historico.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'list-group-item bg-transparent d-flex justify-content-between align-items-center text-main';
      li.innerHTML = `<span class="text-main"><strong>${item.data}:</strong> ${item.horas}h/dia (${item.perfil})</span> <span class="badge bg-light-custom">Salvo</span>`;
      listaHistorico.appendChild(li);
    });

    if (btnLimparHistorico) btnLimparHistorico.classList.remove('d-none');
  }

  function salvarNoHistorico(horas, perfilText) {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    let historico = JSON.parse(localStorage.getItem('pausa_digital_historico')) || [];
    
    historico.unshift({ data: dataAtual, horas: horas, perfil: perfilText });
    if (historico.length > 5) historico.pop();

    localStorage.setItem('pausa_digital_historico', JSON.stringify(historico));
    carregarHistorico();
  }

  if (btnLimparHistorico) {
    btnLimparHistorico.addEventListener('click', () => {
      localStorage.removeItem('pausa_digital_historico');
      carregarHistorico();
    });
  }

  // Carrega o histórico ao iniciar a página
  carregarHistorico();

  // Proteção do link do menu Veredito
  const linkVeredito = document.querySelector('a[href="#painel"]');
  if (linkVeredito) {
    linkVeredito.addEventListener('click', (e) => {
      if (painelResultados && painelResultados.classList.contains('d-none')) {
        e.preventDefault();
        alert('Por favor, preencha primeiro o questionário de hábitos para gerar o seu veredito personalizado!');
        document.getElementById('questionario').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

});