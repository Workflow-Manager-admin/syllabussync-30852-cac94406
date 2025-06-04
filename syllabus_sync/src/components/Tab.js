import React from "react";

/**
 * Single tab utility component for ResultsTabs.
 */
// PUBLIC_INTERFACE
function Tab({ label, isActive, onClick }) {
  return (
    <button
      className={isActive ? "active tab" : "tab"}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

export default Tab;
