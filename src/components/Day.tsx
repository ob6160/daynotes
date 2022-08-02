import { h, Fragment, FunctionComponent } from "preact";
import { useMemo } from "preact/hooks";
import "./Day.css";

interface Props {
  date: Date;
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
    <section class="title">
      <section>
        <h2>{dayPart}</h2>
        <p class="day-tagline">
          {monthPart} {yearPart}
        </p>
      </section>
      <section class="mood"></section>
    </section>
  );
};

const Day: FunctionComponent<Props> = ({ date, children }) => {
  return (
    <li class="day">
      <section>
        <Title date={date} />
        <section class="day-content">{children}</section>
      </section>
    </li>
  );
};

export default Day;
