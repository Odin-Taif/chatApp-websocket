import { cardFeature } from "@/features/card-mangament";
import {
  ProfileCardAdmin,
  ProfileCardUser,
  QRCodeCard,
} from "@/features/card-mangament/ui";
import { Page } from "@/ui/pages-layout";
import { getSession } from "../../../lib/session";
import { SignOutButton } from "@/features/user-managment/ui";
import {
  AddPlatform,
  ProfileSocialLink,
} from "@/features/platform-mangament/ui";
import { platformFeature } from "@/features/platform-mangament";

type JWTPayload = {
  payload: {
    id: string;
    name: string;
    email: string;
  };
  expires: string;
  iat: number;
  exp: number;
};

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const session = (await getSession()) as JWTPayload | null;
  const sessionUserId = session?.payload.id;
  const userEmail = session?.payload.email;
  const { userId } = await params;
  const response = await cardFeature.service.getUserProfileById(userId);
  const { userProfile } = response;
  if (!response.success || !response.userProfile) {
    return (
      <Page title="">
        <section className="flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-3xl font-bold text-red-200">User Not Found</h1>
          <p className="mt-4 text-red-200">
            We couldn&apos;t find the profile you were looking for.
          </p>
        </section>
      </Page>
    );
  }
  const platforms = await platformFeature.service.getPlatformsByUserId(userId);
  return (
    <Page title="">
      <section className="flex flex-col items-center justify-center py-10">
        {sessionUserId && (
          <div className="flex items-center justify-between w-full p-4 bg-gray-800 text-white shadow-md fixed top-0 left-0 z-10">
            <div className="flex items-center">
              <span className="text-lg font-semibold">
                {`Logged in as: ${userEmail}`}
              </span>
            </div>
            <div className="flex items-center">
              <SignOutButton />
            </div>
          </div>
        )}

        <div className="mt-8 w-full max-w-3xl">
          <div className="flex flex-row px-4 py-4 text-gray-500 rounded-2xl bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
            <div className="basis-3/4">
              {sessionUserId === userId && userProfile && (
                <ProfileCardAdmin userProfile={userProfile} />
              )}
              {userProfile && sessionUserId !== userId && (
                <ProfileCardUser userProfile={userProfile} />
              )}
            </div>
            <div className="basis-1/6">
              <QRCodeCard userId={userId} />
            </div>
          </div>
          {platforms &&
            platforms.map((item) => (
              <ProfileSocialLink key={item.id} platform={item} />
            ))}
          {sessionUserId === userId && <AddPlatform userId={sessionUserId} />}
        </div>
      </section>
    </Page>
  );
}
