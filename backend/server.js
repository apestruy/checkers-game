import dotenv from "dotenv";
dotenv.config();

import Player from "./models/Player.js";
import Game from "./models/Game.js";

import express from "express";
import session from "express-session";
import cors from "cors";

import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: true,
    },
  })
);

app.post("/register", async (req, res) => {
  const { username, name, password } = req.body;

  try {
    const newPlayer = await Player.create({
      username,
      name,
      password,
    });
    res.status(201).json({
      message: "Player registered successfully",
      player: { id: newPlayer.player_id, username: newPlayer.username },
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(409).json({ message: "Username is already taken" });
    } else {
      res.status(500).json({ message: "Error registering player" });
    }
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const player = await Player.findOne({ where: { username } });
    if (player && player.validPassword(password)) {
      req.session.playerId = player.player_id;
      req.session.username = player.username;
      req.session.playerName = player.name;

      res.json({
        message: "Login successful!",
        playerId: player.player_id,
        playerName: player.name,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Could not log out, please try again" });
    }
    res.send("Logged out successfully!");
  });
});

app.post("/games", async (req, res) => {
  const { state, player_turn, player_id, player_score, computer_score } =
    req.body;

  try {
    const newGame = await Game.create({
      state,
      player_turn,
      player_id,
      player_score,
      computer_score,
    });
    res.status(201).json({ message: "Game saved successfully", newGame });
  } catch (error) {
    console.error("Failed to save game:", error);
    res
      .status(500)
      .json({ message: "Failed to save game due to server error" });
  }
});

app.get("/game/:playerId/last", async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const game = await Game.findOne({
      where: { player_id: playerId },
      order: [["createdAt", "DESC"]],
    });

    if (game) {
      res.json(game);
    } else {
      res.status(404).send("Game not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving game data" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
