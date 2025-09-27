import { ApiVersion, getHttp, postHttp } from "utils/http";
import {
  Contract,
  NewUserPayload,
  NewUserResponse,
  Status,
  User,
  UserChangeStatus,
  UserLite,
  UserScheduleConfig,
  UserScheduleConfigResponse,
  UserScheduleDTO,
  UserSchedulePayload,
  UserScheduleResponse,
} from "../entities/User";
import appConfig from "config/app";
import { CoreBaseResponse } from "core/common/interfaces/core";

export const byId = async (id: string): Promise<User | undefined> => {
  try {
    const response = await getHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `user/by-id/${id}`
    );
    const data = await response.json();
    return data as User;
  } catch (ex: any) {
    console.error(`Error UserRepo.byId | ${ex.message}`);
    return undefined;
  }
};

const getAll = async (): Promise<User[]> => {
  try {
    const response = await getHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `user/all`
    );
    const data = await response.json();
    return data as User[];
  } catch (ex: any) {
    console.error(`Error UserRepo.getAll | ${ex.message}`);
    return [];
  }
};

const update = async (body: Partial<User>): Promise<User> => {
  try {
    const response = await postHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `user/update`,
      body
    );
    const data = await response.json();
    return data as User;
  } catch (ex: any) {
    console.error(`Error UserRepo.update | ${ex.message}`);
    throw ex;
  }
};

const changeStatus = async (body: UserChangeStatus): Promise<User> => {
  try {
    const response = await postHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `user/change/status`,
      body
    );
    const data = await response.json();
    return data as User;
  } catch (ex: any) {
    console.error(`Error UserRepo.changeStatus | ${ex.message}`);
    throw ex;
  }
};

const reSendWelcomeEmail = async (userId: string): Promise<void> => {
  try {
    const response = await getHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `user/resend/welcome-email/${userId}`
    );
    await response.text();
  } catch (ex: any) {
    console.error(`Error UserRepo.reSendWelcomeEmail | ${ex.message}`);
    throw ex;
  }
};

const create = async (
  body: Partial<NewUserPayload>
): Promise<NewUserResponse> => {
  try {
    const response = await postHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `user/create`,
      body
    );
    const data = await response.json();
    return data as NewUserResponse;
  } catch (ex: any) {
    console.error(`Error UserRepo.create | ${ex.message}`);
    return { success: false } as NewUserResponse;
  }
};

const byKitchen = async (kitchenId: string): Promise<UserLite[]> => {
  try {
    const response = await getHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `user/by-kitchen/${kitchenId}`
    );
    const list: User[] = await response.json();
    return list
      .filter((el) => el.status === Status.ACTIVE)
      .map(
        (user) =>
          ({
            _id: user.id,
            username: user.username,
            name: `${user.firstname} ${user.lastname}`,
            kitchenId: user.profile.kitchenId,
            area: user.contract.area,
            position: user.contract.position,
            workingDay: user.contract.workingDay ?? "FULL",
          } as UserLite)
      );
  } catch (ex: any) {
    console.error(`Error UserRepo.byKitchen | ${ex.message}`);
    return [];
  }
};

const findSchedulesByLocationAndDate = async (
  locationId: string,
  date: string
): Promise<UserScheduleDTO[]> => {
  try {
    const response = await getHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `user/schedule/location/${locationId}/date/${date}`
    );
    const result: UserScheduleResponse = await response.json();
    return result.data ?? [];
  } catch (ex: any) {
    console.error(
      `Error UserRepo.findSchedulesByLocationAndDate | ${ex.message}`
    );
    return [];
  }
};

const findScheduleConfig = async (
  country: string
): Promise<UserScheduleConfig | undefined> => {
  try {
    const response = await getHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `user/schedule/config/${country}`
    );
    const responseJSON: UserScheduleConfigResponse = await response.json();
    return responseJSON.data;
  } catch (ex: any) {
    console.error(`Error UserRepo.findScheduleConfig | ${ex.message}`);
    return undefined;
  }
};

const upsertSchedule = async (
  data: UserSchedulePayload
): Promise<CoreBaseResponse> => {
  try {
    const response = await postHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `user/schedule/upsert`,
      data
    );
    const responseJSON: CoreBaseResponse = await response.json();
    return responseJSON;
  } catch (ex: any) {
    console.error(`Error UserRepo.upsertSchedule | ${ex.message}`);
    return { ok: false, message: ex.message };
  }
};

export const UserRepo = {
  create,
  reSendWelcomeEmail,
  changeStatus,
  update,
  getAll,
  byId,
  byKitchen,
  findSchedulesByLocationAndDate,
  findScheduleConfig,
  upsertSchedule,
};
