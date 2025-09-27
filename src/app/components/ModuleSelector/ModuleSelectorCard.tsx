import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useNavigator } from "app/hooks/useNavigator";
import { AmplitudeEvent, logEvent } from "core/common/utils/analytics";
import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { getModuleIcon } from "utils/module";
import { commons } from "../../i18n/types";

interface ModuleSelectorCardProps {
  moduleId?: string;
  title: string;
  description: string;
  link: string;
}

const ModuleSelectorCard: FunctionComponent<ModuleSelectorCardProps> = (
  props
) => {
  const navigator = useNavigator();
  const { moduleId, title, description, link } = props;

  const { t } = useTranslation();

  const icon: React.ReactElement | undefined = moduleId
    ? getModuleIcon(moduleId)
    : undefined;

  return (
    <Card
      sx={{
        height: "100%",
        display: "grid",
        borderRadius: 2,
        cursor: "pointer",
      }}
      onClick={() => {
        navigator.to(link);
        logEvent(AmplitudeEvent.VisitPage, {
          pageTitle: title,
          pageId: moduleId,
          pagelink: link,
        });
      }}
    >
      <CardContent sx={{ display: "flex", gap: 2, pb: 1 }}>
        {icon && <Box>{icon}</Box>}
        <Box>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant="text"
          color="info"
          sx={{ borderRadius: 2, ml: icon ? 8 : 1, px: 0 }}
        >
          <Typography fontWeight={500}>{t(commons.ENTER)}</Typography>
        </Button>
      </CardActions>
    </Card>
  );
};

export default ModuleSelectorCard;
