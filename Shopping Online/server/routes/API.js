var express = require('express');
var router = express.Router();
var multer = require('multer');

var specificImageName;
var response;

jbUser = require('../models/users.model');
jbProductCategory = require("../models/productType.model");
jbProduct = require('../models/products.model');
jbCart = require("../models/cart.model");
jbCartProd = require("../models/cartProduct.model");
jbOrder = require("../models/orders.model");

router.get('/prelog', async (req, res, next) => {
  try {
    res.json(req.session)
  }
  catch (err) {
    console.log(err);
  }
});

router.post('/allusers', function (req, res, next) {
  var idDuped = false;
  var userNameDuped = false;
  var passConfirmed = false;
  jbUser.find().then(data => {
    for (let i = 0; i < data.length; i++) {
      //form register step 1
      if (req.body.ID == data[i].userIdNum && !req.body.password) {
        idDuped = true;
      }
      if (req.body.userName == data[i].userName) {
        if (req.body.password === data[i].password) {
          passConfirmed = true;
        }
        userNameDuped = true;
        var index = i;
      }
    }
    // case registration form step 1
    if (!req.body.password) {
      res.json({ idDuped: idDuped, userNameDuped: userNameDuped });
    }
    // case login
    else {
      if (userNameDuped && passConfirmed) {
        req.session.user = data[index];
        res.json(data[index]);
      }
      else {
        res.json({ error: "User name or password incorrect" })
      }
    }
  });
});


router.post('/register', function (req, res, next) {

  var newUser = new jbUser({
    firstName: req.body.firstName,
    lastName: req.body.lastName,

    address: {
      city: req.body.city,
      street: req.body.street,
      houseNum: req.body.houseNumber,
      apt: req.body.aptNumber
    },

    userName: req.body.userName,
    email: req.body.email,
    userIdNum: req.body.ID,
    password: req.body.choosePassword,
    role: "user"
  });

  newUser.save(function (err, doc) {
    if (err) throw err;
    req.session.user = doc;
    res.json(doc)
  });

});


router.get('/logout', async (req, res, next) => {

  try {
    req.session.destroy()
    res.json([{ msg: "Session destroyed" }])
  } catch (err) {
    console.log(err);
  }
});


router.get('/products', function (req, res, next) {
  jbProduct.find().then(data => {
    res.json(data)
  })
});

router.get('/category', function (req, res, next) {
  jbProductCategory.find().then(data => {
    res.json(data)
  })
});

router.post('/createCart', function (req, res, next) {
  const dateNow = new Date().toString();
  var newCart = new jbCart({
    client: req.body.userID,
    creationDate: dateNow
  });

  newCart.save(function (err, doc) {
    if (err) throw err;
    res.json(doc)
  });

});

router.get('/searchCart', function (req, res, next) {

  jbCart.find().then(data => {

    // var idDuped = false;
    if (data.length === 0) {
      res.json(false);
    }
    for (let i = 0; i < data.length; i++) {

      if (req.query.userID == data[i].client) {
        return res.json(data[i]);
      }
    }
    res.json(false);
  });
});


router.get('/insertToCartMethod', function (req, res, next) {
  response = res;

  jbCartProd.find({ cartID: req.query.cart, prodID: req.query.chosenProductID }, function (err, currentProd) {
    if (err) {
      res.send(err);
    }
    console.log(currentProd);
    if (currentProd.length === 1) {
      return updateProdStatus({
        currentProd: currentProd,
        amount: req.query.amount,
        totalPrice: req.query.totalPrice
      });
    }
    else {
      return insertToCart(req);
    }

  });
});

var insertToCart = function (req, res, next) {

  var newCartProd = new jbCartProd({
    prodID: req.query.chosenProductID,
    cartID: req.query.cart,
    amount: req.query.amount,
    totalPrice: parseFloat(req.query.totalPrice)
  });

  newCartProd.save(function (err, doc) {
    if (err) throw err;
    response.json(doc)
  });

};

var updateProdStatus = function (req, res, next) {
  var currentAmount = parseFloat(req.amount);
  var currentPrice = parseFloat(req.totalPrice);
  jbCartProd.findByIdAndUpdate(req.currentProd[0].id,
    {
      $set: {
        amount: req.currentProd[0].amount + currentAmount,
        totalPrice: req.currentProd[0].totalPrice + currentPrice
      }
    },
    {
      new: true
    },

    function (err, updatedProd) {
      if (err) throw err;
      response.json(updatedProd)
    }
  )

}

