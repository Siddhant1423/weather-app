import { getWeatherData } from './fetchData.js';
import { changeUnit } from './changeUnit.js';

const iconContext = require.context('./assets/', true, /\.svg$/);

export class WeatherUI {
    constructor() {
        this.API_KEY = 'ZX25UABPY9QB3229CTV2FHM75';
        this.form = document.querySelector("#search-form");
        this.input = document.querySelector("#location-query");
        this.content = document.querySelector(".content");
        this.unitManager = new changeUnit();
        this.currentLocation = '';
    }

    init() {
        this.createToggleButton();
        this.setupEventListeners();
    }

    createToggleButton() {
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.id = 'unit-toggle';
        this.toggleBtn.textContent = 'METRIC';
        const headerDiv = document.querySelector('header');

        headerDiv.appendChild(this.toggleBtn);
    }

    setupEventListeners() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.fetchAndDisplayWeather();
        });

        this.toggleBtn.addEventListener('click', async () => {
            this.unitManager.toggle();
            this.updateToggleButton();
            if (this.currentLocation) {
                await this.fetchAndDisplayWeather();
            }
        });
    }

    async fetchAndDisplayWeather() {
        this.currentLocation = this.input.value.trim();
        if (!this.currentLocation) return;

        try {
            this.showLoading();
            const weatherData = await getWeatherData(
                this.currentLocation,
                this.API_KEY,
                this.unitManager.currentUnit()
            );
            this.displayWeather(weatherData);
        } catch (error) {
            this.showError();
        }
    }

    showLoading() {
        this.content.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Loading weather data...</p>
            </div>`;
    }

    displayWeather(data) {
        this.clearContent();
        
        // Create main card container
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        
        // Create heading container
        const headingContainer = document.createElement('div');
        headingContainer.className = 'heading-container';
        
        const heading = document.createElement('h2');
        heading.textContent = data.resolvedAddress;
        
        const description = document.createElement('p');
        description.textContent = data.description;
        
        headingContainer.append(heading, description);

        const iconContainer = document.createElement('div');
        iconContainer.className = 'icon-container';

        try {
        const iconPath = `./${data.currentConditions.icon}.svg`;
        const iconUrl = iconContext(iconPath); // Let Webpack resolve the path
        
        const icons = document.createElement('img');
        icons.src = iconUrl;
        icons.alt = data.currentConditions.conditions;
        
        icons.onerror = () => {
            throw new Error(`Failed to load ${iconPath}`);
        };
        
        iconContainer.appendChild(icons);
        } catch (error) {
        console.error('Icon error:', error.message);
        }
        
        // Create info container
        const infoContainer = document.createElement('div');
        infoContainer.className = 'info-container';
        
        // Create weather info elements
        const temp = this.createInfoElement('Temperature', `${data.currentConditions.temp}${this.unitManager.tempSymbol()}`);
        const feelsLike = this.createInfoElement('Feels Like', `${data.currentConditions.feelslike}${this.unitManager.tempSymbol()}`);
        const conditions = this.createInfoElement('Conditions', data.currentConditions.conditions);
        const humidity = this.createInfoElement('Humidity', `${data.currentConditions.humidity}%`);
        const windSpeed = this.createInfoElement('Wind Speed', `${data.currentConditions.windspeed}${this.unitManager.speedSymbol()}`);
        const visibility = this.createInfoElement('Visibility', `${data.currentConditions.visibility}${this.unitManager.distanceSymbol()}`);
        
        infoContainer.append(temp, feelsLike, conditions, humidity, windSpeed, visibility);
        
        // Assemble the card
        cardContainer.append(headingContainer, iconContainer, infoContainer);
        this.content.appendChild(cardContainer);
    }

    createInfoElement(label, value) {
        const element = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = `${label}: `;
        element.append(strong, value);
        return element;
    }

    showError() {
        this.content.innerHTML = `
            <div class="error">
                <p>Could not fetch weather for "${this.currentLocation}"</p>
                <p>Please try another location</p>
            </div>`;
    }

    clearContent() {
        while (this.content.firstChild) {
            this.content.removeChild(this.content.firstChild);
        }
    }

    updateToggleButton() {
        this.toggleBtn.textContent = this.unitManager.isMetric 
            ? 'IMPERIAL' 
            : 'METRIC';
    }
}