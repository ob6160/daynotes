import { FunctionComponent } from 'preact';
import { useContext, useCallback } from 'preact/hooks';
import { TimelineStore } from '../../../lib/timelineStore';

type LinkProps = {
  id: string;
  date: number;
  title?: string;
  url?: string;
};

const Link: FunctionComponent<LinkProps> = ({ url, id, date, title }) => {
  const [timeline, setTimeline] = useContext(TimelineStore);
  const day = timeline.get(date);

  const removeNote = useCallback(() => {
    // Filter the note out of the id list.
    const filteredIds = Object.keys(day.links).filter(
      (linkId) => linkId !== id,
    );

    // Construct a new object with the remaining ids.
    const finalLinks = Object.fromEntries(
      filteredIds.map((linkId) => [linkId, day.links[linkId]]),
    );

    setTimeline(
      new Map(
        timeline.set(date, {
          ...day,
          links: finalLinks,
        }),
      ),
    );
  }, [day, setTimeline, timeline, date, id]);

  return (
    <section class="note">
      <input
        placeholder="Title"
        value={title}
      />
      <input
        placeholder="https://google.com/"
        value={url}
      />
      <button class="approve">
        <i class="fa-solid fa-check" />
      </button>
      <button
        class="clear"
        onClick={removeNote}
      >
        <i class="fa-solid fa-close" />
      </button>
    </section>
  );
};

export default Link;
