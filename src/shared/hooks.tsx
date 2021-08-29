import { useState } from "react";

export function useHandleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
  const [value, setValue] = useState(0)
  const cmd = e.metaKey;
  const ctrl = e.ctrlKey;
  const min = 0;
  const max = 100;
  const factor = (max - min) / 10;


  switch (e.code) {
    case "ArrowLeft": //Left
      (cmd || ctrl) && setValue(value - factor);
      return;
    case "ArrowDown": //Down
      (cmd || ctrl) && setValue(value - factor);
      return;
    case "ArrowUp": //Up
      (cmd || ctrl) && setValue(value >= max ? max : value + factor);
      return;
    case "ArrowRight": //Right
      (cmd || ctrl) && setValue(value >= max ? max : value + factor);
      return;
    default:
      return;
  }
}
