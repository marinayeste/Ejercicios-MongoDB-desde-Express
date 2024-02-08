const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
let { MongoClient } = require('mongodb');

app.use(express.urlencoded({ extended: false }))
app.use(express.json())


const client = new MongoClient('mongodb://localhost:27017');

async function connectMongo() {
 
    try {
        await client.connect().then((client) => app.locals.db = client.db('mix').collection('menu'))
        console.log("MongoDB está conectado")
    } catch (error) {
        console.error("MongoDB no conectado:", error)
    }
}

connectMongo()

app.use(express.static('public'))

// ruta get para obtener todos los menús

app.get('/api/menus', async (req, res) => {
    try {
        const results = await app.locals.db.find({}).toArray()
        res.send({ mensaje: "Peticion correcta", results })
    } catch (error) {
        res.send({ mensaje: "No se ha podido cargar el menu", error })
    }
})

//añadir menú

app.post('/api/nuevoMenu', async (req, res) => {
    try {
        let { numero, primerPlato, postre, segundoPlato, precio } = req.body
        const results = await app.locals.db.createOne({ numero, primerPlato, postre, segundoPlato, precio })
        res.send({ mensaje: "Menu anyadido", results })
    } catch (error) {
        res.send({ mensaje: "No se ha podido anyadir el menú", error })
    }
})

//modificar menú

app.put('/api/editarMenu', async (req, res) => {
    try {
        let { numero, postre, primerPlato, segundoPlato, precio } = req.body

        const results = await app.locals.db.updateOne({ numero: numero }, { primerPlato: primerPlato, postre: postre, segundoPlato: segundoPlato, precio: precio })
        res.send({ mensaje: 'Menú modificado', results })
    } catch (error) {
        res.send({ mensaje: 'no se ha podido editar el menu', error })
    }
})

//borrar menú

app.delete('/api/borrarMenu', async (req, res) => {
    try {
        const results = await app.locals.db.deleteOne({ numero: req.body.numero })
        results.deleteCount < 1
            ? res.send({ mensaje: 'Menú no borrado', results })
            : res.send({ mensaje: 'Menú borrado', results })
    } catch (error) {
        res.send({ mensaje: 'No se ha podido borrar el menu', error })
    }
})


app.listen(process.env.PORT || 3000, (e) => {
    e
        ? console.error('No se ha podido iniciar el servidor')
        : console.log('Servidor a la escucha en el puerto:' + (process.env.PORT || 3000))

});