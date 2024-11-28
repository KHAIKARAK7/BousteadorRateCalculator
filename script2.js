function calculateDuration() {
  // Get inputs
  const startDate = document.getElementById("startDate").value;
  const startTime = document.getElementById("startTime").value;
  const endDate = document.getElementById("endDate").value;
  const endTime = document.getElementById("endTime").value;

  // Validate inputs
  if (!startDate || !startTime || !endDate || !endTime) {
    alert("Please select both dates and times!");
    return;
  }

  // Convert inputs to Date objects
  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);

  if (end <= start) {
    alert("End date and time must be after start date and time!");
    return;
  }

  // Calculate duration
  const diff = end - start;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Update duration
  document.getElementById("duration").innerText = `${hours} hour ${minutes} min ${seconds} sec`;

  // Update days
  document.getElementById("startDay").innerText = start.toLocaleDateString('en-US', { weekday: 'long' });
  document.getElementById("endDay").innerText = end.toLocaleDateString('en-US', { weekday: 'long' });
}




function calculateParkingFee() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Ambil data input
  var startDate = sheet.getRange("B5").getValue();
  var endDate = sheet.getRange("F5").getValue();
  var startTime = sheet.getRange("B9").getValue();
  var startMin = sheet.getRange("C9").getValue();
  var startSec = sheet.getRange("D9").getValue();
  var endTime = sheet.getRange("F9").getValue();
  var endMin = sheet.getRange("G9").getValue();
  var endSec = sheet.getRange("H9").getValue();
  
  // Validasi input
  if (!startDate || !endDate || startTime === "" || startMin === "" || startSec === "" || endTime === "" || endMin === "" || endSec === "") {
    SpreadsheetApp.getUi().alert("Harap isi semua tanggal dan waktu dengan benar!");
    return;
  }
  
  // Buat objek Date untuk waktu mulai dan akhir
  var startDateTime = new Date(startDate);
  startDateTime.setHours(startTime, startMin, startSec);
  
  var endDateTime = new Date(endDate);
  endDateTime.setHours(endTime, endMin, endSec);
  
  // Validasi durasi (akhir harus setelah mulai)
  if (endDateTime <= startDateTime) {
    SpreadsheetApp.getUi().alert("Tanggal dan waktu akhir harus lebih besar dari tanggal dan waktu mulai!");
    return;
  }
  
  // Hitung total durasi dalam jam
  var durationMillis = endDateTime - startDateTime;
  var durationHours = Math.ceil(durationMillis / (1000 * 60 * 60)); // Dibulatkan ke atas
  
  // Variabel untuk total harga
  var totalPrice = 0;
  var currentDate = new Date(startDateTime);
  var remainingHours = durationHours;
  
  // Hitung biaya berdasarkan hari
  while (remainingHours > 0) {
    var currentDay = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), "EEEE").toUpperCase();
    var hoursForDay = Math.min(24, remainingHours); // Maksimal 24 jam per hari
    
    if (currentDay === "SATURDAY" || currentDay === "SUNDAY") {
      // Tarif tetap untuk akhir pekan
      totalPrice += 3;
    } else {
      // Hitung tarif untuk hari kerja
      totalPrice += calculateWeekdayRate(hoursForDay);
    }
    
    // Kurangi jam yang telah dihitung
    remainingHours -= hoursForDay;
    // Pindah ke hari berikutnya
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Tampilkan hasil di cell (dengan format RM)
  sheet.getRange("B17").setValue("RM" + totalPrice.toFixed(2));
}

// Fungsi pembantu untuk menghitung tarif hari kerja
function calculateWeekdayRate(hours) {
  var price = 0;
  
  if (hours >= 1) {
    // Jam pertama dengan tarif RM3
    price += 3;
    
    // Jam ke-2 hingga ke-7 dengan tarif RM2/jam
    if (hours > 1 && hours <= 7) {
      price += (hours - 1) * 2;
    } else if (hours > 7) {
      price += 6 * 2; // RM12 untuk jam ke-2 hingga ke-7
      // Sisa jam setelah jam ke-7 dengan tarif RM1/jam
      price += (hours - 7) * 1;
    }
  }
  
  return price;
}

