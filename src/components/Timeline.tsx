import 'preact/debug';
import { FunctionalComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import Day from './Day/Day';
import {
  Day as DayType,
  Mood,
  TimelineData,
  TimelineStore,
} from '../lib/timelineStore';
import './Timeline.scss';

const getPersistedState = () => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const localStorageState = window.localStorage.getItem('state');
    return JSON.parse(localStorageState, mapReviver);
  } catch {
    console.log('Problem parsing localStorage state');
  }
};

const mapReplacer = (key, value) => {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  }
  return value;
};

const mapReviver = (key, value) => {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
};

// Returns the timestamp for the start of a given day.
const dateToEpoch = (date: Date) => {
  return date.setHours(0, 0, 0, 0).valueOf();
};

const getDaysIncludingFirstEntry = (timeline: TimelineData) => {
  const oneDayInMs = 1000 * 60 * 60 * 24;
  const today = dateToEpoch(new Date());

  const storedDayTimestamps = Array.from(timeline.keys());
  const earliestStoredDay = Math.min(...storedDayTimestamps);

  const daysIncludingFirstEntry = [];
  for (
    let currentDay = earliestStoredDay;
    currentDay <= today;
    currentDay += oneDayInMs
  ) {
    daysIncludingFirstEntry.push(currentDay);
  }

  return daysIncludingFirstEntry.sort((a, b) => b - a);
};

const clearLocalStorage = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.clear();
  }
};

const Timeline: FunctionalComponent = () => {
  const initialTimelineState =
    getPersistedState() ??
    new Map([
      [
        dateToEpoch(new Date()),
        {
          notes: {},
          books: {},
          links: {},
          pictures: {},
          songs: {},
          mood: 'neutral' as Mood,
        } as DayType,
      ],
    ]);

  const state = useState<TimelineData>(initialTimelineState);

  // Fill in the gaps, so we render all the days — even if there are no entries.
  const daysToRender = getDaysIncludingFirstEntry(state[0]);

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
        window.localStorage.setItem(
          'state',
          JSON.stringify(state[0], mapReplacer),
        );
      }
    },
    [state],
  );

  return (
    <TimelineStore.Provider value={state}>
      <section class="timeline">
        <button onClick={clearLocalStorage}>Reset</button>
        <ul class="link-card-grid">{timeline}</ul>
      </section>
    </TimelineStore.Provider>
  );
};

export default Timeline;
