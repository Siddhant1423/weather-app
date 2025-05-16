export class changeUnit {
    constructor() {
        this.isMetric = false;
    }

    toggle() {
        this.isMetric = !this.isMetric;
        return this.currentUnit();
    }

    currentUnit() {
        return this.isMetric ? 'metric' : 'us';
    }

    tempSymbol() {
        return this.isMetric ? '°C' : '°F';
    }

    speedSymbol() {
        return this.isMetric ? ' km/h' : ' mph';
    }

    distanceSymbol() {
        return this.isMetric ? ' km' : ' mi';
    }
}