import { FunctionComponent } from 'preact';

type TitleProps = {
  date: number;
};

const Title: FunctionComponent<TitleProps> = ({ date }) => {
  const castedDate = new Date(date);
  const dayPart = castedDate.toLocaleString('en-gb', { weekday: 'long' });
  const monthPart = castedDate.toLocaleString('en-gb', {
    month: 'long',
    day: '2-digit',
  });
  const yearPart = castedDate.toLocaleString('en-gb', {
    year: 'numeric',
  });

  return (
    <section class="title">
      <section>
        <h2>{dayPart}</h2>
        <p class="tagline">{`${monthPart} ${yearPart}`}</p>
      </section>
    </section>
  );
};

export default Title;
