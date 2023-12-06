import * as React from "react";
import { useState, useEffect, useRef } from "react";

import { css } from "../../styles";
import { buttonClassName } from "../../styles/shared";
import { useClassNames } from "../../utils/classNames";
import {
  DirectoryIconOpen,
  DirectoryIconClosed,
  FileIcon,
  ThreeDotsIcon,
} from "../icons";

import { ContextMenu } from "./ContextMenu";

const explorerClassName = css({
  borderRadius: "0",
  width: "100%",
  padding: 0,
  marginBottom: "$space$2",

  span: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },

  svg: {
    marginRight: "$space$1",
  },
});

export interface Props {
  path: string;
  selectFile?: (path: string) => void;
  addFile?: (path: string) => void;
  deleteFile?: (path: string) => void;
  renameFile?: (path: string) => void;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  depth: number;
  isDirOpen?: boolean;
}

export const File: React.FC<Props> = ({
  selectFile,
  addFile,
  deleteFile,
  renameFile,
  path,
  active,
  onClick,
  depth,
  isDirOpen,
}) => {
  const classNames = useClassNames();
  const onClickButton = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (selectFile) {
      selectFile(path);
    }

    onClick?.(event);
  };
  const [isHovered, setIsHovered] = React.useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = React.useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const fileName = path.split("/").filter(Boolean).pop();

  const getIcon = (): JSX.Element => {
    if (selectFile) return <FileIcon />;

    return isDirOpen ? <DirectoryIconOpen /> : <DirectoryIconClosed />;
  };

  // Toggle the context menu
  const toggleContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const parent = containerRef.current;
    if (!parent) return;
    // This function finds the file explorer container.
    const findParentWithClassName = (element: HTMLElement): HTMLElement | null => {
      while ((element = element.parentElement as HTMLElement) && !element.className);
      return element || null;
    };
    const rect = findParentWithClassName(parent)?.getBoundingClientRect();
    if (!rect) return;
    setMenuPosition({ top: e.clientY - rect.top, left: e.clientX - rect.left });
    setIsContextMenuVisible(!isContextMenuVisible);
  };

  // Close the context menu when the user clicks outside this component
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isContextMenuVisible &&
        !containerRef.current?.contains(e.target as Node)
      ) {
        setIsContextMenuVisible(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    window.addEventListener("contextmenu", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("contextmenu", handleClickOutside);
    };
  }, [isContextMenuVisible]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Add the context menu items when available
  const items = [];
  if (renameFile) items.push({ label: "Rename", action: () => renameFile?.(path) });
  if (deleteFile) items.push({ label: "Delete", action: () => deleteFile?.(path) });
  if (addFile) items.push({ label: "New file", action: () => addFile?.(path) });

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
      }}
    >
      <button
        className={classNames("button", [
          classNames("explorer"),
          buttonClassName,
          explorerClassName,
        ])}
        data-active={active}
        onClick={onClickButton}
        onContextMenu={(e) => {
          e.preventDefault();
          toggleContextMenu(e);
        }}
        style={{ paddingLeft: 18 * depth + "px", flex: 1 }}
        title={fileName}
        type="button"
      >
        {getIcon()}
        <span>{fileName}</span>
      </button>
      {items.length ? (<button
        className={classNames("button", [
          classNames("explorer"),
          buttonClassName,
        ])}
        onClick={toggleContextMenu}
        style={isHovered ? { display: "block" } : { display: "none" }}
      >
        <ThreeDotsIcon />
      </button>) : null}
      {isContextMenuVisible && (
        <ContextMenu items={items} menuPosition={menuPosition} />
      )}
    </div>
  );
};
