/**
 * MaxBet Slot - Canvas Particle & Floating Coins Engine
 * Embosses the authentic MaxBet Crown & Laurel Emblem onto 3D floating coins.
 */

// Official MaxBet Emblem Paths (Crown & Laurel Wreath) extracted from vector asset
const MAXBET_EMBLEM_PATHS = (typeof Path2D !== 'undefined') ? [
  { path: new Path2D('M0 0 C4.03 0.86 5.23 2.53 7.94 5.62 C9.28 7.03 10.63 8.43 12 9.81 C12.65 10.49 13.3 11.16 13.97 11.86 C16.94 14.53 18.85 15.67 22.88 15.5 C26.83 15.66 28.21 16.82 30.94 19.62 C31.75 21.88 31.75 21.88 31.94 23.62 C32.95 23.27 33.96 22.92 35 22.56 C38.91 21.46 41.97 21.56 45.94 22.62 C48.42 24.79 48.87 26.04 49.23 29.3 C48.86 33.46 47.23 36.48 45.25 40.06 C41.71 46.73 39.22 53.27 37.14 60.52 C35.86 63.82 34.71 65.45 31.94 67.62 C26.09 68.68 22.41 66.52 17.39 63.87 C8.21 59.21 -3.7 59.1 -13.5 61.88 C-16.59 62.95 -19.42 64.28 -22.31 65.81 C-25.74 67.59 -28.15 68.41 -32.06 67.62 C-37.46 64.15 -38.18 59.34 -39.82 53.38 C-41.48 48.36 -43.82 43.83 -46.33 39.18 C-48.67 34.77 -50.92 30.43 -49.38 25.38 C-47.75 23.21 -46.6 22.59 -44.06 21.62 C-41.27 21.65 -41.27 21.65 -38.31 22 C-36.84 22.17 -36.84 22.17 -35.33 22.34 C-34.58 22.43 -33.83 22.53 -33.06 22.62 C-32.44 21.66 -31.82 20.69 -31.19 19.69 C-29.06 16.62 -29.06 16.62 -27.06 15.62 C-25.8 15.71 -24.55 15.79 -23.25 15.88 C-19.76 15.92 -19.25 15.78 -16.38 13.44 C-15.61 12.51 -14.85 11.58 -14.06 10.62 C-12.42 8.94 -10.75 7.27 -9.06 5.62 C-8.59 5.15 -8.11 4.68 -7.62 4.2 C-5.14 1.9 -3.34 0.68 0 0 Z'), fill: '#CBBB8C', tx: 290.0625, ty: 89.375 },
  { path: new Path2D('M0 0 C0.66 1.32 1.32 2.64 2 4 C2.93 3.5 3.86 3.01 4.81 2.5 C10.22 0.2 16.63 -0.2 22.2 1.79 C22.86 2.08 23.51 2.38 24.19 2.69 C27.61 4.18 27.82 4.06 31.69 2.69 C32.34 2.39 32.99 2.09 33.67 1.79 C40.73 -0.6 48.79 0.19 55.41 3.44 C59.89 7.84 60.39 13.73 60.48 19.69 C60.49 20.4 60.51 21.11 60.52 21.84 C60.57 24.08 60.6 26.32 60.62 28.56 C60.66 30.81 60.7 33.05 60.75 35.3 C60.79 37.33 60.81 39.37 60.84 41.4 C60.93 44.98 60.93 44.98 61.58 48.41 C61.72 49.26 61.86 50.12 62 51 C61 52 61 52 58.87 52.11 C57.49 52.11 57.49 52.11 56.09 52.1 C55.1 52.09 54.11 52.09 53.09 52.09 C52.05 52.08 51.01 52.07 49.94 52.06 C48.89 52.06 47.85 52.05 46.77 52.05 C44.18 52.04 41.59 52.02 39 52 C37.87 48.6 38.28 47.42 39 44 C39.08 42.02 39.11 40.03 39.1 38.04 C39.09 36.93 39.09 35.82 39.09 34.67 C39.08 33.52 39.07 32.37 39.06 31.19 C39.06 30.02 39.05 28.85 39.05 27.64 C39.04 24.76 39.02 21.88 39 19 C35.42 18 35.42 18 32 19 C31.97 23.27 31.95 27.54 31.94 31.81 C31.92 33.61 31.92 33.61 31.91 35.44 C31.91 36.62 31.91 37.8 31.9 39.02 C31.9 40.09 31.89 41.17 31.89 42.27 C32.04 47.19 32.55 52.1 33 57 C25.41 57 17.82 57 10 57 C9.67 56.01 9.34 55.02 9 54 C9.33 53.34 9.66 52.68 10 52 C10.37 47.43 10.47 42.84 10.62 38.25 C10.68 36.97 10.73 35.7 10.78 34.38 C10.83 33.15 10.87 31.91 10.91 30.64 C10.95 29.51 11 28.38 11.04 27.22 C11 24.04 10.61 21.12 10 18 C8.02 18.33 6.04 18.66 4 19 C3.97 23.4 3.95 27.79 3.94 32.19 C3.93 33.43 3.92 34.68 3.91 35.96 C3.91 37.16 3.91 38.37 3.9 39.61 C3.9 40.71 3.89 41.82 3.89 42.95 C3.92 45.98 3.92 45.98 4.57 48.84 C4.71 49.55 4.85 50.26 5 51 C4 52 4 52 1.87 52.11 C0.49 52.11 0.49 52.11 -0.91 52.1 C-1.9 52.09 -2.89 52.09 -3.91 52.09 C-4.95 52.08 -5.99 52.07 -7.06 52.06 C-8.11 52.06 -9.15 52.05 -10.23 52.05 C-12.82 52.04 -15.41 52.02 -18 52 C-19.13 48.61 -18.74 46.45 -18 43 C-17.81 38.61 -17.81 34.21 -17.81 29.82 C-17.81 27.7 -17.79 25.59 -17.78 23.48 C-17.75 16.7 -17.88 10.48 -20 4 C-13.31 1.64 -7.17 -0.21 0 0 Z'), fill: '#C7B784', tx: 269.0, ty: 168.0 },
  { path: new Path2D('M0 0 C0.66 0 1.32 0 2 0 C2.5 2.97 2.5 2.97 3 6 C5.48 6.5 5.48 6.5 8 7 C8 7.66 8 8.32 8 9 C6.02 9.99 6.02 9.99 4 11 C5.46 11 6.92 10.89 8.38 10.81 C12 11 12 11 13.88 12.25 C15.11 14.16 15.62 15.77 16 18 C17.65 18.33 19.3 18.66 21 19 C21.66 17.68 22.32 16.36 23 15 C23.66 15 24.32 15 25 15 C25 16.98 25 18.96 25 21 C26.98 21.5 26.98 21.5 29 22 C28.67 23.32 28.34 24.64 28 26 C27.36 26.12 26.72 26.25 26.06 26.38 C25.38 26.58 24.7 26.79 24 27 C23.67 27.66 23.34 28.32 23 29 C23.74 29.12 24.49 29.25 25.25 29.38 C27.8 29.95 29.73 30.74 32 32 C31.5 28.53 31.5 28.53 31 25 C32.46 24.33 33.92 23.66 35.38 23 C36.19 22.63 37 22.26 37.84 21.88 C40 21 40 21 42 21 C40.48 25.05 38.57 28.8 36.56 32.62 C33.5 38.58 31.41 44.43 30 51 C25.12 49.42 20.31 47.67 15.49 45.9 C5 42.1 -8.67 42.76 -19 47 C-21.42 48.23 -23.69 49.57 -26 51 C-26.66 51 -27.32 51 -28 51 C-28.35 49.91 -28.7 48.82 -29.07 47.7 C-32.16 38.41 -35.63 30.24 -41 22 C-39 21 -39 21 -36.62 21.78 C-35.26 22.35 -35.26 22.35 -33.88 22.94 C-32.96 23.32 -32.05 23.7 -31.12 24.09 C-30.42 24.39 -29.72 24.69 -29 25 C-29.99 28.47 -29.99 28.47 -31 32 C-30.07 31.5 -29.14 31.01 -28.19 30.5 C-25 29 -25 29 -22 29 C-22.33 28.01 -22.66 27.02 -23 26 C-24.65 26 -26.3 26 -28 26 C-27.67 24.35 -27.34 22.7 -27 21 C-26.01 21 -25.02 21 -24 21 C-24 19.02 -24 17.04 -24 15 C-23.01 15 -22.02 15 -21 15 C-20.01 16.48 -20.01 16.48 -19 18 C-16.44 18.73 -16.44 18.73 -14 19 C-14.99 22.47 -14.99 22.47 -16 26 C-12.04 25.34 -8.08 24.68 -4 24 C-2.92 18.52 -2.92 18.52 -3 15 C-4.65 15 -6.3 15 -8 15 C-6.68 15.66 -5.36 16.32 -4 17 C-4.88 20.88 -4.88 20.88 -6 22 C-8.44 22.19 -8.44 22.19 -11 22 C-13 20 -13 20 -13.25 16.5 C-13 13 -13 13 -11 11 C-4.68 10.66 -4.68 10.66 -2 12 C-2 11.34 -2 10.68 -2 10 C-4.48 9.5 -4.48 9.5 -7 9 C-6.67 8.01 -6.34 7.02 -6 6 C-4.68 6 -3.36 6 -2 6 C-1.86 5.2 -1.71 4.39 -1.56 3.56 C-1 1 -1 1 0 0 Z'), fill: '#ED262E', tx: 289.0, ty: 98.0 },
  { path: new Path2D('M0 0 C3.72 0.29 6.3 0.5 9.38 2.69 C11.33 5.47 11.7 7.65 12 11 C12.68 10.77 13.36 10.55 14.06 10.31 C18.1 9.88 20.45 11.13 24 13 C26 16 26 16 26 19 C26.85 18.77 27.69 18.55 28.56 18.31 C33.01 17.91 35.17 18.73 39 21 C40.69 23.24 41.75 25.45 43 28 C43.62 28.7 44.24 29.4 44.88 30.12 C46 32 46 32 45.44 34.44 C41.51 41.44 41.51 41.44 37.95 42.76 C33.58 43.8 29.5 44.1 25 44 C22.73 44.44 22.73 44.44 21 45 C19.61 40.82 21.2 38.89 23 35 C23 34.67 23 34.34 23 34 C22.01 34.66 21.02 35.32 20 36 C13.94 36.32 8.02 35.69 2 35 C1.35 33.23 1.35 33.23 1 31 C2.81 27.27 5.52 24.55 9.41 23.11 C11.58 22.63 13.79 22.3 16 22 C15.01 19.36 14.02 16.72 13 14 C11.95 16.78 11.95 16.78 11.81 18.94 C10.44 22.41 8.28 23.36 5 25 C-2.17 26.39 -8.46 23.74 -15 21 C-14.3 17.27 -12.92 15.38 -9.9 12.97 C-6.34 11.15 -2.91 11.7 1 12 C0.67 8.04 0.34 4.08 0 0 Z M27 23 C27.33 25.31 27.66 27.62 28 30 C27.34 30 26.68 30 26 30 C26 30.66 26 31.32 26 32 C29.47 31.5 29.47 31.5 33 31 C31.68 28.36 30.36 25.72 29 23 C28.34 23 27.68 23 27 23 Z'), fill: '#C8B683', tx: 239.0, ty: 224.0 },
  { path: new Path2D('M0 0 C2.87 1.39 4.13 3.49 6.06 6 C7.42 7.08 7.42 7.08 8.81 8.19 C9.56 8.79 10.3 9.38 11.06 10 C11.06 10.66 11.06 11.32 11.06 12 C11.68 12.25 12.3 12.5 12.94 12.75 C15.41 14.21 16.01 15.38 17.06 18 C17.81 17.48 18.55 16.97 19.31 16.44 C22.06 15 22.06 15 24.25 15.19 C26.06 16 26.06 16 28.06 18 C28.37 18.85 28.68 19.69 29 20.56 C29.35 21.37 29.7 22.17 30.06 23 C32.97 24.33 32.97 24.33 35.38 23.06 C38.44 21.85 40.8 21.85 44.06 22 C44.79 24.11 44.79 24.11 45.06 27 C43.59 29.99 43.59 29.99 41.44 33.31 C37.75 39.26 35.47 45.11 33.61 51.84 C32.23 56.83 32.23 56.83 30.06 59 C26.02 58.76 22.88 56.98 19.42 55.04 C9.32 50.6 -5.32 49.71 -15.87 53.05 C-19.87 54.71 -23.34 56.6 -26.94 59 C-29.62 58.62 -29.62 58.62 -31.94 58 C-32.29 56.84 -32.64 55.68 -33 54.48 C-35.73 45.78 -38.53 38.11 -43.62 30.48 C-45.09 27.72 -45.29 26.09 -44.94 23 C-44.61 22.67 -44.28 22.34 -43.94 22 C-39.35 22.45 -35.26 23.42 -30.94 25 C-30.67 24.09 -30.4 23.19 -30.12 22.25 C-29.04 19.29 -27.95 17.38 -25.94 15 C-23.17 15.52 -20.61 16.11 -17.94 17 C-17.38 16.28 -16.82 15.56 -16.25 14.81 C-13.94 12 -11.64 9.43 -8.94 7 C-7.95 7 -6.96 7 -5.94 7 C-5.83 6.4 -5.73 5.8 -5.62 5.19 C-4.64 2.06 -3.49 0 0 0 Z M-0.94 4 C-1.6 4.66 -2.26 5.32 -2.94 6 C-2.94 7.32 -2.94 8.64 -2.94 10 C-4.59 10.33 -6.24 10.66 -7.94 11 C-7.94 11.66 -7.94 12.32 -7.94 13 C-5.46 13.5 -5.46 13.5 -2.94 14 C-2.94 14.66 -2.94 15.32 -2.94 16 C-3.6 15.67 -4.26 15.34 -4.94 15 C-8.44 14.75 -8.44 14.75 -11.94 15 C-14.32 16.94 -14.32 16.94 -14.19 20.5 C-14.32 24.06 -14.32 24.06 -11.94 26 C-9.44 26.33 -9.44 26.33 -6.94 26 C-6.28 25.34 -5.62 24.68 -4.94 24 C-5.02 21.91 -5.02 21.91 -5.94 20 C-6.93 19.67 -7.92 19.34 -8.94 19 C-7.29 19 -5.64 19 -3.94 19 C-3.81 25.75 -3.81 25.75 -4.94 28 C-7.66 28.63 -7.66 28.63 -11 29.12 C-12.1 29.29 -13.21 29.46 -14.35 29.63 C-15.2 29.75 -16.06 29.88 -16.94 30 C-15.95 26.53 -15.95 26.53 -14.94 23 C-15.91 22.71 -16.88 22.42 -17.88 22.12 C-20.94 21 -20.94 21 -21.94 19 C-22.93 19 -23.92 19 -24.94 19 C-24.94 20.98 -24.94 22.96 -24.94 25 C-26.26 25.33 -27.58 25.66 -28.94 26 C-28.94 27.32 -28.94 28.64 -28.94 30 C-27.29 30 -25.64 30 -23.94 30 C-23.61 30.99 -23.28 31.98 -22.94 33 C-23.68 33.12 -24.42 33.25 -25.19 33.38 C-27.74 33.95 -29.66 34.74 -31.94 36 C-30.95 32.53 -30.95 32.53 -29.94 29 C-31.56 28.3 -33.18 27.62 -34.81 26.94 C-35.72 26.55 -36.62 26.17 -37.55 25.78 C-39.92 24.7 -39.92 24.7 -41.94 26 C-41.42 26.84 -40.9 27.67 -40.36 28.54 C-35.21 37.06 -31.72 45.45 -28.94 55 C-26.24 53.95 -23.73 52.89 -21.19 51.5 C-10.23 46.44 4.37 46.08 15.81 49.81 C19.69 51.32 23.39 53.07 27.06 55 C27.72 55 28.38 55 29.06 55 C29.35 53.97 29.65 52.95 29.95 51.89 C32.21 44.14 34.68 37.12 38.83 30.14 C40.2 27.93 40.2 27.93 41.06 25 C37.34 26.21 33.68 27.51 30.06 29 C30.56 32.47 30.56 32.47 31.06 36 C30.13 35.5 29.21 35.01 28.25 34.5 C25.2 32.79 25.2 32.79 22.06 33 C23.05 31.52 23.05 31.52 24.06 30 C25.38 30 26.7 30 28.06 30 C27.73 28.35 27.4 26.7 27.06 25 C26.07 25 25.08 25 24.06 25 C24.06 23.02 24.06 21.04 24.06 19 C22.74 19.66 21.42 20.32 20.06 21 C20.06 21.66 20.06 22.32 20.06 23 C17.69 22.81 17.69 22.81 15.06 22 C13.88 19.56 13.88 19.56 13.06 17 C11.11 14.59 11.11 14.59 7.44 14.88 C5.77 14.94 5.77 14.94 4.06 15 C5.05 14.34 6.04 13.68 7.06 13 C6.57 11.52 6.57 11.52 6.06 10 C4.74 10 3.42 10 2.06 10 C1.57 7.03 1.57 7.03 1.06 4 C0.4 4 -0.26 4 -0.94 4 Z'), fill: '#FBEFED', tx: 289.9375, ty: 94.0 },
  { path: new Path2D('M0 0 C-1.33 4 -2.67 8 -4 12 C-2.99 11.88 -1.98 11.75 -0.94 11.62 C4.2 12.11 6.75 14.07 10 18 C10.94 20.88 10.94 20.88 11 23 C7.32 24.23 3.77 24.36 -0.06 24.56 C-0.8 24.61 -1.53 24.65 -2.28 24.69 C-7.58 25 -7.58 25 -10 25 C-9.47 25.84 -9.47 25.84 -8.94 26.69 C-7.78 29.54 -8.19 31.09 -9 34 C-11.17 33.76 -13.33 33.52 -15.49 33.26 C-17.93 32.97 -17.93 32.97 -20.13 32.99 C-24.78 32.86 -26.98 31.5 -30.06 28.25 C-31.85 26.2 -31.85 26.2 -33 24 C-32.6 18.12 -29.05 13.26 -25.19 9 C-22.75 7.89 -21.63 8.01 -19 8.19 C-16.93 8.35 -16.93 8.35 -15 8 C-12.54 5.22 -12.54 5.22 -11 2 C-7.62 -1.38 -4.39 -1.24 0 0 Z M-16 12 C-16.89 13.31 -17.74 14.65 -18.56 16 C-19.02 16.74 -19.47 17.49 -19.94 18.25 C-20.29 18.83 -20.64 19.41 -21 20 C-18.36 20.33 -15.72 20.66 -13 21 C-13.66 20.01 -14.32 19.02 -15 18 C-15.12 14.81 -15.12 14.81 -15 12 C-15.33 12 -15.66 12 -16 12 Z'), fill: '#C7B782', tx: 328.0, ty: 235.0 },
  { path: new Path2D('M0 0 C3.88 1.75 3.88 1.75 5 4 C5.23 10.53 5.23 10.53 4 13 C4.97 13.68 5.94 14.36 6.94 15.06 C9.45 17.19 9.99 17.97 11.06 21.25 C10.98 25.97 10.51 29.93 8 34 C4.45 36.55 1.06 37.02 -3.25 36.94 C-6.44 35.85 -7.76 34.47 -10 32 C-12.13 30.76 -12.13 30.76 -14 30 C-13.88 28.19 -13.88 28.19 -13 26 C-9.31 23.65 -6.38 22.41 -2 23 C-1.01 23.66 -0.02 24.32 1 25 C1 22.69 1 20.38 1 18 C0.67 18.66 0.34 19.32 0 20 C-3.56 20.89 -6.09 21.28 -9.62 20.19 C-13.29 16.81 -15.01 12.52 -17 8 C-11.84 4.81 -11.84 4.81 -7.75 5.75 C-6.16 6.47 -4.57 7.22 -3 8 C-2.69 6.87 -2.38 5.73 -2.06 4.56 C-1 1 -1 1 0 0 Z'), fill: '#C8B784', tx: 229.0, ty: 197.0 },
  { path: new Path2D('M0 0 C4.39 1.46 4.88 3.98 7 8 C7.77 7.2 7.77 7.2 8.56 6.38 C11 5 11 5 14.75 5.81 C15.82 6.2 16.89 6.6 18 7 C18 11.05 17.76 11.91 15.69 15.12 C15.26 15.81 14.83 16.49 14.39 17.2 C13 19 13 19 10 21 C3.94 20.47 3.94 20.47 1 19 C1 20.98 1 22.96 1 25 C1.52 24.65 2.03 24.3 2.56 23.94 C6.07 22.59 8.38 23.11 12 24 C14.94 25.94 14.94 25.94 17 28 C17 28.66 17 29.32 17 30 C15.21 31.47 15.21 31.47 12.81 33.06 C12.04 33.59 11.26 34.12 10.46 34.66 C7.08 36.5 4.45 37.19 0.61 36.69 C-1.77 35.97 -3.84 35.25 -6 34 C-7.56 30.81 -7.56 30.81 -8 27 C-8.09 26.32 -8.18 25.64 -8.27 24.94 C-8.6 20.88 -8.17 19.22 -5.62 16 C-3 14 -3 14 -1 14 C-1.35 13.48 -1.7 12.97 -2.06 12.44 C-3.38 9 -2.77 6.55 -2 3 C-1.34 2.01 -0.68 1.02 0 0 Z'), fill: '#C8B683', tx: 348.0, ty: 197.0 },
  { path: new Path2D('M0 0 C0 3.96 0 7.92 0 12 C1.15 11.86 2.31 11.71 3.5 11.56 C8.52 11.52 10.99 13.97 14.53 17.27 C16 19 16 19 16 21 C0.49 26.79 0.49 26.79 -6.01 24.2 C-9.3 22.47 -10.8 21.59 -12 18 C-12.04 12.6 -11.91 7.63 -9.25 2.88 C-3.62 -1.81 -3.62 -1.81 0 0 Z'), fill: '#C7B783', tx: 340.0, ty: 224.0 },
  { path: new Path2D('M0 0 C0.99 0.33 1.98 0.66 3 1 C4.74 4.94 5.5 8.71 3.94 12.75 C1.74 15.3 -0.55 17.69 -3 20 C-2.01 20 -1.02 20 0 20 C0.36 26.44 0.36 26.44 -1.19 28.81 C-4.35 30.88 -6.8 32.03 -10.62 31.94 C-13 31 -13 31 -14.88 29.12 C-16.56 24.45 -16.22 19.8 -15 15 C-14.01 14.34 -13.02 13.68 -12 13 C-11.01 13.99 -10.02 14.98 -9 16 C-8.81 14.84 -8.63 13.69 -8.44 12.5 C-7.15 7.15 -3.79 3.82 0 0 Z'), fill: '#C9B685', tx: 238.0, ty: 151.0 },
  { path: new Path2D('M0 0 C3 0 3 0 4.79 1.72 C8.56 6.53 10.87 9.82 11 16 C12.65 15.01 14.3 14.02 16 13 C17.86 14.86 17.56 17.74 17.81 20.25 C18.01 21.96 18.01 21.96 18.21 23.7 C17.96 27.71 16.74 29.17 14 32 C9.87 31.39 6.63 30.06 3 28 C1.65 25.29 1.93 22.99 2 20 C2.99 19.67 3.98 19.34 5 19 C5 18.34 5 17.68 5 17 C4.4 16.73 3.8 16.46 3.19 16.19 C-0.57 14.15 -0.57 14.15 -2 12 C-2.36 7.43 -2.62 3.94 0 0 Z'), fill: '#C8B683', tx: 339.0, ty: 151.0 },
  { path: new Path2D('M0 0 C3.37 0.55 5.08 1.05 8 3 C8.99 4.49 8.99 4.49 10 6 C10.6 5.34 11.2 4.68 11.81 4 C14 2 14 2 17 2 C18.33 8.16 18.33 8.16 17 11.56 C14.32 14.83 11.72 17.9 8 20 C4.69 19.56 4.69 19.56 2 18 C-0.45 14.32 -0.23 11.56 -0.12 7.31 C-0.12 6.61 -0.11 5.91 -0.1 5.19 C-0.07 3.46 -0.04 1.73 0 0 Z'), fill: '#C7B680', tx: 216.0, ty: 181.0 },
  { path: new Path2D('M0 0 C0.61 0.19 1.23 0.38 1.86 0.57 C1.94 2.47 2 4.37 2.05 6.26 C2.1 7.85 2.1 7.85 2.16 9.46 C1.82 13.04 1.12 14.78 -1.14 17.57 C-3.53 19.09 -3.53 19.09 -6.14 19.57 C-8.56 18.31 -8.56 18.31 -10.89 16.32 C-11.67 15.68 -12.44 15.04 -13.25 14.37 C-15.3 12.42 -16.09 11.46 -16.23 8.63 C-16.2 6.61 -16.17 4.59 -16.14 2.57 C-11.46 2.57 -10.52 3.57 -7.14 6.57 C-7.05 5.98 -6.97 5.38 -6.89 4.76 C-5.72 1.36 -3.72 -0.74 0 0 Z'), fill: '#C8B683', tx: 362.13671875, ty: 181.42578125 },
  { path: new Path2D('M0 0 C0.33 0 0.66 0 1 0 C1.66 2.31 2.32 4.62 3 7 C4.65 7 6.3 7 8 7 C8.33 5.68 8.66 4.36 9 3 C7.68 3 6.36 3 5 3 C5.33 2.01 5.66 1.02 6 0 C7.65 0.33 9.3 0.66 11 1 C12.25 7.62 12.25 7.62 10 11 C7.18 11.51 7.18 11.51 3.88 11.69 C2.23 11.79 2.23 11.79 0.55 11.89 C-0.29 11.92 -1.13 11.96 -2 12 C-1.12 7.25 -1.12 7.25 0 5 C-1.32 4.67 -2.64 4.34 -4 4 C-2.68 4 -1.36 4 0 4 C0 2.68 0 1.36 0 0 Z'), fill: '#FBD4D5', tx: 275.0, ty: 112.0 },
  { path: new Path2D('M0 0 C1.65 0.33 3.3 0.66 5 1 C5 1.66 5 2.32 5 3 C3.35 2.67 1.7 2.34 0 2 C0.33 3.98 0.66 5.96 1 8 C5.08 6.7 5.08 6.7 9 5 C9 5.99 9 6.98 9 8 C9.99 8.33 10.98 8.66 12 9 C12 9.99 12 10.98 12 12 C7.71 11.67 3.42 11.34 -1 11 C-3 5 -3 5 -1.62 2.12 C-1.09 1.42 -0.55 0.72 0 0 Z'), fill: '#F9C2C4', tx: 295.0, ty: 112.0 },
  { path: new Path2D('M0 0 C6.41 -0.36 6.41 -0.36 8.94 1.19 C10.39 3.66 10.42 5.18 10 8 C8.81 9.81 8.81 9.81 7 11 C4.31 11.19 4.31 11.19 2 11 C1.67 9.02 1.34 7.04 1 5 C2.65 5.33 4.3 5.66 6 6 C6 5.34 6 4.68 6 4 C3.03 3.5 3.03 3.5 0 3 C0 2.01 0 1.02 0 0 Z'), fill: '#ED2930', tx: 294.0, ty: 109.0 },
  { path: new Path2D('M0 0 C0.33 0 0.66 0 1 0 C1.12 0.8 1.25 1.61 1.38 2.44 C1.58 3.28 1.79 4.13 2 5 C2.66 5.33 3.32 5.66 4 6 C4 6.66 4 7.32 4 8 C1.69 8.66 -0.62 9.32 -3 10 C-3.1 9.4 -3.21 8.8 -3.31 8.19 C-4.09 5.72 -5.07 4.68 -7 3 C-5.02 3 -3.04 3 -1 3 C-0.67 2.01 -0.34 1.02 0 0 Z'), fill: '#FAC5C7', tx: 309.0, ty: 128.0 },
  { path: new Path2D('M0 0 C2.76 2.76 2.58 5.21 3 9 C0.03 8.01 -2.94 7.02 -6 6 C-5.34 4.68 -4.68 3.36 -4 2 C-3.01 2 -2.02 2 -1 2 C-0.67 1.34 -0.34 0.68 0 0 Z'), fill: '#FBD6D7', tx: 318.0, ty: 121.0 },
  { path: new Path2D('M0 0 C1.98 0 3.96 0 6 0 C6.33 1.32 6.66 2.64 7 4 C2.55 5.49 2.55 5.49 -2 7 C-1.12 2.25 -1.12 2.25 0 0 Z'), fill: '#FBD9DB', tx: 260.0, ty: 123.0 },
  { path: new Path2D('M0 0 C0.66 0.33 1.32 0.66 2 1 C2 1.99 2 2.98 2 4 C2.99 4 3.98 4 5 4 C5 4.66 5 5.32 5 6 C4.01 6 3.02 6 2 6 C1.67 7.32 1.34 8.64 1 10 C0.34 9.01 -0.32 8.02 -1 7 C-3.06 6.28 -3.06 6.28 -5 6 C-5 5.34 -5 4.68 -5 4 C-3.68 4 -2.36 4 -1 4 C-0.67 2.68 -0.34 1.36 0 0 Z'), fill: '#FCE4E5', tx: 289.0, ty: 126.0 },
  { path: new Path2D('M0 0 C0.33 0.99 0.66 1.98 1 3 C1.99 3.33 2.98 3.66 4 4 C4 4.99 4 5.98 4 7 C-2.75 7.12 -2.75 7.12 -5 6 C-5 5.34 -5 4.68 -5 4 C-3.37 2.62 -1.71 1.28 0 0 Z'), fill: '#FCE0E1', tx: 303.0, ty: 117.0 },
  { path: new Path2D('M0 0 C0.66 0.33 1.32 0.66 2 1 C2 1.66 2 2.32 2 3 C3.32 3.33 4.64 3.66 6 4 C5.34 5.98 4.68 7.96 4 10 C3.57 9.55 3.13 9.09 2.69 8.62 C0.89 6.8 0.89 6.8 -2 5 C-1.34 3.35 -0.68 1.7 0 0 Z'), fill: '#FCE0E1', tx: 270.0, ty: 129.0 },
  { path: new Path2D('M0 0 C1.65 0.33 3.3 0.66 5 1 C6.12 7.75 6.12 7.75 5 10 C3.68 9.67 2.36 9.34 1 9 C1.66 8.01 2.32 7.02 3 6 C3 5.01 3 4.02 3 3 C1.68 3 0.36 3 -1 3 C-0.67 2.01 -0.34 1.02 0 0 Z'), fill: '#FAC8CA', tx: 281.0, ty: 112.0 },
  { path: new Path2D('M0 0 C0.66 0.33 1.32 0.66 2 1 C2 1.99 2 2.98 2 4 C-1 6 -1 6 -5 6 C-5 5.34 -5 4.68 -5 4 C-3.68 4 -2.36 4 -1 4 C-0.67 2.68 -0.34 1.36 0 0 Z'), fill: '#F9C1C3', tx: 289.0, ty: 126.0 }
] : [];


