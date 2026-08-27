"use strict";
function toDdMmYyyy(isoDate) {
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
}
function toHhMmSs(time) {
    const parts = time.split(":");
    const [h, m, s] = [parts[0] ?? "00", parts[1] ?? "00", parts[2] ?? "00"];
    return `${h}:${m}:${s}`;
}
function buildCsv(entry) {
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
function downloadCsv(content, filename) {
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
function getElement(id) {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`Missing element #${id}`);
    return el;
}
function init() {
    const form = getElement("weight-form");
    const dateInput = getElement("date");
    const timeInput = getElement("time");
    const now = new Date();
    dateInput.value = now.toLocaleDateString("en-CA"); // YYYY-MM-DD
    timeInput.value = now.toTimeString().slice(0, 5); // HH:MM
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const entry = {
            date: dateInput.value,
            time: timeInput.value,
            weight: getElement("weight").value,
            bmi: getElement("bmi").value,
            fat: getElement("fat").value,
        };
        const csv = buildCsv(entry);
        downloadCsv(csv, "weight.csv");
    });
}
init();
