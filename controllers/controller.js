const { where } = require("sequelize");
let { Category, Product, Wallet, User, Transaction, TransactionDetail } = require("../models");
const transactiondetail = require("../models/transactiondetail");

class Controller {
  static productAdmin(req, res) {
    const { sortByName, sortByPrice, filterByCategory } = req.query;

    let options = {};
    if (sortByName) options.order = [["name", "ASC"]];
    else if (sortByPrice) options.order = [["price", "ASC"]];
    else if (filterByCategory) options.where = { CategoryId: filterByCategory };

    Product.findAll(options)
      .then((admins) => {
        res.render("admins", { admins });
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static emptyProduct(req, res) {
    Product.findAll({
      where: {
        stock: 0,
      },
    })
      .then((admins) => res.render("emptyProduct", { admins }))
      .catch((err) => res.send(err));
  }
  static addProduct(req, res) {
    Category.findAll()
      .then((categories) => {
        res.render("addProduct", { categories });
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static createProduct(req, res) {
    const { name, price, imgUrl, stock, CategoryId } = req.body;
    Product.create({ name, price, imgUrl, stock, CategoryId })
      .then(() => {
        res.redirect("/admins");
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static listTransaction(req, res) {
    Transaction.findAll({
      include: User,
    })
      .then((transaction) => {
        res.render("transaction", { transaction });
        // res.send(transaction)
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static transactionDetail(req, res) {
    const { transactionId } = req.params;
    TransactionDetail.findByPk(+transactionId, {
      include: [Product, Transaction],
    })
      .then((transactions) => {
        // res.send(transactions)
        res.render("transactionDetail", { transactions });
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static editProduct(req, res) {
    const { adminId } = req.params;
    Product.findByPk(+adminId)
      .then((admin) => {
        res.render("editProductStock", { admin });
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static restockProduct(req, res) {
    const { adminId } = req.params;
    const { stock } = req.body;
    Product.create({ stock }, { where: { id: adminId } })
      .then(() => {
        res.redirect("/admins");
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static deleteProduct(req, res) {
    const { adminId } = req.params;
    Product.destroy({
      where: { id: adminId },
    })
      .then(() => {
        res.redirect("/admins");
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static successTransaction(req, res) {
    const { adminId, productId } = req.params;
    Transaction.update({ status: "Status" }, { where: { id: productId } })
      .then(() => {
        res.redirect(`/customers/${adminId}/`);
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static cancelTransaction(req, res) {
    const { adminId, productId } = req.params;
    Transaction.update({ status: "Cancel" }, { where: { id: productId } })
      .then(() => {
        res.redirect(`/customers/${adminId}/`);
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static wellcomeCustomer(req, res) {
    Category.findAll()
      .then((categories) => {
        res.render("categories", { categories });
        // res.send(categories)
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static listProduct(req, res) {
    const { id } = req.params;
    Category.findByPk(+id, {
      where,
      include: Product,
    })
      .then((customers) => {
        res.render("customers", { customers });
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static checkout(req, res) {
    const { id, ProductId } = req.params;
    Product.findByPk(ProductId)
      .then((data) => {
        data = data
        return Product.increment(
          {
            stock: -1,
          },
          { where: { id: ProductId } }
        );
      })
      .then(() => res.redirect(`/customers/${id}`))
      .catch((err) => res.send(err));
  }
}

module.exports = Controller;
