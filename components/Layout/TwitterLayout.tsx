import React, { useCallback, useMemo } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import Image from "next/image";
import { SlOptions } from "react-icons/sl";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { useCurrentUser } from "@/hooks/user";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyuserGoogleTokenQuery } from "@/graphql/query/user";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
interface TwitterLayoutProps {
  children: React.ReactNode;
}

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
  link: string;
}


const TwitterLayout: React.FC<TwitterLayoutProps> = (props) => {
  const queryClient = useQueryClient();

  const { user } = useCurrentUser();


  const sideBarMenuItems: TwitterSidebarButton[] = useMemo(
    () => [
      {
        title: "Home",
        icon: <BiHomeCircle />,
        link: `/`,
      },
      {
        title: "Explore",
        icon: <BiHash />,
        link: `/`,
      },
      {
        title: "Notifications",
        icon: <BsBell />,
        link: `/`,
      },
      {
        title: "Messages",
        icon: <BsEnvelope />,
        link: `/`,
      },
      {
        title: "Bookmarks",
        icon: <BsBookmark />,
        link: `/`,
      },
      {
        title: "Twitter Blue",
        icon: <BiMoney />,
        link: `/`,
      },
      {
        title: "Profile",
        icon: <BiUser />,
        link: `/${user?.id}`,
      },
      {
        title: "More",
        icon: <SlOptions />,
        link: `/`,
      },
    ],
    [user?.id]
  );

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error(`Google Token not found`);
      const { verifyGoogleToken } = await graphqlClient.request(
        verifyuserGoogleTokenQuery,
        { token: googleToken }
      );

      toast.success("Verified Succecss");
      // console.log(verifyGoogleToken);
      if (verifyGoogleToken) {
        window.localStorage.setItem("twitter_token", verifyGoogleToken);
      }

      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    [queryClient]
  );
  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen sm:px-56">
        <div className="col-span-2 sm:col-span-3 pt-1 pr-4 flex sm:justify-end relative">
          <div>
            <div className="text-3xl h-fit w-fit  hover:bg-gray-600 rounded-full p-3 cursor-pointer transition-all ">
              <BsTwitter />
            </div>
            <div className="mt-4 text-2xl pr-4">
              <ul>
                {sideBarMenuItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      className="mt-2 flex justify-start items-center gap-4 hover:bg-gray-600 rounded-full px-5 py-2 cursor-pointer transition-all w-fit"
                      href={item.link}
                    >
                      <span>{item.icon}</span>
                      <span className="hidden sm:inline">
                        {item.title}
                      </span>{" "}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-5 px-4">
                <button className="hidden sm:block font-bold  bg-sky-400  p-4 rounded-full w-full  hover:bg-sky-500">
                  Tweet
                </button>
                <button className="block sm:hidden font-bold  text-sm bg-sky-400 p-2 rounded-full w-full  hover:bg-sky-500">
                  <BsTwitter />
                </button>
              </div>
            </div>
          </div>
          {user && (
            <div className="absolute bottom-8 flex gap-2 items-center bg-slate-900 p-3 rounded-full  ">
              {user && user.profileImageURL && (
                <Image
                  className="rounded-full cursor-pointer"
                  src={user?.profileImageURL}
                  alt="some image"
                  height={50}
                  width={50}
                />
              )}
              <div className="flex">
                <div className="hidden sm:block">
                  <h1 className="pt-1 rounded-full px-2 hover:bg-gray-600 cursor-pointer">
                    {user.firstName} {user.lastName}
                  </h1>
                </div>
                <div className="flex items-center  p-2 rounded-full hover:bg-gray-600 cursor-pointer">
                  <SlOptions className="hidden sm:block" />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-10 sm:col-span-5 border-l-[1px] border-r-[1px] border-white overflow-scroll no-scrollbar">
          {props.children}
        </div>
        <div className="col-span-3 p-5">
          {!user ? (
            <div className="p-5 bg-slate-700 rounded-lg">
              <div className="flex flex-col justify-center items-center">
                <h1 className="my-2 text-2xl">New to Twitter?</h1>
                <GoogleLogin onSuccess={handleLoginWithGoogle} />
              </div>
            </div>
          ) : (
            <div className="px-4 py-3 bg-slate-800 rounded-lg">
              <h1 className="my-2 text-2xl mb-5">User you may know</h1>
              {user?.recommendedUsers?.map((el) => (
                <div className="flex items-center gap-3 mt-2" key={el?.id}>
                  {el?.profileImageURL && (
                    <Image
                      className="rounded-full"
                      src={el?.profileImageURL}
                      alt="user-image"
                      width={60}
                      height={60}
                    />
                  )}
                  <div className="flex gap-5">
                    <div className="text-lg font-semibold">
                      {el?.firstName} {el?.lastName}
                    </div>
                    <Link href={`/${el?.id}`} className="bg-white text-black rounded full text-sm px-5 py-1 text-bold hover:bg-slate-400">View</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwitterLayout;
