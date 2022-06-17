import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-bottts-sprites";

function generateAvatar(): string {
  const avatar = createAvatar(style, { seed: Date.now().toString() });
  return avatar;
}

export default { generateAvatar };
