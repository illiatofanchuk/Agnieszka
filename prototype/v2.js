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
  return `<section class="v2-page-hero ${workshops ? 'is-photo' : 'is-dark'}" data-top="${workshops ? '#bbaf93' : '#303829'}" aria-labelledby="page-title">
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
  return `<section class="v2-hero" data-top="#191a0f" aria-labelledby="hero-title">
    <div class="v2-hero-scene">
      <img class="v2-hero-photo" src="/assets/v2/hero-meadow-empty.webp" width="1536" height="1024" fetchpriority="high" alt="${tr('Agnieszka w białym stroju podczas medytacji na słonecznej łące', 'Agnieszka в білому вбранні під час медитації на сонячній луці')}">
      <img class="v2-hero-layer v2-hero-rear" src="/assets/v2/meadow-transparent-layers/meadow-rear-transparent.png" width="1536" height="1024" fetchpriority="high" alt="" aria-hidden="true">
      <img class="v2-hero-layer v2-hero-front" src="/assets/v2/meadow-transparent-layers/meadow-foreground-transparent.png" width="1536" height="1024" alt="" aria-hidden="true">
      <h1 id="hero-title">${textGenerate(tr('Bliskość', 'Близькість'))}</h1>
      <img class="v2-hero-subject" src="/assets/v2/hero-subject-2.png" width="1536" height="1024" alt="" aria-hidden="true">
    </div>
    <div class="v2-hero-intro">
      <p>${tr('Przestrzeń, <br>w której <br class="hb-br">możesz <br>być sobą', 'Простір, <br>де можна <br class="hb-br"><br>бути собою')}</p></div>
    <div class="v2-hero-action"><p>${tr('Spotkajmy się <br>w indywidualnej <br class="hb-br">pracy <br>z emocjami i ciałem', 'Зустріньмося <br>в індивідуальній <br class="hb-br">роботі <br>з емоціями й тілом')}</p><button type="button" class="button light hb-cta" data-book="session"><img class="hb-cta-icon" src="/assets/v2/icons/button-mark.svg" alt="" width="20" height="20">${tr('Umów sesję', 'Записатися')}</button></div>  </section>`;
}

// Three paragraphs, the copy split only at sentence boundaries: the first is the statement, the other two support it.
const aboutIntro = () => tr(['Pomagam Ci lepiej zrozumieć swoje emocje, usłyszeć potrzeby i zauważyć sygnały płynące z ciała.', 'Podczas naszych spotkań jest miejsce na rozmowę, ciszę i to, co trudno ubrać w słowa.', 'Wspólnie szukamy sposobu pracy, który będzie dla Ciebie odpowiedni — w Twoim tempie, z szacunkiem do Twoich granic.'], ['Допомагаю тобі краще зрозуміти свої емоції, почути потреби й помітити сигнали, що йдуть від тіла.', 'Під час наших зустрічей є місце для розмови, тиші й того, що важко передати словами.', 'Разом шукаємо спосіб роботи, який буде для тебе відповідним — у твоєму темпі, з повагою до твоїх меж.']);
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
const aboutPractices = () => `<nav class="v2-practices" aria-label="${tr('Formy pracy', 'Формати роботи')}">${[
  ['#sesje', 'sessions-1to1', tr('Sesje 1:1', 'Сесії 1:1'), tr('Rozmowa i praca z emocjami i ciałem', 'Розмова й робота з емоціями та тілом')],
  ['#joga', 'yoga', tr('Joga i medytacja', 'Йога й медитація'), tr('Kundalini, Flow i praktyka łączona', 'Kundalini, Flow і поєднана практика')],
  ['/warsztaty/', 'workshops', tr('Warsztaty', 'Воркшопи'), tr('Spotkania i praca w grupie', 'Зустрічі й робота в групі')]
].map(([href, icon, title, text]) => `<a class="v2-practice" href="${href}"><span class="v2-practice-icon v2-practice-icon--${icon}"><img src="/assets/v2/icons/${icon}.svg" alt="" width="96" height="80" loading="lazy"></span><span class="v2-practice-title">${title}</span><span class="v2-practice-text">${text}</span>${arrow}</a>`).join('')}</nav>`;

// 13.11.2026: "O mnie" as a bento grid (variant B, chosen by the client over the earlier three-column layout,
// a type-led and a drenched-olive variant): content split into tiles of different size and colour weight.
function v2About() {
  return `<section id="o-mnie" class="v2-section v2-container v2-about" aria-label="${tr('O mnie', 'Про мене')}">
    <div class="v2-bento">
      <div class="v2-bento-tile v2-bento-title"><h2>${tr('Bliżej siebie.<br>Bliżej życia.', 'Ближче до себе.<br>Ближче до життя.')}</h2><p>${tr('Sesje 1:1, joga, medytacja i warsztaty. W jednym miejscu, w Twoim tempie.', 'Сесії 1:1, йога, медитація й воркшопи. В одному місці, у твоєму темпі.')}</p></div>
      <figure class="v2-bento-tile v2-bento-portrait">${aboutPortrait()}</figure>
      <div class="v2-bento-tile v2-bento-intro"><div class="v2-bento-intro-head"><p class="v2-bento-lead">${tr('Jestem Agnieszka.', 'Я — Agnieszka.')}</p><img class="v2-bento-intro-mark" src="/assets/v2/icons/intro-mark.svg" alt="" width="57" height="64" loading="lazy"></div>${aboutIntro().map((t, i) => `<p${i ? '' : ' class="v2-bento-statement"'}>${t}</p>`).join('')}</div>
      ${aboutGallery()}
      <div class="v2-bento-tile v2-bento-words"><span class="v2-bento-flower" aria-hidden="true"><img src="/assets/v2/ornaments/botanical-flower.svg" alt="" width="1059" height="1054" loading="lazy"></span><p>${tr('Ciało<i>.</i><br>Emocje<i>.</i><br>Uważność<i>.</i>', 'Тіло<i>.</i><br>Емоції<i>.</i><br>Уважність<i>.</i>')}</p></div>
      <div class="v2-bento-tile v2-bento-practices"><h3>${tr('Jak możemy pracować', 'Як ми можемо працювати')}</h3>${aboutPractices()}</div>
    </div>
  </section>`;
}

function v2Sessions() {
  // 17.11.2026: four questions and answers (client copy) replace the two placeholder rows and the separate "Nie wiesz, który
  // kierunek wybrać?" note; the per-row "Zapytaj o sesję 1:1" links are gone, one general button sits with the headline (the single primary action); the four questions are a quiet reference list.
  // The Ukrainian text is a translation to be approved.
  const rows = [
    ['session-first', tr('Jak wygląda pierwszy krok?', 'Як виглядає перший крок?'),
      tr('Skorzystaj z formularza i napisz krótko, z czym chcesz przyjść. Możesz opisać konkretną trudność albo po prostu zaznaczyć, że potrzebujesz rozmowy. Odezwę się do Ciebie, aby ustalić termin i odpowiedzieć na pytania przed pierwszą sesją.',
         'Скористайся формою й коротко напиши, з чим хочеш прийти. Можеш описати конкретну складність або просто зазначити, що потребуєш розмови. Я зв’яжуся з тобою, щоб узгодити час і відповісти на запитання перед першою сесією.')],
    ['session-expect', tr('Czego możesz się spodziewać?', 'Чого можна очікувати?'),
      tr('Podczas spotkania przyglądamy się temu, co przeżywasz i jak wpływa to na Twoją codzienność. Rozmowa może dotyczyć emocji, relacji oraz tego, co odczuwasz w ciele. Nie musisz poruszać wszystkich tematów od razu. Jest miejsce na pytania, chwilę namysłu i przerwy, kiedy ich potrzebujesz.',
         'Під час зустрічі ми придивляємося до того, що ти переживаєш і як це впливає на твоє повсякдення. Розмова може стосуватися емоцій, стосунків і того, що ти відчуваєш у тілі. Не обов’язково одразу торкатися всіх тем. Є місце для запитань, хвилини роздумів і пауз, коли вони тобі потрібні.')],
    ['session-format', tr('Format i szczegóły spotkania', 'Формат і деталі зустрічі'),
      tr('Przed potwierdzeniem sesji ustalimy jej format, czas trwania i koszt. Otrzymasz też informacje organizacyjne potrzebne do udziału w spotkaniu. Wszystko będzie jasne z wyprzedzeniem, aby spokojnie zdecydować, czy proponowane warunki Ci odpowiadają.',
         'Перед підтвердженням сесії ми узгодимо її формат, тривалість і вартість. Ти також отримаєш організаційну інформацію, потрібну для участі у зустрічі. Усе буде зрозуміло заздалегідь, щоб спокійно вирішити, чи підходять тобі запропоновані умови.')],
    ['session-direction', tr('Nie wiesz, który kierunek wybrać?', 'Не знаєш, який напрям обрати?'),
      tr('Nie musisz znać nazw metod ani od razu wybierać konkretnej usługi. Możesz zacząć od prostego: „Nie wiem, czego potrzebuję, ale chcę o tym porozmawiać”. Pomogę Ci przyjrzeć się dostępnym formom wsparcia i wybrać, od czego zacząć.',
         'Не обов’язково знати назви методів чи одразу обирати конкретну послугу. Можеш почати з простого: «Не знаю, чого потребую, але хочу про це поговорити». Допоможу тобі придивитися до доступних форм підтримки й обрати, з чого почати.')]
  ];
  const faq = `<div class="v2-services accordion-group">${rows.map(([id, title, text], i) => detail(id, title, `<p>${text}</p>`).replace('<details', i ? '<details' : '<details open')).join('')}</div>`;
  return `<section id="sesje" class="v2-section v2-container v2-sessions">
    ${v2SectionLabel('02', 'Sesje 1:1', 'Сесії 1:1')}
    <div class="v2-session-grid"><div class="v2-session-intro"><h2>${tr('Czas tylko<br>dla Ciebie.', 'Час лише<br>для тебе.')}</h2><p>${tr('Rozmowa, uważność i miejsce na Twoje doświadczenie. W swoim tempie.', 'Розмова, уважність і місце для твого досвіду. У власному темпі.')}</p>${bookButton(tr('Umówmy się na rozmowę', 'Умовмося про розмову'), 'session')}${img('brainspotting.jpg', tr('Przestrzeń do indywidualnej rozmowy', 'Простір для індивідуальної розмови'))}</div>
      ${faq}</div>
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
// Phone hero variants (14.11.2026). 17.11.2026: B is the live phone hero (cut-out on the right, plain header + subheader
// on the left); A (both texts on the photo in frosted boxes) stays in the code as a fallback, reachable only with ?hero=a.
// The A/B switch shows only when the URL already carries ?hero=, so visitors never see it. Only phones (≤600px) change;
// switching is CSS-only (a class on <html>).
let heroVariant = 'b';
let heroSwitchShown = false;
try { const q = new URLSearchParams(location.search); heroSwitchShown = q.has('hero'); heroVariant = q.get('hero') || 'b'; } catch {}
if (!['a', 'b'].includes(heroVariant)) heroVariant = 'b';
document.documentElement.classList.toggle('hero-b', heroVariant === 'b');
function heroSwitcher() {
  if (!heroSwitchShown) return '';
  return `<nav class="hero-switch" aria-label="${tr('Wariant nagłówka na telefonie', 'Варіант героя на телефоні')}"><span>Hero</span>${['a', 'b'].map(v => `<a href="?v=2&lang=${lang}&hero=${v}" data-hero-variant="${v}"${heroVariant === v ? ' aria-current="true"' : ''} aria-label="${tr('Wariant ', 'Варіант ')}${v.toUpperCase()}">${v.toUpperCase()}</a>`).join('')}</nav>`;
}
document.addEventListener('click', e => {
  const link = e.target.closest('[data-hero-variant]');
  if (!link) return;
  e.preventDefault();
  heroVariant = link.dataset.heroVariant;
  document.documentElement.classList.toggle('hero-b', heroVariant === 'b');
  document.querySelectorAll('[data-hero-variant]').forEach(a => a.toggleAttribute('aria-current', a.dataset.heroVariant === heroVariant));
  try { const url = new URL(location.href); url.searchParams.set('hero', heroVariant); history.replaceState(null, '', url); } catch {}
  dispatchEvent(new Event('resize'));
});

