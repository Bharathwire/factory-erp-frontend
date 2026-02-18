import { useEffect, useState } from "react";
import "./index.css";

const API_URL = "http://localhost:5000";

function App() {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    product: "",
    gauge: "",
    size: "",
    quantity: "",
    status: "Pending",
  });

  const [search, setSearch] = useState("");

  /* ================= FETCH ================= */
  const fetchOrders = async () => {
    const res = await fetch(`${API_URL}/orders`);
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= ADD ORDER ================= */
  const addOrder = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const newOrder = await res.json();

    setOrders((prev) => [newOrder, ...prev]);
    setShowModal(false);

    setForm({
      customerName: "",
      product: "",
      gauge: "",
      size: "",
      quantity: "",
      status: "Pending",
    });
  };

  /* ================= COMPLETE ================= */
  const markCompleted = async (id) => {
    const res = await fetch(`${API_URL}/orders/${id}`, {
      method: "PUT",
    });

    const updatedOrder = await res.json();

    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? updatedOrder : order
      )
    );
  };

  /* ================= DELETE ================= */
  const deleteOrder = async (id) => {
    await fetch(`${API_URL}/orders/${id}`, {
      method: "DELETE",
    });

    setOrders((prev) =>
      prev.filter((order) => order._id !== id)
    );
  };

  /* ================= FILTER ================= */
  const filteredOrders = orders.filter((order) =>
    order.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  const total = orders.length;
  const completed = orders.filter(o => o.status === "Completed").length;
  const pending = orders.filter(o => o.status === "Pending").length;

  return (
    <div className="dashboard-bg">

      <div className="overlay">

        <h1 className="title">Factory ERP Dashboard</h1>

        {/* SUMMARY */}
        <div className="summary">
          <div className="card">
            <h3>Total</h3>
            <p>{total}</p>
          </div>
          <div className="card green">
            <h3>Completed</h3>
            <p>{completed}</p>
          </div>
          <div className="card orange">
            <h3>Pending</h3>
            <p>{pending}</p>
          </div>
        </div>

        {/* ACTION BAR */}
        <div className="action-bar">
          <button className="add-btn" onClick={() => setShowModal(true)}>
            + Add Order
          </button>

          <input
            placeholder="Search Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
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
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id}>
                  <td>{order.customerName}</td>
                  <td>{order.product}</td>
                  <td>{order.gauge}</td>
                  <td>{order.size}</td>
                  <td>{order.quantity}</td>

                  <td>
                    <span className={
                      order.status === "Completed"
                        ? "status green"
                        : "status orange"
                    }>
                      {order.status}
                    </span>
                  </td>

                  <td>
                    {order.status !== "Completed" && (
                      <button
                        className="complete-btn"
                        onClick={() => markCompleted(order._id)}
                      >
                        Complete
                      </button>
                    )}

                    <button
                      className="delete-btn"
                      onClick={() => deleteOrder(order._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal fade-in">
          <div className="modal-content slide-up">
            <h2>Add New Order</h2>

            <form onSubmit={addOrder}>
              <input name="customerName" placeholder="Customer" onChange={handleChange} required />
              <input name="product" placeholder="Product" onChange={handleChange} required />
              <input name="gauge" placeholder="Gauge" onChange={handleChange} required />
              <input name="size" placeholder="Size" onChange={handleChange} required />
              <input name="quantity" type="number" placeholder="Quantity" onChange={handleChange} required />

              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>

            <button className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
