import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import Image from "next/image";
import {
  BiHash,
  BiHomeCircle,
  BiImageAlt,
  BiMoney,
  BiUser,
} from "react-icons/bi";
import FeedCard from "@/components/FeedCard";
import { SlOptions } from "react-icons/sl";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyuserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
}

const sidebarMenuItems: TwitterSidebarButton[] = [
  {
    title: "Home",
    icon: <BiHomeCircle />,
  },
  {
    title: "Explore",
    icon: <BiHash />,
  },
  {
    title: "Notifications",
    icon: <BsBell />,
  },
  {
    title: "Messages",
    icon: <BsEnvelope />,
  },
  {
    title: "Bookmarks",
    icon: <BsBookmark />,
  },
  {
    title: "Twitter Blue",
    icon: <BiMoney />,
  },
  {
    title: "Profile",
    icon: <BiUser />,
  },
  {
    title: "More",
    icon: <SlOptions />,
  },
];

export default function Home() {
  const { user } = useCurrentUser();
  const { tweets = [] } = useGetAllTweets();

  const [content, setContent] = useState("");

  const queryClient = useQueryClient();
  const {mutate} = useCreateTweet();

  console.log("this is user", user);

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  }, []);

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

  const handleCreateTweet = useCallback(() => {
    mutate({
      content,
    })
  },[content, mutate])

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-56">
        <div className="col-span-3 pt-1 px-4 relative">
          <div className="text-3xl h-fit w-fit  hover:bg-gray-600 rounded-full p-3 cursor-pointer transition-all ">
            <BsTwitter />
          </div>
          <div className="mt-4 text-2xl pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li
                  className="mt-2 flex justify-start items-center gap-4 hover:bg-gray-600 rounded-full px-5 py-2 cursor-pointer transition-all w-fit"
                  key={item.title}
                >
                  <span>{item.icon}</span>
                  <span>{item.title}</span>{" "}
                </li>
              ))}
            </ul>
            <div className="mt-5 px-5">
              <button className="font-bold  bg-sky-400  p-4 rounded-full w-full  hover:bg-sky-500">
                Tweet
              </button>
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
                <div>
                  <h1 className="pt-1 rounded-full px-2 hover:bg-gray-600 cursor-pointer">
                    {user.firstName} {user.lastName}
                  </h1>
                </div>
                <div className="flex items-center  p-2 rounded-full hover:bg-gray-600 cursor-pointer">
                  <SlOptions />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-6 border-l-[1px] border-r-[1px] border-white overflow-scroll no-scrollbar">
          <div>
            <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-800 transition-all cursor-pointer">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-1">
                  {user?.profileImageURL && (
                    <Image
                      className="rounded-full"
                      src={user?.profileImageURL}
                      alt="profile photo"
                      height={50}
                      width={50}
                    />
                  )}
                </div>
                <div className="col-span-11">
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="w-full bg-transparent text-xl px-3 border-b border-b-slate-400"
                    placeholder="What's happening?"
                    rows={5}
                  ></textarea>
                  <div className="mt-2 flex justify-between items-center">
                    <BiImageAlt
                      onClick={handleSelectImage}
                      className="text-xl"
                    />
                    <button onClick={handleCreateTweet} className="font-semibold  bg-sky-400 py-1  px-3 rounded-full hover:bg-sky-500">
                      Tweet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {tweets?.map((tweet) =>
            tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null
          )}
        </div>
        <div className="col-span-3 p-5">
          {!user && (
            <div className="p-5 bg-slate-700 rounded-lg">
              <div className="flex flex-col justify-center items-center">
                <h1 className="my-2 text-2xl">New to Twitter?</h1>
                <GoogleLogin onSuccess={handleLoginWithGoogle} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
