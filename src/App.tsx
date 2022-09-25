import { lazy, useState } from 'react';
import type { ListItem } from './components/VirtualList';
import { faker } from '@faker-js/faker'
import './app.css'

const VirtualList = lazy(() => import('./components/VirtualList'));

const createList = (): ListItem[] => {
  const result: ListItem[] = []
  let count = 0
  Array.from({ length: 1000 }).forEach(() => {
    result.push({
      content: faker.name.fullName(),
      key: count++
    })
  })
  return result
};

function App() {
  const [list] = useState(createList());

  return (
    <div className="App">
      <div className="notification">
        If it's not rendered properly in StackBlitz,
        <br/>
        just <strong>REFRESH</strong> !
      </div>
      <div className="mobile">
        <VirtualList list={list} itemHeight={50} />
      </div>
    </div>
  );
}

export default App;