// 17.11.2026: browser chrome tint. On phones the status bar and the strip revealed by pull-to-refresh take the colour of
// whatever sits under the top edge: the hero's top-edge colour (data-top on the hero; measured from the rendered photo with
// its gradient: home #191a0f, Warsztaty #bbaf93, Sklep #303829) while the hero is there, the page paper once it has scrolled away.
// Two channels, because browsers differ: <meta name="theme-color"> (Safari up to 18, Chrome on Android, in-app browsers)
// and the page background, which paints the overscroll area and is what Safari 26 reads — from <body>, not from the root,
// as a real iPhone showed. Each HTML file carries the same colour statically (meta + inline root and body backgrounds),
// so a reload starts in the right colour before this script runs.
(function chromeTint() {
  const PAPER = { v2: '#faf7f2', v1: '#fefffa' };
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) { meta = Object.assign(document.createElement('meta'), { name: 'theme-color' }); document.head.appendChild(meta); }
  let current = null, queued = false;
  const sync = () => {
    queued = false;
    const v2 = document.body.classList.contains('version-two');
    const hero = v2 && document.querySelector('[data-top]');
    const top = hero && hero.getBoundingClientRect().bottom > 1 ? hero.dataset.top : '';
    const colour = top || (v2 ? PAPER.v2 : PAPER.v1);
    if (colour === current) return;
    current = colour;
    meta.content = colour;
    // Inline so it wins over the stylesheet; cleared when the page paper is already the right colour. <body> is the one
    // WebKit reads (an opaque body background hides the root's), the root covers the other engines. #app paints the paper.
    document.documentElement.style.backgroundColor = top;
    document.body.style.backgroundColor = top;
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(sync); } };
  const app = document.getElementById('app');
  // The first sync waits for the first render: before it the body has no version class and the static colour must stay.
  if (app) new MutationObserver(sync).observe(app, { childList: true });
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  addEventListener('pageshow', () => { if (app && app.firstChild) sync(); });
})();

