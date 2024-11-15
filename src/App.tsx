import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ 
      content: window.prompt("Todo content"),
      userId: user?.signInDetails?.loginId || 'anonymous'
    });
  }
    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <main>
      <h1>My Chatroom</h1>
      <button onClick={createTodo}>Send</button>
      <ul>
        {todos.map((todo) => (
          <li 
            onClick={() => deleteTodo(todo.id)}
            key={todo.id}
            className="todo-item"
          >
            <div className="message-container">
              <span className="todo-content">{todo.content}</span>
              <span className="separator">—</span>
              <span className="user-id-box">@{todo.userId || 'anonymous'}</span>
            </div>
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
    </main>
  );
}
export default App;