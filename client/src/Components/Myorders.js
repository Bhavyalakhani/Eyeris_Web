import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { Card, Row, Col, ListGroup, Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Router } from 'react-router';

const Myorders = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    console.log(1);
    if (currentUser) {
      console.log(currentUser);
      if (currentUser.orders) {
        getOrder();
      }
    }
  }, [currentUser]);

  function getOrder() {
    const token = currentUser.token
      ? currentUser.token
      : localStorage.getItem('eyerisToken');
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + token);
    myHeaders.append('Cookie', 'token=' + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch('http://localhost:5000/api/v1/order/getMyOrders', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        result = JSON.parse(result);
        setOrders(result.data);
      })
      .catch((error) => console.log('error', error));
  }
  return (
    <div>
      <div className="container">
        <LinkContainer to="/">
          <Button className="mt-3" variant="dark">
            Back to Profile
          </Button>
        </LinkContainer>
        <Row className="mt-3">
          <Col sm={12} md={2}></Col>
          <Col sm={12} md={8}>
            <h1>Hello {currentUser.name},</h1>
            <h5>Your Past Orders are:</h5>
            <br></br>

            {orders.map((order) => {
              console.log(order);
              return (
                <>
                  <Table responsive>
                    <thead>
                      {/* <tr> */}
                      <th>Order No #{orders.indexOf(order) + 1}</th>
                      {/* </tr> */}
                      <tr>
                        <th>Sr No.</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.detailedorder
                        ? order.detailedorder.map((item) => {
                            console.log(item);
                            return (
                              <tr>
                                <td>{order.detailedorder.indexOf(item) + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price}</td>
                              </tr>
                            );
                          })
                        : null}
                    </tbody>
                  </Table>
                  <br></br>
                </>
              );
            })}

            {/* <Row>
              <Col className="d-grid gap-2">
                <Link to="/checkout">
                  <Button className="mt-3" variant="dark">
                    Confirm Order
                  </Button>
                </Link>
              </Col>
              <Col className="d-grid gap-2">
                <Button className="mt-3" variant="dark">
                  Save Cart for Later
                </Button>
              </Col>
            </Row> */}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Myorders;
