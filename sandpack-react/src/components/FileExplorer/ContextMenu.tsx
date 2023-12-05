import React, { useState } from "react";
import type { CSSProperties } from "react";

interface ContextMenuProps {
    menuPosition: { top: number; left: number };
    items: Array<{ label: string; action: () => void }>;
};

export const ContextMenu: React.FC<ContextMenuProps> = ({ menuPosition, items }) => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

const contextMenuStyles: CSSProperties = {
    position: "absolute",
    top: menuPosition.top + "px",
    left: menuPosition.left + "px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    boxShadow: "2px 2px 2px #dddddd33",
    borderRadius: "5px",
    listStyle: "none",
    padding: "0",
    margin: "0",
    zIndex: 10,
  };

  const menuItemStyles: CSSProperties = {
    padding: "10px",
    cursor: "pointer",
  };

  // Estimate the width of the widest item in the menu
  const maxWidth = Math.max(...items.map(item => item.label.length * 15)); // Adjust the factor 10 as needed

  contextMenuStyles.width = `${maxWidth}px`; // Set the width of the context menu

  return (
    <div>
      <div style={contextMenuStyles}>
        {items.map((item, index) => (
          <div
            key={index}
            onClick={item.action}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
                ...menuItemStyles,
                backgroundColor: hoveredItem === index ? "#f8f8f8" : "transparent",
              }}
            >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};
