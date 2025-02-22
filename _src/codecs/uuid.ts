/*!
 * This source file is part of the EdgeDB open source project.
 *
 * Copyright 2019-present MagicStack Inc. and the EdgeDB authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Buffer} from "../globals.deno.ts";

import {ReadBuffer, WriteBuffer} from "../primitives/buffer.ts";
import {ICodec, ScalarCodec} from "./ifaces.ts";

function UUIDBufferFromString(uuid: string): Buffer {
  let uuidClean = uuid;
  if (uuidClean.length !== 32) {
    uuidClean = uuidClean.replace(/\-/g, "");
    if (uuidClean.length !== 32) {
      throw new TypeError(`invalid UUID "${uuid}"`);
    }
  }
  const buf = Buffer.from(uuidClean, "hex");
  if (buf.length !== 16) {
    throw new TypeError(`invalid UUID "${uuid}"`);
  }
  return buf;
}

export class UUIDCodec extends ScalarCodec implements ICodec {
  encode(buf: WriteBuffer, object: any): void {
    if (typeof object === "string") {
      const val = <string>object;
      const ubuf = UUIDBufferFromString(val);
      buf.writeInt32(16);
      buf.writeBuffer(ubuf);
    } else {
      throw new Error(`cannot encode UUID "${object}": invalid type`);
    }
  }

  decode(buf: ReadBuffer): any {
    return buf.readBuffer(16).toString("hex");
  }
}
