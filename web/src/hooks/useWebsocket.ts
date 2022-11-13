import { useCallback, useEffect, useRef } from "react";
import { w3cwebsocket, w3cwebsocket as W3CWebSocket } from "websocket";

import {
  InfoMessage,
  MessageType,
  TransportType,
  Message,
} from "../serverTypes";

export default function useWebsocket({
  url,
  sendInfo = true,
  onRecv = () => null,
}: {
  url: string;
  sendInfo?: boolean;
  onRecv?: (msg: Message) => void;
}) {
  const client = useRef<w3cwebsocket>();

  useEffect(() => {
    if (url && !client.current) {
      client.current = new W3CWebSocket(url);
      client.current.onopen = () => {
        console.log("WS connected");
        if (sendInfo) {
          const m: InfoMessage = {
            senderID: Number(process.env.REACT_APP_DEVICE_ID),
            type: MessageType.TYPE_INFO,
            info: {
              webClient: true,
            },
          };
          client.current?.send(JSON.stringify(m));
        }
      };
      client.current.onmessage = (msg) => {
        console.log(`WS msg: ${msg}`);
        onRecv(JSON.parse(msg.data.toString()));
      };
    }
  }, [url, sendInfo, onRecv]);

  const send = useCallback((m: Message) => {
    if (client.current?.readyState === w3cwebsocket.OPEN) {
      client.current.send(m);
    } else {
      console.log("WS not connected; not sending msg");
    }
  }, []);

  return {
    send,
  };
}
