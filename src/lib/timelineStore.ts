import { createContext } from 'preact';
import { StateUpdater } from 'preact/hooks';

export type Note = {
  title?: string;
  content?: string;
  complete: boolean;
};

export type Picture = {
  title?: string;
  url: string;
  complete: boolean;
};

export type Link = {
  title?: string;
  url: string;
  complete: boolean;
};

export type Song = {
  title: string;
  url: string;
  complete: boolean;
};

export type Book = {
  title: string;
  complete: boolean;
};

export type Mood = 'great' | 'bad' | 'neutral';

export type EntryType = 'notes' | 'pictures' | 'links' | 'songs' | 'books';

export type Day = {
  mood: Mood;
  notes: { [id: string]: Note };
  links: { [id: string]: Link };
  songs: { [id: string]: Song };
  pictures: { [id: string]: Picture };
  books: { [id: string]: Book };
};

export type TimelineData = Map<number, Day>;

export const TimelineStore =
  createContext<[TimelineData, StateUpdater<TimelineData>]>(null);
