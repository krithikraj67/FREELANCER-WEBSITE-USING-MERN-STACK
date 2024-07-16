const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  userExists,
  findUserById,
  findUsers,
  registerUser,
  loginUser,
  updateUser,
} = require("../controllers/UserController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/Users_imgs");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get("/users", async (req, res) => {
  try {
    const users = await findUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/register", upload.single("image"), async (req, res) => {
  const { fullName, age, email, username, password, role } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const user = await registerUser(
      fullName,
      age,
      email,
      username,
      password,
      image,
      role
    );
    if (user) {
      res.status(201).json(user);
    } else {
      res.status(400).json({ error: "User already exists" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userData = await loginUser(username, password);
    if (userData) {
      if (userData === 1) {
        res.status(401).json({ error: "Invalid password" });
      } else {
        res.json(userData);
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/users/:id", upload.single("image"), async (req, res) => {
  const { fullName, age, username } = req.body;
  const image = req.body.image;
  const imageFile = req.file ? req.file.filename : null;

  try {
    const updatedUser = await updateUser(
      req.params.id,
      fullName,
      age,
      username,
      image,
      imageFile
    );
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
