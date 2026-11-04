# Audit Dossier & Prompt Logbook — Pausa Digital

Este documento registra as auditorias críticas realizadas sobre os códigos gerados por Copilotagem com IA durante o desenvolvimento da aplicação.

## Iteração 1: Sistema de Alternância de Tema (Dark/Light Mode)
* **Engenharia de Prompt:** "Gere um script JS simples para alterar a classe do body para dark-mode e salvar a preferência no localStorage."
* **Resposta Bruta da IA:** A IA sugeriu alterar diretamente `document.body.classList.toggle('dark')`.
* **Auditoria Crítica:** O uso de classes diretas no `body` dificulta o CSS de componentes do Bootstrap 5 e não atende às melhores práticas de acessibilidade.
* **Refatoração Manual:** Alteramos o script para manipular o atributo global `data-theme` no `document.documentElement` (`<html>`), alinhando o CSS às variáveis CSS nativas (`:root`).

## Iteração 2: Gráfico Interativo com Chart.js
* **Engenharia de Prompt:** "Crie uma função em JS usando Chart.js para exibir um gráfico de rosca mostrando as horas de celular versus 24 horas."
* **Resposta Bruta da IA:** A IA enviou o código recriando a instância do `new Chart(...)` a cada clique sem destruir a anterior.
* **Auditoria Crítica:** Isso gerou um bug visual no canvas (efeito de flickering ao passar o mouse), além de vazamento de memória.
* **Refatoração Manual:** Implementamos a checagem `if (meuGrafico) { meuGrafico.destroy(); }` antes de instanciar um novo gráfico.

## Iteração 3: Acessibilidade nos Componentes Form e Modal
* **Engenharia de Prompt:** "Gere um HTML para um formulário de hábitos com rótulos e selects em Bootstrap 5."
* **Resposta Bruta da IA:** O código retornado continha apenas `<div>` com botões sem `type="submit"` e faltavam associações explícitas de `for` e `id` nos `<label>`.
* **Auditoria Crítica:** Falha nos requisitos WCAG 2.1 AA de acessibilidade para leitores de tela.
* **Refatoração Manual:** Corrigimos as associações `<label for="...">`, adicionamos `aria-label` aos botões e organizamos a estrutura em `<form>`.

## Iteração 4: Lógica de Intervalos em JavaScript (Timer Pomodoro/Pausa)
* **Engenharia de Prompt:** "Crie um script em JavaScript vanilla para um cronômetro regressivo de 15 minutos com botões de iniciar, pausar e resetar, garantindo limpeza adequada de intervalos com clearInterval."
* **Resposta Bruta da IA:** A IA gerou a lógica básica de `setInterval`, mas esqueceu de tratar os estados múltiplos do botão (alternar entre pausar e retomar), gerando sobreposição de instâncias de tempo se o usuário clicasse repetidamente.
* **Auditoria Crítica:** Risco de vazamento de thread de execução e aceleração do relógio por múltiplos intervalos ativos simultaneamente.
* **Refatoração Manual:** Implementamos uma variável de controle de estado (`rodando`) e a verificação explícita de limpeza do `clearInterval` antes de iniciar uma nova contagem ou resetar o cronômetro.