import { Params, useLocation, useNavigate, useParams } from "react-router-dom";
import { ObjectParams } from "utils/http";

export const DEFAULT_LOCATION_TYPE = "module";
export const LOCATION_TYPE_KEY = "locationType";
export const KITCHEN_ID_KEY = "kitchenId";
export const KITCHEN_ID_KEY_EQUALS = ["cpId", "locationId"];

interface Navigator {
  to: (path: string) => void;
  toByLocationType: (path: string) => void;
  location: () => string;
  params: () => Params<string>;
}

export const useNavigator = (): Navigator => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const redirectTo = (path: string) => {
    const { locationType } = params;
    const prefix = locationType ?? DEFAULT_LOCATION_TYPE;
    let to = path;
    if (!to.includes(prefix) && !to.includes(DEFAULT_LOCATION_TYPE)) {
      to = `/${prefix}${path}`;
    }
    const paramsToReplace = params as ObjectParams;
    Object.keys(paramsToReplace).forEach((key) => {
      if (key === KITCHEN_ID_KEY) {
        KITCHEN_ID_KEY_EQUALS.forEach((equal) => {
          to = to.replace(`:${equal}`, paramsToReplace[key]);
        });
      }
      to = to.replace(`:${key}`, paramsToReplace[key]);
    });
    to = to.replace(`:${LOCATION_TYPE_KEY}`, prefix);
    navigate(to);
  };

  return {
    to: (path: string) => navigate(path),
    toByLocationType: redirectTo,
    location: () => location.pathname,
    params: () => params,
  };
};
