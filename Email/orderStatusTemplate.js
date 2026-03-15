export const orderStatusTemplate = ({ orderId, status }) => {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Order Status Updated</h2>
      <p>Your order status has changed.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>New Status:</strong> ${status}</p>
    </div>
  `;
};
