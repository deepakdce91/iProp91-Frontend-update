import React, { useEffect } from "react";
import { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
 
const accordion = [
    {
        title: "What is Material Tailwind?",
        content:
        "We're not always in the position that we want to be at. We're constantly growing. We're constantly making mistakes. We're constantly trying to express ourselves and actualize our dreams.",
    },
    {
        title: "How to use Material Tailwind?",
        content:
        "We're not always in the position that we want to be at. We're constantly growing. We're constantly making mistakes. We're constantly trying to express ourselves and actualize our dreams.",
    },
    {
        title: "What can I do with Material Tailwind?",
        content:
        "We're not always in the position that we want to be at. We're constantly growing. We're constantly making mistakes. We're constantly trying to express ourselves and actualize our dreams.",
    },
]
export  default function AccordionCustomStyles() {
  const [open, setOpen] = React.useState(1);
 
  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const [caselaws, setCaselaws] = useState([]);

  const fetchCaselaws = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/caselaws/fetchallcaselaws`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
      });

      const parseRes = await response.json();
      setCaselaws(parseRes);
      console.log(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  }
 
  useEffect(() => {
    fetchCaselaws();
  } , []);  
  return (
    <>
   
          <div className="w-11/12 mx-auto mt-32">
                <div className="my-2">
                    <h1 className="text-xl font-[500]">Case Laws</h1>
                </div>
              {caselaws.map((item, index) => (
                  <Accordion
                      key={index}
                      open={open === index + 1}
                      className="mb-2 rounded-lg border border-blue-gray-100 px-4"
                  >
                      <AccordionHeader
                          onClick={() => handleOpen(index + 1)}
                          className={`border-b-0  text-sm  ${open === index + 1 ? " " : ""
                              }  font-[500]`}
                      >
                          {item.question}
                      </AccordionHeader>
                      <AccordionBody className="pt-0  ">
                        <div className="text-xs text-primary hover:!underline hover:cursor-pointer">
                              <Link to={item.answerlink}>
                                   {item.answer}
                                </Link>
                        </div>
                      </AccordionBody>
                  </Accordion>
              ))}
          </div>
    </>
  );
}