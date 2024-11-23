import * as React from "react";
import { motion,  } from "framer-motion";
import {  Download, X } from "lucide-react";

const draftAgreements = Array(8).fill({
  title: "DRAFT AGREEMENTS",
  subtitle: "iProp 91- Residential lease agreement",
});

export default function ShowDrafts({  }) {
  return (
    <section
      className="relative bg-white py-20"
    >
      
      <h2 className="text-4xl font-bold mb-8 text-center">Download Draft Agreements</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {draftAgreements.map((agreement, idx) => (
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
            <button className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <Download className="h-5 w-5" />
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}