import React, { useState, useContext, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import './Register.css';
import { AuthContext } from '../auth/AuthContext';
// import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { Form, Button } from 'react-bootstrap';
import Footer from './Footer';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Register = (props) => {
  const [userData, setUserData] = useState({
    fullname: '',
    number: '',
    email: '',
    password: '',
  });
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState(
    'There was some error while registering, please try again with valid fields'
  );
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      props.history.push('/');
    }
  }, []);

  function handleChange(event) {
    const val = event.target.value;
    setUserData({
      ...userData,
      [event.target.name]: val,
    });
    // console.log(userData);
  }

  function keyPressed(event) {
    if (event.key === 'Enter') {
      registerHandler();
    }
  }

  function registerHandler() {
    let message = '';
    Object.keys(userData).map((i) => {
      if (userData[i] === '') {
        console.log(i);
        let field = i;
        field = field.replace(field.charAt(0), field.charAt(0).toUpperCase());
        message += field + ', ';
      }
    });
    if (message !== '') {
      message = message.slice(0, -2);
      message += " can't be empty!";
      setOpen(true);
      setMessage(message);
    } else {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      console.log(userData);
      var raw = JSON.stringify({
        name: userData.fullname,
        mobile: userData.number,
        email: userData.email,
        role: 'user',
        password: userData.password,
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      };
      console.log(raw, requestOptions);
      fetch(
        process.env.REACT_APP_BACKEND_API_URL + 'user/register',
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.success) {
            localStorage.setItem('eyerisToken', result.token);
            setCurrentUser(result);
          } else if (result.err) {
            console.log(result.err);
            let errorfield = Object.keys(result.err);
            errorfield = errorfield[0].replace(
              errorfield[0].charAt(0),
              errorfield[0].charAt(0).toUpperCase()
            );
            let message = errorfield + ' already exists!';
            setOpen(true);
            setMessage(message);
          } else if (result.password) {
            let message = 'Password must be greater than 6 characters';
            setOpen(true);
            setMessage(message);
          }
        })
        .catch((error) => console.log('error', error));
    }
  }

  // Snackbar
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <Form className="mt-3">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            id="standard-required"
            placeholder="Enter Full Name"
            label="Name"
            onChange={handleChange}
            onKeyPress={keyPressed}
            value={userData.fullname}
            name="fullname"
            className="form-length"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            required
            id="standard-required"
            label="Email"
            onChange={handleChange}
            onKeyPress={keyPressed}
            value={userData.email}
            name="email"
            placeholder="Enter your Email Address"
            className="form-length"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            required
            id="standard-required"
            label="Number"
            onChange={handleChange}
            onKeyPress={keyPressed}
            value={userData.number}
            name="number"
            placeholder="Enter your Phone Number"
            className="form-length"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            id="standard-required"
            label="Password"
            type="password"
            onChange={handleChange}
            onKeyPress={keyPressed}
            value={userData.password}
            name="password"
            placeholder="Enter your desired Password"
            className="form-length"
          />
        </Form.Group>

        <div className="d-grid gap-2 button-width">
          <Button variant="primary" onClick={registerHandler}>
            Register
          </Button>
        </div>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {message}
          </Alert>
        </Snackbar>
      </Form>
    </div>
  );
};

export default Register;
