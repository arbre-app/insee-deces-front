import { Form, Table } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { toJsDate } from 'read-gedcom';
import { useGedcomContext } from '../state/gedcom';
import { SmallPagination } from './SmallPagination';

const placeholder = '?';


export function BlockGedcomMatches() {
  const intl = useIntl();
  const { state: { gedcom, data }, dispatch } = useGedcomContext();

  const displayDate = dateGedcom => {
    const dateParsed = dateGedcom.valueAsDate()[0];
    const rawValue = dateGedcom.value()[0];
    const rawValueOrPlaceholder = rawValue ? rawValue : placeholder;
    const displayDatePart = datePart => {
      const jsDate = toJsDate(datePart);
      const hasMonth = datePart.month != null, hasDay = datePart.day != null;
      return intl.formatDate(jsDate, { year: 'numeric', month: hasMonth ? 'numeric' : undefined, day: hasDay ? 'numeric' : undefined, timeZone: 'UTC' });
    };
    if (dateParsed) {
      if(dateParsed.hasDate) {
        if(dateParsed.isDatePunctual) {
          const date = dateParsed.date;
          if(dateParsed.isDateApproximated) {
            return `~ ${displayDatePart(date)}`;
          } else {
            return displayDatePart(date); // Exact or interpreted
          }
        } else if(dateParsed.isDateRange) {
          return [['>', dateParsed.dateAfter], ['<', dateParsed.dateBefore]]
            .filter(([s, d]) => d).map(([s, d]) => `${s} ${displayDatePart(d)}`).join(', ');
        } else {
          return rawValueOrPlaceholder; // Period (we don't bother about that)
        }
      } else {
        return rawValueOrPlaceholder; // We don't bother about the rest either
      }
    } else {
      return rawValueOrPlaceholder;
    }
  };

  const GedcomEvent = ({ event, interval }) => {
    const date = event.getDate();
    const formatIntervalDate = date => date !== null ? intl.formatDate(date, { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' }) : placeholder;
    return (
      <>
        {displayDate(date)}
        <br />
        [
        {formatIntervalDate(interval[0])}, {formatIntervalDate(interval[1])}
        ]
        <br />
        {event.getPlace().value()[0] || placeholder}
      </>
    );
  };

  return !!data && (
    <div className="block mt-2">
      <Table striped bordered hover responsive className="text-center">
        <thead>
        <tr>
          <th>Individu</th>
          <th>Naissance</th>
          <th>Décès</th>
          <th>Inclure</th>
        </tr>
        </thead>
        <tbody>
        {data.candidates.slice(0, 1000).map(id => {
          const individual = gedcom.getIndividualRecord(id);
          const nameParts = individual.getName().valueAsParts()[0];
          const individualIntervals = data.intervals[individual.pointer()[0]];
          return (
            <tr key={id}>
              <td className="align-middle">
                {nameParts && nameParts.reverse().filter(p => p).join(' ')}
                <br />
                <span className="text-monospace">{id}</span>
              </td>
              <td><GedcomEvent event={individual.getEventBirth()} interval={individualIntervals.birth} /></td>
              <td><GedcomEvent event={individual.getEventDeath()} interval={individualIntervals.death} /></td>
              <td className="align-middle">
                <Form.Check type="checkbox" />
              </td>
            </tr>
          );
        })}

        </tbody>
      </Table>
      <SmallPagination currentPage={2} onChange={() => true} totalPages={10} disabled={false} className="justify-content-center mb-0" />
    </div>
  );
}
