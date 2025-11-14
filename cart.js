document.addEventListener('DOMContentLoaded', () => {
  const productEls = Array.from(document.querySelectorAll('.product'));
  const shipping = parseFloat(document.getElementById('shipping').textContent) || 0;
  const grandTotalEl = document.getElementById('grand-total');
  const toPaymentBtn = document.getElementById('to-payment');

  function formatBRL(v) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function calculate() {
    let sum = 0;
    productEls.forEach(el => {
      const price = parseFloat(el.dataset.price) || 0;
      const qty = parseInt(el.querySelector('.qty')?.value) || 0;
      const line = price * qty;
      const totalText = el.querySelector('.line-total-text');
      if (totalText) totalText.textContent = line.toFixed(2);
      sum += line;
    });
    sum += shipping;
    grandTotalEl.textContent = formatBRL(sum);
    return sum;
  }

  function allCompleted() {
    return productEls.every(el => {
      const size = el.querySelector('.size')?.value;
      const qty = parseInt(el.querySelector('.qty')?.value) || 0;
      return size && qty >= 1;
    });
  }

  productEls.forEach(el => {
    el.querySelector('.qty')?.addEventListener('input', () => {
      calculate();
      toPaymentBtn.disabled = !allCompleted();
    });
    el.querySelector('.size')?.addEventListener('change', () => {
      calculate();
      toPaymentBtn.disabled = !allCompleted();
    });
  });

  calculate();
  toPaymentBtn.disabled = !allCompleted();

  toPaymentBtn.addEventListener('click', () => {
    // Salva dados do carrinho (se quiser usar na próxima página)
    const items = productEls.map(el => ({
      name: el.querySelector('h3')?.textContent.trim() || 'Produto',
      price: parseFloat(el.dataset.price) || 0,
      qty: parseInt(el.querySelector('.qty')?.value) || 0,
      size: el.querySelector('.size')?.value || '-',
      estado: el.querySelector('p strong')?.textContent || ''
    }));

    const payload = {
      items,
      shipping: shipping,
      total: calculate()
    };

    localStorage.setItem('vitrine_cart', JSON.stringify(payload));

    // Redireciona para Pagamento.html
    window.location.href = 'Pagamento.html';
  });
});
