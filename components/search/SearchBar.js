import { useEffect } from "react";
import SearchIcon from "../../resources/icons/SearchIcon";
import useDebounceInput from "../../hooks/useDebounceInput";
import styles from "./SearchBar.module.css";

const SearchBar = ({ handleInput, handleSearch }) => {
  const [searchTerm, searchInput] = useDebounceInput(
    "text",
    "Type your search or video URL...",
    handleInput
  );

  useEffect(() => handleSearch(searchTerm), [searchTerm]);

  return (
    <div className={styles.searchBar}>
      <SearchIcon className={styles.searchIcon} color="#fff" />
      {searchInput}
    </div>
  );
};

export default SearchBar;
