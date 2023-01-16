import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import productRouter from './routers/ProductRouter.js';
import userRouter from './routers/UserRouter.js';
import dotenv from 'dotenv';
import orderRouter from './routers/OrderRouter.js';
import uploadRouter from './routers/UploadRouter.js';
import cors from 'cors';

dotenv.config();

console.log('a');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongodb://localhost:27017/ecommerce

// ñ
mongoose
  .connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log(error));
app.use('/api/uploads', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
app.get('/api/config/google', (req, res) => {
  res.send(process.env.GOOGLE_API_KEY || '');
});

// mercadopago.configure({
//   access_token: process.env.ACCESS_TOKEN,
// });

// app.use("/generar", (req, res) => {
//   let preference = {
//     back_urls: {
//       success: `/order/${req.query.id}`,
//       failure: "http://localhost:3000/",
//       pending: "http://localhost:3000/",
//     },
//     items: [
//       {
//         title: "Mi producto",
//         unit_price: 100,
//         quantity: 1,
//         currency_id: "ARS",
//       },
//     ],
//     notification_url: "http://localhost:3000/",
//   };

//   mercadopago.preferences
//     .create(preference)
//     .then(function (response) {
//       // En esta instancia deberás asignar el valor dentro de response.body.id por el ID de preferencia solicitado en el siguiente paso
//       res.json(response.body.init_point);
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// });

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
);
// app.get("/", (req, res) => {
//   res.send("Server is ready.");
// });

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: err.message });
});

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;
app.listen(port, host, () => {
  console.log(`Server at http://localhost:${port}`);
});
