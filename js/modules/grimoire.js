// ============================================================
//  GRIMOIRE - KSIĘGA ZAKLĘĆ
// ============================================================

var GRIMOIRE = {
  spells: [],
  filtered: [],
  loaded: false,
  loading: false
};

// ---------- KOLORY I IKONY SZKÓŁ ----------
var GRIMOIRE_SCHOOLS = {
  "Odpychanie": {
    color: "#4a90e2",
    icon: `<svg viewBox="0 0 184.25 184.25"><path d="M58.07 20.72c-1.95-.09-3.92.35-5.65 1.28-.02.01-.05.02-.07.03-.01 0-.02.01-.03.02a.77.77 0 0 0-.4.75v.02c0 .03.01.06.02.1 0 .02.01.05.02.07.02.07.06.13.1.19 0 0 0 .01.01.02.05.07.12.13.19.19.15.11.33.15.51.14s.06 0 .09-.02h.02c2.05-.48 4.32-.09 6.1 1.05 1.77 1.14 3.07 3.04 3.5 5.11.28 1.37.21 2.84-.08 4.28s-.78 2.86-1.29 4.3c-2.24 6.23-4.8 12.42-6.53 18.92s-2.61 13.39-1.36 20.09c1.56 8.33 6.48 15.96 13.43 20.78 5.74 3.99 12.78 6 19.75 5.74.07 4.34.22 8.67.44 13-8.38.44-16.71 1.85-24.75 4.24a97.8 97.8 0 0 0 25.31 4.68c.33 4.47.73 8.93 1.22 13.38-8.98.31-17.92 1.77-26.54 4.32 8.93 2.92 18.28 4.51 27.67 4.76.69 5.14 1.49 10.28 2.39 15.39.99-5.11 1.86-10.23 2.62-15.38 9.44-.24 18.84-1.84 27.81-4.77-8.63-2.56-17.58-4.02-26.58-4.33.54-4.45.97-8.91 1.34-13.38 8.57-.44 17.09-2 25.25-4.67-8.01-2.38-16.29-3.78-24.63-4.23q.36-6.495.48-12.99c6.78.13 13.58-1.88 19.16-5.76 6.95-4.82 11.87-12.45 13.43-20.78 1.25-6.7.37-13.59-1.36-20.09-1.73-6.49-4.29-12.68-6.52-18.92-.52-1.44-1.01-2.86-1.3-4.3s-.37-2.91-.09-4.28c.43-2.07 1.73-3.97 3.51-5.11 1.76-1.13 4.01-1.52 6.05-1.06.36.11.74-.05.92-.38a.78.78 0 0 0-.23-1.01c-.02-.02-.05-.03-.08-.05s-.05-.03-.08-.04c-2.79-1.52-6.22-1.72-9.17-.55-2.98 1.18-5.34 3.71-6.33 6.77-.6 1.86-.7 3.82-.51 5.71.19 1.88.64 3.7 1.11 5.47 1.55 5.88 3.41 11.63 4.41 17.52 1 5.88 1.11 12-.77 17.55a25.4 25.4 0 0 1-9.44 12.57c-3.72 2.59-8.17 4.13-12.69 4.43-.35-20.17-2.45-40.3-6.31-60.1a379 379 0 0 0-5.75 60.14c-4.72-.2-9.39-1.76-13.27-4.47-4.36-3.04-7.72-7.53-9.43-12.57-1.88-5.55-1.78-11.67-.79-17.55 1-5.89 2.87-11.64 4.42-17.52.47-1.77.91-3.58 1.1-5.47s.11-3.85-.5-5.71c-.99-3.05-3.37-5.59-6.34-6.77-1.12-.44-2.3-.69-3.49-.74Z"/></svg>`
  },
  "Przywoływanie": {
    color: "#f39c12",
    icon: `<svg viewBox="0 0 184.25 184.25"><path d="M33.2 21.76c-.38.02-.69.33-.71.71-.34 5.6.47 11.27 2.37 16.55 1.81 5.05 4.52 9.67 7.04 14.28 2.52 4.6 4.82 9.32 6.97 14.11l18.52 41.19c-1.45.04-2.89-.06-4.29-.37-4-.9-7.61-3.58-9.64-7.15s-.03-.05-.05-.07-.03-.05-.05-.07l-.06-.06c-.02-.02-.05-.03-.07-.05-.05-.03-.1-.06-.16-.08 0 0-.02 0-.02-.01a.6.6 0 0 0-.18-.03h-.09c-.03 0-.06 0-.08.01h-.01c-.03 0-.05.01-.08.02-.02 0-.05.02-.06.02-.02 0-.03.02-.05.02-.01 0-.02.01-.04.02 0 0-.02.01-.02.02l-.05.03s-.05.05-.07.06-.03.04-.05.06-.03.05-.05.07-.03.05-.04.07v.01c-.03.07-.06.15-.07.23v.02a12.7 12.7 0 0 0-.16 6.42c.52 2.15 1.62 4.16 3.15 5.75 2.05 2.13 4.75 3.43 7.46 4.31 3.15 1.03 6.45 1.55 9.75 1.59l19.13 42.55s.03.07.05.11c0 .01.02.02.02.03.01.01.02.03.03.04 0 .01.01.02.02.03s.02.03.04.04l.03.03.03.03.01.01c.02.02.04.03.06.05.03.02.06.03.08.05h.02c.02.01.05.02.08.03.02 0 .05.02.08.02.02 0 .04 0 .06.01h.12s.05 0 .08-.01c.06-.01.12-.03.17-.05h.01c.03-.01.06-.03.09-.05.02-.01.04-.03.06-.04s0 0 .01 0c.05-.03.08-.07.12-.12l.01-.01c.02-.02.03-.04.05-.06l.01-.01.03-.06v-.02l22.62-50.28c6.08.84 11.97 3.15 16.96 6.74 0 0 .01 0 .02.01.02.02.05.03.06.04.03.02.06.03.09.04l.09.03c.02 0 .03 0 .05.01.02 0 .03 0 .05.01h.09c.06 0 .11 0 .17-.02h.02c.02 0 .04-.01.06-.02s.05-.02.07-.03h.01s.02 0 .02-.01l.06-.03c.02-.02.05-.03.07-.05s.05-.04.07-.06.03-.04.05-.06h.01v-.02l.01-.01c.01-.02.03-.04.04-.06.09-.17.12-.36.08-.55a25.8 25.8 0 0 0-6.69-11.73 25.7 25.7 0 0 0-6.69-4.81l15.18-33.76c2.16-4.79 4.46-9.51 6.97-14.11 2.52-4.61 5.23-9.23 7.04-14.28 1.9-5.28 2.7-10.95 2.36-16.55a.746.746 0 0 0-.8-.71c-.31.02-.57.23-.66.52-1.56 3.2-3.05 6.43-4.44 9.71-1.17 2.75-2.26 5.5-3.68 8.04-3.06 5.52-7.67 10.19-11.18 15.73-2.02 3.2-3.61 6.58-5.44 9.78-1.82 3.2-3.91 6.25-6.66 8.53-2.49 2.06-5.51 3.48-8.68 4.24s-6.49.89-9.75.54c-4.25-.45-8.43-1.69-12.53-3.12-5.02-1.75-10.08-3.83-15.5-4.55-2.55-.34-5.04-.37-7.28-1.1-1.89-.61-3.63-1.73-5.13-3.1s-2.76-3-3.89-4.74c-2.25-3.49-3.91-7.43-6.23-11.07-2.49-3.91-5.6-7.29-7.8-11.14-1.44-2.52-2.52-5.28-3.68-8.03-1.39-3.31-2.87-6.56-4.46-9.78a.73.73 0 0 0-.65-.45h-.13Zm40.82 64.73c.68.02 1.36.06 2.04.17 4.52.72 8.79 2.89 13.4 4.3 6.56 2.01 13.6 2.15 20.3.73l-3.39 6.75c-.49.02-.98.03-1.47.07-3.44.29-6.85 1.02-10.14 1.95-4.65 1.32-9.14 3.02-13.64 4.65l-9.14-18.6c.68-.02 1.37-.04 2.05-.02Zm25.11 26.32-7.2 14.31-5.13-10.43c2.38-.8 4.73-1.66 7.08-2.41 1.73-.55 3.49-1.04 5.25-1.47"/></svg>`
  },
  "Wieszczenie": {
    color: "#48c9b0",
    icon: `<svg viewBox="0 0 184.25 184.25"><path d="M127.7 20.1c-3.05 0-5.99.93-8.49 2.69-2.56 1.8-3.18 5.35-1.39 7.92a5.656 5.656 0 0 0 7.89 1.4c.55-.39 1.31-.63 1.98-.63s1.43.25 1.98.63c.37.26.66.58.82.86.15.27.21.57.21.75 0 .25-.19.87-.62 1.35-.47.53-1.3 1.1-2.36 1.49-2.18.8-5.4.83-9.42.99-5.46.22-11.09 1-16.57 2.87-5.5 1.88-10.8 4.86-15.11 9.23a33.64 33.64 0 0 0-8.99 16.84c-1.04 5.09-.86 10.35.45 15.35-2.8 2.99-5.31 6.29-7.38 9.94-8.09 14.22-8.44 30.4-9.18 44.83-.24 4.66-.64 8.72-2.05 11.67-.69 1.45-1.64 2.64-2.65 3.4-.97.73-2.14 1.11-3.02 1.09-.72-.02-1.63-.31-2.45-.84-.84-.55-1.67-1.39-2.36-2.44-1.4-2.14-2.26-5.19-2.89-8.72a88 88 0 0 1-1.36-14.56c-.04-3.14-2.6-5.66-5.73-5.62s-5.63 2.61-5.6 5.74c.06 5.52.57 11.02 1.54 16.45.72 4.04 1.76 8.66 4.57 12.95 1.41 2.16 3.26 4.18 5.63 5.73 2.39 1.57 5.24 2.6 8.35 2.68 3.83.1 7.32-1.24 10.12-3.34 2.76-2.08 4.72-4.77 6.07-7.59 2.66-5.57 2.91-11.23 3.15-16.01.75-14.58 1.43-28.77 7.69-39.78 2.08-3.65 4.78-6.94 7.92-9.87 5.71-5.32 12.89-9.43 20.52-12.22 11.31-4.13 23.61-5.65 35.58-4.39 3.11.33 5.9-1.93 6.23-5.06.33-3.12-1.93-5.92-5.04-6.25-13.71-1.45-27.7.28-40.65 5.01-5.83 2.13-11.55 4.95-16.79 8.51 0-1.48.14-2.95.43-4.38.85-4.15 2.96-8.12 5.93-11.13 2.84-2.87 6.6-5.06 10.72-6.46 4.14-1.41 8.68-2.09 13.37-2.28 3.48-.14 7.98.12 12.85-1.67 2.47-.9 4.95-2.36 6.96-4.64 2.06-2.33 3.47-5.39 3.47-8.91 0-2.3-.62-4.46-1.69-6.34-1.06-1.87-2.51-3.39-4.16-4.56-2.5-1.76-5.44-2.69-8.49-2.69Z"/></svg>`
  },
  "Uroki": {
    color: "#d252b2",
    icon: `<svg viewBox="0 0 184.25 184.25"><path d="M71.61 22.3c-3.13 0-5.67 2.55-5.67 5.69v16.94H38.81c-3.13 0-5.67 2.55-5.67 5.69s2.54 5.69 5.67 5.69h27.13v99.96c0 3.14 2.54 5.69 5.67 5.69s5.67-2.55 5.67-5.69V96.51c.13-4.23 1.21-8.76 3.3-11.74 1.75-2.43 4.19-4.42 6.89-5.59 1.65-.72 3.08-.89 3.82-.71.56.14 1.26.66 1.54 1.17.29.51.28 1.11.19 1.93-1.87 16.16-3.49 32.41-5.18 48.61l12.48-17.53q7.605-10.68 15.27-21.33c1.97-2.74 3.68-4.88 5.35-5.95.81-.52 1.62-.79 2.24-.86.57-.06 1.11.09 1.32.22h.01c.2.12.53.48.73.96.21.51.35 1.26.3 2.11-.1 1.74-.98 3.99-2.33 6.6-4.6 8.9-10.84 17.21-17.28 25.7-1.85 2.44-3.92 5.11-5.64 8.38-1.73 3.29-3.07 7.17-3.02 11.5.03 3.14.83 6.24 2.37 9.04s3.78 5.19 6.56 6.87c4.97 3.01 10.74 3.29 15.82 1.93 7.3-1.95 12.51-6.79 16.78-11.04 2.34-2.32 4.78-4.87 6.94-7.92 2.17-3.06 4.04-6.63 4.92-10.73.63-2.93.78-6.29-.35-9.69-.56-1.71-1.43-3.36-2.69-4.84-1.26-1.49-2.87-2.75-4.8-3.57-3.23-1.38-6.78-1.32-9.97.14a12.32 12.32 0 0 0-6.63 7.5c-.96 2.99.68 6.19 3.66 7.15s6.18-.69 7.13-3.69c.06-.19.37-.54.55-.62s.65-.09.83-.01c.15.06.39.22.59.46.21.24.42.61.57 1.06.3.9.34 2.23.02 3.72-.46 2.15-1.55 4.39-3.07 6.53-1.53 2.16-3.5 4.25-5.69 6.42-3.95 3.92-7.82 7.1-11.71 8.14-2.54.68-5.27.38-7.05-.7-1-.61-1.9-1.54-2.49-2.61a7.96 7.96 0 0 1-.95-3.68c-.02-1.8.6-3.93 1.72-6.05 1.13-2.15 2.78-4.36 4.63-6.8 6.45-8.5 13.12-17.3 18.32-27.35 1.55-2.99 3.32-6.65 3.57-11.21.13-2.3-.15-4.76-1.16-7.15-1.02-2.43-2.72-4.65-5.19-6.2-2.67-1.67-5.65-2.17-8.45-1.89-2.75.28-5.17 1.29-7.22 2.6-4.04 2.59-6.43 6.1-8.42 8.88l-2.82 3.93.46-4.38c.88-3.44.43-7.04-1.33-10.16a13.68 13.68 0 0 0-8.77-6.64c-4.19-1.01-7.98.02-10.97 1.32-2.03.88-3.93 2.02-5.68 3.34V56.31h29.67c3.13 0 5.67-2.55 5.67-5.69s-2.54-5.69-5.67-5.69H77.3V27.99c0-3.14-2.54-5.69-5.67-5.69Z"/></svg>`
  },
  "Wywoływanie": {
    color: "#e74c3c",
    icon: `<svg viewBox="0 0 184.25 184.25"><path d="M91.91 17.89c-2.25 13.01-3.9 26.12-4.96 39.27-3.79.18-7.49.57-11.07 1.15L61.36 30.03l2.07 31.2c-2.81.89-5.49 1.91-8.05 3.05L41.3 51.53l4.06 18.34c-9.07 6.28-15.53 14.91-16.35 24.99-8.83.95-17.63 2.09-26.41 3.44 8.88 1.28 17.78 2.34 26.7 3.24 1.03 6.06 4.1 11.54 8.51 16.24l-17.02 25.79 27.1-17.68c3.64 2.16 7.73 4.13 11.12 5.44l-3.85 17.39 15.37-13.92-.09-.05c6.03 1.26 11.8 1.89 17.43 2.25 1.02 9.81 2.34 19.6 4.02 29.32l.21-1.2c.08.41.14.83.22 1.24 1.68-9.73 3.01-19.51 4.02-29.33 6.06-.23 11.89-.99 17.38-2.22l15.33 13.88-3.83-17.32c4.11-1.65 7.83-3.48 11.17-5.48l27.04 17.64-16.99-25.74c4.41-4.72 7.48-10.21 8.49-16.29 8.92-.89 17.82-1.96 26.68-3.24-8.78-1.36-17.59-2.49-26.42-3.44-.85-10.06-7.3-18.66-16.35-24.92l4.08-18.4-14.14 12.81a76 76 0 0 0-8-3.03L122.86 30 108.3 58.35c-3.64-.51-7.57-.95-11.03-1.15a436 436 0 0 0-4.96-39.27c-.08.4-.14.81-.21 1.22-.08-.42-.14-.84-.22-1.26Zm6.22 52.42c12.01.86 22.67 4.12 30.33 8.66 7.27 4.31 11.52 9.39 12.87 14.5-14.86-1.08-29.84-1.86-42.62-2.02-.01-7.05-.2-14.1-.58-21.14m-12.01.04c-.02.36-.02.72-.04 1.08q-.51 10.005-.54 20.04c-5.15.06-10.3.22-15.45.42-9.07.34-18.13.87-27.17 1.63 1.35-5.11 5.6-10.18 12.87-14.5 7.66-4.54 18.32-7.81 30.33-8.66Zm54.46 32.45c-1.87 4.36-5.88 8.63-12.11 12.33-7.78 4.62-18.67 7.92-30.92 8.71.44-6.71.79-12.96.99-19.19 4.78-.06 9.56-.18 14.34-.35 9.24-.3 18.48-.79 27.7-1.5m-96.91.04c14.68.98 29.41 1.67 42.04 1.82.23 6.56.54 12.96.99 19.21-.5-.03-.98-.09-1.47-.13-11.64-.95-21.98-4.14-29.45-8.58-6.24-3.7-10.25-7.97-12.11-12.33Z"/></svg>`
  },
  "Iluzje": {
    color: "#9b59b6",
    icon: `<svg viewBox="0 0 184.25 184.25"><path d="M90.02 51.9c-19.4.57-38.58 7.91-53.48 20.27-12.87 10.67-24.6 22.28-31.27 35.47 7.26-5.84 14.83-11.86 22.66-17.37 2.41 2.91 4.99 5.67 7.74 8.26l-1.42 14.76 10.61-7.17c.18.13.36.27.54.4 2.73 1.94 5.58 3.73 8.53 5.32l.56 12.08 6.44-8.75c3.36 1.37 6.83 2.45 10.39 3.19l1.45 11.11 5.65-10.11c2.7.22 5.41.27 8.12.15l4.22 12.87 4.45-13.79.24-.03a75 75 0 0 0 8.51-1.95l5.74 11.92 2.87-15.04c1.73-.75 3.43-1.56 5.09-2.46l6.85 7.99.82-12.87c2.84-2.12 5.5-4.47 8.03-6.97l9.06 8.17V89.3c.76-.88 1.51-1.77 2.26-2.66 1.33.84 2.68 1.66 4.07 2.4 4.8 2.56 10.34 4.38 15.85 3.47 3.89-.65 7.51-2.67 10.11-5.64s4.13-6.84 4.27-10.8c.14-3.95-.85-8.14-3.51-11.05-2.71-2.97-6.31-5.18-9.69-6.35-.02 0-.04-.01-.06-.01a.6.6 0 0 0-.26 0c-.06.01-.11.03-.16.06-.03.02-.07.03-.1.06-.03.02-.06.03-.09.06-.02.02-.05.04-.06.06-.04.04-.07.09-.1.14s-.06.1-.08.16 0 .03-.01.05c0 .05-.01.09-.01.13v.13c0 .02 0 .05.01.07v.02c.01.04.03.08.05.12.01.03.03.05.05.08s.04.07.06.1.05.05.07.08c2.36 2.23 4.23 4.98 5.44 8 1.06 2.64 1.57 5.56.84 8.18-.37 1.31-1.04 2.53-1.99 3.44s-2.19 1.53-3.47 1.65c-1.47.14-3.03-.35-4.48-1.06-4.38-2.13-7.89-5.87-11.85-9.13-7.09-5.84-15.46-9.84-24.03-12.91-11.36-4.07-23.41-6.61-35.52-6.25ZM77.73 66.35h29.45c0 9.02-6.59 16.34-14.72 16.34s-14.73-7.31-14.73-16.34m-10.27 4.39c1.47 14.62 11.93 25.97 24.63 25.97 12.45 0 22.72-10.89 24.52-25.09 7.94 2.93 15.57 6.97 22.7 11.57.85.55 1.71 1.11 2.56 1.67-10.14 8.62-22.23 14.92-35.09 18.27-12.07 3.14-24.78 3.69-37.12 1.88-7.02-1.03-13.94-2.82-20.53-5.45A83.5 83.5 0 0 1 30.04 88.8c11.94-8.19 24.46-15.04 37.41-18.05Z"/></svg>`
  },
  "Nekromancja": {
    color: "#2ecc71",
    icon: `<svg viewBox="0 0 184.25 184.25"><path d="M92.13 52.33c-8.82 0-17.97 1.3-26.45 5.12-6.19 2.79-12.14 7.03-16.15 13.21-2.01 3.09-3.49 6.62-4.13 10.41-.64 3.8-.43 7.78.83 11.57 2.11 6.34 5.78 10.23 6.85 13.5 1 3.05.56 6.81-1.13 9.54s-4.84 4.81-8.02 5.27c-3.17.46-6.78-.64-9.17-2.79s-3.87-5.63-3.76-8.84c.1-3-2.25-5.51-5.23-5.61-2.99-.1-5.49 2.25-5.59 5.25a22.32 22.32 0 0 0 7.36 17.3 22.1 22.1 0 0 0 17.93 5.44c6.48-.93 12.23-4.71 15.68-10.29a22.31 22.31 0 0 0 2.21-18.67c-2.09-6.36-5.77-10.27-6.86-13.55-.64-1.93-.79-4.15-.42-6.3.37-2.16 1.24-4.33 2.51-6.29 2.55-3.93 6.74-7.09 11.52-9.24 6.63-2.99 14.26-4.15 22.01-4.15s15.37 1.16 22 4.15c4.78 2.16 8.97 5.31 11.52 9.24 1.27 1.96 2.16 4.13 2.52 6.29.37 2.15.22 4.37-.42 6.3-1.09 3.28-4.79 7.19-6.87 13.55-2.05 6.23-1.23 13.09 2.21 18.67s9.21 9.35 15.69 10.29 13.06-1.06 17.93-5.44a22.3 22.3 0 0 0 7.35-17.3c-.1-3-2.6-5.35-5.59-5.25s-5.32 2.61-5.23 5.61c.11 3.21-1.38 6.7-3.76 8.84-2.39 2.15-5.99 3.25-9.17 2.79-3.17-.46-6.34-2.53-8.03-5.27-1.69-2.73-2.13-6.49-1.13-9.54 1.07-3.27 4.74-7.16 6.85-13.5 1.26-3.79 1.48-7.78.83-11.57-.64-3.79-2.12-7.31-4.13-10.41-4.02-6.18-9.96-10.42-16.15-13.21-8.48-3.82-17.62-5.12-26.44-5.12Z"/></svg>`
  },
  "Przemiany": {
    color: "#d35400",
    icon: `<svg viewBox="0 0 184.25 184.25"><path d="M128.01 33.75c-38.75.03-76.4.08-88.48.08l-8.35 11.36h20.19l.16 60.16-6.4 9.86h.01c-.15.25-.31.48-.45.72-1.27 2.1-2.2 4.11-2.76 6.19-.28 1.04-.51 2.07-.42 3.53.07 1.14.46 3.03 2.01 4.55l19.37 20.29c.07-35.74-.07-73.21-.16-105.3H98.2l.23 89.93-7.92 9.46h27.28c-2.56-3.06-5.11-6.4-7.67-9.46l-.22-89.92c6.95 0 12.55-.01 19.4-.01.98.09 1.62.26 1.83.39.13.08.28.24.33.34s.08.29.07.36c-.01.09-.1.4-.35.81-.26.43-.71.98-1.34 1.63-1.26 1.32-3.39 3.02-5.15 5.99-2.24 3.77-2.8 8.24-1.57 12.45s4.11 7.68 8.02 9.64 8.39 2.22 12.49.69 7.33-4.66 9.01-8.71c1.2-2.9-.17-6.23-3.07-7.43-2.89-1.2-6.2.17-7.4 3.07-.42 1.02-1.45 2.03-2.49 2.41-1.04.39-2.47.31-3.46-.19s-1.9-1.6-2.21-2.67c-.31-1.06-.13-2.49.43-3.44.49-.83 1.79-2.06 3.58-3.92.9-.94 1.9-2.06 2.8-3.51.91-1.46 1.68-3.24 1.96-5.34.32-2.42-.1-4.81-1.17-6.95a12.15 12.15 0 0 0-4.75-5.06c-1.93-1.13-3.81-1.58-5.54-1.8-1.1-.16-2.3-.18-3.31-.2"/></svg>`
  }
};

