import { Instance } from "express-ws";
import { Types } from "mongoose";

import { WebSocketClient } from "./types";

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
        (!orgId || w.device.orgId.equals(orgId)) && (!path || w.path === path)
    );
  }

  static getClient(deviceId: Types.ObjectId) {
    return this.getClients().find((w) => w.device.orgId.equals(deviceId));
  }
}
