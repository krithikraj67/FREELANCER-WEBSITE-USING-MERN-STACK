import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { myDashboard } from "./../../Redux/ClientSlice";
import orders from "../../assets/svgs/servicesIcon.svg";
import usd from "../../assets/svgs/usd.svg";
import check from "../../assets/svgs/check.svg";
import ClientMenu from "./ClientMenu";
import TestimonialSlider from "../TestimonialsSlider";
import tokenExists from "./../../Redux/UserSlice";
import Loading from "./../Loading";

export default function ClientDashboard() {
  const { token } = useSelector((state) => state.user);
  const { data } = useSelector((state) => state.client);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    async function checkTokenAndFetchDashboard() {
      try {
        setLoading(false);
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const tokenValid = tokenExists(token);
        if (!tokenValid || userInfo._id !== id) {
          navigate("/login");
          return;
        }

        const dashboardData = await dispatch(myDashboard()).unwrap();
        setLoading(false);

        if (
          dashboardData.status === 404 ||
          dashboardData.status === 403 ||
          dashboardData.status === 505
        ) {
          toast.error(dashboardData.msg);
          navigate("/login");
        }
      } catch (error) {
        setLoading(false);
        console.error(error || "An error occurred");
      }
    }

    checkTokenAndFetchDashboard();
  }, [navigate, dispatch, id, token]);
  return (
    <>
      {loading && <Loading />}
      <div className="ClientDashboard">
        <div className="container">
          <div className="section">
            {data?.dashboard ? (
              <>
                <div className="header">
                  Welcome Back {data?.dashboard.username}
                </div>
                <div className="stats">
                  <div className="card">
                    <div className="info">
                      <div className="title">Total Expenses</div>
                      <div className="body-stat">
                        {parseFloat(data?.dashboard.expenses)} $
                      </div>
                    </div>
                    <div className="logo">
                      <img src={usd} alt="Star icon" />
                    </div>
                  </div>
                  <div className="card">
                    <div className="info">
                      <div className="title">Total Orders</div>
                      <div className="body-stat">{data?.dashboard.orders}</div>
                    </div>
                    <div className="logo">
                      <img src={orders} alt="Star icon" />
                    </div>
                  </div>
                  <div className="card">
                    <div className="info">
                      <div className="title">Completed Orders</div>
                      <div className="body-stat">
                        {data?.dashboard.completedOrders}
                      </div>
                    </div>
                    <div className="logo">
                      <img src={check} alt="Star icon" />
                    </div>
                  </div>
                </div>
                <div className="testimonials">
                  <div className="header">Last Reviews Made By Me</div>
                  <div className="cards">
                    {data?.dashboard?.testimonials.length !== 0 ? (
                      <TestimonialSlider
                        role="client"
                        data={data?.dashboard?.testimonials}
                      />
                    ) : (
                      <div className="noTestimonials">
                        You have no reviews for now
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="serverStopped">Check the server</div>
            )}
          </div>
          <ClientMenu active="home" />
        </div>
      </div>
    </>
  );
}
