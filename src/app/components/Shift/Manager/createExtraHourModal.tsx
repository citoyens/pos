import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ManagerDialogFooter } from "app/components/common/Manager/Dialog/Footer";
import { commons, shiftManager } from "app/i18n/types";
import { useEffect, useState } from "react";
import { Hour, Reason, ToPay } from "core/shifts/entities/Shift";
import { useAllUsers } from "app/hooks/useAllUsers";
import { User } from "core/users/entities/User";
import { createExtraHour } from "core/shifts/repository/shiftRepo";
import KitchenSelector from "app/components/Kitchen/Selector";
import { useAppSelector } from "app/hooks/useAppSelector";
import { useRole } from "app/hooks/useRole";

interface ExtraHourModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ExtraHourModal = ({
  open,
  onClose,
  onSuccess,
}: ExtraHourModalProps) => {
  const { t } = useTranslation();
  const users = useAllUsers();
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedUser, setSelectedUser] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showUsersList, setShowUsersList] = useState<boolean>(false);
  const [selectedUserData, setSelectedUserData] = useState<User | null>(null);

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedKitchen, setSelectedKitchen] = useState<string>("");

  const [reason, setReason] = useState<Reason>(Reason.LUNCH_TIME_OVERTIME);
  const [shiftDate, setShiftDate] = useState<Date>(new Date());
  const [hoursTotal, setHoursTotal] = useState<number>(1);
  const user = useAppSelector((state) => state.session);
  const extraReasons = [
    Reason.LUNCH_TIME_OVERTIME,
    Reason.EXTRA_SHIFT_IN_ANOTHER_KITCHEN,
  ];
  const role = useRole();
  const canApprove = role.canApproveOvertime();

  useEffect(() => {
    if (open && users.list.length === 0) {
      users.get();
    }
  }, [open]);

  useEffect(() => {
    if (users.list.length > 0 && searchTerm.trim().length > 2) {
      let filtered = users.list;
      const searchTermLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (user) =>
          user.firstname.toLowerCase().includes(searchTermLower) ||
          user.lastname.toLowerCase().includes(searchTermLower) ||
          (user.username &&
            user.username.toLowerCase().includes(searchTermLower))
      );
      setFilteredUsers(filtered.slice(0, 10));
      setShowUsersList(true);
    } else {
      setShowUsersList(false);
    }
  }, [users.list, searchTerm]);

  useEffect(() => {
    if (selectedUser && users.list.length > 0) {
      const userData = users.list.find((user) => user.id === selectedUser);
      if (userData) {
        setSelectedUserData(userData);
        setSelectedCountry(userData.country || "");
        setSelectedCity(userData.city || "");
        setSelectedKitchen(userData.profile?.kitchenId || "");
      }
    } else {
      setSelectedUserData(null);
    }
  }, [selectedUser, users.list]);

  const handleClose = () => {
    setSelectedUser("");
    setSelectedUserData(null);
    setSelectedCountry("");
    setSelectedCity("");
    setSelectedKitchen("");
    setShiftDate(new Date());
    setHoursTotal(1);
    setSearchTerm("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedUser || !selectedUserData) {
      return;
    }

    const extraHour: Hour = {
      type: reason,
      total: hoursTotal,
      typeCode: reason,
      isExtra: true,
      additional: true,
      toPay: true,
    };

    setLoading(true);
    try {
      await createExtraHour({
        userId: selectedUser,
        identification: selectedUserData.username,
        name: `${selectedUserData.firstname} ${selectedUserData.lastname}`,
        hours: hoursTotal,
        kitchenId: selectedKitchen,
        city: selectedCity,
        active: false,
        roleId: selectedUserData.roles[0] ?? "",
        position: selectedUserData.contract?.position,
        maxHours: 0,
        country: selectedCountry,
        timeZone: "",
        hourReport: [extraHour],
        extraHourReport: [extraHour],
        startTime: shiftDate,
        endTime: shiftDate,
        companyId: user.data?.companyId ?? "",
        totalExtras: hoursTotal,
        reason: reason,
        isHoliday: false,
        opsManager: user.user.data?.profile.name ?? "",
        workingDay: selectedUserData.contract?.workingDay,
        toPay: ToPay.YES,
      });

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error creating overtime:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>{t(shiftManager.CREATE_EXTRA_HOUR)}</DialogTitle>
      <DialogContent sx={{ pb: 4 }}>
        <Grid container spacing={2} sx={{ mt: 1, mb: 4 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={
                selectedUser ? t(commons.SELECTED_USER) : t(commons.SEARCH_USER)
              }
              value={searchTerm}
              autoComplete="off"
              onChange={(e) => {
                if (selectedUser) {
                  setSelectedUser("");
                  setSelectedUserData(null);
                }
                setSearchTerm(e.target.value);
              }}
              disabled={loading || users.getLoading}
              placeholder={t(commons.SEARCH_USER_PLACEHOLDER)}
              helperText={selectedUser ? "" : t(commons.SEARCH_USER_HELP)}
              InputProps={{
                endAdornment: selectedUser && (
                  <Button
                    size="small"
                    onClick={() => {
                      setSelectedUser("");
                      setSearchTerm("");
                      setSelectedUserData(null);
                    }}
                  >
                    {t(commons.CLEAR)}
                  </Button>
                ),
              }}
              sx={{ mb: 1 }}
            />

            {showUsersList && !selectedUser && (
              <Paper
                elevation={3}
                sx={{
                  maxHeight: 200,
                  overflowY: "auto",
                  mt: 1,
                  mb: 2,
                  position: "absolute",
                  width: "calc(100% - 32px)",
                  zIndex: 1000,
                }}
              >
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <MenuItem
                      key={user.id}
                      value={user.id}
                      onClick={() => {
                        setSelectedUser(user.id);
                        setSearchTerm(
                          `${user.firstname} ${user.lastname} - ${
                            user.contract?.position || ""
                          } ${user.country ? `(${user.country})` : ""}`
                        );
                        setShowUsersList(false);
                        setSelectedUserData(user);
                      }}
                      sx={{
                        borderBottom: "1px solid #f0f0f0",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      {`${user.firstname} ${user.lastname} - ${
                        user.contract?.position || ""
                      } ${user.country ? `(${user.country})` : ""}`}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>{t(commons.NO_RESULTS)}</MenuItem>
                )}
              </Paper>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              {t(shiftManager.SHIFT_LOCATION_LABEL)}
            </Typography>
            <KitchenSelector
              selected={{
                country: selectedCountry,
                city: selectedCity,
                kitchen: selectedKitchen,
              }}
              onChange={{
                country: (value) => setSelectedCountry(value?.code ?? ""),
                city: (value) => setSelectedCity(value?.code ?? ""),
                kitchen: (value) => setSelectedKitchen(value?.kitchenId ?? ""),
              }}
              extra={{
                disabled: loading,
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth sx={{ mb: 1 }}>
              <InputLabel>{t(commons.REASON)}</InputLabel>
              <Select
                label={t(commons.REASON)}
                value={reason}
                onChange={(e) => setReason(e.target.value as Reason)}
                disabled={loading}
              >
                {extraReasons.map((key) => (
                  <MenuItem key={key} value={key}>
                    {t(`shiftManager.${key}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label={t(shiftManager.SHIFT_DATE)}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={shiftDate.toISOString().split("T")[0]}
              onChange={(e) => {
                const newDate = e.target.value;
                if (newDate) {
                  setShiftDate(new Date(newDate));
                }
              }}
              disabled={loading}
              sx={{ mb: 1 }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label={t(shiftManager.EXTRA_HOURS)}
              type="number"
              inputProps={{ min: 1, max: 24, step: 1 }}
              value={hoursTotal}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value > 0 && value <= 24) {
                  setHoursTotal(value);
                }
              }}
              disabled={loading}
              sx={{ mb: 1 }}
            />
          </Grid>
        </Grid>
        {canApprove && (
          <ManagerDialogFooter
            onCancel={handleClose}
            mainButton={{
              children: t(commons.SAVE),
              onClick: handleSubmit,
              disabled:
                loading ||
                !selectedUser ||
                !selectedUserData ||
                !selectedKitchen,
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExtraHourModal;
