import { useParams } from 'react-router-dom';


type RoomParams = {
  id: string;
}

export function Room() {
  const params = useParams<RoomParams>();
  
  return (
    <div>
      <h1>Sala {params.id}</h1>
    </div>
  );
}