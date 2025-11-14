document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.querySelector(".dropdown");
  const button = dropdown.querySelector(".nome-usuario");

  button.addEventListener("click", () => {
    dropdown.classList.toggle("show");
  });

  // Fechar dropdown se clicar fora
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });
});

document.querySelectorAll('.coracao').forEach(coracao => {
  coracao.addEventListener('click', (event) => {
    event.stopPropagation(); // evita conflito de clique na div
    coracao.classList.toggle('ativo');
  });
});
