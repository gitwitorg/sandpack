import type { SandpackBundlerFiles } from "@codesandbox/sandpack-client";
import * as React from "react";

import type { SandpackOptions } from "../../types";

import { File } from "./File";
import { ModuleList } from "./ModuleList";

import type { SandpackFileExplorerProp } from ".";

export interface Props extends SandpackFileExplorerProp {
  prefixedPath: string;
  files: SandpackBundlerFiles;
  selectFile?: (path: string) => void;
  addFile?: (path: string) => void;
  deleteFile?: (path: string) => void;
  renameFile?: (path: string) => void;
  activeFile: NonNullable<SandpackOptions["activeFile"]>;
  depth: number;
  visibleFiles: NonNullable<SandpackOptions["visibleFiles"]>;
}

export const Directory: React.FC<Props> = ({
  prefixedPath,
  files,
  selectFile,
  addFile,
  deleteFile,
  renameFile,
  activeFile,
  depth,
  autoHiddenFiles,
  visibleFiles,
  initialCollapsedFolder,
}) => {
  const [open, setOpen] = React.useState(
    !initialCollapsedFolder?.includes(prefixedPath)
  );

  const toggle = (): void => setOpen((prev) => !prev);

  return (
    <div key={prefixedPath}>
      <File
        addFile={addFile}
        depth={depth}
        isDirOpen={open}
        onClick={toggle}
        path={prefixedPath + "/"}
      />

      {open && (
        <ModuleList
          activeFile={activeFile}
          addFile={addFile}
          autoHiddenFiles={autoHiddenFiles}
          deleteFile={deleteFile}
          depth={depth + 1}
          files={files}
          initialCollapsedFolder={initialCollapsedFolder}
          prefixedPath={prefixedPath}
          renameFile={renameFile}
          selectFile={selectFile}
          visibleFiles={visibleFiles}
        />
      )}
    </div>
  );
};
