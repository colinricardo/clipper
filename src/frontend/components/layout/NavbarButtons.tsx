"use client";

import ShowOnboardingButton from "../common/ShowOnboardingButton";

export default () => {
  const renderButtons = () => (
    <div className="flex flex-col space-y-2">
      <ShowOnboardingButton />
    </div>
  );

  return <div className="mt-auto p-4">{renderButtons()}</div>;
};
