import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import freelancerReducer from "./FreelancerSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    freelancer: freelancerReducer,
  },
});

export default store;
