import { useState } from "react";
import { Button } from "@/cssHelper/ui/button";
import moment from "moment";
const messageDialog = ({ onClose, sendMsgHandler, allChats }) => {
  const [sendMsg, setSendMsg] = useState("");

  return (
    <div className="fixed bottom-20 right-5 z-50">
      <div
        className="bg-white rounded-lg w-[300px] h-[400px] shadow-md flex flex-col justify-between"
        style={{ position: "relative" }}
      >
        <div className="flex justify-between items-center p-2 mt-1 border-[1px] border-b-slate-300 rounded-t-lg">
          <p className="orange_gradient text-xl font-semibold">
            Let's have a chat
          </p>
          <button
            className="bg-black text-white py-1 px-2 rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="w-full flex flex-col flex-grow p-2 gap-3 overflow-y-auto">
          {allChats.map((chat) => {
            const { timeStamp, sender, msg, type } = chat;
            return (
              <div
                className={`flex ${
                  type === "send" ? "justify-start" : "justify-end"
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex gap-1 items-center">
                    <p className="font-semibold text-sm">{sender}</p>
                    <p className="text-sm font-light">
                      {moment(parseInt(timeStamp)).format("HH:mm")}
                    </p>
                  </div>
                  <p className="max-w-[130px] rounded-md p-2 text-wrap bg-gray-300">
                    {msg}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="z-10 flex items-end gap-1 p-2">
          <input
            className="border border-gray-300 p-2 rounded-md resize-none w-3/4"
            placeholder="Type your message here..."
            onChange={(e) => setSendMsg(e.target.value)}
            value={sendMsg}
          ></input>
          <Button
            disabled={sendMsg === ""}
            onClick={() => {
              sendMsgHandler(sendMsg);
              setSendMsg("");
            }}
            variant={"default"}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default messageDialog;
