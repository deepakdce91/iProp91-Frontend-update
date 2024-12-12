import React, { useState } from "react";

import { Calculator } from "./calculator.jsx";
import { Features } from "./features.jsx";
import { Hero } from "./hero.jsx";

const Lend = () => {
  

  return (
    <main className="min-h-screen bg-white">
    <Hero />
    <Calculator />
    <Features />
  </main>
  );
};

export default Lend;
