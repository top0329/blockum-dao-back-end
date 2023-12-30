const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');

const app = express();
// const corsOptions = {
//   origin: 'http://localhost:8002',
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cors(corsOptions));
app.use(cors());

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/blockum-vault', require('./routes/api/blockumVault'));
app.use('/api/fgol-distribution', require('./routes/api/fgolDistribution'));
app.use('/api/history', require('./routes/api/history'));

// Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
//   // Set static folder
//   app.use(express.static('client/build'));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
