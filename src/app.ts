interface WeightEntry {
  date: string; 
  time: string; 
  weight: string;
  bmi: string;
  fat: string;
}

function toDdMmYyyy(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function toHhMmSs(time: string): string {
  const parts = time.split(":");
  const [h, m, s] = [parts[0] ?? "00", parts[1] ?? "00", parts[2] ?? "00"];
  return `${h}:${m}:${s}`;
}

function buildCsv(entry: WeightEntry): string {
  const rows = [
    "Body",
    "Date,Time,Weight,BMI,Fat",
    [
      toDdMmYyyy(entry.date),
      toHhMmSs(entry.time),
      entry.weight,
      entry.bmi,
      entry.fat,
    ].join(","),
  ];
  return rows.join("\r\n") + "\r\n";
}

function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
}

function init(): void {
  const form = getElement<HTMLFormElement>("weight-form");
  const dateInput = getElement<HTMLInputElement>("date");
  const timeInput = getElement<HTMLInputElement>("time");

  const now = new Date();
  dateInput.value = now.toLocaleDateString("en-CA");
  timeInput.value = now.toTimeString().slice(0, 5);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const entry: WeightEntry = {
      date: dateInput.value,
      time: timeInput.value,
      weight: getElement<HTMLInputElement>("weight").value,
      bmi: getElement<HTMLInputElement>("bmi").value,
      fat: getElement<HTMLInputElement>("fat").value,
    };

    const csv = buildCsv(entry);
    downloadCsv(csv, "weight.csv");
  });
}

init();
