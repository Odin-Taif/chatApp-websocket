import Image from "next/image";
import { ProfileSocialLink, ProfileImage, ProfileBio } from ".";
import { PROFILE } from "../types";

type Props = {
  userProfile: PROFILE;
};

export async function ProfileCard({ userProfile }: Props) {
  return (
    <>
      <div className="px-8 py-8 mt-3 text-gray-500 rounded-2xl bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
        <div className="flex flex-wrap items-start sm:space-x-6 sm:flex-nowrap">
          <ProfileImage />
          <ProfileBio biography={userProfile?.biography} />
        </div>
      </div>

      {[
        { title: "LinkedIn", href: "https://linkedin.com" },
        { title: "GitHub", href: "https://github.com" },
        { title: "Twitter", href: "https://twitter.com" },
        { title: "Facebook", href: "https://facebook.com" },
      ].map((sociallink, index) => (
        <ProfileSocialLink key={index} sociallink={sociallink} />
      ))}
    </>
  );
}