import { Instance } from "express-ws";

import { WebSocket } from "./types";

export default class Connections {
  private static expressWsInstance: Instance;

  public static init(i: Instance) {
    this.expressWsInstance = i;
  }

  public static getLightsClients = (orgId: string) =>
    Array.from(this.expressWsInstance.getWss().clients).filter(
      (w: WebSocket) => w.path.includes("/lights/ws") && w.orgId == orgId
    );

  public static getLightsAudioClients = (orgId: string) =>
    this.getLightsClients(orgId).filter((w: WebSocket) => w.info?.vs1053);

  public static getLightsWebClients = (orgId: string) =>
    this.getLightsClients(orgId).filter((w: WebSocket) => w.info?.webClient);
}
