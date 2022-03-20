const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const http = require('http')
const { typeDefs } = require('./schema/index')
const { resolvers } = require('./resolvers/index')
require('dotenv').config()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { WebSocketServer } = require ('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

async function startApolloServer(typeDefs, resolvers){
    const app = express()
    const httpServer = http.createServer(app)
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', process.env.APP_URL)
        next()
    })
    const schema = makeExecutableSchema({
        typeDefs,
        resolvers
    })
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql'
    })
    const serverCleanup = useServer({schema}, wsServer)
    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            serverCleanup.dispose()
                        }
                    }
                }
            }
        ],
        context: async({ req }) => {
            const auth = req ? req.headers.authorization : null
            if (auth) {
                const decodedToken= jwt.verify(auth.slice(4), process.env.JWT_SECRET)
                const user = await User.findById(decodedToken.id)
                return { user }
            }
        }
    })
    await server.start()
    server.applyMiddleware({ app })
    await new Promise(resolve => httpServer.listen({ port: process.env.PORT }, resolve))
    console.log(`Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
    mongoose.connect(process.env.DB_URL,
        err => {
            if(err) throw err
            console.log('DB connected succssfully')
        }
    )
    return { server, app }
}
startApolloServer(typeDefs, resolvers)
