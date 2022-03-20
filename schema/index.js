const { gql } = require('apollo-server-express')
const typeDefs = gql`
    type Query {
        events: [Event]
        bookings: [Booking] #authenticated user bookings
        getUserEvents(userId: ID!): [Event]
    }

    type Mutation {
        createUser(userInput: UserInput!): AuthData
        createEvent(eventInput: EventInput!): Event
        bookEvent(eventId: ID!): Booking
        cancelBooking(bookingId: ID!): Event 
        login(email: String!, password: String!): AuthData
        deleteEvent(eventId: ID!): [Event]
    }

    type AuthData {
        token: String!
        userId: ID!
        username: String!
    }

    input UserInput {
        username: String!
        email: String!
        password: String!
    }

    input EventInput {
        title: String! 
        description: String!
        price: Float! 
        date: String!
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
    }

    type Event {
        _id: ID!
        title: String! 
        description: String!
        price: Float! 
        date: String!
        creator: User! 
    }

    type Booking {
        _id: String!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    type Subscription {
        eventAdded: Event!
    } 
`
module.exports = { typeDefs }