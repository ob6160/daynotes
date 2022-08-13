import { FunctionalComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import Day from './Day/Day';
import {
  getDaysIncludingFirstEntry,
  getInitialTimelineState,
  mapReplacer,
  TimelineData,
  TimelineStore,
} from '../lib/timelineStore';
import './Timeline.scss';
import { atom } from 'nanostores';
import { useStore } from '@nanostores/preact';

type TimelineProps = {
  backupMode?: boolean;
};

const timelineState = atom<TimelineData>(getInitialTimelineState());

const Timeline: FunctionalComponent<TimelineProps> = () => {
  const $timelineState = useStore(timelineState);
  const stateAsString = JSON.stringify($timelineState, mapReplacer);

  // Fill in the gaps, so we render all the days — even if there are no entries.
  const daysToRender = getDaysIncludingFirstEntry($timelineState);

  const timeline = daysToRender.map((date) => (
    <Day
      key={date}
      date={date}
    />
  ));

  useEffect(
    // eslint-disable-next-line prefer-arrow-callback
    function updateStore() {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('state', stateAsString);
      }
    },
    [stateAsString],
  );

  return (
    <TimelineStore.Provider value={timelineState}>
      <section class="timeline">
        <ul class="link-card-grid">{timeline}</ul>
      </section>
    </TimelineStore.Provider>
  );
};

export default Timeline;
