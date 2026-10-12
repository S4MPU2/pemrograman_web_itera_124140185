/* =========================================================
   Dashboard Cuaca Mahasiswa
   Samuel Purba - 124140185
   Data cuaca: Open-Meteo API (gratis, tanpa API key)
   ========================================================= */

// ---- Konfigurasi & konstanta (const) ----
const CITIES_KEY = "weatherDashboard_cities_v1";
const CACHE_KEY = "weatherDashboard_cache_v1";
const THEME_KEY = "weatherDashboard_theme_v1";
const AUTO_REFRESH_MS = 10 * 60 * 1000; // 10 menit

// Peta kode cuaca WMO -> label & ikon (dipakai oleh getWeatherInfo)
const WEATHER_CODES = {
  0: { label: "Cerah", icon: "☀️" },
  1: { label: "Cerah Berawan", icon: "🌤️" },
  2: { label: "Berawan Sebagian", icon: "⛅" },
  3: { label: "Mendung", icon: "☁️" },
  45: { label: "Berkabut", icon: "🌫️" },
  48: { label: "Kabut Beku", icon: "🌫️" },
  51: { label: "Gerimis Ringan", icon: "🌦️" },
  53: { label: "Gerimis", icon: "🌦️" },
  55: { label: "Gerimis Lebat", icon: "🌧️" },
  56: { label: "Gerimis Beku", icon: "🌧️" },
  57: { label: "Gerimis Beku Lebat", icon: "🌧️" },
  61: { label: "Hujan Ringan", icon: "🌧️" },
  63: { label: "Hujan", icon: "🌧️" },
  65: { label: "Hujan Lebat", icon: "⛈️" },
  66: { label: "Hujan Beku", icon: "🌧️" },
  67: { label: "Hujan Beku Lebat", icon: "🌧️" },
  71: { label: "Salju Ringan", icon: "🌨️" },
  73: { label: "Salju", icon: "🌨️" },
  75: { label: "Salju Lebat", icon: "❄️" },
  77: { label: "Butiran Salju", icon: "❄️" },
  80: { label: "Hujan Lokal Ringan", icon: "🌦️" },
  81: { label: "Hujan Lokal", icon: "🌧️" },
  82: { label: "Hujan Lokal Lebat", icon: "⛈️" },
  85: { label: "Hujan Salju Ringan", icon: "🌨️" },
  86: { label: "Hujan Salju Lebat", icon: "🌨️" },
  95: { label: "Badai Petir", icon: "⛈️" },
  96: { label: "Badai Petir + Hujan Es", icon: "⛈️" },
  99: { label: "Badai Petir + Hujan Es Lebat", icon: "⛈️" },
};

// Arrow function #1: mengambil info cuaca (label + ikon) dari kode WMO
const getWeatherInfo = (code, isDay) => {
  if (code === 0 && isDay === 0) return { label: "Cerah Malam", icon: "🌙" };
  return WEATHER_CODES[code] || { label: "Tidak diketahui", icon: "❓" };
};

// Arrow function #2: memformat selisih waktu menjadi teks relatif ("5 menit lalu")
const formatRelativeTime = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "baru saja";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
};

// Arrow function #3: escape sederhana supaya input user aman dirender via template literal
const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));

/* =========================================================
   Class: StorageManager
   Mengelola semua baca/tulis ke localStorage
   ========================================================= */
class StorageManager {
  static getCities() {
    const raw = localStorage.getItem(CITIES_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  static saveCities(cities) {
    localStorage.setItem(CITIES_KEY, JSON.stringify(cities));
  }

  static getCache() {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  static saveCache(cache) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  }

  static getTheme() {
    return localStorage.getItem(THEME_KEY) || "light";
  }

  static saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
  }
}

/* =========================================================
   Class: WeatherService
   Mengambil data dari Open-Meteo menggunakan async/await
   ========================================================= */
class WeatherService {
  constructor() {
    this.geocodeUrl = "https://geocoding-api.open-meteo.com/v1/search";
    this.forecastUrl = "https://api.open-meteo.com/v1/forecast";
  }

