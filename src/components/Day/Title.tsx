import { FunctionComponent } from 'preact';

type TitleProps = {
  date: Date;
};

const Title: FunctionComponent<TitleProps> = ({ date }) => {
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
    </section>
  );
};

export default Title;
