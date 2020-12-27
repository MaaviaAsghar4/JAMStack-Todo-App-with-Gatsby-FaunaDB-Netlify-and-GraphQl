const { ApolloServer, gql } = require("apollo-server-lambda");
const faundadb = require("faunadb");
const q = faundadb.query;
const dotenv = require("dotenv");
dotenv.config();

const typeDefs = gql`
  type Query {
    todos: [Todo]!
  }
  type Mutation {
    addTodo(todo: String!): Todo
  }
  type Todo {
    id: ID!
    todo: String!
    isCompleted: Boolean!
  }
`;

const resolvers = {
  Query: {
    todos: async (roots, args, context) => {
      try {
        const adminClient = new faundadb.Client({
          secret: process.env.FAUNA_DB_SECRET_KEY,
        });

        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index("todo_index"))),
            q.Lambda("X", q.Get(q.Var("X")))
          )
        );

        console.log(result.data);

        return result.data.map((value) => {
          return {
            id: value.ref.id,
            todo: value.data.todo,
            isCompleted: value.data.isCompleted,
          };
        });
      } catch (error) {
        console.log(error.message);
      }
    },
  },

  Mutation: {
    addTodo: async (_, { todo }) => {
      try {
        const adminClient = new faundadb.Client({
          secret: process.env.FAUNA_DB_SECRET_KEY,
        });

        const result = await adminClient.query(
          q.Create(q.Collection("todo_app"), {
            data: {
              todo: todo,
              isCompleted: false,
            },
          })
        );

        return {
          id: result.ref.id,
          todo: result.ref.data.todo,
          isCompleted: result.ref.data.isCompleted,
        };
      } catch (error) {
        console.log(error.message);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

exports.handler = server.createHandler();
