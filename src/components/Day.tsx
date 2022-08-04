import { h, Fragment, FunctionComponent } from "preact";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import "./Day.scss";

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
        <p class="tagline">{`${monthPart} ${yearPart}`}</p>
      </section>
      <section class="mood"></section>
    </section>
  );
};

const Day: FunctionComponent<Props> = ({ date, children }) => {
  const entries = useMemo(() => {
    return [""];
  }, []);

  const [inputCount, setInputCount] = useState([0]);

  const addNext = useCallback(() => {}, []);

  return (
    <li class="day">
      <section>
        <Title date={date} />
        <section class="content">
          {inputCount.map(() => {
            return <input class="note" placeholder="What's happening?" />;
          })}
          {children}
        </section>
      </section>
    </li>
  );
};

export default Day;
