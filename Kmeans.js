// Fungsi untuk menghitung jarak Euclidean antara dua vektor
function euclideanDistance(vector1, vector2) {
  let sum = 0;
  for (let i = 0; i < vector1.length; i++) {
    sum += Math.pow(vector1[i] - vector2[i], 2);
  }
  return Math.sqrt(sum);
}
// Fungsi untuk menginisialisasi pusat klaster secara acak
const latihan = 1;
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
// console.log("Jarak dari setiap data ke setiap pusat klaster:");
// for (let i = 0; i < distances.length; i++) {
//   console.log(`Data ${i + 1}: ${distances[i].join(", ")}`);
// }

// Array untuk menyimpan klaster untuk setiap kolom
const clustersByColumn = {
  C1: [],
  C2: [],
  C3: [],
  C4: []
};

// Menentukan klaster untuk setiap kolom
for (let i = 0; i < distances.length; i++) {
  clustersByColumn.C1.push(distances[i][0]);
  clustersByColumn.C2.push(distances[i][1]);
  clustersByColumn.C3.push(distances[i][2]);
  clustersByColumn.C4.push(distances[i][3]);
}

// Menampilkan klaster untuk setiap kolom
console.log("Klaster untuk setiap kolom:");
Object.keys(clustersByColumn).forEach(column => {
  console.log(`${column}: ${clustersByColumn[column].join(", ")}`);
});

// Array untuk menyimpan indeks baris dengan nilai minimum di setiap kolom
const minRowsInColumns = {};

// Menentukan indeks baris dengan nilai minimum di setiap kolom
for (let col = 0; col < distances[0].length; col++) {
  let minValue = Infinity;
  let minRow = -1;
  for (let row = 0; row < distances.length; row++) {
    if (distances[row][col] < minValue) {
      minValue = distances[row][col];
      minRow = row;
    }
  }
  minRowsInColumns[`C${col + 1}`] = minRow; // Simpan indeks baris paling minimal
}

// Menampilkan hasil baris dengan nilai minimum di setiap kolom
console.log("Baris dengan nilai minimum di setiap kolom:");
for (let column in minRowsInColumns) {
  console.log(`${column} = Data ${minRowsInColumns[column] + 1}`);
}