router.get('/searchUserCart', function (req, res, next) {

  jbCart.find({ client: req.query.userID }).then(data => {
    res.json(data);
  })
});

router.get('/searchUserProducts', function (req, res, next) {

  jbCartProd.find({ cartID: req.query.cartID }).then(data => {
    res.json(data);
  })
});

router.get('/displayUserProducts', function (req, res, next) {
  var userProd = [];
  var oneItem;
  jbProduct.find().then(data => {
    if (typeof (req.query.prod) != "object") {
      oneItem = req.query.prod;
      req.query.prod = [];
      req.query.prod.push(oneItem)
    }
    for (let i = 0; i < req.query.prod.length; i++) {
      userProd.push(data.find((prod) => { return prod._id == req.query.prod[i] }));

    }
    res.json({ userProd: userProd });
  });
});

router.delete('/del/:id', async function (req, res, next) {
  try {
    var deleted = await jbCartProd.remove({
      _id: req.params.id,
      cartID: req.query.cartID
    })
    await res.json(deleted)
  }
  catch (err) {
    console.log(err);
  }
});

router.delete('/delCart/:id', async function (req, res, next) {
  try {
    var deleted = await jbCart.remove({
      _id: req.params.id,
    })
    await res.json(deleted)
  }
  catch (err) {
    console.log(err);
  }
});

router.delete('/discardCart/:cartID', async function (req, res, next) {
  try {
    var deletedCart = await jbCart.remove({
      _id: req.params.cartID
    });
    var deletedProds = await jbCartProd.remove({
      cartID: req.params.cartID
    });
    await res.json({ deletedCart: deletedCart, deletedProds: deletedProds })
  }
  catch (err) {
    console.log(err);
  }
});

router.post('/order', function (req, res, next) {

  var newOrder = new jbOrder({

    userID: req.body.userID,
    cartID: req.body.cartID,
    debit: parseFloat(req.body.debit),
    scheduled: req.body.scheduled,
    generated: req.body.generated,
    address: {
      city: req.body.city,
      street: req.body.street,
      houseNum: parseFloat(req.body.houseNum),
      apt: parseFloat(req.body.apt)
    },
    payment: {
      card: parseFloat(req.body.card),
      cvv: parseFloat(req.body.cvv),
      cardExp: req.body.cardExp
    }
  });

  newOrder.save(function (err, doc) {
    if (err) throw err;
    res.json(doc)
  });

});

router.get('/searchOrder', function (req, res, next) {

  jbOrder.find({ userID: req.query.userID }).then(data => {
    res.json(data);
  });
});

router.get('/allOrders', function (req, res, next) {
  jbOrder.find().then(data => {
    res.json(data)
  });
});

router.put('/lockCartProd', function (req, res, next) {


  jbCartProd.updateMany({ cartID: req.body.cartID },
    {
      $set: {
        cartID: req.body.cartID + "_LOCKED_" + req.body.generated
      }
    },
    {
      new: true
    },

    function (err, updatedjbCartProd) {
      if (err) throw err;
      res.json(updatedjbCartProd)
    }
  )
});

router.put('/lockCart', function (req, res, next) {

  jbCart.updateMany({ client: req.body.userID },
    {
      $set: {
        client: req.body.userID + "_LOCKED_" + req.body.generated
      }
    },
    {
      new: true
    },

    function (err, updatedjbCart) {
      if (err) throw err;
      res.json(updatedjbCart)
    }
  )
});

router.post('/adminProduct', function (req, res, next) {

  var newProduct = new jbProduct({
    title: req.body.title,
    type: req.body.type,
    description: req.body.description,
    url: req.body.url,
    price: req.body.price,
  });

  newProduct.save(function (err, doc) {
    if (err) throw err;
    res.json(doc)
  });
});

router.get('/adminProduct', function (req, res, next) {

  jbProduct.find({ _id: req.query.prodID }).then(data => {
    res.json(data);
  })
});

router.put('/adminProduct', function (req, res, next) {

  jbProduct.findByIdAndUpdate({ _id: req.body.prodID },
    {
      $set: {
        title: req.body.title,
        type: req.body.type,
        description: req.body.description,
        url: req.body.url,
        price: req.body.price
      }
    },
    {
      new: true
    },

    function (err, updatedjbProduct) {
      if (err) throw err;
      res.json(updatedjbProduct)
    }
  )
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    debugger;
    specificImageName = file.originalname
    cb(null, specificImageName)
  }
});

var upload = multer({ storage: storage });

router.post('/admin_img_upload', upload.single('productImage'), function (req, res) {

  res.json(specificImageName);
});

module.exports = router;