// ---------- MAPA TYPÓW OBRAŻEŃ (polskie nazwy) ----------
var DAMAGE_TYPE_MAP = {
  'acid': 'kwas',
  'poison': 'trucizna',
  'cold': 'zimno',
  'fire': 'ogień',
  'force': 'moc',
  'lightning': 'elektryczność',
  'bludgeoning': 'obuchowe',
  'piercing': 'kłute',
  'necrotic': 'nekrotyczne',
  'psychic': 'psychiczne',
  'radiant': 'promieniste',
  'slashing': 'cięte',
  'thunder': 'dźwięk'
};

// ---------- ŁADOWANIE ----------
function loadGrimoireSpells(callback) {
  if (GRIMOIRE.spells.length > 0) {
    if (callback) callback(GRIMOIRE.spells);
    return;
  }
  if (GRIMOIRE.loading) {
    setTimeout(function() { loadGrimoireSpells(callback); }, 100);
    return;
  }
  GRIMOIRE.loading = true;
  var levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var loaded = 0;
  var total = levels.length;
  var results = [];

  levels.forEach(function(level) {
    var urls = [
      'data/spells/level-' + level + '.json',
      'level-' + level + '.json'
    ];
    tryLoadGrimoireUrl(urls, 0, function(data) {
      if (data && Array.isArray(data)) {
        data.forEach(function(s) {
          var schoolMap = {
            'wywoływanie': 'Wywoływanie',
            'przywoływanie': 'Przywoływanie',
            'wieszczenie': 'Wieszczenie',
            'nekromancja': 'Nekromancja',
            'uroki': 'Uroki',
            'iluzje': 'Iluzje',
            'odpychanie': 'Odpychanie',
            'przemiany': 'Przemiany'
          };
          var schoolName = schoolMap[(s.school || '').toLowerCase()] || s.school || 'Nieznana';
          var color = GRIMOIRE_SCHOOLS[schoolName] ? GRIMOIRE_SCHOOLS[schoolName].color : '#888';

          // Mapowanie typu obrażeń
          var dmgType = s.damage_type || s.damage_effect || '';
          var dmgDisplay = DAMAGE_TYPE_MAP[dmgType.toLowerCase()] || dmgType || '—';

          // Komponenty z notą materialną
          var components = s.components || '—';
          var materialNote = s.material_note || '';
          var materialNoteEn = s.material_note_en || '';

          results.push({
            id: s.name_en ? s.name_en.toLowerCase().replace(/\s+/g, '-') : 'spell-' + Date.now(),
            namePl: s.name_pl || s.name_en || '?',
            nameEn: s.name_en || s.name_pl || '?',
            levelNum: s.level || 0,
            level: s.level === 0 ? 'Sztuczka' : (s.level + '. Krąg'),
            school: schoolName,
            color: color,
            time: s.casting || '1 akcja',
            rangeArea: s.range || '—',
            compShort: s.components || '—',
            components: components,
            duration: s.duration || '—',
            attackSave: s.attack_save || s.damage_type || 'Brak',
            damageEffect: dmgDisplay,
            descPl: s.desc_pl || '<p>Brak opisu</p>',
            descEn: s.desc_en || '<p>No description</p>',
            source: s.source || 'PHB',
            materialNote: materialNote,
            materialNoteEn: materialNoteEn,
            classes: s.classes || []
          });
        });
      }
      loaded++;
      if (loaded === total) {
        GRIMOIRE.spells = results;
        GRIMOIRE.loading = false;
        console.log('📖 Załadowano zaklęć:', results.length);
        if (callback) callback(GRIMOIRE.spells);
      }
    });
  });
}

