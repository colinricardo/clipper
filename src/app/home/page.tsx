import { api } from "@/trpc/server";

export default async () => {
  const user = await api.user.current();

  const renderMain = () => {
    return (
      <div className="flex flex-col items-center space-y-4 text-center justify-center w-full p-4">
        <h1 className="text-lg font-semibold md:text-2xl">welcome</h1>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Home</h1>
      </div>
      <div className="flex">{renderMain()}</div>
    </>
  );
};
