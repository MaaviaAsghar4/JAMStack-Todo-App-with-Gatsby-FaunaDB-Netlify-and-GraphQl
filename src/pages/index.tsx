import React, { useState } from "react";
import styles from "./index.module.css";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";

interface arrtype {
  id: string;
  isCompleted: boolean;
  todo: string;
  __typename: string;
}

const GET_TODOS = gql`
  {
    todos {
      id
      todo
      isCompleted
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($todo: String!) {
    addTodo(todo: $todo) {
      todo
    }
  }
`;

const IndexPage = () => {
  let [inputValue, setInputValue] = useState("");
  let [updatedValue, setUpdatedValue] = useState("");
  const [addTodo] = useMutation(ADD_TODO);
  const addValue = () => {
    addTodo({
      variables: {
        todo: inputValue,
      },
      refetchQueries: [{ query: GET_TODOS }],
    });
    setInputValue("");
  };
  const { loading, error, data } = useQuery(GET_TODOS);
  if (loading) {
    return <h1>Loading..</h1>;
  }

  if (error) {
    return <h1>{error.message}</h1>;
  }

  console.log(data);

  const updateValue = (id: string) => {
    console.log(id);
  };
  const editValue = (id: string) => {
    console.log(id);
  };
  const deleteValue = (id: string) => {
    console.log(id);
  };
  return (
    <div>
      <title>Todo App</title>
      <header className={styles.headerContent}>
        <h1>TODO APP</h1>
        <h2>GraphQL, Netlify Functions and FaunaDB</h2>
      </header>
      <div className={styles.addContent}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required={true}
          type="text"
        />
        <button onClick={addValue}>Add</button>
      </div>
      <div className={styles.mainContainer}>
        {data.todos.map((todo: arrtype) => {
          return (
            <div key={todo.id} className={styles.crudContent}>
              {todo.isCompleted ? (
                <input
                  type="text"
                  value={updatedValue}
                  onChange={(e) => setUpdatedValue(e.target.value)}
                />
              ) : (
                <span>{todo.todo}</span>
              )}
              <div>
                {todo.isCompleted ? (
                  <button
                    onClick={() => updateValue(todo.id)}
                    className={styles.update}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    onClick={() => editValue(todo.id)}
                    className={styles.update}
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => deleteValue(todo.id)}
                  className={styles.delete}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IndexPage;
