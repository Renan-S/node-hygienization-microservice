import "reflect-metadata";
import { startAllRepositories } from "./repositories/start-all-repositories";
import { connectToDb } from "./connect-to-db";
import { userBuyProfileController } from "./controllers/user-buy-profile-controller";
import express = require('express');
import upload = require('express-fileupload')
import { UploadedFile } from "express-fileupload";


const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();
app.use(upload());

(async () => {
    const database = await connectToDb();
    startAllRepositories(database);
})();

app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.post('/', (req, res) => {
    if (req.files) {
        const file = req.files.choosenFile as UploadedFile;

        file.mv(`./src/input/${file.name}`, async (error) => {
            if (error) {
                res.send(error)
            } else {
                res.send('The file was uploaded, please wait a little for processing and saving. After a few seconds please run docker exec -it postgreSQL-base-db psql -U admin base-db to connect to DB and then run this query to list some of the values SELECT * FROM "user_buy_profile" LIMIT 100;')
                await userBuyProfileController(file.name)
            }
        })
    }
});

app.listen(PORT, HOST);