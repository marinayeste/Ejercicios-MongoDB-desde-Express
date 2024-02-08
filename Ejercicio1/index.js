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

//método get

app.get('/api/mesas', async (req, res) => {
    try {
        let results = await app.locals.db.collection('tables').find().toArray();
        res.send({
            mensaje: "Petición correcta" + results
        })
    } catch (error) {
        res.status(500).send({ mensaje: "Error al hacer la consulta", error });
    }
});


app.post('/api/anyadir', async (req, res) => {

    try {
        let { tamanyo, color, material, patas } = req.body
        const results = await app.locals.db.collection('tables').insertOne({ tamanyo, color, material, patas })
        res.send({
            mensaje: "Documento insertado", results
        })
    } catch (error) {
        res.status(500).send({ mensaje: "Error al hacer la inserción", error })
    }
})

app.put('/api/modificar/:color', async (req, res) => {
    try {
        const results = await app.locals.db.collection('mesas').updateMany({ color: req.params.color }, { $set: { color: "granate" } })
        res.send({ mensaje: "Documentos actualizado", results })
    } catch (error) {
        res.send({ mensaje: "Modifiación fallida", error })
    }
})

app.delete('/api/borrar/:patas', async (req, res) => {
    try {
        const results = await app.locals.db.collection('tables').deleteMany({ patas: parseInt(req.params.patas) })
        res.send({ mensaje: "Documentos borrados", results })
    } catch (error) {
        res.send({ mensaje: "Borrado fallido", error })
    }
})



app.listen(process.env.PORT || 3000, (e) => {
    e
        ? console.error('No se ha podido iniciar el servidor')
        : console.log('Servidor a la escucha en el puerto:' + (process.env.PORT || 3000))

});
