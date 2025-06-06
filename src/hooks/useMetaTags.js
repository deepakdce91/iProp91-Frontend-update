import { useEffect } from "react";

const useMetaTags = ({ title, description, favicon }) => {
  useEffect(() => {
    // Set the document title
    document.title = title;

    // Set or update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Set or update favicon
    if (favicon) {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = favicon;
    }

    // Cleanup logic (optional: remove only meta if you don't want to unset favicon)
    return () => {
      if (metaDescription) {
        metaDescription.remove();
      }
    };
  }, [title, description, favicon]);
};

export default useMetaTags;
