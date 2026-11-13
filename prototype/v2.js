'use strict';

function v2SectionLabel(number, pl, uk) {
  return `<div class="v2-section-label"><span>${number} / ${tr(pl, uk)}</span><span aria-hidden="true"></span></div>`;
}

const isHomePath = () => location.pathname === '/' || location.pathname === '/index.html';
const homeHref = id => (isHomePath() ? '' : '/') + '#' + id;
const navCurrent = path => location.pathname.startsWith(path) ? ' aria-current="page"' : '';

function headerV2() {
  return `<a class="skip" href="#main">${tr('Przejdź do treści', 'Перейти до вмісту')}</a>
  <header class="site-header v2-header">
    <a class="brand" href="/">agnieszka clarity</a>
    <nav class="nav-links" aria-label="${tr('Menu główne', 'Головне меню')}">
      <a href="${homeHref('o-mnie')}">${tr('O mnie', 'Про мене')}</a>
      <a href="${homeHref('sesje')}">${tr('Sesje 1:1', 'Сесії 1:1')}</a>
      <a href="${homeHref('joga')}">${tr('Studio Jogi', 'Студія йоги')}</a>
      <a href="/warsztaty/"${navCurrent('/warsztaty')}>${tr('Warsztaty', 'Воркшопи')}</a>
      <a href="/sklep/"${navCurrent('/sklep')}>${tr('Sklep', 'Магазин')}</a>
    </nav>
    <button class="language" data-language aria-label="${tr('Zmień język na ukraiński', 'Перемкнути на польську')}">${lang === 'pl' ? 'PL / UK' : 'UK / PL'}</button>
    <button class="button light nav-cta" data-book="session">${tr('Umów sesję', 'Записатися')}</button>
    <button class="menu-toggle" aria-label="${tr('Otwórz menu', 'Відкрити меню')}" aria-expanded="false">${menuIcon}</button>
  </header>
  <nav class="mobile-nav" aria-label="${tr('Menu mobilne', 'Мобільне меню')}">
    <a href="${homeHref('o-mnie')}">${tr('O mnie', 'Про мене')}</a><a href="${homeHref('sesje')}">${tr('Sesje 1:1', 'Сесії 1:1')}</a>
    <a href="${homeHref('joga')}">${tr('Studio Jogi', 'Студія йоги')}</a><a href="/warsztaty/"${navCurrent('/warsztaty')}>${tr('Warsztaty', 'Воркшопи')}</a>
    <a href="/sklep/"${navCurrent('/sklep')}>${tr('Sklep', 'Магазин')}</a><a href="${homeHref('najblizsze')}">${tr('Wydarzenia', 'Події')}</a>
    <button class="button" data-book="session">${tr('Umów sesję', 'Записатися')}</button>
  </nav>`;
}

// Inner pages in V2: one oversized word per page, like "Bliskość" on the home page.
function v2PageHero(kind) {
  const workshops = kind === 'workshops';
  const down = '<svg class="down" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 4v15M5 13l7 7 7-7"/></svg>';
  return `<section class="v2-page-hero ${workshops ? 'is-photo' : 'is-dark'}" aria-labelledby="page-title">
    ${workshops ? `<img class="v2-page-hero-photo" src="/assets/workshop.jpg" width="1600" height="1067" fetchpriority="high" alt="${tr('Swobodny ruch na plaży o zachodzie słońca', 'Вільний рух на пляжі під час заходу сонця')}">` : ''}
    <h1 id="page-title">${workshops ? tr('Warsztaty', 'Воркшопи') : tr('Sklep', 'Магазин')}</h1>
    <div class="v2-page-hero-row">
      <p class="v2-page-hero-lead">${workshops ? tr('Przestrzeń <br>do odkrywania.', 'Простір <br>для відкриттів.') : tr('Dobre rzeczy <br>dla siebie.', 'Добрі речі <br>для себе.')}</p>
      <div class="v2-page-hero-side"><p>${workshops ? tr('Praktyka, refleksja i wspólne doświadczenie. Znajdź temat, który jest Ci teraz bliski.', 'Практика, роздуми та спільний досвід. Знайди тему, яка зараз тобі близька.') : tr('Warsztaty online i praktyki do wykonania w swoim tempie. Katalog pokazowy — zakupy online nie są jeszcze dostępne.', 'Онлайн-воркшопи та практики у власному темпі. Демонстраційний каталог — онлайн-покупки поки недоступні.')}</p>
        <a class="button light" href="${workshops ? '#programy' : '#katalog'}">${workshops ? tr('Zobacz programy', 'Переглянути програми') : tr('Przejdź do katalogu', 'Перейти до каталогу')}${down}</a></div>
    </div>
  </section>`;
}

