import express, { Request, Response } from 'express';
import logger from './middleware/logger';
import router from './routes/users'
import errorHandler from './middleware/errorHandler';
import { connectDB } from './config/db';

const app = express();
const PORT = process.env.PORT ? Number(process.env.port) : 3333;

app.use(express.json());
app.use(logger);

app.get('/', (_req: Request, res: Response) => {
    res.send('Hello! There is an Express + TS app running');
})

app.use('/users', router);

app.use((_req: Request, res: Response) => res.status(400).json({ error: 'Not found' }));

app.use(errorHandler);

// async function runApp() {
//     const db = await connectDB();
// }

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('failed to connect to mongodb:', err);
        process.exit(1);
    });