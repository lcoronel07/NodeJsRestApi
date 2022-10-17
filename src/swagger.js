const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['src/endpoints.js']


const doc = {
    info: {
        version: "1.0.0",
        title: "My API",
        description: "Usign Swagger autogen"
    },
    host: "localhost:3001",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "Posts",
            "description": "Endpoints"
        }
    ],
    definitions: {
        Post: {
            id: "a.B_2",
            title: "a post",
            author: "Jhon Doe"
        },
        Posts: [
            {
                id: "a.B_2",
                title: "a post",
                author: "Jhon Doe"
            },

        ],
        AddPost: {
            $title: "a new post",
            $author: "Jhon Doe"

        }
    }
}


swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index.js')
})