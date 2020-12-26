const { ApolloServer, gql } = require("apollo-server-lambda");

const typeDefs = gql`
  type Query {
    todos: [Todo]!
  }
  type Todo {
    id: ID!
    todo: String!
    isCompleted: Boolean!
  }
  type Mutation {
    addTodo(todo: String!): Todo
  }
`;

let todos = [];

const resolvers = {
  Query: {
    todos: () => {
      return todos;
    },
  },

  Mutation: {
    addTodo: (_, { todo }) => {
      return {
        id: Math.floor(Math.random() * 3333),
        todo,
        isCompleted: false,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = server.createHandler();

module.exports = { handler };