function v2Label(pl, uk) {
  return `<div class="v2-section-label"><span>${tr(pl, uk)}</span><span aria-hidden="true"></span></div>`;
}

function v2EventRows(list) {
  return list.map(e => `<article class="v2-event-row"><div><span class="demo-caption">${tr('Przykładowa data', 'Приклад дати')}</span><time datetime="${e.date}">${dateText(e.date)}</time></div><div><h3>${e[lang]}</h3><p>${e.format === 'online' ? tr('Spotkanie online', 'Зустріч онлайн') : tr('Praktyka w studio', 'Практика у студії')}</p></div><span class="status">${e.status === 'soon' ? tr('Zapisy wkrótce', 'Запис незабаром') : tr('Przykład otwartego zapisu', 'Приклад відкритого запису')}</span><button class="round-link" data-book="${e.service}" data-event="${e.id}" aria-label="${esc(tr('Zapytaj o: ', 'Запитати про: ') + e[lang])}">${arrow}</button></article>`).join('');
}

// Vanilla port of the "TextGenerateEffect" component (motion/react): the full text stays readable for screen readers,
// and each visible piece fades in from a blur with a fixed stagger (CSS custom property --i drives the delay).
// The hero is a single word, so pieces are characters; plain inline spans keep kerning, so the logo-to-button span holds.
function textGenerate(text) {
  const pieces = Array.from(text).map((ch, i) => `<span class="v2-gen" style="--i:${i}" aria-hidden="true">${esc(ch)}</span>`).join('');
  return `<span class="visually-hidden">${esc(text)}</span>${pieces}`;
}

function homeHeroV2() {
  return `<section class="v2-hero" aria-labelledby="hero-title">
    <div class="v2-hero-scene">
      <img class="v2-hero-photo" src="/assets/v2/hero-meadow-empty.webp" width="1536" height="1024" fetchpriority="high" alt="${tr('Agnieszka w białym stroju podczas medytacji na słonecznej łące', 'Agnieszka в білому вбранні під час медитації на сонячній луці')}">
      <img class="v2-hero-layer v2-hero-rear" src="/assets/v2/meadow-transparent-layers/meadow-rear-transparent.png" width="1536" height="1024" fetchpriority="high" alt="" aria-hidden="true">
      <img class="v2-hero-layer v2-hero-front" src="/assets/v2/meadow-transparent-layers/meadow-foreground-transparent.png" width="1536" height="1024" alt="" aria-hidden="true">
      <h1 id="hero-title">${textGenerate(tr('Bliskość', 'Близькість'))}</h1>
      <img class="v2-hero-subject" src="/assets/v2/hero-subject-2.png" width="1536" height="1024" alt="" aria-hidden="true">
    </div>
    <div class="v2-hero-intro">
      <p>${tr('Przestrzeń, <br>w której możesz <br>być sobą.', 'Простір, <br>де можна <br>бути собою.')}</p></div>
    <div class="v2-hero-action"><p>${tr('Spotkajmy się <br>w indywidualnej pracy <br>z emocjami i ciałem.', 'Зустріньмося <br>в індивідуальній роботі <br>з емоціями й тілом.')}</p></div>  </section>`;
}

