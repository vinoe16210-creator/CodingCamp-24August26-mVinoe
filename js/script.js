document.addEventListener('DOMContentLoaded', () => {
  // --- TEMA (DARK / LIGHT MODE) ---
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  let isDarkMode = localStorage.getItem('theme') === 'dark';

  function applyTheme() {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      themeToggleBtn.textContent = '☀️ Light Mode';
    } else {
      document.body.classList.remove('dark-mode');
      themeToggleBtn.textContent = '🌙 Dark Mode';
    }
  }

  themeToggleBtn.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    applyTheme();
  });
  applyTheme();

  // --- REAL-TIME CLOCK & GREETING ---
  const clockEl = document.getElementById('clock');
  const dateEl = document.getElementById('date');
  const greetingEl = document.getElementById('greeting');
  const usernameInput = document.getElementById('usernameInput');
  const saveNameBtn = document.getElementById('saveNameBtn');

  function updateClock() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('id-ID');

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);

    const hours = now.getHours();
    let timeGreeting = 'Good Evening';
    if (hours < 12) timeGreeting = 'Good Morning';
    else if (hours < 18) timeGreeting = 'Good Afternoon';

    const savedName = localStorage.getItem('username') || '';
    greetingEl.textContent = savedName ? `${timeGreeting}, ${savedName}` : timeGreeting;
  }

  saveNameBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    localStorage.setItem('username', name);
    updateClock();
    usernameInput.value = '';
  });

  setInterval(updateClock, 1000);
  updateClock();

  // --- FOCUS TIMER ---
  let timerInterval = null;
  let totalSeconds = 25 * 60;
  const timerDisplay = document.getElementById('timerDisplay');
  const startTimerBtn = document.getElementById('startTimerBtn');
  const stopTimerBtn = document.getElementById('stopTimerBtn');
  const resetTimerBtn = document.getElementById('resetTimerBtn');
  const setTimerBtn = document.getElementById('setTimerBtn');
  const customMinutesInput = document.getElementById('customMinutes');

  function updateTimerDisplay() {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  startTimerBtn.addEventListener('click', () => {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        alert('Focus Session Completed!');
      }
    }, 1000);
  });

  stopTimerBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
  });

  resetTimerBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    const customVal = parseInt(customMinutesInput.value, 10) || 25;
    totalSeconds = customVal * 60;
    updateTimerDisplay();
  });

  setTimerBtn.addEventListener('click', () => {
    const customVal = parseInt(customMinutesInput.value, 10);
    if (customVal && customVal > 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      totalSeconds = customVal * 60;
      updateTimerDisplay();
    }
  });
  updateTimerDisplay();

  // --- TASK MANAGER (TO-DO LIST) ---
  const todoForm = document.getElementById('todoForm');
  const todoInput = document.getElementById('todoInput');
  const todoListEl = document.getElementById('todoList');
  const sortSelect = document.getElementById('sortSelect');
  let todos = JSON.parse(localStorage.getItem('todos')) || [];

  function saveAndRenderTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
  }

  function renderTodos() {
    todoListEl.innerHTML = '';

    let displayedTodos = [...todos];
    const sortVal = sortSelect.value;
    if (sortVal === 'alpha') {
      displayedTodos.sort((a, b) => a.text.localeCompare(b.text));
    } else if (sortVal === 'status') {
      displayedTodos.sort((a, b) => a.completed - b.completed);
    }

    displayedTodos.forEach((todo) => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

      const leftDiv = document.createElement('div');
      leftDiv.className = 'todo-left';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.addEventListener('change', () => {
        todo.completed = checkbox.checked;
        saveAndRenderTodos();
      });

      const span = document.createElement('span');
      span.textContent = todo.text;

      leftDiv.appendChild(checkbox);
      leftDiv.appendChild(span);

      const delBtn = document.createElement('button');
      delBtn.className = 'btn-delete';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => {
        todos = todos.filter(t => t.id !== todo.id);
        saveAndRenderTodos();
      });

      li.appendChild(leftDiv);
      li.appendChild(delBtn);
      todoListEl.appendChild(li);
    });
  }

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text) return;

    // Challenge: Mencegah Tugas Duplikat
    const isDuplicate = todos.some(t => t.text.toLowerCase() === text.toLowerCase());
    if (isDuplicate) {
      alert('Tugas ini sudah ada!');
      return;
    }

    todos.push({ id: Date.now(), text, completed: false });
    todoInput.value = '';
    saveAndRenderTodos();
  });

  sortSelect.addEventListener('change', renderTodos);
  renderTodos();

  // --- QUICK BOOKMARKS ---
  const linkForm = document.getElementById('linkForm');
  const linkNameInput = document.getElementById('linkNameInput');
  const linkUrlInput = document.getElementById('linkUrlInput');
  const quickLinksContainer = document.getElementById('quickLinksContainer');
  let quickLinks = JSON.parse(localStorage.getItem('quickLinks')) || [
    { id: 1, name: 'Google', url: 'https://google.com' }
  ];

  function saveAndRenderLinks() {
    localStorage.setItem('quickLinks', JSON.stringify(quickLinks));
    renderLinks();
  }

  function renderLinks() {
    quickLinksContainer.innerHTML = '';
    quickLinks.forEach((link) => {
      const chip = document.createElement('div');
      chip.className = 'bookmark-chip';

      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.textContent = link.name;
      a.style.color = 'inherit';
      a.style.textDecoration = 'none';

      const delBtn = document.createElement('button');
      delBtn.textContent = '✕';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        quickLinks = quickLinks.filter(l => l.id !== link.id);
        saveAndRenderLinks();
      });

      chip.appendChild(a);
      chip.appendChild(delBtn);
      quickLinksContainer.appendChild(chip);
    });
  }

  linkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = linkNameInput.value.trim();
    let url = linkUrlInput.value.trim();

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    quickLinks.push({ id: Date.now(), name, url });
    linkNameInput.value = '';
    linkUrlInput.value = '';
    saveAndRenderLinks();
  });

  renderLinks();
});