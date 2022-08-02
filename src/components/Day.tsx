import { h, Fragment, FunctionComponent } from "preact";
import "./Day.css";

interface Props {
  title: string;
  body: string;
  tabIndex?: number;
}

const Day: FunctionComponent<Props> = ({ title, body, tabIndex }) => (
  <li class="link-day">
    <section tabIndex={tabIndex}>
      <h2>{title}</h2>
      <p>{body}</p>
    </section>
  </li>
);

export default Day;
