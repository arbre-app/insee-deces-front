import { Book } from 'react-bootstrap-icons';

export function Header() {
  return (
    <div className="text-center pt-4">
      <h1>
        <Book className="icon" />
      </h1>
      <h4>Fichier des décès de l'Insee</h4>
    </div>
  );
}
