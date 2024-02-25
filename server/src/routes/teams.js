const { Router } = require("express");
const router = Router();
const { Driver, Team } = require('../db');

// obtener todos los equipos de la API, en caso de que la base de datos esté vacía, guardar esos equipos en la base de datos.
router.get('/', async (req, res) => {
    const apiPort = 5000;
    const apiURL = `http://127.0.0.1:${apiPort}/drivers`;

    try {
        const teamCount = await Team.count();
        console.log(teamCount);
        if (teamCount === 0) {
            const api = await fetch('http://localhost:5000/drivers');

            if (!api.ok) {
                throw new Error(`Error fetching teams from the API. Status: ${api.status}`);
            }

            const apiResponse = await api.json();

            const allTeams = await apiResponse.flatMap((team) => team.teams);
            
            //await Team.bulkCreate({name: allTeams}); 


            const validTeams = allTeams.filter(teamName => teamName !== null && teamName !== undefined);

             await Team.bulkCreate(
             validTeams.map(teamName => ({ name: teamName })));


            res.json({message: 'Teams created: ', 'teams': allTeams.length});

        } else { 
            const teamsInDb = await Team.findAll();
            res.json(teamsInDb);
        } 
        
    } catch (error) {
         console.error('ERROR: ', error);
        res.json({error: 'Error de servidor'});
    }
});






// ruta Adicional para crear un equipo
router.post('/createteam', async(req,res) =>{
    const name = req.body.name;
    if (!name) {res.json({Error: 'Name is empty'});}

    try {
        const newTeam = await Team.create({
        name: name
    });
    res.json({message: 'Equipo creado con exito: ', name})

    } catch (error) {
        res.json({error: 'Error de servidor'});
    }
});

// ruta para testing
router.get('/test', async(req, res) => {
    const apiPort = 5000;
    const apiURL = `http://127.0.0.1:${apiPort}/drivers`;
    const rickandmortyapi = 'https://rickandmortyapi.com/api/character';
    const localAPI = 'http://localhost:5000/drivers';
    try {
        const teamsInDb = await Team.count();
        if (teamsInDb === 0) {
            const apiResponse = await fetch(localAPI);
            const data = await apiResponse.json();
            res.json(data);
        };
    } catch (error) {
        res.status(500).json({error: 'Error de servidor en ruta /teams/test'})
    }
});


//testar
router.get('/teams', async (req, res) => {
    try {
        const apiURL = 'http://localhost:5000/drivers'; // DRIVERS.
        //const dbTeams = Team.count();
        //if (dbTeams === 0) {}
        const apiTeamsResponse = await fetch(apiURL);

        if (!apiTeamsResponse.ok) {
            throw new Error(`Error fetching teams from the API. Status: ${apiTeamsResponse.status}`);
        }

        const apiTeamsData = await apiTeamsResponse.json();

        const allDrivers = await apiTeamsData.flatMap((driver) => driver.teams);

        const apiTeams = apiTeamsData[55].teams;

        res.json(allDrivers); // apiTeams

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