const aboutIntro = () => tr('Prowadzę sesje indywidualne 1:1, praktyki jogi i medytacji oraz warsztaty. Towarzyszę Ci w spotkaniu z emocjami, ciałem i tym, co ważne właśnie teraz.', 'Проводжу індивідуальні сесії 1:1, практики йоги й медитації та воркшопи. Супроводжую тебе в зустрічі з емоціями, тілом і тим, що важливо саме зараз.');
const aboutPortrait = (cls = '', loading = 'lazy') => `<img${cls ? ` class="${cls}"` : ''} src="/assets/v2/portrait.png" alt="${tr('Portret Agnieszki w ciepłym świetle', 'Портрет Agnieszka у теплому світлі')}" width="1086" height="1448" loading="${loading}">`;
const aboutHands = (cls = '') => `<img${cls ? ` class="${cls}"` : ''} src="/assets/v2/about-hands.webp" alt="${tr('Dłonie złożone na sercu, biała lniana bluzka i mala z zielonym chwostem', 'Руки, складені на серці, біла лляна блузка й мала із зеленим пензликом')}" width="1157" height="1359" loading="lazy">`;
// 13.11.2026: the hands tile became a small auto-advancing gallery. Each pill's fill is a CSS animation;
// its animationend moves to the next photo, so hover, focus or leaving the viewport simply pause the animation.
const aboutGallery = () => {
  const slides = [
    ['/assets/v2/about-hands.webp', 1157, 1359, 'hands', tr('Dłonie złożone na sercu, biała lniana bluzka i mala z zielonym chwostem', 'Руки, складені на серці, біла лляна блузка й мала із зеленим пензликом')],
    ['/assets/v2/gallery/meditation.jpg', 900, 1125, 'meditation', tr('Agnieszka medytuje na plaży wśród drzew', 'Agnieszka медитує на пляжі серед дерев')],
    ['/assets/v2/gallery/beach-yoga.jpg', 900, 1125, 'yoga', tr('Agnieszka w pozycji jogi na piaszczystej plaży', 'Agnieszka в позі йоги на піщаному пляжі')],
    ['/assets/v2/gallery/session.jpg', 768, 960, 'session', tr('Rozmowa podczas sesji 1:1 w jasnym gabinecie', 'Розмова під час сесії 1:1 у світлому кабінеті')]
  ];
  return `<figure class="v2-bento-tile v2-bento-hands v2-gallery" data-gallery data-index="0" aria-roledescription="${tr('galeria', 'галерея')}" aria-label="${tr('Zdjęcia Agnieszki', 'Фото Agnieszka')}">
        ${slides.map(([src, w, h, key, alt], i) => `<img class="v2-gallery-slide v2-gallery-slide--${key}${i ? '' : ' is-active'}" src="${src}" width="${w}" height="${h}" alt="${alt}" loading="lazy"${i ? ' aria-hidden="true"' : ''}>`).join('')}
        <div class="v2-gallery-pills">${slides.map((_, i) => `<button type="button" class="v2-gallery-pill${i ? '' : ' is-active'}" data-gallery-go="${i}" aria-label="${tr('Zdjęcie', 'Фото')} ${i + 1} ${tr('z', 'з')} ${slides.length}"${i ? '' : ' aria-current="true"'}><span><i></i></span></button>`).join('')}</div>
      </figure>`;
};
const aboutDetails = (extra = '') => `<details id="about-details" class="v2-about-accordion ${extra}"><summary class="button">${tr('Poznaj mnie', 'Дізнатися про мене')}${arrow}</summary><div class="detail-body"><p>${tr('Punktem wyjścia jest rozmowa i Twoje potrzeby. Formę współpracy ustalamy wspólnie. Ten opis jest tekstem roboczym do zatwierdzenia przez Agnieszkę.', 'Починаємо з розмови та твоїх потреб. Формат співпраці визначаємо разом. Цей опис — робочий текст для погодження Agnieszka.')}</p></div></details>`;
const aboutPractices = () => `<nav class="v2-practices" aria-label="${tr('Formy pracy', 'Формати роботи')}">${[
  ['#sesje', 'sessions-1to1', tr('Sesje 1:1', 'Сесії 1:1'), tr('Rozmowa i praca z emocjami i ciałem', 'Розмова й робота з емоціями та тілом')],
  ['#joga', 'yoga', tr('Joga i medytacja', 'Йога й медитація'), tr('Kundalini, Flow i praktyka łączona', 'Kundalini, Flow і поєднана практика')],
  ['/warsztaty/', 'workshops', tr('Warsztaty', 'Воркшопи'), tr('Spotkania i praca w grupie', 'Зустрічі й робота в групі')]
].map(([href, icon, title, text]) => `<a class="v2-practice" href="${href}"><span class="v2-practice-icon v2-practice-icon--${icon}"><img src="/assets/v2/icons/${icon}.svg" alt="" width="96" height="80" loading="lazy"></span><span class="v2-practice-title">${title}</span><span class="v2-practice-text">${text}</span>${arrow}</a>`).join('')}</nav>`;

