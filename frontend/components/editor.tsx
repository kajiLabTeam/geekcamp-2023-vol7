import { useState } from "react";
import EditFrame from "./editframe";

const MdEditor = () => {
  const [markdown, setMarkdown] = useState<string | undefined>();

  return (
    <div>
      <EditFrame />
    </div>
  );
};

export default MdEditor;
