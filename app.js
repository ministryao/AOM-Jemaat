const API_URL =
    "https://script.google.com/macros/s/AKfycbzsixPi5-Oh4_e2jJ3DtX2-B3oIfN4s59Ta1wagCG9-aP3izCF9x8g-8XCW8hz10Sc-Tg/exec";
let jemaat = null;
// ===============================
// LOGIN
// ===============================
async function login() {
    const nomorInput =
        document.getElementById("nomorJemaat");
    const pinInput =
        document.getElementById("pin");
    const error =
        document.getElementById("loginError");
    const nomorJemaat =
        nomorInput.value
            .trim()
            .toUpperCase();
    const pin =
        pinInput.value.trim();
    error.textContent = "";
    if (!nomorJemaat) {
        error.textContent =
            "Masukkan Nomor Jemaat.";
        return;
    }
    if (!pin) {
        error.textContent =
            "Masukkan PIN.";
        return;
    }
    try {
        const url =
            API_URL +
            "?action=login" +
            "&nomorJemaat=" +
            encodeURIComponent(nomorJemaat) +
            "&pin=" +
            encodeURIComponent(pin);
        const response =
            await fetch(url);
        if (!response.ok) {
            throw new Error(
                "Gagal terhubung ke server."
            );
        }
        const data =
            await response.json();
        if (
            !data ||
            data.length === 0
        ) {
            error.textContent =
                "Nomor Jemaat atau PIN salah.";
            return;
        }
        jemaat = data[0];
        localStorage.setItem(
            "aomJemaat",
            JSON.stringify(jemaat)
        );
        tampilkanHome();
    } catch (e) {
        console.error(e);
        error.textContent =
            "Tidak dapat terhubung ke server.";
    }
}
// ===============================
// HOME
// ===============================
function tampilkanHome() {
    document
        .getElementById("loginPage")
        .classList.add("hidden");
    document
        .getElementById("contentPage")
        .classList.add("hidden");
    document
        .getElementById("homePage")
        .classList.remove("hidden");
    if (!jemaat) {
        return;
    }
    document
        .getElementById("namaJemaat")
        .textContent =
            jemaat.nama || "";
    document
        .getElementById("nomorJemaatHome")
        .textContent =
            jemaat.nomorJemaat || "";
    ambilJumlahPengumuman();
}
// ===============================
// PROFIL
// ===============================
function bukaProfil() {
    const dataJemaat =
        jemaat ||
        JSON.parse(
            localStorage.getItem("aomJemaat") || "null"
        );
    if (!dataJemaat) {
        alert("Data jemaat belum tersedia.");
        return;
    }
    jemaat = dataJemaat;
    document.getElementById("contentTitle").textContent =
        "Profil Saya";
    let html = "";
    html += detail("Nomor Jemaat", dataJemaat.nomorJemaat);
    html += detail("Nama", dataJemaat.nama);
    html += detail("NIK", dataJemaat.nik);
    html += detail("Nomor KK", dataJemaat.nomorKK);
    html += detail("Jenis Kelamin", dataJemaat.jenisKelamin);
    html += detail("Tempat Lahir", dataJemaat.tempatLahir);
    html += detail("Tanggal Lahir", dataJemaat.tanggalLahir);
    html += detail("Nomor HP", dataJemaat.nomorHP);
    html += detail("Alamat", dataJemaat.alamat);
    html += detail("Status Pernikahan", dataJemaat.statusPernikahan);
    html += detail("Status Jemaat", dataJemaat.statusJemaat);
    html += detail("Baptis", dataJemaat.baptis);
    html += detail("Kepala Keluarga", dataJemaat.kepalaKeluarga);
    html += detail("Sektor", dataJemaat.sektor);
    html += detail("Pelayanan", dataJemaat.pelayanan);
    tampilkanKonten(html);
}
// ===============================
// KELUARGA
// ===============================
function bukaKeluarga() {
    const dataJemaat =
        jemaat ||
        JSON.parse(
            localStorage.getItem("aomJemaat") || "null"
        );
    if (!dataJemaat) {
        alert("Data jemaat belum tersedia.");
        return;
    }
    jemaat = dataJemaat;
    document.getElementById("contentTitle").textContent =
        "Keluarga";
    let html = "";
    html += `
        <div class="detail-card">
            <div class="detail-label">
                Nomor KK
            </div>
            <div class="detail-value">
                ${aman(dataJemaat.nomorKK)}
            </div>
        </div>
        <div class="detail-card">
            <div class="detail-label">
                Kepala Keluarga
            </div>
            <div class="detail-value">
                ${aman(dataJemaat.kepalaKeluarga)}
            </div>
        </div>
        <div class="detail-card">
            <div class="detail-label">
                Alamat
            </div>
            <div class="detail-value">
                ${aman(dataJemaat.alamat)}
            </div>
        </div>
    `;
    tampilkanKonten(html);
}
// ===============================
// PENGUMUMAN
// ===============================
async function bukaPengumuman() {
    document
        .getElementById("contentTitle")
        .textContent =
            "Pengumuman";
    tampilkanKonten(
        "<p>Memuat pengumuman...</p>"
    );
    try {
        const response =
            await fetch(
                API_URL +
                "?action=pengumuman"
            );
        const data =
            await response.json();
        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {
            tampilkanKonten(
                "<p>Belum ada pengumuman.</p>"
            );
            return;
        }
        let html = "";
        data.reverse().forEach(item => {
            html += `
                <div class="announcement">
                    <h3>
                        ${aman(item.judul)}
                    </h3>
                    ${
                        item.tanggal
                        ? `
                            <div class="announcement-date">
                                ${aman(item.tanggal)}
                            </div>
                          `
                        : ""
                    }
                    <div>
                        ${aman(item.isi)}
                    </div>
                </div>
            `;
        });
        tampilkanKonten(html);
    } catch (e) {
        console.error(e);
        tampilkanKonten(
            "<p>Gagal memuat pengumuman.</p>"
        );
    }
}
// ===============================
// JUMLAH PENGUMUMAN
// ===============================
async function ambilJumlahPengumuman() {
    try {
        const response =
            await fetch(
                API_URL +
                "?action=pengumuman"
            );
        const data =
            await response.json();
        const badge =
            document.getElementById(
                "badgePengumuman"
            );
        if (
            Array.isArray(data) &&
            data.length > 0
        ) {
            badge.textContent =
                data.length;
            badge.classList.remove(
                "hidden"
            );
        } else {
            badge.classList.add(
                "hidden"
            );
        }
    } catch (e) {
        console.error(e);
    }
}
// ===============================
// JADWAL IBADAH
// ===============================
async function bukaJadwal() {
    document
        .getElementById("contentTitle")
        .textContent =
            "Jadwal Ibadah";
    tampilkanKonten(
        "<p>Memuat jadwal...</p>"
    );
    try {
        const response =
            await fetch(
                API_URL +
                "?action=jadwal"
            );
        const data =
            await response.json();
        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {
            tampilkanKonten(
                "<p>Belum ada jadwal ibadah.</p>"
            );
            return;
        }
        let html = "";
        data.forEach(item => {
            html += `
                <div class="detail-card">
                    <h3>
                        ${aman(item.namaIbadah)}
                    </h3>
                    <div class="detail-label">
                        Hari
                    </div>
                    <div class="detail-value">
                        ${aman(item.hari)}
                    </div>
                    <br>
                    <div class="detail-label">
                        Jam
                    </div>
                    <div class="detail-value">
                        ${aman(item.jam)}
                    </div>
                </div>
            `;
        });
        tampilkanKonten(html);
    } catch (e) {
        console.error(e);
        tampilkanKonten(
            "<p>Gagal memuat jadwal.</p>"
        );
    }
}
// ===============================
// PENGATURAN
// ===============================
function bukaPengaturan() {
    document
        .getElementById("contentTitle")
        .textContent =
            "Pengaturan";
    let html = `
        <div
            class="detail-card"
            onclick="bukaInformasiAkun()"
        >
            <h3>
                👤 Informasi Akun
            </h3>
            <p>
                Lihat informasi akun jemaat
            </p>
        </div>
        <div
            class="detail-card"
            onclick="bukaUbahPIN()"
        >
            <h3>
                🔐 Ubah PIN
            </h3>
            <p>
                Ganti PIN akun jemaat
            </p>
        </div>
        <div class="detail-card">
            <h3>
                ℹ️ Versi Aplikasi
            </h3>
            <p>
                1.0
            </p>
        </div>
    `;
    tampilkanKonten(html);
}
// ===============================
// INFORMASI AKUN
// ===============================
function bukaInformasiAkun() {
    document
        .getElementById("contentTitle")
        .textContent =
            "Informasi Akun";
    let html = "";
    html += detail(
        "Nomor Jemaat",
        jemaat.nomorJemaat
    );
    html += detail(
        "Nama",
        jemaat.nama
    );
    tampilkanKonten(html);
}
// ===============================
// UBAH PIN
// ===============================
function bukaUbahPIN() {
    document
        .getElementById("contentTitle")
        .textContent =
            "Ubah PIN";
    const html = `
        <div class="detail-card">
            <div class="form-group">
                <label>
                    PIN Lama
                </label>
                <input
                    id="pinLama"
                    type="password"
                    inputmode="numeric"
                    placeholder="PIN lama"
                >
            </div>
            <div class="form-group">
                <label>
                    PIN Baru
                </label>
                <input
                    id="pinBaru"
                    type="password"
                    inputmode="numeric"
                    placeholder="PIN baru"
                >
            </div>
            <div class="form-group">
                <label>
                    Konfirmasi PIN Baru
                </label>
                <input
                    id="konfirmasiPIN"
                    type="password"
                    inputmode="numeric"
                    placeholder="Ulangi PIN baru"
                >
            </div>
            <button
                class="primary-button"
                onclick="ubahPIN()"
            >
                Simpan PIN
            </button>
            <p id="pinMessage"></p>
        </div>
    `;
    tampilkanKonten(html);
}
async function ubahPIN() {
    const pinLama =
        document.getElementById(
            "pinLama"
        ).value.trim();
    const pinBaru =
        document.getElementById(
            "pinBaru"
        ).value.trim();
    const konfirmasi =
        document.getElementById(
            "konfirmasiPIN"
        ).value.trim();
    const message =
        document.getElementById(
            "pinMessage"
        );
    message.textContent = "";
    if (!pinLama) {
        message.textContent =
            "Masukkan PIN lama.";
        return;
    }
    if (!pinBaru) {
        message.textContent =
            "Masukkan PIN baru.";
        return;
    }
    if (pinBaru.length < 4) {
        message.textContent =
            "PIN baru minimal 4 digit.";
        return;
    }
    if (!/^[0-9]+$/.test(pinBaru)) {
        message.textContent =
            "PIN hanya boleh angka.";
        return;
    }
    if (pinBaru !== konfirmasi) {
        message.textContent =
            "Konfirmasi PIN tidak sama.";
        return;
    }
    try {
        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        action: "ubahPin",
                        nomorJemaat:
                            jemaat.nomorJemaat,
                        pinLama:
                            pinLama,
                        pinBaru:
                            pinBaru
                    })
                }
            );
        const hasil =
            (await response.text())
            .trim();
        if (
            hasil ===
            "PIN_UPDATED"
        ) {
            message.textContent =
                "PIN berhasil diubah.";
            document
                .getElementById(
                    "pinLama"
                ).value = "";
            document
                .getElementById(
                    "pinBaru"
                ).value = "";
            document
                .getElementById(
                    "konfirmasiPIN"
                ).value = "";
        } else if (
            hasil ===
            "PIN_LAMA_SALAH"
        ) {
            message.textContent =
                "PIN lama salah.";
        } else {
            message.textContent =
                "Gagal mengubah PIN.";
        }
    } catch (e) {
        console.error(e);
        message.textContent =
            "Gagal terhubung ke server.";
    }
}
// ===============================
// NAVIGASI
// ===============================
function tampilkanKonten(html) {
    document
        .getElementById("homePage")
        .classList.add("hidden");
    document
        .getElementById("loginPage")
        .classList.add("hidden");
    document
        .getElementById("contentPage")
        .classList.remove("hidden");
    document
        .getElementById("contentBody")
        .innerHTML = html;
}
function kembaliHome() {
    document
        .getElementById("contentPage")
        .classList.add("hidden");
    document
        .getElementById("homePage")
        .classList.remove("hidden");
    ambilJumlahPengumuman();
}
// ===============================
// LOGOUT
// ===============================
function logout() {
    jemaat = null;
    localStorage.removeItem(
        "aomJemaat"
    );
    document
        .getElementById("homePage")
        .classList.add("hidden");
    document
        .getElementById("contentPage")
        .classList.add("hidden");
    document
        .getElementById("loginPage")
        .classList.remove("hidden");
    document
        .getElementById("nomorJemaat")
        .value = "";
    document
        .getElementById("pin")
        .value = "";
    document
        .getElementById("loginError")
        .textContent = "";
}
// ===============================
// HELPER
// ===============================
function detail(label, value) {
    return `
        <div class="detail-card">
            <div class="detail-label">
                ${aman(label)}
            </div>
            <div class="detail-value">
                ${aman(value)}
            </div>
        </div>
    `;
}
function aman(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
// ===============================
// AUTO LOGIN
// ===============================
window.addEventListener(
    "DOMContentLoaded",
    () => {
        const tersimpan =
            localStorage.getItem(
                "aomJemaat"
            );
        if (tersimpan) {
            try {
                jemaat =
                    JSON.parse(
                        tersimpan
                    );
                tampilkanHome();
            } catch (e) {
                localStorage.removeItem(
                    "aomJemaat"
                );
            }
        }
    }
);
// ===============================
// SERVICE WORKER
// ===============================
if (
    "serviceWorker" in navigator
) {
    window.addEventListener(
        "load",
        () => {
            navigator.serviceWorker
                .register("sw.js")
                .catch(error => {
                    console.error(
                        "Service Worker:",
                        error
                    );
                });
        }
    );
}
