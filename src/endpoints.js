const e = require('express');

module.exports = function (app) {

    const nanoid = require('nanoid');
    const lenght= 5;
    let vets = [
        { vetId: nanoid.nanoid(lenght), name: 'Ciaran Tuite', regNumber: '10123' },
        { vetId: nanoid.nanoid(lenght), name: 'Macarena Vila', regNumber: '98765' }
    ];

    var species = [
        { speciesId: nanoid.nanoid(lenght), description: 'Dog' },
        { speciesId: nanoid.nanoid(lenght), description: 'Cat' },
        { speciesId: nanoid.nanoid(lenght), description: 'Turtle' },
        { speciesId: nanoid.nanoid(lenght), description: 'Ferret' },
        { speciesId: nanoid.nanoid(lenght), description: 'Rabbit' },
        { speciesId: nanoid.nanoid(lenght), description: 'Horse' }
    ];
    
    let patients = [
        { patientId: nanoid.nanoid(lenght), name: 'Liam', speciesId: species.find(x => x.description == 'Dog').speciesId, sex: 'M', isNurtured: false, createdOn: Date(), dateOfBirth: Date(2021,09,28) },
        { patientId: nanoid.nanoid(lenght), name: 'Curi Guri', speciesId: species.find(x => x.description == 'Dog').speciesId, sex: 'M', isNurtured: false, createdOn: Date(), dateOfBirth: Date(2006,06,01) },
        { patientId: nanoid.nanoid(lenght), name: 'Theo', speciesId: species.find(x => x.description == 'Cat').speciesId, sex: 'M', isNurtured: true, createdOn: Date(), dateOfBirth: Date(2012,09,01) }
    ];
    
    let slots = [
        { slotId: nanoid.nanoid(lenght), vetId: vets[1].vetId, time: 9 },
        { slotId: nanoid.nanoid(lenght), vetId: vets[1].vetId, time: 10 },
        { slotId: nanoid.nanoid(lenght), vetId: vets[1].vetId, time: 11 },
        { slotId: nanoid.nanoid(lenght), vetId: vets[1].vetId, time: 12 },
        { slotId: nanoid.nanoid(lenght), vetId: vets[1].vetId, time: 13 },
        { slotId: nanoid.nanoid(lenght), vetId: vets[1].vetId, time: 14 },
        { slotId: nanoid.nanoid(lenght), vetId: vets[1].vetId, time: 15 },
        { slotId: nanoid.nanoid(lenght), vetId: vets[1].vetId, time: 16 },
        { slotId: nanoid.nanoid(lenght), vetId: vets[1].vetId, time: 17 },
        { slotId: nanoid.nanoid(lenght), vetId: vets[0].vetId, time: 9 },
        { slotId: nanoid.nanoid(lenght), vetId: vets[0].vetId, time: 10 },
        { slotId: nanoid.nanoid(lenght), vetId: vets[0].vetId, time: 11 },
        { slotId: nanoid.nanoid(lenght), vetId: vets[0].vetId, time: 12 },
        { slotId: nanoid.nanoid(lenght), vetId: vets[0].vetId, time: 13 },
        { slotId: nanoid.nanoid(lenght), vetId: vets[0].vetId, time: 14 },
        { slotId: nanoid.nanoid(lenght), vetId: vets[0].vetId, time: 15 },
        { slotId: nanoid.nanoid(lenght), vetId: vets[0].vetId, time: 16 },
        { slotId: nanoid.nanoid(lenght), vetId: vets[0].vetId, time: 17 }
    ];

    let appointments = [];
    
    // Vets

    // All vets
    app.get('/veterinarians/', (req, res) => {
        // #swagger.tags = ['Veterinarians']
        // #swagger.description = 'Get all veterinarians'
        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Veterinarians" },
               description: 'all veterinarians.' 
        } */
        res.status(200);
        res.send(vets);
    });

    // Vet by Id
    app.get('/veterinarians/:vetId', (req, res) => {
        // #swagger.tags = ['Veterinarians']
        // #swagger.description = 'Get veterinarian by Id'
        /* #swagger.responses[200] = { 
                schema: { $ref: "#/definitions/Veterinarian" },
                description: 'Veterinarian by Id.' 
        } */
        res.status(200);
        res.send(vets.find(x => x.vetId == req.params.vetId));
    });

    // Slots by Vet
    app.get('/veterinarians/:vetId/slots', (req, res) => {
        // #swagger.tags = ['Veterinarians']
        // #swagger.description = 'Get veterinarian's slots'
        /* #swagger.responses[200] = { 
                schema: { $ref: "#/definitions/Slots" },
                description: 'Slots by Veterinarian Id.' 
        } */

        let result = slots.filter(x => x.vetId === req.params.vetId);
        res.status(200).send(result);
    });

    // Create Vet   
    app.post('/veterinarians/', async (req, res) => {

        // #swagger.tags = ['Veterinarians']
        // #swagger.description = 'add a vet'
        /* #swagger.parameters['newVet'] = {
               in: 'body',
               description: 'vet information',
               required: true,
               schema: { $ref: "#/definitions/Veterinarian" }
        } */
        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Veterinarian" },
               description: 'new vet.' 
        } */
        const { name, regNumber } = req.body;
        const newVet = { vetId: nanoid.nanoid(lenght), name: name, regNumber: regNumber };

        await insterVet(newVet);

        res.status(201);
        res.send({ message: 'New Vet inserted.' });
    });

    // Delete Vet
    app.delete('/veterinarians/:vetId', async (req, res) => {
        // #swagger.tags = ['Veterinarians']
        // #swagger.description = 'Delete a vet'
        // #swagger.parameters['vetId'] = { description: 'Id of vet' }
        
       const id = req.params.vetId;
        try {
            await deleteVet(id);
            res.status(204).send({ message: 'Vet removed.' });
        } catch (error) {
            return res.status(400).json({ error: `vet with id ${ id } not found` })
        }
       
    });

    // Update Vet
    app.put('/veterinarians/:vetId', async (req, res) => {
        // #swagger.tags = ['Veterinarians']
        // #swagger.description = 'Update a vet'
        /* #swagger.parameters['newVet'] = {
              in: 'body',
              description: 'vet information',
              required: true,
              schema: { $ref: "#/definitions/Veterinarian" }
       } */
        const { name, regNumber } = req.body;
        const id = req.params.vetId;
        const updatedVet = { vetId: id, name: name, regNumber: regNumber };
        try {
            await updateVet(id, updatedVet);

            res.status(200);
            res.send({ message: 'Vet updated.' });
        } catch (error) {
            return res.status(400).json({ error: `vet with id ${ id } not found`  })
        }
       
    });

    async function insterVet(newVet) {
        vets.push(newVet);
    }

    async function deleteVet(id) {
        const vetExists = vets.find(x => x.vetId === id);
        if (!vetExists) {
          throw "id not found";

        }

        vets = vets.filter(x => x.vetId !== id);
    }
    async function updateVet(id, newVet) {
        const vetExists = vets.find(x => x.vetId === id);
        if (!vetExists) {
            throw "id not found";

        }
        vetIndex = vets.map(x => { return x.vetId; }).indexOf(id);
        vets[vetIndex] = newVet;
    }

    // Species

    // All Species
    app.get('/species/', (req, res) => {
        // #swagger.tags = ['Species']
        // #swagger.description = 'Get all Species'
        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Species" },
               description: 'All Species.' 
        } */
        res.status(200);
        res.send(species);
    });

    // Species by Id
    app.get('/species/:speciesId', (req, res) => {
        // #swagger.tags = ['Species']
        // #swagger.description = 'Get Species by Id'
        /* #swagger.responses[200] = { 
                schema: { $ref: "#/definitions/Species" },
                description: 'Species by Id.' 
        } */
        res.status(200);
        res.send(species.find(x => x.speciesId == req.params.speciesId));
    });

    // Species' Patients
    app.get('/species/:speciesId/patients', (req, res) => {
        // #swagger.tags = ['Species']
        // #swagger.description = 'Get patients by species id'
        /* #swagger.responses[200] = { 
                schema: { $ref: "#/definitions/Species" },
                description: 'Patients by Species Id.' 
        } */

        let result = patients.filter(x => x.speciesId == req.params.speciesId);

        res.status(200).send(result);
    });

    // Create Species   
    app.post('/species/', async (req, res) => {

        // #swagger.tags = ['Species']
        // #swagger.description = 'add a Species'
        /* #swagger.parameters['newSpecies'] = {
               in: 'body',
               description: 'Species information',
               required: true,
               schema: { $ref: "#/definitions/Species" }
        } */
        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Species" },
               description: 'new Species.' 
        } */
        const { description } = req.body;
        const newSpecies = { speciesId: nanoid.nanoid(lenght), description: description };

        await insterSpecies(newSpecies);

        res.status(201);
        res.send({ message: 'New Species inserted.' });
    });

    // Delete Species
    app.delete('/species/:speciesId', async (req, res) => {
        // #swagger.tags = ['Species']
        // #swagger.description = 'Delete a Species'
        // #swagger.parameters['speciesId'] = { description: 'Id of Species' }
        
       const id = req.params.speciesId;
        try {
            await deleteSpecies(id);
            res.status(204).send({ message: 'Species removed.' });
        } catch (error) {
            return res.status(400).json({ error: `Species with id ${ id } not found` })
        }
       
    });

    // Update Species
    app.put('/species/:speciesId', async (req, res) => {
        // #swagger.tags = ['Species']
        // #swagger.description = 'Update a Species'
        /* #swagger.parameters['newSpecies'] = {
              in: 'body',
              description: 'Species information',
              required: true,
              schema: { $ref: "#/definitions/Species" }
       } */
        const { description } = req.body;
        const id = req.params.speciesId;
        const updatedSpecies = { description };
        try {
            await updateSpecies(id, updatedSpecies);

            res.status(200);
            res.send({ message: 'Species updated.' });
        } catch (error) {
            return res.status(400).json({ error: `Species with id ${ id } not found`  })
        }
       
    });

    async function insterSpecies(newSpecies) {
        species.push(newSpecies);
    }

    async function deleteSpecies(id) {
        const speciesExists = species.find(x => x.speciesId === id);
        if (!speciesExists) {
          throw "id not found";

        }
        species = species.filter(x => x.speciesId !== id);
    }

    async function updateSpecies(id, newSpecies) {
        const speciesExists = species.find(x => x.speciesId === id);
        if (!speciesExists) {
            throw "id not found";

        }
        speciesIndex = species.map(x => { return x.speciesId; }).indexOf(id);
        species[speciesIndex] = newSpecies;
    }

    // Patients

    // All Patients
    app.get('/patients/', (req, res) => {
        // #swagger.tags = ['Patients']
        // #swagger.description = 'Get all patients'
        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Patients" },
               description: 'all patients.' 
        } */
        res.status(200);
        res.send(patients);
    });

    // Patient by Id
    app.get('/patients/:patientId', (req, res) => {
        // #swagger.tags = ['Patients']
        // #swagger.description = 'Get patients by Id'
        /* #swagger.responses[200] = { 
                schema: { $ref: "#/definitions/Patient" },
                description: 'Patient by Id.' 
        } */
        res.status(200);
        res.send(patients.find(x => x.patientId == req.params.patientId));
    });

    // Patient's appointments

    app.get('/patients/:patientId/appointments', (req, res) => {
        // #swagger.tags = ['Patients']
        // #swagger.description = 'Get appointments by patient'
        /* #swagger.responses[200] = { 
                schema: { $ref: "#/definitions/Appointments" },
                description: 'Appointments by patient.' 
        } */

        let pId = req.params.patientId;

        let result = appointments.filter(x => x.patientId === pId);

        res.status(200).send(result);
    });

    // Create Patient   
    app.post('/patients/', async (req, res) => {

        // #swagger.tags = ['Patients']
        // #swagger.description = 'add a patient'
        /* #swagger.parameters['newPatient'] = {
               in: 'body',
               description: 'patient information',
               required: true,
               schema: { $ref: "#/definitions/Patient" }
        } */
        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Patient" },
               description: 'new patient.' 
        } */
        const { name, speciesId, sex, isNurtured, createdOn, dateOfBirth } = req.body;
        const newPatient = { patientId: nanoid.nanoid(lenght), speciesId: speciesId, isNurtured: isNurtured, createdOn: new Date(), dateOfBirth: dateOfBirth };

        await insertPatient(newPatient);

        res.status(201);
        res.send({ message: 'New Patient inserted.' });
    });

    // Delete Patient
    app.delete('/patients/:patientId', async (req, res) => {
        // #swagger.tags = ['Patients']
        // #swagger.description = 'Delete a patient'
        // #swagger.parameters['patientId'] = { description: 'Id of patient' }
        
       const id = req.params.patientId;
        try {
            await deletePatient(id);
            res.status(204).send({ message: 'Patient removed.' });
        } catch (error) {
            return res.status(400).json({ error: `patient with id ${ id } not found` })
        }
       
    });

    // Update Patient
    app.put('/patients/:patientId', async (req, res) => {
        // #swagger.tags = ['Patients']
        // #swagger.description = 'Update a patient'
        /* #swagger.parameters['newPatient'] = {
              in: 'body',
              description: 'patient information',
              required: true,
              schema: { $ref: "#/definitions/Patient" }
       } */
        const { name, speciesId, sex, isNurtured, createdOn, dateOfBirth } = req.body;
        const id = req.params.patientId;
        const updatedPatient = { patientId: id, name: name, speciesId: speciesId, sex: sex, isNurtured: isNurtured, dateOfBirth: dateOfBirth };
        try {
            await updatePatient(id, updatedPatient);

            res.status(200);
            res.send({ message: 'Patient updated.' });
        } catch (error) {
            return res.status(400).json({ error: `patient with id ${ id } not found`  })
        }
       
    });

    async function insertPatient(newPatient) {
        patients.push(newPatient);
    }

    async function deletePatient(id) {
        const patientExists = patients.find(x => x.patientId === id);
        if (!patientExists) {
          throw "id not found";

        }
        
        patients = patients.filter(x => x.patientId !== id);
    }
    async function updatePatient(id, newPatient) {
        const patientExists = patients.find(x => x.patientId === id);
        if (!patientExists) {
            throw "id not found";

        }
        patientIndex = patients.map(x => { return x.patientId; }).indexOf(id);
        patients[patientIndex] = newPatient;
    }

    // Slots

    // All Slots
    app.get('/slots/', (req, res) => {
        // #swagger.tags = ['Slots']
        // #swagger.description = 'Get all slots'
        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Slots" },
               description: 'all slots.' 
        } */
        res.status(200);
        res.send(slots);
    });

    // Slot by Id
    app.get('/slots/:slotId', (req, res) => {
        // #swagger.tags = ['Slots']
        // #swagger.description = 'Get slot by Id'
        /* #swagger.responses[200] = { 
                schema: { $ref: "#/definitions/Slot" },
                description: 'Slot by Id.' 
        } */
        res.status(200);
        res.send(slots.find(x => x.slotId == req.params.slotId));
    });

    // Appointments by Slot
    app.get('/slots/:slotId/appointments', (req, res) => {
        // #swagger.tags = ['Slots']
        // #swagger.description = 'Get appointments by slot'
        /* #swagger.responses[200] = { 
                schema: { $ref: "#/definitions/Appointment" },
                description: 'Appointments by Slot Id.' 
        } */

        let result = appointments.filter(x => x.slotId === req.params.slotId);

        res.status(200).send(result);
    });

    // Create Slot   
    app.post('/slots/', async (req, res) => {

        // #swagger.tags = ['Slots']
        // #swagger.description = 'add a slot'
        /* #swagger.parameters['newSlot'] = {
               in: 'body',
               description: 'slot information',
               required: true,
               schema: { $ref: "#/definitions/Slot" }
        } */
        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Slot" },
               description: 'new slot.' 
        } */
        const { vetId, time } = req.body;
        const newSlot = { slotId: nanoid.nanoid(lenght), vetId: vetId, time: time };

        await insertSlot(newSlot);

        res.status(201);
        res.send({ message: 'New Slot inserted.' });
    });

    // Delete Slot
    app.delete('/slots/:slotId', async (req, res) => {
        // #swagger.tags = ['Slots']
        // #swagger.description = 'Delete a slot'
        // #swagger.parameters['slotId'] = { description: 'Id of slot' }
        
       const id = req.params.slotId;
        try {
            await deleteSlot(id);
            res.status(204).send({ message: 'Slot removed.' });
        } catch (error) {
            return res.status(400).json({ error: `slot with id ${ id } not found` })
        }
       
    });

    // Update Vet
    app.put('/slots/:slotId', async (req, res) => {
        // #swagger.tags = ['Slots']
        // #swagger.description = 'Update a slot'
        /* #swagger.parameters['newSlot'] = {
              in: 'body',
              description: 'slot information',
              required: true,
              schema: { $ref: "#/definitions/Slot" }
       } */
        const { vetId, time } = req.body;
        const id = req.params.slotId;
        const updatedSlot = { slotId: id, vetId: vetId, time: time };
        try {
            await updateSlot(id, updatedSlot);

            res.status(200);
            res.send({ message: 'Slot updated.' });
        } catch (error) {
            return res.status(400).json({ error: `slot with id ${ id } not found`  })
        }
       
    });

    async function insertSlot(newSlot) {
        slots.push(newSlot);
    }

    async function deleteSlot(id) {
        const slotExists = slots.find(x => x.slotId === id);
        if (!slotExists) {
          throw "id not found";

        }
        
        slots = slots.filter(x => x.slotId !== id);
    }

    async function updateSlot(id, newSlot) {
        const slotExists = slots.find(x => x.slotId === id);
        if (!slotExists) {
            throw "id not found";

        }
        slotIndex = slots.map(x => { return x.slotId; }).indexOf(id);
        slots[slotIndex] = newSlot;
    }

    // Appointments

    // All Appointments
    app.get('/appointments/', (req, res) => {
        // #swagger.tags = ['Appointments']
        // #swagger.description = 'Get all appointments'
        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Appointments" },
               description: 'all appointments.' 
        } */
        res.status(200);
        res.send(appointments);
    });

    // Slot by Id
    app.get('/appointments/:appId', (req, res) => {
        // #swagger.tags = ['Appointments']
        // #swagger.description = 'Get appointment by Id'
        /* #swagger.responses[200] = { 
                schema: { $ref: "#/definitions/Appointment" },
                description: 'Appointment by Id.' 
        } */
        res.status(200);
        res.send(appointments.find(x => x.appointmentId == req.params.appId));
    });

    // Create Appointment   
    app.post('/appointments/', async (req, res) => {

        // #swagger.tags = ['Appointments']
        // #swagger.description = 'add an appointment'
        /* #swagger.parameters['newAppointment'] = {
               in: 'body',
               description: 'appointment information',
               required: true,
               schema: { $ref: "#/definitions/Appointment" }
        } */
        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Appointment" },
               description: 'new appointment.' 
        } */
        const { slotId, patientId, date } = req.body;
        const newAppointment = { appointmentId: nanoid.nanoid(lenght), slotId: slotId, patientId: patientId, date: date };

        await insertAppointment(newAppointment);

        res.status(201);
        res.send({ message: 'New Appointment inserted.' });
    });

    // Delete Appointment
    app.delete('/appointments/:appId', async (req, res) => {
        // #swagger.tags = ['Appointments']
        // #swagger.description = 'Delete an appointment'
        // #swagger.parameters['appointmentId'] = { description: 'Id of appointment' }
        
       const id = req.params.appId;
        try {
            await deleteAppointment(id);
            res.status(204).send({ message: 'Appointment removed.' });
        } catch (error) {
            return res.status(400).json({ error: `appointment with id ${ id } not found` })
        }
       
    });

    // Update Appointment
    app.put('/appointments/:appId', async (req, res) => {
        // #swagger.tags = ['Appointments']
        // #swagger.description = 'Update an appointment'
        /* #swagger.parameters['newAppointment'] = {
              in: 'body',
              description: 'appointment information',
              required: true,
              schema: { $ref: "#/definitions/Appointment" }
       } */
        const { slotId, patientId, date } = req.body;
        const id = req.params.appId;
        const updatedAppointment = { appointmentId: id, slotId: slotId, patientId: patientId, date: date };
        try {
            await updateAppointment(id, updatedAppointment);

            res.status(200);
            res.send({ message: 'Appointment updated.' });
        } catch (error) {
            return res.status(400).json({ error: `appointment with id ${ id } not found`  })
        }
       
    });

    async function insertAppointment(newAppointment) {
        appointments.push(newAppointment);
    }

    async function deleteAppointment(id) {
        const appointmentExists = appointments.find(x => x.appointmentId === id);
        if (!appointmentExists) {
          throw "id not found";

        }

        appointments = appointments.filter(x => x.appointmentId !== id);
    }

    async function updateAppointment(id, newAppointment) {
        const appointmentExists = appointments.find(x => x.appointmentId === id);
        if (!appointmentExists) {
            throw "id not found";

        }
        appIndex = appointments.map(x => { return x.appointmentId; }).indexOf(id);
        appointments[appIndex] = newAppointment;
    }
}