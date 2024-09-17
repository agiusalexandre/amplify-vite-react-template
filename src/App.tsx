import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css'
import { Flex, Tabs } from '@aws-amplify/ui-react';


const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }


  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (

    <Authenticator>
      {({ signOut }) => (
        <main>

          <Flex direction="column" gap="2rem">
            <Tabs.Container defaultValue="1">
              <Tabs.List spacing="relative">
                <Tabs.Item value="1">First</Tabs.Item>
                <Tabs.Item value="2">This  the second tab</Tabs.Item>
                <Tabs.Item value="3">Really long title for demonstration</Tabs.Item>
              </Tabs.List>
              <Tabs.Panel value="1">
                <h1>My todos</h1>
                <button onClick={createTodo}>+ new</button>
                <ul>
                  {todos.map((todo) => (
                    <li onClick={() => deleteTodo(todo.id)} key={todo.id}>{todo.content}</li>
                  ))}
                </ul>
              </Tabs.Panel>
              <Tabs.Panel value="2">Content of the second tab</Tabs.Panel>
              <Tabs.Panel value="3">Content of the third tab</Tabs.Panel>
            </Tabs.Container>
          </Flex>

          <div>
            🥳 App successfully hosted.
            <br />
          </div>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
