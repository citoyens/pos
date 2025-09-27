import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React from "react";
import { UserLite } from "core/users/entities/User";
import { Avatar } from "@mui/material";
import { UserScheduleUtil } from "utils/userSchedule";

interface Props {
  user: UserLite;
}

const UserCard = (props: Props): React.ReactElement => {
  const { user } = props;

  const getBorderBottom = (position: string) => {
    let result = "gray solid 4px";
    if (position.includes("JEFE")) {
      result = "#3C81DB solid 4px";
    }
    return result;
  };

  return (
    <Paper
      elevation={1}
      sx={{
        width: "100%",
        p: 1,
        height: "100%",
        borderBottom: getBorderBottom(user.position),
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Avatar src={UserScheduleUtil.getUserImage(user._id)} />
          <Box>
            <Typography
              variant="h6"
              title={user.username}
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {user.name}
            </Typography>
            {!!user.position && (
              <Typography variant="body2">{user.position}</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default React.memo(UserCard);
