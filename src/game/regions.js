// Kraj / kontynent do trybu Guess — ze strefy czasowej (miejsce) albo języka.

export const COUNTRIES = {
  PL: {
    name: "Poland", flag: "🇵🇱", continent: "europe",
    bbox: [14.12, 49.0, 24.15, 54.84],
    cities: [
      [52.23, 21.01], [50.06, 19.94], [54.35, 18.65], [51.11, 17.04], [52.41, 16.93],
      [51.25, 22.57], [53.13, 23.16], [53.43, 14.55], [50.26, 19.02], [51.76, 19.46],
      [50.04, 22.00], [53.78, 20.48], [53.12, 18.01], [50.87, 20.63], [49.30, 19.95],
      [54.44, 18.56], [51.40, 21.15], [50.68, 17.93], [53.78, 15.78], [52.74, 15.23],
    ],
  },
  DE: {
    name: "Germany", flag: "🇩🇪", continent: "europe",
    bbox: [5.87, 47.27, 15.04, 55.06],
    cities: [
      [52.52, 13.40], [48.14, 11.58], [50.11, 8.68], [53.55, 9.99], [50.94, 6.96],
      [51.23, 6.77], [51.34, 12.37], [51.45, 7.01], [48.78, 9.18], [49.45, 11.08],
      [51.05, 13.74], [47.38, 8.54], [54.32, 10.13], [51.96, 7.63], [49.24, 6.99],
    ],
  },
  FR: {
    name: "France", flag: "🇫🇷", continent: "europe",
    bbox: [-5.14, 41.33, 9.56, 51.09],
    cities: [
      [48.86, 2.35], [45.76, 4.84], [43.30, 5.37], [43.60, 1.44], [44.84, -0.58],
      [47.22, -1.55], [50.63, 3.06], [48.57, 7.75], [43.61, 3.88], [45.19, 5.72],
      [49.44, 1.09], [47.47, -0.55], [48.11, -1.68], [43.70, 7.27], [47.32, 5.04],
    ],
  },
  GB: {
    name: "United Kingdom", flag: "🇬🇧", continent: "europe",
    bbox: [-8.18, 49.96, 1.77, 60.86],
    cities: [
      [51.51, -0.13], [53.48, -2.24], [52.49, -1.90], [55.86, -4.25], [53.80, -1.55],
      [53.41, -2.99], [54.98, -1.62], [51.45, -2.59], [52.95, -1.15], [50.82, -0.14],
      [51.48, -3.18], [55.95, -3.19], [54.60, -5.93], [53.38, -1.47], [51.27, -1.09],
    ],
  },
  ES: {
    name: "Spain", flag: "🇪🇸", continent: "europe",
    bbox: [-9.3, 36.0, 4.3, 43.8],
    cities: [
      [40.42, -3.70], [41.39, 2.17], [37.39, -5.98], [39.47, -0.38], [43.26, -2.93],
      [37.18, -3.60], [41.65, -0.89], [36.72, -4.42], [38.35, -0.48], [43.36, -8.41],
      [39.57, 2.65], [28.12, -15.43], [42.88, -8.54], [41.39, 2.15], [38.00, -1.13],
    ],
  },
  IT: {
    name: "Italy", flag: "🇮🇹", continent: "europe",
    bbox: [6.63, 36.64, 18.52, 47.09],
    cities: [
      [41.90, 12.50], [45.46, 9.19], [40.85, 14.27], [45.07, 7.69], [44.49, 11.34],
      [43.77, 11.25], [38.12, 13.36], [45.44, 12.32], [41.12, 16.87], [37.50, 15.09],
      [44.41, 8.93], [45.65, 13.77], [43.32, 11.33], [40.64, 17.94], [39.22, 9.12],
    ],
  },
  NL: {
    name: "Netherlands", flag: "🇳🇱", continent: "europe",
    bbox: [3.36, 50.75, 7.23, 53.55],
    cities: [
      [52.37, 4.90], [51.92, 4.48], [52.09, 5.12], [51.44, 5.47], [53.22, 6.57],
      [52.07, 4.30], [51.57, 5.09], [52.16, 4.49], [51.81, 4.66], [52.63, 4.75],
    ],
  },
  BE: {
    name: "Belgium", flag: "🇧🇪", continent: "europe",
    bbox: [2.54, 49.50, 6.41, 51.51],
    cities: [
      [50.85, 4.35], [51.22, 4.40], [51.05, 3.73], [50.63, 5.57], [51.21, 2.92],
      [50.47, 4.87], [50.41, 4.44], [50.85, 3.26], [50.93, 5.34], [51.17, 4.14],
    ],
  },
  AT: {
    name: "Austria", flag: "🇦🇹", continent: "europe",
    bbox: [9.53, 46.37, 17.16, 49.02],
    cities: [
      [48.21, 16.37], [47.27, 11.39], [47.07, 15.44], [47.81, 13.04], [47.50, 9.75],
      [46.62, 14.31], [48.31, 14.29], [47.85, 16.52], [47.35, 13.20], [48.17, 13.80],
    ],
  },
  CH: {
    name: "Switzerland", flag: "🇨🇭", continent: "europe",
    bbox: [5.96, 45.82, 10.49, 47.81],
    cities: [
      [47.38, 8.54], [46.20, 6.14], [46.95, 7.45], [47.56, 7.59], [46.52, 6.63],
      [47.05, 8.31], [47.42, 9.37], [46.00, 8.95], [47.22, 8.82], [46.80, 9.83],
    ],
  },
  CZ: {
    name: "Czechia", flag: "🇨🇿", continent: "europe",
    bbox: [12.09, 48.55, 18.86, 51.06],
    cities: [
      [50.08, 14.44], [49.20, 16.61], [49.83, 18.26], [50.21, 15.83], [49.74, 13.37],
      [50.66, 14.04], [49.22, 17.67], [50.23, 12.87], [49.59, 17.25], [48.97, 14.47],
    ],
  },
  SE: {
    name: "Sweden", flag: "🇸🇪", continent: "europe",
    bbox: [11.11, 55.34, 24.17, 69.06],
    cities: [
      [59.33, 18.07], [57.71, 11.97], [55.61, 13.00], [59.86, 17.64], [58.41, 15.62],
      [67.86, 20.23], [63.83, 20.26], [56.16, 15.59], [59.27, 15.21], [62.39, 17.31],
    ],
  },
  NO: {
    name: "Norway", flag: "🇳🇴", continent: "europe",
    bbox: [4.64, 57.98, 31.29, 71.18],
    cities: [
      [59.91, 10.75], [60.39, 5.32], [63.43, 10.39], [58.97, 5.73], [69.65, 18.96],
      [58.15, 8.00], [67.28, 14.40], [59.74, 10.20], [60.15, 11.17], [62.47, 6.15],
    ],
  },
  DK: {
    name: "Denmark", flag: "🇩🇰", continent: "europe",
    bbox: [8.08, 54.56, 15.16, 57.75],
    cities: [
      [55.68, 12.57], [56.16, 10.21], [55.40, 10.39], [57.05, 9.92], [55.49, 8.45],
      [55.23, 11.76], [56.46, 9.40], [55.72, 9.53], [56.04, 12.61], [54.91, 9.79],
    ],
  },
  FI: {
    name: "Finland", flag: "🇫🇮", continent: "europe",
    bbox: [20.56, 59.81, 31.59, 70.09],
    cities: [
      [60.17, 24.94], [61.50, 23.79], [60.45, 22.27], [65.01, 25.47], [62.24, 25.75],
      [60.98, 25.66], [62.89, 27.68], [61.06, 28.19], [60.21, 24.66], [66.50, 25.73],
    ],
  },
  IE: {
    name: "Ireland", flag: "🇮🇪", continent: "europe",
    bbox: [-10.48, 51.42, -6.00, 55.39],
    cities: [
      [53.35, -6.26], [51.90, -8.47], [53.27, -9.05], [52.66, -8.63], [54.60, -5.93],
      [53.28, -6.35], [52.26, -7.11], [54.27, -8.47], [53.14, -6.06], [51.85, -8.30],
    ],
  },
  PT: {
    name: "Portugal", flag: "🇵🇹", continent: "europe",
    bbox: [-9.53, 36.96, -6.19, 42.15],
    cities: [
      [38.72, -9.14], [41.15, -8.61], [41.55, -8.42], [40.20, -8.41], [37.02, -7.93],
      [38.57, -7.91], [32.67, -16.92], [38.72, -9.15], [39.23, -8.68], [40.64, -8.65],
    ],
  },
  GR: {
    name: "Greece", flag: "🇬🇷", continent: "europe",
    bbox: [19.37, 34.80, 28.25, 41.75],
    cities: [
      [37.98, 23.73], [40.64, 22.94], [35.34, 25.14], [39.37, 22.94], [38.25, 21.73],
      [35.51, 24.02], [41.12, 25.40], [39.62, 19.92], [37.94, 23.65], [36.44, 28.22],
    ],
  },
  HU: {
    name: "Hungary", flag: "🇭🇺", continent: "europe",
    bbox: [16.11, 45.74, 22.90, 48.59],
    cities: [
      [47.50, 19.04], [47.53, 21.63], [46.25, 20.15], [47.68, 17.63], [46.07, 18.23],
      [47.19, 18.41], [48.10, 20.79], [46.84, 16.84], [46.35, 17.80], [47.19, 20.20],
    ],
  },
  RO: {
    name: "Romania", flag: "🇷🇴", continent: "europe",
    bbox: [20.26, 43.62, 29.71, 48.27],
    cities: [
      [44.43, 26.10], [46.77, 23.59], [45.75, 21.23], [47.16, 27.59], [44.32, 23.80],
      [45.64, 25.59], [46.54, 24.56], [45.80, 24.15], [44.18, 28.63], [47.05, 21.92],
    ],
  },
  UA: {
    name: "Ukraine", flag: "🇺🇦", continent: "europe",
    bbox: [22.14, 44.39, 40.23, 52.38],
    cities: [
      [50.45, 30.52], [49.84, 24.03], [48.46, 35.04], [46.48, 30.73], [49.99, 36.23],
      [48.62, 22.30], [49.23, 28.47], [47.84, 35.14], [50.91, 34.80], [48.92, 24.71],
    ],
  },
  US: {
    name: "United States", flag: "🇺🇸", continent: "north-america",
    bbox: [-125.0, 24.5, -66.9, 49.4],
    cities: [
      [40.71, -74.01], [34.05, -118.24], [41.88, -87.63], [29.76, -95.37], [33.45, -112.07],
      [39.95, -75.17], [29.42, -98.49], [32.78, -96.80], [37.77, -122.42], [47.61, -122.33],
      [25.76, -80.19], [42.36, -71.06], [38.91, -77.04], [39.74, -104.99], [33.75, -84.39],
      [36.17, -86.78], [45.52, -122.68], [32.72, -117.16], [39.10, -94.58], [30.27, -97.74],
    ],
  },
  CA: {
    name: "Canada", flag: "🇨🇦", continent: "north-america",
    bbox: [-141.0, 41.7, -52.6, 60.0],
    cities: [
      [43.65, -79.38], [45.50, -73.57], [49.28, -123.12], [51.05, -114.07], [53.55, -113.49],
      [45.42, -75.70], [49.90, -97.14], [44.65, -63.58], [43.26, -79.87], [42.98, -81.25],
    ],
  },
  MX: {
    name: "Mexico", flag: "🇲🇽", continent: "north-america",
    bbox: [-118.4, 14.5, -86.7, 32.7],
    cities: [
      [19.43, -99.13], [20.67, -103.35], [25.69, -100.32], [19.19, -96.14], [21.16, -86.85],
      [20.97, -89.62], [32.51, -117.04], [19.04, -98.20], [24.81, -107.39], [16.75, -93.13],
    ],
  },
  BR: {
    name: "Brazil", flag: "🇧🇷", continent: "south-america",
    bbox: [-74.0, -33.75, -34.8, 5.27],
    cities: [
      [-23.55, -46.63], [-22.91, -43.17], [-15.78, -47.93], [-12.97, -38.50], [-25.43, -49.27],
      [-30.03, -51.23], [-3.72, -38.54], [-8.05, -34.88], [-19.92, -43.94], [-3.12, -60.02],
    ],
  },
  AR: {
    name: "Argentina", flag: "🇦🇷", continent: "south-america",
    bbox: [-73.6, -55.1, -53.6, -21.8],
    cities: [
      [-34.60, -58.38], [-31.42, -64.18], [-32.89, -68.83], [-24.79, -65.41], [-38.72, -62.27],
      [-26.82, -65.22], [-27.45, -58.98], [-38.95, -68.06], [-45.87, -67.50], [-54.80, -68.30],
    ],
  },
  CL: {
    name: "Chile", flag: "🇨🇱", continent: "south-america",
    bbox: [-75.6, -55.9, -66.4, -17.5],
    cities: [
      [-33.45, -70.67], [-36.82, -73.05], [-33.05, -71.62], [-18.48, -70.31], [-41.47, -72.94],
      [-23.65, -70.40], [-29.90, -71.25], [-39.81, -73.25], [-53.16, -70.91], [-20.23, -70.14],
    ],
  },
  CO: {
    name: "Colombia", flag: "🇨🇴", continent: "south-america",
    bbox: [-79.0, -4.2, -66.9, 12.5],
    cities: [
      [4.71, -74.07], [6.24, -75.58], [3.45, -76.53], [10.96, -74.80], [11.24, -74.21],
      [7.89, -72.50], [4.81, -75.69], [10.39, -75.51], [7.13, -73.12], [1.21, -77.28],
    ],
  },
  JP: {
    name: "Japan", flag: "🇯🇵", continent: "asia",
    bbox: [129.5, 31.0, 145.8, 45.5],
    cities: [
      [35.68, 139.69], [34.69, 135.50], [35.18, 136.91], [43.06, 141.35], [33.59, 130.40],
      [35.44, 139.64], [26.21, 127.68], [34.39, 132.46], [38.27, 140.87], [36.56, 136.66],
    ],
  },
  KR: {
    name: "South Korea", flag: "🇰🇷", continent: "asia",
    bbox: [125.9, 33.1, 129.6, 38.6],
    cities: [
      [37.57, 126.98], [35.18, 129.08], [35.87, 128.60], [37.46, 126.70], [35.15, 126.85],
      [36.35, 127.38], [37.28, 127.01], [35.54, 129.31], [33.50, 126.53], [37.89, 127.73],
    ],
  },
  CN: {
    name: "China", flag: "🇨🇳", continent: "asia",
    bbox: [73.5, 18.2, 134.8, 53.6],
    cities: [
      [39.90, 116.41], [31.23, 121.47], [23.13, 113.26], [30.57, 104.07], [22.54, 114.06],
      [29.56, 106.55], [32.06, 118.80], [30.27, 120.15], [36.07, 120.38], [34.26, 108.95],
    ],
  },
  IN: {
    name: "India", flag: "🇮🇳", continent: "asia",
    bbox: [68.2, 6.7, 97.4, 35.5],
    cities: [
      [19.08, 72.88], [28.61, 77.21], [12.97, 77.59], [22.57, 88.36], [13.08, 80.27],
      [17.39, 78.49], [18.52, 73.86], [26.91, 75.79], [23.03, 72.58], [21.15, 79.09],
    ],
  },
  AU: {
    name: "Australia", flag: "🇦🇺", continent: "oceania",
    bbox: [113.3, -43.6, 153.6, -10.7],
    cities: [
      [-33.87, 151.21], [-37.81, 144.96], [-27.47, 153.03], [-31.95, 115.86], [-34.93, 138.60],
      [-35.28, 149.13], [-42.88, 147.33], [-12.46, 130.84], [-16.92, 145.78], [-32.93, 151.78],
    ],
  },
  NZ: {
    name: "New Zealand", flag: "🇳🇿", continent: "oceania",
    bbox: [166.5, -47.3, 178.6, -34.4],
    cities: [
      [-36.85, 174.76], [-41.29, 174.78], [-43.53, 172.64], [-45.87, 170.50], [-37.79, 175.28],
      [-39.06, 174.08], [-38.14, 176.25], [-41.27, 173.28], [-46.41, 168.35], [-35.73, 174.32],
    ],
  },
  AE: {
    name: "United Arab Emirates", flag: "🇦🇪", continent: "asia",
    bbox: [51.5, 22.6, 56.4, 26.1],
    cities: [
      [25.20, 55.27], [24.45, 54.38], [25.35, 55.39], [25.41, 55.51], [24.13, 55.80],
      [25.07, 55.14], [25.79, 55.94], [24.21, 55.74], [25.13, 56.33], [24.98, 55.17],
    ],
  },
  TR: {
    name: "Turkey", flag: "🇹🇷", continent: "asia",
    bbox: [26.0, 35.8, 44.8, 42.3],
    cities: [
      [41.01, 28.98], [39.93, 32.86], [38.42, 27.14], [37.00, 35.32], [40.19, 29.06],
      [36.90, 30.71], [38.73, 35.32], [41.00, 39.72], [37.87, 32.48], [41.29, 36.33],
    ],
  },
  ZA: {
    name: "South Africa", flag: "🇿🇦", continent: "africa",
    bbox: [16.3, -34.8, 32.9, -22.1],
    cities: [
      [-26.20, 28.04], [-33.92, 18.42], [-29.86, 31.03], [-25.75, 28.19], [-33.96, 25.60],
      [-26.20, 28.23], [-29.12, 26.22], [-25.47, 30.97], [-28.73, 24.76], [-33.93, 18.86],
    ],
  },
  EG: {
    name: "Egypt", flag: "🇪🇬", continent: "africa",
    bbox: [24.7, 21.7, 36.9, 31.7],
    cities: [
      [30.04, 31.24], [31.20, 29.92], [25.69, 32.64], [31.04, 31.38], [30.01, 31.21],
      [29.96, 32.55], [27.18, 31.19], [24.09, 32.90], [31.27, 32.30], [30.79, 31.00],
    ],
  },
  NG: {
    name: "Nigeria", flag: "🇳🇬", continent: "africa",
    bbox: [2.7, 4.3, 14.7, 13.9],
    cities: [
      [6.52, 3.38], [9.08, 7.40], [12.00, 8.59], [4.82, 7.05], [10.31, 9.84],
      [7.38, 3.95], [11.85, 13.16], [6.45, 7.51], [5.50, 7.03], [8.48, 4.54],
    ],
  },
  ID: {
    name: "Indonesia", flag: "🇮🇩", continent: "asia",
    bbox: [95.0, -11.0, 141.0, 6.1],
    cities: [
      [-6.21, 106.85], [-7.26, 112.75], [-6.92, 107.61], [3.60, 98.68], [-5.15, 119.43],
      [-8.65, 115.22], [1.47, 124.84], [-0.95, 100.35], [-2.99, 104.76], [-7.80, 110.36],
    ],
  },
  TH: {
    name: "Thailand", flag: "🇹🇭", continent: "asia",
    bbox: [97.3, 5.6, 105.6, 20.5],
    cities: [
      [13.76, 100.50], [18.79, 98.99], [12.92, 100.88], [7.88, 98.39], [13.36, 100.98],
      [16.82, 100.27], [14.97, 102.10], [9.14, 99.33], [15.70, 100.12], [6.87, 101.25],
    ],
  },
  SG: {
    name: "Singapore", flag: "🇸🇬", continent: "asia",
    bbox: [103.6, 1.16, 104.1, 1.47],
    cities: [
      [1.35, 103.82], [1.30, 103.85], [1.37, 103.95], [1.44, 103.79], [1.31, 103.76],
      [1.34, 103.69], [1.36, 103.89], [1.32, 103.93], [1.38, 103.84], [1.29, 103.85],
    ],
  },
};

