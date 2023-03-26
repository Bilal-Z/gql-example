// https://www.digitalocean.com/community/tutorials/how-to-set-up-a-graphql-api-server-in-node-js
import express from 'express';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

const app = express();
const port = 5000;

// https://gist.github.com/nanotaboada/6396437
const data = {
	books: [
		{
			title: 'Eloquent JavaScript, Third Edition',
			subtitle: 'A Modern Introduction to Programming',
			author: 1,
			isbn: '9781593279509',
			year: 2018,
			pages: 472,
			description:
				'JavaScript lies at the heart of almost every modern web application, from social apps like Twitter to browser-based game frameworks like Phaser and Babylon. Though simple for beginners to pick up and play with, JavaScript is a flexible, complex language that you can use to build full-scale applications.',
		},
		{
			title: 'Practical Modern JavaScript',
			subtitle: 'Dive into ES6 and the Future of JavaScript',
			author: 2,
			year: 2017,
			isbn: '9781491943533',
			pages: 334,
			description:
				'To get the most out of modern JavaScript, you need learn the latest features of its parent specification, ECMAScript 6 (ES6). This book provides a highly practical look at ES6, without getting lost in the specification or its implementation details.',
		},
		{
			isbn: '9781593277574',
			title: 'Understanding ECMAScript 6',
			subtitle: 'The Definitive Guide for JavaScript Developers',
			author: 3,
			year: 2016,
			pages: 352,
			description:
				'ECMAScript 6 represents the biggest update to the core of JavaScript in the history of the language. In Understanding ECMAScript 6, expert developer Nicholas C. Zakas provides a complete guide to the object types, syntax, and other exciting changes that ECMAScript 6 brings to JavaScript.',
		},
	],
	authors: [
		{ id: 1, firstName: 'Marijn', lastName: 'Haverbeke' },
		{ id: 2, firstName: 'Nicolás', lastName: 'Bevacqua' },
		{ id: 3, firstName: 'Nicholas C.', lastName: 'Zakas' },
	],
};

const typeDefs = `
type Book {
	title: String!
	subtitle: String
	author: Author
	year: Int
	isbn: ID!
	pages: Int
	description: String
}

type Author {
	id: ID!
	firstName: String
	lastName: String!
}

input CreateBookInput {
	title: String!
	subtitle: String
	authorId: ID!
	year: Int
	isbn: ID!
	pages: Int
	description: String
}

type Query {
	getBooks: [Book]!
	getBook(isbn: ID!): Book
	getAuthors: [Author]!
	getAuthor(id: ID!): Author
}

type Mutation {
	createAuthor(name: String): Author!
	createBook(input: CreateBookInput!): Book!
}

schema {
  query: Query
  mutation: Mutation
}
`;

const resolvers = {
	Query: {
		getBooks: (obj, args, context) => {
			const books = context.books;
			for (const book of books) {
				if (typeof book.author === 'number') {
					book.author = context.authors.find((a) => book.author === a.id);
				}
			}
			return books;
		},
		getBook: (obj, args, context) => {
			const book = context.books.find((b) => b.isbn === args.isbn);
			if (typeof book.author === 'number') {
				book.author = context.authors.find((a) => book.author === a.id);
			}
			return book;
		},
		getAuthors: (obj, args, context) => context.authors,
		getAuthor: (obj, args, context) =>
			context.authors.find((a) => a.id === Number(args.id)),
	},
};

const executableSchema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	'/graphql',
	graphqlHTTP({
		schema: executableSchema,
		context: data,
		graphiql: true,
	})
);

app.use('/', (req, res) => {
	res.send('Hello, World');
});

app.listen(port, () => {
	console.log(`GraphiQL running at http://localhost:${port}/graphql`);
});
