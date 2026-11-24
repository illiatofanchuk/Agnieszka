'use strict';

function v2SectionLabel(number, pl, en) {
  return `<div class="v2-section-label"><span>${number} / ${tr(pl, en)}</span><span aria-hidden="true"></span></div>`;
}

const isHomePath = () => location.pathname === '/' || location.pathname === '/index.html';
const homeHref = id => (isHomePath() ? '' : '/') + '#' + id;
const navCurrent = path => location.pathname.startsWith(path) ? ' aria-current="page"' : '';

function headerV2() {
  return `<a class="skip" href="#main">${tr('Przejdź do treści', 'Skip to content')}</a>
  <header class="site-header v2-header">
    <a class="brand" href="/">agnieszka clarity</a>
    <nav class="nav-links" aria-label="${tr('Menu główne', 'Main menu')}">
      <a href="${homeHref('o-mnie')}">${tr('O mnie', 'About me')}</a>
      <a href="${homeHref('sesje')}">${tr('Sesje 1:1', '1:1 sessions')}</a>
      <a href="${homeHref('joga')}">${tr('Studio Jogi', 'Studio Jogi')}</a>
      <a href="/warsztaty/"${navCurrent('/warsztaty')}>${tr('Warsztaty', 'Workshops')}</a>
      <a href="/sklep/"${navCurrent('/sklep')}>${tr('Sklep', 'Shop')}</a>
    </nav>
    <button class="language" data-language aria-label="${tr('Zmień język na angielski', 'Switch language to Polish')}">${lang === 'pl' ? 'PL / EN' : 'EN / PL'}</button>
    <button class="button light nav-cta" data-book="session">${tr('Umów sesję', 'Book a session')}</button>
    <button class="menu-toggle" aria-label="${tr('Otwórz menu', 'Open menu')}" aria-expanded="false">${menuIcon}</button>
  </header>
  <nav class="mobile-nav" aria-label="${tr('Menu mobilne', 'Mobile menu')}">
    <a href="${homeHref('o-mnie')}">${tr('O mnie', 'About me')}</a><a href="${homeHref('sesje')}">${tr('Sesje 1:1', '1:1 sessions')}</a>
    <a href="${homeHref('joga')}">${tr('Studio Jogi', 'Studio Jogi')}</a><a href="/warsztaty/"${navCurrent('/warsztaty')}>${tr('Warsztaty', 'Workshops')}</a>
    <a href="/sklep/"${navCurrent('/sklep')}>${tr('Sklep', 'Shop')}</a><a href="${homeHref('najblizsze')}">${tr('Wydarzenia', 'Events')}</a>
    <button class="button" data-book="session">${tr('Umów sesję', 'Book a session')}</button>
  </nav>`;
}

// Inner pages in V2: one oversized word per page, like "Bliskość" on the home page.
function v2PageHero(kind) {
  const workshops = kind === 'workshops';
  const down = '<svg class="down" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 4v15M5 13l7 7 7-7"/></svg>';
  return `<section class="v2-page-hero ${workshops ? 'is-photo' : 'is-dark'}" data-top="${workshops ? '#bbaf93' : '#303829'}" aria-labelledby="page-title">
    ${workshops ? `<img class="v2-page-hero-photo" src="/assets/workshop.jpg" width="1600" height="1067" fetchpriority="high" alt="${tr('Swobodny ruch na plaży o zachodzie słońca', 'Free movement on the beach at sunset')}">` : ''}
    <h1 id="page-title">${workshops ? tr('Warsztaty', 'Workshops') : tr('Sklep', 'Shop')}</h1>
    <div class="v2-page-hero-row">
      <p class="v2-page-hero-lead">${workshops ? tr('Przestrzeń <br>do odkrywania.', 'Space <br>to explore.') : tr('Dobre rzeczy <br>dla siebie.', 'Good things <br>for yourself.')}</p>
      <div class="v2-page-hero-side"><p>${workshops ? tr('Praktyka, refleksja i wspólne doświadczenie. Znajdź temat, który jest Ci teraz bliski.', 'Practice, reflection and shared experience. Find a topic that speaks to you right now.') : tr('Warsztaty online i praktyki do wykonania w swoim tempie. Katalog pokazowy — zakupy online nie są jeszcze dostępne.', 'Online workshops and practices to explore at your own pace. Demo catalogue — online purchases are not yet available.')}</p>
        <a class="button light" href="${workshops ? '#programy' : '#katalog'}">${workshops ? tr('Zobacz programy', 'Explore programmes') : tr('Przejdź do katalogu', 'Browse the catalogue')}${down}</a></div>
    </div>
  </section>`;
}

function v2Label(pl, en) {
  return `<div class="v2-section-label"><span>${tr(pl, en)}</span><span aria-hidden="true"></span></div>`;
}

function v2EventRows(list) {
  return list.map(e => `<article class="v2-event-row"><div><span class="demo-caption">${tr('Przykładowa data', 'Example date')}</span><time datetime="${e.date}">${dateText(e.date)}</time></div><div><h3>${e[lang]}</h3><p>${e.format === 'online' ? tr('Spotkanie online', 'Online session') : tr('Praktyka w studio', 'Studio practice')}</p></div><span class="status">${e.status === 'soon' ? tr('Zapisy wkrótce', 'Registration opens soon') : tr('Przykład otwartego zapisu', 'Example: registration open')}</span><button class="round-link" data-book="${e.service}" data-event="${e.id}" aria-label="${esc(tr('Zapytaj o: ', 'Ask about: ') + e[lang])}">${arrow}</button></article>`).join('');
}

