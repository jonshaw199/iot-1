import { useCallback, useEffect, useRef, createContext } from "react";
import { w3cwebsocket } from "websocket";

import { Message } from "../serverTypes";

export function useWebsocket({
  url,
  onOpen = () => null,
  onRecv = () => null,
}: {
  url: string;
  onOpen?: () => void;
  onRecv?: (msg: Message) => void;
}) {
  const client = useRef<w3cwebsocket>();

  useEffect(() => {
    if (url && !client.current) {
      client.current = new w3cwebsocket(url);
      client.current.onopen = () => {
        console.log("WS connected");
        onOpen();
      };
      client.current.onmessage = (msg) => {
        console.log(`WS msg: ${msg}`);
        onRecv(JSON.parse(msg.data.toString()));
      };
    }
  }, [url, onOpen, onRecv]);

  const send = useCallback((m: Omit<Message, "_id">) => {
    if (client.current?.readyState === w3cwebsocket.OPEN) {
      client.current.send(JSON.stringify(m));
    } else {
      console.log("WS not connected; not sending msg");
    }
  }, []);

  return {
    send,
  };
}

export function useAF1Websocket({
  url,
  onOpen = () => null,
  onRecv = () => null,
}: {
  url: string;
  onOpen?: () => void;
  onRecv?: (msg: Message) => void;
}) {
  const ws = useRef<{ send: (m: Omit<Message, "_id">) => void }>();

  ws.current = useWebsocket({ url, onOpen, onRecv });

  return ws.current;
}

export const GlobalWebsocketContext = createContext({
  send: (m: Omit<Message, "_id">) => {},
});
