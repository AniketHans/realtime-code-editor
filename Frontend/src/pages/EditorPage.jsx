import { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import { ACTIONS } from "../actions";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

function EditorPage() {
  // When we want something to be us on multiple renders and the component does not rerendered on change of its value, we use
  // useRef
  const socketRef = useRef(null);
  const codeRef = useRef(null); //For getting the reference of the code from the Editor component
  const location = useLocation(); // to get the variables get from navigate(), we set a `state` object in Home.jsx
  const navigate = useNavigate();
  const params = useParams(); // to get params from the url, to fetch roomId from the URL
  const [clients, setClients] = useState([]);
  if (!location.state) {
    return <Navigate to="/" />;
  }
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      // we need to emit join event to the server
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(err) {
        console.log(err);
        toast.error("Socket Connection failed, try again later");
        navigate("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId: params.roomId,
        username: location.state?.username,
      });

      //Listening for joined event from server
      // It is recieved when someone new joins the room to the ones already present in it
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clientList, username, socketId }) => {
          if (username != location.state.username) {
            toast.success(`${username} has joined the room`);
          }
          setClients(clientList);
          // As soon a someone joins the room, we get its socketid, username.
          // We, who are perviously present in the room, will emit code sync event with our code and targetSocketID who joined recently
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      // Listening for disconnected users
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        //removing the user from clients list
        setClients((prev) => prev.filter((val) => val.socketId != socketId));
      });
    };
    init();

    //If we return a function from useEffect then the function is called a cleaning function. It will be called after a component is unmounted and useEffect returns
    return () => {
      // We need to clean the listeners after the browser/tab is close otherwise it will lead to memory leaks
      // unsubscribing from events
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    };
  }, []);

  const copyRoomId = async () => {
    // we will be using browser apis so we must use try catch
    try {
      await navigator.clipboard.writeText(params.roomId);
      toast.success("Room Id copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy roomId");
      console.log(err);
    }
  };

  const leaveRoom = () => {
    navigate("/");
  };
  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/code-logo.png" alt="logo"></img>
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy Room ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={params.roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
}

export default EditorPage;
