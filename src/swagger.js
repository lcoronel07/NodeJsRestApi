const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['src/endpoints.js']


const doc = {
    info: {
        version: "1.0.0",
        title: "Vet Appointments API",
        description: "First version of API to manage vet appointments."
    },
    host: "localhost:3001",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "Veterinarians",
            "description": "Endpoints"
        },
        {
            "name": "Species",
            "description": "Endpoints"
        }
    ],
    definitions: {
        Veterinarian: {
            
            name: "John Snow",
            regNumber: "11112"
        },
        Veterinarians: [
            {
                vetId: "a2s44",
                name: "John Snow",
                regNumber: "11112"
            },

        ],
        Species: {
            
            name: "Dinosaur"
        },
        Patient: {
            
            name: "Rex",
            speciesId: "1t112",
            sex: "F",
            isNurtured: true,
            dateOfBirth: "07/11/2021"
        },
        Patients: [
            {
                patientId: "er332",
                name: "Rex",
                speciesId: "1t112",
                sex: "F",
                isNurtured: true,
                dateOfBirth: "07/11/2021"
            },
        ],
        Slot: {
            
            vetId: "23123",
            time: 9
        },
        Slots: [
            {
                slotId: "er332",
                vetId: "23123",
                time: 9
            },
        ],
        Appointment: {
            
            slotId: "23123",
            patientId: "e2322",
            date: "02/12/2022"
        },
        Appointments: [
            {
                appointmentId: "67b32",
                slotId: "23123",
                patientId: "e2322",
                date: "02/12/2022"
            },
        ],
    }
}


swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index.js')
})