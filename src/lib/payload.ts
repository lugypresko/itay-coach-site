import { getPayload, type Payload } from "payload";

import payloadConfig from "../../payload.config";

let payloadPromise: Promise<Payload> | null = null;

export function getServerPayload(): Promise<Payload> {
  if (!payloadPromise) {
    payloadPromise = getPayload({ config: payloadConfig });
  }

  return payloadPromise;
}

