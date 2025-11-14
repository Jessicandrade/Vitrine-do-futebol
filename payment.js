// Espera o HTML carregar completamente antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

  // --- Recupera os dados do carrinho armazenados no navegador ---
  const storage = localStorage.getItem('vitrine_cart');
  const data = storage ? JSON.parse(storage) : null;

  // --- Seleção de elementos da página ---
  const paymentProducts = document.getElementById('payment-products');
  const paymentTotal = document.getElementById('payment-total');
  const methods = Array.from(document.querySelectorAll('input[name="method"]'));
  const creditBox = document.getElementById('credit-box');
  const installments = document.getElementById('installments');
  const pixModal = document.getElementById('pix-modal');
  const paidBtn = document.getElementById('paid-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const finishBtn = document.getElementById('finish');
  const success = document.getElementById('success');

  // --- Função para formatar valores como R$ ---
  function formatBRL(v) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // --- Exibe os produtos do carrinho, se existirem ---
  if (data) {
    paymentProducts.innerHTML = '';

    data.items.forEach(it => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <div style="flex:1">
          <strong>${it.name}</strong>
          <p>Tamanho: ${it.size} • Quantidade: ${it.qty} • Estado: ${it.estado}</p>
        </div>
        <div style="min-width:120px;text-align:right">
          ${formatBRL(it.price * it.qty)}
        </div>
      `;
      paymentProducts.appendChild(div);
    });

    paymentTotal.textContent = formatBRL(data.total);
  } else {
    paymentProducts.innerHTML = '<p>Nenhum item no carrinho — volte e adicione algo.</p>';
    paymentTotal.textContent = formatBRL(0);
  }

  // --- Quando o usuário escolhe um método de pagamento ---
  methods.forEach(radio => {
    radio.addEventListener('change', (e) => {
      // Esconde todas as opções ao mudar o método
      creditBox.classList.add('hidden');
      pixModal.classList.remove('show'); // garante que o modal comece fechado

      const method = e.target.value;

      // --- Pagamento por cartão de crédito ---
      if (method === 'credito') {
        creditBox.classList.remove('hidden');
        installments.innerHTML = '';

        // Cria opções de parcelamento
        for (let i = 1; i <= 8; i++) {
          const opt = document.createElement('option');
          opt.value = i;
          opt.textContent = i <= 5 ? `${i}x sem juros` : `${i}x com juros`;
          installments.appendChild(opt);
        }
      }

      // --- Pagamento por Pix ---
      if (method === 'pix') {
        // Mostra o modal (a classe .show faz ele aparecer no CSS)
        pixModal.classList.add('show');

        // Desativa o botão “Pagar” até simular o tempo de pagamento
        paidBtn.disabled = true;
        paidBtn.classList.remove('enabled');

        // Simula o tempo de confirmação (10 segundos)
        const timer = setTimeout(() => {
          paidBtn.disabled = false;
          paidBtn.classList.add('enabled');
        }, 10000);

        // Botão “Cancelar” fecha o modal e cancela o tempo
        cancelBtn.onclick = () => {
          clearTimeout(timer);
          pixModal.classList.remove('show');
        };

        // Botão “Pagar” simula o pagamento e mostra a mensagem de sucesso
        paidBtn.onclick = () => {
          clearTimeout(timer);
          pixModal.classList.remove('show');
          success.classList.remove('hidden');
          finishBtn.disabled = true;
          localStorage.removeItem('vitrine_cart');
        };
      }
    });
  });

  // --- Botão “Finalizar compra” para outros métodos ---
  finishBtn.addEventListener('click', () => {
    success.classList.remove('hidden');
    localStorage.removeItem('vitrine_cart');
  });
});
