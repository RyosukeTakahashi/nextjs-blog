import React, { useState } from "react";
import Head from "next/dist/next-server/lib/head";
import firebase from "../../firebase/clientApp";
import { useRecoilState } from "recoil";
import {
  calendlySettingAtom,
  radioAnswerWithName,
  useUser,
} from "../../src/atoms";
import { RadioQuestion } from "../../components/RadioQuestion";
import { Calendly, CalendlyState } from "../../components/Calendly";
import { FormSection } from "../../components/FormSection";
import { FormSectionTitle } from "../../components/FormSectionTitle";
import { meetOrVideo, radioSettings } from "../../src/settings/inputOption";
import { useCalendlySetter } from "../../lib/hooks";
import { Introduction } from "../../components/Introduction";
import { AuthDisplay } from "../../components/AuthDisplay";
import { SocialMedia } from "../../components/SocialMedia";
import { LinkToQA } from "../../components/LinkToQA";
import { AlreadyReserved } from "../../components/AlreadyReserved";

export default function CoachingPreparation({}: {
  staticCollection: { name: string }[];
  allPostsData: { date: string; title: string; id: string }[];
}) {
  const [meetOrVideoState] = useRecoilState(radioAnswerWithName(meetOrVideo));
  const [user] = useUser();
  const [calendlySetting, setCalendlySetting] = useRecoilState(
    calendlySettingAtom
  );
  const [calendlyState, setCalendlyState] = useState(CalendlyState.unshown);

  useCalendlySetter(
    user,
    setCalendlySetting,
    calendlySetting,
    meetOrVideoState
  );

  const calendlySectionTitle =
    calendlyState == CalendlyState.unshown
      ? "以下から空き枠をご予約ください(カレンダー読込中)"
      : "以下から空き枠をご予約ください";

  const notText = ["対面", "ビデオチャット"].includes(meetOrVideoState);
  return (
    <>
      <Head>
        <title>予約ページ</title>
      </Head>
      <div className="py-3 bg-teal-200 min-h-screen text-gray-800 flex justify-center">
        <main className={"px-3 w-full max-w-screen-sm"}>
          <FormSection>
            <Introduction />
          </FormSection>
          <FormSection>
            <AuthDisplay
              user={user}
              onClickHandler={() => firebase.auth().signOut()}
            />
          </FormSection>

          {user && (
            <FormSection>
              <FormSectionTitle title={"ご希望の方法をお選びください"} />
              <RadioQuestion {...radioSettings[meetOrVideo]} />
            </FormSection>
          )}

          {notText == false && meetOrVideoState != "" && (
            <FormSection>
              <SocialMedia />
            </FormSection>
          )}

          {user && notText && (
            <FormSection>
              <FormSectionTitle title={calendlySectionTitle} />
              <Calendly setCalendlyState={setCalendlyState} />
            </FormSection>
          )}

          {user && notText && calendlyState === CalendlyState.scheduled && (
            <>
              <FormSection>
                <p className={"text-lg"}>予約は完了です。</p>
              </FormSection>
              <FormSection>
                <LinkToQA user={user} />
              </FormSection>
            </>
          )}

          {(!user || ["", "テキスト"].includes(meetOrVideoState)) && (
            <AlreadyReserved />
          )}
        </main>
      </div>
    </>
  );
}
