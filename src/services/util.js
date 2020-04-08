export const formatPrice = (x, currency) => {
  switch (currency) {
    case 'BRL':
      return x.toFixed(2).replace('.', ',');
    default:
      return x ? x.toFixed(2) :  x;
  }
};

// export const productsAPI =
//   'https://react-shopping-cart-67954.firebaseio.com/products.json';
// export const productsAPI = "http://localhost:8001/api/products";
export const productsAPI = "https://aaff7a56.ngrok.io/api/products";
