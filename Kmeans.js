// Fungsi untuk menghitung jarak Euclidean antara dua vektor
function euclideanDistance(vector1, vector2) {
  let sum = 0;
  for (let i = 0; i < vector1.length; i++) {
    sum += Math.pow(vector1[i] - vector2[i], 2);
  }
  return Math.sqrt(sum);
}

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

// Fungsi untuk melakukan klasterisasi K-Means dengan pembelajaran mesin
function kmeansMachineLearning(data, k, maxIterations = 100) {
  return kmeans(data, k, maxIterations);
}


//konversi
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
      return value === "cukup" ? 1 : 2;
    default:
      return "Unknown";
  }
}


// array 0: suhuAir, 1: suhuUdara, 2: kelembapan, 3: nutrisi, 4: ketinggianAir
const dummySensorData = [
  [25, 24, 90, 750, "kurang"],
  // [11, 22, 80, 21, "kurang"],
  // [10, 18, 75, 28, "cukup"],
  // [33, 24, 65, 50, "cukup"],
  // [29, 28, 72, 40, "kurang"],
];

// Nama-nama kolom
const columnNames = [
  "suhuAir",
  "suhuUdara",
  "kelembapan",
  "nutrisi",
  "ketinggianAir",
];

// Konversi data dummy ke dalam rentang nilai
const convertedData = dummySensorData.map((sensorData) => {
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
  clusters = kmeansMachineLearning(convertedData, k);
}


// Menampilkan hasil konversi
console.log("Hasil Konversi:");
convertedData.forEach((sensorData, index) => {
  console.log(`Data ${index + 1}: ${sensorData.join(", ")}`);
});

// Menampilkan hasil klaster
console.log("Klaster untuk Data Sensor:");
clusters.forEach((cluster, index) => {
  console.log(`Data ${index + 1} termasuk dalam Klaster ${cluster}`);
});
