// ─── Code Templates ───────────────────────────────────────────────────────────

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  code: string;
}

export const templates: CodeTemplate[] = [
  {
    id: "dom-manipulation",
    name: "DOM Manipulation",
    description: "Basic DOM creation and styling",
    icon: "🎨",
    code: `// DOM Manipulation Demo
const container = document.createElement('div');
container.id = 'app';
container.style.cssText = 'padding: 20px; font-family: system-ui;';

const heading = document.createElement('h1');
heading.textContent = 'Hello, JS Debug Playground!';
heading.style.cssText = 'color: #6366f1; margin-bottom: 16px;';

const paragraph = document.createElement('p');
paragraph.textContent = 'This demo shows basic DOM manipulation.';
paragraph.style.color = '#94a3b8';

const list = document.createElement('ul');
list.style.cssText = 'list-style: none; padding: 0;';

const items = ['Create elements', 'Set styles', 'Append to DOM'];
items.forEach((text, i) => {
  const li = document.createElement('li');
  li.textContent = \`\${i + 1}. \${text}\`;
  li.style.cssText = 'padding: 8px 12px; margin: 4px 0; background: #1e1b4b; border-radius: 6px; color: #c7d2fe;';
  list.appendChild(li);
});

container.appendChild(heading);
container.appendChild(paragraph);
container.appendChild(list);
document.body.appendChild(container);

console.log('DOM created successfully!');
console.log('Elements added:', items.length);
`,
  },
  {
    id: "event-handling",
    name: "Event Handling",
    description: "Click events and handlers",
    icon: "🖱️",
    code: `// Event Handling Demo
const app = document.createElement('div');
app.style.cssText = 'padding: 20px; font-family: system-ui;';

const title = document.createElement('h2');
title.textContent = 'Event Handling Demo';
title.style.color = '#6366f1';

const counter = document.createElement('div');
counter.id = 'counter';
counter.style.cssText = 'font-size: 48px; font-weight: bold; color: #c7d2fe; margin: 20px 0;';
counter.textContent = '0';

let count = 0;

const btnContainer = document.createElement('div');
btnContainer.style.cssText = 'display: flex; gap: 10px;';

const incrementBtn = document.createElement('button');
incrementBtn.textContent = '+ Increment';
incrementBtn.style.cssText = 'padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;';

const decrementBtn = document.createElement('button');
decrementBtn.textContent = '- Decrement';
decrementBtn.style.cssText = 'padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;';

const resetBtn = document.createElement('button');
resetBtn.textContent = '↺ Reset';
resetBtn.style.cssText = 'padding: 10px 20px; background: #525252; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;';

incrementBtn.addEventListener('click', () => {
  count++;
  counter.textContent = String(count);
  console.log('Incremented to:', count);
});

decrementBtn.addEventListener('click', () => {
  count--;
  counter.textContent = String(count);
  console.log('Decremented to:', count);
});

resetBtn.addEventListener('click', () => {
  count = 0;
  counter.textContent = '0';
  console.log('Counter reset');
});

btnContainer.appendChild(incrementBtn);
btnContainer.appendChild(decrementBtn);
btnContainer.appendChild(resetBtn);

app.appendChild(title);
app.appendChild(counter);
app.appendChild(btnContainer);
document.body.appendChild(app);

console.log('Event handlers attached!');
`,
  },
  {
    id: "todo-app",
    name: "Todo List App",
    description: "Interactive todo list with state",
    icon: "✅",
    code: `// Todo List App
const app = document.createElement('div');
app.style.cssText = 'padding: 20px; font-family: system-ui; max-width: 400px;';

const title = document.createElement('h2');
title.textContent = '📋 Todo List';
title.style.cssText = 'color: #6366f1; margin-bottom: 16px;';

const form = document.createElement('div');
form.style.cssText = 'display: flex; gap: 8px; margin-bottom: 16px;';

const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Add a task...';
input.style.cssText = 'flex: 1; padding: 10px; border: 1px solid #334155; background: #1e293b; color: #e2e8f0; border-radius: 6px; font-size: 14px;';

const addBtn = document.createElement('button');
addBtn.textContent = 'Add';
addBtn.style.cssText = 'padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer;';

const todoList = document.createElement('ul');
todoList.style.cssText = 'list-style: none; padding: 0;';

let todos = [];

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.style.cssText = 'display: flex; align-items: center; gap: 8px; padding: 10px; margin: 4px 0; background: #1e293b; border-radius: 6px;';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => {
      todos[index].done = !todos[index].done;
      renderTodos();
      console.log(\`Task "\${todo.text}" marked as \${todos[index].done ? 'done' : 'undone'}\`);
    });

    const span = document.createElement('span');
    span.textContent = todo.text;
    span.style.cssText = \`flex: 1; color: \${todo.done ? '#64748b' : '#e2e8f0'}; text-decoration: \${todo.done ? 'line-through' : 'none'};\`;

    const delBtn = document.createElement('button');
    delBtn.textContent = '✕';
    delBtn.style.cssText = 'background: #991b1b; color: white; border: none; border-radius: 4px; cursor: pointer; padding: 4px 8px;';
    delBtn.addEventListener('click', () => {
      console.log(\`Deleted: "\${todo.text}"\`);
      todos.splice(index, 1);
      renderTodos();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    todoList.appendChild(li);
  });
}

addBtn.addEventListener('click', () => {
  if (input.value.trim()) {
    todos.push({ text: input.value.trim(), done: false });
    console.log(\`Added task: "\${input.value.trim()}"\`);
    input.value = '';
    renderTodos();
  }
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

form.appendChild(input);
form.appendChild(addBtn);
app.appendChild(title);
app.appendChild(form);
app.appendChild(todoList);
document.body.appendChild(app);

console.log('Todo app initialized!');
`,
  },
  {
    id: "animation-loop",
    name: "Animation Loop",
    description: "Canvas animation with requestAnimationFrame",
    icon: "🎬",
    code: `// Animation Loop Demo
const app = document.createElement('div');
app.style.cssText = 'padding: 20px; font-family: system-ui;';

const title = document.createElement('h2');
title.textContent = '🎬 Animation Demo';
title.style.color = '#6366f1';

const canvas = document.createElement('canvas');
canvas.width = 350;
canvas.height = 200;
canvas.style.cssText = 'border: 1px solid #334155; border-radius: 8px; background: #0f172a;';

const ctx = canvas.getContext('2d');
const particles = [];

for (let i = 0; i < 30; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 4 + 1,
    dx: (Math.random() - 0.5) * 2,
    dy: (Math.random() - 0.5) * 2,
    color: \`hsl(\${Math.random() * 60 + 230}, 80%, 65%)\`,
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });

  // Draw connections
  particles.forEach((a, i) => {
    particles.slice(i + 1).forEach(b => {
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 80) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = \`rgba(99, 102, 241, \${1 - dist / 80})\`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  });

  requestAnimationFrame(animate);
}

animate();
console.log('Animation started with', particles.length, 'particles');

app.appendChild(title);
app.appendChild(canvas);
document.body.appendChild(app);
`,
  },
  {
    id: "buggy-code",
    name: "Buggy Code (Test)",
    description: "Intentional bugs for detection testing",
    icon: "🐛",
    code: `// ⚠️ Buggy Code - Test the Bug Detector!

// Bug 1: Unused variable
const unusedConfig = { theme: 'dark', lang: 'en' };

// Bug 2: DOM manipulation inside a loop
const container = document.createElement('div');
container.style.cssText = 'padding: 20px; font-family: system-ui;';

const title = document.createElement('h2');
title.textContent = '🐛 Buggy Code Demo';
title.style.color = '#ef4444';
container.appendChild(title);

for (let i = 0; i < 10; i++) {
  // Bad: innerHTML inside loop
  container.innerHTML += \`<p style="color: #94a3b8;">Item \${i}</p>\`;
}

// Bug 3: Multiple event listeners on same element
const btn = document.createElement('button');
btn.textContent = 'Click Me';
btn.id = 'main-btn';
btn.style.cssText = 'padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer; margin: 10px 0;';

btn.addEventListener('click', () => console.log('Handler 1'));
btn.addEventListener('click', () => console.log('Handler 2'));
btn.addEventListener('click', () => console.log('Handler 3'));

// Bug 4: Missing null check
const result = document.querySelector('#nonexistent');
// result.textContent = 'Found it!'; // Would crash!
console.warn('querySelector returned:', result);

// Bug 5: Using document.write
// document.write('<p>Bad practice!</p>');

container.appendChild(btn);
document.body.appendChild(container);

console.log('Buggy code executed - check the Suggestions panel!');
console.warn('This code has intentional anti-patterns');
`,
  },
  {
    id: "fetch-api",
    name: "Form Validation",
    description: "Interactive form with validation",
    icon: "📝",
    code: `// Form Validation Demo
const app = document.createElement('div');
app.style.cssText = 'padding: 20px; font-family: system-ui; max-width: 380px;';

const title = document.createElement('h2');
title.textContent = '📝 Form Validation';
title.style.cssText = 'color: #6366f1; margin-bottom: 16px;';

function createField(label, type, id, placeholder) {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'margin-bottom: 12px;';
  
  const lbl = document.createElement('label');
  lbl.textContent = label;
  lbl.style.cssText = 'display: block; color: #94a3b8; margin-bottom: 4px; font-size: 14px;';
  
  const input = document.createElement('input');
  input.type = type;
  input.id = id;
  input.placeholder = placeholder;
  input.style.cssText = 'width: 100%; padding: 10px; border: 1px solid #334155; background: #1e293b; color: #e2e8f0; border-radius: 6px; box-sizing: border-box;';
  
  const error = document.createElement('span');
  error.id = id + '-error';
  error.style.cssText = 'color: #ef4444; font-size: 12px; display: none;';
  
  wrapper.appendChild(lbl);
  wrapper.appendChild(input);
  wrapper.appendChild(error);
  return wrapper;
}

const form = document.createElement('div');
form.appendChild(createField('Name', 'text', 'name', 'John Doe'));
form.appendChild(createField('Email', 'email', 'email', 'john@example.com'));
form.appendChild(createField('Password', 'password', 'password', '••••••••'));

const submitBtn = document.createElement('button');
submitBtn.textContent = 'Submit';
submitBtn.style.cssText = 'width: 100%; padding: 12px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin-top: 8px;';

const status = document.createElement('div');
status.id = 'form-status';
status.style.cssText = 'margin-top: 12px; padding: 10px; border-radius: 6px; display: none;';

submitBtn.addEventListener('click', () => {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  let valid = true;

  // Validate name
  const nameErr = document.getElementById('name-error');
  if (!name.trim()) {
    nameErr.textContent = 'Name is required';
    nameErr.style.display = 'block';
    valid = false;
  } else { nameErr.style.display = 'none'; }

  // Validate email
  const emailErr = document.getElementById('email-error');
  if (!email.includes('@')) {
    emailErr.textContent = 'Invalid email address';
    emailErr.style.display = 'block';
    valid = false;
  } else { emailErr.style.display = 'none'; }

  // Validate password
  const pwErr = document.getElementById('password-error');
  if (password.length < 6) {
    pwErr.textContent = 'Password must be 6+ characters';
    pwErr.style.display = 'block';
    valid = false;
  } else { pwErr.style.display = 'none'; }

  if (valid) {
    status.style.cssText = 'margin-top: 12px; padding: 10px; border-radius: 6px; display: block; background: #065f46; color: #6ee7b7;';
    status.textContent = '✓ Form submitted successfully!';
    console.log('Form submitted:', { name, email });
  } else {
    status.style.cssText = 'margin-top: 12px; padding: 10px; border-radius: 6px; display: block; background: #7f1d1d; color: #fca5a5;';
    status.textContent = '✕ Please fix the errors above';
    console.warn('Validation failed');
  }
});

app.appendChild(title);
app.appendChild(form);
app.appendChild(submitBtn);
app.appendChild(status);
document.body.appendChild(app);

console.log('Form validation demo ready!');
`,
  },
];

export const defaultTemplate = templates[0];
