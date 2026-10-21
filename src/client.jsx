import { hydrateRoot } from 'react-dom/client';
import { App } from './App.jsx';

const root = document.getElementById('root');
hydrateRoot(root, <App page={root.dataset.page}/>);
