const Joi = require('joi');
const express = require('express');

const app = express();

const games = require('./games');

app.use(express.json());



function validateGame(game) {
    const schema = {
        name: Joi.string().min(3).required(),
        date: Joi.string().min(10).required(),
        genre: Joi.string().min(3).required(),
        developer: Joi.string().min(2).required(),
        platform: Joi.string().min(2).required(),
        pegi: Joi.number().required()
    };

    return Joi.validate(game, schema);
}


app.get('/',(req,res) => {
   res.send('This is my first restful api server!'); 
});

app.get('/api/games',(req,res) => {
    res.send(games);
});

app.post('/api/games', (req,res) => {

    const { error } = validateGame(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    const game = {
        id: games.length + 1,
        name: req.body.name,
        date: req.body.date,
        genre: req.body.genre,
        developer: req.body.developer,
        platform: req.body.platform,
        pegi: req.body.pegi
    };

    games.push(game);

    res.send(game);    
});

app.put('/api/games/:id',(req,res) => {
    const game = games.find(g => g.id === parseInt(req.params.id));
    if(!game)
        res.send('The game with given ID not found. It\'s all games:\n' + JSON.stringify(games));

    const { error } = validateGame(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    for (let e in game)
    {
        if(e == "id") continue;  
     game[e] = req.body[e];
    }
    res.send(game);
});


app.get('/api/games/:id',(req,res) => {
    const game = games.find(g => g.id === parseInt(req.params.id));

    if(!game) return res.send('The game with given ID not found. It\'s all games:\n' + JSON.stringify(games));
    
    res.send(game);
});


app.get(`/api/games/:sort/:value`,(req,res) => {
    let value = req.params.value;
    let sort = req.params.sort;
    
    if(sort === 'pegi') value = parseInt(value);

    const filtered = games.filter(g => g[sort] === value);
    res.send(filtered);
});


app.delete('/api/games/:id',(req,res) => {
    const game = games.find(g => g.id === parseInt(req.params.id));
    if(!game) return res.send('The game with given ID not found. It\'s all games:\n' + JSON.stringify(games));
    
    const index = games.indexOf(game);
    games.splice(index,1);

    res.send(game);
});

app.listen(4000,'localhost',() => console.log('server started'));