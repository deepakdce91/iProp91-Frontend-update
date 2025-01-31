import * as React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ShowDrafts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/advise/fetchAllActiveAdvise`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching drafts:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'blob'
      });

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <section className="relative bg-white py-20 px-3">
      <h2 className="text-4xl font-bold mb-8 text-center">Download Draft Agreements</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {data.map((agreement, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: idx * 0.1 },
            }}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-4 flex flex-col items-center text-center hover:border-b-[2px] hover:border-b-gold hover:shadow-md hover:shadow-gold transition-colors group border-[1px] border-black/20"
          >
            <h3 className="text-sm font-semibold mb-2">{agreement.title}</h3>
            <p className="text-xs text-black mb-4">{agreement.subtitle}</p>
            <button 
              onClick={() => handleDownload(agreement.file.url, agreement.file.name)}
              className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors"
            >
              <Download className="h-5 w-5" />
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}