// 19.11.2026: the home events are three cards in a row, after the "Card" activity card by Ravi Katiyar on 21st.dev (card-25): a title, a stack of
// three overlapping photos that spreads and tilts on hover, a short list of details. The component itself is React + Tailwind and its source is
// behind an account, so the look and the hover were rebuilt from its live preview in plain CSS. There is no visible arrow: the whole card is
// clickable through an invisible button stretched over it (it keeps the accessible name and opens the same enquiry form as before). Photos are
// existing web-sized ones; the details are the example date, the format and the booking status that the old rows already showed.
const eventPhotos = {
  'demo-breath': ['/assets/v2/gallery/sesje-meditation.jpg', '/assets/v2/hero-meadow-2.webp', '/assets/v2/gallery/sesje-sofa.jpg'],
  // "Odkryj siebie": three illustrations (the green path through a head, hands holding a glowing sphere, a hand with a lit match). The tall ones are
  // cropped to the stack's landscape-ish box, so each carries the object-position that keeps its subject in view.
  'demo-discover': [['/assets/v2/gallery/discover-path.jpg', '50% 50%'], ['/assets/v2/gallery/discover-light.jpg', '50% 88%'], ['/assets/v2/gallery/discover-flame.jpg', '50% 19%']],
  'demo-yoga': ['/assets/joga.jpg', '/assets/v2/gallery/beach-yoga.jpg', '/assets/v2/gallery/meditation.jpg']
};
const eventDateParts = d => {
  const parts = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'pl-PL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Warsaw' }).formatToParts(new Date(d + 'T12:00:00+01:00'));
  const get = t => (parts.find(p => p.type === t) || {}).value || '';
  return { day: get('day'), month: get('month'), year: get('year') };
};
// 19.11.2026: card text hierarchy = the "ticket" variant chosen by the client: a numeral for the day with the month and year beside it.
function v2EventCards(list) {
  return list.map(e => {
    const photos = eventPhotos[e.id] || [`/assets/${e.img}`];
    const online = e.format === 'online', soon = e.status === 'soon';
    return `<article class="v2-event-card">
      <div class="v2-event-card-head"><h3>${e[lang]}</h3><button class="v2-event-card-go" data-book="${e.service}" data-event="${e.id}" aria-label="${esc(tr('Zapytaj o: ', 'Ask about: ') + e[lang])}"></button></div>
      <div class="v2-event-stack" aria-hidden="true">${photos.map((p, i) => { const [src, pos] = Array.isArray(p) ? p : [p, '']; return `<span class="v2-event-photo v2-event-photo--${i}"><img src="${src}" alt="" loading="lazy" decoding="async"${pos ? ` style="object-position:${pos}"` : ''}></span>`; }).join('')}</div>
      <ul class="v2-event-stats"><li class="v2-ev-date"><time datetime="${e.date}"><span class="v2-ev-day">${eventDateParts(e.date).day}</span> <span class="v2-ev-month">${eventDateParts(e.date).month}</span> <span class="v2-ev-year">${eventDateParts(e.date).year}</span></time></li><li>${online ? tr('Spotkanie online', 'Online session') : tr('Praktyka w studio', 'Studio practice')}</li><li>${soon ? tr('Zapisy wkrótce', 'Registration opens soon') : tr('Przykład otwartego zapisu', 'Example: registration open')}</li></ul>
    </article>`;
  }).join('');
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
      <img class="v2-hero-photo" src="/assets/v2/hero-meadow-empty.webp" width="1536" height="1024" fetchpriority="high" alt="${tr('Agnieszka w białym stroju podczas medytacji na słonecznej łące', 'Agnieszka in white, meditating in a sunlit meadow')}">
      <img class="v2-hero-layer v2-hero-rear" src="/assets/v2/meadow-transparent-layers/meadow-rear-transparent.png" width="1536" height="1024" fetchpriority="high" alt="" aria-hidden="true">
      <img class="v2-hero-layer v2-hero-front" src="/assets/v2/meadow-transparent-layers/meadow-foreground-transparent.png" width="1536" height="1024" alt="" aria-hidden="true">
      <h1 id="hero-title">${textGenerate(tr('Bliskość', 'Closeness'))}</h1>
      <img class="v2-hero-subject" src="/assets/v2/hero-subject-2.png" width="1536" height="1024" alt="" aria-hidden="true">
    </div>
    <div class="v2-hero-intro">
      <p>${tr('Przestrzeń, <br>w której <br class="hb-br">możesz <br>być sobą', 'A space <br>where you <br class="hb-br">can <br>be yourself')}</p></div>
    <div class="v2-hero-action"><p>${tr('Spotkajmy się <br>w indywidualnej <br class="hb-br">pracy <br>z emocjami i ciałem', 'Let\'s meet <br>for a 1:1 session <br class="hb-br">focused on <br>your emotions and body')}</p><button type="button" class="button light hb-cta" data-book="session"><img class="hb-cta-icon" src="/assets/v2/icons/button-mark.svg" alt="" width="20" height="20">${tr('Umów sesję', 'Book a session')}</button></div>  </section>`;
}

// Three paragraphs, the copy split only at sentence boundaries: the first is the statement, the other two support it.
const aboutIntro = () => tr(['Pomagam Ci lepiej zrozumieć swoje emocje, usłyszeć potrzeby i zauważyć sygnały płynące z ciała.', 'Podczas naszych spotkań jest miejsce na rozmowę, ciszę i to, co trudno ubrać w słowa.', 'Wspólnie szukamy sposobu pracy, który będzie dla Ciebie odpowiedni — w Twoim tempie, z szacunkiem do Twoich granic.'], ['I help you better understand your emotions, listen to your needs and notice the signals from your body.', 'In our sessions, there is space for conversation, silence and whatever is hard to put into words.', 'Together, we find a way of working that feels right for you — at your pace, with respect for your boundaries.']);
const aboutPortrait = (cls = '', loading = 'lazy') => `<img${cls ? ` class="${cls}"` : ''} src="/assets/v2/portrait.png" alt="${tr('Portret Agnieszki w ciepłym świetle', 'A portrait of Agnieszka in warm light')}" width="1086" height="1448" loading="${loading}">`;
const aboutHands = (cls = '') => `<img${cls ? ` class="${cls}"` : ''} src="/assets/v2/about-hands.webp" alt="${tr('Dłonie złożone na sercu, biała lniana bluzka i mala z zielonym chwostem', 'Hands resting over the heart, a white linen blouse and mala beads with a green tassel')}" width="1157" height="1359" loading="lazy">`;
// 13.11.2026: the hands tile became a small auto-advancing gallery. Each pill's fill is a CSS animation;
// its animationend moves to the next photo, so hover, focus or leaving the viewport simply pause the animation.
// One markup for every auto-advancing photo slider (the About bento and the Sesje 1:1 section); the controller below is generic.
const galleryHtml = (slides, cls, label) => `<figure class="${cls} v2-gallery" data-gallery data-index="0" aria-roledescription="${tr('galeria', 'gallery')}" aria-label="${label}">
        ${slides.map(([src, w, h, key, alt], i) => `<img class="v2-gallery-slide v2-gallery-slide--${key}${i ? '' : ' is-active'}" src="${src}" width="${w}" height="${h}" alt="${alt}" loading="lazy"${i ? ' aria-hidden="true"' : ''}>`).join('')}
        <div class="v2-gallery-pills">${slides.map((_, i) => `<button type="button" class="v2-gallery-pill${i ? '' : ' is-active'}" data-gallery-go="${i}" aria-label="${tr('Zdjęcie', 'Photo')} ${i + 1} ${tr('z', 'of')} ${slides.length}"${i ? '' : ' aria-current="true"'}><span><i></i></span></button>`).join('')}</div>
      </figure>`;
const aboutGallery = () => {
  const slides = [
    ['/assets/v2/about-hands.webp', 1157, 1359, 'hands', tr('Dłonie złożone na sercu, biała lniana bluzka i mala z zielonym chwostem', 'Hands resting over the heart, a white linen blouse and mala beads with a green tassel')],
    ['/assets/v2/gallery/meditation.jpg', 900, 1125, 'meditation', tr('Agnieszka medytuje na plaży wśród drzew', 'Agnieszka meditating among trees on the beach')],
    ['/assets/v2/gallery/beach-yoga.jpg', 900, 1125, 'yoga', tr('Agnieszka w pozycji jogi na piaszczystej plaży', 'Agnieszka in a yoga pose on a sandy beach')],
    ['/assets/v2/gallery/session.jpg', 768, 960, 'session', tr('Rozmowa podczas sesji 1:1 w jasnym gabinecie', 'A conversation during a 1:1 session in a bright room')]
  ];
  return galleryHtml(slides, 'v2-bento-tile v2-bento-hands', tr('Zdjęcia Agnieszki', 'Photos of Agnieszka'));
};

const aboutPractices = () => `<nav class="v2-practices" aria-label="${tr('Formy pracy', 'Ways of working together')}">${[
  ['#sesje', 'sessions-1to1', tr('Sesje 1:1', '1:1 sessions'), tr('Rozmowa i praca z emocjami i ciałem', 'Conversation and work with emotions and the body')],
  ['#joga', 'yoga', tr('Joga i medytacja', 'Yoga and meditation'), tr('Kundalini, Flow i praktyka łączona', 'Kundalini, Flow and a combined option')],
  ['/warsztaty/', 'workshops', tr('Warsztaty', 'Workshops'), tr('Spotkania i praca w grupie', 'Group sessions and shared practice')]
].map(([href, icon, title, text]) => `<a class="v2-practice" href="${href}"><span class="v2-practice-icon v2-practice-icon--${icon}"><img src="/assets/v2/icons/${icon}.svg" alt="" width="96" height="80" loading="lazy"></span><span class="v2-practice-title">${title}</span><span class="v2-practice-text">${text}</span>${arrow}</a>`).join('')}</nav>`;

// 13.11.2026: "O mnie" as a bento grid (variant B, chosen by the client over the earlier three-column layout,
// a type-led and a drenched-olive variant): content split into tiles of different size and colour weight.
function v2About() {
  return `<section id="o-mnie" class="v2-section v2-container v2-about" aria-label="${tr('O mnie', 'About me')}">
    <div class="v2-bento">
      <div class="v2-bento-tile v2-bento-title"><h2>${tr('Bliżej siebie.<br>Bliżej życia.', 'Closer to yourself.<br>Closer to life.')}</h2><p>${tr('Sesje 1:1, joga, medytacja i warsztaty. W jednym miejscu, w Twoim tempie.', '1:1 sessions, yoga, meditation and workshops. In one place, at your pace.')}</p></div>
      <figure class="v2-bento-tile v2-bento-portrait">${aboutPortrait()}</figure>
      <div class="v2-bento-tile v2-bento-intro"><div class="v2-bento-intro-head"><p class="v2-bento-lead">${tr('Jestem Agnieszka.', 'I\'m Agnieszka.')}</p><img class="v2-bento-intro-mark" src="/assets/v2/icons/intro-mark.svg" alt="" width="57" height="64" loading="lazy"></div>${aboutIntro().map((t, i) => `<p${i ? '' : ' class="v2-bento-statement"'}>${t}</p>`).join('')}</div>
      ${aboutGallery()}
      <div class="v2-bento-tile v2-bento-words"><span class="v2-bento-flower" aria-hidden="true"><img src="/assets/v2/ornaments/botanical-flower.svg" alt="" width="1059" height="1054" loading="lazy"></span><p>${tr('Ciało<i>.</i><br>Emocje<i>.</i><br>Uważność<i>.</i>', 'Body<i>.</i><br>Emotions<i>.</i><br>Mindfulness<i>.</i>')}</p></div>
      <div class="v2-bento-tile v2-bento-practices"><h3>${tr('Jak możemy pracować', 'How we can work together')}</h3>${aboutPractices()}</div>
    </div>
  </section>`;
}

// 18.11.2026: an answer reads in two levels. The first sentence is the point (larger, ink, medium weight); the rest supports it (regular,
// olive-tinted). The copy is only cut at the end of the first sentence, nothing is rewritten. No lookbehind (older iOS Safari rejects it).
function answerHtml(text) {
  const m = text.match(/^(.+?[.!?])\s+(?=[A-ZĄĆĘŁŃÓŚŹŻА-ЯІЇЄҐ„«])([\s\S]+)$/);
  return m ? `<p class="v2-answer-lead">${m[1]}</p><p class="v2-answer-more">${m[2]}</p>` : `<p class="v2-answer-lead">${text}</p>`;
}

// 18.11.2026: the Sesje 1:1 photo is a four-slide slider like the About bento (web-sized copies in assets/v2/gallery/).
// 23.11.2026: the slides are now the client's real session shoot (conversation, hands-on work, a koshi chime, singing bowl), JPEG q78-80 (~400-500 KB each, from ~6 MB originals).
const sessionGallery = () => galleryHtml([
  ['/assets/v2/gallery/sesje-talk.jpg', 1800, 1200, 'talk', tr('Rozmowa podczas sesji w jasnym gabinecie', 'A conversation during a session in a bright room')],
  ['/assets/v2/gallery/sesje-healing-wide.jpg', 1800, 1200, 'healing-wide', tr('Praca z dłońmi przy głowie klienta, w tle misy dźwiękowe i kwiaty', 'Hands-on work at the client\'s head, with singing bowls and flowers nearby')],
  ['/assets/v2/gallery/sesje-bowl.jpg', 1800, 1200, 'bowl', tr('Misa dźwiękowa w dłoniach podczas sesji', 'A singing bowl in hands during a session')],
  ['/assets/v2/gallery/sesje-chime.jpg', 1300, 1949, 'chime', tr('Dłoń trzymająca dzwonek koshi obok wazonu z kwiatami', 'A hand holding a koshi chime beside a vase of flowers')]
], 'v2-session-gallery', tr('Zdjęcia z sesji', 'Photos from sessions'));

function v2Sessions() {
  // 17.11.2026: four questions and answers (client copy) replace the two placeholder rows and the separate "Nie wiesz, który
  // kierunek wybrać?" note; the per-row "Zapytaj o sesję 1:1" links are gone, one general button sits with the headline (the single primary action); the four questions are a quiet reference list.
  // The Ukrainian text is a translation to be approved.
  const rows = [
    ['session-first', tr('Jak wygląda pierwszy krok?', 'How do I get started?'),
      tr('Skorzystaj z formularza i napisz krótko, z czym chcesz przyjść. Możesz opisać konkretną trudność albo po prostu zaznaczyć, że potrzebujesz rozmowy. Odezwę się do Ciebie, aby ustalić termin i odpowiedzieć na pytania przed pierwszą sesją.',
         'Use the form to share a little about what brings you here. You can describe a specific difficulty or simply say that you need someone to talk to. I\'ll get in touch to arrange a time and answer your questions before your first session.')],
    ['session-expect', tr('Czego możesz się spodziewać?', 'What can you expect?'),
      tr('Podczas spotkania przyglądamy się temu, co przeżywasz i jak wpływa to na Twoją codzienność. Rozmowa może dotyczyć emocji, relacji oraz tego, co odczuwasz w ciele. Nie musisz poruszać wszystkich tematów od razu. Jest miejsce na pytania, chwilę namysłu i przerwy, kiedy ich potrzebujesz.',
         'During a session, we explore what you are going through and how it affects your everyday life. We may talk about emotions, relationships and what you feel in your body. You don\'t have to cover everything at once. There is room for questions, time to reflect and breaks whenever you need them.')],
    ['session-format', tr('Format i szczegóły spotkania', 'Session format and details'),
      tr('Przed potwierdzeniem sesji ustalimy jej format, czas trwania i koszt. Otrzymasz też informacje organizacyjne potrzebne do udziału w spotkaniu. Wszystko będzie jasne z wyprzedzeniem, aby spokojnie zdecydować, czy proponowane warunki Ci odpowiadają.',
         'Before confirming your session, we will agree on the format, duration and cost. You will also receive the practical information you need to take part. Everything will be clear in advance, so you can take your time deciding whether the arrangements work for you.')],
    ['session-direction', tr('Nie wiesz, który kierunek wybrać?', 'Not sure where to start?'),
      tr('Nie musisz znać nazw metod ani od razu wybierać konkretnej usługi. Możesz zacząć od prostego: „Nie wiem, czego potrzebuję, ale chcę o tym porozmawiać”. Pomogę Ci przyjrzeć się dostępnym formom wsparcia i wybrać, od czego zacząć.',
         'You don\'t need to know the names of different methods or choose a specific service straight away. You can start with something as simple as: “I\'m not sure what I need, but I\'d like to talk about it.” I\'ll help you explore the available forms of support and decide where to begin.')]
  ];
  const faq = `<div class="v2-services accordion-group">${rows.map(([id, title, text], i) => detail(id, title, answerHtml(text)).replace('<details', i ? '<details' : '<details open')).join('')}</div>`;
  return `<section id="sesje" class="v2-section v2-container v2-sessions">
    <div class="v2-session-grid"><div class="v2-session-intro"><h2>${tr('Sesje 1:1', '1:1 sessions')}</h2><p>${tr('Rozmowa, uważność i miejsce na Twoje doświadczenie. W swoim tempie.', 'Conversation, mindfulness and space for your experience. At your own pace.')}</p>${bookButton(tr('Umówmy się na rozmowę', 'Let\'s arrange a chat'), 'session')}${sessionGallery()}</div>
      ${faq}</div>
  </section>`;
}

// 18.11.2026: Studio Jogi uses the same UI logic as Sesje 1:1 (header band, one button, photo slider + list side by side, soft rows
// with a plain fill hover, smooth accordion, two-level answers) on the dark olive section. The button keeps the existing wording
// "Zapytaj o praktykę" and opens the form with "I need help choosing"; the per-row buttons are gone.
// 23.11.2026: the Studio Jogi slider is the client's yoga shoot (DSC09385, 09351, 09319, 09397). Each photo is cropped on the model (body centred
// in a 1.2:1 frame) and saved at 1500 px wide, JPEG q80 (~380-500 KB each, from 5-42 MB originals), so object-position stays at the centre.
const yogaGallery = () => galleryHtml([
  ['/assets/v2/gallery/joga-gomukhasana.jpg', 1500, 1250, 'gomukhasana', tr('Agnieszka w pozycji jogi, dłonie złożone przed twarzą, na fioletowej macie', 'Agnieszka in a seated yoga pose with hands joined in front of her face, on a purple mat')],
  ['/assets/v2/gallery/joga-half-moon.jpg', 1500, 1250, 'half-moon', tr('Agnieszka w pozycji półksiężyca w jasnym studio', 'Agnieszka in a half-moon pose in a bright studio')],
  ['/assets/v2/gallery/joga-side-plank.jpg', 1500, 1250, 'side-plank', tr('Agnieszka w pozycji bocznej deski, portret w żółtym stroju', 'Agnieszka in a side plank, a close portrait in yellow activewear')],
  ['/assets/v2/gallery/joga-boat.jpg', 1500, 1250, 'boat', tr('Agnieszka w pozycji łodzi na macie, w ciepłym świetle', 'Agnieszka in boat pose on a mat in warm light')]
], 'v2-session-gallery', tr('Zdjęcia z praktyk jogi', 'Photos from yoga practices'));

function v2Yoga() {
  // Client copy (18.11.2026). The Ukrainian text is a translation to be approved.
  const answers = {
    kundalini: tr('Joga Kundalini łączy ruch, oddech i medytację. Podczas praktyki kierujemy uwagę na odczucia w ciele i to, co dzieje się w danej chwili. To propozycja dla osób, które chcą poznawać jogę także poprzez skupienie i świadomą pracę z oddechem.',
      'Kundalini yoga brings together movement, breathing and meditation. During practice, we pay attention to sensations in the body and what is happening in the present moment. It is an option for anyone who wants to explore yoga through focus and conscious breathing as well as movement.'),
    flow: tr('To płynne przechodzenie między pozycjami w rytmie oddechu. Poszczególne ruchy tworzą sekwencje, w których jest miejsce na aktywność, koncentrację i odpoczynek. Ta forma może być Ci bliska, jeśli lubisz poznawać ciało poprzez ruch.',
      'Flow yoga is a way of moving smoothly between poses in time with your breath. Individual movements form sequences with room for activity, focus and rest. This style may feel right for you if you enjoy getting to know your body through movement.'),
    combo: tr('To możliwość korzystania z obu form jogi. Możesz doświadczać płynnych sekwencji Flow oraz praktyk oddechowych i medytacyjnych Kundalini. Wybór dla osób, które chcą poznawać różne sposoby pracy z ciałem i rozwijać regularną praktykę.',
      'This option lets you take part in both forms of yoga. You can experience the flowing sequences of Flow alongside the breathing and meditation practices of Kundalini. It is a choice for anyone who wants to explore different ways of working with the body and build a regular practice.')
  };
  return `<section id="joga" class="v2-yoga"><div class="v2-container v2-section">
    <div class="v2-session-grid"><div class="v2-session-intro"><h2>${tr('Studio Jogi', 'Studio Jogi')}</h2><p>${tr('Ruch. Oddech. Obecność. Wybierz praktykę, która jest Ci bliska.', 'Movement. Breath. Presence. Choose a practice that feels right for you.')}</p>${bookButton(tr('Zapytaj o praktykę', 'Ask about classes'), 'help')}${yogaGallery()}</div>
      <div class="v2-services accordion-group">${['kundalini', 'flow', 'combo'].map((id, i) => detail('yoga-' + id, label(id), answerHtml(answers[id])).replace('<details', i ? '<details' : '<details open')).join('')}</div></div>
  </div></section>`;
}

function v2Upcoming() {
  // 19.11.2026: a full-width floral divider frames the section above and below (it sits outside the container so it runs edge to edge; the same strip, mirrored underneath so the dots face the content both times).
  const divider = pos => `<div class="v2-divider v2-divider--${pos}" aria-hidden="true"><img src="/assets/v2/ornaments/floral-divider.svg" alt="" width="1571" height="80"></div>`;
  return `${divider('top')}<section id="najblizsze" class="v2-section v2-container v2-upcoming">
    <div class="v2-section-top"><h2>${tr('Najbliższe wydarzenia', 'Upcoming events')}</h2><p>${tr('Najbliższe wydarzenia z kalendarza.<br>W prototypie — przykładowe dane w miejscu wtyczki.', 'Upcoming events from the calendar.<br>In this prototype, example data stands in for the calendar plugin.')}</p></div>
    <div class="v2-event-cards">${v2EventCards(events.filter(e => e.status !== 'ended'))}</div>
  </section>${divider('bottom')}`;
}

// 19.11.2026: Warsztaty uses the same UI logic as Sesje 1:1 (header band, one button, photo slider + list side by side, soft rows with a
// plain fill hover, smooth accordion, two-level answers). The five programs are the rows; each opens its short description and a quiet
// link to the program on /warsztaty/ (the rows used to be plain links). The old "Odkryj siebie — cykl 12 warsztatów" caption is gone with
// the single photo; the cycle is the first row's title. Photos are existing ones (no workshop photos yet), so some repeat other sections.
// 23.11.2026: the Warsztaty slider is the client's Goa shoot (SLK59081, SLK59346, SLK59383, "sample edit-2"), each cropped on the model to ~1.2:1
// and saved at 1500 px wide, JPEG q80 (~210-510 KB, from 1-17 MB originals).
const workshopGallery = () => galleryHtml([
  ['/assets/v2/gallery/warsztaty-goa-session.jpg', 1500, 1187, 'goa-session', tr('Rozmowa przy drewnianym stole w tropikalnym ogrodzie', 'A conversation at a wooden table in a tropical garden')],
  ['/assets/v2/gallery/warsztaty-goa-meditation.jpg', 1500, 1250, 'goa-meditation', tr('Agnieszka medytuje na macie wśród drzew nad morzem', 'Agnieszka meditating on a mat among trees by the sea')],
  ['/assets/v2/gallery/warsztaty-goa-twirl.jpg', 1500, 1250, 'goa-twirl', tr('Agnieszka w białej sukience tańczy na plaży', 'Agnieszka in a white dress twirling on the beach')],
  ['/assets/v2/gallery/warsztaty-goa-warrior.jpg', 1500, 1251, 'goa-warrior', tr('Agnieszka w głębokim przysiadzie na plaży o zachodzie słońca', 'Agnieszka in a deep squat on the beach at sunset')]
], 'v2-session-gallery', tr('Zdjęcia z warsztatów i praktyk', 'Photos from workshops and practices'));

function v2Workshops() {
  const list = `<div class="v2-services accordion-group">${programs.map((p, i) => detail('workshop-' + p.id, label(p.id), answerHtml(p[lang]) + `<a class="text-link" href="/warsztaty/#${p.id}">${tr('Zobacz program', 'View the programme')}</a>`).replace('<details', i ? '<details' : '<details open')).join('')}</div>`;
  return `<section id="warsztaty" class="v2-section v2-container v2-workshops">
    <div class="v2-session-grid"><div class="v2-session-intro"><h2>${tr('Warsztaty', 'Workshops')}</h2><p>${tr('Praktyka, refleksja i wspólne doświadczenie. Znajdź temat, który jest Ci teraz bliski.', 'Practice, reflection and shared experience. Find a topic that speaks to you right now.')}</p><a class="button" href="/warsztaty/">${tr('Poznaj warsztaty', 'Explore workshops')}${arrow}</a>${workshopGallery()}</div>
      ${list}</div>
  </section>`;
}

function v2School() {
  return `<section id="szkola" class="v2-school"><div class="v2-container v2-section">
    ${v2SectionLabel('05', 'Szkoła Klarowności', 'School of Clarity')}
    <div class="v2-school-grid"><div><h2>${tr('Zrób miejsce<br>na nowe.', 'Make space<br>for something new.')}</h2><p class="lead">${tr('Szkoła Klarowności', 'School of Clarity')}</p><p>${tr('Miejsce na głębszą praktykę i naukę. Napisz, jeśli chcesz otrzymać informacje o programie i kolejnych spotkaniach.', 'A space for deeper practice and learning. Get in touch if you\'d like information about the programme and upcoming sessions.')}</p>${bookButton(tr('Zapytaj o program', 'Ask about the programme'), 'school')}</div>${img('agnieszka-beach.jpg', tr('Agnieszka podczas praktyki na plaży', 'Agnieszka during a practice on the beach'))}</div>
  </div></section>`;
}

function v2EventsAndBlog() {
  return `<section id="wydarzenia" class="v2-section v2-container v2-all-events">
    ${v2SectionLabel('06', 'Wydarzenia', 'Events')}
    <div class="v2-section-top"><h2>${tr('Wspólne<br>doświadczenia.', 'Shared<br>experiences.')}</h2><p>${tr('Online, w studio i w swoim tempie.<br>Pokazane terminy są przykładowe.', 'Online, in the studio and at your own pace.<br>The dates shown are examples.')}</p></div>
    <div class="filter-row" aria-label="${tr('Filtruj wydarzenia', 'Filter events')}">${[['all', tr('Wszystkie', 'All')], ['online', 'Online'], ['studio', tr('W studio', 'In the studio')], ['ended', tr('Archiwum', 'Archive')]].map(([id, text]) => `<button class="filter ${id === 'all' ? 'active' : ''}" data-event-filter="${id}" aria-pressed="${id === 'all'}">${text}</button>`).join('')}</div>
    <div class="events-grid event-results">${events.map(e => eventCard(e)).join('')}</div>
  </section>
  <section id="blog" class="v2-section v2-container v2-blog">
    ${v2SectionLabel('07', 'Blog', 'Blog')}
    <div class="v2-section-top"><h2>${tr('Chwila na refleksję.', 'A moment for reflection.')}</h2><p>${tr('Teksty robocze.<br>Podgląd tematów z materiałów.', 'Draft texts.<br>A preview of topics from the source materials.')}</p></div>
    <div class="blog-grid">${[['joga.jpg', tr('Ruch, oddech i chwila dla siebie', 'Movement, breath and a moment for yourself')], ['brainspotting.jpg', tr('Jak przygotować się do pierwszej rozmowy', 'How to prepare for your first conversation')], ['agnieszka-meditation.jpg', tr('Uważność w codzienności', 'Mindfulness in everyday life')]].map(([photo, title], i) => `<button class="blog-card" data-info="article-${i}">${img(photo, title)}<span>${tr('Materiał w przygotowaniu', 'Content in preparation')}</span><h3>${title}</h3><span class="blog-arrow">${arrow}</span></button>`).join('')}</div>
  </section>`;
}

function v2Shop() {
  return `<section id="sklep" class="v2-section v2-container v2-shop">
    ${v2SectionLabel('05', 'Sklep', 'Shop')}
    <div class="v2-section-top"><h2>${tr('Dobre rzeczy<br>dla siebie.', 'Good things<br>for yourself.')}</h2><p>${tr('Materiały do praktyki i własnej refleksji.<br>Katalog pokazowy, bez zakupów online.', 'Materials for practice and personal reflection.<br>Demo catalogue, no online purchases.')}</p></div>
    <div class="shop-grid">${shopProducts('all', 3, 'h3')}</div>
    <a class="button v2-shop-cta" href="/sklep/">${tr('Zobacz sklep', 'Visit the shop')}${arrow}</a>
  </section>`;
}

// Client edit 12.11.2026: Szkoła Klarowności, Wydarzenia and Blog are hidden; v2School() and v2EventsAndBlog() stay for a possible return.
function homeSectionsV2() {
  // 19.11.2026: the Sklep block is off the home page (the shop stays in the header menu and at /sklep/). v2Shop() is kept so the block can return.
  return v2About() + v2Sessions() + v2Yoga() + v2Workshops() + v2Upcoming();
}

function contactV2() {
  // 20.11.2026: the headline "Porozmawiajmy." and the short note are replaced by one longer text (client copy) that carries the section as its
  // heading; the button stays. (The small line "Pierwszy krok może być prosty." above it was removed on 20.11.2026.) The English text is my translation, to be approved.
  return `<section id="kontakt" class="v2-contact"><div class="v2-container">
    <h2 data-magic>${tr('To miejsce dla Ciebie, jeśli chcesz lepiej zrozumieć siebie, porozmawiać o tym, co przeżywasz, albo znaleźć chwilę na oddech w codziennym pośpiechu. Pomogę Ci poznać dostępne możliwości i wyjaśnię, jak może wyglądać nasze spotkanie. Ważne są Twoje potrzeby, granice i tempo. Pierwszym krokiem może być zwykła rozmowa.',
      'This is a place for you if you want to understand yourself better, talk about what you are going through, or find a moment to breathe in the rush of everyday life. I will help you explore what is available and explain what our meeting might look like. What matters are your needs, your boundaries and your pace. The first step can simply be a conversation.')}</h2>
    ${bookButton(tr('Napisz do mnie', 'Get in touch'))}
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
  return `<nav class="hero-switch" aria-label="${tr('Wariant nagłówka na telefonie', 'Mobile hero headline variant')}"><span>Hero</span>${['a', 'b'].map(v => `<a href="?v=2&lang=${lang}&hero=${v}" data-hero-variant="${v}"${heroVariant === v ? ' aria-current="true"' : ''} aria-label="${tr('Wariant ', 'Variant ')}${v.toUpperCase()}">${v.toUpperCase()}</a>`).join('')}</nav>`;
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

// 18.11.2026: smooth accordion. In V2 a <details> opens and closes with an animated height (and a soft fade of its text) instead of
// snapping. The click on <summary> is taken over (preventDefault) and the open attribute is managed by hand: opening sets it first and
// animates 0 -> full height; closing animates back and removes it at the end. Inside an .accordion-group only one item stays open, and the
// others close with the same animation (the generic instant "close the others" handler in app.js is skipped for V2 while animating).
// Reduced motion keeps the native behaviour.
(function smoothAccordion() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const EASE = 'cubic-bezier(.16,1,.3,1)';
  const bodyOf = d => d.querySelector(':scope > .detail-body');
  const run = (d, from, to, ms, done) => {
    const body = bodyOf(d);
    if (!body) { done && done(); return; }
    if (d._anim) d._anim.cancel();
    body.style.overflow = 'hidden';
    const a = body.animate(
      [{ height: from.h + 'px', paddingBottom: from.p + 'px', opacity: from.o }, { height: to.h + 'px', paddingBottom: to.p + 'px', opacity: to.o }],
      { duration: ms, easing: EASE }
    );
    d._anim = a;
    const end = () => { if (d._anim === a) { d._anim = null; body.style.overflow = ''; done && done(); } };
    a.onfinish = end;
    a.oncancel = () => { if (d._anim === a) { d._anim = null; body.style.overflow = ''; } };
  };
  const openIt = d => {
    d.classList.remove('is-closing');
    const body = bodyOf(d);
    const from = { h: d._anim && body ? body.getBoundingClientRect().height : 0, p: 0, o: d._anim ? +getComputedStyle(body).opacity : 0 };
    d.open = true;
    if (!body) return;
    const full = body.scrollHeight, pad = parseFloat(getComputedStyle(body).paddingBottom) || 0;
    run(d, from, { h: full, p: pad, o: 1 }, 420);
    const group = d.closest('.accordion-group');
    if (group) group.querySelectorAll(':scope > details').forEach(o => { if (o !== d && o.open && !o.classList.contains('is-closing')) closeIt(o); });
  };
  const closeIt = d => {
    const body = bodyOf(d);
    if (!body) { d.open = false; return; }
    d.classList.add('is-closing');
    const h = body.getBoundingClientRect().height, pad = parseFloat(getComputedStyle(body).paddingBottom) || 0;
    run(d, { h, p: Math.min(pad, h), o: +getComputedStyle(body).opacity }, { h: 0, p: 0, o: 0 }, 320, () => { d.open = false; d.classList.remove('is-closing'); });
  };
  document.addEventListener('click', e => {
    const sum = e.target.closest('.version-two details > summary');
    if (!sum || reduce.matches) return;
    const d = sum.parentElement;
    e.preventDefault();
    (d.open && !d.classList.contains('is-closing')) ? closeIt(d) : openIt(d);
  }, true);
  // v2.js loads before app.js, so this listener runs first on the same target and phase.
  document.addEventListener('toggle', e => {
    if (!reduce.matches && e.target.matches && e.target.matches('.version-two details')) e.stopImmediatePropagation();
  }, true);
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

// 24.11.2026: parallax in the Warsztaty hero, the same depth logic as the home hero. The photo drifts slower than the page (it moves down by
// 20% of the scroll on desktop, 12% on phones), the huge "Warsztaty" word drifts up faster (-12% / -6%) and the lead row a little (-6% / -4%),
// so the word slides over the photo. The photo only moves down, so the strip it uncovers at the top lies above the viewport and needs no extra height. The texts use the `translate`
// property and the photo `transform`. Reduced motion keeps everything still.
(function pageHeroParallax() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const wide = matchMedia('(min-width: 601px)');
  const layers = [
    ['.v2-page-hero-photo', 0.2, 'transform', 0.12],
    ['h1', -0.12, 'translate', -0.06],
    ['.v2-page-hero-row', -0.06, 'translate', -0.04]
  ];
  let queued = false;
  const update = () => {
    queued = false;
    const hero = document.querySelector('.version-two .v2-page-hero.is-photo');
    if (!hero) return;
    const y = Math.max(0, -hero.getBoundingClientRect().top);
    if (y > hero.offsetHeight) return;
    for (const [sel, k, prop, kPhone] of layers) {
      const el = hero.querySelector(sel);
      if (!el) continue;
      const off = reduce.matches ? 0 : y * (wide.matches ? k : kPhone);
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
    // A late event from a pill that is no longer the active one (the visitor already picked another photo) must not advance again.
    const pill = e.target.closest('.v2-gallery-pill');
    if (pill && !pill.classList.contains('is-active')) return;
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

// 19.11.2026: the floral dividers are revealed by a noise dissolve (a paper-coloured veil tears away along a noise threshold, opening
// from the middle outward) the first time they scroll into view. Same technique as the "noise dissolve reveal" reference component, ported
// to plain WebGL2 (this site is static, no React). Without WebGL2 the strip fades in; with reduced motion, or without IntersectionObserver,
// it simply shows. Until the tear starts the veil covers the strip; once it has finished the canvas and its GL context are released.
(function dividerReveal() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const VS = `#version 300 es
in vec2 a_position; out vec2 v_uv;
void main(){ v_uv=(a_position+1.0)*0.5; gl_Position=vec4(a_position,0.0,1.0); }`;
  const FS = `#version 300 es
precision highp float;
in vec2 v_uv; out vec4 fragColor;
uniform vec2 u_res; uniform vec3 u_color; uniform float u_progress, u_scale, u_soft, u_bias, u_seed;
float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)+u_seed); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p), u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x), mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x), u.y); }
float fbm(vec2 p){ float s=0.0,a=0.5,n=0.0; for(int i=0;i<5;i++){ s+=a*noise(p); n+=a; p*=2.03; a*=0.5; } return s/n; }
void main(){
  vec2 p = (v_uv*u_res)/u_res.y;                       // height-normalised: islands stay round on a wide, thin strip
  float n = smoothstep(0.28,0.72,fbm(p*u_scale));      // pull the mid-range apart so the cut has defined islands
  float d = abs(v_uv.x-0.5)*2.0;                       // 0 at the middle, 1 at the ends
  float t = mix(-u_soft-0.02, 1.0+u_soft+0.02, u_progress);
  float thr = t*(1.0+u_bias) - u_bias*d;
  fragColor = vec4(u_color, smoothstep(thr-u_soft, thr+u_soft, n));
}`;
  const ease = t => { const p = Math.min(1, Math.max(0, t)); return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 2.4) / 2; };
  const paper = () => {
    const m = (getComputedStyle(document.getElementById('app') || document.body).backgroundColor || '').match(/\d+(\.\d+)?/g);
    return m && m.length >= 3 ? m.slice(0, 3).map(v => +v / 255) : [250 / 255, 247 / 255, 242 / 255];
  };
  const DELAY = 120, DURATION = 1800;

  function veil(box) {
    const canvas = document.createElement('canvas');
    canvas.className = 'v2-divider-veil';
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false, antialias: true });
    if (!gl) return null;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
    const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS), prog = gl.createProgram();
    if (!vs || !fs) return null;
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    const buf = gl.createBuffer(), pos = gl.getAttribLocation(prog, 'a_position');
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const U = n => gl.getUniformLocation(prog, n), seed = Math.random() * 100, color = paper();
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    box.appendChild(canvas);
    const draw = progress => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2), w = Math.max(1, Math.round(canvas.clientWidth * dpr)), h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h); gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(U('u_res'), w, h); gl.uniform3f(U('u_color'), color[0], color[1], color[2]);
      gl.uniform1f(U('u_progress'), progress); gl.uniform1f(U('u_scale'), 1.3); gl.uniform1f(U('u_soft'), 0.03);
      gl.uniform1f(U('u_bias'), 0.45); gl.uniform1f(U('u_seed'), seed);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    const release = () => { canvas.remove(); const ext = gl.getExtension('WEBGL_lose_context'); ext && ext.loseContext(); };
    return { draw, release };
  }

  function play(box, v) {
    if (!v) { box.classList.add('is-in'); box.dataset.reveal = 'done'; return; }
    box.dataset.reveal = 'running';
    const t0 = performance.now() + DELAY;
    const frame = now => {
      if (!box.isConnected) { v.release(); return; }
      const t = (now - t0) / DURATION;
      v.draw(t <= 0 ? 0 : ease(t));
      if (t >= 1) { v.release(); box.dataset.reveal = 'done'; } else requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(list => list.forEach(en => {
    if (!en.isIntersecting) return;
    io.unobserve(en.target);
    play(en.target, en.target._veil);
  }), { threshold: 0.6 }) : null;

  function prepare(box) {
    box.dataset.reveal = 'pending';
    // Hidden by CSS (the strips are switched off for now): no veil, no GL context, no observer.
    if (reduce.matches || !io || getComputedStyle(box).display === 'none') { box.dataset.reveal = 'done'; return; }
    const v = veil(box);
    if (v) { box._veil = v; requestAnimationFrame(() => v.draw(0)); } else box.classList.add('is-fade');
    io.observe(box);
  }
  const scan = () => document.querySelectorAll('.v2-divider:not([data-reveal])').forEach(prepare);
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();

// 20.11.2026: "Magic Text" (Preet Suthar, HextaUI, MIT; on 21st.dev) for the contact text, in plain JS: every word has a faint base layer (20%) and a
// fill layer whose opacity follows the scroll, word after word (softened: a word fades over several words' worth of scroll, with easing and a smoothed progress), so the text "reads itself in" as the block rises through the screen. The original
// is React + motion (useScroll, offset "start 0.9" to "start 0.25"); here the progress is the same: 0 when the block's top is at 90% of the viewport
// height, 1 when it reaches 25%. If the page cannot scroll that far (the block sits above a tall footer) the end point is the lowest the block can get,
// so the text always finishes. Screen readers get the plain sentence once (the word layers are aria-hidden); no JS or reduced motion shows the plain text.
(function magicText() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const items = new Set();
  let ticking = false;
  const clamp = v => Math.min(1, Math.max(0, v));
  // Softer reveal (20.11.2026): a word fades over a window of SOFT words instead of one, so the edge of the text is a soft gradient of several words
  // rather than a hard line; the opacity is eased (smoothstep) and the progress itself is smoothed (it chases the scroll position a little late),
  // so quick scrolling never makes words pop.
  const SOFT = 7, TAU = 130;   // TAU: ms for the progress to cover about 63% of the gap to the scroll position (frame-rate independent)
  let lastT = null;
  function update(now) {
    ticking = false;
    const dt = lastT === null ? 16 : Math.min(400, now - lastT);
    const chase = 1 - Math.exp(-dt / TAU);
    lastT = now;
    const vh = innerHeight;
    let moving = false;
    items.forEach(it => {
      if (!it.el.isConnected) { items.delete(it); return; }
      const top = it.el.getBoundingClientRect().top;
      const docTop = top + scrollY;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
      const start = vh * 0.9;
      const end = Math.max(vh * 0.25, docTop - maxScroll + 24);   // lowest reachable position, if the page ends first
      const target = clamp((start - top) / Math.max(1, start - Math.min(end, start - 1)));
      if (it.cur === undefined) it.cur = target;
      const diff = target - it.cur;
      it.cur = Math.abs(diff) < 0.0008 ? target : it.cur + diff * chase;
      if (it.cur !== target) moving = true;
      const n = it.words.length, head = it.cur * (n + SOFT);
      it.words.forEach((w, i) => { const o = clamp((head - i) / SOFT); w.style.setProperty('--o', (o * o * (3 - 2 * o)).toFixed(3)); });
    });
    if (moving) request(); else lastT = null;
  }
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  function prepare(el) {
    el.dataset.magic = 'ready';
    if (reduce.matches) return;
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    const plain = document.createElement('span');
    plain.className = 'visually-hidden';
    plain.textContent = text;
    const frag = document.createDocumentFragment();
    frag.appendChild(plain);
    const words = [];
    text.split(' ').forEach((word, i, all) => {
      const w = document.createElement('span');
      w.className = 'v2-magic-word';
      w.setAttribute('aria-hidden', 'true');
      w.style.setProperty('--o', '0');
      w.innerHTML = '<span class="v2-magic-base"></span><span class="v2-magic-fill"></span>';
      w.firstChild.textContent = word; w.lastChild.textContent = word;
      frag.appendChild(w);
      if (i < all.length - 1) frag.appendChild(document.createTextNode(' '));
      words.push(w);
    });
    el.textContent = '';
    el.appendChild(frag);
    items.add({ el, words });
    request();
  }
  const scan = () => document.querySelectorAll('[data-magic]:not([data-magic="ready"])').forEach(prepare);
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();

// 20.11.2026: the turning flower in the top-right corner of the footer (the one from the "O mnie" tile) fades in when the footer comes into view.
// The hidden starting state is only applied by this script, so without JS or with reduced motion the flower just shows.
(function footerFlower() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(list => list.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }), { threshold: 0.2 }) : null;
  const scan = () => document.querySelectorAll('.footer-flower:not([data-fade])').forEach(el => {
    el.dataset.fade = '1';
    if (reduce.matches || !io) return;
    el.classList.add('is-armed');
    io.observe(el);
  });
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();

// 20.11.2026: a minimal appearing animation for the home-page blocks while scrolling: each block fades in and rises 18px (0.9s, soft ease-out) the
// first time it comes into view. Blocks that enter together (a row of cards, a list) follow each other 70ms apart. Only blocks that are still below
// the visible area when the page is built are touched, so nothing flashes on load or on a language switch; the hidden starting state is applied by
// this script only, so without JS or with reduced motion everything is simply visible. The animation is a keyframe animation (fill "backwards"), so
// it leaves no transform behind and hover effects (card lift, soft rows) keep working.
(function revealOnScroll() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const SELECTOR = [
    '.v2-bento > .v2-bento-tile',
    '.v2-sessions .v2-session-intro > h2', '.v2-sessions .v2-session-intro > p', '.v2-sessions .v2-session-intro > .button', '.v2-sessions .v2-session-gallery', '.v2-sessions .v2-services > details',
    '.v2-yoga .v2-session-intro > h2', '.v2-yoga .v2-session-intro > p', '.v2-yoga .v2-session-intro > .button', '.v2-yoga .v2-session-gallery', '.v2-yoga .v2-services > details',
    '.v2-workshops .v2-session-intro > h2', '.v2-workshops .v2-session-intro > p', '.v2-workshops .v2-session-intro > .button', '.v2-workshops .v2-session-gallery', '.v2-workshops .v2-services > details',
    '.v2-upcoming .v2-section-top', '.v2-upcoming .v2-event-card',
    '.v2-contact .button',
    // 24.11.2026: /warsztaty/ — the programme list rows (staggered) and each programme band come in like the home blocks do
    '.version-two .program-jumps a', '.version-two .program-section'
  ].join(',');
  if (reduce.matches || !('IntersectionObserver' in window)) return;
  // Fix 20.11.2026 (events block): blocks start as soon as their top edge enters the screen (threshold 0, not 12% of a tall card), and the event
  // cards wait (at most 700ms) until their photos are decoded, so the photos never pop in after the card. The photos are lazy images, so a second
  // observer switches them to eager loading when the cards are still ~1.6 screens away.
  const decoded = el => {
    const imgs = [...el.querySelectorAll('img')];
    if (!imgs.length) return Promise.resolve();
    return Promise.race([Promise.all(imgs.map(i => (i.decode ? i.decode() : Promise.resolve()).catch(() => {}))), new Promise(r => setTimeout(r, 700))]);
  };
  const io = new IntersectionObserver(list => {
    // Blocks the visitor has already scrolled past without them ever being seen (an anchor jump, a fast flick) are shown at once, so scrolling back up
    // never meets an empty gap.
    list.filter(en => !en.isIntersecting && en.boundingClientRect.bottom < 0).forEach(en => { en.target.classList.remove('rv-armed'); io.unobserve(en.target); });
    const entering = list.filter(en => en.isIntersecting).sort((a, b) => (a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1);
    entering.forEach((en, i) => {
      const el = en.target;
      io.unobserve(el);
      el.style.setProperty('--rv-d', Math.min(i, 6) * 0.1 + 's');
      const go = () => {
        el.classList.add('rv-in');
        const done = e => { if (e.target !== el) return; el.removeEventListener('animationend', done); el.classList.remove('rv-armed', 'rv-in'); el.style.removeProperty('--rv-d'); };
        el.addEventListener('animationend', done);
      };
      el.matches('.v2-event-card, .program-section') ? decoded(el).then(go) : go();
    });
  }, { threshold: 0, rootMargin: '0px 0px -3% 0px' });
  const preload = 'IntersectionObserver' in window ? new IntersectionObserver(list => list.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
    preload.unobserve(en.target);
  }), { rootMargin: '0px 0px 160% 0px' }) : null;
  const scan = () => {
    const vh = innerHeight;
    document.querySelectorAll(SELECTOR).forEach(el => {
      if (el.dataset.rv) return;
      el.dataset.rv = '1';
      if (el.getBoundingClientRect().top < vh * 0.94) return;   // already in view (or above): leave it alone
      el.classList.add('rv-armed');
      io.observe(el);
    });
    document.querySelectorAll('.v2-event-cards:not([data-preload]), .programs:not([data-preload])').forEach(el => { el.dataset.preload = '1'; preload && preload.observe(el); });
  };
  // IntersectionObserver is silent for a block that goes from below the screen to above it between two frames, so a light scroll sweep shows such
  // blocks (never seen, now above the viewport) without animation.
  let sweeping = false;
  addEventListener('scroll', () => {
    if (sweeping) return;
    sweeping = true;
    requestAnimationFrame(() => {
      sweeping = false;
      document.querySelectorAll('.rv-armed:not(.rv-in)').forEach(el => { if (el.getBoundingClientRect().bottom < 0) { el.classList.remove('rv-armed'); io.unobserve(el); } });
    });
  }, { passive: true });
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();

// 20.11.2026: "Vertical Cut Reveal" (Daniel Petho, 21st.dev) on the footer statement, in plain JS. The text is split by characters, but the characters of
// a word stay in one non-breaking word container (so a wrapping line never breaks a word). Every character sits in an overflow:hidden mask and its inner
// span slides up from below (translateY 115% -> 0) with a spring ease (the demo's stiffness 200 / damping 21, sampled into a CSS linear() curve), each
// character 25ms after the previous one (staggerFrom "first"); the second line starts 0.45s after the first. It plays once, when the footer text
// comes into view. Without JS or with reduced motion the plain text shows; the masks are padded so diacritics and descenders are never clipped.
(function verticalCutReveal() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const STAGGER = 0.025, LINE_DELAY = 0.45;
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(list => list.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('vcr-in'); io.unobserve(en.target); }
  }), { threshold: 0.35 }) : null;
  function prepare(el) {
    el.dataset.vcr = 'ready';
    if (reduce.matches || !io) return;
    const lines = el.innerHTML.split(/<br\s*\/?>/i).map(s => s.replace(/<[^>]*>/g, '').trim()).filter(Boolean);
    el.textContent = '';
    lines.forEach((line, li) => {
      const row = document.createElement('span');
      row.className = 'vcr-line';
      let n = 0;
      line.split(' ').forEach((word, wi, all) => {
        const w = document.createElement('span');
        w.className = 'vcr-word';
        Array.from(word).forEach(ch => {
          const outer = document.createElement('span'), inner = document.createElement('span');
          outer.className = 'vcr-char';
          inner.textContent = ch;
          inner.style.animationDelay = (li * LINE_DELAY + n * STAGGER).toFixed(3) + 's';
          n++;
          outer.appendChild(inner);
          w.appendChild(outer);
        });
        row.appendChild(w);
        if (wi < all.length - 1) row.appendChild(document.createTextNode(' '));
      });
      el.appendChild(row);
    });
    el.classList.add('vcr-armed');
    io.observe(el);
  }
  const scan = () => document.querySelectorAll('.footer-statement:not([data-vcr])').forEach(prepare);
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();

// 21.11.2026: pause the Studio Jogi gradient while the band is off screen (it repaints a large area every frame while it turns).
(function jogiGradientPause() {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(list => list.forEach(en => en.target.classList.toggle('is-offscreen', !en.isIntersecting)), { rootMargin: '100px 0px' });
  const seen = new WeakSet();
  const scan = () => document.querySelectorAll('.v2-yoga, .version-two .program-section').forEach(el => { if (!seen.has(el)) { seen.add(el); io.observe(el); } });
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();

