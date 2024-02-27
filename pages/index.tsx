import Image from "next/image";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyuserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { BiImageAlt } from "react-icons/bi";
import FeedCard from "@/components/FeedCard";
import { GetServerSideProps } from "next";
import {
  getAllTweetsQuery,
  getSignedURLForTweetQuery,
} from "@/graphql/query/tweet";
import axios from "axios";

interface HomeProps {
  tweets?: Tweet[];
}

export default function Home(props: HomeProps) {
  const { user } = useCurrentUser();
  // const { tweets = [] } = useGetAllTweets();

  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");
  const { tweets = props.tweets as Tweet[] } = useGetAllTweets();
  const { mutateAsync } = useCreateTweet();

  // const [_tweets, setTweets] = useState<Tweet[]>();

  // useEffect(() => {
  //   if(_tweets) {
  //     setTweets(tweets as Tweet[])
  //   }
  // },[tweets])

  // console.log("this is user", user);

  const handleInputChangeFile = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      event.preventDefault();

      const file: File | null | undefined = input.files?.item(0);

      if (!file) return;

      const { getSignedURLForTweet } = await graphqlClient.request(
        getSignedURLForTweetQuery,
        {
          imageType: file?.type,
          imageName: file?.name,
        }
      );

      if (getSignedURLForTweet) {
        toast.loading("Uploading...", { id: "2" });
        await axios.put(getSignedURLForTweet, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
        toast.success("Upload Complete", { id: "2" });
        const url = new URL(getSignedURLForTweet);
        const myFilePath = `${url.origin}${url.pathname}`;
        setImageURL(myFilePath);
      }
    };
  }, []);

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    const handleFn = handleInputChangeFile(input);
    input.addEventListener("change", handleFn);

    input.click();
  }, [handleInputChangeFile]);

  const handleCreateTweet = useCallback(async () => {
    await mutateAsync({
      content,
      imageURL,
    });
    setContent("")
    setImageURL("")
  }, [content, mutateAsync, imageURL]);

  return (
    <div>
      <TwitterLayout>
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
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent text-xl px-3 border-b border-b-slate-400"
                  placeholder="What's happening?"
                  rows={3}
                ></textarea>
                {imageURL && (
                  <Image
                    src={imageURL}
                    alt="tweet-image"
                    width={300}
                    height={300}
                  />
                )}
                <div className="mt-2 flex justify-between items-center">
                  <BiImageAlt onClick={handleSelectImage} className="text-xl" />
                  <button
                    onClick={handleCreateTweet}
                    className="font-semibold  bg-sky-400 py-1  px-3 rounded-full hover:bg-sky-500"
                  >
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
      </TwitterLayout>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  const allTweets = await graphqlClient.request(getAllTweetsQuery);

  return {
    props: {
      tweets: allTweets.getAllTweets as Tweet[],
    },
  };
};
