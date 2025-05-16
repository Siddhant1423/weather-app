import "./styles.css";
import { WeatherUI } from "./weatherUI";

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const weatherApp = new WeatherUI();
    weatherApp.init();
});