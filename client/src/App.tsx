import { BoardHeader } from "./components/BoardHeader/BoardHeader";
import { BoardColumn } from "./components/BoardColumn/BoardColumn";
import { NewCardForm } from "./components/NewCardForm/NewCardForm";
import type { Card } from "./types/card";
import styles from "./App.module.css";

const cards: Card[] = [{
  id: '1',
  title: 'Изучить материалы Темы 1',
  isDone: false
},
{
  id: '2',
  title: 'Выполнить задания семинара',
  isDone: false
},
{
  id: '3',
  title: 'Прочитать конспект лекции',
  isDone: true
},
{
  id: '4',
  title: 'Настроить окружение',
  isDone: true
}];

function App() {
  return (
    <div className={styles.app}>
      <BoardHeader />
      <main className={styles.board}>
        <NewCardForm />
        <div className={styles.columns}>
          <BoardColumn cards={cards} />
        </div>
      </main>
    </div>
  );
}

export default App;
