/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable eqeqeq */
import FreelancerMenu from "./FreelancerComponents/FreelancerMenu";
import noImage from "../assets/Images/no-image.png";
import { useEffect, useState } from "react";
import Messages from "./Messages";
import ClientMenu from "./ClientComponents/ClientMenu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import tokenExists from "../Redux/UserSlice"; // Ensure correct import
import myConversations from "../Redux/ClientSlice"; // Ensure correct import
import Loading from "./Loading";
import { toast } from "react-toastify";

export default function Chat({ type }) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.user);
  const { data } = useSelector((state) => state.chat);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    async function validateUser() {
      try {
        const tokenValid = tokenExists(token); // Await the token validation
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (
          !tokenValid ||
          userInfo.role !== "freelancer" ||
          userInfo._id !== id
        ) {
          navigate("/login");
        }
      } catch (err) {
        navigate("/login");
      }
    }
    validateUser();
    dispatch(myConversations())
      .unwrap()
      .then((data) => {
        console.log(data);
        setLoading(false);
        if (data.status == 404) {
          toast.error(data.msg);
          navigate("/login");
        }
        if (data.status == 505) {
          toast.error(data.msg);
        }
      })
      .catch((rejectedValueOrSerializedError) => {
        setLoading(false);
        toast.error(rejectedValueOrSerializedError);
      });
  }, [dispatch, navigate, id, token]);

  return (
    <>
      {loading && <Loading />}
      <div className="Chat">
        <div className="container">
          <div className="section">
            {data?.userConversation?.length != 0 ? (
              <>
                <div className="messages">
                  {data?.userConversation?.map((conversation) => (
                    <div
                      key={conversation._id}
                      className={
                        selectedMessage != conversation._id
                          ? "messageSection"
                          : "messageSection active"
                      }
                      onClick={() => setSelectedMessage(conversation._id)}
                    >
                      <img
                        src={
                          conversation.avatar == "no-image.png"
                            ? noImage
                            : `http://localhost:3001/ProfilePic/${conversation.avatar}`
                        }
                        alt="test image"
                      />
                      <div className="messageUserInfo">
                        <div className="messageUserName">
                          {conversation.username}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="selectedMessages">
                  {selectedMessage == null ? (
                    <div className="nomessage">
                      <div className="title">WorkWonders</div>
                      <span>Select A Message</span>
                    </div>
                  ) : (
                    <Messages selectedMessage={selectedMessage} />
                  )}
                </div>
              </>
            ) : (
              <div className="zeroMessage">
                {
                  <div className="nomessage">
                    <div className="title">WorkWonders</div>
                    <span>You have no messages for now</span>
                  </div>
                }
              </div>
            )}
          </div>
          {type == "freelancer" ? (
            <FreelancerMenu active="chat" />
          ) : (
            <ClientMenu active="chat" />
          )}
        </div>
      </div>
    </>
  );
}
