import { FunctionComponent } from 'preact';
import './Day.scss';

interface Props {
  date: Date;
}

const Title: FunctionComponent<{ date: Date }> = ({ date }) => {
  const dayPart = date.toLocaleString('en-gb', { weekday: 'long' });
  const monthPart = date.toLocaleString('en-gb', {
    month: 'long',
    day: '2-digit',
  });
  const yearPart = date.toLocaleString('en-gb', {
    year: 'numeric',
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
  const inputCount = [0];
  return (
    <li class="day">
      <section>
        <Title date={date} />
        <section class="content">
          {inputCount.map(() => (
            <textarea
              class="note"
              placeholder="Write in me!"
            />
          ))}
          {children}
        </section>
        <section class="controls">
          <button class="action"></button>
          <button class="action">Image</button>
          <button class="action">Link</button>
          <button class="action">Book</button>
          <button class="action">Music</button>
        </section>
      </section>
    </li>
  );
};

export default Day;
