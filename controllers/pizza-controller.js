const { Pizza } = require("../models");

const pizzaController = {
  // the functions will go here as methods

  //  get all pizzas
  getAllPizzas(req, res) {
    Pizza.find({})
      .populate({
        path: "comments",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one pizza by id
  getPizzaById({ params }, res) {
    // we destructure the `params` out of the Express.js `req` object since that's all we need
    Pizza.findOne({ _id: params.id })
      .populate({
        path: "comments",
        select: "-__v",
      })
      .select("-__v")
      .then((dbPizzaData) => {
        // if no pizza id found, send 404
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id! " });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // createPizza - adds a pizza to the database
  createPizza({ body }, res) {
    // we destructure the `body` out of the Express.js `req` object since that's all we need
    Pizza.create(body) // MongoBD methods are 'insertOne' or 'insertMany', but Mongoose 'create() can handle one or multiple inserts
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => res.status(400).json(err));
  },

  // updte pizza by id
  updatePizza({ params, body }, res) {
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true }) // this method allows mongoose to find a single document and update it. new:true causes it to return the updated document instead of the original
      .then((dbPizzaData) => {
        // Mongoose & MongoDB also have .updateOne() & .updateMany() that updates documents without returning them
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // delete pizza
  deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id }) // finOneAndDelete() finds and deletes a document from the database. Other methods are .deleteOne() & .deleteMany()
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = pizzaController;