export const CONTINENTS = {
  europe: {
    name: "Europe", flag: "🇪🇺",
    bbox: [-25, 34, 45, 72],
    cities: [
      [48.86, 2.35], [52.52, 13.40], [41.90, 12.50], [40.42, -3.70], [38.72, -9.14],
      [52.37, 4.90], [50.08, 14.44], [48.21, 16.37], [47.50, 19.04], [37.98, 23.73],
      [59.33, 18.07], [59.91, 10.75], [60.17, 24.94], [53.35, -6.26], [55.95, -3.19],
      [41.39, 2.17], [45.46, 9.19], [48.14, 11.58], [55.68, 12.57], [50.85, 4.35],
      [52.23, 21.01], [41.01, 28.98], [59.33, 18.06], [47.38, 8.54],
    ],
  },
  "north-america": {
    name: "North America", flag: "🌎",
    bbox: [-168, 7, -52, 72],
    cities: [
      [40.71, -74.01], [34.05, -118.24], [41.88, -87.63], [43.65, -79.38], [19.43, -99.13],
      [49.28, -123.12], [25.76, -80.19], [29.76, -95.37], [45.50, -73.57], [37.77, -122.42],
      [47.61, -122.33], [39.74, -104.99], [32.72, -117.16], [45.42, -75.70], [20.67, -103.35],
      [21.16, -86.85], [38.91, -77.04], [42.36, -71.06], [51.05, -114.07], [23.11, -82.37],
    ],
  },
  "south-america": {
    name: "South America", flag: "🌎",
    bbox: [-81.5, -55.8, -34.8, 12.5],
    cities: [
      [-23.55, -46.63], [-34.60, -58.38], [-33.45, -70.67], [-12.04, -77.03], [4.71, -74.07],
      [-22.91, -43.17], [-15.78, -47.93], [-0.18, -78.47], [-16.50, -68.15], [-34.90, -56.16],
      [-25.43, -49.27], [-3.72, -38.54], [-8.05, -34.88], [10.48, -66.90], [-31.42, -64.18],
    ],
  },
  asia: {
    name: "Asia", flag: "🌏",
    bbox: [26, -10, 146, 55],
    cities: [
      [35.68, 139.69], [31.23, 121.47], [28.61, 77.21], [13.76, 100.50], [1.35, 103.82],
      [37.57, 126.98], [25.20, 55.27], [41.01, 28.98], [39.90, 116.41], [19.08, 72.88],
      [-6.21, 106.85], [14.60, 120.98], [22.32, 114.17], [3.14, 101.69], [21.03, 105.85],
      [33.87, 35.51], [24.71, 46.68], [31.77, 35.22], [35.18, 129.08], [23.81, 90.41],
    ],
  },
  africa: {
    name: "Africa", flag: "🌍",
    bbox: [-18, -35, 52, 37],
    cities: [
      [30.04, 31.24], [-26.20, 28.04], [6.52, 3.38], [-33.92, 18.42], [-1.29, 36.82],
      [33.57, -7.59], [5.56, -0.21], [9.03, 38.74], [36.81, 10.18], [14.72, -17.47],
      [12.65, -8.00], [-4.32, 15.31], [15.50, 32.56], [32.89, 13.19], [-17.83, 31.05],
    ],
  },
  oceania: {
    name: "Oceania", flag: "🌏",
    bbox: [110, -47, 180, 0],
    cities: [
      [-33.87, 151.21], [-37.81, 144.96], [-36.85, 174.76], [-27.47, 153.03], [-41.29, 174.78],
      [-31.95, 115.86], [-43.53, 172.64], [-35.28, 149.13], [-16.92, 145.78], [-9.44, 147.18],
    ],
  },
};