  async searchCity(query) {
    const url = `${this.geocodeUrl}?name=${encodeURIComponent(query)}&count=5&language=id&format=json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal mencari kota");
    const data = await response.json();
    return data.results || [];
  }

  async getCurrentWeather(latitude, longitude) {
    const fields = "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day";
    const url = `${this.forecastUrl}?latitude=${latitude}&longitude=${longitude}&current=${fields}&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal mengambil data cuaca");
    const data = await response.json();
    return data.current;
  }
}

/* =========================================================
   Class: WeatherDashboard
   Mengatur state aplikasi, render UI, dan event handling
   ========================================================= */
class WeatherDashboard {
  constructor() {
    this.weatherService = new WeatherService();
    let cities = StorageManager.getCities(); // let karena bisa diubah ulang (migrasi data lama)
    this.cities = cities;
    this.cache = StorageManager.getCache();
    this.searchResults = [];
    this.editingId = null;

    this.cacheDOM();
    this.bindEvents();
    this.applyTheme(StorageManager.getTheme());
    this.startClock();
    this.init();
  }

  cacheDOM() {
    this.searchForm = document.getElementById("searchForm");
    this.searchInput = document.getElementById("searchInput");
    this.searchResultsEl = document.getElementById("searchResults");
    this.refreshAllBtn = document.getElementById("refreshAll");
    this.cityListEl = document.getElementById("cityList");
    this.themeToggleBtn = document.getElementById("themeToggle");
    this.clockEl = document.getElementById("clock");
    this.toastEl = document.getElementById("toast");
  }

  bindEvents() {
    this.searchForm.addEventListener("submit", this.handleSearchSubmit);
    this.searchResultsEl.addEventListener("click", this.handleSearchResultClick);
    this.cityListEl.addEventListener("click", this.handleCityListClick);
    this.refreshAllBtn.addEventListener("click", this.handleRefreshAll);
    this.themeToggleBtn.addEventListener("click", this.handleThemeToggle);
    document.addEventListener("click", this.handleOutsideClick);
  }

  async init() {
    this.render();
    if (this.cities.length) {
      await Promise.all(this.cities.map((city) => this.refreshCity(city)));
    }
    setInterval(this.handleRefreshAll, AUTO_REFRESH_MS);
  }

  // ---- Event handlers (arrow function class fields agar `this` tetap terikat) ----

  handleSearchSubmit = async (event) => {
    event.preventDefault();
    const query = this.searchInput.value.trim();
    if (!query) return;

    try {
      this.searchResults = await this.weatherService.searchCity(query);
      if (!this.searchResults.length) {
        this.showToast(`Kota "${query}" tidak ditemukan`);
      }
      this.renderSearchResults();
    } catch (error) {
      console.error(error);
      this.showToast("Gagal mencari kota. Periksa koneksi internet.");
    }
  };

  handleSearchResultClick = (event) => {
    const button = event.target.closest("button[data-index]");
    if (!button) return;
    const result = this.searchResults[Number(button.dataset.index)];
    if (result) this.addCity(result);
  };

  handleOutsideClick = (event) => {
    const isInsideSearch = this.searchForm.contains(event.target) || this.searchResultsEl.contains(event.target);
    if (!isInsideSearch) this.clearSearch();
  };

