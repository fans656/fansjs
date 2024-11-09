import { docs } from 'src/doc';

export default function App() {
  return (
    <div>
      {Object.values(docs).map(doc => (
        <p key={doc.name}>{doc.title}</p>
      ))}
    </div>
  );
}