const TZ_COUNTRY = {
  "Europe/Warsaw": "PL", "Europe/Berlin": "DE", "Europe/Paris": "FR",
  "Europe/London": "GB", "Europe/Madrid": "ES", "Europe/Rome": "IT",
  "Europe/Amsterdam": "NL", "Europe/Brussels": "BE", "Europe/Vienna": "AT",
  "Europe/Zurich": "CH", "Europe/Prague": "CZ", "Europe/Stockholm": "SE",
  "Europe/Oslo": "NO", "Europe/Copenhagen": "DK", "Europe/Helsinki": "FI",
  "Europe/Dublin": "IE", "Europe/Lisbon": "PT", "Europe/Athens": "GR",
  "Europe/Budapest": "HU", "Europe/Bucharest": "RO", "Europe/Kyiv": "UA",
  "Europe/Kiev": "UA", "Europe/Sofia": "BG", "Europe/Belgrade": "RS",
  "Europe/Zagreb": "HR", "Europe/Bratislava": "CZ", "Europe/Ljubljana": "IT",
  "Europe/Moscow": "RU", "Europe/Istanbul": "TR", "Europe/Andorra": "ES",
  "Europe/Luxembourg": "BE", "Europe/Malta": "IT", "Europe/Monaco": "FR",
  "Atlantic/Reykjavik": "GB", "Atlantic/Canary": "ES", "Atlantic/Madeira": "PT",
  "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US",
  "America/Los_Angeles": "US", "America/Phoenix": "US", "America/Anchorage": "US",
  "Pacific/Honolulu": "US", "America/Detroit": "US", "America/Boise": "US",
  "America/Indiana/Indianapolis": "US", "America/Kentucky/Louisville": "US",
  "America/Toronto": "CA", "America/Vancouver": "CA", "America/Edmonton": "CA",
  "America/Winnipeg": "CA", "America/Halifax": "CA", "America/St_Johns": "CA",
  "America/Mexico_City": "MX", "America/Tijuana": "MX", "America/Cancun": "MX",
  "America/Monterrey": "MX", "America/Sao_Paulo": "BR", "America/Fortaleza": "BR",
  "America/Recife": "BR", "America/Manaus": "BR", "America/Bahia": "BR",
  "America/Argentina/Buenos_Aires": "AR", "America/Santiago": "CL",
  "America/Bogota": "CO", "America/Lima": "PE", "America/Caracas": "VE",
  "America/Guayaquil": "EC", "America/La_Paz": "BO", "America/Asuncion": "PY",
  "America/Montevideo": "UY", "America/Havana": "CU",
  "Asia/Tokyo": "JP", "Asia/Seoul": "KR", "Asia/Shanghai": "CN",
  "Asia/Hong_Kong": "CN", "Asia/Taipei": "CN", "Asia/Urumqi": "CN",
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN", "Asia/Dubai": "AE",
  "Asia/Singapore": "SG", "Asia/Bangkok": "TH", "Asia/Jakarta": "ID",
  "Asia/Makassar": "ID", "Asia/Istanbul": "TR", "Asia/Jerusalem": "IL",
  "Asia/Riyadh": "SA", "Asia/Karachi": "PK", "Asia/Dhaka": "BD",
  "Asia/Ho_Chi_Minh": "VN", "Asia/Manila": "PH", "Asia/Kuala_Lumpur": "MY",
  "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Brisbane": "AU",
  "Australia/Perth": "AU", "Australia/Adelaide": "AU", "Australia/Hobart": "AU",
  "Pacific/Auckland": "NZ", "Pacific/Fiji": "NZ",
  "Africa/Cairo": "EG", "Africa/Johannesburg": "ZA", "Africa/Lagos": "NG",
  "Africa/Nairobi": "KE", "Africa/Casablanca": "MA", "Africa/Accra": "GH",
  "Africa/Tunis": "TN", "Africa/Algiers": "DZ",
};

