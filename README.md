# GraphQL

Data query and manipulation language and query run time engine.
Clients define the structure of the data they require.
Specification developed at Facebook, now maintained by the GraphQL Foundation under the Linux Foundation.
Different languages and runtimes have their own implementations.

- Object Types
- Queries
- Mutations
- Resolvers
- Fragments
- Subscriptions

## GraphQL Schema Definition Language

schemas can be created programatically or using the GraphQL SDL.
Used to define types, queries and mutations.

### Scalars

Primitive data types. can be considered the leaves of the query.
defaults include:

- `Int` - 32 bit signed integer.
- `Float` - signed double.
- `String` - UTF-8 character sequence.
- `Boolean` - `true` or `false`.
- `ID` - Represents a unique identifier. Serializes in the same way as a String.

Can also have custom scalar types. Ex: `Date`. The method for serializing and deserializing the custom scalar should be defined.

### Object Types

A construct defining an object's shape using fields.

### Fields

Keys on a Type with a data type.
the data type can be scalar or another type. The exclamation mark denotes a field is non-null i.e. required. Square brackets denote a field is a list.

Ex:

```graphql
type Book {
	title: String!
	author: [Author!]!
	edition: Int
	isbn: ID!
}

type Author {
	id: ID!
	name: String!
}
```

### Interfaces

allows multiple object types to share some fields.

```graphql
interface Publication {
	title: String!
	author: [Author!]!
	isbn: ID!
}

type Book implements Publication {
	edition: Int
	hardcover: Boolean
}

type ScientificPaper implements Publication {
	journal: Journal
	year: Int
}

type Article implments Publication {
	magzine: Magzine
}
```

### Enumeration Types

Finite set of values.

```graphql
enum Title {
	Dr
	Prof
	Mr
	Ms
}

type Author {
	id: ID!
	name: String!
	title: Title
}
```

### Queries and Mutations

`Query` and `Mutation` are reserved keywords in the schema that define the operations of the API. Queries define read operations, and mutations define create, update and delete operations.

All schemas must have a `query` type, `mutation` type is optional.

```graphql
type Query {
	getAuthors: Author
	getBook(isbn: ID!): Book
}

type Mutation {
	createAuthor(name: String): Author!
}

schema {
	query: Query
	mutation: Mutation
}
```

### Input Types

cleaner way to define multiple arguments.

```graphql
input CreateBookInput {
	isbn: String!
	authorId: ID!
	title: String!
	edition: Int
}

type Mutation {
	createAuthor(name: String): Author!
	createBook(input: CreateBookInput!): Book!
}
```

### Union Types

A type that can resolve to specified object types.

```graphql
union PublicationSearch = Book | Article | ScientificPaper

type Query {
	getPublication(isbn: ID): PublicationSearch
}
```

## Resolvers

Can be considered the implentation of queries and mutations.
Every field of the schema has a resolver function. Usually only need to define resolver functions of `Query` and `Mutation` fields, resolvers for the fields of the object types (child types of `Query` and `Mutations`) are handled under the hood by the GraphQL implementation/library being used.

resolver function signature looks like

```
fieldName: (obj, args, context, info) => data
```

- `obj` - `parent` in some implementations. return of the resolver function of the parent field.
- `args` - arguments passed in `Query` or `Mutation` field.
- `context` - shared state across all resolvers that are called for a particular operation. Ex: authentication, database access.
- `info` - contains information about the execution state of the operation.
