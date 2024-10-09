// Define the base API URL and endpoint constants
const API_BASE_URL = "http://localhost:5000";

const API_ENDPOINT = {
  LOGIN_HOTEL: `${API_BASE_URL}/auth/login/hotel`,
  LOGIN_LAUNDRY: `${API_BASE_URL}/auth/login/laundry`,
  LOGIN_DELIVERY: `${API_BASE_URL}/auth/login/deliveryRider`,
};

export { API_BASE_URL, API_ENDPOINT };
