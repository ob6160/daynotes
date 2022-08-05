import 'preact/debug';
import { FunctionalComponent } from 'preact';
import { useState } from 'preact/hooks';
import Day from './Day';
import './Timeline.scss';
import { TimelineData, TimelineStore } from '../lib/timelineStore';

const Timeline: FunctionalComponent = () => {
  const timelineContext = new Map([[new Date(), { notes: {} }]]);
  const state = useState<TimelineData>(timelineContext);
  const timeline = Array.from(state[0].keys()).map((date) => (
    <Day date={date} />
  ));

  return (
    <TimelineStore.Provider value={state}>
      <section class="timeline">
        <ul class="link-card-grid">{timeline}</ul>
      </section>
    </TimelineStore.Provider>
  );
};

export default Timeline;
