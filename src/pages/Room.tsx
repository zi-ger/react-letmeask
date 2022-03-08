import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import logoImg from '../assets/images/logo.svg';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function Room() {
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const  { user } = useAuth();

  const [newQuestion, setNewQuestion] = useState('');
  
  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('User not logged in.'); 
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHiglighted: false,
      isAnswered: false
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  }

  return (
    <div className="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="letmeask" />
          <RoomCode code={roomId ?? 'undefined'} />
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala React</h1>
          <span>4 perguntas</span>
        </div>
        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}  
          />
          <div className="form-footer">
            { user ?
                <div className='user-info'>
                  <img src={user.avatar} alt={user.name} />
                  <span>{user.name}</span>
                </div>
              :
                
                <span>Para enviar uma pergunta <button>faça o seu login</button>.</span>
              }
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  );
}