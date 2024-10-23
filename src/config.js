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

  //check email
  CHECK_EMAIL: `${API_BASE_URL}/auth/check-email`,

  //passwords
  RESET_PASSWORD_HOTEL: `${API_BASE_URL}/auth/resetPassword/hotel`,
  RESET_PASSWORD_LAUNDRY: `${API_BASE_URL}/auth/resetPassword/laundry`,

  //OTP
  SEND_OTP: `${API_BASE_URL}/auth/send-otp`,
  VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,

  //get details
  GET_Hotel_details: `${API_BASE_URL}/hotel/:hotel_id/details`,
  GET_Laundry_details: `${API_BASE_URL}/laundry/:laundry_id/details`,
  GET_Delivery_details: `${API_BASE_URL}/rider/:rider_id/details`,

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

  //Add to basket
  CREATE_Item: `${API_BASE_URL}/item/:hotel_id/create`,

  //Create order
  CREATE_Order: `${API_BASE_URL}/order/:hotel_id/create`,

  //get items by hotel id
  GET_Items: `${API_BASE_URL}/item/hotel/:hotel_id`,

  //get all laundries
  GET_All_Laundries: `${API_BASE_URL}/laundry/all`,

  //get orders by id
  GET_Orders_By_Hotel_Id: `${API_BASE_URL}/hotel/:hotel_id/orders`,
  GET_Orders_By_Laundry_Id: `${API_BASE_URL}/laundry/:laundry_id/orders`,
  GET_Orders_By_Rider_Id: `${API_BASE_URL}/rider/:rider_id/orders`,

  //request laundry
  REQUEST_Laundry: `${API_BASE_URL}/hotel/:hotel_id/request-laundry`,

  //Accept order - hotel
  CONFIRM_order_hotel: `${API_BASE_URL}/hotel/:hotel_id/order/:order_id/accept`,

  //Decline order - hotel
  DECLINE_order_hotel: `${API_BASE_URL}/hotel/:hotel_id/order/:order_id/decline`,

  //Accept order - laundry
  CONFIRM_order_laundry: `${API_BASE_URL}/laundry/:laundry_id/order/:order_id/accept`,

  //Decline order - laundry
  DECLINE_order_laundry: `${API_BASE_URL}/laundry/:laundry_id/order/:order_id/decline`,

  //get riders
  GET_Riders: `${API_BASE_URL}/laundry/:laundry_id/riders`,

  //get riders
  SET_Riders: `${API_BASE_URL}/rider/pickupRider`,
};

export { API_BASE_URL, API_ENDPOINT };
