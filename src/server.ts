import { createApp } from './app';
import { mongoDb } from './config/db';

async function start() {
  await mongoDb.connect();

  const app = createApp(mongoDb);

  const PORT = process.env.PORT ? Number(process.env.port) : 3333;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
