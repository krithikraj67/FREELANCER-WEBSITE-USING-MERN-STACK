import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, tokenExists } from "../Redux/UserSlice";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "./Loading";
import noImage from "../assets/Images/no-image.png";
import FreelancerMenu from "./FreelancerComponents/FreelancerMenu";
import ClientMenu from "./ClientComponents/ClientMenu";

export default function Profile({ type }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { token, avatar } = useSelector((state) => state.user);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fullNameInput = useRef();
  const ageInput = useRef();
  const usernameInput = useRef();

  useEffect(() => {
    tokenExists(token, navigate, dispatch).then((data) => {
      if (
        data === false ||
        JSON.parse(localStorage.getItem("userInfo"))._id !== id ||
        window.location.pathname.slice(32).split("/")[0] !==
          JSON.parse(localStorage.getItem("userInfo")).role
      ) {
        navigate("/login");
      }
    });

    if (localStorage.getItem("userInfo")) {
      const localStorageUserInfo = JSON.parse(localStorage.getItem("userInfo"));
      setUserInfo({
        fullName: localStorageUserInfo.fullName,
        age: localStorageUserInfo.age,
        username: localStorageUserInfo.username,
      });

      if (localStorageUserInfo.image !== "no-image.png") {
        setImage(localStorageUserInfo.image);
      }
    }
  }, []);

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("fullName", fullNameInput.current.value.trim());
    formData.append("age", ageInput.current.value.trim());
    formData.append("username", usernameInput.current.value.trim());

    if (typeof image === "object" || image === null) {
      if (image === null) {
        formData.append("image", "no-image.png");
      } else {
        formData.append("image", image);
      }
    }

    setLoading(true);
    dispatch(updateUser(formData))
      .unwrap()
      .then((data) => {
        setLoading(false);
        if (data.status === 200) {
          toast.success(data.msg);
          localStorage.setItem(
            "userInfo",
            JSON.stringify(data.updatedUserInfo)
          );
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else if (data.status === 403) {
          toast.info(data.msg);
        } else {
          toast.error(data.msg);
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Failed to update profile");
      });
  };

  return (
    <>
      {loading && <Loading />}
      <div className="Profile">
        <div className="container">
          <div className="section">
            <form
              encType="multipart/form-data"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="profileHeader">
                <div className="profiledescription">
                  <img
                    src={
                      image === null || avatar === "no-image.png"
                        ? noImage
                        : `http://localhost:3001/ProfilePic/${avatar}`
                    }
                    alt="Profile"
                  />
                  <div className="profileName">
                    <div className="name">{userInfo?.fullName}</div>
                    <span>
                      Update Your Profile Picture And Personal Details
                    </span>
                  </div>
                </div>
                <div className="profileheaderbuttons">
                  <button
                    onClick={() => navigate(`/dashboard/client/${id}/profile`)}
                  >
                    Cancel
                  </button>
                  <button onClick={handleSave}>Save</button>
                </div>
              </div>
              <div className="profileinputs">
                <div className="inputSection">
                  <label htmlFor="name">Full Name</label>
                  <input
                    ref={fullNameInput}
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={userInfo?.fullName}
                  />
                </div>
                <hr />
                <div className="inputSection">
                  <label htmlFor="age">Age</label>
                  <input
                    ref={ageInput}
                    type="text"
                    name="age"
                    id="age"
                    defaultValue={userInfo?.age}
                  />
                </div>
                <hr />
                <div className="inputSection">
                  <label htmlFor="username">Username</label>
                  <input
                    ref={usernameInput}
                    type="text"
                    name="username"
                    id="username"
                    defaultValue={userInfo?.username}
                  />
                </div>
                <hr />
              </div>
              <div className="profilePicture">
                <div className="profilePictureDescription">
                  <div className="picturelabel">
                    <div className="label">Your Profile Picture</div>
                  </div>
                  <span>This Will Be Displayed On Your Profile</span>
                </div>
                <img
                  src={
                    image === null || avatar === "no-image.png"
                      ? noImage
                      : `http://localhost:3001/ProfilePic/${avatar}`
                  }
                  alt="Profile"
                />
                <div className="picturebuttons">
                  <label htmlFor="image">Upload</label>
                  <input
                    onChange={handleImage}
                    type="file"
                    name="image"
                    id="image"
                  />
                  <button onClick={() => setImage(null)}>Delete</button>
                </div>
              </div>
            </form>
          </div>
          {type === "1" ? (
            <FreelancerMenu active="profile" />
          ) : (
            <ClientMenu active="profile" />
          )}
        </div>
      </div>
    </>
  );
}
