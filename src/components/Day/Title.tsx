import { FunctionComponent } from 'preact';
import { useCallback, useContext, useMemo } from 'preact/hooks';
import { TimelineStore } from '../../lib/timelineStore';

import './Title.scss';

type TitleProps = {
  date: number;
};

const Title: FunctionComponent<TitleProps> = ({ date }) => {
  const [timeline, setTimeline] = useContext(TimelineStore);
  const day = timeline.get(date);

  const isCollapsed = useMemo(() => day?.collapsed, [day]);

  const castedDate = new Date(date);
  const dayPart = castedDate.toLocaleString('en-gb', { weekday: 'long' });
  const monthPart = castedDate.toLocaleString('en-gb', {
    month: 'long',
    day: '2-digit',
  });
  const yearPart = castedDate.toLocaleString('en-gb', {
    year: 'numeric',
  });

  const setDayCollapsed = useCallback(
    (isCollapsed: boolean) => {
      setTimeline(
        new Map(
          timeline.set(date, {
            ...day,
            collapsed: isCollapsed,
          }),
        ),
      );
    },
    [date, day, setTimeline, timeline],
  );

  return (
    <section class="title">
      <section>
        <h2>{dayPart}</h2>
        <p class="tagline">{`${monthPart} ${yearPart}`}</p>
      </section>
      <button
        class="collapse"
        onClick={() => setDayCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <i class="fa-solid fa-arrow-up" />
        ) : (
          <i class="fa-solid fa-arrow-down" />
        )}
      </button>
    </section>
  );
};

export default Title;