// 13.11.2026: "O mnie" as a bento grid (variant B, chosen by the client over the earlier three-column layout,
// a type-led and a drenched-olive variant): content split into tiles of different size and colour weight.
function v2About() {
  return `<section id="o-mnie" class="v2-section v2-container v2-about">
    ${v2SectionLabel('01', 'O mnie', 'Про мене')}
    <div class="v2-bento">
      <div class="v2-bento-tile v2-bento-title"><h2>${tr('Bliżej siebie.<br>Bliżej życia.', 'Ближче до себе.<br>Ближче до життя.')}</h2><p>${tr('Sesje 1:1, joga, medytacja i warsztaty. W jednym miejscu, w Twoim tempie.', 'Сесії 1:1, йога, медитація й воркшопи. В одному місці, у твоєму темпі.')}</p></div>
      <figure class="v2-bento-tile v2-bento-portrait">${aboutPortrait()}<figcaption>Agnieszka</figcaption></figure>
      <div class="v2-bento-tile v2-bento-intro"><p class="v2-bento-lead">${tr('Jestem Agnieszka.', 'Я — Agnieszka.')}</p><p>${aboutIntro()}</p>${aboutDetails('on-lime')}</div>
      ${aboutGallery()}
      <div class="v2-bento-tile v2-bento-words"><span class="v2-bento-flower" aria-hidden="true"><img src="/assets/v2/ornaments/botanical-flower.svg" alt="" width="1059" height="1054" loading="lazy"></span><p>${tr('Ciało<i>.</i><br>Emocje<i>.</i><br>Uważność<i>.</i>', 'Тіло<i>.</i><br>Емоції<i>.</i><br>Уважність<i>.</i>')}</p></div>
      <div class="v2-bento-tile v2-bento-practices"><h3>${tr('Jak możemy pracować', 'Як ми можемо працювати')}</h3>${aboutPractices()}</div>
    </div>
  </section>`;
}

function v2Sessions() {
  const rows = [
    ['session-first', tr('Jak wygląda pierwszy krok?', 'Як зробити перший крок?'), tr('Nie musisz wiedzieć, od czego zacząć. Wybierz usługę w formularzu lub poproś o pomoc w wyborze. Termin, miejsce i szczegóły spotkania potwierdzimy w osobnym kontakcie.', 'Не обов’язково знати, з чого почати. Вибери послугу у формі або попроси допомоги з вибором. Час, місце та подробиці зустрічі підтвердимо під час окремого контакту.')],
    ['session-format', tr('Online czy stacjonarnie?', 'Онлайн чи наживо?'), tr('Dostępny format, czas trwania i warunki ustalimy przed spotkaniem. Aktualne szczegóły zostaną uzupełnione w finalnej wersji strony.', 'Доступний формат, тривалість та умови узгодимо перед зустріччю. Актуальні подробиці додамо у фінальну версію сайту.')]
  ];
  return `<section id="sesje" class="v2-section v2-container v2-sessions">
    ${v2SectionLabel('02', 'Sesje 1:1', 'Сесії 1:1')}
    <div class="v2-session-grid"><div class="v2-session-intro"><h2>${tr('Czas tylko<br>dla Ciebie.', 'Час лише<br>для тебе.')}</h2><p>${tr('Rozmowa, uważność i miejsce na Twoje doświadczenie. W swoim tempie.', 'Розмова, уважність і місце для твого досвіду. У власному темпі.')}</p>${img('brainspotting.jpg', tr('Przestrzeń do indywidualnej rozmowy', 'Простір для індивідуальної розмови'))}</div>
      <div class="v2-services accordion-group">${rows.map(([id, title, text]) => detail(id, title, `<p>${text}</p><button class="text-link" data-book="session">${tr('Zapytaj o sesję 1:1', 'Запитати про сесію 1:1')}${arrow}</button>`)).join('')}
        <p class="v2-service-note">${tr('Nie wiesz, który kierunek wybrać?', 'Не знаєш, який напрям вибрати?')}</p>${bookButton(tr('Porozmawiajmy', 'Поговорімо'), 'help')}
      </div></div>
  </section>`;
}