document.getElementById("calculate-btn").addEventListener("click", calculateParkingFee);

function calculateParkingFee() {
  // Ambil input dari HTML
  const startDate = document.getElementById("start-date").value;
  const startTime = document.getElementById("start-time").value;
  const endDate = document.getElementById("end-date").value;
  const endTime = document.getElementById("end-time").value;

  // Validasi input
  if (!startDate || !startTime || !endDate || !endTime) {
    alert("Harap isi semua tanggal dan waktu dengan benar!");
    return;
  }

  // Buat objek Date untuk waktu mulai dan akhir
  const startDateTime = new Date(`${startDate}T${startTime}`);
  const endDateTime = new Date(`${endDate}T${endTime}`);

  // Validasi durasi (akhir harus setelah mulai)
  if (endDateTime <= startDateTime) {
    alert("Tanggal dan waktu akhir harus lebih besar dari tanggal dan waktu mulai!");
    return;
  }

  // Hitung durasi dalam jam
  const durationMillis = endDateTime - startDateTime;
  const durationHours = Math.ceil(durationMillis / (1000 * 60 * 60)); // Dibulatkan ke atas

  // Hitung total harga
  let totalPrice = 0;
  let currentDate = new Date(startDateTime);
  let remainingHours = durationHours;

  while (remainingHours > 0) {
    const currentDay = currentDate.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
    const hoursForDay = Math.min(24, remainingHours);

    if (currentDay === "SATURDAY" || currentDay === "SUNDAY") {
      // Tarif tetap untuk akhir pekan
      totalPrice += 3;
    } else {
      // Hitung tarif untuk hari kerja
      totalPrice += calculateWeekdayRate(hoursForDay);
    }

    // Kurangi jam yang telah dihitung
    remainingHours -= hoursForDay;
    // Pindah ke hari berikutnya
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Tampilkan hasil di elemen HTML
  const priceElement = document.getElementById("total-price");
  priceElement.textContent = `Total Price: RM${totalPrice.toFixed(2)}`;
}

// Fungsi pembantu untuk menghitung tarif hari kerja
function calculateWeekdayRate(hours) {
  let price = 0;

  if (hours >= 1) {
    // Jam pertama dengan tarif RM3
    price += 3;

    // Jam ke-2 hingga ke-7 dengan tarif RM2/jam
    if (hours > 1 && hours <= 7) {
      price += (hours - 1) * 2;
    } else if (hours > 7) {
      price += 6 * 2; // RM12 untuk jam ke-2 hingga ke-7
      // Sisa jam setelah jam ke-7 dengan tarif RM1/jam
      price += (hours - 7) * 1;
    }
  }

  return price;
}

document.getElementById("calculate-btn").addEventListener("click", calculateParkingFee);

function calculateParkingFee() {
  // Ambil input dari HTML
  const startDate = document.getElementById("start-date").value;
  const startTime = document.getElementById("start-time").value;
  const endDate = document.getElementById("end-date").value;
  const endTime = document.getElementById("end-time").value;

  // Validasi input
  if (!startDate || !startTime || !endDate || !endTime) {
    alert("Harap isi semua tanggal dan waktu dengan benar!");
    return;
  }

  // Buat objek Date untuk waktu mulai dan akhir
  const startDateTime = new Date(`${startDate}T${startTime}`);
  const endDateTime = new Date(`${endDate}T${endTime}`);

  // Validasi durasi (akhir harus setelah mulai)
  if (endDateTime <= startDateTime) {
    alert("Tanggal dan waktu akhir harus lebih besar dari tanggal dan waktu mulai!");
    return;
  }

  // Hitung durasi dalam milidetik
  const durationMillis = endDateTime - startDateTime;

  // Konversi durasi ke jam, menit, dan detik
  const totalSeconds = Math.floor(durationMillis / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Tampilkan durasi di elemen HTML
  const durationElement = document.getElementById("duration");
  durationElement.textContent = `Duration: ${hours} hour ${minutes} min ${seconds} sec`;

  // Hitung total harga berdasarkan logika tarif
  let totalPrice = 0;
  let currentDate = new Date(startDateTime);
  let remainingHours = Math.ceil(durationMillis / (1000 * 60 * 60)); // Dibulatkan ke atas

  while (remainingHours > 0) {
    const currentDay = currentDate.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
    const hoursForDay = Math.min(24, remainingHours);

    if (currentDay === "SATURDAY" || currentDay === "SUNDAY") {
      // Tarif tetap untuk akhir pekan
      totalPrice += 3;
    } else {
      // Hitung tarif untuk hari kerja
      totalPrice += calculateWeekdayRate(hoursForDay);
    }

    // Kurangi jam yang telah dihitung
    remainingHours -= hoursForDay;
    // Pindah ke hari berikutnya
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Tampilkan total harga di elemen HTML
  const priceElement = document.getElementById("total-price");
  priceElement.textContent = `Total Price: RM${totalPrice.toFixed(2)}`;
}

// Fungsi pembantu untuk menghitung tarif hari kerja
function calculateWeekdayRate(hours) {
  let price = 0;

  if (hours >= 1) {
    // Jam pertama dengan tarif RM3
    price += 3;

    // Jam ke-2 hingga ke-7 dengan tarif RM2/jam
    if (hours > 1 && hours <= 7) {
      price += (hours - 1) * 2;
    } else if (hours > 7) {
      price += 6 * 2; // RM12 untuk jam ke-2 hingga ke-7
      // Sisa jam setelah jam ke-7 dengan tarif RM1/jam
      price += (hours - 7) * 1;
    }
  }

  return price;
}

document.getElementById("calculate-btn").addEventListener("click", calculateParkingFee);

function calculateParkingFee() {
  // Ambil input dari HTML
  const startDate = document.getElementById("start-date").value;
  const startTime = document.getElementById("start-time").value;
  const endDate = document.getElementById("end-date").value;
  const endTime = document.getElementById("end-time").value;

  // Validasi input
  if (!startDate || !startTime || !endDate || !endTime) {
    alert("Harap isi semua tanggal dan waktu dengan benar!");
    return;
  }

  // Buat objek Date untuk waktu mulai dan akhir
  const startDateTime = new Date(`${startDate}T${startTime}`);
  const endDateTime = new Date(`${endDate}T${endTime}`);

  // Validasi durasi (akhir harus setelah mulai)
  if (endDateTime <= startDateTime) {
    alert("Tanggal dan waktu akhir harus lebih besar dari tanggal dan waktu mulai!");
    return;
  }

  // **Tambahan: Tampilkan nama hari (ddd)**
  const startDayElement = document.getElementById("start-day");
  const endDayElement = document.getElementById("end-day");
  
  startDayElement.value = formatDay(startDateTime);
  endDayElement.value = formatDay(endDateTime);

  // Hitung durasi dalam milidetik
  const durationMillis = endDateTime - startDateTime;

  // Konversi durasi ke jam, menit, dan detik
  const totalSeconds = Math.floor(durationMillis / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Tampilkan durasi di elemen HTML
  const durationElement = document.getElementById("duration");
  durationElement.textContent = `Duration: ${hours} hour ${minutes} min ${seconds} sec`;

  // Hitung total harga berdasarkan logika tarif
  let totalPrice = 0;
  let currentDate = new Date(startDateTime);
  let remainingHours = Math.ceil(durationMillis / (1000 * 60 * 60)); // Dibulatkan ke atas

  while (remainingHours > 0) {
    const currentDay = currentDate.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
    const hoursForDay = Math.min(24, remainingHours);

    if (currentDay === "SATURDAY" || currentDay === "SUNDAY") {
      // Tarif tetap untuk akhir pekan
      totalPrice += 3;
    } else {
      // Hitung tarif untuk hari kerja
      totalPrice += calculateWeekdayRate(hoursForDay);
    }

    // Kurangi jam yang telah dihitung
    remainingHours -= hoursForDay;
    // Pindah ke hari berikutnya
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Tampilkan total harga di elemen HTML
  const priceElement = document.getElementById("total-price");
  priceElement.textContent = `Total Price: RM${totalPrice.toFixed(2)}`;
}

// Fungsi pembantu untuk menghitung tarif hari kerja
function calculateWeekdayRate(hours) {
  let price = 0;

  if (hours >= 1) {
    // Jam pertama dengan tarif RM3
    price += 3;

    // Jam ke-2 hingga ke-7 dengan tarif RM2/jam
    if (hours > 1 && hours <= 7) {
      price += (hours - 1) * 2;
    } else if (hours > 7) {
      price += 6 * 2; // RM12 untuk jam ke-2 hingga ke-7
      // Sisa jam setelah jam ke-7 dengan tarif RM1/jam
      price += (hours - 7) * 1;
    }
  }

  return price;
}

// Fungsi format untuk mengonversi hari menjadi "ddd"
function formatDay(date) {
  return date.toLocaleString("en-US", { weekday: "short" }); // Contoh: "Mon", "Tue", "Wed"
}

document.getElementById("calculate-btn").addEventListener("click", () => {
  calculateDuration();
  calculateParkingFee();
});

// Fungsi untuk mengira durasi
function calculateDuration() {
  const startDate = document.getElementById("start-date").value;
  const startTime = document.getElementById("start-time").value;
  const endDate = document.getElementById("end-date").value;
  const endTime = document.getElementById("end-time").value;

  if (!startDate || !startTime || !endDate || !endTime) {
    alert("Harap isi semua tarikh dan waktu dengan betul!");
    return;
  }

  const startDateTime = new Date(`${startDate}T${startTime}`);
  const endDateTime = new Date(`${endDate}T${endTime}`);

  if (endDateTime <= startDateTime) {
    alert("Waktu tamat mesti selepas waktu mula!");
    return;
  }

  const durationMillis = endDateTime - startDateTime;
  const hours = Math.floor(durationMillis / (1000 * 60 * 60));
  const minutes = Math.floor((durationMillis % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((durationMillis % (1000 * 60)) / 1000);

  document.getElementById("duration").textContent = `${hours} jam ${minutes} minit ${seconds} saat`;
}

// Fungsi untuk mengira yuran parkir
function calculateParkingFee() {
  const startDate = document.getElementById("start-date").value;
  const startTime = document.getElementById("start-time").value;
  const endDate = document.getElementById("end-date").value;
  const endTime = document.getElementById("end-time").value;

  if (!startDate || !startTime || !endDate || !endTime) {
    alert("Harap isi semua tarikh dan waktu dengan betul!");
    return;
  }

  const startDateTime = new Date(`${startDate}T${startTime}`);
  const endDateTime = new Date(`${endDate}T${endTime}`);

  if (endDateTime <= startDateTime) {
    alert("Waktu tamat mesti selepas waktu mula!");
    return;
  }

  const durationMillis = endDateTime - startDateTime;
  const durationHours = Math.ceil(durationMillis / (1000 * 60 * 60));

  let totalPrice = 0;
  let remainingHours = durationHours;
  let currentDate = new Date(startDateTime);

  while (remainingHours > 0) {
    const currentDay = currentDate.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
    const hoursForDay = Math.min(24, remainingHours);

    if (["SATURDAY", "SUNDAY"].includes(currentDay)) {
      totalPrice += 3;
    } else {
      totalPrice += calculateWeekdayRate(hoursForDay);
    }

    remainingHours -= hoursForDay;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  document.getElementById("total-price").textContent = `Jumlah Harga: RM${totalPrice.toFixed(2)}`;
}

// Fungsi pembantu untuk tarif hari kerja
function calculateWeekdayRate(hours) {
  let price = 0;
  if (hours >= 1) {
    price += 3; // RM3 untuk jam pertama
    if (hours > 1 && hours <= 7) {
      price += (hours - 1) * 2;
    } else if (hours > 7) {
      price += 6 * 2; // RM12 untuk jam 2 hingga 7
      price += (hours - 7); // RM1 untuk jam selepas 7
    }
  }
  return price;
}
