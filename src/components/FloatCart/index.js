import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { loadCart, removeProduct, changeProductQuantity } from '../../services/cart/actions';
import { updateCart } from '../../services/total/actions';
import CartProduct from './CartProduct';
import { formatPrice } from '../../services/util';

import './style.scss';

class FloatCart extends Component {
  static propTypes = {
    loadCart: PropTypes.func.isRequired,
    updateCart: PropTypes.func.isRequired,
    cartProducts: PropTypes.array.isRequired,
    newProduct: PropTypes.object,
    removeProduct: PropTypes.func,
    productToRemove: PropTypes.object,
    changeProductQuantity: PropTypes.func,
    productToChange: PropTypes.object,
  };

  state = {
    isOpen: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.newProduct !== this.props.newProduct) {
      this.addProduct(nextProps.newProduct);
    }

    if (nextProps.productToRemove !== this.props.productToRemove) {
      this.removeProduct(nextProps.productToRemove);
    }

    if (nextProps.productToChange !== this.props.productToChange) {
      this.changeProductQuantity(nextProps.productToChange);
    }
  }

  openFloatCart = () => {
    this.setState({ isOpen: true });
  };

  closeFloatCart = () => {
    this.setState({ isOpen: false });
  };

  addProduct = product => {
    const { cartProducts, updateCart } = this.props;
    let productAlreadyInCart = false;

    cartProducts.forEach(cp => {
      if (cp.id === product.id) {
        cp.quantity += product.quantity;
        productAlreadyInCart = true;
      }
    });

    if (!productAlreadyInCart) {
      cartProducts.push(product);
    }

    updateCart(cartProducts);
    // this.openFloatCart();
  };

  removeProduct = product => {
    const { cartProducts, updateCart } = this.props;

    const index = cartProducts.findIndex(p => p.id === product.id);
    if (index >= 0) {
      cartProducts.splice(index, 1);
      updateCart(cartProducts);
    }
  };

  proceedToCheckout = () => {
    const {
      totalPrice,
      productQuantity,
      currencyFormat,
      currencyId
    } = this.props.cartTotal;

    if (!productQuantity) {
      alert('Add some product in the cart!');
    } else {
      alert(
        `Checkout - Subtotal: ${currencyFormat} ${formatPrice(
          totalPrice,
          currencyId
        )}`
      );
    }
  };

  changeProductQuantity = changedProduct => {
    const { cartProducts, updateCart } = this.props;

    const product = cartProducts.find(p => p.id === changedProduct.id);
    product.quantity = changedProduct.quantity;
    if (product.quantity <= 0) {
      this.removeProduct(product);
    }
    updateCart(cartProducts);
  }

  render() {
    const { cartTotal, cartProducts, removeProduct, changeProductQuantity } = this.props;

    const products = cartProducts.map(p => {
      return (
        <CartProduct product={p} removeProduct={removeProduct} changeProductQuantity={changeProductQuantity} key={p.id} />
      );
    });

    let classes = ['float-cart'];

    if (!!this.state.isOpen) {
      classes.push('float-cart--open');
    }

    let linkText = 'New Order\r\n---------------\r\n'


    let productStrArr = cartProducts.map(p => {
      return [
        `${p.quantity} x ${p.title}`
      ]
    })



    if (productStrArr.length > 0) {
      linkText += productStrArr.join('\r\n')
    }

    let totalOwed = formatPrice(
      ((cartTotal.delivery + cartTotal.totalPrice) * 1.16),
      cartTotal.currencyId
    )

    linkText += '\r\n--------------------\r\n\r\n'
    linkText += `*Total amount*: ${cartTotal.currencyFormat} ${totalOwed}`

    // https://api.whatsapp.com/send?phone=254782224675&text=New%20order%20(East+Matt)%0A%0A4%20x%20Hanan%208pk%20Tissue%0A1%20x%20Soko%20Maize%20Meal%0A%0APayable:%20KES%201794.52%0A%0ADeliver%20to%0ATrevor%20Kimenye,Kileleshwa%0A%0APlease%20confirm%20via%20reply.%0A%0A-----------------------------%0A(Message%20for%20Customer)%0A%0AClick%20to%20pay%20using%20PayPal%0Ahttps://paypal.me/demoID/1794.52%0APlease%20share%20the%20payment%20screenshot%20here.
    // console.log('Link Text', linkText)
    let whatsAppUrl = 'https://api.whatsapp.com/send?phone=254782224675&text=' + encodeURI(linkText)

    return (
      <div className={classes.join(' ')}>
        {/* If cart open, show close (x) button */}
        {this.state.isOpen && (
          <div
            onClick={() => this.closeFloatCart()}
            className="float-cart__close-btn"
          >
            X
          </div>
        )}

        {/* If cart is closed, show bag with quantity of product and open cart action */}
        {!this.state.isOpen && (
          <span
            onClick={() => this.openFloatCart()}
            className="bag bag--float-cart-closed"
          >
            <span className="bag__quantity">{cartTotal.productQuantity}</span>
          </span>
        )}

        <div className="float-cart__content">
          <div className="float-cart__header">
            <span className="bag">
              <span className="bag__quantity">{cartTotal.productQuantity}</span>
            </span>
            <span className="header-title">Cart</span>
          </div>

          <div className="float-cart__shelf-container">
            {products}
            {!products.length && (
              <p className="shelf-empty">
                Add some items to your order
              </p>
            )}
          </div>

          <div className="float-cart__footer">
            <div className="sub">Subtotal</div>
            <div className="sub-price">
              <p className="sub-price__val">
                <span className="sub_cur">
                  { cartTotal.currencyFormat } &nbsp;
                </span>
                {
                  formatPrice(
                    cartTotal.totalPrice,
                    cartTotal.currencyId
                  )
                }
              </p>
            </div>
            <div className='sub'>Delivery Fee</div>
            <div className="sub-price">
              <p className="sub-price__val">
                <span className="sub_cur">
                  { cartTotal.currencyFormat } &nbsp;
                </span>
                {
                  formatPrice(
                    cartTotal.delivery,
                    cartTotal.currencyId
                  )
                }
              </p>
            </div>
            <div className='sub final'>Total (incl tax)</div>
            <div className="sub-price">
              <p className="sub-price__val final">
                <span className="sub_cur">
                  { cartTotal.currencyFormat } &nbsp;
                </span>
                {
                  formatPrice(
                    ((cartTotal.delivery + cartTotal.totalPrice) * 1.16),
                    cartTotal.currencyId
                  )
                }
              </p>
            </div>
            <a href={ whatsAppUrl } className="buy-btn">
              Click to WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cartProducts: state.cart.products,
  newProduct: state.cart.productToAdd,
  productToRemove: state.cart.productToRemove,
  productToChange: state.cart.productToChange,
  cartTotal: state.total.data
});

export default connect(
  mapStateToProps,
  { loadCart, updateCart, removeProduct, changeProductQuantity }
)(FloatCart);