function v2Yoga() {
  return `<section id="joga" class="v2-yoga"><div class="v2-container v2-section">
    ${v2SectionLabel('03', 'Studio Jogi', 'Студія йоги')}
    <div class="v2-yoga-grid"><figure>${img('joga.jpg', tr('Praktyka jogi w jasnym studio', 'Практика йоги у світлій студії'))}</figure>
      <div class="v2-yoga-copy"><h2>${tr('Mniej pośpiechu.<br>Więcej oddechu.', 'Менше поспіху.<br>Більше дихання.')}</h2><p>${tr('Ruch. Oddech. Obecność. Wybierz praktykę, która jest Ci bliska.', 'Рух. Дихання. Присутність. Вибери практику, яка тобі близька.')}</p>
        <div class="accordion-group">${['kundalini', 'flow', 'combo'].map(id => detail('yoga-' + id, label(id), `<p>${id === 'kundalini' ? tr('Praktyka łącząca ruch, oddech i medytację.', 'Практика, що поєднує рух, дихання й медитацію.') : id === 'flow' ? tr('Płynna praktyka ruchu i oddechu.', 'Плавна практика руху та дихання.') : tr('Połączenie dwóch stylów praktyki.', 'Поєднання двох стилів практики.')}</p><button class="text-link" data-book="${id}">${tr('Zapytaj o praktykę', 'Запитати про практику')}${arrow}</button>`)).join('')}</div>
      </div></div>
  </div></section>`;
}

function v2Upcoming() {
  return `<section id="najblizsze" class="v2-section v2-container v2-upcoming">
    ${v2SectionLabel('06', 'Najbliższe wydarzenia', 'Найближчі події')}
    <div class="v2-section-top"><h2>${tr('Spotkajmy się.', 'Зустріньмося.')}</h2><p>${tr('Najbliższe wydarzenia z kalendarza.<br>W prototypie — przykładowe dane w miejscu wtyczki.', 'Найближчі події з календаря.<br>У прототипі — демонстраційні дані на місці віджета.')}</p></div>
    <div class="v2-event-list">${v2EventRows(events.filter(e => e.status !== 'ended'))}</div>
  </section>`;
}

function v2Workshops() {
  return `<section id="warsztaty" class="v2-section v2-container v2-workshops">
    ${v2SectionLabel('04', 'Warsztaty', 'Воркшопи')}
    <div class="v2-workshop-grid"><div><h2>${tr('Odkrywaj siebie.<br>W dobrym<br>towarzystwie.', 'Відкривай себе.<br>У доброму<br>товаристві.')}</h2><p>${tr('Praktyka, refleksja i wspólne doświadczenie. Znajdź temat, który jest Ci teraz bliski.', 'Практика, роздуми та спільний досвід. Знайди тему, яка зараз тобі близька.')}</p><ul class="program-index">${programs.map(p => `<li><a href="/warsztaty/#${p.id}">${label(p.id)}${arrow}</a></li>`).join('')}</ul><a class="button" href="/warsztaty/">${tr('Poznaj warsztaty', 'Переглянути воркшопи')}${arrow}</a></div><figure>${img('workshop.jpg', tr('Swobodny ruch na plaży o zachodzie słońca', 'Вільний рух на пляжі під час заходу сонця'))}<figcaption>${tr('Odkryj siebie — cykl 12 warsztatów', 'Відкрий себе — цикл із 12 воркшопів')}</figcaption></figure></div>
  </section>`;
}

