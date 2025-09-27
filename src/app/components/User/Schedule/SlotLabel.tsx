import Box from "@mui/material/Box";
import { UserLite } from "core/users/entities/User";
import React from "react";
import { UserScheduleUtil } from "utils/userSchedule";
import UserCard from "./Card/UserCard";

interface Props {
  usersByKitchen: UserLite[];
}

const UserScheduleSlotLabel = (props: Props): React.ReactElement => {
  const { usersByKitchen } = props;

  return (
    <Box sx={UserScheduleUtil.column}>
      <Box sx={UserScheduleUtil.slotCorner} />
      {usersByKitchen.map((user) => (
        <Box
          key={`SlotLabel${user._id}`}
          sx={{
            ...UserScheduleUtil.slotLabel,
            justifyContent: "flex-start",
          }}
        >
          <UserCard user={user} />
        </Box>
      ))}
    </Box>
  );
};

export default UserScheduleSlotLabel;
