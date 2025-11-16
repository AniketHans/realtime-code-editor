import { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { python } from "@codemirror/lang-python";
import { Transaction } from "@codemirror/state";
import { ACTIONS } from "../actions";
const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState("Start coding here...");
  const codeChange = (value, viewUpdate) => {
    setCode(value);
    onCodeChange(value);
    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: value,
    });
    // for (const transactions of viewUpdate.transactions) {
    //   const userEventType = transactions.annotation(Transaction.userEvent);
    //   if (!userEventType) continue;
    //   socketRef.current.emit(ACTIONS.CODE_CHANGE, {
    //     roomId,
    //     code: value,
    //   });
    // }
  };

  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
      if (code == null) return;
      setCode(code);
      onCodeChange(code);
    });
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);
  return (
    <CodeMirror
      className="realtimeEditor"
      value={code}
      height="400px"
      extensions={[javascript({ jsx: true }), python(), html()]}
      onChange={codeChange}
      theme="dark"
      ref={editorRef}
    />
  );
};

export default Editor;
