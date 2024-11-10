import { spawn } from 'child_process';
import { ports } from './src/ports';

export default async function() {
  const server = spawn('npm', ['run', 'dev'], { stdio: ['inherit', 'ignore', 'ignore'] });

  for (let i = 0; i < 5; ++i) {
    try {
      const res = await fetch(`http://localhost:${ports.fansjs_dev}`);
      break;
    } catch (e) {
      // noop
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return () => {
    server.kill();
  };
};
