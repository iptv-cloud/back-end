import app from './app.js';

const { PORT } = process.env

app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}...`)
})