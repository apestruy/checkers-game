import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";
import bcrypt from "bcrypt";

class Player extends Model {
  validPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
}

Player.init(
  {
    player_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Player",
    tableName: "players",
    timestamps: false,
    hooks: {
      beforeCreate: async (player) => {
        const salt = await bcrypt.genSalt(10);
        player.password = await bcrypt.hash(player.password, salt);
      },
      beforeUpdate: async (player) => {
        if (player.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          player.password = await bcrypt.hash(player.password, salt);
        }
      },
    },
  }
);

export default Player;
