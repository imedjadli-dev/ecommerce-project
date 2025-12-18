import axios from "axios";

/**
 * Send invoice by email for a specific order.
 *
 * @param {string} orderId - The ID of the order.
 * @param {string} userEmail - The email address to send the invoice to.
 * @returns {Promise<Object>} - Response data from the server.
 * @throws {Error} - Throws error message from server if request fails.
 */
export const sendInvoiceByEmail = async (orderId, userEmail) => {
  try {
    const response = await axios.post(
      "/api/invoice/send-invoice",
      {
        orderId,
        userEmail,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to send invoice.";
    throw new Error(message);
  }
};