  handleCityListClick = (event) => {
    const target = event.target;
    const deleteBtn = target.closest('[data-action="delete"]');
    const refreshBtn = target.closest('[data-action="refresh"]');
    const favoriteBtn = target.closest('[data-action="favorite"]');
    const editBtn = target.closest('[data-action="edit"]');
    const saveEditBtn = target.closest('[data-action="save-edit"]');
    const cancelEditBtn = target.closest('[data-action="cancel-edit"]');

    if (deleteBtn) this.deleteCity(deleteBtn.dataset.id);
    if (refreshBtn) this.refreshCityById(refreshBtn.dataset.id);
    if (favoriteBtn) this.toggleFavorite(favoriteBtn.dataset.id);
    if (editBtn) this.startEditCity(editBtn.dataset.id);
    if (cancelEditBtn) this.cancelEditCity();
    if (saveEditBtn) {
      const input = document.getElementById(`editInput-${saveEditBtn.dataset.id}`);
      this.saveEditCity(saveEditBtn.dataset.id, input ? input.value : "");
    }
  };

  handleRefreshAll = async () => {
    if (!this.cities.length) return;
    await Promise.all(this.cities.map((city) => this.refreshCity(city)));
    this.showToast("Semua data cuaca diperbarui");
  };

  handleThemeToggle = () => {
    const current = document.body.dataset.theme === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    this.applyTheme(next);
    StorageManager.saveTheme(next);
  };

  // ---- CRUD kota (Create, Read, Update, Delete) ----

  addCity = async (result) => {
    const alreadyExists = this.cities.some((city) => city.id === result.id);
    if (alreadyExists) {
      this.showToast("Kota sudah ada di dashboard");
      return;
    }

    const newCity = {
      id: result.id,
      name: result.name,
      country: result.country || "",
      admin1: result.admin1 || "",
      latitude: result.latitude,
      longitude: result.longitude,
      isFavorite: false,
      customName: "",
    };

    this.cities = [...this.cities, newCity];
    StorageManager.saveCities(this.cities);
    this.clearSearch();
    this.render();
    await this.refreshCity(newCity);
    this.showToast(`${newCity.name} ditambahkan ke dashboard`);
  };

  deleteCity = (id) => {
    const city = this.cities.find((item) => String(item.id) === String(id));
    this.cities = this.cities.filter((item) => String(item.id) !== String(id));
    delete this.cache[id];
    StorageManager.saveCities(this.cities);
    StorageManager.saveCache(this.cache);
    this.render();
    if (city) this.showToast(`${city.name} dihapus dari dashboard`);
  };

  toggleFavorite = (id) => {
    this.cities = this.cities.map((city) =>
      String(city.id) === String(id) ? { ...city, isFavorite: !city.isFavorite } : city
    );
    StorageManager.saveCities(this.cities);
    this.render();
  };

  startEditCity = (id) => {
    this.editingId = id;
    this.render();
  };

  cancelEditCity = () => {
    this.editingId = null;
    this.render();
  };

  saveEditCity = (id, newLabel) => {
    const trimmed = newLabel.trim();
    this.cities = this.cities.map((city) =>
      String(city.id) === String(id) ? { ...city, customName: trimmed } : city
    );
    StorageManager.saveCities(this.cities);
    this.editingId = null;
    this.render();
  };

  refreshCityById = async (id) => {
    const city = this.cities.find((item) => String(item.id) === String(id));
    if (city) await this.refreshCity(city);
  };

  refreshCity = async (city) => {
    try {
      const current = await this.weatherService.getCurrentWeather(city.latitude, city.longitude);
      this.cache[city.id] = { ...current, fetchedAt: Date.now() };
      StorageManager.saveCache(this.cache);
    } catch (error) {
      console.error(error);
      this.showToast(`Gagal memperbarui cuaca ${city.name}`);
    } finally {
      this.render();
    }
  };

  // ---- Rendering (template literals) ----

  render() {
    this.renderCityList();
  }

  renderCityList() {
    if (!this.cities.length) {
      this.cityListEl.innerHTML = `
        <p class="empty-state">Belum ada kota tersimpan. Cari dan tambahkan kota favoritmu di atas ☝️</p>
      `;
      return;
    }

    const sortedCities = [...this.cities].sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
    this.cityListEl.innerHTML = sortedCities.map((city) => this.renderCityCard(city)).join("");
  }