// 17.11.2026: phone hero B — keeps the cut-out clear of the text on every phone. The photo is scaled by the hero's height
// while the text is sized by its width, so one fixed offset cannot work: on shorter viewports (in-app browsers, Safari with
// both bars) the head lands beside the header. This places the figure just right of the widest text line it shares a row with,
// and, when that would push the head off-screen, steps the text size down a little instead.
(function heroBFit() {
  const phone = matchMedia('(max-width: 600px)');
  // Left outline of /assets/v2/hero-subject-2.png: leftmost opaque pixel per 1% of its height, as a fraction of its width
  // (1 = empty row). Rows 31-47 are the head, 48-73 shoulders and arms, 74-87 knees and blanket. Regenerate if the PNG changes.
  const HB_LEFT = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,.486,.478,.47,.466,.462,.456,.455,.454,.449,.445,.446,.442,.443,.444,.438,.441,.442,.432,.431,.437,.425,.419,.415,.412,.41,.408,.406,.404,.403,.402,.4,.398,.395,.393,.39,.387,.386,.387,.389,.391,.394,.396,.402,.354,.344,.339,.335,.332,.164,.157,.148,.142,.135,.127,.118,.16,.262,1,1,1,1,1,1,1,1,1,1,1,1];
  const HEAD_RIGHT = 0.08; // the hair's right edge from the image centre, in hero heights
  const GAP = 16;          // clear space between a text line and the figure
  const EDGE = 12;         // clear space between the hair and the right screen edge
  const DRIFT = 0.05;      // the texts rise on scroll (parallax), so each line also clears the rows just above it
  // Tried in order: full-size text with the whole head on screen first, then smaller text, then letting the hair touch the edge.
  const STEPS = [[1, 0], [.96, 0], [.92, 0], [.88, 0], [.92, 1], [.88, 1], [.84, 1], [.8, 1]];
  const needed = (hero, H) => {
    let need = -Infinity;
    for (const sel of ['.v2-hero-intro', '.v2-hero-action']) {
      const box = hero.querySelector(sel), p = box && box.querySelector('p:last-of-type');
      if (!p) continue;
      // Positions come from layout offsets plus rect differences, so the entrance and parallax transforms don't skew them.
      const pr = p.getBoundingClientRect(), range = document.createRange();
      range.selectNodeContents(p);
      const x0 = box.offsetLeft + p.offsetLeft, y0 = box.offsetTop + p.offsetTop;
      const cta = box.querySelector('.hb-cta');
      const rects = [...range.getClientRects()];
      if (cta && cta.offsetParent) { const cr = cta.getBoundingClientRect(); rects.push({ top: cr.top, bottom: cr.bottom, right: cr.right, width: cr.width }); }
      for (const r of rects) {
        if (r.width < 2) continue;
        const a = Math.max(0, Math.floor(((y0 + r.top - pr.top) / H - DRIFT) * 100));
        const b = Math.min(99, Math.floor((y0 + r.bottom - pr.top) / H * 100));
        let left = 1;
        for (let i = a; i <= b; i++) left = Math.min(left, HB_LEFT[i]);
        if (left < 1) need = Math.max(need, x0 + r.right - pr.left + GAP + (0.5 - left) * 1.5 * H);
      }
    }
    return need;
  };
  const fit = () => {
    const hero = document.querySelector('.version-two .v2-hero');
    if (!hero) return;
    const W = hero.clientWidth, H = hero.clientHeight;
    if (!phone.matches || !document.documentElement.classList.contains('hero-b') || W > H * 1.5) {
      hero.style.removeProperty('--hb-fig');
      hero.style.removeProperty('--hb-scale');
      return;
    }
    const limits = [W - HEAD_RIGHT * H - EDGE, W - HEAD_RIGHT * H * .55];
    let x = limits[1];
    for (const [scale, relaxed] of STEPS) {
      hero.style.setProperty('--hb-scale', scale);
      const need = needed(hero, H);
      if (need <= limits[relaxed]) { x = need; break; }
    }
    hero.style.setProperty('--hb-fig', `${Math.max(W * .62, x).toFixed(1)}px`);
  };
  let queued = false;
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; fit(); }); } };
  const app = document.getElementById('app');
  // render() swaps #app's children (language / version switch): refit before the next paint, and again once the web font
  // has replaced the fallback (the fallback is wider, so the first pass alone would shrink the text more than needed).
  const refit = () => { fit(); document.fonts?.ready.then(fit); };
  if (app) new MutationObserver(refit).observe(app, { childList: true });
  addEventListener('resize', queue);
  phone.addEventListener?.('change', queue);
  document.fonts?.addEventListener?.('loadingdone', fit);
})();

