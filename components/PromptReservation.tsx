import { Main } from "./Main";
import { FormSection } from "./FormSection";
import { FormSectionTitle } from "./FormSectionTitle";
import Link from "next/link";
import React from "react";
import { useUser } from "../src/atoms";

export function PromptReservation() {
  const [user] = useUser();
  return (
    <Main>
      <FormSection>
        <FormSectionTitle
          title={`${user.displayName}さんの予約はまだないようです。`}
        />
        <div>
          <Link href="/flows/coaching_preparation">
            <a>予約はこちらから</a>
          </Link>
        </div>
      </FormSection>
    </Main>
  );
}
