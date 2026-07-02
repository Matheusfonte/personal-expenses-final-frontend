const expenseController = require('../controllers/expense.js');

class ExpenseView {

    // Lista todas as despesas
    getAll(req, res) {

        const expenses = expenseController.getAll();

        if (!expenses) {
            return res.status(404).send('Nenhuma despesa encontrada');
        }

        res.status(200).send(expenses);
    }

    // Busca despesa por ID
    getById(req, res) {

        // Converte o ID para número
        const id = Number(req.params.id);

        const expense = expenseController.getById(id);

        if (!expense) {
            return res.status(404).send('Despesa não encontrada');
        }

        res.status(200).send(expense);
    }

    // Cria uma nova despesa
    create(req, res) {

        // Pega os dados enviados no body
        const { title, amount, category, date, description } = req.body;

        // Validação dos campos obrigatórios
        if (!title || !amount || !category || !date) {
            return res.status(400).send('Todos os campos são obrigatórios');
        }

        const expense = expenseController.create(title, amount, category, date, description);

        res.status(201).send(expense);
    }

    // Atualiza uma despesa
    update(req, res) {

        const id = Number(req.params.id);

        // Verifica se a despesa existe
        const expenseExists = expenseController.existsExpense(id);

        if (!expenseExists) {
            return res.status(404).send('Despesa não encontrada');
        }

        const { title, amount, category, date, description } = req.body;

        if (!title || !amount || !category || !date) {
            return res.status(400).send('Todos os campos são obrigatórios');
        }

        const expense = expenseController.update(id, title, amount, category, date, description);

        res.status(200).send(expense);
    }

    // Remove uma despesa
    delete(req, res) {

        const id = Number(req.params.id);

        const expenseExists = expenseController.existsExpense(id);

        if (!expenseExists) {
            return res.status(404).send('Despesa não encontrada');
        }

        expenseController.delete(id);

        res.status(204).send();
    }

}

module.exports = ExpenseView;

