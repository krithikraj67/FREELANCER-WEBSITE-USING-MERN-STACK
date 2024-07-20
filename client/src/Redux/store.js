import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import freelancerReducer from "./FreelancerSlice";
import chatReducer from "./ChatSlice";
import clientReducer from "./ClientSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    freelancer: freelancerReducer,
    chat: chatReducer,
    client: clientReducer,
  },
});

export default store;
