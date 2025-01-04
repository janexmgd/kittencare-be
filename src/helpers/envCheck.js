import env from '../utils/env.js';

export default function envCheck() {
  for (const [key, value] of Object.entries(env)) {
    if (!value) {
      throw new Error(`Environment variable ${key} is not set.`);
    }
  }
}
