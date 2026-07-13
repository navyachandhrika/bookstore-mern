/**
 * test-api.js - Integration tests for the BookStore REST APIs.
 * Simulates a full client flow: Register -> Login -> Me -> Browse -> Add to Cart -> Checkout -> History -> Admin.
 * Uses native fetch for zero-dependency execution.
 */
const API_URL = 'http://localhost:5000/api';
let token = '';
let adminToken = '';
let bookId = '';
let orderId = '';
const testEmail = `tester_${Date.now()}@example.com`;

async function runTests() {
  console.log('🧪 Starting API Integration Tests using Native Fetch...\n');

  try {
    // Helper to perform JSON requests
    const request = async (endpoint, options = {}) => {
      const url = `${API_URL}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        ...(options.token && { Authorization: `Bearer ${options.token}` }),
        ...options.headers,
      };

      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        ...(options.body && { body: JSON.stringify(options.body) }),
      });

      const data = await response.json();
      if (!response.ok) {
        const error = new Error(data.message || 'Request failed');
        error.status = response.status;
        error.data = data;
        throw error;
      }
      return data;
    };

    // 1. Register a new user
    console.log('1. Testing User Registration...');
    const registerRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Test Reader',
        email: testEmail,
        password: 'password123',
      },
    });
    console.log('✅ Registration successful!');
    token = registerRes.token;

    // 2. Login
    console.log('\n2. Testing User Login...');
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: testEmail,
        password: 'password123',
      },
    });
    console.log('✅ Login successful!');
    token = loginRes.token;

    // 3. Get profile
    console.log('\n3. Testing Get Profile (/auth/me)...');
    const meRes = await request('/auth/me', { token });
    console.log(`✅ Profile retrieved! Welcome, ${meRes.name}`);

    // 4. Get books
    console.log('\n4. Testing Browse Books (/books)...');
    const booksRes = await request('/books');
    if (booksRes.books && booksRes.books.length > 0) {
      bookId = booksRes.books[0]._id;
      console.log(`✅ Browse books successful! Found ${booksRes.books.length} books. Selected first book: "${booksRes.books[0].title}"`);
    } else {
      throw new Error('No books found. Seed the database first!');
    }

    // 5. Get book detail
    console.log(`\n5. Testing Get Book Detail (/books/${bookId})...`);
    const bookDetailRes = await request(`/books/${bookId}`);
    console.log(`✅ Get book detail successful! Title: "${bookDetailRes.title}"`);

    // 6. Add review
    console.log(`\n6. Testing Review Submission (/books/${bookId}/reviews)...`);
    await request(`/books/${bookId}/reviews`, {
      method: 'POST',
      token,
      body: { rating: 5, comment: 'Amazing book! Read it in one sitting.' },
    });
    console.log('✅ Review submitted successfully!');

    // 7. Cart operations
    console.log('\n7. Testing Shopping Cart...');
    const addToCartRes = await request('/cart', {
      method: 'POST',
      token,
      body: { bookId, quantity: 2 },
    });
    console.log(`✅ Add to Cart successful! Items in cart: ${addToCartRes.cart.items.length}`);

    const getCartRes = await request('/cart', { token });
    console.log(`✅ Get Cart successful! Cart total items: ${getCartRes.items.length}`);

    // 8. Place order (Checkout)
    console.log('\n8. Testing Checkout / Place Order...');
    const orderRes = await request('/orders', {
      method: 'POST',
      token,
      body: {
        shippingAddress: {
          address: '123 Test Street',
          city: 'Testerville',
          zipCode: '12345',
          country: 'Testland',
        },
      },
    });
    orderId = orderRes.order._id;
    console.log(`✅ Order placed successfully! Order ID: ${orderId}, Total Price: $${orderRes.order.totalPrice}`);

    // 9. Check order history
    console.log('\n9. Testing Order History (/orders/my-orders)...');
    const myOrdersRes = await request('/orders/my-orders', { token });
    console.log(`✅ Order history retrieved! Total orders: ${myOrdersRes.length}`);

    // 10. Admin authentication
    console.log('\n10. Testing Admin Authentication...');
    const adminLoginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@bookstore.com',
        password: 'admin123',
      },
    });
    console.log('✅ Admin login successful!');
    adminToken = adminLoginRes.token;

    // 11. Admin fetch orders
    console.log('\n11. Testing Admin Get All Orders...');
    const allOrdersRes = await request('/orders', { token: adminToken });
    console.log(`✅ Admin fetch orders successful! Total orders: ${allOrdersRes.length}`);

    // 12. Admin update status
    console.log(`\n12. Testing Admin Update Order Status (#${orderId})...`);
    const statusUpdateRes = await request(`/orders/${orderId}/status`, {
      method: 'PUT',
      token: adminToken,
      body: { status: 'Shipped' },
    });
    console.log(`✅ Order status updated! New status: ${statusUpdateRes.order.status}`);

    console.log('\n🌟 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! 🌟');
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    if (error.status) {
      console.error(`Status: ${error.status}`);
      console.error('Data:', JSON.stringify(error.data, null, 2));
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

runTests();
