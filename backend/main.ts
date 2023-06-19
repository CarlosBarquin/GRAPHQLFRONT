import { ApolloServer } from "npm:@apollo/server@^4.1";
import { startStandaloneServer } from "npm:@apollo/server@4.1/standalone";
import { MongoClient, ObjectId } from 'npm:mongodb@5';

// connect to mongo
const mongoURL = 'mongodb://mongo:27017';
const client = new MongoClient(mongoURL);

// Database Name
const dbName = 'Agenda';

// Use connect method to connect to the server
await client.connect();
console.log('Connected successfully to MongoDB server');
const db = client.db(dbName);
const UsersCollection = db.collection("Users");

export const typeDefs = `
  type User {
    _id: ID!
    name: String!
    age: Int!
    email: String!
    address: String!
  }

  type Query {
    listUsers: [User!]!
    getUser(id: ID!): User
  }

  type Mutation {
    addUser(name: String!, age: Int!, email: String!, address: String!): User
    updateUser(id: ID!, name: String, age: Int, email: String, address: String): User
    deleteUser(id: ID!): User
  }
`;

const resolvers = {
  Query: {
    listUsers: async () => {
      const users = await UsersCollection.find({}).toArray();
      return users;
    },
    getUser: async (_: any, { id }: { id: string }) => {
      const user = await UsersCollection.findOne({ _id: new ObjectId(id) });
      return user;
    }
  },
  Mutation: {
    addUser: async (_: any, { name, age, email, address }: { name: string, age: number, email: string, address: string }) => {
      const insertedUser = { name, age, email, address };
      const result = await UsersCollection.insertOne(insertedUser);
      return insertedUser;
    },
    updateUser: async (_: any, { id, name, age, email, address }: { id: string, name?: string, age?: number, email?: string, address?: string }) => {
      const filter = { _id: new ObjectId(id) };
      const update = { $set: { name, age, email, address } };
      const options = { returnOriginal: false };
      const result = await UsersCollection.findOneAndUpdate(filter, update, options);
      const updatedUser = result.value;
      return updatedUser;
    },
    deleteUser: async (_: any, { id }: { id: string }) => {
      const filter = { _id: new ObjectId(id) };
      const result = await UsersCollection.findOneAndDelete(filter);
      const deletedUser = result.value;
      return deletedUser;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, { listen: { port: 8080 } });
console.log(`Server ready at ${url}`);
