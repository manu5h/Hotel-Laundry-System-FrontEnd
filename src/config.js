// Define the base API URL and endpoint constants
const API_BASE_URL = "http://localhost:5000";

const API_ENDPOINT = {
  //Logins
  LOGIN_HOTEL: `${API_BASE_URL}/auth/login/hotel`,
  LOGIN_LAUNDRY: `${API_BASE_URL}/auth/login/laundry`,
  LOGIN_DELIVERY: `${API_BASE_URL}/auth/login/deliveryRider`,

  //Registers
  REGISTER_HOTEL: `${API_BASE_URL}/auth/register/hotel`,
  REGISTER_LAUNDRY: `${API_BASE_URL}/auth/register/laundry`,
  REGISTER_DELIVERY: `${API_BASE_URL}/auth/register/deliveryRider`,

  //OTP
  SEND_OTP: `${API_BASE_URL}/auth/send-otp`,
  VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
};

export { API_BASE_URL, API_ENDPOINT };
