import Order from "../models/order.js";
import Product from "../models/product.js";

export default async function createOrder(req, res) {
  const user = req.user;
  console.log(req.body);
  console.log(req.user);
  if (user == null) {
    res.status(401).json({
      message: "you need to be logged in to place an order",
    });
    return;
  }

  //let orderId = "ORD00000001";

  const orderData = {
    orderId: "ORD00000001",
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    addressLineOne: req.body.addressLineOne,
    addressLineTwo: req.body.addressLineTwo,
    city: req.body.city,
    state: req.body.state,
    postalCode: req.body.postalCode,
    phone: req.body.phone,
    total: 0,
    items: [],
  };
  if (req.body.firstName != null && req.body.firstName != "") {
    orderData.firstName = req.body.firstName;
  }

  if (req.body.lastName != null && req.body.lastName != "") {
    orderData.lastName = req.body.lastName;
  }

  if (req.body.phone != null && req.body.phone != "") {
    orderData.phone = req.body.phone;
  }

  try {
    const lastOrder = await Order.findOne().sort({ date: -1 });

    if (lastOrder != null) {
      const lastOrderId = lastOrder.orderId;

      const lastOrderNumberinString = lastOrderId.replace("ORD", "");

      const lastOrderNumber = parseInt(lastOrderNumberinString);

      const newOrderNumber = lastOrderNumber + 1;

      const newOrderNumberinString = newOrderNumber.toString().padStart(8, "0");

      orderData.orderId = "ORD" + newOrderNumberinString;
    }

    for (let i = 0; i < req.body.items.length; i++) {
      const product = await Product.findOne({
        productId: req.body.items[i].productId,
      });
      if (product == null || !product.isAvailable) {
        res.status(400).json({
          message:
            "product with productId" +
            req.body.items[i].productId +
            "not found please palace you order with available products",
        });
        return;
      } else {
        orderData.items.push({
          product: {
            productId: product.productId,
            name: product.name,
            price: product.price,
            labelledPrice: product.labelledPrice,
            image: product.images[0],
          },
          quantity: req.body.items[i].quantity,
        });
        orderData.total += product.price * req.body.items[i].quantity;
      }
    }

    const newOrder = new Order(orderData);

    await newOrder.save();
    res.status(201).json({
      message: "order created successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
}
