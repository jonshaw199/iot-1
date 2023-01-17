import { Instance } from "express-ws";
import { Types } from "mongoose";

import { WebSocketClient, MessageType } from "./types";

export default class Websocket {
  private static instance: Instance;

  static init(instance: Instance) {
    this.instance = instance;
  }

  static getClients(path?: string, orgId?: Types.ObjectId) {
    return Array.from(
      (this.instance.getWss().clients as Set<WebSocketClient>) || []
    ).filter(
      (w: WebSocketClient) =>
        (!orgId || w.device.orgId.equals(orgId)) &&
        (!path || w.request.path === path)
    );
  }

  static getClient(deviceId: Types.ObjectId) {
    return this.getClients().find((w) => w.device.orgId.equals(deviceId));
  }

  static getBinSubClients(
    path?: string,
    orgId?: Types.ObjectId,
    deviceId?: Types.ObjectId
  ) {
    return this.getClients(path, orgId).filter(
      (w: WebSocketClient) =>
        !deviceId ||
        w.request.query.pubs?.toString().includes(deviceId.toString())
    );
  }
}
