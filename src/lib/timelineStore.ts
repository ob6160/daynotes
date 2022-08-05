import { createContext } from 'preact';
import { StateUpdater } from 'preact/hooks';

export type Note = {
  title?: string;
  content?: string;
};
export type Day = {
  notes: Note[];
};

export type TimelineData = Map<Date, Day>;

export const TimelineStore =
  createContext<[TimelineData, StateUpdater<TimelineData>]>(null);
