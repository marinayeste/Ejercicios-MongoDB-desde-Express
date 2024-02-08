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

app.get('/api/libros', async (req, res) => {
    try {
        const results = await app.locals.db.collection('libros').find().toArray()
        res.send({ mensaje: 'Petición okey', results })
    } catch (error) {
        res.send({ mensaje: 'Petición no resuelta', error })
    }
})

app.get('api/libros/:titulo', async (req, res) => {
    try {
        const results = await app.locals.db.collection('libros').find({ titulo: req.params.titulo }).toArray()
        res.send({ mensaje: 'Petición satisfecha', results })
    } catch (error) {
        res.send({ mensaje: 'Algo ha fallado', error })
    }
})

app.post('api/nuevoLibro/:titulo', async (req, res) => {
    try {
        const results = await app.locals.db.collection('libros').insertOne({ titulo: req.params.titulo, leido: false })
        res.send({ mensaje: 'Libro añadido', results })
    } catch (error) {
        res.send({ mensaje: 'Libro no insertado', error })
    }
})

app.put('api/editarLibro/:titulo', async (req, res) => {
    try {
        const results = await app.locals.db.collection('libros').updateOne({ titulo: req.params.titulo }, { $set: { leido: true } })
        res.send({ mensaje: 'Libro modificado', results })
    } catch (error) {
        res.send({ mensaje: 'Libro no modificado', error })
    }
})

app.delete('api/borrarLibro/:titulo', async (req, res) => {
    try {
        const results = await app.locals.db.collection('libros').deleteOne({ titulo: req.params.titulo })
        results.deleteCount < 1
            ? res.send({ mensaje: 'Libro no borrado', results })
            : res.send({ mensaje: 'Libro borrado', results })
    } catch (error) {
        res.send({ mensaje: 'Libro no borrado', error })
    }
})

app.listen(process.env.PORT || 3000, (e) => {
    e
        ? console.error('No se ha podido iniciar el servidor')
        : console.log('Servidor a la escucha en el puerto:' + (process.env.PORT || 3000))

});