function v2School() {
  return `<section id="szkola" class="v2-school"><div class="v2-container v2-section">
    ${v2SectionLabel('05', 'Szkoła Klarowności', 'Школа ясності')}
    <div class="v2-school-grid"><div><h2>${tr('Zrób miejsce<br>na nowe.', 'Звільни місце<br>для нового.')}</h2><p class="lead">${tr('Szkoła Klarowności', 'Школа ясності')}</p><p>${tr('Miejsce na głębszą praktykę i naukę. Napisz, jeśli chcesz otrzymać informacje o programie i kolejnych spotkaniach.', 'Місце для глибшої практики й навчання. Напиши, якщо хочеш отримати інформацію про програму й наступні зустрічі.')}</p>${bookButton(tr('Zapytaj o program', 'Запитати про програму'), 'school')}</div>${img('agnieszka-beach.jpg', tr('Agnieszka podczas praktyki na plaży', 'Agnieszka під час практики на пляжі'))}</div>
  </div></section>`;
}

function v2EventsAndBlog() {
  return `<section id="wydarzenia" class="v2-section v2-container v2-all-events">
    ${v2SectionLabel('06', 'Wydarzenia', 'Події')}
    <div class="v2-section-top"><h2>${tr('Wspólne<br>doświadczenia.', 'Спільний<br>досвід.')}</h2><p>${tr('Online, w studio i w swoim tempie.<br>Pokazane terminy są przykładowe.', 'Онлайн, у студії та у власному темпі.<br>Показані дати — приклади.')}</p></div>
    <div class="filter-row" aria-label="${tr('Filtruj wydarzenia', 'Фільтрувати події')}">${[['all', tr('Wszystkie', 'Усі')], ['online', 'Online'], ['studio', tr('W studio', 'У студії')], ['ended', tr('Archiwum', 'Архів')]].map(([id, text]) => `<button class="filter ${id === 'all' ? 'active' : ''}" data-event-filter="${id}" aria-pressed="${id === 'all'}">${text}</button>`).join('')}</div>
    <div class="events-grid event-results">${events.map(e => eventCard(e)).join('')}</div>
  </section>
  <section id="blog" class="v2-section v2-container v2-blog">
    ${v2SectionLabel('07', 'Blog', 'Блог')}
    <div class="v2-section-top"><h2>${tr('Chwila na refleksję.', 'Хвилина для роздумів.')}</h2><p>${tr('Teksty robocze.<br>Podgląd tematów z materiałów.', 'Робочі тексти.<br>Огляд тем із матеріалів.')}</p></div>
    <div class="blog-grid">${[['joga.jpg', tr('Ruch, oddech i chwila dla siebie', 'Рух, дихання та хвилина для себе')], ['brainspotting.jpg', tr('Jak przygotować się do pierwszej rozmowy', 'Як підготуватися до першої розмови')], ['agnieszka-meditation.jpg', tr('Uważność w codzienności', 'Усвідомленість у щоденному житті')]].map(([photo, title], i) => `<button class="blog-card" data-info="article-${i}">${img(photo, title)}<span>${tr('Materiał w przygotowaniu', 'Матеріал готується')}</span><h3>${title}</h3><span class="blog-arrow">${arrow}</span></button>`).join('')}</div>
  </section>`;
}

function v2Shop() {
  return `<section id="sklep" class="v2-section v2-container v2-shop">
    ${v2SectionLabel('05', 'Sklep', 'Магазин')}
    <div class="v2-section-top"><h2>${tr('Dobre rzeczy<br>dla siebie.', 'Добрі речі<br>для себе.')}</h2><p>${tr('Materiały do praktyki i własnej refleksji.<br>Katalog pokazowy, bez zakupów online.', 'Матеріали для практики та власних роздумів.<br>Демонстраційний каталог, без онлайн-покупок.')}</p></div>
    <div class="shop-grid">${shopProducts('all', 3, 'h3')}</div>
    <a class="button v2-shop-cta" href="/sklep/">${tr('Zobacz sklep', 'Переглянути магазин')}${arrow}</a>
  </section>`;
}

