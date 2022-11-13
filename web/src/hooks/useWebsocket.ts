import { useCallback, useEffect, useRef } from "react";
import { w3cwebsocket, w3cwebsocket as W3CWebSocket } from "websocket";
import { Schema } from "mongoose";

import { InfoMessage, MessageType, Message } from "../serverTypes";

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
      client.current = new W3CWebSocket(url);
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

export function useAF1Websocket({
  url,
  orgId,
  onOpen = () => null,
  onRecv = () => null,
}: {
  url: string;
  orgId: Schema.Types.ObjectId;
  onOpen?: () => void;
  onRecv?: (msg: Message) => void;
}) {
  const onOpenInternal = useCallback(() => {
    const m: InfoMessage = {
      senderID: Number(process.env.REACT_APP_DEVICE_ID),
      type: MessageType.TYPE_INFO,
      info: {
        webClient: true,
      },
      orgId,
    };
    ws.send(m);
    onOpen();
  }, [orgId, onOpen]);

  const ws = useWebsocket({ url, onOpen: onOpenInternal, onRecv });

  return ws;
}
