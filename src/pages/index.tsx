import React, { useState } from "react";
import styles from "./index.module.css";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";

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
  const [addTodo] = useMutation(ADD_TODO);
  const addValue = () => {
    addTodo({
      variables: {
        task: inputValue,
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

  // const addValue = () => {
  //   console.log("add");
  // };
  const editValue = () => {
    console.log("edit");
  };
  const deleteValue = () => {
    console.log("Delete");
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
        <div className={styles.crudContent}>
          <span>{"value.data"}</span>
          <div>
            <button onClick={() => editValue()} className={styles.update}>
              Update
            </button>
            <button onClick={() => deleteValue()} className={styles.delete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
