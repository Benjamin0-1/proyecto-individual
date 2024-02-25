//const { Driver } = require('../src/models/Driver');
//const { sequelize } = require('../src/db');

const { sequelize, Driver } = require('../src/db');

describe('Modelos de base de dato', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    test('Crear un driver', async () => {
        const newDriver = await Driver.create({
            name: 'Test',
            lastName: 'Driver',
            description: 'Test driver description',
            image: 'test-image-url',
            nationality: 'Test Nationality',
            birthDate: '2000-01-01',
        });

        const drivers = await Driver.findAll();
        expect(drivers.length).toBe(1);
        expect(drivers[0].name).toBe('Test');
    });
});