function tryLoadGrimoireUrl(urls, idx, callback) {
  if (idx >= urls.length) { callback(null); return; }
  fetch(urls[idx])
    .then(function(r) {
      if (!r.ok) throw new Error('Not found');
      return r.json();
    })
    .then(function(data) { callback(data); })
    .catch(function() {
      tryLoadGrimoireUrl(urls, idx + 1, callback);
    });
}

// ---------- KONWERSJA ZASIĘGU ----------
// ---------- KONWERSJA ZASIĘGU ----------
function convertRange(rangeStr) {
  if (!rangeStr || rangeStr === '—') {
    return { display: '—', ft: null, hex: null };
  }
  
  // Wyciągnij liczbę stóp
  var match = rangeStr.match(/(\d+)\s*ft/);
  if (match) {
    var ft = parseInt(match[1]);
    var hex = Math.round(ft / 5);
    return {
      display: ft + ' ft (' + hex + ' ⬡)',
      ft: ft,
      hex: hex
    };
  }
  
  // Sprawdź czy to "dotyk" lub "osobisty"
  var lower = rangeStr.toLowerCase();
  if (lower.includes('dotyk') || lower.includes('osobisty') || lower.includes('siebie')) {
    return { display: rangeStr, ft: null, hex: null };
  }
  
  // Sprawdź czy to "stożek" lub "linia" – zachowaj oryginał
  if (lower.includes('stożek') || lower.includes('linia') || lower.includes('sfera') || lower.includes('promień')) {
    return { display: rangeStr, ft: null, hex: null };
  }
  
  return { display: rangeStr, ft: null, hex: null };
}

