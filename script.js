const pageTitle = document.getElementById('pageTitle');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.page-section');
const portalTabs = document.querySelectorAll('.portal-tab');
const portalPanels = document.querySelectorAll('.portal-panel');
const flashcard = document.getElementById('flashcard');
const notesList = document.getElementById('notesList');
const todoList = document.getElementById('todoList');
const noteForm = document.getElementById('noteForm');
const todoForm = document.getElementById('todoForm');

const appData = {
  notes: JSON.parse(localStorage.getItem('school-notes') || JSON.stringify([
    { title: 'Mathe', text: 'Wiederhole Funktionen und Ableitungen für die nächste Stunde.' },
    { title: 'Deutsch', text: 'Textstelle zu „Die Verwandlung“ markieren und zusammenfassen.' },
    { title: 'Biologie', text: 'Zellorganellen erneut anschauen und Merksätze üben.' }
  ])),
  todos: JSON.parse(localStorage.getItem('school-todos') || JSON.stringify([
    { id: 1, text: 'Mathe-Aufgaben S. 42–45', done: false },
    { id: 2, text: 'Deutsch-Lektüre lesen', done: true },
    { id: 3, text: 'Präsentation vorbereiten', done: false }
  ]))
};

const flashcards = [
  {
    question: 'Was ist eine Funktion in der Mathematik?',
    answer: 'Eine Funktion ordnet jedem Eingangswert genau einen Ausgangswert zu.'
  },
  {
    question: 'Welche Form hat eine lineare Funktion?',
    answer: 'Sie hat die Form y = mx + b.'
  },
  {
    question: 'Was ist das Ziel einer Textanalyse?',
    answer: 'Die Bedeutung, Struktur und Absichten eines Textes zu verstehen.'
  },
  {
    question: 'Nenne die drei wichtigsten Zellbestandteile.',
    answer: 'Zellmembran, Zellplasma und Zellkern.'
  }
];

let flashcardIndex = 0;
let flashcardFlipped = false;

function setActiveSection(targetId) {
  sections.forEach((section) => {
    const active = section.id === targetId;
    section.classList.toggle('active', active);
  });

  navItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.target === targetId);
  });

  const titleMap = {
    overview: 'Übersicht',
    portal: 'Schulportal',
    timetable: 'Stundenplan',
    calendar: 'Kalender',
    notes: 'Notizen',
    flashcards: 'Karteikarten',
    files: 'Dateien',
    tasks: 'Todos',
    ai: 'KI'
  };

  pageTitle.textContent = titleMap[targetId] || 'Übersicht';
}

navItems.forEach((item) => {
  item.addEventListener('click', () => setActiveSection(item.dataset.target));
});

portalTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    portalTabs.forEach((button) => button.classList.toggle('active', button === tab));
    portalPanels.forEach((panel) => {
      const active = panel.id === tab.dataset.portalTab;
      panel.classList.toggle('active', active);
    });
  });
});

function renderNotes() {
  notesList.innerHTML = '';

  appData.notes.forEach((note) => {
    const item = document.createElement('article');
    item.className = 'note-item';
    item.innerHTML = `
      <h4>${note.title}</h4>
      <p>${note.text}</p>
    `;
    notesList.appendChild(item);
  });
}

function renderTodos() {
  todoList.innerHTML = '';

  appData.todos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = `todo-item ${todo.done ? 'completed' : ''}`;
    item.innerHTML = `
      <label>
        <input type="checkbox" ${todo.done ? 'checked' : ''} data-id="${todo.id}" />
        <span>${todo.text}</span>
      </label>
      <button class="remove-todo" data-id="${todo.id}">×</button>
    `;
    todoList.appendChild(item);
  });

  todoList.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      const id = Number(event.target.dataset.id);
      const todo = appData.todos.find((item) => item.id === id);
      if (todo) {
        todo.done = event.target.checked;
        localStorage.setItem('school-todos', JSON.stringify(appData.todos));
        renderTodos();
      }
    });
  });

  todoList.querySelectorAll('.remove-todo').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      appData.todos = appData.todos.filter((item) => item.id !== id);
      localStorage.setItem('school-todos', JSON.stringify(appData.todos));
      renderTodos();
    });
  });
}

noteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('noteTitle').value.trim();
  const text = document.getElementById('noteText').value.trim();

  if (!title || !text) return;

  appData.notes.unshift({ title, text });
  localStorage.setItem('school-notes', JSON.stringify(appData.notes));
  noteForm.reset();
  renderNotes();
});

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.getElementById('todoInput');
  const text = input.value.trim();

  if (!text) return;

  appData.todos.push({ id: Date.now(), text, done: false });
  localStorage.setItem('school-todos', JSON.stringify(appData.todos));
  input.value = '';
  renderTodos();
});

function renderFlashcard() {
  const card = flashcards[flashcardIndex];
  const front = flashcard.querySelector('.front h3');
  const back = flashcard.querySelector('.back p');
  front.textContent = card.question;
  back.textContent = card.answer;
  flashcard.classList.toggle('flipped', flashcardFlipped);
}

document.getElementById('flipCard').addEventListener('click', () => {
  flashcardFlipped = !flashcardFlipped;
  flashcard.classList.toggle('flipped', flashcardFlipped);
});

document.getElementById('nextCard').addEventListener('click', () => {
  flashcardIndex = (flashcardIndex + 1) % flashcards.length;
  flashcardFlipped = false;
  renderFlashcard();
});

renderNotes();
renderTodos();
renderFlashcard();
setActiveSection('overview');

setInterval(() => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const day = now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
  const title = document.querySelector('.eyebrow');
  if (title) title.textContent = `Heute • ${day} • ${hours}:${minutes}`;
}, 60000);
