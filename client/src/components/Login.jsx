import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, tokenExists } from "../Redux/UserSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import loginSvg from "../assets/svgs/signin.svg";

export default function Login() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  // Check if token exists and navigate if user is logged in
  tokenExists(token, navigate, dispatch);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await dispatch(login({ username, password })).unwrap();

      setLoading(false);
      toast.success("Logged in successfully");

      // Store user info in localStorage
      localStorage.setItem("userInfo", JSON.stringify(response.user));
      if (response.user.role === "client") {
        navigate(`/dashboard/client/${response.user._id}`);
      } else if (response.user.role === "freelancer") {
        navigate(`/dashboard/freelancer/${response.user._id}`);
      }
    } catch (error) {
      setLoading(false);
      // Handle errors (toast or other UI feedback)
      toast.error(`Login failed: ${error.message}`);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className="Login">
        <div className="container">
          <section>
            <img src={loginSvg} alt="Login" />
            <div className="loginForm">
              <div className="loginHeader">Sign In</div>
              <form onSubmit={handleSubmit}>
                <div className="inputs">
                  <div className="form-section">
                    <label htmlFor="username">Username</label>
                    <input
                      ref={usernameRef}
                      type="text"
                      placeholder="Enter Your Username"
                      name="username"
                      id="username"
                    />
                  </div>
                  <div className="form-section">
                    <label htmlFor="password">Password</label>
                    <input
                      ref={passwordRef}
                      type="password"
                      placeholder="Enter Your Password"
                      name="password"
                      id="password"
                    />
                  </div>
                </div>
                <button>Login</button>
              </form>
              <div className="loginSection">
                <span>Don't have an account?</span>{" "}
                <a href="/signup">
                  <button>Sign Up</button>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
