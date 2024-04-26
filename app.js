import express from 'express';
import mongoose from 'mongoose';
import { PORT, mongoDBURL } from './config.js';
import { User } from './model/user.js';

const app = express();
app.use(express.json());

app.get('/', (request, response) => {
  response.status(200).send('<h1>hello</h1>');
});

app.post('/users', async (request, response) => {
  const { firstname, lastname, email, password } = request.body;
  if (!firstname || !lastname || !email || !password) {
    response.status(400).send({ message: "Invalid request, missing required fields." });
    return;
  }
  const newUser = { firstname, lastname, email, password };
  try {
    await User.create(newUser);
    response.status(201).send({ message: "User created successfully." });
  } catch (error) {
    response.status(500).send({ message: "Failed to create user." });
  }
});

// GET route to fetch all users
app.get('/users', async (request, response) => {
  try {
    const users = await User.find();
    response.status(200).send({ users });
  } catch (error) {
    response.status(500).send({ message: "Failed to fetch users." });
  }
});

// GET route to fetch a specific user by ID
app.get('/users/:id', async (request, response) => {
  const { id } = request.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      response.status(404).send({ message: "User not found." });
      return;
    }
    response.status(200).send({ user });
  } catch (error) {
    response.status(500).send({ message: "Failed to fetch user." });
  }
});

// PATCH route to update a user's information
app.patch('/users/:id', async (request, response) => {
  const { id } = request.params;
  const { firstname, lastname, email, password } = request.body;
  try {
    const user = await User.findByIdAndUpdate(id, { firstname, lastname, email, password }, { new: true });
    if (!user) {
      response.status(404).send({ message: "User not found." });
      return;
    }
    response.status(200).send({ message: "User updated successfully.", user });
  } catch (error) {
    response.status(500).send({ message: "Failed to update user." });
  }
});

// DELETE route to delete a user
app.delete('/users/:id', async (request, response) => {
  const { id } = request.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      response.status(404).send({ message: "User not found." });
      return;
    }
    response.status(200).send({ message: "User deleted successfully." });
  } catch (error) {
    response.status(500).send({ message: "Failed to delete user." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Express is listening on port ${PORT}`);
});

// Connect to MongoDB
mongoose.connect(mongoDBURL).then(() => {
  console.log("Connected to MongoDB.");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});
