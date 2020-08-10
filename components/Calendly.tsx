import React from "react";
import { calendlySettingAtom, useUser } from "../src/atoms";
import { CalendlyEventListener, InlineWidget } from "react-calendly";
import { useRecoilState } from "recoil";
import { addReservation } from "../src/fetchers";

export enum CalendlyState {
  datetimeSelected,
  scheduled,
}

export const Calendly = React.memo((props: { setCalendlyState }) => {
  const [user] = useUser();
  const [calendlySetting] = useRecoilState(calendlySettingAtom);
  const onScheduled = React.useCallback(async () => {
    props.setCalendlyState(CalendlyState.scheduled);
    await addReservation(user.uid);
    document
      .getElementsByClassName("calendly-inline-widget")[0]
      .setAttribute("style", "height: 570px;");
    window.scrollTo(0, document.body.scrollHeight);
  }, [props.setCalendlyState]);
  return (
    <CalendlyEventListener onEventScheduled={onScheduled}>
      <InlineWidget {...calendlySetting} />
    </CalendlyEventListener>
  );
});
