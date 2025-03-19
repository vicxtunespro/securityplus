import React from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

const MessageCard = ({ user, message, status, time }) => {
  return (
    <div className="flex flex-col gap-4 rounded w-ful">
      <div className="flex gap-4 items-center relative p-2 rounded-lg">
        {/* User Avatar */}
        {/* Profile Image */}
        <Image
              src={user.photoURL || "/default-user.png"}
              alt={user.name}
              width={30}
              height={30}
              className="rounded-full object-cover mr-4"
          />

        {/* User Name and Message */}
        <div className="flex flex-col gap-1 leading-[16px] text-sm w-3/5">
          <span className="font-normal">{user.name}</span>
          <span className="text-gray-400 text-sm">
              {user.createdAt ? formatDistanceToNow(user.createdAt.toDate(), { addSuffix: true }) : "Just now"}
          </span>
        </div>

        {/* Timestamp */}
        <div className="text-xs ml-4">
            
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
