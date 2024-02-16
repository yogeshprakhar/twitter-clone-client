import Image from "next/image";
import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";

const FeedCard: React.FC = () => {
  return (
    <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-800 transition-all cursor-pointer">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-1">
          <Image
            className="rounded-full"
            src="https://avatars.githubusercontent.com/u/122036443?v=4"
            alt="profile photo"
            height={50}
            width={50}
          />
        </div>
        <div className="col-span-11">
          <h5>Yogesh Prakhar</h5>
          <p>
            Hello , This is King Steve from Stranger Things and I can see vecna
            is making the move to join the upside down with our world , i am
            also aware of that vecna is old master of elven.
          </p>
          <div className="flex justify-between mt-5 text-xl items-center mr-10">
            <div>
              <BiMessageRounded />
            </div>
            <div>
              <FaRetweet />
            </div>
            <div>
              <AiOutlineHeart />
            </div>
            <div>
              <BiUpload />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