const LANG_COUNTRY = {
  pl: "PL", de: "DE", fr: "FR", es: "ES", it: "IT", nl: "NL", pt: "PT",
  sv: "SE", no: "NO", da: "DK", fi: "FI", el: "GR", hu: "HU", ro: "RO",
  uk: "UA", ja: "JP", ko: "KR", zh: "CN", hi: "IN", th: "TH", id: "ID",
  tr: "TR", ar: "EG", cs: "CZ",
  "en-US": "US", "en-GB": "GB", "en-AU": "AU", "en-CA": "CA", "en-NZ": "NZ",
  "en-IE": "IE", "pt-BR": "BR", "es-MX": "MX", "es-AR": "AR", "es-CL": "CL",
  "es-CO": "CO", "fr-CA": "CA", "zh-CN": "CN", "zh-TW": "CN", "zh-HK": "CN",
};

function countryFromTimeZone(tz) {
  if (!tz) return null;
  if (TZ_COUNTRY[tz]) return TZ_COUNTRY[tz];
  if (tz.startsWith("America/Argentina")) return "AR";
  if (tz.startsWith("America/Indiana") || tz.startsWith("America/Kentucky") || tz.startsWith("America/North_Dakota")) return "US";
  if (tz.startsWith("US/")) return "US";
  if (tz.startsWith("Canada/")) return "CA";
  if (tz.startsWith("Australia/")) return "AU";
  if (tz.startsWith("Pacific/Honolulu") || tz.startsWith("US/Hawaii") || tz.startsWith("US/Alaska")) return "US";
  return null;
}