// Client edit 12.11.2026: Szkoła Klarowności, Wydarzenia and Blog are hidden; v2School() and v2EventsAndBlog() stay for a possible return.
function homeSectionsV2() {
  return v2About() + v2Sessions() + v2Yoga() + v2Workshops() + v2Shop() + v2Upcoming();
}

function contactV2() {
  return `<section id="kontakt" class="v2-contact"><div class="v2-container">
    <p>${tr('Pierwszy krok może być prosty.', 'Перший крок може бути простим.')}</p>
    <h2>${tr('Porozmawiajmy.', 'Поговорімо.')}</h2>
    <div><p>${tr('Nie musisz od razu wybierać metody.<br>Napisz — wspólnie ustalimy pierwszy krok.', 'Не обов’язково одразу вибирати метод.<br>Напиши — разом визначимо перший крок.')}</p>${bookButton(tr('Napisz do mnie', 'Написати мені'))}</div>
  </div></section>`;
}

// 13.11.2026: light parallax for the V2 hero background. The meadow moves at 20% of the scroll speed,
// the grass and the cut-out scroll normally, while the word and texts drift slightly upward. One rAF per scroll burst; nothing runs when the hero is off-screen,
// on other pages, or when the visitor prefers reduced motion.
(function heroParallax() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const wide = matchMedia('(min-width: 601px)');
  // Negative factors drift upward faster than the page. The texts use the `translate` property so it
  // composes with their entrance `transform` instead of fighting it. On phones the two texts sit in flow
  // under the photo, so only the word moves there.
  const layers = [
    ['.v2-hero-rear', 0.2, 'transform'],
    ['.v2-hero h1', -0.12, 'translate'],
    ['.v2-hero-intro', -0.06, 'translate', true],
    ['.v2-hero-action', -0.06, 'translate', true]
  ];
  let queued = false;
  const update = () => {
    queued = false;
    const hero = document.querySelector('.version-two .v2-hero');
    if (!hero) return;
    const y = Math.max(0, -hero.getBoundingClientRect().top);
    if (y > hero.offsetHeight) return;
    for (const [sel, k, prop, wideOnly] of layers) {
      const el = hero.querySelector(sel);
      if (!el) continue;
      const off = reduce.matches || (wideOnly && !wide.matches) ? 0 : y * k;
      el.style[prop] = !off ? '' : prop === 'transform' ? `translate3d(0, ${off.toFixed(1)}px, 0)` : `0 ${off.toFixed(1)}px`;
    }
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  reduce.addEventListener?.('change', queue);
  wide.addEventListener?.('change', queue);
})();

(function aboutGalleryControl() {
  const show = (g, n) => {
    const slides = g.querySelectorAll('.v2-gallery-slide'), pills = g.querySelectorAll('.v2-gallery-pill');
    const i = (n + slides.length) % slides.length;
    slides.forEach((el, k) => { el.classList.toggle('is-active', k === i); k === i ? el.removeAttribute('aria-hidden') : el.setAttribute('aria-hidden', 'true'); });
    pills.forEach((el, k) => { el.classList.toggle('is-active', k === i); k === i ? el.setAttribute('aria-current', 'true') : el.removeAttribute('aria-current'); });
    g.dataset.index = i;
  };
  document.addEventListener('animationend', e => {
    if (e.animationName !== 'v2-gallery-progress') return;
    const g = e.target.closest('[data-gallery]');
    if (g) show(g, +g.dataset.index + 1);
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-gallery-go]');
    if (!b) return;
    const g = b.closest('[data-gallery]');
    if (+b.dataset.galleryGo !== +g.dataset.index) show(g, +b.dataset.galleryGo);
  });
  // Pause while the gallery is off-screen; galleries are observed the first time their progress animation starts.
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(list => list.forEach(en => en.target.classList.toggle('is-offscreen', !en.isIntersecting)), { threshold: 0.2 }) : null;
  const seen = new WeakSet();
  document.addEventListener('animationstart', e => {
    if (e.animationName !== 'v2-gallery-progress' || !io) return;
    const g = e.target.closest('[data-gallery]');
    if (g && !seen.has(g)) { seen.add(g); io.observe(g); }
  });
})();

