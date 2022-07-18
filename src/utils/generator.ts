import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/big-smile";
import { randomUUID } from "crypto";
import { uniqueNamesGenerator, Config, names } from "unique-names-generator";
import { PlayerProfile } from "@/types/common";
import { COLORS } from "../constants/common";

const config: Config = { dictionaries: [names] };

function generateAvatar(): string {
  const avatar = createAvatar(style, { seed: Date.now().toString(), radius: 4 });
  return avatar;
}

function generatePlayerProfile(): PlayerProfile {
  return {
    id: randomUUID(),
    name: uniqueNamesGenerator(config),
    color: COLORS[Math.floor(Math.random() * 10)],
    avatar: generateAvatar(),
  };
}

export default { generateAvatar, generatePlayerProfile };
