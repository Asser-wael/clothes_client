import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetSound } from "../features/soundNotificationSlice";
import moneySound from "../assets/money.mp3";

export default function SoundPlayer() {
  const dispatch = useDispatch();

  const playSound = useSelector(
    (state) => state.soundNotificationSlice.playSound
  );

  useEffect(() => {
    if (playSound) {
      const audio = new Audio(moneySound);
      audio.play();

      dispatch(resetSound());
    }
  }, [playSound]);

  return null;
}