import { useAppDispatch } from "app/hooks/useAppDispatch";
import { useAppSelector } from "app/hooks/useAppSelector";
import {
  clearSearchOnTopBar,
  hideSearchOnTopBar,
  showSearchOnTopBar,
} from "app/store/slices/global";
import { FunctionComponent, useEffect } from "react";
import { useMount, useUnmount } from "react-use";
import { clearSpecialCharacters } from "utils/general";

interface SearchOnTopBarProps {
  onSearch: (search: string) => void;
  clean?: number | string;
}

const SearchOnTopBar: FunctionComponent<SearchOnTopBarProps> = (props) => {
  const { onSearch, clean } = props;

  const dispatch = useAppDispatch();

  const searchTerm = useAppSelector((state) => state.global.textSearchOnTopBar);

  useEffect(() => {
    onSearch(clearSpecialCharacters(searchTerm.toLocaleLowerCase()));
  }, [searchTerm]);

  useEffect(() => {
    dispatch(clearSearchOnTopBar());
  }, [clean]);

  useMount(() => {
    dispatch(showSearchOnTopBar());
  });

  useUnmount(() => {
    dispatch(hideSearchOnTopBar());
  });

  return <></>;
};

export default SearchOnTopBar;
