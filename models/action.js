const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Verifique se o caminho está correto
const User = require("./user"); // Certifique-se de que o modelo User existe

const Action = sequelize.define("Action", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Garante um UUID único para cada ação
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM("Reciclagem", "Energia", "Água", "Mobilidade"), // Define categorias específicas
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Inicializa com 0 pontos
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Garante que está referenciando um modelo válido
      key: "id",
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Associação com User
Action.belongsTo(User, { foreignKey: "userId" });

module.exports = Action;
