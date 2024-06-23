// Fungsi untuk menghitung jarak Euclidean antara dua vektor
function euclideanDistance(vector1, vector2) {
  let sum = 0;
  for (let i = 0; i < vector1.length; i++) {
    sum += Math.pow(vector1[i] - vector2[i], 2);
  }
  return Math.sqrt(sum);
}

let gagal = null;

// Fungsi untuk menginisialisasi pusat klaster secara acak
function initializeCentroids(data, k) {
  const centroids = [];
  const indices = [];
  while (centroids.length < k) {
    const index = Math.floor(Math.random() * data.length);
    if (!indices.includes(index)) {
      indices.push(index);
      centroids.push(data[index]);
    }
  }
  return centroids;
}

// Fungsi untuk mengelompokkan data ke klaster yang sesuai
function assignToClusters(data, centroids) {
  const clusters = new Array(data.length).fill(0);
  for (let i = 0; i < data.length; i++) {
    let minDistance = Infinity;
    let clusterIndex = -1;
    for (let j = 0; j < centroids.length; j++) {
      const distance = euclideanDistance(data[i], centroids[j]);
      if (distance < minDistance) {
        minDistance = distance;
        clusterIndex = j;
      }
    }
    clusters[i] = clusterIndex;
  }
  return clusters;
}

// Fungsi untuk memperbarui pusat klaster berdasarkan rata-rata vektor dalam klaster
function updateCentroids(data, clusters, k) {
  const newCentroids = new Array(k)
    .fill()
    .map(() => new Array(data[0].length).fill(0));
  const clusterCounts = new Array(k).fill(0);
  for (let i = 0; i < data.length; i++) {
    const clusterIndex = clusters[i];
    for (let j = 0; j < data[i].length; j++) {
      newCentroids[clusterIndex][j] += data[i][j];
    }
    clusterCounts[clusterIndex]++;
  }
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < data[0].length; j++) {
      newCentroids[i][j] /= clusterCounts[i];
    }
  }
  return newCentroids;
}

// Fungsi untuk melakukan klasterisasi K-Means
function kmeans(data, k, maxIterations = 100) {
  let centroids = initializeCentroids(data, k);
  let clusters = [];
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    clusters = assignToClusters(data, centroids);
    const newCentroids = updateCentroids(data, clusters, k);
    if (JSON.stringify(newCentroids) === JSON.stringify(centroids)) {
      break; // Berhenti jika pusat klaster tidak berubah
    }
    centroids = newCentroids;
  }
  return clusters;
}

// Konversi data ke dalam rentang nilai
function convertToRange(value, tableName) {
  switch (tableName) {
    case "suhuAir":
      if (value < 20) return 1;
      else if (value >= 20 && value <= 30) return 2;
      else return 3;
    case "suhuUdara":
      if (value < 20) return 1;
      else if (value >= 20 && value <= 30) return 2;
      else return 3;
    case "kelembapan":
      if (value >= 0 && value <= 25) return 1;
      else if (value > 25 && value <= 50) return 2;
      else if (value > 50 && value <= 75) return 3;
      else return 4;
    case "nutrisi":
      if (value < 700) return 1;
      else if (value >= 700 && value <= 1000) return 2;
      else return 3;
    case "ketinggianAir":
      return value === "Cukup" ? 1 : 2;
    default:
      return "Unknown";
  }
}

//aray 0 : suhuAir, 1 : suhuUdara, 2 : kelembapan, 3 : nutrisi, 4 : ketinggianAir
// Data Sensor Dummy
const dummySensorData = [
  [15, 16, 20, 750, "Cukup"],
  [27, 27, 75, 750, "Kurang"],
  [33, 30, 70, 770, "Kurang"],
  [27, 25, 90, 850, "Cukup"],
  [20, 24, 45, 650, "Cukup"],
  [32, 31, 60, 1100, "Cukup"],
  [35, 34, 50, 700, "Kurang"],
  [18, 19, 25, 650, "Kurang"],
  [23, 23, 100, 1200, "Cukup"],
  [25, 24, 90, 850, "Kurang"],
];

// Nama-nama kolom
const columnNames = [
  "suhuAir",
  "suhuUdara",
  "kelembapan",
  "nutrisi",
  "ketinggianAir",
];

