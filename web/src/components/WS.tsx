import { useEffect, useRef } from "react";
import { w3cwebsocket, w3cwebsocket as W3CWebSocket } from "websocket";

import { InfoMessage, MessageType, TransportType } from "../serverTypes";

export default function WS({
  url,
  sendInfo,
}: {
  url: string;
  sendInfo?: boolean;
}) {
  const client = useRef<w3cwebsocket>();

  useEffect(() => {
    if (url && !client.current) {
      client.current = new W3CWebSocket(url);
      client.current.onopen = () => {
        console.log("WS connected");
        if (sendInfo) {
          const m: InfoMessage = {
            state: -1,
            senderID: Number(process.env.DEVICE_ID),
            type: MessageType.TYPE_INFO,
            info: {},
            transportType: TransportType.TRANSPORT_WEBSOCKET,
          };
          client.current?.send(m);
        }
      };
      client.current.onmessage = (msg) => {
        console.log(`WS msg: ${msg}`);
      };
    }
  }, [url, sendInfo]);

  return <></>;
}
