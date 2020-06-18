import React from "react";
import { useDocument, useCollection } from "@nandorojo/swr-firestore";
import { useUser } from "../src/atoms";

export default function ClientSide(props: {
  setName: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { data, error } = useDocument<User>(`users/sample`, {
    listen: true,
  });

  const [user] = useUser();

  const { data: collection, error: collectionError } = useCollection<CoachName>(
    `users/${user.uid}/reservation`
  );

  const { update } = useDocument<User>(`users/sample`);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>Loading</div>;
  if (collectionError) return <div>failed to load collection</div>;
  if (!collection) return <div>Loading</div>;
  return (
    <>
      <h2>client side rendering</h2>
      {user && <div>only showing collection: {collection[0].coachName}</div>}
      <div>showing and listening to firestore change: {data.name}</div>
      <div>onBlur set firestore doc. Resulting in change of above.</div>
      <input
        type="text"
        // value={name} // The dev tool alerts 'don't change to uncontrolled to control' with this. Isn't it controlled?
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          props.setName(e.target.value)
        }
        onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
          update({ name: e.target.value })
        }
      />
    </>
  );
}
