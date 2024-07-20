import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import db from './config/Database.js';
import SequelizeStore from 'connect-session-sequelize';
import UserRoute from './routes/UserRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import SupplierRoute from './routes/SupplierRoute.js';
import PasienRoute from './routes/PasienRoute.js';
import RekamMedisRoute from './routes/RekamMedisRoute.js';
import AlatRoute from './routes/AlatRoute.js';
import ObatRoute from './routes/ObatRoute.js';
import BatchObatRoute from './routes/BatchObatRoute.js';
import BatchAlatRoute from './routes/BatchAlatRoute.js';
import DokterRoute from './routes/DokterRoute.js';
import TestRoute from './routes/TestRoute.js';

dotenv.config();

const port = process.env.APP_PORT || 3000;
const host = process.env.APP_HOST || "0.0.0.0";

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db,
    checkExpirationInterval: 30 * 60 * 1000, // Check every 30 minutes for expired sessions
    expiration: 30 * 60 * 1000, // Sessions expire after 30 minutes of inactivity
});

// (async () => {
//   await db.sync({ alter: true });
// })();

app.use(
    session({
        secret: process.env.SESS_SECRET,
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: {
            secure: 'auto',
        },
        rolling: true,
    })
);
app.use(
    cors({
        credentials: true,
        origin: [
            'http://localhost:3000',
            'http://ryacuduinfo.site',
            'https://ryacuduinfo.site',
        ],
    })
);

app.use(express.json());
app.use(UserRoute);
app.use(AuthRoute);
app.use(SupplierRoute);
app.use(PasienRoute);
app.use(RekamMedisRoute);
app.use(AlatRoute);
app.use(ObatRoute);
app.use(BatchObatRoute);
app.use(BatchAlatRoute);
app.use(DokterRoute);
app.use(TestRoute);

// store.sync();

app.listen(port, host, () => {
    console.log('Server up and running...');
});
