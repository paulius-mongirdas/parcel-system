import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

/*app.get('/trucks', async (req, res) => {
  const trucks = await prisma.truck.findMany();
  res.json(trucks);
});*/

app.listen(3333, () => {
  console.log('Server is running on http://localhost:3333');
});