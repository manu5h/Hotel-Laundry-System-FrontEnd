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

  //get details
  GET_Hotel_details: `${API_BASE_URL}/hotel/:hotel_id/details`,
  GET_Laundry_details: `${API_BASE_URL}/laundry/:laundry_id/details`,
  GET_Laundry_details: `${API_BASE_URL}/rider/:rider_id/details`,

  //update profils
  UPDATE_HOTEL: `${API_BASE_URL}/auth/update/hotel`,
  UPDATE_LAUNDRY: `${API_BASE_URL}/auth/update/laundry`,
  UPDATE_DELIVERY: `${API_BASE_URL}/auth/update/deliveryRider`,

  //Change password
  UPDATE_Password_hotel: `${API_BASE_URL}/auth/changePassword/hotel`,
  UPDATE_Password_laundry: `${API_BASE_URL}/auth/changePassword/laundry`,

  //delete account
  DELETE_hotel: `${API_BASE_URL}/auth/delete/hotel`,
  DELETE_laundry: `${API_BASE_URL}/auth/delete/laundry`,
};

export { API_BASE_URL, API_ENDPOINT };
