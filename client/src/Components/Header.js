import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import './Header.css';

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);

const Header = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [totalItems, setTotalItems] = useState(0);
  useEffect(() => {
    //     {id: "60b488efbcc6112e982cd2ac", name: "Crizal Lens", category: "Lens", quantity: "2", price: 2600}
    //  {id: "60b4894941e2422ba45f0525", name: "New Lens", category: "Lens", quantity: "4", price: 2000}

    if (currentUser) {
      let total = 0;
      if (currentUser.cart) {
        currentUser.cart.map((item) => {
          total += +item.quantity;
        });
      }
      setTotalItems(total);
    }
  }, [currentUser]);
  function logoutHandler() {
    setCurrentUser(null);
    localStorage.removeItem('eyerisToken');
  }
  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Eyeris</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" class="justify-content-end">
            <Nav className="ml-auto justify-content-end">
              {!currentUser ? null : (
                <>
                  <LinkContainer to="/cart">
                    <Nav.Link>
                      <StyledBadge badgeContent={totalItems} color="primary">
                        <i
                          class="fas fa-shopping-cart"
                          style={{ color: 'white' }}
                        ></i>
                      </StyledBadge>
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/profile">
                    <Nav.Link>
                      <i className="fas fa-user-circle"></i> Profile
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
              {!currentUser ? (
                <LinkContainer to="/register">
                  <Nav.Link>
                    <i className="fas fa-user-plus"></i> Sign Up
                  </Nav.Link>
                </LinkContainer>
              ) : null}{' '}
              {!currentUser ? (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Login
                  </Nav.Link>
                </LinkContainer>
              ) : (
                <Nav.Link onClick={logoutHandler}>
                  <i className="fas fa-user"></i> Logout
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