function countryFromLanguage(tag) {
  if (!tag) return null;
  const raw = String(tag);
  if (LANG_COUNTRY[raw]) return LANG_COUNTRY[raw];
  const lower = raw.toLowerCase();
  if (LANG_COUNTRY[lower]) return LANG_COUNTRY[lower];
  try {
    const loc = new Intl.Locale(raw);
    if (loc.region && COUNTRIES[loc.region]) return loc.region;
    const lang = (loc.language || "").toLowerCase();
    if (LANG_COUNTRY[lang]) return LANG_COUNTRY[lang];
  } catch {
    /* ignore */
  }
  const base = lower.split("-")[0];
  return LANG_COUNTRY[base] || null;
}

function pickCity(list) {
  const [lat, lon] = list[Math.floor(Math.random() * list.length)];
  return { lat, lon };
}

function makePack(countryCode) {
  const code = COUNTRIES[countryCode] ? countryCode : "PL";
  const country = COUNTRIES[code];
  const continentId = country.continent;
  const continent = CONTINENTS[continentId] || CONTINENTS.europe;
  return { countryCode: code, country, continentId, continent };
}

let pack = makePack("PL");

export function detectLocale() {
  let tz = "";
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch { /* ignore */ }
  const langs = (typeof navigator !== "undefined" && navigator.languages) || [];
  const lang = langs[0] || (typeof navigator !== "undefined" && navigator.language) || "";
  const code = countryFromTimeZone(tz) || countryFromLanguage(lang) || "PL";
  pack = makePack(COUNTRIES[code] ? code : "PL");
  return pack;
}

export function getRegionPack() {
  return pack;
}

export function setRegionPack(countryCode, continentId) {
  pack = makePack(countryCode || pack.countryCode);
  if (continentId && CONTINENTS[continentId]) {
    pack = {
      ...pack,
      continentId,
      continent: CONTINENTS[continentId],
    };
  }
  return pack;
}

export function regionPayload() {
  return { country: pack.countryCode, continent: pack.continentId };
}

export function pickCountryStart() {
  return pickCity(pack.country.cities);
}

export function pickContinentStart() {
  return pickCity(pack.continent.cities);
}

export function guessHoldAlt(scope) {
  if (scope !== "pl") return 9500;
  const [lon0, lat0, lon1, lat1] = pack.country.bbox;
  return Math.hypot(lon1 - lon0, lat1 - lat0) > 25 ? 7000 : 3000;
}

detectLocale();
