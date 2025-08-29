// "use client"

// import React, { useState, useMemo, useEffect } from "react";

// import Select from "react-select";
// import Fuse from "fuse.js";
// import debounce from "lodash.debounce";

// const SymbolAutocomplete = ({ symbolData = [], onChange }) => {
//   const [options, setOptions] = useState([]);

//   // Memoize Fuse instance
//   const fuse = useMemo(() => {
//     if (!Array.isArray(symbolData) || symbolData.length === 0) return null;

//     return new Fuse(symbolData, {
//       keys: ["symbol", "name"],
//       threshold: 0.3,
//     });
//   }, [symbolData]);

//   // Search and format results
//   const searchOptions = (input) => {
//     if (!input || !fuse) {
//       setOptions([]);
//       return;
//     }

//     const results = fuse.search(input).slice(0, 50); // Limit for performance

//     const formatted = results.map(({ item }) => ({
//       label: `${item.symbol} - ${item.name}`,
//       value: item.symbol,
//       data: item,
//     }));

//     setOptions(formatted);
//   };

//   // Debounced search (avoids triggering search on every keystroke)
//   const debouncedSearch = useMemo(
//     () => debounce(searchOptions, 300),
//     [fuse]
//   );

//   // Clean up debounce on unmount
//   useEffect(() => {
//     return () => {
//       debouncedSearch.cancel();
//     };
//   }, [debouncedSearch]);

//   return (
//     <Select
//       placeholder="Search symbol..."
//       options={options}
//       onInputChange={(val, { action }) => {
//         if (action === "input-change") debouncedSearch(val);
//       }}
//       onChange={(selected) => onChange(selected ? selected.data : null)}
//       isClearable
//       isSearchable
//     />
//   );
// };

// export default SymbolAutocomplete;




"use client";

import React, { useState, useMemo, useEffect } from "react";
import Select from "react-select";
import Fuse from "fuse.js";
import debounce from "lodash.debounce";
import { Box, Text } from "@chakra-ui/react";

const SymbolAutocomplete = ({ symbolData = [], value, onChange }) => {
  const [options, setOptions] = useState([]);

  // Fuse instance for fuzzy search
  const fuse = useMemo(() => {
    if (!Array.isArray(symbolData) || symbolData.length === 0) return null;

    return new Fuse(symbolData, {
      keys: ["symbol", "name"],
      threshold: 0.3,
    });
  }, [symbolData]);

  // Search and format options
  const searchOptions = (input) => {
    if (!input || !fuse) {
      setOptions([]);
      return;
    }

    const results = fuse.search(input).slice(0, 50);

    const formatted = results.map(({ item }) => ({
      label: `${item.symbol} - ${item.name || ""}`,
      value: item.symbol,
      data: item,
    }));

    setOptions(formatted);
  };

  // Debounced version of search
  const debouncedSearch = useMemo(() => debounce(searchOptions, 300), [fuse]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Get current selected option
  const selectedOption = useMemo(() => {
    if (!value || typeof value !== "object" || !value.symbol) return null;

    return {
      label: `${value.symbol} - ${value.name || ""}`,
      value: value.symbol,
      data: value,
    };
  }, [value]);

  return (
    <Box my={4}>
        <Text fontFamily='onest'>Symbol</Text>
        <Select 
            placeholder="Search symbol..."
            value={selectedOption}
            options={options}
            onInputChange={(val, { action }) => {
                if (action === "input-change") debouncedSearch(val);
            }}
            onChange={(selected) => onChange(selected ? selected.data : null)}
            isClearable
            isSearchable
        />

    </Box>
  );
};

export default SymbolAutocomplete;
