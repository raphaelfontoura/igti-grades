import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { db } from './models/index.js';
import { gradeRouter } from './routes/gradeRouter.js';

(async () => {
  try {
    await db.mongoose.connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    process.exit();
  }
})();

const app = express();

//define o dominio de origem para consumo do servico
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'https://protected-anchorage-34990.herokuapp.com',
  })
);

app.get('/', (req, res) => {
  res.send('API em execucao');
});

app.all('/grade', gradeRouter);
app.all('/grade/*', gradeRouter);

app.listen(process.env.PORT || 8081, () => {});
