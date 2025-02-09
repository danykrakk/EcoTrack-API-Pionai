const express = require("express");
const { Op } = require("sequelize");
const Action = require("../models/action");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// Criar uma nova ação sustentável
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, points } = req.body;
    const userId = req.user.id; // Obtém o ID do usuário autenticado

    const action = await Action.create({ title, description, category, points, userId });
    res.status(201).json(action);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar ação", error: error.message });
  }
});

// Listar todas as ações
router.get("/", async (req, res) => {
  console.log("Recebendo requisição para listar ações..."); // Log para saber que a requisição foi recebida
  try {
    const actions = await Action.findAll();
    console.log("Ações encontradas:", actions);  // Log para verificar os dados retornados
    res.json(actions);
  } catch (error) {
    console.error("Erro ao buscar ações:", error.message); // Log do erro
    res.status(500).json({ message: "Erro ao buscar ações", error: error.message });
  }
});

// Atualizar uma ação
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, points } = req.body;

    const action = await Action.findByPk(id);
    if (!action) {
      return res.status(404).json({ message: "Ação não encontrada" });
    }

    // Verifica se a ação pertence ao usuário autenticado
    if (action.userId !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado!" });
    }

    await action.update({ title, description, category, points });
    res.json(action);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar ação", error: error.message });
  }
});

// Deletar uma ação
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const action = await Action.findByPk(id);
    if (!action) {
      return res.status(404).json({ message: "Ação não encontrada" });
    }

    // Verifica se a ação pertence ao usuário autenticado
    if (action.userId !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado!" });
    }

    await action.destroy();
    res.json({ message: "Ação deletada com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar ação", error: error.message });
  }
});

module.exports = router;
