import '@testing-library/jest-dom';
import "@testing-library/react"
import 'fake-indexeddb/auto';
import { randomUUID } from 'node:crypto';

window.crypto.randomUUID = randomUUID;
