const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
let { MongoClient } = require('mongodb');

app.use(express.urlencoded({ extended: false }))
app.use(express.json())


const client = new MongoClient('mongodb://127.0.0.1:27017');

async function connectMongo() {
    try {
        await client.connect()
            .then((client) => app.locals.db = client.db('mix'))
        await client.db("admin").command({ ping: 1 })
        console.log("MongoDB está conectado")
    } catch (error) {
        console.error("MongoDB no conectado:", error)
    }
}

connectMongo()

app.use(express.static('public'))

app.get('api/series', async (req, res) => {
    try {
        const results = await app.locals.db.collection('series').find({}).toArray()
        res.send({ mensaje: "petición correcta", results })
    } catch (error) {
        res.send({ mensaje: "Error al hacer la consulta", error })
    }
})

app.post('api/nuevaSerie', async (req, res) => {
    try {
        let { titulo, plataforma, nota } = req.body
        let results = await app.locals.db.collection('series').insertOne({ titulo, plataforma, nota })
        res.send({ mensaje: "Serie añadida", results })
    } catch (error) {
        res.send({ mensaje: "No ha sido posible añadir la serie", error })
    }
})

app.get('/api/:serie', async (req, res) => {
    try {
        const results = await app.locals.db.collection('series').find({ serie: req.params.serie }).toArray()
        results.length > 0
            ? res.send({ mensaje: "Serie correcta", results })
            : res.send({ mensaje: "Serie no presente en la base" })
    } catch (error) {
        res.send({ mensaje: "Error al buscar la serie", error })
    }
})






app.listen(process.env.PORT || 3000, (e) => {
    e
        ? console.error('No se ha podido iniciar el servidor')
        : console.log('Servidor a la escucha en el puerto:' + (process.env.PORT || 3000))

});