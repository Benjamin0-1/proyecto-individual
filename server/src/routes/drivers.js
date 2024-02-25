const { Router } = require("express");
const router = Router();
const { Driver, Team } = require('../db');
const { Op } = require("sequelize");


router.get('/', async (req, res) => {
  try {
   
    const dbbCount = await Driver.count();
    console.log(dbbCount);

    if (dbbCount === 0) {
      const response = await fetch('http://localhost:5000/drivers');
      const data = await response.json();
      return res.json(data); 
    }

    const drivers = await Driver.findAll({
      include: Team, // Is it required to include teams?
    });

 
    const defaultImage = drivers.map((driver) => ({
      ...driver.toJSON(),
      image: driver.image || 'https://.tatlerasia.com/asiatatler/i/ph/2019/03/15162238-1_cover_1920x1280.jpg',
    }));

    return res.json(defaultImage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

  

router.get('/:idDriver', async (req, res) => {
    const { idDriver } = req.params;
    try {
        const driver = await Driver.findByPk(Number(idDriver), {
            include: Team, 
        })

        if (!driver) {
            return res.status(404).json({ message: `No existe conductor con el ID: ${idDriver}` });
        }

        res.json(driver);

    } catch (error) {
        res.status(500).json({ message: 'Error de servidor' });
    }
});


// es la misma que: router.get('/searchname/name', async(req, res) => {
router.get('/name', async (req, res) => {
  try {
    const { name } = req.query;

    const dbDriversPromise = Driver.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
      limit: 15,
      include: Team,
    });


    const apiDriversPromise = fetch(`http://localhost:5000/drivers?name.forename=${name}`)
      .then(response => response.json());

    const [dbDrivers, apiDrivers] = await Promise.all([dbDriversPromise, apiDriversPromise]);

    const allDrivers = [...dbDrivers, ...apiDrivers];

    res.json(apiDrivers);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error de servidor desde catch en /name' });
  }
});


router.post('/', async (req, res) => {
    const {
      name,
      lastName,
      description,
      image,
      nationality,
      birthDate,
      teams, // Array de IDs de los equipos asociados al conductor
    } = req.body;
  
    try {
      const newDriver = await Driver.create({
        name,
        lastName,
        description,
        image,
        nationality,
        birthDate,
      });
  
  
      // Asociar el conductor con los equipos indicados
      if (teams && teams.length > 0) {
        await newDriver.addTeams(teams);
      }
  
      const createdDriver = await Driver.findByPk(newDriver.id, {
        include: Team,
      });
  
      res.status(201).json(createdDriver);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error de servidor' });
    }
  });

module.exports = router;


//debug : /name por query.
router.get('/searchname/name', async(req, res) => {
  try {
    const { name } = req.query;

    const dbDriversPromise = Driver.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
      limit: 15,
      include: Team,
    });

    const apiDriversPromise = fetch(`http://localhost:5000/drivers?name.forename=${name}`)
      .then(response => response.json());

    const [dbDrivers, apiDrivers] = await Promise.all([dbDriversPromise, apiDriversPromise]);

    const allDrivers = [...dbDrivers, ...apiDrivers];

    res.json(allDrivers);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error de servidor desde catch en /name' });
  }
});
 // ruta testing ejemplo: http://localhost:3001/drivers/searchname/name?name=Nick
