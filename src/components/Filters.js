import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./Filters.css";

const Filters = ({
  languages,
  artists,
  langFilter,
  setLangFilter,
  artistFilter,
  setArtistFilter,
  numSongs,
  setNumSongs,
}) => {
  const [allLangsSelected, setAllLangsSelected] = useState(true);
  const [allArtistsSelected, setAllArtistsSelected] = useState(true);

  useEffect(() => {
    setLangFilter(allLangsSelected ? [...languages] : []);
  }, [allLangsSelected, languages, setLangFilter]);

  useEffect(() => {
    setArtistFilter(allArtistsSelected ? [...artists] : []);
  }, [allArtistsSelected, artists, setArtistFilter]);

  const langOptions = languages.map((l) => ({ value: l, label: l }));
  const artistOptions = artists.map((a) => ({ value: a, label: a }));

  // Custom styles for dark theme
  const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderColor: "#00f2fe",
  }),
  input: (provided) => ({
    ...provided,
    color: "#fff",   // <-- Makes typed text white
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#1a1a1a",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#00f2fe33" : "#1a1a1a",
    color: "#fff",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#2b9da366",
    color: "#cfc7c7ff",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#fff",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#aaa",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#fff",
  }),
};


  return (
    <div className="filters-container">
      <h3>🎛 Filters</h3>

      {/* Number of Songs */}
      <div className="filter-section">
        <label>Number of Songs: {numSongs}</label>
        <input
          type="range"
          min="1"
          max="50"
          value={numSongs}
          onChange={(e) => setNumSongs(Number(e.target.value))}
          className="range-slider"
        />
      </div>

      {/* Languages */}
      <div className="filter-section">
        <label>Languages</label>
        <div className="filter-options">
          <label>
            <input
              type="checkbox"
              checked={allLangsSelected}
              onChange={() => setAllLangsSelected(!allLangsSelected)}
            />{" "}
            Select All Languages
          </label>
          {!allLangsSelected && (
            <Select
              options={langOptions}
              value={langOptions.filter((l) => langFilter.includes(l.value))}
              onChange={(selected) =>
                setLangFilter(selected.map((s) => s.value))
              }
              isMulti
              placeholder="Select languages..."
              styles={customStyles}
            />
          )}
        </div>
      </div>

      {/* Artists */}
      <div className="filter-section">
        <label>Artists</label>
        <div className="filter-options">
          <label>
            <input
              type="checkbox"
              checked={allArtistsSelected}
              onChange={() => setAllArtistsSelected(!allArtistsSelected)}
            />{" "}
            Select All Artists
          </label>
          {!allArtistsSelected && (
            <Select
              options={artistOptions}
              value={artistOptions.filter((a) => artistFilter.includes(a.value))}
              onChange={(selected) =>
                setArtistFilter(selected.map((s) => s.value))
              }
              isMulti
              placeholder="Select artists..."
              styles={customStyles}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;