  renderCityCard(city) {
    const data = this.cache[city.id];
    const displayName = city.customName || city.name;
    const locationLine = [city.admin1, city.country].filter(Boolean).join(", ");
    const isEditing = this.editingId === city.id;

    const headerHtml = isEditing
      ? `
        <div class="edit-row">
          <input type="text" id="editInput-${city.id}" class="edit-input" value="${escapeHtml(displayName)}" />
          <button type="button" data-action="save-edit" data-id="${city.id}" title="Simpan">✅</button>
          <button type="button" data-action="cancel-edit" data-id="${city.id}" title="Batal">✖️</button>
        </div>
      `
      : `
        <h3>${escapeHtml(displayName)}</h3>
        <span class="country">${escapeHtml(locationLine)}</span>
      `;

    const bodyHtml = data
      ? (() => {
          const info = getWeatherInfo(data.weather_code, data.is_day);
          return `
            <div class="weather-main">
              <span class="icon">${info.icon}</span>
              <span class="temp">${Math.round(data.temperature_2m)}°C</span>
            </div>
            <p class="condition">${info.label}</p>
            <ul class="details">
              <li>🤔 Terasa seperti: ${Math.round(data.apparent_temperature)}°C</li>
              <li>💧 Kelembapan: ${data.relative_humidity_2m}%</li>
              <li>💨 Angin: ${data.wind_speed_10m} km/jam</li>
            </ul>
          `;
        })()
      : `<p class="loading">⏳ Mengambil data cuaca...</p>`;

    const updatedLabel = data ? `Diperbarui ${formatRelativeTime(data.fetchedAt)}` : "Memuat...";

    return `
      <article class="city-card ${city.isFavorite ? "favorite" : ""}" data-id="${city.id}">
        <header>${headerHtml}</header>
        ${bodyHtml}
        <footer>
          <span class="updated">${updatedLabel}</span>
          <div class="actions">
            <button type="button" data-action="favorite" data-id="${city.id}" title="Tandai favorit">${city.isFavorite ? "⭐" : "☆"}</button>
            <button type="button" data-action="edit" data-id="${city.id}" title="Ubah nama">✏️</button>
            <button type="button" data-action="refresh" data-id="${city.id}" title="Perbarui">🔄</button>
            <button type="button" data-action="delete" data-id="${city.id}" title="Hapus">🗑️</button>
          </div>
        </footer>
      </article>
    `;
  }

  renderSearchResults() {
    if (!this.searchResults.length) {
      this.searchResultsEl.innerHTML = "";
      this.searchResultsEl.classList.remove("show");
      return;
    }

    this.searchResultsEl.innerHTML = this.searchResults
      .map((result, index) => {
        const locationLine = [result.admin1, result.country].filter(Boolean).join(", ");
        return `
          <button type="button" class="search-result-item" data-index="${index}">
            📍 ${escapeHtml(result.name)}${locationLine ? ", " + escapeHtml(locationLine) : ""}
          </button>
        `;
      })
      .join("");
    this.searchResultsEl.classList.add("show");
  }

  clearSearch() {
    this.searchInput.value = "";
    this.searchResults = [];
    this.renderSearchResults();
  }

  // ---- UI helpers ----

  applyTheme(theme) {
    document.body.dataset.theme = theme;
    this.themeToggleBtn.textContent = theme === "dark" ? "☀️ Mode Terang" : "🌙 Mode Gelap";
  }

  startClock() {
    const update = () => {
      const now = new Date();
      this.clockEl.textContent = now.toLocaleString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    };
    update();
    setInterval(update, 1000);
  }

  showToast(message) {
    this.toastEl.textContent = message;
    this.toastEl.classList.add("show");
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => this.toastEl.classList.remove("show"), 3000);
  }
}

// ---- Inisialisasi aplikasi ----
document.addEventListener("DOMContentLoaded", () => {
  const dashboard = new WeatherDashboard();
  window.__weatherDashboard = dashboard; // berguna untuk debugging di console
});
