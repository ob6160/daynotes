import { h, Fragment, FunctionComponent } from "preact";
import "./Day.css";

interface Props {
  title: string;
  body: string;
}

const Day: FunctionComponent<Props> = ({ title, body }) => (
  <li class="link-day">
    <section>
      <h2>{title}</h2>
      <p>{body}</p>
    </section>
  </li>
);

export default Day;
