import { useEffect } from "react";

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <title>{title}</title>;
};

export default usePageTitle;
