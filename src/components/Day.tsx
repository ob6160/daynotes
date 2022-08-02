import { h, Fragment, FunctionComponent } from "preact";
import { useMemo } from "preact/hooks";
import "./Day.css";

interface Props {
  date: Date;
  tabIndex?: number;
}

const Title: FunctionComponent<{ date: Date }> = ({ date }) => {
  const dayPart = date.toLocaleString("en-gb", { weekday: "long" });
  const monthPart = date.toLocaleString("en-gb", {
    month: "long",
    day: "2-digit",
  });
  const yearPart = date.toLocaleString("en-gb", {
    year: "numeric",
  });

  return (
    <section>
      <h2>{dayPart}</h2>
      <p class="tagline">
        {monthPart} {yearPart}
      </p>
    </section>
  );
};

const Day: FunctionComponent<Props> = ({ date, tabIndex, children }) => {
  return (
    <li class="day">
      <section tabIndex={tabIndex}>
        <Title date={date} />
        {children}
      </section>
    </li>
  );
};

export default Day;
