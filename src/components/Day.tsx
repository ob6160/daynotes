import { h, FunctionComponent } from "preact";
import { useCallback, useState } from "preact/hooks";
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
  // const entries = useMemo(() => {
  //   return [""];
  // }, []);

  const [inputCount, setInputCount] = useState([0]);

  const addNext = useCallback<h.JSX.KeyboardEventHandler<HTMLInputElement>>(
    (e) => {
      if (e.key === "Enter") {
        setInputCount((prev) => [...prev, 0]);
      }
    },
    []
  );

  return (
    <li class="day">
      <section>
        <Title date={date} />
        <section class="content">
          {inputCount.map(() => (
            <input
              class="note"
              placeholder="What's happening?"
              onKeyPress={addNext}
            />
          ))}
          {children}
        </section>
      </section>
    </li>
  );
};

export default Day;
