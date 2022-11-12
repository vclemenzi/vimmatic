import { MessageKey, MessageRequest, MessageResponse } from "./helper";
import * as operations from "../../shared/operations";
import type { Completions } from "../../shared/Completions";
import { Duplex } from "../types";

export type Schema = {
  "addon.enabled.response": Duplex<{ enabled: boolean }>;
  "console.frame.message": Duplex<{ message: any }>;
  "mark.set.global": Duplex<{ key: string; x: number; y: number }>;
  "mark.jump.global": Duplex<{ key: string }>;
  "background.operation": Duplex<{
    repeat: number;
    operation: operations.Operation;
  }>;
  "settings.query": Duplex<undefined, unknown>;
  "open.url": Duplex<{ url: string; newTab: boolean; background: boolean }>;
  "console.enter.command": Duplex<{ text: string }>;
  "console.enter.find": Duplex<{ keyword?: string }>;
  "console.get.completions": Duplex<{ query: string }, Completions>;
  "console.resize": Duplex<{ width: number; height: number }>;
  "settings.get.property": Duplex<{ name: string }, string | number | boolean>;
  "settings.validate": Duplex<{ settings: unknown }, { error?: string }>;
};

export type Key = MessageKey<Schema>;
export type Request = MessageRequest<Schema>;
export type Response = MessageResponse<Schema>;
