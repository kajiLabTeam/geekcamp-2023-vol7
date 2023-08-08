import LoadLogo from "@/components/loadlogo";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";

export default function EditPage() {
  const Editor = dynamic(
    () => {
      const r = import("@/components/editor");
      return r;
    },
    { loading: () => <LoadLogo />, ssr: false }
  );

  return <Editor />;
}