// ---------- RENDER ----------
function renderGrimoire() {
  var container = document.getElementById('grimoireGrid');
  if (!container) return;

  container.innerHTML = '<div class="grimoire-loading"><span>⏳</span>Ładowanie księgi zaklęć...</div>';
  container.style.minHeight = '300px';
  container.style.display = 'grid';

  var searchTerm = document.getElementById('grimoireSearch') ? document.getElementById('grimoireSearch').value.toLowerCase() : '';
  var levelFilter = document.getElementById('grimoireLevel') ? document.getElementById('grimoireLevel').dataset.value : 'Wszystkie';
  var schoolFilter = document.getElementById('grimoireSchool') ? document.getElementById('grimoireSchool').dataset.value : 'Wszystkie';
  var sortFilter = document.getElementById('grimoireSort') ? document.getElementById('grimoireSort').dataset.value : 'level-asc';

  loadGrimoireSpells(function(spells) {
    var filtered = spells.filter(function(s) {
      var matchName = s.namePl.toLowerCase().includes(searchTerm) || s.nameEn.toLowerCase().includes(searchTerm);
      var matchLevel = levelFilter === 'Wszystkie' || s.levelNum.toString() === levelFilter;
      var matchSchool = schoolFilter === 'Wszystkie' || s.school === schoolFilter;
      return matchName && matchLevel && matchSchool;
    });

    // ---------- SORTOWANIE ----------
    switch (sortFilter) {
      case 'name-asc':
        filtered.sort(function(a, b) { return a.namePl.localeCompare(b.namePl); });
        break;
      case 'name-desc':
        filtered.sort(function(a, b) { return b.namePl.localeCompare(a.namePl); });
        break;
      case 'level-desc':
        filtered.sort(function(a, b) { 
          if (a.levelNum !== b.levelNum) return b.levelNum - a.levelNum;
          return a.namePl.localeCompare(b.namePl);
        });
        break;
      case 'level-asc':
      default:
        filtered.sort(function(a, b) { 
          if (a.levelNum !== b.levelNum) return a.levelNum - b.levelNum;
          return a.namePl.localeCompare(b.namePl);
        });
        break;
    }

    var countEl = document.getElementById('grimoireCount');
    if (countEl) countEl.textContent = filtered.length + ' zaklęć';

    if (filtered.length === 0) {
      container.innerHTML = '<div class="grimoire-empty"><span>📜</span>Magia zawiodła... Nie znaleziono takich zaklęć.</div>';
      container.style.minHeight = '200px';
      return;
    }

    container.innerHTML = filtered.map(function(s) {
      var color = s.color || '#c9a24b';
      var iconSvg = GRIMOIRE_SCHOOLS[s.school] ? GRIMOIRE_SCHOOLS[s.school].icon : '';
      var tagLevel = s.levelNum === 0 ? 'Sztuczka' : s.level;
      var rangeInfo = convertRange(s.rangeArea);

      return `
        <button class="grimoire-tile" style="--spell-color: ${color}" data-id="${s.id}">
          <div class="tile-icon">${iconSvg}</div>
          <h3>${s.namePl}</h3>
          <span class="en-name">${s.nameEn}</span>
          <div class="tile-tags">
            <span class="tile-tag">${s.school}</span>
            <span class="tile-tag">${tagLevel}</span>
          </div>
          <div class="tile-stats">
            <div class="stat"><span>Czas rzucania</span><div class="val">${s.time}</div></div>
            <div class="stat"><span>Zasięg</span><div class="val">${rangeInfo.display}</div></div>
            <div class="stat"><span>Komponenty</span><div class="val">${s.compShort}</div></div>
          </div>
        </button>
      `;
    }).join('');

    container.style.minHeight = 'auto';

    container.querySelectorAll('.grimoire-tile').forEach(function(tile) {
      tile.addEventListener('click', function() {
        var id = this.dataset.id;
        var spell = GRIMOIRE.spells.find(function(s) { return s.id === id; });
        if (spell) openGrimoireModal(spell);
      });
    });
  });
}

