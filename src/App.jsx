import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://factory-erp-backend.onrender.com";

function App() {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    mobile: "",
    address: "",
    pincode: "",
    state: "",
    city: "",
    country: "",
    orderType: "",
    acres: "",
    units: "",
    soilType: "",
    productType: "",
    material: "",
    dimension: "",
    deliveryDate: "",
    amount: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: "Order placed",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrders((prev) => [...prev, data]);
        setShowModal(false);
        setFormData({});
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.amount || 0),
    0
  );

  return (
    <div className="dashboard">
      {/* Navbar */}
      <div className="navbar">
        <div className="logo">Factory Dashboard</div>
        <div>
          Admin | <span className="logout">Logout</span>
        </div>
      </div>

      <div className="content">
        <h2>Welcome back, Admin!</h2>

        <div className="actions">
          <button onClick={() => setShowModal(true)}>New Order</button>
          <button>View All Orders</button>
          <button>Customers</button>
          <button>Reports</button>
        </div>

        {/* Summary Cards */}
        <div className="cards">
          <div className="card">
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>

          <div className="card">
            <h3>₹{totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>

          <div className="card">
            <h3>{orders.length}</h3>
            <p>Total Customers</p>
          </div>

          <div className="card">
            <h3>₹0</h3>
            <p>Collected</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="table-section">
          <h3>Recent Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.customerName}</td>
                  <td>{order.productType}</td>
                  <td>{order.status}</td>
                  <td>₹{order.amount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Factory Order Management</h2>
            <h3>New Customer Order</h3>

            <form onSubmit={handleSubmit}>
              <h4>Customer Details</h4>
              <input name="customerName" placeholder="Name" onChange={handleChange} required />
              <input name="mobile" placeholder="Mobile Number" onChange={handleChange} required />
              <input name="address" placeholder="Street Address" onChange={handleChange} />
              <input name="pincode" placeholder="Pincode" onChange={handleChange} />
              <input name="state" placeholder="State" onChange={handleChange} />
              <input name="city" placeholder="City" onChange={handleChange} />
              <input name="country" placeholder="Country" onChange={handleChange} />

              <h4>Order Requirements</h4>
              <input name="orderType" placeholder="Order Type" onChange={handleChange} />
              <input name="acres" placeholder="Acres of Land" onChange={handleChange} />
              <input name="units" placeholder="Number of Units" onChange={handleChange} />
              <input name="soilType" placeholder="Soil Type" onChange={handleChange} />

              <h4>Product Details</h4>
              <input name="productType" placeholder="Product Type" onChange={handleChange} />
              <input name="material" placeholder="Product Material" onChange={handleChange} />
              <input name="dimension" placeholder="Product Dimension" onChange={handleChange} />
              <input name="deliveryDate" type="date" onChange={handleChange} />
              <input name="amount" placeholder="Amount" onChange={handleChange} />

              <div className="modal-buttons">
                <button type="submit">
                  {loading ? "Submitting..." : "Submit Order"}
                </button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;