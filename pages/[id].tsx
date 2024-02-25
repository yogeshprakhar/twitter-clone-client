import {useRouter} from 'next/router';
import FeedCard from "@/components/FeedCard";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { Tweet, User } from "@/gql/graphql";
import { useCurrentUser } from "@/hooks/user";
import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { BsArrowLeftShort } from "react-icons/bs";
import { graphql } from '@/gql';
import { graphqlClient } from '@/clients/api';
import { getUserByIdQuery } from '@/graphql/query/user';
import { userInfo } from 'os';

interface ServerProps {
  userInfo?: User
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
  // const { user } = useCurrentUser();
    const router = useRouter();

    // console.log("user is",user)
    // console.log("this is props",props)
    // console.log("Router Query is ",router.query)

  return (
    <div>
      <TwitterLayout>
        <div>
          <nav className="flex gap-3 items-center py-3 px-3">
            <BsArrowLeftShort className="text-4xl" />
            <div>
              <h1 className="text-2xl font-bold">{props.userInfo?.firstName} {props.userInfo?.lastName}</h1>
              <h1 className="text-md font-bold text-slate-500">
                {props.userInfo?.tweets?.length} Tweets
              </h1>
            </div>
          </nav>
          <div className="p-4 border-b border-slate-800">
            {props.userInfo?.profileImageURL && (
              <Image
                className="rounded-full"
                src={props.userInfo?.profileImageURL}
                alt="user-image"
                width={200}
                height={200}
              />
            )}
            <h1 className="text-2xl font-bold mt-5">Yogesh Prakhar</h1>
          </div>
          <div>
            {props.userInfo?.tweets?.map((tweet) => (
              <FeedCard data={tweet as Tweet} key={tweet?.id} />
            ))}
          </div>
        </div>
      </TwitterLayout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async (context) => {
  const id = context.query.id as string | undefined;
  // console.log("server side props id is",id)

  if(!id) return {notFound: true, props: {userInfo: undefined}} 

  const userInfo = await graphqlClient.request(getUserByIdQuery, {id})
  // console.log("SERVER SIDE",userInfo)

  if(!userInfo?.getUserById) return {notFound: true}
  return {
    props: {
      userInfo: userInfo.getUserById as User
    }
  }
}

export default UserProfilePage;
