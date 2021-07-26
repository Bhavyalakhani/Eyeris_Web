import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { Card, Row, Col, ListGroup, Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Router } from 'react-router';

const Cart = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser);
      setCartItems(currentUser.cart);
      let total = 0;
      let cartDB = [];
      currentUser.cart.forEach((item) => {
        total += item.price;
        let obj = {
          product: item.product,
          name: item.name,
          quantity: parseInt(item.quantity),
          price: item.price,
        };
        cartDB.push(obj);
      });
      let orderId = [];
      currentUser.orders.forEach((item) => {
        orderId.push(item);
      });
      setTotalValue(total);
      setCurrentUser({ ...currentUser, totalPrice: total });
      setCart(cartDB);
    }
  }, []);

  function saveCart() {
    const token = currentUser.token
      ? currentUser.token
      : localStorage.getItem('eyerisToken');
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + token);
    myHeaders.append('Cookie', 'token=' + token);

    var raw = JSON.stringify({
      cart: cart,
    });

    console.log(raw);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      process.env.REACT_APP_BACKEND_API_URL + 'user/createCart',
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
  }

  function confirmOrder() {}

  function getOrderDetails(id) {}

  return (
    <div>
      <div className="container">
        <LinkContainer to="/">
          <Button className="mt-3" variant="dark">
            Back to Products
          </Button>
        </LinkContainer>
        <Row className="mt-3">
          <Col sm={12} md={2}></Col>
          <Col sm={12} md={8}>
            <h1>{currentUser.name}</h1>
            <h4>Your Cart Items: {totalValue}</h4>

            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  return (
                    <>
                      <tr>
                        <td>{cartItems.indexOf(item) + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price}</td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </Table>

            <Row>
              <Col className="d-grid gap-2">
                <Link to="/checkout">
                  <Button className="mt-3" variant="dark">
                    Proceed to Checkout
                  </Button>
                </Link>
              </Col>
              {/* <Col className="d-grid gap-2">
                <Link to="/myorders">
                  <Button className="mt-3" variant="dark">
                    Your Orders
                  </Button>
                </Link>
              </Col> */}
              <Col className="d-grid gap-2">
                <Button className="mt-3" variant="dark" onClick={saveCart}>
                  Save Cart for Later
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Cart;
