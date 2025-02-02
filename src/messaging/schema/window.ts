import { MessageKey, MessageRequest } from "./helper";
import { Simplex } from "../types";

export type Schema = {
  "console.unfocus": Simplex;
  "notify.frame.id": Simplex<{ frameId: number }>;
};

export type Key = MessageKey<Schema>;
export type Request = MessageRequest<Schema>;
