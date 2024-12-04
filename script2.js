
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

  let totalPrice = 0;
  let currentDate = new Date(startDateTime);

  while (currentDate < endDateTime) {
    const nextMidnight = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1,
      0,
      0,
      0
    );
    const segmentEndTime = nextMidnight > endDateTime ? endDateTime : nextMidnight;
    const segmentHours = Math.ceil((segmentEndTime - currentDate) / (1000 * 60 * 60));

    const currentDay = currentDate.toLocaleString("en-US", { weekday: "long" }).toUpperCase();

    if (["SATURDAY", "SUNDAY"].includes(currentDay)) {
      totalPrice += 3; // RM3 untuk maksimum sehari
    } else {
      const segmentPrice = calculateWeekdayRate(segmentHours);
      totalPrice += Math.min(segmentPrice, 15); // Maksimum RM15 sehari
    }

    currentDate = nextMidnight;
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

