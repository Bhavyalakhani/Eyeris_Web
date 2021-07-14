import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import products from './data';

const Products = () => {
  const [products, setProducts] = useState([]);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [img, setImg] = useState(null);
  useEffect(() => {
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

    fetch(
      process.env.REACT_APP_BACKEND_API_URL + 'product/getAll',
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        result = JSON.parse(result);
        setProducts(result.data);
        // var base64Flag = 'data:image/jpeg;base64,';
        // var imageStr = arrayBufferToBase64(result.data[0].image.imageData.data);
        // setImg(base64Flag + imageStr);
      })
      .then(() => {
        // console.log(img);
      })
      .catch((error) => console.log('error', error));
  }, []);

  function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  }

  function imageDisplay(data) {
    var base64Flag = 'data:image/jpeg;base64,';
    var imageStr = arrayBufferToBase64(data);
    var image = base64Flag + imageStr;
    return image;
  }

  return (
    <div>
      <h3>Our Products:</h3>
      <Row>
        {products.map((product) => {
          console.log(product);
          const image = imageDisplay(product.image.imageData.data);
          return (
            <Col sm={12} md={4}>
              <Card style={{ width: '18rem' }} className="mb-3">
                <Link to={`/product/${product._id}`}>
                  <Card.Img variant="top" src={image} alt={product.name} />
                </Link>
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{product.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Products;
