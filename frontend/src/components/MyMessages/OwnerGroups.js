import React, { useContext, useEffect, useState } from "react";
import { NearContext } from "../../context/NearContext";
import logoImage from "../../assets/img/group.png";

export const OwnerGroups = () => {
  const near = useContext(NearContext);
  const [ ownerGroup, setOwnerGroups ] = useState([]);

  const loadOwnerRooms = async () => {
    const rooms = await near.mainContract.getOwnerRooms(near.wallet.accountId);
    setOwnerGroups(rooms);
    console.log(`rooms`, rooms);
  }

  useEffect(() => {
    loadOwnerRooms();
  }, []);

  return ownerGroup.length > 0 && (
    <div className="active-users flex flex-row px-4 pb-3 overflow-auto w-0 min-w-full">
      {ownerGroup.map(room => (
        <div className="text-sm text-center mr-2" key={room.id}>
          <div className="border-blue-600 rounded-full">
            <div className="w-16 h-16 relative">
              <img className="shadow-md rounded-full w-full h-full object-cover"
                   src={room.media || logoImage}
                   alt={room.id}
              />
            </div>
          </div>
          <small className={"font-semibold w-16 overflow-hidden text-ellipsis block whitespace-nowrap"}>
            {room.title}
            {/*{room.is_private}*/}
            {/*{room.is_read_only}*/}
          </small>
        </div>
      ))}
    </div>
  )

}