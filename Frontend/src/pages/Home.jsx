import { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const createNewRoom = (e) => {
    e.preventDefault();
    setRoomId(uuid());
    toast.success("Created a new room");
  };
  const joinRoom = (e) => {
    if (!roomId || !username) {
      toast.error("Room ID & Username is required");
      return;
    }
    //Redirect
    navigate(`/editor/${roomId}`, { state: { username } });
  };

  const handleInputEnter = (e) => {
    if (e.code == "Enter") {
      joinRoom();
    }
  };
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img src="/code-logo.png" alt="Code Logo"></img>
        <h4 className="mainLabel">Paste invitation Room ID</h4>
        <div className="inputGroup">
          <input
            className="inputBox"
            type="text"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
          ></input>
          <input
            className="inputBox"
            type="text"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={handleInputEnter}
          ></input>
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            If you don't have an invite then create &nbsp;{" "}
            <a href="" className="createNewBtn" onClick={createNewRoom}>
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Built with 💚 by{" "}
          <a href="https://www.linkedin.com/in/anikethans/">Aniket Hans</a>
        </h4>
      </footer>
    </div>
  );
}
