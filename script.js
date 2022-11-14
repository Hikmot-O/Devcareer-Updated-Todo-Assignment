function mk(type, props, children) {
    const el = document.createElement(type);
    if (props) Object.assign(el, props);
    if (children) el.append(...children);
    return el;
  }
  
  function app() {
    let ui = {};
    let state = { id: 0, todos: [] };
  
    return mk('div', { id: 'app' }, [
      mk('form', null, [
        (ui.input = mk('input')),
        (ui.add = mk('button', { onclick: add }, ['Add ToDo'])),
      ]),
      (ui.todos = mk('ul', { style: 'padding:0;' })),
    ]);
  
    function createTodo(todo) {
      let item, text, x, toggle;
      function remove() {
        state.todos = state.todos.filter((t) => t.id !== todo.id);
        item.remove();
        console.log(ui, state);
      }
      console.log(ui, state);
  
      function edit() {
        function onkeydown(e) {
          switch (e.keyCode) {
            case 13:
              text.textContent = todo.text = editing.value;
            case 27:
              editing.blur(); // eslint-disable-line no-fallthrough
          }
        }
  
        const cancel = () => (x.disabled = editing.replaceWith(text));
  
        let editing = mk('input', {
          style: 'flex:1;',
          onkeydown,
          value: todo.text,
          onblur: cancel,
        });
  
        text.replaceWith(editing);
        editing.focus();
        x.disabled = true;
      }
  
      ///Added a NEW FEATURE Here
      function toggleTask(){
        const todoIndex = state.todos.findIndex(td => td.id  === todo.id);
  
        let newTodos = [...state.todos];
        newTodos[todoIndex] = {
          ...newTodos[todoIndex],
          completed: !newTodos[todoIndex].completed
        }
  
        state.todos = newTodos;
  
        // let todoStatus;
        if(state.todos[todoIndex].completed === true){
          toggle.textContent = 'DONE';
          // todoStatus  = mk('button', {style: 'margin-right:10px;', onclick: toggleTask}, ['DONE']);
        }else{
          toggle.textContent = ' ';
          // todoStatus = mk('button', {style: 'margin-right:10px;', onclick: toggleTask}, [' ']);
        }
        // todoStatus.replaceWith(todoStatus);
      }
  
      item = mk('li', { style: 'display:flex;' }, [
        (toggle = mk('button', {style: 'margin-right:10px;', onclick: toggleTask}, [' '])),
        (text = mk('span', { style: 'flex:1;', ondblclick: edit }, [todo.text])),
        (x = mk('button', { onclick: remove }, ['X'])),
      ]);
  
      return item;
    }
  
    function add(e) {
      e.preventDefault();
  
      const text = ui.input.value;
  
      if (!text) return;
  
      ui.input.value = '';
      const todo = { id: ++state.id, text, completed: false };
      state.todos.push(todo);
  
      ui.todos.append(createTodo(todo));
    }
  }
  
  document.body.append(app());
  
  function testTodoApp(root) {
    const app = [].find.call(root.children, (c) => c.id === 'app');
    const form = app.firstElementChild;
    const input = form.firstElementChild;
    const add = form.lastElementChild;
  
    for (let i = 1; i <= 500; i++) {
      input.value = `Item ${i}`;
      input.dispatchEvent(new Event('change'));
      add.dispatchEvent(new Event('click'));
    }
  
    const kids = [].slice.call(form.nextElementSibling.children);
  
    for (let i = 0; i < kids.length; i++) {
      kids[i].firstElementChild.dispatchEvent(new Event('dblclick'));
      kids[i].firstElementChild.value += ' (updated)';
      kids[i].firstElementChild.dispatchEvent(
        Object.assign(new Event('keydown'), { keyCode: 13 })
      );
      if (!/updated/.test(kids[i].firstElementChild.textContent)) {
        throw Error('Expected todo item to have updated text');
      }
    }
  
    for (let i = kids.length / 2; i < kids.length; i++) {
      kids[i].lastElementChild.dispatchEvent(new Event('click'));
    }
  
    for (let i = kids.length / 2; i--; ) {
      kids[i].lastElementChild.dispatchEvent(new Event('click'));
    }
  }
  
  let time;
  document.body.append(
    mk(
      'div',
      { style: 'position:fixed;left:0;bottom:0;background:#eee;padding:10px;' },
      [
        mk(
          'button',
          {
            onclick() {
              const start = performance.now();
              testTodoApp(document.body);
              const end = performance.now();
              time.textContent = `${end - start}ms`;
            },
          },
          ['Run Test']
        ),
        (time = mk('time', null, ['<ready>'])),
      ]
    )
  );