import React from "react";

const MessageCard = ({ user, message, status, time }) => {
  return (
    <div className="flex flex-col gap-4 rounded w-full bg-white">
      <div className="flex gap-4 items-center relative p-4 rounded-lg">
        {/* User Avatar */}
        <div className="min-w-12 h-12 bg-gray-300 rounded-full"></div>

        {/* User Name and Message */}
        <div className="flex flex-col gap-1 leading-[16px] text-sm w-3/5">
          <span className="font-semibold">{user}</span>
          <div className="text-xs text-gray-600 mr-8 line-clamp-1">
          {message}
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-xs ml-4">
            <div className="text-sm text-[#CCCCCC]">{status}</div>
            {time}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