class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.ambientCoins = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isRunning = true;

    if (this.canvas) {
      this.resize();
      this.initCoinCache();
      window.addEventListener('resize', () => this.resize());
      this.initAmbient();
      this.animate();
    }
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    if (this.ctx) {
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
  }

  // Pre-render the high-resolution 3D coin face & back to an offscreen canvas once
  initCoinCache() {
    const size = 128;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.46;

    const createFace = (isBack = false) => {
      const cvs = document.createElement('canvas');
      cvs.width = size;
      cvs.height = size;
      const cctx = cvs.getContext('2d');

      // Base Radial Gold Gradient
      const faceGrad = cctx.createRadialGradient(cx - radius * 0.22, cy - radius * 0.25, radius * 0.08, cx, cy, radius);
      faceGrad.addColorStop(0, '#fffef4');
      faceGrad.addColorStop(0.22, '#f6cb4b');
      faceGrad.addColorStop(0.55, '#d49514');
      faceGrad.addColorStop(0.85, '#996000');
      faceGrad.addColorStop(1, '#472700');

      cctx.beginPath();
      cctx.arc(cx, cy, radius, 0, Math.PI * 2);
      cctx.fillStyle = faceGrad;
      cctx.fill();

      // Raised outer rim bevel
      cctx.lineWidth = radius * 0.12;
      cctx.strokeStyle = '#6e4000';
      cctx.stroke();

      // Inner specular ring highlight
      cctx.beginPath();
      cctx.arc(cx, cy, radius * 0.88, 0, Math.PI * 2);
      cctx.lineWidth = 1.5;
      cctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      cctx.stroke();

      // Recessed minted inner bed ring
      cctx.beginPath();
      cctx.arc(cx, cy, radius * 0.74, 0, Math.PI * 2);
      cctx.lineWidth = 1;
      cctx.strokeStyle = 'rgba(60, 30, 0, 0.6)';
      cctx.stroke();

      // Beveled beads along border
      const dotCount = 20;
      cctx.fillStyle = 'rgba(255, 245, 190, 0.85)';
      for (let d = 0; d < dotCount; d++) {
        const a = (d / dotCount) * Math.PI * 2;
        const dx = cx + Math.cos(a) * (radius * 0.81);
        const dy = cy + Math.sin(a) * (radius * 0.81);
        cctx.beginPath();
        cctx.arc(dx, dy, radius * 0.024, 0, Math.PI * 2);
        cctx.fill();
      }

      // Embossed MaxBet Crown & Laurel Emblem Relief
      if (MAXBET_EMBLEM_PATHS && MAXBET_EMBLEM_PATHS.length > 0) {
        const emblemTargetSize = radius * (isBack ? 1.05 : 1.15);
        const s = emblemTargetSize / 190.0;

        // Shadow pass
        cctx.save();
        cctx.translate(cx + 1.2, cy + 1.5);
        cctx.scale(s, s);
        cctx.translate(-290, -177.5);
        cctx.fillStyle = 'rgba(38, 16, 0, 0.85)';
        for (let i = 0; i < MAXBET_EMBLEM_PATHS.length; i++) {
          const item = MAXBET_EMBLEM_PATHS[i];
          cctx.save();
          cctx.translate(item.tx, item.ty);
          cctx.fill(item.path);
          cctx.restore();
        }
        cctx.restore();

        // Authentic multi-tone metallic emblem pass
        cctx.save();
        cctx.translate(cx, cy);
        cctx.scale(s, s);
        cctx.translate(-290, -177.5);
        for (let i = 0; i < MAXBET_EMBLEM_PATHS.length; i++) {
          const item = MAXBET_EMBLEM_PATHS[i];
          cctx.save();
          cctx.translate(item.tx, item.ty);
          cctx.fillStyle = item.fill;
          cctx.fill(item.path);
          cctx.restore();
        }
        cctx.restore();
      }

      return cvs;
    };

    this.coinFaceCanvas = createFace(false);
    this.coinBackCanvas = createFace(true);
  }

  initAmbient() {
    this.ambientCoins = [];
    // Lightweight, calm, high-performance ambient coins (6 on mobile, 8 on desktop)
    const isMobile = window.innerWidth < 600;
    const count = isMobile ? 6 : 8;
    for (let i = 0; i < count; i++) {
      this.ambientCoins.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: 22 + Math.random() * 22,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.006, // slow, relaxing rotational spin
        tiltAngle: Math.random() * Math.PI * 2,
        tiltSpeed: 0.005 + Math.random() * 0.008, // slow, majestic 3D tumble
        tiltAxis: Math.random() * Math.PI,
        speedX: (Math.random() - 0.5) * 0.12, // very gentle horizontal drift
        speedY: -0.07 - Math.random() * 0.09, // calm, slow upward floating
        opacity: 0.4 + Math.random() * 0.4
      });
    }
  }

  // Spawn celebration explosion of 3D coins and sparks
  spawnCelebration(isJackpot = false) {
    const count = isJackpot ? 48 : 24;
    const originX = this.width / 2;
    const originY = this.height * 0.52;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * (isJackpot ? 14 : 9);
      const isCoin = Math.random() > 0.35;

      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isJackpot ? 6 : 3.5),
        gravity: 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        tiltAngle: Math.random() * Math.PI * 2,
        tiltSpeed: 0.03 + Math.random() * 0.05,
        tiltAxis: Math.random() * Math.PI,
        size: isCoin ? (16 + Math.random() * 18) : (3 + Math.random() * 5),
        isCoin: isCoin,
        color: isCoin ? '#ffd700' : (Math.random() > 0.5 ? '#fff4b8' : '#e040fb'),
        alpha: 1,
        decay: 0.009 + Math.random() * 0.012
      });
    }
  }

  // Draw authentic 3D Extruded Gold Bullion Coin with tangible depth & embossed MaxBet emblem
  draw3DCoin(x, y, radius, tiltAngle, tiltAxis, spinAngle, opacity) {
    if (opacity <= 0 || radius <= 0) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = opacity;

    // Rotate to the tilt plane axis so coin can tumble in any 3D direction
    ctx.rotate(tiltAxis);

    const cosT = Math.cos(tiltAngle);
    const sinT = Math.sin(tiltAngle);
    const absCos = Math.abs(cosT);
    const aspect = Math.max(0.08, absCos);

    // Thick gold coin: heavy bullion coin with depth proportional to tilt
    const h = radius * 0.28 * Math.abs(sinT);
    const isFrontFacing = cosT >= 0;
    const faceY = sinT >= 0 ? -h * 0.5 : h * 0.5;

    // 1. Draw 3D Extruded Cylindrical Side Wall (when tilted enough to see the edge)
    if (h > 0.8) {
      // Horizontal metallic gradient running across the side of the cylinder (-radius to +radius)
      const edgeGrad = ctx.createLinearGradient(-radius, 0, radius, 0);
      edgeGrad.addColorStop(0, '#381e00');
      edgeGrad.addColorStop(0.16, '#8c5400');
      edgeGrad.addColorStop(0.38, '#f7ca45');
      edgeGrad.addColorStop(0.55, '#fff9d6');
      edgeGrad.addColorStop(0.72, '#d99a18');
      edgeGrad.addColorStop(0.88, '#7a4500');
      edgeGrad.addColorStop(1, '#2e1800');

      ctx.beginPath();
      if (sinT >= 0) {
        // Bottom side visible: connects front face bottom arc with back face bottom arc
        ctx.ellipse(0, -h * 0.5, radius, radius * aspect, 0, Math.PI, 0, true);
        ctx.lineTo(radius, h * 0.5);
        ctx.ellipse(0, h * 0.5, radius, radius * aspect, 0, 0, Math.PI, false);
        ctx.lineTo(-radius, -h * 0.5);
      } else {
        // Top side visible: connects front face top arc with back face top arc
        ctx.ellipse(0, h * 0.5, radius, radius * aspect, 0, Math.PI, Math.PI * 2, false);
        ctx.lineTo(radius, -h * 0.5);
        ctx.ellipse(0, -h * 0.5, radius, radius * aspect, 0, Math.PI * 2, Math.PI, true);
        ctx.lineTo(-radius, h * 0.5);
      }
      ctx.closePath();
      ctx.fillStyle = edgeGrad;
      ctx.fill();
    }

    // 2. Draw the Visible Face using Pre-rendered GPU Sprite Texture
    const faceTexture = isFrontFacing ? this.coinFaceCanvas : this.coinBackCanvas;
    if (faceTexture) {
      ctx.save();
      ctx.translate(0, faceY);
      ctx.scale(1, aspect);
      ctx.rotate(spinAngle - tiltAxis);
      ctx.drawImage(faceTexture, -radius, -radius, radius * 2, radius * 2);
      ctx.restore();
    }

    // 3. Specular Glint Flare on the face edge
    if (aspect > 0.28) {
      ctx.save();
      const glintX = -radius * 0.42;
      const glintY = faceY - radius * aspect * 0.42;
      const glintGrad = ctx.createRadialGradient(glintX, glintY, 0, glintX, glintY, radius * 0.38);
      glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      glintGrad.addColorStop(0.4, 'rgba(255, 220, 100, 0.2)');
      glintGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glintGrad;
      ctx.beginPath();
      ctx.arc(glintX, glintY, radius * 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore(); // restore coin translation & rotation
  }

  animate() {
    if (!this.isRunning) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render Ambient 3D Coins with Milled Depth
    for (let i = 0; i < this.ambientCoins.length; i++) {
      const c = this.ambientCoins[i];
      c.x += c.speedX;
      c.y += c.speedY;
      c.rotation += c.rotSpeed;
      c.tiltAngle += c.tiltSpeed;

      // Screen wrapping
      if (c.y < -60) {
        c.y = this.height + 50;
        c.x = Math.random() * this.width;
      }
      if (c.x < -60) c.x = this.width + 50;
      if (c.x > this.width + 60) c.x = -50;

      this.draw3DCoin(c.x, c.y, c.size, c.tiltAngle, c.tiltAxis, c.rotation, c.opacity);
    }

    // 2. Render Explosive Celebration 3D Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= p.decay;
      p.rotation += p.rotSpeed;
      p.tiltAngle += p.tiltSpeed;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      if (p.isCoin) {
        this.draw3DCoin(p.x, p.y, p.size, p.tiltAngle, p.tiltAxis, p.rotation, p.alpha);
      } else {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.globalAlpha = p.alpha;
        this.ctx.fillStyle = p.color;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = p.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.ParticleEngine = ParticleEngine;
