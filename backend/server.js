const express = require('express');
const connectDB = require('./db/connectDB');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.route');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser'); 
const path = require('path')

app.use(cookieParser()); // 

app.use(express.static(path.join(__dirname, '../frontend/dist')));

const PORT = 5000;

dotenv.config({ path: __dirname + './.env'}); 


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true, // allow cookies/headers
  }));

app.use(express.json());

app.use('/api/auth', authRoutes);


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
    connectDB();
    console.log(`Server listening on Port: ${PORT}`);
})


console.log("JWT_SECRET:", process.env.JWT_SECRET); // Debugging