(function heroParallax() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const wide = matchMedia('(min-width: 601px)');
  // Negative factors drift upward faster than the page. The texts use the `translate` property so it
  // composes with their entrance `transform` instead of fighting it. The fourth value is the phone factor
  // (14.11.2026: the two texts now sit on the phone photo too): the intro behind her drifts gently,
  // the box in front of her drifts twice as fast, so the two read as separate depth layers.
  const layers = [
    ['.v2-hero-rear', 0.2, 'transform'],
    ['.v2-hero h1', -0.12, 'translate'],
    ['.v2-hero-intro', -0.06, 'translate', -0.08],
    ['.v2-hero-action', -0.06, 'translate', -0.16]
  ];
  let queued = false;
  const update = () => {
    queued = false;
    const hero = document.querySelector('.version-two .v2-hero');
    if (!hero) return;
    const y = Math.max(0, -hero.getBoundingClientRect().top);
    if (y > hero.offsetHeight) return;
    for (const [sel, k, prop, kPhone = k] of layers) {
      const el = hero.querySelector(sel);
      if (!el) continue;
      // Hero B stacks the two texts as one header block, so on phones they drift together.
      const phoneK = sel === '.v2-hero-action' && document.documentElement.classList.contains('hero-b') ? -0.08 : kPhone;
      const off = reduce.matches ? 0 : y * (wide.matches ? k : phoneK);
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

