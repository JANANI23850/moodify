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

  // Custom styles for modern theme
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderColor: state.isFocused ? "rgba(102, 126, 234, 0.6)" : "rgba(102, 126, 234, 0.3)",
      borderRadius: "12px",
      minHeight: "44px",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(102, 126, 234, 0.1)" : "none",
      "&:hover": {
        borderColor: "rgba(102, 126, 234, 0.5)",
      },
    }),
    input: (provided) => ({
      ...provided,
      color: "#f8fafc",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      backdropFilter: "blur(20px)",
      borderRadius: "12px",
      border: "1px solid rgba(102, 126, 234, 0.3)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused 
        ? "rgba(102, 126, 234, 0.2)" 
        : state.isSelected 
        ? "rgba(102, 126, 234, 0.4)" 
        : "transparent",
      color: "#f8fafc",
      borderRadius: "8px",
      margin: "2px 4px",
      "&:hover": {
        backgroundColor: "rgba(102, 126, 234, 0.3)",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "rgba(102, 126, 234, 0.3)",
      borderRadius: "20px",
      border: "1px solid rgba(102, 126, 234, 0.5)",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#f8fafc",
      fontWeight: "500",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#f8fafc",
      "&:hover": {
        backgroundColor: "rgba(239, 68, 68, 0.3)",
        color: "#ffffff",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#94a3b8",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#f8fafc",
    }),
  };

  const totalSongs = languages.length * artists.length;
  const filteredCount = langFilter.length * artistFilter.length;

  return (
    <div className="filters-container">
      <div className="filters-header">
        <i className="fas fa-sliders-h filter-icon"></i>
        <h3>Smart Filters</h3>
      </div>

      <div className="filters-grid">
        {/* Number of Songs */}
        <div className="filter-section">
          <h4>
            <i className="fas fa-music section-icon"></i>
            Song Limit
          </h4>
          <div className="range-slider-container">
            <input
              type="range"
              min="1"
              max="50"
              value={numSongs}
              onChange={(e) => setNumSongs(Number(e.target.value))}
              className="range-slider"
            />
            <div className="range-value">
              <span>1</span>
              <span className="range-current">{numSongs} songs</span>
              <span>50</span>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="filter-section">
          <h4>
            <i className="fas fa-globe section-icon"></i>
            Languages ({langFilter.length}/{languages.length})
          </h4>
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="checkbox"
                checked={allLangsSelected}
                onChange={() => setAllLangsSelected(!allLangsSelected)}
              />
              <span>Select All Languages</span>
            </label>
            {!allLangsSelected && (
              <Select
                options={langOptions}
                value={langOptions.filter((l) => langFilter.includes(l.value))}
                onChange={(selected) =>
                  setLangFilter(selected ? selected.map((s) => s.value) : [])
                }
                isMulti
                placeholder="Choose languages..."
                styles={customStyles}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
              />
            )}
          </div>
        </div>

        {/* Artists */}
        <div className="filter-section">
          <h4>
            <i className="fas fa-microphone section-icon"></i>
            Artists ({artistFilter.length}/{artists.length})
          </h4>
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="checkbox"
                checked={allArtistsSelected}
                onChange={() => setAllArtistsSelected(!allArtistsSelected)}
              />
              <span>Select All Artists</span>
            </label>
            {!allArtistsSelected && (
              <Select
                options={artistOptions}
                value={artistOptions.filter((a) => artistFilter.includes(a.value))}
                onChange={(selected) =>
                  setArtistFilter(selected ? selected.map((s) => s.value) : [])
                }
                isMulti
                placeholder="Choose artists..."
                styles={customStyles}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
              />
            )}
          </div>
        </div>
      </div>

      <div className="filter-stats">
        <div className="stat-item">
          <i className="fas fa-filter"></i>
          <span>Showing <span className="stat-value">{Math.min(numSongs, filteredCount)}</span> of <span className="stat-value">{filteredCount}</span> filtered songs</span>
        </div>
        <div className="stat-item">
          <i className="fas fa-database"></i>
          <span>Total: <span className="stat-value">{totalSongs}</span> available</span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
