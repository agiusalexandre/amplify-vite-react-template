import { FormEvent, useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css'
import { Flex, Tabs } from '@aws-amplify/ui-react';
import { FileUploader } from '@aws-amplify/ui-react-storage';


const client = generateClient<Schema>();



function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [uploadedFiles] = useState<string[]>([]);

  const [prompt, setPrompt] = useState<string>("");
  const [answer, setAnswer] = useState<string | null>(null);

  const sendPrompt = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data, errors } = await client.queries.generateHaiku({
      prompt: "Frank Herbert's Dune",
    });

    if (!errors) {
      setAnswer(data);
      setPrompt("");
    } else {
      console.log(errors);
    }
  };

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
                <Tabs.Item value="2">Upload Images</Tabs.Item>
                <Tabs.Item value="3">Bedrock</Tabs.Item>
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
              <Tabs.Panel value="2">
                <h2>Upload and View Images</h2>
                <FileUploader
                  acceptedFileTypes={['image/*']}
                  path="media/*"
                  maxFileCount={4}
                  isResumable
                  autoUpload={false}
                />
                {uploadedFiles.length > 0 && (
                  <div>
                    <h3>Uploaded Images:</h3>
                    <ul>
                      {uploadedFiles.map((file, index) => (
                        <li key={index}>{file}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </Tabs.Panel>
              <Tabs.Panel value="3">
                <div>
                  <h1 className="text-3xl font-bold text-center mb-4">Haiku Generator</h1>

                  <form className="mb-4 self-center max-w-[500px]" onSubmit={sendPrompt}>
                    <input
                      className="text-black p-2 w-full"
                      placeholder="Enter a prompt..."
                      name="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </form>

                  <div className="text-center">
                    <pre>{answer}</pre>
                  </div>
                </div>

              </Tabs.Panel>
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
