import { h, Fragment } from "preact";
import { useState } from "preact/hooks";
import Day from "./Day";

const Timeline = () => {
  const [days, setDays] = useState([]);
  return (
    <>
      <button
        onClick={() => {
          console.log("hi");
          setDays([...days, 1]);
        }}
      >
        Add day
      </button>
      {days.map((day, index) => (
        <Day tabIndex={index + 1} title="2nd August 2022" body="..." />
      ))}
    </>
  );
};
export default Timeline;
