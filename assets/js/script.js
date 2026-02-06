const about = document.querySelector("#about");
const swiperWrapper = document.querySelector(".swiper-wrapper");
const formulario = document.querySelector("#formulario");
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

async function getAboutGithub() {
  try {
    const resposta = await fetch("https://api.github.com/users/renato-sales");
    const perfil = await resposta.json();

    about.innerHTML = "";

    about.innerHTML = `
      <figure class="about-image">
        <img src="${perfil.avatar_url}" alt="Foto do perfil - ${perfil.name}">
      </figure>

      <article class="about-content">
        <h2>Sobre mim</h2>

        <p>
            Desenvolvedor Full Stack em formação pelo bootcamp da Generation
            Brasil, com foco em JavaScript, e formado em Ciência da Computação
            pela Universidade Católica de Pernambuco (UNICAP).
          </p>

          <p>
            Possui conhecimentos em desenvolvimento web, APIs REST, lógica de
            programação, git e metodologias ágeis. Profissional em transição de
            carreira, com perfil proativo, colaborativo, boa comunicação,
            trabalho em equipe e foco em aprendizado contínuo.
          </p>

        <div class="about-buttons-data">
          <div class="buttons-container">
            <a href="${perfil.html_url}" target="_blank" class="botao">
              Ver GitHub
            </a>
            <a href="#" target="_blank" class="botao-outline">
              Currículo
            </a>
          </div>

          <div class="data-container">
            <div class="data-item">
              <span class="data-number">${perfil.followers}</span>
              <span class="data-label">Seguidores</span>
            </div>

            <div class="data-item">
              <span class="data-number">${perfil.public_repos}</span>
              <span class="data-label">Repositórios</span>
            </div>
          </div>
        </div>
      </article>
    `;
  } catch (error) {
    console.error("Erro ao buscar dados do GitHub:", error);
  }
}

getAboutGithub();

async function getProjectsGithub() {
  try {
    const resposta = await fetch(
      "https://api.github.com/users/renato-sales/repos?sort=updated&per_page=6"
    );
    const repositorios = await resposta.json();

    swiperWrapper.innerHTML = "";

    const linguagens = {
      JavaScript: { icone: "javascript" },
      TypeScript: { icone: "typescript" },
      Python: { icone: "python" },
      Java: { icone: "java" },
      HTML: { icone: "html" },
      CSS: { icone: "css" },
      PHP: { icone: "php" },
      "C#": { icone: "csharp" },
      Go: { icone: "go" },
      Kotlin: { icone: "kotlin" },
      Swift: { icone: "swift" },
    };

    repositorios.forEach((repositorio) => {
      const linguagemExibir = repositorio.language || "GitHub";
      const config = linguagens[repositorio.language] || { icone: "github" };
      const urlIcone = `./assets/icons/languages/${config.icone}.svg`;

      const nomeFormatado = repositorio.name
        .replace(/[-_]/g, " ")
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .toUpperCase();

      const descricao = repositorio.description
        ? repositorio.description.length > 100
          ? repositorio.description.substring(0, 97) + "..."
          : repositorio.description
        : "Projeto desenvolvido no GitHub";

      const tags =
        repositorio.topics && repositorio.topics.length > 0
          ? repositorio.topics
              .slice(0, 3)
              .map((topic) => `<span class="tag">${topic}</span>`)
              .join("")
          : "";

      const botoesAcao = `
        <div class="project-buttons">
          <a href="${
            repositorio.html_url
          }" target="_blank" class="botao botao-sm">
            GitHub
          </a>
          ${
            repositorio.homepage
              ? `
          <a href="${repositorio.homepage}" target="_blank" class="botao-outline botao-sm">
            Deploy
          </a>`
              : ""
          }
        </div>
      `;

      swiperWrapper.innerHTML += `
        <div class="swiper-slide">
          <article class="project-card">
            <div class="project-image">
              <img 
                src="${urlIcone}" 
                alt="Ícone ${linguagemExibir}"
                onerror="this.onerror=null; this.src='./assets/icons/languages/github.svg';"
              >
            </div>

            <div class="project-content">
              <h3>${nomeFormatado}</h3>
              <p>${descricao}</p>
              <div class="project-tags">
                ${tags}
                <span class="tag">${linguagemExibir}</span>
              </div>
              ${botoesAcao}
            </div>
          </article>
        </div>
      `;
    });

    iniciarSwiper();
  } catch (error) {
    console.error("Erro ao buscar repositórios:", error);
  }
}

getProjectsGithub();

function iniciarSwiper() {
  new Swiper(".projects-swiper", {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 24,
    centeredSlides: false,
    loop: true,
    watchOverflow: true,

    breakpoints: {
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 40,
        centeredSlides: false,
      },
      769: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 40,
        centeredSlides: false,
      },
      1025: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 54,
        centeredSlides: false,
      },
    },

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },

    autoplay: {
      delay: 5000,
      pauseOnMouseEnter: true,
      disableOnInteraction: false,
    },

    grabCursor: true,
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,
  });
}

formulario.addEventListener("submit", function (event) {
  event.preventDefault();

  document
    .querySelectorAll("form span")
    .forEach((span) => (span.innerHTML = ""));

  let isValid = true;

  const nome = document.querySelector("#nome");
  const erroNome = document.querySelector("#erro-nome");

  if (nome.value.trim().length < 3) {
    erroNome.innerHTML = "O Nome deve ter no mínimo 3 caracteres.";
    if (isValid) nome.focus();
    isValid = false;
  }

  const email = document.querySelector("#email");
  const erroEmail = document.querySelector("#erro-email");

  if (!email.value.trim().match(emailRegex)) {
    erroEmail.innerHTML = "Digite um e-mail válido.";
    if (isValid) email.focus();
    isValid = false;
  }

  const assunto = document.querySelector("#assunto");
  const erroAssunto = document.querySelector("#erro-assunto");

  if (assunto.value.trim().length < 5) {
    erroAssunto.innerHTML = "O Assunto deve ter no mínimo 5 caracteres.";
    if (isValid) assunto.focus();
    isValid = false;
  }

  const mensagem = document.querySelector("#mensagem");
  const erroMensagem = document.querySelector("#erro-mensagem");

  if (mensagem.value.trim().length === 0) {
    erroMensagem.innerHTML = "A mensagem não pode ser vazia.";
    if (isValid) mensagem.focus();
    isValid = false;
  }

  if (isValid) {
    const submitButton = formulario.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    formulario.submit();
  }
});
