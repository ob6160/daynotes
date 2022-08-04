import { h, Fragment } from "preact";
import { useState } from "preact/hooks";
import Day from "./Day";

const getDaysArray = (start: Date, end: Date) => {
  const days: Date[] = [];
  for (
    let dt = new Date(end);
    dt >= new Date(start);
    dt.setDate(dt.getDate() - 1)
  ) {
    days.push(new Date(dt));
  }
  return days;
};

const Timeline = () => {
  const sevenDaysAgo: Date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const currentWeek = getDaysArray(sevenDaysAgo, new Date());

  return (
    <>
      {currentWeek.map((date) => {
        return <Day date={date}></Day>;
      })}
    </>
  );
};
export default Timeline;
