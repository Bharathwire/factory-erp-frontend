import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://factory-erp-backend.onrender.com";

function App() {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    product: "",
    gauge: "",
    size: "",
    quantity: "",
  });

  // ✅ Fetch Orders on Page Load
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit Order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Add order instantly to UI
        setOrders((prev) => [...prev, data]);

        // Close modal
        setShowModal(false);

        // Reset form
        setFormData({
          customerName: "",
          product: "",
          gauge: "",
          size: "",
          quantity: "",
        });
      } else {
        alert("Failed to create order");
      }
    } catch (error) {
      console.error("Submit error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="dashboard-bg">
      <div className="overlay">
        <h1 className="title">Factory ERP Dashboard</h1>

        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add Order
        </button>

        {/* Orders Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Gauge</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.customerName}</td>
                  <td>{order.product}</td>
                  <td>{order.gauge}</td>
                  <td>{order.size}</td>
                  <td>{order.quantity}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal slide-up">
              <h2>Add New Order</h2>

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="customerName"
                  placeholder="Customer Name"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="product"
                  placeholder="Product"
                  value={formData.product}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="gauge"
                  placeholder="Gauge"
                  value={formData.gauge}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="size"
                  placeholder="Size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                />

                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />

                <div className="modal-buttons">
                  <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </button>

                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
