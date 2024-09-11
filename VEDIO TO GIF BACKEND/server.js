const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

const users = []; 

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = {email, password: hashedPassword };
  users.push(user);
  res.status(201).send('User registered successfully');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  console.log(user)
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token, name: user.name });
  } else {
    res.status(401).send('Invalid email or password');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});