const convertedDummyData = dummySensorData.map((sensorData) => {
  const convertedSensorData = sensorData.map((value, index) => {
    return convertToRange(value, columnNames[index]); // Menggunakan nama kolom sebagai tabel yang akan dikonversi
  });
  return convertedSensorData;
});

// Lakukan klasterisasi K-Means dengan jumlah klaster yang diinginkan (4 klaster)
let clusters;
const k = 4;

if (dummySensorData.length <= k) {
  clusters = Array.from(
    { length: dummySensorData.length },
    (_, index) => index + 1
  );
} else {
  clusters = kmeans(convertedDummyData, k);
}
// console.log("Klaster untuk Data Sensor:");
// clusters.forEach((cluster, index) => {
//   let action;
//   switch (cluster) {
//     case 1:
//       action = "Tindakan tambah air";
//       break;
//     case 2:
//       action = "Tindakan tambah nutrisi";
//       break;
//     case 3:
//       action = "Tindakan tambah air dan nutrisi";
//       break;
//     case 4:
//       action = "Tindakan mist";
//       break;
//     default:
//       action = "Tidak ada tindakan";
//   }
//   console.log(`Data ${index + 1} termasuk dalam Klaster ${cluster}: ${action}`);
// });

// function printClusterData(data, clusters) {
//   const clusterData = {};
//   clusters.forEach((cluster, index) => {
//     if (!clusterData.hasOwnProperty(cluster)) {
//       clusterData[cluster] = [];
//     }
//     clusterData[cluster].push(data[index]);
//   });

//   console.log("\nData dalam setiap Klaster:");
//   Object.keys(clusterData).forEach((clusterIndex) => {
//     console.log(`Klaster ${clusterIndex}:`);
//     clusterData[clusterIndex].forEach((dataPoint, index) => {
//       console.log(`  Data ${index + 1}: [${dataPoint.join(", ")}]`);
//     });
//   });
// }

// Contoh penggunaan untuk mencetak data dalam setiap klaster
// printClusterData(convertedDummyData, clusters);

// Ambil 4 data dummy yang memiliki 4 tindakan berbeda
// const selectedDummyData = [
//   convertedDummyData[0], // Tindakan tambah air
//   convertedDummyData[1], // Tindakan tambah nutrisi
//   convertedDummyData[2], // Tindakan tambah air dan nutrisi
//   convertedDummyData[5], // Tindakan mist
// ];

// // Hitung pusat klaster awal (rata-rata fitur)
// const initialCentroids = selectedDummyData.reduce((acc, dataPoint) => {
//   for (let i = 0; i < dataPoint.length - 1; i++) {
//     acc[i] = acc[i] || [];
//     acc[i].push(dataPoint[i]);
//   }
//   return acc;
// }, []);

// const initialCentroidsAverage = initialCentroids.map((featureValues) => {
//   const sum = featureValues.reduce((total, value) => total + value, 0);
//   return sum / featureValues.length;
// });

// console.log("Pusat Klaster Awal:");
// console.log(initialCentroidsAverage);

console.log("Data Konversi:");
console.log(convertedDummyData);

const centroids = [
  [1, 1, 1, 2, 1],
  [2, 2, 3, 2, 2],
  [3, 2, 3, 2, 2],
  [2, 2, 2, 1, 1],
];
const distances = [];
for (let i = 0; i < convertedDummyData.length; i++) {
  const rowData = convertedDummyData[i];
  const rowDistances = [];
  for (let j = 0; j < centroids.length; j++) {
    const centroid = centroids[j];
    let sumOfSquaredDifferences = 0;
    for (let k = 0; k < rowData.length; k++) {
      // Perhitungan menggunakan semua fitur dalam rowData
      sumOfSquaredDifferences += Math.pow(centroid[k] - rowData[k], 2);
    }
    const distance = Math.sqrt(sumOfSquaredDifferences);
    rowDistances.push(distance.toFixed(3)); // Simpan jarak dengan tepat 3 desimal
  }
  distances.push(rowDistances);
}

// Menampilkan hasil jarak
console.log("Jarak dari setiap data ke setiap pusat klaster:");
for (let i = 0; i < distances.length; i++) {
  console.log(`Data ${i + 1}: ${distances[i].join(", ")}`);
}
