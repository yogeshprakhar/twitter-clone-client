import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";

import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import FeedCard from "@/components/FeedCard";
import { SlOptions } from "react-icons/sl";

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
  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-56">
        <div className="col-span-3 pt-1 px-4 ">
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
        </div>
        <div className="col-span-6 border-l-[1px] border-r-[1px] border-white overflow-scroll no-scrollbar">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
        <div className="col-span-3"></div>
      </div>
    </div>
  );
}
