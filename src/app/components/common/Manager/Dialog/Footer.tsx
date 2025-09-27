import { CancelOutlined, CheckCircleOutline } from "@mui/icons-material";
import { Button, ButtonProps, Grid } from "@mui/material";
import { commons } from "app/i18n/types";
import { useTranslation } from "react-i18next";

interface Props {
  onCancel: () => void;
  mainButton: ButtonProps;
}

export const ManagerDialogFooter = (props: Props) => {
  const { onCancel, mainButton } = props;
  const { t } = useTranslation();
  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Button
          endIcon={<CancelOutlined />}
          color="error"
          type="button"
          onClick={onCancel}
          variant="outlined"
          fullWidth
        >
          {t(commons.CANCEL)}
        </Button>
      </Grid>

      <Grid item xs={6}>
        <Button
          {...mainButton}
          endIcon={mainButton.endIcon ?? <CheckCircleOutline />}
          variant="contained"
          fullWidth
        />
      </Grid>
    </Grid>
  );
};