// ---------- MODAL ----------
function openGrimoireModal(spell) {
  var modal = document.getElementById('grimoireModal');
  var box = document.getElementById('grimoireModalBox');
  if (!modal || !box) return;

  var color = spell.color || '#c9a24b';
  var iconSvg = GRIMOIRE_SCHOOLS[spell.school] ? GRIMOIRE_SCHOOLS[spell.school].icon : '';
  var tagLevel = spell.levelNum === 0 ? 'Sztuczka' : spell.level;

  box.style.setProperty('--spell-color', color);
  box.innerHTML = `
    <button class="modal-close" onclick="closeGrimoireModal()">✕</button>
    <div class="modal-header">
      <div class="hdr-icon">${iconSvg}</div>
      <div class="hdr-text">
        <h2>${spell.namePl}</h2>
        <div class="en-title">${spell.nameEn}</div>
      </div>
    </div>
    <div class="modal-body">
      <div class="detail-tags">
        <span class="detail-tag">${spell.school}</span>
        <span class="detail-tag">${tagLevel}</span>
        ${spell.classes && spell.classes.length > 0 ? spell.classes.slice(0, 3).map(function(c) { return '<span class="detail-tag secondary">' + c + '</span>'; }).join('') : ''}
      </div>
      <div class="detail-grid">
        <div class="detail-box"><div class="lbl">Poziom</div><div class="val">${spell.level}</div></div>
        <div class="detail-box"><div class="lbl">Czas rzucania</div><div class="val">${spell.time}</div></div>
        <div class="detail-box"><div class="lbl">Zasięg / Obszar</div><div class="val">${spell.rangeArea}</div></div>
        <div class="detail-box"><div class="lbl">Komponenty</div><div class="val">${spell.components}</div></div>
        <div class="detail-box"><div class="lbl">Czas trwania</div><div class="val">${spell.duration}</div></div>
        <div class="detail-box"><div class="lbl">Szkoła</div><div class="val">${spell.school}</div></div>
        <div class="detail-box"><div class="lbl">Atak / Rzut</div><div class="val">${spell.attackSave}</div></div>
        <div class="detail-box"><div class="lbl">Obrażenia / Efekt</div><div class="val effect">${spell.damageEffect}</div></div>
      </div>
      ${spell.materialNote ? '<div class="mat-note">' + spell.materialNote + '</div>' : ''}
      <div class="desc-section">
        <div class="desc-pl">${spell.descPl}</div>
        <div class="desc-en">${spell.descEn}</div>
      </div>
      <div class="src-footer">Źródło: ${spell.source}</div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeGrimoireModal() {
  var modal = document.getElementById('grimoireModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ---------- FILTRY ----------
function initGrimoireSelects() {
  var schoolContainer = document.getElementById('grimoireSchoolOptions');
  if (schoolContainer) {
    var schoolHtml = '<div class="option selected" data-value="Wszystkie">Wszystkie</div>';
    for (var school in GRIMOIRE_SCHOOLS) {
      var color = GRIMOIRE_SCHOOLS[school].color;
      var icon = GRIMOIRE_SCHOOLS[school].icon;
      schoolHtml += `
        <div class="option" data-value="${school}">
          <span class="opt-icon" style="color:${color};">${icon}</span>
          ${school}
        </div>
      `;
    }
    schoolContainer.innerHTML = schoolHtml;
  }

  document.querySelectorAll('.grimoire-select').forEach(function(select) {
    var trigger = select.querySelector('.select-trigger');
    var options = select.querySelectorAll('.option');

    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = select.classList.contains('open');
      document.querySelectorAll('.grimoire-select').forEach(function(s) { s.classList.remove('open'); });
      if (!isOpen) select.classList.add('open');
    });

    options.forEach(function(opt) {
      opt.addEventListener('click', function(e) {
        e.stopPropagation();
        options.forEach(function(o) { o.classList.remove('selected'); });
        this.classList.add('selected');
        var value = this.dataset.value;
        select.dataset.value = value;

        var content = select.querySelector('.trigger-content');
        var label = this.textContent.trim();
        
        // Dla szkoły – pokaż ikonę
        if (select.id === 'grimoireSchool' && value !== 'Wszystkie') {
          var icon = GRIMOIRE_SCHOOLS[value] ? GRIMOIRE_SCHOOLS[value].icon : '';
          var color = GRIMOIRE_SCHOOLS[value] ? GRIMOIRE_SCHOOLS[value].color : '#888';
          content.innerHTML = `<span class="select-icon" style="color:${color};">${icon}</span><span class="text">${value}</span>`;
        } else {
          // Dla poziomu i sortowania – pokaż sam tekst
          var displayText = label;
          if (select.id === 'grimoireLevel') {
            displayText = value === '0' ? 'Sztuczki' : (value === 'Wszystkie' ? 'Wszystkie' : value + '. Krąg');
          }
          content.innerHTML = '<span class="text">' + displayText + '</span>';
        }

        select.classList.remove('open');
        renderGrimoire();
      });
    });
  });

  // Zamknij selecty przy kliknięciu w tło
  document.addEventListener('click', function() {
    document.querySelectorAll('.grimoire-select').forEach(function(s) { s.classList.remove('open'); });
  });
}

// ---------- INICJALIZACJA ----------
function initGrimoire() {
  var searchInput = document.getElementById('grimoireSearch');
  if (searchInput) {
    searchInput.addEventListener('input', renderGrimoire);
  }

  initGrimoireSelects();

  var modal = document.getElementById('grimoireModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeGrimoireModal();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeGrimoireModal();
  });

  renderGrimoire();
}

// ---------- EKSPORT ----------
window.GRIMOIRE = GRIMOIRE;
window.renderGrimoire = renderGrimoire;
window.openGrimoireModal = openGrimoireModal;
window.closeGrimoireModal = closeGrimoireModal;
window.initGrimoire = initGrimoire;
window.GRIMOIRE_SCHOOLS = GRIMOIRE_SCHOOLS;
window.DAMAGE_TYPE_MAP = DAMAGE_TYPE_MAP;

// ---------- AUTO-START ----------
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGrimoire);
} else {
  initGrimoire();
}